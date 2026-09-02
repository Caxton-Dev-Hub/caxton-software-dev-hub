import { describe, expect, it } from "vitest";

import { getCourse } from "@/content/courses";
import {
  allAssignments,
  assignmentsFor,
  getScheme,
  rubricTotal,
  schemeWeeks,
  schemes,
  sessionsForWeek,
} from "@/content/scheme";

describe("scheme integrity", () => {
  it("points every scheme at a course that exists", () => {
    for (const scheme of schemes) {
      expect(getCourse(scheme.courseSlug), scheme.courseSlug).toBeDefined();
    }
  });

  it("gives every rubric a total of 100", () => {
    // A rubric that does not total 100 is a marking dispute waiting to happen.
    for (const assignment of allAssignments()) {
      expect(rubricTotal(assignment), assignment.id).toBe(100);
    }
  });

  it("keeps assignment ids unique across every scheme", () => {
    const ids = allAssignments().map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps session ids unique and their prerequisites resolvable", () => {
    for (const scheme of schemes) {
      const ids = scheme.sessions.map((s) => s.id);
      expect(new Set(ids).size, scheme.courseSlug).toBe(ids.length);

      for (const session of scheme.sessions) {
        for (const prerequisite of session.dependsOn ?? []) {
          expect(ids, `${session.id} depends on ${prerequisite}`).toContain(
            prerequisite,
          );
        }
      }
    }
  });

  it("never lets a session depend on one taught later", () => {
    // The ordering is the pedagogy: basics are unaided before AI is introduced.
    for (const scheme of schemes) {
      const week = new Map(scheme.sessions.map((s) => [s.id, s.week]));

      for (const session of scheme.sessions) {
        for (const prerequisite of session.dependsOn ?? []) {
          expect(
            week.get(prerequisite)!,
            `${session.id} depends on ${prerequisite}`,
          ).toBeLessThanOrEqual(session.week);
        }
      }
    }
  });

  it("teaches version control unaided before any AI-assisted work", () => {
    const scheme = getScheme("frontend-engineering-react-nextjs")!;
    const assisted = scheme.sessions.filter((s) =>
      s.assignment && s.assignment.aiPolicy !== "unaided",
    );
    const unaided = scheme.sessions.filter(
      (s) => s.assignment?.aiPolicy === "unaided",
    );

    expect(unaided.length).toBeGreaterThan(0);
    for (const session of assisted) {
      expect(
        Math.min(...unaided.map((s) => s.week)),
        session.id,
      ).toBeLessThan(session.week);
    }
  });

  it("teaches every week the catalogue sells", () => {
    // A learner who paid for twelve weeks and finds week 9 blank has been
    // short-changed, and the catalogue is the promise we made.
    for (const scheme of schemes) {
      const course = getCourse(scheme.courseSlug)!;
      const covered = schemeWeeks(scheme);
      const expected = Array.from({ length: course.weeks }, (_, i) => i + 1);
      expect(covered, course.code).toEqual(expected);
    }
  });

  it("gives every course something to hand in", () => {
    for (const scheme of schemes) {
      expect(assignmentsFor(scheme).length, scheme.courseSlug).toBeGreaterThan(0);
    }
  });

  it("does not leave a teaching week empty", () => {
    for (const scheme of schemes) {
      const weeks = [...new Set(scheme.sessions.map((s) => s.week))];
      for (const week of weeks) {
        expect(sessionsForWeek(scheme, week).length, `week ${week}`).toBe(
          scheme.sessionsPerWeek,
        );
      }
    }
  });
});
