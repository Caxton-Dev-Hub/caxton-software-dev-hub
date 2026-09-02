import { PageTitle } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCourse } from "@/content/courses";
import { getPlan } from "@/content/mentorship";
import { formatKobo } from "@/lib/money";
import { formatDateTime } from "@/lib/utils";
import { Pagination } from "@/components/ui/pagination";
import { PER_PAGE, paginate, parsePage } from "@/lib/pagination";

const tone = {
  PAID: "green",
  PENDING: "seal",
  FAILED: "neutral",
  ABANDONED: "neutral",
  REFUNDED: "neutral",
} as const;

type Params = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminPaymentsPage({ searchParams }: Params) {
  await requireAdmin();

  const query = await searchParams;
  const total = await prisma.payment.count();
  const info = paginate(total, parsePage(query.page), PER_PAGE);

  const [payments, totals] = await Promise.all([
    prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      skip: info.skip,
      take: info.take,
      include: { user: { select: { name: true, email: true } } },
    }),
    // Deliberately unpaginated: the summary is of every payment ever taken,
    // not of the twenty rows on screen. A total that changed as you turned the
    // page would be worse than no total at all.
    prisma.payment.groupBy({
      by: ["status"],
      _sum: { amountKobo: true },
      _count: true,
    }),
  ]);

  return (
    <>
      <PageTitle
        eyebrow="Admin"
        title="Payments"
        lead="Every transaction, newest first. Amounts are stored in kobo and shown in naira."
      />

      <dl className="mb-6 grid gap-px overflow-hidden rounded-lg border border-edge bg-edge sm:grid-cols-2 lg:grid-cols-4">
        {totals.map((total) => (
          <div key={total.status} className="bg-paper p-5">
            <dt className="font-mono text-[0.625rem] tracking-[0.16em] text-ink-faint uppercase">
              {total.status.toLowerCase()} ({total._count})
            </dt>
            <dd className="mt-2 font-display text-xl text-ink">
              {formatKobo(total._sum.amountKobo ?? 0)}
            </dd>
          </div>
        ))}
      </dl>

      {payments.length === 0 ? (
        <p className="rounded-lg border border-dashed border-edge-strong bg-paper p-10 text-center text-ink-soft">
          No payments yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-edge bg-paper">
          <table className="w-full min-w-[56rem] text-left">
            <thead>
              <tr className="border-b border-edge">
                {["Customer", "Item", "Reference", "Date", "Amount", "Status"].map(
                  (heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="px-5 py-3 font-mono text-[0.625rem] tracking-[0.16em] text-ink-faint uppercase"
                    >
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-edge">
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-5 py-4">
                    <span className="block text-[0.9375rem] text-ink">
                      {payment.user.name}
                    </span>
                    <span className="block font-mono text-[0.6875rem] text-ink-faint">
                      {payment.user.email}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[0.9375rem] text-ink-soft">
                    {payment.kind === "COURSE"
                      ? (getCourse(payment.itemSlug)?.code ?? payment.itemSlug)
                      : (getPlan(payment.itemSlug)?.name ?? payment.itemSlug)}
                  </td>
                  <td className="px-5 py-4 font-mono text-[0.6875rem] text-ink-faint">
                    {payment.reference}
                  </td>
                  <td className="px-5 py-4 text-[0.875rem] whitespace-nowrap text-ink-soft">
                    {formatDateTime(payment.createdAt)}
                  </td>
                  <td className="px-5 py-4 font-display text-[1.0625rem] whitespace-nowrap text-ink">
                    {formatKobo(payment.amountKobo)}
                  </td>
                  <td className="px-5 py-4">
                    <Badge tone={tone[payment.status]}>
                      {payment.status.toLowerCase()}
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
        basePath="/admin/payments"
        params={query}
        label="payments"
      />
    </>
  );
}
