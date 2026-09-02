import type { Scheme } from "../scheme";

// ---------------------------------------------------------------------------
// CX-101 — Frontend Engineering with React & Next.js
//
// Weeks 1 to 4. The catalogue calls this module "Foundations that hold up" and
// gives version control a single 50-minute lesson. That was always too little.
// A developer who cannot recover a repository is a developer who works in fear,
// and fear is what makes people paste code they have not read. So version
// control gets four of the first six sessions, and it is taught as a mental
// model first: a commit is a snapshot, a branch is a pointer, nothing is lost
// until git gc runs.
//
// AI enters in week 4, and not before. By then they have written enough by hand
// to recognise generated code that is subtly wrong.
// ---------------------------------------------------------------------------

export const cx101: Scheme = {
  courseSlug: "frontend-engineering-react-nextjs",
  sessionsPerWeek: 2,
  sessions: [
    {
      id: "cx101-w1-s1",
      week: 1,
      title: "The machine you actually work on",
      toolFocus: ["Terminal", "pnpm", "Node version manager", "VS Code"],
      objectives: [
        "Navigate a filesystem, read a path, and explain what PATH is",
        "Install and switch Node versions without breaking an existing project",
        "Read an error message from top to bottom and say which line is theirs",
      ],
      demo: [
        "A terminal from cold: pwd, ls, cd, and where the home directory sits",
        "Installing Node through a version manager, then proving it with node -v",
        "pnpm install on a real project, and what node_modules actually contains",
        "One deliberate error, read aloud line by line, tracing the stack to our code",
      ],
      practice: [
        "Set up Node, pnpm, and an editor on your own laptop, unaided",
        "Break the install on purpose, then fix it and write down what you did",
      ],
      ifStuck:
        "Almost always a PATH problem or two Node versions fighting. Have them paste the output of `which node` and `node -v` before anything else.",
    },
    {
      id: "cx101-w1-s2",
      week: 1,
      title: "Version control from first principles",
      toolFocus: ["Git"],
      dependsOn: ["cx101-w1-s1"],
      objectives: [
        "Explain a commit as a snapshot of the whole tree, not a diff",
        "Stage selectively with git add -p and say why that matters",
        "Read git status, git log, and git diff without guessing",
        "Write a commit message a stranger can act on in six months",
      ],
      demo: [
        "git init on an empty folder, then cat .git/HEAD to show there is no magic",
        "The three places a file can live: working tree, index, commit",
        "git add -p on a change that mixes a fix and a rename, split into two commits",
        "A bad commit message and a good one, side by side, on the same change",
        ".gitignore, and why node_modules and .env must never be committed",
      ],
      practice: [
        "Initialise a repository for the static page you will build this week",
        "Commit in small steps as you go, not in one lump at the end",
      ],
      assignment: {
        id: "cx101-a1",
        title: "A repository that reads like a story",
        brief:
          "Build a single static page — a profile card, a menu, a fixture list, your choice — and commit it as you build. We are marking the history, not the page. At least eight commits, each one a single coherent change with a message that says why. Include a .gitignore. Push nothing yet; this one stays local and you will show us the log.",
        submitAs: "repo",
        dueOffsetDays: 5,
        aiPolicy: "unaided",
        rubric: [
          {
            criterion: "Commits are atomic",
            weight: 35,
            looksLike:
              "Each commit does one thing. No commit mixes a formatting sweep with a behaviour change. Reverting any single commit would leave a working tree.",
          },
          {
            criterion: "Messages explain intent",
            weight: 30,
            looksLike:
              "A subject line under 60 characters saying what changed, and a body saying why where the why is not obvious. No 'update', 'fix', or 'changes'.",
          },
          {
            criterion: "Nothing is committed that should not be",
            weight: 20,
            looksLike:
              "A .gitignore that covers node_modules, .env, and editor droppings. No secrets, no build output, no .DS_Store anywhere in the history.",
          },
          {
            criterion: "The page works",
            weight: 15,
            looksLike:
              "Opens in a browser, valid HTML, no console errors. Craft beyond that is not marked this week.",
          },
        ],
      },
      ifStuck:
        "If someone commits everything in one go, do not just correct it. Have them git reset the lot and redo it in pieces — the muscle memory is the lesson.",
    },
    {
      id: "cx101-w2-s1",
      week: 2,
      title: "Branching, merging, and conflicts you resolve by hand",
      toolFocus: ["Git"],
      dependsOn: ["cx101-w1-s2"],
      objectives: [
        "Explain a branch as a moving pointer to a commit",
        "Create, switch, and merge branches without a graphical tool",
        "Resolve a merge conflict by reading it, not by picking a side at random",
      ],
      demo: [
        "git log --graph --oneline --all as the picture everything else refers to",
        "Two branches editing the same lines, merged, conflict opened in the editor",
        "Reading the conflict markers: ours, theirs, and why both may be wrong",
        "git merge --abort as the escape hatch nobody tells beginners about",
      ],
      practice: [
        "Manufacture a conflict on purpose with a partner and resolve it together",
        "Do it a second time, this time aborting and starting over",
      ],
      ifStuck:
        "Conflict panic is the common failure. Remind them --abort always returns them to safety, then walk the markers slowly.",
    },
    {
      id: "cx101-w2-s2",
      week: 2,
      title: "Remotes, GitHub, and the pull request",
      toolFocus: ["Git", "GitHub", "SSH keys"],
      dependsOn: ["cx101-w2-s1"],
      objectives: [
        "Distinguish fetch, pull, and push, and say what each touches",
        "Open a pull request that a reviewer can read without asking questions",
        "Leave a review comment that is specific, kind, and actionable",
      ],
      demo: [
        "Generating an SSH key and adding it to GitHub, once, properly",
        "git remote -v, then push -u, and what the upstream tracking branch is for",
        "A pull request with a bad description and one with a good one",
        "Reviewing live: leaving three comments on a volunteer's branch",
      ],
      practice: [
        "Push last week's repository to GitHub and open a PR on a small change",
        "Review a classmate's PR and leave at least two substantive comments",
      ],
      assignment: {
        id: "cx101-a2",
        title: "Your first real pull request",
        brief:
          "We have a shared class repository. Pick an open issue, branch from main, do the work, and open a pull request. Then review two of your classmates' pull requests. You are marked on your PR and on the quality of your reviews — reviewing well is half of what a junior engineer is paid for.",
        submitAs: "pull_request",
        dueOffsetDays: 6,
        aiPolicy: "unaided",
        rubric: [
          {
            criterion: "The branch is clean",
            weight: 25,
            looksLike:
              "Branched from an up-to-date main, named for the work, containing only commits relevant to this change.",
          },
          {
            criterion: "The description does the reviewer's work for them",
            weight: 25,
            looksLike:
              "States what changed, why, how it was tested, and what the reviewer should look at hardest. Links the issue.",
          },
          {
            criterion: "Reviews given are substantive",
            weight: 30,
            looksLike:
              "Comments point at specific lines and explain a consequence. 'Looks good' scores nothing. Asking a genuine question scores full marks.",
          },
          {
            criterion: "Feedback received is acted on",
            weight: 20,
            looksLike:
              "Responds to every comment, pushes follow-up commits, and does not force-push over a review in progress.",
          },
        ],
      },
    },
    {
      id: "cx101-w3-s1",
      week: 3,
      title: "Undoing things: the safety net in full",
      toolFocus: ["Git"],
      dependsOn: ["cx101-w2-s2"],
      objectives: [
        "Choose correctly between amend, reset, revert, and restore",
        "Recover a commit that appears to be lost, using the reflog",
        "Find the commit that introduced a bug with git bisect",
        "State the one rule about rewriting history that has been pushed",
      ],
      demo: [
        "Four ways to undo, on the same repository, with the log shown after each",
        "reset --soft, --mixed, and --hard, and exactly what each one moves",
        "Deleting a branch with unmerged work, then recovering it from the reflog",
        "git bisect run on a repository with a planted bug, found in four steps",
      ],
      practice: [
        "Work through the recovery drill sheet: five ways to lose work, five recoveries",
      ],
      assignment: {
        id: "cx101-a3",
        title: "The recovery drill",
        brief:
          "Break your own repository five different ways — a bad amend, a hard reset over good work, a deleted branch, a botched merge, a commit of a secret you must now remove. Recover from each one. Hand in a written log: what you did, what the repository looked like, the exact commands that got you back, and what you would tell someone who did this by accident at 2am.",
        submitAs: "writeup",
        dueOffsetDays: 5,
        aiPolicy: "unaided",
        rubric: [
          {
            criterion: "All five recoveries are genuine",
            weight: 40,
            looksLike:
              "Commands shown are the ones actually run, with real output. A recovery that quietly starts a fresh repository is not a recovery.",
          },
          {
            criterion: "The mental model is right",
            weight: 30,
            looksLike:
              "Explains what moved and what did not — HEAD, the branch pointer, the index, the working tree. Names the state, not just the command.",
          },
          {
            criterion: "The secret is properly removed",
            weight: 20,
            looksLike:
              "Understands that a commit is still reachable after a revert, and rotates the credential regardless. Rotating the secret scores higher than any history rewrite.",
          },
          {
            criterion: "Written for a person in a panic",
            weight: 10,
            looksLike:
              "Short, ordered, scannable. Someone could follow it while distressed at 2am.",
          },
        ],
      },
      ifStuck:
        "The reflog is the thing that converts fear into confidence. If a learner takes only one command out of week 3, make it `git reflog`.",
    },
    {
      id: "cx101-w3-s2",
      week: 3,
      title: "How the modern web actually renders",
      dependsOn: ["cx101-w1-s1"],
      objectives: [
        "Trace a page load from URL to painted pixels",
        "Say, for any given line of code, whether it runs on the server or the browser",
        "Explain why that boundary decides most architectural questions later",
      ],
      demo: [
        "The network tab on a real page load, request by request",
        "The same page rendered server-side and client-side, compared on a throttled connection",
        "Where JavaScript actually runs, and what the browser does while it waits",
      ],
      practice: [
        "Profile a site you use daily and write down where its time goes",
      ],
    },
    {
      id: "cx101-w4-s1",
      week: 4,
      title: "TypeScript for people who write JavaScript",
      dependsOn: ["cx101-w1-s1"],
      objectives: [
        "Read a type error and locate the actual mismatch",
        "Type a function's inputs and outputs without reaching for any",
        "Narrow a union, and explain why the compiler now agrees",
      ],
      demo: [
        "Types as documentation the compiler checks, on a function with three callers",
        "Structural typing shown by example: two unrelated types that satisfy each other",
        "A long type error read from the bottom up, where the real cause usually is",
      ],
      practice: [
        "Add types to an untyped file until tsc passes with no any",
      ],
    },
    {
      id: "cx101-w4-s2",
      week: 4,
      title: "Working inside a team's workflow — and the first AI lab",
      toolFocus: ["GitHub Actions", "Conventional commits", "Claude"],
      dependsOn: ["cx101-w2-s2", "cx101-w3-s1", "cx101-w4-s1"],
      objectives: [
        "Read a failing CI run and fix the cause rather than the symptom",
        "Specify a change precisely enough that a model produces code worth reviewing",
        "Review generated code against the same checklist used on a human's PR",
        "State what they gave up by not writing it themselves, honestly",
      ],
      demo: [
        "A protected main branch, a required check, and a PR blocked until it passes",
        "The same task prompted three ways — vague, instructional, and specified — with all three outputs on screen and read aloud",
        "Reviewing the best of the three: the boundary condition it missed, the dependency nobody asked for, the error path it invented",
        "The system prompt behind our own study assistant, and how one paragraph changes its behaviour",
      ],
      practice: [
        "Take the week 2 pull request and re-specify it as a brief for a model",
        "Review what comes back against the PR checklist, in writing",
      ],
      assignment: {
        id: "cx101-a4",
        title: "Three prompts, one problem",
        brief:
          "Take a small feature you have already built by hand this term. Write three prompts for it: a vague one, a step-by-step instructional one, and a specification that states the goal, the constraints, the interfaces it must fit, and the definition of done. Run all three. Hand in the prompts, the three outputs, and a written comparison: what each one got right, what each got wrong, and which failure would have reached production unnoticed. Then say which parts of your specification did the actual work — and prove it by removing one constraint and running it again.",
        submitAs: "writeup",
        dueOffsetDays: 7,
        aiPolicy: "ai_required",
        rubric: [
          {
            criterion: "The three prompts genuinely differ in kind",
            weight: 20,
            looksLike:
              "Not the same prompt at three lengths. The specification states constraints and a definition of done that the instructional one does not.",
          },
          {
            criterion: "The comparison finds real defects",
            weight: 35,
            looksLike:
              "Names specific defects in the output: an unhandled boundary, a wrong assumption about the data, an invented API, a silent behaviour change. 'It was better' scores nothing.",
          },
          {
            criterion: "Identifies which failure would survive review",
            weight: 25,
            looksLike:
              "Distinguishes an obvious failure from a plausible-looking one, and explains why the plausible one is the dangerous one.",
          },
          {
            criterion: "The ablation is honest",
            weight: 20,
            looksLike:
              "One constraint removed, the run repeated, the difference reported — including the case where removing it changed nothing. A negative result reported honestly scores full marks.",
          },
        ],
      },
      ifStuck:
        "The failure mode here is a learner who is delighted by the output and cannot criticise it. Send them back to their own hand-written version and ask which one they would rather maintain in a year.",
    },
    // --- Weeks 5 to 7: "React, properly" --------------------------------
    {
      id: "cx101-w5-s1",
      week: 5,
      title: "Components, props, and the rendering model",
      dependsOn: ["cx101-w4-s1"],
      objectives: [
        "Predict when a component re-renders, and say what that costs",
        "Split a screen into components along data boundaries, not visual ones",
        "Explain why lifting state up is usually the fix before reaching for a store",
      ],
      demo: [
        "One screen decomposed three ways, with the trade-off named each time",
        "The profiler on a list that re-renders every row for one changed item",
        "The same list fixed by moving state down rather than by memoising",
      ],
      practice: [
        "Decompose a Figma screen on paper before writing a line of JSX",
      ],
      ifStuck:
        "Premature memoisation is the tell. Ask them to prove the render is slow before optimising it.",
    },
    {
      id: "cx101-w5-s2",
      week: 5,
      title: "State: local, lifted, and shared",
      dependsOn: ["cx101-w5-s1"],
      objectives: [
        "Choose between useState, useReducer, and context for a given problem",
        "Derive values during render instead of storing them in a second state",
        "Name the state that does not belong in React at all",
      ],
      demo: [
        "A bug caused by two states that must agree, fixed by deriving one",
        "useReducer on a form with interdependent fields",
        "Context used well, then the same context causing a whole tree to re-render",
      ],
      practice: [
        "Find and remove every piece of redundant state in a supplied component",
      ],
    },
    {
      id: "cx101-w6-s1",
      week: 6,
      title: "Effects, and the lifecycle you no longer have",
      dependsOn: ["cx101-w5-s2"],
      objectives: [
        "Say why a given effect is or is not necessary",
        "Write cleanup that actually runs, and prove it",
        "Recognise the effect that should have been an event handler",
      ],
      demo: [
        "Four effects from real code, three of which should not exist",
        "A subscription leaking because cleanup was forgotten, shown in the profiler",
        "A race between two fetches, and the abort that fixes it",
      ],
      practice: [
        "Delete every unnecessary effect from a supplied component and keep it working",
      ],
      ifStuck:
        "The question that unlocks it: what event caused this? If there is an event, it is a handler, not an effect.",
    },
    {
      id: "cx101-w6-s2",
      week: 6,
      title: "Forms, validation, and inputs that everyone can use",
      toolFocus: ["Zod", "Testing Library"],
      dependsOn: ["cx101-w6-s1"],
      objectives: [
        "Build a form that works with a keyboard alone",
        "Validate on the client and the server, and say why both are required",
        "Announce an error to a screen reader, not only to a sighted user",
      ],
      demo: [
        "A form navigated entirely by keyboard, then the same form with a screen reader",
        "Client validation bypassed with curl, and the server rejecting it anyway",
        "Labels, aria-describedby, and why placeholder text is not a label",
      ],
      practice: [
        "Take a form built with divs and rebuild it with real form elements",
      ],
      assignment: {
        id: "cx101-a5",
        title: "The form nobody can break",
        brief:
          "Build a booking form — name, email, date, a select, and a free-text note. It must validate on the client and on the server, survive being submitted with JavaScript disabled, and be completable using only a keyboard. Then try to break your own: submit it empty, submit it twice quickly, paste 10,000 characters into the note, and send a request straight to the endpoint with curl. Hand in the repository and a short note on what broke and what you did about it.",
        submitAs: "repo",
        dueOffsetDays: 7,
        aiPolicy: "unaided",
        rubric: [
          {
            criterion: "Validation exists on both sides",
            weight: 30,
            looksLike:
              "The server rejects bad input independently of the client. A curl request with missing fields returns an error, not a 500.",
          },
          {
            criterion: "Usable by keyboard and screen reader",
            weight: 30,
            looksLike:
              "Every control reachable by Tab in a sensible order, visible focus, real labels, and errors associated with their inputs so they are announced.",
          },
          {
            criterion: "Handles the awkward cases",
            weight: 25,
            looksLike:
              "Double submission does not create two bookings. Oversized input is rejected rather than truncated silently. Errors do not lose what the user typed.",
          },
          {
            criterion: "The break-it note is honest",
            weight: 15,
            looksLike:
              "Reports what actually broke, including anything still broken at hand-in. A known unfixed bug, named, scores higher than a claim that nothing broke.",
          },
        ],
      },
    },
    {
      id: "cx101-w7-s1",
      week: 7,
      title: "Real data: loading, error, and empty",
      dependsOn: ["cx101-w6-s1"],
      objectives: [
        "Design the loading, error, and empty state before the happy path",
        "Handle a request that fails halfway, not only one that fails outright",
        "Explain what the user sees on a slow Nigerian mobile connection",
      ],
      demo: [
        "The same screen on a throttled connection, with and without a loading state",
        "An error boundary catching a render failure, and what it cannot catch",
        "Empty state as a design problem, not an afterthought",
      ],
      practice: [
        "Add all three states to a component that currently assumes success",
      ],
    },
    {
      id: "cx101-w7-s2",
      week: 7,
      title: "Testing a component the way a user meets it",
      toolFocus: ["Vitest", "Testing Library"],
      dependsOn: ["cx101-w7-s1"],
      objectives: [
        "Write a test that would fail if the feature broke, and pass otherwise",
        "Query by role and label rather than by test id",
        "Say what is not worth testing, and why",
      ],
      demo: [
        "A test that passes while the feature is broken, and why it was worthless",
        "The same behaviour tested through the accessible tree",
        "A test suite run in watch mode while a bug is introduced deliberately",
      ],
      practice: [
        "Write three tests for last week's form, one of which must catch a real bug",
      ],
    },
    // --- Weeks 8 to 10: "Next.js in production" -------------------------
    {
      id: "cx101-w8-s1",
      week: 8,
      title: "The App Router mental model",
      dependsOn: ["cx101-w3-s2", "cx101-w5-s1"],
      objectives: [
        "Say, for any file in the app directory, what it does and when it runs",
        "Explain the Server and Client Component boundary in their own words",
        "Read a layout, page, loading, and error file as one composed unit",
      ],
      demo: [
        "A route built up file by file: page, layout, loading, error, not-found",
        "Adding 'use client' to a component and watching the bundle change",
        "Streaming shown on a throttled connection, with the boundary moved twice",
      ],
      practice: [
        "Given a screen, mark on paper which parts must be client and which must not",
      ],
      ifStuck:
        "Back to week 3: where does this code run? Almost every App Router confusion collapses to that question.",
    },
    {
      id: "cx101-w8-s2",
      week: 8,
      title: "Moving the boundary in anger",
      dependsOn: ["cx101-w8-s1"],
      objectives: [
        "Move a component across the server/client boundary without breaking it",
        "Pass a server-fetched value into a client component correctly",
        "Measure the bundle before and after, and report the difference",
      ],
      demo: [
        "A page that ships 300kB of JavaScript, reduced by moving one boundary",
        "The serialisation error you get when you pass a function across, and the fix",
      ],
      practice: [
        "Halve the client bundle of a supplied page without changing what it does",
      ],
      assignment: {
        id: "cx101-a6",
        title: "Move the boundary",
        brief:
          "You are given a working Next.js page where everything is a Client Component. Keep the behaviour identical and move as much as you can to the server. Measure the client bundle before and after. Open it as a pull request against the class repository, with the two measurements in the description, and review one classmate's.",
        submitAs: "pull_request",
        dueOffsetDays: 6,
        aiPolicy: "unaided",
        rubric: [
          {
            criterion: "Behaviour is unchanged",
            weight: 30,
            looksLike:
              "Every interaction still works. The existing tests pass without being edited to accommodate the change.",
          },
          {
            criterion: "The boundary is in a defensible place",
            weight: 30,
            looksLike:
              "'use client' sits at the smallest component that genuinely needs it, not at the top of the tree. Each remaining client component can be justified in a sentence.",
          },
          {
            criterion: "The measurement is real",
            weight: 25,
            looksLike:
              "Before and after numbers from the build output, quoted with the command used. A number that cannot be reproduced scores nothing.",
          },
          {
            criterion: "The pull request stands on its own",
            weight: 15,
            looksLike:
              "A reviewer who has not read this brief understands what changed and why from the description alone.",
          },
        ],
      },
    },
    {
      id: "cx101-w9-s1",
      week: 9,
      title: "Data fetching, caching, and revalidation",
      dependsOn: ["cx101-w8-s2"],
      objectives: [
        "Fetch on the server and say exactly when the result is reused",
        "Invalidate a cache deliberately after a mutation",
        "Debug a page that is showing yesterday's data",
      ],
      demo: [
        "The same fetch cached and uncached, with the network tab open",
        "A stale page reproduced on purpose, then fixed with a revalidation",
        "Reading the build output to see which routes went static and which did not",
      ],
      practice: [
        "Break the cache on a supplied page, then explain the mechanism you used",
      ],
      ifStuck:
        "Caching bugs look like haunting. Have them state the expected lifetime of the data out loud before touching any code.",
    },
    {
      id: "cx101-w9-s2",
      week: 9,
      title: "Mutations that survive a real user",
      dependsOn: ["cx101-w9-s1", "cx101-w6-s2"],
      objectives: [
        "Write a server-side mutation that checks authorisation on every call",
        "Revalidate the right paths after a write, and no more than those",
        "Handle a mutation that fails after it has already changed something",
      ],
      demo: [
        "A mutation invoked directly with curl, bypassing the form entirely",
        "The same mutation with the authorisation check added, refusing the request",
        "A partial failure, and why the order of operations decides the damage",
      ],
      practice: [
        "Attack a classmate's mutation endpoint directly and report what you got through",
      ],
    },
    {
      id: "cx101-w10-s1",
      week: 10,
      title: "Authentication and protected routes",
      dependsOn: ["cx101-w9-s2"],
      objectives: [
        "Distinguish authentication from authorisation, with an example of each failing",
        "Protect a route on the server rather than by hiding a link",
        "Store a session safely and explain each cookie flag",
      ],
      demo: [
        "A 'protected' page reached by typing the URL, because the check was in the UI",
        "The same page protected server-side",
        "Cookie flags one at a time: httpOnly, secure, sameSite, and what each stops",
      ],
      practice: [
        "Find the unprotected route in a supplied application. There are two.",
      ],
    },
    {
      id: "cx101-w10-s2",
      week: 10,
      title: "Reviewing a feature you did not write",
      toolFocus: ["Claude"],
      dependsOn: ["cx101-w4-s2", "cx101-w10-s1"],
      objectives: [
        "Review generated code against the same checklist used on a colleague's PR",
        "Find the defect that looks plausible, not only the one that looks wrong",
        "Decide honestly when to fix generated code and when to discard it",
      ],
      demo: [
        "A generated feature reviewed live, line by line, with the checklist on screen",
        "Three planted defects: one obvious, one subtle, one that only appears under load",
        "The moment to throw it away and write it yourself, and how to recognise it",
      ],
      practice: [
        "Review a generated pull request as a room and agree a verdict",
      ],
      assignment: {
        id: "cx101-a7",
        title: "Review the machine's work",
        brief:
          "Specify a feature for your own project, have a model build it, then review it as though a colleague opened the pull request. Hand in the specification, the generated diff, your written review, and the final code you would actually merge. Your review must name at least one defect you would have missed a month ago, and you must say plainly if you ended up rewriting it from scratch. Declare exactly where the model's work survives in what you are handing in.",
        submitAs: "pull_request",
        dueOffsetDays: 7,
        aiPolicy: "ai_assisted",
        rubric: [
          {
            criterion: "The specification is genuinely a specification",
            weight: 20,
            looksLike:
              "States the goal, the constraints, the interfaces it must fit, and a definition of done. Not a step-by-step script for the model to follow.",
          },
          {
            criterion: "The review finds real defects",
            weight: 30,
            looksLike:
              "Specific lines, specific consequences. At least one defect that would have passed a casual read — an unhandled boundary, a wrong assumption, an invented API.",
          },
          {
            criterion: "The merged code is defensible",
            weight: 30,
            looksLike:
              "Every line is code the learner can explain and would maintain. No dependency they cannot justify. Discarding the generated work entirely, and saying so, scores full marks.",
          },
          {
            criterion: "The declaration is accurate",
            weight: 20,
            looksLike:
              "Says precisely where the model's output survives. An overstated contribution and an understated one are both marked down; the honesty is the skill.",
          },
        ],
      },
      ifStuck:
        "A learner who finds nothing wrong has not reviewed it. Send them back with one instruction: find three things, even if two are small.",
    },
    // --- Weeks 11 and 12: "Ship it" -------------------------------------
    {
      id: "cx101-w11-s1",
      week: 11,
      title: "Accessibility that survives a real audit",
      dependsOn: ["cx101-w6-s2"],
      objectives: [
        "Run an audit and separate the real findings from the noise",
        "Fix a keyboard trap, a contrast failure, and a missing name",
        "Explain why automated tools catch under half of what matters",
      ],
      demo: [
        "An audit on a real site, findings triaged live",
        "A site that scores 100 and is still unusable with a screen reader",
        "Navigating our own dashboard by keyboard, finding what we missed",
      ],
      practice: [
        "Audit your week 6 form and fix everything you find",
      ],
    },
    {
      id: "cx101-w11-s2",
      week: 11,
      title: "Performance budgets and Core Web Vitals",
      dependsOn: ["cx101-w8-s2"],
      objectives: [
        "Read a Lighthouse trace and name the single biggest cost",
        "Set a budget before optimising, and hold to it",
        "Explain what LCP, CLS, and INP mean to a user on a 3G connection",
      ],
      demo: [
        "A trace read top to bottom on a real page",
        "An image, a font, and a script — each fixed, each measured",
        "The optimisation that made the number better and the experience worse",
      ],
      practice: [
        "Set a budget for your capstone and record where you currently stand",
      ],
    },
    {
      id: "cx101-w12-s1",
      week: 12,
      title: "Deploying, monitoring, and the first bug report",
      toolFocus: ["Vercel", "GitHub Actions"],
      dependsOn: ["cx101-w4-s2", "cx101-w11-s2"],
      objectives: [
        "Deploy from a pull request and check the preview before merging",
        "Read a production error and trace it to a commit",
        "Roll back safely, then fix forward",
      ],
      demo: [
        "A deploy from a preview URL through to production",
        "A real error in production, traced through the log to the line",
        "A rollback, and the conversation you have with a user while it happens",
      ],
      practice: [
        "Deploy your capstone and file one bug report against a classmate's",
      ],
    },
    {
      id: "cx101-w12-s2",
      week: 12,
      title: "The capstone review",
      dependsOn: ["cx101-w12-s1", "cx101-w10-s2"],
      objectives: [
        "Present a project to an engineer who has not seen it",
        "Defend a technical decision, including one they would now make differently",
        "Take review feedback without either collapsing or arguing",
      ],
      demo: [
        "A mentor walking through a codebase cold, narrating what they look at first",
      ],
      practice: [
        "Present for ten minutes, then answer questions for ten",
      ],
      assignment: {
        id: "cx101-a8",
        title: "Capstone: something you would put your name on",
        brief:
          "A deployed application that solves a real problem for someone who is not you. It must have real data, authentication, at least one server-side mutation, and tests that would catch a regression. The history is marked alongside the code: we will read your commit log and your pull requests. Include a README a stranger could set it up from, and a short honest section on what you used AI for and what you deliberately wrote yourself.",
        submitAs: "url",
        dueOffsetDays: 14,
        aiPolicy: "ai_assisted",
        rubric: [
          {
            criterion: "It works, deployed, for a stranger",
            weight: 25,
            looksLike:
              "A mentor can use it from the URL with no help, on a phone, without hitting an error.",
          },
          {
            criterion: "The code is defensible line by line",
            weight: 25,
            looksLike:
              "The learner can explain any part of it under questioning, including the parts a model wrote. Not knowing what your own code does is the one failing grade here.",
          },
          {
            criterion: "The history reads like a professional's",
            weight: 20,
            looksLike:
              "Atomic commits, meaningful messages, work done on branches and merged through pull requests. Everything from weeks 1 to 3, sustained over twelve weeks.",
          },
          {
            criterion: "It is safe to put in front of users",
            weight: 20,
            looksLike:
              "Authorisation checked server-side, input validated, no secrets in the repository, errors handled rather than displayed raw.",
          },
          {
            criterion: "The AI account is honest",
            weight: 10,
            looksLike:
              "Specific about what was generated and what was hand-written. A learner who used a lot and says so scores above one who used a lot and does not.",
          },
        ],
      },
      ifStuck:
        "If someone cannot explain their own code in the review, that is the finding. Send them back for a week rather than passing it.",
    },
  ],
};