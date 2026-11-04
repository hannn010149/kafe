import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_AUTH_COOKIE = "komorebi_admin_auth";

function getSessionSecret(): string | null {
  return process.env.ADMIN_PASSWORD ||
    (process.env.NODE_ENV === "production" ? null : "adminpassword123");
}

export function createAdminSessionToken(): string | null {
  const secret = getSessionSecret();
  if (!secret) return null;

  return createHmac("sha256", secret)
    .update("komorebi-admin-session-v1")
    .digest("hex");
}

export function isValidAdminSession(token: string | undefined): boolean {
  const expectedToken = createAdminSessionToken();
  if (!token || !expectedToken) return false;

  const expected = Buffer.from(expectedToken, "hex");
  const actual = Buffer.from(token, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function requireAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  if (!isValidAdminSession(cookieStore.get(ADMIN_AUTH_COOKIE)?.value)) {
    redirect("/admin/login");
  }
}
