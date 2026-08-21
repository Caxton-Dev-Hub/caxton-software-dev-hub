import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
import { PageHeader } from "@/components/page-header";
import { PlanCard } from "@/components/plan-card";
import { ProcessList } from "@/components/process-list";
import { mentorshipPlans, mentorshipProcess } from "@/content/mentorship";

export const metadata: Metadata = {
  title: "Mentorship",
  description:
    "One-to-one engineering mentorship from Caxton Software Dev Hub — weekly calls, code review on real pull requests, and an AI study assistant, from ₦45,000 per month.",
};

export default function MentorshipPage() {
  return (
    <>
      <PageHeader
        eyebrow="Mentorship"
        title="A senior engineer who knows your name and reads your code"
        lead="Courses give you a curriculum. Mentorship gives you someone who notices when you are stuck on the wrong thing, and says so before you lose a month to it."
        aside={
          <div className="rounded-lg border border-edge bg-paper p-6">
            <p className="font-mono text-[0.625rem] tracking-[0.16em] text-ink-faint uppercase">
              Before you pay anything
            </p>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
              Every plan starts with a free 20-minute fit call and a written
              learning plan. If we are not the right mentors for where you are
              going, we will tell you and suggest someone who is.
            </p>
            <ButtonLink href="/contact?service=Mentorship" variant="secondary" className="mt-5 w-full">
              Book the fit call <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
        }
      />

      <Section tone="paper">
        <Container>
          <div className="grid gap-6 lg:grid-cols-3">
            {mentorshipPlans.map((plan) => (
              <PlanCard key={plan.slug} plan={plan} />
            ))}
          </div>
          <p className="mt-8 text-[0.875rem] text-ink-faint">
            Prices are in naira and billed through Flutterwave. Monthly plans renew
            manually — we will never charge a card you did not expect us to.
          </p>
        </Container>
      </Section>

      <Section tone="mist">
        <Container>
          <SectionHeading
            eyebrow="How it starts"
            title="Four steps from first call to first job offer"
          />
          <div className="mt-12">
            <ProcessList steps={mentorshipProcess} />
          </div>
        </Container>
      </Section>

      <Section tone="ink">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <SectionHeading
                onDark
                eyebrow="An honest note"
                title="We do not promise you a job"
                lead="Nobody honestly can. What we promise is the work that makes you employable: deployed projects, a portfolio someone will read, interview practice with written feedback, and introductions where there is a genuine fit."
              />
            </div>
            <div className="lg:col-span-5">
              <div className="rounded-lg border border-white/12 bg-white/[0.04] p-7">
                <h3 className="text-lg text-white">What we ask of you</h3>
                <ul className="mt-4 space-y-3 text-[0.9375rem] leading-relaxed text-mint/75">
                  <li>Turn up to the calls, with the work done.</li>
                  <li>Push code between sessions, even when it is not working.</li>
                  <li>Say when you are lost. Nobody is impressed by silence.</li>
                  <li>Give us four weeks before deciding whether it is working.</li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
