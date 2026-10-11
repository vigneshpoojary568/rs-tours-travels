/**
 * Vehicle API (framework-agnostic connect-style middleware; mounted by server.ts).
 *
 *   GET    /api/vehicles        public list (hidden vehicles only for a signed-in admin)
 *   POST   /api/admin/session   exchange admin credentials for a short-lived API token
 *   POST   /api/vehicles        create   (admin)
 *   PUT    /api/vehicles/:id    update   (admin)
 *   DELETE /api/vehicles/:id    delete   (admin)
 *   GET    /uploads/...         photos when running in local-disk dev mode
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Vehicle } from '../src/types';
import { getStore, localUploadsRoot } from './storage';

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/* ---------------------------------------------------------------- auth */

// Same defaults as the existing client-side login so the admin signs in exactly as before.
// Override in production with ADMIN_PASSWORD / ADMIN_USERNAMES (and keep them in sync if
// you change the password inside the admin panel).
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'RSTravels@2026!';
const ADMIN_USERNAMES = (
  process.env.ADMIN_USERNAMES || 'admin@rstours.com,admin,rstours.admin,vigneshp6567@gmail.com'
)
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);
const SECRET = process.env.ADMIN_SESSION_SECRET || crypto.randomBytes(32).toString('hex');
const TOKEN_TTL_MS = 3 * 60 * 60 * 1000; // same 3h as the client session

const sha = (s: string) => crypto.createHash('sha256').update(s).digest();
const safeEqual = (a: string, b: string) => crypto.timingSafeEqual(sha(a), sha(b));
const sign = (p: string) => crypto.createHmac('sha256', SECRET).update(p).digest('base64url');

function issueToken(username: string): string {
  const p = Buffer.from(JSON.stringify({ u: username, exp: Date.now() + TOKEN_TTL_MS })).toString('base64url');
  return `${p}.${sign(p)}`;
}

function isAdmin(req: IncomingMessage): boolean {
  const m = /^Bearer (.+)$/.exec(String(req.headers.authorization || ''));
  if (!m) return false;
  const [p, sig] = m[1].split('.');
  if (!p || !sig || !safeEqual(sig, sign(p))) return false;
  try {
    return JSON.parse(Buffer.from(p, 'base64url').toString()).exp > Date.now();
  } catch {
    return false;
  }
}

const attempts = new Map<string, { n: number; reset: number }>();
function throttle(ip: string, failed: boolean) {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || rec.reset < now) {
    if (failed) attempts.set(ip, { n: 1, reset: now + 60_000 });
    return;
  }
  if (rec.n >= 10) throw new HttpError(429, 'Too many attempts. Try again in a minute.');
  if (failed) rec.n += 1;
}

/* ---------------------------------------------------------- validation */

const CATEGORIES = ['Sedan', 'SUV', 'MPV', 'Tempo Traveller', 'Luxury Coach'] as const;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const str = (v: unknown, max: number): string | undefined =>
  typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : undefined;

function cleanFields(b: any, id: string): Omit<Vehicle, 'image'> {
  const name = str(b?.name, 120);
  const seatingCapacity = str(b?.seatingCapacity, 60);
  if (!name) throw new HttpError(400, 'Vehicle name is required.');
  if (!seatingCapacity) throw new HttpError(400, 'Seating capacity is required.');

  let seatsCount = Math.round(Number(b?.seatsCount));
  if (!Number.isFinite(seatsCount) || seatsCount < 1) {
    const m = /\d+/.exec(seatingCapacity);
    seatsCount = m ? parseInt(m[0], 10) : 1;
  }
  seatsCount = Math.min(seatsCount, 100);

  const v: Omit<Vehicle, 'image'> = {
    id,
    name,
    seatingCapacity,
    seatsCount,
    category: CATEGORIES.includes(b?.category) ? b.category : 'MPV',
    acType: str(b?.acType, 80) || (b?.isAc === false ? 'Non-AC' : 'Air Conditioned'),
    luggageCapacity: str(b?.luggageCapacity, 80) || '',
    features: Array.isArray(b?.features)
      ? b.features.map((f: unknown) => str(f, 120)).filter(Boolean).slice(0, 30) as string[]
      : [],
    enabled: b?.enabled !== false,
    featured: b?.featured === true,
  };
  const optional: [keyof Vehicle, number][] = [
    ['model', 80], ['registrationNumber', 40], ['description', 1000],
    ['pricePerKm', 60], ['dailyRate', 60], ['fuelType', 40], ['idealFor', 200],
  ];
  for (const [k, max] of optional) {
    const s = str(b?.[k], max);
    if (s) (v as any)[k] = s;
  }
  if (typeof b?.isAc === 'boolean') v.isAc = b.isAc;
  return v;
}

const EXT: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };

function sniffMime(buf: Buffer): string | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png';
  if (buf.subarray(0, 4).toString() === 'RIFF' && buf.subarray(8, 12).toString() === 'WEBP') return 'image/webp';
  if (buf.subarray(0, 4).toString() === 'GIF8') return 'image/gif';
  return null;
}

/** Turns the submitted `image` into a durable URL: uploads data-URLs, passes http(s)/site paths through. */
async function resolveImage(input: unknown, id: string): Promise<string> {
  if (typeof input !== 'string' || !input.trim()) throw new HttpError(400, 'A vehicle photo is required.');
  const img = input.trim();

  const m = /^data:image\/[a-z+.-]+;base64,([A-Za-z0-9+/=\s]+)$/i.exec(img);
  if (m) {
    const buf = Buffer.from(m[1], 'base64');
    if (buf.length > MAX_IMAGE_BYTES) throw new HttpError(413, 'Photo is too large (max 5 MB).');
    const mime = sniffMime(buf);
    if (!mime) throw new HttpError(400, 'Unsupported image type. Use JPG, PNG, WebP or GIF.');
    return getStore().putImage(`vehicles/${id}-${Date.now()}.${EXT[mime]}`, buf, mime);
  }
  if (/^https?:\/\/\S+$/i.test(img) || /^\/(?!\/)[\w./-]+$/.test(img)) {
    if (img.length > 2048) throw new HttpError(400, 'Image URL is too long.');
    return img;
  }
  throw new HttpError(400, 'Invalid photo. Upload an image file or provide an http(s) URL.');
}

/* ------------------------------------------------------------- plumbing */

function readJson(req: IncomingMessage, limit: number): Promise<any> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    let tooBig = false;
    req.on('data', (c: Buffer) => {
      size += c.length;
      if (size > limit) { tooBig = true; chunks.length = 0; } else if (!tooBig) chunks.push(c);
    });
    req.on('end', () => {
      if (tooBig) return reject(new HttpError(413, 'Request is too large.'));
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')); }
      catch { reject(new HttpError(400, 'Invalid JSON body.')); }
    });
    req.on('error', reject);
  });
}

function send(res: ServerResponse, status: number, body: unknown) {
  const data = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(data),
    'Cache-Control': 'no-store',
  });
  res.end(data);
}

const ID_RE = /^[A-Za-z0-9_-]{1,64}$/;
const newId = () => `veh-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;

function requireAdmin(req: IncomingMessage) {
  if (!isAdmin(req)) throw new HttpError(401, 'Admin session expired. Please log out and log in again.');
  if (!getStore().writable) throw new HttpError(503, getStore().notWritableReason || 'Storage is not writable.');
}

const MIME_BY_EXT: Record<string, string> = { '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif' };

/* -------------------------------------------------------------- handler */

export async function vehicleApi(req: IncomingMessage, res: ServerResponse, next: (err?: unknown) => void) {
  const url = new URL(req.url || '/', 'http://localhost');
  const p = url.pathname.replace(/\/+$/, '') || '/';
  const method = req.method || 'GET';

  try {
    // Local-dev photo serving
    if (method === 'GET' && p.startsWith('/uploads/vehicles/') && getStore().kind === 'local') {
      const file = path.join(localUploadsRoot(), 'vehicles', path.basename(p));
      const type = MIME_BY_EXT[path.extname(file).toLowerCase()];
      if (!type || !fs.existsSync(file)) throw new HttpError(404, 'Not found');
      res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'public, max-age=31536000, immutable' });
      return void fs.createReadStream(file).pipe(res);
    }

    if (p === '/api/admin/session' && method === 'POST') {
      const ip = req.socket.remoteAddress || 'unknown';
      throttle(ip, false);
      const b = await readJson(req, 10_000);
      const ok =
        typeof b?.identifier === 'string' && typeof b?.password === 'string' &&
        ADMIN_USERNAMES.includes(b.identifier.trim().toLowerCase()) &&
        safeEqual(b.password, ADMIN_PASSWORD);
      if (!ok) { throttle(ip, true); throw new HttpError(401, 'Invalid credentials.'); }
      return send(res, 200, { token: issueToken(b.identifier.trim().toLowerCase()), expiresInMs: TOKEN_TTL_MS });
    }

    if (p === '/api/vehicles' && method === 'GET') {
      const all = await getStore().list();
      return send(res, 200, { vehicles: isAdmin(req) ? all : all.filter((v) => v.enabled !== false) });
    }

    if (p === '/api/vehicles' && method === 'POST') {
      requireAdmin(req);
      const b = await readJson(req, 8 * 1024 * 1024);
      const id = newId();
      const fields = cleanFields(b, id);
      const image = await resolveImage(b?.image, id);
      const vehicle: Vehicle = { ...fields, image };
      try {
        await getStore().insert(vehicle);
      } catch (e) {
        await getStore().removeImage(image).catch(() => {});
        throw e;
      }
      return send(res, 201, { vehicle });
    }

    const m = /^\/api\/vehicles\/([^/]+)$/.exec(p);
    if (m && (method === 'PUT' || method === 'DELETE')) {
      requireAdmin(req);
      const id = decodeURIComponent(m[1]);
      if (!ID_RE.test(id)) throw new HttpError(400, 'Invalid vehicle id.');
      const existing = await getStore().get(id);
      if (!existing) throw new HttpError(404, 'Vehicle not found.');

      if (method === 'DELETE') {
        await getStore().remove(id);
        await getStore().removeImage(existing.image).catch((e) => console.error('[vehicles] photo cleanup failed', e));
        return send(res, 200, { ok: true });
      }

      const b = await readJson(req, 8 * 1024 * 1024);
      const fields = cleanFields(b, id);
      const image = await resolveImage(b?.image, id);
      const vehicle: Vehicle = { ...fields, image };
      try {
        await getStore().update(vehicle);
      } catch (e) {
        if (image !== existing.image) await getStore().removeImage(image).catch(() => {});
        throw e;
      }
      if (image !== existing.image) {
        await getStore().removeImage(existing.image).catch((e) => console.error('[vehicles] old photo cleanup failed', e));
      }
      return send(res, 200, { vehicle });
    }

    if (p.startsWith('/api/')) throw new HttpError(404, 'Not found');
    return next();
  } catch (err: any) {
    if (err instanceof HttpError) return send(res, err.status, { error: err.message });
    console.error('[vehicles] unexpected error', err);
    return send(res, 502, { error: 'Storage service error. Please try again.' });
  }
}
