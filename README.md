# Caxton Software Dev Hub

The company website and learning platform for **CAXTON SOFTWARE DEV HUB** — a
business name registered in Nigeria with the Corporate Affairs Commission under
the Companies and Allied Matters Act 2020 (registration number 9675871),
operating from Kaduna.

It is one application doing two jobs:

- **A studio site** — services, case studies, a verifiable registration record,
  and an enquiry pipeline that lands in an admin inbox.
- **A learning platform** — cohort courses and mentorship plans that people pay
  for in naira through Flutterwave, with progress tracking and an AI study
  assistant scoped to each learner's curriculum.

---

## Stack

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router, Turbopack) | Server Components, Server Actions, one deploy for site + app |
| Language | TypeScript (strict) | — |
| Styling | Tailwind CSS v4 | Design tokens live in `src/app/globals.css` under `@theme` |
| Database | PostgreSQL + Prisma 6 | Money and enrolments need real transactions |
| Auth | Hand-rolled: `bcryptjs` + `jose` JWT in an httpOnly cookie | No third-party dependency for something this small; see note below |
| Payments | **Flutterwave** (NGN) | Recommended: settles to a Nigerian account, supports card / transfer / USSD out of the box |
| AI | Anthropic Claude (`claude-opus-5`), streamed | The study assistant |
| Email | Resend, or console when unconfigured | Local development needs no email provider |

**On auth:** sessions are signed JWTs in an httpOnly, SameSite=Lax cookie.
`src/proxy.ts` does a cheap signature check at the edge; every page and route
handler behind it re-resolves the user from the database before trusting
anything. If you would rather use Auth.js/Clerk later, `src/lib/auth.ts` is the
only file that needs replacing.

---

## Getting started

### 1. Requirements

- Node.js 20+ (developed on 23)
- PostgreSQL 14+

### 2. Install

```bash
npm install
```

### 3. Environment

```bash
cp .env.example .env.local
```

Then fill it in. Everything marked `DUMMY` is a placeholder.

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | yes | Also put this in a `.env` file — the Prisma CLI reads `.env`, Next.js reads `.env.local` |
| `AUTH_SECRET` | yes | `openssl rand -base64 32` |
| `NEXT_PUBLIC_SITE_URL` | yes | Used for Flutterwave callbacks, sitemap, and OG tags |
| `FLUTTERWAVE_SECRET_KEY` | for payments | From the Flutterwave dashboard. Without it, checkout returns a clear 503 and everything else still works |
| `FLUTTERWAVE_SECRET_HASH` | for payments | Dashboard → Settings → Webhooks → Secret Hash |
| `ANTHROPIC_API_KEY` | for the assistant | Without it, the assistant page explains it is switched off |
| `RESEND_API_KEY` | no | Leave empty to print emails to the server console |

### 4. Database

Local Postgres in Docker:

```bash
docker run -d --name caxton-pg -p 5432:5432 \
  -e POSTGRES_USER=caxton -e POSTGRES_PASSWORD=caxton -e POSTGRES_DB=caxton \
  postgres:16-alpine
```

Then:

```bash
npm run db:push     # create the tables
npm run db:seed     # demo accounts and data
```

Seeded accounts — **change or delete these before deploying anywhere public**:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@caxtonhub.com` | `caxton-admin-2026` |
| Student | `student@caxtonhub.com` | `caxton-student-2026` |

### 5. Run

```bash
npm run dev
```

http://localhost:3000

---

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | `prisma generate` then a production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Vitest, once (CI) |
| `npm run test:watch` | Vitest, watch mode |
| `npm run db:push` | Sync the schema without migration files (development) |
| `npm run db:migrate` | Create and apply a migration (use this for production) |
| `npm run db:seed` | Seed demo data |
| `npm run db:studio` | Prisma Studio |

---

## How the project is organised

```
prisma/
  schema.prisma          Transactional data only — users, payments, enrolments
  seed.ts
src/
  app/
    (site)/              Public marketing site — shares a header/footer layout
    (auth)/              Sign in and register — split-screen layout
    dashboard/           Student area (auth required)
    admin/               Admin area (ADMIN role required)
    checkout/callback/   Where Flutterwave returns the customer
    api/                 Route handlers
  components/
    ui/                  Primitives: Button, Field, Badge, Section, Container
    …                    Composed components
  content/               The catalogue, as code — see below
  lib/                   auth, prisma, flutterwave, fulfilment, money, mail, …
  proxy.ts               Route protection (Next 16's renamed middleware)
```

### Content-as-code

Courses, mentorship plans, services, case studies, articles, and legal
documents live in `src/content/*.ts`, not in the database. This is deliberate:

- The marketing site renders with no database connection at all
- Course content is version-controlled and reviewed like code
- Course pages can be statically generated

The database holds only what is genuinely transactional — users, payments,
enrolments, lesson progress, bookings, enquiries, assistant conversations. An
`Enrollment` references a course by `courseSlug`, which resolves against
`src/content/courses.ts`.

**To add a course:** add an entry to `src/content/courses.ts`. Nothing else
needs to change — the listing, detail page, checkout, dashboard, sitemap, and
assistant scoping all read from that file.

---

## Payments

The flow, end to end:

1. Learner clicks enrol → `POST /api/checkout/course` (or `/mentorship`)
2. We create a `Payment` row with status `PENDING` and a unique reference,
   then call Flutterwave's initialise endpoint and return the authorisation URL
3. The browser goes to Flutterwave, pays, and returns to `/checkout/callback`
4. The callback calls `POST /api/payments/verify`, which **re-verifies the
   transaction against the Flutterwave API** and fulfils it
5. Independently, Flutterwave calls `POST /dev-hub/api/flutterwave/webhook`, which
   checks the `verif-hash` header against the configured secret hash and
   fulfils the same payment

The webhook is the source of truth; step 4 exists so the customer sees a
confirmed screen immediately. `fulfilPayment()` is idempotent, so both paths
running is fine and expected.

Money is stored as **kobo** (integer minor units) everywhere — `amountKobo`,
`priceKobo`. `src/lib/money.ts` handles conversion and formatting. Never
introduce a float.

Two things the code deliberately does not trust:

- The amount reported by the browser — it is compared against the `Payment` row
- Webhook payload contents — the reference is re-verified against the API

### Configuring Flutterwave

1. Add your secret key to `FLUTTERWAVE_SECRET_KEY`
2. In the Flutterwave dashboard, set a webhook Secret Hash and put the same
   value in `FLUTTERWAVE_SECRET_HASH`, then set the webhook URL to
   `https://your-domain.com/dev-hub/api/flutterwave/webhook`
3. Test with Flutterwave's test cards before going live

**Switching provider:** everything provider-specific is in
`src/lib/flutterwave.ts` plus the webhook route. Nothing else references
Flutterwave by name.

---

## Course waitlists

A cohort with no seats left collects names instead of payments.

**To mark a cohort full**, set `availability: "waitlist"` on the course in
`src/content/courses.ts` (omit the field, or use `"open"`, for a course that is
still selling). That single flag drives everything:

- The course page swaps the enrol buttons for a waitlist form and shows a
  "Cohort full" badge and the number of people already waiting
- The catalogue card gets a "Waitlist" badge
- `POST /api/checkout/course` refuses to sell a seat with a 409, so nobody can
  bypass the UI
- Structured data reports `PreOrder` rather than `InStock`

**Joining is open to signed-out visitors** — the point is to capture interest
with as little friction as possible. If the visitor happens to be signed in, the
form is prefilled and the entry is linked to their account so it appears on
their dashboard. Re-submitting the same email keeps the person's original place
in the queue and refreshes their details rather than pushing them to the back.

**Queue order** lives in `src/lib/waitlist.ts` and is used by the API, the
student dashboard, and the admin table so all three always agree. It orders by
`createdAt` then `id` — the tie-break matters, because rows written in the same
millisecond otherwise all report as first.

**Running the list** — `/admin/waitlist` groups people by course in queue order,
with their note, whether they have an account, and a button to copy the waiting
addresses for a mail merge. Move someone through `waiting → invited → converted`
(or `declined`); marking them invited stamps `invitedAt`, and everyone behind
them moves up automatically. Learners see their own position, or a "seat
offered" state once invited, under **My courses**.

Both the joiner and `training@` get an email on every new join.

---

## The AI study assistant

`POST /api/assistant` streams a reply from Claude and persists the conversation.

- **Model:** `claude-opus-5`, streamed, at `effort: "low"`. Tutoring is latency
  sensitive, and low effort on this model is strong. Thinking is left on —
  disabling it on this model is known to leak internal tags into visible output.
- **Scoped:** the system prompt is built from the actual course the learner is
  enrolled on (`src/lib/assistant.ts`), including the syllabus and the outcomes
  for that course. The route checks enrolment before answering.
- **Cached:** the curriculum prefix carries a `cache_control` breakpoint, so
  repeat turns in a conversation are cheap.
- **Bounded:** it will not write assessed work. That constraint is in the system
  prompt and is a product decision, not a technical limitation.
- **Refusals handled:** a safety refusal returns HTTP 200 with empty content, so
  the route checks `stop_reason` before saving anything. To have Anthropic retry
  a refusal on another model automatically, see the commented note in
  `src/app/api/assistant/route.ts`.

---

## Before you launch

Everything below is deliberately placeholder. Search the codebase for `DUMMY`.

- [ ] **Contact details** — `src/content/site.ts`: email addresses, phone, WhatsApp
- [ ] **Social links** — X and LinkedIn URLs are guesses; GitHub links are real
- [ ] **Metrics** — the "40+ projects / 300+ engineers" figures on the homepage
- [ ] **Testimonials** — replace with real, attributable quotes and get permission
- [ ] **Case studies** — `src/content/projects.ts` is illustrative; every entry is
      flagged `dummy: true` and renders a "Placeholder" badge until you remove it
- [ ] **Prices** — course, mentorship, and service prices are all plausible
      starting points, not decisions
- [ ] **Cohort dates** — `nextCohort` on each course
- [ ] **Waitlist flags** — `CX-301` ships marked `availability: "waitlist"` as a
      demonstration; set each course to reflect real seat availability
- [ ] **Legal documents** — `src/content/legal.ts` is plain-English drafting, not
      legal advice. Have a Nigerian lawyer review it, particularly the NDPA 2023
      sections in the privacy policy
- [ ] **Seed accounts** — delete them, or change the passwords
- [ ] **`AUTH_SECRET`** — generate a real one
- [ ] **OG image** — add `src/app/opengraph-image.png` (1200×630)
- [ ] **Favicon** — replace `src/app/favicon.ico`

---

## Deploying

Any Node host works. On Vercel:

1. Push to GitHub and import the repository
2. Add every variable from `.env.example` to the project's environment
3. Point `DATABASE_URL` at a managed Postgres (Neon, Supabase, or Railway)
4. Use `npm run db:migrate` rather than `db:push` for production schema changes
5. Set the Flutterwave webhook URL and Secret Hash to your production domain
6. Set `NEXT_PUBLIC_SITE_URL` to your production URL — Flutterwave callbacks
   depend on it

The marketing pages are server-rendered rather than fully static because the
header reflects whether you are signed in. If you would rather have them static
and cached at the edge, drop the `getSession()` call from
`src/app/(site)/layout.tsx` and resolve the signed-in state client-side.

---

## Design notes

The palette comes from the CAC certificate itself: the engraved green of the
guilloche border, the white paper, and the gold of the seal. Gold is reserved
for marks of verification and appears nowhere else.

Type is set in **Bricolage Grotesque** (display), **Public Sans** (body — a
civic typeface, chosen because the whole site argues "registered and
accountable"), and **JetBrains Mono** for data: registration numbers, course
codes, payment references. Anything a person might check against a record is set
in mono.

The signature element is the **registry strip** — `RC 9675871 / CAMA 2020 /
KADUNA, NG` — which recurs across the site and links to `/verify`, where the
full record is reproduced as a certificate entry with instructions for checking
it against the CAC public register.

---

## Licence

© CAXTON SOFTWARE DEV HUB. All rights reserved.
