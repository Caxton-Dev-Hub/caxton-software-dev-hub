/**
 * Minimal in-memory fixed-window limiter. Good enough for a single instance;
 * swap for Upstash Redis if you scale horizontally.
 *
 * Two things this deliberately does NOT do:
 *  - survive a restart or coordinate across instances (see above), and
 *  - trust a client-supplied IP header on its own (see `clientKey`).
 */
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/**
 * Expired buckets are dead weight — without eviction the map grows by one
 * entry per unique key forever, which is both a slow leak and a cheap way for
 * someone to exhaust memory. Sweep on write, amortised, and cap the map so a
 * flood of distinct keys cannot outrun the sweep.
 */
const MAX_BUCKETS = 10_000;
const SWEEP_EVERY = 500;
let writesSinceSweep = 0;

function sweep(now: number): void {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
  // Still oversized after dropping the expired ones: evict oldest-first.
  // Map iterates in insertion order, so this drops the least recently created.
  if (buckets.size > MAX_BUCKETS) {
    const excess = buckets.size - MAX_BUCKETS;
    let dropped = 0;
    for (const key of buckets.keys()) {
      buckets.delete(key);
      if (++dropped >= excess) break;
    }
  }
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now();

  if (++writesSinceSweep >= SWEEP_EVERY) {
    writesSinceSweep = 0;
    sweep(now);
  }

  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }
  return { ok: true, remaining: limit - bucket.count, retryAfterSeconds: 0 };
}

/** Test seam — the module-level map otherwise leaks between test cases. */
export function resetRateLimits(): void {
  buckets.clear();
  writesSinceSweep = 0;
}

/**
 * `x-forwarded-for` is attacker-controlled: anyone can rotate it per request
 * and walk straight past every limit. Prefer the platform-verified client IP
 * that the host injects (Vercel sets `x-real-ip`, and its proxy overwrites
 * rather than appends `x-forwarded-for`), and only then fall back.
 *
 * Callers that already know who the user is should key on the account id
 * instead — see `userKey`.
 */
export function clientKey(request: Request, scope: string): string {
  const realIp = request.headers.get("x-real-ip")?.trim();
  const forwarded = request.headers.get("x-forwarded-for");
  // Left-most entry is the original client; the trusted proxy appends its own.
  const ip = realIp || forwarded?.split(",")[0]?.trim() || "unknown";
  return `${scope}:${ip}`;
}

/** Key on the authenticated account, which a caller cannot rotate. */
export function userKey(userId: string, scope: string): string {
  return `${scope}:user:${userId}`;
}
