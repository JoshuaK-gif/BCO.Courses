/**
 * Signed session tokens using Web Crypto (async).
 * Works in Edge middleware AND Node runtime, unlike node:crypto HMAC.
 */

const COOKIE_NAME = "bco_admin_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export { COOKIE_NAME };

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[SECURITY] AUTH_SECRET is not set or too short in production! " +
        "Admin sessions are using an insecure fallback secret. " +
        "Set a strong AUTH_SECRET environment variable immediately."
      );
    }
    return "insecure-development-secret-change-me";
  }
  return secret;
}

async function sign(payload: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  // base64url
  let bin = "";
  const bytes = new Uint8Array(sig);
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export type AdminSession = { username: string };

export async function createSessionToken(username: string): Promise<string> {
  const payload = btoa(
    JSON.stringify({ u: username, exp: Date.now() + SESSION_TTL_MS })
  )
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return `${payload}.${await sign(payload)}`;
}

export async function verifySessionToken(
  token: string | undefined
): Promise<AdminSession | null> {
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const payload = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  const expected = await sign(payload);
  if (signature.length !== expected.length) return null;
  // constant-time-ish compare
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= signature.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  if (diff !== 0) return null;
  try {
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const data = JSON.parse(json);
    if (typeof data.u !== "string" || typeof data.exp !== "number") return null;
    if (Date.now() > data.exp) return null;
    return { username: data.u };
  } catch {
    return null;
  }
}
