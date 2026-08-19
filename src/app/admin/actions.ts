"use server";

import { revalidatePath } from "next/cache";
import type { BookingStatus, LeadStatus, WaitlistStatus } from "@prisma/client";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const bookingStatuses = new Set([
  "AWAITING_PAYMENT",
  "SCHEDULED",
  "COMPLETED",
  "CANCELLED",
]);

const leadStatuses = new Set(["NEW", "CONTACTED", "QUALIFIED", "CLOSED"]);

const waitlistStatuses = new Set(["WAITING", "INVITED", "CONVERTED", "DECLINED"]);

export async function setBookingStatus(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !bookingStatuses.has(status)) throw new Error("Invalid request");

  await prisma.mentorshipBooking.update({
    where: { id },
    data: { status: status as BookingStatus },
  });
  revalidatePath("/admin/bookings");
}

export async function setLeadStatus(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !leadStatuses.has(status)) throw new Error("Invalid request");

  await prisma.lead.update({ where: { id }, data: { status: status as LeadStatus } });
  revalidatePath("/admin/leads");
}

export async function setWaitlistStatus(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !waitlistStatuses.has(status)) throw new Error("Invalid request");

  await prisma.waitlistEntry.update({
    where: { id },
    data: {
      status: status as WaitlistStatus,
      // Stamp the moment we offered them a seat, so the 48-hour hold is auditable.
      invitedAt: status === "INVITED" ? new Date() : undefined,
    },
  });
  revalidatePath("/admin/waitlist");
}

export async function removeWaitlistEntry(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Invalid request");

  await prisma.waitlistEntry.delete({ where: { id } });
  revalidatePath("/admin/waitlist");
}
