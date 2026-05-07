---
title: "Agent Handoff: How Work Flows from Agent to Agent"
description: "Sequence diagram showing the four handoff steps between specialized agents in a multi-agent pipeline, from planning through security review"
author: Paula Silva
date: 2026-03-18
version: 1.0.0
status: active
tags:
  - handoff
  - agents
  - orchestration
  - sequence-diagram
  - multi-agent
source_image: ../../sources/images/diagrams/Handoff Entre Agentes_ Como o Trabalho Flui de Agente para Agente.jpg
---

# Agent Handoff: How Work Flows from Agent to Agent

## Visual Description

This diagram is a UML-style sequence diagram with six swimlanes (vertical lifelines) representing distinct participants. Solid arrows represent handoff calls (delegation), and dashed arrows represent return responses. The flow moves top-to-bottom chronologically, depicting a complete feature implementation lifecycle from user request through security review.

## Participants (Swimlanes)

| Lane | Label | Role |
|------|-------|------|
| **U** | User | Initiates the request |
| **O** | Orchestrator | Central routing agent; coordinates all handoffs |
| **A** | Planning Agent | Creates structured implementation plans |
| **B** | Coding Agent | Implements the code based on the plan |
| **C** | Testing Agent | Generates and executes test cases |
| **D** | Security Agent | Performs security review and produces findings |

## Handoff Sequence

**Trigger**: User sends request -- "Create login feature with tests and security review"

### HANDOFF 1 -- Orchestrator to Planning Agent
- Orchestrator **delegates planning** with full context of the request.
- Planning Agent **returns a structured plan** with acceptance criteria.

### HANDOFF 2 -- Orchestrator to Coding Agent
- Orchestrator **passes the plan + accumulated context** to the coding agent.
- Coding Agent **returns implemented code** + metadata of created files.

### HANDOFF 3 -- Orchestrator to Testing Agent
- Orchestrator **passes code + plan + acceptance criteria** to the testing agent.
- Testing Agent **returns tests + execution results**.

### HANDOFF 4 -- Orchestrator to Security Agent
- Orchestrator **passes code + tests + results** for security review.
- Security Agent **returns a security report** with findings and recommendations.

**Final Delivery**: Orchestrator assembles all artifacts and delivers the complete result to the user.

## Key Concepts

- **Context Accumulation**: Each handoff passes not only the new input but also all previously accumulated context. The coding agent receives the plan; the testing agent receives both the plan and code; the security agent receives everything.
- **Orchestrator as Hub**: The orchestrator never loses control. Every handoff returns to the orchestrator, which then decides the next step. Agents never communicate directly with each other.
- **Artifact Chaining**: Each agent produces typed artifacts (plans, code, tests, reports) that become inputs for downstream agents.
- **Synchronous Pipeline**: The sequence is strictly ordered -- each agent must complete before the next can begin.

## How It Relates to the Framework

This handoff pattern is the concrete implementation of the "multi-stage task with handoff between agents" branch in the decision tree. It demonstrates why custom agents are needed for complex tasks: each agent in the chain has specialized tools and identity (e.g., the security agent has vault MCP access, the testing agent has CI/CD tools). The pattern also illustrates the framework's emphasis on structured validation at every stage.

## References

- [Technical Architecture: Agentic Framework](../architecture/06_Technical_Architecture_Agentic_Framework_v1.2.0_2026-03-12.md) -- defines the multi-agent orchestration patterns
- [Decision Tree: Agent vs Skill](decision-tree-agent-vs-skill_v1.0.0_2026-03-18.md) -- the third decision point directly references this handoff pattern
- [Orchestration Flow: Agents + Skills](orchestration-flow-agents-skills_v1.0.0_2026-03-18.md) -- shows the broader orchestration within which handoffs occur
- [Hooks Lifecycle](hooks-lifecycle_v1.0.0_2026-03-18.md) -- pre/post hooks may fire around each handoff for logging and validation
