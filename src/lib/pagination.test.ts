import { describe, expect, it } from "vitest";

import { PER_PAGE, pageHref, paginate, paginateList, parsePage } from "@/lib/pagination";

describe("parsePage", () => {
  it("defaults to page one", () => {
    expect(parsePage(undefined)).toBe(1);
    expect(parsePage("")).toBe(1);
  });

  it("reads a valid page number", () => {
    expect(parsePage("4")).toBe(4);
  });

  it("refuses anything that is not a positive whole number", () => {
    // Search params are user input; none of these may reach a query.
    expect(parsePage("nine")).toBe(1);
    expect(parsePage("-3")).toBe(1);
    expect(parsePage("0")).toBe(1);
    expect(parsePage("2.5")).toBe(1);
    expect(parsePage("1e9999")).toBe(1);
  });

  it("takes the first value when the parameter is repeated", () => {
    expect(parsePage(["3", "7"])).toBe(3);
  });
});

describe("paginate", () => {
  it("describes the first page of a long list", () => {
    const info = paginate(87, 1, 20);
    expect(info).toMatchObject({
      page: 1, skip: 0, take: 20, totalPages: 5,
      hasPrevious: false, hasNext: true, from: 1, to: 20,
    });
  });

  it("describes a middle page", () => {
    expect(paginate(87, 3, 20)).toMatchObject({
      skip: 40, hasPrevious: true, hasNext: true, from: 41, to: 60,
    });
  });

  it("ends the last page at the real row count", () => {
    expect(paginate(87, 5, 20)).toMatchObject({
      hasNext: false, from: 81, to: 87,
    });
  });

  it("clamps a page beyond the end back to the last page", () => {
    // A stale bookmark must not produce an empty table.
    expect(paginate(87, 900, 20).page).toBe(5);
  });

  it("survives an empty list", () => {
    expect(paginate(0, 1, 20)).toMatchObject({
      page: 1, totalPages: 1, hasNext: false, hasPrevious: false, from: 0, to: 0,
    });
  });

  it("defaults to the shared page size", () => {
    expect(paginate(100, 1).perPage).toBe(PER_PAGE);
  });
});

describe("paginateList", () => {
  const items = Array.from({ length: 25 }, (_, i) => i + 1);

  it("slices the requested page", () => {
    expect(paginateList(items, 2, 10).rows).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
  });

  it("returns the remainder on the last page", () => {
    expect(paginateList(items, 3, 10).rows).toEqual([21, 22, 23, 24, 25]);
  });

  it("clamps rather than returning nothing", () => {
    expect(paginateList(items, 99, 10).rows).toEqual([21, 22, 23, 24, 25]);
  });
});

describe("pageHref", () => {
  it("omits the parameter on page one so the canonical URL stays clean", () => {
    expect(pageHref("/insights", {}, 1)).toBe("/insights");
  });

  it("adds the page number beyond page one", () => {
    expect(pageHref("/insights", {}, 3)).toBe("/insights?page=3");
  });

  it("preserves other parameters so a filter survives paging", () => {
    const href = pageHref("/admin/payments", { status: "PAID", page: "2" }, 3);
    expect(href).toContain("status=PAID");
    expect(href).toContain("page=3");
    expect(href.match(/page=/g)).toHaveLength(1);
  });

  it("keeps a repeated parameter", () => {
    const href = pageHref("/x", { tag: ["a", "b"] }, 2);
    expect(href).toContain("tag=a");
    expect(href).toContain("tag=b");
  });
});
