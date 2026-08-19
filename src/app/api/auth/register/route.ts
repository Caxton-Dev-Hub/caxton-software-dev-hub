import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { createSessionCookie } from "@/lib/auth";
import { registerSchema } from "@/lib/validation";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { sendMail } from "@/lib/mail";

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request, "register"), 5, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in a minute." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  const parsed = registerSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check the form",
        fieldErrors: fieldErrors(parsed.error.issues),
      },
      { status: 400 },
    );
  }

  const { name, email, phone, password } = parsed.data;

  try {
    const user = await prisma.user.create({
      data: { name, email, phone, passwordHash: await hashPassword(password) },
    });

    await createSessionCookie({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    await sendMail({
      to: user.email,
      subject: "Welcome to Caxton Software Dev Hub",
      text: [
        `Hello ${user.name.split(" ")[0]},`,
        "",
        "Your account is ready. From your dashboard you can enrol on a course, book mentorship, and use the AI study assistant.",
        "",
        "Dashboard: /dashboard",
        "",
        "If you did not create this account, reply to this email and we will remove it.",
        "",
        "— Caxton Software Dev Hub",
      ].join("\n"),
    }).catch(() => undefined);

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "An account with that email already exists. Try signing in." },
        { status: 409 },
      );
    }
    console.error("Registration failed", error);
    return NextResponse.json(
      { error: "We could not create your account. Please try again." },
      { status: 500 },
    );
  }
}

function fieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
  return Object.fromEntries(
    issues.map((issue) => [String(issue.path[0] ?? "form"), issue.message]),
  );
}
