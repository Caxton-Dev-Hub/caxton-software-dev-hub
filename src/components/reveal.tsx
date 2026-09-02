"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * How long to wait for the observer to say anything at all before giving up on
 * it and showing the content regardless.
 *
 * An IntersectionObserver reports on its target almost immediately after
 * `observe()` — intersecting or not. Silence past this point means the observer
 * is not working in this environment, and the right response is to show the
 * content rather than keep waiting. Copy that never appears is a far worse
 * outcome than copy that appears without animating.
 */
const OBSERVER_GRACE_MS = 800;

/**
 * Reveals its children as they scroll into view.
 *
 * The hidden state is CSS, gated on the `.js-motion` class the root layout
 * sets before paint, so a reader with JavaScript off or reduced motion on
 * never meets a hidden section. On top of that this component holds two
 * failsafes, because "the animation did not run" must always degrade to
 * visible content:
 *
 *   1. Anything already on screen at mount is revealed at once, without
 *      waiting for a callback.
 *   2. If the observer has not reported within the grace period — no support,
 *      or an environment where it does not fire — everything is revealed.
 *
 * The visible class is written straight onto the node rather than held in
 * React state: the class list is the external system this effect is
 * synchronising, and a long page would otherwise re-render once per band.
 */
export function Reveal({
  children,
  stagger = false,
  /** Fraction of the element that must be on screen before it reveals. */
  threshold = 0.15,
  as: Tag = "div",
  className,
}: {
  children: React.ReactNode;
  stagger?: boolean;
  threshold?: number;
  as?: "div" | "section" | "ul" | "li";
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const show = () => element.classList.add("is-visible");

    if (typeof IntersectionObserver === "undefined") {
      show();
      return;
    }

    // Already on screen at mount: reveal now, so the first viewport is not
    // animating in while the reader is already reading it.
    const box = element.getBoundingClientRect();
    if (box.top < window.innerHeight && box.bottom > 0) {
      show();
      return;
    }

    let reported = false;
    const observer = new IntersectionObserver(
      (entries) => {
        reported = true;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          show();
          // One-way: re-animating on the way back up is a distraction, not a
          // flourish, and it makes long pages feel unstable.
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(element);

    const failsafe = window.setTimeout(() => {
      if (reported) return;
      show();
      observer.disconnect();
    }, OBSERVER_GRACE_MS);

    return () => {
      window.clearTimeout(failsafe);
      observer.disconnect();
    };
  }, [threshold]);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={cn(stagger ? "reveal-stagger" : "reveal", className)}
    >
      {children}
    </Tag>
  );
}
