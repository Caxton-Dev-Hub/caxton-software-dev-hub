import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ReviewForm } from "@/components/review-form";
import { requireMarker } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCourse } from "@/content/courses";
import { AI_POLICY_LABEL, getAssignment } from "@/content/scheme";
import {
  readScoreSheet,
  weightedTotal,
  SUBMISSION_STATE_LABEL,
} from "@/lib/assessment";
import { formatDate } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

export default async function MarkSubmissionPage({ params }: Params) {
  const { id } = await params;
  await requireMarker();

  const submission = await prisma.submission.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      review: { include: { reviewer: { select: { name: true } } } },
    },
  });
  if (!submission) notFound();

  const assignment = getAssignment(submission.assignmentId);
  const course = getCourse(submission.courseSlug);

  // Earlier attempts, so a mentor marks a resubmission against what the
  // learner was actually told last time rather than from memory.
  const earlier = await prisma.submission.findMany({
    where: {
      userId: submission.userId,
      assignmentId: submission.assignmentId,
      attempt: { lt: submission.attempt },
    },
    orderBy: { attempt: "desc" },
    include: { review: { include: { reviewer: { select: { name: true } } } } },
  });

  return (
    <>
      <Link
        href="/admin/submissions"
        className="inline-flex items-center gap-1.5 font-mono text-[0.6875rem] tracking-[0.16em] text-ink-faint uppercase transition-colors hover:text-forest"
      >
        <ArrowLeft className="size-3.5" /> Marking queue
      </Link>

      <div className="mt-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[0.625rem] tracking-[0.16em] text-ink-faint uppercase">
            {course?.code ?? submission.courseSlug}
          </span>
          {assignment ? (
            <Badge tone={assignment.aiPolicy === "unaided" ? "neutral" : "green"}>
              {AI_POLICY_LABEL[assignment.aiPolicy]}
            </Badge>
          ) : null}
          <Badge
            tone={
              submission.state === "ACCEPTED"
                ? "green"
                : submission.state === "SUBMITTED"
                  ? "neutral"
                  : "seal"
            }
          >
            {SUBMISSION_STATE_LABEL[submission.state]}
          </Badge>
        </div>
        <h1 className="mt-2 text-3xl text-ink">
          {assignment?.title ?? submission.assignmentId}
        </h1>
        <p className="mt-2 text-ink-soft">
          {submission.user.name} · {submission.user.email} · attempt{" "}
          {submission.attempt} · handed in {formatDate(submission.submittedAt)}
        </p>
      </div>

      <div className="mt-8 rounded-lg border border-edge bg-paper p-6">
        <h2 className="font-mono text-[0.6875rem] tracking-[0.16em] text-ink-soft uppercase">
          The work
        </h2>
        <a
          href={submission.url}
          target="_blank"
          rel="noreferrer"
          className="mt-3 block break-all font-mono text-[0.875rem] text-forest underline underline-offset-4"
        >
          {submission.url}
        </a>

        {submission.notes ? (
          <div className="mt-5 border-t border-edge pt-5">
            <p className="font-mono text-[0.6875rem] tracking-[0.16em] text-ink-soft uppercase">
              Their note
            </p>
            <p className="mt-2 leading-relaxed whitespace-pre-wrap text-ink-soft">
              {submission.notes}
            </p>
          </div>
        ) : null}

        {submission.aiDeclaration ? (
          <div className="mt-5 border-t border-edge pt-5">
            <p className="font-mono text-[0.6875rem] tracking-[0.16em] text-ink-soft uppercase">
              How they used AI, in their words
            </p>
            <p className="mt-2 leading-relaxed whitespace-pre-wrap text-ink-soft">
              {submission.aiDeclaration}
            </p>
          </div>
        ) : null}
      </div>

      {assignment ? (
        <div className="mt-6 rounded-lg border border-edge bg-mist p-6">
          <h2 className="font-mono text-[0.6875rem] tracking-[0.16em] text-ink-soft uppercase">
            The brief they were given
          </h2>
          <p className="mt-3 leading-relaxed text-ink-soft">{assignment.brief}</p>
        </div>
      ) : null}

      {earlier.length > 0 ? (
        <div className="mt-6 rounded-lg border border-edge bg-paper p-6">
          <h2 className="font-mono text-[0.6875rem] tracking-[0.16em] text-ink-soft uppercase">
            What they were told last time
          </h2>
          <div className="mt-4 space-y-5">
            {earlier.map((previous) => (
              <div key={previous.id} className="border-t border-edge pt-4 first:border-0 first:pt-0">
                <p className="font-mono text-[0.6875rem] text-ink-faint">
                  Attempt {previous.attempt} ·{" "}
                  {previous.review
                    ? `${previous.review.reviewer.name}, ${formatDate(previous.review.reviewedAt)}`
                    : "never marked"}
                </p>
                {previous.review ? (
                  <p className="mt-2 leading-relaxed whitespace-pre-wrap text-ink-soft">
                    {previous.review.comment}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-8">
        {!assignment ? (
          <p className="rounded-lg border border-seal/30 bg-seal-soft p-5 text-[0.9375rem] text-ink-soft">
            This assignment has been removed from the curriculum, so there is no
            rubric to mark it against. Speak to whoever changed the scheme of
            work before deciding what to do with this hand-in.
          </p>
        ) : submission.review ? (
          <div className="rounded-lg border border-edge bg-paper p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="font-mono text-[0.6875rem] tracking-[0.16em] text-ink-soft uppercase">
                Marked by {submission.review.reviewer.name} ·{" "}
                {formatDate(submission.review.reviewedAt)}
              </h2>
              <span className="font-display text-2xl text-ink">
                {weightedTotal(assignment, readScoreSheet(submission.review.scores))}%
              </span>
            </div>
            <p className="mt-4 leading-relaxed whitespace-pre-wrap text-ink-soft">
              {submission.review.comment}
            </p>
          </div>
        ) : (
          <ReviewForm submissionId={submission.id} rubric={assignment.rubric} />
        )}
      </div>
    </>
  );
}
