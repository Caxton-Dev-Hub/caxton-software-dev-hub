"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";

export function DashboardSidebar({
  brand,
  children,
}: {
  brand: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [renderedPath, setRenderedPath] = useState(pathname);

  // Close the drawer on navigation by adjusting state during render, matching
  // the pattern in the public site header.
  if (renderedPath !== pathname) {
    setRenderedPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <div className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-edge bg-paper px-5 py-3 lg:hidden">
        {brand}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="dashboard-sidebar"
          aria-label="Open menu"
          className="inline-flex size-10 items-center justify-center rounded-md border border-edge text-ink"
        >
          <Menu className="size-5" />
        </button>
      </div>

      <div
        onClick={() => setOpen(false)}
        aria-hidden
        className={cn(
          "fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm transition-opacity duration-200 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* Off-canvas below lg, a static column from lg up. `invisible` keeps the
          closed drawer out of the tab order without an effect.

          Below lg this is a flex column: a fixed header with the drawer's own
          scrolling panel beneath it. From lg up it becomes a plain block that
          stretches to the full page height, which is what gives the sticky
          panel inside it room to travel. */}
      <aside
        id="dashboard-sidebar"
        // Close the moment anything actionable inside is used. Navigating to
        // the page you are already on does not change the pathname, so the
        // render-time close above never fires and the drawer would sit open
        // over the page the reader just asked for. Delegating here covers
        // every link and button in the drawer without threading a callback
        // through the nav.
        onClick={(event) => {
          if ((event.target as HTMLElement).closest("a,button")) setOpen(false);
        }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-edge bg-paper transition-[transform,visibility] duration-200 ease-out",
          open ? "visible translate-x-0" : "invisible -translate-x-full",
          "lg:visible lg:static lg:z-auto lg:block lg:min-h-dvh lg:w-64 lg:max-w-none lg:shrink-0 lg:translate-x-0 lg:transition-none",
        )}
      >
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-edge px-5 py-3 lg:hidden">
          {brand}
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="inline-flex size-10 items-center justify-center rounded-md border border-edge text-ink"
          >
            <X className="size-5" />
          </button>
        </div>

        {children}
      </aside>
    </>
  );
}
