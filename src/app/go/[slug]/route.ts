import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

  let course: { id: string; affiliate_url: string | null; published: boolean } | null = null;
  try {
    const db = await createClient();
    const result = await db
      .from("courses")
      .select("id, affiliate_url, published")
      .eq("slug", slug)
      .single();
    course = result.data;
  } catch {
    // DB unreachable
  }

  if (!course || !course.published || !course.affiliate_url) {
    return NextResponse.redirect(new URL("/courses", req.url), 302);
  }

  let destination: URL;
  try {
    destination = new URL(course.affiliate_url);
    if (destination.protocol !== "https:" && destination.protocol !== "http:") {
      throw new Error("bad protocol");
    }
  } catch {
    return NextResponse.redirect(new URL("/courses", req.url), 302);
  }

  try {
    const db = await createClient();
    await db.from("course_clicks").insert({
      course_id: course.id,
      referrer: req.headers.get("referer")?.slice(0, 1000) ?? null,
      user_agent: req.headers.get("user-agent")?.slice(0, 500) ?? null,
    });
  } catch {
    // Tracking failure must never block the redirect
  }

  return NextResponse.redirect(destination.toString(), 302);
}
