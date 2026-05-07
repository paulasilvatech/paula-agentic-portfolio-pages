---
title: "Prompt Integration: The 6 Layers That Form the Final Context"
description: "Detailed diagram showing how six distinct configuration layers merge to form the complete prompt context delivered to an agent at runtime"
author: Paula Silva
date: 2026-03-18
version: 1.0.0
status: active
tags:
  - prompts
  - context
  - layers
  - integration
  - architecture
source_image: ../../sources/images/diagrams/Integracao de Prompts_ As 6 Camadas que Formam o Contexto Final.jpg
---

# Prompt Integration: The 6 Layers That Form the Final Context

## Visual Description

This diagram presents a wide horizontal layout with six vertical columns, each representing one layer of prompt context. Each column is color-coded and contains a sequential flowchart showing how that layer's content is constructed. At the bottom, all six columns converge into a single merge point labeled "COMO AS CAMADAS SE COMBINAM" (How the Layers Combine), followed by a sequential pipeline showing the order in which layers are assembled into the final context.

## The 6 Layers

### Layer 0 -- USER PROMPT ("O que o usuario Pediu")
- **Color**: Yellow
- **Source**: Direct user input in the chat
- The user's natural language request, including any context, constraints, or preferences they provide
- Contains the user's intent, desired format, scope, and any specific instructions
- Forms the foundation upon which all other layers build

### Layer 1 -- SYSTEM PROMPT ("Base do Modelo")
- **Color**: Orange
- **Source**: System-level configuration (`System Prompt no LLM`)
- Sets the PERSONA and COMPORTAMENTO (behavior) of the base model
- Defines core capabilities, response formatting rules, and safety constraints
- Configured at the model/provider level, not by the user

### Layer 2 -- CUSTOM INSTRUCTIONS ("Regras do Repositorio")
- **Color**: Green
- **Source**: `.instructions.md` files
- Activates AUTOMATICALLY based on `applyTo` configuration (file, folder, or glob pattern)
- Quantified as TRUE rules that agents cannot override
- Contains coding standards, naming conventions, style rules specific to the repository

### Layer 3 -- INSTRUCTIONS/RULES ("Regras por Escopo")
- **Color**: Blue
- **Source**: Scoped instruction files
- Rules delivered automatically per context scope
- Contains situational rules that apply to specific file types, folders, or agent contexts
- More granular than Layer 2; applies conditionally based on the current task

### Layer 4 -- AGENT IDENTITY ("Personalidade do Agente")
- **Color**: Purple
- **Source**: `.agent.md` files
- Defines WHO the agent is: name, role, personality
- Configures which tools the agent can modify and use
- Establishes handoff rules: to whom, when, and under what conditions
- Creates the agent's scoped worldview and behavioral boundaries

### Layer 5 -- SKILL ("Conhecimento do Dominio")
- **Color**: Red/Orange
- **Source**: `SKILL.md` files
- Best practices and domain knowledge (e.g., how to create DOCX, PPTX, diagrams)
- Step-by-step workflows for specific task types
- Comprehensive validation checklists
- Output templates and formatting rules

## How Layers Combine (Merge Pipeline)

The bottom section shows the sequential assembly order:

1. **Start**: Model receives the base system prompt
2. **Enrich**: Custom instructions and scoped rules are injected based on context
3. **Personalize**: Agent identity is loaded, defining personality and capabilities
4. **Specialize**: Skill knowledge is added with domain-specific workflows
5. **Contextualize**: The user prompt is placed as the final, highest-priority input
6. **Execute**: The fully assembled context drives the agent's response generation

## Key Concepts

- **Layer Precedence**: Later layers can refine but not contradict earlier layers. The system prompt sets hard boundaries; skills add domain knowledge within those boundaries.
- **Automatic Injection**: Layers 2-5 are injected automatically based on configuration, not user action. The user only controls Layer 0.
- **Composability**: Any combination of layers can be active. A generalist agent without a skill uses Layers 0-3; a custom agent with a skill uses all six.

## How It Relates to the Framework

This 6-layer model is the theoretical foundation for understanding how context is constructed in the agentic system. It explains why skills, instructions, and agent identities exist as separate files -- each targets a different layer of the prompt context, allowing independent evolution and reuse.

## References

- [The Complete Guide to Building Skills for Claude](The-Complete-Guide-to-Building-Skill-for-Claude_v1.0.0_2026-03-17.md) -- explains how to create Layer 5 (SKILL.md) content
- [Ecosystem Reference Map](ecosystem-reference-map_v1.0.0_2026-03-18.md) -- maps the files that produce each layer
- [Orchestration Flow: Agents + Skills](orchestration-flow-agents-skills_v1.0.0_2026-03-18.md) -- shows Phase 3 where instructions are automatically applied
- [Technical Architecture: Agentic Framework](../architecture/06_Technical_Architecture_Agentic_Framework_v1.2.0_2026-03-12.md) -- architectural context for the layered prompt model
