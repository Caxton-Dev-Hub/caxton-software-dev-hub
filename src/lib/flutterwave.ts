import "server-only";

import crypto from "node:crypto";

/**
 * Flutterwave integration (NGN).
 *
 * Recommendation: Flutterwave is the default here because the business is
 * Nigeria-registered and prices are in naira — it settles to a Nigerian
 * account and supports card, bank transfer, and USSD without extra work.
 *
 * Flutterwave's API works in the major currency unit (naira), not kobo, so
 * this file converts at the boundary in both directions. Everywhere else in
 * the app, money stays in kobo.
 *
 * Swapping provider again means reimplementing only this file plus the
 * webhook route; nothing else knows the provider's name.
 */

const BASE_URL = "https://api.flutterwave.com/v3";

export class FlutterwaveError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FlutterwaveError";
  }
}

function secretKey(): string {
  const key = process.env.FLUTTERWAVE_SECRET_KEY;
  if (!key || key.includes("DUMMY")) {
    throw new FlutterwaveError(
      "FLUTTERWAVE_SECRET_KEY is not configured. Add your live or test secret key to .env.local.",
    );
  }
  return key;
}

function secretHash(): string {
  const hash = process.env.FLUTTERWAVE_SECRET_HASH;
  if (!hash || hash.includes("DUMMY")) {
    throw new FlutterwaveError(
      "FLUTTERWAVE_SECRET_HASH is not configured. Add the webhook secret hash to .env.local.",
    );
  }
  return hash;
}

export function isFlutterwaveConfigured(): boolean {
  const key = process.env.FLUTTERWAVE_SECRET_KEY;
  return Boolean(key) && !key!.includes("DUMMY");
}

async function flutterwaveFetch<T>(path: string, init?: RequestInit): Promise<T> {
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
    | { status?: string; message?: string; data?: unknown }
    | null;

  if (!response.ok || body?.status !== "success") {
    throw new FlutterwaveError(
      body?.message ?? `Flutterwave request failed with status ${response.status}`,
    );
  }

  return body.data as T;
}

/** Kobo (integer minor unit) <-> naira (the major unit Flutterwave's API expects). */
function koboToNaira(amountKobo: number): number {
  return amountKobo / 100;
}

function nairaToKobo(amountNaira: number): number {
  return Math.round(amountNaira * 100);
}

export type InitializeResult = {
  authorization_url: string;
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
  const data = await flutterwaveFetch<{ link: string }>("/payments", {
    method: "POST",
    body: JSON.stringify({
      tx_ref: input.reference,
      amount: koboToNaira(input.amountKobo),
      currency: "NGN",
      redirect_url: input.callbackUrl,
      customer: { email: input.email },
      meta: input.metadata ?? {},
    }),
  });

  return { authorization_url: data.link, reference: input.reference };
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

/** Flutterwave's transaction status values, normalised to Paystack's vocabulary. */
function normaliseStatus(status: string): string {
  if (status === "successful") return "success";
  if (status === "cancelled") return "abandoned";
  return status;
}

export async function verifyTransaction(reference: string): Promise<VerifiedTransaction> {
  const data = await flutterwaveFetch<{
    tx_ref: string;
    status: string;
    amount: number;
    currency: string;
    payment_type?: string;
    created_at?: string;
    customer?: { email?: string };
    meta?: Record<string, unknown>;
  }>(`/transactions/verify_by_reference?tx_ref=${encodeURIComponent(reference)}`);

  return {
    status: normaliseStatus(data.status),
    reference: data.tx_ref,
    amount: nairaToKobo(data.amount),
    currency: data.currency,
    channel: data.payment_type,
    paid_at: data.created_at,
    customer: data.customer,
    metadata: data.meta,
  };
}

/**
 * Flutterwave webhooks carry a static secret hash in the `verif-hash` header
 * — set the same value as the dashboard's webhook "Secret Hash" and compare
 * directly, in constant time. Unlike Paystack, there is no HMAC over the body.
 */
export function isValidWebhookSignature(signature: string | null): boolean {
  if (!signature) return false;
  const expected = secretHash();
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature, "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
