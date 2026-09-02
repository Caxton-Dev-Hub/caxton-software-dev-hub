import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Payment } from "@prisma/client";

const { prismaMock, txMock } = vi.hoisted(() => {
  const txMock = {
    payment: { update: vi.fn() },
    enrollment: { upsert: vi.fn(), updateMany: vi.fn() },
    mentorshipBooking: { findFirst: vi.fn(), update: vi.fn() },
  };
  const prismaMock = {
    payment: { findUnique: vi.fn(), update: vi.fn() },
    user: { findUnique: vi.fn() },
    $transaction: vi.fn(async (callback: (tx: typeof txMock) => unknown) => callback(txMock)),
  };
  return { prismaMock, txMock };
});

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));
vi.mock("@/lib/flutterwave", () => ({ verifyTransaction: vi.fn() }));
vi.mock("@/lib/mail", () => ({
  sendMail: vi.fn().mockResolvedValue({ delivered: true }),
  salesInbox: "hello@example.test",
}));

import { fulfilPayment, verifyAndFulfil } from "@/lib/fulfilment";
import { instalmentKobo } from "@/lib/money";
import { getCourse } from "@/content/courses";

const COURSE_SLUG = "frontend-engineering-react-nextjs";
/**
 * Read from the catalogue rather than hardcoded: the balance is derived from
 * the real price, so a price change must not silently invalidate these tests.
 */
const COURSE_PRICE_KOBO = getCourse(COURSE_SLUG)!.priceKobo;
import { verifyTransaction } from "@/lib/flutterwave";
import { sendMail } from "@/lib/mail";

function makePayment(overrides: Partial<Payment> = {}): Payment {
  return {
    id: "pay_1",
    userId: "user_1",
    reference: "cx_course_ref",
    provider: "flutterwave",
    kind: "COURSE",
    itemSlug: "frontend-engineering-react-nextjs",
    amountKobo: 1_800_000,
    currency: "NGN",
    status: "PENDING",
    channel: null,
    paidAt: null,
    rawResponse: null,
    createdAt: new Date("2026-08-21T09:00:00.000Z"),
    updatedAt: new Date("2026-08-21T09:00:00.000Z"),
    ...overrides,
  } as Payment;
}

beforeEach(() => {
  vi.clearAllMocks();
  prismaMock.$transaction.mockImplementation(async (callback: (tx: typeof txMock) => unknown) =>
    callback(txMock),
  );
  prismaMock.user.findUnique.mockResolvedValue({
    id: "user_1",
    name: "Ada Lovelace",
    email: "ada@example.com",
  });
});

describe("fulfilPayment", () => {
  it("is a no-op for a payment already marked PAID", async () => {
    const payment = makePayment({ status: "PAID" });
    const result = await fulfilPayment(payment);

    expect(result).toBe(payment);
    expect(prismaMock.$transaction).not.toHaveBeenCalled();
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("activates the enrolment and emails a receipt for a course purchase", async () => {
    // The full price of this course. Paid in full, so nothing is owed.
    const payment = makePayment({ amountKobo: COURSE_PRICE_KOBO });
    txMock.payment.update.mockResolvedValue({ ...payment, status: "PAID", paidAt: new Date() });

    const result = await fulfilPayment(payment);

    expect(result.status).toBe("PAID");
    expect(txMock.enrollment.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId_courseSlug: { userId: "user_1", courseSlug: COURSE_SLUG } },
        create: expect.objectContaining({
          status: "ACTIVE",
          balanceKobo: 0,
          balanceDueAt: null,
        }),
      }),
    );
    expect(txMock.mentorshipBooking.findFirst).not.toHaveBeenCalled();
    expect(sendMail).toHaveBeenCalledWith(expect.objectContaining({ to: "ada@example.com" }));
  });

  it("records the outstanding balance when only an instalment was paid", async () => {
    const half = instalmentKobo(COURSE_PRICE_KOBO);
    const payment = makePayment({ amountKobo: half });
    txMock.payment.update.mockResolvedValue({ ...payment, status: "PAID", paidAt: new Date() });

    await fulfilPayment(payment);

    const call = txMock.enrollment.upsert.mock.calls[0][0];
    // Access is granted — that is the instalment deal — but the debt is recorded.
    expect(call.create.status).toBe("ACTIVE");
    expect(call.create.balanceKobo).toBe(COURSE_PRICE_KOBO - half);
    expect(call.create.balanceKobo).toBeGreaterThan(0);
    expect(call.create.balanceDueAt).toBeInstanceOf(Date);
  });

  it("clears the balance when the second instalment settles it", async () => {
    const half = instalmentKobo(COURSE_PRICE_KOBO);
    const payment = makePayment({ amountKobo: COURSE_PRICE_KOBO - half });
    txMock.payment.update.mockResolvedValue({ ...payment, status: "PAID", paidAt: new Date() });

    await fulfilPayment(payment);

    // Second payment against an existing enrolment decrements what is owed...
    const call = txMock.enrollment.upsert.mock.calls[0][0];
    expect(call.update.balanceKobo).toEqual({ decrement: COURSE_PRICE_KOBO - half });
    // ...and anything at or below zero is clamped and the due date cleared.
    expect(txMock.enrollment.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { balanceKobo: 0, balanceDueAt: null },
      }),
    );
  });

  it("schedules the booking for a mentorship purchase", async () => {
    const payment = makePayment({ kind: "MENTORSHIP", itemSlug: "starter" });
    txMock.payment.update.mockResolvedValue({ ...payment, status: "PAID" });
    txMock.mentorshipBooking.findFirst.mockResolvedValue({ id: "booking_1" });

    await fulfilPayment(payment);

    expect(txMock.enrollment.upsert).not.toHaveBeenCalled();
    expect(txMock.mentorshipBooking.update).toHaveBeenCalledWith({
      where: { id: "booking_1" },
      data: { status: "SCHEDULED" },
    });
  });

  it("still returns the fulfilled payment if the receipt email fails", async () => {
    const payment = makePayment();
    txMock.payment.update.mockResolvedValue({ ...payment, status: "PAID" });
    vi.mocked(sendMail).mockRejectedValueOnce(new Error("Resend is down"));

    await expect(fulfilPayment(payment)).resolves.toMatchObject({ status: "PAID" });
  });
});

describe("verifyAndFulfil", () => {
  it("reports unknown for a reference with no matching payment, without calling the API", async () => {
    prismaMock.payment.findUnique.mockResolvedValue(null);

    const result = await verifyAndFulfil("does-not-exist");

    expect(result).toEqual({ status: "unknown", payment: null });
    expect(verifyTransaction).not.toHaveBeenCalled();
  });

  it("short-circuits for a payment already marked PAID, without re-verifying", async () => {
    const payment = makePayment({ status: "PAID" });
    prismaMock.payment.findUnique.mockResolvedValue(payment);

    const result = await verifyAndFulfil(payment.reference);

    expect(result).toEqual({ status: "paid", payment });
    expect(verifyTransaction).not.toHaveBeenCalled();
  });

  it("fulfils the payment when the provider confirms success and the amount matches", async () => {
    const payment = makePayment();
    prismaMock.payment.findUnique.mockResolvedValue(payment);
    vi.mocked(verifyTransaction).mockResolvedValue({
      status: "success",
      reference: payment.reference,
      amount: payment.amountKobo,
      currency: "NGN",
      channel: "card",
      paid_at: "2026-08-21T10:00:00.000Z",
    });
    const withMeta = { ...payment, channel: "card", paidAt: new Date("2026-08-21T10:00:00.000Z") };
    prismaMock.payment.update.mockResolvedValueOnce(withMeta);
    txMock.payment.update.mockResolvedValue({ ...withMeta, status: "PAID" });

    const result = await verifyAndFulfil(payment.reference);

    expect(result.status).toBe("paid");
    expect(result.payment?.status).toBe("PAID");
  });

  it("marks the payment FAILED and does not fulfil when the reported amount does not match", async () => {
    const payment = makePayment({ amountKobo: 1_800_000 });
    prismaMock.payment.findUnique.mockResolvedValue(payment);
    vi.mocked(verifyTransaction).mockResolvedValue({
      status: "success",
      reference: payment.reference,
      amount: 100, // far less than the recorded amount — a tampered/mismatched report
      currency: "NGN",
    });
    prismaMock.payment.update.mockResolvedValue({ ...payment, status: "FAILED" });

    const result = await verifyAndFulfil(payment.reference);

    expect(result).toEqual({ status: "failed", payment: { ...payment, status: "FAILED" } });
    expect(prismaMock.$transaction).not.toHaveBeenCalled();
  });

  it("treats an abandoned transaction as pending, not failed", async () => {
    const payment = makePayment();
    prismaMock.payment.findUnique.mockResolvedValue(payment);
    vi.mocked(verifyTransaction).mockResolvedValue({
      status: "abandoned",
      reference: payment.reference,
      amount: payment.amountKobo,
      currency: "NGN",
    });
    prismaMock.payment.update.mockResolvedValue({ ...payment, status: "ABANDONED" });

    const result = await verifyAndFulfil(payment.reference);

    expect(result.status).toBe("pending");
    expect(prismaMock.payment.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ status: "ABANDONED" }) }),
    );
  });

  it("marks any other non-success status as failed", async () => {
    const payment = makePayment();
    prismaMock.payment.findUnique.mockResolvedValue(payment);
    vi.mocked(verifyTransaction).mockResolvedValue({
      status: "failed",
      reference: payment.reference,
      amount: payment.amountKobo,
      currency: "NGN",
    });
    prismaMock.payment.update.mockResolvedValue({ ...payment, status: "FAILED" });

    const result = await verifyAndFulfil(payment.reference);

    expect(result.status).toBe("failed");
  });
});
