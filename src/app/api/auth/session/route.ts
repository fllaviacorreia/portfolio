import { NextResponse, type NextRequest } from "next/server";
import {
  CSRF_COOKIE_NAME,
  RECENT_SIGN_IN_SECONDS,
  SESSION_COOKIE_NAME,
  SESSION_DURATION_MS,
} from "@/config/auth";
import { hasValidCsrfToken } from "@/lib/auth/csrf";
import { getFirebaseAdmin } from "@/lib/firebase/admin";
import { sessionRequestSchema } from "@/validators/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!hasValidCsrfToken(request)) {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 403 });
  }

  try {
    const body = sessionRequestSchema.parse(await request.json());
    const { auth } = getFirebaseAdmin();
    const token = await auth.verifyIdToken(body.idToken);
    const nowInSeconds = Math.floor(Date.now() / 1000);

    if (nowInSeconds - token.auth_time > RECENT_SIGN_IN_SECONDS) {
      return NextResponse.json(
        { error: "Faça login novamente." },
        { status: 401 },
      );
    }

    const sessionCookie = await auth.createSessionCookie(body.idToken, {
      expiresIn: SESSION_DURATION_MS,
    });
    const response = NextResponse.json({ success: true });

    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DURATION_MS / 1000,
    });
    response.cookies.delete(CSRF_COOKIE_NAME);
    return response;
  } catch {
    return NextResponse.json(
      { error: "Credenciais inválidas." },
      { status: 401 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!hasValidCsrfToken(request)) {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 403 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.delete(SESSION_COOKIE_NAME);
  response.cookies.delete(CSRF_COOKIE_NAME);
  return response;
}
