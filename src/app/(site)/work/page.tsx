import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Selected work",
  description:
    "Case studies from Caxton Software Dev Hub — logistics, cooperative finance, onchain rewards, and education systems built for Nigerian organisations.",
};

export default function WorkPage() {
  return (
    <>
      <PageHeader
        eyebrow="Selected work"
        title="Systems that replaced a spreadsheet and a WhatsApp group"
        lead="Four representative engagements. Case studies below are illustrative placeholders pending client sign-off — replace the content in src/content/projects.ts before launch."
      />

      <Section tone="paper">
        <Container>
          <div className="grid gap-px overflow-hidden rounded-lg border border-edge bg-edge lg:grid-cols-2">
            {projects.map((project) => (
              <article
                key={project.slug}
                className="group relative flex flex-col bg-paper p-8 transition-colors hover:bg-mist"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="green">{project.sector}</Badge>
                  <Badge>{project.year}</Badge>
                  {project.dummy ? <Badge tone="seal">Placeholder</Badge> : null}
                </div>

                <h2 className="mt-5 text-2xl leading-snug text-ink">
                  <Link
                    href={`/work/${project.slug}`}
                    className="after:absolute after:inset-0"
                  >
                    {project.title}
                  </Link>
                </h2>
                <p className="mt-1.5 font-mono text-[0.6875rem] tracking-[0.14em] text-ink-faint uppercase">
                  {project.client}
                </p>

                <p className="mt-4 flex-1 leading-relaxed text-ink-soft">
                  {project.summary}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-edge pt-5">
                  {project.stack.map((tool) => (
                    <span
                      key={tool}
                      className="rounded border border-edge px-2 py-0.5 font-mono text-[0.6875rem] text-ink-faint"
                    >
                      {tool}
                    </span>
                  ))}
                </div>

                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-forest transition-transform group-hover:translate-x-1">
                  Read the case study <ArrowUpRight className="size-4" />
                </span>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="mist">
        <Container>
          <div className="flex flex-col items-start gap-6 rounded-lg border border-edge bg-paper p-9 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-lg">
              <h2 className="text-2xl text-ink">Something similar in mind?</h2>
              <p className="mt-2.5 leading-relaxed text-ink-soft">
                Tell us the problem rather than the solution. We will come back
                with an approach, a timeline, and a number.
              </p>
            </div>
            <ButtonLink href="/contact" size="lg">
              Start a project <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
