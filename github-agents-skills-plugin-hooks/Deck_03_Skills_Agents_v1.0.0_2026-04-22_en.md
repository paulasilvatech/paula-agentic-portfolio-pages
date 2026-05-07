---
title: "GitHub Copilot Mastery — Deck 03: Skills & Agents"
description: "Building chatmodes, subagents, and skill packs for GitHub Copilot using .github/agents/, .github/skills/, and .github/hooks/"
author: Paula Silva
date: 2026-04-22
version: 1.0.0
status: active
locale: en
deck: 03
series: "GitHub Copilot Mastery"
slide_count: 45
tags:
  - github-copilot
  - chatmodes
  - subagents
  - skills
  - agents
  - orchestration
  - governance
  - agentic-devops
---

# GitHub Copilot Mastery — Deck 03: Skills & Agents

> Part 3 of 5 in the GitHub Copilot Mastery series. This deck moves past single-prompt Copilot Chat into reusable, routed, governed agent configurations that live in the repository.

## Part I — Mental Model: Chatmode vs Subagent

### Slide 01. Title
**Skills & Agents: Routing Work Inside GitHub Copilot**
Kicker: `GITHUB COPILOT MASTERY · DECK 03 · 2026-04-22`
Subtitle: Chatmodes, subagents, and skill packs that live next to your code.
Author strip: Paula Silva, AI-Native Software Engineer · Global Black Belt, Microsoft Americas.

### Slide 02. Why this deck exists
Copilot Chat is already in every editor the team opens. What it lacks, by default, is repeatable behavior: every prompt relearns the repo, re-states the constraints, re-argues the conventions. Skills and subagents move that repeated context out of the prompt and into the repository, so the same team answers the same way every time.

Three outcomes this deck is trying to buy:
- Repeatable reasoning: the same question produces a grounded answer across people and PRs.
- Routed work: the right specialist handles the right task instead of the generalist guessing.
- Auditable governance: every automated action leaves a trace in the repo.

### Slide 03. The two things we keep confusing
| Concept | What it is | Lives in |
|---|---|---|
| Chatmode | A named Copilot Chat persona with pre-loaded context, tools, and tone | `.github/chatmodes/*.md` |
| Subagent | An independently executable agent with its own identity, scope, and delegated task | `.github/agents/*.md` |
| Skill | A reusable, domain-specific capability pack: templates, workflows, validation | `.github/skills/*.md` |
| Hook | Automatic pre/post/error logic that wraps every agent run | `.github/hooks/*` |

Chatmode = who you talk to. Subagent = who gets sent out to do the work. Skill = what they know. Hook = the rails they run on.

### Slide 04. The 6 layers of the final prompt
Source: adapted from the Prompt Integration diagram. Every Copilot response is assembled from six layers at runtime:

1. **Layer 0 — User prompt.** What the user typed in Copilot Chat.
2. **Layer 1 — System prompt.** Base model persona, set by GitHub.
3. **Layer 2 — Custom instructions.** `.github/copilot-instructions.md` and scoped `.instructions.md`.
4. **Layer 3 — Scoped rules.** File-type, folder, or chatmode-specific instructions.
5. **Layer 4 — Agent identity.** `.github/agents/*.md` for the subagent in play.
6. **Layer 5 — Skill.** `.github/skills/*.md` loaded for the current task.

Rule: later layers refine earlier ones, they never contradict them. If Layer 1 forbids running terminal commands, no skill can grant them.

### Slide 05. When to use what (decision tree)
Source: Decision Tree — Agent vs Skill. Answer four questions in order:
1. Does the task require **specific tools** (MCP, APIs, dedicated CLIs)? → if yes, custom subagent + skill.
2. Does the task require a **specific personality or tone** (security-strict, docs-friendly)? → if yes, custom subagent + skill.
3. Does the task involve **multiple stages with handoff between agents**? → if yes, custom subagent + skill.
4. Does a **skill already exist** for the domain? → if yes, generalist Copilot + skill. If no, generalist Copilot alone.

Three outcomes, in plain English:
- **Custom subagent + skill** — domain-specialized work. Examples: security review with vault access, migration agent with Terraform, release agent with GitHub Actions.
- **Generalist Copilot + skill** — structured knowledge work. Examples: generating a DOCX, drafting an ADR, building a Mermaid diagram.
- **Generalist Copilot alone** — quick calls. Examples: rename a variable, explain a regex, brainstorm a PR title.

### Slide 06. Why this matters operationally
Single-prompt Copilot already answers the question. What skills and subagents buy you is the **second time, tenth time, hundredth time** the question comes up. The cost of the first skill is high, the cost of the 100th answer it produces is near zero.

The failure mode we are avoiding: every new hire rediscovers the same prompts, every new repo relearns the same conventions, every PR surfaces the same nitpicks because nothing was ever written down in the agent layer.

## Part II — Building a Chatmode

### Slide 07. Anatomy of a chatmode file
A chatmode lives at `.github/chatmodes/{name}.md` and is a Markdown file with YAML frontmatter. Minimum contract:

```yaml
---
name: security-reviewer
description: Reviews PRs for security issues against our threat model
tools:
  - read_repo
  - run_codeql
  - search_cve
applyTo: "**/*.{ts,py,go}"
---
```

Body: a focused system prompt describing identity, tone, workflow, and validation. Keep it under 120 lines — bigger chatmodes drift.

### Slide 08. The SFA test
Every chatmode must pass the **SFA test** from the skill lifecycle:
- **Scope**: what this mode is for, and what it explicitly refuses.
- **Format**: the output shape — PR comment, inline code, table, checklist.
- **Audience**: who reads the output — reviewer, author, auditor, support.

If you cannot answer all three in one sentence each, the chatmode is not ready.

### Slide 09. Chatmode vs subagent (when to pick which)
| Dimension | Chatmode | Subagent |
|---|---|---|
| Runtime | Interactive, human-in-loop | Autonomous, headless or triggered |
| Scope | One conversation | One task in a pipeline |
| Tools | Shared editor session | Dedicated tool list |
| Persistence | Identity only | Identity + handoff rules |
| Good for | Code review, Q&A, pairing | CI steps, background jobs, multi-stage delivery |

Practical rule: if you expect a human to refine the output turn-by-turn, it is a chatmode. If you expect another agent or a workflow to consume the output, it is a subagent.

### Slide 10. Example: `security-reviewer` chatmode
A complete example follows the SFA test and keeps the body short.

```markdown
---
name: security-reviewer
description: Reviews PRs for OWASP Top 10 + internal threat model
tools: [read_repo, run_codeql, search_cve, read_prs]
applyTo: "**/*.{ts,py,go,tf}"
---

You are a security reviewer. You refuse to write feature code. On every
PR you:
1. Check the diff against OWASP Top 10 (2021).
2. Run CodeQL locally via `run_codeql` for the changed files only.
3. Flag hardcoded secrets, broken authn/authz, SSRF, and unsafe deserialization.
4. For each finding, output: severity, file:line, one-line impact, one-line fix.

Format: GitHub Markdown table, sorted by severity.
Refuse: refactors, feature work, doc-only review.
Escalate: if a finding is critical AND the author is a first-time contributor,
tag @security-oncall in the reply.
```

### Slide 11. Testing a chatmode before shipping it
The skill lifecycle is explicit: you do not ship without a test pass. For chatmodes, test three prompts:
1. The happy path (a PR with one obvious finding).
2. The refuse path (a PR that asks the mode to do something out of scope).
3. The edge path (a PR with no findings — does it say so cleanly?).

Ship when all three produce the expected shape. Archive the transcripts next to the chatmode file so future edits have a baseline.

## Part III — Building a Subagent

### Slide 12. Subagent file layout
Subagents live at `.github/agents/{name}.md`. Same Markdown + YAML structure, richer frontmatter:

```yaml
---
name: migration-agent
description: Executes multi-step Terraform + Helm migrations
identity:
  role: Infrastructure migration engineer
  tone: terse, operator-grade
tools:
  - terraform_plan
  - terraform_apply
  - helm_upgrade
  - read_repo
handoff:
  next:
    - name: security-reviewer
      when: "terraform_plan.changes.includes('iam')"
    - name: release-agent
      when: "terraform_apply.success == true"
applyTo: "infra/**"
---
```

### Slide 13. Identity, tools, handoff (the three fields that matter)
- **Identity** pins the subagent's voice and role so prompts stay consistent.
- **Tools** is the allow-list. Nothing outside it runs, even if the body mentions it.
- **Handoff** is how you express multi-stage work without a workflow engine.

Handoff rules should be evaluated by the orchestrator, not authored by the subagent itself. The subagent declares intent ("hand off if IAM changed"), the orchestrator enforces it.

### Slide 14. The orchestrator pattern
Source: Orchestration Flow — Agents + Skills. At runtime Copilot Chat acts as the **orchestrator agent**:
1. Receives the user request.
2. Loads its own identity from `.github/agents/orchestrator.md` (or the default).
3. Detects task type (code, doc, diagram, test, review).
4. Loads the matching skill from `.github/skills/`.
5. Decides the path: specialized subagent or generalist.
6. Executes.
7. Validates against the skill's checklist before responding.

The user never talks to the subagent directly. Every request returns through the orchestrator.

### Slide 15. Path A vs Path B
| Path | Condition | Shape |
|---|---|---|
| **Path A** — Custom subagent + skill | Specialized tools, tone, or multi-stage handoff | Orchestrator → subagent → skill → tools → orchestrator |
| **Path B** — Generalist + skill | Skill covers the task, no specialist needed | Orchestrator → skill → tools → orchestrator |

Both paths converge at the same validation step. The user cannot tell which path ran from the output shape, only from the trace.

### Slide 16. Handoff deep-dive (sequence)
Source: Agent Handoff Flow. A complete feature delivery pipeline, same pattern we use for "build a login feature with tests and security review":

1. **User** → Orchestrator: "Create login feature with tests and security review."
2. **Orchestrator** → **Planning Agent**: delegates planning with full context. Returns: structured plan with acceptance criteria.
3. **Orchestrator** → **Coding Agent**: passes plan + accumulated context. Returns: implemented code + file metadata.
4. **Orchestrator** → **Testing Agent**: passes code + plan + criteria. Returns: tests + execution results.
5. **Orchestrator** → **Security Agent**: passes code + tests + results. Returns: security report with findings.
6. **Orchestrator** → User: assembles everything, ships the bundle.

### Slide 17. Context accumulation rule
Every handoff passes **the new input plus everything that came before**. The coding agent sees the plan. The testing agent sees plan + code. The security agent sees plan + code + tests + results. The orchestrator is the hub — no subagent talks directly to another subagent.

This is the single most-missed rule in custom pipelines. If you let subagents call each other directly, you lose the trace, and the orchestrator can no longer inject guardrails between steps.

### Slide 18. Artifact chaining
Each subagent produces **typed artifacts** the next one consumes:
- Planning → `plan.md` (requirements, acceptance criteria, file list).
- Coding → `diff.patch` + `files.json` (what changed, what was added).
- Testing → `tests/*.spec.ts` + `run-report.json`.
- Security → `security-report.md` (severity, file:line, fix).

If the next agent does not know the shape of the previous agent's artifact, your pipeline is fragile. Define artifact contracts in the skill, not in the agent body.

### Slide 19. Synchronous pipeline, by default
The handoff pattern shown here is **strictly sequential**. Each agent completes before the next begins. Parallel handoffs are possible but rare — they require the orchestrator to merge divergent artifact states, which is where most multi-agent systems break.

Start synchronous. Move to parallel only after you have a working sequential pipeline and a concrete reason (latency, independence of the tasks).

## Part IV — Skills: The Reusable Knowledge Layer

### Slide 20. What a skill actually is
A skill is **the third actor** in every run. Not the agent (who it is), not the prompt (what the user asked), but **what the agent knows about this type of task**. It ships as `.github/skills/{name}.md` with scripts, references, and examples beside it.

Skills are the answer to "I keep re-explaining the same thing." If you write the explanation once in a skill, every agent that loads the skill stops re-explaining it.

### Slide 21. Skill lifecycle — the 3 essential phases
Source: Complete Skill Lifecycle. Every skill must complete:

1. **Identify & Organize.** Name it, scope it, pass the SFA test. Folder + filename convention.
2. **Create the structure.** SKILL.md with YAML frontmatter (`description`, `globs`, `alwaysApply`) and five sections: purpose, domain rules, workflow, output templates, validation checklist.
3. **Estimate distribution.** Repo-wide, folder-scoped, or project-specific. Set `applyTo` to control activation.

If any of these three is missing, the skill is not a skill — it is a note.

### Slide 22. Optional phases (power-ups)
4. **Scripts** (`scripts/`): Python, Bash, or Node automation with shebangs, argv validation, and error handling. Place under `.github/skills/{name}/scripts/`.
5. **References & examples**: pre-built templates, API docs, worked examples. Every skill gets measurably better with three canonical examples.

### Slide 23. Quality phase (the ship gate)
6. **Validate & test**: run the skill end-to-end with real prompts. Every checklist item must pass. Every section of SKILL.md must produce its advertised behavior.
7. **Distribute**: publish, confirm discovery, confirm activation via globs or `applyTo`.

Skills that skip the quality phase become skills nobody uses because nobody trusts them.

### Slide 24. Skill maturity model (5 levels)
| Level | Shape | Signal |
|---|---|---|
| **L1** | ~40-line SKILL.md body only | "We wrote down the happy path." |
| **L2** | + references, completed templates | "It is copy-pasteable." |
| **L3** | + scripts, portals, enriched content | "It is automatable." |
| **L4** | + automated tests, CI validation | "It cannot silently regress." |
| **L5** | Full production: distribution, ownership, versioning | "It has a maintainer and a changelog." |

Target L3 for most repo-local skills. Reach L4 for anything in a shared org-wide repo.

### Slide 25. Skill frontmatter reference
```yaml
---
name: create-adr
description: Produces a proper ADR from a one-line decision
applyTo: "docs/adrs/**"
globs: ["docs/adrs/**/*.md"]
alwaysApply: false
version: 1.2.0
owner: platform-eng
---
```

`alwaysApply: true` should be rare. It forces the skill into every context, which clogs the prompt budget. Default to `false` and rely on `applyTo` / `globs` for activation.

### Slide 26. Example: `create-adr` skill body
Minimum viable body under the frontmatter:

```markdown
## Purpose
Convert a one-line architecture decision into a full ADR that survives onboarding.

## Domain rules
- File name: `NNNN-short-kebab.md` (zero-padded, sequential).
- One decision per file. Never edit a shipped ADR; supersede it instead.
- Status: Proposed | Accepted | Deprecated | Superseded.

## Workflow
1. Propose title + status.
2. Draft Context, Decision, Consequences.
3. List alternatives considered with one-line rejection reason each.
4. Link to the PR that shipped the decision.

## Output template
(See examples/adr-template.md)

## Validation
- [ ] Filename follows NNNN-short-kebab.md
- [ ] Status is set
- [ ] Consequences include at least one negative
- [ ] Alternatives section has >= 2 options
```

### Slide 27. Skills vs chatmodes vs subagents — on one page
| File | Answers | Lives in | Loaded by |
|---|---|---|---|
| `.github/chatmodes/*.md` | Who am I talking to? | Chat dropdown | User switches modes |
| `.github/agents/*.md` | Who am I sending out? | Orchestrator | Matched by task type |
| `.github/skills/*.md` | What do they know? | Any agent | Matched by `applyTo`/`globs` |
| `.github/hooks/*` | What runs around them? | System | Matched by trigger |
| `.github/copilot-instructions.md` | What are the repo rules? | All of the above | Always |

Skills compose with everything else. A chatmode can load a skill. A subagent can load a skill. That is why skills are the highest-leverage artifact in the system.

## Part V — Hooks: The Governance Rail

### Slide 28. What hooks are, in one sentence
Hooks are **automatic logic that fires before, after, or on error of every agent run**. They are not callable by agents — agents cannot opt out. Hooks are the guardrail layer the system enforces on top of every configuration.

Analogy: hooks are the **sensors in a factory**. Entry sensor (pre-hook) checks raw material. Exit sensor (post-hook) checks quality. Emergency sensor (error-hook) stops the line. None of them make the product; all of them make sure the product is safe to ship.

### Slide 29. What triggers a hook
Source: Hooks Lifecycle. Four trigger categories:

| Trigger | Examples |
|---|---|
| **Scheduled** | Cron, periodic repo scan, nightly dependency check |
| **GitHub event** | Push, PR opened, issue created, release tagged |
| **User command** | `/test`, `/deploy`, `/review`, `/migrate` |
| **State change** | Build failed, PR approved, merge completed |

Most teams start with GitHub-event hooks (they are free) and state-change hooks (they catch regressions). Scheduled hooks come later. User-command hooks are high-value but require discipline.

### Slide 30. The lifecycle — pre, execute, post, error
1. **PRE-HOOK**: validates pre-conditions, loads context, verifies permissions.
   *Example*: before generating code, check that `.instructions.md` has style rules for this file type.
2. **EXECUTION**: the agent does its work with its tools and skill.
   *Example*: testing agent generates test cases.
3. **POST-HOOK** (success path): validates results, notifies, logs, triggers the next agent.
   *Example*: after tests are generated, notify the security agent for review.
4. **ERROR-HOOK** (failure path): captures the error, attempts fallback, notifies the team, logs the incident.
   *Example*: if the build breaks, the hook triggers a diagnostic agent.

### Slide 31. Hooks are mandatory guardrails
The system enforces hooks. Agents cannot skip them. This is deliberate — hooks are how you pin invariants that must always hold (no secrets in diffs, every migration gets reviewed, every merge posts a release note).

If you find yourself wanting to let an agent skip a hook, the hook is wrong: either too strict, or in the wrong place. Never give agents a `skip_hook` tool.

### Slide 32. Error isolation
The error-hook is the single most-important hook. Without it, failures propagate silently and the orchestrator loses the trace. With it:
- Every failure has an owner (the hook logs who and where).
- Every failure has a fallback (the hook can retry, escalate, or quarantine).
- Every failure produces an artifact (the incident log becomes input for the next run).

### Slide 33. Chaining via post-hooks
Post-hooks are how multi-agent pipelines compose without a workflow engine. After the planning agent succeeds, its post-hook triggers the coding agent. After the coding agent succeeds, its post-hook triggers the testing agent. And so on.

The handoff flow in Slide 16 is literally a chain of post-hooks. If you remove the post-hooks, the chain breaks and the orchestrator has to do manual routing every time.

### Slide 34. Hook authoring — a minimal example
A pre-hook that blocks code generation if repo rules are missing:

```yaml
# .github/hooks/pre-codegen.yaml
name: require-instructions
trigger: user_command
when: "/code"
run: |
  if [ ! -f .github/copilot-instructions.md ]; then
    echo "Blocked: .github/copilot-instructions.md is missing." >&2
    exit 1
  fi
```

A post-hook that notifies on success:
```yaml
# .github/hooks/post-test.yaml
name: notify-security-on-pass
trigger: state_change
when: "test.result == 'pass'"
run: gh issue create --label "security-review" --title "Tests passed, security review requested"
```

## Part VI — Orchestration Patterns

### Slide 35. Pattern 1 — Specialist pool
One orchestrator, several specialist subagents, no pipeline. The orchestrator routes each request to the right specialist based on task type.

When to use: your repo has **several distinct kinds of work** (security, infra, docs, testing), each deserving its own voice and tools, but the tasks do not depend on each other.

Failure mode: over-routing. If 80% of tasks go to the same specialist, collapse it back into the generalist + skill pattern.

### Slide 36. Pattern 2 — Sequential pipeline
The handoff flow in Slide 16. Plan → Code → Test → Review. Each stage gates the next.

When to use: you are shipping a feature end-to-end and every stage has a different success criterion.

Failure mode: brittle artifacts. If the stages disagree on what a "plan" looks like, the pipeline halts at handoff 2.

### Slide 37. Pattern 3 — Parallel fan-out
Orchestrator dispatches the same input to multiple subagents, merges the results. Common for review: security, performance, and accessibility all look at the same diff.

When to use: reviews, audits, multi-angle analysis.

Failure mode: merge conflicts. Plan the merge step explicitly — whose finding wins when two agents disagree?

### Slide 38. Pattern 4 — Recursive refinement
Orchestrator runs the same subagent multiple times, feeding output back as input, until a stop condition. Common for long writing tasks (draft → critique → revise).

When to use: content generation where quality comes from iteration.

Failure mode: no stop condition. Always cap iterations (typically 3) and always require a critique-artifact to justify another pass.

### Slide 39. Anti-pattern — agents talking to agents directly
Never let a subagent call another subagent. Route everything through the orchestrator. If subagents talk directly, you lose:
- The audit trail (who called whom, with what context).
- The hook rail (pre/post/error cannot fire cleanly).
- The ability to inject new guardrails later.

This is the single largest cause of "my agent system became a black box."

## Part VII — Governance & Operations

### Slide 40. Ownership model
Every file in `.github/agents/`, `.github/skills/`, `.github/hooks/` must have an owner in its frontmatter:

```yaml
owner: platform-eng
reviewers: [@security-oncall, @paula]
```

Ownership means: who reviews changes, who gets paged on hook failures, who decides when to deprecate. Without owners, these files rot faster than any other code in the repo.

### Slide 41. Versioning and archive
Same rule as the design system: **never overwrite a version**. When you change a skill, chatmode, or subagent:
1. Bump the version in frontmatter.
2. Archive the previous version to `.github/archive/{type}/{name}_v{old}.md`.
3. Commit both in the same PR.

Rationale: subagent configs are code. They affect every agent run that loads them. Silent edits create silent regressions.

### Slide 42. Trace every run
Every agent run must produce a trace: which chatmode/subagent loaded, which skill activated, which hooks fired, which artifacts were produced. Store it in `.github/traces/` or in the CI log — somewhere you can grep later.

When a skill regresses, the trace is how you find the first run that failed, not the thousandth.

### Slide 43. Security boundaries
Subagent tool allow-lists are the primary security boundary. A few rules that survive:
- **No secret reads in tools.** If a tool can read secrets, it cannot write to an external system. Pick one.
- **No shell for free.** Any tool that runs shell commands gets a pre-hook that inspects the command.
- **No network for docs.** Documentation subagents never need outbound network. Remove it.
- **Audit the diff.** Every PR that touches `.github/agents/` or `.github/skills/` triggers a review from security.

### Slide 44. Rollout recipe
For a team adopting this today:
1. Write `.github/copilot-instructions.md` first — the Layer 2 base. No agents yet.
2. Add one chatmode for your most common review (usually security or style).
3. Add one skill for your most common artifact (usually ADRs or tests).
4. Add hooks **only after** you have pain. Hooks added pre-emptively rot.
5. Add subagents **only** when a chatmode + skill can no longer express the routing. This is often month 3, not week 1.
6. Archive as you go. Version from day one.

### Slide 45. Close — what you leave with
A usable starter set for any repo:
- One `copilot-instructions.md` (Layer 2).
- One chatmode (Layer 4, human-facing).
- One skill (Layer 5, reusable knowledge).
- One hook (governance rail).

And an operating model: route by task type, load skills by context, wrap everything in hooks, trace every run. Deck 04 takes this and moves it out of chat into the CLI, extensions, and APIs.

## References

- [GitHub Docs — Custom instructions for GitHub Copilot](https://docs.github.com/en/copilot/customizing-copilot/about-customizing-github-copilot-chat-responses) — official guidance on `.github/copilot-instructions.md`
- [GitHub Docs — Copilot Chat in your IDE](https://docs.github.com/en/copilot/github-copilot-chat/copilot-chat-in-ides/about-github-copilot-chat-in-your-ide) — chat surface reference
- [GitHub Docs — Copilot Extensions and skillsets](https://docs.github.com/en/copilot/building-copilot-extensions/about-building-copilot-extensions) — extension/skill framework
- [GitHub Next — Copilot Workspace](https://githubnext.com/projects/copilot-workspace) — multi-stage agent execution research
- [GitHub Blog — Prompt engineering for Copilot Chat](https://github.blog/ai-and-ml/github-copilot/prompt-engineering-for-github-copilot-chat/) — prompt layering patterns
- [Anthropic — Claude for the Enterprise: Skills and subagents](https://www.anthropic.com/engineering) — comparable skill/subagent taxonomy
- [Microsoft Learn — GitHub Copilot for Business](https://learn.microsoft.com/en-us/training/paths/copilot/) — enterprise rollout guide
- [Decision Tree: Agent vs Skill (source)](../../sources/decision-tree-agent-vs-skill_v1.0.0_2026-03-18.md)
- [Complete Skill Lifecycle (source)](../../sources/skill-lifecycle-complete_v1.0.0_2026-03-18.md)
- [Orchestration Flow: Agents + Skills (source)](../../sources/orchestration-flow-agents-skills_v1.0.0_2026-03-18.md)
- [Agent Handoff Flow (source)](../../sources/agent-handoff-flow_v1.0.0_2026-03-18.md)
- [Hooks Lifecycle (source)](../../../deck-04-hooks-cli-sdk/sources/hooks-lifecycle_v1.0.0_2026-03-18.md)
- [Prompt Integration: 6 Layers (source)](../../../deck-04-hooks-cli-sdk/sources/prompt-integration-6-layers_v1.0.0_2026-03-18.md)
