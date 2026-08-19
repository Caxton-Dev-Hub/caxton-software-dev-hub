import Link from "next/link";

import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/logo";

const suggestions = [
  { href: "/services", label: "What we build" },
  { href: "/courses", label: "Courses" },
  { href: "/mentorship", label: "Mentorship" },
  { href: "/contact", label: "Contact us" },
];

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col bg-mist">
      <Container className="py-8">
        <Logo />
      </Container>

      <Container className="flex flex-1 items-center py-16">
        <div className="max-w-xl">
          <p className="font-mono text-[0.6875rem] tracking-[0.2em] text-forest uppercase">
            Error 404
          </p>
          <h1 className="mt-5 text-[clamp(2.2rem,5vw,3.5rem)] leading-[1.03] tracking-[-0.033em]">
            That page is not here
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">
            It may have moved, or the link may be wrong. Nothing is broken on
            your side.
          </p>

          <ul className="mt-8 flex flex-wrap gap-2">
            {suggestions.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex rounded-md border border-edge bg-paper px-3.5 py-2 text-[0.9375rem] text-ink-soft transition-colors hover:border-forest hover:text-forest"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <ButtonLink href="/" size="lg" className="mt-8">
            Back to the homepage
          </ButtonLink>
        </div>
      </Container>
    </main>
  );
}
