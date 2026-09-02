// Caxton Software Dev Hub — schemes of work: the shared vocabulary.
//
// src/content/courses.ts is the catalogue: what we sell, in the language a
// prospective learner reads. This file is the delivery plan: what a mentor
// teaches on a given Saturday, what the room does afterwards, and what comes
// back to be marked. The two are deliberately separate. Marketing copy changes
// for one set of reasons; a teaching plan changes for another.
//
// A Session here may carry the id of a Lesson in courses.ts, in which case the
// syllabus outline and the teaching plan are the same unit of work. Sessions
// with their own ids are teaching that the catalogue does not itemise.
//
// The schemes themselves live one file per course in ./schemes. A mentor
// editing week 7 of the backend course should not have to scroll past the
// frontend curriculum to reach it, and a pull request that touches one course
// should show a diff in one file.

export type RubricRow = {
  /** What is being judged. Phrased as a capability, not a deliverable. */
  criterion: string;
  /** Weight out of 100 across the assignment. */
  weight: number;
  /** What full marks actually looks like. Written for the marker AND the learner. */
  looksLike: string;
};

/**
 * How much help a learner may take on a piece of assessed work.
 *
 * This is the mechanism that makes "basics first, AI second" structural rather
 * than a thing we say in a lecture. A learner cannot reach an `ai_assisted`
 * assignment on a topic without having passed the `unaided` one before it.
 */
export type AiPolicy =
  /** No assistant, no completion, no generated code. The skill is the point. */
  | "unaided"
  /** AI allowed, and the learner must declare where and how they used it. */
  | "ai_assisted"
  /** AI is the subject of the exercise. The prompts are part of the submission. */
  | "ai_required";

export type SubmitAs = "repo" | "pull_request" | "url" | "writeup";

export type Assignment = {
  id: string;
  title: string;
  /** The brief as the learner reads it. Written in second person. */
  brief: string;
  submitAs: SubmitAs;
  /** Days after the session to hand in. Kept relative so a cohort can be re-dated. */
  dueOffsetDays: number;
  aiPolicy: AiPolicy;
  rubric: RubricRow[];
};

export type Session = {
  id: string;
  week: number;
  title: string;
  /**
   * What the learner can DO afterwards. Each one starts with a verb and is
   * observable, because anything unobservable cannot be marked.
   */
  objectives: string[];
  /** What the mentor demonstrates live, in order. */
  demo: string[];
  /** What the room does with their own hands during the session. */
  practice: string[];
  /** Session ids that must come first. The ordering is pedagogical, not arbitrary. */
  dependsOn?: string[];
  /** Tools this session puts in the learner's hands for the first time. */
  toolFocus?: string[];
  assignment?: Assignment;
  /** Where a mentor sends someone who is behind, or ahead. */
  ifStuck?: string;
};

export type Scheme = {
  courseSlug: string;
  /** Sessions per teaching week. Live session first, then self-study. */
  sessionsPerWeek: number;
  sessions: Session[];
};

import { cx101 } from "./schemes/frontend-engineering-react-nextjs";
import { cx110 } from "./schemes/web-design-fundamentals";
import { cx201 } from "./schemes/backend-engineering-node-postgres";
import { cx301 } from "./schemes/cairo-starknet-smart-contracts";
import { cx401 } from "./schemes/ai-assisted-engineering";

export const schemes: Scheme[] = [cx101, cx110, cx201, cx301, cx401];

export function getScheme(courseSlug: string): Scheme | undefined {
  return schemes.find((s) => s.courseSlug === courseSlug);
}

export function sessionsForWeek(scheme: Scheme, week: number): Session[] {
  return scheme.sessions.filter((s) => s.week === week);
}

/** The weeks a scheme actually teaches, in order. */
export function schemeWeeks(scheme: Scheme): number[] {
  return [...new Set(scheme.sessions.map((s) => s.week))].sort((a, b) => a - b);
}

/** Every assignment across every scheme, for the marking queue. */
export function allAssignments(): Array<Assignment & { courseSlug: string }> {
  return schemes.flatMap((scheme) => assignmentsFor(scheme));
}

/** The assignments on one scheme, in teaching order. */
export function assignmentsFor(
  scheme: Scheme,
): Array<Assignment & { courseSlug: string; week: number; sessionId: string }> {
  return scheme.sessions
    .filter((session): session is Session & { assignment: Assignment } =>
      Boolean(session.assignment),
    )
    .map((session) => ({
      ...session.assignment,
      courseSlug: scheme.courseSlug,
      week: session.week,
      sessionId: session.id,
    }));
}

export function getAssignment(
  assignmentId: string,
): (Assignment & { courseSlug: string }) | undefined {
  return allAssignments().find((a) => a.id === assignmentId);
}

/** A rubric that does not total 100 is a marking dispute waiting to happen. */
export function rubricTotal(assignment: Assignment): number {
  return assignment.rubric.reduce((total, row) => total + row.weight, 0);
}

/**
 * Whether an assignment requires the learner to say how they used AI.
 * Declaring it is the assessed behaviour; using AI where allowed costs no marks.
 */
export function requiresAiDeclaration(assignment: Assignment): boolean {
  return assignment.aiPolicy !== "unaided";
}

export const AI_POLICY_LABEL: Record<AiPolicy, string> = {
  unaided: "Unaided",
  ai_assisted: "AI allowed, declare it",
  ai_required: "AI is the exercise",
};

export const SUBMIT_AS_LABEL: Record<SubmitAs, string> = {
  repo: "Link to a repository",
  pull_request: "Link to a pull request",
  url: "Link to the deployed page",
  writeup: "Link to your written submission",
};
