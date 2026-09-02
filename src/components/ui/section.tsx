import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  onDark = false,
  className,
}: {
  children: React.ReactNode;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("eyebrow", onDark && "eyebrow-on-dark", className)}>
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  index,
  title,
  lead,
  onDark = false,
  align = "left",
  className,
}: {
  eyebrow?: string;
  /**
   * Two-digit marker shown before the eyebrow. Gives each band on a long page
   * a fixed identity, so arriving from a nav link lands somewhere that
   * announces itself rather than on more of the same prose.
   */
  index?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  onDark?: boolean;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow || index ? (
        <span
          className={cn(
            "flex items-center gap-2.5",
            align === "center" && "justify-center",
          )}
        >
          {/* `.eyebrow` draws its own leading rule, so the numeral only needs
              to sit in front of it — a second rule here reads as a mistake. */}
          {index ? (
            <span
              className={cn(
                "font-mono text-[0.6875rem] tracking-[0.18em] tabular-nums",
                onDark ? "text-mint/70" : "text-forest",
              )}
            >
              {index}
            </span>
          ) : null}
          {eyebrow ? <Eyebrow onDark={onDark}>{eyebrow}</Eyebrow> : null}
        </span>
      ) : null}
      <h2
        className={cn(
          "mt-4 text-3xl leading-[1.08] sm:text-[2.6rem]",
          onDark ? "text-white" : "text-ink",
        )}
      >
        {title}
      </h2>
      {lead ? (
        <p
          className={cn(
            "mt-4 text-[1.0625rem] leading-relaxed",
            onDark ? "text-mint/75" : "text-ink-soft",
          )}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}

export function Section({
  id,
  tone = "paper",
  className,
  children,
}: {
  id?: string;
  tone?: "paper" | "mist" | "ink";
  className?: string;
  children: React.ReactNode;
}) {
  const tones = {
    paper: "bg-paper",
    mist: "bg-mist",
    ink: "bg-forest-deep text-white",
  } as const;

  return (
    <section id={id} className={cn("py-20 sm:py-28", tones[tone], className)}>
      {children}
    </section>
  );
}
