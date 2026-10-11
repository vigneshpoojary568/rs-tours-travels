/**
 * Client for the vehicle API (server/vehicles.ts).
 * Vehicles and their photos live on the server (database + cloud storage), so every
 * visitor sees the same fleet and nothing depends on the admin's browser.
 */
import { Vehicle } from '../types';

const TOKEN_KEY = 'rs_admin_api_token_v1';
const CACHE_KEY = 'rs_tours_vehicles_cache_v1'; // display cache only; the server is the source of truth

const getToken = (): string | null => {
  try { return sessionStorage.getItem(TOKEN_KEY); } catch { return null; }
};

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  let res: Response;
  try {
    res = await fetch(path, {
      ...init,
      headers: {
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  } catch {
    throw new Error('Cannot reach the server. Please check your connection and try again.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as any).error || `Request failed (${res.status}).`);
  return data as T;
}

/** Called right after the existing admin login succeeds; enables saving to the server. */
export async function createServerSession(identifier: string, password: string): Promise<boolean> {
  try {
    const { token } = await request<{ token: string }>('/api/admin/session', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
    sessionStorage.setItem(TOKEN_KEY, token);
    return true;
  } catch {
    return false;
  }
}

export function clearServerSession() {
  try { sessionStorage.removeItem(TOKEN_KEY); } catch {}
}

export function getCachedVehicles(): Vehicle[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as Vehicle[]) : [];
  } catch {
    return [];
  }
}

export function cacheVehicles(list: Vehicle[]) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(list)); } catch {}
}

export async function fetchVehicles(): Promise<Vehicle[]> {
  return (await request<{ vehicles: Vehicle[] }>('/api/vehicles')).vehicles;
}

export async function createVehicleOnServer(v: Vehicle): Promise<Vehicle> {
  return (await request<{ vehicle: Vehicle }>('/api/vehicles', { method: 'POST', body: JSON.stringify(v) })).vehicle;
}

export async function updateVehicleOnServer(v: Vehicle): Promise<Vehicle> {
  return (
    await request<{ vehicle: Vehicle }>(`/api/vehicles/${encodeURIComponent(v.id)}`, {
      method: 'PUT',
      body: JSON.stringify(v),
    })
  ).vehicle;
}

export async function deleteVehicleOnServer(id: string): Promise<void> {
  await request(`/api/vehicles/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
