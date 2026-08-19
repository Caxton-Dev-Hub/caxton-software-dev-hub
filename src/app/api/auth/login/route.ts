import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { createSessionCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request, "login"), 8, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in a minute." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter your email and password" }, { status: 400 });
  }

  const { email, password } = parsed.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    // Same message and comparable timing whether the account exists or not.
    const valid = user ? await verifyPassword(password, user.passwordHash) : false;
    if (!user || !valid) {
      return NextResponse.json(
        { error: "That email and password do not match." },
        { status: 401 },
      );
    }

    await createSessionCookie({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return NextResponse.json({ ok: true, role: user.role });
  } catch (error) {
    console.error("Login failed", error);
    return NextResponse.json(
      { error: "We could not sign you in. Please try again." },
      { status: 500 },
    );
  }
}
