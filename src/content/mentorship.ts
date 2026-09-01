export type MentorshipPlan = {
  slug: string;
  name: string;
  pitch: string;
  /** Price in kobo. */
  priceKobo: number;
  cadence: "per month" | "one-off";
  commitment: string;
  seats: number;
  includes: string[];
  bestFor: string;
  featured?: boolean;
};

export const mentorshipPlans: MentorshipPlan[] = [
  {
    slug: "starter",
    name: "Starter",
    pitch:
      "Enough structure to stop drifting. A mentor who knows your name, your code, and what you are stuck on this week.",
    priceKobo: 1_800_000,
    cadence: "per month",
    commitment: "Month to month — cancel any time",
    seats: 20,
    bestFor: "Self-taught developers who have the material but not the momentum",
    includes: [
      "Two 45-minute one-to-one calls per month",
      "A written learning plan, revised monthly",
      "Asynchronous questions answered within 24 hours on weekdays",
      "Unlimited AI study assistant, scoped to your plan",
      "Code review on one pull request per month",
    ],
  },
  {
    slug: "momentum",
    name: "Momentum",
    pitch:
      "Weekly accountability and real code review. For people who are building something and need a senior engineer in the loop.",
    priceKobo: 3_800_000,
    cadence: "per month",
    commitment: "Three-month minimum",
    seats: 10,
    featured: true,
    bestFor: "Developers preparing for their first or next engineering role",
    includes: [
      "Four 60-minute one-to-one calls per month",
      "Code review on every pull request you open",
      "A portfolio project scoped and shipped with you",
      "Mock technical interviews with written feedback",
      "Unlimited AI study assistant, scoped to your plan",
      "Direct WhatsApp line to your mentor during working hours",
    ],
  },
  {
    slug: "career-sprint",
    name: "Career Sprint",
    pitch:
      "Eight weeks, one outcome: a portfolio, a CV, and an interview process you can actually pass.",
    priceKobo: 7_200_000,
    cadence: "one-off",
    commitment: "Eight weeks, fixed",
    seats: 6,
    bestFor: "Job-ready engineers who keep getting to the final round and stopping there",
    includes: [
      "Eight weekly 90-minute sessions",
      "One substantial portfolio project, built and deployed",
      "CV, LinkedIn, and GitHub profile rewritten with you",
      "Four mock interviews: technical, system design, and behavioural",
      "Introductions to hiring partners in our network where there is a fit",
      "Salary negotiation coaching before you accept anything",
    ],
  },
];

export function getPlan(slug: string): MentorshipPlan | undefined {
  return mentorshipPlans.find((p) => p.slug === slug);
}

export const mentorshipProcess = [
  {
    step: "01",
    title: "Free 20-minute fit call",
    body: "We work out where you are, where you want to be, and whether we are the right people to get you there. If we are not, we will say so and point you elsewhere.",
  },
  {
    step: "02",
    title: "A written plan",
    body: "Before you pay anything, you get a plan: the skills to build, in what order, with what evidence of progress at each stage.",
  },
  {
    step: "03",
    title: "The work",
    body: "Weekly sessions, real code, real review. Your mentor reads what you wrote before the call, so the call is spent on the hard part.",
  },
  {
    step: "04",
    title: "Proof",
    body: "You finish with deployed projects, a reviewed portfolio, and a mentor who will vouch for you by name.",
  },
];
