import type { Metadata } from "next";
import { Suspense } from "react";

import { CheckoutResult } from "@/components/checkout-result";

export const metadata: Metadata = {
  title: "Confirming your payment",
  robots: { index: false, follow: false },
};

export default function CheckoutCallbackPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-mist px-5 py-16">
      <Suspense
        fallback={
          <p className="font-mono text-[0.75rem] tracking-[0.16em] text-ink-faint uppercase">
            Loading…
          </p>
        }
      >
        <CheckoutResult />
      </Suspense>
    </main>
  );
}
