import {
  confirmPasswordReset,
  inMemoryPersistence,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  verifyPasswordResetCode,
} from "firebase/auth";
import { getFirebaseClient } from "@/lib/firebase/client";

async function getCsrfToken() {
  const response = await fetch("/api/auth/csrf", {
    cache: "no-store",
    credentials: "same-origin",
  });

  if (!response.ok) throw new Error("Não foi possível iniciar a sessão.");
  const data = (await response.json()) as { csrfToken: string };
  return data.csrfToken;
}

export async function loginWithEmail(email: string, password: string) {
  const { auth } = getFirebaseClient();
  await setPersistence(auth, inMemoryPersistence);

  const credential = await signInWithEmailAndPassword(auth, email, password);
  const [idToken, csrfToken] = await Promise.all([
    credential.user.getIdToken(),
    getCsrfToken(),
  ]);

  const response = await fetch("/api/auth/session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
    },
    credentials: "same-origin",
    body: JSON.stringify({ idToken }),
  });

  await signOut(auth);

  if (!response.ok) throw new Error("Não foi possível criar uma sessão segura.");
}

export async function logout() {
  const csrfToken = await getCsrfToken();
  const response = await fetch("/api/auth/session", {
    method: "DELETE",
    headers: { "X-CSRF-Token": csrfToken },
    credentials: "same-origin",
  });

  if (!response.ok) throw new Error("Não foi possível encerrar a sessão.");
}

export async function requestPasswordReset(email: string) {
  const { auth } = getFirebaseClient();
  auth.languageCode = "pt";

  await sendPasswordResetEmail(auth, email, {
    url: `${window.location.origin}/auth/access`,
    handleCodeInApp: false,
  });
}

export async function validatePasswordResetCode(code: string) {
  const { auth } = getFirebaseClient();
  return verifyPasswordResetCode(auth, code);
}

export async function resetPassword(code: string, password: string) {
  const { auth } = getFirebaseClient();
  await confirmPasswordReset(auth, code, password);
}
