---
title: "Complete Skill Lifecycle: From Idea to Distribution"
description: "End-to-end visual guide covering all phases of creating an Agent Skill from scratch, including essential, optional, and quality phases"
author: Paula Silva
date: 2026-03-18
version: 1.0.0
status: active
tags:
  - skills
  - lifecycle
  - development
  - distribution
  - best-practices
source_image: ../../sources/images/diagrams/Ciclo Completo Skills.png
---

# Complete Skill Lifecycle: From Idea to Distribution

## Visual Description

This diagram is a comprehensive, color-coded reference sheet organized into three horizontal phases (Essential, Optional, Quality) plus a maturity progression bar at the bottom. Each phase contains numbered steps presented as card-style blocks with detailed instructions, commands, and file references. The layout uses pastel color coding: yellow for the essential phase, green/blue for optional steps, and purple/pink for the quality phase.

## Phase 1: Essential ("Tudo skill precisa destas 3 passos")

Every skill must complete these three steps:

1. **Identify and Organize** -- Define the skill's purpose, determine if it is reusable across projects (or project-specific), establish a clear naming convention, create the folder structure with descriptive filenames, and ensure the skill answers the "SFA test" (Scope, Format, Audience).

2. **Create the Structure** -- Write the SKILL.md file with YAML frontmatter including `description`, `globs`, and `alwaysApply` fields. Define the file's five core sections: description/purpose, domain rules, step-by-step workflow, output templates, and validation checklist. Add examples for clarity.

3. **Estimate Distribution** -- Decide the visibility: workspace-wide (`/`), folder-scoped, or project-specific. Configure `applyTo` fields to control which files, folders, or glob patterns activate the skill. Set appropriate access permissions.

## Phase 2: Optional ("Adicionar poder com automacao e recursos extras")

4. **Add Scripts (scripts/)** -- Create automation scripts in Python, Bash, or Node.js. Place them under `.github/scripts/` or equivalent. Include shebangs, argument validation, and error handling.

5. **Enrich (references + examples)** -- Add reference documents, data, or pre-built templates. Include links to external documentation, APIs, or related skills. Provide real-world examples the agent can follow.

## Phase 3: Quality ("Validar antes da distribuicao garantir que funciona de verdade")

6. **Validate and Test** -- Test the skill end-to-end with real prompts. Verify output matches the defined templates. Run all checklist items. Ensure every section of the SKILL.md produces the expected behavior.

7. **Distribute** -- Publish the skill to the appropriate scope. Validate that other agents can discover and invoke the skill. Confirm the skill activates correctly based on glob patterns and applyTo configuration.

## Maturity Model (Bottom Bar)

The diagram shows a 5-level progression:

| Level | Description |
|-------|-------------|
| **Level 1** | Basic SKILL.md body (~40 lines) |
| **Level 2** | SKILL.md with body + references, completing templates |
| **Level 3** | Adds scripts, portals, references, enriched content |
| **Level 4** | Adds automated tests, CI validation |
| **Level 5** | Full production-ready skill with complete distribution |

## Key Concepts

- **SFA Test**: Scope, Format, Audience -- every skill must clearly define these three dimensions
- **applyTo / globs**: Configuration fields that control when a skill is automatically activated by the agent
- **alwaysApply**: Boolean flag that forces the skill to be loaded for every interaction regardless of context

## How It Relates to the Framework

This lifecycle directly supports the framework's emphasis on reusable, composable knowledge assets. Skills are the primary mechanism for encoding domain expertise into the agentic system, and this diagram ensures consistent quality across all skills in the workspace.

## References

- [The Complete Guide to Building Skills for Claude](The-Complete-Guide-to-Building-Skill-for-Claude_v1.0.0_2026-03-17.md) -- detailed written guide that expands on each phase shown in this diagram
- [Prompt Integration: 6 Layers](prompt-integration-6-layers_v1.0.0_2026-03-18.md) -- shows how SKILL.md fits into the full prompt context
- [Ecosystem Reference Map](ecosystem-reference-map_v1.0.0_2026-03-18.md) -- maps SKILL.md files within the broader agent ecosystem
