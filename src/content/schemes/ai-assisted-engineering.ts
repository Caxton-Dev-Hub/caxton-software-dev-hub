import type { Scheme } from "../scheme";

// ---------------------------------------------------------------------------
// CX-401 — AI-Assisted Engineering
//
// Six weeks, self-paced with a mentor. This is the course the other four point
// at, and the one that has to be taught most carefully, because it is the one
// most easily mistaken for a shortcut.
//
// The organising claim: a prompt is a specification, and specification is an
// old engineering skill that most self-taught developers have never been taught
// at all. So week 2 is not "prompt engineering tricks". It is learning to state
// a goal, its constraints, and its definition of done — and then measuring what
// each part of that statement was worth, by removing it and running again.
//
// Nothing here works on a learner who cannot already write the code themselves.
// The entry requirement is not bureaucratic: reviewing generated code is the
// central skill, and you cannot review what you could not have written.
// ---------------------------------------------------------------------------

export const cx401: Scheme = {
  courseSlug: "ai-assisted-engineering",
  sessionsPerWeek: 2,
  sessions: [
    {
      id: "cx401-w1-s1",
      week: 1,
      title: "What these models are, and are not",
      toolFocus: ["Claude"],
      objectives: [
        "Explain next-token prediction well enough to predict a failure from it",
        "Describe the context window as a budget that is spent, not a memory",
        "Name three specific ways a model is confidently wrong",
      ],
      demo: [
        "The same question asked at the start and end of a long conversation, answered differently",
        "A confident, fluent, entirely invented API, generated live",
        "A model asked about its own reasoning, and why that answer is not evidence",
      ],
      practice: [
        "Make a model contradict itself inside one conversation and write down how you did it",
      ],
      ifStuck:
        "The mental model that carries the course: it is producing the most plausible continuation, not retrieving a fact. Plausible and correct come apart most where the learner knows least.",
    },
    {
      id: "cx401-w1-s2",
      week: 1,
      title: "Context, tokens, and what you are actually paying for",
      dependsOn: ["cx401-w1-s1"],
      objectives: [
        "Estimate the token cost of a piece of work before running it",
        "Decide what belongs in context and what is noise",
        "Explain why a longer prompt is sometimes cheaper than a shorter one",
      ],
      demo: [
        "One task run with a bare prompt and with a full context, costs compared alongside the outputs",
        "A context stuffed with irrelevant files, degrading the answer measurably",
        "Prompt caching on a repeated system prompt, with the bill before and after",
      ],
      practice: [
        "Price a real task three ways before running any of them, then check your estimates",
      ],
    },
    {
      id: "cx401-w2-s1",
      week: 2,
      title: "Specification over instruction",
      dependsOn: ["cx401-w1-s2"],
      objectives: [
        "Distinguish an instruction, a description, and a specification",
        "State constraints and a definition of done for a real task",
        "Recognise the assumption a model will make when the specification is silent",
      ],
      demo: [
        "One task, three prompts on screen at once: vague, instructional, specified",
        "All three outputs read aloud in full, with the room finding the defects",
        "The silence in the vague prompt traced directly to the wrong assumption in its output",
        "A specification that over-constrains, producing something worse than the loose one",
      ],
      practice: [
        "Take a task you have already built and write a specification for it that omits nothing you actually relied on",
      ],
      ifStuck:
        "If a learner's specification produces good output, ask what would happen if the model had never seen this codebase. Most specifications are secretly leaning on context they did not state.",
    },
    {
      id: "cx401-w2-s2",
      week: 2,
      title: "Ablation: measuring what each part of a prompt is worth",
      dependsOn: ["cx401-w2-s1"],
      objectives: [
        "Change one variable at a time and attribute the difference honestly",
        "Report a negative result — a constraint that turned out not to matter",
        "Build a small corpus of prompts and outputs they can reuse and compare against",
      ],
      demo: [
        "A working specification stripped one clause at a time, six runs, results tabulated",
        "The clause everyone assumed was carrying the output, removed, changing nothing",
        "Two runs of the identical prompt differing from each other, and what that does to any conclusion drawn from a single run",
      ],
      practice: [
        "Run one specification five times unchanged and describe the variance before you attribute anything to your wording",
      ],
      assignment: {
        id: "cx401-a1",
        title: "The prompt study",
        brief:
          "Choose one non-trivial task from a codebase you know. Write four prompts for it: vague, instructional, specified, and over-specified. Run each three times — three, because a single run tells you nothing about variance. Then ablate your specification: remove one clause at a time and record what changes. Hand in every prompt, every output, a table of results, and a written conclusion. Your conclusion must include at least one thing you expected to matter that did not.",
        submitAs: "writeup",
        dueOffsetDays: 7,
        aiPolicy: "ai_required",
        rubric: [
          {
            criterion: "The four prompts differ in kind, not in length",
            weight: 20,
            looksLike:
              "The specified prompt states constraints and a definition of done. The over-specified one is genuinely over-constrained, not merely longer.",
          },
          {
            criterion: "Variance is measured before it is explained away",
            weight: 25,
            looksLike:
              "Three runs each, with the spread reported. A conclusion drawn from a single run of each prompt scores nothing here, however sensible it sounds.",
          },
          {
            criterion: "The ablation isolates one variable",
            weight: 25,
            looksLike:
              "One clause changed per run, with the rest held fixed. Two changes at once makes the result unattributable and is marked as such.",
          },
          {
            criterion: "A negative result is reported",
            weight: 20,
            looksLike:
              "Names something they expected to matter that did not. Full marks for reporting it; this criterion exists because the honest null result is the hardest thing to hand in.",
          },
          {
            criterion: "It is reusable",
            weight: 10,
            looksLike:
              "Prompts and outputs stored so they can be re-run against a future model. This becomes the learner's own regression set.",
          },
        ],
      },
    },
    {
      id: "cx401-w3-s1",
      week: 3,
      title: "Reviewing generated code",
      dependsOn: ["cx401-w2-s2"],
      objectives: [
        "Apply a fixed checklist to generated code rather than reading it impressionistically",
        "Find the defect that looks right, not only the one that looks wrong",
        "Refuse a dependency the model introduced without being asked",
      ],
      demo: [
        "A generated feature reviewed live against the checklist: boundaries, error paths, security assumptions, dependencies, and what it silently changed",
        "Three planted defects — one obvious, one subtle, one that only appears under concurrency",
        "Generated code that is correct, idiomatic, and solving the wrong problem",
      ],
      practice: [
        "Review a generated pull request against the checklist and find at least three findings",
      ],
      ifStuck:
        "A learner who finds nothing has not reviewed. The instruction that works: find three things, even if two are trivial. The third is usually real.",
    },
    {
      id: "cx401-w3-s2",
      week: 3,
      title: "AI inside a team's review process",
      toolFocus: ["Git", "GitHub"],
      dependsOn: ["cx401-w3-s1"],
      objectives: [
        "Declare AI use in a pull request in a way a reviewer can act on",
        "Agree a team policy on what may and may not be generated",
        "Explain why undeclared generated code is a review problem, not a moral one",
      ],
      demo: [
        "Two identical pull requests, one declaring its AI use and one not, reviewed by the room in turn",
        "A reviewer's time misallocated because they assumed a human had thought about the edge cases",
        "Our own study assistant's system prompt, and the boundary it holds, read line by line",
      ],
      practice: [
        "Draft an AI policy for a team of five and defend one clause against the room",
      ],
      assignment: {
        id: "cx401-a2",
        title: "Review, and be reviewed",
        brief:
          "Generate a feature of real substance for a codebase you work on. Review it against the checklist and write the review as though for a colleague. Then swap: review a classmate's generated feature, and have yours reviewed. Hand in your specification, the generated diff, both reviews, and the final merged code. Your submission must name at least one defect your classmate found that you missed.",
        submitAs: "pull_request",
        dueOffsetDays: 7,
        aiPolicy: "ai_required",
        rubric: [
          {
            criterion: "The review is systematic",
            weight: 30,
            looksLike:
              "Every checklist heading addressed, including the ones with nothing to report. Findings cite lines and state consequences.",
          },
          {
            criterion: "The subtle defect is found",
            weight: 25,
            looksLike:
              "At least one finding that a fluent read would have passed over — an unhandled boundary, a wrong assumption about the data, a silent behaviour change.",
          },
          {
            criterion: "The merged code is defensible",
            weight: 25,
            looksLike:
              "Every line explainable under questioning. No dependency accepted without justification. Discarding the generated work and saying so scores full marks.",
          },
          {
            criterion: "The miss is acknowledged",
            weight: 20,
            looksLike:
              "Names what the classmate caught and they did not, and says what would have caught it. Claiming to have missed nothing is the failure this criterion catches.",
          },
        ],
      },
    },
    {
      id: "cx401-w4-s1",
      week: 4,
      title: "Your first streaming endpoint",
      toolFocus: ["Anthropic API", "TypeScript"],
      dependsOn: ["cx401-w1-s2"],
      objectives: [
        "Call the API from a server and stream tokens to a browser",
        "Keep the API key on the server, and say what happens if it leaks",
        "Handle an error that arrives halfway through a stream",
      ],
      demo: [
        "An endpoint built from empty file to streaming response",
        "The key exposed in a client bundle, found in devtools in ten seconds",
        "A stream cut off mid-sentence, and the three places that must handle it",
      ],
      practice: [
        "Build a streaming endpoint and kill it mid-response deliberately",
      ],
    },
    {
      id: "cx401-w4-s2",
      week: 4,
      title: "System prompts, and shaping behaviour on purpose",
      dependsOn: ["cx401-w4-s1", "cx401-w2-s1"],
      objectives: [
        "Write a system prompt that holds a boundary under pressure",
        "Test a prompt adversarially against a user trying to get around it",
        "Say why a system prompt is a product decision, not a technical one",
      ],
      demo: [
        "A system prompt with a rule, and five attempts to talk it out of the rule",
        "One paragraph added, changing the behaviour measurably",
        "A prompt that refuses too much, and the users it drives away",
      ],
      practice: [
        "Write a system prompt for a tutor that will not do a learner's assessed work, then attack a classmate's",
      ],
      ifStuck:
        "Point them at our own assistant. It is a real system prompt, in production, holding a real boundary, and they can read every word of it.",
    },
    {
      id: "cx401-w5-s1",
      week: 5,
      title: "Tool use and the agent loop",
      dependsOn: ["cx401-w4-s2"],
      objectives: [
        "Define a tool a model can call, with a schema it can satisfy",
        "Run the loop, and terminate it before it runs forever",
        "Debug a model that calls the wrong tool, or calls one with wrong arguments",
      ],
      demo: [
        "A loop built from scratch: definition, call, result, continuation",
        "A tool description rewritten once, fixing a persistent wrong-tool problem",
        "A loop with no termination condition, stopped manually, with the bill shown",
      ],
      practice: [
        "Give a model two tools and make it choose correctly between them",
      ],
    },
    {
      id: "cx401-w5-s2",
      week: 5,
      title: "The approval gate, and what an agent must never do alone",
      dependsOn: ["cx401-w5-s1"],
      objectives: [
        "Put a human gate in front of every destructive or outward-facing action",
        "Distinguish a reversible action from an irreversible one, in code",
        "Design an audit trail for what an agent did on someone's behalf",
      ],
      demo: [
        "An agent given a delete tool with no gate, on a test database, and the result",
        "The same agent with a confirmation step, refusing to proceed unattended",
        "An action log good enough to answer 'why did it do that' a week later",
      ],
      practice: [
        "Classify every tool in your own agent as reversible or not, and gate accordingly",
      ],
      assignment: {
        id: "cx401-a3",
        title: "An agent you would leave running",
        brief:
          "Build a small agent that does something genuinely useful against a real system you control — triaging issues, drafting replies, reconciling records. It must have at least three tools, a termination condition, a human approval gate in front of anything destructive or outward-facing, and an audit log. Then write the abuse report: try to make it do something it should not, including by putting instructions in the data it reads. Report what got through.",
        submitAs: "repo",
        dueOffsetDays: 10,
        aiPolicy: "ai_assisted",
        rubric: [
          {
            criterion: "The loop terminates, always",
            weight: 20,
            looksLike:
              "A bounded iteration count and a cost ceiling, both tested by being hit deliberately.",
          },
          {
            criterion: "Irreversible actions are gated",
            weight: 30,
            looksLike:
              "Every destructive or outward-facing tool requires a human. The classification is written down and each entry is defensible.",
          },
          {
            criterion: "It survives hostile input",
            weight: 30,
            looksLike:
              "Instructions planted in the data the agent reads do not become instructions it follows. Anything that did get through is reported rather than quietly patched out of the write-up.",
          },
          {
            criterion: "It can be audited after the fact",
            weight: 20,
            looksLike:
              "The log answers what it did, why, and on whose behalf, a week later, without the author present.",
          },
        ],
      },
      ifStuck:
        "Prompt injection is the part learners most want to wave away. Have them plant an instruction in a database row and watch their own agent obey it.",
    },
    {
      id: "cx401-w6-s1",
      week: 6,
      title: "Evaluation: knowing whether you made it better",
      dependsOn: ["cx401-w2-s2", "cx401-w5-s2"],
      objectives: [
        "Build an evaluation set before changing a prompt",
        "Choose a metric that would actually catch a regression",
        "Say why vibes are not evidence, with a case where they misled them",
      ],
      demo: [
        "A prompt 'improved' by feel, then measured, and found worse on a third of cases",
        "An evaluation set built from twenty real inputs, including the awkward ones",
        "A model swapped underneath a working prompt, and what the eval catches that a demo does not",
      ],
      practice: [
        "Build an eval set for your week 5 agent and run your current prompt against it",
      ],
    },
    {
      id: "cx401-w6-s2",
      week: 6,
      title: "Cost, latency, and shipping it to real users",
      dependsOn: ["cx401-w6-s1"],
      objectives: [
        "Choose a model per route on evidence rather than by default",
        "Cache what is stable and measure the saving",
        "Set a budget and an alert before users arrive, not after",
      ],
      demo: [
        "One product's routes priced individually, with a cheaper model justified on two of them",
        "Prompt caching applied to a long system prompt, with the bill before and after",
        "A runaway cost incident walked through from alert to cause",
      ],
      practice: [
        "Price your own agent at a thousand users a day and say what breaks first",
      ],
      assignment: {
        id: "cx401-a4",
        title: "Capstone: ship it, measure it, and say what it costs",
        brief:
          "Take your week 5 agent to something you would put in front of real users. It needs an evaluation set of at least twenty cases including the awkward ones, a measured baseline, and one improvement you can prove with the eval rather than assert. Deploy it. Then write the operator's note: what it costs per thousand uses, what it does when the API is down, what it must never be allowed to do, and the case you know it still gets wrong.",
        submitAs: "url",
        dueOffsetDays: 14,
        aiPolicy: "ai_assisted",
        rubric: [
          {
            criterion: "The improvement is proven, not claimed",
            weight: 30,
            looksLike:
              "A baseline, a change, and a re-run showing the difference. An improvement that the eval cannot detect is reported as such, which scores well.",
          },
          {
            criterion: "The eval set is honest",
            weight: 25,
            looksLike:
              "Includes the cases the system handles badly, not only the ones it passes. A set that scores 100% on the first run is a set that is too easy, and is marked down.",
          },
          {
            criterion: "It degrades gracefully",
            weight: 20,
            looksLike:
              "A defined behaviour when the API is slow, down, or rate limited. The user is told something true rather than shown a spinner forever.",
          },
          {
            criterion: "The economics are real",
            weight: 15,
            looksLike:
              "Cost per thousand uses, measured rather than estimated, with the assumption behind the projection stated.",
          },
          {
            criterion: "The known failure is stated",
            weight: 10,
            looksLike:
              "Names a case it still gets wrong and says why it shipped anyway. Every system has one; the ones that claim not to have not looked.",
          },
        ],
      },
    },
  ],
};
