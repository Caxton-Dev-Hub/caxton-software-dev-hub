"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { nav } from "@/content/site";
import { cn } from "@/lib/utils";

export function SiteHeader({ signedIn = false }: { signedIn?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [renderedPath, setRenderedPath] = useState(pathname);
  const [current, setCurrent] = useState<string | null>(null);

  // On the landing page the nav scrolls to a band rather than leaving the
  // page; everywhere else it goes to the full page as before. Each band on the
  // landing page carries its own link out to that page, so nothing is lost.
  const onLanding = pathname === "/";

  // Close the mobile menu on navigation by adjusting state during render,
  // which is cheaper than an effect and avoids a second render pass.
  if (renderedPath !== pathname) {
    setRenderedPath(pathname);
    setOpen(false);
  }

  // Track which band is on screen so the nav says where the reader is. Only
  // runs on the landing page, where the anchors exist.
  useEffect(() => {
    // A stale value from a previous visit to the landing page is harmless:
    // `active` below only consults it while `onLanding` is true, and the
    // observer re-runs and overwrites it on the way back.
    if (!onLanding || typeof IntersectionObserver === "undefined") return;

    const sections: HTMLElement[] = [];
    for (const item of nav) {
      const id = "section" in item ? item.section : undefined;
      const element = id ? document.getElementById(id) : null;
      if (element) sections.push(element);
    }

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Several bands can straddle the viewport at once; the one whose top
        // is highest on screen is the one the reader is actually in.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setCurrent(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, [onLanding]);

  // With a full-page backdrop behind the menu, letting the page scroll under
  // it reads as a bug. Same treatment as the dashboard drawer.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    // Deferred so the first paint is not blocked by a synchronous state write.
    const frame = window.requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      {/*
       * Dim and blur the page behind the open menu.
       *
       * This sits outside <header> on purpose: the header carries its own
       * `backdrop-blur-md`, and a backdrop-filter nested inside another one is
       * clipped to its ancestor's backdrop, so the blur simply did not appear.
       * As a sibling at a lower z-index it blurs the page and stays underneath
       * the header and the menu panel.
       *
       * It is a button because tapping outside to dismiss is the first thing
       * people try on a phone, and that should be reachable by keyboard too.
       */}
      {open ? (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 top-18 z-40 cursor-default bg-ink/30 backdrop-blur-sm lg:hidden"
        />
      ) : null}

      <header
        className={cn(
          "sticky top-0 z-50 border-b bg-paper/90 backdrop-blur-md transition-colors",
          scrolled ? "border-edge" : "border-transparent",
        )}
      >
        <Container>
          <div className="flex h-18 items-center justify-between gap-6">
            <Logo />

            <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
              {nav.map((item) => {
                const section = "section" in item ? item.section : undefined;
                const href = onLanding && section ? `#${section}` : item.href;
                const active = onLanding
                  ? section !== undefined && current === section
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={href}
                    aria-current={active ? "true" : undefined}
                    className={cn(
                      "relative rounded-md px-3 py-2 text-[0.9375rem] transition-colors",
                      active
                        ? "text-forest"
                        : "text-ink-soft hover:text-ink",
                    )}
                  >
                    {item.label}
                    {active ? (
                      <span className="absolute inset-x-3 -bottom-px h-px bg-forest" />
                    ) : null}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden items-center gap-2 lg:flex">
              <ButtonLink
                href={signedIn ? "/dashboard" : "/login"}
                variant="ghost"
                size="sm"
              >
                {signedIn ? "Dashboard" : "Sign in"}
              </ButtonLink>
              <ButtonLink href="/contact" size="sm">
                Start a project
              </ButtonLink>
            </div>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex size-10 items-center justify-center rounded-md border border-edge text-ink lg:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </Container>

        {open ? (
          <div
              id="mobile-nav"
              // Anything actionable closes the menu immediately — including the
              // two buttons below, and a link to the page already open, which
              // would otherwise leave the panel covering the content.
              onClick={(event) => {
                if ((event.target as HTMLElement).closest("a,button")) {
                  setOpen(false);
                }
              }}
              className="relative border-t border-edge bg-paper lg:hidden"
            >
              <Container className="py-4">
              <nav className="flex flex-col" aria-label="Mobile">
                {nav.map((item) => {
                  const section = "section" in item ? item.section : undefined;
                  const href = onLanding && section ? `#${section}` : item.href;
                  return (
                    <Link
                      key={item.href}
                      href={href}
                      className="border-b border-edge py-3.5 text-[1.0625rem] text-ink"
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <ButtonLink
                  href={signedIn ? "/dashboard" : "/login"}
                  variant="secondary"
                >
                  {signedIn ? "Dashboard" : "Sign in"}
                </ButtonLink>
                <ButtonLink href="/contact">Start a project</ButtonLink>
              </div>
              </Container>
          </div>
        ) : null}
      </header>
    </>
  );
}
