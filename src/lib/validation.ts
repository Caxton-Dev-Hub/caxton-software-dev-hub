import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Tell us your name").max(80),
  email: z.string().trim().toLowerCase().email("That does not look like an email address"),
  phone: z
    .string()
    .trim()
    .max(24)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  password: z
    .string()
    .min(10, "Use at least 10 characters")
    .max(128, "That password is too long"),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("That does not look like an email address"),
  password: z.string().min(1, "Enter your password"),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Tell us your name").max(80),
  email: z.string().trim().toLowerCase().email("We need a valid email to reply to"),
  phone: z.string().trim().max(24).optional(),
  company: z.string().trim().max(120).optional(),
  service: z.string().trim().max(120).optional(),
  budget: z.string().trim().max(60).optional(),
  message: z.string().trim().min(20, "A sentence or two about the project, please").max(4000),
  /**
   * Honeypot. Deliberately permissive: a filled-in value must reach the route
   * handler so it can accept the submission silently rather than returning a
   * validation error the bot could learn from.
   */
  website: z.string().optional(),
});

export const courseCheckoutSchema = z.object({
  courseSlug: z.string().min(1),
  plan: z.enum(["full", "instalment"]).default("full"),
});

export const mentorshipCheckoutSchema = z.object({
  planSlug: z.string().min(1),
  goal: z.string().trim().min(20, "Describe what you want to achieve").max(2000),
});

export const assistantSchema = z.object({
  threadId: z.string().optional(),
  courseSlug: z.string().optional(),
  message: z.string().trim().min(1).max(4000),
});

export const waitlistSchema = z.object({
  courseSlug: z.string().min(1),
  name: z.string().trim().min(2, "Tell us your name").max(80),
  email: z.string().trim().toLowerCase().email("We need a valid email to reach you"),
  phone: z
    .string()
    .trim()
    .max(24)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  note: z
    .string()
    .trim()
    .max(600, "Keep it under 600 characters")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  /** Honeypot — permissive on purpose so the route can accept bots silently. */
  website: z.string().optional(),
});

export const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
});

export type ContactInput = z.infer<typeof contactSchema>;
