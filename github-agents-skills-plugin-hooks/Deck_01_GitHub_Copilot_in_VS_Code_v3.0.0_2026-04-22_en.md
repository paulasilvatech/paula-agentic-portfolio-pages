---
title: "GitHub Copilot Mastery — Deck 01: GitHub Copilot in Visual Studio Code"
description: "The editor-level mental model for GitHub Copilot: completions, chat, inline chat, ask mode, edit mode, agent mode, models, and MCP, grounded in real defaults."
author: Paula Silva
date: 2026-04-22
version: 3.0.0
status: active
locale: en
deck: 01
series: "GitHub Copilot Mastery"
slide_count: 45
tags:
  - github-copilot
  - visual-studio-code
  - chat-modes
  - agent-mode
  - mcp
  - models
  - prompting
  - agentic-devops
---

# GitHub Copilot Mastery — Deck 01: GitHub Copilot in Visual Studio Code

> Part 1 of 5 in the GitHub Copilot Mastery series. This deck is the editor-level foundation: the concrete surfaces GitHub Copilot exposes in Visual Studio Code, the mental model that connects them, and the prompting defaults that make the rest of the series possible.

## Part I — Mental Model

### Slide 01. Title
**GitHub Copilot in Visual Studio Code: The Editor-Level Mental Model**
Kicker: `GITHUB COPILOT MASTERY · DECK 01 · 2026-04-22`
Subtitle: Completions, chat, inline chat, ask mode, edit mode, agent mode, models, and MCP.
Author strip: Paula Silva, AI-Native Software Engineer · Global Black Belt, Microsoft Americas.

### Slide 02. Why this deck exists
Most teams install GitHub Copilot and use 20% of it. The other 80% is not hidden, it is just unlabeled. This deck labels every surface, every mode, and every keyboard shortcut worth knowing, then shows when to reach for which.

The goal is not to tour features. The goal is to give you a mental model that tells you, at any moment, which Copilot surface is the right tool for the task on screen.

### Slide 03. The four surfaces
GitHub Copilot in Visual Studio Code has four distinct surfaces. Every interaction happens on exactly one of them:
| Surface | Shortcut | Use for |
|---|---|---|
| Code completions | ghost text as you type | The next 1-20 tokens |
| Inline chat | `Cmd+I` / `Ctrl+I` | Edits scoped to a selection or cursor |
| Chat view | `Ctrl+Alt+I` (side panel) | Multi-turn conversation with context |
| Agent mode | Chat view, dropdown | Autonomous multi-step tasks with tools |

If you cannot name which surface you are on, you are using Copilot wrong.

### Slide 04. The three chat modes
Source: GitHub Docs, Copilot Chat in your IDE. The chat view and inline chat both host three *modes*, selected from a dropdown at the top of the chat input:
- **Ask** — answer a question, no file edits. Read-only.
- **Edit** — propose edits across one or more files, you review the diff.
- **Agent** — autonomous multi-step execution with tools. Copilot plans, reads, edits, and runs commands.

Ask is for understanding. Edit is for directed changes. Agent is for delegation.

### Slide 05. The mental model, one sentence each
- **Completions**: finish the line I just started.
- **Inline chat**: change this specific block, in place.
- **Ask mode**: tell me about my code.
- **Edit mode**: change these files, show me the diff.
- **Agent mode**: figure out what to change and do it, stop when done.

When someone says "Copilot is slow" or "Copilot hallucinates," the first question is which surface and which mode. The failure modes are completely different.

### Slide 06. Completions vs chat — the split
| Dimension | Completions | Chat |
|---|---|---|
| Trigger | Typing | Explicit invocation |
| Latency | <300ms target | 2-20s typical |
| Scope | Next few tokens | Selection, file, or workspace |
| Context | Surrounding code | Active editors + attached context |
| Failure mode | Wrong suggestion, easy to ignore | Confident wrong answer, harder to catch |

Completions fail silently. Chat fails loudly. That is why chat needs better prompts and completions needs better defaults.

## Part II — Completions

### Slide 07. How completions work
Completions are triggered by typing. GitHub Copilot sends the surrounding code (the *prefix* and a small *suffix*), plus metadata about the file, to the model. The model returns one or more candidate completions, rendered as ghost text.

You accept with `Tab`, reject with `Esc`, cycle alternatives with `Alt+]` / `Alt+[`, and accept word-by-word with `Ctrl+→` on macOS or `Alt+→` on Windows/Linux.

### Slide 08. What context completions actually see
The model does not see your whole repo. It sees:
- Current file, centered on the cursor.
- A window of other recently-open tabs (Neighboring Tabs feature).
- Your Custom Instructions if configured.
- Snippets matched from the workspace if indexing is on.

That is why opening the right files before typing changes the suggestions you get. Stale tabs poison completions.

### Slide 09. Accepting completions well
Three habits that separate effective users from frustrated ones:
1. **Read before you accept.** Ghost text is not a commitment. `Esc` is free.
2. **Prefer partial accepts.** `Ctrl+→` takes one word at a time. Useful when the first half is right and the second half drifts.
3. **Reject aggressively.** A bad suggestion accepted becomes a bug you wrote. A bad suggestion rejected costs nothing.

### Slide 10. Completion quality is an input problem
When completions feel off, the fix is almost never "use a smarter model." It is:
- Close irrelevant tabs.
- Rename the function to what it actually does.
- Add a one-line comment describing intent above the cursor.
- Add a real type annotation or type hint.

Completions read the surrounding code like a human would. Make the surrounding code easier to read and the completions get better immediately.

## Part III — Inline Chat and Ask Mode

### Slide 11. Inline chat — the in-place editor
`Cmd+I` (macOS) or `Ctrl+I` (Windows/Linux) opens inline chat at the cursor or over a selection. You ask for a change in natural language. Copilot proposes a diff you can accept, discard, or regenerate.

Inline chat is the right tool when:
- The change is local (one function, one block).
- You can point at it with a selection.
- You want the result in-place, not as a conversation.

### Slide 12. Inline chat vs selecting + chat view
Both work. Inline chat is faster for single edits. Chat view is better when:
- You need a multi-turn conversation.
- You want to keep history.
- The change spans multiple files.
- You are going to switch to Edit or Agent mode.

Default: inline chat for small edits, chat view for anything you expect to iterate on.

### Slide 13. Ask mode — read-only understanding
Ask mode is chat without edits. Use it when the output is information, not code:
- "Explain this function."
- "Why does this test fail?"
- "What does `reduce` with this signature actually return?"
- "Compare these two approaches."

If the output should be a diff, you are in the wrong mode. Switch to Edit.

### Slide 14. Prompting Ask mode well
Source: GitHub Blog, Prompt Engineering for GitHub Copilot Chat. Good Ask prompts share three properties:
1. **Anchor**: a selection, file, or attached symbol. "Explain this" with nothing selected is worse than "Explain the `parseOptions` function" with the file attached.
2. **Frame**: state the audience. "Explain for a junior dev" produces a different answer than "Explain for a reviewer who wrote this last year."
3. **Ask for the shape**: "in three bullets", "as a table", "with one concrete example". Models drift to prose without a shape request.

### Slide 15. Attaching context in chat
The `#` menu inside chat lets you attach:
- `#file` — a specific file by path.
- `#selection` — whatever is highlighted in the active editor.
- `#codebase` — workspace-wide context (if indexing is on).
- `#terminalSelection` / `#terminalLastCommand` — live terminal state.
- `#problems` — current Problems panel contents.
- `#testFailure` — most recent test failure output.

Every attachment costs tokens. Attach exactly what the answer needs and no more.

## Part IV — Edit Mode

### Slide 16. Edit mode — directed multi-file changes
Edit mode is for "change these files, this way." You select the files, describe the change, and GitHub Copilot proposes a diff across all of them. You review, accept, or regenerate.

Edit mode is the right tool when:
- The change spans more than one file.
- You know exactly which files are affected.
- You want a diff to review before anything lands.

### Slide 17. Edit mode workflow
1. Open chat view, pick Edit from the mode dropdown.
2. Attach the files you want changed. `#file` or drag from the explorer.
3. State the change in one or two sentences.
4. Review the proposed diff per file.
5. Accept, discard, or ask Copilot to revise a specific hunk.

The discipline: attach only the files that should change. If you attach extra files, Copilot may edit them.

### Slide 18. Edit prompts that work
Good Edit prompts share a pattern: **state the behavior change, not the implementation**. Instead of "change the loop in `handleRequest` to use `for...of` because `.forEach` is slower," write "make `handleRequest` handle async work correctly in sequence." Let the model pick the mechanics.

The exception: when mechanics are the point. Refactors, renames, and migrations often need the mechanics stated explicitly.

### Slide 19. When Edit mode drifts
If Edit mode touches files you did not attach or makes changes you did not ask for:
1. Discard the proposal.
2. Narrow the attachment list.
3. Restate the change more tightly.
4. If it still drifts, you probably want Agent mode, not Edit mode. The task is not scoped enough for Edit.

## Part V — Agent Mode

### Slide 20. Agent mode — autonomous execution
Agent mode is chat's dropdown option that turns Copilot into an autonomous worker. It can:
- Read files.
- Edit files.
- Run terminal commands.
- Invoke MCP tools.
- Loop: plan, act, observe, revise, until done.

The user interaction is: state the goal, watch the trace, approve or reject each tool use that needs permission, accept the final diff.

### Slide 21. When to use Agent mode
Agent mode earns its keep when:
- The task spans multiple files AND multiple steps.
- You do not know upfront exactly which files will change.
- Running and observing (tests, compiler, typecheck) is part of the loop.
- You want delegation, not collaboration.

Examples: "Add authentication to this Express app, route-by-route." "Migrate this service from Mocha to Vitest." "Investigate why CI is failing and fix it."

### Slide 22. When NOT to use Agent mode
- Single-line edit. Use completions.
- Single-block edit. Use inline chat.
- Read-only question. Use Ask.
- Known file list + known change. Use Edit.
- You are exploring an idea. Use Ask, converge, then Agent.

Over-reaching for Agent mode is the single most common way to make GitHub Copilot feel slow and unreliable.

### Slide 23. Agent mode tools
Source: GitHub Docs, Copilot Chat agent mode. Tools available to the agent include:
| Tool | Purpose |
|---|---|
| `read` | Read a file |
| `edit` | Propose an edit |
| `run` | Run a terminal command |
| `search` | Grep/glob across the workspace |
| `problems` | Query the Problems panel |
| `testFailure` | Query latest test run |
| MCP tools | Anything exposed by a connected MCP server |

You can allow-list, deny-list, or always-ask per tool type. Defaults: edits and terminal commands prompt each time. Reads do not.

### Slide 24. Agent guardrails
Three guardrails that survive in practice:
1. **Work in a branch.** Never run agent mode against `main` directly.
2. **Require approval for `run`.** The cost of an unexpected `rm -rf` is infinite.
3. **Keep sessions short.** Long agent sessions accumulate context that degrades quality. Stop when the task is done.

### Slide 25. Reading an agent trace
The trace panel shows each step: plan, tool call, tool result, next plan. Three things to watch:
- **Loops** — the same plan step twice means the agent is stuck. Intervene.
- **Wrong file** — the agent started editing a file you did not expect. Stop and restate the goal.
- **Silent failures** — a `run` returned a non-zero exit and the agent kept going anyway. Intervene and ask it to treat the failure.

A good operator interrupts. A passive operator accepts drift.

## Part VI — Models

### Slide 26. You are picking a model every time
Every chat request runs against a specific model. Visual Studio Code exposes the model picker at the bottom of the chat input. Defaults change over time, and GitHub Copilot adds new models frequently. Check docs for the current list.

The model you pick determines:
- Latency (small fast models vs. large slow ones).
- Reasoning depth (simple-edit vs. plan-and-verify).
- Cost (for paid tiers, model choice affects quota).
- Tool use quality (some models are stronger at agent mode).

### Slide 27. A working heuristic
| Task | Model family |
|---|---|
| Completions | Fastest available |
| Quick Ask, inline edits | Fast general model |
| Multi-file Edit, code review | Stronger general model |
| Agent mode, multi-step reasoning | Most capable model |
| Debugging weird test failures | Most capable model |

Do not default the most-capable model for everything. It is slow and uses your budget. Default to fast, escalate on friction.

### Slide 28. Model switching mid-conversation
You can change models between turns. A common pattern:
1. Start in a fast model: ask a question, scope the change.
2. Switch to a stronger model to execute.
3. Switch back to the fast model for follow-up clean-up.

This is not required, but it is cheap and it works.

### Slide 29. Custom Instructions — the Layer 2 base
A `.github/copilot-instructions.md` file at the repo root is injected into every chat request. Use it for:
- Coding standards (naming, error handling, logging).
- Stack facts the model cannot infer (our ORM, our test framework).
- Non-negotiables (no `any` in TypeScript, all DB calls parameterized).

Keep it under 100 lines. Longer instructions get ignored or summarized.

### Slide 30. Scoped instructions (`.instructions.md`)
Beyond the repo-wide file, per-folder `.instructions.md` files apply only to files matching their `applyTo` glob. Use these for:
- Per-service conventions.
- Test-file-specific rules ("every test file must import from `./test-helpers`").
- Doc-folder tone rules.

Scoped rules are how you avoid a 500-line repo-wide instructions file that ends up contradicting itself.

## Part VII — MCP and Extensibility

### Slide 31. What MCP actually is
MCP is the Model Context Protocol. It is the open standard GitHub Copilot (and others) use to call external tools. An MCP server exposes a set of tools. Copilot's agent mode can invoke those tools as part of its loop.

MCP is how you turn GitHub Copilot from "a model in your editor" into "an operator with access to your systems."

### Slide 32. Connecting an MCP server
Source: GitHub Docs, Extending Copilot Chat with MCP. You add servers via:
- Visual Studio Code settings (`mcp.servers` in `settings.json`).
- A repo-level `.vscode/mcp.json` for team-shared servers.
- Organization-level policy for enforced servers.

Each server declares: its name, its transport (stdio, SSE, HTTP), its command or URL, and any environment variables.

### Slide 33. MCP server patterns
| Pattern | Example |
|---|---|
| Read-only integration | Confluence search, Jira lookup |
| Write integration | Linear ticket create, PR comment |
| Compute | Database query, cloud resource inspect |
| Specialty reasoning | Legal review, security scan |

The more *write* power an MCP server has, the stricter the allow-list must be. Default read-only, earn write.

### Slide 34. MCP governance
Three rules for MCP rollout:
1. **No secrets in `mcp.json`.** Use `${env:VAR}` references, never literal keys.
2. **Per-repo allow-lists.** Not every MCP server belongs in every repo. Declare explicitly.
3. **Audit tool calls.** Log every MCP invocation. Review weekly for surprises.

MCP is powerful because it gives the agent real capabilities. That is also why it is the biggest governance surface.

### Slide 35. Copilot Extensions vs MCP servers
Both extend GitHub Copilot, different surfaces:
| | Copilot Extension | MCP Server |
|---|---|---|
| Where it runs | GitHub.com ecosystem | Local or team infra |
| Activation | `@extension-name` mention | Automatic in agent mode |
| Distribution | GitHub Marketplace | You distribute |
| Best for | Ecosystem-wide tools | Team-specific integrations |

Extensions are products. MCP servers are infrastructure.

## Part VIII — Governance, Cost, and Adoption

### Slide 36. Who pays for what
Completions and chat usage count against seats and (on paid tiers) against per-user quotas. Key facts:
- Completions are typically free within a seat.
- Chat message usage is metered on Business/Enterprise plans.
- Agent mode's tool calls can multiply per-turn cost.
- MCP and extensions inherit the seat; they do not create separate billing.

Check billing in the GitHub organization's Copilot settings. Check usage in Visual Studio Code's Copilot status view.

### Slide 37. Team policy controls
Source: GitHub Docs, Managing Copilot policies. Organization admins can:
- Enable/disable Copilot Chat per team.
- Enable/disable agent mode per team.
- Enforce content exclusions (files the model never sees).
- Enforce MCP server allow-lists.
- Enforce model availability.

Content exclusions are the single most-under-used control. Every org with any sensitive code should configure them before rollout.

### Slide 38. Measuring adoption
Three metrics that matter:
- **Weekly active users** — are seats actually being used?
- **Suggestions accepted rate** — is the model tuned for the codebase?
- **Chat turns per user per week** — are users reaching for chat, or only completions?

A high seat count with low active usage is the main failure mode of GitHub Copilot rollouts. Measure early, coach individuals, not teams.

### Slide 39. The cost of bad prompting
A user who gets bad results from GitHub Copilot typically:
- Blames the model.
- Reduces their usage.
- Tells their team the tool is weak.
- Pulls down the adoption curve for everyone.

Prompting is the highest-leverage training you can do. Two hours of hands-on prompting beats two weeks of feature tutorials.

### Slide 40. Rollout checklist
For a team adopting GitHub Copilot this quarter:
1. Seats assigned, billing confirmed.
2. `.github/copilot-instructions.md` committed to every active repo.
3. Content exclusions configured for sensitive paths.
4. Agent mode enabled, tool allow-list reviewed.
5. One MCP server connected for a high-value internal system.
6. One two-hour prompting workshop, hands-on.
7. Usage dashboard bookmarked, reviewed weekly for month 1.

## Part IX — Reality Checks

### Slide 41. What GitHub Copilot is not
- Not a pair programmer. No memory between sessions. No opinion about your architecture.
- Not a code reviewer. It will miss security issues a reviewer would catch.
- Not a test oracle. Generated tests can pass on wrong code if both are wrong the same way.
- Not a spec writer. It will invent requirements if you ask it to.

Treat it as a very fast, very literal junior engineer with excellent recall and no judgment.

### Slide 42. Failure modes worth naming
| Failure | Signal | Fix |
|---|---|---|
| Hallucinated API | Code uses a method that does not exist | Attach the real docs or types |
| Outdated pattern | Deprecated syntax, old library version | Update Custom Instructions with stack facts |
| Context starvation | Generic answer to a specific question | Attach more context, fewer generic prompts |
| Over-editing | Changes files you did not ask about | Narrow the attachment list, switch to Edit mode |
| Runaway agent | Agent loops, never stops | Interrupt, restate goal, shorten session |

### Slide 43. The 10x claim, honestly
Benchmarks that matter (directional, not guarantees):
- **Task completion time**: 20-55% faster on bounded tasks (GitHub internal + independent studies).
- **Boilerplate code**: near-zero time for the obvious parts.
- **Debugging**: modestly faster when the test suite is good, no faster when it is not.
- **New codebase onboarding**: meaningfully faster for understanding, modestly faster for contribution.

Real gain is sustained over weeks, not minutes. If the first session is slower (because of prompting learning), that is normal and expected.

### Slide 44. What to measure on your team
- Time from "I understand the bug" to "PR open" on fixes (the most honest metric).
- Review cycles per PR (does Copilot code need more rework?).
- Time spent in chat vs. time spent in the editor (balance matters).
- Incident count attributable to Copilot-generated code (should be near-zero with good review).

Avoid vanity metrics: "lines of code accepted" is meaningless without correctness.

### Slide 45. Close — the operating rules
Four rules that survive in every team I have watched adopt this:
1. **Name the surface before you use it.** Completions, inline, chat, agent — they are not interchangeable.
2. **Name the mode before you type.** Ask, Edit, Agent — each one has a different failure shape.
3. **Attach exactly what the answer needs.** No more, no less.
4. **Interrupt early.** A drifting agent is faster to restart than to rescue.

Deck 02 takes everything on this deck and moves it from the editor to the whole context layer: repo-wide prompting, chat modes at scale, and prompt engineering as an engineering discipline.

## References

- [GitHub Docs — GitHub Copilot in your IDE](https://docs.github.com/en/copilot/using-github-copilot/copilot-chat-in-ides/about-github-copilot-chat-in-your-ide) — official chat reference
- [GitHub Docs — Agent mode](https://docs.github.com/en/copilot/using-github-copilot/asking-github-copilot-questions-in-your-ide#asking-github-copilot-to-work-as-an-agent) — agent mode feature reference
- [GitHub Docs — Custom instructions for GitHub Copilot Chat](https://docs.github.com/en/copilot/customizing-copilot/about-customizing-github-copilot-chat-responses) — `.github/copilot-instructions.md` and scoped instructions
- [GitHub Docs — Managing Copilot policies](https://docs.github.com/en/copilot/managing-copilot/managing-copilot-for-your-enterprise) — enterprise governance surface
- [GitHub Docs — Copilot Extensions](https://docs.github.com/en/copilot/building-copilot-extensions/about-building-copilot-extensions) — extension framework
- [GitHub Docs — Extending Copilot Chat with MCP](https://docs.github.com/en/copilot/customizing-copilot/extending-copilot-chat-with-mcp) — MCP integration reference
- [GitHub Blog — Prompt engineering for Copilot Chat](https://github.blog/ai-and-ml/github-copilot/prompt-engineering-for-github-copilot-chat/) — prompting patterns
- [Visual Studio Code Docs — GitHub Copilot](https://code.visualstudio.com/docs/copilot/overview) — VS Code integration surface
- [Model Context Protocol specification](https://modelcontextprotocol.io/introduction) — MCP open standard
- [GitHub Research — Measuring GitHub Copilot's impact on productivity](https://cacm.acm.org/research/measuring-github-copilots-impact-on-productivity/) — task completion study
- [GitHub Next — Copilot Workspace](https://githubnext.com/projects/copilot-workspace) — multi-stage agent execution research
