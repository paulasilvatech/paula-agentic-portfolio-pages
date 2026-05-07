---
title: "Hooks: What They Are, When They Fire, and How They Work"
description: "Visual guide to the hook lifecycle in the agentic framework, covering triggers, pre-hooks, post-hooks, error-hooks, and a factory sensor analogy"
author: Paula Silva
date: 2026-03-18
version: 1.0.0
status: active
tags:
  - hooks
  - lifecycle
  - automation
  - governance
  - error-handling
source_image: ../../sources/images/diagrams/Hooks_ O Que Sao, Quando Disparam e Como Funcionam.jpg
---

# Hooks: What They Are, When They Fire, and How They Work

## Visual Description

This diagram is organized into three major sections stacked vertically. The top section shows four trigger types in colored boxes. The middle section presents the full hook lifecycle as a vertical flowchart with branching paths for success and failure. The bottom section offers a factory-sensor analogy to make the concept intuitive. Color coding is used throughout: yellow/orange for triggers, blue for pre-hooks, green for execution and post-hooks, red for error-hooks.

## What Triggers a Hook?

Four distinct trigger categories are shown at the top:

| Trigger Type | Examples |
|--------------|----------|
| **Scheduled** (cron) | Cron schedule, periodic scan |
| **GitHub Event** | Push, PR opened, issue created |
| **User Command** | `/test`, `/deploy`, `/review` |
| **State Change** | Build failed, PR approved, merge completed |

## Hook Lifecycle (Main Flowchart)

### PRE-HOOK: Executes BEFORE the Main Action
- **What it does**: Validates pre-conditions, loads context, verifies permissions.
- **Example**: Before generating code, checks if `.instructions.md` has style rules.

### EXECUTION: The Agent's Main Action
- **What it does**: The agent executes its task using skills and tools.
- **Example**: Testing agent generates test cases using the testing skill.

### Two Possible Outcomes After Execution:

#### Success Path --> POST-HOOK
- **POST-HOOK**: Executes AFTER the main action.
- **What it does**: Validates results, notifies, registers logs, triggers the next agent in the chain.
- **Example**: After generating tests, notifies the security agent for review.

#### Failure Path --> ERROR-HOOK
- **ERROR-HOOK**: Executes when something goes wrong.
- **What it does**: Captures the error, attempts fallback, notifies the team, registers the incident.
- **Example**: If the build breaks, the hook automatically triggers a diagnostic agent.

## Factory Sensor Analogy

The diagram concludes with an intuitive analogy comparing hooks to **sensors in a factory**:

| Sensor | Hook Equivalent |
|--------|----------------|
| **Entry sensor** | PRE-HOOK -- verifies raw material before processing |
| **Exit sensor** | POST-HOOK -- verifies quality of the final product |
| **Emergency sensor** | ERROR-HOOK -- stops the line if something goes wrong |

Each sensor triggers an **AUTOMATIC ACTION** without requiring human intervention.

## Key Concepts

- **Hooks are passive listeners**: They do not execute on their own; they respond to triggers.
- **Hooks are mandatory guardrails**: Agents cannot bypass hooks; they are enforced by the system.
- **Error isolation**: The error-hook ensures that failures are captured and handled gracefully rather than propagating silently.
- **Chaining**: Post-hooks can trigger the next agent, enabling the multi-agent pipeline pattern.

## How It Relates to the Framework

Hooks implement the governance layer of the framework. They ensure that every agent action is preceded by validation (pre-hook), followed by quality checks (post-hook), and protected by error handling (error-hook). This aligns with the framework's emphasis on controlled, auditable automation described in the governance section of FRAMEWORK.md.

## References

- [FRAMEWORK.md](../../FRAMEWORK.md) -- governance section defining hook policies and enforcement rules
- [Orchestration Flow: Agents + Skills](orchestration-flow-agents-skills_v1.0.0_2026-03-18.md) -- shows where hooks fire within the orchestration phases
- [Agent Handoff Flow](agent-handoff-flow_v1.0.0_2026-03-18.md) -- hooks wrap each handoff for logging and validation
- [Technical Architecture: Agentic Framework](../architecture/06_Technical_Architecture_Agentic_Framework_v1.2.0_2026-03-12.md) -- architectural context for hook integration
