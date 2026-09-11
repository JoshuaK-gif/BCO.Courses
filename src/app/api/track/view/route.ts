import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  slug: z.string().min(1).max(200),
  referrer: z.string().max(1000).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const db = await createClient();

    const { data: course } = await db
      .from("courses")
      .select("id")
      .eq("slug", parsed.data.slug)
      .single();

    if (!course) {
      return NextResponse.json({ ok: true });
    }

    await db.from("course_views").insert({
      course_id: course.id,
      path: `/courses/${parsed.data.slug}`,
      referrer: parsed.data.referrer?.slice(0, 1000),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
