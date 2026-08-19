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

  // Close the mobile menu on navigation by adjusting state during render,
  // which is cheaper than an effect and avoids a second render pass.
  if (renderedPath !== pathname) {
    setRenderedPath(pathname);
    setOpen(false);
  }

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
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
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
        <div id="mobile-nav" className="border-t border-edge bg-paper lg:hidden">
          <Container className="py-4">
            <nav className="flex flex-col" aria-label="Mobile">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="border-b border-edge py-3.5 text-[1.0625rem] text-ink"
                >
                  {item.label}
                </Link>
              ))}
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
  );
}
