---
title: "10 Build vs Buy: Competitive Positioning"
description: "A vendor-neutral comparison of paths to implementing the Semantic Context Layer for Agentic DevOps: build internally, buy a commercial platform, or hybrid."
author: "Paula Silva"
date: "2026-05-04"
version: "1.0.0"
status: "draft"
tags: ["scl-ad", "competitive-positioning", "build-vs-buy", "moderne", "github", "microsoft"]
---

# 10 Build vs Buy: Competitive Positioning

> A practical comparison of the three paths to implementing SCL-AD: build it on your existing platform stack, buy a purpose-built commercial platform, or run a hybrid. The framework is the same; the implementation choice is not.

## Change Log

| Version | Date       | Author      | Changes         |
|---------|------------|-------------|-----------------|
| 1.0.0   | 2026-05-04 | Paula Silva | Initial version |

## Table of Contents

- [1. The Core Question](#1-the-core-question)
- [2. The Three Paths](#2-the-three-paths)
- [3. Path A: Build on the GitHub and Microsoft Stack](#3-path-a-build-on-the-github-and-microsoft-stack)
- [4. Path B: Buy a Commercial Platform](#4-path-b-buy-a-commercial-platform)
- [5. Path C: Hybrid Implementation](#5-path-c-hybrid-implementation)
- [6. Decision Framework](#6-decision-framework)
- [7. Capability-by-Capability Comparison](#7-capability-by-capability-comparison)
- [8. Cost Comparison](#8-cost-comparison)
- [9. Risk Comparison](#9-risk-comparison)
- [10. Recommended Decision Path](#10-recommended-decision-path)
- [References](#references)

## 1. The Core Question

The SCL-AD framework specifies **what** semantic context is, **how** it should behave, and **how** it should be governed. It does not specify what to buy or what to build. Every organization adopting the framework eventually faces the same decision: build the layers in-house, buy a commercial platform that already implements them, or combine the two.

This document treats that decision as a structured comparison, not as a sales pitch. It identifies the trade-offs, the conditions that favor each path, and the realistic combinations. It is written from a vendor-neutral perspective and is intended to support enterprise architects, platform leaders, and procurement teams as they decide how to operationalize SCL-AD.

## 2. The Three Paths

There are three viable paths to a production SCL-AD deployment.

**Path A: Build.** Implement all four layers using the organization's existing platform investments. Typical foundation: GitHub Enterprise plus Microsoft Azure plus open-source code intelligence tooling.

**Path B: Buy.** Adopt a commercial platform that implements the Code Intelligence layer and ships pre-built recipes covering most of the eight canonical categories. Moderne is the most prominent example; other adjacent platforms (Sourcegraph for parts of the layer, GitHub Advanced Security for security-specific slices) play partial roles.

**Path C: Hybrid.** Use a commercial platform for the layers that are hardest to build (multi-language Code Intelligence, large recipe catalogs) and build the layers that are most organization-specific (custom recipes, Context Registry integrations, governance overlays).

The right choice is not universal. It depends on the organization's existing investments, language diversity, regulatory posture, and platform engineering capacity.

## 3. Path A: Build on the GitHub and Microsoft Stack

The build path is realistic when the organization already operates on GitHub Enterprise plus a Microsoft Azure stack and has a platform engineering team capable of new platform development.

### 3.1 Reference Architecture

A representative implementation of all four SCL-AD layers using GitHub and Microsoft components:

| Layer                      | Component                                     | Implementation Detail                                                       |
|----------------------------|-----------------------------------------------|-----------------------------------------------------------------------------|
| Code Intelligence (.NET)   | Roslyn Workspaces API                         | Compiler-as-a-service producing fully resolved syntax trees                 |
| Code Intelligence (JVM)    | OpenRewrite (open-source)                     | Lossless Semantic Tree implementation                                       |
| Code Intelligence (TS/JS)  | TypeScript Compiler API                       | Project references resolved through `tsc --noEmit`                          |
| Code Intelligence (Python) | Pyright + LibCST                              | Type resolution plus format-preserving syntax                               |
| Code Intelligence (Cross)  | CodeQL                                        | Cross-language call graphs, data flow, security patterns                    |
| Recipe Engine              | GitHub Actions reusable workflows             | Recipes as composable workflows, versioned in a recipe repository           |
| Context Registry           | Azure Blob Storage + Azure Cosmos DB          | Object store for artifact bodies, metadata index for discovery              |
| Discovery API              | Azure API Management                          | Stable endpoint with throttling, auth, and observability                    |
| Discovery Schema           | Azure API Center                              | Catalog of registry endpoints with schemas and consumer mapping             |
| MCP Server                 | Custom server hosted on Azure Container Apps  | Translates registry queries into MCP tool surface                           |
| Static File Distribution   | GitHub Actions on commit                      | Auto-wires `copilot-instructions.md`, `CLAUDE.md`, `.cursorrules`           |
| Identity                   | Microsoft Entra ID                            | Identity propagation through OAuth across all components                    |
| Audit                      | Azure Monitor + Microsoft Sentinel            | Audit retention, anomaly detection, compliance reporting                    |

This architecture covers all eight recipe categories and all four agent integration patterns from the framework's perspective.

### 3.2 What Path A Buys You

**Sovereignty and control.** Every component runs under the organization's own subscriptions, with the organization's own identity layer, in the organization's chosen regions. There is no external dependency on a code-modernization vendor.

**Native integration.** GitHub Copilot, Azure DevOps pipelines, Microsoft Entra ID, and the rest of the Microsoft developer platform all integrate without extra connectors. The implementation team works inside one ecosystem.

**Customization without limit.** Every recipe, every artifact format, every governance rule can be tuned to organizational needs. No vendor approval required, no change request to a roadmap.

**Cost containment for narrow stacks.** Organizations dominated by one or two languages (typically .NET-only or JVM-only shops) can build a high-quality implementation without spreading effort across many language toolchains.

### 3.3 What Path A Costs You

**Engineering time.** A realistic build of the full architecture requires a dedicated team of three to five platform engineers for nine to fifteen months to reach Phase 3 of the adoption roadmap. Most of that time goes into the Code Intelligence layer for languages beyond the primary one.

**Recipe authoring.** All eight canonical recipes plus organization-specific extensions must be authored, tested, and maintained internally. This is significant ongoing work, not a one-time cost.

**Polyglot complexity.** Organizations with diverse language portfolios (a typical large bank might have Java, .NET, COBOL, Python, JavaScript, and Go in production) face multiplicative cost. Each language requires its own toolchain, maintenance, and recipe engineering.

**Limited recipe ecosystem.** OpenRewrite has thousands of recipes for JVM languages. The .NET, Python, and TypeScript ecosystems have much smaller deterministic-recipe catalogs. Organizations on those stacks build more from scratch.

### 3.4 When Path A Wins

The build path is the right answer when:

- The organization is dominated by one or two languages with mature compiler-as-service tooling
- Platform engineering capacity is available and chartered for this work
- Sovereignty and customization are explicit business requirements
- Existing investments in GitHub Enterprise plus Azure are deep
- The organization values the long-term internal capability more than short-term time-to-value

## 4. Path B: Buy a Commercial Platform

The buy path is realistic when the organization wants to compress time-to-value, has language diversity that makes a per-language build expensive, or lacks platform engineering capacity for a multi-quarter build.

The most prominent commercial platform implementing SCL-AD-aligned capabilities is **Moderne**. Other vendors implement subsets of the framework but no other vendor as of 2026 covers all four layers as a single product.

### 4.1 What Moderne Implements

The Moderne platform covers the framework's layers as follows:

| Layer                       | Moderne Coverage                                                                                |
|-----------------------------|-------------------------------------------------------------------------------------------------|
| Code Intelligence           | Lossless Semantic Tree (LST) for JVM, JavaScript, TypeScript, COBOL, XML, YAML; C# and Python on roadmap |
| Context Recipes             | Two starter Prethink recipes plus 5,000+ OpenRewrite recipes for transformation                 |
| Context Registry            | Repository-co-located artifacts plus optional centralized model                                 |
| Agent Integration           | Auto-wiring of `copilot-instructions.md`, `CLAUDE.md`, `.cursorrules`; MCP server (Moddy)       |
| Capability Pillars          | Precompute, Target, Execute, Coordinate (the framing this framework adopted from Moderne)       |

In addition, Moderne provides Moddy, a multi-repo AI agent that uses LST and recipes as its tool surface and can be exposed via MCP to GitHub Copilot, Claude Code, Cursor, and other MCP-capable agents.

### 4.2 What Path B Buys You

**Time-to-value.** A pilot can produce real artifacts in weeks rather than months. The Code Intelligence layer is delivered, not built.

**Language breadth.** Multi-language enterprises get coverage of mainstream JVM, JS/TS, COBOL, and IaC formats out of the box. The organization does not need internal expertise in every language toolchain.

**Recipe ecosystem.** OpenRewrite's 5,000+ recipes provide an immediate baseline of deterministic transformations. For migration use cases (Java upgrades, Spring Boot migrations, framework consolidations), this is decisive.

**Vendor accountability.** Roadmap, support, and reliability are vendor obligations. The organization can negotiate SLAs and escalate issues through commercial channels.

**Continuous improvement.** New recipe categories, new language support, new agent integrations arrive through the vendor's release cycle. The organization benefits from a shared investment.

### 4.3 What Path B Costs You

**Subscription cost.** Commercial code intelligence platforms are priced for enterprise consumption. Organizations should expect license costs proportional to repository count and engineer count.

**Vendor dependency.** Critical infrastructure (Code Intelligence, recipe execution) sits with a vendor. Migration cost is non-trivial if the relationship sours.

**Limited customization.** Custom recipes and registry integrations are possible but bounded by what the platform exposes. Organizations with unusual requirements may find limits.

**Identity and integration overhead.** Every component the organization uses (GitHub Enterprise, Microsoft Entra ID, Azure-hosted custom services) needs an integration with the vendor's platform. These integrations are real work, not zero.

### 4.4 When Path B Wins

The buy path is the right answer when:

- The organization is polyglot and multi-language coverage is essential
- Time-to-value matters more than long-term internal capability
- Migration use cases (Java upgrades, Spring upgrades, framework consolidations) are dominant
- Platform engineering capacity is limited or already committed to other work
- The organization is comfortable with vendor dependency for a peer-of-source-control system

## 5. Path C: Hybrid Implementation

Hybrid is the most common production pattern. It uses commercial tooling for the parts that are hardest to build and internal engineering for the parts that are most organization-specific.

### 5.1 Reference Hybrid Topology

| Layer                     | Component                                                                                |
|---------------------------|------------------------------------------------------------------------------------------|
| Code Intelligence (JVM)   | Commercial platform (Moderne, Sourcegraph)                                               |
| Code Intelligence (.NET)  | Internal Roslyn-based pipeline                                                           |
| Code Intelligence (other) | Commercial platform                                                                      |
| Canonical Recipes         | Commercial platform's catalog                                                            |
| Domain Recipes            | Internal recipe authoring (compliance, internal frameworks, organization conventions)    |
| Context Registry          | Internal, hosted on Azure Blob plus Cosmos DB, ingesting commercial platform output      |
| MCP Server                | Internal, exposing both internal and commercial-derived artifacts through one interface  |
| Static File Distribution  | Internal, owned by the platform team                                                     |
| Governance and Audit      | Internal, leveraging Microsoft Entra ID and Microsoft Sentinel                           |

The pattern is: buy the layers that scale across languages and require deep platform engineering, build the layers that encode organizational uniqueness.

### 5.2 What Path C Buys You

**Best of both.** Commercial breadth at the bottom, organizational specificity at the top. Time-to-value is competitive with the buy path; long-term flexibility is competitive with the build path.

**Sovereignty where it matters.** Identity, audit, and registry remain internal. Sensitive artifacts never leave organizational control.

**Negotiating leverage.** The organization is not fully captive to the commercial vendor. If the vendor relationship deteriorates, the build-side components remain and provide a migration path.

### 5.3 What Path C Costs You

**Two integration boundaries.** The hybrid architecture has more interfaces, more contracts, and more potential failure points than either pure path.

**Operational complexity.** Two release cycles to manage, two support models, two skill sets in the platform team.

**Cost stack.** The organization pays for the commercial subscription and for the internal engineering. The hybrid is rarely cheaper than either pure path; it is usually faster than build and more flexible than buy.

### 5.4 When Path C Wins

Hybrid is the right answer when:

- The organization is multi-language but has at least one strong primary language with internal expertise
- Sovereignty requirements are strict for some artifacts but not all
- Domain-specific recipes are a significant share of the value (regulated industries, specialized frameworks)
- Negotiating leverage with commercial vendors is a strategic priority
- Platform engineering capacity is moderate (not zero, not abundant)

## 6. Decision Framework

The decision can be structured around six questions. The answers tilt the balance toward one of the three paths.

| Question                                                                                          | Build Tilt   | Hybrid Tilt    | Buy Tilt    |
|---------------------------------------------------------------------------------------------------|--------------|----------------|-------------|
| How many languages dominate the production codebase?                                              | One or two   | Three to five  | Six or more |
| How much platform engineering capacity is dedicated to this initiative?                           | High         | Medium         | Low         |
| How urgent is time-to-value (Phase 1 results)?                                                    | Low          | Medium         | High        |
| How strict are sovereignty and customization requirements?                                        | Strict       | Mixed          | Flexible    |
| Are migration and modernization (Java, framework upgrades) primary use cases?                     | Secondary    | Mixed          | Primary     |
| Is the organization comfortable with vendor dependency for critical platform capabilities?       | Uncomfortable| Conditional    | Comfortable |

The questions are not weighted equally. Language count and platform engineering capacity tend to dominate the decision in practice.

## 7. Capability-by-Capability Comparison

A detailed comparison of each layer against each path. Marks indicate strength of fit.

| Capability                          | Build (GitHub + Microsoft) | Buy (Moderne)            | Hybrid           |
|-------------------------------------|----------------------------|--------------------------|------------------|
| .NET Code Intelligence              | Strong (Roslyn)            | Limited (roadmap)        | Strong           |
| Java Code Intelligence              | Possible (Eclipse JDT)     | Strong (LST)             | Strong           |
| TypeScript Code Intelligence        | Strong (TS Compiler API)   | Strong (LST)             | Strong           |
| Python Code Intelligence            | Possible (Pyright)         | Limited (roadmap)        | Strong           |
| COBOL and Mainframe                 | Limited                    | Strong                   | Strong           |
| Recipe Catalog                      | Build from scratch         | 5,000+ recipes available | Mixed            |
| Multi-Repo Coordination             | Build from scratch         | Strong (native)          | Strong           |
| Identity Propagation                | Strong (Entra ID)          | Vendor model             | Strong (Entra)   |
| Audit and Compliance                | Strong (Sentinel)          | Vendor model             | Strong           |
| Customization                       | Unlimited                  | Bounded                  | Unlimited        |
| Time-to-Value                       | Slow                       | Fast                     | Medium           |
| Total Cost (5-year)                 | High capex, low opex       | Low capex, ongoing opex  | Medium both      |

The table is directional. Each cell hides nuance that should be validated for a specific organization's context.

## 8. Cost Comparison

A defensible cost comparison covers three components: implementation, operation, and license.

### 8.1 Implementation Cost

**Build:** 9 to 15 months of a dedicated team of 3 to 5 platform engineers, plus part-time security and architecture review. Realistic budget: USD 1.5M to 3M for the full Phase 0 to Phase 3 progression.

**Buy:** 3 to 6 months of a smaller team (2 to 3 engineers) focused on integration and customization rather than core platform construction. Realistic budget: USD 400K to 800K plus subscription.

**Hybrid:** 6 to 9 months of a team of 3 to 4. Realistic budget: USD 800K to 1.5M plus subscription.

### 8.2 Operation Cost

**Build:** 1.5 to 2 FTEs of ongoing platform engineering for maintenance, recipe evolution, and language-toolchain upgrades.

**Buy:** 0.5 to 1 FTE of ongoing platform engineering for vendor liaison, integration maintenance, and policy management.

**Hybrid:** 1 to 1.5 FTEs of ongoing platform engineering, split between vendor liaison and internal layer maintenance.

### 8.3 License Cost

**Build:** None for the framework itself. Existing GitHub Enterprise plus Azure subscription costs are baseline.

**Buy:** Commercial license, typically priced per repository or per engineer. Public benchmarks are limited; budget for a six-figure annual commitment for mid-to-large enterprises.

**Hybrid:** Same as buy, possibly at a lower tier because of reduced scope.

### 8.4 Total Cost of Ownership

Over a five-year horizon, the three paths often converge in TCO terms but with very different cash flow profiles. Build is capex-heavy in years 1 to 2, low opex thereafter. Buy is opex-steady throughout. Hybrid sits in between.

The decision is rarely about which is cheapest. It is about which cost profile fits the organization's financial preferences and which capability profile fits its strategic intent.

## 9. Risk Comparison

| Risk Category                  | Build                           | Buy                              | Hybrid                     |
|--------------------------------|---------------------------------|----------------------------------|----------------------------|
| Time-to-value                  | High (long build)               | Low                              | Medium                     |
| Vendor dependency              | None                            | High                             | Medium                     |
| Language coverage gaps         | Medium (per-language toolchain) | Low (broad coverage)             | Low                        |
| Engineering capacity strain    | High                            | Low                              | Medium                     |
| Customization friction         | None                            | Medium                           | Low                        |
| Sovereignty exposure           | None                            | Vendor's hosting model           | Low (sensitive data internal) |
| Platform discontinuity         | Internal control                | Vendor lifecycle risk            | Mitigated by build-side    |
| Skill development              | Strong (deep capability)        | Limited (operator skills only)   | Medium                     |

Risk profile is a primary input to the decision, alongside cost and capability fit.

## 10. Recommended Decision Path

A practical decision process unfolds in three stages.

### 10.1 Discovery (1 to 2 weeks)

Document the organization's language portfolio, repository count, existing platform investments, and platform engineering capacity. Define the regulatory and sovereignty constraints. Identify the dominant agentic coding use cases (migration, security, code quality, onboarding).

### 10.2 Evaluation (3 to 6 weeks)

Run a vendor evaluation in parallel with a build feasibility study. The vendor evaluation can be a paid pilot of a commercial platform on a representative repository set. The build feasibility study is a small spike (one or two engineers, two weeks) producing a working slice of the Code Intelligence layer for the dominant language.

The artifacts from this stage are concrete: a measured baseline of token consumption and hallucination rate, a working prototype of one capability pillar (typically Precompute), and a reasoned cost projection.

### 10.3 Decision and Phase 1 (immediately following evaluation)

The decision is made with evidence rather than intuition. The chosen path enters Phase 1 of the adoption roadmap.

The decision is reversible. An organization that starts on the build path can pivot to buy after Phase 2 if engineering capacity proves insufficient. An organization that starts on buy can pivot to hybrid after Phase 3 if customization requirements emerge that the platform cannot meet. The framework's interface contracts make these pivots manageable rather than catastrophic.

## References

1. [Moderne Platform Overview](https://www.moderne.ai/product). Reference for the buy-path coverage of SCL-AD layers.
2. [Moderne Agent Capabilities](https://www.moderne.ai/product/agent-capabilities). Source of the four-pillar capability framing.
3. [Moderne Lossless Semantic Tree](https://www.moderne.ai/technology/lossless-semantic-tree). Reference Code Intelligence layer implementation.
4. [Moderne Moddy](https://www.moderne.ai/product/moddy). Reference example of an MCP-exposed code intelligence agent.
5. [GitHub Enterprise Cloud Documentation](https://docs.github.com/en/enterprise-cloud@latest). Foundation for the build-path GitHub-side architecture.
6. [Azure API Center Documentation](https://learn.microsoft.com/azure/api-center/). Foundation for the build-path discovery layer.
7. [Microsoft Entra ID Documentation](https://learn.microsoft.com/entra/identity/). Foundation for the build-path identity layer.
8. [OpenRewrite Documentation](https://docs.openrewrite.org/). Open-source LST and recipe engine, available to all three paths.
