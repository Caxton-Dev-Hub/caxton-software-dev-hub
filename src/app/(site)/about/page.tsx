import type { Metadata } from "next";
import { ArrowRight, MapPin, ShieldCheck, Target } from "lucide-react";

import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
import { PageHeader } from "@/components/page-header";
import { RegistryStrip } from "@/components/registry-strip";
import { ProcessList } from "@/components/process-list";
import { deliveryProcess } from "@/content/services";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "About us",
  description: `${site.registration.entityName} is a CAC-registered software development and web design business based in ${site.address.city}, Nigeria.`,
};

const beliefs = [
  {
    title: "A deposit is a matter of trust, not a transaction",
    body: "Too many Nigerian businesses have paid a developer and received silence. We structure every engagement so you can see progress weekly and walk away with everything you paid for at any point.",
  },
  {
    title: "Teaching and building belong together",
    body: "Our instructors take client work in the same weeks they teach. That is deliberate: a curriculum written by someone who has not shipped recently goes stale within a year.",
  },
  {
    title: "Tools should not become dependencies",
    body: "We use AI heavily and teach it directly. We also refuse to let a model write a learner's assignment, because the shortcut costs them the interview later.",
  },
  {
    title: "Local context is not a limitation",
    body: "We build for the network conditions, the payment rails, and the devices our users actually have. A site that only performs well on fibre has not been finished.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="A registered studio in Kaduna, building and teaching in the same week"
        lead="Caxton Software Dev Hub exists because two problems in Nigerian software share one cause: businesses cannot find teams they can trust, and engineers cannot find training that ends in a job. Both are solved by people who actually ship."
        aside={
          <div className="rounded-lg border border-edge bg-paper p-6">
            <RegistryStrip linkToVerify={false} />
            <dl className="mt-5 space-y-3.5 text-[0.9375rem]">
              <div>
                <dt className="font-mono text-[0.625rem] tracking-[0.16em] text-ink-faint uppercase">
                  Registered name
                </dt>
                <dd className="mt-1 text-ink">{site.registration.entityName}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.625rem] tracking-[0.16em] text-ink-faint uppercase">
                  Nature of business
                </dt>
                <dd className="mt-1 text-ink">{site.registration.natureOfBusiness}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.625rem] tracking-[0.16em] text-ink-faint uppercase">
                  Principal place of business
                </dt>
                <dd className="mt-1 flex gap-2 text-ink">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-forest" />
                  <span>{site.address.full}</span>
                </dd>
              </div>
            </dl>
          </div>
        }
      />

      <Section tone="paper">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <SectionHeading
                eyebrow="What we are"
                title="Two businesses that make each other better"
              />
              <div className="prose-body mt-7 text-[1.0625rem]">
                <p>
                  On one side, we are a software studio. Businesses come to us
                  with something they need built — a dispatch system, a members&rsquo;
                  portal, a marketing site that loads on a two-bar connection — and
                  we scope it, price it, build it, and hand it over with the keys.
                </p>
                <p>
                  On the other, we are a training hub. Engineers come to us with
                  half-finished tutorials and no idea what a code review feels
                  like, and leave with deployed projects, a reviewed portfolio,
                  and a mentor who will vouch for them by name.
                </p>
                <p>
                  These are not separate ventures that happen to share an office.
                  The client work keeps the curriculum honest, and the training
                  gives our client work a bench of engineers we have watched grow
                  up. When we hire, we hire from our own cohorts first.
                </p>
                <p>
                  We are registered with the Corporate Affairs Commission as a
                  business name under the Companies and Allied Matters Act 2020,
                  operating from {site.address.city}, {site.address.state}. That
                  registration is on the certificate, the number is public, and we
                  would rather you checked it than took our word.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="sticky top-28 space-y-4">
                <div className="rounded-lg border border-edge bg-mist p-6">
                  <Target className="size-5 text-forest" />
                  <h3 className="mt-4 text-lg text-ink">What we are trying to do</h3>
                  <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-soft">
                    Make &ldquo;we hired a Nigerian software team&rdquo; a sentence
                    people say with confidence — by being one of the teams that
                    earns it, and by training the next hundred.
                  </p>
                </div>
                <div className="rounded-lg border border-edge bg-mist p-6">
                  <ShieldCheck className="size-5 text-seal" />
                  <h3 className="mt-4 text-lg text-ink">How you can check us</h3>
                  <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-soft">
                    Our registration number, our address, and our public code are
                    all verifiable in a few minutes. We have written the steps out.
                  </p>
                  <ButtonLink href="/verify" variant="secondary" size="sm" className="mt-4">
                    Verify us <ArrowRight className="size-3.5" />
                  </ButtonLink>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="mist">
        <Container>
          <SectionHeading
            eyebrow="What we believe"
            title="Four positions we will not trade away"
          />
          <ul className="mt-12 grid gap-px overflow-hidden rounded-lg border border-edge bg-edge sm:grid-cols-2">
            {beliefs.map((belief, index) => (
              <li key={belief.title} className="bg-paper p-7">
                <span className="font-mono text-sm text-forest">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-xl leading-snug text-ink">{belief.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
                  {belief.body}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="paper">
        <Container>
          <SectionHeading
            eyebrow="How we work"
            title="The same four stages, every single project"
          />
          <div className="mt-12">
            <ProcessList steps={deliveryProcess} />
          </div>
          <div className="mt-12 flex flex-wrap gap-3">
            <ButtonLink href="/contact">
              Talk to us <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink href="/work" variant="secondary">
              See our work
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
