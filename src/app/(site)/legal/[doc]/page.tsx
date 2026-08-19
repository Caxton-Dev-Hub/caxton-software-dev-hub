import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/ui/container";
import { ArticleBody } from "@/components/article-body";
import { PageHeader } from "@/components/page-header";
import { getLegalDoc, legalDocs } from "@/content/legal";
import { formatDate } from "@/lib/utils";

type Params = { params: Promise<{ doc: string }> };

export function generateStaticParams() {
  return legalDocs.map((doc) => ({ doc: doc.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { doc: slug } = await params;
  const doc = getLegalDoc(slug);
  if (!doc) return { title: "Not found" };
  return { title: doc.title, description: doc.summary, robots: { index: true, follow: false } };
}

export default async function LegalPage({ params }: Params) {
  const { doc: slug } = await params;
  const doc = getLegalDoc(slug);
  if (!doc) notFound();

  return (
    <>
      <PageHeader
        eyebrow={`Legal · updated ${formatDate(doc.updated)}`}
        title={doc.title}
        lead={doc.summary}
      />

      <div className="py-14 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-8">
              <div className="mb-10 rounded-md border border-seal/35 bg-seal-soft px-4 py-3 text-[0.875rem] leading-relaxed text-ink-soft">
                <strong className="text-ink">Draft.</strong> This document is a
                plain-English starting point, not legal advice. Have it reviewed
                by a Nigerian lawyer before launch.
              </div>
              <ArticleBody body={doc.body} />
            </div>

            <aside className="lg:col-span-4">
              <nav className="sticky top-28 rounded-lg border border-edge bg-mist p-6">
                <h2 className="font-mono text-[0.6875rem] tracking-[0.16em] text-ink-soft uppercase">
                  Other documents
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {legalDocs.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/legal/${item.slug}`}
                        className={
                          item.slug === doc.slug
                            ? "text-[0.9375rem] font-medium text-forest"
                            : "text-[0.9375rem] text-ink-soft transition-colors hover:text-forest"
                        }
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          </div>
        </Container>
      </div>
    </>
  );
}
