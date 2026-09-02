import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/app-shell";
import { ButtonLink } from "@/components/ui/button";
import { AssignmentForm } from "@/components/assignment-form";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCourse } from "@/content/courses";
import { AI_POLICY_LABEL, assignmentsFor, getScheme } from "@/content/scheme";
import { readScoreSheet, weightedTotal, SUBMISSION_STATE_LABEL } from "@/lib/assessment";
import { formatDate } from "@/lib/utils";

type Params = { params: Promise<{ slug: string; assignmentId: string }> };

export default async function AssignmentPage({ params }: Params) {
  const { slug, assignmentId } = await params;
  const user = await requireUser();

  const course = getCourse(slug);
  const scheme = getScheme(slug);
  if (!course || !scheme) notFound();

  const assignment = assignmentsFor(scheme).find((a) => a.id === assignmentId);
  if (!assignment) notFound();

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseSlug: { userId: user.id, courseSlug: slug } },
  });

  if (!enrollment || enrollment.status === "CANCELLED") {
    return (
      <EmptyState
        title="You do not hold a seat on this course"
        body="Assignments open once you are enrolled."
        action={<ButtonLink href={`/courses/${slug}`}>See the course</ButtonLink>}
      />
    );
  }

  const attempts = await prisma.submission.findMany({
    where: { userId: user.id, assignmentId },
    orderBy: { attempt: "desc" },
    include: {
      review: {
        include: { reviewer: { select: { name: true } } },
      },
    },
  });

  const latest = attempts[0];
  const accepted = latest?.state === "ACCEPTED";
  const awaiting = latest?.state === "SUBMITTED";

  return (
    <>
      <Link
        href={`/dashboard/courses/${slug}`}
        className="inline-flex items-center gap-1.5 font-mono text-[0.6875rem] tracking-[0.16em] text-ink-faint uppercase transition-colors hover:text-forest"
      >
        <ArrowLeft className="size-3.5" /> {course.title}
      </Link>

      <div className="mt-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[0.625rem] tracking-[0.16em] text-ink-faint uppercase">
            Week {assignment.week}
          </span>
          <Badge tone={assignment.aiPolicy === "unaided" ? "neutral" : "green"}>
            {AI_POLICY_LABEL[assignment.aiPolicy]}
          </Badge>
          {latest ? (
            <Badge tone={accepted ? "green" : awaiting ? "neutral" : "seal"}>
              {SUBMISSION_STATE_LABEL[latest.state]}
            </Badge>
          ) : null}
        </div>
        <h1 className="mt-2 text-3xl text-ink">{assignment.title}</h1>
      </div>

      <div className="mt-8 rounded-lg border border-edge bg-paper p-6">
        <h2 className="font-mono text-[0.6875rem] tracking-[0.16em] text-ink-soft uppercase">
          The brief
        </h2>
        <p className="mt-4 leading-relaxed text-ink-soft">{assignment.brief}</p>
        <p className="mt-4 font-mono text-[0.6875rem] text-ink-faint">
          Due {assignment.dueOffsetDays} days after the session.
        </p>
      </div>

      {/* The rubric is shown to the learner, not kept back for the marker. If a
          criterion cannot be stated plainly enough to publish in advance, it is
          not a criterion — it is a preference, and marking on it is unfair. */}
      <div className="mt-6 rounded-lg border border-edge bg-paper p-6">
        <h2 className="font-mono text-[0.6875rem] tracking-[0.16em] text-ink-soft uppercase">
          How this is marked
        </h2>
        <ul className="mt-4 divide-y divide-edge">
          {assignment.rubric.map((row) => (
            <li key={row.criterion} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-[1.0625rem] text-ink">{row.criterion}</h3>
                <span className="shrink-0 font-mono text-[0.6875rem] text-ink-faint">
                  {row.weight}%
                </span>
              </div>
              <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-soft">
                {row.looksLike}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        {accepted ? (
          <p className="flex items-center gap-2 rounded-lg border border-forest/25 bg-mint p-5 text-[0.9375rem] text-forest">
            <Check className="size-4 shrink-0 text-signal" />
            Accepted. Nothing further to hand in.
          </p>
        ) : awaiting ? (
          <p className="rounded-lg border border-edge bg-mist p-5 text-[0.9375rem] text-ink-soft">
            Attempt {latest.attempt} is with your mentor. Their feedback appears
            here once they have read it.
          </p>
        ) : (
          <AssignmentForm
            assignmentId={assignment.id}
            submitAs={assignment.submitAs}
            aiPolicy={assignment.aiPolicy}
            attempt={(latest?.attempt ?? 0) + 1}
          />
        )}
      </div>

      {attempts.length > 0 ? (
        <div className="mt-10">
          <h2 className="text-xl text-ink">Your attempts</h2>
          <div className="mt-4 space-y-4">
            {attempts.map((submission) => {
              const scores = readScoreSheet(submission.review?.scores);
              const total = submission.review
                ? weightedTotal(assignment, scores)
                : null;

              return (
                <article
                  key={submission.id}
                  className="rounded-lg border border-edge bg-paper p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="font-mono text-[0.6875rem] tracking-[0.16em] text-ink-faint uppercase">
                      Attempt {submission.attempt} ·{" "}
                      {formatDate(submission.submittedAt)}
                    </span>
                    <div className="flex items-center gap-2">
                      {total !== null ? (
                        <span className="font-mono text-[0.6875rem] text-ink">
                          {total}%
                        </span>
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
                  </div>

                  <a
                    href={submission.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 block truncate font-mono text-[0.8125rem] text-forest underline underline-offset-4"
                  >
                    {submission.url}
                  </a>

                  {submission.review ? (
                    <div className="mt-5 border-t border-edge pt-5">
                      <p className="font-mono text-[0.6875rem] tracking-[0.16em] text-ink-soft uppercase">
                        {submission.review.reviewer.name} ·{" "}
                        {formatDate(submission.review.reviewedAt)}
                      </p>
                      <p className="mt-3 leading-relaxed whitespace-pre-wrap text-ink-soft">
                        {submission.review.comment}
                      </p>

                      <ul className="mt-5 space-y-2">
                        {assignment.rubric.map((row) => {
                          const score = scores[row.criterion];
                          if (typeof score !== "number") return null;
                          return (
                            <li
                              key={row.criterion}
                              className="flex items-center gap-3"
                            >
                              <span className="min-w-0 flex-1 truncate text-[0.875rem] text-ink-soft">
                                {row.criterion}
                              </span>
                              <span className="h-1.5 w-24 shrink-0 overflow-hidden rounded-full bg-mint">
                                <span
                                  className="block h-full rounded-full bg-signal"
                                  style={{ width: `${score}%` }}
                                />
                              </span>
                              <span className="w-10 shrink-0 text-right font-mono text-[0.6875rem] text-ink-faint">
                                {score}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>
      ) : null}
    </>
  );
}
