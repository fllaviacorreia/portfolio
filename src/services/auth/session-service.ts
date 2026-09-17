import "server-only";

import { cookies } from "next/headers";
import type { DecodedIdToken } from "firebase-admin/auth";
import { SESSION_COOKIE_NAME } from "@/config/auth";
import { getFirebaseAdmin } from "@/lib/firebase/admin";

export async function getCurrentUser(): Promise<DecodedIdToken | null> {
  const sessionCookie = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return null;

  try {
    return await getFirebaseAdmin().auth.verifySessionCookie(sessionCookie, true);
  } catch {
    return null;
  }
}
