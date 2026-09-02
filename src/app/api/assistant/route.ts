import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { assistantSchema } from "@/lib/validation";
import { rateLimit, userKey } from "@/lib/rate-limit";
import {
  ASSISTANT_MAX_TOKENS,
  ASSISTANT_MODEL,
  anthropic,
  buildSystemPrompt,
  isAssistantConfigured,
} from "@/lib/assistant";

export const maxDuration = 60;

const HISTORY_LIMIT = 20;

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
  }

  // Key on the account alone. Including the IP let one user on a rotating
  // address get unlimited model calls, which is the expensive thing here.
  const limit = rateLimit(userKey(user.id, "assistant"), 25, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "You are sending messages very quickly. Give it a moment." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  const parsed = assistantSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { message, courseSlug } = parsed.data;

  // The assistant is a paid feature: it answers against a course the learner
  // actually holds a seat on.
  if (courseSlug) {
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseSlug: { userId: user.id, courseSlug } },
    });
    if (!enrollment || enrollment.status === "CANCELLED") {
      return NextResponse.json(
        { error: "You are not enrolled on that course." },
        { status: 403 },
      );
    }
  }

  if (!isAssistantConfigured()) {
    return NextResponse.json(
      {
        error:
          "The study assistant is not configured on this deployment. Add ANTHROPIC_API_KEY to the environment.",
      },
      { status: 503 },
    );
  }

  // Resolve the thread, verifying ownership if one was supplied.
  let threadId = parsed.data.threadId;
  if (threadId) {
    const thread = await prisma.assistantThread.findUnique({ where: { id: threadId } });
    if (!thread || thread.userId !== user.id) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }
  } else {
    const created = await prisma.assistantThread.create({
      data: {
        userId: user.id,
        courseSlug: courseSlug ?? null,
        title: message.slice(0, 70),
      },
    });
    threadId = created.id;
  }

  const history = await prisma.assistantMessage.findMany({
    where: { threadId },
    orderBy: { createdAt: "desc" },
    take: HISTORY_LIMIT,
  });

  await prisma.assistantMessage.create({
    data: { threadId, role: "user", content: message },
  });

  const messages = [
    ...history
      .reverse()
      .map((entry) => ({
        role: entry.role === "assistant" ? ("assistant" as const) : ("user" as const),
        content: entry.content,
      })),
    { role: "user" as const, content: message },
  ];

  const encoder = new TextEncoder();
  let answer = "";

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const claude = anthropic().messages.stream({
          model: ASSISTANT_MODEL,
          max_tokens: ASSISTANT_MAX_TOKENS,
          output_config: { effort: "low" },
          system: [
            {
              type: "text",
              text: buildSystemPrompt(courseSlug),
              // The curriculum prefix is identical across every message in a
              // course, so caching it keeps repeat turns cheap.
              cache_control: { type: "ephemeral" },
            },
          ],
          messages,
        });

        claude.on("text", (delta) => {
          answer += delta;
          controller.enqueue(encoder.encode(delta));
        });

        const final = await claude.finalMessage();

        // A refusal returns HTTP 200 with empty content — check the stop
        // reason before assuming there is an answer to save.
        if (final.stop_reason === "refusal") {
          const notice =
            "I cannot help with that one. If you think this is a mistake, ask your mentor and they will pick it up with us.";
          answer = notice;
          controller.enqueue(encoder.encode(notice));
        }

        // To have Anthropic retry a refusal on another model automatically,
        // switch to `anthropic().beta.messages.stream({ ...,
        // betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" })`.
      } catch (error) {
        console.error("Assistant stream failed", error);
        const notice =
          "\n\n[The assistant stopped unexpectedly. Please send that again.]";
        controller.enqueue(encoder.encode(notice));
      } finally {
        if (answer.trim()) {
          await prisma.assistantMessage
            .create({ data: { threadId: threadId!, role: "assistant", content: answer } })
            .catch((error) => console.error("Could not save reply", error));
          await prisma.assistantThread
            .update({ where: { id: threadId! }, data: { updatedAt: new Date() } })
            .catch(() => undefined);
        }
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Thread-Id": threadId,
    },
  });
}
