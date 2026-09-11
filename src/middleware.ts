import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Guard all /admin routes (except the login page).
 * Uses Supabase Auth session verification.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const { supabase, supabaseResponse } = await updateSession(req);

  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();

  if (!user && pathname.startsWith("/admin")) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
