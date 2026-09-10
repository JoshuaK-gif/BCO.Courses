import crypto from "crypto";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import {
  createSessionToken,
  verifySessionToken,
  COOKIE_NAME,
  type AdminSession,
} from "@/lib/sessionToken";

export { createSessionToken, verifySessionToken, COOKIE_NAME };
export type { AdminSession };

/**
 * Env-based admin authentication for BCO Courses.
 * - ADMIN_USERNAME + ADMIN_PASSWORD (or ADMIN_PASSWORD_HASH) in env vars
 * - Signed session cookie (HMAC-SHA256 via Web Crypto)
 * - Single admin account in v1 — no user tables needed
 */

function timingSafeEqualStr(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufA); // keep timing roughly constant
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export function verifyCredentials(username: string, password: string): boolean {
  const envUser = process.env.ADMIN_USERNAME || "";
  const envPassHash = process.env.ADMIN_PASSWORD_HASH;
  const envPass = process.env.ADMIN_PASSWORD || "";

  if (!envUser || (!envPassHash && !envPass)) return false;

  const userOk = timingSafeEqualStr(username, envUser);
  let passOk = false;
  if (envPassHash) {
    passOk = bcrypt.compareSync(password, envPassHash);
  } else {
    passOk = timingSafeEqualStr(password, envPass);
  }
  return userOk && passOk;
}

// ---- Simple in-memory login rate limiting (per IP) ----
const attempts = new Map<string, { count: number; firstAt: number }>();
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ENTRIES = 10000;

function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of attempts) {
    if (now - entry.firstAt > WINDOW_MS) {
      attempts.delete(key);
    }
  }
}

export function isRateLimited(key: string): boolean {
  // Periodically cleanup to prevent unbounded growth
  if (attempts.size > MAX_ENTRIES) {
    cleanupExpiredEntries();
  }
  const entry = attempts.get(key);
  if (!entry) return false;
  if (Date.now() - entry.firstAt > WINDOW_MS) {
    attempts.delete(key);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

export function recordFailedAttempt(key: string): void {
  const entry = attempts.get(key);
  if (!entry || Date.now() - entry.firstAt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAt: Date.now() });
  } else {
    entry.count += 1;
  }
}

export function clearAttempts(key: string): void {
  attempts.delete(key);
}

// ---- Session cookie helpers ----
export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(COOKIE_NAME)?.value);
}

export async function setSessionCookie(username: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, await createSessionToken(username), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/** Guard for server actions — throws if not signed in. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}
