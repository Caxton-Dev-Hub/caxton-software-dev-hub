import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";

import { Logo } from "@/components/logo";
import { RegistryStrip } from "@/components/registry-strip";
import { Guilloche } from "@/components/guilloche";

const points = [
  "Course material, recordings, and your progress in one place",
  "The AI study assistant, scoped to the course you are enrolled on",
  "Payment receipts and invoices you can download any time",
  "Direct line to your mentor between sessions",
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex flex-col px-5 py-8 sm:px-10 lg:px-14">
        <div className="flex items-center justify-between gap-4">
          <Logo />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-mono text-[0.6875rem] tracking-[0.16em] text-ink-faint uppercase transition-colors hover:text-forest"
          >
            <ArrowLeft className="size-3.5" /> Back to site
          </Link>
        </div>

        <div className="flex flex-1 items-center py-12">
          <div className="w-full max-w-md">{children}</div>
        </div>

        <RegistryStrip />
      </div>

      <aside className="relative hidden overflow-hidden bg-forest-deep lg:flex lg:flex-col lg:justify-center lg:px-14">
        <Guilloche tone="white" className="opacity-[0.07]" />
        <div className="relative max-w-md">
          <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-signal uppercase">
            Your account
          </p>
          <h2 className="mt-5 text-3xl leading-tight text-white">
            Everything you paid for, in one place
          </h2>
          <ul className="mt-8 space-y-4">
            {points.map((point) => (
              <li key={point} className="flex gap-3 text-[0.9375rem] leading-relaxed text-mint/75">
                <Check className="mt-1 size-4 shrink-0 text-signal" strokeWidth={2.5} />
                {point}
              </li>
            ))}
          </ul>
          <p className="mt-10 border-l-2 border-signal/50 pl-4 text-[0.9375rem] leading-relaxed text-mint/60">
            We never store card details, and we never charge a card without you
            starting the payment yourself.
          </p>
        </div>
      </aside>
    </div>
  );
}
