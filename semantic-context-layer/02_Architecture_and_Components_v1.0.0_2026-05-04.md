---
title: "02 Architecture and Components"
description: "The four-layer reference architecture of SCL-AD and the responsibilities, interfaces, and contracts of each component."
author: "Paula Silva"
date: "2026-05-04"
version: "1.0.0"
status: "draft"
tags: ["scl-ad", "architecture", "reference-model", "components"]
---

# 02 Architecture and Components

> The four-layer reference architecture of SCL-AD, with explicit component contracts, data flows, and interface definitions.

## Change Log

| Version | Date       | Author      | Changes         |
|---------|------------|-------------|-----------------|
| 1.0.0   | 2026-05-04 | Paula Silva | Initial version |

## Table of Contents

- [1. Architectural Overview](#1-architectural-overview)
- [2. Layer 1: Code Intelligence](#2-layer-1-code-intelligence)
- [3. Layer 2: Context Recipes](#3-layer-2-context-recipes)
- [4. Layer 3: Context Registry](#4-layer-3-context-registry)
- [5. Layer 4: Agent Integration](#5-layer-4-agent-integration)
- [6. Cross-Cutting Concerns](#6-cross-cutting-concerns)
- [7. Reference Topology](#7-reference-topology)
- [8. Interface Contracts](#8-interface-contracts)
- [References](#references)

## 1. Architectural Overview

SCL-AD is structured as four horizontal layers, each with a single responsibility and well-defined interfaces. The layering is intentional. Each layer can evolve independently, be replaced by a different implementation, and be governed by different teams.

```
┌─────────────────────────────────────────────────────────────────┐
│                  Layer 4: Agent Integration                     │
│   GitHub Copilot, Custom Agents, MCP clients, IDE extensions    │
└────────────────────────────────┬────────────────────────────────┘
                                 │ reads
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Layer 3: Context Registry                      │
│      Versioned storage, distribution, discovery, refresh        │
└────────────────────────────────┬────────────────────────────────┘
                                 │ stores artifacts from
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Layer 2: Context Recipes                       │
│    Reusable extractors that produce semantic artifacts          │
└────────────────────────────────┬────────────────────────────────┘
                                 │ runs against
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Layer 1: Code Intelligence                     │
│   Compiler-accurate code models per repository and language     │
└─────────────────────────────────────────────────────────────────┘
```

Information flows upward. The Code Intelligence layer produces a model. Recipes consume that model and produce artifacts. The Registry stores and serves those artifacts. Agents consume them at execution time.

Operational flows are different. Refresh triggers, governance policies, and access controls flow downward and laterally as cross-cutting concerns.

## 2. Layer 1: Code Intelligence

### 2.1 Responsibility

The Code Intelligence layer produces a **compiler-accurate, format-preserving model** of each repository in scope. This model is the substrate on which all higher layers operate.

The layer is responsible for:

- Parsing source code with full type resolution
- Resolving symbol references across files and packages
- Building inheritance and call graphs
- Mapping configuration files to the code that consumes them
- Producing a stable, queryable representation of the above

### 2.2 Required Properties

To qualify as a valid Code Intelligence implementation, the layer must satisfy four properties:

- **Compiler-accuracy.** The model agrees with what the language compiler would produce. Type information is resolved, not inferred.
- **Format preservation.** Whitespace, comments, and trivia are retained so that artifacts can reference original source ranges precisely.
- **Cross-repository linkage.** Dependencies between repositories are resolved, not assumed. A library used by ten services produces ten resolved references, not a name string.
- **Refreshable on commit.** The model can be regenerated for a specific commit deterministically.

### 2.3 Implementation Options

This layer is implementation-defined. Common choices include:

- Per-language language servers (Roslyn for .NET, Eclipse JDT for Java, TypeScript Compiler API)
- Static analysis platforms (CodeQL, Semgrep with semantic mode)
- Commercial code modeling platforms (Moderne LST, Sourcegraph)
- Custom extractors built on tree-sitter combined with type resolvers

The choice is governed by language coverage, refresh latency, and existing organizational investment. Layer 2 contracts only with the model's query interface, not its internals.

## 3. Layer 2: Context Recipes

### 3.1 Responsibility

A **recipe** is a reusable, parameterized extractor that runs against the Code Intelligence model and produces one or more **semantic artifacts**. Recipes are the unit of context engineering.

This layer is responsible for:

- Defining what semantic facts are extracted
- Producing artifacts in standard formats (Markdown, CSV, JSON, CALM)
- Maintaining recipe versioning and reproducibility
- Supporting domain-specific and organization-specific customization

### 3.2 Recipe Categories

SCL-AD recognizes seven recipe categories. Each category targets a specific class of semantic fact and produces a specific artifact type. These are detailed in [04 Context Recipes](./04_Context_Recipes_v1.0.0_2026-05-04.md).

| Category                  | Output Type      | Primary Consumer            |
|---------------------------|------------------|-----------------------------|
| Structural Inventory      | Markdown + CSV   | All agents, planning phase  |
| Dependency Intelligence   | CSV + SBOM       | Upgrade and security agents |
| Service Topology          | CALM (JSON)      | Architecture-aware agents   |
| Convention Extraction     | Markdown         | Code generation agents      |
| Test Intent Mapping       | CSV              | Test authoring agents       |
| Configuration Surface     | Markdown + JSON  | Operational agents          |
| Security Posture Snapshot | Markdown         | Security review agents      |

### 3.3 Recipe Lifecycle

Recipes are first-class engineering artifacts. They are versioned, tested, and released through a pipeline equivalent to source code. A recipe execution is reproducible: given the same recipe version and the same code commit, the output is byte-identical.

## 4. Layer 3: Context Registry

### 4.1 Responsibility

The Context Registry is the durable storage and distribution layer for semantic artifacts. It is the interface between recipe execution (a build-time concern) and agent consumption (a runtime concern).

This layer is responsible for:

- Storing artifacts with versioning, content addressing, and metadata
- Exposing a discovery API so agents can locate artifacts by repository, commit, or capability
- Enforcing access control aligned with source code access
- Maintaining the refresh schedule and invalidation rules
- Serving artifacts at low latency to agent runtimes

### 4.2 Storage Patterns

Three storage patterns are recognized, corresponding to maturity stages:

- **Co-located.** Artifacts are stored in a `.context/` directory of the repository they describe, versioned alongside the code. Suitable for pilot scope.
- **Centralized registry.** A dedicated service stores artifacts from all repositories. Indexed for search, refresh, and access control. Suitable for platform scale.
- **Federated.** Multiple registries (per business unit, per region) are linked through a common discovery layer. Suitable for organizations with sovereignty or regulatory constraints.

The framework does not mandate a specific pattern. It mandates that whichever pattern is chosen exposes the standard discovery interface defined in section 8.

### 4.3 Refresh Model

Context staleness is the failure mode the registry must prevent. Three refresh triggers are required:

- **Commit-driven.** A push to the main branch triggers regeneration of recipes affected by changed files.
- **Scheduled.** A periodic full refresh (typically daily or weekly) catches drift caused by transitive dependency updates and third-party changes.
- **Event-driven.** Specific events (major version upgrades, security advisories, architectural reviews) trigger targeted refreshes.

## 5. Layer 4: Agent Integration

### 5.1 Responsibility

The Agent Integration layer connects the Context Registry to the agents that consume context. It is implementation-specific by nature, since each agent platform has its own integration model.

This layer is responsible for:

- Translating registry queries into agent-native context formats
- Enforcing access control at consumption time
- Logging agent context access for audit
- Providing fallback behavior when the registry is unavailable

### 5.2 Integration Modes

Four integration modes are supported, in order of increasing fidelity:

- **Static file injection.** Artifacts are written to files (such as `copilot-instructions.md`) that agents read on session start. Simple, broadly compatible, low fidelity.
- **MCP server.** A Model Context Protocol server exposes the registry as a tool. Agents query it dynamically and receive resolved context on demand.
- **Native integration.** The agent platform consumes registry artifacts through a first-party connector (vendor-specific).
- **Hybrid.** A combination, where high-volume context is statically injected and detailed queries are served through MCP.

These modes are detailed in [06 Agent Integration Patterns](./06_Agent_Integration_Patterns_v1.0.0_2026-05-04.md).

## 6. Cross-Cutting Concerns

Four concerns apply to all four layers and are addressed in dedicated documents.

### 6.1 Identity and Access Management

Every layer must respect the access model of the underlying source code. An agent that cannot read repository X must not receive context derived from repository X. Identity propagation is mandatory.

### 6.2 Observability

Every artifact must be traceable to its source: which recipe produced it, against which commit, with which inputs. Every agent context access must be logged with timestamp, identity, and artifact version.

### 6.3 Security

Recipes that extract sensitive information (secrets, credentials, customer data identifiers) must be subject to additional review. The registry must support classification labels and access rules per artifact.

### 6.4 Lifecycle

Repositories are added, archived, deprecated, and deleted. The registry must reflect these state changes. Stale artifacts for archived repositories must be archived in parallel, not silently retained.

## 7. Reference Topology

A reference topology for an enterprise deployment is illustrated below. It shows how the four layers map to typical infrastructure components.

```
┌───────────────────────────────────────────────────────────────┐
│  Source Repositories (GitHub Enterprise / Azure DevOps)       │
└──────────────────────────┬────────────────────────────────────┘
                           │ webhook + scheduled
                           ▼
┌───────────────────────────────────────────────────────────────┐
│  Build Pipeline (GitHub Actions / Azure Pipelines)            │
│  Layer 1: Code Intelligence runs here                         │
│  Layer 2: Recipes execute here                                │
└──────────────────────────┬────────────────────────────────────┘
                           │ publishes artifacts
                           ▼
┌───────────────────────────────────────────────────────────────┐
│  Layer 3: Context Registry                                    │
│  (Object storage + metadata DB + API gateway)                 │
└──────────────────────────┬────────────────────────────────────┘
                           │ MCP server / static files / API
                           ▼
┌───────────────────────────────────────────────────────────────┐
│  Layer 4: Agent Runtimes                                      │
│  (Copilot, custom agents, IDE extensions)                     │
└───────────────────────────────────────────────────────────────┘
```

Each box is a deployment boundary. Each arrow is a contract that must be stable across implementation changes.

## 8. Interface Contracts

Two interface contracts are normative. Implementations of SCL-AD must satisfy both.

### 8.1 Artifact Manifest Contract

Every artifact in the registry must carry a manifest with the following fields:

```yaml
artifact:
  id: "string (content-addressed hash)"
  type: "string (recipe category)"
  format: "markdown | csv | json | calm"
  repository:
    url: "string"
    commit: "string (git SHA)"
  recipe:
    name: "string"
    version: "string (semver)"
  generated_at: "ISO 8601 timestamp"
  classification: "public | internal | restricted"
  signatures:
    - algorithm: "string"
      value: "string"
```

This manifest is the basis for traceability, access control, and integrity verification.

### 8.2 Discovery API Contract

The registry must expose a discovery API supporting at minimum the following operations:

- `GET /repositories` returns the list of repositories with available context
- `GET /repositories/{repo}/artifacts` returns artifacts for a repository
- `GET /repositories/{repo}/artifacts/{type}` returns artifacts of a specific type
- `GET /artifacts/{id}` returns the artifact content by content hash
- `POST /search` accepts queries to find artifacts by attribute

The transport (REST, GraphQL, MCP tools) is implementation-defined. The semantics are normative.

## References

1. [Moderne Technology: Lossless Semantic Tree](https://www.moderne.ai/technology/lossless-semantic-tree). Reference example of a Code Intelligence layer.
2. [Model Context Protocol Specification](https://modelcontextprotocol.io/). Standard for the agent integration layer.
3. [FINOS Common Architecture Language Model (CALM)](https://github.com/finos/architecture-as-code). Standard format for Service Topology artifacts.
4. [SLSA Build Provenance](https://slsa.dev/). Reference for artifact integrity and signing patterns.
