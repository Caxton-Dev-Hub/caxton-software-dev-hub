import { describe, expect, it } from "vitest";

import {
  contactSchema,
  courseCheckoutSchema,
  registerSchema,
  waitlistSchema,
} from "@/lib/validation";

describe("registerSchema", () => {
  const valid = {
    name: "Ada Lovelace",
    email: "ADA@Example.com",
    password: "correct-horse-battery",
  };

  it("accepts a valid registration and lowercases/trims the email", () => {
    const result = registerSchema.parse(valid);
    expect(result.email).toBe("ada@example.com");
  });

  it("rejects a password shorter than 10 characters", () => {
    const result = registerSchema.safeParse({ ...valid, password: "short" });
    expect(result.success).toBe(false);
  });

  // `.optional().or(z.literal("").transform(...))` tries the base string
  // schema first, and "" already satisfies it (there is no `.min()`), so the
  // literal("") branch is never reached — an empty string is kept as "",
  // not normalised to undefined.
  it("keeps an empty phone as an empty string rather than undefined", () => {
    const result = registerSchema.parse({ ...valid, phone: "" });
    expect(result.phone).toBe("");
  });

  it("rejects a name that is too short", () => {
    const result = registerSchema.safeParse({ ...valid, name: "A" });
    expect(result.success).toBe(false);
  });
});

describe("contactSchema", () => {
  const valid = {
    name: "Grace Hopper",
    email: "grace@example.com",
    message: "We need help building an internal tool for scheduling engineers.",
  };

  it("accepts a valid enquiry with only the required fields", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a message that is too short to be useful", () => {
    const result = contactSchema.safeParse({ ...valid, message: "too short" });
    expect(result.success).toBe(false);
  });

  it("allows the honeypot field to be filled in without failing validation", () => {
    const result = contactSchema.safeParse({ ...valid, website: "https://spam.example" });
    expect(result.success).toBe(true);
  });
});

describe("courseCheckoutSchema", () => {
  it("defaults the plan to full when not provided", () => {
    const result = courseCheckoutSchema.parse({ courseSlug: "frontend-engineering-react-nextjs" });
    expect(result.plan).toBe("full");
  });

  it("rejects a plan outside the enum", () => {
    const result = courseCheckoutSchema.safeParse({
      courseSlug: "frontend-engineering-react-nextjs",
      plan: "quarterly",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a missing course slug", () => {
    const result = courseCheckoutSchema.safeParse({ plan: "full" });
    expect(result.success).toBe(false);
  });
});

describe("waitlistSchema", () => {
  const valid = {
    courseSlug: "frontend-engineering-react-nextjs",
    name: "Kemi Adeyemi",
    email: "kemi@example.com",
  };

  it("accepts a minimal valid entry", () => {
    expect(waitlistSchema.safeParse(valid).success).toBe(true);
  });

  // Same unreachable-branch behaviour as registerSchema.phone above.
  it("keeps an empty note as an empty string rather than undefined", () => {
    const result = waitlistSchema.parse({ ...valid, note: "" });
    expect(result.note).toBe("");
  });

  it("rejects a note over 600 characters", () => {
    const result = waitlistSchema.safeParse({ ...valid, note: "x".repeat(601) });
    expect(result.success).toBe(false);
  });
});
