import "server-only";

import type { Payment } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { salesInbox, sendMail } from "@/lib/mail";
import { getCourse, type Course } from "@/content/courses";
import { getPlan } from "@/content/mentorship";
import { formatKobo } from "@/lib/money";
import { verifyTransaction } from "@/lib/flutterwave";

/**
 * Turns a successful payment into the thing the customer bought.
 *
 * Called from two places — the Flutterwave webhook and the browser callback —
 * so it must be idempotent. A payment already marked PAID is a no-op.
 */
export async function fulfilPayment(payment: Payment): Promise<Payment> {
  if (payment.status === "PAID") return payment;

  const updated = await prisma.$transaction(async (tx) => {
    const paid = await tx.payment.update({
      where: { id: payment.id },
      data: { status: "PAID", paidAt: payment.paidAt ?? new Date() },
    });

    if (paid.kind === "COURSE") {
      // A part payment still opens the seat — that is the deal on the
      // instalment plan — but it must record what is still owed, or a learner
      // who paid half is indistinguishable from one who paid in full.
      const course = getCourse(paid.itemSlug);
      const outstanding = course
        ? Math.max(0, course.priceKobo - paid.amountKobo)
        : 0;

      await tx.enrollment.upsert({
        where: {
          userId_courseSlug: { userId: paid.userId, courseSlug: paid.itemSlug },
        },
        create: {
          userId: paid.userId,
          courseSlug: paid.itemSlug,
          paymentId: paid.id,
          status: "ACTIVE",
          balanceKobo: outstanding,
          balanceDueAt: outstanding > 0 ? balanceDueAt(course) : null,
        },
        update: {
          status: "ACTIVE",
          // Settling the balance is a second payment against the same course.
          // Decrement rather than overwrite so the two payments compose.
          balanceKobo: { decrement: paid.amountKobo },
        },
      });

      // A decrement can overshoot if someone overpays; never leave it negative,
      // and clear the due date once there is nothing left to collect.
      await tx.enrollment.updateMany({
        where: {
          userId: paid.userId,
          courseSlug: paid.itemSlug,
          balanceKobo: { lte: 0 },
        },
        data: { balanceKobo: 0, balanceDueAt: null },
      });
    }

    if (paid.kind === "MENTORSHIP") {
      const booking = await tx.mentorshipBooking.findFirst({
        where: { paymentId: paid.id },
      });
      if (booking) {
        await tx.mentorshipBooking.update({
          where: { id: booking.id },
          data: { status: "SCHEDULED" },
        });
      }
    }

    return paid;
  });

  await notifyCustomer(updated).catch((error) =>
    console.error("Receipt email failed", error),
  );

  return updated;
}


/**
 * The balance falls due before week five, per the published terms
 * (src/content/legal.ts and the courses FAQ). Dated from the moment the seat
 * is taken rather than from the cohort start, because that is the date we can
 * actually compute here.
 */
function balanceDueAt(course: Course | undefined): Date {
  const weeks = Math.min(4, course?.weeks ?? 4);
  return new Date(Date.now() + weeks * 7 * 24 * 60 * 60 * 1000);
}

async function notifyCustomer(payment: Payment) {
  const user = await prisma.user.findUnique({ where: { id: payment.userId } });
  if (!user) return;

  const itemName =
    payment.kind === "COURSE"
      ? (getCourse(payment.itemSlug)?.title ?? payment.itemSlug)
      : `${getPlan(payment.itemSlug)?.name ?? payment.itemSlug} mentorship`;

  await sendMail({
    to: user.email,
    subject: `Payment confirmed — ${itemName}`,
    text: [
      `Hello ${user.name.split(" ")[0]},`,
      "",
      `We have received your payment of ${formatKobo(payment.amountKobo)} for ${itemName}.`,
      "",
      `Reference: ${payment.reference}`,
      "",
      payment.kind === "COURSE"
        ? "Your seat is confirmed. Course material and the joining link are in your dashboard."
        : "Your mentorship is confirmed. We will email you within one working day to schedule your first session.",
      "",
      "Dashboard: /dashboard",
      "",
      "— Caxton Software Dev Hub",
    ].join("\n"),
  });
}

/** Verifies with Flutterwave, then fulfils. Safe to call repeatedly. */
export async function verifyAndFulfil(reference: string): Promise<{
  status: "paid" | "pending" | "failed" | "unknown";
  payment: Payment | null;
}> {
  const payment = await prisma.payment.findUnique({ where: { reference } });
  if (!payment) return { status: "unknown", payment: null };
  if (payment.status === "PAID") return { status: "paid", payment };

  const transaction = await verifyTransaction(reference);

  if (transaction.status !== "success") {
    const failed = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: transaction.status === "abandoned" ? "ABANDONED" : "FAILED",
        rawResponse: transaction as never,
      },
    });
    return { status: transaction.status === "abandoned" ? "pending" : "failed", payment: failed };
  }

  // Never trust the amount from the browser — compare against what we recorded.
  if (transaction.amount !== payment.amountKobo) {
    // This is a fraud signal, not routine noise: the provider settled an
    // amount we never quoted. Mail it to the desk as well as logging it,
    // because nobody reads the function logs on a normal day.
    console.error(
      `Amount mismatch on ${reference}: expected ${payment.amountKobo}, Flutterwave reported ${transaction.amount}`,
    );
    await sendMail({
      to: salesInbox,
      subject: `URGENT: payment amount mismatch — ${reference}`,
      text: [
        "A payment settled for an amount this application never quoted.",
        "The payment has been marked FAILED and nothing was fulfilled.",
        "",
        `Reference:  ${reference}`,
        `Expected:   ${formatKobo(payment.amountKobo)} (${payment.amountKobo} kobo)`,
        `Reported:   ${formatKobo(transaction.amount)} (${transaction.amount} kobo)`,
        `User id:    ${payment.userId}`,
        `Item:       ${payment.kind} / ${payment.itemSlug}`,
        "",
        "Check this against the Flutterwave dashboard before refunding or fulfilling by hand.",
      ].join("\n"),
    }).catch((error) => console.error("Could not send mismatch alert", error));
    const failed = await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "FAILED", rawResponse: transaction as never },
    });
    return { status: "failed", payment: failed };
  }

  const withMeta = await prisma.payment.update({
    where: { id: payment.id },
    data: {
      channel: transaction.channel,
      paidAt: transaction.paid_at ? new Date(transaction.paid_at) : new Date(),
      rawResponse: transaction as never,
    },
  });

  const fulfilled = await fulfilPayment(withMeta);
  return { status: "paid", payment: fulfilled };
}
