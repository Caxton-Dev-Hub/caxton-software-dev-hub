/**
 * List pagination, shared by the admin tables, the payment history, and the
 * public writing index.
 *
 * The page number is clamped to the range that actually has rows. A link to
 * ?page=900 on a three-page list shows page three rather than an empty table,
 * which is what a mistyped URL or a stale bookmark produces.
 */

export const PER_PAGE = 20;

export type PageInfo = {
  page: number;
  perPage: number;
  /** For `skip` / `take` in a Prisma query. */
  skip: number;
  take: number;
  total: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
  /** 1-indexed row range on this page, for "showing 21–40 of 87". */
  from: number;
  to: number;
};

/**
 * Read a page number out of a query string.
 *
 * Anything that is not a positive whole number — a word, a negative, a float,
 * an array from a repeated ?page= — is page one. Search params are user input
 * and arrive as strings, so this never throws.
 */
export function parsePage(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return 1;

  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 1) return 1;
  // A page number beyond any plausible list is still clamped by `paginate`;
  // this ceiling only stops an absurd value reaching the query planner.
  return Math.min(parsed, 1_000_000);
}

export function paginate(
  total: number,
  requestedPage: number,
  perPage: number = PER_PAGE,
): PageInfo {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const page = Math.min(Math.max(1, requestedPage), totalPages);
  const skip = (page - 1) * perPage;

  return {
    page,
    perPage,
    skip,
    take: perPage,
    total,
    totalPages,
    hasPrevious: page > 1,
    hasNext: page < totalPages,
    from: total === 0 ? 0 : skip + 1,
    to: Math.min(skip + perPage, total),
  };
}

/** Paginate an array already held in memory — the content-as-code lists. */
export function paginateList<T>(
  items: T[],
  requestedPage: number,
  perPage: number = PER_PAGE,
): { rows: T[]; info: PageInfo } {
  const info = paginate(items.length, requestedPage, perPage);
  return { rows: items.slice(info.skip, info.skip + info.take), info };
}

/**
 * Build the href for a page, preserving every other query parameter so a
 * filtered or searched list does not reset when someone turns the page.
 */
export function pageHref(
  basePath: string,
  params: Record<string, string | string[] | undefined>,
  page: number,
): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (key === "page" || value === undefined) continue;
    for (const entry of Array.isArray(value) ? value : [value]) {
      search.append(key, entry);
    }
  }
  if (page > 1) search.set("page", String(page));

  const query = search.toString();
  return query ? `${basePath}?${query}` : basePath;
}
