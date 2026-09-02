import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { getProject, projects } from "@/content/projects";

type Params = { params: Promise<{ slug: string }> };

/**
 * The case-study slugs are content-as-code, so the complete set is known at
 * build time and anything else is a 404 decided by the router.
 *
 * This is load-bearing, not tidiness. With no projects `generateStaticParams`
 * returns an empty list, which lets Next classify this route as static; an old
 * bookmarked /work/... URL then renders anyway, the `(site)` layout reads the
 * session cookie, and the request dies with "page changed from static to
 * dynamic at runtime" — a 500 where the visitor should have got a 404.
 * Refusing unknown params up front means that render never starts.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Case study not found" };
  return { title: project.title, description: project.summary };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const sections = [
    { title: "The problem", body: project.problem },
    { title: "What we did", body: project.approach },
    { title: "The result", body: project.result },
  ];

  return (
    <>
      <header className="border-b border-edge bg-mist">
        <Container>
          <div className="py-14 sm:py-20">
            <Link
              href="/work"
              className="inline-flex items-center gap-1.5 font-mono text-[0.6875rem] tracking-[0.16em] text-ink-faint uppercase transition-colors hover:text-forest"
            >
              <ArrowLeft className="size-3.5" /> All work
            </Link>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Badge tone="green">{project.sector}</Badge>
              <Badge>{project.year}</Badge>
            </div>

            <h1 className="mt-5 max-w-3xl text-[clamp(2rem,4.6vw,3.25rem)] leading-[1.04] tracking-[-0.032em]">
              {project.title}
            </h1>
            <p className="mt-4 font-mono text-[0.75rem] tracking-[0.14em] text-ink-faint uppercase">
              {project.client}
            </p>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
              {project.summary}
            </p>
          </div>
        </Container>
      </header>

      <Section tone="paper">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="space-y-12 lg:col-span-8">
              {sections.map((section) => (
                <section key={section.title}>
                  <h2 className="font-mono text-[0.6875rem] tracking-[0.16em] text-forest uppercase">
                    {section.title}
                  </h2>
                  <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-soft">
                    {section.body}
                  </p>
                </section>
              ))}
            </div>

            <aside className="lg:col-span-4">
              <div className="sticky top-28 rounded-lg border border-edge bg-mist p-6">
                <h2 className="font-mono text-[0.6875rem] tracking-[0.16em] text-ink-soft uppercase">
                  Stack
                </h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.stack.map((tool) => (
                    <li
                      key={tool}
                      className="rounded border border-edge bg-paper px-2.5 py-1 font-mono text-[0.6875rem] text-ink-soft"
                    >
                      {tool}
                    </li>
                  ))}
                </ul>
                <ButtonLink href="/contact" className="mt-6 w-full">
                  Discuss a similar build <ArrowRight className="size-4" />
                </ButtonLink>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
