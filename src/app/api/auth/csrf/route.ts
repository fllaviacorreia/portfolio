import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { CSRF_COOKIE_NAME } from "@/config/auth";

export const dynamic = "force-dynamic";

export function GET() {
  const csrfToken = randomUUID();
  const response = NextResponse.json(
    { csrfToken },
    { headers: { "Cache-Control": "no-store" } },
  );

  response.cookies.set(CSRF_COOKIE_NAME, csrfToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 10,
  });

  return response;
}
