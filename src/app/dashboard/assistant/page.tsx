import { Suspense } from "react";

import { PageTitle } from "@/components/app-shell";
import { AssistantChat } from "@/components/assistant-chat";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCourse } from "@/content/courses";
import { isAssistantConfigured } from "@/lib/assistant";

export default async function AssistantPage() {
  const user = await requireUser();

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: user.id, status: { not: "CANCELLED" } },
    orderBy: { createdAt: "desc" },
  });

  const courses = enrollments
    .map((enrollment) => getCourse(enrollment.courseSlug))
    .filter((course) => course !== undefined)
    .map((course) => ({ slug: course.slug, title: course.title, code: course.code }));

  return (
    <>
      <PageTitle
        eyebrow="AI-assisted learning"
        title="Study assistant"
        lead="Scoped to the courses you are enrolled on. It explains, it debugs with you, and it will not hand over work your mentor is meant to review."
      />
      <Suspense fallback={<p className="text-ink-faint">Loading…</p>}>
        <AssistantChat courses={courses} enabled={isAssistantConfigured()} />
      </Suspense>
    </>
  );
}
