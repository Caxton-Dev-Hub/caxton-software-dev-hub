import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { mentorshipCheckoutSchema } from "@/lib/validation";
import { getPlan } from "@/content/mentorship";
import {
  buildReference,
  initializeTransaction,
  isFlutterwaveConfigured,
} from "@/lib/flutterwave";
import { site } from "@/content/site";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
  }

  const parsed = mentorshipCheckoutSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 },
    );
  }

  const plan = getPlan(parsed.data.planSlug);
  if (!plan) {
    return NextResponse.json({ error: "That plan does not exist" }, { status: 404 });
  }

  if (!isFlutterwaveConfigured()) {
    return NextResponse.json(
      {
        error:
          "Payments are not configured on this deployment yet. Add FLUTTERWAVE_SECRET_KEY to the environment.",
      },
      { status: 503 },
    );
  }

  const reference = buildReference("cx_mentor");

  const payment = await prisma.payment.create({
    data: {
      userId: user.id,
      reference,
      kind: "MENTORSHIP",
      itemSlug: plan.slug,
      amountKobo: plan.priceKobo,
      status: "PENDING",
    },
  });

  await prisma.mentorshipBooking.create({
    data: {
      userId: user.id,
      planSlug: plan.slug,
      goal: parsed.data.goal,
      paymentId: payment.id,
      status: "AWAITING_PAYMENT",
    },
  });

  try {
    const transaction = await initializeTransaction({
      email: user.email,
      amountKobo: plan.priceKobo,
      reference,
      callbackUrl: `${site.url}/checkout/callback`,
      metadata: {
        paymentId: payment.id,
        userId: user.id,
        kind: "MENTORSHIP",
        planSlug: plan.slug,
        planName: plan.name,
      },
    });

    return NextResponse.json({ authorizationUrl: transaction.authorization_url });
  } catch (error) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "FAILED" },
    });
    console.error("Flutterwave initialise failed", error);
    return NextResponse.json(
      { error: "We could not reach the payment provider. Please try again." },
      { status: 502 },
    );
  }
}
