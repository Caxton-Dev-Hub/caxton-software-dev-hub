"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireUser, createSessionCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/password";

const profileSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().max(24).optional(),
  bio: z.string().trim().max(500).optional(),
});

export type ActionState = { ok?: string; error?: string };

export async function updateProfile(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();

  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone") || undefined,
    bio: formData.get("bio") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form" };
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: parsed.data,
  });

  // Name is carried in the session cookie, so reissue it.
  await createSessionCookie({
    sub: updated.id,
    email: updated.email,
    name: updated.name,
    role: updated.role,
  });

  revalidatePath("/dashboard/settings");
  return { ok: "Profile updated." };
}

const passwordSchema = z.object({
  current: z.string().min(1, "Enter your current password"),
  next: z.string().min(10, "Use at least 10 characters"),
});

export async function changePassword(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();

  const parsed = passwordSchema.safeParse({
    current: formData.get("current"),
    next: formData.get("next"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form" };
  }

  const valid = await verifyPassword(parsed.data.current, user.passwordHash);
  if (!valid) return { error: "That is not your current password." };

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(parsed.data.next) },
  });

  return { ok: "Password changed." };
}
