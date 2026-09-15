import "server-only";

import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { CSRF_COOKIE_NAME } from "@/config/auth";

function equal(valueA: string, valueB: string) {
  const a = Buffer.from(valueA);
  const b = Buffer.from(valueB);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function hasValidCsrfToken(request: NextRequest) {
  const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;
  const headerToken = request.headers.get("x-csrf-token");
  const origin = request.headers.get("origin");
  const expectedOrigin = new URL(request.url).origin;

  return Boolean(
    cookieToken &&
      headerToken &&
      origin === expectedOrigin &&
      equal(cookieToken, headerToken),
  );
}
