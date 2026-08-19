import Link from "next/link";
import { ArrowRight, BookOpen, CreditCard, Sparkles, UsersRound } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageTitle, EmptyState } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { courseLessons, getCourse } from "@/content/courses";
import { getPlan } from "@/content/mentorship";
import { formatKobo } from "@/lib/money";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const user = await requireUser();

  const [enrollments, bookings, payments, progress] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId: user.id, status: { not: "CANCELLED" } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.mentorshipBooking.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.payment.findMany({
      where: { userId: user.id, status: "PAID" },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.lessonProgress.findMany({ where: { userId: user.id } }),
  ]);

  const completedByCourse = new Map<string, number>();
  for (const entry of progress) {
    completedByCourse.set(
      entry.courseSlug,
      (completedByCourse.get(entry.courseSlug) ?? 0) + 1,
    );
  }

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amountKobo, 0);

  const stats = [
    { label: "Active courses", value: String(enrollments.length), icon: BookOpen },
    {
      label: "Mentorship",
      value: String(bookings.filter((b) => b.status === "SCHEDULED").length),
      icon: UsersRound,
    },
    {
      label: "Lessons completed",
      value: String(progress.length),
      icon: Sparkles,
    },
    { label: "Paid to date", value: formatKobo(totalPaid), icon: CreditCard },
  ];

  return (
    <>
      <PageTitle
        eyebrow={`Welcome back, ${user.name.split(" ")[0]}`}
        title="Your dashboard"
        lead="Everything you are enrolled on, plus the assistant and your payment history."
        action={
          <ButtonLink href="/dashboard/assistant" variant="secondary">
            <Sparkles className="size-4" /> Ask the assistant
          </ButtonLink>
        }
      />

      <dl className="grid gap-px overflow-hidden rounded-lg border border-edge bg-edge sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-paper p-5">
            <dt className="flex items-center gap-2 font-mono text-[0.625rem] tracking-[0.16em] text-ink-faint uppercase">
              <stat.icon className="size-3.5" />
              {stat.label}
            </dt>
            <dd className="mt-2.5 font-display text-2xl text-ink">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="text-xl text-ink">Continue learning</h2>
          <Link
            href="/dashboard/courses"
            className="font-mono text-[0.6875rem] tracking-[0.16em] text-forest uppercase"
          >
            All courses
          </Link>
        </div>

        {enrollments.length === 0 ? (
          <EmptyState
            title="You are not enrolled on anything yet"
            body="Pick a course and we will hold a seat for you on the next cohort. Instalment plans are available on all cohort courses."
            action={
              <ButtonLink href="/courses">
                Browse courses <ArrowRight className="size-4" />
              </ButtonLink>
            }
          />
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {enrollments.map((enrollment) => {
              const course = getCourse(enrollment.courseSlug);
              if (!course) return null;
              const total = courseLessons(course).length;
              const done = completedByCourse.get(course.slug) ?? 0;
              const percent = total === 0 ? 0 : Math.round((done / total) * 100);

              return (
                <li
                  key={enrollment.id}
                  className="rounded-lg border border-edge bg-paper p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-mono text-[0.625rem] tracking-[0.16em] text-ink-faint uppercase">
                      {course.code}
                    </span>
                    <Badge tone={enrollment.status === "COMPLETED" ? "seal" : "green"}>
                      {enrollment.status === "COMPLETED" ? "Completed" : "Active"}
                    </Badge>
                  </div>

                  <h3 className="mt-3 text-lg leading-snug text-ink">
                    <Link href={`/dashboard/courses/${course.slug}`}>
                      {course.title}
                    </Link>
                  </h3>

                  <div className="mt-5">
                    <div className="flex items-center justify-between font-mono text-[0.6875rem] tracking-wider text-ink-faint uppercase">
                      <span>
                        {done} of {total} lessons
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

                  <ButtonLink
                    href={`/dashboard/courses/${course.slug}`}
                    variant="secondary"
                    size="sm"
                    className="mt-5"
                  >
                    Continue <ArrowRight className="size-3.5" />
                  </ButtonLink>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-4 text-xl text-ink">Mentorship</h2>
          {bookings.length === 0 ? (
            <EmptyState
              title="No mentorship booked"
              body="A mentor reads your code before every call, so the call is spent on the hard part."
              action={
                <ButtonLink href="/mentorship" variant="secondary">
                  See the plans
                </ButtonLink>
              }
            />
          ) : (
            <ul className="divide-y divide-edge overflow-hidden rounded-lg border border-edge bg-paper">
              {bookings.map((booking) => {
                const plan = getPlan(booking.planSlug);
                return (
                  <li key={booking.id} className="flex items-center justify-between gap-4 p-5">
                    <div className="min-w-0">
                      <p className="text-[0.9375rem] text-ink">
                        {plan?.name ?? booking.planSlug}
                      </p>
                      <p className="mt-0.5 font-mono text-[0.6875rem] tracking-wider text-ink-faint uppercase">
                        Booked {formatDate(booking.createdAt)}
                      </p>
                    </div>
                    <Badge tone={booking.status === "SCHEDULED" ? "green" : "neutral"}>
                      {booking.status.replace("_", " ").toLowerCase()}
                    </Badge>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-xl text-ink">Recent payments</h2>
          {payments.length === 0 ? (
            <EmptyState
              title="No payments yet"
              body="Receipts appear here the moment a payment clears, and you can download them any time."
            />
          ) : (
            <ul className="divide-y divide-edge overflow-hidden rounded-lg border border-edge bg-paper">
              {payments.map((payment) => (
                <li key={payment.id} className="flex items-center justify-between gap-4 p-5">
                  <div className="min-w-0">
                    <p className="truncate text-[0.9375rem] text-ink">
                      {payment.kind === "COURSE"
                        ? (getCourse(payment.itemSlug)?.title ?? payment.itemSlug)
                        : `${getPlan(payment.itemSlug)?.name ?? payment.itemSlug} mentorship`}
                    </p>
                    <p className="mt-0.5 font-mono text-[0.6875rem] tracking-wider text-ink-faint uppercase">
                      {formatDate(payment.createdAt)}
                    </p>
                  </div>
                  <span className="shrink-0 font-display text-lg text-ink">
                    {formatKobo(payment.amountKobo)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
