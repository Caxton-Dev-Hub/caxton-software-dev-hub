import { NextResponse } from "next/server";

import { isValidWebhookSignature } from "@/lib/paystack";
import { verifyAndFulfil } from "@/lib/fulfilment";

/**
 * Paystack webhook.
 *
 * Point your dashboard at  https://<your-domain>/api/paystack/webhook
 *
 * The signature is computed over the raw body, so read it as text and do not
 * let any middleware parse it first.
 */
export async function POST(request: Request) {
  const raw = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  let valid = false;
  try {
    valid = isValidWebhookSignature(raw, signature);
  } catch (error) {
    console.error("Webhook signature check failed", error);
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: { event?: string; data?: { reference?: string } };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Malformed body" }, { status: 400 });
  }

  const reference = event.data?.reference;
  if (!reference) {
    // Acknowledge anything we do not handle, so Paystack stops retrying.
    return NextResponse.json({ received: true });
  }

  if (event.event === "charge.success") {
    try {
      // Re-verify against the API rather than trusting the payload's amount.
      await verifyAndFulfil(reference);
    } catch (error) {
      console.error(`Webhook fulfilment failed for ${reference}`, error);
      // 500 makes Paystack retry, which is what we want on a transient failure.
      return NextResponse.json({ error: "Fulfilment failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
