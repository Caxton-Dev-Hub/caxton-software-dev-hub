import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PageTitle } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { requireMarker } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCourse } from "@/content/courses";
import { AI_POLICY_LABEL, getAssignment } from "@/content/scheme";
import { SUBMISSION_STATE_LABEL } from "@/lib/assessment";
import { formatDate } from "@/lib/utils";
import { Pagination } from "@/components/ui/pagination";
import { PER_PAGE, paginate, parsePage } from "@/lib/pagination";

type Params = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function MarkingQueuePage({ searchParams }: Params) {
  await requireMarker();

  const query = await searchParams;
  const markedTotal = await prisma.submission.count({
    where: { state: { not: "SUBMITTED" } },
  });
  const info = paginate(markedTotal, parsePage(query.page), PER_PAGE);

  const [waiting, marked] = await Promise.all([
    // The queue itself is never paginated. A mentor needs to see everything
    // that is waiting; if it grows past one screen that is a fact worth
    // confronting, not one to hide behind a page control. Oldest first, which
    // is the only ordering a learner would call fair.
    prisma.submission.findMany({
      where: { state: "SUBMITTED" },
      orderBy: { submittedAt: "asc" },
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.submission.findMany({
      where: { state: { not: "SUBMITTED" } },
      orderBy: { submittedAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        review: { select: { reviewedAt: true, reviewer: { select: { name: true } } } },
      },
      skip: info.skip,
      take: info.take,
    }),
  ]);

  return (
    <>
      <PageTitle
        eyebrow="Marking"
        title="Assignment queue"
        lead={
          waiting.length === 0
            ? "Nothing is waiting to be marked."
            : `${waiting.length} submission${waiting.length === 1 ? "" : "s"} waiting, oldest first.`
        }
      />

      {waiting.length === 0 && markedTotal === 0 ? (
        <p className="rounded-lg border border-dashed border-edge-strong bg-paper p-10 text-center text-ink-soft">
          No work has been handed in yet.
        </p>
      ) : null}

      {waiting.length > 0 ? (
        <ul className="divide-y divide-edge overflow-hidden rounded-lg border border-edge bg-paper">
          {waiting.map((submission) => {
            const assignment = getAssignment(submission.assignmentId);
            return (
              <li key={submission.id}>
                <Link
                  href={`/admin/submissions/${submission.id}`}
                  className="flex items-start gap-4 p-5 transition-colors hover:bg-mist"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[1.0625rem] text-ink">
                      {assignment?.title ?? submission.assignmentId}
                    </span>
                    <span className="mt-1 block text-[0.875rem] text-ink-soft">
                      {submission.user.name} ·{" "}
                      {getCourse(submission.courseSlug)?.code ?? submission.courseSlug}
                      {submission.attempt > 1 ? ` · attempt ${submission.attempt}` : ""}
                    </span>
                    <span className="mt-2 flex flex-wrap items-center gap-2">
                      {assignment ? (
                        <Badge
                          tone={assignment.aiPolicy === "unaided" ? "neutral" : "green"}
                        >
                          {AI_POLICY_LABEL[assignment.aiPolicy]}
                        </Badge>
                      ) : null}
                      <span className="font-mono text-[0.6875rem] text-ink-faint">
                        handed in {formatDate(submission.submittedAt)}
                      </span>
                    </span>
                  </span>
                  <ArrowRight className="mt-1 size-4 shrink-0 text-ink-faint" />
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}

      {marked.length > 0 ? (
        <div className="mt-10">
          <h2 className="font-mono text-[0.6875rem] tracking-[0.16em] text-ink-soft uppercase">
            Already marked
          </h2>
          <div className="mt-4 overflow-x-auto rounded-lg border border-edge bg-paper">
            <table className="w-full min-w-[46rem] text-left">
              <thead>
                <tr className="border-b border-edge">
                  {["Student", "Assignment", "Attempt", "Marked by", "Outcome"].map(
                    (heading) => (
                      <th
                        key={heading}
                        scope="col"
                        className="px-5 py-3 font-mono text-[0.625rem] tracking-[0.16em] text-ink-faint uppercase"
                      >
                        {heading}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-edge">
                {marked.map((submission) => (
                  <tr key={submission.id}>
                    <td className="px-5 py-4">
                      <span className="block text-[0.9375rem] text-ink">
                        {submission.user.name}
                      </span>
                      <span className="block font-mono text-[0.6875rem] text-ink-faint">
                        {submission.user.email}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[0.9375rem] text-ink-soft">
                      {getAssignment(submission.assignmentId)?.title ??
                        submission.assignmentId}
                    </td>
                    <td className="px-5 py-4 font-mono text-[0.6875rem] text-ink-faint">
                      {submission.attempt}
                    </td>
                    <td className="px-5 py-4 text-[0.875rem] whitespace-nowrap text-ink-soft">
                      {submission.review
                        ? `${submission.review.reviewer.name} · ${formatDate(submission.review.reviewedAt)}`
                        : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <Badge
                        tone={submission.state === "ACCEPTED" ? "green" : "seal"}
                      >
                        {SUBMISSION_STATE_LABEL[submission.state]}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            info={info}
            basePath="/admin/submissions"
            params={query}
            label="marked"
          />
        </div>
      ) : null}
    </>
  );
}
