"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AlertTriangle, ArrowRight, Check, Loader2 } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { formatKobo } from "@/lib/money";

type Result = {
  status: "paid" | "pending" | "failed" | "unknown";
  kind: "COURSE" | "MENTORSHIP";
  itemSlug: string;
  amountKobo: number;
  reference: string;
};

export function CheckoutResult() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") ?? searchParams.get("trxref");

  // A missing reference is knowable during render, so it is derived rather
  // than pushed into state from an effect.
  const missingReference = !reference;

  const [state, setState] = useState<"checking" | "done" | "error">("checking");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!reference || started.current) return;
    started.current = true;

    fetch("/api/payments/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference }),
    })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error ?? "Verification failed");
        setResult(body);
        setState("done");
      })
      .catch((cause) => {
        setState("error");
        setError(cause instanceof Error ? cause.message : "Verification failed");
      });
  }, [reference]);

  const destination =
    result?.kind === "COURSE"
      ? `/dashboard/courses/${result.itemSlug}`
      : "/dashboard/mentorship";

  return (
    <div className="w-full max-w-lg rounded-xl border border-edge bg-paper p-9 shadow-[0_20px_60px_-40px_rgba(6,54,32,0.6)]">
      <Logo />

      <div className="mt-8">
        {missingReference ? (
          <>
            <span className="inline-flex size-11 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle className="size-6 text-red-600" />
            </span>
            <h1 className="mt-5 text-2xl text-ink">No payment reference</h1>
            <p className="mt-2.5 leading-relaxed text-ink-soft">
              Your payment provider did not return a reference, so there is
              nothing for us to look up. If money left your account, send us the
              details from your bank alert and we will trace it.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/dashboard">Back to dashboard</ButtonLink>
              <ButtonLink href="/contact" variant="secondary">
                Contact us
              </ButtonLink>
            </div>
          </>
        ) : null}

        {!missingReference && state === "checking" ? (
          <>
            <Loader2 className="size-7 animate-spin text-forest" />
            <h1 className="mt-5 text-2xl text-ink">Confirming your payment</h1>
            <p className="mt-2.5 leading-relaxed text-ink-soft">
              We are checking with Flutterwave. This usually takes a second — do not
              close this page.
            </p>
          </>
        ) : null}

        {!missingReference && state === "done" && result?.status === "paid" ? (
          <>
            <span className="inline-flex size-11 items-center justify-center rounded-full bg-mint">
              <Check className="size-6 text-signal" strokeWidth={2.5} />
            </span>
            <h1 className="mt-5 text-2xl text-ink">Payment confirmed</h1>
            <p className="mt-2.5 leading-relaxed text-ink-soft">
              We received {formatKobo(result.amountKobo)}. A receipt is on its way
              to your email, and your access is live now.
            </p>
            <dl className="mt-6 rounded-lg border border-edge bg-mist p-4">
              <dt className="font-mono text-[0.625rem] tracking-[0.16em] text-ink-faint uppercase">
                Reference
              </dt>
              <dd className="mt-1 font-mono text-[0.875rem] break-all text-ink">
                {result.reference}
              </dd>
            </dl>
            <ButtonLink href={destination} size="lg" className="mt-6 w-full">
              {result.kind === "COURSE" ? "Open your course" : "Open your dashboard"}
              <ArrowRight className="size-4" />
            </ButtonLink>
          </>
        ) : null}

        {!missingReference && state === "done" && result && result.status !== "paid" ? (
          <>
            <span className="inline-flex size-11 items-center justify-center rounded-full bg-seal-soft">
              <AlertTriangle className="size-6 text-seal" />
            </span>
            <h1 className="mt-5 text-2xl text-ink">
              {result.status === "pending"
                ? "Payment not completed"
                : "Payment did not go through"}
            </h1>
            <p className="mt-2.5 leading-relaxed text-ink-soft">
              {result.status === "pending"
                ? "It looks like the payment was abandoned before it finished. Nothing has been charged."
                : "Flutterwave reported that this payment failed. If your account was debited, send us the reference below and we will trace it."}
            </p>
            <dl className="mt-6 rounded-lg border border-edge bg-mist p-4">
              <dt className="font-mono text-[0.625rem] tracking-[0.16em] text-ink-faint uppercase">
                Reference
              </dt>
              <dd className="mt-1 font-mono text-[0.875rem] break-all text-ink">
                {result.reference}
              </dd>
            </dl>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/dashboard">Back to dashboard</ButtonLink>
              <ButtonLink href="/contact" variant="secondary">
                Contact us
              </ButtonLink>
            </div>
          </>
        ) : null}

        {!missingReference && state === "error" ? (
          <>
            <span className="inline-flex size-11 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle className="size-6 text-red-600" />
            </span>
            <h1 className="mt-5 text-2xl text-ink">We could not confirm that</h1>
            <p className="mt-2.5 leading-relaxed text-ink-soft">{error}</p>
            {reference ? (
              <p className="mt-4 font-mono text-[0.8125rem] break-all text-ink-faint">
                Reference: {reference}
              </p>
            ) : null}
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/dashboard">Back to dashboard</ButtonLink>
              <ButtonLink href="/contact" variant="secondary">
                Contact us
              </ButtonLink>
            </div>
          </>
        ) : null}
      </div>

      <p className="mt-8 border-t border-edge pt-5 text-[0.8125rem] leading-relaxed text-ink-faint">
        Payments are processed by Flutterwave. We never see or store your card
        details.{" "}
        <Link href="/legal/refunds" className="underline underline-offset-2">
          Refund policy
        </Link>
        .
      </p>
    </div>
  );
}
