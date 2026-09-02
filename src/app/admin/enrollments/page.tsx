import { PageTitle } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCourse } from "@/content/courses";
import { formatDate } from "@/lib/utils";
import { formatKobo } from "@/lib/money";
import { Pagination } from "@/components/ui/pagination";
import { PER_PAGE, paginate, parsePage } from "@/lib/pagination";

type Params = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminEnrollmentsPage({ searchParams }: Params) {
  await requireAdmin();

  const query = await searchParams;
  const total = await prisma.enrollment.count();
  const info = paginate(total, parsePage(query.page), PER_PAGE);

  const [enrollments, owingRows, overdueRows] = await Promise.all([
    prisma.enrollment.findMany({
      orderBy: { createdAt: "desc" },
      skip: info.skip,
      take: info.take,
      include: {
        user: { select: { name: true, email: true, phone: true } },
        payment: { select: { status: true, reference: true } },
      },
    }),
    // Arrears are a property of the whole ledger, not of the page on screen, so
    // this reads every unpaid seat regardless of which page is being viewed.
    prisma.enrollment.findMany({
      where: { balanceKobo: { gt: 0 }, status: { not: "CANCELLED" } },
      select: { id: true, balanceKobo: true },
    }),
    // Let Postgres compare against its own clock — `now()` in a query is not a
    // render-time side effect the way `Date.now()` in the component body is.
    prisma.enrollment.findMany({
      where: { balanceKobo: { gt: 0 }, balanceDueAt: { lt: new Date() } },
      select: { id: true },
    }),
  ]);

  const overdueIds = new Set(overdueRows.map((row) => row.id));

  // Arrears: an active seat that has not been paid off. Surfaced at the top
  // because "who still owes money" was previously unanswerable.
  //
  // Overdue is decided by the database (see `overdueIds` above) rather than by
  // reading a clock during render, which is impure and lint-flagged.
  const owing = owingRows;
  const owedTotal = owing.reduce(
    (sum, enrollment) => sum + enrollment.balanceKobo,
    0,
  );
  const overdue = owing.filter((enrollment) => overdueIds.has(enrollment.id));

  return (
    <>
      <PageTitle
        eyebrow="Admin"
        title="Enrolments"
        lead={`${total} enrolment${total === 1 ? "" : "s"} across all cohorts.`}
      />

      {owing.length > 0 ? (
        <div className="mb-6 rounded-lg border border-seal/30 bg-seal-soft p-5">
          <p className="font-mono text-[0.625rem] tracking-[0.16em] text-ink-faint uppercase">
            Outstanding instalment balances
          </p>
          <p className="mt-2 font-display text-2xl text-ink">
            {formatKobo(owedTotal)}
          </p>
          <p className="mt-1.5 text-[0.875rem] text-ink-soft">
            Across {owing.length} enrolment{owing.length === 1 ? "" : "s"}
            {overdue.length > 0
              ? ` — ${overdue.length} past the due date`
              : ""}
            .
          </p>
        </div>
      ) : null}

      {enrollments.length === 0 ? (
        <p className="rounded-lg border border-dashed border-edge-strong bg-paper p-10 text-center text-ink-soft">
          No enrolments yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-edge bg-paper">
          <table className="w-full min-w-[52rem] text-left">
            <thead>
              <tr className="border-b border-edge">
                {["Student", "Course", "Enrolled", "Payment", "Balance", "Status"].map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="px-5 py-3 font-mono text-[0.625rem] tracking-[0.16em] text-ink-faint uppercase"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-edge">
              {enrollments.map((enrollment) => (
                <tr key={enrollment.id}>
                  <td className="px-5 py-4">
                    <span className="block text-[0.9375rem] text-ink">
                      {enrollment.user.name}
                    </span>
                    <span className="block font-mono text-[0.6875rem] text-ink-faint">
                      {enrollment.user.email}
                      {enrollment.user.phone ? ` · ${enrollment.user.phone}` : ""}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[0.9375rem] text-ink-soft">
                    {getCourse(enrollment.courseSlug)?.title ?? enrollment.courseSlug}
                  </td>
                  <td className="px-5 py-4 text-[0.875rem] whitespace-nowrap text-ink-soft">
                    {formatDate(enrollment.createdAt)}
                  </td>
                  <td className="px-5 py-4 font-mono text-[0.6875rem] text-ink-faint">
                    {enrollment.payment?.reference ?? "—"}
                  </td>
                  <td className="px-5 py-4 text-[0.875rem] whitespace-nowrap">
                    {enrollment.balanceKobo > 0 ? (
                      <>
                        <span className="text-ink">
                          {formatKobo(enrollment.balanceKobo)}
                        </span>
                        {enrollment.balanceDueAt ? (
                          <span
                            className={`block font-mono text-[0.6875rem] ${
                              overdueIds.has(enrollment.id)
                                ? "text-red-700"
                                : "text-ink-faint"
                            }`}
                          >
                            due {formatDate(enrollment.balanceDueAt)}
                          </span>
                        ) : null}
                      </>
                    ) : (
                      <span className="text-ink-faint">paid</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <Badge tone={enrollment.status === "ACTIVE" ? "green" : "neutral"}>
                      {enrollment.status.toLowerCase()}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination
        info={info}
        basePath="/admin/enrollments"
        params={query}
        label="enrolments"
      />
    </>
  );
}
