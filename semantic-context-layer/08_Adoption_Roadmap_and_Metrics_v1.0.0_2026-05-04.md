---
title: "08 Adoption Roadmap and Metrics"
description: "A phased adoption roadmap for SCL-AD, with success metrics, ROI model, and exit criteria for each phase."
author: "Paula Silva"
date: "2026-05-04"
version: "1.0.0"
status: "draft"
tags: ["scl-ad", "adoption", "roadmap", "metrics", "roi"]
---

# 08 Adoption Roadmap and Metrics

> A phased path from zero to enterprise-scale SCL-AD deployment, with measurable exit criteria, success metrics, and a defensible ROI model.

## Change Log

| Version | Date       | Author      | Changes         |
|---------|------------|-------------|-----------------|
| 1.0.0   | 2026-05-04 | Paula Silva | Initial version |

## Table of Contents

- [1. Roadmap Overview](#1-roadmap-overview)
- [2. Phase 0: Discovery and Baseline](#2-phase-0-discovery-and-baseline)
- [3. Phase 1: Pilot](#3-phase-1-pilot)
- [4. Phase 2: Expansion](#4-phase-2-expansion)
- [5. Phase 3: Platform](#5-phase-3-platform)
- [6. Phase 4: Optimization](#6-phase-4-optimization)
- [7. Success Metrics](#7-success-metrics)
- [8. ROI Model](#8-roi-model)
- [9. Common Adoption Risks](#9-common-adoption-risks)
- [References](#references)

## 1. Roadmap Overview

SCL-AD adoption follows five phases. Each phase has a defined scope, defined exit criteria, and measurable outcomes. The phasing is not arbitrary; each phase prepares the organization for the next.

| Phase     | Focus                                | Typical Duration | Exit Criteria                                              |
|-----------|--------------------------------------|------------------|------------------------------------------------------------|
| Phase 0   | Discovery and baseline               | 2 to 4 weeks     | Documented baseline metrics; pilot scope defined           |
| Phase 1   | Pilot                                | 4 to 8 weeks     | One repository fully instrumented; metrics improve         |
| Phase 2   | Expansion                            | 3 to 6 months    | 10 to 50 repositories instrumented; platform pattern set   |
| Phase 3   | Platform                             | 6 to 12 months   | All in-scope repositories instrumented; governance live    |
| Phase 4   | Optimization                         | Ongoing          | Continuous improvement of recipes, integrations, costs     |

The durations are typical for organizations with mature DevOps practices. Organizations starting from a less mature baseline should expect to extend each phase, particularly Phase 0 and Phase 3.

## 2. Phase 0: Discovery and Baseline

The objective of Phase 0 is to know where the organization stands before changing anything. Without baseline data, the framework cannot demonstrate value; without documented scope, the work has no boundary.

### 2.1 Activities

**Inventory the agent landscape.** Which AI coding tools are in use today? GitHub Copilot, Cursor, Claude Code, custom agents? At what license tier? With what current adoption rate by team?

**Inventory the repository landscape.** Which repositories are in active development? Which are production-impacting? What languages, build systems, and dependency managers are in use?

**Measure the baseline.** Capture the current state of the metrics defined in section 7. Even imperfect baselines are valuable; they make future improvements visible.

**Identify the pilot scope.** Select a small number of repositories (1 to 3) for the pilot. Choose repositories with active development, measurable agent usage, and willing engineering teams.

**Identify the implementation strategy.** Decide on the Code Intelligence layer approach (build, buy, hybrid) per [03 Code Intelligence Layer](./03_Code_Intelligence_Layer_v1.0.0_2026-05-04.md). Decide on storage pattern (co-located, centralized, federated) per [05 Context Registry and Distribution](./05_Context_Registry_and_Distribution_v1.0.0_2026-05-04.md).

### 2.2 Exit Criteria

- A documented baseline of token consumption, agent satisfaction, and code quality metrics
- A documented pilot scope with named repositories and named team contacts
- A documented implementation approach approved by platform leadership
- A signed-off pilot charter that includes the success criteria for Phase 1

## 3. Phase 1: Pilot

The objective of Phase 1 is to prove that the framework works in the organization's context. The pilot is small enough to be reversible and large enough to be representative.

### 3.1 Activities

**Stand up the Code Intelligence layer for the pilot scope.** This may use an existing platform (Roslyn, OpenRewrite, a commercial platform) or a minimal custom implementation. The bar is correctness, not completeness.

**Implement two or three recipes from the canonical seven.** Recommended starting set: Structural Inventory, Convention Extraction, Dependency Intelligence. These provide the broadest agent grounding for the smallest implementation effort.

**Stand up a minimal registry.** For the pilot, co-located storage in the repository's `.context/` directory is typically sufficient. Centralized infrastructure can be deferred to Phase 2.

**Wire up agent integration.** Static file injection into `copilot-instructions.md` (or the equivalent) is the lowest-effort path. MCP integration can be added as a stretch goal.

**Measure continuously.** Capture the same metrics from Phase 0 with the framework in place. Compare.

### 3.2 Exit Criteria

- The pilot repositories produce all selected artifacts and refresh them on commit
- Agents in the pilot scope consume the artifacts (verified by inspection)
- Token consumption per agent task decreases by a measurable margin (target: 30% or more)
- Hallucination rate decreases or convention adherence improves (per the metrics in section 7)
- Engineering teams in the pilot report subjective improvement in agent quality
- A documented case for proceeding to Phase 2

## 4. Phase 2: Expansion

The objective of Phase 2 is to validate that the pattern scales beyond the pilot. The work shifts from "does it work" to "how do we operate this."

### 4.1 Activities

**Expand to 10 to 50 repositories.** Choose a mix that exercises the framework: different languages, different team sizes, different criticality levels. Avoid expanding only to repositories similar to the pilot.

**Promote the registry to centralized.** The co-located approach hits friction at this scale. A centralized registry simplifies cross-repository queries and unifies governance.

**Add the remaining canonical recipes.** Service Topology, Test Intent Mapping, Configuration Surface, Security Posture Snapshot. Each adds value for a different agent class.

**Establish the recipe lifecycle.** Recipe versioning, testing, and release become real disciplines, not aspirational. Recipe stewards are named.

**Enable MCP-based integration.** Static files remain for broad coverage; MCP queries enable advanced agent operations.

**Begin governance enforcement.** Identity propagation, audit logging, and classification labels go live in production mode (not just configured).

### 4.2 Exit Criteria

- 10 to 50 repositories produce all canonical artifacts
- Centralized registry operates with the documented refresh policy
- MCP integration is available to agents that support it
- Governance controls SCL-IAM-01, SCL-IAM-02, SCL-INT-01, SCL-OBS-01, SCL-OBS-02 are in place
- Documented operational runbooks for the registry and the recipe pipeline
- A documented business case for Phase 3

## 5. Phase 3: Platform

The objective of Phase 3 is to make SCL-AD the default platform capability for all in-scope repositories. The work shifts from "expansion" to "production operations."

### 5.1 Activities

**Onboard all in-scope repositories.** Define the in-scope criteria explicitly (typically: production-impacting code, in active development, owned by an identified team). Onboard everything that meets the criteria.

**Operationalize the full governance model.** All twelve controls from [07 Governance and Compliance](./07_Governance_and_Compliance_v1.0.0_2026-05-04.md) are operational. Audit reports are produced on schedule.

**Integrate with the broader developer platform.** SCL-AD becomes a peer to the source control platform, the build platform, and the security platform. It appears in developer experience surfaces (IDE, code review tools, internal portals).

**Build domain recipe libraries.** Beyond the canonical seven, organization-specific recipes capture domain conventions. Compliance mappings, framework-specific patterns, internal API extraction.

**Establish continuous improvement processes.** Metric reviews, recipe deprecation cycles, integration roadmaps. The framework becomes part of the platform's normal operation.

### 5.2 Exit Criteria

- All in-scope repositories instrumented
- Full governance model operational
- Documented integration with the developer platform's other components
- Continuous improvement processes running with measurable cadence
- Business case validated; ROI demonstrated against Phase 0 baseline

## 6. Phase 4: Optimization

Phase 4 is open-ended. The framework is in production; the work is making it better.

### 6.1 Continuous Activities

**Recipe portfolio management.** Recipes are added, deprecated, and refactored based on observed agent behavior. Recipes that no agent consumes are candidates for deprecation.

**Integration evolution.** Agent platforms evolve. New integration capabilities (improved MCP support, new context APIs, new agent types) require continuous integration work.

**Performance and cost optimization.** Recipe execution costs, registry storage costs, and agent token costs are monitored and optimized. Caching, parallelism, and selective execution reduce overall spend.

**Quality measurement.** Agent quality metrics drive recipe changes. If a category of agent error correlates with missing context, the framework gains a new recipe to address it.

**Community contribution.** As the framework matures, organizations contribute back to the SCL-AD community: new recipes, improved patterns, lessons learned. The framework benefits from network effects.

## 7. Success Metrics

Eight metrics measure the framework's value. Organizations should track all eight from Phase 0 onward; the metrics they prioritize depend on their primary business case.

### 7.1 Token Consumption Per Task

The number of tokens consumed by an AI coding agent to complete a defined task category (such as a code change of bounded complexity).

**Target:** 40% to 70% reduction from baseline by end of Phase 2.

### 7.2 Hallucination Rate

The fraction of agent outputs that contain at least one factual error attributable to incorrect context (such as referencing a non-existent function or using a deprecated API).

**Target:** measurable reduction by end of Phase 1; sustained improvement through Phase 3.

### 7.3 Convention Adherence Rate

The fraction of agent-generated code that complies with the codebase's documented conventions on first generation, without manual correction.

**Target:** at least 30 percentage point improvement by end of Phase 2.

### 7.4 Time to First Useful Suggestion

The wall-clock time from a developer prompt to the first agent output that the developer accepts (in whole or in part).

**Target:** measurable reduction in agent latency; specific target depends on baseline.

### 7.5 Developer Satisfaction

A periodic survey measure of developer trust in agent output, agent helpfulness, and willingness to use AI-assisted workflows.

**Target:** improvement in trust and helpfulness; willingness to use already high in most baselines and may not move much.

### 7.6 Pull Request Throughput

The number of pull requests merged per developer per unit time. A blunt instrument; sensitive to many confounding factors. Useful as a tertiary metric.

**Target:** measurable improvement, attributed cautiously.

### 7.7 Registry Freshness

The fraction of artifacts that are within their staleness window. An operational metric, not a value metric, but critical for trust.

**Target:** 95% or higher in steady state.

### 7.8 Audit Coverage

The fraction of registry operations covered by audit logs. An operational metric required for compliance.

**Target:** 100%.

## 8. ROI Model

A defensible ROI model has three components: cost savings, quality improvements, and platform leverage.

### 8.1 Direct Cost Savings

Token consumption is the most direct measurable cost. The savings calculation is:

```
Token savings = (Baseline tokens per task)
              × (Reduction percentage)
              × (Tasks per developer per month)
              × (Number of developers)
              × (Months)
              × (Cost per token)
```

For an organization with 500 developers, 100 agent-assisted tasks per developer per month, an average baseline of 50,000 tokens per task, a 50% reduction, and a blended token cost of $0.005 per 1,000 tokens, the monthly savings is approximately $62,500.

This is the floor of the savings, not the ceiling. It does not account for the broader effects below.

### 8.2 Quality Improvements

The cost of agent-induced rework is harder to measure but typically larger than the direct token cost. Each hallucination that survives review and reaches production carries a cost: bug fix cycles, customer impact, on-call burden.

A conservative estimate: if hallucination rate drops by 50% and the cost of an average production-impacting agent error is 8 engineer-hours of remediation, the savings scale with the volume of agent-generated code. For most enterprise deployments, this dominates the direct token savings by an order of magnitude.

### 8.3 Platform Leverage

The framework enables capabilities that were previously not feasible. Migration agents that operate across thousands of repositories. Compliance agents that produce auditable change logs. Architecture agents that reason across service boundaries. The economic value of these capabilities is highly organization-specific.

Platform leverage is real but should not be over-claimed in initial business cases. It is best presented as the upside that becomes accessible after Phase 3, not the justification for Phases 0 through 2.

### 8.4 Cost Side

The framework has costs:

- **Build effort.** Phase 0 through 2 typically require a small dedicated team (2 to 4 platform engineers) for several months. Phase 3 onward is operational.
- **Tooling.** Code Intelligence layer choices have license implications. Commercial platforms reduce build effort but add license cost.
- **Infrastructure.** Registry storage, recipe execution compute, MCP server hosting. Typically a small fraction of overall AI tooling cost.
- **Governance overhead.** Governance work is real, particularly in regulated industries. Budget should reflect this honestly.

A typical enterprise implementation reaches positive ROI between Phase 2 exit and the first quarter of Phase 3, depending on baseline and adoption rate.

## 9. Common Adoption Risks

Five risks recur across SCL-AD adoptions. Each has a documented mitigation.

**Risk: pilot success that does not scale.** A pilot with three motivated teams may show outsized improvements that do not generalize. Mitigation: choose a pilot with realistic diversity; measure metrics against representative workloads.

**Risk: governance retrofit.** Building Phases 1 and 2 without governance and adding it in Phase 3 is much harder than building governance in from the start. Mitigation: enable identity propagation, audit logging, and classification from Phase 1, even at low fidelity.

**Risk: recipe sprawl.** Without portfolio management, recipes proliferate. Each adds maintenance cost; few add value. Mitigation: name recipe stewards from Phase 1; deprecate aggressively from Phase 3.

**Risk: vendor lock-in.** Choosing a commercial platform without a clean abstraction layer creates lock-in that is expensive to escape. Mitigation: enforce the framework's interface contracts even when using a single vendor today; treat the contracts as portable interfaces.

**Risk: token savings without quality improvement.** Token reduction is easy to measure but not the ultimate goal. A reduction in tokens that does not improve agent output quality is a hollow win. Mitigation: track the full metric set, not just token consumption; treat quality metrics as the primary success criterion.

## References

1. [GitHub Octoverse 2024](https://github.blog/news-insights/octoverse/octoverse-2024/). Reference data on AI tooling adoption in enterprises.
2. [DORA State of DevOps Reports](https://dora.dev/research/). Reference framework for measuring developer platform impact.
3. [Anthropic: Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents). Industry context on the value of structured context.
4. [Moderne Blog: Changing AI code context](https://www.moderne.ai/blog/changing-ai-code-context-moderne-prethink). Reference perspective on token economics in agentic coding.
