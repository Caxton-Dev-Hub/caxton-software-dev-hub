"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Check, Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { services } from "@/content/services";

const budgets = [
  "Under ₦500,000",
  "₦500,000 – ₦1.5m",
  "₦1.5m – ₦5m",
  "Over ₦5m",
  "Not sure yet",
];

export function ContactForm() {
  const searchParams = useSearchParams();
  const preselected = searchParams.get("service") ?? "";

  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setErrors({});

    const data = Object.fromEntries(new FormData(event.currentTarget));

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await response.json();

      if (!response.ok) {
        if (body.fieldErrors) setErrors(body.fieldErrors);
        throw new Error(body.error ?? "Could not send your message");
      }

      setState("sent");
    } catch (cause) {
      setState("error");
      setMessage(cause instanceof Error ? cause.message : "Something went wrong");
    }
  }

  if (state === "sent") {
    return (
      <div className="rounded-lg border border-forest/30 bg-mint/50 p-8">
        <Check className="size-7 text-signal" strokeWidth={2.5} />
        <h2 className="mt-4 text-2xl text-ink">Message received</h2>
        <p className="mt-3 leading-relaxed text-ink-soft">
          A person — not an autoresponder — will reply within one working day.
          If it is urgent, call the number on this page.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {/* Honeypot: hidden from people, tempting to bots. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" htmlFor="name" error={errors.name}>
          <Input id="name" name="name" autoComplete="name" required placeholder="Amina Yusuf" />
        </Field>
        <Field label="Email" htmlFor="email" error={errors.email}>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@company.com"
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Phone (optional)" htmlFor="phone" error={errors.phone}>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+234 …" />
        </Field>
        <Field label="Company (optional)" htmlFor="company" error={errors.company}>
          <Input id="company" name="company" autoComplete="organization" />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="What do you need?" htmlFor="service">
          <Select id="service" name="service" defaultValue={preselected}>
            <option value="">Choose one…</option>
            {services.map((service) => (
              <option key={service.slug} value={service.title}>
                {service.title}
              </option>
            ))}
            <option value="Mentorship">Mentorship</option>
            <option value="Training for my team">Training for my team</option>
            <option value="Something else">Something else</option>
          </Select>
        </Field>
        <Field label="Budget range" htmlFor="budget">
          <Select id="budget" name="budget" defaultValue="">
            <option value="">Prefer not to say</option>
            {budgets.map((budget) => (
              <option key={budget} value={budget}>
                {budget}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field
        label="Tell us about it"
        htmlFor="message"
        error={errors.message}
        hint="The problem you are trying to solve is more useful to us than the solution you have in mind."
      >
        <Textarea
          id="message"
          name="message"
          required
          minLength={20}
          placeholder="We run a logistics business in Kaduna and dispatch is still on WhatsApp. We need…"
        />
      </Field>

      {state === "error" ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3.5 py-2.5 text-[0.875rem] text-red-700" role="alert">
          {message}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={state === "sending"}>
        {state === "sending" ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            Send message <Send className="size-4" />
          </>
        )}
      </Button>
    </form>
  );
}
