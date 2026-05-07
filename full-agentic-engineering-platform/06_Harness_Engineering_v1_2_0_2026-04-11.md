---
title: "The Context Platform Stack: Harness Engineering"
description: "Why the four layers of the Context Platform Stack only become a production system when wrapped in a deliberate harness. The 2026 discipline that turns the framework into an operating model, with two implementation paths through Three Horizons Accelerator and Open Horizons"
author: "Paula Silva"
date: "2026-04-11"
version: "1.2.0"
status: "approved"
tags: ["playbook", "harness-engineering", "agentic-AI", "agent-operations", "three-horizons", "open-horizons", "platform-engineering", "azure", "github-copilot", "microsoft-foundry"]
---

# Harness Engineering


## Change Log

| Version | Date | Author | Changes |
|---------|------|--------|--------|
| 1.2.0 | 2026-04-11 | Paula Silva | Initial release of Chapter 6, integrating the harness engineering discipline that crystallized in February 2026 into the Context Platform Stack as the operational layer that wraps all four prior layers |

## Table of Contents

- [Why I Added a Sixth Chapter](#why-i-added-a-sixth-chapter)
- [What Harness Engineering Actually Is](#what-harness-engineering-actually-is)
- [The Three Layers Around the Model](#the-three-layers-around-the-model)
- [How the Discipline Got Its Name](#how-the-discipline-got-its-name)
- [The Anatomy of a Production Harness](#the-anatomy-of-a-production-harness)
- [Guides and Sensors: The Fowler Taxonomy](#guides-and-sensors-the-fowler-taxonomy)
- [Harness Engineering as the Unifying Lens for the Stack](#harness-engineering-as-the-unifying-lens-for-the-stack)
- [Production Harness Patterns](#production-harness-patterns)
- [The Seven-Step Implementation Playbook](#the-seven-step-implementation-playbook)
- [The Shared Microsoft Foundation](#the-shared-microsoft-foundation)
- [Two Paths to the Same Destination](#two-paths-to-the-same-destination)
- [Failure Modes and the Layer That Prevents Them](#failure-modes-and-the-layer-that-prevents-them)
- [Metrics and Observability for Harnessed Agents](#metrics-and-observability-for-harnessed-agents)
- [Adoption Roadmap for LATAM Enterprise](#adoption-roadmap-for-latam-enterprise)
- [Synthesis: From Stack to Operating Model](#synthesis-from-stack-to-operating-model)
- [References](#references)

---

## Why I Added a Sixth Chapter

I wrote Chapters 0 through 5 in April 2026 because I was tired of watching pilots die in production. The four layers (Cloud and Infrastructure, Platform Engineering, Context Engineering, Intent Engineering) plus the Integration Playbook gave me a complete diagnostic framework for the agent cemetery I described in Chapter 0.[^chapter0] I thought the framework was complete.

Then February 2026 happened, and I had to revisit that assumption.

In a single month, three things converged. Mitchell Hashimoto coined "engineer the harness" in a personal blog post on February 5.[^hashimoto2026] OpenAI's Ryan Lopopolo published a field report on February 11 describing how three engineers shipped roughly a million lines of production code with zero human-written code, calling the discipline "harness engineering."[^lopopolo2026] LangChain published a case study on February 17 where they jumped from rank 30 to rank 5 on Terminal Bench 2.0 by changing only the harness, with the model held constant.[^langchain2026] Within weeks, Martin Fowler, Anthropic, Microsoft, and the broader practitioner community converged on the same vocabulary.[^fowler2026][^anthropic2026]

I sat with this for a few weeks before deciding what to do. My first instinct was to retrofit the term across Chapters 1 through 5. That would have been wrong. Harness engineering doesn't replace context engineering or intent engineering. It also doesn't replace platform engineering. It's the discipline that wraps all of them and makes them operate together as a production system.

That's what this chapter is. The sixth layer of the stack, but not stacked on top of the others. It's the operating system that the four prior layers compose into. If Chapter 1 gives you compute, Chapter 2 gives you governance, Chapter 3 gives you cognition, and Chapter 4 gives you strategy, then Chapter 6 gives you the discipline that runs all of that as a coherent agent in production.

There's also a sharper reason for this chapter. I keep noticing in client engagements that the choice between Three Horizons Accelerator and Open Horizons gets framed as a strategic choice. It isn't. It's a stack choice. Both accelerators implement the same harness engineering discipline. Both terminate at the same Horizon 3 destination. What varies is the implementation pillar: Red Hat (RHDH on ARO) for Three Horizons, open source upstream (Backstage on AKS) for Open Horizons. Naming harness engineering as the unifying discipline lets me have that conversation cleanly.

This chapter is also where I commit to writing something else I'd been telling clients in discovery sessions but hadn't documented: the shared Microsoft foundation that sits underneath both accelerators. Azure as cloud, GitHub Enterprise for source and DevOps, Entra Agent ID for identity, Microsoft Foundry for the AI platform. That foundation is the constant. The accelerator is the variable. The harness is what ties it all together.

## What Harness Engineering Actually Is

The formula that crystallized the field in early 2026 is deliberately compact:

```
Agent = Model + Harness
```

The model (Claude, GPT, Gemini, open-weight models) provides the reasoning capability. The harness is everything around it: tools, memory, state, context, validation, security, lifecycle, gates, sensors, guides. When somebody says "I built an agent," what they actually built is a harness pointed at a model. The model is the pluggable component. The harness is the differentiator.[^chawla2026][^parallel2026]

The metaphor is literal. A harness is the equipment that channels the raw power of a horse into useful work. Reins, saddle, bit, harness straps. A horse without a harness can run, but it can't pull a plow through a field, can't navigate around obstacles, can't be steered toward a goal. The same applies to LLMs. The model has intelligence. Without tools, memory, state, guardrails, and orchestration, you can't put it to work reliably.

There's a sharper analogy that resurfaced in 2026, originally from Beren Millidge in 2023: a raw LLM is a CPU with no RAM, no disk, no I/O. The context window serves as RAM (fast but limited). External databases function as disk storage (large but slower). Tool integrations act as device drivers. The harness is the operating system. Without it, the CPU is technically capable but operationally useless.[^millidge2023][^chawla2026]

I find this framing useful because it makes the cost obvious. You don't run production workloads on a CPU without an OS. Why would you run agents without a harness?

## The Three Layers Around the Model

I've watched the vocabulary shift twice in three years. In 2023 the term of the moment was prompt engineering. By mid-2025, context engineering. In February 2026, harness engineering. This isn't relabeling. It's the bottleneck moving outward as the inner layers mature.[^hashimoto2026][^lopopolo2026]

There are three concentric layers of engineering around the model. Each answers a different question:

| Layer | Question | Time horizon | Examples |
|-------|----------|--------------|----------|
| **Prompt engineering** | What do I ask the model? | One interaction | Few-shot, chain-of-thought, role prompts, structured outputs |
| **Context engineering** | What does the model see? | One session | RAG, MCP, memory, history compaction (Chapter 3) |
| **Harness engineering** | How does the whole system run? | Multiple sessions, days, weeks | Tools, permissions, gates, evals, retries, guardrails (this chapter) |

A useful mental model: the model is the engine. Context is part of the fuel, the oil changes, the dashboard. The harness is the rest of the car. Steering, brakes, lane markings, maintenance schedule, warning lights, the fact that the doors aren't supposed to fall off on the highway. Focus only on the engine and the fuel and you can still ship a terrible car.[^bouchard2026]

The three layers don't compete. They compose. Context engineering lives inside harness engineering. The harness decides when context gets loaded, which tools are available, which actions are allowed, how failures are handled, and what counts as "done" before anyone declares the work complete.[^anthropic2026]

This is the same point I made in Chapter 3 when I argued context is a structured, versioned, measurable artifact rather than a prompt. Harness engineering takes that argument one level further: not just context, but the entire execution environment must be engineered as a first-class systems object. And not just for one session. For the whole lifecycle of the agent.

## How the Discipline Got Its Name

The timeline matters because it shows the discipline didn't get pushed by a single vendor. It emerged in parallel from multiple teams converging on the same problem.

| When | What happened |
|------|---------------|
| 2023 | Beren Millidge publishes the "LLM as CPU without an OS" essay. The idea sits dormant.[^millidge2023] |
| Mid-2025 | Karpathy popularizes context engineering. LangChain and Anthropic formalize definitions. |
| August 2025 | OpenAI's Frontier team starts the experiment of a codebase generated 100% by agents.[^lopopolo2026] |
| February 5, 2026 | Mitchell Hashimoto publishes "My AI Adoption Journey" coining "engineer the harness."[^hashimoto2026] |
| February 11, 2026 | Ryan Lopopolo (OpenAI) publishes "Harness engineering: leveraging Codex in an agent-first world," reporting 1M LoC with zero human code.[^lopopolo2026] |
| February 17, 2026 | LangChain publishes "Improving Deep Agents with harness engineering," reporting rank 30 to rank 5 on Terminal Bench 2.0.[^langchain2026] |
| March 2026 | Martin Fowler and Birgitta Böckeler publish the guides and sensors taxonomy. Anthropic publishes the three-agent harness paper.[^fowler2026][^anthropic2026] |
| April 3, 2026 | Microsoft Agent Framework 1.0 GA, with a layer explicitly named "Agent Harness."[^microsoft2026] |
| April 8, 2026 | Anthropic announces Managed Agents, articulating that harnesses encode assumptions that go stale as models improve.[^anthropic2026] |

Hashimoto gave the discipline its origin definition: every time you find the agent making a mistake, you spend the time to engineer a solution so that the agent never makes that mistake again.[^hashimoto2026] That's the central discipline. Each failure is a signal to evolve the system, not a reason to rewrite the prompt.

This connects directly to what I argued in Chapter 0 about cognitive debt and intent debt.[^chapter0] Both forms of debt compound when teams treat agent failures as one-off events. Harness engineering treats every failure as a permanent fix opportunity, which is exactly the discipline that prevents debt accumulation. The mechanism that turns the diagnosis into a fix is the harness itself.

## The Anatomy of a Production Harness

A production harness has four classes of components. I'll describe each, then in the next section I'll layer Fowler's taxonomy on top to make design decisions easier.

**Tool layer.** Controlled shell and filesystem execution, HTTP access to internal and external APIs, MCP servers for connectors, packaged skills. The minimum capability of an agent is to read files, execute programs, and make HTTP requests. Everything else is additional functionality the harness exposes.[^chawla2026] Chapter 1 covers MCP as the infrastructure protocol layer; Chapter 3 covers MCP within context engineering; this chapter covers MCP as part of the harness operating substrate.[^chapter1][^chapter3]

**Memory and state.** Short-term memory is the context window plus compaction techniques. Long-term memory is vector stores, knowledge bases, managed memory services. Session state is thread lifecycle, persistence, fork, archive. Progress artifacts are files like `claude-progress.txt`, JSON feature lists, incremental commits. The harness decides which tier holds what.[^anthropic2026][^parallel2026] This is the operational extension of the three-tier architecture I described in Chapter 3.[^chapter3]

**Sandbox and isolation.** Per-session isolated filesystem, granular permissions (scope, operation, session), token-level versus session-level access control, network egress policy, resource limits. The harness is the actual security boundary of the system. The model does not enforce permissions. The harness does.[^microsoft2026] This is the same point I underscored in Chapter 2: RBAC for agents is not a security feature bolted on, it's a specification compliance feature engineered into the platform.[^chapter2]

**Loops, gates, and policies.** ReAct loops, plan-and-execute, reflection, retries with exponential backoff. Quality gates: pre-implementation gates, sprint contracts, shared definition of done. Merge policies: required checks, branch protection, conditional automerge. Approval policies: human-in-the-loop checkpoints before destructive operations. Garbage collection policies: maintenance agents that run periodically to fight entropy.[^lopopolo2026][^anthropic2026]

The Spec-Driven Development workflow I described in Chapter 4 is essentially a gate-and-loop pattern.[^chapter4] Constitution drafting (Ask mode), Specification refinement (Ask mode), Implementation Plan (Ask mode), human approval gate, scoped implementation (Agent mode with hooks). Every transition is a harness gate. Every artifact is a harness guide. The whole workflow is a harness pattern. I just hadn't named it that way until now.

## Guides and Sensors: The Fowler Taxonomy

The most rigorous taxonomy came from Martin Fowler and Birgitta Böckeler at Thoughtworks in March 2026.[^fowler2026] A harness organizes into **guides** (which steer the agent) and **sensors** (which verify it). Around those two blocks orbit the tools, memory, state, sandbox, loops, and policies I just described.

If you've read Chapter 4, you'll recognize most of these components under different names. What harness engineering adds is the explicit naming of guides versus sensors as distinct first-class concepts. That naming alone makes design decisions much easier to debate in a team meeting.

### Guides

Guides are everything that tells the agent what to do and how to behave:[^fowler2026][^bouchard2026]

- **Project instruction files** like `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, `.cursorrules`. These are the first place the agent looks when it starts work. Chapter 3 covers `AGENTS.md` as a context engineering artifact, with the empirical finding that systems using human-curated `AGENTS.md` achieve 28.64% reduction in runtime and 16.58% reduction in token usage, while LLM-generated versions actually perform 3% worse.[^chapter3]
- **Versioned system prompts** that carry role, scope, and constraints.
- **Architectural constraint documents**: dependency direction, naming conventions, coding rules, taste invariants.
- **Specifications and ADRs** that live in the repository as the source of record.
- **Rich tool descriptions**: the inline documentation of each tool is part of the guide.
- **Skills and prompt files** like `.prompt.md` and `.instructions.md`.

The golden rule from the OpenAI post: give the agent a map, not a thousand-page manual.[^lopopolo2026] The "one giant `AGENTS.md`" approach fails predictably. Context is a scarce resource. A giant instruction file crowds out the task, the code, and the relevant docs. When everything is "important," nothing is. And it rots fast. Instead, treat `AGENTS.md` as a table of contents (around 100 lines), pointing to deeper sources of truth in a structured `docs/` directory.

This is consistent with the three-tier architecture I described in Chapter 3. The `AGENTS.md` lives in Tier 1 Hot Memory. Deep documentation lives in Tier 2 Codified. Skills and tool implementations live in Tier 3 On-Demand. The harness moves the agent through tiers as the task progresses.[^chapter3]

### Sensors

Sensors observe what the agent did and validate. Two kinds:[^fowler2026]

**Deterministic sensors (computational).** Custom linters, type checkers, formatters. Structural tests that verify architectural invariants. Pre-commit hooks. Static analysis. Test coverage gates. Schema drift detectors. They're cheap, fast, run on every commit, and reliably catch structure, complexity, coverage, architectural drift, and style violations.

**Inferential sensors (LLM-based).** LLM-as-judge for code review. Semantic PR analysis. Semantic duplication detection. Documentation quality verification. They're more expensive and non-deterministic, but they catch semantic judgment that linters can't.

The combination is what produces robustness. LangChain consolidated a practical lesson worth internalizing: often the problem isn't the model, it's the missing sensor.[^langchain2026] When their agent kept entering loops, the fix wasn't to switch models, it was to add a loop detection middleware that aborts execution. When the agent kept declaring work complete without verifying, the fix was self-verification loops as a hard requirement. The Terminal Bench 2.0 jump from rank 30 to rank 5 came from sensors, not from the model.

This maps to the "Hooks as Zero-Cost Intent Enforcement" pattern I covered in Chapter 4.[^chapter4] Hooks (preToolUse, postToolUse, preCommit) are exactly the deterministic sensor mechanism, just under a different name in the Claude Code vocabulary. The harness vocabulary makes the pattern portable across tools.

## Harness Engineering as the Unifying Lens for the Stack

This section is the integration point with Chapters 1 through 5. If you've read them, you might be wondering whether harness engineering replaces them. It doesn't. It names what the stack already does, with vocabulary that's becoming the industry standard.

Every layer of the Context Platform Stack contributes specific components to the production harness. The mapping is direct:

| Context Platform Stack Layer | Harness Components It Provides | Where to Read More |
|------------------------------|--------------------------------|--------------------|
| **Layer 1: Cloud and Infrastructure** | Compute substrate, GPU allocation, the four-plane reference architecture, MCP as protocol layer, IaC for agentic systems | Chapter 1[^chapter1] |
| **Layer 2: Platform Engineering** | Golden paths (guides), guardrails (sensors), safety nets, manual review workflows, MCP server registry, agent RBAC | Chapter 2[^chapter2] |
| **Layer 3: Context Engineering** | `AGENTS.md` as guide, skills as packaged tools, three-tier memory architecture, CA-MCP shared context store, ACE patterns | Chapter 3[^chapter3] |
| **Layer 4: Intent Engineering** | `CONSTITUTION.md` as strategic guide, `SPECIFICATION.md` as gate input, hooks as deterministic sensors, SDD as gate workflow | Chapter 4[^chapter4] |
| **Layer 5: Integration** | Maturity model, model routing, security across the stack, ten principles, persona quick-starts | Chapter 5[^chapter5] |

The implication is direct: the Context Platform Stack is a framework for building organizational harnesses. The four prior layers compose into a production-grade harness. What this chapter adds is the unified vocabulary that lets you talk about the stack with industry peers without having to re-explain the framework from scratch.

If a CTO at a LATAM bank asks "what is our harness engineering approach?" the answer is: we apply the four-layer Context Platform Stack, materialized through one of two accelerators (Three Horizons or Open Horizons), grounded in the shared Azure plus GitHub plus Microsoft identity foundation. The next sections of this chapter cover each of those pieces.

I see three concrete benefits from naming the discipline this way:

**It connects you to the global conversation.** The vocabulary that emerged in February 2026 is what your peers are using at conferences, in analyst reports, in vendor documentation, in academic papers. Microsoft Agent Framework 1.0 has a layer literally called "Agent Harness."[^microsoft2026] Anthropic's Managed Agents documentation is built around the harness concept.[^anthropic2026] If your framework uses different vocabulary, you're translating constantly. Naming what you do as harness engineering ends the translation tax.

**It makes the failure modes legible.** When you say "the agent failed," that's diagnostic-poor. When you say "the harness lacks a deterministic sensor for this class of failure," you've already pointed at the fix. Later in this chapter I include a direct mapping of failure modes to the harness layer that prevents them. That's a tool you can give a junior engineer to use during incident review.

**It clarifies what's portable across the two accelerators.** Three Horizons (RHDH on ARO) and Open Horizons (Backstage on AKS) ship different stacks but implement the same harness discipline. When you talk about "the harness" instead of "the platform," the components map cleanly between the two. A custom linter is a custom linter regardless of whether it runs in OpenShift Pipelines or GitHub Actions. A `CONSTITUTION.md` is a `CONSTITUTION.md` regardless of whether the IDP is RHDH or Backstage. The harness vocabulary makes the portability explicit.

There's a fourth benefit that's harder to quantify but matters in practice: harness engineering is the term that gets you taken seriously by senior engineering leaders who track the field. CTOs and VPs of Engineering read Hashimoto, read the OpenAI engineering blog, read Martin Fowler. When you walk into a discovery session using their vocabulary, the conversation moves faster.


## Production Harness Patterns

Four patterns have consolidated in the 2026 literature. You'll see them appear repeatedly in real projects.

### Single-Session: The ReAct Loop

The simplest pattern. The agent receives an instruction, reasons, picks a tool, observes the result, and iterates until it hits the goal or exhausts its budget. The harness here is minimal: tools, system prompt, iteration limit, output parser.

When to use: short, focused tasks with clear success criteria, executable within a single context window. Examples: GitHub issue triage, document summarization, formatted report generation.

Limitations: doesn't cross context window boundaries, doesn't persist state, has no failure recovery mechanism.

### Multi-Session: Initializer plus Coding Agent

The pattern Anthropic described in "Effective harnesses for long-running agents."[^anthropic2026] It handles tasks that exceed the context window and require multiple sessions.

How it works:

1. The **initializer agent** runs only on the first session. It creates the structure: an `init.sh` script to start the environment, a `progress.txt` as the session-to-session log, an initial git commit, and a `feature-list.json` that expands the user prompt into a list of trackable features.
2. The **coding agent** runs on subsequent sessions. It reads progress, picks the next feature, implements, tests via Puppeteer or Playwright, updates progress, commits.

Technically these are the same underlying agent with different initial prompts. The important part is the externalization of state into versioned artifacts, turning long-term memory into legible, auditable files.

When to use: iterative construction of applications that exceed one session, codebase maintenance over days or weeks, projects where granular traceability is a requirement.

This pattern is exactly what I described in Chapter 3 as the three-tier architecture in motion.[^chapter3] Hot memory holds the current context. Tier 2 codified context holds the progress log and feature list. Tier 3 holds the deeper repository. The harness moves the agent through tiers as the task progresses.

### Multi-Agent: Planner, Generator, Evaluator

The central pattern from Anthropic's "Harness design for long-running application development," published in March 2026.[^anthropic2026]

Three agents with distinct roles:

- **Planner**: expands a short prompt into a complete product specification, deliberately leaving implementation details unspecified. Over-specification too early in the process cascades into downstream errors.
- **Generator**: implements features in sprints. Before writing code, it signs a "sprint contract" with the Evaluator: a shared definition of done.
- **Evaluator**: uses Playwright (or an equivalent framework) to click through the application like a real user, testing UI, API, and database behavior. If anything fails, the sprint fails.

The contrast in the paper is striking. A solo agent built a game that technically runs, but with broken entity-to-runtime connections at the code level, discoverable only by reading the source. The three-agent harness produced a functional game with consistent code, across autonomous sessions of multiple hours.

When to use: complex full-stack applications, products where internal quality matters as much as external behavior, contexts where you want to reduce human code review.

The Planner-Coder gap I described in Chapter 4 is exactly the structural problem this pattern addresses.[^chapter4] The arXiv research showed 75.3% of failures originate at the planner-coder interface. The Anthropic three-agent harness makes that interface explicit and adds an Evaluator that verifies execution against the plan. This is the operational implementation of intent engineering.

### Continuous Garbage Collection

The pattern OpenAI described in their post.[^lopopolo2026] On a regular cadence, background agents scan the repository looking for deviations: imports that cross layers, duplicated code, patterns that drift from style, inconsistent documentation, redundant tests. They open small refactor PRs that can be reviewed in under a minute and auto-merged.

OpenAI's analogy: technical debt as a high-interest loan. It's almost always better to pay it down continuously in small increments than to let it accumulate and tackle it in painful bursts. Human taste is captured once, then enforced continuously across every line.

When to use: large agent-maintained codebases, environments with high PR velocity, any project where entropy tends to accumulate.

This is the operational antidote to the cognitive debt and intent debt I described in Chapter 0.[^chapter0] Both forms of debt compound when nothing actively fights them. Garbage collection patterns make the fight continuous instead of episodic. It's the harness mechanism that prevents the cemetery I diagnosed in the introduction.

## The Seven-Step Implementation Playbook

This is the prescriptive section. The steps are sequential and cumulative. Each step delivers value on its own, but the combination is what produces the order-of-magnitude effect OpenAI reported.[^lopopolo2026]

### Step 1: Choose the Right Use Case

Before building any harness, decide where you'll apply it. Criteria for a good initial use case:

- **Verifiable success criterion**: is there a test, lint, or check that says "this is correct" without requiring expensive human judgment?
- **Repetitive work**: will the agent execute the same class of task many times, justifying the harness investment?
- **Material impact**: is the time or quality gain measurable and translatable into business metrics?
- **Containable risk**: are agent failures detectable and recoverable, or blocked by gates?

Strong examples for LATAM enterprise cases: issue triage and enrichment in large repositories; incremental modernization of legacy code (COBOL, Natural, Fortran) with equivalence tests; IaC pipeline generation and maintenance under policy as code; pull request review automation with architectural checklist; technical documentation generation from code.

The cases I see fail most often share the inverse pattern: vague success criteria, one-off work, marginal impact, unbounded risk. Don't start there even if the executive sponsor pushes you to.

### Step 2: AGENTS.md as a Map, Not an Encyclopedia

Create the project-level instruction file. For clients using GitHub Copilot, that's `.github/copilot-instructions.md`. For Codex, `AGENTS.md`. For Claude Code, `CLAUDE.md`. Keep it around 100 lines. The file should read as an index, pointing to deeper sources of truth in a structured `docs/` directory.

Three things to internalize:

1. The file points to other documents. It's the index, not the content.
2. Every rule that can be enforced mechanically is referenced as such ("enforced via custom linter").
3. It answers "where to look" more than "what to do."

Hashimoto's practical rule: start small, add rules when the agent fails repeatedly in the same place.[^hashimoto2026] If a rule is in `AGENTS.md` but the agent keeps violating it, either it needs to become a mechanical sensor, or it isn't being read.

This is consistent with the empirical finding I cited in Chapter 3: human-curated `AGENTS.md` files improve performance, while LLM-generated ones degrade it.[^chapter3] The curation discipline matters more than the file size.

### Step 3: Instrument Trajectories from Day One

A trajectory is the complete record of what the agent did in a session: prompts, tools called, outputs, errors, timings. Without trajectories you can't debug, and you can't improve.[^langchain2026]

Capture from the start. Decisions to make: where to store (LangSmith, Microsoft Foundry Observability, Application Insights, Datadog, or self-hosted Phoenix or Langfuse); granularity (per session, per turn, per tool call); retention (how long to keep for analysis and training); access (who in your organization can see the traces); PII filtering (what needs to be redacted before storage).

LangChain articulated this point well: every session run through a well-instrumented harness produces training data, evaluation data, and edge case documentation.[^langchain2026] Trajectories are compounding competitive advantage. Teams that capture from day one are two or three quarters ahead when it's time to fine-tune or evaluate.

This connects directly to the maturity map in Chapter 5.[^chapter5] Stage 3 (Structured) requires trajectory observability as a precondition. Stage 4 (Intent-Driven) requires that trajectories feed back into the intent metrics that detect drift.

### Step 4: Plant Deterministic Sensors

Before any LLM-as-judge, plant mechanical sensors. They're cheap, fast, and they catch most of the failures.

Minimum list for a coding agent harness: custom linter that enforces project architectural rules; type checker running on every PR; pre-commit hook that runs formatter, linter, and type checker locally before commit; structural tests that verify invariants (every domain class has a test, every endpoint has a documented schema); mandatory CI gate that blocks merge if any of the above fail; schema drift detector that alerts when API contracts change without versioning.

OpenAI's heuristic: if the agent fails repeatedly at something, encode the rule as a linter or structural test, not as text in an instruction file.[^lopopolo2026] In a human-first workflow these rules feel pedantic. In an agent-first workflow they're multipliers. Encoded once, applied everywhere at once.

In Chapter 4 I described this same pattern under the name "Hooks as Zero-Cost Intent Enforcement."[^chapter4] The vocabulary differs but the engineering is identical: catch the failure with a deterministic mechanism before it becomes a habit.

### Step 5: Mechanically Enforce Architecture

This step separates pilots from production. Instead of describing architecture in documents, encode it as mechanical constraints.

OpenAI described a layered architecture they enforce with a custom linter:[^lopopolo2026] within each business domain (App Settings, for example), the order is Types to Config to Repo to Service to Runtime to UI. Cross-cutting concerns (auth, connectors, telemetry, feature flags) enter only through Providers. Everything else is disallowed. Dependency direction is enforced at the CI level. Code can only reference layers forward through the sequence. The linter itself was written by Codex.

This is the kind of architecture you usually defer until you have hundreds of engineers. In agent-first engineering it becomes an early prerequisite, because the constraint is what allows speed without architectural decay.

Microsoft-stack equivalents: Bicep plus policy as code (Azure Policy) for IaC enforcement; custom analyzers in .NET (Roslyn) for code rules; custom ESLint rules for frontend; architecture tests with Spectral, NetArchTest, ArchUnit; branch protection rules in GitHub Enterprise.

### Step 6: Self-Verification Loops

Reasoning models can run autonomously for hours. Without self-verification, they declare tasks complete too early or keep modifying things that already worked.

Effective patterns:

- **Sprint contracts**: before implementing, the Generator and the Evaluator agree on a shared definition of done.[^anthropic2026]
- **Test-first orchestration**: the harness forces the agent to write the test before the code, and to make the test fail and then pass.
- **Browser automation testing**: for frontends, Playwright or Puppeteer clicking through the application like a real user.
- **The Ralph Wiggum loop**: OpenAI's name for the pattern where the agent reviews its own changes locally, requests additional reviews from other agents, responds to human and agent feedback, and iterates until all reviewers are satisfied.[^lopopolo2026]
- **Loop detection middleware**: if the same action sequence repeats N times, abort and escalate.[^langchain2026]

LangChain reported that adding self-verification loops and loop detection was one of the highest-impact changes in their jump from rank 30 to rank 5 on Terminal Bench 2.0.[^langchain2026]

### Step 7: The Continuous Improvement Loop

This is the step that defines the discipline. Every time the agent makes a mistake, you don't fix the output, you fix the environment so that mistake becomes structurally impossible to repeat.[^hashimoto2026]

The six-step cycle that synthesizes Hashimoto's methodology:

1. **Observe the failure** in a captured trajectory.
2. **Classify the root cause**: missing tool, missing context, missing guardrail, ambiguous instruction, or model capability?
3. **Decide the fix type**: new mechanical sensor, new tool, `AGENTS.md` update, new merge gate, or new sub-agent?
4. **Implement the fix** (preferably by having the agent itself write the fix, with human review).
5. **Add a regression test** that catches the failure if it returns.
6. **Audit future trajectories** to confirm the fix held.

Lopopolo's phrasing captures the spirit: when the agent struggles, treat it as a signal. Identify what is missing (tools, guardrails, documentation) and feed it back into the repository, always by having the agent itself write the fix.[^lopopolo2026]

This is the operational version of the discipline I described in Chapter 0: cognitive debt and intent debt compound silently.[^chapter0] The continuous improvement loop is what stops the compounding. It's also the practical mechanism that turns the four prior layers of the Context Platform Stack into a self-improving operating system.

## The Shared Microsoft Foundation

Before I get to the choice between Three Horizons and Open Horizons, let me make explicit something every LATAM engagement I run shares: a common Microsoft foundation. The accelerator changes, the IDP changes, the cluster changes. The foundation does not.

### What Every LATAM Enterprise Engagement Has in Common

Every client I work with operates the same shared substrate, regardless of which accelerator we choose:

| Layer | Components |
|-------|------------|
| **Cloud** | Azure (LATAM regions with data residency: Brazil South, Brazil Southeast, Chile Central, Mexico Central) |
| **Source control + DevOps** | GitHub Enterprise Cloud (with Advanced Security, Copilot Enterprise, Coding Agent) |
| **Identity** | Microsoft Entra ID + Entra Agent ID (for agent fleet identity) |
| **AI Platform** | Microsoft Foundry (multi-model: OpenAI, Anthropic, Meta, Mistral) + Microsoft Agent Framework 1.0 |
| **Governance** | Azure Policy, Defender for Cloud, Purview, Agent 365 |
| **Observability** | Azure Monitor, Application Insights, Foundry Observability |
| **LATAM Compliance** | Aligned for LGPD, BACEN, ANEEL, Habeas Data, Ley 19.628, Ley 1581 |

This is the common denominator. Every conversation starts here. What changes is the developer platform layer that gets built on top.

### GitHub Copilot Enterprise as the Coding Agent Harness

GitHub Copilot, in its enterprise product family, ships the canonical primitives for a coding agent harness. The complete kit:

| Primitive | Role in the harness | Where it lives |
|-----------|---------------------|----------------|
| `.github/copilot-instructions.md` | Repo-level guide | Repository root |
| `.instructions.md` files | Path-scoped guide | `.github/instructions/` |
| `.prompt.md` files | Reusable prompts | `.github/prompts/` |
| Custom chat modes | Personas and flows | `.github/chatmodes/` |
| GitHub Agentic Workflows | Loops and gates | `.github/workflows/` |
| MCP server configs | Tools | `.vscode/mcp.json` or server-side config |
| GitHub Copilot Coding Agent | Multi-session | Integrated into GitHub.com |
| Code review automation | Inferential sensor | Native in PRs |

Practical recommendation for a team starting out: create `.github/copilot-instructions.md` with the repo map (Step 2 of this playbook); add three to five `.instructions.md` files scoped by path; create two or three `.prompt.md` files for recurring tasks; configure custom chat modes for your team personas; use GitHub Agentic Workflows to automate the self-verification loop in PRs.

### Microsoft Agent Framework 1.0 and Foundry Agent Service

Microsoft Agent Framework, GA since April 3, 2026, ships a layer explicitly named "Agent Harness" in the official documentation.[^microsoft2026] The capabilities:

- **Local shell harness**: controlled host execution, with explicit approval before sensitive commands
- **Hosted shell harness**: managed execution environments in Azure
- **Context compaction**: built-in system that automatically manages history before each model call, keeping within the token budget
- **Multi-agent orchestration**: Group Chat, Sequential, Concurrent, Handoff patterns
- **A2A (Agent-to-Agent) protocol v1.0**: framework interoperability
- **MCP integration**: tools via Model Context Protocol
- **Agent Skills**: portable format for packaging domain expertise
- **Durable extensions** via Azure Functions

Microsoft Foundry Agent Service offers what Microsoft calls a "managed harness": agent harness as a managed service, at scale.[^microsoft2026] The components: hosted agents with versioning and weighted rollouts, managed long-term memory (Foundry memory in preview), Foundry Tools and Skills, Foundry Observability integrated with Azure Monitor, multi-model multi-harness by design.

The Microsoft insight on the compute model is important. Traditional compute (shared containers, web apps, serverless functions) was designed for web services where multiple users share instances. For agents that write files, execute code, and access credentials, that becomes an isolation nightmare. Hosted agents solve this with isolation per session. For LATAM clients with data sovereignty requirements, this is particularly relevant: you can run the entire harness inside Azure regions with data residency, while keeping the model layer pluggable.

### Entra Agent ID, Agent 365, Authorization Fabric

These are the governance layers of the harness at enterprise scale. The direct analogy: if the harness is the operating system for the agent, these three pieces are IAM, fleet management, and network policy.

- **Entra Agent ID**: managed identity for agents, with tokens, scopes, and audit trail
- **Agent 365**: lifecycle management for agent fleets, equivalent to Intune for agents
- **Authorization Fabric**: enforcement of permissions across tenant and resource boundaries for agent actions

When you combine the three with Microsoft Agent Framework and Foundry Agent Service, you have a stack where every agent action is authenticated, authorized, auditable, and revocable. That's the maturity level regulated sectors in LATAM (financial under BACEN, energy under ANEEL, healthcare under LGPD/ANS) need to move from pilot to production.

This is exactly the agent RBAC discipline I described in Chapter 2.[^chapter2] RBAC for agents is not a security feature added on top, it's a specification compliance feature engineered into the platform. Entra Agent ID is the Microsoft implementation of that discipline.

## Two Paths to the Same Destination

This is the section where I make explicit something I'd been telling clients in discovery sessions but hadn't committed to writing. The two accelerators I run in LATAM aren't competing strategies. They're two implementation paths to the same harness engineering destination, optimized for different client profiles.

### Why Two Accelerators

I learned through repeated client engagements that there's no single right developer platform stack for LATAM enterprise. The decision is shaped by prior investment, regulatory posture, internal expertise, and the client's appetite for vendor relationships. Forcing every client onto one stack means losing half the potential engagements. Maintaining two well-defined paths means meeting clients where they actually are.

The two paths share everything in the previous section: Azure as cloud, GitHub Enterprise for source control and DevOps, Entra Agent ID and Agent 365 for governance, Microsoft Agent Framework and Foundry Agent Service for the AI platform. What differs is the IDP and the cluster shape that materializes the harness.

The Three Horizons maturity model (Optimize Present, Emerging Capabilities, Transform Future) applies to both paths. The harness components map cleanly between them. The Horizon 3 destination is the same organizational harness in both cases. Only the implementation pillar changes.

### Path 1: Three Horizons Accelerator

For clients with prior Red Hat investment or strong commercial-support requirements, this path uses the Red Hat developer platform stack on Azure.

| Component | Technology |
|-----------|-----------|
| Internal Developer Platform | Red Hat Developer Hub (RHDH) |
| Cluster | Azure Red Hat OpenShift (ARO) |
| Native CI/CD | OpenShift Pipelines (Tekton) |
| GitOps | OpenShift GitOps (Argo CD) |
| Supply chain security | Red Hat Trusted Application Pipeline |
| Service mesh | OpenShift Service Mesh (Istio) |
| Support model | Red Hat Enterprise + Microsoft (joint strategic partnership) |
| AI assist | Red Hat Lightspeed (as it matures) + GitHub Copilot |
| Commercial model | Red Hat subscriptions + Azure consumption + GitHub Enterprise |

Stack-specific harness components in Three Horizons:

- **RHDH software templates** function as structured guides: the agent follows the template to generate new services, ensuring architectural invariants from the first commit
- **OpenShift Pipelines (Tekton)** act as deterministic sensors in the CI pipeline
- **OpenShift GitOps (Argo CD)** enforces deployment patterns the agent must respect
- **Red Hat Lightspeed**, as it matures, joins as an integrated platform-level assistance layer
- **Red Hat Trusted Application Pipeline** delivers supply chain security as a structural sensor

Three Horizons mapped to harness layers:

| Horizon | Focus | Harness layer |
|---------|-------|---------------|
| **H1: Optimize Present** | GitHub Copilot adoption, basic agentic workflows | Minimum harness per repo: `.github/copilot-instructions.md`, local MCPs |
| **H2: Emerging Capabilities** | RHDH as golden path, software templates, scorecards | Shared harness: RHDH software templates, custom linters, governed MCP servers |
| **H3: Transform Future** | End-to-end Agentic DevOps, autonomous operations | Multi-agent harness: Planner/Generator/Evaluator + continuous GC + Lightspeed ops |

### Path 2: Open Horizons

For Azure-native clients without Red Hat investment, or clients with strong internal expertise in the open source upstream, this path uses Backstage on AKS.

| Component | Technology |
|-----------|-----------|
| Internal Developer Platform | Backstage (open source upstream) |
| Cluster | Azure Kubernetes Service (AKS) |
| CI/CD | GitHub Actions + Argo CD or Flux |
| GitOps | Argo CD or Flux on AKS |
| Policy as code | Kyverno or OPA Gatekeeper |
| Supply chain security | GitHub Advanced Security + SLSA + Sigstore |
| Service mesh | Istio or Linkerd (client choice) |
| Support model | Microsoft (Azure + GitHub) + Backstage community + integrators |
| AI assist | GitHub Copilot + Microsoft Foundry Agent Service |
| Commercial model | Azure consumption + GitHub Enterprise (no Red Hat licensing) |

Stack-specific harness components in Open Horizons:

- **Backstage scaffolder templates** play the equivalent role to RHDH software templates as structured guides
- **Argo CD or Flux on AKS** deliver GitOps and drift enforcement
- **Kyverno or Gatekeeper** function as policy-as-code, deterministic sensors at admission control time
- **Azure Policy + Defender for Cloud** bring governance at the Azure platform level
- **Microsoft Foundry Agent Service** integrates as the governed hosted-agent layer
- **GitHub Advanced Security + GitHub Actions** complete the sensor pipeline

Three Horizons mapped to harness layers in Open Horizons:

| Horizon | Focus | Harness layer |
|---------|-------|---------------|
| **H1: Optimize Present** | GitHub Copilot adoption, basic agentic workflows | Minimum harness per repo: `.github/copilot-instructions.md`, local MCPs |
| **H2: Emerging Capabilities** | Backstage as golden path, software templates, plugins | Shared harness: Backstage scaffolder templates, custom linters, internal MCP servers |
| **H3: Transform Future** | End-to-end Agentic DevOps, autonomous operations | Multi-agent harness: Planner/Generator/Evaluator + continuous GC + Microsoft Foundry |

### Decision Criteria: Which Path for Which Client

Both accelerators reach the same Horizon 3 destination. The choice between them is a stack decision shaped by these factors:

| Factor | Tilts toward Three Horizons | Tilts toward Open Horizons |
|--------|------------------------------|------------------------------|
| Prior Red Hat investment | Already running RHEL, OpenShift, AAP | No prior Red Hat footprint |
| Regulatory requirements | Needs commercial enterprise support 24x7 | Internal team can hold the upstream |
| Vendor strategy | Wants "one throat to choke" (RH+MS) | Prefers minimum vendor count |
| RBAC and governance | Wants enterprise RBAC out of the box | Will configure RBAC as part of build |
| Plugin ecosystem velocity | Values certified plugin set | Values upstream release cadence |
| Cost structure | Accepts Red Hat subscriptions | Wants to minimize licensing line items |
| Internal expertise | Mixed engineering team | Strong Kubernetes upstream expertise |

Typical client profiles I see. Three Horizons fits financial services, energy, government, healthcare. Specific accounts in my LATAM portfolio: Petrobras, Caixa, Banco do Brasil, Bradesco, Porto, Pacifico Salud, Pacifico Seguros. Open Horizons fits digital-native enterprises, fintechs at scale, modern retailers, certain state-owned enterprises with strong internal engineering capability.

The decision tree is straightforward in practice. If the client already runs OpenShift on-prem and wants Red Hat to be part of the strategic conversation, Three Horizons. If the client is Azure-native and treats Red Hat as one more vendor they'd rather not add, Open Horizons. If the client is split, run a one-day comparative discovery and let the team's center of gravity decide.

### Convergence at Horizon 3

Both paths terminate at the same conceptual destination. At Horizon 3, the organizational harness includes the same components, just materialized through different technology stacks: standardized software templates (RHDH or Backstage scaffolder); custom linters enforcing architectural invariants across the portfolio; internal MCP servers exposing corporate systems with governance; versioned domain skills (financial-services, energy, manufacturing, government); `CONSTITUTION.md` and `SPECIFICATION.md` per project as intent guides; hooks (preToolUse, postToolUse, preCommit) as deterministic sensors; multi-agent harness (Planner / Generator / Evaluator) for complex tasks; continuous garbage collection agents fighting entropy; Entra Agent ID for fleet identity; trajectory observability stack capturing every session; compliance integration for LGPD, BACEN, ANEEL, sector-specific regimes.

The message I deliver to clients in discovery: harness engineering is the discipline, we have two accelerators to implement it, pick the one that fits your stack, and you'll arrive at the same Horizon 3 capability either way. That positioning works because it's true, and because it removes the false either-or that makes clients hesitate.

## Failure Modes and the Layer That Prevents Them

This table is an operational reference. When you see one of these failures in a captured trajectory, the column on the right is the first hypothesis for the fix.

| Failure mode | Symptom | Harness layer that prevents it |
|--------------|---------|--------------------------------|
| Cross-layer imports | Domain code references infrastructure | Custom dependency direction linter |
| Disable rule to make CI pass | Agent edits `.eslintrc` to turn off a rule | Locked config files, structural test blocking the edit |
| Premature task completion | Agent declares done without running E2E tests | Mandatory sprint contract, separate evaluator |
| Context overflow | Agent forgets the goal after N turns | Context compaction, persistent progress file |
| Stale spec treated as current | Agent follows an outdated memo | Versioned `docs/` as system of record |
| Architectural drift | Each feature uses a different pattern | Continuous garbage collection, codified taste invariants |
| Tool misuse / wrong API call | Calls with wrong shape | Typed SDKs, schema validation at the boundary |
| Agent loop | Same sequence repeats indefinitely | Loop detection middleware, max iterations |
| Misdiagnosis of root cause | Fix addresses symptom, not cause | LLM-as-judge for review, RCA requirement in PR template |
| Over-engineering | Agent adds complexity that wasn't requested | YAGNI enforcement, strict sprint contract |
| Documentation rot | Docs diverge from code | Background agent detecting inconsistencies |
| Secret leak | Agent logs or commits a credential | Pre-commit hook (gitleaks), sandbox without secret access |
| Destructive action without confirmation | Agent runs `rm -rf` or deletes data | Approval-required policy, allowlist of commands |
| Cross-tenant memory | Agent leaks state between clients | Hosted agents with per-session isolation |

The right way to read this table: none of these failures is solved with a better prompt. All of them require a structural piece of the harness. That's the central argument of this chapter.

The mapping also matches the failure mode discussion in Chapter 5, where I discussed the agent cemetery anti-pattern.[^chapter5] Every failure in the cemetery has a corresponding harness gap. The diagnosis becomes mechanical once you've named the components.

## Metrics and Observability for Harnessed Agents

You can't improve what you don't measure. The minimum dashboard for a harness in production has three layers.

**Operational metrics**: task success rate, time-to-completion, iterations per task, tool call distribution, token cost per task, human intervention rate, regression rate, time-to-first-PR. These tell you whether the harness is delivering reliability and speed.

**Code quality metrics for generated code**: test coverage maintained or growing, cyclomatic complexity per function, TODO/FIXME comment density, code duplication, vulnerabilities introduced (SAST), time to vulnerability remediation. These are exactly the metrics I argued for in Chapter 5 under "Measuring What Matters: Beyond DORA."[^chapter5] The CMU and BNY Mellon study identified six dimensions that traditional frameworks miss: self-sufficiency, frustration and cognitive load, task completion, peer review quality, technical expertise development, and code ownership. These dimensions belong in your harness dashboard.

**Trajectory observability**: every session must be inspectable. Minimum fields to capture: session_id, agent_id, model_id, harness_version; complete sequence of prompts, tool calls, tool results; time per step; tokens consumed per step; costs; harness decisions (loop aborted, escalation triggered, gate failed); final result and reason.

Evals aren't a one-off acceptance test, they're a continuous process. A well-designed eval has a golden set of representative prompts; runs in CI on every harness change (system prompt, `AGENTS.md`, tool addition); compares result against baseline and blocks regressions; captures both quantitative metrics and qualitative judgment via LLM-as-judge.

Recommended frameworks: Microsoft Foundry Evaluations, LangSmith Evals, Inspect AI, Promptfoo, DeepEval.

## Adoption Roadmap for LATAM Enterprise

This is a starting plan I use in discovery sessions with LATAM enterprise clients. Adjust to client maturity.

### Days 1 to 30: Foundation

**Week 1: Discovery.** Four-hour workshop covering AI maturity assessment and identification of two or three candidate use cases. Stakeholder identification across engineering, security, compliance, sourcing. Current stack mapping (GitHub, Azure, Microsoft 365, observability tools). Path selection using the decision criteria for Three Horizons or Open Horizons.

**Week 2: Pilot use case.** Pick the first use case using the Step 1 criteria. Define measurable success criterion. Set baseline (current time, current quality, current cost).

**Week 3: Minimum harness.** Create `.github/copilot-instructions.md` in the pilot repository. Set up trajectory instrumentation. Define minimum approval policy.

**Week 4: First experiment.** Run the use case with the minimum harness. Capture trajectories. Retrospective: what worked, what didn't.

### Days 31 to 60: Maturation

**Weeks 5-6: Sensors.** Implement custom linters for the domain. Set up structural tests. Integrate with CI: mandatory gates.

**Week 7: Architectural enforcement.** Encode the three to five most important architectural rules as mechanisms. Train the team on how the linter works. Rewrite `AGENTS.md` to point to the mechanisms.

**Week 8: Self-verification.** Add test-first prompts. Set up browser automation testing where applicable. Integrate LLM-as-judge for PR review.

### Days 61 to 90: Scale

**Week 9: Governance.** Set up Entra Agent ID for the agents in use. Define per-action-type approval policy. Configure complete audit trail.

**Week 10: Replication.** Apply the same pattern to a second repository. Identify what's generic (goes to the platform team) and what's specific (stays in the repo). Begin "harness as a platform."

**Week 11: Measurement.** Compare against baseline. Calculate ROI (time saved, incremental quality, cost). Stakeholder presentation.

**Week 12: Roadmap.** Define the next-six-months roadmap. Use cases 2 and 3. Platform team investment. Internal communication plan.

## Synthesis: From Stack to Operating Model

I started this chapter by asking why I needed a sixth chapter when I thought the framework was complete. Here's the answer, reduced to its essentials.

The Context Platform Stack (Chapters 1 to 5) gives you the engineering framework: four interdependent layers (Cloud, Platform, Context, Intent) plus the Integration Playbook. The framework diagnoses why pilots die and prescribes how to design each layer to prevent that death.

Harness engineering (this chapter) gives you the operating model: how the four layers compose into a coherent agent harness in production, how the harness is governed across the lifecycle of the agent, and how you implement that harness through one of two accelerators on a shared Microsoft foundation.

You don't pick between the framework and the operating model. You operate the framework through the operating model. The framework tells you what to build. The operating model tells you how to run it as a production system that improves over time.

The six chapters of this playbook now form a complete arc:

- Chapter 0: the diagnosis (the agent cemetery and the three types of debt)
- Chapter 1: the substrate (cloud and infrastructure)
- Chapter 2: the governance layer (platform engineering)
- Chapter 3: the cognition layer (context engineering)
- Chapter 4: the strategic layer (intent engineering)
- Chapter 5: how the layers integrate (model routing, security, metrics, ten principles)
- Chapter 6: the operating model that runs all of it as a production harness, with two implementation paths for LATAM enterprise

Read together, these six chapters give you everything you need to stop building agents you'll have to bury, and start building harnesses you can operate, audit, and improve. The cemetery exists because teams optimized for pilots instead of production. The Context Platform Stack and harness engineering, applied together, invert that priority.

That's the complete framework. From here, the work is execution.

---

## References

[^chapter0]: Paula Silva. (2026). The Context Platform Stack: Introduction. Chapter 0 of this playbook.

[^chapter1]: Paula Silva. (2026). The Context Platform Stack: Cloud and Infrastructure Foundation. Chapter 1 of this playbook.

[^chapter2]: Paula Silva. (2026). Platform Engineering as Governance Middleware. Chapter 2 of this playbook.

[^chapter3]: Paula Silva. (2026). The Context Platform Stack: Context Engineering. Chapter 3 of this playbook.

[^chapter4]: Paula Silva. (2026). Intent Engineering: Encoding Organizational Purpose Into Agent Infrastructure. Chapter 4 of this playbook.

[^chapter5]: Paula Silva. (2026). Integration: The Practical Playbook. Chapter 5 of this playbook.

[^hashimoto2026]: Hashimoto, M. (2026, February 5). My AI Adoption Journey. https://mitchellh.com/writing/my-ai-adoption-journey

[^lopopolo2026]: Lopopolo, R. (2026, February 11). Harness engineering: leveraging Codex in an agent-first world. OpenAI Engineering Blog. https://openai.com/index/harness-engineering/

[^langchain2026]: LangChain. (2026, February 17). Improving Deep Agents with harness engineering. https://blog.langchain.com/improving-deep-agents-with-harness-engineering/

[^fowler2026]: Böckeler, B. (2026, March). Harness engineering for coding agent users. martinfowler.com. https://martinfowler.com/articles/harness-engineering.html

[^anthropic2026]: Rajasekaran, P. (2026, March 24). Harness design for long-running application development. Anthropic Engineering. https://www.anthropic.com/engineering/harness-design-long-running-apps

[^microsoft2026]: Microsoft Agent Framework Team. (2026, April). Microsoft Agent Framework Version 1.0 and Agent Harness in Agent Framework. https://devblogs.microsoft.com/agent-framework/microsoft-agent-framework-version-1-0/

[^chawla2026]: Chawla, A. (2026, April). The Anatomy of an Agent Harness. https://blog.dailydoseofds.com/p/the-anatomy-of-an-agent-harness

[^bouchard2026]: Bouchard, L. (2026, March). Harness Engineering: The Missing Layer Behind AI Agents. https://www.louisbouchard.ai/harness-engineering/

[^parallel2026]: Parallel Web Systems. (2026). What is an agent harness in the context of large-language models? https://parallel.ai/articles/what-is-an-agent-harness

[^millidge2023]: Millidge, B. (2023). LLMs as the new operating system. Personal essay, resurfaced and cited throughout 2026 as the conceptual antecedent of harness engineering.
