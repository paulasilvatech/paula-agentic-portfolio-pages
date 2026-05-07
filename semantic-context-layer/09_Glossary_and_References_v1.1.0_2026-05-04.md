---
title: "09 Glossary and References"
description: "Consolidated terminology, acronyms, and bibliography for the SCL-AD framework."
author: "Paula Silva"
date: "2026-05-04"
version: "1.1.0"
status: "draft"
tags: ["scl-ad", "glossary", "references", "terminology"]
---

# 09 Glossary and References

> Terminology used consistently across the SCL-AD framework, plus a consolidated bibliography of foundational sources.

## Change Log

| Version | Date       | Author      | Changes                                                                                                              |
|---------|------------|-------------|----------------------------------------------------------------------------------------------------------------------|
| 1.1.0   | 2026-05-04 | Paula Silva | Added BYOM, Moddy, Capability Pillars, Auto-Wiring, Deployment Context, METR study; expanded references and tooling. |
| 1.0.0   | 2026-05-04 | Paula Silva | Initial version with core terminology and references.                                                                |

## Table of Contents

- [1. Glossary](#1-glossary)
- [2. Acronyms](#2-acronyms)
- [3. Foundational References](#3-foundational-references)
- [4. Standards and Specifications](#4-standards-and-specifications)
- [5. Tooling References](#5-tooling-references)
- [6. Industry Reading](#6-industry-reading)

## 1. Glossary

The framework uses precise definitions for terms that are commonly overloaded in industry discourse. Every term defined here has the meaning given here throughout SCL-AD documentation.

**Agent.** A software component that uses a language model to perform tasks autonomously or semi-autonomously, typically by orchestrating tool calls and reasoning over context.

**Agent Integration Pattern.** A defined approach for connecting an agent to the SCL-AD Context Registry, such as static file injection, MCP server integration, or custom configuration.

**Artifact.** A unit of semantic context produced by a recipe and stored in the Context Registry. Artifacts have defined schemas, content hashes, and manifests.

**Auto-Wiring.** The practice of automatically updating agent configuration files (`copilot-instructions.md`, `CLAUDE.md`, `.cursorrules`, `AGENTS.md`) with pointers to the generated SCL-AD artifacts as part of the recipe pipeline. Prevents drift between context and agent configuration.

**BYOM (Bring Your Own Model).** A pattern in which the SCL-AD pipeline calls an organization's approved language model to enrich deterministic artifacts with summaries, knowledge graphs, or natural-language descriptions. Optional and isolated from the deterministic core.

**CALM.** Common Architecture Language Model. A FINOS specification for machine-readable architecture descriptions, used in SCL-AD Service Topology artifacts.

**Capability Pillars.** The four operational verbs that frame SCL-AD's agent-facing behavior: Precompute, Target, Execute, Coordinate. Orthogonal to the four-layer architecture, which describes structure rather than behavior.

**Code Intelligence Model.** A compiler-accurate, queryable representation of a source code repository. The substrate that recipes consume.

**Compiler-Accurate.** A property of a code intelligence model: the model agrees with what the language compiler would produce, including resolved types, symbols, and references.

**Content Addressing.** Identifying an artifact by the hash of its content rather than by a name. Two artifacts with identical content share the same identifier.

**Context Registry.** The storage and distribution layer of SCL-AD. Holds versioned artifacts and exposes them through a defined discovery API.

**Convention Extraction.** A recipe category that captures the implicit rules a codebase follows (logging patterns, error handling patterns, naming patterns).

**Coordinate.** Capability pillar: sharing change context across agents and across the organization so that duplication, conflict, and wasted token spend drop.

**Dependency Intelligence.** A recipe category that produces structured information about direct and transitive dependencies, including version, license, and known advisory data.

**Deployment Context.** A recipe category that produces structured descriptions of how the code is deployed (containers, Kubernetes manifests, infrastructure-as-code) and connects deployment artifacts back to the application code they affect.

**Determinism.** The property that the same input always produces the same output. SCL-AD requires determinism in every code intelligence model and every recipe.

**Execute.** Capability pillar: applying changes deterministically across many repositories at once with coordinated changesets, validation gates, and parallel rollout.

**Federated Storage.** A registry deployment pattern where multiple registries serve different scopes (regions, business units) and are linked through a common discovery layer.

**Format Preservation.** A property of a code intelligence model: the model retains whitespace, comments, and trivia from the source, enabling precise references back to original code.

**Hallucination.** An agent output that asserts a fact not present in the model's actual reasoning chain or context. Often manifests as references to non-existent functions, deprecated APIs, or fabricated patterns.

**Identity Propagation.** A governance principle: every registry operation carries the authenticated identity of the requester, and authorization decisions mirror those of the underlying source code.

**Lossless Semantic Tree (LST).** A specific implementation of a compiler-accurate code intelligence model, originated by Moderne. SCL-AD uses LST as one possible Code Intelligence layer implementation, not as a requirement.

**MCP.** Model Context Protocol. An open specification for how AI applications expose context and tools to language models.

**Moddy.** Moderne's multi-repo AI agent that uses the LST and the OpenRewrite recipe catalog as its tool surface, exposed through MCP. Referenced in the framework as a design example of an MCP-exposed code intelligence platform.

**Precompute.** Capability pillar: deriving structured system knowledge ahead of time so agents do not reconstruct context on every interaction.

**Recipe.** A reusable, parameterized extractor that runs against a Code Intelligence model and produces semantic artifacts. The unit of context engineering in SCL-AD.

**Recipe Category.** A class of recipes producing the same kind of artifact, such as Structural Inventory or Service Topology. SCL-AD recognizes eight canonical categories.

**Refresh.** The operation of regenerating an artifact to reflect changes in the underlying code or its environment. Refresh is triggered by commits, schedules, or events.

**Registry.** Short for Context Registry. Used interchangeably.

**SCL-AD.** Semantic Context Layer for Agentic DevOps. The framework defined in this document set.

**Semantic Context.** A machine-readable representation of properties that can be derived deterministically from source code. Distinct from syntactic, conversational, or probabilistic context.

**Service Topology.** A recipe category that produces a structured description of services and their relationships, typically formatted as CALM JSON.

**Staleness.** The condition of an artifact whose underlying source has changed materially since the artifact was generated. SCL-AD requires explicit staleness windows per artifact type.

**Static File Injection.** An agent integration pattern where artifacts are written to known file paths the agent reads on session start (such as `copilot-instructions.md` or `AGENTS.md`).

**Structural Inventory.** A recipe category that produces an inventory of modules, packages, and top-level types in a repository.

**Target.** Capability pillar: enabling agents to find the right code fast through pre-computed indexes and structured queries, eliminating unnecessary scanning.

## 2. Acronyms

| Acronym  | Expansion                                          |
|----------|----------------------------------------------------|
| API      | Application Programming Interface                  |
| AST      | Abstract Syntax Tree                               |
| BYOM     | Bring Your Own Model                               |
| CALM     | Common Architecture Language Model                 |
| CI       | Continuous Integration                             |
| CSV      | Comma-Separated Values                             |
| DORA     | DevOps Research and Assessment                     |
| FINOS    | Fintech Open Source Foundation                     |
| GHEC     | GitHub Enterprise Cloud                            |
| IAM      | Identity and Access Management                     |
| IDE      | Integrated Development Environment                 |
| JDT      | Eclipse Java Development Tools                     |
| JSON     | JavaScript Object Notation                         |
| LGPD     | Lei Geral de Proteção de Dados                     |
| LST      | Lossless Semantic Tree                             |
| MCP      | Model Context Protocol                             |
| METR     | Model Evaluation and Threat Research               |
| OCI      | Open Container Initiative                          |
| OT       | Operational Technology                             |
| PCI-DSS  | Payment Card Industry Data Security Standard       |
| PHI      | Protected Health Information                       |
| PR       | Pull Request                                       |
| RAG      | Retrieval-Augmented Generation                     |
| REST     | Representational State Transfer                    |
| RFC      | Request for Comments                               |
| ROI      | Return on Investment                               |
| RPC      | Remote Procedure Call                              |
| SBOM     | Software Bill of Materials                         |
| SCL-AD   | Semantic Context Layer for Agentic DevOps          |
| SDK      | Software Development Kit                           |
| SDLC     | Software Development Life Cycle                    |
| SLSA     | Supply-chain Levels for Software Artifacts         |
| SOC 2    | System and Organization Controls 2                 |
| SOX      | Sarbanes-Oxley Act                                 |
| SPDX     | Software Package Data Exchange                     |
| SRE      | Site Reliability Engineering                       |
| URI      | Uniform Resource Identifier                        |
| YAML     | YAML Ain't Markup Language                         |

## 3. Foundational References

The intellectual basis of SCL-AD draws on several foundational sources. These should be considered required background reading for anyone implementing the framework.

1. [Moderne Prethink: Semantic Code Context for Coding Agents](https://www.moderne.ai/product/moderne-prethink). Original articulation of deterministic semantic context as an alternative to RAG and prompt engineering.

2. [Moderne Agent Capabilities: Precompute, Target, Execute, Coordinate](https://www.moderne.ai/product/agent-capabilities). Source of the four-pillar framing adopted by SCL-AD.

3. [Moderne: Lossless Semantic Tree](https://www.moderne.ai/technology/lossless-semantic-tree). Reference description of compiler-accurate code modeling as foundation for context engineering.

4. [Moderne Blog: How Moderne Prethink accelerates coding agents and reduces token use](https://www.moderne.ai/blog/changing-ai-code-context-moderne-prethink). Practical perspective and the catalog of eight semantic categories that informed the recipe taxonomy.

5. [METR: Measuring AI Effects on Experienced Developer Productivity](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/). Empirical evidence that the context problem is real and measurable.

6. [Anthropic Engineering: Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents). Industry guidance on treating context as a first-class concern in agent design.

7. [GitHub: The architect's guide to the AI-native developer platform](https://github.blog/enterprise-software/architecture-and-engineering/architects-guide-to-ai-native-platform/). Enterprise platform perspective on agentic coding.

8. [O'Reilly: Automated Code Remediation at Scale](https://www.moderne.ai/content-library/automated-code-remediation-at-scale-the-role-of-ai-oreilly). Industry-published reference on the role of structured code data in AI-driven modernization.

## 4. Standards and Specifications

SCL-AD relies on or is compatible with the following standards. Where possible, implementations should adopt these standards rather than inventing equivalents.

1. [Model Context Protocol Specification](https://modelcontextprotocol.io/). Open standard for agent-context interaction.

2. [FINOS Common Architecture Language Model](https://github.com/finos/architecture-as-code). Open standard for machine-readable architecture, used for Service Topology artifacts.

3. [SLSA: Supply-chain Levels for Software Artifacts](https://slsa.dev/). Reference for artifact provenance, signing, and integrity.

4. [SPDX Specification](https://spdx.dev/). Reference SBOM format, applicable to Dependency Intelligence outputs.

5. [Sigstore](https://www.sigstore.dev/). Reference for keyless artifact signing.

6. [OCI Distribution Specification](https://github.com/opencontainers/distribution-spec). Foundation for OCI-based artifact registries.

7. [ISO/IEC 27001](https://www.iso.org/standard/27001). Information security management standard, applicable to registry governance.

8. [ISO/IEC 42001](https://www.iso.org/standard/81230.html). AI management system standard, applicable to agentic deployments at scale.

9. [AGENTS.md Convention](https://agents.md/). Emerging vendor-neutral convention for agent instruction files.

## 5. Tooling References

The following tools are referenced as illustrative implementation options. The framework does not endorse specific vendors; these are examples of tools that satisfy the framework's interface requirements.

### 5.1 Code Intelligence Layer

1. [OpenRewrite](https://docs.openrewrite.org/). Open-source LST implementation for JVM languages.
2. [Roslyn Compiler Platform](https://learn.microsoft.com/dotnet/csharp/roslyn-sdk/). Microsoft's compiler-as-a-service for .NET.
3. [TypeScript Compiler API](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API). Reference for TypeScript and JavaScript analysis.
4. [Pyright](https://microsoft.github.io/pyright/). Python type resolver.
5. [rust-analyzer](https://rust-analyzer.github.io/). Rust IDE-grade semantic analysis.
6. [CodeQL](https://codeql.github.com/). Semantic analysis platform with multi-language support.
7. [tree-sitter](https://tree-sitter.github.io/tree-sitter/). General-purpose parser generator.
8. [Moderne](https://www.moderne.ai/). Commercial platform implementing LST and Prethink at scale.

### 5.2 Agent Platforms

1. [GitHub Copilot](https://docs.github.com/en/copilot). Reference platform for static file injection and MCP integration.
2. [Cursor](https://docs.cursor.com/). IDE-first agent with rules and MCP support.
3. [Claude Code](https://docs.claude.com/en/docs/claude-code/overview). Terminal agent with `CLAUDE.md` and MCP support.
4. [Moderne Moddy](https://www.moderne.ai/product/moddy). Multi-repo AI agent built on LST plus OpenRewrite recipes, exposed as MCP server.
5. [AGENTS.md Convention](https://agents.md/). Vendor-neutral instruction file convention.

### 5.3 Recipe and Pipeline References

1. [Moderne Prethink Starter Recipes](https://docs.moderne.io/user-documentation/recipes/prethink). Reference implementations of recipes covering Structural Inventory, Dependency Intelligence, Service Topology, Test Intent, Deployment Context, and Configuration Surface.
2. [OpenRewrite Recipe Marketplace](https://docs.openrewrite.org/recipes). Reference for the broader catalog of deterministic transformation recipes.

### 5.4 Registry and Distribution

1. [Harbor](https://goharbor.io/). Open-source OCI registry.
2. [Azure API Center](https://learn.microsoft.com/azure/api-center/). API discovery and governance hub.
3. [Sigstore](https://www.sigstore.dev/). Keyless signing infrastructure.

## 6. Industry Reading

Beyond the foundational references, the following sources provide useful broader context for organizations adopting agentic developer platforms.

1. [DORA State of DevOps Reports](https://dora.dev/research/). Annual research on developer platform performance.
2. [GitHub Octoverse Reports](https://octoverse.github.com/). Annual industry data on developer behavior and AI adoption.
3. [Microsoft Build sessions on AI-native developer platforms](https://build.microsoft.com/). Reference architectures and patterns from Microsoft's annual conference.
4. [GitHub Universe sessions on GitHub Copilot Enterprise](https://githubuniverse.com/). Reference patterns from GitHub's annual conference.
5. [LeanIX Architecture as Code](https://www.leanix.net/en/wiki/ea/architecture-as-code). Industry perspective on machine-readable architecture.
6. [Moderne Case Studies](https://www.moderne.ai/case-study). Real-world enterprise deployments illustrating large-scale code transformation outcomes.
