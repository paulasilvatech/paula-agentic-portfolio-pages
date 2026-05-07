---
title: "Implementation Sequence: 90 / 180 / 365 Days to an Agentic DevOps Platform"
description: "The day-by-day, week-by-week, and quarter-by-quarter implementation plan for both Three Horizons and Open Horizons accelerators. Goals, decisions, deliverables, and expected outcomes per phase."
author: "Paula Silva"
role: "Software Global Black Belt"
contact: "paulasilva@microsoft.com"
date: "2026-05-05"
version: "1.0.0"
status: "draft"
locale: "en"
brand: "Agentic DevOps"
tags: [implementation-sequence, 90-days, 180-days, 365-days, deployment-plan, phased-rollout, dora-keys]
---

# Chapter 09: Implementation Sequence

> **Argument.** The two accelerators (Three Horizons and Open Horizons) compress time-to-first-production AI workload from the Forrester baseline of 9-18 months to roughly 90-180 days. The compression is not magic; it is the result of a specific implementation sequence that respects the stacking rule (chapter 02), invests in the four pillars in the right order (chapter 03), and executes the Dual Mandate (chapter 05) deliberately. This chapter codifies the sequence in three phases (Days 0-90: Foundation; Days 90-180: Enhancement; Days 180-365: Innovation) with explicit goals, decisions, deliverables, and expected outcomes per phase. The sequence is largely identical between the two accelerators; the differences are at the technology-stack level, not at the program level.

---

## Table of Contents

1. [The Sequence at a Glance](#1-the-sequence-at-a-glance)
2. [Days 0-30: Pre-Deployment and Discovery](#2-days-0-30-pre-deployment-and-discovery)
3. [Days 30-90: Foundation (Horizon 1)](#3-days-30-90-foundation-horizon-1)
4. [Days 90-180: Enhancement (Horizon 2)](#4-days-90-180-enhancement-horizon-2)
5. [Days 180-365: Innovation (Horizon 3)](#5-days-180-365-innovation-horizon-3)
6. [The Three Non-Negotiables](#6-the-three-non-negotiables)
7. [Risks and Mitigations Per Phase](#7-risks-and-mitigations-per-phase)
8. [Per-Accelerator Differences in Sequencing](#8-per-accelerator-differences-in-sequencing)
9. [The Weekly Cadence](#9-the-weekly-cadence)
10. [Synthesis: Why the Sequence Compresses](#10-synthesis-why-the-sequence-compresses)
11. [References](#references)

---

## 1. The Sequence at a Glance

The sequence has three phases plus a pre-deployment phase. The phases align with the Three Horizons maturity model.

| Phase | Timeline | Goal | Maturity Outcome |
|-------|----------|------|-------------------|
| Pre-deployment | Days 0-30 | Discovery, accelerator decision, foundation provisioning | Decision ratified; deployment in progress |
| Foundation (H1) | Days 30-90 | Three application teams onboarded via H1 Golden Paths; DORA metrics live | Operational level on most CNCF dimensions |
| Enhancement (H2) | Days 90-180 | H2 templates adopted by ten teams; service catalog ≥80% coverage; first Copilot Chat agent in use | Scalable level on most CNCF dimensions |
| Innovation (H3) | Days 180-365 | First production AI workload; agent observability live; Dual Mandate executed visibly | Optimizing or AI-Native on at least three CNCF dimensions |

The expected outcome at day 365: time-to-first-production for an AI workload has dropped to 90-180 days for *new* workloads (the platform has reached Forrester's compression target). The platform is in production; the platform team is executing both mandates; the first agent workload is governed end-to-end.

The sequence is the operational expression of the strategic argument in chapters 01-05. It is also the structural answer to the procurement question "how fast can we get to production?".

---

## 2. Days 0-30: Pre-Deployment and Discovery

### 2.1 Goal

Reach a ratified accelerator decision and begin foundation provisioning. The phase ends when the customer's executive sponsor signs the engagement agreement and the foundation Terraform configuration begins applying.

### 2.2 Decisions

The decisions to ratify in this phase:

- **Accelerator selection.** Three Horizons or Open Horizons (or, in rare cases, pilot-both). Chapter 08 covers the decision framework.
- **Cloud region selection.** The Azure region(s) where the platform will be deployed. For LATAM customers, typically Brazil South; for some, Brazil Southeast or Chile Central or Mexico Central, depending on data-residency requirements.
- **Identity provider integration.** The customer's existing identity provider (Entra ID, Active Directory, Okta, etc.) and its federation pattern with the platform's Entra Agent ID.
- **GitHub organization structure.** The GitHub organization(s) where the platform's repositories will live.
- **Initial team selection.** The first three application teams that will onboard via H1 Golden Paths. Selection criteria in section 2.3.

### 2.3 Selection Criteria for the First Three Teams

The first three teams should be chosen for their structural properties, not their political importance. The criteria:

- **Team has a real workload to deliver in the next 90 days.** The team is not "available to pilot"; the team has a deadline that the platform will support.
- **Team has at least one engineer comfortable with platform onboarding.** Not necessarily expert; comfortable with reading documentation, asking questions, and committing to learning.
- **Team's workload fits an H1 Golden Path.** A new microservice, a new web application, a documentation site, or basic CI/CD work. Not an exotic workload.
- **Team's leadership supports the platform program.** The team's manager or director understands what is being asked and supports the time investment.

The first three teams are the validation of the platform's readiness. Choosing teams that meet the criteria is more important than choosing the first three teams that volunteered.

### 2.4 Deliverables

The phase produces:

1. Signed engagement agreement.
2. Ratified accelerator decision (one-page output from the chapter 08 discovery method).
3. Initial foundation Terraform configuration (16 modules in Open Horizons, or equivalent in Three Horizons), customized for the customer's region, naming, and identity.
4. The customer's GitHub organization structure ready for the platform.
5. A named platform team with a product manager, not only engineers.
6. Selected first three application teams with a kickoff scheduled.

### 2.5 Common Mistakes

The common mistakes in this phase:

- **Skipping the discovery method.** The customer chooses an accelerator based on impression rather than evidence. Mitigation: insist on the chapter 08 method, even if it adds two weeks.
- **Naming the platform team without naming a product manager.** Mitigation: explicit PM role with explicit ownership of the dual-mandate roadmap.
- **Selecting first teams based on politics.** Mitigation: enforce the structural criteria; if the politically-favored team does not meet the criteria, find a different first team and revisit politics later.
- **Underestimating the Azure subscription preparation.** Subscription quotas, region availability, networking peering, identity federation can take longer than expected. Mitigation: Azure preparation begins in week 1 of the phase, not week 4.

---

## 3. Days 30-90: Foundation (Horizon 1)

### 3.1 Goal

Establish a credible H1 foundation in production. Onboard the first three application teams via H1 Golden Paths. Publish the first DORA Four Keys measurements for those teams.

### 3.2 Decisions

The decisions to ratify in this phase:

- **GitOps repository structure.** The convention for Argo CD application repositories; the relationship between application repositories and GitOps repositories.
- **Policy-as-code starter set.** The initial OPA Gatekeeper, Kyverno, or Azure Policy assignments. Typically 10-15 policies covering the most-impactful guardrails (Workload Identity, signed images, network security, basic resource limits).
- **Observability dashboard customization.** The customer's specific KPIs and how they map to the three pre-built Grafana dashboards (Platform Overview, Cost Management, Golden Path Application).
- **Identity federation specifics.** The Entra ID groups that map to platform RBAC roles; the agent identity model for the first agent (typically the `platform` Copilot Chat agent).
- **Cost-attribution conventions.** How costs are tagged, how dashboards roll up, what the per-workload attribution model is.

### 3.3 Deliverables

The phase produces, in approximately this order:

**Weeks 1-4 (deployment):**

1. AKS or ARO cluster provisioned with Workload Identity, Key Vault, ACR, VNet, NSGs.
2. Backstage (Open Horizons) or RHDH (Three Horizons) deployed, branded, GitHub-OAuth-secured, with the H1 Golden Paths available.
3. Argo CD or OpenShift GitOps deployed with environment-specific sync policies.
4. Prometheus (50GB storage, 15-day retention, 2 replicas), Grafana, Alertmanager (PagerDuty + Microsoft Teams routing), OpenTelemetry collector, Jaeger distributed tracing deployed; the three pre-built Grafana dashboards (Platform Overview, Cost Management, Golden Path Application) live; 30+ baseline Prometheus alerting rules active.
5. Defender for Cloud and Defender for Containers integrated; baseline runtime threat detection live.
6. Workload Identity federation configured between Entra ID and the cluster; the platform's RBAC model live.

**Weeks 5-8 (first team onboarding):**

7. First application team onboarded via the `web-application` or `new-microservice` Golden Path.
8. First team's PR-to-production lead time measured at the new platform; baseline established.
9. First team's `catalog-info.yaml` registered in Backstage/RHDH catalog.
10. First team's TechDocs site published.

**Weeks 9-12 (second and third team onboarding):**

11. Second and third teams onboarded via H1 Golden Paths.
12. DORA Four Keys live for all three teams.
13. Cost dashboard live with per-workload attribution for the three teams.
14. First retrospective: what worked, what did not, what to adjust for H2.

### 3.4 Expected Outcomes at Day 90

Time-to-first-PR for a new team: under 1 day (vs. a typical baseline of 2-4 weeks). First DORA measurements published for three teams. Foundation is "credible" in the chapter 05 sense: at least one of the platform team's recurring tasks has been absorbed by an AI agent (typically the `platform` Copilot Chat agent answering "how do I do X on the new platform?"). Mandate A signal is live by week 8-10.

The platform has reached the *Operational* level on most CNCF maturity dimensions (chapter 10). It has not yet reached Scalable; that is the goal of phase 2.

### 3.5 Common Mistakes

- **Onboarding too many teams too fast.** The first three teams are the validation of the platform; onboarding the fourth team while the first three are still finding bugs amplifies the bug volume. Mitigation: complete the first three onboardings before starting the fourth.
- **Policy as warnings rather than rejections.** "We will warn for now and enforce later" almost never reaches enforcement; the warnings become noise. Mitigation: enforce policies as rejections from day one with a documented break-glass workflow.
- **Skipping the trajectory observability.** Without trajectories, agent behavior cannot be debugged. Mitigation: trajectory capture is part of the foundation deployment, not a phase 2 add-on.
- **Treating DORA as a scorecard rather than a filter.** The DORA Four Keys are the lens through which AI's effect on delivery is observed (chapter 01). Mitigation: instrument the keys for measurement, not for ranking.

---

## 4. Days 90-180: Enhancement (Horizon 2)

### 4.1 Goal

Expand from H1 to H2. Onboard ten application teams. Stand up the Context layer (chapter 02) at credible coverage. Deploy the first Copilot Chat agent in active platform-team use.

### 4.2 Decisions

The decisions to ratify in this phase:

- **Service catalog convention.** Which Backstage entity types are mandatory, what metadata is required, what owner attribution is required.
- **Documentation-as-code standard.** TechDocs adoption org-wide; the structure that documentation follows.
- **Data catalog and lineage tool.** Microsoft Purview is the default in both accelerators; for some customers, DataHub is also a consideration.
- **Policy-as-code expansion set.** The next 20-30 policies that move the platform from baseline coverage to Scalable coverage.
- **Cost dashboard maturation.** What the per-team chargeback model is; what the rollup conventions are; what the alerting thresholds are.

### 4.3 Deliverables

The phase produces:

**Months 4-5:**

1. H2 Golden Paths live and adopted by the first ten teams: `api-microservice`, `event-driven-microservice`, `batch-job`, `data-pipeline`, `microservice` (full), `gitops-deployment`, `api-gateway`, `reusable-workflows`, `ado-to-github-migration` (where applicable).
2. Service catalog populated with ≥80% coverage of eligible workloads.
3. Documentation-as-code (TechDocs) adopted org-wide for all new services.
4. OPA Gatekeeper or Kyverno policies in production at expanded coverage; break-glass workflow documented.

**Month 6:**

5. Cost dashboard live with org-wide per-workload cost attribution.
6. First Copilot Chat agent in active use: typically the `platform` agent answering platform-related questions for both the platform team and the application teams.
7. Microsoft Purview integrated; data lineage flowing into the catalog for data pipelines.
8. The Mandate B model gateway is operational (Foundry exposed as a Golden Path); the first application team is consuming the model gateway through Foundry.
9. Second retrospective: what is working, what is missing, what to focus on for H3.

### 4.4 Expected Outcomes at Day 180

Time-to-first-production for a new microservice: under 1 week. Platform adoption ≥50% of eligible workloads. DORA Four Keys showing measurable improvement (deployment frequency increasing, lead time decreasing, change failure rate stable or decreasing, MTTR decreasing).

The Mandate B signal is live: at least one application team is consuming a Mandate B primitive through a Golden Path. Combined with the Mandate A signal from phase 1, the Dual Mandate maturity test (chapter 05, section 4) is passing.

The platform has reached the *Scalable* level on most CNCF maturity dimensions. It has not yet reached Optimizing; that is the goal of phase 3.

### 4.5 Common Mistakes

- **Promoting H2 templates without retiring H1 alternatives.** Teams continue to use the older H1 patterns because they are still available. Mitigation: deprecate H1 patterns explicitly when H2 supersedes them.
- **Letting the catalog cover only the new services.** Existing services do not register, and the catalog becomes a partial source of truth. Mitigation: drive catalog coverage to ≥80% of *all* services, not only new services.
- **Skipping the cost dashboard maturation.** Cost remains pooled rather than attributed; the platform team cannot answer "what does each team spend?". Mitigation: attribute cost in phase 1, not phase 3.
- **Not yet deploying the Copilot Chat agent.** The platform team is still rate-limited by manual Q&A. Mitigation: the `platform` agent ships in week 14-16 of the program, not week 30.

---

## 5. Days 180-365: Innovation (Horizon 3)

### 5.1 Goal

Reach H3 with the first production agent workload. Enter the *Optimizing* or *AI-Native* level of the CNCF maturity model on at least three of the five dimensions.

### 5.2 Decisions

The decisions to ratify in this phase:

- **Model gateway scaling pattern.** As more workloads consume Foundry, the routing, metering, and policy patterns mature. The phase produces the documented routing playbook.
- **Agent identity model maturation.** Workload Identity is sufficient for phase 1; for phase 3, the customer typically adopts SPIFFE/SPIRE or equivalent for cross-cluster agent identity. The decision is whether and when.
- **Evaluation framework.** The default is the `ai-evaluation-pipeline` template; for some customers, additional evaluation frameworks (LangSmith, Inspect AI, DeepEval) are added.
- **Agent governance workflow.** The AI agent promotion gate is implemented through the Microsoft Agent Governance Toolkit. The phase produces the customer's specific governance flow.
- **Sector-specific compliance integration.** For regulated customers, the phase integrates sector-specific compliance reporting (BACEN, ANEEL, ANS, sector-specific) into the platform's observability.

### 5.3 Deliverables

The phase produces:

**Months 7-9:**

1. First H3 template in production: typically `foundry-agent` or `rag-application`.
2. Model gateway operational at full scale; per-model cost and usage dashboard live.
3. Agent observability complete: trajectories, cost, output sampling, evaluation results, all surfaced in the AI Usage Grafana dashboard.
4. At least one agent running a real business process end-to-end with human review at promotion boundaries.
5. The AI Usage dashboard becomes a primary KPI surface for the platform team.

**Months 10-12:**

6. Multi-agent orchestration explored through the `multi-agent-system` template.
7. The `sre-agent-integration` template in active use for the platform team's incident-response work.
8. The platform team's quarterly review surfaces both Mandate A metrics (AI absorption of platform-team work) and Mandate B metrics (application-team consumption of AI primitives).
9. Third retrospective: what is the platform's operating cadence, what is the next year's roadmap, what is the maturity assessment against CNCF.

### 5.4 Expected Outcomes at Day 365

Time-to-first-production for an AI workload: 90-180 days (vs. 9-18 months baseline). Measurable AI ROI per Forrester methodology. Platform team at *Optimizing* level on at least three of the five CNCF dimensions. The platform's agent fleet has grown from 1-2 agents (phase 1) to 10-20 agents in production. The platform's foundation is operating; the platform team's roadmap is shaping the second year of the program.

### 5.5 Common Mistakes

- **Treating H3 as a separate platform.** H3 templates inherit H1 and H2 primitives; treating them as a separate effort produces duplication. Mitigation: every H3 template is, structurally, a microservice plus an agent binding.
- **Underestimating evaluation pipeline operations.** Building the evaluation pipeline is one task; operating it (maintaining golden datasets, interpreting results, propagating fixes) is ongoing. Mitigation: the evaluation pipeline has a named owner from day one.
- **Skipping agent governance until production.** Agents that escape their permission scope produce incidents. Mitigation: agent governance is wired in phase 1, exercised in phase 2, mature by phase 3.
- **Failing to retire shadow agents.** Application teams that built agents on Shadow Platforms before the central platform supported them. Mitigation: phase 3 includes an explicit shadow-agent retirement workstream.

---

## 6. The Three Non-Negotiables

Three commitments make the difference between enterprises that execute this sequence and enterprises that do not.

### 6.1 Treat the Platform as a Product, Not a Project

The platform team is staffed permanently; the platform's roadmap is versioned; the platform's success is measured continuously. Project funding has an end date; product funding does not. The platform is product-funded.

The structural reason this matters: the platform's value compounds over years, not months. The McKinsey 2.5x ROI compression (chapter 01) is a 3-year effect; the Forrester 4-6x compression is a 1-year effect. Both require the platform to exist as a continuous, owned, evolving thing, not as a one-time deliverable.

The signal that distinguishes a platform-as-product from platform-as-project: the platform has a product manager. Projects have project managers. Products have product managers. The role is different.

### 6.2 Refuse to Skip H1

The evidence in chapter 01 is unambiguous: no shortcut survives contact with production. Organizations that skip H1 (because the executive sponsor wants to see H3 in 90 days) accumulate debt that surfaces in phase 2 or phase 3.

The discipline that prevents skipping: the platform team has the authority to say "no" to H3 work that depends on H1 work that has not landed. The authority must be explicit; it must be defended by the platform team's leadership when the executive sponsor pushes back.

The structural mitigation: the chapter 09 sequence is the contract. The customer ratifies the sequence at the engagement signing; the customer does not modify the sequence mid-flight without explicit re-ratification.

### 6.3 Ship the First Copilot Agent Early

Even a minimal `platform` agent (that answers "how do I do X on our platform") pays for itself inside a quarter because it absorbs the onboarding load that otherwise falls on the platform team. The agent ships in week 8-10 of the program (early in phase 1), not week 30.

The early agent is the first executable proof that the Dual Mandate is being executed. Without it, Mandate A is theory; with it, Mandate A is operational. The signal compounds: the agent's trajectory data improves the agent over time; the agent absorbs more work; the platform team's velocity improves; the platform team's velocity improvement compounds into faster delivery for application teams.

---

## 7. Risks and Mitigations Per Phase

### 7.1 Phase 1 Risks

| Risk | Mitigation |
|------|-----------|
| Identity federation issues delay foundation deployment | Identity federation begins in Days 0-30; it is not a phase 1 problem |
| First three teams cannot meet the structural criteria | Re-select; do not compromise on the criteria |
| Policy-as-code adoption produces broken builds | Documented break-glass workflow; explicit exception list |
| Trajectory observability not yet wired | Capture is part of the foundation deployment, not a phase 2 add-on |

### 7.2 Phase 2 Risks

| Risk | Mitigation |
|------|-----------|
| Service catalog coverage stalls below 50% | Mandate registration as a deploy-time admission requirement |
| Cost dashboard does not produce per-workload attribution | Tag conventions are a phase 1 deliverable, not a phase 2 deliverable |
| Copilot Chat agent is deployed but not adopted | Track agent invocation metrics; if below 30% by week 20, intervene |
| H2 templates are ignored in favor of H1 alternatives | Deprecate H1 alternatives explicitly when H2 supersedes them |

### 7.3 Phase 3 Risks

| Risk | Mitigation |
|------|-----------|
| First H3 template fails evaluation pipeline | Evaluation criteria are documented before development starts; the team works against the criteria, not retrofits |
| Agent permission scope expansion not gated | The Manual Review pillar's agent-promotion gate is wired in phase 1 |
| Multi-agent orchestration produces inconsistency | The Spec-Driven Development pattern is enforced; the `CONSTITUTION.md` and `SPECIFICATION.md` artifacts are required |
| Shadow Platforms persist after platform readiness | Phase 3 includes explicit shadow-platform retirement; political support from executive sponsor required |

### 7.4 Cross-Phase Risks

| Risk | Mitigation |
|------|-----------|
| Platform team headcount growth lags adoption growth | Quarterly headcount review against adoption metrics |
| Executive sponsor changes mid-program | Engagement agreement names sponsor responsibilities; transition protocol documented |
| Vendor support escalation paths unclear | Joint Microsoft + (Red Hat for Three Horizons / community for Open Horizons) escalation paths documented in week 1 |
| Regulatory or compliance landscape changes | Compliance team participates in monthly platform review; emerging requirements are surfaced early |

---

## 8. Per-Accelerator Differences in Sequencing

### 8.1 What Differs

The sequence is largely identical between Three Horizons and Open Horizons. The differences are at the technology-stack level, not at the program level. Specifically:

**In Three Horizons:**

- Day 1-7 of phase 1 includes ARO provisioning rather than AKS provisioning. ARO has a slightly longer provisioning time (typically 75 minutes for the joint Microsoft+Red Hat managed control plane, vs 30 minutes for AKS alone).
- The H1 software template authoring is via RHDH conventions rather than Backstage upstream conventions. The conventions are similar but not identical; the platform team's familiarity with Red Hat tooling matters.
- The supply-chain pipeline integration is via Red Hat Trusted Application Pipeline rather than the SLSA + Sigstore stack. The integration work is roughly equivalent; the operational expertise required differs.
- The AI assist layer includes Red Hat Lightspeed alongside GitHub Copilot. Lightspeed adoption follows its own rollout; in some customers, Lightspeed is mature in phase 2; in others, phase 3.

**In Open Horizons:**

- Day 1-7 of phase 1 includes AKS provisioning. The accelerator's 16 Terraform modules cover all foundation infrastructure.
- The H1 scaffolder template authoring is via Backstage upstream conventions. The platform team's familiarity with upstream Backstage matters.
- The supply-chain pipeline integration is via SLSA + Sigstore + GitHub Advanced Security. The integration is well-documented but requires the team to be comfortable with upstream OSS components.
- The AI assist layer is GitHub Copilot only. Microsoft Foundry Agent Service handles custom agent workloads.

### 8.2 What Does Not Differ

The phase boundaries (90 days, 180 days, 365 days) are identical. The Dual Mandate signals (Mandate A by week 8-10, Mandate B by week 14-16) are identical. The CNCF maturity progression (Operational → Scalable → Optimizing) is identical. The deliverable count per phase is roughly equivalent.

The structural reason these do not differ: the strategy is identical, the foundation is identical, and the maturity model is identical. Only the stack varies.

---

## 9. The Weekly Cadence

The platform team operates a weekly cadence throughout the year. The cadence:

**Weekly:**

- **Monday: Sprint review.** What shipped last week, what is shipping this week, what is blocked.
- **Wednesday: Adoption review.** Per-team adoption metrics; emerging blockers from the application teams; capacity for the next two weeks.
- **Friday: Health and risk review.** DORA Four Keys, cost dashboard, agent observability. Risk register update.

**Monthly:**

- **End of month: Platform maturity assessment.** CNCF five-dimension scoring; trend analysis; what improved, what regressed, what is on the next-month roadmap.
- **End of month: Stakeholder update.** A one-page update for the executive sponsor: progress, risks, decisions needed.

**Quarterly:**

- **End of quarter: Quarterly business review.** Adoption metrics, ROI metrics, dual-mandate execution evidence. Executive sponsor present; cross-functional partners present (security, compliance, finance).
- **End of quarter: Roadmap refresh.** Next quarter's deliverables based on the previous quarter's evidence.

The cadence is the operational expression of "platform as product". A platform that does not have this cadence is not being operated as a product; it is being operated as a project that has not yet ended.

---

## 10. Synthesis: Why the Sequence Compresses

The chapter started with a 9-18 month baseline and a 90-180 day target. The sequence has shown how the compression works.

The compression is not from doing the same work faster. The compression is from absorbing the most-time-consuming portion of platform construction (the integration work) into the accelerator. The customer's work is the workload-specific opinion: which policies, which Golden Paths, which AI workloads. The integration work is done.

The compression is also from avoiding the failure modes (chapter 04) that delay platform programs. Triple Debt does not accumulate because cognitive and intent context are codified from day one. Shadow Platforms do not form because the central platform productizes capabilities faster than teams can build alternatives. Context Rot does not develop because lineage and ownership metadata are platform primitives. Security Regression does not appear because Workload Identity and signed-image admission are wired from week one. The 100:1 problem is structurally addressed because agents are first-class citizens of the platform from phase 1.

The compression is, finally, from the Dual Mandate's compounding effect. Mandate A produces an internal-velocity multiplier; Mandate B produces an external-velocity multiplier. The two multiply rather than add. A platform team that is 2x faster internally and an application team that is 3x faster externally produces 6x compression in delivery, not 5x.

That is the structural answer to "why 90-180 days?". The sequence in this chapter is the operational answer.

The final chapter (10) covers what the platform looks like at the end of year 1 and beyond: maturity, measurement, and ROI. The metrics that prove the program is succeeding, the dashboards that surface them, the business case that defends them at the CFO level.

---

## References

- Silva, P. (2026). *Platform Engineering Playbook: Chapter 06 — Option A: Three Horizons (Red Hat)*. (This playbook.)
- Silva, P. (2026). *Platform Engineering Playbook: Chapter 07 — Option B: Open Horizons (OSS)*. (This playbook.)
- Silva, P. (2026). *Platform Engineering: The Foundation Layer for the AI-Native Enterprise*, v1.0.0, chapter 10 (Implementation Sequence). Microsoft.
- [DORA 2025 Accelerate State of DevOps Report](https://dora.dev/research/2025/dora-report/). Google Cloud / DORA, 2025.
- [Forrester Wave: Platform Engineering Solutions Q1 2026](https://www.forrester.com/report/the-forrester-wave-platform-engineering-solutions-q1-2026/). Forrester Research, 2026.
- [CNCF Platform Engineering Maturity Model](https://tag-app-delivery.cncf.io/whitepapers/platform-eng-maturity-model/). Cloud Native Computing Foundation, 2025-2026.
- McKinsey & Company. (2025). [The State of AI 2025](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai).

---

Paula Silva, Software Global Black Belt
*Pioneering software development with AI and Agentic DevOps*

paulasilva@microsoft.com
