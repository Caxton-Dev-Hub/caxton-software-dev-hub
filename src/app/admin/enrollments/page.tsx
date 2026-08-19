import { PageTitle } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCourse } from "@/content/courses";
import { formatDate } from "@/lib/utils";

export default async function AdminEnrollmentsPage() {
  await requireAdmin();

  const enrollments = await prisma.enrollment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      payment: { select: { status: true, reference: true } },
    },
  });

  return (
    <>
      <PageTitle
        eyebrow="Admin"
        title="Enrolments"
        lead={`${enrollments.length} enrolment${enrollments.length === 1 ? "" : "s"} across all cohorts.`}
      />

      {enrollments.length === 0 ? (
        <p className="rounded-lg border border-dashed border-edge-strong bg-paper p-10 text-center text-ink-soft">
          No enrolments yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-edge bg-paper">
          <table className="w-full min-w-[52rem] text-left">
            <thead>
              <tr className="border-b border-edge">
                {["Student", "Course", "Enrolled", "Payment", "Status"].map((heading) => (
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
    </>
  );
}
