import type { Metadata } from "next";
import { AlertTriangle, ExternalLink, ShieldCheck } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { PageHeader } from "@/components/page-header";
import { Guilloche } from "@/components/guilloche";
import { GithubIcon } from "@/components/icons";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Verify our registration",
  description: `${site.registration.entityName} is registered with the Corporate Affairs Commission under registration number ${site.registration.number}. Here is how to check it yourself.`,
};

const record = [
  { label: "Registered name", value: site.registration.entityName, mono: true },
  { label: "Registration number", value: site.registration.number, mono: true },
  { label: "Registration type", value: site.registration.kind },
  { label: "Registered under", value: site.registration.act },
  { label: "Nature of business", value: site.registration.natureOfBusiness },
  { label: "Principal place of business", value: site.address.full },
  { label: "Date of registration", value: site.registration.registeredOn },
  { label: "Issued at", value: site.registration.place },
];

const steps = [
  {
    step: "01",
    title: "Search the CAC public register",
    body: "Go to the Corporate Affairs Commission's public search and enter the registration number below. The name it returns should match ours exactly, character for character.",
    link: { href: "https://search.cac.gov.ng", label: "search.cac.gov.ng" },
  },
  {
    step: "02",
    title: "Check the address matches",
    body: "The principal place of business on the register should match the Kaduna address we publish on this site and on every invoice we send you.",
  },
  {
    step: "03",
    title: "Read our public code",
    body: "Our engineers work in public. Look at the commit history — the depth and consistency of real work is difficult to fake, and easy for a technical person you trust to assess.",
    link: { href: site.socials.github, label: "github.com/caxtonacollins" },
  },
  {
    step: "04",
    title: "Ask us what we have not done",
    body: "We are a new studio, and we will say so rather than let you find out. Ask how many projects like yours we have delivered, and hold us to the answer. Once we have clients who agree to speak to you, this is where their names will be.",
  },
];

export default function VerifyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Verification"
        title="Do not take our word for any of it"
        lead="Anyone can build a website that claims to be a company. Here is the public record behind this one, and four ways to check it in under ten minutes."
      />

      <Section tone="paper">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            {/* The record itself, set like a certificate entry. */}
            <div className="lg:col-span-7">
              <div className="relative overflow-hidden rounded-lg border-2 border-forest/25 bg-paper">
                <Guilloche tone="forest" className="opacity-[0.13]" />

                <div className="relative border-b border-forest/20 px-7 py-5 text-center">
                  <p className="font-mono text-[0.625rem] tracking-[0.28em] text-forest uppercase">
                    Federal Republic of Nigeria
                  </p>
                  <p className="mt-2 font-display text-lg text-ink">
                    Certificate of Registration
                  </p>
                  <p className="mt-1 font-mono text-[0.625rem] tracking-[0.18em] text-ink-faint uppercase">
                    {site.registration.registrar}
                  </p>
                </div>

                <dl className="relative divide-y divide-forest/12 bg-paper/85 px-7">
                  {record.map((row) => (
                    <div
                      key={row.label}
                      className="grid gap-1 py-4 sm:grid-cols-5 sm:items-baseline sm:gap-4"
                    >
                      <dt className="font-mono text-[0.625rem] tracking-[0.14em] text-ink-faint uppercase sm:col-span-2">
                        {row.label}
                      </dt>
                      <dd
                        className={
                          row.mono
                            ? "font-mono text-[0.9375rem] tracking-wide text-forest-deep sm:col-span-3"
                            : "text-[0.9375rem] text-ink sm:col-span-3"
                        }
                      >
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="relative flex items-center gap-3 border-t border-forest/20 bg-mint/40 px-7 py-4">
                  <ShieldCheck className="size-5 shrink-0 text-seal" />
                  <p className="text-[0.8125rem] leading-relaxed text-ink-soft">
                    Transcribed from the certificate issued by the Registrar-General.
                    The original PDF is available on request, and the same details
                    appear on every invoice and contract we send.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex items-start gap-3 rounded-lg border border-seal/35 bg-seal-soft p-5">
                <AlertTriangle className="mt-0.5 size-5 shrink-0 text-seal" />
                <div>
                  <h2 className="text-[1.0625rem] font-medium text-ink">
                    If someone contacts you claiming to be us
                  </h2>
                  <ul className="mt-3 space-y-2 text-[0.9375rem] leading-relaxed text-ink-soft">
                    <li>
                      We will <strong className="text-ink">never</strong> ask you
                      to pay into a personal bank account. Every payment goes
                      through Flutterwave or to an account in the registered
                      business name above.
                    </li>
                    <li>
                      We will never ask for your card PIN, your BVN, or a one-time
                      password. No legitimate business ever needs these.
                    </li>
                    <li>
                      Our emails come from the domain published on this site.
                      Anything from a free email address is not us.
                    </li>
                    <li>
                      If in doubt, call the number on this site before sending
                      money — not a number given to you by the person asking.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Verification steps. */}
            <div className="lg:col-span-5">
              <h2 className="font-mono text-[0.6875rem] tracking-[0.16em] text-forest uppercase">
                Check it yourself
              </h2>

              <ol className="mt-6 space-y-6">
                {steps.map((item) => (
                  <li key={item.step} className="border-l-2 border-edge pl-5">
                    <span className="font-mono text-sm text-forest">{item.step}</span>
                    <h3 className="mt-1.5 text-lg text-ink">{item.title}</h3>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">
                      {item.body}
                    </p>
                    {item.link ? (
                      <a
                        href={item.link.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="mt-2.5 inline-flex items-center gap-1.5 font-mono text-[0.75rem] text-forest underline underline-offset-4"
                      >
                        {item.link.href.includes("github") ? (
                          <GithubIcon className="size-3.5" />
                        ) : (
                          <ExternalLink className="size-3.5" />
                        )}
                        {item.link.label}
                      </a>
                    ) : null}
                  </li>
                ))}
              </ol>

              <div className="mt-8 rounded-lg border border-edge bg-mist p-6">
                <h3 className="text-[1.0625rem] font-medium text-ink">
                  Our public code
                </h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">
                  Two accounts, both active. Commit history is the least fakeable
                  credential in this industry.
                </p>
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
                      className="flex items-center gap-2.5 rounded-md border border-edge bg-paper px-3.5 py-2.5 font-mono text-[0.8125rem] text-ink transition-colors hover:border-forest hover:text-forest"
                    >
                      <GithubIcon className="size-4" />
                      github.com/{account.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="mist">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="Why we publish this"
            title="Because the last developer who took a deposit and vanished made your caution reasonable"
            lead="We would rather spend ten minutes proving we are real than an hour explaining why the industry has a reputation problem. Check the number. Call the reference. Then let us talk about the work."
          />
        </Container>
      </Section>
    </>
  );
}
