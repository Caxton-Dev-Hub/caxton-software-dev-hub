import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArticleBody } from "@/components/article-body";
import { getPost, posts } from "@/content/posts";
import { formatDate } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Article not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { type: "article", publishedTime: post.date },
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const others = posts.filter((item) => item.slug !== post.slug).slice(0, 2);

  return (
    <>
      <header className="border-b border-edge bg-mist">
        <Container>
          <div className="max-w-2xl py-14 sm:py-20">
            <Link
              href="/insights"
              className="inline-flex items-center gap-1.5 font-mono text-[0.6875rem] tracking-[0.16em] text-ink-faint uppercase transition-colors hover:text-forest"
            >
              <ArrowLeft className="size-3.5" /> All insights
            </Link>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Badge tone="green">{post.category}</Badge>
              <span className="font-mono text-[0.6875rem] tracking-wider text-ink-faint uppercase">
                {formatDate(post.date)} · {post.readMinutes} min read
              </span>
            </div>

            <h1 className="mt-5 text-[clamp(1.9rem,4.4vw,3rem)] leading-[1.06] tracking-[-0.03em]">
              {post.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">{post.excerpt}</p>
          </div>
        </Container>
      </header>

      <article className="py-14 sm:py-20">
        <Container>
          <ArticleBody body={post.body} />

          <div className="mt-14 max-w-2xl rounded-lg border border-edge bg-mist p-7">
            <h2 className="text-xl text-ink">Want this kind of thinking on your project?</h2>
            <p className="mt-2.5 leading-relaxed text-ink-soft">
              We scope, price, and build software for Nigerian businesses — and
              train the engineers who maintain it.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <ButtonLink href="/contact">
                Start a project <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink href="/courses" variant="secondary">
                Browse courses
              </ButtonLink>
            </div>
          </div>

          {others.length > 0 ? (
            <div className="mt-14 max-w-2xl">
              <h2 className="font-mono text-[0.6875rem] tracking-[0.16em] text-forest uppercase">
                Read next
              </h2>
              <ul className="mt-5 divide-y divide-edge border-y border-edge">
                {others.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/insights/${item.slug}`}
                      className="group flex items-start justify-between gap-6 py-5"
                    >
                      <span>
                        <span className="block text-[1.0625rem] text-ink transition-colors group-hover:text-forest">
                          {item.title}
                        </span>
                        <span className="mt-1 block font-mono text-[0.6875rem] tracking-wider text-ink-faint uppercase">
                          {item.readMinutes} min read
                        </span>
                      </span>
                      <ArrowRight className="mt-1 size-4 shrink-0 text-forest transition-transform group-hover:translate-x-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Container>
      </article>
    </>
  );
}
