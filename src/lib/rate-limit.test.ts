import { beforeEach, describe, expect, it } from "vitest";

import { clientKey, rateLimit, resetRateLimits, userKey } from "@/lib/rate-limit";

beforeEach(() => {
  resetRateLimits();
});

describe("rateLimit", () => {
  it("allows requests up to the limit and then refuses", () => {
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      expect(rateLimit("k", 3, 60_000).ok).toBe(true);
    }
    const refused = rateLimit("k", 3, 60_000);
    expect(refused.ok).toBe(false);
    expect(refused.remaining).toBe(0);
    expect(refused.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("keeps separate buckets per key", () => {
    expect(rateLimit("a", 1, 60_000).ok).toBe(true);
    expect(rateLimit("a", 1, 60_000).ok).toBe(false);
    // A different key is unaffected by the first one being exhausted.
    expect(rateLimit("b", 1, 60_000).ok).toBe(true);
  });

  it("starts a fresh window once the old one has expired", () => {
    expect(rateLimit("k", 1, 1).ok).toBe(true);
    expect(rateLimit("k", 1, 1).ok).toBe(false);

    // A zero-length window is already expired on the next call.
    expect(rateLimit("expired", 1, 0).ok).toBe(true);
    expect(rateLimit("expired", 1, 0).ok).toBe(true);
  });
});

describe("clientKey", () => {
  it("prefers the platform-verified header over the spoofable one", () => {
    const request = new Request("https://example.test", {
      headers: { "x-real-ip": "9.9.9.9", "x-forwarded-for": "1.1.1.1, 2.2.2.2" },
    });
    // x-forwarded-for is attacker-controlled; x-real-ip is set by the proxy.
    expect(clientKey(request, "scope")).toBe("scope:9.9.9.9");
  });

  it("falls back to the left-most forwarded address", () => {
    const request = new Request("https://example.test", {
      headers: { "x-forwarded-for": "1.1.1.1, 2.2.2.2" },
    });
    expect(clientKey(request, "scope")).toBe("scope:1.1.1.1");
  });

  it("degrades to a shared bucket when no address is present", () => {
    const request = new Request("https://example.test");
    expect(clientKey(request, "scope")).toBe("scope:unknown");
  });
});

describe("userKey", () => {
  it("keys on the account, which a caller cannot rotate", () => {
    expect(userKey("user_1", "assistant")).toBe("assistant:user:user_1");
    expect(userKey("user_1", "assistant")).not.toBe(userKey("user_2", "assistant"));
  });
});
