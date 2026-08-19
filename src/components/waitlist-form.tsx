"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Loader2, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";

type Props = {
  courseSlug: string;
  courseTitle: string;
  nextCohort: string;
  /** Prefilled when the visitor is signed in. */
  defaults?: { name: string; email: string; phone: string };
  /** How many people are already waiting, for social proof. */
  waiting: number;
  /** Rendered on a dark panel rather than a light card. */
  onDark?: boolean;
};

export function WaitlistForm({
  courseSlug,
  courseTitle,
  nextCohort,
  defaults,
  waiting,
  onDark = false,
}: Props) {
  const [state, setState] = useState<"idle" | "sending" | "joined">("idle");
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ position: number; alreadyOn: boolean } | null>(
    null,
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setError(null);
    setFieldErrors({});

    const data = Object.fromEntries(new FormData(event.currentTarget));

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, courseSlug }),
      });
      const body = await response.json();

      if (!response.ok) {
        if (body.fieldErrors) setFieldErrors(body.fieldErrors);
        throw new Error(body.error ?? "Could not add you to the waitlist");
      }

      setResult({ position: body.position, alreadyOn: body.alreadyOn });
      setState("joined");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong");
      setState("idle");
    }
  }

  if (state === "joined" && result) {
    return (
      <div
        className={
          onDark
            ? "rounded-lg border border-white/15 bg-white/[0.06] p-6"
            : "rounded-lg border border-forest/30 bg-mint/50 p-6"
        }
      >
        <Check className="size-6 text-signal" strokeWidth={2.5} />
        <h3 className={`mt-4 text-xl ${onDark ? "text-white" : "text-ink"}`}>
          {result.alreadyOn ? "You were already on the list" : "You are on the list"}
        </h3>
        <p
          className={`mt-2.5 leading-relaxed ${onDark ? "text-mint/75" : "text-ink-soft"}`}
        >
          You are number{" "}
          <span className={onDark ? "font-medium text-white" : "font-medium text-ink"}>
            {result.position}
          </span>{" "}
          in the queue for {courseTitle}. When a seat opens — or when we set the
          date for the cohort after {nextCohort} — we email the waitlist first,
          in order, and hold the seat for 48 hours.
        </p>
        <p
          className={`mt-3 text-[0.8125rem] leading-relaxed ${
            onDark ? "text-mint/55" : "text-ink-faint"
          }`}
        >
          Nothing has been charged, and this does not commit you to enrolling.
          Check your email for confirmation.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={
        onDark
          ? "rounded-lg border border-white/15 bg-white/[0.04] p-6"
          : "rounded-lg border border-edge bg-paper p-6"
      }
      noValidate
    >
      <p
        className={`flex items-center gap-2 font-mono text-[0.625rem] tracking-[0.16em] uppercase ${
          onDark ? "text-signal" : "text-forest"
        }`}
      >
        <Users className="size-3.5" />
        {waiting > 0
          ? `${waiting} ${waiting === 1 ? "person is" : "people are"} waiting`
          : "Join the waitlist"}
      </p>

      <h3 className={`mt-3 text-xl ${onDark ? "text-white" : "text-ink"}`}>
        This cohort is full
      </h3>
      <p
        className={`mt-2 text-[0.9375rem] leading-relaxed ${
          onDark ? "text-mint/75" : "text-ink-soft"
        }`}
      >
        Leave your details and we will email you first when a seat opens or the
        next cohort is dated. No payment, no commitment.
      </p>

      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor={`wl-website-${courseSlug}`}>Website</label>
        <input
          id={`wl-website-${courseSlug}`}
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="mt-5 space-y-4">
        <Field label="Your name" htmlFor={`wl-name-${courseSlug}`} error={fieldErrors.name}>
          <Input
            id={`wl-name-${courseSlug}`}
            name="name"
            autoComplete="name"
            required
            defaultValue={defaults?.name}
            placeholder="Amina Yusuf"
          />
        </Field>

        <Field label="Email" htmlFor={`wl-email-${courseSlug}`} error={fieldErrors.email}>
          <Input
            id={`wl-email-${courseSlug}`}
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={defaults?.email}
            placeholder="you@example.com"
          />
        </Field>

        {expanded ? (
          <>
            <Field
              label="Phone (optional)"
              htmlFor={`wl-phone-${courseSlug}`}
              error={fieldErrors.phone}
            >
              <Input
                id={`wl-phone-${courseSlug}`}
                name="phone"
                type="tel"
                autoComplete="tel"
                defaultValue={defaults?.phone}
                placeholder="+234 …"
              />
            </Field>
            <Field
              label="Anything we should know? (optional)"
              htmlFor={`wl-note-${courseSlug}`}
              error={fieldErrors.note}
              hint="Your background, or which start dates would work for you."
            >
              <Textarea
                id={`wl-note-${courseSlug}`}
                name="note"
                className="min-h-24"
                maxLength={600}
              />
            </Field>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className={`text-[0.875rem] underline underline-offset-4 ${
              onDark ? "text-mint/70 hover:text-white" : "text-ink-faint hover:text-forest"
            }`}
          >
            Add a phone number or a note
          </button>
        )}

        {error ? (
          <p
            className="rounded-md border border-red-200 bg-red-50 px-3.5 py-2.5 text-[0.875rem] text-red-700"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <Button
          type="submit"
          size="lg"
          variant={onDark ? "inverse" : "primary"}
          className="w-full"
          disabled={state === "sending"}
        >
          {state === "sending" ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Adding you…
            </>
          ) : (
            "Join the waitlist"
          )}
        </Button>

        <p
          className={`text-[0.8125rem] leading-relaxed ${
            onDark ? "text-mint/55" : "text-ink-faint"
          }`}
        >
          We use your details only to contact you about this course. See our{" "}
          <Link href="/legal/privacy" className="underline underline-offset-2">
            privacy policy
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
