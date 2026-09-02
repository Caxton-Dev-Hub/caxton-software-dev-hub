import type { Scheme } from "../scheme";

// ---------------------------------------------------------------------------
// CX-201 — Backend Engineering with Node.js & PostgreSQL
//
// Ten weeks. The order is deliberate and unusual: the database comes first and
// the API second. Most backend courses do the reverse, and produce engineers
// who model data around whatever the first endpoint needed. A schema is the
// hardest thing to change once there is production data in it, so it is the
// first thing we teach people to get right.
//
// Version control carries over from CX-101 and is assumed, with one exception:
// week 9 teaches migrations as version control for data, which is a different
// discipline and the one most self-taught developers have never been shown.
//
// AI enters in week 8, on webhooks, where the failure modes are ugly enough to
// be worth reviewing hard. Everything before it is unaided.
// ---------------------------------------------------------------------------

export const cx201: Scheme = {
  courseSlug: "backend-engineering-node-postgres",
  sessionsPerWeek: 2,
  sessions: [
    {
      id: "cx201-w1-s1",
      week: 1,
      title: "Relational modelling for real businesses",
      toolFocus: ["PostgreSQL", "psql"],
      objectives: [
        "Turn a described business into tables, keys, and relationships",
        "Choose a primary key and defend the choice",
        "Spot the one-to-many that is really a many-to-many before it ships",
      ],
      demo: [
        "A real business described aloud, modelled on the board in front of the room",
        "The same model done badly, and the query that becomes impossible because of it",
        "psql from cold: connecting, \\dt, \\d, and reading a table definition",
      ],
      practice: [
        "Model a Nigerian business you know — a pharmacy, a school, a logistics firm",
      ],
      ifStuck:
        "Ask them to write the three questions the business needs answered, then check the model can answer all three.",
    },
    {
      id: "cx201-w1-s2",
      week: 1,
      title: "Constraints are where correctness lives",
      dependsOn: ["cx201-w1-s1"],
      objectives: [
        "Use NOT NULL, UNIQUE, CHECK, and foreign keys to make bad data impossible",
        "Choose ON DELETE behaviour deliberately for each relationship",
        "Explain why a constraint in the database beats a check in the application",
      ],
      demo: [
        "Two application servers writing the same row, and the unique constraint that saves them",
        "ON DELETE CASCADE removing more than anyone intended, on purpose",
        "Money stored as a float, and the error accumulating over a hundred rows",
      ],
      practice: [
        "Add every constraint your week 1 model needs, then try to insert bad data",
      ],
    },
    {
      id: "cx201-w2-s1",
      week: 2,
      title: "Indexes, query plans, and EXPLAIN",
      dependsOn: ["cx201-w1-s2"],
      objectives: [
        "Read an EXPLAIN ANALYZE output and find the expensive node",
        "Add an index that helps, and recognise one that does not",
        "State the cost of an index, not only the benefit",
      ],
      demo: [
        "A query on a million rows before and after the right index",
        "An index the planner refuses to use, and why",
        "Write throughput measured before and after adding six indexes",
      ],
      practice: [
        "Given three slow queries, make each one fast and explain what you did",
      ],
      ifStuck:
        "Have them read the plan from the innermost node outward. Sequential scan on a large table is almost always the answer.",
    },
    {
      id: "cx201-w2-s2",
      week: 2,
      title: "Queries that answer a business question",
      dependsOn: ["cx201-w2-s1"],
      objectives: [
        "Write joins, aggregates, and window functions against their own schema",
        "Decide what belongs in SQL and what belongs in application code",
        "Avoid the N+1 query, and prove they have",
      ],
      demo: [
        "An N+1 caught in the query log, then collapsed into one join",
        "A report written twice: once in application code, once in SQL",
      ],
      practice: [
        "Answer five business questions about your schema in SQL alone",
      ],
      assignment: {
        id: "cx201-a1",
        title: "A schema that survives contact with the business",
        brief:
          "Model a real Nigerian business end to end: schema, constraints, indexes, and seed data of at least ten thousand rows. Then answer eight business questions in SQL, with EXPLAIN ANALYZE output for each. At least two questions must be slow before you index and fast after, and you must show both plans. Hand in the repository with migrations, not a database dump.",
        submitAs: "repo",
        dueOffsetDays: 7,
        aiPolicy: "unaided",
        rubric: [
          {
            criterion: "The model fits the business",
            weight: 30,
            looksLike:
              "Every entity earns its table. Relationships have the right cardinality. Nothing needs a comment explaining why it is shaped strangely.",
          },
          {
            criterion: "Bad data is impossible, not merely discouraged",
            weight: 25,
            looksLike:
              "Constraints in the database, not only in the application. Money in integers. ON DELETE chosen per relationship rather than copied.",
          },
          {
            criterion: "The indexing is evidenced",
            weight: 25,
            looksLike:
              "Before and after plans quoted for at least two queries. An index added without a plan showing it was needed is marked down.",
          },
          {
            criterion: "It is reproducible from the repository",
            weight: 20,
            looksLike:
              "A clone, a migration run, and a seed command produce the same database. No manual steps that live only in the learner's head.",
          },
        ],
      },
    },
    {
      id: "cx201-w3-s1",
      week: 3,
      title: "Transactions and consistency",
      dependsOn: ["cx201-w2-s2"],
      objectives: [
        "Wrap a multi-step write in a transaction and say what it guarantees",
        "Describe a lost update, and reproduce one",
        "Choose an isolation level on purpose",
      ],
      demo: [
        "Two concurrent transfers running without a transaction, money vanishing",
        "The same operation made safe, then deadlocked deliberately",
        "SELECT FOR UPDATE, and the queue it creates under load",
      ],
      practice: [
        "Reproduce a lost update on your own schema, then prevent it",
      ],
    },
    {
      id: "cx201-w3-s2",
      week: 3,
      title: "Idempotency, and doing a thing exactly once",
      dependsOn: ["cx201-w3-s1"],
      objectives: [
        "Make a write safe to retry",
        "Design an idempotency key and store it correctly",
        "Explain why at-least-once delivery makes this non-optional",
      ],
      demo: [
        "A payment credited twice because a request was retried",
        "The same flow with an idempotency key, retried ten times, crediting once",
      ],
      practice: [
        "Make one of your own writes idempotent and prove it with a repeated request",
      ],
      ifStuck:
        "This is the single most valuable idea in the course for anyone who will touch payments. Do not let a learner move past it while still hand-waving.",
    },
    {
      id: "cx201-w4-s1",
      week: 4,
      title: "Designing an API someone else can use",
      dependsOn: ["cx201-w2-s2"],
      objectives: [
        "Design resources and status codes a consumer can predict",
        "Return an error a client can act on programmatically",
        "Version an API without breaking the people already using it",
      ],
      demo: [
        "Three real APIs compared: one good, one inconsistent, one hostile",
        "An error body redesigned live from a bare 500 to something actionable",
      ],
      practice: [
        "Design the endpoints for your week 2 schema on paper before writing code",
      ],
    },
    {
      id: "cx201-w4-s2",
      week: 4,
      title: "Building it: routing, layers, and where logic lives",
      toolFocus: ["Node.js", "TypeScript"],
      dependsOn: ["cx201-w4-s1"],
      objectives: [
        "Separate transport, business logic, and data access",
        "Write a handler that is testable without an HTTP server",
        "Say where a given piece of logic belongs, and why",
      ],
      demo: [
        "A handler with business logic inline, then extracted and tested directly",
        "The same feature added to both versions, timed",
      ],
      practice: [
        "Build three endpoints against your own schema",
      ],
      assignment: {
        id: "cx201-a2",
        title: "An API a stranger can integrate against",
        brief:
          "Build the API for your week 2 schema. At least eight endpoints, layered so the business logic is testable without HTTP. Write the documentation as you go — a consumer should be able to integrate without asking you a question. Then swap with a classmate and integrate against theirs. You are marked partly on how well their integration went.",
        submitAs: "repo",
        dueOffsetDays: 7,
        aiPolicy: "unaided",
        rubric: [
          {
            criterion: "Predictable from the outside",
            weight: 30,
            looksLike:
              "Consistent naming, correct status codes, errors in one shape. A consumer can guess the ninth endpoint from the first eight.",
          },
          {
            criterion: "Layered so it can be tested",
            weight: 25,
            looksLike:
              "Business logic callable without spinning up a server. Tests exercise it directly rather than through the network.",
          },
          {
            criterion: "The documentation does its job",
            weight: 25,
            looksLike:
              "The classmate integrated without asking a question. Every question they had to ask is a mark lost.",
          },
          {
            criterion: "Errors are useful",
            weight: 20,
            looksLike:
              "A client can distinguish a validation failure from a permission failure from an outage, programmatically, without parsing prose.",
          },
        ],
      },
    },
    {
      id: "cx201-w5-s1",
      week: 5,
      title: "Authentication: sessions, tokens, and passwords",
      dependsOn: ["cx201-w4-s2"],
      objectives: [
        "Hash a password correctly and say why the algorithm choice matters",
        "Choose between a session and a token for a given product",
        "Set every cookie flag deliberately",
      ],
      demo: [
        "A password hashed three ways, one of which is cracked live",
        "A JWT decoded in the browser console — it is signed, not secret",
        "Revoking a stateless session, and why that needs a deliberate lever",
      ],
      practice: [
        "Add registration and login to your API, unaided",
      ],
    },
    {
      id: "cx201-w5-s2",
      week: 5,
      title: "Authorisation: who may do what, to which row",
      dependsOn: ["cx201-w5-s1"],
      objectives: [
        "Check authorisation on the row, not only on the route",
        "Find an insecure direct object reference in someone else's code",
        "Explain why a hidden button is not an access control",
      ],
      demo: [
        "Changing an id in a URL and reading another user's data, live",
        "The same endpoint fixed, then fixed properly at the query level",
      ],
      practice: [
        "Attack a classmate's API and report every record you should not have seen",
      ],
      ifStuck:
        "The habit to build: every query that reads a row by id must also constrain by owner. Make them say it back.",
    },
    {
      id: "cx201-w6-s1",
      week: 6,
      title: "Validation, rate limiting, and abuse",
      dependsOn: ["cx201-w5-s2"],
      objectives: [
        "Validate at the boundary and trust nothing that crossed it",
        "Rate limit by the right key, and explain what that key must not be",
        "Anticipate the abuse a Nigerian consumer product actually attracts",
      ],
      demo: [
        "A rate limit keyed on IP, defeated in one line from a rotating connection",
        "The same limit keyed on the account, holding",
        "An endpoint that leaks whether an email is registered, and the fix",
      ],
      practice: [
        "Rate limit your own login endpoint and defeat a classmate's",
      ],
    },
    {
      id: "cx201-w6-s2",
      week: 6,
      title: "Secrets, configuration, and what never enters the repository",
      toolFocus: ["Git", "dotenv"],
      dependsOn: ["cx201-w6-s1"],
      objectives: [
        "Keep configuration out of code and secrets out of history",
        "Rotate a leaked credential, in the right order",
        "Read a repository's history for secrets that are still reachable",
      ],
      demo: [
        "A secret committed, 'removed' by a later commit, still readable from the history",
        "The correct response: rotate first, then clean up, in that order",
      ],
      practice: [
        "Scan your own repository history for anything that should not be there",
      ],
      assignment: {
        id: "cx201-a3",
        title: "Break in, then lock it down",
        brief:
          "You are assigned a classmate's API from week 4. Attack it: authorisation you can walk past, records you should not reach, endpoints you can flood, information the error messages give away, secrets in the history. Write it up as a findings report — each finding with the request that proves it and the consequence. Then fix every finding in your own API, whether or not anyone found it there.",
        submitAs: "writeup",
        dueOffsetDays: 7,
        aiPolicy: "unaided",
        rubric: [
          {
            criterion: "Findings are reproducible",
            weight: 30,
            looksLike:
              "Each one has the exact request and the exact response. A finding a mentor cannot reproduce from the report scores nothing.",
          },
          {
            criterion: "Consequences are stated in business terms",
            weight: 20,
            looksLike:
              "Not 'IDOR on /orders/:id' but 'any logged-in user can read every customer's delivery address'.",
          },
          {
            criterion: "The fixes are at the right layer",
            weight: 30,
            looksLike:
              "Authorisation constrained in the query, validation at the boundary, limits keyed on the account. A fix that only hides the symptom is marked down.",
          },
          {
            criterion: "Written professionally",
            weight: 20,
            looksLike:
              "Factual, unsensational, and kind about the person whose code it is. This is a report you could send to a client.",
          },
        ],
      },
    },
    {
      id: "cx201-w7-s1",
      week: 7,
      title: "Background jobs and queues",
      dependsOn: ["cx201-w3-s2"],
      objectives: [
        "Move slow work out of the request path",
        "Handle a job that fails, and one that fails forever",
        "Explain what a dead letter queue is for",
      ],
      demo: [
        "A request that takes nine seconds because it sends an email inline",
        "The same work queued, and the failure modes that appear immediately",
        "A poison job retried a thousand times, and the backoff that stops it",
      ],
      practice: [
        "Move one slow operation in your API onto a queue",
      ],
    },
    {
      id: "cx201-w7-s2",
      week: 7,
      title: "Scheduled work, and clocks you do not control",
      dependsOn: ["cx201-w7-s1"],
      objectives: [
        "Write a scheduled job that is safe to run twice",
        "Reason about time zones without guessing",
        "Explain why 'runs at midnight' is a specification with a bug in it",
      ],
      demo: [
        "A nightly job run twice by an overlapping schedule, double-charging an account",
        "Timestamps stored without a zone, and the hour that goes missing",
      ],
      practice: [
        "Write a scheduled reconciliation job and run it three times over the same data",
      ],
    },
    {
      id: "cx201-w8-s1",
      week: 8,
      title: "Payments and webhooks in Nigeria",
      toolFocus: ["Paystack", "Flutterwave"],
      dependsOn: ["cx201-w3-s2", "cx201-w7-s1"],
      objectives: [
        "Verify a webhook signature and reject everything unsigned",
        "Treat the webhook as the source of truth, not the browser redirect",
        "Reconcile a payment the webhook never delivered",
      ],
      demo: [
        "A forged webhook accepted by an unverified endpoint, crediting an account",
        "The redirect arriving before the webhook, and the race that creates",
        "A real reconciliation: the provider says paid, the database says pending",
      ],
      practice: [
        "Wire a test-mode payment end to end and forge a webhook against your own endpoint",
      ],
      ifStuck:
        "Everyone tries to fulfil on the redirect because it is easier. Show them the tab closed at the wrong moment, once, and it lands.",
    },
    {
      id: "cx201-w8-s2",
      week: 8,
      title: "Specifying money code to a model, and reviewing it hard",
      toolFocus: ["Claude"],
      dependsOn: ["cx201-w8-s1", "cx201-w3-s2"],
      objectives: [
        "Write a specification containing the constraints that matter for money",
        "Find the idempotency and rounding failures a model introduces",
        "Decide when generated code is not worth reviewing at all",
      ],
      demo: [
        "The same payment handler specified twice — once without the idempotency constraint, once with — and the two outputs read side by side",
        "A generated handler that stores money as a float, found in review",
      ],
      practice: [
        "Specify a refund flow, generate it, and find three defects before the room does",
      ],
      assignment: {
        id: "cx201-a4",
        title: "A payment flow you would let run unattended",
        brief:
          "Build a complete test-mode payment flow: initialise, redirect, webhook, verification, fulfilment, and reconciliation for the webhook that never arrives. It must be idempotent under retry, must reject an unsigned webhook, and must never fulfil on the redirect alone. You may use AI, and you must declare where. Then write the failure report: forge a webhook, replay a real one five times, kill the process mid-fulfilment, and show what your system did in each case.",
        submitAs: "repo",
        dueOffsetDays: 10,
        aiPolicy: "ai_assisted",
        rubric: [
          {
            criterion: "Idempotent under real conditions",
            weight: 30,
            looksLike:
              "The same webhook replayed five times fulfils once. Proven by the report, not asserted.",
          },
          {
            criterion: "The webhook is the source of truth",
            weight: 25,
            looksLike:
              "Nothing is fulfilled on the redirect. Unsigned or badly signed webhooks are rejected before any business logic runs.",
          },
          {
            criterion: "Money is handled correctly",
            weight: 20,
            looksLike:
              "Integer minor units throughout. No float arithmetic anywhere in the path, including in generated code the learner accepted.",
          },
          {
            criterion: "The failure report is real",
            weight: 15,
            looksLike:
              "Actual output from actual attacks and interruptions, including any case where the system behaved badly and has not been fixed yet.",
          },
          {
            criterion: "The AI declaration is accurate",
            weight: 10,
            looksLike:
              "Specific about what was generated. Every generated line is one the learner can explain under questioning.",
          },
        ],
      },
    },
    {
      id: "cx201-w9-s1",
      week: 9,
      title: "Migrations: version control for data",
      toolFocus: ["Prisma", "Git"],
      dependsOn: ["cx201-w1-s2"],
      objectives: [
        "Write a migration that is safe to run against a table with live traffic",
        "Sequence a breaking change so no deploy is ever broken",
        "Explain why a migration is never edited after it has run anywhere",
      ],
      demo: [
        "A column renamed in one migration, breaking every running instance mid-deploy",
        "The same change done in the safe sequence: add, backfill, dual-write, cut over, drop",
        "An edited migration that has already run in production, and the drift it causes",
      ],
      practice: [
        "Rename a column in your own schema without a moment of downtime",
      ],
      ifStuck:
        "The rule to leave them with: a migration that has run anywhere is history, and history is append-only. Same rule as week 3 of CX-101, applied to data.",
    },
    {
      id: "cx201-w9-s2",
      week: 9,
      title: "Backups, observability, and the 3am page",
      dependsOn: ["cx201-w9-s1"],
      objectives: [
        "Restore a backup, and say when it was last actually tested",
        "Add logging that answers a question rather than filling a disk",
        "Trace a single slow request from the log to the query",
      ],
      demo: [
        "A backup restored live, timed, with the data loss window stated",
        "A log line that is useless and the same line made useful",
        "A production incident walked through from alert to root cause",
      ],
      practice: [
        "Restore your own database from a backup and time it",
      ],
    },
    {
      id: "cx201-w10-s1",
      week: 10,
      title: "Load, failure, and graceful degradation",
      dependsOn: ["cx201-w9-s2"],
      objectives: [
        "Find their own system's breaking point before a user does",
        "Fail one dependency and keep the rest of the product working",
        "Set a timeout everywhere they make a network call",
      ],
      demo: [
        "An API load tested to failure, and where it broke",
        "A third party made slow rather than down, and the connection pool exhausting",
      ],
      practice: [
        "Load test your own API and record the number at which it falls over",
      ],
    },
    {
      id: "cx201-w10-s2",
      week: 10,
      title: "The capstone review",
      dependsOn: ["cx201-w10-s1", "cx201-w8-s2"],
      objectives: [
        "Walk an engineer through a system they have not seen",
        "Answer 'what happens if this fails' for every external call",
        "Name the part they would rebuild, and say why",
      ],
      demo: [
        "A mentor reading an unfamiliar backend cold, narrating what they check first",
      ],
      practice: [
        "Present for fifteen minutes and take questions for fifteen",
      ],
      assignment: {
        id: "cx201-a5",
        title: "Capstone: a backend that can be handed over",
        brief:
          "One deployed service that does something real. It must have a modelled schema with migrations, a documented API, authentication and row-level authorisation, at least one queued job, one integration with an external provider that can fail, and observability good enough to debug it from the logs alone. Hand over the repository as though you were leaving the company on Friday: a README, a runbook for the two most likely incidents, and a written note on what you would do next with another month.",
        submitAs: "url",
        dueOffsetDays: 14,
        aiPolicy: "ai_assisted",
        rubric: [
          {
            criterion: "It runs, and a stranger can deploy it",
            weight: 20,
            looksLike:
              "A mentor can clone, configure from the README alone, migrate, and run it. Every undocumented step is a mark lost.",
          },
          {
            criterion: "The data model earns its shape",
            weight: 20,
            looksLike:
              "Constraints enforce the business rules. Migrations tell an honest story. No column exists that nobody can explain.",
          },
          {
            criterion: "It is safe to expose",
            weight: 25,
            looksLike:
              "Authorisation constrained at the query, input validated at the boundary, secrets absent from history, external calls timed out and retried sensibly.",
          },
          {
            criterion: "It can be operated by someone else",
            weight: 25,
            looksLike:
              "The runbook is specific enough to follow at 3am. Logs answer questions. The learner can say what breaks first under load, with a number.",
          },
          {
            criterion: "The handover is honest",
            weight: 10,
            looksLike:
              "Names the weak parts and what AI wrote. A candid list of known problems scores above a claim that there are none.",
          },
        ],
      },
    },
  ],
};
