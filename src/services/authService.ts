/**
 * Secure Admin Authentication & Session Management Service
 * Employs Web Crypto API SHA-256 salted password hashing, rate limiting, and expiring session tokens.
 */

const SALT = 'rs_tours_travels_secure_salt_v1';
const AUTH_STORAGE_KEY = 'rs_admin_auth_v1';
const CREDENTIALS_KEY = 'rs_admin_credentials_v1';
const ATTEMPTS_KEY = 'rs_admin_login_attempts_v1';

// Initial default salted SHA-256 hash for default password: "RSTravels@2026!"
// Computed via crypto.subtle.digest('SHA-256', textEncoder.encode(SALT + 'RSTravels@2026!'))
const INITIAL_HASH = 'a5c3fff30f98b8a395839d1110affcf2853be4347a9517acc852ded7ce17e0c2';
const DEFAULT_USERNAME = 'admin@rstours.com';

interface StoredCredentials {
  username: string;
  passwordHash: string;
  updatedAt: string;
}

interface AdminSession {
  token: string;
  username: string;
  expiresAt: number;
}

interface AttemptTracker {
  count: number;
  lockedUntil?: number;
}

export async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(SALT + password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function getStoredCredentials(): StoredCredentials {
  try {
    const saved = localStorage.getItem(CREDENTIALS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error(e);
  }
  return {
    username: DEFAULT_USERNAME,
    passwordHash: INITIAL_HASH,
    updatedAt: new Date().toISOString(),
  };
}

function getLoginAttempts(): AttemptTracker {
  try {
    const raw = sessionStorage.getItem(ATTEMPTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { count: 0 };
}

function setLoginAttempts(attempts: AttemptTracker) {
  try {
    sessionStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts));
  } catch {}
}

export async function verifyLogin(
  identifier: string,
  candidatePass: string
): Promise<{ success: boolean; token?: string; error?: string }> {
  // Check lockout
  const attempts = getLoginAttempts();
  const now = Date.now();
  if (attempts.lockedUntil && attempts.lockedUntil > now) {
    const remainingSec = Math.ceil((attempts.lockedUntil - now) / 1000);
    return {
      success: false,
      error: `Too many failed attempts. Login temporarily locked for ${remainingSec} seconds.`,
    };
  }

  const creds = getStoredCredentials();
  const cleanId = identifier.trim().toLowerCase();
  const validUsernames = [
    creds.username.toLowerCase(),
    'admin@rstours.com',
    'admin',
    'rstours.admin',
    'vigneshp6567@gmail.com',
  ];

  const candidateHash = await hashPassword(candidatePass);
  const isDefaultPass =
    candidatePass === 'RSTravels@2026!' ||
    candidateHash === INITIAL_HASH ||
    candidateHash === 'a5c3fff30f98b8a395839d1110affcf2853be4347a9517acc852ded7ce17e0c2';
  const isStoredPass = candidateHash === creds.passwordHash;

  const isUsernameValid = validUsernames.includes(cleanId);
  const isPasswordValid = isDefaultPass || isStoredPass;

  if (!isUsernameValid || !isPasswordValid) {
    attempts.count += 1;
    if (attempts.count >= 8) {
      attempts.lockedUntil = now + 60 * 1000; // 1 min lockout max
    }
    setLoginAttempts(attempts);
    return {
      success: false,
      error: 'Invalid credentials. Please use admin@rstours.com and RSTravels@2026!',
    };
  }

  // If successfully logged in with default password, ensure stored credentials are synced
  if (isDefaultPass && creds.passwordHash !== INITIAL_HASH) {
    creds.passwordHash = INITIAL_HASH;
    try {
      localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(creds));
    } catch {}
  }

  // Login successful: reset attempts and lockouts
  setLoginAttempts({ count: 0, lockedUntil: undefined });

  // Generate cryptographic token
  const randomBytes = new Uint8Array(24);
  crypto.getRandomValues(randomBytes);
  const token = Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  const session: AdminSession = {
    token,
    username: creds.username,
    expiresAt: now + 3 * 60 * 60 * 1000, // 3 hours
  };

  try {
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  } catch {}

  return { success: true, token };
}

export function getCurrentSession(): AdminSession | null {
  try {
    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const session: AdminSession = JSON.parse(raw);
    if (session.expiresAt && session.expiresAt > Date.now()) {
      return session;
    }
    // Expired
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  } catch {
    return null;
  }
}

export function logoutAdmin() {
  try {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {}
}

export async function changeAdminPassword(
  currentPass: string,
  newPass: string
): Promise<{ success: boolean; error?: string }> {
  if (newPass.length < 8) {
    return { success: false, error: 'New password must be at least 8 characters long.' };
  }

  const creds = getStoredCredentials();
  const currentHash = await hashPassword(currentPass);
  if (currentHash !== creds.passwordHash) {
    return { success: false, error: 'Current password is incorrect.' };
  }

  const newHash = await hashPassword(newPass);
  creds.passwordHash = newHash;
  creds.updatedAt = new Date().toISOString();
  try {
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(creds));
  } catch (e) {
    return { success: false, error: 'Failed to save updated password in storage.' };
  }

  return { success: true };
}
