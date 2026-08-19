import type { Metadata } from "next";
import { Suspense } from "react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PageHeader } from "@/components/page-header";
import { ContactForm } from "@/components/contact-form";
import { RegistryStrip } from "@/components/registry-strip";
import { GithubIcon, WhatsappIcon } from "@/components/icons";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Talk to Caxton Software Dev Hub about a software project, a course, or mentorship. Based in ${site.address.city}, working with clients across Nigeria and beyond.`,
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Tell us what you are trying to build"
        lead="A person replies within one working day. If we are not the right fit for the job, we will say so and point you somewhere better."
      />

      <Section tone="paper">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Suspense
                fallback={
                  <p className="text-ink-faint">Loading the form…</p>
                }
              >
                <ContactForm />
              </Suspense>
            </div>

            <aside className="lg:col-span-5">
              <div className="space-y-4">
                <div className="rounded-lg border border-edge bg-mist p-6">
                  <h2 className="font-mono text-[0.6875rem] tracking-[0.16em] text-ink-soft uppercase">
                    Direct lines
                  </h2>
                  <ul className="mt-5 space-y-4">
                    <li className="flex gap-3">
                      <Mail className="mt-0.5 size-4 shrink-0 text-forest" />
                      <span>
                        <span className="block text-[0.9375rem] text-ink">
                          <a href={`mailto:${site.contact.email}`} className="hover:text-forest">
                            {site.contact.email}
                          </a>
                        </span>
                        <span className="text-[0.8125rem] text-ink-faint">
                          Projects and general enquiries
                        </span>
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <Mail className="mt-0.5 size-4 shrink-0 text-forest" />
                      <span>
                        <span className="block text-[0.9375rem] text-ink">
                          <a href={`mailto:${site.contact.training}`} className="hover:text-forest">
                            {site.contact.training}
                          </a>
                        </span>
                        <span className="text-[0.8125rem] text-ink-faint">
                          Courses, cohorts, and mentorship
                        </span>
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <Phone className="mt-0.5 size-4 shrink-0 text-forest" />
                      <span className="text-[0.9375rem] text-ink">
                        <a href={`tel:${site.contact.phone.replace(/\s/g, "")}`} className="hover:text-forest">
                          {site.contact.phone}
                        </a>
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <WhatsappIcon className="mt-0.5 size-4 shrink-0 text-forest" />
                      <span className="text-[0.9375rem] text-ink">
                        {site.contact.whatsapp}
                        <span className="ml-2 text-[0.8125rem] text-ink-faint">WhatsApp</span>
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <Clock className="mt-0.5 size-4 shrink-0 text-forest" />
                      <span className="text-[0.9375rem] text-ink-soft">
                        {site.contact.hours}
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg border border-edge bg-paper p-6">
                  <h2 className="font-mono text-[0.6875rem] tracking-[0.16em] text-ink-soft uppercase">
                    Office
                  </h2>
                  <p className="mt-4 flex gap-3 text-[0.9375rem] leading-relaxed text-ink">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-forest" />
                    <span>
                      {site.address.street}
                      <br />
                      {site.address.area}
                      <br />
                      {site.address.city}, {site.address.state}
                      <br />
                      {site.address.country}
                    </span>
                  </p>
                  <p className="mt-4 text-[0.8125rem] leading-relaxed text-ink-faint">
                    Visits by appointment — message first so someone is expecting you.
                  </p>
                  <div className="mt-5">
                    <RegistryStrip />
                  </div>
                </div>

                <div className="rounded-lg border border-edge bg-paper p-6">
                  <h2 className="font-mono text-[0.6875rem] tracking-[0.16em] text-ink-soft uppercase">
                    Our code
                  </h2>
                  <div className="mt-4 space-y-2">
                    {[
                      { href: site.socials.github, label: "caxtonacollins" },
                      { href: site.socials.githubAlt, label: "strngecloud" },
                    ].map((account) => (
                      <a
                        key={account.label}
                        href={account.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="flex items-center gap-2.5 font-mono text-[0.8125rem] text-ink-soft transition-colors hover:text-forest"
                      >
                        <GithubIcon className="size-4" />
                        github.com/{account.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
