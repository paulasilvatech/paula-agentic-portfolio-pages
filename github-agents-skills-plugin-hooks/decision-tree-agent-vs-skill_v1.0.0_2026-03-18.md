---
title: "Decision Tree: When to Use Custom Agent vs Generalist vs Skill"
description: "Flowchart-based decision guide for selecting the right agent type or skill configuration based on task requirements"
author: Paula Silva
date: 2026-03-18
version: 1.0.0
status: active
tags:
  - decision-tree
  - agents
  - skills
  - architecture
  - routing
source_image: ../../sources/images/diagrams/Arvore de Decisao_ Quando Usar Agente Customizado vs Generalista vs Skill.jpg
---

# Decision Tree: When to Use Custom Agent vs Generalist vs Skill

## Visual Description

This diagram presents a top-down flowchart that guides practitioners through a series of decision points to determine the correct agent-skill configuration for any incoming task. The flow begins with a single entry point ("Nova tarefa chega ao sistema") and branches through four sequential yes/no decision diamonds, ultimately arriving at one of three terminal outcomes color-coded for clarity.

## Decision Points (Top to Bottom)

1. **Does the task require SPECIFIC TOOLS?** (e.g., MCP servers, APIs, dedicated CLIs)
   - YES path leads toward Custom Agent + Skill.
   - NO path continues to the next question.

2. **Does the task require a specific PERSONALITY or TONE?** (e.g., a rigorous security agent, a friendly documentation agent)
   - YES path leads toward Custom Agent + Skill.
   - NO path continues to the next question.

3. **Does the task involve MULTIPLE STAGES with handoff between agents?**
   - YES path leads toward Custom Agent + Skill.
   - NO path continues to the final question.

4. **Does a SKILL.md exist that covers the domain?**
   - YES leads to Generalist Agent + Skill.
   - NO leads to Generalist Agent without Skill.

## Three Outcomes

| Outcome | When to Use | Examples |
|---------|-------------|----------|
| **Custom Agent + Skill** (red box) | Task needs its own `.agent.md` with unique identity, exclusive tools, and well-defined scope | Security agent with vault MCP, test agent with CI/CD tools, modernization agent with Terraform |
| **Generalist Agent + Skill** (teal box) | A skill already contains all necessary knowledge; the generalist agent applies best practices without needing a specialized identity | Creating DOCX documents, generating diagrams, analyzing CSV data, creating PPTX presentations |
| **Generalist Agent without Skill** (purple box) | Simple task that does not require specialized knowledge | Answering factual questions, brainstorming, general conversations, simple calculations |

## Key Concepts

- **Custom Agent**: Has its own `.agent.md` file defining identity, personality, tools, and handoff configuration. Used when domain specialization is critical.
- **Generalist Agent**: The default orchestrator that can operate with or without a skill. It applies general best practices and uses workspace-level tools.
- **Skill (SKILL.md)**: A domain-specific knowledge file containing templates, workflows, checklists, and best practices. Skills augment any agent type with specialized knowledge.

## How It Relates to the Framework

This decision tree is a critical routing mechanism within the Agentic Framework's orchestration layer. It ensures that tasks are handled by the most appropriate combination of agent and skill, avoiding both over-engineering (using a custom agent for a simple task) and under-engineering (using a generalist for a task requiring specialized tools). The tree directly implements the agent selection logic described in the Technical Architecture document.

## References

- [Technical Architecture: Agentic Framework](../architecture/06_Technical_Architecture_Agentic_Framework_v1.2.0_2026-03-12.md) -- defines the orchestration layer and agent types
- [Orchestration Flow: Agents + Skills](orchestration-flow-agents-skills_v1.0.0_2026-03-18.md) -- shows the full execution flow after an agent is selected
- [Agent Handoff Flow](agent-handoff-flow_v1.0.0_2026-03-18.md) -- details the multi-stage handoff referenced in decision point 3
- [Ecosystem Reference Map](ecosystem-reference-map_v1.0.0_2026-03-18.md) -- maps the files (.agent.md, SKILL.md) referenced in the decision tree
