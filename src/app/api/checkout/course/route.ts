import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { rateLimit, userKey } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { courseCheckoutSchema } from "@/lib/validation";
import { getCourse, isWaitlisted } from "@/content/courses";
import { instalmentKobo } from "@/lib/money";
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

  // Each call creates a Payment row and hits Flutterwave's API, so this is
  // metered on the account rather than the IP.
  const limit = rateLimit(userKey(user.id, "checkout:course"), 10, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "That is a lot of attempts. Give it a moment and try again." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  const parsed = courseCheckoutSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const course = getCourse(parsed.data.courseSlug);
  if (!course) {
    return NextResponse.json({ error: "That course does not exist" }, { status: 404 });
  }

  // Guard the API as well as the UI — the button is hidden on a full cohort,
  // but nothing stops someone posting here directly.
  if (isWaitlisted(course)) {
    return NextResponse.json(
      {
        error:
          "This cohort is full. Join the waitlist and we will email you when a seat opens.",
        redirect: `/courses/${course.slug}`,
      },
      { status: 409 },
    );
  }

  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseSlug: { userId: user.id, courseSlug: course.slug } },
  });
  // An active enrolment with a balance is not "already bought" — it is someone
  // coming back to settle the second instalment, which has to be payable.
  const settlingBalance = Boolean(
    existing && existing.status !== "CANCELLED" && existing.balanceKobo > 0,
  );
  if (existing && existing.status !== "CANCELLED" && !settlingBalance) {
    return NextResponse.json(
      { redirect: `/dashboard/courses/${course.slug}` },
      { status: 200 },
    );
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

  const amountKobo = settlingBalance
    ? existing!.balanceKobo
    : parsed.data.plan === "instalment"
      ? instalmentKobo(course.priceKobo)
      : course.priceKobo;

  const reference = buildReference("cx_course");

  const payment = await prisma.payment.create({
    data: {
      userId: user.id,
      reference,
      kind: "COURSE",
      itemSlug: course.slug,
      amountKobo,
      status: "PENDING",
    },
  });

  try {
    const transaction = await initializeTransaction({
      email: user.email,
      amountKobo,
      reference,
      callbackUrl: `${site.url}/checkout/callback`,
      metadata: {
        paymentId: payment.id,
        userId: user.id,
        kind: "COURSE",
        courseSlug: course.slug,
        plan: settlingBalance ? "balance" : parsed.data.plan,
        courseTitle: course.title,
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
