import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn("size-8 shrink-0", className)}
    >
      <rect width="32" height="32" rx="7.5" fill="currentColor" />
      <path
        d="M21.8 10.6a7.2 7.2 0 1 0 0 10.8"
        fill="none"
        stroke="#ffffff"
        strokeWidth="3.1"
        strokeLinecap="round"
      />
      <circle cx="23.4" cy="16" r="2.3" fill="#b0862c" />
    </svg>
  );
}

export function Logo({
  onDark = false,
  className,
}: {
  onDark?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label="Caxton Software Dev Hub — home"
    >
      <LogoMark className={onDark ? "text-signal" : "text-forest"} />
      <span className="leading-none">
        <span
          className={cn(
            "block font-display text-[1.0625rem] font-semibold tracking-tight",
            onDark ? "text-white" : "text-ink",
          )}
        >
          Caxton
        </span>
        <span
          className={cn(
            "mt-0.5 block font-mono text-[0.5625rem] tracking-[0.22em] uppercase",
            onDark ? "text-mint/60" : "text-ink-faint",
          )}
        >
          Software Dev Hub
        </span>
      </span>
    </Link>
  );
}
