export const SESSION_COOKIE_NAME = "__session";
export const CSRF_COOKIE_NAME = "csrfToken";
export const SESSION_DURATION_MS = 5 * 24 * 60 * 60 * 1000;
export const RECENT_SIGN_IN_SECONDS = 5 * 60;

export function getSafeRedirect(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }

  return value;
}
