import { cookies } from "next/headers";
import crypto from "node:crypto";

const SESSION_COOKIE = "admin_session";

const SESSION_SECRET = process.env.SESSION_SECRET;

function getSessionKey(): Buffer {
  // Use an environment secret when available. Fall back to a dev-only secret.
  // In production, leaving SESSION_SECRET empty would reduce security.
  const secret = SESSION_SECRET || "dev-only-secret-change-me";
  return crypto.createHash("sha256").update(secret).digest();
}

function encryptSession(payload: string): string {
  const key = getSessionKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(payload, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  // base64url(iv + tag + ciphertext)
  return Buffer.concat([iv, tag, ciphertext]).toString("base64url");
}

function decryptSession(token: string): string | null {
  try {
    const raw = Buffer.from(token, "base64url");
    const iv = raw.subarray(0, 12);
    const tag = raw.subarray(12, 28);
    const ciphertext = raw.subarray(28);
    const key = getSessionKey();
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    const plaintext = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]);
    return plaintext.toString("utf8");
  } catch {
    return null;
  }
}

// Hardcoded admin credentials (for demo)
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123",
};

export interface SessionUser {
  id: number;
  username: string;
  role: string;
}

export async function createSession(userId: number): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  
  const sessionUser: SessionUser = {
    id: userId,
    username: ADMIN_CREDENTIALS.username,
    role: "admin",
  };

  const encrypted = encryptSession(JSON.stringify(sessionUser));

  cookieStore.set(SESSION_COOKIE, encrypted, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });

  return sessionUser;
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE);

  if (!sessionCookie?.value) return null;

  const decrypted = decryptSession(sessionCookie.value);
  if (!decrypted) return null;

  try {
    return JSON.parse(decrypted) as SessionUser;
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function verifyCredentials(
  username: string,
  password: string
): Promise<SessionUser | null> {
  // Simple credential check (for demo purposes)
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    return {
      id: 1,
      username: ADMIN_CREDENTIALS.username,
      role: "admin",
    };
  }
  
  return null;
}

export async function isAdmin(): Promise<boolean> {
  const session = await getSession();
  return session?.role === "admin";
}
