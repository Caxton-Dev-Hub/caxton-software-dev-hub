import type { Metadata } from "next";

import { AppShell } from "@/components/app-shell";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();
  return (
    <AppShell user={user} area="admin">
      {children}
    </AppShell>
  );
}
