import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

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

    const course = await db.course.findUnique({
      where: { slug: parsed.data.slug },
      select: { id: true },
    });
    if (!course) {
      // Do not reveal whether a course exists; silently accept.
      return NextResponse.json({ ok: true });
    }

    await db.courseView.create({
      data: {
        courseId: course.id,
        path: `/courses/${parsed.data.slug}`,
        referrer: parsed.data.referrer?.slice(0, 1000),
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }); // never break page UX for analytics
  }
}
