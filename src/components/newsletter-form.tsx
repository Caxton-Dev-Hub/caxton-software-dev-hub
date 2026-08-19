"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Something went wrong");
      setState("done");
      setMessage("You are on the list. We send one email a month, at most.");
      setEmail("");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong");
    }
  }

  if (state === "done") {
    return (
      <p className="flex items-center gap-2 text-sm text-mint/85">
        <Check className="size-4 text-signal" />
        {message}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <div className="flex overflow-hidden rounded-md border border-white/20 bg-white/5 focus-within:border-white/45">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@company.com"
          className="min-w-0 flex-1 bg-transparent px-3.5 py-2.5 text-sm text-white placeholder:text-mint/40 focus:outline-none"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="inline-flex items-center gap-1.5 border-l border-white/15 px-4 text-sm text-white transition-colors hover:bg-white/10 disabled:opacity-60"
        >
          {state === "sending" ? "…" : "Join"}
          <ArrowRight className="size-3.5" />
        </button>
      </div>
      {state === "error" ? (
        <p className="text-sm text-red-300" role="alert">
          {message}
        </p>
      ) : null}
    </form>
  );
}
