import { cookies } from "next/headers";

const SESSION_COOKIE = "admin_session";

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
