import type { Metadata } from "next";

import { AppShell } from "@/components/app-shell";
import { requireMarker } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The layout admits mentors as well as administrators, because marking
  // lives in here. Every page still runs its own guard — `requireAdmin` on the
  // money and pipeline pages, `requireMarker` on the marking queue — so this
  // widening does not expose anything on its own.
  const user = await requireMarker();
  return (
    <AppShell user={user} area="admin">
      {children}
    </AppShell>
  );
}
