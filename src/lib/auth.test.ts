import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { prismaMock, cookieStore } = vi.hoisted(() => ({
  prismaMock: { user: { findUnique: vi.fn() } },
  cookieStore: { get: vi.fn(), set: vi.fn(), delete: vi.fn() },
}));

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));
vi.mock("next/headers", () => ({ cookies: async () => cookieStore }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

import {
  getCurrentUser,
  getVerifiedSession,
  signSession,
  verifySession,
} from "@/lib/auth";

const GOOD_SECRET = "K7x2pQm9vRt4sLw8nZc3bYh6jDf1gA5e";
const original = process.env.AUTH_SECRET;

beforeEach(() => {
  vi.clearAllMocks();
  process.env.AUTH_SECRET = GOOD_SECRET;
});

afterEach(() => {
  process.env.AUTH_SECRET = original;
});

describe("AUTH_SECRET validation", () => {
  const payload = { sub: "u1", email: "a@b.test", name: "Ada", role: "STUDENT" as const };

  it("refuses a missing or short secret", async () => {
    process.env.AUTH_SECRET = "";
    await expect(signSession(payload)).rejects.toThrow(/missing or too short/i);

    process.env.AUTH_SECRET = "tooshort";
    await expect(signSession(payload)).rejects.toThrow(/missing or too short/i);
  });

  it("refuses the .env.example placeholder even though it is long enough", async () => {
    // This is the exact string shipped in .env.example — 44 chars, so it sails
    // past a length check while being public knowledge.
    process.env.AUTH_SECRET = "DUMMY_REPLACE_ME_with_openssl_rand_base64_32";
    expect(process.env.AUTH_SECRET.length).toBeGreaterThanOrEqual(24);
    await expect(signSession(payload)).rejects.toThrow(/placeholder/i);
  });

  it("refuses a long but near-zero-entropy secret", async () => {
    process.env.AUTH_SECRET = "a".repeat(64);
    await expect(signSession(payload)).rejects.toThrow(/variation/i);
  });

  it("accepts a properly generated secret", async () => {
    await expect(signSession(payload)).resolves.toEqual(expect.any(String));
  });
});

describe("verifySession", () => {
  it("round-trips a signed session and exposes the issued-at claim", async () => {
    const token = await signSession({
      sub: "u1",
      email: "a@b.test",
      name: "Ada",
      role: "ADMIN",
    });
    const session = await verifySession(token);

    expect(session).toMatchObject({ sub: "u1", email: "a@b.test", role: "ADMIN" });
    expect(session?.issuedAt).toEqual(expect.any(Number));
  });

  it("rejects a token signed with a different secret", async () => {
    const token = await signSession({
      sub: "u1",
      email: "a@b.test",
      name: "Ada",
      role: "STUDENT",
    });
    process.env.AUTH_SECRET = "Zq8wEr5tYu2iOp7aSd4fGh1jKl3zXc6v";
    expect(await verifySession(token)).toBeNull();
  });
});

describe("session revocation", () => {
  async function signedInAs(role: "STUDENT" | "ADMIN") {
    const token = await signSession({ sub: "u1", email: "a@b.test", name: "Ada", role });
    cookieStore.get.mockReturnValue({ value: token });
  }

  it("rejects a session issued before the revocation mark", async () => {
    await signedInAs("STUDENT");
    // Marked valid-from one hour in the future: every existing token predates it.
    prismaMock.user.findUnique.mockResolvedValue({
      id: "u1",
      role: "STUDENT",
      sessionsValidFrom: new Date(Date.now() + 3_600_000),
    });

    expect(await getVerifiedSession()).toBeNull();
    expect(await getCurrentUser()).toBeNull();
  });

  it("accepts a session issued after the revocation mark", async () => {
    await signedInAs("STUDENT");
    prismaMock.user.findUnique.mockResolvedValue({
      id: "u1",
      role: "STUDENT",
      sessionsValidFrom: new Date(Date.now() - 3_600_000),
    });

    expect(await getVerifiedSession()).toMatchObject({ sub: "u1" });
    expect(await getCurrentUser()).toMatchObject({ id: "u1" });
  });

  it("trusts the database for the role, not the cookie's stale copy", async () => {
    // Cookie still claims ADMIN; the account has since been demoted.
    await signedInAs("ADMIN");
    prismaMock.user.findUnique.mockResolvedValue({
      id: "u1",
      role: "STUDENT",
      sessionsValidFrom: new Date(0),
    });

    expect(await getVerifiedSession()).toMatchObject({ role: "STUDENT" });
  });

  it("returns null when the user no longer exists", async () => {
    await signedInAs("STUDENT");
    prismaMock.user.findUnique.mockResolvedValue(null);

    expect(await getVerifiedSession()).toBeNull();
    expect(await getCurrentUser()).toBeNull();
  });
});
