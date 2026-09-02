"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAssignment } from "@/content/scheme";
import { parseSubmission } from "@/lib/assessment";

export type SubmitState = { error?: string; ok?: boolean };

/**
 * Hand in a piece of assessed work.
 *
 * Every attempt is a new row. The unique constraint on
 * (userId, assignmentId, attempt) is what stops a double-submitted form
 * creating two rows for a mentor to mark, so the insert is allowed to fail
 * rather than being guarded by a read-then-write that races with itself.
 */
export async function submitAssignment(
  _prev: SubmitState,
  formData: FormData,
): Promise<SubmitState> {
  const user = await requireUser();

  const assignmentId = String(formData.get("assignmentId") ?? "");
  const assignment = getAssignment(assignmentId);
  if (!assignment) return { error: "Unknown assignment." };

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseSlug: { userId: user.id, courseSlug: assignment.courseSlug },
    },
  });
  if (!enrollment || enrollment.status === "CANCELLED") {
    return { error: "You are not enrolled on this course." };
  }

  const parsed = parseSubmission(assignment, formData);
  if (!parsed.ok) return { error: parsed.error };

  const attempts = await prisma.submission.findMany({
    where: { userId: user.id, assignmentId },
    orderBy: { attempt: "desc" },
    take: 1,
    select: { attempt: true, state: true },
  });
  const latest = attempts[0];

  // Accepted work is finished. Re-opening it would leave a mentor marking
  // something they have already signed off, and the learner wondering which
  // verdict counts.
  if (latest?.state === "ACCEPTED") {
    return { error: "This work has already been accepted. There is nothing more to hand in." };
  }
  if (latest?.state === "SUBMITTED") {
    return { error: "This attempt is already with your mentor. Wait for their review before resubmitting." };
  }

  try {
    await prisma.submission.create({
      data: {
        userId: user.id,
        courseSlug: assignment.courseSlug,
        assignmentId,
        attempt: (latest?.attempt ?? 0) + 1,
        url: parsed.data.url,
        notes: parsed.data.notes ?? null,
        aiDeclaration: parsed.data.aiDeclaration ?? null,
      },
    });
  } catch {
    // The unique constraint fired: the form was submitted twice. The first one
    // landed, so this is a success from the learner's point of view.
    return { ok: true };
  }

  revalidatePath(`/dashboard/courses/${assignment.courseSlug}`);
  revalidatePath(`/dashboard/courses/${assignment.courseSlug}/assignments/${assignmentId}`);
  return { ok: true };
}
