---
title: "04 Context Recipes"
description: "The eight recipe categories of SCL-AD, their inputs, outputs, and authoring guidance for organization-specific extensions."
author: "Paula Silva"
date: "2026-05-04"
version: "1.1.0"
status: "draft"
tags: ["scl-ad", "recipes", "context-extraction", "implementation"]
---

# 04 Context Recipes

> The unit of context engineering in SCL-AD. Reusable, parameterized extractors that turn the code intelligence model into the specific semantic facts agents need.

## Change Log

| Version | Date       | Author      | Changes                                                                                                              |
|---------|------------|-------------|----------------------------------------------------------------------------------------------------------------------|
| 1.1.0   | 2026-05-04 | Paula Silva | Added Deployment Context as eighth canonical recipe category; added reference implementation note for Moderne starter recipes. |
| 1.0.0   | 2026-05-04 | Paula Silva | Initial version with seven canonical recipe categories.                                                              |

## Table of Contents

- [1. What a Recipe Is](#1-what-a-recipe-is)
- [2. Recipe Categories](#2-recipe-categories)
- [3. Recipe Anatomy](#3-recipe-anatomy)
- [4. Authoring Guidelines](#4-authoring-guidelines)
- [5. Recipe Examples by Category](#5-recipe-examples-by-category)
- [6. Recipe Lifecycle](#6-recipe-lifecycle)
- [7. Custom and Domain Recipes](#7-custom-and-domain-recipes)
- [8. Reference Implementations](#8-reference-implementations)
- [References](#references)

## 1. What a Recipe Is

A recipe is a deterministic function from a code intelligence model to one or more semantic artifacts. It is parameterized, versioned, tested, and reusable across repositories.

Three properties define a valid recipe:

A recipe is **deterministic**. Given the same model version and the same parameters, it produces byte-identical output. This is what makes the registry trustworthy.

A recipe is **scoped**. It extracts one specific class of semantic fact, not a broad sweep. Narrow scope is what makes recipes composable.

A recipe is **declarative about its outputs**. It declares the artifact types it produces, the format of each, and the schema. Consumers (the registry, agents) can validate output against the declaration.

In practice, a recipe is a piece of code (typically in the same language as the code intelligence layer it consumes) that traverses the model and emits artifacts.

## 2. Recipe Categories

SCL-AD recognizes eight canonical recipe categories. Each addresses a distinct dimension of agent grounding. An organization should implement all eight for repositories where comprehensive grounding is needed, and a subset for narrower use cases.

| Category                  | Question Answered                                              | Output Format    |
|---------------------------|----------------------------------------------------------------|------------------|
| Structural Inventory      | What is in this repository?                                    | Markdown + CSV   |
| Dependency Intelligence   | What does it depend on, and what depends on it?                | CSV + SBOM       |
| Service Topology          | What services exist and how do they relate?                    | CALM (JSON)      |
| Convention Extraction     | How is code written in this codebase?                          | Markdown         |
| Test Intent Mapping       | What is tested, how, and what is the test telling us?          | CSV              |
| Configuration Surface     | What configuration affects runtime behavior?                   | Markdown + JSON  |
| Security Posture Snapshot | What security-relevant facts are encoded in the code?          | Markdown         |
| Deployment Context        | What runs where and under which constraints?                   | Markdown + JSON  |

The categories are necessary but not sufficient. Domain-specific recipes (compliance mappings, regulatory artifact extraction, framework-specific patterns) extend the canonical set.

## 3. Recipe Anatomy

Every recipe has the same structural elements, regardless of implementation language.

### 3.1 Manifest

A YAML or JSON manifest declares the recipe's identity and contract:

```yaml
recipe:
  name: "structural-inventory"
  version: "1.2.0"
  category: "structural-inventory"
  description: "Produces an inventory of modules, classes, and entry points."
  inputs:
    - name: "model"
      type: "code-intelligence-model"
      version: ">=2.0.0"
    - name: "include_patterns"
      type: "list<string>"
      default: ["**/*"]
    - name: "exclude_patterns"
      type: "list<string>"
      default: ["**/test/**", "**/generated/**"]
  outputs:
    - artifact: "inventory.md"
      format: "markdown"
      schema: "inventory-md-v1"
    - artifact: "inventory.csv"
      format: "csv"
      schema: "inventory-csv-v1"
```

### 3.2 Implementation

The implementation is the code that performs the extraction. The framework does not mandate a language. Common choices are:

- For OpenRewrite-based pipelines: a Java or Kotlin Recipe class
- For Roslyn-based pipelines: a C# analyzer or generator
- For language-agnostic pipelines: Python or TypeScript scripts that call the model's query API

### 3.3 Tests

Every recipe has a fixture-based test suite. Each test pairs an input (a small code repository or fragment) with an expected output. Recipe correctness is verified by running the recipe against fixtures and diffing output against expected.

Test fixtures should cover:

- The happy path
- Empty inputs
- Edge cases (circular dependencies, generated code, mixed languages)
- Error cases (malformed input, missing dependencies)

### 3.4 Documentation

Every recipe ships with documentation that includes:

- The semantic question the recipe answers
- The artifacts it produces, with examples
- The parameters it accepts
- Known limitations and edge cases
- The schema of each output artifact

Without documentation, recipes are not safe to depend on.

## 4. Authoring Guidelines

Eight guidelines govern recipe authoring. They emerge from production experience with similar systems.

**Prefer narrow scope over breadth.** A recipe that does one thing well is easier to test, maintain, and compose than a recipe that produces many outputs.

**Output for both humans and machines.** Every recipe produces at least one human-readable artifact (Markdown) and where applicable a machine-readable one (CSV, JSON). The Markdown is for review, the structured format is for programmatic consumption.

**Respect determinism.** Sort outputs in a stable order. Avoid embedding timestamps in artifact bodies. Use the manifest's `generated_at` field for timing metadata, not the artifact itself.

**Embed traceability.** Every fact in an artifact references its source range in the original code. This is what makes artifacts auditable.

**Fail loudly on ambiguity.** When the model contains ambiguous information (such as unresolved symbols), the recipe should emit an explicit "unresolved" entry rather than guessing.

**Version inputs and outputs separately.** The recipe version, the model version, and the artifact schema version are independent. A recipe upgrade should not silently change the artifact schema.

**Test with real fixtures.** Synthetic test fixtures miss edge cases. Maintain a test corpus drawn from real (sanitized) repositories.

**Keep artifacts compact.** Token economy is one of the framework's outcomes. A 100,000-line repository should not produce a 100,000-line inventory artifact. Summarize, structure, and link.

## 5. Recipe Examples by Category

The following examples illustrate concrete artifact shapes for each category. They are sketches, not specifications. Real implementations will adapt schemas to the organization's needs.

### 5.1 Structural Inventory

Produces a tree of modules, packages, and top-level types with brief descriptions.

```markdown
# Repository Inventory

## Module: payments-api
Purpose: REST API for payment processing.
Entry point: `com.example.payments.PaymentsApplication`
Public types: 42
Public endpoints: 8

### Package: com.example.payments.controllers
- PaymentController (REST endpoints, lines 12-180)
- RefundController (REST endpoints, lines 12-95)
```

### 5.2 Dependency Intelligence

Produces a CSV of direct and transitive dependencies with version, license, and impact metadata.

```csv
group,artifact,version,scope,direct,license,known_advisories
org.springframework,spring-core,6.1.4,compile,true,Apache-2.0,0
com.fasterxml.jackson.core,jackson-databind,2.16.1,compile,false,Apache-2.0,1
```

### 5.3 Service Topology

Produces a CALM-formatted JSON describing services, their interfaces, and their dependencies.

```json
{
  "$schema": "https://calm.finos.org/draft/2024-10/meta/calm.json",
  "nodes": [
    {
      "unique-id": "payments-api",
      "node-type": "service",
      "name": "Payments API",
      "interfaces": [
        {"unique-id": "rest-public", "definition-url": "..."}
      ]
    }
  ],
  "relationships": [
    {
      "unique-id": "payments-to-database",
      "relationship-type": {"connects": {"source": "payments-api", "destination": "payments-db"}}
    }
  ]
}
```

### 5.4 Convention Extraction

Produces Markdown describing observed conventions in the codebase.

```markdown
# Repository Conventions

## Logging
- Logger field: `private static final Logger log = LoggerFactory.getLogger(<ClassName>.class);`
- Log levels used: DEBUG (12%), INFO (45%), WARN (28%), ERROR (15%)
- Structured logging: 78% of log calls use parameterized messages

## Exception Handling
- Custom exception base class: `com.example.payments.PaymentException`
- Public methods declare checked exceptions in 23% of cases
- Catch-rethrow with logging: 89% of catch blocks
```

### 5.5 Test Intent Mapping

Produces a CSV linking production code to test code with intent labels.

```csv
production_file,production_symbol,test_file,test_symbol,intent
PaymentService.java,processPayment,PaymentServiceTest.java,shouldProcessValidPayment,happy_path
PaymentService.java,processPayment,PaymentServiceTest.java,shouldRejectInvalidAmount,validation
```

### 5.6 Configuration Surface

Produces Markdown describing all configuration keys, their consumers, and defaults.

```markdown
# Configuration Surface

## payments.processor.timeout-ms
- Type: integer
- Default: 5000
- Consumed by: `PaymentProcessor.executeCharge` (line 87)
- Environment override: `PAYMENTS_PROCESSOR_TIMEOUT_MS`

## payments.feature-flags.refund-v2
- Type: boolean
- Default: false
- Consumed by: `RefundController.processRefund` (line 42)
```

### 5.7 Security Posture Snapshot

Produces Markdown highlighting security-relevant facts: cryptographic primitives in use, authentication mechanisms, secret references, exposed surfaces.

```markdown
# Security Posture

## Authentication
- Mechanism: OAuth 2.0 with JWT bearer tokens
- Token validation: `JwtAuthenticationFilter` (line 34)
- Token issuer: configured via `auth.issuer-uri`

## Cryptographic Primitives
- AES-256-GCM for at-rest encryption (3 call sites)
- BCrypt with cost 12 for password hashing (1 call site)
- No usage of MD5, SHA-1, or DES detected
```

### 5.8 Deployment Context

Produces Markdown plus structured JSON describing how the code is deployed and what operational constraints apply at runtime. Connects deployment artifacts (Docker, Kubernetes manifests, infrastructure-as-code) back to the application code they affect.

```markdown
# Deployment Context

## Container Image
- Base image: `eclipse-temurin:21-jre`
- Memory request: 512Mi, limit: 1Gi
- CPU request: 250m, limit: 1000m
- Ports exposed: 8080 (HTTP), 9090 (metrics)

## Kubernetes Resources
- Deployment: `payments-api` (3 replicas, RollingUpdate)
- Service: `payments-api-svc` (ClusterIP)
- HorizontalPodAutoscaler: target CPU 70%, min 3, max 10

## Affecting Code
- Health endpoints: `HealthController.live` (line 22), `HealthController.ready` (line 37)
- Graceful shutdown: `GracefulShutdownConfig` (line 18)
- Configuration source: ConfigMap `payments-api-config`, Secret `payments-api-secrets`
```

This category is critical for agents that propose changes with operational impact. An agent that does not see deployment context can propose a configuration change that compiles cleanly but fails at runtime because of a missing ConfigMap entry.

## 6. Recipe Lifecycle

Recipes are software artifacts and follow a software lifecycle.

**Authoring** happens in a recipe repository. Recipes are typically grouped by category or by team ownership.

**Testing** is mandatory before release. A recipe without passing tests does not enter the registry.

**Release** publishes a versioned recipe to a recipe registry that the orchestration layer consumes. Semantic versioning applies: breaking schema changes require a major version bump.

**Deployment** happens through configuration, not code change. The orchestration layer's manifest declares which recipe versions to run against which repositories.

**Deprecation** of a recipe is managed in the same way as a library deprecation. Consumers are notified, a sunset date is announced, and the recipe is removed only after dependents have migrated.

## 7. Custom and Domain Recipes

The eight canonical categories cover most agent grounding needs. Organizations will inevitably need custom recipes for domain-specific concerns.

Common categories of custom recipes include:

- **Regulatory mapping recipes** that link code to specific compliance controls (PCI-DSS, HIPAA, LGPD, SOX)
- **Framework-specific recipes** that extract information from organizational frameworks not covered by general-purpose recipes
- **Internal API extraction** for organizations with bespoke RPC or messaging systems
- **Legacy system bridges** that document patterns specific to mainframe modernization
- **Multi-tenancy recipes** that extract tenant-isolation patterns and verify their consistency
- **Code quality recipes** that emit complexity, cohesion, and coupling metrics structured for agent consumption (a pattern explored by Moderne in 2026 with quality-focused Prethink extensions)

Custom recipes follow the same anatomy and lifecycle as canonical ones. The framework's contracts (manifest, output formats, registry interaction) apply uniformly.

When designing a custom recipe, the test is whether the question it answers is deterministic and reusable. If yes, it is a recipe. If no (the answer depends on prompt phrasing or session state), it is a prompt template, which belongs in the agent integration layer, not the recipe layer.

## 8. Reference Implementations

The framework is implementation-agnostic. The following reference implementations exist as starting points for organizations evaluating their options.

### 8.1 Moderne Prethink Starter Recipes

The Moderne Prethink documentation publishes two starter recipes that illustrate the canonical pattern. They are listed here for orientation, not endorsement.

- **`io.moderne.prethink.UpdatePrethinkContextNoAiStarter`.** Pure deterministic analysis. Produces Dependency Intelligence (with transitive trees), Test Intent Mapping, Service Topology (CALM), and Structural Inventory artifacts. Suitable for organizations that prefer no AI in the context generation pipeline.
- **`io.moderne.prethink.UpdatePrethinkContextStarter`.** Includes the deterministic analysis above and adds AI-generated knowledge graph and test summaries through Bring Your Own Model (BYOM). Suitable for organizations that have an approved internal LLM and want richer summaries.

Both starters automatically update agent configuration files (`CLAUDE.md`, `.cursorrules`, `.github/copilot-instructions.md`) with pointers to the generated artifacts. This is the auto-wiring pattern described in [06 Agent Integration Patterns](./06_Agent_Integration_Patterns_v1.1.0_2026-05-04.md).

### 8.2 Building Your Own Starter Set

Organizations implementing SCL-AD without a commercial platform should build a starter set of three recipes first, expanding to all eight over Phases 2 and 3 of the adoption roadmap. The recommended starter set is:

1. **Structural Inventory** (highest leverage per token of effort)
2. **Convention Extraction** (highest impact on agent output quality)
3. **Dependency Intelligence** (most actionable for migration and security agents)

Service Topology, Test Intent Mapping, Configuration Surface, Security Posture Snapshot, and Deployment Context are added in Phase 2 as the value of the starter set is validated.

## References

1. [OpenRewrite Recipe Documentation](https://docs.openrewrite.org/concepts-and-explanations/recipes). Reference model for recipe design.
2. [Moderne Prethink Documentation](https://docs.moderne.io/user-documentation/recipes/prethink). Concrete examples of context recipe outputs and starter recipe definitions.
3. [Moderne Blog: Changing the AI context](https://www.moderne.ai/blog/changing-ai-code-context-moderne-prethink). Reference for the eight semantic categories that informed this framework.
4. [FINOS CALM Specification](https://calm.finos.org/). Schema for Service Topology artifacts.
5. [SPDX Specification](https://spdx.dev/). Reference SBOM format for Dependency Intelligence outputs.
