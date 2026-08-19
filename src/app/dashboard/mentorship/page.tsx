import { ArrowRight } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageTitle, EmptyState } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPlan } from "@/content/mentorship";
import { formatKobo } from "@/lib/money";
import { formatDate } from "@/lib/utils";

const statusTone = {
  SCHEDULED: "green",
  AWAITING_PAYMENT: "seal",
  COMPLETED: "neutral",
  CANCELLED: "neutral",
} as const;

export default async function DashboardMentorshipPage() {
  const user = await requireUser();

  const bookings = await prisma.mentorshipBooking.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { payment: true },
  });

  return (
    <>
      <PageTitle
        eyebrow="Mentorship"
        title="Your mentorship"
        lead="Bookings, the goal you set, and the payment behind each one."
        action={
          <ButtonLink href="/mentorship" variant="secondary">
            Browse plans
          </ButtonLink>
        }
      />

      {bookings.length === 0 ? (
        <EmptyState
          title="No mentorship booked yet"
          body="Every plan starts with a free 20-minute fit call and a written learning plan. You pay nothing until both of us think it will work."
          action={
            <ButtonLink href="/mentorship">
              See the plans <ArrowRight className="size-4" />
            </ButtonLink>
          }
        />
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => {
            const plan = getPlan(booking.planSlug);
            return (
              <li key={booking.id} className="rounded-lg border border-edge bg-paper p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl text-ink">
                      {plan?.name ?? booking.planSlug} mentorship
                    </h2>
                    <p className="mt-1 font-mono text-[0.6875rem] tracking-wider text-ink-faint uppercase">
                      Booked {formatDate(booking.createdAt)}
                      {plan ? ` · ${formatKobo(plan.priceKobo)} ${plan.cadence}` : ""}
                    </p>
                  </div>
                  <Badge tone={statusTone[booking.status]}>
                    {booking.status.replace(/_/g, " ").toLowerCase()}
                  </Badge>
                </div>

                <div className="mt-5 rounded-md border border-edge bg-mist p-4">
                  <p className="font-mono text-[0.625rem] tracking-[0.16em] text-ink-faint uppercase">
                    The goal you set
                  </p>
                  <p className="mt-2 leading-relaxed text-ink-soft">{booking.goal}</p>
                </div>

                {booking.status === "AWAITING_PAYMENT" ? (
                  <p className="mt-4 text-[0.9375rem] text-ink-soft">
                    This booking is waiting on payment. If you started a payment
                    and it did not complete, nothing was charged — start again
                    from the plan page.
                  </p>
                ) : null}

                {booking.status === "SCHEDULED" ? (
                  <p className="mt-4 text-[0.9375rem] text-ink-soft">
                    Confirmed. We will email you within one working day to agree a
                    recurring slot with your mentor.
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
