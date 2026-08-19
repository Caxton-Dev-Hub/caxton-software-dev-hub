import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validation";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { salesInbox, sendMail } from "@/lib/mail";
import { isDatabaseConfigured } from "@/lib/prisma";

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request, "contact"), 4, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "That is a lot of messages. Try again in a minute." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  const parsed = contactSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check the form",
        fieldErrors: Object.fromEntries(
          parsed.error.issues.map((issue) => [
            String(issue.path[0] ?? "form"),
            issue.message,
          ]),
        ),
      },
      { status: 400 },
    );
  }

  const { website, ...lead } = parsed.data;

  // Honeypot filled in: accept silently so the bot does not learn.
  if (website) return NextResponse.json({ ok: true });

  if (isDatabaseConfigured()) {
    await prisma.lead
      .create({ data: lead })
      .catch((error) => console.error("Could not store lead", error));
  }

  await sendMail({
    to: salesInbox,
    replyTo: lead.email,
    subject: `New enquiry — ${lead.name}${lead.company ? ` (${lead.company})` : ""}`,
    text: [
      `Name:    ${lead.name}`,
      `Email:   ${lead.email}`,
      `Phone:   ${lead.phone ?? "—"}`,
      `Company: ${lead.company ?? "—"}`,
      `Service: ${lead.service ?? "—"}`,
      `Budget:  ${lead.budget ?? "—"}`,
      "",
      lead.message,
    ].join("\n"),
  }).catch((error) => console.error("Could not email lead", error));

  await sendMail({
    to: lead.email,
    subject: "We have your message — Caxton Software Dev Hub",
    text: [
      `Hello ${lead.name.split(" ")[0]},`,
      "",
      "Thank you for getting in touch. A person will reply within one working day.",
      "",
      "For reference, this is what you sent us:",
      "",
      lead.message,
      "",
      "— Caxton Software Dev Hub",
    ].join("\n"),
  }).catch(() => undefined);

  return NextResponse.json({ ok: true });
}
