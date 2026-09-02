import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit, userKey } from "@/lib/rate-limit";
import { verifyAndFulfil } from "@/lib/fulfilment";

/**
 * Called by the checkout callback page once the customer returns from Flutterwave.
 * The webhook is the source of truth; this exists so the customer sees a
 * confirmed state immediately instead of waiting for the webhook to land.
 */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
  }

  // Every call can trigger an outbound verification request to Flutterwave.
  const limit = rateLimit(userKey(user.id, "payments:verify"), 20, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "That is a lot of attempts. Give it a moment and try again." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  const body = (await request.json().catch(() => null)) as { reference?: string } | null;
  const reference = body?.reference;
  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  // Resolve and check ownership BEFORE fulfilling. Verifying first would let
  // any signed-in user trigger fulfilment — enrolment, receipt email — on
  // somebody else's reference and only then be told "not found".
  const owned = await prisma.payment.findUnique({ where: { reference } });
  if (!owned || owned.userId !== user.id) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  try {
    const result = await verifyAndFulfil(reference);

    if (!result.payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    return NextResponse.json({
      status: result.status,
      kind: result.payment.kind,
      itemSlug: result.payment.itemSlug,
      amountKobo: result.payment.amountKobo,
      reference: result.payment.reference,
    });
  } catch (error) {
    console.error("Verification failed", error);
    return NextResponse.json(
      { error: "We could not verify that payment. Contact us with your reference." },
      { status: 502 },
    );
  }
}
