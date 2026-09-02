import { describe, expect, it } from "vitest";

import { getAssignment } from "@/content/scheme";
import {
  missingCriteria,
  parseScoreSheet,
  parseSubmission,
  readScoreSheet,
  weightedTotal,
} from "@/lib/assessment";

const unaided = getAssignment("cx101-a1")!;
const aiRequired = getAssignment("cx101-a4")!;

function form(entries: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(entries)) data.append(key, value);
  return data;
}

/** A full-marks sheet for whatever rubric it is handed. */
function perfect(assignment: typeof unaided): Record<string, string> {
  return Object.fromEntries(
    assignment.rubric.map((_, index) => [`score-${index}`, "100"]),
  );
}

describe("weightedTotal", () => {
  it("returns 100 when every criterion is full marks", () => {
    const scores = Object.fromEntries(
      unaided.rubric.map((row) => [row.criterion, 100]),
    );
    expect(weightedTotal(unaided, scores)).toBe(100);
  });

  it("returns 0 when nothing is scored", () => {
    expect(weightedTotal(unaided, {})).toBe(0);
  });

  it("weights the criteria rather than averaging them", () => {
    // Full marks on the heaviest row alone must beat full marks on the lightest.
    const rows = [...unaided.rubric].sort((a, b) => b.weight - a.weight);
    const heaviest = weightedTotal(unaided, { [rows[0].criterion]: 100 });
    const lightest = weightedTotal(unaided, {
      [rows[rows.length - 1].criterion]: 100,
    });
    expect(heaviest).toBeGreaterThan(lightest);
    expect(heaviest).toBe(rows[0].weight);
  });
});

describe("parseScoreSheet", () => {
  it("reads a complete sheet", () => {
    const result = parseScoreSheet(unaided, form(perfect(unaided)));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(Object.keys(result.scores)).toHaveLength(unaided.rubric.length);
    }
  });

  it("refuses a sheet with a blank criterion", () => {
    const entries = perfect(unaided);
    delete entries["score-1"];
    const result = parseScoreSheet(unaided, form(entries));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain(unaided.rubric[1].criterion);
  });

  it("refuses a score outside 0 to 100", () => {
    const result = parseScoreSheet(
      unaided,
      form({ ...perfect(unaided), "score-0": "140" }),
    );
    expect(result.ok).toBe(false);
  });

  it("refuses a score that is not a number", () => {
    const result = parseScoreSheet(
      unaided,
      form({ ...perfect(unaided), "score-0": "good" }),
    );
    expect(result.ok).toBe(false);
  });
});

describe("missingCriteria", () => {
  it("names the rows a marker has not scored", () => {
    const missing = missingCriteria(unaided, {
      [unaided.rubric[0].criterion]: 80,
    });
    expect(missing).toHaveLength(unaided.rubric.length - 1);
  });
});

describe("readScoreSheet", () => {
  it("drops values that are not numbers", () => {
    expect(readScoreSheet({ a: 40, b: "80", c: null })).toEqual({ a: 40 });
  });

  it("survives a stored value that is not an object", () => {
    // A rubric can be edited after marking; reading must not take a page down.
    expect(readScoreSheet(null)).toEqual({});
    expect(readScoreSheet("scores")).toEqual({});
  });
});

describe("parseSubmission", () => {
  it("accepts a link on an unaided assignment with no declaration", () => {
    const result = parseSubmission(
      unaided,
      form({ url: "https://github.com/someone/work" }),
    );
    expect(result.ok).toBe(true);
  });

  it("rejects something that is not a link", () => {
    const result = parseSubmission(unaided, form({ url: "my repo" }));
    expect(result.ok).toBe(false);
  });

  it("requires a declaration when the assignment allows AI", () => {
    const result = parseSubmission(
      aiRequired,
      form({ url: "https://example.com/writeup" }),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("costs you no marks");
  });

  it("accepts an AI assignment once the declaration is there", () => {
    const result = parseSubmission(
      aiRequired,
      form({
        url: "https://example.com/writeup",
        aiDeclaration: "Generated the first draft of the reducer, rewrote the error path myself.",
      }),
    );
    expect(result.ok).toBe(true);
  });
});
