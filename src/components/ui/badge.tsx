import { cn } from "@/lib/utils";

type Tone = "neutral" | "green" | "seal" | "dark";

const tones: Record<Tone, string> = {
  neutral: "border-edge bg-mist text-ink-soft",
  green: "border-forest/25 bg-mint text-forest",
  seal: "border-seal/35 bg-seal-soft text-seal",
  dark: "border-white/15 bg-white/10 text-mint",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.6875rem] tracking-wider uppercase",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
