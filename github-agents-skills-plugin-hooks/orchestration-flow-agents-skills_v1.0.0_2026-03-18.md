---
title: "Orchestration Flow: Agents + Skills -- How It Works"
description: "Four-phase flowchart showing how a user request flows through the orchestrator agent, routing, skill loading, instruction application, and final validation"
author: Paula Silva
date: 2026-03-18
version: 1.0.0
status: active
tags:
  - orchestration
  - agents
  - skills
  - workflow
  - routing
source_image: ../../sources/images/diagrams/Fluxo de Orquestracao_ Agents + Skills — Como Funciona.jpg
---

# Orchestration Flow: Agents + Skills -- How It Works

## Visual Description

This diagram is a vertical flowchart divided into four clearly labeled phases, each enclosed in a distinct section. The flow uses color-coded shapes: yellow rounded rectangles for user actions, blue rectangles for orchestrator operations, purple diamonds for decision points, green boxes for generalist agent path (Path B), orange/red boxes for custom agent path (Path A), and red boxes for instruction and validation steps. Arrows connect all nodes sequentially from top to bottom.

## Phase 1 -- ENTRADA (Entry)

1. **User types a request** in the chat interface (yellow box).
2. The **prompt** is received by the **ORCHESTRATOR AGENT** (blue box).
3. The orchestrator **loads its identity** by reading its own `.agent.md` file to know its identity, tone, and capabilities (green box).

## Phase 2 -- ANALISE E ROTEAMENTO (Analysis and Routing)

4. The orchestrator **analyzes the request** and detects the task TYPE: code, document, diagram, test, etc. (orange box).
5. It **searches for the corresponding SKILL.md** based on the detected type (green box).
6. **Decision diamond**: "Does this need a specialized agent?"
   - **NO** (standard task covered by skill) --> Path B: Generalist Agent + Skill
   - **YES** (complex task or specific domain) --> Path A: Custom Agent + Skill

### Path A -- Custom Agent + Skill
- Delegates to a **SPECIALIZED SUB-AGENT** (orange box)
- Sub-agent loads its own `.agent.md` with specific identity, personality, and scope
- Sub-agent activates its **dedicated TOOLS**: MCP servers, APIs, CLIs
- Applies SKILL.md with domain-specific best practices

### Path B -- Generalist Agent + Skill
- **GENERALIST AGENT assumes the task** (green box)
- Loads SKILL.md directly without sub-agent intermediary
- Uses **generic tools** available in the workspace

## Phase 3 -- INSTRUCOES AUTOMATICAS (Automatic Instructions)

Both paths converge here:
7. **INSTRUCTIONS** are applied automatically via `.instructions.md` (red box).
8. The `applyTo` field defines the **SCOPE**: which files, folders, or agents receive the rules.
9. Task is executed with **complete context**: skill + instructions + tools.

## Phase 4 -- VALIDACAO E ENTREGA (Validation and Delivery)

10. Result is **validated against criteria** defined in the SKILL (green box).
11. **Quality checklist**: formatting, content, conventions, cited sources (green box).
12. **Final response delivered** to the user (green box).

## Key Concepts

- **Orchestrator Agent**: The central routing agent that receives all requests and decides the execution path. It is the only agent the user interacts with directly.
- **Path A vs Path B**: The critical architectural split between tasks requiring specialized agents and tasks that can be handled by the generalist with skill augmentation.
- **Automatic Instructions**: Rules from `.instructions.md` that are injected into the context automatically, serving as guardrails the agent cannot ignore.

## How It Relates to the Framework

This orchestration flow is the runtime implementation of the Agentic Framework architecture. It shows how the abstract components (agents, skills, instructions) interact at execution time to process a real user request. The four phases map directly to the framework's emphasis on structured, validated, quality-controlled output.

## References

- [Technical Architecture: Agentic Framework](../architecture/06_Technical_Architecture_Agentic_Framework_v1.2.0_2026-03-12.md) -- defines the architectural layers this flow implements
- [Decision Tree: Agent vs Skill](decision-tree-agent-vs-skill_v1.0.0_2026-03-18.md) -- the decision logic used in Phase 2's routing diamond
- [Hooks Lifecycle](hooks-lifecycle_v1.0.0_2026-03-18.md) -- details the pre/post-hook mechanisms that wrap each phase
- [Agent Handoff Flow](agent-handoff-flow_v1.0.0_2026-03-18.md) -- expands on what happens in Path A when multiple agents are involved
