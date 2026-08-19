import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";

import { RegisterForm } from "@/components/auth-forms";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Create an account",
  robots: { index: false, follow: false },
};

export default async function RegisterPage() {
  const session = await getSession().catch(() => null);
  if (session) redirect("/dashboard");

  return (
    <Suspense fallback={<p className="text-ink-faint">Loading…</p>}>
      <RegisterForm />
    </Suspense>
  );
}
