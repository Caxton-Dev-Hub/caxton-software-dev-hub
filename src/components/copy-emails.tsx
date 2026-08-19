"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/** Copies the waiting list as a comma-separated address line for a mail client. */
export function CopyEmails({ emails }: { emails: string[] }) {
  const [copied, setCopied] = useState(false);

  if (emails.length === 0) return null;

  async function copy() {
    try {
      await navigator.clipboard.writeText(emails.join(", "));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-2 rounded-md border border-edge bg-paper px-3 py-2 text-[0.875rem] text-ink-soft transition-colors hover:border-forest hover:text-forest"
    >
      {copied ? (
        <>
          <Check className="size-3.5 text-signal" /> Copied
        </>
      ) : (
        <>
          <Copy className="size-3.5" /> Copy {emails.length} address
          {emails.length === 1 ? "" : "es"}
        </>
      )}
    </button>
  );
}
