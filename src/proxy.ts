import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE, verifySession } from "@/lib/auth";

/**
 * Next.js 16 renamed the middleware convention to `proxy`.
 *
 * Gate the private areas. This is a cheap first check on the signed cookie —
 * every page and route handler behind it still resolves the user from the
 * database before trusting anything.
 */
const PROTECTED = ["/dashboard", "/admin", "/checkout"];

/**
 * The one part of the admin area a MENTOR may open. Marking lives under
 * /admin because it shares the shell, but a mentor has no business in
 * payments, leads, or enrolment balances — so this is a prefix allow-list
 * rather than a role check on the whole area.
 */
const MARKER_PATHS = ["/admin/submissions"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!PROTECTED.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySession(token) : null;

  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(pathname + request.nextUrl.search)}`;
    return NextResponse.redirect(url);
  }

  const marking = MARKER_PATHS.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  const mayEnterAdmin =
    session.role === "ADMIN" || (marking && session.role === "MENTOR");

  if (pathname.startsWith("/admin") && !mayEnterAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/checkout/:path*"],
};
