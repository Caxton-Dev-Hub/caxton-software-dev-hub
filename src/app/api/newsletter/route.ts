import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { prisma, isDatabaseConfigured } from "@/lib/prisma";
import { newsletterSchema } from "@/lib/validation";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request, "newsletter"), 5, 60_000);
  if (!limit.ok) {
    return NextResponse.json({ error: "Slow down a moment." }, { status: 429 });
  }

  const parsed = newsletterSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Enter a valid email address" },
      { status: 400 },
    );
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ ok: true });
  }

  try {
    await prisma.newsletterSubscriber.create({ data: { email: parsed.data.email } });
  } catch (error) {
    // Already subscribed is a success from the visitor's point of view.
    if (
      !(error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")
    ) {
      console.error("Newsletter subscribe failed", error);
      return NextResponse.json(
        { error: "We could not add you just now. Try again shortly." },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ ok: true });
}
