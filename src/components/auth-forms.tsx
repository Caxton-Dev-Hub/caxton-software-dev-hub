"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";

function useNext() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  // Only ever redirect to a path on this site.
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
}

export function LoginForm() {
  const router = useRouter();
  const next = useNext();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const data = Object.fromEntries(new FormData(event.currentTarget));

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Could not sign you in");

      router.push(body.role === "ADMIN" ? "/admin" : next);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <h1 className="text-3xl text-ink">Sign in</h1>
        <p className="mt-2 text-ink-soft">
          New here?{" "}
          <Link
            href={`/register?next=${encodeURIComponent(next)}`}
            className="text-forest underline underline-offset-2"
          >
            Create an account
          </Link>
        </p>
      </div>

      <Field label="Email" htmlFor="email">
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </Field>

      <Field label="Password" htmlFor="password">
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </Field>

      {error ? (
        <p
          className="rounded-md border border-red-200 bg-red-50 px-3.5 py-2.5 text-[0.875rem] text-red-700"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={busy}>
        {busy ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const next = useNext();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setFieldErrors({});

    const data = Object.fromEntries(new FormData(event.currentTarget));

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await response.json();
      if (!response.ok) {
        if (body.fieldErrors) setFieldErrors(body.fieldErrors);
        throw new Error(body.error ?? "Could not create your account");
      }

      router.push(next);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <h1 className="text-3xl text-ink">Create your account</h1>
        <p className="mt-2 text-ink-soft">
          Already have one?{" "}
          <Link
            href={`/login?next=${encodeURIComponent(next)}`}
            className="text-forest underline underline-offset-2"
          >
            Sign in
          </Link>
        </p>
      </div>

      <Field label="Full name" htmlFor="name" error={fieldErrors.name}>
        <Input id="name" name="name" autoComplete="name" required />
      </Field>

      <Field label="Email" htmlFor="email" error={fieldErrors.email}>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </Field>

      <Field label="Phone (optional)" htmlFor="phone" error={fieldErrors.phone}>
        <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+234 …" />
      </Field>

      <Field
        label="Password"
        htmlFor="password"
        error={fieldErrors.password}
        hint="At least 10 characters. A short sentence works well."
      >
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={10}
          required
        />
      </Field>

      {error ? (
        <p
          className="rounded-md border border-red-200 bg-red-50 px-3.5 py-2.5 text-[0.875rem] text-red-700"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={busy}>
        {busy ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Creating account…
          </>
        ) : (
          "Create account"
        )}
      </Button>

      <p className="text-[0.8125rem] leading-relaxed text-ink-faint">
        By creating an account you agree to our{" "}
        <Link href="/legal/terms" className="underline underline-offset-2">
          terms of service
        </Link>{" "}
        and{" "}
        <Link href="/legal/privacy" className="underline underline-offset-2">
          privacy policy
        </Link>
        .
      </p>
    </form>
  );
}
