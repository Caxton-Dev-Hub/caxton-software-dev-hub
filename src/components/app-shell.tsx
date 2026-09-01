import Link from "next/link";
import type { User } from "@prisma/client";

import { Logo } from "@/components/logo";
import { DashboardNav, SignOutButton } from "@/components/dashboard-nav";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { Badge } from "@/components/ui/badge";
import { initials } from "@/lib/utils";

export function AppShell({
  user,
  area,
  children,
}: {
  user: User;
  area: "student" | "admin";
  children: React.ReactNode;
}) {
  const brand = (
    <span className="flex items-center gap-3">
      <Logo />
      {area === "admin" ? <Badge tone="seal">Admin</Badge> : null}
    </span>
  );

  return (
    <div className="min-h-dvh bg-mist">
      <div className="mx-auto flex w-full max-w-[88rem] flex-col lg:flex-row">
        <DashboardSidebar brand={brand}>
          {/* Below lg this fills the drawer under its header and scrolls on its
              own. From lg up it is exactly one viewport tall and sticks to the
              top, so the nav and the account block stay put as the page
              scrolls — `min-h-full` here made it as tall as the whole page,
              which left sticky nothing to do. */}
          <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-5 lg:sticky lg:top-0 lg:h-dvh">
            <div className="hidden items-center justify-between gap-4 lg:flex">
              <Logo />
              {area === "admin" ? <Badge tone="seal">Admin</Badge> : null}
            </div>

            <DashboardNav area={area} isAdmin={user.role === "ADMIN"} />

            <div className="mt-auto space-y-3 border-t border-edge pt-4">
              <div className="flex items-center gap-3 px-3">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-forest font-mono text-[0.75rem] text-white">
                  {initials(user.name)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[0.875rem] font-medium text-ink">
                    {user.name}
                  </span>
                  <span className="block truncate text-[0.75rem] text-ink-faint">
                    {user.email}
                  </span>
                </span>
              </div>
              <SignOutButton />
              <Link
                href="/"
                className="block px-3 pb-1 font-mono text-[0.625rem] tracking-[0.16em] text-ink-faint uppercase transition-colors hover:text-forest"
              >
                ← Back to site
              </Link>
            </div>
          </div>
        </DashboardSidebar>

        <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}

export function PageTitle({
  eyebrow,
  title,
  lead,
  action,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
      <div>
        {eyebrow ? (
          <p className="font-mono text-[0.625rem] tracking-[0.18em] text-forest uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-2 text-3xl text-ink">{title}</h1>
        {lead ? <p className="mt-2 max-w-2xl text-ink-soft">{lead}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed border-edge-strong bg-paper p-10 text-center">
      <h2 className="text-xl text-ink">{title}</h2>
      <p className="mx-auto mt-2 max-w-md leading-relaxed text-ink-soft">{body}</p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
