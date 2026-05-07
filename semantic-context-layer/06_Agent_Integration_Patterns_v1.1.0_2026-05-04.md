---
title: "06 Agent Integration Patterns"
description: "How to wire SCL-AD context into AI coding agents through static files, MCP servers, native integrations, and hybrid patterns."
author: "Paula Silva"
date: "2026-05-04"
version: "1.1.0"
status: "draft"
tags: ["scl-ad", "agent-integration", "github-copilot", "mcp", "patterns"]
---

# 06 Agent Integration Patterns

> The patterns and concrete configurations that connect the Context Registry to AI coding agents in production developer workflows.

## Change Log

| Version | Date       | Author      | Changes                                                                                                              |
|---------|------------|-------------|----------------------------------------------------------------------------------------------------------------------|
| 1.1.0   | 2026-05-04 | Paula Silva | Clarified auto-wiring of agent configuration files; added section on the BYOM pattern; added Moddy reference as MCP example. |
| 1.0.0   | 2026-05-04 | Paula Silva | Initial version with four integration patterns and per-agent configuration reference.                                |

## Table of Contents

- [1. The Integration Problem](#1-the-integration-problem)
- [2. Pattern 1: Static File Injection](#2-pattern-1-static-file-injection)
- [3. Pattern 2: MCP Server Integration](#3-pattern-2-mcp-server-integration)
- [4. Pattern 3: Custom Agent Configuration](#4-pattern-3-custom-agent-configuration)
- [5. Pattern 4: Hybrid Distribution](#5-pattern-4-hybrid-distribution)
- [6. Per-Agent Configuration Reference](#6-per-agent-configuration-reference)
- [7. The BYOM Pattern](#7-the-byom-pattern)
- [8. Anti-Patterns to Avoid](#8-anti-patterns-to-avoid)
- [References](#references)

## 1. The Integration Problem

Agent platforms differ in how they consume context. Some read repository files automatically. Some require explicit MCP tool definitions. Some support custom system prompts; others do not. SCL-AD's role is to translate the registry's authoritative artifacts into whatever shape each agent platform expects.

The integration layer must satisfy three constraints simultaneously:

The integration must be **lossless**. Whatever the agent receives must preserve the semantic meaning of the registry artifact. Truncation, paraphrasing, or summarization at the integration boundary defeats the purpose of deterministic context.

The integration must be **bounded**. Token budgets are finite. Static injection cannot exceed the agent's context window. Dynamic queries cannot exceed the agent's tool call budget.

The integration must be **controllable**. Developers and platform teams must be able to enable, disable, and tune which context an agent sees, without modifying the registry or the recipes.

Four patterns satisfy these constraints in different deployment scenarios. Most production systems use more than one.

## 2. Pattern 1: Static File Injection

The simplest pattern. Selected artifacts from the registry are written to known file paths in the repository or developer workspace. The agent reads these files as part of its standard initialization.

### 2.1 When to Use

Static file injection is the default for agents that auto-load repository instruction files (such as GitHub Copilot's `copilot-instructions.md`, Claude Code's `CLAUDE.md`, Cursor's `.cursorrules`, the emerging `AGENTS.md` convention).

It is the right choice when:

- The agent has no MCP support
- Coverage matters more than fidelity
- The pilot is in early stages and rapid iteration is needed
- The organization wants the lowest-friction rollout

### 2.2 What to Inject

The most valuable artifacts for static injection are those that benefit every agent interaction in a repository:

- A condensed Structural Inventory that names the modules and their purposes
- The Convention Extraction artifact, which is high-leverage on every code generation
- A summary of the Service Topology relevant to the current repository
- Pointers (URIs) to other artifacts available in the registry

Static injection should never include the full Dependency Intelligence CSV or full Configuration Surface, which are large and rarely needed in their entirety.

### 2.3 File Layout

A recommended layout, neutral across agent platforms:

```
.context/
├── inventory.md           # Structural Inventory summary
├── conventions.md         # Convention Extraction summary
├── topology.md            # Service Topology summary
├── deployment.md          # Deployment Context summary
├── manifest.json          # URIs to full artifacts in registry
└── README.md              # How to use this directory
```

### 2.4 Auto-Wiring Agent Configuration Files

Every agent platform reads from one or more well-known configuration files. SCL-AD recipe pipelines must auto-update these files with pointers to the generated artifacts. Manual maintenance is the enemy of staleness control.

The canonical files to auto-wire are:

| File                                     | Agent Platform                          |
|------------------------------------------|-----------------------------------------|
| `.github/copilot-instructions.md`        | GitHub Copilot (all surfaces)           |
| `CLAUDE.md` (root and nested)            | Claude Code                             |
| `.cursorrules`                           | Cursor                                  |
| `AGENTS.md`                              | Vendor-neutral convention (multiple)    |

The recipe pipeline writes a managed block (delimited by clear markers such as `<!-- SCL-AD: managed block -->`) into each file with pointers to the relevant artifacts in `.context/`. Content outside the managed block is preserved unchanged.

This pattern is what the Moderne Prethink starter recipes implement; SCL-AD codifies it as the default behavior of any compliant pipeline. Without auto-wiring, the integration drifts within days of the first manual edit.

### 2.5 Generation Pipeline

The injection step is itself a recipe-like operation. A pipeline job:

1. Queries the registry for the latest artifacts of the targeted types
2. Applies a transformation that produces compact, agent-friendly Markdown
3. Writes the output to `.context/`
4. Updates managed blocks in agent configuration files
5. Commits the changes (or opens a pull request) on a defined cadence

The transformation is critical. Raw recipe outputs are not optimized for agent consumption. The injection step compresses, summarizes, and prioritizes.

## 3. Pattern 2: MCP Server Integration

The Model Context Protocol provides a standard for agents to query external context dynamically. An MCP server in front of the registry exposes its capabilities as tools the agent invokes on demand.

### 3.1 When to Use

MCP integration is the right choice when:

- The agent platform supports MCP natively (which is increasingly the norm)
- Dynamic, query-driven context retrieval is needed
- Multiple agents share the same registry and benefit from a unified interface
- Token economy matters and only relevant slices of context should reach the agent

### 3.2 Tool Surface

The MCP server exposes the registry's discovery API as a set of tools. A minimal tool surface:

| Tool Name                       | Purpose                                                          |
|---------------------------------|------------------------------------------------------------------|
| `list_repository_artifacts`     | Enumerate available artifacts for a repository                   |
| `get_artifact`                  | Fetch a specific artifact by URI or repository plus type         |
| `search_dependencies`           | Query the Dependency Intelligence index across repositories      |
| `find_callers`                  | Locate code that calls a given symbol (uses Structural data)     |
| `describe_service`              | Return Service Topology entry for a named service                |
| `find_convention`               | Look up the convention for a category (logging, errors, etc.)    |

This surface is illustrative. The right surface depends on which agent operations dominate in the organization.

### 3.3 Server Topology

Two deployment topologies are common:

**Per-developer MCP server.** The MCP server runs locally on each developer's workstation, calling the registry on their behalf. Identity is tied to the developer's session. Network exposure is minimal.

**Shared MCP server.** A centrally-hosted MCP server is shared across developers and agent runtimes. Identity is propagated through OAuth or similar. Easier to operate; more sensitive to security design.

The choice depends on the agent runtime topology and the organization's network architecture.

### 3.4 Caching and Performance

MCP queries should be answered fast (single-digit seconds at the worst case). The MCP server should:

- Cache artifact responses keyed by URI for the duration of a session
- Pre-fetch the most likely artifacts when a session begins
- Respect cache invalidation signals from the registry's refresh events

Slow context retrieval is worse than no context retrieval. Agents will time out and fall back to inference.

### 3.5 Reference: Multi-Repo MCP Servers in the Wild

The pattern of exposing a code intelligence platform as an MCP server is increasingly common. Moderne's Moddy is one published example: it exposes the Lossless Semantic Tree and the OpenRewrite recipe catalog as MCP tools, allowing any MCP-capable agent (Claude Code, GitHub Copilot Agent Mode, Cursor) to query semantic context and trigger deterministic transformations side by side with their normal operation.

Organizations building their own SCL-AD implementation should treat such platforms as design references, not blueprints. The tool surface that fits a given organization is a function of its agents, its repositories, and its operational priorities.

## 4. Pattern 3: Custom Agent Configuration

For platforms that support custom agents (GitHub Copilot custom agents, OpenAI custom GPTs, Anthropic-based custom agents, internal agentic frameworks), SCL-AD context is configured at the agent level rather than the repository level.

### 4.1 When to Use

Custom agent configuration is the right choice when:

- A specialized agent is purpose-built for a category of tasks
- The agent benefits from a curated, role-specific subset of context
- Multiple developers share the same custom agent definition
- Token economy demands aggressive scoping

### 4.2 Configuration Examples by Role

**Migration agent:** receives Structural Inventory, full Dependency Intelligence, and Convention Extraction. Skips Service Topology and Test Intent. Optimized for transforming code.

**Code review agent:** receives Convention Extraction, Test Intent Mapping, and Security Posture Snapshot. Skips low-level dependency data. Optimized for evaluating proposed changes.

**Architecture agent:** receives Service Topology (CALM), Configuration Surface, and Structural Inventory at the system level. Skips line-level details. Optimized for cross-service reasoning.

**Operations agent:** receives Deployment Context, Configuration Surface, and Service Topology. Skips test and convention data. Optimized for runtime and operational reasoning.

**Onboarding agent:** receives Convention Extraction and Structural Inventory in summary form, plus a curated FAQ. Optimized for explaining the codebase to humans.

### 4.3 Custom Agent Lifecycle

Custom agents are versioned alongside the recipe versions they consume. When a recipe schema changes, agents that depend on that recipe must be reviewed and republished. This is a versioning concern, not a runtime concern, and should be managed through the platform's agent lifecycle.

## 5. Pattern 4: Hybrid Distribution

Production deployments rarely use a single pattern. The hybrid pattern combines static injection for high-frequency, broadly useful context with MCP queries for deep, ad-hoc retrieval.

### 5.1 Reference Hybrid Configuration

A reference configuration for a mid-to-large enterprise:

- **Static injection** of Convention Extraction and a summarized Structural Inventory in every repository's `.context/` directory. This grounds every agent interaction in the repository's basic facts.
- **Auto-wired managed blocks** in `copilot-instructions.md`, `CLAUDE.md`, and `.cursorrules` pointing to the static files and the registry.
- **MCP server** that exposes the registry for deeper queries. Used by GitHub Copilot Agent Mode, custom agents, and IDE extensions for impact analysis, dependency lookups, and Service Topology queries.
- **Per-agent custom configuration** for specialized agents (migration, review, architecture, operations) that need curated, role-specific context.
- **Direct API access** for batch tooling (refactoring scripts, large-scale code modifications) that operate outside an agent loop.

### 5.2 Trade-Offs to Manage

The hybrid pattern introduces complexity. Three trade-offs require explicit decisions:

**Coverage vs. precision.** Static injection covers every repository at low fidelity. MCP queries deliver high fidelity but only for specific questions. The hybrid pattern manages both.

**Latency vs. freshness.** Static files are pre-rendered and instant. MCP queries are on-demand and current. The hybrid pattern matches each artifact type to the appropriate channel.

**Operational simplicity vs. capability.** A single pattern is simple. Multiple patterns are powerful. The hybrid pattern is the right answer when the powerful capability outweighs the operational cost.

## 6. Per-Agent Configuration Reference

This section enumerates how the framework integrates with major agent platforms. Configuration details are illustrative and should be verified against current vendor documentation.

### 6.1 GitHub Copilot

GitHub Copilot supports several mechanisms for context injection:

- `.github/copilot-instructions.md` is read on session start across GitHub Copilot surfaces (IDE, GitHub.com, GitHub Copilot Chat).
- Custom agents in GitHub Copilot can be configured with system prompts that point to repository or external context.
- GitHub Copilot Agent Mode and Coding Agent execute multi-step tasks and benefit most from MCP-served dynamic context.
- The MCP server registration pattern enables GitHub Copilot to call SCL-AD tools directly.

A typical GitHub Copilot integration uses static injection for `copilot-instructions.md` plus an MCP server registered in the user's or organization's configuration.

### 6.2 Cursor and Similar IDE-First Agents

Cursor reads `.cursorrules` and supports MCP servers. The integration pattern mirrors GitHub Copilot: static injection for broad context, MCP for queries.

### 6.3 Claude Code

Claude Code reads `CLAUDE.md` (root and nested) and supports MCP. SCL-AD artifacts can be referenced from `CLAUDE.md` and queried dynamically through MCP.

### 6.4 Custom Agentic Frameworks

For organizations building on LangGraph, AutoGen, OpenAI Agents SDK, Anthropic SDK, or similar frameworks, SCL-AD integration is direct. The framework calls the registry's API or MCP server as part of its tool layer.

This is the highest-fidelity integration path because the framework owner controls how context flows into the model.

### 6.5 Common Convention: AGENTS.md

A growing convention is the use of `AGENTS.md` as a vendor-neutral instructions file. SCL-AD recommends adopting `AGENTS.md` as the primary static injection target, with vendor-specific files (`copilot-instructions.md`, `CLAUDE.md`, `.cursorrules`) generated from the same source for compatibility with platforms that have not yet adopted the convention.

## 7. The BYOM Pattern

Bring Your Own Model (BYOM) is a pattern in which the SCL-AD pipeline can optionally call an organization's approved language model to enrich deterministic artifacts with summaries, knowledge graphs, or natural-language descriptions. The pattern is referenced in the Moderne Prethink starter recipe `UpdatePrethinkContextStarter` and is broadly applicable.

### 7.1 What BYOM Adds

Pure deterministic recipes produce structured facts. BYOM adds:

- **Natural-language summaries** of test intent, derived from test code and assertions
- **Knowledge graphs** that capture relationships across artifacts in a queryable form
- **Architectural narratives** that explain Service Topology in prose suitable for onboarding agents
- **Risk and impact descriptions** for dependency intelligence outputs

### 7.2 Why It Is Optional

BYOM introduces a probabilistic step into an otherwise deterministic pipeline. This is a deliberate trade-off: richer context in exchange for non-determinism in the enriched portions. Organizations with strict reproducibility requirements should keep BYOM disabled. Organizations that prioritize agent ergonomics over reproducibility benefit from enabling it.

### 7.3 BYOM Governance

When enabled, BYOM requires its own governance. The framework's identity propagation, audit logging, and classification controls apply to BYOM calls as they would to any external service interaction. The model used (Anthropic Claude, OpenAI, Gemini, Llama, or others) is treated as a regulated supplier in the registry's access policy.

The deterministic artifacts the BYOM step consumes remain canonical. The BYOM-generated content is recorded as an enrichment, not as authoritative semantic context. Agents are told the difference.

## 8. Anti-Patterns to Avoid

Six integration patterns are explicitly discouraged. They appear in early implementations and should be refactored.

**The "dump everything" pattern.** Static injection of full registry contents into instruction files. Overruns context windows, degrades agent performance, and makes content invisible due to attention dilution.

**The "live parsing" pattern.** Calling language servers or analyzers from inside the agent loop. Introduces latency on every interaction and undermines the determinism the registry provides.

**The "stale snapshot" pattern.** A one-time export of context into instruction files with no refresh pipeline. Drifts from reality immediately and fails silently.

**The "credential blur" pattern.** An MCP server or API endpoint that does not propagate the developer's identity. Either over-exposes context or fails to track who saw what.

**The "magic prompt" pattern.** Augmenting agent prompts with handcrafted instructions intended to compensate for missing context. Fragile, untestable, and circumvents the framework.

**The "duplicate registry" pattern.** Building a separate context store inside the agent platform that mirrors the registry. Creates two sources of truth and the corresponding consistency problems.

The framework's promise depends on integration discipline. Bypassing the registry, even temporarily, creates artifacts the registry cannot govern, refresh, or audit.

## References

1. [GitHub Copilot Documentation: copilot-instructions](https://docs.github.com/en/copilot/customizing-copilot/about-customizing-github-copilot-chat-responses). Reference for static instruction injection in GitHub Copilot.
2. [Model Context Protocol Specification](https://modelcontextprotocol.io/). Standard for dynamic context distribution.
3. [AGENTS.md Convention](https://agents.md/). Emerging vendor-neutral convention for agent instruction files.
4. [Moderne Moddy: Multi-Repo AI Agent](https://www.moderne.ai/product/moddy). Reference example of an MCP-exposed code intelligence platform.
5. [Moderne Blog: Changing the AI context](https://www.moderne.ai/blog/changing-ai-code-context-moderne-prethink). Reference for the auto-wiring pattern of agent configuration files.
6. [Anthropic Engineering: Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents). Industry guidance on context strategy.
