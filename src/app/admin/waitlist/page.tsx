import { Users } from "lucide-react";

import { PageTitle } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { CopyEmails } from "@/components/copy-emails";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { waitlistOrder } from "@/lib/waitlist";
import { courses, getCourse } from "@/content/courses";
import { formatDate } from "@/lib/utils";
import { removeWaitlistEntry, setWaitlistStatus } from "@/app/admin/actions";

const options = ["WAITING", "INVITED", "CONVERTED", "DECLINED"] as const;

const tone = {
  WAITING: "seal",
  INVITED: "green",
  CONVERTED: "green",
  DECLINED: "neutral",
} as const;

export default async function AdminWaitlistPage() {
  await requireAdmin();

  const entries = await prisma.waitlistEntry.findMany({
    orderBy: [{ courseSlug: "asc" }, ...waitlistOrder],
  });

  // Group by course, preserving the queue order within each group.
  const byCourse = new Map<string, typeof entries>();
  for (const entry of entries) {
    const list = byCourse.get(entry.courseSlug) ?? [];
    list.push(entry);
    byCourse.set(entry.courseSlug, list);
  }

  const waitingTotal = entries.filter((entry) => entry.status === "WAITING").length;

  return (
    <>
      <PageTitle
        eyebrow="Admin"
        title="Waitlist"
        lead={`${waitingTotal} ${waitingTotal === 1 ? "person is" : "people are"} waiting across ${byCourse.size} ${byCourse.size === 1 ? "course" : "courses"}. Invite in order — the number beside each name is their place in the queue.`}
      />

      {entries.length === 0 ? (
        <div className="rounded-lg border border-dashed border-edge-strong bg-paper p-10 text-center">
          <Users className="mx-auto size-6 text-forest" />
          <h2 className="mt-4 text-xl text-ink">Nobody is waiting yet</h2>
          <p className="mx-auto mt-2 max-w-md leading-relaxed text-ink-soft">
            The waitlist form appears on any course marked{" "}
            <code className="font-mono text-[0.875rem]">
              availability: &quot;waitlist&quot;
            </code>{" "}
            in <code className="font-mono text-[0.875rem]">src/content/courses.ts</code>.
            {courses.some((course) => course.availability === "waitlist")
              ? ""
              : " No course is currently marked full."}
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {[...byCourse.entries()].map(([slug, list]) => {
            const course = getCourse(slug);
            const waiting = list.filter((entry) => entry.status === "WAITING");

            return (
              <section key={slug}>
                <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <h2 className="text-xl text-ink">{course?.title ?? slug}</h2>
                    <p className="mt-1 font-mono text-[0.6875rem] tracking-wider text-ink-faint uppercase">
                      {course?.code ?? slug} · {waiting.length} waiting ·{" "}
                      {list.length} total
                    </p>
                  </div>
                  <CopyEmails emails={waiting.map((entry) => entry.email)} />
                </div>

                <div className="overflow-x-auto rounded-lg border border-edge bg-paper">
                  <table className="w-full min-w-[54rem] text-left">
                    <thead>
                      <tr className="border-b border-edge">
                        {["#", "Person", "Note", "Joined", "Status", ""].map(
                          (heading) => (
                            <th
                              key={heading}
                              scope="col"
                              className="px-4 py-3 font-mono text-[0.625rem] tracking-[0.16em] text-ink-faint uppercase"
                            >
                              {heading}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-edge">
                      {list.map((entry) => (
                        <tr key={entry.id}>
                          <td className="px-4 py-4 font-mono text-[0.875rem] text-ink-faint">
                            {entry.status === "WAITING"
                              ? waiting.findIndex((item) => item.id === entry.id) + 1
                              : "—"}
                          </td>
                          <td className="px-4 py-4">
                            <span className="block text-[0.9375rem] text-ink">
                              {entry.name}
                              {entry.userId ? (
                                <span className="ml-2 font-mono text-[0.625rem] tracking-wider text-forest uppercase">
                                  has account
                                </span>
                              ) : null}
                            </span>
                            <span className="block font-mono text-[0.6875rem] text-ink-faint">
                              <a href={`mailto:${entry.email}`} className="hover:text-forest">
                                {entry.email}
                              </a>
                              {entry.phone ? ` · ${entry.phone}` : ""}
                            </span>
                          </td>
                          <td className="max-w-xs px-4 py-4 text-[0.875rem] leading-relaxed text-ink-soft">
                            {entry.note ?? "—"}
                          </td>
                          <td className="px-4 py-4 text-[0.875rem] whitespace-nowrap text-ink-soft">
                            {formatDate(entry.createdAt)}
                            {entry.invitedAt ? (
                              <span className="block font-mono text-[0.625rem] tracking-wider text-ink-faint uppercase">
                                invited {formatDate(entry.invitedAt)}
                              </span>
                            ) : null}
                          </td>
                          <td className="px-4 py-4">
                            <Badge tone={tone[entry.status]}>
                              {entry.status.toLowerCase()}
                            </Badge>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <form action={setWaitlistStatus} className="flex items-center gap-1.5">
                                <input type="hidden" name="id" value={entry.id} />
                                <label htmlFor={`wl-${entry.id}`} className="sr-only">
                                  Status for {entry.name}
                                </label>
                                <select
                                  id={`wl-${entry.id}`}
                                  name="status"
                                  defaultValue={entry.status}
                                  className="rounded-md border border-edge-strong bg-paper px-2 py-1.5 text-[0.8125rem]"
                                >
                                  {options.map((option) => (
                                    <option key={option} value={option}>
                                      {option.toLowerCase()}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  type="submit"
                                  className="rounded-md bg-forest px-3 py-1.5 text-[0.8125rem] whitespace-nowrap text-white transition-colors hover:bg-forest-deep"
                                >
                                  Save
                                </button>
                              </form>
                              <form action={removeWaitlistEntry}>
                                <input type="hidden" name="id" value={entry.id} />
                                <button
                                  type="submit"
                                  className="rounded-md border border-edge px-2.5 py-1.5 text-[0.8125rem] text-ink-faint transition-colors hover:border-red-300 hover:text-red-700"
                                  title={`Remove ${entry.name} from the waitlist`}
                                >
                                  Remove
                                </button>
                              </form>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}
