import { PageTitle } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";
import { setLeadStatus } from "@/app/admin/actions";
import { Pagination } from "@/components/ui/pagination";
import { PER_PAGE, paginate, parsePage } from "@/lib/pagination";

const options = ["NEW", "CONTACTED", "QUALIFIED", "CLOSED"] as const;

type Params = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminLeadsPage({ searchParams }: Params) {
  await requireAdmin();

  const query = await searchParams;
  const total = await prisma.lead.count();
  const info = paginate(total, parsePage(query.page), PER_PAGE);

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    skip: info.skip,
    take: info.take,
  });

  return (
    <>
      <PageTitle
        eyebrow="Admin"
        title="Enquiries"
        lead="Everything that came through the contact form, newest first."
      />

      {leads.length === 0 ? (
        <p className="rounded-lg border border-dashed border-edge-strong bg-paper p-10 text-center text-ink-soft">
          No enquiries yet.
        </p>
      ) : (
        <ul className="space-y-4">
          {leads.map((lead) => (
            <li key={lead.id} className="rounded-lg border border-edge bg-paper p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg text-ink">
                    {lead.name}
                    {lead.company ? (
                      <span className="text-ink-faint"> · {lead.company}</span>
                    ) : null}
                  </h2>
                  <p className="mt-1 font-mono text-[0.6875rem] text-ink-faint">
                    <a href={`mailto:${lead.email}`} className="hover:text-forest">
                      {lead.email}
                    </a>
                    {lead.phone ? ` · ${lead.phone}` : ""} ·{" "}
                    {formatDateTime(lead.createdAt)}
                  </p>
                </div>
                <Badge tone={lead.status === "NEW" ? "seal" : "neutral"}>
                  {lead.status.toLowerCase()}
                </Badge>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {lead.service ? <Badge tone="green">{lead.service}</Badge> : null}
                {lead.budget ? <Badge>{lead.budget}</Badge> : null}
              </div>

              <p className="mt-4 rounded-md border border-edge bg-mist p-4 leading-relaxed whitespace-pre-wrap text-ink-soft">
                {lead.message}
              </p>

              <form action={setLeadStatus} className="mt-4 flex flex-wrap items-center gap-2">
                <input type="hidden" name="id" value={lead.id} />
                <label
                  htmlFor={`lead-status-${lead.id}`}
                  className="font-mono text-[0.625rem] tracking-[0.16em] text-ink-faint uppercase"
                >
                  Set status
                </label>
                <select
                  id={`lead-status-${lead.id}`}
                  name="status"
                  defaultValue={lead.status}
                  className="rounded-md border border-edge-strong bg-paper px-3 py-1.5 text-[0.875rem]"
                >
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option.toLowerCase()}
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
        basePath="/admin/leads"
        params={query}
        label="enquiries"
      />
    </>
  );
}
