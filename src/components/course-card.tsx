import Link from "next/link";
import { ArrowUpRight, Clock, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { isWaitlisted, type Course } from "@/content/courses";
import { formatKobo } from "@/lib/money";

export function CourseCard({ course }: { course: Course }) {
  const waitlisted = isWaitlisted(course);

  return (
    <article className="group relative flex flex-col rounded-lg border border-edge bg-paper p-6 transition-colors hover:border-forest/40">
      <div className="flex items-start justify-between gap-4">
        <span className="font-mono text-[0.6875rem] tracking-[0.16em] text-ink-faint uppercase">
          {course.code}
        </span>
        <div className="flex flex-wrap justify-end gap-1.5">
          {waitlisted ? <Badge tone="seal">Waitlist</Badge> : null}
          <Badge tone={course.level === "Advanced" ? "seal" : "green"}>
            {course.level}
          </Badge>
        </div>
      </div>

      <h3 className="mt-4 text-xl leading-snug text-ink">
        <Link href={`/courses/${course.slug}`} className="after:absolute after:inset-0">
          {course.title}
        </Link>
      </h3>

      <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-ink-soft">
        {course.subtitle}
      </p>

      <dl className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.8125rem] text-ink-faint">
        <div className="flex items-center gap-1.5">
          <Clock className="size-3.5" />
          <dt className="sr-only">Duration</dt>
          <dd>
            {course.weeks} weeks · {course.hoursPerWeek}h/week
          </dd>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="size-3.5" />
          <dt className="sr-only">Seats</dt>
          <dd>{course.seats} seats</dd>
        </div>
      </dl>

      <div className="mt-5 flex items-end justify-between border-t border-edge pt-5">
        <div>
          <p className="font-mono text-[0.625rem] tracking-[0.16em] text-ink-faint uppercase">
            {waitlisted ? "Tuition · cohort full" : "Tuition"}
          </p>
          <p className="mt-1 font-display text-xl text-ink">
            {formatKobo(course.priceKobo)}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-forest transition-transform group-hover:translate-x-0.5">
          Syllabus
          <ArrowUpRight className="size-4" />
        </span>
      </div>
    </article>
  );
}
