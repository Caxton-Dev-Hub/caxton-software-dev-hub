import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { MentorshipApplication } from "@/components/mentorship-application";
import { getPlan, mentorshipPlans } from "@/content/mentorship";
import { formatKobo } from "@/lib/money";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return mentorshipPlans.map((plan) => ({ slug: plan.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const plan = getPlan(slug);
  if (!plan) return { title: "Plan not found" };
  return { title: `${plan.name} mentorship`, description: plan.pitch };
}

export default async function MentorshipPlanPage({ params }: Params) {
  const { slug } = await params;
  const plan = getPlan(slug);
  if (!plan) notFound();

  return (
    <>
      <header className="border-b border-edge bg-mist">
        <Container>
          <div className="grid gap-10 py-14 sm:py-20 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <Link
                href="/mentorship"
                className="inline-flex items-center gap-1.5 font-mono text-[0.6875rem] tracking-[0.16em] text-ink-faint uppercase transition-colors hover:text-forest"
              >
                <ArrowLeft className="size-3.5" /> All plans
              </Link>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                <Badge tone="green">{plan.commitment}</Badge>
                <Badge>{plan.seats} places</Badge>
              </div>

              <h1 className="mt-5 text-[clamp(2rem,4.6vw,3.25rem)] leading-[1.04] tracking-[-0.032em]">
                {plan.name} mentorship
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
                {plan.pitch}
              </p>

              <p className="mt-8 flex items-baseline gap-2">
                <span className="font-display text-4xl text-ink">
                  {formatKobo(plan.priceKobo)}
                </span>
                <span className="text-ink-faint">{plan.cadence}</span>
              </p>

              <h2 className="mt-10 font-mono text-[0.6875rem] tracking-[0.16em] text-forest uppercase">
                What is included
              </h2>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {plan.includes.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2.5 text-[0.9375rem] leading-relaxed text-ink-soft"
                  >
                    <Check className="mt-1 size-4 shrink-0 text-signal" strokeWidth={2.5} />
                    {item}
                  </li>
                ))}
              </ul>

              <p className="mt-8 rounded-lg border border-edge bg-paper p-5 text-[0.9375rem] leading-relaxed text-ink-soft">
                <span className="font-medium text-ink">Best for:</span> {plan.bestFor}
              </p>
            </div>

            <div className="lg:col-span-5">
              <MentorshipApplication plan={plan} />
            </div>
          </div>
        </Container>
      </header>
    </>
  );
}
