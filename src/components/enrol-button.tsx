"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  kind: "course" | "mentorship";
  slug: string;
  plan?: "full" | "instalment";
  goal?: string;
  label: string;
  variant?: "primary" | "secondary" | "inverse";
  className?: string;
  /** Where to send an unauthenticated visitor back to after signing in. */
  returnTo: string;
};

export function EnrolButton({
  kind,
  slug,
  plan = "full",
  goal,
  label,
  variant = "primary",
  className,
  returnTo,
}: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    setBusy(true);
    setError(null);
    try {
      const endpoint =
        kind === "course" ? "/api/checkout/course" : "/api/checkout/mentorship";
      const payload =
        kind === "course"
          ? { courseSlug: slug, plan }
          : { planSlug: slug, goal: goal ?? "" };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        router.push(`/login?next=${encodeURIComponent(returnTo)}`);
        return;
      }

      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Could not start checkout");

      if (body.authorizationUrl) {
        window.location.href = body.authorizationUrl;
        return;
      }
      router.push(body.redirect ?? "/dashboard");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong");
      setBusy(false);
    }
  }

  return (
    <div className={className}>
      <Button
        onClick={start}
        disabled={busy}
        variant={variant}
        size="lg"
        className="w-full"
      >
        {busy ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Starting checkout…
          </>
        ) : (
          <>
            {label} <ArrowRight className="size-4" />
          </>
        )}
      </Button>
      {error ? (
        <p className="mt-2.5 text-[0.8125rem] text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
