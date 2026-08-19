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
  title,
  lead,
  onDark = false,
  align = "left",
  className,
}: {
  eyebrow?: string;
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
      {eyebrow ? <Eyebrow onDark={onDark}>{eyebrow}</Eyebrow> : null}
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
