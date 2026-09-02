import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Circle, Sparkles } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageTitle, EmptyState } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { courseLessons, getCourse } from "@/content/courses";
import { AI_POLICY_LABEL, assignmentsFor, getScheme } from "@/content/scheme";
import { SUBMISSION_STATE_LABEL } from "@/lib/assessment";
import { formatKobo } from "@/lib/money";
import { formatDate } from "@/lib/utils";
import { EnrolButton } from "@/components/enrol-button";
import { toggleLesson } from "./actions";

type Params = { params: Promise<{ slug: string }> };

export default async function CourseWorkspacePage({ params }: Params) {
  const { slug } = await params;
  const user = await requireUser();

  const course = getCourse(slug);
  if (!course) notFound();

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseSlug: { userId: user.id, courseSlug: slug } },
  });

  // No seat on this course. Say so here rather than redirecting to the public
  // course page — being thrown out of the dashboard with no message reads as a
  // bug. A payment still in flight gets its own wording, because the webhook
  // can trail the redirect back from Flutterwave by a few seconds.
  if (!enrollment || enrollment.status === "CANCELLED") {
    const pending = await prisma.payment.findFirst({
      where: { userId: user.id, kind: "COURSE", itemSlug: slug, status: "PENDING" },
      orderBy: { createdAt: "desc" },
    });

    return (
      <>
        <Link
          href="/dashboard/courses"
          className="inline-flex items-center gap-1.5 font-mono text-[0.6875rem] tracking-[0.16em] text-ink-faint uppercase transition-colors hover:text-forest"
        >
          <ArrowLeft className="size-3.5" /> My courses
        </Link>

        <div className="mt-6">
          <PageTitle eyebrow="Learning" title={course.title} lead={course.subtitle} />
        </div>

        {pending ? (
          <EmptyState
            title="We are still confirming your payment"
            body="Your payment has not been confirmed by the bank yet. This usually takes a few seconds. Refresh this page shortly — we will also email you the moment your seat is confirmed."
            action={
              <ButtonLink href="/dashboard/payments" variant="secondary">
                View payments <ArrowRight className="size-4" />
              </ButtonLink>
            }
          />
        ) : (
          <EmptyState
            title={
              enrollment
                ? "Your enrolment on this course was cancelled"
                : "You do not hold a seat on this course yet"
            }
            body="The workspace — lessons, progress, and the study assistant — opens as soon as you are enrolled. Cohorts are capped, and you can reserve a seat with a part payment."
            action={
              <ButtonLink href={`/courses/${slug}`}>
                See the course and enrol <ArrowRight className="size-4" />
              </ButtonLink>
            }
          />
        )}
      </>
    );
  }

  const [progress, submissions] = await Promise.all([
    prisma.lessonProgress.findMany({
      where: { userId: user.id, courseSlug: slug },
    }),
    // The latest attempt per assignment is what the learner needs to see. Order
    // descending and keep the first of each, rather than asking Postgres for a
    // distinct-on that Prisma would express awkwardly.
    prisma.submission.findMany({
      where: { userId: user.id, courseSlug: slug },
      orderBy: { attempt: "desc" },
      select: { assignmentId: true, attempt: true, state: true },
    }),
  ]);
  const completed = new Set(progress.map((entry) => entry.lessonId));

  const latestByAssignment = new Map<string, (typeof submissions)[number]>();
  for (const submission of submissions) {
    if (!latestByAssignment.has(submission.assignmentId)) {
      latestByAssignment.set(submission.assignmentId, submission);
    }
  }

  const scheme = getScheme(slug);
  const assignments = scheme ? assignmentsFor(scheme) : [];

  const total = courseLessons(course).length;
  const percent = total === 0 ? 0 : Math.round((completed.size / total) * 100);

  return (
    <>
      <Link
        href="/dashboard/courses"
        className="inline-flex items-center gap-1.5 font-mono text-[0.6875rem] tracking-[0.16em] text-ink-faint uppercase transition-colors hover:text-forest"
      >
        <ArrowLeft className="size-3.5" /> My courses
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[0.625rem] tracking-[0.16em] text-ink-faint uppercase">
              {course.code}
            </span>
            <Badge tone={enrollment.status === "COMPLETED" ? "seal" : "green"}>
              {enrollment.status.toLowerCase()}
            </Badge>
          </div>
          <h1 className="mt-2 text-3xl text-ink">{course.title}</h1>
          <p className="mt-2 max-w-2xl text-ink-soft">{course.subtitle}</p>
        </div>

        <ButtonLink href={`/dashboard/assistant?course=${course.slug}`} variant="secondary">
          <Sparkles className="size-4" /> Ask about this course
        </ButtonLink>
      </div>

      {enrollment.balanceKobo > 0 ? (
        <div className="mt-8 rounded-lg border border-seal/30 bg-seal-soft p-6">
          <p className="font-mono text-[0.625rem] tracking-[0.16em] text-ink-faint uppercase">
            Balance outstanding
          </p>
          <p className="mt-2 font-display text-2xl text-ink">
            {formatKobo(enrollment.balanceKobo)}
          </p>
          <p className="mt-2 max-w-xl leading-relaxed text-ink-soft">
            You paid the first instalment to reserve this seat. The balance is
            due{" "}
            {enrollment.balanceDueAt
              ? `by ${formatDate(enrollment.balanceDueAt)}`
              : "before week five"}
            . Your access stays open in the meantime.
          </p>
          <EnrolButton
            kind="course"
            slug={course.slug}
            label={`Pay ${formatKobo(enrollment.balanceKobo)} balance`}
            returnTo={`/dashboard/courses/${course.slug}`}
            className="mt-5 max-w-xs"
          />
        </div>
      ) : null}

      <div className="mt-8 rounded-lg border border-edge bg-paper p-6">
        <div className="flex items-center justify-between font-mono text-[0.6875rem] tracking-wider text-ink-faint uppercase">
          <span>
            {completed.size} of {total} lessons complete
          </span>
          <span>{percent}%</span>
        </div>
        <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-mint">
          <div
            className="h-full rounded-full bg-signal transition-[width] duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        {percent === 100 ? (
          <p className="mt-4 text-[0.9375rem] text-forest">
            Every lesson ticked off. Your mentor will be in touch about your
            certificate and portfolio review.
          </p>
        ) : null}
      </div>

      <div className="mt-10 space-y-8">
        {course.modules.map((module, moduleIndex) => (
          <section key={module.title}>
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-sm text-forest">
                {String(moduleIndex + 1).padStart(2, "0")}
              </span>
              <h2 className="text-xl text-ink">{module.title}</h2>
            </div>

            <ul className="mt-4 divide-y divide-edge overflow-hidden rounded-lg border border-edge bg-paper">
              {module.lessons.map((lesson) => {
                const isDone = completed.has(lesson.id);
                return (
                  <li key={lesson.id} className="flex items-start gap-4 p-5">
                    <form action={toggleLesson} className="mt-0.5 shrink-0">
                      <input type="hidden" name="courseSlug" value={course.slug} />
                      <input type="hidden" name="lessonId" value={lesson.id} />
                      <button
                        type="submit"
                        aria-label={
                          isDone
                            ? `Mark "${lesson.title}" as not done`
                            : `Mark "${lesson.title}" as done`
                        }
                        className="grid size-6 place-items-center rounded-full border transition-colors"
                        style={{
                          borderColor: isDone
                            ? "var(--color-signal)"
                            : "var(--color-edge-strong)",
                          backgroundColor: isDone ? "var(--color-signal)" : "transparent",
                        }}
                      >
                        {isDone ? (
                          <Check className="size-3.5 text-white" strokeWidth={3} />
                        ) : (
                          <Circle className="size-3 text-transparent" />
                        )}
                      </button>
                    </form>

                    <div className="min-w-0 flex-1">
                      <h3
                        className={
                          isDone
                            ? "text-[1.0625rem] text-ink-faint line-through"
                            : "text-[1.0625rem] text-ink"
                        }
                      >
                        {lesson.title}
                      </h3>
                      <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-soft">
                        {lesson.summary}
                      </p>
                    </div>

                    <span className="shrink-0 font-mono text-[0.6875rem] text-ink-faint">
                      {lesson.minutes}m
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      {assignments.length > 0 ? (
        <div className="mt-12">
          <h2 className="text-xl text-ink">Assignments</h2>
          <p className="mt-2 max-w-2xl text-ink-soft">
            These are marked by your mentor against a rubric you can read before
            you start. Resubmitting after feedback is the normal path, not a
            penalty.
          </p>

          <ul className="mt-5 divide-y divide-edge overflow-hidden rounded-lg border border-edge bg-paper">
            {assignments.map((assignment) => {
              const latest = latestByAssignment.get(assignment.id);
              return (
                <li key={assignment.id}>
                  <Link
                    href={`/dashboard/courses/${course.slug}/assignments/${assignment.id}`}
                    className="flex items-start gap-4 p-5 transition-colors hover:bg-mist"
                  >
                    <span className="mt-0.5 shrink-0 font-mono text-[0.6875rem] tracking-[0.16em] text-ink-faint uppercase">
                      Wk {assignment.week}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[1.0625rem] text-ink">
                        {assignment.title}
                      </span>
                      <span className="mt-1.5 flex flex-wrap items-center gap-2">
                        <Badge
                          tone={assignment.aiPolicy === "unaided" ? "neutral" : "green"}
                        >
                          {AI_POLICY_LABEL[assignment.aiPolicy]}
                        </Badge>
                        {latest ? (
                          <Badge
                            tone={
                              latest.state === "ACCEPTED"
                                ? "green"
                                : latest.state === "SUBMITTED"
                                  ? "neutral"
                                  : "seal"
                            }
                          >
                            {SUBMISSION_STATE_LABEL[latest.state]}
                          </Badge>
                        ) : (
                          <span className="font-mono text-[0.6875rem] text-ink-faint">
                            Not handed in
                          </span>
                        )}
                      </span>
                    </span>
                    <ArrowRight className="mt-1 size-4 shrink-0 text-ink-faint" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <div className="mt-10 rounded-lg border border-edge bg-paper p-6">
        <h2 className="text-lg text-ink">Live sessions and materials</h2>
        <p className="mt-2 leading-relaxed text-ink-soft">
          Joining links and recordings are posted here each week once your cohort
          starts on <span className="text-ink">{course.nextCohort}</span>. Your
          mentor will email you the week before with everything you need to set
          up.
        </p>
      </div>
    </>
  );
}
