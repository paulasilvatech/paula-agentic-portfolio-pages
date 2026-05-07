---
title: "01 Concept and Problem Statement"
description: "Defines the problem space SCL-AD addresses and explains why existing context approaches fall short for enterprise codebases."
author: "Paula Silva"
date: "2026-05-04"
version: "1.0.0"
status: "draft"
tags: ["scl-ad", "context-engineering", "agentic-devops", "concept"]
---

# 01 Concept and Problem Statement

> The economic and quality cost of letting AI coding agents reconstruct context on every interaction, and why deterministic semantic context is the structural fix.

## Change Log

| Version | Date       | Author      | Changes         |
|---------|------------|-------------|-----------------|
| 1.0.0   | 2026-05-04 | Paula Silva | Initial version |

## Table of Contents

- [1. The Context Problem in Enterprise Agentic Coding](#1-the-context-problem-in-enterprise-agentic-coding)
- [2. Why Existing Approaches Are Insufficient](#2-why-existing-approaches-are-insufficient)
- [3. What Semantic Context Actually Means](#3-what-semantic-context-actually-means)
- [4. The SCL-AD Definition](#4-the-scl-ad-definition)
- [5. Scope and Non-Scope](#5-scope-and-non-scope)
- [6. Expected Outcomes](#6-expected-outcomes)
- [References](#references)

## 1. The Context Problem in Enterprise Agentic Coding

AI coding agents do not fail because the underlying language model is weak. They fail because they operate on incomplete, reconstructed, or fabricated context. In a small repository this failure mode is invisible. In a multi-thousand-repository enterprise estate it is the dominant cost driver.

Three failure patterns recur across deployments:

The **token reconstruction tax** is paid every time an agent opens a session. Without persistent semantic context, the agent re-reads files, re-parses imports, and re-infers architectural boundaries on each task. This is wasted compute, billed per token.

The **inference gap** appears when the agent guesses at facts the codebase already encodes. Symbol resolution, transitive dependency versions, and service boundaries are not opinions, they are deterministic properties of the code. When an agent infers them from raw text, it introduces hallucinations into otherwise sound reasoning.

The **convention drift** problem manifests in code quality. Each repository has implicit rules: how exceptions are handled, how logging is structured, how tests are organized. Agents that cannot see these rules produce code that compiles but does not belong, generating review friction and rework.

These patterns compound. As enterprise adoption of agentic coding scales from pilot teams to platform-wide deployment, token costs grow superlinearly with repository count, hallucination rates erode trust, and convention drift creates a maintenance burden that offsets the productivity gains.

## 2. Why Existing Approaches Are Insufficient

Four common approaches address parts of the context problem, but none solve it structurally.

**Retrieval-Augmented Generation (RAG)** retrieves snippets of source code based on similarity to the prompt. The result is partial and token-heavy. Agents still infer relationships between snippets, and the retrieval itself is probabilistic. RAG is well-suited for documentation and Q&A, not for grounding code modifications.

**Embeddings-based search** maps code to vector space and retrieves by proximity. This produces approximate matches without semantic guarantees. Two functions with similar embeddings may have entirely different runtime behavior. Embeddings cannot distinguish a deprecated method from its replacement.

**Prompt engineering** encodes context manually in system prompts, instruction files, or chat templates. This works at small scale but breaks at enterprise scale. Manual curation is brittle, inconsistent across teams, and fails to capture the structural facts that change as the code evolves.

**Custom integrations and tools** (calling language servers, dependency graphs, or static analyzers from within an agent loop) give the agent live access to facts. This improves correctness but at the cost of latency and tokens. Each call is a round-trip, and the agent still has to assemble the picture from many small queries.

The common limitation is that all four approaches produce context **on demand, per session, per task**. They treat context as ephemeral. The structural fix is to treat context as a **durable, versioned, deterministic artifact** that exists independently of any agent session.

## 3. What Semantic Context Actually Means

The term "context" is overloaded. SCL-AD uses a precise definition.

**Semantic context** is a machine-readable representation of properties that can be derived deterministically from source code, including but not limited to:

- Resolved type information, including generics and inheritance chains
- Symbol references with their definition sites and usage sites
- Direct and transitive dependency graphs with version constraints
- Call graphs across functions, methods, and services
- Service interfaces, endpoint definitions, and integration points
- Configuration values that affect runtime behavior
- Test coverage and test intent mapped to production code
- Architectural boundaries and inter-module relationships
- Conventions encoded in the codebase (naming, error handling, logging)

This is distinct from **syntactic context** (the raw text of files), **conversational context** (what has been said in the current chat), and **probabilistic context** (similarity-based retrieval). Semantic context is what a competent senior engineer would tell a new hire if asked "how does this codebase actually work."

The defining property is **determinism**. Given the same source code at the same commit, the semantic context is identical every time it is computed. This is what makes it reusable, auditable, and reliable as input to agents.

## 4. The SCL-AD Definition

The Semantic Context Layer for Agentic DevOps is defined as follows:

> A platform capability that derives, stores, distributes, and refreshes deterministic semantic context for AI coding agents, treating context as a versioned build artifact rather than an ephemeral session input.

The framework prescribes:

- **What to derive** from code (the semantic properties enumerated above)
- **How to derive it** (through compiler-accurate analysis, not inference)
- **Where to store it** (in a registry that agents can reference by repository and version)
- **How to expose it** (through standard interfaces compatible with major agent platforms)
- **How to govern it** (through policies for refresh, audit, access control, and lifecycle)

The framework does not prescribe a specific vendor, language, or toolchain. It is implementation-agnostic by design. An organization can implement SCL-AD using GitHub-native tooling, open-source analyzers, commercial platforms like Moderne, or any combination thereof.

## 5. Scope and Non-Scope

To prevent confusion with adjacent concerns, SCL-AD's scope is explicit.

**In scope:**

- Deriving semantic context from source code repositories
- Distributing that context to AI coding agents
- Versioning and refreshing context as code evolves
- Governance of context as a regulated artifact in enterprise environments

**Out of scope:**

- Training or fine-tuning language models
- Agent orchestration frameworks themselves (LangGraph, AutoGen, etc.)
- General-purpose knowledge management beyond code
- Runtime observability or production monitoring
- IDE-level features such as autocompletion or inline suggestions, except where they consume SCL-AD output

The framework intentionally stays at the context layer. It is composable with any agent runtime, any IDE integration, and any observability stack.

## 6. Expected Outcomes

Organizations that adopt SCL-AD with reasonable implementation quality should observe outcomes in four dimensions. The specific magnitudes depend on baseline maturity, codebase complexity, and the agents in use.

**Token economics improve** because agents no longer reconstruct repository-level context on each interaction. The savings compound across sessions, agents, and developers.

**Hallucination rates decline** because agents reason from resolved facts rather than inferred ones. Type errors, deprecated API usage, and convention violations decrease.

**Output consistency improves** because every agent working on the same repository sees the same authoritative context. Variance between developers, between agents, and between sessions is reduced.

**Governance posture strengthens** because the context layer becomes an inspectable, auditable artifact. Security teams can review what agents see, compliance teams can verify what is exposed, and incident response can trace agent decisions back to specific context inputs.

These outcomes are conditional on implementation quality. The remainder of this framework specifies what good implementation looks like across architecture, components, integration, and governance.

## References

1. [Moderne Prethink: Semantic Code Context for Coding Agents](https://www.moderne.ai/product/moderne-prethink). Reference articulation of the determinism-versus-inference distinction.
2. [Anthropic: Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents). Industry guidance on context as a first-class concern.
3. [GitHub: The architect's guide to the AI-native developer platform](https://github.blog/enterprise-software/architecture-and-engineering/architects-guide-to-ai-native-platform/). Enterprise-platform perspective on agentic coding.
4. [Lossless Semantic Tree (Moderne)](https://www.moderne.ai/technology/lossless-semantic-tree). Concrete example of compiler-accurate code modeling.
