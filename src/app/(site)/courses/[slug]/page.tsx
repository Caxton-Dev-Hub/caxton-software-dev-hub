import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Check, Clock, Lock, Play, Users } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { EnrolButton } from "@/components/enrol-button";
import { WaitlistForm } from "@/components/waitlist-form";
import {
  courseHours,
  courseLessons,
  courses,
  getCourse,
  isWaitlisted,
} from "@/content/courses";
import { formatKobo, instalmentKobo } from "@/lib/money";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) return { title: "Course not found" };
  return {
    title: course.title,
    description: course.subtitle,
  };
}

export default async function CoursePage({ params }: Params) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  const lessons = courseLessons(course);
  const returnTo = `/courses/${course.slug}`;
  const waitlisted = isWaitlisted(course);

  // Both are best-effort: the page must still render without a database.
  const [user, waiting] = await Promise.all([
    waitlisted ? getCurrentUser().catch(() => null) : Promise.resolve(null),
    waitlisted
      ? prisma.waitlistEntry
          .count({ where: { courseSlug: course.slug, status: "WAITING" } })
          .catch(() => 0)
      : Promise.resolve(0),
  ]);

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.subtitle,
    provider: {
      "@type": "Organization",
      name: "Caxton Software Dev Hub",
    },
    offers: {
      "@type": "Offer",
      price: (course.priceKobo / 100).toFixed(2),
      priceCurrency: "NGN",
      category: "Paid",
      availability: waitlisted
        ? "https://schema.org/PreOrder"
        : "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />

      <header className="border-b border-edge bg-mist">
        <Container>
          <div className="grid gap-10 py-14 sm:py-20 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <Link
                href="/courses"
                className="inline-flex items-center gap-1.5 font-mono text-[0.6875rem] tracking-[0.16em] text-ink-faint uppercase transition-colors hover:text-forest"
              >
                <ArrowLeft className="size-3.5" /> All courses
              </Link>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                <Badge tone="neutral">{course.code}</Badge>
                <Badge tone={course.level === "Advanced" ? "seal" : "green"}>
                  {course.level}
                </Badge>
                <Badge tone="neutral">{course.format}</Badge>
                {waitlisted ? <Badge tone="seal">Cohort full</Badge> : null}
              </div>

              <h1 className="mt-5 text-[clamp(2rem,4.6vw,3.25rem)] leading-[1.04] tracking-[-0.032em]">
                {course.title}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
                {course.subtitle}
              </p>

              <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
                {[
                  { icon: Clock, label: "Duration", value: `${course.weeks} weeks` },
                  {
                    icon: Play,
                    label: "Lesson content",
                    value: `${courseHours(course)}h across ${lessons.length} lessons`,
                  },
                  { icon: Users, label: "Seats", value: `${course.seats} per cohort` },
                  { icon: CalendarDays, label: "Next start", value: course.nextCohort },
                ].map((item) => (
                  <div key={item.label}>
                    <dt className="flex items-center gap-1.5 font-mono text-[0.625rem] tracking-[0.16em] text-ink-faint uppercase">
                      <item.icon className="size-3.5" />
                      {item.label}
                    </dt>
                    <dd className="mt-1.5 text-[0.9375rem] text-ink">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="lg:col-span-5">
              {waitlisted ? (
                <div className="space-y-4">
                  <div className="rounded-lg border border-edge bg-paper p-6">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="font-mono text-[0.625rem] tracking-[0.16em] text-ink-faint uppercase">
                          Tuition when a seat opens
                        </p>
                        <p className="mt-2 font-display text-3xl text-ink">
                          {formatKobo(course.priceKobo)}
                        </p>
                      </div>
                      <p className="text-right font-mono text-[0.625rem] leading-relaxed tracking-[0.14em] text-seal uppercase">
                        {course.seats} / {course.seats}
                        <br />
                        seats taken
                      </p>
                    </div>
                  </div>

                  <WaitlistForm
                    courseSlug={course.slug}
                    courseTitle={course.title}
                    nextCohort={course.nextCohort}
                    waiting={waiting}
                    defaults={
                      user
                        ? {
                            name: user.name,
                            email: user.email,
                            phone: user.phone ?? "",
                          }
                        : undefined
                    }
                  />
                </div>
              ) : (
              <div className="rounded-lg border border-edge bg-paper p-7 shadow-[0_16px_40px_-30px_rgba(6,54,32,0.5)]">
                <p className="font-mono text-[0.625rem] tracking-[0.16em] text-ink-faint uppercase">
                  Tuition
                </p>
                <p className="mt-2 font-display text-4xl text-ink">
                  {formatKobo(course.priceKobo)}
                </p>
                <p className="mt-2 text-[0.9375rem] text-ink-soft">
                  Or {formatKobo(instalmentKobo(course.priceKobo))} now and the
                  balance before week five.
                </p>

                <div className="mt-6 space-y-3">
                  <EnrolButton
                    kind="course"
                    slug={course.slug}
                    plan="full"
                    label="Pay in full and enrol"
                    returnTo={returnTo}
                  />
                  <EnrolButton
                    kind="course"
                    slug={course.slug}
                    plan="instalment"
                    variant="secondary"
                    label={`Pay ${formatKobo(instalmentKobo(course.priceKobo))} to reserve a seat`}
                    returnTo={returnTo}
                  />
                </div>

                <ul className="mt-6 space-y-2 border-t border-edge pt-5">
                  {[
                    "AI study assistant scoped to this curriculum",
                    "Written code review on every assignment",
                    "Recordings of every live session",
                    "Certificate naming the work you shipped",
                  ].map((item) => (
                    <li key={item} className="flex gap-2.5 text-[0.875rem] text-ink-soft">
                      <Check className="mt-0.5 size-4 shrink-0 text-signal" strokeWidth={2.5} />
                      {item}
                    </li>
                  ))}
                </ul>

                <p className="mt-5 text-[0.8125rem] leading-relaxed text-ink-faint">
                  Payment is processed by Flutterwave in naira. Full refund up to
                  seven days before the cohort starts —{" "}
                  <Link href="/legal/refunds" className="underline underline-offset-2">
                    refund policy
                  </Link>
                  .
                </p>
              </div>
              )}
            </div>
          </div>
        </Container>
      </header>

      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-8">
              <h2 className="font-mono text-[0.6875rem] tracking-[0.16em] text-forest uppercase">
                Syllabus
              </h2>

              <div className="mt-6 space-y-8">
                {course.modules.map((module, moduleIndex) => (
                  <div key={module.title}>
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono text-sm text-forest">
                        {String(moduleIndex + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-xl text-ink">{module.title}</h3>
                    </div>

                    <ul className="mt-4 divide-y divide-edge overflow-hidden rounded-lg border border-edge">
                      {module.lessons.map((lesson) => (
                        <li
                          key={lesson.id}
                          className="flex items-start gap-4 bg-paper p-5"
                        >
                          <span className="mt-0.5 shrink-0">
                            {lesson.preview ? (
                              <Play className="size-4 text-signal" />
                            ) : (
                              <Lock className="size-4 text-ink-faint" />
                            )}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-[1.0625rem] text-ink">
                                {lesson.title}
                              </h4>
                              {lesson.preview ? (
                                <Badge tone="green">Free preview</Badge>
                              ) : null}
                            </div>
                            <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-soft">
                              {lesson.summary}
                            </p>
                          </div>
                          <span className="shrink-0 font-mono text-[0.6875rem] text-ink-faint">
                            {lesson.minutes}m
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <aside className="lg:col-span-4">
              <div className="sticky top-28 space-y-6">
                <div className="rounded-lg border border-edge bg-mist p-6">
                  <h2 className="font-mono text-[0.6875rem] tracking-[0.16em] text-ink-soft uppercase">
                    By the end you can
                  </h2>
                  <ul className="mt-4 space-y-2.5">
                    {course.outcomes.map((outcome) => (
                      <li
                        key={outcome}
                        className="flex gap-2.5 text-[0.9375rem] leading-relaxed text-ink-soft"
                      >
                        <Check className="mt-1 size-4 shrink-0 text-signal" strokeWidth={2.5} />
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg border border-edge bg-paper p-6">
                  <h2 className="font-mono text-[0.6875rem] tracking-[0.16em] text-ink-soft uppercase">
                    What you need first
                  </h2>
                  <ul className="mt-4 space-y-2.5">
                    {course.requirements.map((requirement) => (
                      <li key={requirement} className="text-[0.9375rem] leading-relaxed text-ink-soft">
                        {requirement}
                      </li>
                    ))}
                  </ul>

                  <h2 className="mt-6 font-mono text-[0.6875rem] tracking-[0.16em] text-ink-soft uppercase">
                    Tools you will use
                  </h2>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {course.tools.map((tool) => (
                      <li
                        key={tool}
                        className="rounded border border-edge bg-mist px-2.5 py-1 font-mono text-[0.6875rem] text-ink-soft"
                      >
                        {tool}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
