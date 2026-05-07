---
title: "Legacy Code Modernization: 5-Phase Workflow + Best Practices"
description: "Step-by-step flowchart detailing the five phases of legacy code modernization -- understand, document, test, convert, and validate -- with best practices sidebar"
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
  - workflow
  - best-practices
  - cobol
  - copilot
source_image: ../../sources/images/diagrams/Modernizacao de Legacy Code_ Workflow em 5 Fases + Boas Praticas.jpg
---

# Legacy Code Modernization: 5-Phase Workflow + Best Practices

## Visual Description

This diagram is a tall vertical flowchart organized into five color-coded phases, each containing sequential steps shown as rounded rectangles. A sidebar on the right (in yellow/orange boxes) lists best practices that apply across all phases. The phases flow top-to-bottom with clear transition labels between them. Color coding: yellow for Phase 1, blue for Phase 2, green for Phase 3, purple for Phase 4, and red for Phase 5.

## Phase 1 -- ENTENDER O CODIGO LEGADO (Understand the Legacy Code)

1. Use Copilot/AI Chat to **explore functions and modules**
2. Ask Copilot to **generate documentation** of existing code
3. Prompt: "Explain what this COBOL program does in simple language"
4. **Map the data flow diagram** between components
5. **Identify dependencies**, critical variables, and coupling points

**Output**: Code understood -- ready for documentation.

## Phase 2 -- DOCUMENTAR ANTES DE MEXER (Document Before Modifying)

1. Generate documentation of **internal resources** -- comments explaining what exists
2. Create Copilot instructions that give **context to the project** (`.instructions.md`)
3. Use Chat Mode to describe **behavior consistently**
4. Document **module by module**, not everything at once
5. This documentation becomes **input context for the migration**

**Output**: Code documented -- ready for test planning.

## Phase 3 -- GERAR PLANO DE TESTES (Generate Test Plan)

1. Ask Copilot to create a **test plan based on existing code**
2. Generate **unit tests and integration tests** before refactoring
3. Prompt: "What tests would validate this code?"
4. Include **security network tests** for the entire module
5. **NEVER modernize without tests** -- they guarantee nothing breaks

**Output**: Tests ready -- proceed to conversion.

## Phase 4 -- CONVERTER E MODERNIZAR (Convert and Modernize)

1. **Break into parts**: one function or module at a time
2. Prompt: "Convert this COBOL to Python, maintaining the same logic"
3. Use **Agent Mode** for multi-file implementations
4. Refactor: **async/await, naming conventions, error handling**
5. **Do NOT rewrite everything at once** -- migrate incrementally

**Output**: Code converted -- ready for validation.

## Phase 5 -- VALIDAR E ITERAR (Validate and Iterate)

1. **Run the tests** created in Phase 3 against the new code
2. **Compare behavior**: output from legacy vs output from new
3. Use Copilot **Code Review** to verify quality
4. Ask Copilot to **identify edge cases** not yet covered
5. Iterate until all tests pass and **behavior matches semantics and business rules**

## Best Practices Sidebar

The diagram includes a persistent sidebar with cross-cutting best practices:

- Use clear, step-by-step prompts with examples
- Review EVERYTHING Copilot generates before merging
- Start with simple, low-risk modules and scale progressively
- Use slash commands (`/explain`, `/tests`, `/fix`, `/doc`)
- Document decisions and rationale along the way

## Key Concepts

- **Incremental Migration**: Never attempt to convert an entire legacy system at once. The workflow enforces module-by-module conversion.
- **Test-First Modernization**: Phase 3 (testing) must be completed before Phase 4 (conversion). Tests are the safety net that guarantees behavioral equivalence.
- **AI-Assisted Understanding**: Phases 1-2 leverage AI to accelerate comprehension of legacy code that may lack documentation.
- **Behavioral Equivalence**: The final validation (Phase 5) compares legacy output with modernized output to ensure functional parity.

## How It Relates to the Framework

This 5-phase workflow is the operational backbone of the Legacy Modernization Framework. It maps directly to the methodology described in FRAMEWORK.md and provides the practical, step-by-step process that modernization agents follow when executing carving and conversion tasks.

## References

- [FRAMEWORK.md](../../FRAMEWORK.md) -- the 5-phase methodology that this workflow implements
- [Operational Playbook: Carving, Performance, Coexistence](07_Operational_Playbook_Carving_Performance_Coexistence_v1.2.0_2026-03-12.md) -- detailed operational guidance for each phase
- [Modernizing Legacy Code Infographic](modernizing-legacy-code-infographic_v1.0.0_2026-03-18.md) -- companion visual summary of the same workflow
- [AI-Generated Code Review Guide](ai-generated-code-review-guide_v1.0.0_2026-03-18.md) -- expands on the review practices in Phase 5
