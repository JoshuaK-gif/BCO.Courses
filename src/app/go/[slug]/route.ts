import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * /go/[slug] — secure affiliate redirect.
 *
 * Affiliate URLs are stored ONLY in the database and managed by the admin.
 * This route records the click (course, timestamp, referrer, UA) and then
 * redirects the visitor to the destination. No affiliate URLs ever live
 * in frontend components.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  let course: { id: string; affiliateUrl: string | null; published: boolean } | null = null;
  try {
    course = await db.course.findUnique({
      where: { slug },
      select: { id: true, affiliateUrl: true, published: true },
    });
  } catch {
    // DB unreachable — fall through to the /courses redirect below.
  }

  if (!course || !course.published || !course.affiliateUrl) {
    return NextResponse.redirect(new URL("/courses", req.url), 302);
  }

  // Only allow http(s) destinations to prevent open-redirect abuse
  let destination: URL;
  try {
    destination = new URL(course.affiliateUrl);
    if (destination.protocol !== "https:" && destination.protocol !== "http:") {
      throw new Error("bad protocol");
    }
  } catch {
    return NextResponse.redirect(new URL("/courses", req.url), 302);
  }

  try {
    await db.courseClick.create({
      data: {
        courseId: course.id,
        referrer: req.headers.get("referer")?.slice(0, 1000) ?? undefined,
        userAgent: req.headers.get("user-agent")?.slice(0, 500) ?? undefined,
      },
    });
  } catch {
    // Tracking failure must never block the redirect
  }

  return NextResponse.redirect(destination.toString(), 302);
}
