import { z } from "zod";

import type { Assignment, RubricRow } from "@/content/scheme";
import { requiresAiDeclaration } from "@/content/scheme";

/**
 * A mark against one rubric row, as a percentage of that row. The marker
 * judges each criterion on its own terms — "how well was this done" — and the
 * weights in the rubric do the arithmetic. Asking a mentor to score out of 35
 * on one row and out of 20 on the next is how marking becomes inconsistent
 * between courses.
 */
export type ScoreSheet = Record<string, number>;

/**
 * The mark at which work is accepted rather than sent back. Deliberately not a
 * pass/fail line for the learner's record: a resubmission is the normal path,
 * and the only permanent state is ACCEPTED.
 */
export const ACCEPT_MARK = 60;

export function weightedTotal(
  assignment: Assignment,
  scores: ScoreSheet,
): number {
  const total = assignment.rubric.reduce(
    (sum, row) => sum + (scores[row.criterion] ?? 0) * row.weight,
    0,
  );
  // Rubric weights total 100 (enforced by test), so dividing by 100 returns a
  // percentage rather than requiring the caller to know the denominator.
  return Math.round(total / 100);
}

/** The rows a marker left unscored, so the form can say which ones. */
export function missingCriteria(
  assignment: Assignment,
  scores: ScoreSheet,
): RubricRow[] {
  return assignment.rubric.filter(
    (row) => typeof scores[row.criterion] !== "number",
  );
}

/**
 * Read a score sheet out of submitted form data.
 *
 * Criteria are addressed by index rather than by their text: a criterion is a
 * sentence, and sentences containing quotes or brackets make fragile form field
 * names. The index is stable for as long as the rubric is, and a rubric that
 * changes mid-cohort would invalidate the marking anyway.
 */
export function parseScoreSheet(
  assignment: Assignment,
  formData: FormData,
): { ok: true; scores: ScoreSheet } | { ok: false; error: string } {
  const scores: ScoreSheet = {};

  for (const [index, row] of assignment.rubric.entries()) {
    const raw = formData.get(`score-${index}`);
    if (raw === null || raw === "") {
      return { ok: false, error: `Score every criterion — "${row.criterion}" is blank.` };
    }

    const value = Number(raw);
    if (!Number.isFinite(value) || value < 0 || value > 100) {
      return {
        ok: false,
        error: `"${row.criterion}" must be scored between 0 and 100.`,
      };
    }

    scores[row.criterion] = Math.round(value);
  }

  return { ok: true, scores };
}

/**
 * Scores read back out of the database, where they are stored as JSON.
 *
 * A rubric can be edited after work has been marked, so a stored sheet may
 * carry criteria that no longer exist or be missing ones that now do. Reading
 * is therefore tolerant: unknown keys are dropped and absent ones stay absent,
 * rather than throwing and taking a mentor's page down over a curriculum edit.
 */
export function readScoreSheet(value: unknown): ScoreSheet {
  if (typeof value !== "object" || value === null) return {};

  const scores: ScoreSheet = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    if (typeof raw === "number" && Number.isFinite(raw)) {
      scores[key] = raw;
    }
  }
  return scores;
}

const submissionSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, "Paste the link to your work")
    .max(500)
    .url("That does not look like a link — include https://"),
  notes: z.string().trim().max(4000).optional(),
  aiDeclaration: z.string().trim().max(4000).optional(),
});

export type SubmissionInput = z.infer<typeof submissionSchema>;

/**
 * Validate a hand-in.
 *
 * The AI declaration is required exactly when the assignment's policy is not
 * "unaided", and the message says so plainly. Declaring is the assessed
 * behaviour — a learner who used AI heavily and says so is not penalised, and
 * one who says nothing cannot be marked on it at all.
 */
export function parseSubmission(
  assignment: Assignment,
  formData: FormData,
): { ok: true; data: SubmissionInput } | { ok: false; error: string } {
  const parsed = submissionSchema.safeParse({
    url: formData.get("url") ?? "",
    notes: formData.get("notes") || undefined,
    aiDeclaration: formData.get("aiDeclaration") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Check the form." };
  }

  if (requiresAiDeclaration(assignment) && !parsed.data.aiDeclaration) {
    return {
      ok: false,
      error:
        "This assignment allows AI, so say where and how you used it. Declaring it costs you no marks; leaving it out means we cannot mark that part.",
    };
  }

  return { ok: true, data: parsed.data };
}

export const SUBMISSION_STATE_LABEL = {
  SUBMITTED: "Awaiting review",
  CHANGES_REQUESTED: "Changes requested",
  ACCEPTED: "Accepted",
} as const;
