import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/config/auth";

export function proxy(request: NextRequest) {
  if (request.cookies.has(SESSION_COOKIE_NAME)) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/auth/access", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/home/:path*",
    "/xps/:path*",
    "/projects/:path*",
    "/tools/:path*",
    "/education/:path*",
    "/contact/:path*",
    "/settings/:path*",
    "/system/:path*",
  ],
};
