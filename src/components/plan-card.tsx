import { Check } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type MentorshipPlan } from "@/content/mentorship";
import { formatKobo } from "@/lib/money";
import { cn } from "@/lib/utils";

export function PlanCard({ plan }: { plan: MentorshipPlan }) {
  return (
    <article
      className={cn(
        "flex flex-col rounded-lg border p-7",
        plan.featured
          ? "border-forest bg-mint/40 shadow-[0_1px_0_0_var(--color-forest)]"
          : "border-edge bg-paper",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-xl text-ink">{plan.name}</h3>
        {plan.featured ? <Badge tone="green">Most chosen</Badge> : null}
      </div>

      <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
        {plan.pitch}
      </p>

      <p className="mt-6 flex items-baseline gap-1.5">
        <span className="font-display text-3xl text-ink">
          {formatKobo(plan.priceKobo)}
        </span>
        <span className="text-sm text-ink-faint">{plan.cadence}</span>
      </p>
      <p className="mt-1.5 font-mono text-[0.6875rem] tracking-wider text-ink-faint uppercase">
        {plan.commitment}
      </p>

      <ul className="mt-6 flex-1 space-y-2.5">
        {plan.includes.map((item) => (
          <li key={item} className="flex gap-2.5 text-[0.9375rem] text-ink-soft">
            <Check className="mt-1 size-4 shrink-0 text-signal" strokeWidth={2.5} />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-7 space-y-3 border-t border-edge pt-6">
        <p className="text-[0.8125rem] text-ink-faint">
          <span className="font-medium text-ink-soft">Best for:</span> {plan.bestFor}
        </p>
        <ButtonLink
          href={`/mentorship/${plan.slug}`}
          variant={plan.featured ? "primary" : "secondary"}
          className="w-full"
        >
          Apply for {plan.name}
        </ButtonLink>
      </div>
    </article>
  );
}
