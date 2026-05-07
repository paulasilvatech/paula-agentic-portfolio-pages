---
title: "Ecosystem Reference Map: Agent and Skill File Architecture"
description: "Visual map of the four core file types in the agent-skill ecosystem, detailing the role and contents of .instructions.md, tools/MCP servers, .agent.md, and SKILL.md"
author: Paula Silva
date: 2026-03-18
version: 1.0.0
status: active
tags:
  - ecosystem
  - reference-map
  - file-architecture
  - agents
  - skills
  - instructions
  - tools
source_image: ../../sources/images/diagrams/Mapa de Referencia_ Arquivos do Ecossistema de Agents e Skills.jpg
---

# Ecosystem Reference Map: Agent and Skill File Architecture

## Visual Description

This diagram is organized as four vertical sections, each dedicated to one of the four core file types in the ecosystem. Each section contains a tree-style layout: a root node (the file type) branches out to four descriptive child nodes explaining what the file contains and how it functions. The sections are stacked vertically with clear labels and color coding: red for instructions, green for tools, purple for agent identity, and blue for skills.

## Section 1 -- REGRAS AUTOMATICAS (.instructions.md)

The `.instructions.md` file serves as the automatic rules layer:

| Branch | Description |
|--------|-------------|
| **Examples** | Always use TypeScript strict, always follow naming conventions |
| **Automatic application** | Rules applied AUTOMATICALLY without the user asking |
| **Scope (applyTo)** | Defines SCOPE by file, folder, or glob pattern |
| **Guardrails** | Functions as guardrails -- the agent CANNOT ignore these rules |

## Section 2 -- FERRAMENTAS (Tools and MCP Servers)

The tools layer encompasses all external capabilities available to agents:

| Branch | Description |
|--------|-------------|
| **CLIs** | Terminal commands like `git`, `az`, `kubectl` |
| **MCP Servers** | Connect to external services like GitHub, Figma, Slack |
| **APIs** | HTTP calls to REST or GraphQL services |
| **Functions** | Internal agent functions for data processing |

## Section 3 -- IDENTIDADE DO AGENTE (.agent.md)

The `.agent.md` file defines the agent's complete identity:

| Branch | Description |
|--------|-------------|
| **Scope** | Defines which tasks the agent accepts and which it refuses |
| **Identity** | Defines WHO the agent is: name, role, personality |
| **Tools** | Lists which TOOLS the agent can use: MCP servers, APIs |
| **Handoffs** | Configures handoff rules: to whom it delegates and when |

## Section 4 -- CONHECIMENTO ESPECIALIZADO (SKILL.md)

The `SKILL.md` file contains domain-specific knowledge:

| Branch | Description |
|--------|-------------|
| **Templates** | Includes TEMPLATES and quality standards |
| **Best Practices** | Contains domain best practices: how to create DOCX, PPTX, diagrams |
| **Workflow** | Defines step-by-step WORKFLOW for the task |
| **Checklist** | Establishes validation CHECKLIST for the result |

## Key Concepts

- **Separation of Concerns**: Each file type addresses a distinct aspect of agent behavior -- rules, tools, identity, and knowledge are all independent and composable.
- **Layered Architecture**: These four file types correspond to layers in the prompt integration model (Layers 2-5), ensuring clean separation between what an agent must do (instructions), what it can do (tools), who it is (identity), and what it knows (skills).
- **Discoverability**: All files follow predictable naming and location conventions, allowing the orchestrator to automatically discover and load the right configuration.

## How It Relates to the Framework

This reference map serves as the canonical file architecture guide for the entire agent-skill ecosystem. It is the foundational document that practitioners should consult when creating new agents or skills, ensuring all four file types are properly configured. The map directly supports the AGENTS.md workspace structure documentation.

## References

- [AGENTS.md](../../AGENTS.md) -- workspace structure rules and agent configuration standards
- [Prompt Integration: 6 Layers](prompt-integration-6-layers_v1.0.0_2026-03-18.md) -- shows how these four file types map to prompt context layers
- [Complete Skill Lifecycle](skill-lifecycle-complete_v1.0.0_2026-03-18.md) -- details how to create the SKILL.md component
- [Decision Tree: Agent vs Skill](decision-tree-agent-vs-skill_v1.0.0_2026-03-18.md) -- uses these file types as decision criteria
