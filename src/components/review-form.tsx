"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, Textarea } from "@/components/ui/field";
import type { Assignment } from "@/content/scheme";
import { ACCEPT_MARK } from "@/lib/assessment";
import {
  reviewSubmission,
  type ReviewState,
} from "@/app/admin/submissions/actions";

const initial: ReviewState = {};

export function ReviewForm({
  submissionId,
  rubric,
}: {
  submissionId: string;
  rubric: Assignment["rubric"];
}) {
  const [state, action, pending] = useActionState(reviewSubmission, initial);
  const [scores, setScores] = useState<Record<number, string>>({});

  // The weighted total is shown as the marker types, so the rubric's weights
  // are visible in the arithmetic rather than being a surprise at the end.
  const total = rubric.reduce((sum, row, index) => {
    const value = Number(scores[index]);
    return sum + (Number.isFinite(value) ? value : 0) * row.weight;
  }, 0);
  const percent = Math.round(total / 100);
  const complete = rubric.every((_, index) => scores[index] !== undefined && scores[index] !== "");

  return (
    <form action={action} className="rounded-lg border border-edge bg-paper p-6">
      <input type="hidden" name="submissionId" value={submissionId} />

      <h2 className="font-mono text-[0.6875rem] tracking-[0.16em] text-ink-soft uppercase">
        Mark against the rubric
      </h2>

      <ul className="mt-5 divide-y divide-edge">
        {rubric.map((row, index) => (
          <li key={row.criterion} className="py-5 first:pt-0">
            <div className="flex items-start justify-between gap-4">
              <label
                htmlFor={`score-${index}`}
                className="text-[1.0625rem] text-ink"
              >
                {row.criterion}
              </label>
              <span className="shrink-0 font-mono text-[0.6875rem] text-ink-faint">
                {row.weight}%
              </span>
            </div>
            <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-soft">
              {row.looksLike}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <input
                id={`score-${index}`}
                name={`score-${index}`}
                type="range"
                min={0}
                max={100}
                step={5}
                required
                value={scores[index] ?? "60"}
                onChange={(event) =>
                  setScores((current) => ({
                    ...current,
                    [index]: event.target.value,
                  }))
                }
                className="h-1.5 w-full max-w-md accent-[var(--color-signal)]"
              />
              <span className="w-12 shrink-0 text-right font-mono text-[0.8125rem] text-ink">
                {scores[index] ?? "60"}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex items-baseline justify-between border-t border-edge pt-5">
        <span className="font-mono text-[0.6875rem] tracking-[0.16em] text-ink-soft uppercase">
          Weighted total
        </span>
        <span className="font-display text-2xl text-ink">{percent}%</span>
      </div>
      {complete && percent < ACCEPT_MARK ? (
        <p className="mt-2 text-[0.875rem] text-ink-faint">
          Below {ACCEPT_MARK}%. Sending it back with specific feedback is usually
          the right call.
        </p>
      ) : null}

      <div className="mt-6 space-y-4">
        <Field
          label="Feedback for the learner"
          htmlFor="comment"
          hint="This is the part they read. Point at specific lines, say what to do next, and say one thing they did well."
        >
          <Textarea id="comment" name="comment" rows={8} required minLength={20} />
        </Field>

        <fieldset>
          <legend className="block font-mono text-[0.6875rem] tracking-[0.14em] text-ink-soft uppercase">
            Verdict
          </legend>
          <div className="mt-2.5 space-y-2">
            <label className="flex items-start gap-3 rounded-md border border-edge-strong bg-paper px-3.5 py-3 text-[0.9375rem] text-ink has-checked:border-forest">
              <input
                type="radio"
                name="verdict"
                value="CHANGES_REQUESTED"
                required
                className="mt-1 accent-[var(--color-forest)]"
              />
              <span>
                Send it back
                <span className="mt-0.5 block text-[0.8125rem] text-ink-soft">
                  They open a new attempt. This is the normal path, not a failure.
                </span>
              </span>
            </label>
            <label className="flex items-start gap-3 rounded-md border border-edge-strong bg-paper px-3.5 py-3 text-[0.9375rem] text-ink has-checked:border-forest">
              <input
                type="radio"
                name="verdict"
                value="ACCEPTED"
                className="mt-1 accent-[var(--color-forest)]"
              />
              <span>
                Accept
                <span className="mt-0.5 block text-[0.8125rem] text-ink-soft">
                  Final. Nothing further can be handed in for this assignment.
                </span>
              </span>
            </label>
          </div>
        </fieldset>

        {state.error ? (
          <p
            className="rounded-md border border-red-200 bg-red-50 px-3.5 py-2.5 text-[0.875rem] text-red-700"
            role="alert"
          >
            {state.error}
          </p>
        ) : null}

        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save the mark"}
        </Button>
      </div>
    </form>
  );
}
