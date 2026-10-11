/**
 * Persistent storage for the vehicle feature (vehicle rows + uploaded photos).
 *
 *  - Supabase (Postgres table + public Storage bucket) when SUPABASE_URL and
 *    SUPABASE_SERVICE_KEY are set. This is the persistent option: data and photos
 *    survive refreshes, restarts and redeploys on any host.
 *  - Local disk (./data) otherwise. Intended for local development only. On hosts
 *    with an ephemeral filesystem (Cloud Run, Render free tier, Vercel, ...) it would
 *    lose data, so in production it is refused unless ALLOW_LOCAL_STORAGE=true.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import type { Vehicle } from '../src/types';

export interface VehicleStore {
  kind: 'supabase' | 'local';
  /** false => writes must be refused (ephemeral disk in production) */
  writable: boolean;
  notWritableReason?: string;
  list(): Promise<Vehicle[]>;
  get(id: string): Promise<Vehicle | null>;
  insert(v: Vehicle): Promise<void>;
  update(v: Vehicle): Promise<void>;
  remove(id: string): Promise<void>;
  putImage(fileName: string, data: Buffer, mime: string): Promise<string>;
  /** Deletes the file behind `url` if (and only if) it is one of our uploads. */
  removeImage(url: string): Promise<void>;
}

/* ------------------------------------------------------------------ Supabase */

function supabaseStore(url: string, key: string): VehicleStore {
  const base = url.replace(/\/+$/, '');
  const bucket = process.env.SUPABASE_BUCKET || 'vehicle-photos';
  const table = process.env.SUPABASE_TABLE || 'vehicles';
  const publicPrefix = `${base}/storage/v1/object/public/${bucket}/`;

  // Legacy JWT keys are also sent as Bearer; new-style sb_secret_ keys go in `apikey` only.
  const auth: Record<string, string> = { apikey: key };
  if (key.startsWith('eyJ')) auth.Authorization = `Bearer ${key}`;

  async function call(pathAndQuery: string, init: RequestInit & { headers?: Record<string, string> } = {}) {
    const res = await fetch(`${base}${pathAndQuery}`, {
      ...init,
      headers: { ...auth, ...(init.headers || {}) },
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Supabase ${init.method || 'GET'} ${pathAndQuery} -> ${res.status} ${text.slice(0, 300)}`);
    }
    return res;
  }

  const rowToVehicle = (r: { id: string; data: Vehicle }): Vehicle => ({ ...r.data, id: r.id });

  return {
    kind: 'supabase',
    writable: true,
    async list() {
      const res = await call(`/rest/v1/${table}?select=id,data&order=sort_order.desc`);
      return ((await res.json()) as any[]).map(rowToVehicle);
    },
    async get(id) {
      const res = await call(`/rest/v1/${table}?select=id,data&id=eq.${encodeURIComponent(id)}`);
      const rows = (await res.json()) as any[];
      return rows[0] ? rowToVehicle(rows[0]) : null;
    },
    async insert(v) {
      await call(`/rest/v1/${table}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({ id: v.id, data: v, sort_order: Date.now() }),
      });
    },
    async update(v) {
      await call(`/rest/v1/${table}?id=eq.${encodeURIComponent(v.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({ data: v }),
      });
    },
    async remove(id) {
      await call(`/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { Prefer: 'return=minimal' },
      });
    },
    async putImage(fileName, data, mime) {
      await call(`/storage/v1/object/${bucket}/${fileName}`, {
        method: 'POST',
        headers: { 'Content-Type': mime, 'x-upsert': 'true', 'cache-control': 'max-age=31536000' },
        body: data,
      });
      return `${publicPrefix}${fileName}`;
    },
    async removeImage(imageUrl) {
      if (!imageUrl.startsWith(publicPrefix)) return;
      await call(`/storage/v1/object/${bucket}/${imageUrl.slice(publicPrefix.length)}`, { method: 'DELETE' });
    },
  };
}

/* --------------------------------------------------------------- Local disk */

function localStore(): VehicleStore {
  const root = path.resolve(process.env.DATA_DIR || path.join(process.cwd(), 'data'));
  const dbFile = path.join(root, 'vehicles.json');
  const uploadDir = path.join(root, 'uploads', 'vehicles');
  const prod = process.env.NODE_ENV === 'production';
  const allowed = process.env.ALLOW_LOCAL_STORAGE === 'true';

  // Serialise read-modify-write cycles so concurrent requests cannot clobber each other.
  let queue: Promise<unknown> = Promise.resolve();
  const locked = <T>(fn: () => Promise<T>): Promise<T> => {
    const run = queue.then(fn, fn);
    queue = run.catch(() => undefined);
    return run;
  };

  const read = async (): Promise<Vehicle[]> => {
    try {
      return JSON.parse(await fs.readFile(dbFile, 'utf8'));
    } catch (e: any) {
      if (e.code === 'ENOENT') return [];
      throw e;
    }
  };
  const write = async (list: Vehicle[]) => {
    await fs.mkdir(root, { recursive: true });
    const tmp = `${dbFile}.${process.pid}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(list, null, 2));
    await fs.rename(tmp, dbFile);
  };

  return {
    kind: 'local',
    writable: !prod || allowed,
    notWritableReason:
      'Persistent storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_KEY (see VEHICLES_SETUP.md). ' +
      'Local disk storage is disabled in production because most hosts wipe it on redeploy.',
    list: () => locked(read),
    get: (id) => locked(async () => (await read()).find((v) => v.id === id) || null),
    insert: (v) => locked(async () => write([v, ...(await read())])),
    update: (v) => locked(async () => write((await read()).map((x) => (x.id === v.id ? v : x)))),
    remove: (id) => locked(async () => write((await read()).filter((x) => x.id !== id))),
    async putImage(fileName, data) {
      const target = path.join(uploadDir, path.basename(fileName));
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(target, data);
      return `/uploads/vehicles/${path.basename(fileName)}`;
    },
    async removeImage(imageUrl) {
      if (!imageUrl.startsWith('/uploads/vehicles/')) return;
      await fs.rm(path.join(uploadDir, path.basename(imageUrl)), { force: true });
    },
  };
}

/** Absolute directory that local-mode uploads are served from (null in Supabase mode). */
export function localUploadsRoot(): string {
  return path.resolve(process.env.DATA_DIR || path.join(process.cwd(), 'data'), 'uploads');
}

let cached: VehicleStore | null = null;
export function getStore(): VehicleStore {
  if (cached) return cached;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (url && key) {
    cached = supabaseStore(url, key);
  } else {
    cached = localStore();
    console.warn(
      '[vehicles] SUPABASE_URL / SUPABASE_SERVICE_KEY not set -> using local ./data storage ' +
        (cached.writable ? '(development only, NOT persistent on most hosts).' : '(read-only in production).')
    );
  }
  return cached;
}
