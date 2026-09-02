"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireMarker } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAssignment } from "@/content/scheme";
import { parseScoreSheet } from "@/lib/assessment";

export type ReviewState = { error?: string };

/**
 * Mark one submission.
 *
 * The review and the submission's new state are written together: a stored
 * review whose submission still reads SUBMITTED would put the work back in the
 * queue with feedback already attached, and a mentor would mark it twice.
 */
export async function reviewSubmission(
  _prev: ReviewState,
  formData: FormData,
): Promise<ReviewState> {
  const marker = await requireMarker();

  const submissionId = String(formData.get("submissionId") ?? "");
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: { review: { select: { id: true } } },
  });
  if (!submission) return { error: "That submission no longer exists." };
  if (submission.review) {
    return { error: "This attempt has already been marked." };
  }

  const assignment = getAssignment(submission.assignmentId);
  if (!assignment) {
    return {
      error:
        "This assignment is no longer in the curriculum, so it cannot be marked against a rubric.",
    };
  }

  const verdict = String(formData.get("verdict") ?? "");
  if (verdict !== "ACCEPTED" && verdict !== "CHANGES_REQUESTED") {
    return { error: "Choose whether to accept this work or send it back." };
  }

  const comment = String(formData.get("comment") ?? "").trim();
  if (comment.length < 20) {
    // Written feedback is the part the learner actually reads, so it is
    // required even when the verdict is ACCEPTED. A bare score teaches nothing.
    return { error: "Write the feedback. A score on its own teaches nobody anything." };
  }
  if (comment.length > 8000) {
    return { error: "That feedback is too long for one comment." };
  }

  const scores = parseScoreSheet(assignment, formData);
  if (!scores.ok) return { error: scores.error };

  await prisma.$transaction([
    prisma.assignmentReview.create({
      data: {
        submissionId: submission.id,
        reviewerId: marker.id,
        verdict,
        comment,
        scores: scores.scores,
      },
    }),
    prisma.submission.update({
      where: { id: submission.id },
      data: { state: verdict },
    }),
  ]);

  revalidatePath("/admin/submissions");
  revalidatePath(
    `/dashboard/courses/${submission.courseSlug}/assignments/${submission.assignmentId}`,
  );
  redirect("/admin/submissions");
}
