import type { Metadata } from "next";
import { ArrowRight, CalendarDays, Sparkles } from "lucide-react";

import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
import { PageHeader } from "@/components/page-header";
import { CourseCard } from "@/components/course-card";
import { FaqList } from "@/components/faq-list";
import { courses } from "@/content/courses";
import { trainingFaqs } from "@/content/faq";

export const metadata: Metadata = {
  title: "Courses",
  description:
    "Cohort and self-paced engineering courses from Caxton Software Dev Hub: React and Next.js, Node.js and PostgreSQL, Cairo and Starknet, web design, and AI-assisted engineering.",
};

const cohortRhythm = [
  {
    step: "01",
    title: "Live session, Saturday",
    body: "Two hours with the instructor, recorded and posted the same day for anyone who could not make it.",
  },
  {
    step: "02",
    title: "Build during the week",
    body: "One substantial assignment, opened as a pull request against your own repository.",
  },
  {
    step: "03",
    title: "Code review, Wednesday",
    body: "Line-by-line written review from an engineer who ships client work in the same week.",
  },
  {
    step: "04",
    title: "Assistant on call, always",
    body: "The AI study assistant knows your module and answers at 1am. It will not write the assignment.",
  },
];

export default function CoursesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Training"
        title="Courses that end with deployed work and a reviewed portfolio"
        lead="Five programmes, small cohorts, capped seats. Taught by engineers who take client work in the same weeks they teach — so the curriculum never drifts from what employers actually need."
        aside={
          <div className="rounded-lg border border-forest/25 bg-mint/50 p-6">
            <span className="inline-flex items-center gap-2 font-mono text-[0.625rem] tracking-[0.16em] text-forest uppercase">
              <Sparkles className="size-3.5" /> Included on every course
            </span>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
              An AI study assistant scoped to your curriculum, a mentor who reads
              your code before the call, and a certificate that names the work you
              actually shipped.
            </p>
            <p className="mt-4 flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.14em] text-ink-faint uppercase">
              <CalendarDays className="size-3.5" /> Instalment plans available
            </p>
          </div>
        }
      />

      <Section tone="paper">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="mist">
        <Container>
          <SectionHeading
            eyebrow="How a week works"
            title="The rhythm every cohort runs on"
            lead="Predictable enough to plan your week around, demanding enough that you finish with something to show."
          />
          <ol className="mt-12 grid gap-px overflow-hidden rounded-lg border border-edge bg-edge md:grid-cols-2 lg:grid-cols-4">
            {cohortRhythm.map((item) => (
              <li key={item.step} className="bg-paper p-7">
                <span className="font-mono text-2xl text-forest">{item.step}</span>
                <h3 className="mt-4 text-lg text-ink">{item.title}</h3>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-soft">
                  {item.body}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section tone="paper" id="faq">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <SectionHeading
                eyebrow="Training FAQ"
                title="Questions people ask before enrolling"
              />
              <ButtonLink href="/contact" variant="secondary" className="mt-8">
                Ask us something else <ArrowRight className="size-4" />
              </ButtonLink>
            </div>
            <div className="lg:col-span-8">
              <FaqList items={trainingFaqs} />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
