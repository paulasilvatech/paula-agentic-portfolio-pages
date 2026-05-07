---
title: "The CNCF Four Pillars of Platform Control: The Governance Plane for Human and Agent Workloads"
description: "Deep treatment of Golden Paths, Guardrails, Safety Nets, and Manual Review Workflows as the four pillars of platform control, and how the same four pillars re-express as the AI control plane in 2026."
author: "Paula Silva"
role: "Software Global Black Belt"
contact: "paulasilva@microsoft.com"
date: "2026-05-05"
version: "1.0.0"
status: "draft"
locale: "en"
brand: "Agentic DevOps"
tags: [cncf, four-pillars, golden-paths, guardrails, safety-nets, manual-review, ai-control-plane, platform-engineering]
---

# Chapter 03: The CNCF Four Pillars of Platform Control

> **Argument.** The four pillars of Golden Paths, Guardrails, Safety Nets, and Manual Review Workflows were originally engineered to govern human-driven software delivery. In 2026, the same four pillars are re-expressed as the control plane for AI-driven software delivery. The re-expression is not a metaphor; it is operational. Golden Paths become the templates by which agents are instantiated. Guardrails become the policies agents must satisfy at runtime. Safety Nets become the reconciliation loops that correct agent drift. Manual Review becomes the approval workflow for agent capability expansion. A platform that has codified the four pillars for human developers has most of what it needs to govern agents. A platform that has not, does not.

---

## Table of Contents

1. [Why Four, and Why These Four](#1-why-four-and-why-these-four)
2. [Golden Paths: The User Interface of the Platform](#2-golden-paths-the-user-interface-of-the-platform)
3. [Guardrails: The Safety Interlocks of the Platform](#3-guardrails-the-safety-interlocks-of-the-platform)
4. [Safety Nets: The Immune System of the Platform](#4-safety-nets-the-immune-system-of-the-platform)
5. [Manual Review: The Accountability Structure of the Platform](#5-manual-review-the-accountability-structure-of-the-platform)
6. [The Pillars as the AI Control Plane](#6-the-pillars-as-the-ai-control-plane)
7. [Pillar Maturity and How to Measure It](#7-pillar-maturity-and-how-to-measure-it)
8. [Common Failure Patterns Per Pillar](#8-common-failure-patterns-per-pillar)
9. [How the Four Pillars Are Materialized in the Two Accelerators](#9-how-the-four-pillars-are-materialized-in-the-two-accelerators)
10. [Synthesis: The Pillars as Operating System](#10-synthesis-the-pillars-as-operating-system)
11. [References](#references)

---

## 1. Why Four, and Why These Four

The [CNCF Platform Engineering Working Group's Platform Maturity Model](https://tag-app-delivery.cncf.io/whitepapers/platform-eng-maturity-model/) codifies a control taxonomy that has emerged as the reference vocabulary for platform engineering in 2026. The taxonomy has four pillars. The four were not chosen arbitrarily.

Each pillar corresponds to a distinct mode of governance. Golden Paths *enable* the right action by making it the easy action. Guardrails *prevent* the wrong action by making it impossible. Safety Nets *recover* from incorrect actions that escaped prevention. Manual Review *accountabilizes* high-risk actions by inserting a human checkpoint.

The four modes are exhaustive. Any governance challenge a platform faces falls into one of the four. Failure to address any one of the four leaves a gap that AI will eventually amplify into an incident. The mapping below is the orienting structure for the rest of the chapter.

| Pillar | Governance Mode | Architectural Role | Failure Mode If Missing |
|--------|-----------------|---------------------|-------------------------|
| Golden Paths | Enable correct action | User interface | Developers and agents reinvent infrastructure; consistency collapses |
| Guardrails | Prevent incorrect action | Safety interlocks | Wrong configurations reach production |
| Safety Nets | Recover from incorrect action | Immune system | Failures persist and compound |
| Manual Review | Accountabilize high-risk action | Accountability structure | High-impact decisions automated without authority |

The 2026 reframing is that each of the four modes applies symmetrically to humans and to agents. Humans and agents both need a way to do the right thing easily. Humans and agents both need to be prevented from doing the wrong thing. Humans and agents both need recovery when something goes wrong. Humans and agents both need accountability for high-risk actions. The pillars do not distinguish between human and agent users; they distinguish between modes of governance.

This symmetry is what makes the CNCF taxonomy load-bearing for the AI-native enterprise. A platform that has implemented the four pillars for human developers has implemented most of the AI control plane already. The remaining work is to re-express the pillars in agent-aware terms (covered in section 6).

---

## 2. Golden Paths: The User Interface of the Platform

### 2.1 What a Golden Path Is

A Golden Path is an opinionated, self-service workflow that gets a developer (or an agent) from "I want to build X" to a working, compliant system in minutes rather than weeks.

A Golden Path is not a template. It is a **template that encodes the enterprise's current best practice for a specific outcome**, versioned and improvable. The distinction matters because templates rot; Golden Paths are operated as products with explicit lifecycle and improvement loops.

### 2.2 The Four Properties of a Mature Golden Path

A mature Golden Path has four properties:

**A single developer-facing entry point.** Typically a [Backstage scaffolder template](https://backstage.io/docs/features/software-templates/) (Open Horizons) or an [RHDH software template](https://developers.redhat.com/rhdh) (Three Horizons). The entry point is the only sanctioned way to invoke this Golden Path. Multiple entry points fragment the user experience and create maintenance burden.

**Parametrization for the legitimate variability a developer needs.** The Golden Path accepts inputs that legitimately vary (service name, owner, region, service tier, scaling profile) and rejects inputs that should not vary (security policies, observability configuration, compliance bindings). The boundary between legitimate and illegitimate variability is where Golden Paths express enterprise opinion.

**Embedded compliance.** The template generates everything required for the workload to be compliant by construction: CI/CD configuration, infrastructure-as-code, observability bindings, policy attachments, secrets management, identity assignment. A workload that comes out of a Golden Path is compliant on day one because the path generates compliance artifacts as part of the scaffold.

**Versioning so that paths evolve with the platform and deprecation is explicit.** Golden Paths must be versioned (typically semver), and old versions must be deprecated explicitly with migration guidance. Without versioning, paths become unmaintainable; old workloads continue using outdated patterns indefinitely.

### 2.3 Golden Paths as the Platform's User Interface

The right way to think about Golden Paths is that they are the *user interface* of the platform. The platform team builds the substrate (Kubernetes, identity, observability, policy); the substrate is invisible to most developers. What developers see is the Backstage or RHDH catalog with a list of Golden Paths they can invoke.

The Golden Path catalog is the single most important developer-facing artifact the platform team produces. The catalog answers, in one screen, "what can I build here, and how do I start?". A platform team that cannot point a new developer at a catalog containing the answer to that question has not yet built the user interface of the platform.

### 2.4 The Golden Path Inventory in the Two Accelerators

**Open Horizons** ships **22 Golden Paths**, organized by the Three Horizons maturity model:

- **H1 Foundation (6 templates)**: `basic-cicd`, `security-baseline`, `documentation-site`, `web-application`, `new-microservice`, `infrastructure-provisioning`. The baseline every enterprise needs before doing anything else.
- **H2 Enhancement (9 templates)**: `ado-to-github-migration`, `api-gateway`, `api-microservice`, `batch-job`, `data-pipeline`, `event-driven-microservice`, `gitops-deployment`, `microservice`, `reusable-workflows`. Advanced application patterns assuming H1 is in place.
- **H3 Innovation (7 templates)**: `foundry-agent`, `sre-agent-integration`, `mlops-pipeline`, `multi-agent-system`, `copilot-extension`, `rag-application`, `ai-evaluation-pipeline`. AI/ML/Agentic templates assuming H1 and H2 are in place.

Chapter 07 covers each of the 22 templates in operational detail.

**Three Horizons** materializes Golden Paths as RHDH software templates with the same H1/H2/H3 organization. The template count is similar (the exact inventory varies by Red Hat version), and the structural categories match. The differentiating property of Three Horizons Golden Paths is the integration with OpenShift Pipelines and OpenShift GitOps as the native delivery substrate.

Chapter 06 covers the Three Horizons Golden Path inventory in operational detail.

### 2.5 Why Generative Golden Paths Matter in 2026

Historically, Golden Paths were hand-written by platform engineers and updated quarterly. That model worked for human-driven delivery. In an agent-driven environment, it does not.

In 2026, mature platforms make Golden Paths **generative and self-optimizing**. AI agents now generate paths from organizational context: team patterns, past deploys, cost-optimization opportunities. When a developer asks an agent to "deploy this microservice," the agent consumes the Golden Path registry, synthesizes it with real-time infrastructure state, and produces a complete, deterministic artifact. The platform team reviews and approves the path template once. Agents reuse it thousands of times.

The implication for the platform team's job description is direct. Instead of writing Terraform modules all day, platform engineers write validation schemas, define constraints, and curate the agent-generated Golden Path proposals. The work shifts from authoring to opinionating.

---

## 3. Guardrails: The Safety Interlocks of the Platform

### 3.1 What a Guardrail Is

A Guardrail is a mechanism that **prevents** developers (or agents) from deploying non-compliant or unsafe configurations in the first place. Guardrails are preventive, not detective. Their purpose is to make the wrong thing hard to do.

The distinction between preventive and detective controls is not academic. Detective controls (security scans that flag violations after deployment) are too slow for agent-driven delivery, where automation operates faster than human review can keep up. Preventive controls (admission policies that reject violations before deployment) are the only structurally durable mechanism in 2026.

### 3.2 The Four Surfaces of Guardrails

Guardrails materialize across four surfaces in 2026.

**Policy as Code.** [OPA Gatekeeper](https://open-policy-agent.github.io/gatekeeper/), [Kyverno](https://kyverno.io/), or [Azure Policy](https://learn.microsoft.com/en-us/azure/governance/policy/overview) enforced at admission. The policy is expressed as code, versioned alongside the platform, applied to every workload at the cluster admission boundary. Policy-as-code is the most-flexible guardrail surface and the most operationally important.

**Network Security Groups and service mesh policy** enforced at the network layer. Network policy controls which services can talk to which other services. In a service mesh (OpenShift Service Mesh in Three Horizons, Istio or Linkerd in Open Horizons), network policy is enforced at the sidecar layer and is independent of application-level configuration.

**Workload Identity** (replacing long-lived service credentials) enforced at authentication. Workload Identity issues short-lived, federated credentials to workloads on demand, rather than provisioning long-lived secrets in environment variables or files. Workload Identity is the single most-effective guardrail against credential leaks (covered in chapter 04 as a failure mode).

**Image and supply-chain policy.** Signed images, admission controllers rejecting unsigned workloads, [SLSA](https://slsa.dev/) provenance attestations, [Sigstore](https://www.sigstore.dev/) signatures. The guardrail rejects any container image that did not come through the approved build pipeline with verifiable provenance.

### 3.3 Guardrails as Compile-Time Errors for Infrastructure

The right mental model for Guardrails is that they are **compile-time errors for infrastructure**. A developer who writes `int x = "hello"` in Java does not get a runtime error; they get a compile-time error. The compiler refuses to produce a binary. The wrong thing is impossible to do.

Guardrails apply the same model to infrastructure. A developer who tries to deploy a workload with a hard-coded credential, a publicly-exposed database, or a non-compliant image does not get a runtime warning; they get a deploy-time rejection. The cluster refuses to admit the workload. The wrong thing is impossible to do.

This model is what allows compliance to scale with agent velocity. A single policy definition covers thousands of agent-driven deployments. Human reviewers focus on policy definition and exception handling, not case-by-case validation.

### 3.4 The 2026 Reframing: Guardrails for Agents

In 2026, Guardrails do double duty. The same OPA Gatekeeper policy that rejects non-compliant Kubernetes manifests also rejects non-compliant agent configurations. The same Workload Identity that issues short-lived credentials to applications also issues short-lived credentials to agents. The same image signing policy that rejects unsigned application images also rejects unsigned agent images.

The agent-specific Guardrails that the 2026 platform must add are:

- **Permission-scope guardrails.** Each agent has a declared permission scope (data sources it can read, actions it can take, cost ceiling per session). The platform enforces the scope at runtime.
- **Output-filter guardrails.** Each agent has declared output policies (PII redaction, content filtering, safety classification). The platform enforces output filters before the output reaches the consuming system.
- **Data-residency guardrails.** Each agent has declared data-residency constraints. The platform enforces that the model gateway routes the agent's traffic only to model endpoints in the permitted regions.
- **Cost-circuit-breaker guardrails.** Each agent has declared cost ceilings per session and per day. The platform enforces hard breaks when ceilings are exceeded, terminating the agent's session rather than allowing unbounded spend.

These four agent-specific Guardrails are what the Gartner cancellation prediction (chapter 01) is, structurally, predicting the absence of. Organizations whose agentic AI projects are cancelled by 2027 will, in most cases, be organizations that did not implement these agent-specific Guardrails before scaling agent deployment.

---

## 4. Safety Nets: The Immune System of the Platform

### 4.1 What a Safety Net Is

A Safety Net is a mechanism that **detects and recovers** from failures that Guardrails did not prevent. Safety Nets are detective and corrective. They are the platform's immune system: continuous, autonomous, and oriented toward returning the system to a known-good state.

The relationship between Guardrails and Safety Nets is sequential. Guardrails attempt to prevent failures. Safety Nets handle the failures that escaped prevention. A platform that relies only on Guardrails (no Safety Nets) is brittle: any prevention gap becomes a persistent incident. A platform that relies only on Safety Nets (no Guardrails) is exhausting: every failure must be detected and corrected from scratch. The platform needs both.

### 4.2 The Four Surfaces of Safety Nets

**GitOps reconciliation.** [Argo CD](https://argo-cd.readthedocs.io/) or [Flux](https://fluxcd.io/) continuously compares the deployed state of the cluster to the declared state in Git. When the deployed state drifts from the declared state, the GitOps controller reconciles by enforcing the declared state. Drift is detected and corrected without human intervention. This is the most-foundational Safety Net in 2026 platforms.

**Observability stacks.** [Prometheus](https://prometheus.io/), [Grafana](https://grafana.com/), [OpenTelemetry](https://opentelemetry.io/), [Azure Monitor](https://learn.microsoft.com/en-us/azure/azure-monitor/), and [Application Insights](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview) surface anomalies through metrics, logs, and traces. The observability stack is the diagnostic surface the platform team operates daily; it is also the substrate on which alerting rules and autonomous recovery automation run.

**Backup and recovery.** [Velero](https://velero.io/) for Kubernetes state, database snapshot policies, blob-storage immutability, off-region replication. Backup and recovery is the last-resort Safety Net: when reconciliation cannot recover (because the declared state itself is corrupted), backup and recovery restore from a known-good snapshot.

**Progressive delivery.** Canary, blue-green, and feature-flag delivery patterns that limit the blast radius of a faulty change. Progressive delivery is preventive at the change-deployment layer (a bad change reaches 1% of traffic before being rolled back) and is the most-effective Safety Net for application-layer faults.

### 4.3 Autonomous Vulnerability Response and Predictive SRE

In 2026, the maturity frontier of Safety Nets is autonomous and predictive.

**Autonomous vulnerability response.** When a new CVE drops, the platform automatically generates runtime guardrails (an updated admission policy) and deploys them in minutes, not days. The traditional process (a CVE drops, the platform team manually authors a patch, rolls it out across hundreds of clusters, validates per-cluster) compressed weeks of exposure into minutes of exposure. The economic impact is substantial.

**Predictive SRE.** Anomaly detection systems anticipate failure patterns and trigger preventive actions before users feel the impact. AIOps 2.0, in the 2026 vocabulary, is the consolidation of observability data with model-driven prediction to surface incidents before they escalate. The platform's [SRE Agent](https://learn.microsoft.com/en-us/azure/) (in the Microsoft foundation) is the canonical example.

### 4.4 The 2026 Reframing: Safety Nets for Agents

For agent workloads, Safety Nets re-express as:

- **Agent drift detection.** Continuous evaluation of agent outputs against the agent's declared specification. When outputs deviate (agent starts producing inconsistent results, agent's cost-per-task drifts upward, agent's success rate drops), the Safety Net surfaces the drift and either auto-rolls-back to the prior version or triggers a manual review.
- **Loop detection.** When an agent's action sequence repeats N times without progress, the Safety Net aborts the session and escalates. This is the [LangChain pattern](https://blog.langchain.com/improving-deep-agents-with-harness-engineering/) that produced the rank-30-to-rank-5 jump on Terminal Bench 2.0 in early 2026.
- **Cost circuit breakers.** When an agent's spend exceeds threshold, the Safety Net terminates the session. This is the agent-specific complement to the Guardrail-side cost ceiling: Guardrails prevent budgets from being committed; Safety Nets terminate sessions in flight.
- **Output validation as continuous reconciliation.** The agent produces outputs; the Safety Net continuously validates them against declared specifications and rolls back outputs that fail validation. This is the agent-side analog of GitOps reconciliation.

The Safety Nets layer is where most of the agent-specific platform work concentrates in 2026. Guardrails are well-understood (policy-as-code is mature); Manual Review is well-understood (Change Advisory Boards are mature). The agent-specific maturity frontier is in autonomous detection and recovery for agent-driven failures.

---

## 5. Manual Review: The Accountability Structure of the Platform

### 5.1 What a Manual Review Workflow Is

A Manual Review Workflow is an explicit human-in-the-loop checkpoint for decisions that should not be automated. Review workflows are the *accountability structure* of the platform.

In an AI-native platform, review workflows are *more*, not less, important than in a human-only platform, because automation now happens faster than human judgment can keep up unless judgment is deliberately inserted. The role of Manual Review is to ensure that the deliberate insertion happens at the right boundaries.

### 5.2 The Four Surfaces of Manual Review

**Environment promotion gates.** Dev environments auto-sync from Git; staging environments are gated (a human approves promotion); production environments require explicit approval, often with multiple approvers. The gates are GitOps configuration: the Argo CD or Flux sync policy is environment-specific.

**Change Advisory Board flows.** For high-impact changes (production database migrations, infrastructure-quota expansions, security-sensitive changes), the platform requires a Change Advisory Board approval before the change is applied. The Change Advisory Board is implemented as a GitHub Issues template with a labeled approval workflow.

**Cost gates.** Changes that exceed a cost threshold (deploying new infrastructure that will spend more than $X per month, or invoking a model whose per-call cost exceeds threshold) require approval before application. Cost gates are implemented as GitHub Actions checks against the cost-impact analysis the CI pipeline produces.

**AI agent promotion gates.** Before an agent's permission scope is expanded (the agent gains access to a new data source or a new action), a human approves the expansion. This is the agent-specific Manual Review surface and the most operationally critical for AI-native platforms.

### 5.3 The Discipline of Strategic Friction

Manual Review introduces friction. The friction is intentional. The discipline is to introduce friction *only at the boundaries that warrant it* and *to remove friction everywhere else*.

A platform that requires manual approval for every change is a platform that has not invested in Guardrails and Safety Nets; it is using Manual Review as a substitute for the other pillars. This produces brittle delivery: every change is slow because every change is reviewed.

A platform that requires no manual approval for any change is a platform that has not identified the boundaries that warrant accountability; it is treating every change as low-risk. This produces unaccountable delivery: high-risk changes get deployed at the same speed as routine changes, and audit cannot reconstruct who decided what.

The mature platform is selective. Routine changes flow through Guardrails and Safety Nets without manual review. High-impact changes hit a Manual Review gate. The platform team continuously refines the boundary between "routine" and "high-impact" based on incident data.

### 5.4 The Auditor Agent Pattern

In 2026, the Manual Review surface is augmented by what the [CNCF 2026 Predictions](https://tag-app-delivery.cncf.io/whitepapers/platform-eng-maturity-model/) calls the **auditor agent** pattern. Rather than requiring human reviewers to gather logs, architecture diagrams, and audit trails before they can decide, the auditor agent assembles a complete compliance package automatically. Human reviewers spend their time making the decision, not gathering the information.

The auditor agent reads the proposed change, retrieves the relevant context (service catalog entry, prior deployment history, incident history, cost-impact analysis, policy compliance status), assembles a structured review packet, and presents it to the human reviewer. The reviewer's cognitive load is reduced; the reviewer's accountability is preserved.

This pattern is one of the most-effective applications of agent-augmented governance in 2026. It is also a clean example of how AI augments rather than replaces the four pillars.

---

## 6. The Pillars as the AI Control Plane

### 6.1 The Re-Expression

The four pillars were originally designed for human-driven delivery. In 2026, they are being re-expressed as the control plane for AI-driven delivery. The re-expression is precise:

| Pillar | Original Purpose (Human-Driven) | 2026 Re-Expression (AI-Driven) |
|--------|----------------------------------|--------------------------------|
| Golden Paths | Templates for instantiating services | Templates for instantiating agents (an agent is a service) |
| Guardrails | Policies humans must satisfy at deployment | Policies agents must satisfy at runtime (permission scope, data access, output filtering) |
| Safety Nets | Reconciliation loops for application drift | Reconciliation loops for agent drift (output validation, loop detection, cost breakers) |
| Manual Review | Approval workflows for high-impact deploys | Approval workflows for agent capability expansion |

The re-expression is what allows a platform that has implemented the four pillars for human developers to govern agents without rebuilding the platform. The agent-specific work is *additive* on top of the existing pillar implementations, not a parallel new platform.

### 6.2 The Critical Property of the Re-Expression

The critical property is that the four pillars apply *uniformly* to humans and agents. There is not a "human platform" and an "agent platform"; there is a single platform with two classes of users (human and agent) governed by the same four pillars.

This uniformity is the structural reason why platform-mature organizations are deploying agents at 8x the rate of platform-immature organizations (the IDC 73/27 gap from chapter 01). The platform-mature organizations did not have to build a new platform for agents; they had to extend the four pillars they already had.

### 6.3 What the Re-Expression Requires

To re-express the four pillars for AI, three additions are required to the platform implementation:

**An Agent Identity model.** [Microsoft Entra Agent ID](https://learn.microsoft.com/en-us/entra/) provides this. Each agent has a managed identity, with tokens, scopes, and audit trail.

**An Agent Lifecycle model.** Agent 365 in the Microsoft foundation provides this. Agents have lifecycle (provisioned, active, deprecated, retired), with the platform managing transitions.

**An Agent Observability model.** Trajectory capture (covered in chapter 02) provides this. Every agent session produces a trajectory record that captures the agent's actions, costs, and outputs.

These three additions are the new platform primitives that 2026 platform teams must add to their existing four-pillar implementation. Both Three Horizons and Open Horizons ship them as foundation components (chapters 06 and 07).

### 6.4 What the Re-Expression Does Not Require

The re-expression does *not* require:

- A new IDP (Backstage and RHDH already serve agents as first-class users).
- A new policy-as-code engine (OPA Gatekeeper, Kyverno, and Azure Policy already serve agents).
- A new GitOps controller (Argo CD and Flux already reconcile agent configurations).
- A new observability stack (OpenTelemetry, Prometheus, Grafana already capture agent metrics).
- A new Change Advisory process (the existing GitHub Issues templates already serve agent-promotion approvals).

The platform that already has the four pillars in place needs only the three agent-specific additions to be ready for agent-driven workloads. The platform that does not have the four pillars in place is rebuilding the platform from scratch under the pressure of an active AI program. The cost differential is large.

---

## 7. Pillar Maturity and How to Measure It

### 7.1 The Five Levels Per Pillar

Each pillar progresses through five maturity levels, mapped to the [CNCF Platform Engineering Maturity Model](https://tag-app-delivery.cncf.io/whitepapers/platform-eng-maturity-model/).

**Provisional.** Ad-hoc implementation by individual teams. The pillar exists, but the implementation is per-team and not coordinated.

**Operational.** A platform team has consolidated the implementation. The pillar is operated centrally but is not yet productized (developers know the pillar exists but cannot self-serve through it).

**Scalable.** The pillar is productized. Developers self-serve through a stable interface (Backstage scaffolder, RHDH catalog, Argo CD console). The pillar has documented SLAs.

**Optimizing.** The pillar produces metrics that drive its own improvement. The platform team measures pillar adoption, invokes per-pillar improvement sprints, and tracks pillar effectiveness over time.

**AI-Native.** The pillar is consumed by agents at scale. Golden Paths are invoked thousands of times per week by both humans and agents. Guardrails govern agent traffic uniformly. Safety Nets reconcile agent drift. Manual Review handles agent capability expansion.

### 7.2 Per-Pillar Metrics

| Pillar | Operational Metric | Optimizing Metric | AI-Native Metric |
|--------|---------------------|-------------------|-------------------|
| Golden Paths | Number of paths available | Path invocation rate; path freshness (days since last update) | Agent-invoked path rate; LLM-generated path proposal rate |
| Guardrails | Number of policies enforced | Policy violation rate; policy update cadence | Agent-policy enforcement rate; agent permission-scope drift rate |
| Safety Nets | Reconciliation loop coverage | MTTR; recovery success rate | Agent drift detection rate; loop detection trigger rate |
| Manual Review | Number of gated changes per month | Average time to review; reviewer cognitive load | Agent capability expansion rate; auditor-agent assist rate |

The metrics surface in the platform's observability dashboards. The platform team tracks them weekly; the platform leadership tracks them monthly; the platform program tracks them quarterly.

### 7.3 The Maturity Trap

A common failure mode in pillar maturity assessments is to score each pillar in isolation and average the result. This produces a misleadingly high overall score when one pillar is dramatically under-built.

The honest maturity score is the *minimum* across the four pillars, not the average. A platform that is AI-Native on Golden Paths but Provisional on Guardrails is a Provisional platform. The weakest pillar determines the platform's effective maturity because the weakest pillar is the failure mode that AI will amplify.

This is consistent with the stacking rule from chapter 02: layers cannot be skipped. Within the Platform layer itself, pillars cannot be skipped. The four-pillar maturity is a vector, not a scalar.

---

## 8. Common Failure Patterns Per Pillar

The following table surfaces the failure patterns that the playbook has observed repeatedly in client engagements, organized by the pillar that is failing.

| Pillar | Common Failure | Symptom | Remediation |
|--------|----------------|---------|-------------|
| Golden Paths | Paths exist but are not maintained | Developers route around paths because they are stale | Productize the paths; assign owners; track freshness as a platform metric |
| Golden Paths | Too many paths, none of them opinionated | Developers cannot decide which to use; team-by-team divergence | Cull the path inventory; consolidate to fewer, more-opinionated paths |
| Guardrails | Policies enforced as warnings, not rejections | Violations are flagged but not blocked; backlog grows indefinitely | Move to admission-time enforcement; allow time-bounded exceptions but reject by default |
| Guardrails | Policies authored centrally, applied universally | High-context teams cannot proceed because policies are too generic | Implement policy hierarchies; allow per-team overrides with central audit |
| Safety Nets | Observability captures but does not act | Dashboards show problems; no autonomous recovery | Implement alerting, automated remediation, and progressive-delivery guardrails |
| Safety Nets | Reconciliation runs but is bypassable | GitOps drift is corrected, but humans push direct changes that escape the loop | Make Git the only sanctioned write surface; lock direct cluster access |
| Manual Review | Gates everything | Delivery is uniformly slow; review cycles are exhausting | Audit the gate inventory; remove gates that do not differentiate routine from high-impact |
| Manual Review | Gates nothing | High-impact changes flow at the same speed as routine changes | Add gates for production data, regulated workloads, and agent capability expansion |

The diagnostic value of organizing failures by pillar is that it produces specific remediation paths. A platform team that is told "your platform is failing" cannot act on the statement; a platform team that is told "your Guardrails are at Provisional level because policies are warnings rather than rejections" can.

---

## 9. How the Four Pillars Are Materialized in the Two Accelerators

The crosswalk below shows how each pillar materializes in Three Horizons (Red Hat) versus Open Horizons (open source). Chapters 06 and 07 cover each accelerator in operational depth; this section gives the comparative view.

| Pillar | Three Horizons (Red Hat) | Open Horizons (OSS) |
|--------|--------------------------|----------------------|
| Golden Paths | RHDH software templates with OpenShift Pipelines and OpenShift GitOps integration | Backstage scaffolder templates with GitHub Actions and Argo CD/Flux integration |
| Guardrails | Red Hat Advanced Cluster Security + Azure Policy; Workload Identity via OpenShift; signed-image admission | OPA Gatekeeper or Kyverno + Azure Policy; Workload Identity via AKS; Sigstore signing + admission |
| Safety Nets | OpenShift GitOps reconciliation + OpenShift observability + Velero + Red Hat Advanced Cluster Manager | Argo CD or Flux reconciliation + Prometheus/Grafana + Velero + progressive-delivery defaults |
| Manual Review | OpenShift GitOps environment-specific sync; Change Advisory via GitHub Issues; AI agent promotion via Microsoft Agent Governance Toolkit | Argo CD/Flux environment-specific sync; Change Advisory via GitHub Issues; AI agent promotion via Microsoft Agent Governance Toolkit |

The Microsoft foundation components (Azure Policy, Workload Identity, GitHub Issues for CAB, Microsoft Agent Governance Toolkit) appear in both columns because they are shared across both accelerators. The differentiation is in the IDP, the cluster, the GitOps controller, and the supply-chain security stack.

The structural property both accelerators share: **all four pillars are at the same level of maturity in both accelerators**. Neither accelerator has a stronger pillar at the cost of a weaker one. Both ship the four pillars wired together at deploy time, with no "configure later" steps for the customer. This is a deliberate property of the accelerator design philosophy: the customer adopts an opinionated foundation and customizes from there, rather than assembling the foundation from raw components.

---

## 10. Synthesis: The Pillars as Operating System

The chapter started with four pillars. It ends with an operating-system metaphor.

The four pillars are not a checklist. They are an integrated operating system for the platform. Golden Paths are the user-facing interface; Guardrails are the safety interlocks; Safety Nets are the immune system; Manual Review is the accountability structure. Like an operating system, the four components only work together. Removing one produces a system that is brittle, exhausting, or unaccountable.

The 2026 reframing does not change the structure. It extends the user base. The same operating system that served human developers now serves agents as well. The agent-specific additions (Entra Agent ID, Agent 365, trajectory capture) are platform primitives that connect into the existing pillar implementations.

The implication for the platform team's roadmap is direct. The work is *not* to build a new agent-specific platform. The work is to:

1. Bring the four pillars to maturity for human-driven workloads.
2. Add the three agent-specific platform primitives (identity, lifecycle, observability).
3. Re-express the pillars in agent-aware terms (permission scopes, output filters, drift detection, capability-expansion gates).

That is the foundation for the rest of the playbook. Chapter 04 covers the failure modes that appear when one or more pillars is missing. Chapter 05 covers the Dual Mandate that platform teams take on as they execute against the four pillars. Chapters 06 and 07 cover the two accelerators that materialize the pillars.

The single takeaway: **build the four pillars before you scale agents**. Every other choice this playbook covers is downstream of this one.

---

## References

- [CNCF Platform Engineering Maturity Model](https://tag-app-delivery.cncf.io/whitepapers/platform-eng-maturity-model/). Cloud Native Computing Foundation, 2025-2026.
- [Backstage Software Templates (Scaffolder)](https://backstage.io/docs/features/software-templates/). Linux Foundation, 2026.
- [Red Hat Developer Hub Documentation](https://developers.redhat.com/rhdh). Red Hat, 2026.
- [Open Policy Agent Gatekeeper](https://open-policy-agent.github.io/gatekeeper/). OPA Project, 2026.
- [Kyverno Policy Engine](https://kyverno.io/). Kyverno Project, 2026.
- [Azure Policy Documentation](https://learn.microsoft.com/en-us/azure/governance/policy/overview). Microsoft, 2026.
- [SLSA Supply-chain Levels for Software Artifacts](https://slsa.dev/). Linux Foundation, 2026.
- [Sigstore Documentation](https://www.sigstore.dev/). Linux Foundation, 2026.
- [ArgoCD Documentation](https://argo-cd.readthedocs.io/). Argo Project, 2026.
- [Flux Documentation](https://fluxcd.io/). Flux Project, 2026.
- [Velero Documentation](https://velero.io/). Velero Project, 2026.
- [Microsoft Entra Agent ID](https://learn.microsoft.com/en-us/entra/). Microsoft, 2026.
- LangChain. (2026, February 17). [Improving Deep Agents with harness engineering](https://blog.langchain.com/improving-deep-agents-with-harness-engineering/).
- Silva, P. (2026). *The Context Platform Stack: Platform Engineering as Governance Middleware*, chapter 2 v1.3.0. Microsoft.

---

Paula Silva, Software Global Black Belt
*Pioneering software development with AI and Agentic DevOps*

paulasilva@microsoft.com
