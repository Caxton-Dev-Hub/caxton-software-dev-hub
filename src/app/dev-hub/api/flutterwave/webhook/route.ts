import { NextResponse } from "next/server";

import { isValidWebhookSignature } from "@/lib/flutterwave";
import { verifyAndFulfil } from "@/lib/fulfilment";

/**
 * Flutterwave webhook.
 *
 * Point your dashboard at  https://<your-domain>/dev-hub/api/flutterwave/webhook
 *
 * Verification is a direct comparison against the `verif-hash` header, not a
 * signature over the body, so there is no need to read the body as raw text
 * before any middleware touches it — but we still parse it ourselves rather
 * than trusting a framework body parser to fail loudly.
 */
export async function POST(request: Request) {
  const raw = await request.text();
  const signature = request.headers.get("verif-hash");

  let valid = false;
  try {
    valid = isValidWebhookSignature(signature);
  } catch (error) {
    console.error("Webhook signature check failed", error);
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: { event?: string; data?: { tx_ref?: string } };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Malformed body" }, { status: 400 });
  }

  const reference = event.data?.tx_ref;
  if (!reference) {
    // Acknowledge anything we do not handle, so Flutterwave stops retrying.
    return NextResponse.json({ received: true });
  }

  if (event.event === "charge.completed") {
    try {
      // Re-verify against the API rather than trusting the payload's amount.
      await verifyAndFulfil(reference);
    } catch (error) {
      console.error(`Webhook fulfilment failed for ${reference}`, error);
      // 500 makes Flutterwave retry, which is what we want on a transient failure.
      return NextResponse.json({ error: "Fulfilment failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
