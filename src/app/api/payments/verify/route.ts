import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { verifyAndFulfil } from "@/lib/fulfilment";

/**
 * Called by the checkout callback page once the customer returns from Paystack.
 * The webhook is the source of truth; this exists so the customer sees a
 * confirmed state immediately instead of waiting for the webhook to land.
 */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { reference?: string } | null;
  const reference = body?.reference;
  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  try {
    const result = await verifyAndFulfil(reference);

    if (!result.payment || result.payment.userId !== user.id) {
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
