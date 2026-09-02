import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { posts } from "@/content/posts";
import { formatDate } from "@/lib/utils";
import { Pagination } from "@/components/ui/pagination";
import { paginateList, parsePage } from "@/lib/pagination";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Practical writing on software delivery, hiring developers in Nigeria, and learning to engineer — from the team at Caxton Software Dev Hub.",
};

type Params = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const POSTS_PER_PAGE = 10;

export default async function InsightsPage({ searchParams }: Params) {
  const query = await searchParams;
  const sortedAll = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  const { rows: sorted, info } = paginateList(
    sortedAll,
    parsePage(query.page),
    POSTS_PER_PAGE,
  );

  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title="Notes from building and teaching"
        lead="What we have learned delivering software in Nigeria and training the people who maintain it. No listicles."
      />

      <Section tone="paper">
        <Container>
          <ul className="divide-y divide-edge border-y border-edge">
            {sorted.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/insights/${post.slug}`}
                  className="group grid gap-4 py-8 lg:grid-cols-12 lg:gap-8"
                >
                  <div className="flex items-start gap-3 lg:col-span-3">
                    <Badge tone="green">{post.category}</Badge>
                    <span className="mt-1 font-mono text-[0.6875rem] tracking-wider text-ink-faint uppercase">
                      {formatDate(post.date)}
                    </span>
                  </div>

                  <div className="lg:col-span-8">
                    <h2 className="text-2xl leading-snug text-ink transition-colors group-hover:text-forest">
                      {post.title}
                    </h2>
                    <p className="mt-2.5 max-w-2xl leading-relaxed text-ink-soft">
                      {post.excerpt}
                    </p>
                    <p className="mt-3 font-mono text-[0.6875rem] tracking-wider text-ink-faint uppercase">
                      {post.readMinutes} minute read
                    </p>
                  </div>

                  <div className="lg:col-span-1 lg:text-right">
                    <ArrowUpRight className="inline size-5 text-forest transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <Pagination
            info={info}
            basePath="/insights"
            params={query}
            label="posts"
          />
        </Container>
      </Section>
    </>
  );
}
