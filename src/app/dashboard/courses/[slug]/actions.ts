"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { courseLessons, getCourse } from "@/content/courses";

export async function toggleLesson(formData: FormData) {
  const user = await requireUser();

  const courseSlug = String(formData.get("courseSlug") ?? "");
  const lessonId = String(formData.get("lessonId") ?? "");

  const course = getCourse(courseSlug);
  if (!course) throw new Error("Unknown course");
  if (!courseLessons(course).some((lesson) => lesson.id === lessonId)) {
    throw new Error("Unknown lesson");
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseSlug: { userId: user.id, courseSlug } },
  });
  if (!enrollment || enrollment.status === "CANCELLED") {
    throw new Error("You are not enrolled on this course");
  }

  const existing = await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId: user.id, lessonId } },
  });

  if (existing) {
    await prisma.lessonProgress.delete({ where: { id: existing.id } });
  } else {
    await prisma.lessonProgress.create({
      data: { userId: user.id, courseSlug, lessonId },
    });
  }

  // Mark the enrolment complete once every lesson is ticked off.
  const completed = await prisma.lessonProgress.count({
    where: { userId: user.id, courseSlug },
  });
  const total = courseLessons(course).length;

  if (completed >= total && enrollment.status !== "COMPLETED") {
    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: { status: "COMPLETED", completedAt: new Date() },
    });
  } else if (completed < total && enrollment.status === "COMPLETED") {
    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: { status: "ACTIVE", completedAt: null },
    });
  }

  revalidatePath(`/dashboard/courses/${courseSlug}`);
  revalidatePath("/dashboard");
}
