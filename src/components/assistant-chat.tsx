"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowUp, Loader2, Sparkles } from "lucide-react";

import { Select } from "@/components/ui/field";
import { cn } from "@/lib/utils";

type Message = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "Explain this concept a different way — I did not follow the lesson.",
  "Here is my code and the error. Where is my mental model wrong?",
  "Give me three practice problems at the level I am stuck on.",
  "What should I be able to do by the end of this module?",
];

export function AssistantChat({
  courses,
  enabled,
}: {
  courses: { slug: string; title: string; code: string }[];
  enabled: boolean;
}) {
  const searchParams = useSearchParams();
  const initialCourse = searchParams.get("course") ?? courses[0]?.slug ?? "";

  const [courseSlug, setCourseSlug] = useState(initialCourse);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const threadId = useRef<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;

    setError(null);
    setInput("");
    setMessages((current) => [
      ...current,
      { role: "user", content: trimmed },
      { role: "assistant", content: "" },
    ]);
    setBusy(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          courseSlug: courseSlug || undefined,
          threadId: threadId.current ?? undefined,
        }),
      });

      if (!response.ok || !response.body) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? "The assistant is unavailable right now.");
      }

      threadId.current = response.headers.get("X-Thread-Id") ?? threadId.current;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((current) => {
          const next = [...current];
          next[next.length - 1] = {
            role: "assistant",
            content: next[next.length - 1].content + chunk,
          };
          return next;
        });
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong");
      setMessages((current) => current.slice(0, -1));
    } finally {
      setBusy(false);
    }
  }

  if (!enabled) {
    return (
      <div className="rounded-lg border border-dashed border-edge-strong bg-paper p-10 text-center">
        <Sparkles className="mx-auto size-6 text-forest" />
        <h2 className="mt-4 text-xl text-ink">The assistant is not switched on</h2>
        <p className="mx-auto mt-2 max-w-md leading-relaxed text-ink-soft">
          Add an <code className="font-mono text-[0.875rem]">ANTHROPIC_API_KEY</code>{" "}
          to the environment and restart the server. Everything else in the
          dashboard works without it.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100dvh-13rem)] min-h-[32rem] flex-col overflow-hidden rounded-lg border border-edge bg-paper">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-edge bg-mist px-5 py-3">
        <span className="flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.14em] text-forest uppercase">
          <Sparkles className="size-3.5" /> Study assistant
        </span>
        {courses.length > 0 ? (
          <label className="flex items-center gap-2">
            <span className="font-mono text-[0.625rem] tracking-[0.14em] text-ink-faint uppercase">
              Scope
            </span>
            <Select
              value={courseSlug}
              onChange={(event) => {
                setCourseSlug(event.target.value);
                threadId.current = null;
                setMessages([]);
              }}
              className="h-9 w-auto py-0 text-[0.8125rem]"
            >
              {courses.map((course) => (
                <option key={course.slug} value={course.slug}>
                  {course.code} — {course.title}
                </option>
              ))}
            </Select>
          </label>
        ) : null}
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-5">
        {messages.length === 0 ? (
          <div className="mx-auto max-w-lg py-10 text-center">
            <h2 className="text-xl text-ink">What are you stuck on?</h2>
            <p className="mt-2 leading-relaxed text-ink-soft">
              I answer against your course material. I will not write work that
              your mentor is going to review — ask me and I will ask you what you
              have tried.
            </p>
            <div className="mt-6 grid gap-2 text-left">
              {STARTERS.map((starter) => (
                <button
                  key={starter}
                  type="button"
                  onClick={() => send(starter)}
                  className="rounded-md border border-edge px-4 py-2.5 text-left text-[0.9375rem] text-ink-soft transition-colors hover:border-forest hover:text-forest"
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex",
              message.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-lg px-4 py-3 text-[0.9375rem] leading-relaxed whitespace-pre-wrap",
                message.role === "user"
                  ? "rounded-br-sm bg-mint text-forest-deep"
                  : "rounded-bl-sm border border-edge text-ink-soft",
              )}
            >
              {message.content || (
                <span className="inline-flex items-center gap-2 text-ink-faint">
                  <Loader2 className="size-3.5 animate-spin" /> Thinking
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {error ? (
        <p
          className="border-t border-red-200 bg-red-50 px-5 py-3 text-[0.875rem] text-red-700"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          send(input);
        }}
        className="border-t border-edge p-4"
      >
        <div className="flex items-end gap-2 rounded-lg border border-edge-strong bg-paper p-2 focus-within:border-forest">
          <label htmlFor="assistant-input" className="sr-only">
            Message the study assistant
          </label>
          <textarea
            id="assistant-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                send(input);
              }
            }}
            rows={1}
            placeholder="Ask a question, or paste code that is not behaving…"
            className="max-h-40 min-h-10 flex-1 resize-y bg-transparent px-2 py-2 text-[0.9375rem] text-ink placeholder:text-ink-faint/70 focus:outline-none"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            aria-label="Send"
            className="grid size-10 shrink-0 place-items-center rounded-md bg-forest text-white transition-colors hover:bg-forest-deep disabled:opacity-45"
          >
            {busy ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ArrowUp className="size-4" />
            )}
          </button>
        </div>
        <p className="mt-2 px-1 text-[0.75rem] text-ink-faint">
          Enter to send, Shift + Enter for a new line. The assistant can be wrong —
          check anything that matters against the lesson.
        </p>
      </form>
    </div>
  );
}
