import { cn } from "@/lib/utils";

/**
 * The engraved line texture used on security documents — the same visual
 * language as the border of our CAC certificate. This is the only decorative
 * texture on the site, and it appears only around marks of verification.
 */
export function Guilloche({
  className,
  tone = "forest",
}: {
  className?: string;
  tone?: "forest" | "white" | "seal";
}) {
  const stroke =
    tone === "white" ? "#ffffff" : tone === "seal" ? "#b0862c" : "#0a6b3d";

  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      preserveAspectRatio="none"
    >
      <defs>
        <pattern
          id={`guilloche-${tone}`}
          width="64"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0 12 C 8 2, 24 2, 32 12 S 56 22, 64 12"
            fill="none"
            stroke={stroke}
            strokeWidth="0.75"
          />
          <path
            d="M0 6 C 8 -4, 24 -4, 32 6 S 56 16, 64 6"
            fill="none"
            stroke={stroke}
            strokeWidth="0.5"
            opacity="0.65"
          />
          <path
            d="M0 18 C 8 8, 24 8, 32 18 S 56 28, 64 18"
            fill="none"
            stroke={stroke}
            strokeWidth="0.5"
            opacity="0.65"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#guilloche-${tone})`} />
    </svg>
  );
}
