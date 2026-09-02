import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { GithubIcon } from "@/components/icons";

import { Container } from "@/components/ui/container";
import { Logo } from "@/components/logo";
import { RegistryStrip } from "@/components/registry-strip";
import { NewsletterForm } from "@/components/newsletter-form";
import { hasWork, site } from "@/content/site";

const columns = [
  {
    title: "Services",
    links: [
      { href: "/services", label: "What we build" },
      // Dropped while there is no delivered work — see src/content/projects.ts.
      ...(hasWork ? [{ href: "/work", label: "Selected work" }] : []),
      { href: "/services#process", label: "How we work" },
      { href: "/contact", label: "Start a project" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/courses", label: "All courses" },
      { href: "/mentorship", label: "Mentorship plans" },
      { href: "/courses#faq", label: "Training FAQ" },
      { href: "/insights", label: "Insights" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About us" },
      { href: "/verify", label: "Verify our registration" },
      { href: "/contact", label: "Contact" },
      { href: "/legal/terms", label: "Terms of service" },
      { href: "/legal/privacy", label: "Privacy policy" },
      { href: "/legal/refunds", label: "Refund policy" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-forest-deep text-mint/70">
      <Container>
        <div className="grid gap-12 py-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Logo onDark />
            <p className="mt-5 max-w-xs text-sm leading-relaxed">
              A registered Nigerian software studio. We build production software
              for businesses, and train the engineers who will maintain it.
            </p>
            <div className="mt-6">
              <RegistryStrip onDark />
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title} className="lg:col-span-2">
              <h3 className="font-mono text-[0.6875rem] tracking-[0.16em] text-white uppercase">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-2">
            <h3 className="font-mono text-[0.6875rem] tracking-[0.16em] text-white uppercase">
              Monthly note
            </h3>
            <p className="mt-4 text-sm leading-relaxed">
              One email a month: what we shipped, what we learned, and when the
              next cohort opens.
            </p>
            <div className="mt-4">
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="grid gap-6 border-t border-white/10 py-8 sm:grid-cols-3">
          <p className="flex items-start gap-2.5 text-sm">
            <MapPin className="mt-0.5 size-4 shrink-0 text-signal" />
            <span>
              {site.address.street}, {site.address.area},
              <br />
              {site.address.city}, {site.address.state}, {site.address.country}
            </span>
          </p>
          <p className="flex items-start gap-2.5 text-sm">
            <Mail className="mt-0.5 size-4 shrink-0 text-signal" />
            <a href={`mailto:${site.contact.email}`} className="hover:text-white">
              {site.contact.email}
            </a>
          </p>
          <p className="flex items-start gap-2.5 text-sm">
            <Phone className="mt-0.5 size-4 shrink-0 text-signal" />
            <span>
              <a href={`tel:${site.contact.phone.replace(/\s/g, "")}`} className="hover:text-white">
                {site.contact.phone}
              </a>
              <br />
              <span className="text-mint/50">{site.contact.hours}</span>
            </span>
          </p>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.6875rem] tracking-wider text-mint/50 uppercase">
            © {new Date().getFullYear()} {site.registration.entityName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href={site.socials.github}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 text-sm transition-colors hover:text-white"
            >
              <GithubIcon className="size-4" />
              caxtonacollins
            </a>
            <a
              href={site.socials.githubAlt}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 text-sm transition-colors hover:text-white"
            >
              <GithubIcon className="size-4" />
              strngecloud
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
