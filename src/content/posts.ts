export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readMinutes: number;
  author: string;
  category: "Engineering" | "Learning" | "Business";
  /** Markdown-lite: paragraphs, `## ` headings, and `- ` list items. */
  body: string;
};

export const posts: Post[] = [
  {
    slug: "what-to-ask-before-you-pay-a-developer-in-nigeria",
    title: "What to ask before you pay a developer in Nigeria",
    excerpt:
      "Seven questions that separate a team that will finish your project from one that will disappear with your deposit.",
    date: "2026-08-04",
    readMinutes: 7,
    author: "Caxton Software Dev Hub",
    category: "Business",
    body: `Most software projects in Nigeria do not fail because the code was bad. They fail because nobody agreed what "done" meant, and there was no way to check progress until it was too late to change course.

Here is what we would ask, if we were hiring us.

## 1. Can I see the repository from day one?

Source code should live in your organisation's account, not the developer's. If a team will not give you repository access from the first commit, ask why. The only honest answer is that they want leverage.

## 2. What exactly is in scope, in writing?

A quote without a written scope is a guess. Ask for a document that lists the screens, the user roles, and the things explicitly not included. Both of you should be able to point at it later.

## 3. What happens when I want a change?

Changes are normal. What matters is whether there is a process: a written change request, an impact on price and date, and your approval before work starts. Teams that say "no problem, we'll fit it in" are the ones that miss the date.

## 4. Will I see working software before the end?

Ask for a demo cadence. Weekly is reasonable. A team that only shows you the finished product is asking you to trust them for three months on nothing.

## 5. Who owns the accounts?

Domain, hosting, database, email, payment gateway. All of these should be registered to you, with the developer added as a collaborator. This is the single most common way businesses get locked in.

## 6. What happens after launch?

Get the warranty period in writing. Thirty days of free bug fixes is a fair standard. Also get a maintenance quote, so you know what year two costs before you commit to year one.

## 7. Are you registered?

A registered business has an address, a registration number, and something to lose. You can verify a Nigerian business name with the Corporate Affairs Commission. It takes two minutes and it filters out a surprising number of people.

None of these questions are hostile. Any good team will have answers ready, because they have been asked before.`,
  },
  {
    slug: "how-we-use-ai-in-our-training",
    title: "How we actually use AI in our training",
    excerpt:
      "An AI tutor is not a replacement for a mentor. Here is the specific line we draw, and why.",
    date: "2026-07-21",
    readMinutes: 6,
    author: "Caxton Software Dev Hub",
    category: "Learning",
    body: `Every training provider now claims to be "AI-powered". Most of them mean they put a chatbot in the corner of the page. We want to be specific about what ours does, because the difference matters to what you will learn.

## What the assistant is for

Our study assistant is scoped to the course you are enrolled on. It knows the module you are in, the lesson you are reading, and what the curriculum expects you to be able to do by the end of the week. When you ask it something, it answers against that context.

It is good at three things:

- Explaining the same concept a second and third way, at 1am, without getting tired of you
- Reading your code and telling you where your mental model diverged from what the machine is doing
- Generating practice problems at the exact difficulty you are stuck on

## What the assistant will not do

It will not write your assignment. This is a deliberate constraint, not a limitation we are working around. When you ask it to produce the solution, it will ask you what you have tried and walk you toward it instead.

We are strict about this because the failure mode is well documented: learners who let a model write their code report high confidence and fail technical interviews. The typing is not the part you are paying to learn.

## Where the human comes in

Your mentor does the things a model cannot: reading your pull request in the context of your career, deciding what to skip because it does not matter for the job you want, and telling you honestly when work is not good enough yet. The assistant handles volume. The mentor handles judgement.

## What we teach about AI itself

We also teach the tools directly, because you will be expected to use them at work. The AI-Assisted Engineering course covers writing specifications a model can act on, reviewing generated code critically, and building against the API yourself. Understanding the tool is different from depending on it.`,
  },
  {
    slug: "reading-a-postgres-query-plan",
    title: "Reading a Postgres query plan without panicking",
    excerpt:
      "EXPLAIN output looks hostile until you know which four lines to read first. A practical guide with a worked example.",
    date: "2026-06-30",
    readMinutes: 9,
    author: "Caxton Software Dev Hub",
    category: "Engineering",
    body: `The first time you run EXPLAIN ANALYZE on a slow query, the output looks like a wall of parentheses. It is not. It is a tree, and there are only a handful of things you need to read.

## Read it inside out

The plan is a tree of nodes, printed with the outermost operation at the top. Execution happens the other way around: the most indented lines run first, and results flow upward. Start at the deepest indentation and read up.

## The four numbers that matter

Each node reports \`cost\`, \`rows\`, \`actual time\`, and \`loops\`. The one to watch is the gap between estimated \`rows\` and actual rows returned. When the planner estimates 10 rows and gets 400,000, every decision it made above that node was based on a bad assumption — and that is usually your real problem, not the node that looks slow.

## Sequential scan is not always wrong

A sequential scan on a small table is correct and fast. Postgres chooses it deliberately when the table is small enough or when it expects to return most of the rows anyway. Adding an index there will not help and will slow your writes down.

The sequential scan you care about is the one on a large table inside a nested loop, running thousands of times. Look at \`loops\`.

## The usual culprits

- **A function on the indexed column.** \`WHERE lower(email) = $1\` cannot use a plain index on \`email\`. Index the expression, or store the normalised value.
- **A type mismatch.** Comparing a \`bigint\` column to an integer parameter can prevent index use depending on how the driver sends it.
- **Missing statistics.** After a bulk load, run \`ANALYZE\`. The planner is only as good as its idea of your data distribution.
- **OR conditions across columns.** These often defeat a single composite index. Sometimes two queries and a UNION are genuinely faster.

## The habit worth building

Do not optimise from intuition. Run the query with \`EXPLAIN (ANALYZE, BUFFERS)\`, change one thing, and run it again. Keep the before and after. Most of the time the fix is one index or one rewritten predicate, and you will only find which one by measuring.`,
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
