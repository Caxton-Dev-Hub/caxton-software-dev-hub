"use client";

import { useState } from "react";

import { Field, Textarea } from "@/components/ui/field";
import { EnrolButton } from "@/components/enrol-button";
import { type MentorshipPlan } from "@/content/mentorship";
import { formatKobo } from "@/lib/money";

export function MentorshipApplication({ plan }: { plan: MentorshipPlan }) {
  const [goal, setGoal] = useState("");
  const ready = goal.trim().length >= 20;

  return (
    <div className="sticky top-28 rounded-lg border border-edge bg-paper p-7 shadow-[0_16px_40px_-30px_rgba(6,54,32,0.5)]">
      <p className="font-mono text-[0.625rem] tracking-[0.16em] text-ink-faint uppercase">
        Apply for {plan.name}
      </p>
      <p className="mt-2 font-display text-3xl text-ink">
        {formatKobo(plan.priceKobo)}{" "}
        <span className="font-sans text-sm font-normal text-ink-faint">
          {plan.cadence}
        </span>
      </p>

      <div className="mt-6">
        <Field
          label="What do you want to achieve?"
          htmlFor="goal"
          hint={`${goal.trim().length}/20 characters minimum. Your mentor reads this before the first call.`}
        >
          <Textarea
            id="goal"
            value={goal}
            onChange={(event) => setGoal(event.target.value)}
            placeholder="I can build small React apps but I freeze in technical interviews. I want a job as a frontend engineer in the next six months."
            required
          />
        </Field>
      </div>

      <EnrolButton
        kind="mentorship"
        slug={plan.slug}
        goal={goal}
        label={ready ? "Continue to payment" : "Describe your goal first"}
        returnTo={`/mentorship/${plan.slug}`}
        className={`mt-5 ${ready ? "" : "pointer-events-none opacity-55"}`}
      />

      <p className="mt-4 text-[0.8125rem] leading-relaxed text-ink-faint">
        You will be charged once. Monthly plans renew only when you choose to —
        we do not store or auto-charge your card.
      </p>
    </div>
  );
}
