/**
 * Company facts.
 *
 * Everything under `registration` is transcribed from the CAC Certificate of
 * Registration and should not be edited without checking the certificate.
 * Everything marked DUMMY is placeholder copy — replace before launch.
 *
 * Caxton is pre-launch: no paid client work delivered and no cohort taught yet.
 * Nothing on the site may imply otherwise. That is why `proofPoints` below
 * carries facts a stranger can check rather than metrics only we can see, and
 * why `testimonials` and `projects` are empty rather than illustrative — the
 * sections that render them disappear until there is something real to put in.
 */

import { projects } from "./projects";

export const site = {
  name: "Caxton Software Dev Hub",
  shortName: "Caxton",
  tagline: "We build the software. Then we teach you how.",
  description:
    "A CAC-registered software development studio in Kaduna. We ship production software for businesses and train Nigerian engineers through cohort courses and one-to-one mentorship — with AI-assisted learning built into every programme.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  /** Transcribed from the CAC Certificate of Registration. */
  registration: {
    entityName: "CAXTON SOFTWARE DEV HUB",
    number: "9675871",
    kind: "Business Name Registration",
    act: "Companies and Allied Matters Act 2020",
    registrar: "Corporate Affairs Commission, Federal Republic of Nigeria",
    natureOfBusiness: "Software Development / Web Designing",
    registeredOn: "12 July 2026",
    place: "Abuja",
  },

  address: {
    street: "No. 56, Issac A.A Street",
    area: "Ungwan Zango, Maraban Rido",
    city: "Kaduna",
    state: "Kaduna State",
    country: "Nigeria",
    get full() {
      return `${this.street}, ${this.area}, ${this.city}, ${this.state}, ${this.country}`;
    },
  },

  contact: {
    email: "hello@caxtondevhub.xyz",
    training: "training@caxtondevhub.xyz",
    phone: "+234 800 000 0000", // DUMMY
    whatsapp: "+234 800 000 0000", // DUMMY
    hours: "Mon – Fri, 9:00 – 18:00 WAT",
  },

  socials: {
    github: "https://github.com/caxtonacollins",
    githubAlt: "https://github.com/strngecloud",
    x: "https://x.com/caxtonacollins", // DUMMY
    linkedin: "https://www.linkedin.com/company/caxton-software-dev-hub", // DUMMY
  },

  /**
   * The band under the hero.
   *
   * Every line here is checkable by someone who does not trust us yet: the
   * first two are on the CAC certificate, and the third is a public GitHub
   * account anyone can read. That is the point — a new studio asking for a
   * deposit is better served by facts a sceptic can verify than by numbers it
   * would have to be taken on faith for.
   *
   * Deliberately does NOT repeat the registration number, the act, or the city:
   * those are already in the strip a few pixels above this band, and saying
   * them twice in one screen reads as a mistake rather than as emphasis.
   *
   * When there is a real delivery record, add it here. Do not add a figure
   * that cannot survive the question "how did you count that?".
   */
  proofPoints: [
    {
      value: "12 July 2026",
      label: "Registered with the CAC",
      href: "/verify",
    },
    { value: "Software & web", label: "Our registered nature of business" },
    {
      value: "On GitHub",
      label: "Our code is public — read it",
      href: "https://github.com/caxtonacollins",
    },
  ],
} as const;

/**
 * Main navigation.
 *
 * `section` is the id of the matching band on the landing page. On "/" the
 * header links to that anchor and scrolls; from any other page it links to the
 * full page as before. Each landing band carries its own "all of it" button,
 * so nothing becomes unreachable — see src/app/(site)/page.tsx.
 */
/** Whether there is any delivered client work to show. */
export const hasWork = projects.length > 0;

const allNav = [
  { href: "/services", label: "Services", section: "services" },
  { href: "/work", label: "Work", section: "work" },
  { href: "/courses", label: "Courses", section: "courses" },
  { href: "/mentorship", label: "Mentorship", section: "mentorship" },
  { href: "/verify", label: "Verify us", section: "trust" },
  { href: "/insights", label: "Insights" },
] as const;

/**
 * Work drops out of the navigation while there is no delivered work, so the
 * header never offers a link to an empty page. It returns on its own once
 * src/content/projects.ts has an entry.
 */
export const nav = allNav.filter(
  (item) => item.href !== "/work" || hasWork,
);

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  kind: "client" | "student";
};

/**
 * Real, attributable quotes only.
 *
 * Empty until clients and graduates exist and have given permission to be
 * named. The landing page renders the testimonials band only when this has
 * entries, so adding the first one brings the section back on its own — there
 * is nothing else to switch on.
 */
export const testimonials: Testimonial[] = [];

export const guarantees = [
  {
    title: "Fixed scope, fixed price",
    body: "You approve a written scope and a number before we write a line of code. No mid-project surprises.",
  },
  {
    title: "You own the repository",
    body: "Source code lives in your GitHub organisation from the first commit — not ours. Access on day one, not at handover.",
  },
  {
    title: "Weekly demos",
    body: "Every Friday you see working software, not a status report. If a week goes badly, you find out that Friday.",
  },
  {
    title: "30-day post-launch support",
    body: "Bug fixes on anything we built are free for 30 days after go-live. Written into every contract.",
  },
];
