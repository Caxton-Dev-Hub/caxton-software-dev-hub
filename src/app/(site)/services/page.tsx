import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";

import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
import { PageHeader } from "@/components/page-header";
import { ProcessList } from "@/components/process-list";
import { FaqList } from "@/components/faq-list";
import { clientFaqs } from "@/content/faq";
import { deliveryProcess, services } from "@/content/services";
import { formatKobo } from "@/lib/money";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Custom software development, web design and development, embedded product engineering, and corporate training — delivered from Kaduna, Nigeria, with fixed scope and fixed pricing.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Software built to be handed over, not held hostage"
        lead="Four services. Every one of them starts with a written scope and a fixed price, and ends with you owning the code, the accounts, and the documentation."
        aside={
          <div className="rounded-lg border border-edge bg-paper p-6">
            <p className="font-mono text-[0.625rem] tracking-[0.16em] text-ink-faint uppercase">
              Typical engagement
            </p>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
              Discovery in week zero, a fixed quote before you commit, then
              two-week sprints with a working demo every Friday until launch.
            </p>
            <ButtonLink href="/contact" className="mt-5 w-full">
              Book a discovery call <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
        }
      />

      <Section tone="paper">
        <Container>
          <div className="space-y-16">
            {services.map((service, index) => (
              <article
                key={service.slug}
                id={service.slug}
                className="grid scroll-mt-28 gap-8 border-t border-edge pt-12 lg:grid-cols-12 lg:gap-12"
              >
                <div className="lg:col-span-5">
                  <span className="font-mono text-sm text-forest">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="mt-3 flex items-start gap-3 text-2xl leading-snug text-ink sm:text-3xl">
                    <service.icon
                      className="mt-1 size-6 shrink-0 text-forest"
                      strokeWidth={1.75}
                    />
                    {service.title}
                  </h2>
                  <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-soft">
                    {service.summary}
                  </p>

                  <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
                    <div>
                      <dt className="font-mono text-[0.625rem] tracking-[0.16em] text-ink-faint uppercase">
                        Indicative price
                      </dt>
                      <dd className="mt-1 font-display text-lg text-ink">
                        {service.fromKobo
                          ? `From ${formatKobo(service.fromKobo)}`
                          : "On application"}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[0.625rem] tracking-[0.16em] text-ink-faint uppercase">
                        Timeline
                      </dt>
                      <dd className="mt-1 font-display text-lg text-ink">
                        {service.timeline}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="lg:col-span-7">
                  <div className="rounded-lg border border-edge bg-mist p-7">
                    <h3 className="font-mono text-[0.6875rem] tracking-[0.16em] text-ink-soft uppercase">
                      What you receive
                    </h3>
                    <ul className="mt-5 space-y-3">
                      {service.deliverables.map((item) => (
                        <li
                          key={item}
                          className="flex gap-3 text-[0.9375rem] leading-relaxed text-ink-soft"
                        >
                          <Check
                            className="mt-1 size-4 shrink-0 text-signal"
                            strokeWidth={2.5}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <ButtonLink
                      href={`/contact?service=${encodeURIComponent(service.title)}`}
                      variant="secondary"
                      className="mt-7"
                    >
                      Enquire about this <ArrowRight className="size-4" />
                    </ButtonLink>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="ink" id="process">
        <Container>
          <SectionHeading
            onDark
            eyebrow="Delivery"
            title="You always know which stage you are in"
            lead="No project disappears into a black box. Each stage has a deliverable you can look at and approve."
          />
          <div className="mt-12">
            <ProcessList steps={deliveryProcess} onDark />
          </div>
        </Container>
      </Section>

      <Section tone="paper">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <SectionHeading
                eyebrow="Common questions"
                title="Before you send the first email"
              />
            </div>
            <div className="lg:col-span-8">
              <FaqList items={clientFaqs} />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
