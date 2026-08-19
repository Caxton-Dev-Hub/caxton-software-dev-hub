export type ProcessStep = {
  step: string;
  title: string;
  duration?: string;
  body: string;
};

/**
 * Numbered because delivery genuinely is a sequence — step three cannot happen
 * before step two. The numbers carry information, not decoration.
 */
export function ProcessList({
  steps,
  onDark = false,
}: {
  steps: readonly ProcessStep[];
  onDark?: boolean;
}) {
  return (
    <ol className="grid gap-px overflow-hidden rounded-lg border md:grid-cols-2 lg:grid-cols-4"
      style={{
        borderColor: onDark ? "rgba(255,255,255,0.14)" : "var(--color-edge)",
        backgroundColor: onDark ? "rgba(255,255,255,0.14)" : "var(--color-edge)",
      }}
    >
      {steps.map((step) => (
        <li
          key={step.step}
          className={onDark ? "bg-forest-deep p-7" : "bg-paper p-7"}
        >
          <div className="flex items-baseline justify-between gap-3">
            <span
              className={`font-mono text-2xl ${onDark ? "text-signal" : "text-forest"}`}
            >
              {step.step}
            </span>
            {step.duration ? (
              <span
                className={`font-mono text-[0.625rem] tracking-[0.16em] uppercase ${
                  onDark ? "text-mint/50" : "text-ink-faint"
                }`}
              >
                {step.duration}
              </span>
            ) : null}
          </div>
          <h3
            className={`mt-4 text-lg ${onDark ? "text-white" : "text-ink"}`}
          >
            {step.title}
          </h3>
          <p
            className={`mt-2.5 text-[0.9375rem] leading-relaxed ${
              onDark ? "text-mint/70" : "text-ink-soft"
            }`}
          >
            {step.body}
          </p>
        </li>
      ))}
    </ol>
  );
}
