import { Badge } from "@/components/ui/badge";
import { PageTitle, EmptyState } from "@/components/app-shell";
import { ButtonLink } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCourse } from "@/content/courses";
import { getPlan } from "@/content/mentorship";
import { formatKobo } from "@/lib/money";
import { formatDateTime } from "@/lib/utils";

const tone = {
  PAID: "green",
  PENDING: "seal",
  FAILED: "neutral",
  ABANDONED: "neutral",
  REFUNDED: "neutral",
} as const;

export default async function PaymentsPage() {
  const user = await requireUser();

  const payments = await prisma.payment.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const paidTotal = payments
    .filter((payment) => payment.status === "PAID")
    .reduce((sum, payment) => sum + payment.amountKobo, 0);

  return (
    <>
      <PageTitle
        eyebrow="Billing"
        title="Payments"
        lead="Every transaction on your account, with the reference you would quote if you ever needed to query one."
      />

      {payments.length === 0 ? (
        <EmptyState
          title="No payments yet"
          body="When you enrol on a course or book mentorship, the receipt appears here immediately."
          action={<ButtonLink href="/courses">Browse courses</ButtonLink>}
        />
      ) : (
        <>
          <div className="mb-6 rounded-lg border border-edge bg-paper p-5">
            <p className="font-mono text-[0.625rem] tracking-[0.16em] text-ink-faint uppercase">
              Total paid
            </p>
            <p className="mt-2 font-display text-3xl text-ink">
              {formatKobo(paidTotal)}
            </p>
          </div>

          <div className="overflow-x-auto rounded-lg border border-edge bg-paper">
            <table className="w-full min-w-[46rem] text-left">
              <thead>
                <tr className="border-b border-edge">
                  {["Item", "Reference", "Date", "Amount", "Status"].map((heading) => (
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
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-5 py-4 text-[0.9375rem] text-ink">
                      {payment.kind === "COURSE"
                        ? (getCourse(payment.itemSlug)?.title ?? payment.itemSlug)
                        : `${getPlan(payment.itemSlug)?.name ?? payment.itemSlug} mentorship`}
                    </td>
                    <td className="px-5 py-4 font-mono text-[0.75rem] text-ink-faint">
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

          <p className="mt-5 text-[0.875rem] leading-relaxed text-ink-faint">
            Need a formal invoice with our registration number on it? Email us
            the reference and we will send one the same day.
          </p>
        </>
      )}
    </>
  );
}
