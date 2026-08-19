import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageTitle, EmptyState } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { courseLessons, getCourse } from "@/content/courses";
import { queuePositions, waitlistOrder } from "@/lib/waitlist";
import { formatDate } from "@/lib/utils";

export default async function MyCoursesPage() {
  const user = await requireUser();

  const [enrollments, progress, waitlist] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.lessonProgress.findMany({ where: { userId: user.id } }),
    prisma.waitlistEntry.findMany({
      where: {
        status: { in: ["WAITING", "INVITED"] },
        OR: [{ userId: user.id }, { email: user.email }],
      },
      orderBy: waitlistOrder,
    }),
  ]);

  // Their place in each queue, resolved the same way the join endpoint does.
  const positions = await queuePositions(waitlist);

  const done = new Map<string, number>();
  for (const entry of progress) {
    done.set(entry.courseSlug, (done.get(entry.courseSlug) ?? 0) + 1);
  }

  return (
    <>
      <PageTitle
        eyebrow="Learning"
        title="My courses"
        lead="Everything you hold a seat on, with your progress through each syllabus."
        action={
          <ButtonLink href="/courses" variant="secondary">
            Browse catalogue
          </ButtonLink>
        }
      />

      {enrollments.length === 0 ? (
        <EmptyState
          title="No enrolments yet"
          body="Cohorts are capped, so seats go early. Pick a course and reserve one with a part payment if you prefer."
          action={
            <ButtonLink href="/courses">
              Browse courses <ArrowRight className="size-4" />
            </ButtonLink>
          }
        />
      ) : (
        <ul className="space-y-4">
          {enrollments.map((enrollment) => {
            const course = getCourse(enrollment.courseSlug);
            if (!course) return null;
            const total = courseLessons(course).length;
            const completed = done.get(course.slug) ?? 0;
            const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

            return (
              <li
                key={enrollment.id}
                className="rounded-lg border border-edge bg-paper p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[0.625rem] tracking-[0.16em] text-ink-faint uppercase">
                        {course.code}
                      </span>
                      <Badge tone={enrollment.status === "ACTIVE" ? "green" : "neutral"}>
                        {enrollment.status.toLowerCase()}
                      </Badge>
                    </div>
                    <h2 className="mt-2 text-xl text-ink">
                      <Link href={`/dashboard/courses/${course.slug}`}>
                        {course.title}
                      </Link>
                    </h2>
                    <p className="mt-1.5 font-mono text-[0.6875rem] tracking-wider text-ink-faint uppercase">
                      Enrolled {formatDate(enrollment.createdAt)} · next cohort{" "}
                      {course.nextCohort}
                    </p>
                  </div>

                  <ButtonLink href={`/dashboard/courses/${course.slug}`} size="sm">
                    Open <ArrowRight className="size-3.5" />
                  </ButtonLink>
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between font-mono text-[0.6875rem] tracking-wider text-ink-faint uppercase">
                    <span>
                      {completed} of {total} lessons complete
                    </span>
                    <span>{percent}%</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-mint">
                    <div
                      className="h-full rounded-full bg-signal transition-[width] duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {waitlist.length > 0 ? (
        <section className="mt-12">
          <h2 className="mb-4 text-xl text-ink">Waiting for a seat</h2>
          <ul className="divide-y divide-edge overflow-hidden rounded-lg border border-edge bg-paper">
            {waitlist.map((entry) => {
              const course = getCourse(entry.courseSlug);
              const invited = entry.status === "INVITED";

              return (
                <li
                  key={entry.id}
                  className="flex flex-wrap items-center justify-between gap-4 p-5"
                >
                  <div className="min-w-0">
                    <h3 className="text-[1.0625rem] text-ink">
                      <Link href={`/courses/${entry.courseSlug}`}>
                        {course?.title ?? entry.courseSlug}
                      </Link>
                    </h3>
                    <p className="mt-1 flex items-center gap-1.5 font-mono text-[0.6875rem] tracking-wider text-ink-faint uppercase">
                      <Clock className="size-3.5" />
                      Joined {formatDate(entry.createdAt)}
                      {course ? ` · next cohort ${course.nextCohort}` : ""}
                    </p>
                  </div>

                  {invited ? (
                    <Badge tone="green">Seat offered — check your email</Badge>
                  ) : (
                    <span className="text-right">
                      <span className="block font-display text-xl text-ink">
                        #{positions.get(entry.id)}
                      </span>
                      <span className="font-mono text-[0.625rem] tracking-[0.14em] text-ink-faint uppercase">
                        in the queue
                      </span>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-[0.875rem] text-ink-faint">
            We email the waitlist in order when a seat opens, and hold it for 48
            hours before offering it to the next person.
          </p>
        </section>
      ) : null}
    </>
  );
}
