import "server-only";

import type { Payment } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mail";
import { getCourse } from "@/content/courses";
import { getPlan } from "@/content/mentorship";
import { formatKobo } from "@/lib/money";
import { verifyTransaction } from "@/lib/paystack";

/**
 * Turns a successful payment into the thing the customer bought.
 *
 * Called from two places — the Paystack webhook and the browser callback — so
 * it must be idempotent. A payment already marked PAID is a no-op.
 */
export async function fulfilPayment(payment: Payment): Promise<Payment> {
  if (payment.status === "PAID") return payment;

  const updated = await prisma.$transaction(async (tx) => {
    const paid = await tx.payment.update({
      where: { id: payment.id },
      data: { status: "PAID", paidAt: payment.paidAt ?? new Date() },
    });

    if (paid.kind === "COURSE") {
      await tx.enrollment.upsert({
        where: {
          userId_courseSlug: { userId: paid.userId, courseSlug: paid.itemSlug },
        },
        create: {
          userId: paid.userId,
          courseSlug: paid.itemSlug,
          paymentId: paid.id,
          status: "ACTIVE",
        },
        update: { status: "ACTIVE" },
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

/** Verifies with Paystack, then fulfils. Safe to call repeatedly. */
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
    console.error(
      `Amount mismatch on ${reference}: expected ${payment.amountKobo}, Paystack reported ${transaction.amount}`,
    );
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
