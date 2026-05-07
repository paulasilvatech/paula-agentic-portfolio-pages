---
title: "Config and Context Architecture for GitHub Copilot in VS Code"
subtitle: "The complete map of every configuration file, how it loads, and when to use it, grounded in empirical research"
description: "Complete reference mapping every GitHub Copilot configuration surface in VS Code, how each loads, and when to use it. Grounded in empirical research and field deployment."
author: "Paula Silva"
role: "Software Global Black Belt"
contact: "paulasilva@microsoft.com"
date: "2026-04-22"
version: "3.0.0"
status: "draft"
locale: "en"
deck_id: "deck-02"
deck_name: "Config and Context Architecture"
duration_minutes: 45
slide_count: 36
series: "GitHub Copilot Mastery"
series_position: "2 of 5"
tags:
  - github-copilot
  - vs-code
  - configuration
  - hierarchy
  - context-engineering
  - agents
  - skills
  - hooks
  - prompts
  - plugins
  - mcp
references_priority: "research-first"
---

# Deck 02: Config and Context Architecture for GitHub Copilot in VS Code

> One reference that explains every configuration file you can create for GitHub Copilot in VS Code. What it does, where it lives, how it inherits, when to use it, and why. Grounded in empirical research from 2,303 agent context files, a 108K-line codified-context case study, and a 400-developer enterprise Copilot rollout.

## Change log

| Version | Date       | Author      | Changes                                                                                   |
|---------|------------|-------------|-------------------------------------------------------------------------------------------|
| 1.0.0   | 2026-04-22 | Paula Silva | Initial deck built from dual-platform guide (Claude Code + GitHub Copilot)                |
| 2.0.0   | 2026-04-22 | Paula Silva | Rewrite focused 100% on GitHub Copilot and VS Code. Claude Code content removed.          |
| 3.0.0   | 2026-04-22 | Paula Silva | Enriched with empirical research (Vasilopoulos 2026, Chatlatanagulchai 2025, Zoominfo 2025). Added three-tier context taxonomy, Monday-morning scenarios, side-by-side comparisons, decision frameworks, animation specs, benchmark callouts. |

## Deck structure at a glance

36 slides, five parts, ~45 minutes:

- **Part I: The problem (slides 5-9):** Why configuration hierarchy matters. Research on 2,303 real agent context files shows where teams fail. The real cost.
- **Part II: The map (slides 10-13):** The ten-layer configuration surface. The three-tier context model (hot/warm/cold) from Vasilopoulos 2026.
- **Part III: Workspace layer (slides 14-19):** `copilot-instructions.md`, scoped `.github/instructions/*.instructions.md`, and the empirical gap around non-functional rules.
- **Part IV: Authoring layer (slides 20-26):** Agents, chat modes, skills, prompt files, and when to pick which.
- **Part V: Runtime layer (slides 27-34):** Hooks, MCP, plugins, VS Code settings, assembly order, inheritance.
- **Close (slides 35-36):** Monday morning action plan, references.

## Editorial principles for this deck

Every non-cover slide must carry **at least one** of:
- **Benchmark**, a data point from a controlled-environment source (arXiv paper, Gartner, Microsoft Research, DORA, METR, Zoominfo case study, etc.) with direct link.
- **Monday-morning**, a concrete day-to-day scenario a Brazilian/LATAM tech lead, platform engineer, or senior dev would recognize.
- **Side-by-side**, "without / with" or "wrong / right" visual.
- **Decision framework**, a tree, matrix, or rule that helps the viewer decide on Monday.

Pure explanatory slides without at least one of these must be rewritten or cut.

## Design system notes for rendering (for the HTML build)

- **Fonts:** Inter for body, JetBrains Mono for code, weights 400/500/600/700.
- **Palette (layer mapping):**
  - Infra = Blue `#0078D4` (workspace layer)
  - Platform = Green `#107C10` (authoring layer)
  - Context = Yellow `#FFB900` (hot-memory highlight)
  - Intent = Red `#F25022` (runtime layer, provocation, warnings)
  - Neutral = Dark `#1F1F1F` / Light `#F5F5F5`
- **Type scale (strict, to avoid the overflow bug seen in v1.0.0):**
  - Section cover titles: `clamp(48px, 6vw, 96px)`
  - Regular slide titles: `clamp(32px, 4vw, 56px)` with `line-height: 1.15`
  - Body: `18px-20px` with `line-height: 1.6`
  - Code blocks: `14px-16px` with `line-height: 1.5`
- **Padding rule:** every slide gets `padding: 64px 80px`; never fall below `48px 64px`.
- **No title can overlap its body**, enforce `min-height` on title zone and `margin-top: 32px` on first body element.
- **Animations (CSS-only, respect `prefers-reduced-motion`):**
  - Slide enter: fade + 16px upward slide, 400ms ease-out
  - Sequential reveals inside a slide: stagger 120ms
  - Code lines: progressive highlight on arrow key
  - Diagrams: tiers/layers appear in order on arrow key
- **Components required in the DS:**
  - `benchmark-card`, yellow left border, citation, data point, link
  - `monday-morning`, blue left border, scenario icon, persona label
  - `compare-split`, red/green columns with labels
  - `decision-tree`, SVG with animated paths
  - `tier-stack`, hot/warm/cold visual
  - `code-callout`, line-number gutter + inline annotations

---

## Slide 01: Cover

- **Type:** cover, light background with subtle 4-color accent bar at top.
- **Eyebrow:** `GITHUB COPILOT MASTERY · 2 OF 5`
- **Title:** *The complete map of **configuration files** that shape every **GitHub Copilot** response in **VS Code**.*
- **Subtitle:** Grounded in empirical research. Every file, where it lives, how it loads, when to use it.
- **Meta grid (bottom-left):**
  - Paula Silva
  - Software Global Black Belt
  - 45 minutes · 36 slides
  - 2026-04-22 · v3.0.0
- **Meta grid (bottom-right):**
  - Research foundation: Vasilopoulos 2026 · Chatlatanagulchai 2025 · Zoominfo 2025
- **Animation:** accent bar draws left-to-right over 600ms on slide enter.

---

## Slide 02: Agenda

- **Eyebrow:** `AGENDA · 45 MIN`
- **Title:** *Five parts. One map of every GitHub Copilot config surface.*
- **Agenda list (staggered reveal, 120ms each):**
  1. **PART I**, The problem: what 2,303 real agent context files tell us about where teams fail. *(~8 min)*
  2. **PART II**, The map: ten layers, three tiers (hot / warm / cold). *(~6 min)*
  3. **PART III**, Workspace layer: `copilot-instructions.md` and scoped `.github/instructions/`. *(~10 min)*
  4. **PART IV**, Authoring layer: agents, chat modes, skills, prompts. *(~12 min)*
  5. **PART V**, Runtime layer: hooks, MCP, plugins, VS Code settings. *(~7 min)*
- **Close footer:** Monday-morning action plan + references. *(~2 min)*

---

## Slide 03: Who is speaking

- **Eyebrow:** `WHO IS SPEAKING`
- **Title:** *Paula Silva, **Software Global Black Belt**.*
- **Subtitle:** Building the future of software development with AI and Agentic DevOps.
- **Body (two columns):**

  **Left:** I work with enterprise teams across Brazil and LATAM on agentic AI, platform engineering, and software modernization. I see the same pattern almost every week: a team turns GitHub Copilot on, writes one `copilot-instructions.md`, and thinks they are done. They are using roughly 10% of the configuration surface available to them.

  **Right:** The other 90% is the ten-layer hierarchy we are about to walk through. This deck is the map I wish existed when I started.

- **Contact row (small, at the bottom):**
  - paulasilva@microsoft.com

---

## Slide 04: The provocation

- **Eyebrow:** `THREE SIGNS YOU NEED THIS DECK`
- **Title:** *If any of these three situations sounds familiar, the next 45 minutes will pay for themselves.*
- **Numbered list (red accent, staggered reveal):**
  1. **Duplicated instructions.** The same rule lives in three different files and Copilot follows the wrong one depending on which file is open.
  2. **Silent guidance drift.** A developer merges code that Copilot suggested but that violates an unwritten team convention, because the convention was never encoded anywhere the model could read.
  3. **Tribal knowledge.** The team has a great workflow for writing a new API endpoint, but only one person knows the 200-word prompt that makes Copilot produce it correctly.
- **Monday-morning block (bottom, dark background):**
  > *You are the tech lead of a team of 8 developers at a Brazilian fintech. Every sprint, at least one PR gets kicked back because Copilot-generated code "did not follow our patterns." Nobody can point to where those patterns are written. This deck fixes that.*

---

## Slide 05: Part I section cover

- **Type:** section cover, dark background, red accent bar (full-height left side).
- **Eyebrow:** `PART I · ~8 MIN`
- **Section number:** `I` (massive, JetBrains Mono, 240px, red)
- **Title:** *The problem.*
- **Subtitle:** What 2,303 real agent context files tell us about where teams fail.

---

## Slide 06: What GitHub Copilot actually reads

- **Eyebrow:** `WHAT COPILOT ACTUALLY READS AT RUNTIME`
- **Title:** *Every Copilot response is assembled from a **layered context**, not a single file.*
- **Diagram (staggered reveal, 1 layer per arrow-key press):**

  ```
  ┌────────────────────────────────────────────────┐
  │ 10. VS Code settings (user + workspace + org)  │  ← always
  │ 09. Plugins (.plugin.json)                     │  ← when installed
  │ 08. MCP connections (.mcp.json)                │  ← once per session
  │ 07. Hooks (.github/hooks/*.json)               │  ← on lifecycle events
  │ 06. Prompt files (.github/prompts/*.prompt.md) │  ← on /slash command
  │ 05. Skills (.github/skills/*/SKILL.md)         │  ← when triggered
  │ 04. Chat modes (.github/chatmodes/*)           │  ← when selected
  │ 03. Agents (.github/agents/*.agent.md)         │  ← when invoked
  │ 02. Scoped instructions (applyTo)              │  ← when path matches
  │ 01. copilot-instructions.md                    │  ← always
  └────────────────────────────────────────────────┘
         ↓ merged into every Copilot turn ↓
           [   the final context window   ]
  ```

- **Caption:** Later layers refine; they cannot contradict earlier ones. A skill cannot bypass an organization policy. A prompt cannot override an enterprise admin setting.

---

## Slide 07: The empirical gap

- **Eyebrow:** `WHAT RESEARCH SAYS ABOUT REAL TEAMS`
- **Title:** *A study of **2,303 agent context files** across **1,925 repositories** found one consistent blind spot.*
- **Two-column stat layout:**

  **Left, What teams write (functional):**
  - Build and run commands: **62.3%**
  - Implementation details: **69.9%**
  - Architecture: **67.7%**

  **Right, What teams skip (non-functional):**
  - Security rules: **14.5%** ⚠
  - Performance rules: **14.5%** ⚠
  - Error handling patterns: *under-specified*

- **Benchmark card (yellow left border):**
  > **Empirical study, arXiv 2511.12884** (Chatlatanagulchai et al., 2025).
  > 2,303 files analyzed. Developers use context files to make agents *functional*, but provide few guardrails to make agent-written code *secure or performant*.
  > [Read the paper](https://arxiv.org/abs/2511.12884)

- **Takeaway (bottom, red background):** The default failure mode of a Copilot rollout is not "no context file", it is "a context file that makes the agent productive but unsafe." This deck shows how to fix both halves.

---

## Slide 08: Why a single file does not scale

- **Eyebrow:** `WHY ONE FILE IS NOT ENOUGH`
- **Title:** *A 1,000-line prototype fits in one manifest. A 100,000-line system does not.*
- **Body:**
  The most robust empirical case study on this topic comes from Vasilopoulos (2026), who built and instrumented a **108,000-line C# distributed system over 283 development sessions**. The finding: single-file manifests (`CLAUDE.md`, `AGENTS.md`, `.cursorrules`, a lone `copilot-instructions.md`) stop working well past a modest size. You need tiers.

- **Benchmark card (yellow left border):**
  > **Codified Context Infrastructure, arXiv 2602.20478** (Vasilopoulos, 2026).
  > 108K-line codebase · 283 sessions · 70 days · knowledge-to-code ratio 24.2%.
  > [Read the paper](https://arxiv.org/abs/2602.20478)

- **Monday-morning block:**
  > *Your monorepo is 60K lines across 14 packages. You try to cram the rules for every package into one `copilot-instructions.md` and it hits 3,000 tokens. Copilot starts ignoring the second half. This is the symptom Vasilopoulos documents. The fix is the three-tier model on the next slide.*

---

## Slide 09: The cost of ignoring the hierarchy

- **Eyebrow:** `THE COST`
- **Title:** *Without hierarchy vs. with hierarchy.*
- **Compare-split (red vs. green, full-bleed):**

  **Without hierarchy (red):**
  - Label: *Without hierarchy*
  - Rules duplicated across 3+ files
  - No scoping, broad rules fire in wrong contexts
  - No VS Code settings discipline, every dev gets different Copilot behavior
  - No skills, complex tasks re-explained every session
  - No hooks, nothing stops a bad suggestion before it lands in a commit
  - **Outcome:** inconsistent output, silent drift, tribal knowledge

  **With hierarchy (green):**
  - Label: *With hierarchy*
  - One right place for each kind of rule
  - Scoped instructions target only the files they apply to
  - Hooks create deterministic guardrails
  - Skills package domain knowledge once and reuse everywhere
  - Settings layered (user < workspace < org) with predictable precedence
  - **Outcome:** predictable, auditable, portable behavior

- **Animation:** red side fades in first, then green side slides in from the right 300ms later.

---

## Slide 10: Part II section cover

- **Type:** section cover, dark background, blue accent.
- **Eyebrow:** `PART II · ~6 MIN`
- **Section number:** `II`
- **Title:** *The map.*
- **Subtitle:** Ten layers. Three tiers. One mental model.

---

## Slide 11: The three-tier mental model

- **Eyebrow:** `THREE TIERS · HOT / WARM / COLD`
- **Title:** *Before the ten layers, learn the three tiers.*
- **Body (intro):**
  Vasilopoulos 2026 introduces a taxonomy that maps cleanly onto GitHub Copilot: **hot memory** (always loaded), **warm memory** (loaded on demand by trigger), **cold memory** (queried explicitly via MCP). Every one of the ten config layers belongs to exactly one tier.
- **Tier-stack diagram (staggered reveal, yellow highlights on the active tier):**

  ```
  ┌──────────────────────────────────────────────────────┐
  │  TIER 1 · HOT MEMORY            ~500-1000 lines       │
  │  Always loaded, every session                         │
  │  → .github/copilot-instructions.md                    │
  │  → .vscode/settings.json (Copilot-related)            │
  ├──────────────────────────────────────────────────────┤
  │  TIER 2 · WARM MEMORY           ~hundreds of lines    │
  │  Loaded on demand, by trigger                         │
  │  → .github/instructions/*.instructions.md (applyTo)   │
  │  → .github/agents/*.agent.md (invocation)             │
  │  → .github/chatmodes/*.chatmode.md (selection)        │
  │  → .github/skills/*/SKILL.md (trigger match)          │
  │  → .github/prompts/*.prompt.md (slash command)        │
  ├──────────────────────────────────────────────────────┤
  │  TIER 3 · COLD MEMORY           unbounded             │
  │  Queried explicitly                                   │
  │  → MCP servers (.mcp.json)                            │
  │  → Plugins (plugin.json)                              │
  │  → External docs, vector stores, knowledge bases      │
  └──────────────────────────────────────────────────────┘
  ```

- **Benchmark card:**
  > **Three-tier infrastructure in Vasilopoulos 2026** produced a working 108K-line system with 24.2% knowledge-to-code ratio. The paper reports that single-file manifests collapse well before that scale; tiered organization is what makes large projects controllable.
  > [arXiv 2602.20478](https://arxiv.org/abs/2602.20478)

- **Takeaway:** hot memory is expensive, every token counts. Warm and cold are cheap, load only when needed. The mistake most teams make is putting everything in hot.

---

## Slide 12: The ten-layer map

- **Eyebrow:** `THE TEN-LAYER MAP`
- **Title:** *Every primitive, in the order you should learn them.*
- **Layer table (each row color-coded by tier):**

| # | Layer                    | File or location                                       | Tier  | Loads when                  |
|---|--------------------------|--------------------------------------------------------|-------|-----------------------------|
| 1 | Workspace instructions   | `.github/copilot-instructions.md`                      | Hot   | Always                      |
| 2 | Scoped instructions      | `.github/instructions/*.instructions.md`               | Warm  | `applyTo` glob matches      |
| 3 | Agents                   | `.github/agents/*.agent.md`                            | Warm  | Agent invoked               |
| 4 | Chat modes               | `.github/chatmodes/*.chatmode.md`                      | Warm  | Chat mode selected          |
| 5 | Skills                   | `.github/skills/*/SKILL.md`                            | Warm  | Trigger matched             |
| 6 | Prompt files             | `.github/prompts/*.prompt.md`                          | Warm  | Slash command run           |
| 7 | Hooks                    | `.github/hooks/*.json`                                 | Warm  | Lifecycle event fired       |
| 8 | MCP connections          | `.mcp.json`                                            | Cold  | Tool is queried             |
| 9 | Plugins                  | `plugin.json` + Awesome GitHub Copilot                 | Cold  | Installed + invoked         |
| 10| VS Code settings         | `.vscode/settings.json`, user settings, org policies   | Hot   | Always (IDE-level)          |

- **Legend:** yellow = hot, blue = warm, gray = cold.
- **Caption:** Every row maps a concept to a file. The next three parts walk the layers in depth, grouped by the responsibility they serve.

---

## Slide 13: How the three parts are grouped

- **Eyebrow:** `ORIENTATION`
- **Title:** *Three parts, three responsibilities.*
- **Three cards (horizontal, color-coded):**

  **Workspace layer (blue), the foundation:**
  - `copilot-instructions.md`
  - `.github/instructions/*.instructions.md`
  - *Question it answers: what is always true about this codebase?*

  **Authoring layer (green), specialized content:**
  - Agents
  - Chat modes
  - Skills
  - Prompt files
  - *Question it answers: what specialized behaviors do I want to invoke?*

  **Runtime layer (red), execution and environment:**
  - Hooks
  - MCP
  - Plugins
  - VS Code settings
  - *Question it answers: what happens around the agent at runtime?*

- **Takeaway:** the three parts correspond to the three questions every team must answer to use Copilot effectively. The rest of the deck is the detail.

---

## Slide 14: Part III section cover

- **Type:** section cover, dark background, blue accent.
- **Eyebrow:** `PART III · ~10 MIN`
- **Section number:** `III`
- **Title:** *Workspace layer.*
- **Subtitle:** The foundation every Copilot project needs. Two files, one job each.

---

## Slide 15: copilot-instructions.md

- **Eyebrow:** `WORKSPACE · THE PROJECT BRAIN`
- **Title:** *One file the model reads **every session**.*
- **Left panel (blue accent, file tree):**
  ```
  your-repo/
  └── .github/
      └── copilot-instructions.md        ← always loaded
  ```
- **Right panel, Why it matters:**
  - Highest-impact file you can create for Copilot.
  - Loaded on every Copilot Chat, Copilot Edits, and Copilot Coding Agent session.
  - Plain Markdown. No frontmatter required.
  - No cascading: exactly one file per workspace.
  - **Keep it under 1,000 tokens.** Past that, Copilot summarizes and you lose determinism.
- **Typical contents:** project description · tech stack · folder layout · naming conventions · key commands · links to deeper docs.
- **Benchmark card:**
  > **Zoominfo case study (400+ developers):** after 4-phase rollout, acceptance rates for suggestions reached **33%** and lines of code **20%**, with **72% developer satisfaction** and **~20% time savings**. The single biggest lever in their Phase 3 (production deployment) was a well-structured workspace-level context file.
  > [arXiv 2501.13282](https://arxiv.org/abs/2501.13282)

---

## Slide 16: copilot-instructions.md: a working example

- **Eyebrow:** `WORKSPACE · EXAMPLE YOU CAN COPY TODAY`
- **Title:** *Short. Specific. Actionable. Under 1,000 tokens.*
- **Code block (markdown, progressive highlight on arrow-key press):**
  ```markdown
  # Copilot Instructions

  ## Project
  Next.js 14 App Router · TypeScript strict · Tailwind · Drizzle ORM over
  PostgreSQL · Vitest.

  ## Conventions
  - Files: kebab-case. React components: PascalCase.
  - API routes in `app/api/`, one folder per resource.
  - Tests co-located: `foo.ts` next to `foo.test.ts`.
  - No direct imports from `node_modules/*`. Use path aliases.

  ## Security (do not skip)
  - Never log request bodies or auth headers.
  - Validate every external input with Zod before using it.
  - Server actions must check session before any DB write.

  ## Performance
  - Prefer server components. Use client components only for interactivity.
  - Keep payloads under 100KB. Paginate lists of 50+.

  ## Key commands
  - `npm run dev`    dev server on :3000
  - `npm run build`  production build
  - `npm run lint`   ESLint + Prettier
  - `npm test`       Vitest

  ## References
  - [Architecture](./docs/architecture.md)
  - [Style guide](./docs/style-guide.md)
  ```
- **Caption:** Notice the `## Security` and `## Performance` sections. The empirical study on slide 7 showed only 14.5% of real teams write these. That gap is precisely what causes the unsafe-but-productive failure mode.

---

## Slide 17: Scoped instructions

- **Eyebrow:** `WORKSPACE · SCOPED INSTRUCTIONS`
- **Title:** *Rules that apply **only where they belong**.*
- **Body:**
  `.github/instructions/*.instructions.md` files load conditionally, driven by an `applyTo` glob in frontmatter. They keep `copilot-instructions.md` short by moving specialized guidance into files Copilot only reads when it is relevant.
- **Code block (markdown with YAML frontmatter):**
  ```markdown
  ---
  applyTo: "src/components/**/*.tsx"
  ---

  # React Component Rules

  - Functional components with hooks only. No class components.
  - Default export the component, named exports for utilities.
  - Co-locate styles: `ComponentName.module.css` next to the file.
  - Every component must have a `data-testid` on its root element.
  - Do not import from `server/*`, client boundary.
  ```
- **Key rule:** instructions **merge, they do not override**. Multiple files can match the same path; all matching files load together with the workspace instructions.

---

## Slide 18: Scoped instructions: common patterns

- **Eyebrow:** `WORKSPACE · SCOPING PATTERNS THAT WORK`
- **Title:** *Four patterns that cover 90% of real repos.*
- **Four-card layout:**

  **1. By framework layer**
  - `applyTo: "src/components/**"`, UI rules
  - `applyTo: "src/server/**"`, server boundary rules
  - `applyTo: "src/db/**"`, data access rules

  **2. By file type**
  - `applyTo: "**/*.test.ts"`, testing conventions
  - `applyTo: "**/*.md"`, doc style rules
  - `applyTo: "**/*.sql"`, query review rules

  **3. By domain / bounded context**
  - `applyTo: "packages/billing/**"`
  - `applyTo: "packages/auth/**"`
  - One file per bounded context in a monorepo

  **4. By risk surface (under-used)**
  - `applyTo: "**/payments/**"`, PCI rules
  - `applyTo: "**/api/admin/**"`, privileged-endpoint rules
  - `applyTo: "migrations/**"`, destructive-change rules

- **Takeaway (yellow accent):** Pattern #4 is the single highest-value one most teams miss. It is also exactly the 14.5% security gap from the empirical study.

---

## Slide 19: Workspace layer recap

- **Eyebrow:** `WORKSPACE · RECAP`
- **Title:** *Two files, one job each.*
- **Compare-split:**

  **copilot-instructions.md (blue):**
  - Always loaded (Tier 1 / hot)
  - One file per workspace
  - No cascading, no frontmatter
  - Global rules that are true everywhere

  **.github/instructions/*.instructions.md (green):**
  - Loaded when `applyTo` glob matches (Tier 2 / warm)
  - Many files per workspace
  - YAML frontmatter with `applyTo`
  - Scoped rules per file type, folder, or stack

- **Monday-morning block:**
  > *You are joining a new team on Monday. The first PR you open has Copilot suggest code that your reviewer says "we do not do that here." Your first hour on day two should not be reading Confluence. It should be writing and reviewing `.github/copilot-instructions.md` and one or two `.github/instructions/*.instructions.md`. After that, Copilot will onboard the next person for you.*

---

## Slide 20: Part IV section cover

- **Type:** section cover, dark background, green accent.
- **Eyebrow:** `PART IV · ~12 MIN`
- **Section number:** `IV`
- **Title:** *Authoring layer.*
- **Subtitle:** Agents, chat modes, skills, prompt files, and when to pick which.

---

## Slide 21: Authoring layer decision tree

- **Eyebrow:** `AUTHORING · DECISION TREE`
- **Title:** *Before you write, decide **which primitive** you actually need.*
- **Decision tree (SVG, branches reveal on arrow keys):**

  ```
  Do you want to change how Copilot behaves?
  │
  ├─ YES, for an entire class of tasks (reviewing code, writing tests, etc.)
  │   └─ Is the behavior invoked by name by the user?
  │       ├─ YES → AGENT (.github/agents/*.agent.md)
  │       └─ NO, it is a chat persona/style → CHAT MODE (.github/chatmodes/*)
  │
  ├─ YES, for a specific recurring task with known steps
  │   └─ PROMPT FILE (.github/prompts/*.prompt.md), invoke with /slash
  │
  └─ YES, I want to package domain knowledge for reuse across turns
      └─ SKILL (.github/skills/*/SKILL.md), triggered by description match
  ```

- **Takeaway:** four primitives, four different invocation mechanisms. Pick by how the user (or the agent) will trigger it, not by what it contains.

---

## Slide 22: Agents

- **Eyebrow:** `AUTHORING · AGENTS`
- **Title:** *Specialized personas with their **own tools**.*
- **Body:**
  Agent files live in `.github/agents/` with the `.agent.md` extension. Each one defines a specialized Copilot persona with its own allowed tools, instructions, and behavioral scope. One agent is active at a time. When invoked, it replaces the default chat persona.
- **Code block (progressive highlight):**
  ```markdown
  ---
  name: reviewer
  description: "Code review agent focused on security and performance"
  tools: [search, read, github.pull-request]
  model: gpt-4.1
  ---

  # Reviewer Agent

  ## Role
  You are a code reviewer. Your only job is to find issues.
  You do not write replacement code unless explicitly asked.

  ## What you look for (in order)
  1. Security issues: injection, auth bypass, secret leaks.
  2. Performance: N+1 queries, unbounded loops, missing indexes.
  3. Correctness: off-by-one, null handling, error paths.
  4. Readability: only after the above three pass.

  ## Output format
  - One bullet per issue. Severity tag: [HIGH] [MED] [LOW].
  - Cite the file and line.
  - Suggest a fix only if it fits in one line.
  ```
- **Caption:** Agents are the right primitive when you want a **named, invocable persona with tool scoping**. Note the `tools:` array, this is how you enforce least-privilege.

---

## Slide 23: Chat modes

- **Eyebrow:** `AUTHORING · CHAT MODES`
- **Title:** *Personas without separate tool scoping, **style, not authority**.*
- **Body:**
  Chat modes live in `.github/chatmodes/*.chatmode.md`. They differ from agents in three ways: they do not have their own tool allowlist, they are selected rather than invoked, and they stay active across turns until the user switches.
- **Code block:**
  ```markdown
  ---
  description: "Teach mode, explains every suggestion line by line"
  tools: []
  model: gpt-4.1
  ---

  # Teach Mode

  For every block of code you suggest, add a numbered annotation below
  explaining what each line does and why. Treat the user as a curious
  junior developer. Never skip the 'why'.
  ```
- **When to pick chat mode over agent:** the behavior is about **style and explanation depth**, not about capability or authority. Teach mode, summarize mode, rubber-duck mode, all chat modes.

---

## Slide 24: Skills

- **Eyebrow:** `AUTHORING · SKILLS`
- **Title:** *Packaged domain knowledge that Copilot triggers **automatically** by description match.*
- **Body:**
  Skills live in `.github/skills/{skill-name}/SKILL.md`, each in its own folder so the skill can carry reference files, scripts, or assets alongside. The model auto-loads a skill when the user's request matches the skill's `description` frontmatter.
- **Code block:**
  ```markdown
  ---
  name: write-pr-description
  description: |
    Use when the user asks to "write a PR description", "describe this
    diff", "summarize these changes for review", or similar. Produces
    a PR description following the team template.
  ---

  # Write PR Description

  ## Steps
  1. Read the diff from `git diff origin/main`.
  2. Classify changes: [feature | fix | refactor | chore | docs].
  3. Fill the template in `./template.md`.
  4. Add a 'Testing' section with the exact commands to reproduce.
  5. If any file under `migrations/` changed, add a 'Rollback' section.

  ## References
  - [Team PR template](./template.md)
  - [Rollback playbook](../../../docs/rollback.md)
  ```
- **Takeaway:** a skill is the right answer when **the same multi-step workflow keeps getting re-explained**. Write it once, and the description field makes Copilot find it on its own.

---

## Slide 25: Prompt files (slash commands)

- **Eyebrow:** `AUTHORING · PROMPT FILES`
- **Title:** *One-shot, **user-invoked** workflows via `/slash`.*
- **Body:**
  Prompt files live in `.github/prompts/*.prompt.md`. Unlike skills, they are not auto-triggered, the user calls them explicitly with a slash command. Use them when the workflow is discrete, predictable, and the user *knows* they want to run it.
- **Code block:**
  ```markdown
  ---
  description: "Generate a release notes draft from the last N commits"
  mode: ask
  tools: [shell.git, search]
  model: gpt-4.1
  ---

  Look at the commits since the last tag. Group them by:
  - New features
  - Bug fixes
  - Breaking changes
  - Internal / chores (collapse into one line)

  Output a Markdown file ready for the release notes, one section per
  group, with commit SHAs linked. Do not mention CI-only changes.
  ```
- **Invocation:** the user types `/release-notes` in Copilot Chat.

---

## Slide 26: Authoring layer recap

- **Eyebrow:** `AUTHORING · RECAP`
- **Title:** *Four primitives, four invocation mechanisms.*
- **Matrix (2x2 + outlier):**

| Primitive   | Invocation                       | Tool scoping? | Good for                           |
|-------------|----------------------------------|---------------|------------------------------------|
| Agent       | Invoked by name (persona switch) | Yes           | Role-based behaviors               |
| Chat mode   | Selected in chat picker          | No            | Style / depth of explanation       |
| Skill       | Auto-matched by description      | Indirect      | Reusable workflows, domain packs   |
| Prompt file | `/slash` by user                 | Yes           | Discrete, known, recurring tasks   |

- **Benchmark card:**
  > **Vasilopoulos 2026:** the 19 specialist agents in the case study averaged **711 lines for higher-capability agents** and **327 lines for standard-capability**. Over half of each spec was project-domain knowledge, not behavioral instructions.
  > [arXiv 2602.20478](https://arxiv.org/abs/2602.20478)

- **Monday-morning block:**
  > *You catch yourself retyping the same 300-word explanation for "how we write a new API endpoint" for the third time in a sprint. That is a skill, not a prompt, not a chat mode, not an agent. Write it in `.github/skills/new-api-endpoint/SKILL.md` with a strong description and watch Copilot pick it up by itself.*

---

## Slide 27: Part V section cover

- **Eyebrow:** `PART V`
- **Big number:** `05`
- **Title:** *Runtime layer, **what runs**, when you ask Copilot to do something.*
- **Subtitle:** Hooks, MCP servers, plugins, and the VS Code settings that glue them all together.
- **Color:** Red `#F25022` (runtime / intent / provocation).
- **Layout:** full-bleed cover, section label top-left in JetBrains Mono 16px, big number right-aligned `clamp(140px, 14vw, 240px)`, title `clamp(48px, 6vw, 96px)`.
- **Animation:** red accent bar slides in left-to-right over 500ms; big number counts up from 00 to 05 over 900ms.
- **Notes:** "The first three parts described *what Copilot knows*. Part V is about *what Copilot can actually do with that knowledge*, and how to keep it from doing the wrong thing."

---

## Slide 28: Hooks: lifecycle events you can intercept

- **Eyebrow:** `RUNTIME · HOOKS`
- **Title:** *Code that runs **around** an agent action, not **inside** it.*
- **Body:**
  Hooks live in `.github/hooks/*.json`. They fire on lifecycle events (`preToolUse`, `postToolUse`, `onSessionStart`, `onPromptSubmit`, `onFileChange`) and can **allow**, **deny**, **mutate**, or **log** the event before or after Copilot acts. Think of them as the CI of your agent: deterministic guardrails that do not rely on the model behaving well.
- **Code block (preToolUse guardrail):**
  ```json
  {
    "event": "preToolUse",
    "match": { "tool": "shell", "command": "^(rm|sudo|kubectl delete)" },
    "action": "deny",
    "message": "Destructive command blocked. Ask a human."
  }
  ```
- **Benchmark card:**
  > **Chatlatanagulchai et al. 2025:** across 2,303 agent context files, explicit security guidance appears in only **14.5%** of repositories. Hooks are the deterministic backstop for the 85.5% that forget.
  > [arXiv 2511.12884](https://arxiv.org/abs/2511.12884)
- **Side-by-side (without / with):**
  - **Without hook:** Copilot runs `kubectl delete namespace prod` because the prompt said "clean up". Post-mortem at 2am.
  - **With hook:** `preToolUse` denies the command; the chat surfaces the message; a human is paged instead.
- **Monday-morning block:**
  > *If your team has any tool that can touch production, write one `preToolUse` hook today. Five lines of JSON prevent the incident you have not had yet.*

---

## Slide 29: MCP: the Model Context Protocol

- **Eyebrow:** `RUNTIME · MCP`
- **Title:** *One protocol, many tools. **Where Copilot gets fresh data.***
- **Body:**
  MCP (Model Context Protocol) is the open standard Copilot uses to talk to external systems at runtime: databases, issue trackers, observability, your internal APIs. Servers are declared in `.mcp.json` (workspace) or `settings.json` (user). Each server exposes tools, resources, and prompts; Copilot discovers them dynamically.
- **Code block:**
  ```json
  {
    "servers": {
      "github": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-github"],
        "env": { "GITHUB_TOKEN": "${env:GH_TOKEN}" }
      },
      "postgres-readonly": {
        "command": "mcp-postgres",
        "args": ["--url", "${env:PG_READONLY_URL}"]
      }
    }
  }
  ```
- **Decision framework (when to add an MCP server):**

| Signal                                                | Reach for MCP? |
|-------------------------------------------------------|----------------|
| Data Copilot needs lives outside the repo             | Yes            |
| Data changes between sessions (tickets, logs, DB rows)| Yes            |
| Data is static reference text                         | No, use cold memory (a doc + skill) |
| Action is destructive                                 | Yes, but wrap with a `preToolUse` hook |

- **Benchmark card:**
  > **Context engineering research 2025:** retrieval-augmented context via MCP-style tools reduces hallucination on factual tasks by a measurable margin vs. static context alone, at the cost of per-call latency and auth surface.
  > [arXiv 2503.23278, MCP security analysis](https://arxiv.org/abs/2503.23278)
- **Monday-morning block:**
  > *If your team keeps pasting the same DB query results into chat, you do not have a prompting problem, you have a missing MCP server. Add `postgres-readonly` with least-privilege credentials and stop copy-pasting.*

---

## Slide 30: Plugins: shareable bundles

- **Eyebrow:** `RUNTIME · PLUGINS`
- **Title:** *A zipped bundle of everything above, **versioned**.*
- **Body:**
  A plugin packages agents, chat modes, skills, prompt files, hooks, and MCP declarations behind a single `plugin.json` manifest. It is how teams share configuration across repositories, and how the [Awesome GitHub Copilot](https://github.com/github/awesome-copilot) ecosystem distributes community work.
- **Structure (tree):**
  ```
  my-team-plugin/
  ├── plugin.json              # manifest: name, version, owner, dependencies
  ├── agents/
  │   └── reviewer.agent.md
  ├── chatmodes/
  │   └── teach.chatmode.md
  ├── skills/
  │   └── write-pr-description/SKILL.md
  ├── prompts/
  │   └── release-notes.prompt.md
  ├── hooks/
  │   └── block-destructive.json
  └── mcp.json
  ```
- **Side-by-side (wrong / right):**
  - **Wrong:** each of 40 repositories in your org has its own hand-rolled `.github/copilot-instructions.md`. Drift within a quarter.
  - **Right:** one plugin, pinned to a version in each repo. Changes go through a PR on the plugin, not 40 PRs.
- **Monday-morning block:**
  > *The moment you find yourself copying `.github/` contents from one repo to another, stop. That is a plugin. Bootstrap it once, publish it to your internal registry, and `copilot plugin install @yourorg/standards`.*

---

## Slide 31: VS Code settings precedence

- **Eyebrow:** `RUNTIME · SETTINGS`
- **Title:** *Four scopes. **The most specific wins.***
- **Body:**
  Every Copilot behavior that is not a file has a setting somewhere in VS Code. They are resolved in a strict order and the outer scope cannot override the inner scope, unless you explicitly say so.
- **Precedence table (outer → inner, most specific wins):**

| Scope           | File                                           | Controlled by       |
|-----------------|------------------------------------------------|---------------------|
| Default         | built into VS Code / Copilot                   | the product team    |
| User            | `~/Library/Application Support/Code/User/settings.json` (macOS) | you                 |
| Workspace       | `.vscode/settings.json`                        | the repo (team)     |
| Workspace folder| `.vscode/settings.json` inside a sub-folder of a multi-root workspace | that folder owner   |

- **Code block (workspace settings that lock team behavior):**
  ```jsonc
  // .vscode/settings.json
  {
    "github.copilot.chat.codeGeneration.useInstructionFiles": true,
    "chat.instructionsFilesLocations": [".github/instructions"],
    "chat.promptFilesLocations": [".github/prompts"],
    "chat.agent.maxRequests": 20,
    "github.copilot.nextEditSuggestions.enabled": true
  }
  ```
- **Decision framework:**
  - *User settings* = your personal preferences (theme, shortcuts, experimental features).
  - *Workspace settings* = team contract. Commit them.
  - *Workspace folder* = only for multi-root monorepos where one package has different rules.
- **Benchmark card:**
  > **Zoominfo 2025:** in their 400-developer rollout, standardizing workspace-level Copilot settings was one of three levers that sustained a **~30%** suggestion-acceptance rate across languages. Personal tuning alone did not scale.
  > [arXiv 2501.13282](https://arxiv.org/abs/2501.13282)

---

## Slide 32: Assembly order: what Copilot builds before it answers

- **Eyebrow:** `RUNTIME · ASSEMBLY`
- **Title:** *Nine steps from "you pressed Enter" to "the model answers".*
- **Body:**
  When you submit a prompt, VS Code builds the effective context in a deterministic order. Knowing this order is how you debug "why did Copilot ignore my rule".
- **Numbered flow (render as a vertical stepper, animated):**

  1. **Load default settings** → VS Code + Copilot extension defaults.
  2. **Apply user settings** → `~/…/settings.json` overrides.
  3. **Apply workspace settings** → `.vscode/settings.json` overrides.
  4. **Load hot memory** → `.github/copilot-instructions.md` (always).
  5. **Match scoped instructions** → any `.github/instructions/*.instructions.md` whose `applyTo` glob matches open files.
  6. **Resolve authoring primitive** → if a chat mode, agent, skill, or prompt file is invoked, merge it in.
  7. **Run `onPromptSubmit` hooks** → can deny, mutate, or annotate.
  8. **Discover MCP tools** → list servers, expose tools to the model.
  9. **Send to model** → with the assembled system prompt + tool catalog + user message.

- **Side-by-side (debugging tip):**
  - **Symptom:** "Copilot ignored my Python rule."
  - **First check:** step 5, does the `applyTo` glob actually match the file you have open?
  - **Second check:** step 3, is `chat.instructionsFilesLocations` pointing to `.github/instructions`?
- **Monday-morning block:**
  > *Next time Copilot "ignores" an instruction, do not argue with the model. Walk this 9-step list top-down. The bug is always in one of steps 3, 5, or 7.*

---

## Slide 33: Inheritance: how settings flow across repos, users, and orgs

- **Eyebrow:** `RUNTIME · INHERITANCE`
- **Title:** *Team contract **down**, personal taste **up**.*
- **Body:**
  The inheritance model is one-directional by design: the **org** sets floors, the **workspace** sets the team contract, the **user** personalizes. A well-configured org does not need to enforce style at the user level.
- **Diagram (render as nested boxes):**
  ```
  ┌─ Org policy (GitHub Enterprise Copilot policies) ──────────────┐
  │  ┌─ Workspace / repo (.vscode + .github) ─────────────────────┐│
  │  │  ┌─ User (~/…/settings.json) ──────────────────────────────┐││
  │  │  │  ┌─ Session (chat) ─────────────────────────────────────┐│││
  │  │  │  │  - pinned files, open tabs, current selection       ││││
  │  │  │  └──────────────────────────────────────────────────────┘│││
  │  │  └──────────────────────────────────────────────────────────┘││
  │  └────────────────────────────────────────────────────────────────┘│
  └────────────────────────────────────────────────────────────────────┘
  ```
- **Rules of the model:**
  - Org policy **cannot be overridden** by a workspace or user (e.g., content-exclusion lists, telemetry).
  - Workspace settings **can be overridden** by a user only when the setting is not in the org's `settings.json` lock list.
  - User settings **never leak into** a workspace, commits are safe.
- **Benchmark card:**
  > **Vasilopoulos 2026:** the 108K-line case study maintained a single workspace-level constitution across 283 sessions over 70 days. Knowledge-to-code ratio stayed at **24.2%** without per-user drift, because inheritance was enforced at the workspace, not the user.
  > [arXiv 2602.20478](https://arxiv.org/abs/2602.20478)

---

## Slide 34: Runtime layer recap

- **Eyebrow:** `RUNTIME · RECAP`
- **Title:** *Four primitives, one loop.*
- **Recap table:**

| Primitive    | File / config                          | Role                                             |
|--------------|----------------------------------------|--------------------------------------------------|
| Hooks        | `.github/hooks/*.json`                 | Deterministic guardrails around tool calls      |
| MCP servers  | `.mcp.json` or `settings.json`         | Live, authenticated access to external systems  |
| Plugins      | `plugin.json` + full bundle            | Shareable, versioned configuration packages     |
| VS Code settings | `.vscode/settings.json`            | The team contract that ties it all together     |

- **Decision framework (the 15-second version):**
  - Need **safety**? Hook.
  - Need **fresh data**? MCP.
  - Need **scale across repos**? Plugin.
  - Need **team contract**? `.vscode/settings.json`.
- **Monday-morning block:**
  > *If only one of the four is present in your repo today, add the next one this week. The order that compounds fastest is: settings → hooks → MCP → plugin.*

---

## Slide 35: Monday morning action plan

- **Eyebrow:** `CLOSE · ACTION PLAN`
- **Title:** *What to do on Monday, **in order.***
- **Body:** The entire 10-layer surface is useless if nobody touches it. This is the smallest sequence of commits that gets your team from zero to a real configuration baseline in one week.
- **Action list (render as a week-long Gantt-style checklist):**

| Day       | Commit                                                              | Why                                                                 |
|-----------|---------------------------------------------------------------------|---------------------------------------------------------------------|
| Monday    | Create `.github/copilot-instructions.md` with ## Stack, ## Conventions, ## Security, ## Performance | Closes the 14.5% security gap (Chatlatanagulchai 2025)             |
| Tuesday   | Add `.vscode/settings.json` with `useInstructionFiles: true` and `instructionsFilesLocations` | Makes the team contract real, not aspirational                     |
| Wednesday | Write one `.github/instructions/*.instructions.md` scoped to your riskiest directory (e.g., `migrations/**`) | Gets you from single-file (doesn't scale) to three-tier            |
| Thursday  | Write one `.github/hooks/*.json` that denies destructive shell commands | Deterministic backstop for the 85.5% that forget security          |
| Friday    | Extract recurring multi-step workflows into one `.github/skills/*/SKILL.md` | Stops re-explaining the same 300-word playbook                     |
| Next week | Package the above into a plugin and install it across your top 3 repos | Inheritance at the org level, not copy-paste                        |

- **Side-by-side (expectations, honest):**
  - **What this will not do:** turn a junior team into a senior team. Copilot amplifies what is written down, if nothing is written down, nothing changes.
  - **What this will do:** give you a reproducible `~30%` acceptance baseline (Zoominfo 2025) instead of "it works on my machine" stories.
- **Closing provocation:**
  > *The hierarchy is not a feature list. It is a governance model. The teams that treat it that way ship. The teams that treat it as "just prompt engineering" plateau.*

---

## Slide 36: References

- **Eyebrow:** `CLOSE · REFERENCES`
- **Title:** *The research behind every benchmark in this deck.*

### Empirical research (primary sources)

- Vasilopoulos, I. (2026). *Codified Context Infrastructure: A Case Study of a 108K-Line Distributed System over 283 Sessions.* [arXiv:2602.20478](https://arxiv.org/abs/2602.20478), source for the three-tier hot/warm/cold model, the 24.2% knowledge-to-code ratio, and the 711/327 lines-per-agent benchmark.
- Chatlatanagulchai, W., et al. (2025). *An Empirical Study of 2,303 Agent Context Files Across 1,925 Repositories.* [arXiv:2511.12884](https://arxiv.org/abs/2511.12884), source for the 14.5% security gap, 62.3% build/run command prevalence, and the "living configuration artifact" framing.
- Zoominfo Engineering (2025). *A Four-Phase Evaluation of GitHub Copilot Across 400+ Developers.* [arXiv:2501.13282](https://arxiv.org/abs/2501.13282), source for the ~30% sustained acceptance rate, 72% satisfaction, and the workspace-settings lever.
- Narayanan, A., et al. (2025). *MCP Security: Threat Model and Mitigations for the Model Context Protocol.* [arXiv:2503.23278](https://arxiv.org/abs/2503.23278), source for the MCP decision framework (wrap destructive actions in hooks).

### Official product documentation

- [GitHub Copilot in VS Code, Custom Instructions](https://code.visualstudio.com/docs/copilot/copilot-customization)
- [GitHub Copilot Chat, Prompt Files and Chat Modes](https://code.visualstudio.com/docs/copilot/copilot-chat-experimental)
- [GitHub Copilot, Agent Files (public preview)](https://docs.github.com/en/copilot/using-github-copilot/ai-models/choosing-the-right-ai-model-for-your-task)
- [Model Context Protocol, Specification](https://modelcontextprotocol.io/)
- [Awesome GitHub Copilot, Community plugin registry](https://github.com/github/awesome-copilot)
- [VS Code, Settings Precedence](https://code.visualstudio.com/docs/getstarted/settings)

### Industry context

- Gartner (2025). *Forecast Analysis: AI Code Assistants, Worldwide.*, sizing the developer adoption curve.
- DORA / Google Cloud (2025). *State of DevOps Report, AI Edition.*, throughput and stability impact of AI-assisted development.
- McKinsey (2024). *Unleashing Developer Productivity with Generative AI.*, the 20-45% productivity-range framing.

### Paula's own companion material

- Silva, P. (2026). *Deck 01: GitHub Copilot in VS Code.* Paula Design System, deck-01-copilot-vscode.
- Silva, P. (2026). *Deck 03: Skills and Agents.* (in preparation).
- Silva, P. (2026). *LATAM Four Pillars Playbook.* [Reference temporarily withheld pending republication on a Microsoft-hosted channel.]

---

*End of Deck 02 v3.0.0 EN, awaiting validation before PT-BR, ES, and HTML builds.*

---

Paula Silva, Software Global Black Belt
*Building the future of software development with AI and Agentic DevOps*

paulasilva@microsoft.com
