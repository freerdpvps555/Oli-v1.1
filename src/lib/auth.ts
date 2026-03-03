import { cookies } from "next/headers";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const SESSION_COOKIE = "admin_session";

export interface SessionUser {
  id: number;
  username: string;
  role: string;
}

export async function createSession(userId: number): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) return null;

  const sessionUser: SessionUser = {
    id: user.id,
    username: user.username,
    role: user.role,
  };

  cookieStore.set(SESSION_COOKIE, JSON.stringify(sessionUser), {
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

  try {
    const user = JSON.parse(sessionCookie.value) as SessionUser;
    return user;
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
  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  if (!user || user.password !== password) return null;

  return {
    id: user.id,
    username: user.username,
    role: user.role,
  };
}

export async function isAdmin(): Promise<boolean> {
  const session = await getSession();
  return session?.role === "admin";
}
