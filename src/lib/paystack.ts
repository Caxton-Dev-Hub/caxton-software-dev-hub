import "server-only";

import crypto from "node:crypto";

/**
 * Paystack integration (NGN).
 *
 * Recommendation: Paystack is the default here because the business is
 * Nigeria-registered and prices are in naira — it settles to a Nigerian
 * account and supports card, bank transfer, and USSD without extra work.
 * Swapping to Flutterwave later means reimplementing only this file plus the
 * webhook route; nothing else knows the provider's name.
 */

const BASE_URL = "https://api.paystack.co";

export class PaystackError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PaystackError";
  }
}

function secretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key || key.includes("DUMMY")) {
    throw new PaystackError(
      "PAYSTACK_SECRET_KEY is not configured. Add your live or test secret key to .env.local.",
    );
  }
  return key;
}

export function isPaystackConfigured(): boolean {
  const key = process.env.PAYSTACK_SECRET_KEY;
  return Boolean(key) && !key!.includes("DUMMY");
}

async function paystackFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });

  const body = (await response.json().catch(() => null)) as
    | { status?: boolean; message?: string; data?: unknown }
    | null;

  if (!response.ok || !body?.status) {
    throw new PaystackError(
      body?.message ?? `Paystack request failed with status ${response.status}`,
    );
  }

  return body.data as T;
}

export type InitializeResult = {
  authorization_url: string;
  access_code: string;
  reference: string;
};

export function buildReference(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${crypto.randomBytes(6).toString("hex")}`;
}

export async function initializeTransaction(input: {
  email: string;
  amountKobo: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}): Promise<InitializeResult> {
  return paystackFetch<InitializeResult>("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email: input.email,
      amount: input.amountKobo, // Paystack expects the minor unit
      currency: "NGN",
      reference: input.reference,
      callback_url: input.callbackUrl,
      metadata: input.metadata ?? {},
    }),
  });
}

export type VerifiedTransaction = {
  status: string;
  reference: string;
  amount: number;
  currency: string;
  channel?: string;
  paid_at?: string;
  customer?: { email?: string };
  metadata?: Record<string, unknown>;
};

export async function verifyTransaction(
  reference: string,
): Promise<VerifiedTransaction> {
  return paystackFetch<VerifiedTransaction>(
    `/transaction/verify/${encodeURIComponent(reference)}`,
  );
}

/**
 * Paystack signs webhook bodies with HMAC SHA-512 using the secret key.
 * Compare in constant time against the raw request body.
 */
export function isValidWebhookSignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  const expected = crypto
    .createHmac("sha512", secretKey())
    .update(rawBody, "utf8")
    .digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature, "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
