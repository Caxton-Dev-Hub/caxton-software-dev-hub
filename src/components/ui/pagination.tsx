import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { pageHref, type PageInfo } from "@/lib/pagination";
import { cn } from "@/lib/utils";

/**
 * Page numbers with the current page centred, elided at both ends.
 *
 * Returns literal page numbers and `null` for a gap, so a list of 400 rows
 * renders seven controls rather than twenty.
 */
function pageWindow(page: number, totalPages: number): Array<number | null> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const window = new Set<number>([1, totalPages, page]);
  for (const offset of [-1, 1]) {
    const candidate = page + offset;
    if (candidate > 1 && candidate < totalPages) window.add(candidate);
  }
  // Keep the row a stable width near the ends, where the window is one-sided.
  if (page <= 3) [2, 3, 4].forEach((n) => n < totalPages && window.add(n));
  if (page >= totalPages - 2) {
    [totalPages - 3, totalPages - 2, totalPages - 1].forEach(
      (n) => n > 1 && window.add(n),
    );
  }

  const pages = [...window].sort((a, b) => a - b);
  const withGaps: Array<number | null> = [];
  for (const [index, value] of pages.entries()) {
    if (index > 0 && value - pages[index - 1] > 1) withGaps.push(null);
    withGaps.push(value);
  }
  return withGaps;
}

const step =
  "inline-flex h-9 min-w-9 items-center justify-center gap-1 rounded-md border px-3 font-mono text-[0.75rem] transition-colors";

export function Pagination({
  info,
  basePath,
  params = {},
  label = "rows",
  className,
}: {
  info: PageInfo;
  basePath: string;
  params?: Record<string, string | string[] | undefined>;
  /** What is being counted, for the summary line: "87 payments". */
  label?: string;
  className?: string;
}) {
  // One page of results needs no controls, but the count is still worth saying.
  if (info.totalPages <= 1) {
    if (info.total === 0) return null;
    return (
      <p
        className={cn(
          "mt-5 font-mono text-[0.6875rem] tracking-wider text-ink-faint uppercase",
          className,
        )}
      >
        {info.total} {label}
      </p>
    );
  }

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        "mt-6 flex flex-wrap items-center justify-between gap-4",
        className,
      )}
    >
      <p className="font-mono text-[0.6875rem] tracking-wider text-ink-faint uppercase">
        {info.from}–{info.to} of {info.total} {label}
      </p>

      <div className="flex flex-wrap items-center gap-1.5">
        {info.hasPrevious ? (
          <Link
            href={pageHref(basePath, params, info.page - 1)}
            rel="prev"
            aria-label="Previous page"
            className={cn(step, "border-edge-strong text-ink-soft hover:border-forest hover:text-forest")}
          >
            <ChevronLeft className="size-3.5" />
          </Link>
        ) : (
          <span
            aria-hidden
            className={cn(step, "border-edge text-ink-faint/50")}
          >
            <ChevronLeft className="size-3.5" />
          </span>
        )}

        {pageWindow(info.page, info.totalPages).map((value, index) =>
          value === null ? (
            <span
              key={`gap-${index}`}
              aria-hidden
              className="px-1 font-mono text-[0.75rem] text-ink-faint"
            >
              …
            </span>
          ) : value === info.page ? (
            <span
              key={value}
              aria-current="page"
              className={cn(step, "border-forest bg-forest text-white")}
            >
              {value}
            </span>
          ) : (
            <Link
              key={value}
              href={pageHref(basePath, params, value)}
              aria-label={`Page ${value}`}
              className={cn(step, "border-edge-strong text-ink-soft hover:border-forest hover:text-forest")}
            >
              {value}
            </Link>
          ),
        )}

        {info.hasNext ? (
          <Link
            href={pageHref(basePath, params, info.page + 1)}
            rel="next"
            aria-label="Next page"
            className={cn(step, "border-edge-strong text-ink-soft hover:border-forest hover:text-forest")}
          >
            <ChevronRight className="size-3.5" />
          </Link>
        ) : (
          <span aria-hidden className={cn(step, "border-edge text-ink-faint/50")}>
            <ChevronRight className="size-3.5" />
          </span>
        )}
      </div>
    </nav>
  );
}
