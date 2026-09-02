import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import type { Role } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export const SESSION_COOKIE = "caxton_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 14; // 14 days

export type SessionPayload = {
  sub: string;
  email: string;
  name: string;
  role: Role;
  /** Issued-at, seconds since epoch. Used to honour `sessionsValidFrom`. */
  issuedAt?: number;
};

function secret(): Uint8Array {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 24) {
    throw new Error(
      "AUTH_SECRET is missing or too short. Generate one with: openssl rand -base64 32",
    );
  }
  // The .env.example placeholder is long enough to pass the length check, so
  // booting with it would sign every session with a publicly known key. Reject
  // it the same way the payment keys reject their own DUMMY placeholders.
  if (value.includes("DUMMY") || value.includes("REPLACE_ME")) {
    throw new Error(
      "AUTH_SECRET is still the placeholder from .env.example. Generate a real one with: openssl rand -base64 32",
    );
  }
  // A long run of one character passes a length check but carries almost no
  // entropy. Not a strength meter — just a floor under copy-paste mistakes.
  if (new Set(value).size < 8) {
    throw new Error(
      "AUTH_SECRET has too little variation to be a real secret. Generate one with: openssl rand -base64 32",
    );
  }
  return new TextEncoder().encode(value);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ email: payload.email, name: payload.name, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setIssuer("caxton-software-dev-hub")
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secret());
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret(), {
      issuer: "caxton-software-dev-hub",
    });
    if (!payload.sub) return null;
    return {
      sub: payload.sub,
      email: String(payload.email ?? ""),
      name: String(payload.name ?? ""),
      role: (payload.role as Role) ?? "STUDENT",
      issuedAt: typeof payload.iat === "number" ? payload.iat : undefined,
    };
  } catch {
    return null;
  }
}

export async function createSessionCookie(payload: SessionPayload): Promise<void> {
  const token = await signSession(payload);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/**
 * Sessions are stateless JWTs, so a role change or a stolen cookie cannot be
 * revoked by deleting a row. `sessionsValidFrom` on the user is the lever: any
 * token issued before it is rejected. Bump it to force a user to sign in again
 * — which `changePassword` now does.
 */
export async function getVerifiedSession(): Promise<SessionPayload | null> {
  const session = await getSession();
  if (!session) return null;
  try {
    const user = await prisma.user.findUnique({
      where: { id: session.sub },
      select: { role: true, sessionsValidFrom: true },
    });
    if (!user) return null;
    // Reject anything issued before the revocation mark. `iat` is in whole
    // seconds, so compare on the same granularity or a token minted in the
    // same second as the bump is wrongly rejected.
    if (session.issuedAt !== undefined) {
      const validFrom = Math.floor(user.sessionsValidFrom.getTime() / 1000);
      if (session.issuedAt < validFrom) return null;
    }
    // Trust the database for the role, never the cookie's copy of it.
    return { ...session, role: user.role };
  } catch {
    return null;
  }
}

/** The signed session claims, or null. Does not hit the database. */
export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

/** The full user record, or null if the session is stale. */
export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  try {
    const user = await prisma.user.findUnique({ where: { id: session.sub } });
    if (!user) return null;
    // Same revocation check as `getVerifiedSession` — this is the function
    // every page and route actually calls, so it has to enforce it too.
    if (session.issuedAt !== undefined) {
      const validFrom = Math.floor(user.sessionsValidFrom.getTime() / 1000);
      if (session.issuedAt < validFrom) return null;
    }
    return user;
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") redirect("/dashboard");
  return user;
}

/**
 * Marking is a mentor's job, not an administrator's.
 *
 * This is the first thing the MENTOR role actually gates. A mentor marks work
 * and reads the feedback trail; they have no business in payments, leads, or
 * enrolment balances, and this keeps that separation real rather than notional.
 */
export async function requireMarker() {
  const user = await requireUser();
  if (user.role !== "MENTOR" && user.role !== "ADMIN") redirect("/dashboard");
  return user;
}
