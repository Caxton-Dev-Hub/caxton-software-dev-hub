/**
 * Company facts.
 *
 * Everything under `registration` is transcribed from the CAC Certificate of
 * Registration and should not be edited without checking the certificate.
 * Everything marked DUMMY is placeholder copy — replace before launch.
 */

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

  /** Numbers shown on the site. Replace with audited figures before launch. */
  metrics: [
    { value: "40+", label: "Projects shipped", note: "DUMMY" },
    { value: "300+", label: "Engineers trained", note: "DUMMY" },
    { value: "92%", label: "Cohort completion rate", note: "DUMMY" },
    { value: "7 yrs", label: "Combined delivery experience", note: "DUMMY" },
  ],
} as const;

export const nav = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/courses", label: "Courses" },
  { href: "/mentorship", label: "Mentorship" },
  { href: "/verify", label: "Verify us" },
  { href: "/insights", label: "Insights" },
] as const;

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  kind: "client" | "student";
};

/** DUMMY — replace with real, attributable quotes before launch. */
export const testimonials: Testimonial[] = [
  {
    quote:
      "They scoped the build in a week, gave us a fixed price, and shipped ahead of the date. The handover documentation alone was worth the fee.",
    name: "Amina Yusuf",
    role: "Operations Lead, Kaduna logistics company",
    kind: "client",
  },
  {
    quote:
      "I came in writing HTML by hand. Eleven weeks later I was reviewing pull requests at my first job. The weekly one-to-ones are what made the difference.",
    name: "Tobi Adeyemi",
    role: "Frontend Engineer, Lagos",
    kind: "student",
  },
  {
    quote:
      "The AI tutor answers at 1am when the mentor is asleep, and it explains using our own course material rather than something generic off the internet.",
    name: "Grace Okonkwo",
    role: "Cairo & Starknet cohort, 2026",
    kind: "student",
  },
  {
    quote:
      "We had been burned by a previous developer who vanished. Caxton gave us weekly demos and repository access from day one. No mysteries.",
    name: "Ibrahim Sani",
    role: "Founder, agritech startup",
    kind: "client",
  },
];

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
