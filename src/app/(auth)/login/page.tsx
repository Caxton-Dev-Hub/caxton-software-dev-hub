import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth-forms";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const session = await getSession().catch(() => null);
  if (session) redirect("/dashboard");

  return (
    <Suspense fallback={<p className="text-ink-faint">Loading…</p>}>
      <LoginForm />
    </Suspense>
  );
}
