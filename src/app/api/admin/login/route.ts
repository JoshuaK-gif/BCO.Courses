import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
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
  const email = typeof body?.email === "string" ? body.email : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    recordFailedAttempt(ip);
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    recordFailedAttempt(ip);
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  clearAttempts(ip);
  return NextResponse.json({ ok: true });
}
