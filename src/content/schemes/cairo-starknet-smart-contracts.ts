import type { Scheme } from "../scheme";

// ---------------------------------------------------------------------------
// CX-301 — Cairo & Starknet Smart Contract Development
//
// Ten weeks, and the only course here where a mistake is unrecoverable. A
// deployed contract holding other people's money cannot be patched on Monday
// morning, so the discipline is different: testing comes before the interesting
// features, and the vulnerability catalogue is taught as a working checklist
// rather than a war-stories lecture.
//
// AI arrives late, in week 10, and in one narrow role: a second reader on an
// audit whose every claim must be independently verified. A model that
// hallucinates a vulnerability wastes a day; one that misses a real one costs a
// treasury. Learners must have found bugs unaided before they are allowed to
// let a model look.
// ---------------------------------------------------------------------------

export const cx301: Scheme = {
  courseSlug: "cairo-starknet-smart-contracts",
  sessionsPerWeek: 2,
  sessions: [
    {
      id: "cx301-w1-s1",
      week: 1,
      title: "Why Cairo exists: provable computation",
      objectives: [
        "Explain what a validity proof proves, and to whom",
        "Say why this changes what code is expensive to run",
        "Describe the path from a transaction to Ethereum finality",
      ],
      demo: [
        "A transaction followed from submission through the sequencer to L1",
        "The cost model compared with the EVM, with the differences named",
      ],
      practice: [
        "Trace a real mainnet transaction and narrate each stage",
      ],
    },
    {
      id: "cx301-w1-s2",
      week: 1,
      title: "The toolchain, working, on your machine",
      toolFocus: ["Scarb", "Starknet Foundry", "asdf"],
      dependsOn: ["cx301-w1-s1"],
      objectives: [
        "Install and pin a toolchain version, reproducibly",
        "Build, test, and declare a trivial contract",
        "Read a Cairo compiler error without panicking",
      ],
      demo: [
        "A project from scarb new through to a passing test",
        "Two toolchain versions on one machine, and how they are kept apart",
        "Three compiler errors read slowly, from the bottom up",
      ],
      practice: [
        "Get a hello-world contract compiling and tested on your own laptop",
      ],
      ifStuck:
        "Almost always a version mismatch between scarb and the Foundry release. Have them paste both versions before anything else.",
    },
    {
      id: "cx301-w2-s1",
      week: 2,
      title: "Ownership, felts, and the type system",
      dependsOn: ["cx301-w1-s2"],
      objectives: [
        "Explain what a felt is and where its arithmetic will surprise them",
        "Satisfy the ownership rules without cloning everything",
        "Choose the right integer type for a value, deliberately",
      ],
      demo: [
        "felt252 arithmetic wrapping, shown live, with the value that causes it",
        "A borrow checker error read and fixed three different ways",
        "u256 versus felt252 for a token balance, and why the choice matters",
      ],
      practice: [
        "Port a small piece of logic from a language you know into Cairo",
      ],
    },
    {
      id: "cx301-w2-s2",
      week: 2,
      title: "Traits, generics, and the shape of Cairo code",
      dependsOn: ["cx301-w2-s1"],
      objectives: [
        "Define and implement a trait",
        "Read the standard library's source rather than guessing at it",
        "Structure a module so the compiler helps rather than obstructs",
      ],
      demo: [
        "A trait defined, implemented twice, and dispatched",
        "Reading corelib source live to answer a question nobody could answer from docs",
      ],
      practice: [
        "Implement a small generic data structure with a full test suite",
      ],
      assignment: {
        id: "cx301-a1",
        title: "Cairo without a contract in sight",
        brief:
          "Implement a non-trivial library in pure Cairo — a fixed-point arithmetic type, a sorted structure, a merkle proof verifier, your choice. No storage, no contract, just the language. Full test coverage including the edge cases you can articulate. In the README, list every place where felt arithmetic could bite and say what you did about each one.",
        submitAs: "repo",
        dueOffsetDays: 7,
        aiPolicy: "unaided",
        rubric: [
          {
            criterion: "The language is used idiomatically",
            weight: 30,
            looksLike:
              "Ownership respected without gratuitous cloning. Types chosen for reasons. Traits where a trait belongs.",
          },
          {
            criterion: "Edge cases are found and tested",
            weight: 30,
            looksLike:
              "Zero, one, maximum, overflow, and empty are all tested. Each test would fail if the behaviour changed.",
          },
          {
            criterion: "Arithmetic hazards are named",
            weight: 25,
            looksLike:
              "The README lists real hazards specific to this code, not a generic warning about overflow copied from a tutorial.",
          },
          {
            criterion: "It compiles clean and reproducibly",
            weight: 15,
            looksLike:
              "Pinned toolchain, no warnings, tests pass from a fresh clone.",
          },
        ],
      },
    },
    {
      id: "cx301-w3-s1",
      week: 3,
      title: "Storage, events, and contract structure",
      dependsOn: ["cx301-w2-s2"],
      objectives: [
        "Lay out contract storage and say what each slot costs",
        "Emit events an indexer can actually consume",
        "Separate the interface from the implementation",
      ],
      demo: [
        "Storage written and read, with the cost of each operation shown",
        "A Map in storage, and the address derivation behind it",
        "An event designed badly, then redesigned for the consumer",
      ],
      practice: [
        "Write a contract that stores and updates one thing, with events",
      ],
    },
    {
      id: "cx301-w3-s2",
      week: 3,
      title: "Interfaces, dispatchers, and calling other contracts",
      dependsOn: ["cx301-w3-s1"],
      objectives: [
        "Call another contract safely through a dispatcher",
        "Distinguish a library call from a contract call, and their risks",
        "Handle a call to a contract that reverts",
      ],
      demo: [
        "Two contracts wired together, then one made hostile",
        "A library call executing in the caller's storage context, shown live",
      ],
      practice: [
        "Wire two of your own contracts together and make one misbehave",
      ],
      ifStuck:
        "The library-call storage context is the thing that catches everyone. Draw it on the board rather than describing it.",
    },
    {
      id: "cx301-w4-s1",
      week: 4,
      title: "Starknet Foundry from zero",
      toolFocus: ["Starknet Foundry", "snforge"],
      dependsOn: ["cx301-w3-s2"],
      objectives: [
        "Write unit and integration tests against a deployed contract",
        "Cheat time, caller, and state to reach a branch",
        "Assert on events and on reverts, not only on return values",
      ],
      demo: [
        "A contract tested from an empty file up to full coverage",
        "start_cheat_caller_address used to test an access control path",
        "A test that passes while the contract is broken, and why",
      ],
      practice: [
        "Test one of your week 3 contracts to the point where you trust it",
      ],
    },
    {
      id: "cx301-w4-s2",
      week: 4,
      title: "Fuzzing and thinking in invariants",
      dependsOn: ["cx301-w4-s1"],
      objectives: [
        "State an invariant that must hold for all inputs",
        "Write a fuzz test that would find a violation",
        "Read a failing fuzz case and shrink it to the minimal reproduction",
      ],
      demo: [
        "An invariant stated in English, then in code, then violated by the fuzzer",
        "A shrunk counterexample explained",
      ],
      practice: [
        "State three invariants for your own contract and fuzz all three",
      ],
      assignment: {
        id: "cx301-a2",
        title: "A test suite you would stake money on",
        brief:
          "Take a supplied contract of about two hundred lines with three planted bugs. Find all three with tests alone — do not read the code looking for them first, write the suite you would write for an unfamiliar contract and let it catch them. Hand in the suite, the three failing tests that expose the bugs, and a note on which bug your first instinct missed and why.",
        submitAs: "repo",
        dueOffsetDays: 7,
        aiPolicy: "unaided",
        rubric: [
          {
            criterion: "All three bugs are caught by a test",
            weight: 35,
            looksLike:
              "Each has a named test that fails on the broken contract and passes on the fixed one.",
          },
          {
            criterion: "The suite is what you would write blind",
            weight: 25,
            looksLike:
              "Covers the whole surface, not only the three paths. Access control, reverts, and events are all asserted.",
          },
          {
            criterion: "Invariants are stated, not implied",
            weight: 25,
            looksLike:
              "At least two properties fuzzed, each expressing something that must be true for every input.",
          },
          {
            criterion: "The reflection is honest",
            weight: 15,
            looksLike:
              "Names the bug they nearly missed and what would have caught it sooner. 'I found them all easily' scores nothing.",
          },
        ],
      },
    },
    {
      id: "cx301-w5-s1",
      week: 5,
      title: "The vulnerability catalogue, part one",
      dependsOn: ["cx301-w4-s2"],
      objectives: [
        "Recognise reentrancy, access control failures, and unchecked returns in Cairo",
        "Explain how each class differs from its EVM equivalent",
        "Apply checks-effects-interactions without being told to",
      ],
      demo: [
        "A reentrancy drain executed live against a contract in the room",
        "The same contract fixed by ordering alone, no guard added",
        "An access control check that is present and still wrong",
      ],
      practice: [
        "Exploit three supplied contracts, one per class",
      ],
    },
    {
      id: "cx301-w5-s2",
      week: 5,
      title: "The vulnerability catalogue, part two",
      dependsOn: ["cx301-w5-s1"],
      objectives: [
        "Recognise oracle manipulation, rounding exploits, and front-running",
        "Reason about what a sequencer can see and do",
        "Say which of these classes a test suite will never catch",
      ],
      demo: [
        "A price oracle manipulated within one transaction",
        "Rounding in the protocol's favour and against it, and the drain that follows",
        "The mempool, and what ordering lets an adversary do",
      ],
      practice: [
        "Find the rounding error in a supplied lending contract",
      ],
      assignment: {
        id: "cx301-a3",
        title: "Break four contracts",
        brief:
          "Four contracts, each with at least one exploitable flaw. For each: write the exploit as a passing test that drains or corrupts it, classify the vulnerability, state the loss in concrete terms, and propose the minimal fix. Then apply your fixes and prove the exploits fail. One of the four has two flaws; finding only one is a partial mark.",
        submitAs: "repo",
        dueOffsetDays: 7,
        aiPolicy: "unaided",
        rubric: [
          {
            criterion: "Exploits are executable",
            weight: 35,
            looksLike:
              "Each is a test that passes against the vulnerable contract, demonstrating the loss. A described exploit that does not run scores nothing.",
          },
          {
            criterion: "Classification is correct",
            weight: 20,
            looksLike:
              "Named accurately, with the mechanism explained rather than the label asserted.",
          },
          {
            criterion: "Fixes are minimal and complete",
            weight: 30,
            looksLike:
              "The smallest change that closes the hole without breaking intended behaviour. Every exploit test now fails; every functional test still passes.",
          },
          {
            criterion: "The second flaw is found",
            weight: 15,
            looksLike:
              "Both flaws in the contract that has two. Stopping at the first one found is the failure this criterion exists to catch.",
          },
        ],
      },
      ifStuck:
        "A learner who stops at the first bug in a contract has learned the wrong habit. Say out loud, every week: there is usually another one.",
    },
    {
      id: "cx301-w6-s1",
      week: 6,
      title: "Gas, fees, and what execution costs",
      dependsOn: ["cx301-w3-s1"],
      objectives: [
        "Predict which operations dominate a transaction's cost",
        "Reduce a contract's cost without making it unreadable",
        "Explain the fee model to a non-technical founder",
      ],
      demo: [
        "One function profiled and optimised in three passes, measured each time",
        "An optimisation that saved gas and introduced a bug",
      ],
      practice: [
        "Halve the cost of a supplied function without changing its behaviour",
      ],
    },
    {
      id: "cx301-w6-s2",
      week: 6,
      title: "Account abstraction and what a wallet really is",
      dependsOn: ["cx301-w6-s1"],
      objectives: [
        "Explain why every Starknet account is a contract",
        "Describe the validate and execute split and why it exists",
        "Say what a session key or paymaster changes for a product",
      ],
      demo: [
        "An account contract read line by line",
        "A custom validation scheme, and the restrictions the protocol imposes on it",
      ],
      practice: [
        "Sketch the account design for a product that must not show a seed phrase",
      ],
    },
    {
      id: "cx301-w7-s1",
      week: 7,
      title: "Tokens and standards",
      dependsOn: ["cx301-w5-s2"],
      objectives: [
        "Implement a standard from its specification rather than by copying",
        "Say where a standard is silent and what that leaves to the implementer",
        "Recognise a non-compliant token and the integration bugs it causes",
      ],
      demo: [
        "A token implemented against the spec, with the ambiguous parts flagged",
        "A fee-on-transfer token breaking a protocol that assumed it would not",
      ],
      practice: [
        "Implement a token and integrate against a classmate's",
      ],
    },
    {
      id: "cx301-w7-s2",
      week: 7,
      title: "Components, and code you can reuse safely",
      dependsOn: ["cx301-w7-s1"],
      objectives: [
        "Use the component pattern to share behaviour between contracts",
        "Audit a third-party component before depending on it",
        "Pin a dependency and justify the version",
      ],
      demo: [
        "A component embedded, and the storage it silently claims",
        "Reading an audited library's source to check it does what its README says",
      ],
      practice: [
        "Refactor two of your contracts to share one component",
      ],
      assignment: {
        id: "cx301-a4",
        title: "A protocol with more than one contract in it",
        brief:
          "Build something with at least three interacting contracts — a vault, a staking system, a simple AMM, your choice. It must use a standard token, share behaviour through a component, and hold value that an adversary would want. Include the test suite, the invariants you fuzz, and a threat model: who attacks this, with what, and what stops them.",
        submitAs: "repo",
        dueOffsetDays: 10,
        aiPolicy: "unaided",
        rubric: [
          {
            criterion: "The contracts compose safely",
            weight: 30,
            looksLike:
              "Every cross-contract call considers a hostile callee. Checks-effects-interactions holds throughout without being pointed out.",
          },
          {
            criterion: "The threat model is specific",
            weight: 25,
            looksLike:
              "Named adversaries with named capabilities. 'A hacker could steal funds' scores nothing; 'a sequencer can reorder these two calls, so we do X' scores full marks.",
          },
          {
            criterion: "Invariants hold under fuzzing",
            weight: 25,
            looksLike:
              "At least three protocol-level properties fuzzed, including one about total value that must never decrease unexpectedly.",
          },
          {
            criterion: "Dependencies are justified",
            weight: 20,
            looksLike:
              "Every external component is pinned, and the learner can say what it does and why they trust it.",
          },
        ],
      },
    },
    {
      id: "cx301-w8-s1",
      week: 8,
      title: "Upgradeability without foot-guns",
      dependsOn: ["cx301-w7-s2"],
      objectives: [
        "Implement an upgrade path and say who may trigger it",
        "Avoid a storage collision across an upgrade, and detect one",
        "Argue both sides of whether a contract should be upgradeable at all",
      ],
      demo: [
        "An upgrade performed, then a second upgrade that corrupts storage",
        "The same upgrade done safely, with the layout checked first",
        "An upgrade key held by one address, and what that means for trust",
      ],
      practice: [
        "Upgrade your week 7 protocol without losing a single stored value",
      ],
    },
    {
      id: "cx301-w8-s2",
      week: 8,
      title: "Keys, multisig, and who can actually do damage",
      dependsOn: ["cx301-w8-s1"],
      objectives: [
        "Enumerate every privileged action in a protocol and who holds it",
        "Design a timelock that a user could actually escape through",
        "Explain the operational failure that loses a treasury without any bug",
      ],
      demo: [
        "A protocol's admin surface enumerated on the board, exhaustively",
        "A timelock with an escape hatch that defeats its own purpose",
      ],
      practice: [
        "List every privileged function in your protocol and who can call it",
      ],
    },
    {
      id: "cx301-w9-s1",
      week: 9,
      title: "Wiring a frontend with starknet.js",
      toolFocus: ["starknet.js", "TypeScript"],
      dependsOn: ["cx301-w6-s2"],
      objectives: [
        "Connect a wallet and send a transaction from a browser",
        "Show a user what they are signing, honestly",
        "Handle a transaction that is pending, reverted, or lost",
      ],
      demo: [
        "A wallet connected, a transaction sent, and the three states that follow",
        "A signature request a user cannot understand, and the same one made legible",
      ],
      practice: [
        "Put a working interface in front of your week 7 protocol",
      ],
    },
    {
      id: "cx301-w9-s2",
      week: 9,
      title: "Indexing, and reading chain state at speed",
      dependsOn: ["cx301-w9-s1", "cx301-w3-s1"],
      objectives: [
        "Index events into a queryable store",
        "Handle a reorganisation without corrupting the index",
        "Say what must be read from chain and what may be read from the index",
      ],
      demo: [
        "An indexer built from events, then broken by a reorg",
        "A balance read from the index and from chain, disagreeing",
      ],
      practice: [
        "Index your own protocol's events and query them",
      ],
    },
    {
      id: "cx301-w10-s1",
      week: 10,
      title: "Auditing, with a model as a second reader",
      toolFocus: ["Claude"],
      dependsOn: ["cx301-w5-s2", "cx301-w8-s2"],
      objectives: [
        "Run a structured manual audit before any tool is used",
        "Use a model to widen the search, then verify every claim independently",
        "Distinguish a hallucinated finding from a real one, with evidence",
      ],
      demo: [
        "A contract audited manually on screen, findings listed",
        "The same contract given to a model: what it caught that we missed, what it invented, and what it confidently mis-explained",
        "A plausible-sounding false positive investigated to the point of disproof",
      ],
      practice: [
        "Audit a contract unaided for forty minutes, then let a model look and reconcile the two lists",
      ],
      ifStuck:
        "The failure here is deference. If a learner reports a model's finding without a test proving it, that finding does not exist.",
    },
    {
      id: "cx301-w10-s2",
      week: 10,
      title: "The capstone audit review",
      dependsOn: ["cx301-w10-s1"],
      objectives: [
        "Defend a protocol's design against an adversarial reader",
        "State plainly what they would not yet deploy with real money",
        "Take a finding on their own work without arguing it away",
      ],
      demo: [
        "A mentor auditing an unfamiliar protocol cold, narrating the order they read in",
      ],
      practice: [
        "Present your protocol, then defend it against the room for twenty minutes",
      ],
      assignment: {
        id: "cx301-a5",
        title: "Capstone: audit a protocol you did not write",
        brief:
          "You are assigned a classmate's week 7 protocol. Audit it properly: a structured manual pass first, then a model as a second reader, then verification of everything either of you found. Deliver a real audit report — scope, methodology, findings by severity with a proof-of-concept test for each, and recommendations. A separate section must state which findings came from the model, which of those survived verification, and which were hallucinated. A report with no findings is acceptable only if you can convince the room the protocol is genuinely clean.",
        submitAs: "writeup",
        dueOffsetDays: 14,
        aiPolicy: "ai_required",
        rubric: [
          {
            criterion: "Every finding has a proof of concept",
            weight: 30,
            looksLike:
              "A test that demonstrates the issue against the unmodified contract. A finding without one is not reported, or is reported explicitly as unverified.",
          },
          {
            criterion: "Severity is argued, not asserted",
            weight: 20,
            looksLike:
              "Each severity justified by impact and likelihood in concrete terms. Inflating a low finding to critical is marked down as hard as missing one.",
          },
          {
            criterion: "The manual pass stands on its own",
            weight: 20,
            looksLike:
              "Findings from the unaided pass are recorded before the model was used, with a timestamp in the commit history proving the order.",
          },
          {
            criterion: "The model's contribution is accounted for honestly",
            weight: 20,
            looksLike:
              "Names what it caught, what it invented, and what it explained wrongly. A learner who reports the model's false positives scores above one who quietly drops them.",
          },
          {
            criterion: "It reads like a professional audit",
            weight: 10,
            looksLike:
              "Scoped, structured, unsensational, and something the author of the code could act on without feeling attacked.",
          },
        ],
      },
    },
  ],
};
