import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Check,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";

import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Section, SectionHeading, Eyebrow } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { RegistryStrip } from "@/components/registry-strip";
import { AssistantPreview } from "@/components/assistant-preview";
import { CourseCard } from "@/components/course-card";
import { ProcessList } from "@/components/process-list";
import { TestimonialGrid } from "@/components/testimonials";
import { Guilloche } from "@/components/guilloche";

import { courses, getCourse } from "@/content/courses";
import { mentorshipPlans } from "@/content/mentorship";
import { deliveryProcess, services } from "@/content/services";
import { guarantees, site, testimonials } from "@/content/site";
import { formatKobo } from "@/lib/money";

export default function HomePage() {
  const featured = courses.filter((course) => course.featured).slice(0, 3);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-edge bg-gradient-to-b from-mist to-paper">
        <Container className="relative">
          <div className="grid items-center gap-14 py-16 lg:grid-cols-12 lg:gap-12 lg:py-24">
            <div className="lg:col-span-7">
              <div className="rise">
                <Eyebrow>Software studio &amp; training hub · Kaduna, Nigeria</Eyebrow>
              </div>

              <h1 className="rise mt-6 text-[clamp(2.5rem,6.5vw,4.25rem)] leading-[0.98] tracking-[-0.035em] [animation-delay:80ms]">
                We build the software.
                <span className="block text-forest">Then we teach you how.</span>
              </h1>

              <p className="rise mt-6 max-w-xl text-lg leading-relaxed text-ink-soft [animation-delay:160ms]">
                Caxton Software Dev Hub is a registered Nigerian studio with two
                jobs: shipping production software for businesses that need it,
                and training the engineers who will maintain it — with an AI
                study assistant working alongside a human mentor, not instead of one.
              </p>

              <div className="rise mt-9 flex flex-wrap items-center gap-3 [animation-delay:240ms]">
                <ButtonLink href="/contact" size="lg">
                  Start a project
                  <ArrowRight className="size-4" />
                </ButtonLink>
                <ButtonLink href="/courses" variant="secondary" size="lg">
                  Browse courses
                </ButtonLink>
              </div>

              <div className="rise mt-9 [animation-delay:320ms]">
                <RegistryStrip />
                <p className="mt-3 max-w-lg text-[0.8125rem] leading-relaxed text-ink-faint">
                  Registered with the Corporate Affairs Commission under the
                  Companies and Allied Matters Act 2020. You can check the number
                  yourself —{" "}
                  <Link href="/verify" className="text-forest underline underline-offset-2">
                    here is how
                  </Link>
                  .
                </p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <AssistantPreview />
            </div>
          </div>
        </Container>
      </section>

      {/* ── Metrics band ─────────────────────────────────────── */}
      <div className="border-b border-edge bg-paper">
        <Container>
          <dl className="grid grid-cols-2 gap-px bg-edge lg:grid-cols-4">
            {site.metrics.map((metric) => (
              <div key={metric.label} className="bg-paper px-2 py-8 text-center">
                <dt className="sr-only">{metric.label}</dt>
                <dd>
                  <span className="block font-display text-3xl text-forest sm:text-4xl">
                    {metric.value}
                  </span>
                  <span className="mt-2 block font-mono text-[0.6875rem] tracking-[0.16em] text-ink-faint uppercase">
                    {metric.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </div>

      {/* ── Two audiences ────────────────────────────────────── */}
      <Section tone="paper">
        <Container>
          <SectionHeading
            eyebrow="Two ways in"
            title="Whichever side of the desk you are on"
            lead="Most people arrive here for one of two reasons. Pick the one that describes you and we will keep the rest out of your way."
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <Link
              href="/services"
              className="group relative flex flex-col overflow-hidden rounded-lg border border-edge bg-paper p-8 transition-colors hover:border-forest/45"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-md bg-mint text-forest">
                <Briefcase className="size-5" />
              </span>
              <h3 className="mt-5 text-2xl text-ink">You need software built</h3>
              <p className="mt-3 flex-1 leading-relaxed text-ink-soft">
                Websites, internal tools, customer portals, onchain products. Fixed
                scope and fixed price agreed before work starts, a working demo
                every Friday, and the repository in your name from the first commit.
              </p>
              <ul className="mt-6 space-y-2">
                {["Fixed written quote after discovery", "Weekly demos, no status theatre", "30 days of free fixes after launch"].map(
                  (item) => (
                    <li key={item} className="flex gap-2.5 text-[0.9375rem] text-ink-soft">
                      <Check className="mt-1 size-4 shrink-0 text-signal" strokeWidth={2.5} />
                      {item}
                    </li>
                  ),
                )}
              </ul>
              <span className="mt-7 inline-flex items-center gap-1.5 font-medium text-forest transition-transform group-hover:translate-x-1">
                See what we build <ArrowRight className="size-4" />
              </span>
            </Link>

            <Link
              href="/courses"
              className="group relative flex flex-col overflow-hidden rounded-lg border border-edge bg-forest-deep p-8 text-white transition-colors hover:border-signal"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-md bg-white/10 text-signal">
                <GraduationCap className="size-5" />
              </span>
              <h3 className="mt-5 text-2xl text-white">
                You want to become an engineer
              </h3>
              <p className="mt-3 flex-1 leading-relaxed text-mint/75">
                Cohort courses and one-to-one mentorship in frontend, backend,
                Cairo and Starknet, and design. Taught by people who ship client
                work in the same week they teach it.
              </p>
              <ul className="mt-6 space-y-2">
                {["Live cohorts with capped seat numbers", "Code review on your real pull requests", "AI study assistant included on every plan"].map(
                  (item) => (
                    <li key={item} className="flex gap-2.5 text-[0.9375rem] text-mint/75">
                      <Check className="mt-1 size-4 shrink-0 text-signal" strokeWidth={2.5} />
                      {item}
                    </li>
                  ),
                )}
              </ul>
              <span className="mt-7 inline-flex items-center gap-1.5 font-medium text-signal transition-transform group-hover:translate-x-1">
                See the courses <ArrowRight className="size-4" />
              </span>
            </Link>
          </div>
        </Container>
      </Section>

      {/* ── Services ─────────────────────────────────────────── */}
      <Section tone="mist">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Services"
              title="What we are hired to do"
              lead="Four things, done properly, rather than a list of everything a computer can do."
            />
            <ButtonLink href="/services" variant="secondary">
              All services <ArrowUpRight className="size-4" />
            </ButtonLink>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-edge bg-edge sm:grid-cols-2">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services#${service.slug}`}
                className="group flex flex-col bg-paper p-7 transition-colors hover:bg-mint/40"
              >
                <service.icon className="size-6 text-forest" strokeWidth={1.75} />
                <h3 className="mt-5 text-xl text-ink">{service.title}</h3>
                <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-ink-soft">
                  {service.summary}
                </p>
                <p className="mt-6 flex items-center gap-3 border-t border-edge pt-4 font-mono text-[0.6875rem] tracking-[0.14em] text-ink-faint uppercase">
                  <span>
                    {service.fromKobo
                      ? `From ${formatKobo(service.fromKobo)}`
                      : "Price on application"}
                  </span>
                  <span aria-hidden="true" className="text-edge-strong">/</span>
                  <span>{service.timeline}</span>
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── Process ──────────────────────────────────────────── */}
      <Section tone="paper">
        <Container>
          <SectionHeading
            eyebrow="How a project runs"
            title="No mysteries between the deposit and the launch"
            lead="Every engagement follows the same four stages. You always know which one you are in and what comes next."
          />
          <div className="mt-12">
            <ProcessList steps={deliveryProcess} />
          </div>
        </Container>
      </Section>

      {/* ── Guarantees ───────────────────────────────────────── */}
      <Section tone="mist">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="Why people trust us with a deposit"
                title="The four promises we put in every contract"
                lead="Nigerian businesses have good reason to be careful with software vendors. These are written commitments, not marketing lines."
              />
              <ButtonLink href="/verify" variant="secondary" className="mt-8">
                <ShieldCheck className="size-4" />
                Verify our registration
              </ButtonLink>
            </div>

            <ul className="grid gap-px overflow-hidden rounded-lg border border-edge bg-edge sm:grid-cols-2 lg:col-span-7">
              {guarantees.map((item) => (
                <li key={item.title} className="bg-paper p-6">
                  <Check className="size-5 text-signal" strokeWidth={2.5} />
                  <h3 className="mt-4 text-lg text-ink">{item.title}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">
                    {item.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* ── Courses ──────────────────────────────────────────── */}
      <Section tone="paper">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Training"
              title="Cohorts that end with you employable"
              lead="Small groups, capped seats, and real code review. Every course finishes with deployed work you can show someone."
            />
            <ButtonLink href="/courses" variant="secondary">
              All courses <ArrowUpRight className="size-4" />
            </ButtonLink>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        </Container>
      </Section>

      {/* ── AI-assisted learning ─────────────────────────────── */}
      <Section tone="ink">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <SectionHeading
                onDark
                eyebrow="AI-assisted learning"
                title="A tutor at 1am. A mentor on Tuesday."
                lead="Every course and mentorship plan includes a study assistant scoped to your curriculum — it knows which module you are in and what you are meant to be able to do by Friday."
              />

              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="font-mono text-[0.6875rem] tracking-[0.16em] text-signal uppercase">
                    What it does
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {[
                      "Explains the same idea a third way, patiently",
                      "Reads your code and finds the wrong assumption",
                      "Generates practice at the difficulty you are stuck on",
                      "Answers against your course material, not the open internet",
                    ].map((item) => (
                      <li key={item} className="flex gap-2.5 text-[0.9375rem] text-mint/75">
                        <Check className="mt-1 size-4 shrink-0 text-signal" strokeWidth={2.5} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-mono text-[0.6875rem] tracking-[0.16em] text-seal uppercase">
                    What it refuses
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {[
                      "Writing your assignment for you",
                      "Handing over a solution before you have tried",
                      "Replacing your mentor's judgement about your career",
                      "Pretending to be certain when it is not",
                    ].map((item) => (
                      <li key={item} className="flex gap-2.5 text-[0.9375rem] text-mint/75">
                        <span aria-hidden="true" className="mt-1 text-seal">
                          ×
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="mt-9 border-l-2 border-signal/60 pl-4 text-[0.9375rem] leading-relaxed text-mint/70">
                Learners who let a model write their code report high confidence
                and fail technical interviews. The typing is not the part you are
                paying to learn — so the assistant will not do it for you.
              </p>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-xl border border-white/12 bg-white/[0.04] p-7">
                <Badge tone="dark">Also taught as a course</Badge>
                <h3 className="mt-5 text-2xl text-white">AI-Assisted Engineering</h3>
                <p className="mt-3 leading-relaxed text-mint/75">
                  Six weeks on using these tools the way senior engineers do:
                  writing specifications a model can act on, reviewing generated
                  code critically, and building your own agentic tool against the
                  Claude API — including the parts where it breaks.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-6">
                  <span className="font-display text-2xl text-white">
                    {formatKobo(getCourse("ai-assisted-engineering")!.priceKobo)}
                  </span>
                  <span className="font-mono text-[0.6875rem] tracking-[0.14em] text-mint/55 uppercase">
                    6 weeks · self-paced + mentor
                  </span>
                </div>
                <ButtonLink
                  href="/courses/ai-assisted-engineering"
                  variant="inverse"
                  className="mt-6 w-full"
                >
                  Read the syllabus <ArrowRight className="size-4" />
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Mentorship ───────────────────────────────────────── */}
      <Section tone="paper">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="Mentorship"
                title="One engineer, in your corner, weekly"
                lead="For people who have the material and not the momentum. Your mentor reads your code before the call, so the call is spent on the hard part."
              />
              <ButtonLink href="/mentorship" className="mt-8">
                Compare plans <ArrowRight className="size-4" />
              </ButtonLink>
            </div>

            <ul className="grid gap-px overflow-hidden rounded-lg border border-edge bg-edge lg:col-span-7">
              {mentorshipPlans.map((plan) => (
                <li key={plan.slug}>
                  <Link
                    href={`/mentorship/${plan.slug}`}
                    className="group flex flex-wrap items-center justify-between gap-4 bg-paper p-6 transition-colors hover:bg-mint/40"
                  >
                    <div className="min-w-0">
                      <h3 className="flex items-center gap-2.5 text-lg text-ink">
                        {plan.name}
                        {plan.featured ? <Badge tone="green">Most chosen</Badge> : null}
                      </h3>
                      <p className="mt-1.5 max-w-md text-[0.9375rem] text-ink-soft">
                        {plan.bestFor}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="block font-display text-xl text-ink">
                        {formatKobo(plan.priceKobo)}
                      </span>
                      <span className="font-mono text-[0.625rem] tracking-[0.14em] text-ink-faint uppercase">
                        {plan.cadence}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <Section tone="mist">
        <Container>
          <SectionHeading
            eyebrow="In their words"
            title="Clients and graduates"
            lead="Quotes below are illustrative placeholders pending permission to publish names — replace before launch."
          />
          <div className="mt-12">
            <TestimonialGrid items={testimonials} />
          </div>
        </Container>
      </Section>

      {/* ── Closing CTA ──────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-forest">
        <Guilloche tone="white" className="opacity-[0.09]" />
        <Container className="relative">
          <div className="flex flex-col items-start gap-8 py-20 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h2 className="text-[clamp(1.9rem,4vw,2.75rem)] leading-[1.05] text-white">
                Tell us what you are trying to build — or what you are trying to
                become.
              </h2>
              <p className="mt-4 leading-relaxed text-mint/80">
                A reply within one working day, from a person. If we are not the
                right fit, we will say so and point you somewhere better.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/contact" variant="inverse" size="lg">
                Start a project <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink
                href="/courses"
                size="lg"
                className="border border-white/30 bg-transparent text-white hover:bg-white/10"
              >
                Enrol on a course
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
