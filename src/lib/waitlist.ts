import "server-only";

import { prisma } from "@/lib/prisma";

/**
 * Queue order for a course waitlist.
 *
 * `createdAt` alone is not enough: rows written in the same transaction (or the
 * same millisecond) share a timestamp, and a plain "count everyone created
 * before me" query then reports every one of them as first. Tie-breaking on the
 * primary key makes the order arbitrary but *stable*, which is what a queue
 * actually needs — everyone gets a distinct, unchanging place.
 */
export const waitlistOrder = [
  { createdAt: "asc" as const },
  { id: "asc" as const },
];

/** 1-based place in the queue, counting only people still waiting. */
export async function queuePosition(
  courseSlug: string,
  entryId: string,
): Promise<number> {
  const waiting = await prisma.waitlistEntry.findMany({
    where: { courseSlug, status: "WAITING" },
    orderBy: waitlistOrder,
    select: { id: true },
  });

  const index = waiting.findIndex((entry) => entry.id === entryId);
  // Not in the waiting list (already invited, converted, declined) — report the
  // position they would take rather than throwing.
  return index === -1 ? waiting.length + 1 : index + 1;
}

/**
 * Positions for several entries at once, keyed by entry id. One query per
 * course rather than one per entry.
 */
export async function queuePositions(
  entries: { id: string; courseSlug: string }[],
): Promise<Map<string, number>> {
  const slugs = [...new Set(entries.map((entry) => entry.courseSlug))];
  if (slugs.length === 0) return new Map();

  const waiting = await prisma.waitlistEntry.findMany({
    where: { courseSlug: { in: slugs }, status: "WAITING" },
    orderBy: waitlistOrder,
    select: { id: true, courseSlug: true },
  });

  const seen = new Map<string, number>();
  const positions = new Map<string, number>();

  for (const entry of waiting) {
    const next = (seen.get(entry.courseSlug) ?? 0) + 1;
    seen.set(entry.courseSlug, next);
    positions.set(entry.id, next);
  }

  return positions;
}
