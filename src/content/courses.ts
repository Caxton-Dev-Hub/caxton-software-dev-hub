export type Lesson = {
  id: string;
  title: string;
  minutes: number;
  /** Free lessons are readable without enrolling. */
  preview?: boolean;
  summary: string;
};

export type Module = {
  title: string;
  lessons: Lesson[];
};

export type Course = {
  slug: string;
  code: string;
  title: string;
  subtitle: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  format: "Cohort (live)" | "Self-paced + mentor";
  weeks: number;
  hoursPerWeek: number;
  /** Price in kobo. 1 NGN = 100 kobo. */
  priceKobo: number;
  seats: number;
  nextCohort: string;
  /**
   * "open"     — seats available, people can pay and enrol now.
   * "waitlist" — this cohort is full; collect names for the next one instead.
   * Defaults to "open" when omitted.
   */
  availability?: "open" | "waitlist";
  outcomes: string[];
  requirements: string[];
  tools: string[];
  modules: Module[];
  featured?: boolean;
};

export const courses: Course[] = [
  {
    slug: "frontend-engineering-react-nextjs",
    code: "CX-101",
    title: "Frontend Engineering with React & Next.js",
    subtitle:
      "Go from writing markup to shipping and deploying production React applications that real teams will hire you to maintain.",
    level: "Beginner",
    format: "Cohort (live)",
    weeks: 12,
    hoursPerWeek: 10,
    priceKobo: 7_200_000,
    seats: 24,
    nextCohort: "6 October 2026",
    featured: true,
    outcomes: [
      "Build and deploy four portfolio-grade applications, reviewed line by line",
      "Write TypeScript that a senior engineer would approve in code review",
      "Handle real data: fetching, caching, loading states, and error boundaries",
      "Read a Figma file and translate it into an accessible, responsive interface",
      "Work the way teams work: branches, pull requests, review comments, CI",
    ],
    requirements: [
      "A laptop with at least 8GB of RAM and a stable internet connection",
      "Comfort with basic HTML and CSS — you can build a static page unaided",
      "10 hours a week, including one live session on Saturday",
    ],
    tools: ["TypeScript", "React", "Next.js", "Tailwind CSS", "Git & GitHub", "Vercel"],
    modules: [
      {
        title: "Foundations that hold up",
        lessons: [
          {
            id: "cx101-1-1",
            title: "How the modern web actually renders",
            minutes: 45,
            preview: true,
            summary:
              "Browser, server, and the boundary between them. Why the answer to 'where does this code run?' decides most of your architecture.",
          },
          {
            id: "cx101-1-2",
            title: "TypeScript for people who write JavaScript",
            minutes: 60,
            summary:
              "Types as documentation the compiler checks. Structural typing, narrowing, and when to stop reaching for `any`.",
          },
          {
            id: "cx101-1-3",
            title: "Git without fear",
            minutes: 50,
            summary:
              "Branching, rebasing, resolving conflicts, and undoing mistakes. The commands you will use every working day.",
          },
        ],
      },
      {
        title: "React, properly",
        lessons: [
          {
            id: "cx101-2-1",
            title: "Components, props, and the rendering model",
            minutes: 55,
            summary:
              "Why React re-renders, what that costs, and how to reason about it without memoising everything in sight.",
          },
          {
            id: "cx101-2-2",
            title: "State: local, lifted, and shared",
            minutes: 65,
            summary:
              "Choosing where state lives. useState, useReducer, context, and knowing when you actually need a store.",
          },
          {
            id: "cx101-2-3",
            title: "Effects and the lifecycle you no longer have",
            minutes: 60,
            summary:
              "useEffect is an escape hatch, not a lifecycle method. Data fetching, subscriptions, and cleanup done right.",
          },
        ],
      },
      {
        title: "Next.js in production",
        lessons: [
          {
            id: "cx101-3-1",
            title: "The App Router mental model",
            minutes: 55,
            summary:
              "Server Components, Client Components, layouts, and streaming. What runs where, and why it matters for your bill.",
          },
          {
            id: "cx101-3-2",
            title: "Data fetching, caching, and revalidation",
            minutes: 70,
            summary:
              "Reading data on the server, mutating it with Server Actions, and keeping the cache honest.",
          },
          {
            id: "cx101-3-3",
            title: "Authentication and protected routes",
            minutes: 65,
            summary:
              "Sessions, cookies, and middleware. Building an area of the app only signed-in users can reach.",
          },
        ],
      },
      {
        title: "Ship it",
        lessons: [
          {
            id: "cx101-4-1",
            title: "Accessibility that survives a real audit",
            minutes: 50,
            summary:
              "Keyboard navigation, focus management, colour contrast, and screen-reader semantics — tested, not assumed.",
          },
          {
            id: "cx101-4-2",
            title: "Performance budgets and Core Web Vitals",
            minutes: 55,
            summary:
              "Measuring before optimising. Images, fonts, bundle size, and what actually moves the numbers on a Nigerian mobile connection.",
          },
          {
            id: "cx101-4-3",
            title: "Deploying, monitoring, and the first bug report",
            minutes: 45,
            summary:
              "CI on every pull request, preview deployments, environment variables, and reading production errors calmly.",
          },
        ],
      },
    ],
  },
  {
    slug: "cairo-starknet-smart-contracts",
    code: "CX-301",
    title: "Cairo & Starknet Smart Contract Development",
    subtitle:
      "Write, test, audit, and deploy Cairo contracts on Starknet — the track Nigerian onchain teams are actively hiring for.",
    level: "Advanced",
    format: "Cohort (live)",
    weeks: 10,
    hoursPerWeek: 12,
    priceKobo: 10_000_000,
    seats: 16,
    nextCohort: "13 October 2026",
    availability: "waitlist",
    featured: true,
    outcomes: [
      "Write idiomatic Cairo and reason about the proving system underneath it",
      "Test contracts thoroughly with Starknet Foundry, including fuzz tests",
      "Deploy to testnet and mainnet, and manage upgrades without losing state",
      "Read an audit report and fix what it finds",
      "Ship one complete protocol with a frontend, as your portfolio piece",
    ],
    requirements: [
      "Solid programming experience in any typed language",
      "Comfort with the command line and Git",
      "Basic understanding of how a blockchain settles transactions",
    ],
    tools: ["Cairo", "Scarb", "Starknet Foundry", "starknet.js", "Starknet Devnet"],
    modules: [
      {
        title: "The Cairo language",
        lessons: [
          {
            id: "cx301-1-1",
            title: "Why Cairo exists: provable computation",
            minutes: 50,
            preview: true,
            summary:
              "Validity proofs versus fraud proofs, and what a STARK actually guarantees. The constraints that shape the language.",
          },
          {
            id: "cx301-1-2",
            title: "Ownership, felts, and the type system",
            minutes: 70,
            summary:
              "Cairo's memory model, the felt252 primitive, traits, and generics. Where it borrows from Rust and where it diverges.",
          },
          {
            id: "cx301-1-3",
            title: "Storage, events, and contract structure",
            minutes: 65,
            summary:
              "Laying out contract storage, emitting events the indexers can read, and structuring a multi-file project with Scarb.",
          },
        ],
      },
      {
        title: "Testing and safety",
        lessons: [
          {
            id: "cx301-2-1",
            title: "Starknet Foundry from zero",
            minutes: 60,
            summary:
              "Unit tests, integration tests, cheatcodes, and forking mainnet state to test against real conditions.",
          },
          {
            id: "cx301-2-2",
            title: "The vulnerability catalogue",
            minutes: 75,
            summary:
              "Reentrancy, access control, arithmetic assumptions, and oracle manipulation — each demonstrated with a live exploit.",
          },
          {
            id: "cx301-2-3",
            title: "Gas, fees, and account abstraction",
            minutes: 55,
            summary:
              "How Starknet charges for computation, and what native account abstraction changes about your UX.",
          },
        ],
      },
      {
        title: "Building a protocol",
        lessons: [
          {
            id: "cx301-3-1",
            title: "Tokens and standards",
            minutes: 60,
            summary:
              "ERC-20 and ERC-721 equivalents in Cairo, using OpenZeppelin components rather than rolling your own.",
          },
          {
            id: "cx301-3-2",
            title: "Upgradeability without foot-guns",
            minutes: 65,
            summary:
              "Class hash replacement, storage layout compatibility, and governance over who is allowed to upgrade.",
          },
          {
            id: "cx301-3-3",
            title: "Wiring a frontend with starknet.js",
            minutes: 70,
            summary:
              "Wallet connection, calling and multicalling, watching transaction status, and handling reverts in the interface.",
          },
        ],
      },
    ],
  },
  {
    slug: "backend-engineering-node-postgres",
    code: "CX-201",
    title: "Backend Engineering with Node.js & PostgreSQL",
    subtitle:
      "Design the database, build the API, secure it, and keep it standing when traffic arrives.",
    level: "Intermediate",
    format: "Cohort (live)",
    weeks: 10,
    hoursPerWeek: 10,
    priceKobo: 7_600_000,
    seats: 20,
    nextCohort: "20 October 2026",
    outcomes: [
      "Model a real business domain in a relational schema you can defend",
      "Build REST APIs with authentication, authorisation, and validation",
      "Write queries that stay fast at a million rows, and know why they are fast",
      "Handle background jobs, file uploads, and third-party webhooks",
      "Deploy with migrations, backups, and monitoring in place",
    ],
    requirements: [
      "Working JavaScript or TypeScript — you can write a function and debug it",
      "Familiarity with HTTP requests from the client side",
    ],
    tools: ["Node.js", "TypeScript", "PostgreSQL", "Prisma", "Docker", "Redis"],
    modules: [
      {
        title: "Data first",
        lessons: [
          {
            id: "cx201-1-1",
            title: "Relational modelling for real businesses",
            minutes: 60,
            preview: true,
            summary:
              "Entities, relationships, and normalisation up to the point where it stops helping. Modelling a payments ledger as the worked example.",
          },
          {
            id: "cx201-1-2",
            title: "Indexes, query plans, and EXPLAIN",
            minutes: 65,
            summary:
              "Reading a Postgres query plan, choosing indexes deliberately, and spotting the accidental sequential scan.",
          },
          {
            id: "cx201-1-3",
            title: "Transactions and consistency",
            minutes: 55,
            summary:
              "Isolation levels, race conditions in money-handling code, and why 'read, check, write' loses data.",
          },
        ],
      },
      {
        title: "The API layer",
        lessons: [
          {
            id: "cx201-2-1",
            title: "Designing an API someone else can use",
            minutes: 50,
            summary:
              "Resources, status codes, pagination, idempotency keys, and error shapes that clients can actually handle.",
          },
          {
            id: "cx201-2-2",
            title: "Authentication and authorisation",
            minutes: 70,
            summary:
              "Password hashing, sessions versus tokens, refresh strategies, and role-based access that does not leak.",
          },
          {
            id: "cx201-2-3",
            title: "Validation, rate limiting, and abuse",
            minutes: 55,
            summary:
              "Trusting nothing from the client, bounding request cost, and surviving the day someone points a script at you.",
          },
        ],
      },
      {
        title: "Operations",
        lessons: [
          {
            id: "cx201-3-1",
            title: "Background jobs and queues",
            minutes: 60,
            summary:
              "Moving slow work off the request path, retries with backoff, and making jobs safe to run twice.",
          },
          {
            id: "cx201-3-2",
            title: "Payments and webhooks in Nigeria",
            minutes: 65,
            summary:
              "Integrating Flutterwave end to end: initialising a transaction, verifying it, and processing webhooks without double-crediting.",
          },
          {
            id: "cx201-3-3",
            title: "Migrations, backups, and observability",
            minutes: 55,
            summary:
              "Shipping schema changes with zero downtime, testing your restores, and knowing something broke before the client tells you.",
          },
        ],
      },
    ],
  },
  {
    slug: "web-design-fundamentals",
    code: "CX-110",
    title: "Web Design Fundamentals: Figma to Production",
    subtitle:
      "Design interfaces that look considered and hand them over as code — the two halves of the job, taught together.",
    level: "Beginner",
    format: "Self-paced + mentor",
    weeks: 8,
    hoursPerWeek: 8,
    priceKobo: 4_800_000,
    seats: 30,
    nextCohort: "Rolling — start any Monday",
    outcomes: [
      "Build a type scale, colour system, and spacing rhythm you can reuse on every project",
      "Design responsive layouts in Figma with components and auto-layout",
      "Translate a design into semantic, accessible HTML and CSS",
      "Present design work to a client and defend the decisions",
      "Assemble a portfolio of three complete case studies",
    ],
    requirements: ["Curiosity. No prior design or coding experience assumed."],
    tools: ["Figma", "HTML", "CSS", "Tailwind CSS"],
    modules: [
      {
        title: "Seeing like a designer",
        lessons: [
          {
            id: "cx110-1-1",
            title: "Hierarchy, contrast, and why layouts fail",
            minutes: 40,
            preview: true,
            summary:
              "The four or five decisions that separate an interface that reads instantly from one that does not.",
          },
          {
            id: "cx110-1-2",
            title: "Typography as a system",
            minutes: 50,
            summary:
              "Choosing and pairing typefaces, setting a modular scale, and getting line length and leading right.",
          },
          {
            id: "cx110-1-3",
            title: "Colour with intent",
            minutes: 45,
            summary:
              "Building a palette from a brand, checking contrast against WCAG, and using accent colour sparingly enough that it means something.",
          },
        ],
      },
      {
        title: "Figma in earnest",
        lessons: [
          {
            id: "cx110-2-1",
            title: "Auto-layout, components, and variants",
            minutes: 60,
            summary:
              "Building a design file that survives a change request instead of needing to be rebuilt.",
          },
          {
            id: "cx110-2-2",
            title: "Designing responsively",
            minutes: 55,
            summary:
              "Mobile-first thinking, breakpoints that follow the content, and designing for the phone most Nigerians actually carry.",
          },
        ],
      },
      {
        title: "Into the browser",
        lessons: [
          {
            id: "cx110-3-1",
            title: "Semantic HTML and document structure",
            minutes: 50,
            summary:
              "Choosing the right element, and what assistive technology does with each one.",
          },
          {
            id: "cx110-3-2",
            title: "Modern CSS layout: flexbox and grid",
            minutes: 65,
            summary:
              "Building the layouts you designed, without absolute positioning or magic numbers.",
          },
          {
            id: "cx110-3-3",
            title: "Handing off and going live",
            minutes: 45,
            summary:
              "Exporting assets, documenting the system, and deploying the finished site to a real domain.",
          },
        ],
      },
    ],
  },
  {
    slug: "ai-assisted-engineering",
    code: "CX-401",
    title: "AI-Assisted Engineering",
    subtitle:
      "Use AI coding tools the way senior engineers do — as leverage on work you understand, not as a substitute for understanding it.",
    level: "Intermediate",
    format: "Self-paced + mentor",
    weeks: 6,
    hoursPerWeek: 6,
    priceKobo: 6_000_000,
    seats: 40,
    nextCohort: "Rolling — start any Monday",
    featured: true,
    outcomes: [
      "Write prompts and specifications that produce code you would merge",
      "Review AI-written code critically, including the failure modes it hides",
      "Build a small agentic tool against the Claude API, end to end",
      "Set up an AI-assisted workflow inside a real team's review process",
      "Know where these tools break, and what to do when they do",
    ],
    requirements: [
      "At least six months of programming experience in any language",
      "An existing codebase you are allowed to experiment on, ideally",
    ],
    tools: ["Claude", "Claude Code", "Anthropic API", "TypeScript"],
    modules: [
      {
        title: "Working with the model",
        lessons: [
          {
            id: "cx401-1-1",
            title: "What these models are and are not",
            minutes: 45,
            preview: true,
            summary:
              "Context windows, tokens, temperature, and the specific ways a language model is confidently wrong.",
          },
          {
            id: "cx401-1-2",
            title: "Specification over instruction",
            minutes: 55,
            summary:
              "Why stating the goal, the constraints, and the definition of done beats a step-by-step script.",
          },
          {
            id: "cx401-1-3",
            title: "Reviewing generated code",
            minutes: 60,
            summary:
              "A concrete checklist: boundary conditions, error handling, security assumptions, and dependencies you did not ask for.",
          },
        ],
      },
      {
        title: "Building with the API",
        lessons: [
          {
            id: "cx401-2-1",
            title: "Your first streaming endpoint",
            minutes: 60,
            summary:
              "Calling the Claude API from a server, streaming tokens to a browser, and handling errors mid-stream.",
          },
          {
            id: "cx401-2-2",
            title: "Tool use and agent loops",
            minutes: 70,
            summary:
              "Giving a model tools, running the loop, and putting a human approval gate in front of anything destructive.",
          },
          {
            id: "cx401-2-3",
            title: "Cost, latency, and evaluation",
            minutes: 55,
            summary:
              "Prompt caching, choosing a model per route, and building an evaluation set before you ship to users.",
          },
        ],
      },
    ],
  },
];

export function getCourse(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export function isWaitlisted(course: Course): boolean {
  return course.availability === "waitlist";
}

export function courseLessons(course: Course): Lesson[] {
  return course.modules.flatMap((m) => m.lessons);
}

export function courseHours(course: Course): number {
  return Math.round(
    courseLessons(course).reduce((total, l) => total + l.minutes, 0) / 60,
  );
}
