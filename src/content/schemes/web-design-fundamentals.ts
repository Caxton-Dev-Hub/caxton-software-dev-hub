import type { Scheme } from "../scheme";

// ---------------------------------------------------------------------------
// CX-110 — Web Design Fundamentals: Figma to Production
//
// Eight weeks, self-paced with a mentor, and the only course here aimed at
// people who may never call themselves engineers. It still teaches version
// control, in week 6, for one reason: a designer who can open a pull request
// against the real site is worth several times one who emails a PNG. That is
// the whole argument for putting them in the terminal at all, and it is worth
// making to them explicitly.
//
// The first three weeks are deliberately unglamorous. Learners arrive wanting
// to open Figma; they are asked to look at things and say why they fail. The
// eye is the thing that transfers, and the tool changes every three years.
//
// AI arrives in week 8, applied to the part of this work it is genuinely good
// at — generating variations to react to — and explicitly not to the taste
// required to choose between them.
// ---------------------------------------------------------------------------

export const cx110: Scheme = {
  courseSlug: "web-design-fundamentals",
  sessionsPerWeek: 2,
  sessions: [
    {
      id: "cx110-w1-s1",
      week: 1,
      title: "Hierarchy, contrast, and why layouts fail",
      objectives: [
        "Say, in one sentence, what a layout wants the eye to do first",
        "Diagnose a failing layout as a hierarchy problem rather than a taste problem",
        "Use size, weight, and space to rank information deliberately",
      ],
      demo: [
        "Five real Nigerian websites, ranked worst to best, with reasons stated aloud",
        "One bad layout fixed live using only size and spacing — no colour, no new elements",
        "The squint test, done in the room, on work the learners chose",
      ],
      practice: [
        "Collect three interfaces you find confusing and write one sentence on why each fails",
      ],
      ifStuck:
        "Learners describe what they dislike rather than what fails. Push them: what did your eye do first, and what should it have done?",
    },
    {
      id: "cx110-w1-s2",
      week: 1,
      title: "Space, alignment, and the grid underneath",
      dependsOn: ["cx110-w1-s1"],
      objectives: [
        "Use a spacing scale rather than choosing numbers by feel",
        "Align elements to a grid and see the difference when they do not",
        "Explain why whitespace is the cheapest improvement available",
      ],
      demo: [
        "A cramped layout given air, one step at a time, with nothing else changed",
        "Arbitrary spacing versus a scale, on the same design, side by side",
      ],
      practice: [
        "Redraw a supplied layout on an 8-point grid, by hand, on paper",
      ],
    },
    {
      id: "cx110-w2-s1",
      week: 2,
      title: "Typography as a system",
      dependsOn: ["cx110-w1-s2"],
      objectives: [
        "Build a type scale and apply it consistently across a page",
        "Set line length and line height for readability, not for looks",
        "Pair two typefaces, or justify using one",
      ],
      demo: [
        "The same paragraph at four line heights and three measures, read aloud",
        "A type scale built from a ratio, then applied to a full page",
        "Three font pairings: one good, one lazy, one actively fighting itself",
      ],
      practice: [
        "Set a long article using one typeface and your own scale",
      ],
    },
    {
      id: "cx110-w2-s2",
      week: 2,
      title: "Words are the interface",
      dependsOn: ["cx110-w2-s1"],
      objectives: [
        "Write button and error text that tells a user what will happen",
        "Cut a paragraph of interface copy in half without losing meaning",
        "Recognise copy that hides a design problem",
      ],
      demo: [
        "Six real error messages rewritten live",
        "A confusing screen fixed by changing only the words",
      ],
      practice: [
        "Rewrite every piece of text in a supplied screen",
      ],
      assignment: {
        id: "cx110-a1",
        title: "Fix something that is broken",
        brief:
          "Find a real Nigerian website or app that is genuinely hard to use — a bank, a school portal, a government service, a shop. Redesign one screen of it. Hand in three things: the original with your written diagnosis of what fails and why, your redesign, and a paragraph defending every change against the accusation that you simply preferred it. No Figma required yet; paper and a photograph is acceptable and sometimes better.",
        submitAs: "url",
        dueOffsetDays: 7,
        aiPolicy: "unaided",
        rubric: [
          {
            criterion: "The diagnosis is structural",
            weight: 35,
            looksLike:
              "Names hierarchy, spacing, typography, or copy failures specifically. 'It looks old' scores nothing; 'three things compete to be read first' scores well.",
          },
          {
            criterion: "The redesign addresses the diagnosis",
            weight: 30,
            looksLike:
              "Every change traces to a stated problem. A change that is only a preference is either justified or removed.",
          },
          {
            criterion: "Hierarchy and spacing are deliberate",
            weight: 25,
            looksLike:
              "A consistent scale is visible in the work. The eye goes where the learner says it should.",
          },
          {
            criterion: "The defence is honest",
            weight: 10,
            looksLike:
              "Admits at least one change that is taste rather than principle. Everyone has some; pretending otherwise is the failure.",
          },
        ],
      },
    },
    {
      id: "cx110-w3-s1",
      week: 3,
      title: "Colour with intent",
      dependsOn: ["cx110-w1-s2"],
      objectives: [
        "Build a palette from one decision rather than by collecting colours",
        "Use colour to encode meaning consistently",
        "Meet contrast requirements without producing something ugly",
      ],
      demo: [
        "A palette derived from a single brand colour, live",
        "The same interface in three palettes, and what each one says",
        "A design that fails contrast, fixed without losing its character",
      ],
      practice: [
        "Build a palette for your week 2 redesign and check every pair for contrast",
      ],
    },
    {
      id: "cx110-w3-s2",
      week: 3,
      title: "Designing for people who do not see it as you do",
      dependsOn: ["cx110-w3-s1"],
      objectives: [
        "Check a design for colour-blind and low-vision users",
        "Never encode meaning in colour alone",
        "Design a focus state worth having",
      ],
      demo: [
        "A status interface simulated under three kinds of colour blindness",
        "A chart that becomes meaningless in greyscale, and the fix",
        "Focus states: absent, default, and designed",
      ],
      practice: [
        "Take your palette through a simulator and fix what breaks",
      ],
      ifStuck:
        "The rule that carries them: if you removed all the colour, would this still work? If not, it is not finished.",
    },
    {
      id: "cx110-w4-s1",
      week: 4,
      title: "Auto-layout, components, and variants",
      toolFocus: ["Figma"],
      dependsOn: ["cx110-w2-s1"],
      objectives: [
        "Build a component that survives its content changing",
        "Use variants instead of duplicating a component five times",
        "Structure a file another designer can pick up",
      ],
      demo: [
        "A card built without auto-layout, then rebuilt with it, then stress-tested with long text",
        "A component set with variants, and the same thing done badly as twelve loose frames",
      ],
      practice: [
        "Rebuild your week 2 redesign as proper components",
      ],
    },
    {
      id: "cx110-w4-s2",
      week: 4,
      title: "Designing responsively",
      toolFocus: ["Figma"],
      dependsOn: ["cx110-w4-s1"],
      objectives: [
        "Design mobile first and mean it",
        "Say what a layout does between the sizes they drew",
        "Use constraints so a frame resizes correctly",
      ],
      demo: [
        "A desktop design squeezed to 360px, failing, then designed the other way round",
        "The gap between two artboards, and the decision nobody made about it",
      ],
      practice: [
        "Design your screen at 360, 768, and 1280, and describe what happens between",
      ],
      assignment: {
        id: "cx110-a2",
        title: "A small design system, not a pretty picture",
        brief:
          "Build a Figma file for a three-screen product: a type scale, a palette with contrast checked, spacing tokens, and at least six components with variants. Then hand the file to a classmate and ask them to design a fourth screen you have not drawn, using only your system. You are marked on whether they could.",
        submitAs: "url",
        dueOffsetDays: 7,
        aiPolicy: "unaided",
        rubric: [
          {
            criterion: "The system is consistent",
            weight: 30,
            looksLike:
              "Every value in the file comes from the scale. No one-off spacing, no colour outside the palette, no detached components.",
          },
          {
            criterion: "Components survive their content",
            weight: 25,
            looksLike:
              "Long names, empty states, and two-line labels do not break anything. Auto-layout used throughout.",
          },
          {
            criterion: "A stranger could build with it",
            weight: 30,
            looksLike:
              "The classmate produced a fourth screen that looks like it belongs, without asking questions. Each question they had to ask is a mark lost.",
          },
          {
            criterion: "Accessible by construction",
            weight: 15,
            looksLike:
              "Contrast passes across the palette. Focus states exist as components. Meaning is never carried by colour alone.",
          },
        ],
      },
    },
    {
      id: "cx110-w5-s1",
      week: 5,
      title: "Semantic HTML and document structure",
      toolFocus: ["HTML"],
      dependsOn: ["cx110-w4-s2"],
      objectives: [
        "Choose the element that means the thing, rather than styling a div",
        "Structure headings so the document outlines correctly",
        "Navigate their own page by keyboard and by screen reader",
      ],
      demo: [
        "A page built entirely from divs, heard through a screen reader",
        "The same page with real elements, heard again",
        "The heading outline of a real site, read aloud, exposing its structure",
      ],
      practice: [
        "Mark up your week 4 design using no div you cannot justify",
      ],
      ifStuck:
        "This is the session that converts designers into people engineers want to work with. Do not rush it because it looks basic.",
    },
    {
      id: "cx110-w5-s2",
      week: 5,
      title: "Modern CSS layout: flexbox and grid",
      toolFocus: ["CSS"],
      dependsOn: ["cx110-w5-s1"],
      objectives: [
        "Choose between flexbox and grid for a given layout and say why",
        "Build a responsive layout without a media query where possible",
        "Debug a layout using the browser's own tools rather than by guessing",
      ],
      demo: [
        "One layout built twice, in flex and in grid, with the trade-off named",
        "A layout debugged live in devtools, the actual cause found in under a minute",
      ],
      practice: [
        "Build your week 4 screens in CSS, mobile first",
      ],
    },
    {
      id: "cx110-w6-s1",
      week: 6,
      title: "Version control for people who are not engineers",
      toolFocus: ["Git", "GitHub"],
      dependsOn: ["cx110-w5-s2"],
      objectives: [
        "Commit their own work with a message that means something",
        "Open a pull request against a real repository",
        "Recover from a mistake without asking an engineer for help",
      ],
      demo: [
        "Why this matters, stated plainly: a designer who can open a pull request changes the site; one who emails a PNG waits",
        "init, add, commit, push, pull request — the whole path, slowly, once",
        "A mistake made and recovered with the reflog, so the fear goes early",
      ],
      practice: [
        "Put your week 5 build on GitHub and open a pull request",
      ],
      ifStuck:
        "Do not let anyone use a graphical client this week. The commands are frightening for one session and then they are not.",
    },
    {
      id: "cx110-w6-s2",
      week: 6,
      title: "From design file to real page, faithfully",
      dependsOn: ["cx110-w6-s1"],
      objectives: [
        "Translate spacing, type, and colour tokens into CSS custom properties",
        "Spot the drift between the design and the build",
        "Decide when the build is right and the design was wrong",
      ],
      demo: [
        "A design and its build overlaid, differences measured in pixels",
        "A case where the browser's behaviour is better than the drawing, and the design changes",
      ],
      practice: [
        "Audit your own build against your own design and list every difference",
      ],
      assignment: {
        id: "cx110-a3",
        title: "Build what you designed",
        brief:
          "Build your week 4 design as a real, deployed, responsive page. Semantic HTML, your tokens as CSS custom properties, working from 360px upward. It must be usable with a keyboard alone. Submit it as a pull request to the class repository, with a description a reviewer can follow, and include a short audit of every place the build differs from the design and why.",
        submitAs: "pull_request",
        dueOffsetDays: 8,
        aiPolicy: "unaided",
        rubric: [
          {
            criterion: "The markup means something",
            weight: 25,
            looksLike:
              "Elements chosen for meaning. Headings outline correctly. Every remaining div is one the learner can justify.",
          },
          {
            criterion: "It is faithful to the design",
            weight: 25,
            looksLike:
              "Spacing, type, and colour come from the tokens. Differences from the drawing are deliberate and listed.",
          },
          {
            criterion: "It works everywhere it must",
            weight: 25,
            looksLike:
              "No horizontal scroll at 360px. Keyboard-navigable with visible focus. Nothing breaks at an awkward width between breakpoints.",
          },
          {
            criterion: "The pull request is professional",
            weight: 25,
            looksLike:
              "Sensible commits, a description a reviewer can act on, and responses to review comments. The git work is marked, not waived because this is a design course.",
          },
        ],
      },
    },
    {
      id: "cx110-w7-s1",
      week: 7,
      title: "Motion, state, and the feel of an interface",
      dependsOn: ["cx110-w5-s2"],
      objectives: [
        "Design hover, focus, active, loading, disabled, and error states",
        "Use motion to explain a change rather than to decorate one",
        "Respect a user who has asked for reduced motion",
      ],
      demo: [
        "A button in all six states, designed rather than defaulted",
        "The same transition at 120ms and 600ms, and why one feels broken",
      ],
      practice: [
        "Add every state to the components in your build",
      ],
    },
    {
      id: "cx110-w7-s2",
      week: 7,
      title: "Performance is a design decision",
      dependsOn: ["cx110-w7-s1"],
      objectives: [
        "Size and format an image for the web without ruining it",
        "Load a font without a flash of invisible text",
        "Say what their design costs a user on a metered connection",
      ],
      demo: [
        "A 4MB hero image reduced to 80kB, compared at full size",
        "Three fonts loaded badly, and the page jumping as they arrive",
        "The same page loaded on a throttled connection, watched in silence",
      ],
      practice: [
        "Get your own page under a budget you set in the session",
      ],
    },
    {
      id: "cx110-w8-s1",
      week: 8,
      title: "AI as a source of variations, not of taste",
      toolFocus: ["Claude"],
      dependsOn: ["cx110-w1-s1", "cx110-w6-s2"],
      objectives: [
        "Use a model to generate options quickly, then reject most of them",
        "Describe a design problem precisely enough to get useful variations",
        "Say what the model cannot know about the user they are designing for",
      ],
      demo: [
        "One screen described three ways, generating three sets of options, all reviewed against week 1's criteria",
        "A generated layout that is competent and completely wrong for the audience — a Nigerian bank customer on a 360px screen",
        "The moment of taste: choosing between two options and defending the choice out loud",
      ],
      practice: [
        "Generate five variations of one component, reject four, and say why in one sentence each",
      ],
      ifStuck:
        "The failure is accepting the first plausible output. Insist on five options and four rejections, every time, until the habit sticks.",
    },
    {
      id: "cx110-w8-s2",
      week: 8,
      title: "Handing off, going live, and the portfolio review",
      dependsOn: ["cx110-w8-s1", "cx110-w7-s2"],
      objectives: [
        "Hand a design to an engineer with nothing left ambiguous",
        "Present their own work and defend a decision",
        "Say which piece of their portfolio they would remove",
      ],
      demo: [
        "A handoff that generates eleven questions, and the same one that generates none",
        "A mentor reviewing a portfolio cold, saying what they think in the first ten seconds",
      ],
      practice: [
        "Present your portfolio to the room and take the questions",
      ],
      assignment: {
        id: "cx110-a4",
        title: "Portfolio: three pieces and a defence",
        brief:
          "Assemble three pieces of work: the redesign from week 2, the built page from week 6, and one new piece of your own choosing designed and built end to end. For each, write the problem, your diagnosis, what you changed, and what you would do differently now. Include an honest note on where you used AI and what you rejected. Deploy it. It must load on a phone in under three seconds.",
        submitAs: "url",
        dueOffsetDays: 14,
        aiPolicy: "ai_assisted",
        rubric: [
          {
            criterion: "The work shows judgement, not decoration",
            weight: 30,
            looksLike:
              "Each piece solves a stated problem. The writing shows a diagnosis, not a description of what was made.",
          },
          {
            criterion: "The third piece is genuinely theirs",
            weight: 25,
            looksLike:
              "Designed and built end to end, at the standard of weeks 4 and 6, on a problem the learner chose and can explain caring about.",
          },
          {
            criterion: "It is fast, responsive, and accessible",
            weight: 25,
            looksLike:
              "Under three seconds on a phone. Usable by keyboard. Contrast passes. Works at 360px without horizontal scroll.",
          },
          {
            criterion: "The reflection is honest",
            weight: 20,
            looksLike:
              "Names what they would redo and what AI contributed. A learner who says a piece is weak and explains why scores above one who claims all three are strong.",
          },
        ],
      },
    },
  ],
};
