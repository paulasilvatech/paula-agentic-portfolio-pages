---
title: "Modernizing Legacy Code with GitHub Copilot -- Infographic"
description: "Visual reference card summarizing the four-step modernization workflow using GitHub Copilot, covering COBOL, Python 2, and .NET Framework migrations"
author: Paula Silva
role: "Software Global Black Belt"
contact: "paulasilva@microsoft.com"
date: 2026-03-18
version: 1.0.0
status: "approved"
locale: "en"
tags:
  - modernization
  - legacy-code
  - github-copilot
  - cobol
  - python
  - dotnet
  - infographic
source_image: ../../sources/images/diagrams/Modernizando Legacy Code.png
---

# Modernizing Legacy Code with GitHub Copilot -- Infographic

## Visual Description

This diagram is a compact, card-style infographic organized into four horizontal rows (steps), each containing three columns of practical guidance. The layout uses pastel color blocks: yellow for Step 1, blue for Step 2, green for Step 3, and pink/red for Step 4. A footer section contains "FACA" (Do) and "NAO FACA" (Don't) best practice panels. The header specifies target languages: COBOL, Python 2, .NET Framework -- all migrating to modern equivalents.

## Step 1 -- ENTENDER (Understand: Read the code, understand what it does)

| Column | Content |
|--------|---------|
| **Start** | Read the code to understand what it does. Explore modules, identify the flow and capture the business logic |
| **Map the flow** | Create data flow diagrams to understand inter-component relationships. Document which programs call which, and trace data transformations |
| **Key prompt** | "Explain this COBOL program line by line." Use Copilot Chat to decode unfamiliar syntax and legacy patterns |

**DICA COALA (KOALA Tip)**: Start with small, self-contained modules. Focus on understanding before changing anything.

## Step 2 -- DOCUMENTAR (Document: Map everything BEFORE modifying)

| Column | Content |
|--------|---------|
| **Reverse document** | Generate documentation from existing code. Create module-level descriptions covering inputs, outputs, and business rules |
| **Configure Copilot** | Set up Copilot-specific instructions for the project. Create `.instructions.md` files that give the AI proper context about the codebase |
| **Prompt strategy** | Use prompts that generate descriptive inline comments and module-level documentation. Build context progressively |

**SOCAS**: Document by module, not all at once. Each module's documentation feeds into the migration context.

## Step 3 -- TESTAR (Test: Create a safety net before migrating)

| Column | Content |
|--------|---------|
| **Use Copilot for tests** | Generate unit tests, integration tests, and edge case coverage using Copilot's test generation capabilities |
| **What to test** | Cover inputs, outputs, edge cases, error handling, boundary conditions, and state transitions. Validate that tests ACTUALLY protect against regression |
| **Example: COBOL to Node.js** | Create test suites that validate business logic equivalence across language boundaries. Focus on behavioral testing, not implementation testing |

## Step 4 -- CONVERTER (Convert: Module by module, never big bang)

| Column | Content |
|--------|---------|
| **Break into parts** | Convert one function or module at a time. Use small, focused prompts that maintain the same business logic |
| **Modernize the style** | Apply modern patterns: async/await, proper error handling, naming conventions, dependency injection. Use Agent Mode for multi-file changes |
| **Use modern tooling** | Run all Phase 3 tests against the new code. Apply iterative refinement using Copilot suggestions. Ensure output parity |

## Best Practices Footer

### FACA (Do)
- Analyze before modifying (explain, diagnose)
- Write tests BEFORE refactoring (test as a safety net)
- Convert module by module, maintain atomic changes
- Use AI-friendly prompts: Explain, Fix, Refactor

### NAO FACA (Don't)
- Rewrite everything at once (big bang migration)
- Skip tests (testing is non-negotiable)
- Mix large tasks (keep scope focused per iteration)
- Trust AI output blindly (always review generated code)

## Key Concepts

- **GitHub Copilot as Modernization Partner**: Copilot is used across all four steps -- understanding, documenting, testing, and converting -- making it the central tool in the workflow.
- **Language Agnostic**: The workflow applies to COBOL, Python 2, .NET Framework, and any legacy technology stack.
- **Module-by-Module**: Consistent emphasis on incremental, modular migration rather than full rewrites.

## How It Relates to the Framework

This infographic is a practitioner-friendly summary of the framework's modernization methodology. It complements the detailed 5-phase workflow diagram by providing concise, actionable guidance with specific prompts and examples that teams can reference during execution.

## References

- [COBOL Modernization Guide](../cobol-natural/COBOL-modernization_.md) -- detailed COBOL-specific modernization patterns and techniques
- [5-Phase Modernization Workflow](modernization-workflow-5-phases_v1.0.0_2026-03-18.md) -- the expanded flowchart version of this same workflow
- [AI-Generated Code Review Guide](ai-generated-code-review-guide_v1.0.0_2026-03-18.md) -- review practices for validating Copilot-generated code
- [Operational Playbook](07_Operational_Playbook_Carving_Performance_Coexistence_v1.2.0_2026-03-12.md) -- detailed operational procedures for legacy carving
