import { Sparkles } from "lucide-react";

const QUESTION = "Why does my useEffect run twice in development?";

const ANSWER =
  "Because Strict Mode intentionally mounts, unmounts and remounts your component to surface missing cleanup. It is not a bug — it is the check. Look at what your effect subscribes to, then write the cleanup that undoes it. Want to paste the effect and work through it together?";

/**
 * A static illustration of the study assistant — deliberately not animated.
 * It renders identically on the server and the client, so the hero has no
 * layout shift and reads correctly before JavaScript arrives. The working
 * assistant is behind sign-in, at /dashboard/assistant.
 */
export function AssistantPreview() {
  return (
    <div className="rise overflow-hidden rounded-xl border border-edge bg-paper shadow-[0_18px_50px_-28px_rgba(6,54,32,0.45)] [animation-delay:280ms]">
      <div className="flex items-center justify-between border-b border-edge bg-mist px-4 py-2.5">
        <span className="flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.14em] text-forest uppercase">
          <Sparkles className="size-3.5" />
          Study assistant
        </span>
        <span className="font-mono text-[0.6875rem] tracking-[0.14em] text-ink-faint uppercase">
          CX-101 · Module 2
        </span>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex justify-end">
          <p className="max-w-[85%] rounded-lg rounded-br-sm bg-mint px-3.5 py-2.5 text-[0.9375rem] leading-relaxed text-forest-deep">
            {QUESTION}
          </p>
        </div>

        <div className="flex justify-start">
          <p className="max-w-[92%] rounded-lg rounded-bl-sm border border-edge px-3.5 py-2.5 text-[0.9375rem] leading-relaxed text-ink-soft">
            {ANSWER}
          </p>
        </div>
      </div>

      <p className="border-t border-edge bg-mist px-5 py-3 text-[0.8125rem] text-ink-faint">
        It will not write your assignment. Ask it to, and it asks you what you
        have tried.
      </p>
    </div>
  );
}
