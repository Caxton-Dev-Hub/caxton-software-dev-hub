import { ShieldCheck } from "lucide-react";
import Link from "next/link";

import { site } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * The signature element: the company's public register entry, set in mono like
 * a record rather than a marketing claim. Anyone can check it against the CAC
 * database. Everything else on the page is easier to believe once this is true.
 */
export function RegistryStrip({
  className,
  onDark = false,
  linkToVerify = true,
}: {
  className?: string;
  onDark?: boolean;
  linkToVerify?: boolean;
}) {
  const items = [
    `RC ${site.registration.number}`,
    "CAMA 2020",
    `${site.address.city.toUpperCase()}, NG`,
  ];

  const content = (
    <span
      className={cn(
        "inline-flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.6875rem] tracking-[0.16em] uppercase",
        onDark ? "text-mint/85" : "text-ink-soft",
      )}
    >
      <ShieldCheck
        className={cn("size-3.5 shrink-0", onDark ? "text-seal" : "text-seal")}
        strokeWidth={2}
      />
      {items.map((item, index) => (
        <span key={item} className="inline-flex items-center gap-3">
          {index > 0 ? (
            <span
              aria-hidden="true"
              className={onDark ? "text-white/25" : "text-edge-strong"}
            >
              /
            </span>
          ) : null}
          {item}
        </span>
      ))}
    </span>
  );

  const shell = cn(
    "inline-flex items-center rounded-full border px-4 py-2",
    onDark ? "border-white/15 bg-white/5" : "border-edge bg-mist",
    linkToVerify &&
      (onDark ? "hover:border-white/30" : "hover:border-edge-strong"),
    "transition-colors",
    className,
  );

  if (!linkToVerify) {
    return <span className={shell}>{content}</span>;
  }

  return (
    <Link href="/verify" className={shell} title="How to verify this registration">
      {content}
    </Link>
  );
}
