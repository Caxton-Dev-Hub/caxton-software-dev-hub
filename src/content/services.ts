import type { LucideIcon } from "lucide-react";
import { Code2, Layout, Rocket, Users } from "lucide-react";

export type Service = {
  slug: string;
  title: string;
  summary: string;
  icon: LucideIcon;
  deliverables: string[];
  /** Indicative starting price in kobo, or null for "on application". */
  fromKobo: number | null;
  timeline: string;
};

export const services: Service[] = [
  {
    slug: "custom-software",
    title: "Custom software development",
    summary:
      "Internal tools, customer portals, marketplaces, and the unglamorous systems that run a business. Built to be handed over, not held hostage.",
    icon: Code2,
    fromKobo: 60_000_000,
    timeline: "6 – 16 weeks",
    deliverables: [
      "Written technical scope and fixed quote before work starts",
      "Source code in your GitHub organisation from the first commit",
      "Automated tests on the paths that would cost you money if they broke",
      "Deployment, environment setup, and runbook documentation",
      "30 days of free bug fixes after go-live",
    ],
  },
  {
    slug: "web-design-development",
    title: "Web design & development",
    summary:
      "Marketing sites, product sites, and web applications designed here and built here — one team, so nothing is lost in the handover.",
    icon: Layout,
    fromKobo: 18_000_000,
    timeline: "3 – 8 weeks",
    deliverables: [
      "Brand-aligned design system delivered in Figma",
      "Responsive build tested on low-end Android as well as desktop",
      "Content management your team can operate without calling us",
      "Core Web Vitals in the green at launch, measured not assumed",
      "Analytics, SEO fundamentals, and a launch checklist",
    ],
  },
  {
    slug: "product-engineering",
    title: "Embedded product engineering",
    summary:
      "A dedicated engineer or small squad inside your team, on a monthly retainer. For companies with a roadmap and no one to build it.",
    icon: Rocket,
    fromKobo: 48_000_000,
    timeline: "Monthly retainer, 3-month minimum",
    deliverables: [
      "Named engineers, not a rotating pool",
      "Your tools, your standups, your board",
      "Sprint planning and a demo every Friday",
      "Monthly written report on velocity and technical debt",
      "Notice period of 30 days, both ways",
    ],
  },
  {
    slug: "training-partnerships",
    title: "Team training & academies",
    summary:
      "Corporate cohorts run for banks, agencies, and NGOs — our curriculum, delivered against your stack and your timeline.",
    icon: Users,
    fromKobo: null,
    timeline: "4 – 12 weeks per cohort",
    deliverables: [
      "Curriculum adapted to your existing codebase and conventions",
      "On-site or remote delivery across Nigeria",
      "Skills assessment before and after, reported to your L&D team",
      "Certificates of completion for every participant",
      "Optional ongoing mentorship for graduates",
    ],
  },
];

export const deliveryProcess = [
  {
    step: "01",
    title: "Discovery",
    duration: "Week 0",
    body: "We sit with the people who will use the thing. You get a written scope, a fixed price, and an honest note on anything we think is a bad idea.",
  },
  {
    step: "02",
    title: "Design",
    duration: "Weeks 1 – 2",
    body: "Interface design and technical architecture, in parallel. You approve screens and data model before anyone writes production code.",
  },
  {
    step: "03",
    title: "Build",
    duration: "Weeks 3 – n",
    body: "Two-week sprints with a working demo every Friday. Repository access from day one, so you can watch it being built.",
  },
  {
    step: "04",
    title: "Handover",
    duration: "Final week",
    body: "Deployment, documentation, and a training session for your team. Then 30 days of free bug fixes while you settle in.",
  },
];
