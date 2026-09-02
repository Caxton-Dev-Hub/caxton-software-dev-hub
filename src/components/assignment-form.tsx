"use client";

import { useActionState } from "react";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { SUBMIT_AS_LABEL, type AiPolicy, type SubmitAs } from "@/content/scheme";
import {
  submitAssignment,
  type SubmitState,
} from "@/app/dashboard/courses/[slug]/assignments/[assignmentId]/actions";

const initial: SubmitState = {};

export function AssignmentForm({
  assignmentId,
  submitAs,
  aiPolicy,
  attempt,
}: {
  assignmentId: string;
  submitAs: SubmitAs;
  aiPolicy: AiPolicy;
  attempt: number;
}) {
  const [state, action, pending] = useActionState(submitAssignment, initial);

  if (state.ok) {
    return (
      <p className="flex items-center gap-2 rounded-lg border border-forest/25 bg-mint p-5 text-[0.9375rem] text-forest">
        <Check className="size-4 shrink-0 text-signal" />
        Handed in. Your mentor reads it before your next session — you will see
        their feedback on this page.
      </p>
    );
  }

  const needsDeclaration = aiPolicy !== "unaided";

  return (
    <form action={action} className="rounded-lg border border-edge bg-paper p-6">
      <h2 className="font-mono text-[0.6875rem] tracking-[0.16em] text-ink-soft uppercase">
        {attempt === 1 ? "Hand in your work" : `Resubmit — attempt ${attempt}`}
      </h2>

      <input type="hidden" name="assignmentId" value={assignmentId} />

      <div className="mt-5 space-y-4">
        <Field
          label={SUBMIT_AS_LABEL[submitAs]}
          htmlFor="url"
          hint="Check it opens in a private window. Your mentor cannot mark what they cannot reach."
        >
          <Input
            id="url"
            name="url"
            type="url"
            inputMode="url"
            placeholder="https://github.com/you/your-work"
            required
          />
        </Field>

        <Field
          label="Anything your mentor should know"
          htmlFor="notes"
          hint="Optional. What you found hard, what you ran out of time for, what you would like read closely."
        >
          <Textarea id="notes" name="notes" rows={4} />
        </Field>

        {needsDeclaration ? (
          <Field
            label="How you used AI"
            htmlFor="aiDeclaration"
            hint="Required on this assignment. Be specific — which parts, which prompts, what you changed afterwards. Using it costs you nothing; not saying so means we cannot mark that part."
          >
            <Textarea id="aiDeclaration" name="aiDeclaration" rows={4} required />
          </Field>
        ) : (
          <p className="rounded-md border border-edge bg-mist px-3.5 py-2.5 text-[0.875rem] text-ink-soft">
            This one is unaided. No assistant, no completion, no generated code —
            the skill is the point, and your mentor will ask you about it.
          </p>
        )}

        {state.error ? (
          <p
            className="rounded-md border border-red-200 bg-red-50 px-3.5 py-2.5 text-[0.875rem] text-red-700"
            role="alert"
          >
            {state.error}
          </p>
        ) : null}

        <Button type="submit" disabled={pending}>
          {pending ? "Handing in…" : "Hand in"}
        </Button>
      </div>
    </form>
  );
}
