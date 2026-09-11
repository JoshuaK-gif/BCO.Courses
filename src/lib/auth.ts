import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

/**
 * Admin authentication using Supabase Auth.
 * - ENV-based credentials for initial admin signup
 * - Supabase Auth for session management
 */

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

export type AdminSession = { email: string };

export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    return { email: user.email || "" };
  } catch {
    return null;
  }
}

/** Guard for server actions — throws if not signed in. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}
