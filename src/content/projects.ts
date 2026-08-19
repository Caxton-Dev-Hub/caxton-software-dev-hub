export type Project = {
  slug: string;
  client: string;
  title: string;
  sector: string;
  year: string;
  summary: string;
  problem: string;
  approach: string;
  result: string;
  stack: string[];
  /** DUMMY entries are illustrative placeholders — replace with real case studies. */
  dummy?: boolean;
};

export const projects: Project[] = [
  {
    slug: "logistics-dispatch-platform",
    client: "Kaduna logistics operator",
    title: "Dispatch and fleet-tracking platform",
    sector: "Logistics",
    year: "2026",
    dummy: true,
    summary:
      "Replaced a WhatsApp-and-spreadsheet dispatch process with a single system covering orders, drivers, and proof of delivery.",
    problem:
      "Dispatch ran on three WhatsApp groups and a shared spreadsheet. Nobody could answer where a consignment was without making four phone calls, and disputed deliveries had no paper trail.",
    approach:
      "Six weeks: a dispatcher console on the web, a driver app that works offline and syncs when signal returns, and photo-plus-signature proof of delivery attached to every order.",
    result:
      "Dispatch time per order fell from around 12 minutes to under 2. Delivery disputes now resolve from the record rather than from memory.",
    stack: ["Next.js", "PostgreSQL", "Prisma", "React Native", "Mapbox"],
  },
  {
    slug: "cooperative-savings-portal",
    client: "Multi-purpose cooperative society",
    title: "Member savings and loan portal",
    sector: "Financial services",
    year: "2026",
    dummy: true,
    summary:
      "A members' portal for contributions, loan applications, and statements, with a full double-entry ledger underneath.",
    problem:
      "Contributions were reconciled by hand each month. Members could not see their balance without visiting the office, and the loan approval trail existed only on paper.",
    approach:
      "A double-entry ledger as the source of truth, Paystack for collections, an approval workflow with role-based permissions, and downloadable statements for members.",
    result:
      "Month-end reconciliation went from four days to the same afternoon. Member enquiries to the office dropped sharply once statements were self-service.",
    stack: ["Next.js", "Node.js", "PostgreSQL", "Paystack", "Redis"],
  },
  {
    slug: "onchain-rewards-protocol",
    client: "Consumer rewards startup",
    title: "Onchain loyalty rewards protocol",
    sector: "Web3",
    year: "2026",
    dummy: true,
    summary:
      "Cairo contracts on Starknet issuing transferable loyalty points, with a web app for both merchants and shoppers.",
    problem:
      "The client wanted loyalty points that customers could hold and trade themselves, without running custody infrastructure or paying Ethereum mainnet fees.",
    approach:
      "Audited Cairo contracts for issuance and redemption, account abstraction so shoppers never see a seed phrase, and a merchant dashboard for campaign configuration.",
    result:
      "Deployed to Starknet mainnet after an external audit with no critical findings. Onboarding takes under 40 seconds for a first-time user.",
    stack: ["Cairo", "Starknet", "starknet.js", "Next.js", "Starknet Foundry"],
  },
  {
    slug: "school-management-suite",
    client: "Private secondary school group",
    title: "School management and results suite",
    sector: "Education",
    year: "2025",
    dummy: true,
    summary:
      "Enrolment, attendance, continuous assessment, and terminal results across four campuses, with a parent portal.",
    problem:
      "Each campus kept its own records in a different format. Producing a group-wide results summary took two weeks of manual collation every term.",
    approach:
      "One shared data model with per-campus permissions, an offline-tolerant attendance interface for teachers, and automated terminal report generation.",
    result:
      "Terminal reports now generate in minutes. Parents receive results by SMS and portal on the day they are approved.",
    stack: ["Next.js", "PostgreSQL", "Prisma", "Termii SMS"],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
