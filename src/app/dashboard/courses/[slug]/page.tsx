import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Check, Circle, Sparkles } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { courseLessons, getCourse } from "@/content/courses";
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
  if (!enrollment || enrollment.status === "CANCELLED") {
    redirect(`/courses/${slug}`);
  }

  const progress = await prisma.lessonProgress.findMany({
    where: { userId: user.id, courseSlug: slug },
  });
  const completed = new Set(progress.map((entry) => entry.lessonId));

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

      <div className="mt-10 rounded-lg border border-edge bg-paper p-6">
        <h2 className="text-lg text-ink">Live sessions and materials</h2>
        <p className="mt-2 leading-relaxed text-ink-soft">
          Joining links, recordings, and assignment repositories are posted here
          each week once your cohort starts on{" "}
          <span className="text-ink">{course.nextCohort}</span>. Your mentor will
          email you the week before with everything you need to set up.
        </p>
      </div>
    </>
  );
}
