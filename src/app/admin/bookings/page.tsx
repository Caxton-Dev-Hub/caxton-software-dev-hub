import { PageTitle } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPlan } from "@/content/mentorship";
import { formatDate } from "@/lib/utils";
import { setBookingStatus } from "@/app/admin/actions";
import { Pagination } from "@/components/ui/pagination";
import { PER_PAGE, paginate, parsePage } from "@/lib/pagination";

const options = ["AWAITING_PAYMENT", "SCHEDULED", "COMPLETED", "CANCELLED"] as const;

type Params = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminBookingsPage({ searchParams }: Params) {
  await requireAdmin();

  const query = await searchParams;
  const total = await prisma.mentorshipBooking.count();
  const info = paginate(total, parsePage(query.page), PER_PAGE);

  const bookings = await prisma.mentorshipBooking.findMany({
    orderBy: { createdAt: "desc" },
    skip: info.skip,
    take: info.take,
    include: {
      user: { select: { name: true, email: true } },
      payment: { select: { status: true, reference: true } },
    },
  });

  return (
    <>
      <PageTitle
        eyebrow="Admin"
        title="Mentorship bookings"
        lead="Every application, the goal the learner set, and where each one has got to."
      />

      {bookings.length === 0 ? (
        <p className="rounded-lg border border-dashed border-edge-strong bg-paper p-10 text-center text-ink-soft">
          No bookings yet.
        </p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li key={booking.id} className="rounded-lg border border-edge bg-paper p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg text-ink">
                    {booking.user.name} —{" "}
                    {getPlan(booking.planSlug)?.name ?? booking.planSlug}
                  </h2>
                  <p className="mt-1 font-mono text-[0.6875rem] text-ink-faint">
                    {booking.user.email} · booked {formatDate(booking.createdAt)}
                    {booking.payment ? ` · ${booking.payment.reference}` : ""}
                  </p>
                </div>
                <Badge tone={booking.status === "SCHEDULED" ? "green" : "neutral"}>
                  {booking.status.replace(/_/g, " ").toLowerCase()}
                </Badge>
              </div>

              <p className="mt-4 rounded-md border border-edge bg-mist p-4 leading-relaxed text-ink-soft">
                {booking.goal}
              </p>

              <form action={setBookingStatus} className="mt-4 flex flex-wrap items-center gap-2">
                <input type="hidden" name="id" value={booking.id} />
                <label
                  htmlFor={`status-${booking.id}`}
                  className="font-mono text-[0.625rem] tracking-[0.16em] text-ink-faint uppercase"
                >
                  Set status
                </label>
                <select
                  id={`status-${booking.id}`}
                  name="status"
                  defaultValue={booking.status}
                  className="rounded-md border border-edge-strong bg-paper px-3 py-1.5 text-[0.875rem]"
                >
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option.replace(/_/g, " ").toLowerCase()}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="rounded-md bg-forest px-3.5 py-1.5 text-[0.875rem] text-white transition-colors hover:bg-forest-deep"
                >
                  Update
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
      <Pagination
        info={info}
        basePath="/admin/bookings"
        params={query}
        label="bookings"
      />
    </>
  );
}
