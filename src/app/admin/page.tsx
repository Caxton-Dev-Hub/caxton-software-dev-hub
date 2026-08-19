import Link from "next/link";
import { BookOpen, ClipboardList, CreditCard, Inbox, UsersRound } from "lucide-react";

import { PageTitle } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCourse } from "@/content/courses";
import { formatKobo } from "@/lib/money";
import { formatDateTime } from "@/lib/utils";

export default async function AdminOverviewPage() {
  await requireAdmin();

  const [
    users,
    enrollments,
    bookings,
    leads,
    waiting,
    paid,
    recentPayments,
    recentLeads,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.enrollment.count({ where: { status: { not: "CANCELLED" } } }),
    prisma.mentorshipBooking.count({ where: { status: "SCHEDULED" } }),
      prisma.lead.count({ where: { status: "NEW" } }),
      prisma.waitlistEntry.count({ where: { status: "WAITING" } }),
    prisma.payment.aggregate({
      where: { status: "PAID" },
      _sum: { amountKobo: true },
    }),
    prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const stats = [
    { label: "Registered users", value: String(users), icon: UsersRound, href: "/admin/enrollments" },
    { label: "Active enrolments", value: String(enrollments), icon: BookOpen, href: "/admin/enrollments" },
    { label: "Scheduled mentorship", value: String(bookings), icon: UsersRound, href: "/admin/bookings" },
    { label: "New enquiries", value: String(leads), icon: Inbox, href: "/admin/leads" },
    { label: "On the waitlist", value: String(waiting), icon: ClipboardList, href: "/admin/waitlist" },
  ];

  return (
    <>
      <PageTitle
        eyebrow="Admin"
        title="Overview"
        lead="Everything moving through the business right now."
      />

      <div className="mb-6 rounded-lg border border-forest/25 bg-mint/40 p-6">
        <p className="flex items-center gap-2 font-mono text-[0.625rem] tracking-[0.16em] text-forest uppercase">
          <CreditCard className="size-3.5" /> Collected to date
        </p>
        <p className="mt-2 font-display text-4xl text-ink">
          {formatKobo(paid._sum.amountKobo ?? 0)}
        </p>
      </div>

      <dl className="grid gap-px overflow-hidden rounded-lg border border-edge bg-edge sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="bg-paper p-5 transition-colors hover:bg-mist">
            <dt className="flex items-center gap-2 font-mono text-[0.625rem] tracking-[0.16em] text-ink-faint uppercase">
              <stat.icon className="size-3.5" />
              {stat.label}
            </dt>
            <dd className="mt-2.5 font-display text-2xl text-ink">{stat.value}</dd>
          </Link>
        ))}
      </dl>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-xl text-ink">Recent payments</h2>
            <Link
              href="/admin/payments"
              className="font-mono text-[0.6875rem] tracking-[0.16em] text-forest uppercase"
            >
              All
            </Link>
          </div>
          <ul className="divide-y divide-edge overflow-hidden rounded-lg border border-edge bg-paper">
            {recentPayments.length === 0 ? (
              <li className="p-5 text-ink-faint">Nothing yet.</li>
            ) : (
              recentPayments.map((payment) => (
                <li key={payment.id} className="flex items-center justify-between gap-4 p-4">
                  <div className="min-w-0">
                    <p className="truncate text-[0.9375rem] text-ink">
                      {payment.user.name}
                    </p>
                    <p className="truncate font-mono text-[0.6875rem] text-ink-faint">
                      {payment.kind === "COURSE"
                        ? (getCourse(payment.itemSlug)?.code ?? payment.itemSlug)
                        : payment.itemSlug}{" "}
                      · {formatDateTime(payment.createdAt)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="font-display text-[1.0625rem] text-ink">
                      {formatKobo(payment.amountKobo)}
                    </span>
                    <Badge tone={payment.status === "PAID" ? "green" : "neutral"}>
                      {payment.status.toLowerCase()}
                    </Badge>
                  </div>
                </li>
              ))
            )}
          </ul>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-xl text-ink">Recent enquiries</h2>
            <Link
              href="/admin/leads"
              className="font-mono text-[0.6875rem] tracking-[0.16em] text-forest uppercase"
            >
              All
            </Link>
          </div>
          <ul className="divide-y divide-edge overflow-hidden rounded-lg border border-edge bg-paper">
            {recentLeads.length === 0 ? (
              <li className="p-5 text-ink-faint">Nothing yet.</li>
            ) : (
              recentLeads.map((lead) => (
                <li key={lead.id} className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-[0.9375rem] text-ink">{lead.name}</p>
                    <Badge tone={lead.status === "NEW" ? "seal" : "neutral"}>
                      {lead.status.toLowerCase()}
                    </Badge>
                  </div>
                  <p className="mt-1 truncate font-mono text-[0.6875rem] text-ink-faint">
                    {lead.email} · {lead.service ?? "No service selected"}
                  </p>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </>
  );
}
