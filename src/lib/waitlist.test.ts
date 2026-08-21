import { beforeEach, describe, expect, it, vi } from "vitest";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: { waitlistEntry: { findMany: vi.fn() } },
}));

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));

import { queuePosition, queuePositions } from "@/lib/waitlist";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("queuePosition", () => {
  it("is 1-based and reflects arrival order", async () => {
    prismaMock.waitlistEntry.findMany.mockResolvedValue([
      { id: "a" },
      { id: "b" },
      { id: "c" },
    ]);

    await expect(queuePosition("cx-101", "a")).resolves.toBe(1);
    await expect(queuePosition("cx-101", "c")).resolves.toBe(3);
  });

  it("only orders and counts entries still WAITING", async () => {
    prismaMock.waitlistEntry.findMany.mockResolvedValue([{ id: "b" }]);

    await queuePosition("cx-101", "b");

    expect(prismaMock.waitlistEntry.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { courseSlug: "cx-101", status: "WAITING" } }),
    );
  });

  it("reports the next open slot for someone no longer waiting, instead of throwing", async () => {
    prismaMock.waitlistEntry.findMany.mockResolvedValue([{ id: "a" }, { id: "b" }]);

    await expect(queuePosition("cx-101", "already-invited")).resolves.toBe(3);
  });
});

describe("queuePositions", () => {
  it("numbers each course's queue independently, starting at 1", async () => {
    prismaMock.waitlistEntry.findMany.mockResolvedValue([
      { id: "a", courseSlug: "cx-101" },
      { id: "b", courseSlug: "cx-101" },
      { id: "c", courseSlug: "cx-201" },
    ]);

    const positions = await queuePositions([
      { id: "a", courseSlug: "cx-101" },
      { id: "b", courseSlug: "cx-101" },
      { id: "c", courseSlug: "cx-201" },
    ]);

    expect(positions.get("a")).toBe(1);
    expect(positions.get("b")).toBe(2);
    expect(positions.get("c")).toBe(1);
  });

  it("returns an empty map without querying when given no entries", async () => {
    const positions = await queuePositions([]);

    expect(positions.size).toBe(0);
    expect(prismaMock.waitlistEntry.findMany).not.toHaveBeenCalled();
  });

  it("queries each distinct course slug only once", async () => {
    prismaMock.waitlistEntry.findMany.mockResolvedValue([]);

    await queuePositions([
      { id: "a", courseSlug: "cx-101" },
      { id: "b", courseSlug: "cx-101" },
    ]);

    const [args] = prismaMock.waitlistEntry.findMany.mock.calls[0];
    expect(args.where.courseSlug.in).toEqual(["cx-101"]);
  });
});
