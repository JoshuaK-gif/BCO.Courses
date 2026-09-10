import { NextRequest, NextResponse } from "next/server";
import {
  verifyCredentials,
  setSessionCookie,
  isRateLimited,
  recordFailedAttempt,
  clearAttempts,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in 10 minutes." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const username = typeof body?.username === "string" ? body.username : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!username || !password || !verifyCredentials(username, password)) {
    recordFailedAttempt(ip);
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }

  clearAttempts(ip);
  await setSessionCookie(username);
  return NextResponse.json({ ok: true });
}
