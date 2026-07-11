import crypto from "node:crypto";

export const ADMIN_COOKIE = "abw_admin";
const SESSION_HOURS = 12;

/** Auth is enforced only when an admin password is configured. */
export function isAuthEnabled(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

/** Constant-time password check against ADMIN_PASSWORD. */
export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function sign(payload: string): string {
  const secret = process.env.ADMIN_SESSION_SECRET ?? "";
  return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}

/** Create a signed, expiring session token. */
export function createSession(): string {
  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + SESSION_HOURS * 3600 * 1000 })
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

/** Validate a session token's signature and expiry. */
export function verifySession(token: string | undefined): boolean {
  if (!token || !process.env.ADMIN_SESSION_SECRET) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;

  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;

  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof exp === "number" && Date.now() < exp;
  } catch {
    return false;
  }
}

export const SESSION_MAX_AGE = SESSION_HOURS * 3600;
