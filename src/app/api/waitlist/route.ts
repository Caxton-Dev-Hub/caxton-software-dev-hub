import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { prisma, isDatabaseConfigured } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { waitlistSchema } from "@/lib/validation";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { sendMail } from "@/lib/mail";
import { getCourse, isWaitlisted } from "@/content/courses";
import { queuePosition } from "@/lib/waitlist";
import { site } from "@/content/site";

/**
 * Join the waitlist for a course whose current cohort is full.
 *
 * Open to signed-out visitors — the point is to capture interest with as little
 * friction as possible. If the person happens to be signed in we link the entry
 * to their account so it shows up in their dashboard.
 */
export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request, "waitlist"), 6, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "That is a lot of requests. Try again in a minute." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  const parsed = waitlistSchema.safeParse(await request.json().catch(() => null));
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

  const { website, courseSlug, ...entry } = parsed.data;

  // Honeypot filled in: accept silently so the bot learns nothing.
  if (website) {
    return NextResponse.json({ ok: true, position: 1, alreadyOn: false });
  }

  const course = getCourse(courseSlug);
  if (!course) {
    return NextResponse.json({ error: "That course does not exist" }, { status: 404 });
  }

  // Only full cohorts have a queue. The form is not shown elsewhere, but the
  // endpoint has to say no on its own.
  if (!isWaitlisted(course)) {
    return NextResponse.json(
      {
        error: "This cohort has seats available — you can enrol now.",
        redirect: `/courses/${course.slug}`,
      },
      { status: 409 },
    );
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "The waitlist is not available on this deployment yet." },
      { status: 503 },
    );
  }

  const user = await getCurrentUser().catch(() => null);

  // Someone already holding a seat has no business on the waitlist.
  if (user) {
    const enrolment = await prisma.enrollment.findUnique({
      where: { userId_courseSlug: { userId: user.id, courseSlug } },
    });
    if (enrolment && enrolment.status !== "CANCELLED") {
      return NextResponse.json(
        { error: "You are already enrolled on this course." },
        { status: 409 },
      );
    }
  }

  let alreadyOn = false;
  let entryId: string;

  try {
    const created = await prisma.waitlistEntry.create({
      data: { ...entry, courseSlug, userId: user?.id ?? null },
    });
    entryId = created.id;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      // Same email, same course. Keep their original place rather than
      // pushing them to the back of the queue, but refresh their details.
      alreadyOn = true;
      const existing = await prisma.waitlistEntry.update({
        where: { courseSlug_email: { courseSlug, email: entry.email } },
        data: {
          name: entry.name,
          phone: entry.phone ?? undefined,
          note: entry.note ?? undefined,
          userId: user?.id ?? undefined,
        },
      });
      entryId = existing.id;
    } else {
      console.error("Waitlist join failed", error);
      return NextResponse.json(
        { error: "We could not add you just now. Please try again." },
        { status: 500 },
      );
    }
  }

  const position = await queuePosition(courseSlug, entryId);

  if (!alreadyOn) {
    await notify({ ...entry, courseSlug, courseTitle: course.title, position }).catch(
      (error) => console.error("Waitlist email failed", error),
    );
  }

  return NextResponse.json({ ok: true, position, alreadyOn });
}

async function notify(input: {
  courseSlug: string;
  courseTitle: string;
  name: string;
  email: string;
  phone?: string;
  note?: string;
  position: number;
}) {
  await sendMail({
    to: input.email,
    subject: `You are on the waitlist — ${input.courseTitle}`,
    text: [
      `Hello ${input.name.split(" ")[0]},`,
      "",
      `You are number ${input.position} on the waitlist for ${input.courseTitle}.`,
      "",
      "What happens next: when a seat opens on the current cohort, or when we set the date for the next one, we email the waitlist first and in order. You will have 48 hours to claim the seat before we offer it to the next person.",
      "",
      "You have not been charged anything, and joining the waitlist does not commit you to enrolling.",
      "",
      `If your plans change, reply to this email and we will take you off the list.`,
      "",
      "— Caxton Software Dev Hub",
    ].join("\n"),
  });

  await sendMail({
    to: site.contact.training,
    replyTo: input.email,
    subject: `Waitlist: ${input.courseTitle} — ${input.name} (#${input.position})`,
    text: [
      `Course:   ${input.courseTitle} (${input.courseSlug})`,
      `Position: ${input.position}`,
      "",
      `Name:  ${input.name}`,
      `Email: ${input.email}`,
      `Phone: ${input.phone ?? "—"}`,
      "",
      input.note ? `Note:\n${input.note}` : "No note left.",
    ].join("\n"),
  });
}
