import type { Metadata } from "next";

import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  return (
    <AppShell user={user} area="student">
      {children}
    </AppShell>
  );
}
