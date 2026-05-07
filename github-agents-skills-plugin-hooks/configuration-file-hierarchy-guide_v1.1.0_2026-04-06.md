---
title: "Configuration File Hierarchy: A Practical Guide to AI Assistant Primitives"
description: "Didactic guide explaining every configuration file type in Claude Code and GitHub Copilot — what it does, where it lives, how it inherits, and when to use it"
author: Paula Silva
date: 2026-04-06
version: 1.1.0
status: approved
lang: en
tags:
  - configuration
  - hierarchy
  - claude-code
  - github-copilot
  - agents
  - skills
  - hooks
  - plugins
  - didactic
  - reference
---

# Configuration File Hierarchy: A Practical Guide to AI Assistant Primitives

> A single reference that explains every configuration file you can create for Claude Code and GitHub Copilot — what each one does, where it lives in your project, and how they all fit together at runtime.

## Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-04-06 | Paula Silva | Initial comprehensive guide |
| 1.1.0 | 2026-04-06 | Paula Silva | Added GitHub Copilot hooks, plugins, MCP; expanded prompts; full side-by-side parity |

## Table of Contents

- [1. Why This Guide Exists](#1-why-this-guide-exists)
- [2. The Big Picture: File Hierarchy at a Glance](#2-the-big-picture-file-hierarchy-at-a-glance)
- [3. Claude Code Primitives](#3-claude-code-primitives)
  - [3.1 CLAUDE.md — The Project Brain](#31-claudemd--the-project-brain)
  - [3.2 .claude/settings.json — Permissions and Safety](#32-claudesettingsjson--permissions-and-safety)
  - [3.3 .claude/rules/ — Scoped Behavioral Rules](#33-clauderules--scoped-behavioral-rules)
  - [3.4 .claude/agents/ — Subagent Definitions](#34-claudeagents--subagent-definitions)
  - [3.5 .claude/skills/ — Domain Knowledge Packs](#35-claudeskills--domain-knowledge-packs)
  - [3.6 Hooks — Lifecycle Event Handlers](#36-hooks--lifecycle-event-handlers)
  - [3.7 .mcp.json — MCP Server Connections](#37-mcpjson--mcp-server-connections)
  - [3.8 .claude/commands/ — Reusable Prompt Templates](#38-claudecommands--reusable-prompt-templates)
  - [3.9 Plugins — Installable Capability Bundles](#39-plugins--installable-capability-bundles)
- [4. GitHub Copilot Primitives](#4-github-copilot-primitives)
  - [4.1 copilot-instructions.md — Workspace-Level Instructions](#41-copilot-instructionsmd--workspace-level-instructions)
  - [4.2 .github/agents/ — Agent Definitions](#42-githubagents--agent-definitions)
  - [4.3 .github/instructions/ — Scoped Instructions](#43-githubinstructions--scoped-instructions)
  - [4.4 .github/prompts/ — Reusable Prompt Templates](#44-githubprompts--reusable-prompt-templates)
  - [4.5 .github/skills/ — Copilot Skills](#45-githubskills--copilot-skills)
  - [4.6 .github/hooks/ — Lifecycle Event Handlers](#46-githubhooks--lifecycle-event-handlers)
  - [4.7 .mcp.json — MCP Server Connections](#47-mcpjson--mcp-server-connections)
  - [4.8 Plugins — Installable Capability Bundles](#48-plugins--installable-capability-bundles)
- [5. Shared / Cross-Platform Files](#5-shared--cross-platform-files)
  - [5.1 .editorconfig — Editor Formatting](#51-editorconfig--editor-formatting)
- [6. How Layers Combine at Runtime](#6-how-layers-combine-at-runtime)
- [7. Inheritance and Override Rules](#7-inheritance-and-override-rules)
- [8. Decision Guide: Which File Do I Create?](#8-decision-guide-which-file-do-i-create)
- [9. Complete Directory Tree Example](#9-complete-directory-tree-example)
- [References](#references)

---

## 1. Why This Guide Exists

Modern AI coding assistants like Claude Code and GitHub Copilot are not single-file tools. They read from a **hierarchy of configuration files** scattered across your project to assemble the final context that drives every response. Understanding this hierarchy is essential because it determines what the AI knows about your project, what it is allowed to do, and how it behaves.

Without this understanding, teams end up with duplicated instructions, conflicting rules, or — worse — an AI that ignores critical project conventions because the right file was never created.

This guide covers both platforms side by side so you can see the parallels and make informed decisions about where to put each piece of configuration.

---

## 2. The Big Picture: File Hierarchy at a Glance

The following table maps every configuration primitive across both platforms. Think of it as a "Rosetta Stone" — the same concept often exists in both Claude Code and GitHub Copilot, just with different filenames and locations.

| Layer | Purpose | Claude Code | GitHub Copilot |
|-------|---------|-------------|----------------|
| **Project instructions** | Global rules for the whole repo | `CLAUDE.md` (root) | `.github/copilot-instructions.md` |
| **Permissions** | What the AI can and cannot do | `.claude/settings.json` | N/A (managed by Copilot platform) |
| **Scoped rules** | Rules for specific file types or folders | `.claude/rules/*.md` | `.github/instructions/*.instructions.md` |
| **Agent definitions** | Specialized AI personas with tools | `.claude/agents/*.md` | `.github/agents/*.agent.md` |
| **Skills** | Domain knowledge and workflows | `.claude/skills/*/SKILL.md` | `.github/skills/*/SKILL.md` |
| **Hooks** | Lifecycle event handlers | `settings.json` → `hooks` key | `.github/hooks/*.json` |
| **Prompt templates** | Reusable prompt shortcuts | `.claude/commands/*.md` | `.github/prompts/*.prompt.md` |
| **MCP connections** | External tool integrations | `.mcp.json` (root) | `.mcp.json` or plugin `.mcp.json` |
| **Plugins** | Installable bundles of MCPs + skills | `.plugins.json` / marketplace | `plugin.json` / Awesome Copilot marketplace |
| **Editor formatting** | Tabs, indentation, line endings | `.editorconfig` | `.editorconfig` |

Each row in this table represents a **layer** that gets injected into the AI's context at runtime. The sections below explain each layer in depth.

---

## 3. Claude Code Primitives

### 3.1 CLAUDE.md — The Project Brain

**What it is:** A markdown file at the root of your repository that contains global instructions for Claude Code. Every session reads this file first. Think of it as the "README for the AI."

**Where it lives:**

```
my-project/
└── CLAUDE.md          ← root level (always loaded)
```

**What goes in it:** Project description, coding conventions, file structure overview, naming rules, workflow instructions, and references to deeper documentation.

**Example:**

```markdown
# CLAUDE.md

## Project Overview
This is a Next.js 14 application using App Router, TypeScript, and Tailwind CSS.

## Conventions
- Use `kebab-case` for file names, `PascalCase` for components.
- All API routes go in `app/api/`.
- Tests use Vitest. Run with `npm test`.

## Key Commands
- `npm run dev` — start dev server on port 3000
- `npm run build` — production build
- `npm run lint` — ESLint + Prettier check
```

**Key behavior:** `CLAUDE.md` files can also exist in subdirectories. When Claude works on a file in `src/components/`, it loads the root `CLAUDE.md` *plus* any `CLAUDE.md` found in `src/` or `src/components/`. Child files **add to** (but should not contradict) the root file.

> **When to use it:** Always. Every project should have a root `CLAUDE.md`. It is the single most impactful file you can create for Claude Code.

---

### 3.2 .claude/settings.json — Permissions and Safety

**What it is:** A JSON file that defines what tools and commands Claude is allowed (or forbidden) to use. This is your **safety guardrail**.

**Where it lives:**

```
my-project/
└── .claude/
    ├── settings.json        ← project-level (checked into git)
    └── settings.local.json  ← personal overrides (gitignored)
```

**What goes in it:** Allow-lists and deny-lists for tool usage, using glob-style patterns.

**Example:**

```json
{
  "permissions": {
    "allow": [
      "Read",
      "Edit",
      "Write",
      "Bash(npm test *)",
      "Bash(npm run build *)",
      "Bash(python3 *)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(git push *)",
      "Bash(git reset --hard *)"
    ]
  }
}
```

**Inheritance:** There are three levels of settings, from broadest to most specific. Each level can refine but never override the deny-list of a higher level:

1. **Enterprise** (`~/.claude/enterprise-settings.json`) — set by your IT admin, cannot be overridden
2. **User** (`~/.claude/settings.json`) — your personal defaults across all projects
3. **Project** (`.claude/settings.json`) — project-specific, checked into git
4. **Local** (`.claude/settings.local.json`) — your personal overrides for this project only

> **When to use it:** When you need to restrict or allow specific shell commands, especially in shared repositories where safety matters.

---

### 3.3 .claude/rules/ — Scoped Behavioral Rules

**What it is:** Markdown files that contain behavioral rules automatically injected based on the current task context. Unlike `CLAUDE.md` (which is always loaded), rules are **conditionally loaded** based on what Claude is working on.

**Where it lives:**

```
my-project/
└── .claude/
    └── rules/
        ├── markdown-style.md     ← loaded when editing .md files
        ├── api-conventions.md    ← loaded when editing API routes
        └── test-patterns.md      ← loaded when writing tests
```

**What goes in it:** Specific conventions, patterns, and constraints for a particular scope (file type, folder, or task type).

**Example (`api-conventions.md`):**

```markdown
# API Convention Rules

These rules apply when creating or editing API route handlers.

## Response Format
- Always return JSON with `{ data, error, meta }` structure.
- Use HTTP status codes correctly: 201 for creation, 204 for deletion.
- Include `X-Request-Id` header in all responses.

## Error Handling
- Wrap all handlers in try/catch.
- Log errors with structured JSON (no console.log).
- Never expose stack traces in production responses.
```

> **When to use it:** When you have conventions that only apply in specific contexts. Rules keep your `CLAUDE.md` clean by moving specialized guidance into scoped files.

---

### 3.4 .claude/agents/ — Subagent Definitions

**What it is:** Markdown files that define specialized AI personas, each with a specific role, set of tools, and behavioral instructions. Agents allow you to split complex work across multiple "experts."

**Where it lives:**

```
my-project/
└── .claude/
    └── agents/
        ├── analyst.md
        ├── creator.md
        └── orchestrator.md
```

**What goes in it:** Agent identity (name, role, expertise), allowed tools, constraints, and handoff rules (when to delegate to another agent).

**Example (`analyst.md`):**

```markdown
---
name: analyst
description: "Research and analysis agent for competitive intelligence and gap analysis"
tools:
  - Read
  - Glob
  - Grep
  - WebSearch
  - WebFetch
---

# Analyst Agent

You are a senior research analyst. Your job is to:

1. Analyze source materials in the `sources/` directory.
2. Cross-reference claims with external data via web search.
3. Produce structured findings in Markdown format.

## Constraints
- Never fabricate statistics. Always cite sources.
- Output to `output/md/` directory.
- Hand off to the `creator` agent when findings need to become a deliverable.
```

**How agents work:** When a user invokes an agent (e.g., via `@analyst` or through the orchestrator), Claude loads that agent's definition file and assumes its persona. The agent only has access to the tools listed in its definition.

> **When to use it:** When your project has distinct work modes (analysis, content creation, code review, deployment) that benefit from specialized personas.

---

### 3.5 .claude/skills/ — Domain Knowledge Packs

**What it is:** Self-contained folders that provide domain-specific knowledge, best practices, and step-by-step workflows. Skills are the "how-to manuals" that make an AI expert at a specific task.

**Where it lives:**

```
my-project/
└── .claude/
    └── skills/
        ├── docx/
        │   └── SKILL.md        ← instructions for creating Word documents
        ├── pptx/
        │   └── SKILL.md        ← instructions for creating presentations
        └── svg-professional/
            └── SKILL.md        ← instructions for creating SVG diagrams
```

**What goes in it:** Detailed instructions, templates, validation checklists, and examples for producing a specific type of output.

**Example (`docx/SKILL.md` — abbreviated):**

```markdown
# Word Document Creation Skill

## Quick Start
1. Use `python-docx` library for all document creation.
2. Apply Microsoft branding: blue headers (#0078D4), white background.
3. Every document must include a cover page, TOC, and page numbers.

## Template Structure
- Cover page with title, subtitle, date, author
- Table of Contents (auto-generated)
- Body content with H1/H2/H3 hierarchy
- References section
- Back cover with contact information

## Validation Checklist
- [ ] Cover page present
- [ ] TOC present and accurate
- [ ] Page numbers on all pages
- [ ] Consistent heading styles
- [ ] No placeholder text remaining
```

**Key difference from rules:** Rules say "you must follow X convention." Skills say "here is how to accomplish Y task." Rules constrain behavior; skills enable capability.

> **When to use it:** When you want the AI to produce high-quality output for a specific task type (document creation, diagram generation, data analysis, etc.).

---

### 3.6 Hooks — Lifecycle Event Handlers

**What it is:** Scripts, prompts, or subagents that run automatically at specific points in Claude's workflow — before a tool runs, after a tool runs, when the session stops, or when an error occurs. Hooks let you inject deterministic automation around Claude's non-deterministic actions.

**Where they are configured:** In `.claude/settings.json` (or `settings.local.json`) under the `hooks` key. Hooks can also be enforced via enterprise policy settings so that all developers in an organization share the same guardrails.

**Available hook events:**

| Hook Event | When It Fires | Can Block? | Typical Use |
|------------|---------------|------------|-------------|
| `PreToolUse` | Before any tool executes | **Yes** (exit 2) | Validate inputs, block dangerous commands, enforce policies |
| `PostToolUse` | After any tool completes | No | Run linters, format code, log actions, audit trails |
| `Notification` | When Claude sends a notification | No | Custom alerts, Slack/Teams integration |
| `Stop` | When Claude finishes a turn | No | Run test suites, generate summaries, post-session cleanup |

**Handler types:** Each hook can use one of three handler types, depending on the complexity of validation required:

| Handler Type | Description | Use Case |
|--------------|-------------|----------|
| `command` | Runs a shell command | Simple scripts: linting, formatting, logging |
| `prompt` | Sends a prompt to a Claude model (single-turn) | AI-powered review: "Does this change look safe?" |
| `agent` | Spawns a subagent with access to tools (Read, Grep, Glob) | Deep verification: scan the codebase for regressions |

**Exit code semantics (for `command` handlers):**

| Exit Code | Meaning | Effect |
|-----------|---------|--------|
| `0` | Success | Proceed normally |
| `2` | Block | Deny the action; send error message back to Claude |
| Other | Error | Log the error but continue |

**Example (auto-format after file edits):**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write \"$CLAUDE_FILE_PATH\""
          }
        ]
      }
    ]
  }
}
```

**Example (block dangerous Bash commands with exit code 2):**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "echo \"$TOOL_INPUT\" | grep -qE 'rm -rf|DROP TABLE|format' && exit 2 || exit 0"
          }
        ]
      }
    ]
  }
}
```

**Example (AI-powered review before writes):**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Review the following file write for security issues. If you find any, respond with BLOCK and the reason. Otherwise respond with OK. $ARGUMENTS"
          }
        ]
      }
    ]
  }
}
```

> **When to use it:** When you want to enforce quality gates automatically — linting, testing, formatting, security scanning, or notifications — without relying on the AI to remember to do it.

> **Copilot parallel:** GitHub Copilot now supports hooks with an equivalent event model. See [Section 4.6](#46-githubhooks--lifecycle-event-handlers) for the Copilot configuration format.

---

### 3.7 .mcp.json — MCP Server Connections

**What it is:** A JSON file at the project root that declares which **Model Context Protocol (MCP)** servers Claude should connect to. MCP servers give Claude access to external tools and data sources — databases, APIs, SaaS platforms, local services.

**Where it lives:**

```
my-project/
└── .mcp.json           ← root level
```

**What goes in it:** Server names, transport types (HTTP, stdio), and connection details.

**Example:**

```json
{
  "mcpServers": {
    "postgres": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://localhost:5432/mydb"
      }
    },
    "github": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

**How it works:** When Claude starts a session, it reads `.mcp.json` and establishes connections to all declared servers. This gives Claude new tools (e.g., `query_database`, `create_issue`) that it can use alongside its built-in tools.

> **When to use it:** When Claude needs to interact with external services — databases, APIs, cloud platforms, internal tools.

---

### 3.8 .claude/commands/ — Reusable Prompt Templates (Slash Commands)

**What it is:** Markdown files that define reusable prompt templates, invokable as slash commands (e.g., `/build-deck`, `/assess-legacy`). They provide a consistent starting point for common tasks, saving users from typing the same detailed instructions repeatedly.

**Where it lives:**

```
my-project/
└── .claude/
    └── commands/
        ├── build-deck.md
        ├── assess-legacy.md
        └── onboard-client.md
```

**What goes in it:** A markdown file whose content becomes the prompt. The filename (minus `.md`) becomes the slash command name. You can use the `$ARGUMENTS` placeholder to accept user input at invocation time.

**Example (`build-deck.md`):**

```markdown
Analyze the following topic and create a professional 10-slide presentation deck:

Topic: $ARGUMENTS

## Requirements
1. Start with an executive summary slide.
2. Include a "Problem Statement" slide with market data.
3. Include an architecture or solution diagram slide.
4. End with a "Next Steps" slide with clear action items.
5. Use the Microsoft 4-color palette for all visual elements.
6. Save the output to `output/pptx/`.
```

**How it works:** When a user types `/build-deck AI-powered legacy modernization`, Claude replaces `$ARGUMENTS` with the user's input and executes the full prompt as if the user had typed it manually.

> **When to use it:** When your team has recurring tasks that always follow the same pattern. Commands turn tribal knowledge ("here's how we create a deck") into a one-word shortcut.

> **Copilot parallel:** `.github/prompts/*.prompt.md` files serve the same purpose. See [Section 4.4](#44-githubprompts--reusable-prompt-templates) for the Copilot format, which adds YAML frontmatter for specifying the agent, model, and available tools.

---

### 3.9 Plugins — Installable Capability Bundles

**What it is:** Plugins are **pre-packaged bundles** that combine MCP servers, skills, hooks, and commands into a single installable unit. Think of them as "apps" for your AI assistant — you install one and it brings everything needed for a capability.

**Where they are configured:**

```
my-project/
├── .plugins.json                    ← declares which plugins are installed
└── .claude/
    └── plugins/
        └── my-plugin/
            ├── plugin.json          ← plugin manifest
            ├── skills/
            │   └── SKILL.md
            ├── commands/
            │   └── do-something.md
            └── mcp-config.json
```

**What a plugin contains:**

| Component | Purpose |
|-----------|---------|
| `plugin.json` | Manifest with name, version, description, dependencies |
| `skills/` | Domain knowledge packs specific to this plugin |
| `commands/` | Slash commands the plugin adds |
| `mcp-config.json` | MCP server connections the plugin needs |

**Example use cases:** A "Slack integration" plugin might bundle: a Slack MCP server (for reading/sending messages), a `slack-messaging` skill (formatting best practices), and a `/summarize-channel` command.

> **When to use it:** When you want to share a complete capability (tools + knowledge + commands) across teams or projects, or install community-created capabilities.

> **Copilot parallel:** GitHub Copilot now supports plugins with an equivalent structure. See [Section 4.8](#48-plugins--installable-capability-bundles) for the Copilot plugin format.

---

## 4. GitHub Copilot Primitives

### 4.1 copilot-instructions.md — Workspace-Level Instructions

**What it is:** The GitHub Copilot equivalent of `CLAUDE.md`. A markdown file that provides global instructions for Copilot across the entire workspace.

**Where it lives:**

```
my-project/
└── .github/
    └── copilot-instructions.md
```

**Example:**

```markdown
# Copilot Instructions

## Project Context
This is a Python 3.12 FastAPI application with SQLAlchemy ORM and Alembic migrations.

## Conventions
- Use type hints on all function signatures.
- Follow PEP 8 with 88-character line length (Black formatter).
- Write docstrings in Google style.
- All database models go in `app/models/`.
```

> **Parallel:** `copilot-instructions.md` is to GitHub Copilot what `CLAUDE.md` is to Claude Code.

---

### 4.2 .github/agents/ — Agent Definitions

**What it is:** Markdown files (with `.agent.md` extension) that define specialized Copilot agent personas. Functionally identical in concept to Claude's `.claude/agents/` but with Copilot-specific syntax.

**Where it lives:**

```
my-project/
└── .github/
    └── agents/
        ├── reviewer.agent.md
        └── docs-writer.agent.md
```

**Example (`reviewer.agent.md`):**

```markdown
---
name: reviewer
description: "Code review agent focused on security and performance"
tools:
  - code_search
  - file_reader
---

# Code Reviewer

You are a senior code reviewer. Focus on:
1. Security vulnerabilities (injection, auth bypass, data exposure)
2. Performance issues (N+1 queries, memory leaks, blocking calls)
3. Readability and maintainability
```

---

### 4.3 .github/instructions/ — Scoped Instructions

**What it is:** Instruction files that are automatically applied based on file patterns, equivalent to Claude's `.claude/rules/`. Each file uses an `applyTo` frontmatter field to specify which files it applies to.

**Where it lives:**

```
my-project/
└── .github/
    └── instructions/
        ├── react-components.instructions.md
        └── api-routes.instructions.md
```

**Example (`react-components.instructions.md`):**

```markdown
---
applyTo: "src/components/**/*.tsx"
---

# React Component Rules

- Use functional components with hooks (no class components).
- Export a default component. Named exports for utilities only.
- Co-locate styles: `ComponentName.module.css` next to the component.
- Every component must have a `data-testid` attribute on its root element.
```

The `applyTo` field uses glob patterns. When Copilot works on a file matching `src/components/**/*.tsx`, these instructions are automatically injected.

> **Parallel:** `.github/instructions/*.instructions.md` is to Copilot what `.claude/rules/*.md` is to Claude Code. The key difference is the explicit `applyTo` glob pattern in Copilot vs. contextual loading in Claude.

---

### 4.4 .github/prompts/ — Reusable Prompt Templates

**What it is:** Pre-written prompt templates (`.prompt.md` files) that users can invoke as slash commands. They provide a consistent starting point for common tasks — scaffolding a component, running tests, preparing a PR, or performing a code review.

**Where it lives:**

```
my-project/
└── .github/
    └── prompts/
        ├── build-deck.prompt.md
        ├── code-review.prompt.md
        └── gap-analysis.prompt.md
```

**What goes in it:** An optional YAML frontmatter block that configures the prompt's behavior (which agent runs it, which tools are available, which model to use), followed by the prompt body in Markdown. The filename (minus `.prompt.md`) becomes the slash command name.

**Frontmatter fields:**

| Field | Description | Default |
|-------|-------------|---------|
| `description` | One-line description shown in the command palette | — |
| `mode` | Which agent mode runs the prompt: `ask`, `agent`, `plan` | Current agent (or `agent` if tools are specified) |
| `tools` | List of tools, tool sets, or MCP tools available to the prompt | All tools |
| `model` | Language model to use | Currently selected model |

**Example (`code-review.prompt.md`):**

```markdown
---
description: "Run a thorough code review on the current file"
mode: agent
tools:
  - code_search
  - file_reader
  - github
---

Review this code for:
1. **Security**: SQL injection, XSS, auth issues, secrets in code
2. **Performance**: N+1 queries, unnecessary re-renders, memory leaks
3. **Readability**: Naming, complexity, dead code, missing docs

Format your review as a table: | Line | Severity | Issue | Suggestion |
```

When a user types `/code-review` in Copilot Chat, this prompt template is expanded and executed. The `mode: agent` field tells Copilot to run it in agentic mode with tool access, rather than as a simple Q&A.

**Key difference from custom instructions:** Custom instructions (`.instructions.md`) provide ongoing guidance applied automatically. Prompt files are invoked manually when you need them — they are task-specific, not always-on.

> **Claude Code parallel:** `.claude/commands/*.md` files serve the same purpose. The key difference is that Copilot prompt files support YAML frontmatter for configuring the agent mode, model, and tool access, while Claude commands are plain markdown with `$ARGUMENTS` placeholders.

---

### 4.5 .github/skills/ — Copilot Skills

**What it is:** Domain knowledge packs for GitHub Copilot, identical in concept to Claude's `.claude/skills/`. Each skill is a folder with a `SKILL.md` file containing detailed instructions.

**Where it lives:**

```
my-project/
└── .github/
    └── skills/
        ├── svg-professional/
        │   └── SKILL.md
        └── api-design/
            └── SKILL.md
```

The structure and content format are the same as Claude Code skills (see Section 3.5).

> **Claude Code parallel:** `.claude/skills/*/SKILL.md` — identical concept, identical file format.

---

### 4.6 .github/hooks/ — Lifecycle Event Handlers

**What it is:** JSON configuration files that define shell commands to run automatically at key lifecycle points during Copilot agent sessions. Hooks work in both the Copilot Coding Agent (cloud) and Copilot CLI (local).

**Where it lives:**

```
my-project/
└── .github/
    └── hooks/
        ├── security-gates.json
        └── quality-checks.json
```

**Configuration format:** Each JSON file uses a versioned schema with a `hooks` object containing arrays for each event type.

**Available hook events:**

| Hook Event | When It Fires | Can Block? | Typical Use |
|------------|---------------|------------|-------------|
| `sessionStart` | When an agent session begins or resumes | No | Initialize environments, log session starts, validate project state |
| `sessionEnd` | When an agent session ends | No | Cleanup temp resources, generate audit reports |
| `userPromptSubmitted` | When the user submits a prompt | No | Log prompts, inject additional context |
| `preToolUse` | Before the agent uses any tool | **Yes** | Block dangerous commands, enforce security policies |
| `postToolUse` | After a tool completes (success or failure) | No | Log results, track statistics, send failure alerts |
| `errorOccurred` | When an error occurs during execution | No | Error logging, alert routing, fallback triggers |

**Example (`security-gates.json`):**

```json
{
  "version": 1,
  "hooks": {
    "preToolUse": [
      {
        "name": "Block destructive commands",
        "command": "bash .github/hooks/scripts/block-destructive.sh",
        "description": "Prevents rm -rf, DROP TABLE, and format commands"
      }
    ],
    "postToolUse": [
      {
        "name": "Auto-lint edited files",
        "command": "npx eslint --fix $FILE_PATH",
        "description": "Runs ESLint on every file the agent edits"
      }
    ],
    "sessionStart": [
      {
        "name": "Log session start",
        "command": "echo \"Session started at $(date)\" >> .github/hooks/audit.log"
      }
    ]
  }
}
```

**Key behaviors:**

- For Coding Agent (cloud): hook files **must exist on the repository's default branch** to be loaded.
- For Copilot CLI (local): hook files are read from `.github/hooks/` in the current working directory.
- `preToolUse` hooks can **deny tool executions** — this is the most powerful hook for enforcing security policies.
- Hooks from multiple JSON files and plugins **merge** (they do not override each other).

> **Claude Code parallel:** Claude Code configures hooks in `.claude/settings.json` under the `hooks` key. The event model is equivalent — both platforms have pre/post tool use events with blocking capability. Claude adds `prompt` and `agent` handler types beyond shell commands; Copilot adds `sessionStart`, `sessionEnd`, `userPromptSubmitted`, and `errorOccurred` events that Claude handles through `Stop` and `Notification`.

**Side-by-side event mapping:**

| Concept | Claude Code | GitHub Copilot |
|---------|-------------|----------------|
| Before tool runs | `PreToolUse` | `preToolUse` |
| After tool runs | `PostToolUse` | `postToolUse` |
| Session starts | — | `sessionStart` |
| Session ends | `Stop` | `sessionEnd` |
| User sends prompt | — | `userPromptSubmitted` |
| Error occurs | — | `errorOccurred` |
| Notification | `Notification` | — |
| Can block actions | Yes (exit code 2) | Yes (deny in `preToolUse`) |
| Config location | `.claude/settings.json` | `.github/hooks/*.json` |
| Handler types | `command`, `prompt`, `agent` | `command` (shell scripts) |

---

### 4.7 .mcp.json — MCP Server Connections

**What it is:** GitHub Copilot now supports the **Model Context Protocol (MCP)** for connecting to external tools and services. Configuration works through `.mcp.json` files or through plugin-bundled MCP configs.

**Where it lives:**

```
my-project/
├── .mcp.json                       ← project-level MCP config
└── .github/
    └── plugins/
        └── my-plugin/
            └── .mcp.json           ← plugin-bundled MCP config
```

**How it works:** Copilot CLI ships with GitHub's MCP server built in (for issues, PRs, code search). Custom MCP servers can be added for connecting to any tool or service — databases, internal APIs, observability platforms. When a plugin includes an `.mcp.json`, those MCP connections are automatically available when the plugin is installed.

**Example (`.mcp.json` for Copilot CLI):**

```json
{
  "mcpServers": {
    "github": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"]
    },
    "postgres": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://localhost:5432/mydb"
      }
    }
  }
}
```

> **Claude Code parallel:** Identical file format and location (`.mcp.json` at the project root). The MCP standard is platform-agnostic, so the same `.mcp.json` file can work for both Claude Code and Copilot CLI.

---

### 4.8 Plugins — Installable Capability Bundles

**What it is:** GitHub Copilot now supports plugins — pre-packaged bundles that combine agents, skills, hooks, and MCP servers into a single installable unit. Plugins are available through the [Awesome GitHub Copilot](https://awesome-copilot.github.com/plugins/) marketplace and can also be created as private plugins within organizations.

**Where it lives:**

```
my-plugin/
├── plugin.json                     ← required manifest
├── agents/                         ← custom agents (optional)
│   └── reviewer.agent.md
├── skills/                         ← domain knowledge (optional)
│   └── my-skill/
│       └── SKILL.md
├── hooks.json                      ← lifecycle hooks (optional)
└── .mcp.json                       ← MCP server config (optional)
```

**plugin.json manifest:**

```json
{
  "name": "my-awesome-plugin",
  "description": "Code review automation with database access",
  "version": "1.0.0",
  "author": {
    "name": "Paula Silva",
    "email": "paula@example.com"
  },
  "keywords": ["code-review", "database", "automation"],
  "agents": "agents/",
  "skills": ["skills/"],
  "hooks": "hooks.json",
  "mcpServers": ".mcp.json"
}
```

**What a Copilot plugin can contain:**

| Component | File/Folder | Purpose |
|-----------|-------------|---------|
| Manifest | `plugin.json` | Name, version, author, component paths |
| Agents | `agents/*.agent.md` | Specialized AI personas |
| Skills | `skills/*/SKILL.md` | Domain knowledge packs |
| Hooks | `hooks.json` | Lifecycle event handlers |
| MCP servers | `.mcp.json` | External tool integrations |

**Merge behavior:** When multiple plugins are installed, their hooks merge (not override). This means you can install a security plugin and a formatting plugin and both will be active simultaneously.

**Marketplaces:** Copilot comes with two default plugin registries: `copilot-plugins` (official) and `awesome-copilot` (community). Organizations can also create private marketplaces on GitHub.com or internal Git hosting.

> **Claude Code parallel:** Claude Code plugins use `.plugins.json` for the manifest and a similar internal structure (skills, commands, MCP configs). The Awesome Copilot marketplace is comparable to the Claude plugin registry. The key structural difference is that Copilot plugins include agents and hooks as first-class components, while Claude plugins focus on skills, commands, and MCP configs.

---

## 5. Shared / Cross-Platform Files

### 5.1 .editorconfig — Editor Formatting

**What it is:** A standardized file (supported by nearly all editors and AI tools) that defines basic formatting rules: indentation style, line endings, charset, and trailing whitespace.

**Where it lives:**

```
my-project/
└── .editorconfig
```

**Example:**

```ini
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false

[*.py]
indent_size = 4
```

Both Claude Code and GitHub Copilot respect `.editorconfig` when generating code.

---

## 6. How Layers Combine at Runtime

When an AI assistant processes your request, it does not read files randomly. It assembles a **layered context** in a specific order, where each layer adds information on top of the previous one. The following numbered list shows the assembly order from first loaded to last:

1. **System prompt** — The model's base behavior, set by Anthropic or GitHub. You do not control this.
2. **Project instructions** — `CLAUDE.md` or `copilot-instructions.md`. Loaded once per session.
3. **Settings / permissions** — `.claude/settings.json`. Defines tool access boundaries.
4. **Scoped rules / instructions** — `.claude/rules/` or `.github/instructions/`. Loaded conditionally based on the file or task context.
5. **Agent identity** — The active agent's definition file. Loaded when an agent is invoked.
6. **Skill knowledge** — The relevant `SKILL.md`. Loaded when a skill is triggered.
7. **MCP tool schemas** — Available tools from `.mcp.json` connections. Always present.
8. **User prompt** — Your actual request. This is the final, highest-priority input.

The general principle is: **later layers refine but do not contradict earlier layers**. A skill cannot override a safety rule from `settings.json`. A user prompt cannot bypass a deny-listed command.

---

## 7. Inheritance and Override Rules

Understanding how files inherit and override each other prevents confusion when rules seem to conflict. The table below explains the precedence logic for each primitive:

| Primitive | Claude Code | GitHub Copilot | Inheritance Model |
|-----------|-------------|----------------|-------------------|
| **Project instructions** | `CLAUDE.md` cascades through subdirectories; child adds to parent | `copilot-instructions.md` is a single file (no cascading) | Claude: cascading. Copilot: flat |
| **Permissions** | `settings.json` layers: enterprise > user > project > local; `deny` is absolute | Managed by platform (org policies, not a file) | Claude: layered. Copilot: platform-managed |
| **Scoped rules** | `.claude/rules/` loaded per task context; multiple merge | `.github/instructions/` loaded per `applyTo` glob; multiple merge | Both: contextual, additive |
| **Agents** | One active agent at a time; its persona replaces the default | One active agent at a time; same behavior | Both: exclusive |
| **Skills** | Loaded on trigger; multiple skills can be active | Loaded on trigger; same behavior | Both: additive |
| **Hooks** | All matching hooks fire sequentially; they chain, not override | All matching hooks fire; merge across files and plugins | Both: sequential merge |
| **Prompts/Commands** | Plain markdown; `$ARGUMENTS` placeholder | YAML frontmatter (mode, tools, model) + markdown body | Both: invoked manually per task |
| **MCP** | `.mcp.json` at root; loaded once per session | `.mcp.json` at root or in plugins; loaded once | Both: additive per server name |
| **Plugins** | `.plugins.json` manifest; components merge | `plugin.json` manifest; hooks and tools merge | Both: additive merge |

---

## 8. Decision Guide: Which File Do I Create?

When you are unsure where to put a piece of configuration, use this decision tree:

| I want to... | Claude Code | GitHub Copilot |
|---------------|-------------|----------------|
| Tell the AI about my project structure and conventions | `CLAUDE.md` | `.github/copilot-instructions.md` |
| Restrict what commands the AI can run | `.claude/settings.json` | `.github/hooks/*.json` (`preToolUse` deny) |
| Add rules that only apply to certain file types | `.claude/rules/*.md` | `.github/instructions/*.instructions.md` |
| Create a specialized AI persona for a task | `.claude/agents/*.md` | `.github/agents/*.agent.md` |
| Teach the AI how to produce a specific output | `.claude/skills/*/SKILL.md` | `.github/skills/*/SKILL.md` |
| Auto-run linting or tests after AI edits | `settings.json` → `hooks.PostToolUse` | `.github/hooks/*.json` → `postToolUse` |
| Block dangerous commands before they run | `settings.json` → `hooks.PreToolUse` | `.github/hooks/*.json` → `preToolUse` |
| Run setup when a session starts | — | `.github/hooks/*.json` → `sessionStart` |
| Connect the AI to an external database or API | `.mcp.json` (root) | `.mcp.json` (root or plugin) |
| Create a shortcut command for a common task | `.claude/commands/*.md` | `.github/prompts/*.prompt.md` |
| Share a complete capability bundle with the team | `.plugins.json` + plugin folder | `plugin.json` + plugin folder |
| Standardize indentation and line endings | `.editorconfig` | `.editorconfig` |

---

## 9. Complete Directory Tree Example

The following tree shows a project that uses all available primitives for both platforms. Most projects will use only a subset of these:

```
my-project/
│
├── CLAUDE.md                          #  1. Global instructions (Claude Code)
├── .mcp.json                          #  2. MCP server connections (shared)
├── .editorconfig                      #  3. Editor formatting (cross-platform)
├── .plugins.json                      #  4. Claude Code plugins manifest
│
├── .claude/                           #     ── Claude Code primitives ──
│   ├── settings.json                  #  5. Permissions + hooks config
│   ├── settings.local.json            #  6. Personal overrides (gitignored)
│   ├── rules/                         #  7. Scoped behavioral rules
│   │   ├── api-conventions.md
│   │   ├── markdown-style.md
│   │   └── test-patterns.md
│   ├── agents/                        #  8. Subagent definitions
│   │   ├── analyst.md
│   │   ├── creator.md
│   │   └── orchestrator.md
│   ├── skills/                        #  9. Domain knowledge packs
│   │   ├── docx/
│   │   │   └── SKILL.md
│   │   ├── pptx/
│   │   │   └── SKILL.md
│   │   └── svg-professional/
│   │       └── SKILL.md
│   └── commands/                      # 10. Slash command templates
│       ├── build-deck.md
│       └── assess-legacy.md
│
├── .github/                           #     ── GitHub Copilot primitives ──
│   ├── copilot-instructions.md        # 11. Global instructions (Copilot)
│   ├── agents/                        # 12. Agent definitions
│   │   └── reviewer.agent.md
│   ├── instructions/                  # 13. Scoped instructions (applyTo globs)
│   │   ├── react.instructions.md
│   │   └── api.instructions.md
│   ├── prompts/                       # 14. Reusable prompt templates
│   │   ├── code-review.prompt.md
│   │   └── gap-analysis.prompt.md
│   ├── skills/                        # 15. Domain knowledge packs
│   │   └── api-design/
│   │       └── SKILL.md
│   ├── hooks/                         # 16. Lifecycle event handlers
│   │   ├── security-gates.json
│   │   └── quality-checks.json
│   └── plugins/                       # 17. Installed Copilot plugins
│       └── my-plugin/
│           ├── plugin.json
│           ├── agents/
│           ├── skills/
│           ├── hooks.json
│           └── .mcp.json
│
└── src/                               #     ── Your application code ──
    ├── CLAUDE.md                      # 18. Subdirectory instructions (cascading)
    └── ...
```

The numbers (1–18) in the tree correspond to the order of conceptual importance, not loading order. See Section 6 for runtime loading order.

---

## References

### Claude Code

- [Claude Code Hooks Reference](https://code.claude.com/docs/en/hooks) — Official Anthropic docs on all hook events, handler types, and exit code semantics
- [Claude Code Documentation — Configuration](https://docs.anthropic.com/en/docs/claude-code) — Official Anthropic docs on `CLAUDE.md`, settings, and MCP
- [Claude Code Hooks Complete Guide (2026 Edition)](https://smartscope.blog/en/generative-ai/claude/claude-code-hooks-guide/) — Community guide with production patterns

### GitHub Copilot

- [Hooks Configuration Reference](https://docs.github.com/en/copilot/reference/hooks-configuration) — Official GitHub docs on hook JSON schema and events
- [Using Hooks with GitHub Copilot Agents](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/use-hooks) — Coding Agent hook setup
- [Agent Hooks in VS Code (Preview)](https://code.visualstudio.com/docs/copilot/customization/hooks) — VS Code hook integration
- [Prompt Files in VS Code](https://code.visualstudio.com/docs/copilot/customization/prompt-files) — Official `.prompt.md` format documentation
- [About CLI Plugins](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-cli-plugins) — Plugin system overview
- [CLI Plugin Reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference) — `plugin.json` manifest fields
- [Awesome GitHub Copilot — Plugins](https://awesome-copilot.github.com/plugins/) — Community plugin marketplace
- [GitHub Copilot Custom Instructions](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot) — `copilot-instructions.md` and scoped instructions

### Cross-Platform

- [Model Context Protocol Specification](https://modelcontextprotocol.io/) — The MCP standard for tool integration (works with both platforms)
- [GitHub Copilot: Instructions vs Prompts vs Agents vs Skills](https://dev.to/pwd9000/github-copilot-instructions-vs-prompts-vs-custom-agents-vs-skills-vs-x-vs-why-339l) — Community comparison of all Copilot primitives

### Internal Knowledge Base

- [Prompt Integration: The 6 Layers](prompt-integration-6-layers_v1.0.0_2026-03-18.md) — How prompt layers merge at runtime
- [Ecosystem Reference Map](ecosystem-reference-map_v1.0.0_2026-03-18.md) — Maps files to runtime layers
- [Orchestration Flow: Agents + Skills](orchestration-flow-agents-skills_v1.0.0_2026-03-18.md) — Agent lifecycle and handoff patterns
