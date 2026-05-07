---
title: "Option A — Three Horizons: The Red Hat Path to an Agentic DevOps Platform"
description: "Operational deep-dive on the Three Horizons accelerator: Red Hat Developer Hub on Azure Red Hat OpenShift, OpenShift Pipelines, OpenShift GitOps, Red Hat Trusted Application Pipeline, and the joint Microsoft-Red Hat support model."
author: "Paula Silva"
role: "Software Global Black Belt"
contact: "paulasilva@microsoft.com"
date: "2026-05-05"
version: "1.0.0"
status: "draft"
locale: "en"
brand: "Agentic DevOps"
tags: [three-horizons, red-hat, rhdh, aro, openshift, openshift-pipelines, openshift-gitops, red-hat-trusted-application-pipeline, lightspeed]
---

# Chapter 06: Option A — Three Horizons (Red Hat)

> **Argument.** Three Horizons is the accelerator for clients with prior Red Hat investment, commercial-support requirements, or a vendor strategy that prefers Red Hat Enterprise plus Microsoft as a joint commercial owner of the foundation. The Internal Developer Platform is Red Hat Developer Hub (RHDH), the cluster is Azure Red Hat OpenShift (ARO), the delivery substrate is OpenShift Pipelines plus OpenShift GitOps, the supply-chain security is Red Hat Trusted Application Pipeline, and the AI-assist layer is Red Hat Lightspeed (as it matures) plus GitHub Copilot Enterprise. Three Horizons materializes all four CNCF Pillars and both mandates of the Dual Mandate, riding the same Microsoft foundation as Open Horizons. This chapter goes deep on the Three Horizons stack, when to choose it, and how to deploy it.

---

## Table of Contents

1. [What Three Horizons Is](#1-what-three-horizons-is)
2. [The Stack at a Glance](#2-the-stack-at-a-glance)
3. [Red Hat Developer Hub (RHDH) as the IDP](#3-red-hat-developer-hub-rhdh-as-the-idp)
4. [Azure Red Hat OpenShift (ARO) as the Cluster](#4-azure-red-hat-openshift-aro-as-the-cluster)
5. [OpenShift Pipelines and OpenShift GitOps](#5-openshift-pipelines-and-openshift-gitops)
6. [Red Hat Trusted Application Pipeline](#6-red-hat-trusted-application-pipeline)
7. [Red Hat Lightspeed and the AI-Assist Layer](#7-red-hat-lightspeed-and-the-ai-assist-layer)
8. [The Three Horizons Maturity Model](#8-the-three-horizons-maturity-model)
9. [Mapping Three Horizons to the Four Pillars](#9-mapping-three-horizons-to-the-four-pillars)
10. [Mapping Three Horizons to the Dual Mandate](#10-mapping-three-horizons-to-the-dual-mandate)
11. [Commercial Structure and Joint Support](#11-commercial-structure-and-joint-support)
12. [Client Profiles and LATAM Examples](#12-client-profiles-and-latam-examples)
13. [Deployment Sequence and Operational Considerations](#13-deployment-sequence-and-operational-considerations)
14. [When Three Horizons Is the Right Choice](#14-when-three-horizons-is-the-right-choice)
15. [References](#references)

---

## 1. What Three Horizons Is

Three Horizons is a customer-deployed accelerator that materializes the AI-Native Enterprise Pyramid (chapter 02) and the CNCF Four Pillars (chapter 03) on the Red Hat developer-platform stack running on Azure. It is engineered for clients who have made commitments to Red Hat technology (RHEL, OpenShift, Ansible Automation Platform) and who want a single commercial relationship that spans the application platform (Red Hat) and the cloud and AI foundation (Microsoft).

The accelerator is named after the maturity model it operationalizes: Horizon 1 (Optimize Present), Horizon 2 (Emerging Capabilities), Horizon 3 (Transform Future). The three horizons are the maturity ladder; the accelerator is the executable codification of the ladder on the Red Hat stack.

Three Horizons is **not a Red Hat product** in the SKU sense. It is a reference architecture and a customer-deployment pattern that combines existing Red Hat and Microsoft products into an integrated, opinionated foundation. The components are independently licensed and supported; the accelerator is the composition.

The accelerator's value proposition has three components:

**Speed.** A green-field deployment that would take 9-18 months to assemble from raw components is compressed to 90-180 days because the accelerator ships the integration patterns, the Golden Path catalog, the supply-chain wiring, the GitOps configuration, and the agent infrastructure pre-integrated. The customer customizes; the customer does not assemble.

**Commercial coherence.** Red Hat and Microsoft operate Three Horizons as a joint strategic partnership. The customer has one foundation deployment with two world-class commercial owners. Support, licensing, and roadmap conversations are unified rather than fragmented across multiple vendors.

**Regulatory and audit posture.** The Red Hat stack carries FedRAMP, FIPS, Common Criteria, and other regulatory certifications that some sectors (financial services under BACEN, government, defense) treat as procurement-blocking criteria. Three Horizons inherits this posture; the customer does not negotiate it.

The remainder of this chapter goes deep on each component, the maturity model, and the procurement decision.

---

## 2. The Stack at a Glance

The Three Horizons stack is opinionated. Every component is named, and every component is integrated with the others at deploy time. The stack:

| Layer | Component | Role |
|-------|-----------|------|
| Internal Developer Platform | Red Hat Developer Hub (RHDH) | Backstage-derived IDP with Red Hat enterprise plugins, hardening, and support |
| Cluster | Azure Red Hat OpenShift (ARO) | Managed OpenShift on Azure, jointly operated by Microsoft and Red Hat SRE |
| Native CI/CD | OpenShift Pipelines (Tekton) | Cloud-native CI/CD using Kubernetes-native pipeline objects |
| GitOps | OpenShift GitOps (Argo CD) | Continuous reconciliation of cluster state to declared state in Git |
| Service Mesh | OpenShift Service Mesh (Istio) | mTLS, traffic management, and policy at the network layer |
| Supply Chain Security | Red Hat Trusted Application Pipeline (TAP) | SBOMs, signing, attestation, and policy enforcement across the build pipeline |
| Multi-Cluster Management | Red Hat Advanced Cluster Manager (ACM) | Centralized policy, observability, and governance across clusters |
| Multi-Cluster Security | Red Hat Advanced Cluster Security (ACS) | Runtime security, vulnerability management, network policy across clusters |
| AI Assistance | Red Hat Lightspeed + GitHub Copilot Enterprise | Platform-aware AI assistance across the stack |
| Identity | Microsoft Entra ID + Entra Agent ID | Human and agent identity, federated with OpenShift identity providers |
| AI Platform | Microsoft Foundry | Model gateway, evaluation, observability for AI workloads |
| Agent Runtime | Microsoft Foundry Agent Service + Microsoft Agent Framework 1.0 | Managed agent execution with platform identity and observability |
| Source Control and DevOps | GitHub Enterprise Cloud | Source of truth for code, configuration, policy, and Golden Path templates |
| Secrets | Azure Key Vault + OpenShift secrets | Cloud-native and cluster-native secret stores, federated |
| Observability | Azure Monitor + OpenShift Observability + Foundry Observability | Unified telemetry across application, platform, and AI layers |
| Compliance | Azure Policy + Red Hat ACS + Microsoft Purview | Policy-as-code at cloud, cluster, and data layers |

The stack is engineered to satisfy the regulatory requirements of LATAM-specific regimes (LGPD in Brazil, BACEN in financial services, ANEEL in energy, ANS in healthcare, sector-specific compliance in Mexico, Chile, Colombia). Each component carries its own certification and audit posture; the stack composes them.

---

## 3. Red Hat Developer Hub (RHDH) as the IDP

### 3.1 What RHDH Is

[Red Hat Developer Hub](https://developers.redhat.com/rhdh) is Red Hat's enterprise-supported distribution of Backstage. It includes the upstream Backstage core plus Red Hat-specific plugins, hardening, and the Red Hat Enterprise support contract. RHDH is the Internal Developer Platform that materializes the Golden Paths pillar (chapter 03) in Three Horizons.

The relationship to upstream Backstage is the same as the relationship between Red Hat Enterprise Linux and upstream Linux: same kernel, hardened packaging, enterprise support, longer support lifecycle. RHDH inherits Backstage's plugin ecosystem and adds Red Hat-curated plugins for OpenShift, ACM, ACS, and the Red Hat developer toolchain.

### 3.2 What RHDH Adds Over Upstream Backstage

The differentiating properties of RHDH compared to upstream Backstage:

- **Curated plugin set.** Red Hat tests, hardens, and supports a specific set of plugins (typically 30-40 plugins covering the most-common enterprise integration points). Upstream Backstage has a larger plugin ecosystem (100+ plugins), but quality varies; RHDH's curated set is enterprise-supported.
- **OpenShift-native plugins.** Plugins that integrate with OpenShift, Pipelines, GitOps, ACM, and ACS surface OpenShift-specific information in the Backstage catalog and templates.
- **Software Templates as the Golden Path surface.** RHDH's [software templates](https://developers.redhat.com/rhdh) are the same as Backstage scaffolder templates with Red Hat conventions and hardening.
- **Enterprise support.** Red Hat provides 24x7 support for RHDH, including escalation paths, security patching, and version-upgrade assistance. Upstream Backstage does not have a comparable support contract.
- **Longer support lifecycle.** RHDH releases align with Red Hat's enterprise support cadence, with multiple supported versions in flight at any time. Upstream Backstage releases more frequently and supports fewer versions.

For clients in regulated industries, the support contract and the support lifecycle are decisive procurement criteria. The Backstage upstream model (community-supported, faster-moving) is operationally preferable for some teams; the RHDH model (vendor-supported, slower-moving) is preferable for others. Chapter 08 covers the choice.

### 3.3 The Software Template Catalog

RHDH's Software Templates are the equivalent of Backstage scaffolder templates and serve the same function. The Three Horizons accelerator ships an opinionated software template catalog organized by the H1/H2/H3 maturity model:

**Horizon 1 (Optimize Present) Templates.** Foundation patterns every team needs:

- `cicd-baseline` — Tekton-based CI/CD pipeline with branch protection and policy gates
- `security-baseline` — OpenShift-native security policy (SCCs, NetworkPolicies, RBAC) configured for the team
- `documentation-site` — TechDocs site published through RHDH
- `web-application` — Full-stack web application on OpenShift with route, observability, and health checks
- `microservice-baseline` — Microservice with service mesh registration and golden observability
- `infrastructure-provisioning` — Terraform module scaffolding wired to OpenShift GitOps

**Horizon 2 (Emerging Capabilities) Templates.** Advanced application patterns assuming H1 is in place:

- `api-gateway` — 3scale API Management or Azure API Management configuration as code
- `api-microservice` — RESTful API service with OpenAPI, mTLS via service mesh, rate limiting
- `batch-job` — Tekton-based batch processing with retries, DLQ, alerting
- `data-pipeline` — ETL with Red Hat Data Foundation or Databricks, Purview lineage emission
- `event-driven-microservice` — Knative Eventing or Event Hubs integration with outbox pattern
- `gitops-deployment` — OpenShift GitOps application with environment promotion
- `microservice-complete` — Full-feature microservice with every platform capability enabled
- `reusable-pipeline` — Tekton reusable pipeline library
- `ado-to-github-migration` — Azure DevOps to GitHub migration following Microsoft Playbook

**Horizon 3 (Transform Future) Templates.** AI / ML / Agentic templates assuming H1 and H2 are in place:

- `foundry-agent` — Microsoft Foundry Agent Service deployment with identity, observability, evaluation
- `sre-agent-integration` — SRE automation agent wired to incident management
- `mlops-pipeline` — Complete ML pipeline (data → train → evaluate → deploy → monitor) on Red Hat OpenShift AI
- `multi-agent-system` — Multi-agent orchestration with shared state, routing, guardrails
- `copilot-extension` — GitHub Copilot extension scaffolding (skill, agent, MCP)
- `rag-application` — RAG application with vector store, evaluation, observability
- `ai-evaluation-pipeline` — Model and agent evaluation framework

The exact template count varies by Three Horizons version (the v4.0.0 reference includes approximately 22 templates; subsequent versions add new templates as H3 patterns mature). The structural property is the H1/H2/H3 organization, which is identical to Open Horizons.

### 3.4 The Catalog

RHDH's Software Catalog is the registry of services, components, APIs, and resources in the enterprise. The catalog is populated through automated discovery (RHDH plugins emit events into the catalog when they detect relevant resources) and through declarative entries (developers register components in YAML files alongside their code).

For agent workloads, the catalog is the discovery surface: an agent that needs to call a service queries the catalog, finds the service entry, retrieves the API spec, and uses it. The catalog is the operational expression of the Context layer (chapter 02) for service-level information.

---

## 4. Azure Red Hat OpenShift (ARO) as the Cluster

### 4.1 What ARO Is

[Azure Red Hat OpenShift](https://learn.microsoft.com/en-us/azure/openshift/) is a managed OpenShift service jointly operated by Microsoft and Red Hat. The cluster is provisioned, monitored, patched, and SLA'd by the joint engineering organization; the customer operates workloads on the cluster but does not operate the cluster control plane.

The joint operational model is one of the differentiating properties of Three Horizons. The customer has a single support relationship that spans cluster operation (Microsoft and Red Hat SRE), cluster software (Red Hat product engineering), and cloud foundation (Microsoft Azure).

### 4.2 ARO vs Upstream OpenShift on Azure

ARO differs from running OpenShift Container Platform (OCP) on Azure VMs in three important ways:

- **Managed control plane.** Microsoft operates the API server, etcd, and control-plane components. The customer does not configure or patch these. Operational complexity drops.
- **Joint SLA.** Microsoft and Red Hat jointly commit to the cluster SLA (typically 99.95%). The SLA covers cluster availability, including control-plane availability, which is not the case for self-operated OCP.
- **Joint billing and support.** A single bill from Microsoft covers the cluster; a single support relationship covers issues across Azure and Red Hat. Self-operated OCP requires separate support relationships.

For customers with dedicated Red Hat operations teams, self-operated OCP can be a reasonable choice. For customers who prefer to focus on workload operation rather than platform operation, ARO is usually the right answer.

### 4.3 ARO and the Microsoft Foundation

ARO integrates natively with the Microsoft foundation components covered in chapter 00:

- **Entra ID** is the cluster's identity provider; cluster RBAC is governed by Entra groups.
- **Workload Identity** issues short-lived federated credentials to workloads on ARO; long-lived service credentials are unnecessary.
- **Azure Monitor** ingests cluster telemetry alongside application telemetry, producing a unified observability plane.
- **Azure Policy** applies governance policies at the cluster boundary, enforced by Azure Policy add-on for ARO.
- **Defender for Cloud** provides runtime threat detection on ARO clusters.

These integrations are pre-configured in the Three Horizons accelerator. The customer's setup is governed by Terraform modules that provision both the ARO cluster and the Azure-side integrations.

### 4.4 LATAM Region Availability

ARO is available in LATAM regions including Brazil South. For data-residency sensitive workloads, ARO in Brazil South provides a fully in-region deployment: the cluster, the workloads, the foundation services (Entra, Foundry, Key Vault, Monitor) all run in Brazil. This is operationally important for clients subject to LGPD, BACEN, or sector-specific data-residency requirements.

For workloads where regional data-residency is the gating procurement criterion, ARO availability is often the deciding factor between Three Horizons and alternative paths.

---

## 5. OpenShift Pipelines and OpenShift GitOps

### 5.1 OpenShift Pipelines (Tekton)

[OpenShift Pipelines](https://docs.openshift.com/pipelines/latest/about/about-pipelines.html) is Red Hat's distribution of [Tekton](https://tekton.dev/), the cloud-native CI/CD project. Pipelines runs as Kubernetes-native pipeline objects, with each pipeline step executing as a pod in the cluster.

The structural property of Tekton is that pipelines are Kubernetes resources, not external orchestrator state. A pipeline is a YAML object in the cluster's API; its execution is observable through the standard Kubernetes API surface. This is operationally useful: the same observability stack that monitors workloads also monitors pipelines.

In Three Horizons, OpenShift Pipelines is the native CI/CD substrate. Application teams may also use GitHub Actions for some workflows (typically code-side workflows that benefit from GitHub Actions's larger ecosystem), but the platform-defined CI/CD lives in Pipelines. The platform team's Golden Paths generate Tekton pipeline definitions as part of the project scaffold.

### 5.2 OpenShift GitOps (Argo CD)

[OpenShift GitOps](https://docs.openshift.com/gitops/latest/understanding_openshift_gitops/about-redhat-openshift-gitops.html) is Red Hat's distribution of [Argo CD](https://argo-cd.readthedocs.io/), the cloud-native GitOps controller. GitOps is the deployment model in Three Horizons; cluster state is declared in Git, and Argo CD reconciles the cluster to match the declared state continuously.

The reconciliation model is one of the foundations of the Safety Nets pillar (chapter 03). When cluster state drifts from the declared state (because a manual change was made, because a controller error occurred, because an operator was modified), Argo CD detects the drift and re-applies the declared state. The cluster self-heals.

Three Horizons configures Argo CD with environment-specific sync policies. The dev environment auto-syncs continuously; the staging environment requires explicit sync (a human approval triggers each sync); the production environment requires explicit sync with multiple approvers. This is the operational expression of the Manual Review pillar at the deployment boundary.

### 5.3 The Pipelines + GitOps Pattern

The combined pattern is:

1. A developer or agent commits code to a Git repository.
2. OpenShift Pipelines builds, tests, and validates the change.
3. OpenShift Pipelines updates the GitOps repository (a separate repository or branch) with the new image reference.
4. OpenShift GitOps detects the GitOps repository update and reconciles the cluster.
5. The cluster's new state is observed; if it diverges from health expectations, Safety Nets respond.

This pattern has two important properties. First, the production cluster has no direct write surface; everything flows through Git. This is the structural prevention for the most common production-incident pattern (an unauthorized direct change to the cluster). Second, every change is auditable in Git history; the platform's compliance posture is satisfied by Git's existing audit primitives.

### 5.4 The Pattern's Limitations

The OpenShift Pipelines + OpenShift GitOps pattern is opinionated and not universal. Workloads that require ephemeral or rapid-iteration deployment (some development, some experimentation) may find the GitOps cycle slow. Three Horizons addresses this by providing a development-environment escape hatch (developers can deploy directly to dev clusters with a different policy) while requiring the GitOps pattern for any environment with non-developer access.

The pattern also requires discipline around Git repository structure. Multi-tenant environments with many teams produce GitOps repositories with thousands of applications; managing the application-repository relationship at scale requires platform investment. The Three Horizons accelerator includes opinionated repository structure conventions to address this.

---

## 6. Red Hat Trusted Application Pipeline

### 6.1 What TAP Is

[Red Hat Trusted Application Pipeline](https://www.redhat.com/en/products/trusted-application-pipeline) is Red Hat's supply-chain security stack, integrated with OpenShift Pipelines. TAP provides:

- **SBOM generation** at every build step. Each artifact (image, binary, package) has a complete software bill of materials documenting all dependencies.
- **Signing and attestation.** Every artifact is signed; every build is attested with provenance information ([SLSA](https://slsa.dev/) compliant).
- **Vulnerability scanning** of dependencies and produced artifacts.
- **Policy enforcement** rejecting artifacts that fail security policy at build time, deploy time, or runtime.

TAP is the materialization of the supply-chain dimension of the Guardrails pillar in Three Horizons.

### 6.2 TAP and the CrowdStrike Regression

The CrowdStrike 2026 finding (chapter 04) about the 38% increase in exploitable vulnerabilities is structurally addressed by TAP. The mechanism:

- TAP scans dependencies at build time and rejects builds that include known-vulnerable components above policy threshold.
- TAP signs every artifact; admission controllers reject unsigned artifacts at deploy time.
- TAP attests provenance; admission controllers reject artifacts whose provenance does not match the sanctioned build pipeline.
- TAP generates SBOMs; security operations can continuously verify that deployed artifacts match the expected manifest.

These four mechanisms together close the gap that the CrowdStrike finding identifies. Three Horizons's adoption of TAP as a default is one of the differentiating properties for clients in regulated industries.

### 6.3 TAP and Joint Operations with GitHub Advanced Security

GitHub Advanced Security (GHAS) provides complementary capability at the source-code layer (secret scanning, code scanning with CodeQL, dependency review). TAP provides at the build and deploy layer. The joint pattern is GHAS at commit, TAP at build, ACS at runtime.

The Three Horizons accelerator wires GHAS and TAP together: GHAS signals into the GitOps repository and into Pipelines. A vulnerability detected at GHAS can trigger a re-build through Pipelines and a re-signing through TAP. The supply-chain feedback loop closes.

---

## 7. Red Hat Lightspeed and the AI-Assist Layer

### 7.1 What Lightspeed Is

[Red Hat Lightspeed](https://www.redhat.com/en/topics/ai/red-hat-lightspeed) is Red Hat's AI-assist layer for the Red Hat product portfolio. Lightspeed surfaces AI assistance in OpenShift, Ansible, RHEL, and other Red Hat tools. As of the 2026 reference, Lightspeed is in active development and roll-out; specific capabilities vary across products.

In Three Horizons, Lightspeed serves as the platform-side AI-assist layer that complements GitHub Copilot Enterprise on the developer side. Lightspeed targets operators (cluster administrators, security operators, RHEL system administrators); Copilot targets developers.

### 7.2 The Lightspeed + Copilot Pattern

The complementary pattern:

- **GitHub Copilot Enterprise** assists the developer at the source-code layer: in-IDE code completion, Copilot Chat for explanation and refactoring, Copilot Workspaces for end-to-end task automation, GitHub Copilot Coding Agent for multi-session work.
- **Red Hat Lightspeed** assists the operator at the platform layer: cluster operations assistance, Ansible playbook generation, security policy explanation, RHEL system administration assistance.

In a mature Three Horizons deployment, the developer interacts with Copilot in the IDE and Lightspeed in the cluster console (where applicable). The two surfaces are not integrated upstream; they are integrated by convention in the Three Horizons accelerator.

### 7.3 Microsoft Foundry Agent Service for Custom Agents

For custom agent workloads (agents the customer builds for their own domains), Three Horizons uses Microsoft Foundry Agent Service. This is the same agent runtime used in Open Horizons; chapter 07 covers it in operational depth. The structural property is that custom agents in Three Horizons run on the Microsoft foundation, not on a Red Hat-specific agent runtime.

This is a deliberate design choice. Red Hat has not (as of 2026) released a competitor to Microsoft Foundry Agent Service; the agent runtime layer is part of the shared Microsoft foundation that does not vary between accelerators.

---

## 8. The Three Horizons Maturity Model

### 8.1 The Model

Three Horizons names a maturity model that organizes the platform's evolution into three phases:

| Horizon | Name | Focus | Time Frame |
|---------|------|-------|------------|
| Horizon 1 | Optimize Present | GitHub Copilot adoption, basic agentic workflows, foundation primitives | 0-90 days |
| Horizon 2 | Emerging Capabilities | RHDH as Golden Path surface, software templates at scale, governed MCP servers | 3-6 months |
| Horizon 3 | Transform Future | End-to-end Agentic DevOps, autonomous operations, multi-agent orchestration | 6-12 months |

The model maps directly to the implementation sequence in chapter 09. Horizon 1 is the credible foundation; Horizon 2 is enhancement and context; Horizon 3 is the agentic layer at production scale.

### 8.2 Per-Horizon Capability Set

**Horizon 1 capabilities.** The minimum viable platform: ARO cluster, RHDH IDP, basic Tekton pipelines, OpenShift GitOps with environment-specific sync, Azure Monitor + Foundry Observability + OpenShift Observability unified, Workload Identity, Workload Identity-based secrets, supply-chain baseline (TAP at minimum coverage). Horizon 1 onboards three teams via H1 software templates.

**Horizon 2 capabilities.** Extended platform: H2 software templates live and adopted, Service Catalog populated to ≥80% coverage, TechDocs adopted org-wide, OPA Gatekeeper or Azure Policy at admission with break-glass workflow, cost dashboard live with per-workload attribution, first Copilot Chat agent deployed (typically the `platform` agent). Horizon 2 reaches platform adoption ≥50% of eligible workloads.

**Horizon 3 capabilities.** AI-native platform: model gateway operational with per-model cost and usage dashboards, agent observability (traces, costs, output sampling, evaluation results), at least one agent running a real business process end-to-end with human review at promotion boundaries, AI Usage dashboard as primary KPI surface, the platform team executing the Dual Mandate visibly (at least one Copilot Chat agent in use internally + at least one H3 template in use externally). Horizon 3 reaches first production AI workload at 90-180 days time-to-value (the Forrester compression target).

### 8.3 The Maturity Model and the CNCF Maturity Model

The Three Horizons maturity model and the [CNCF Platform Maturity Model](https://tag-app-delivery.cncf.io/whitepapers/platform-eng-maturity-model/) are compatible but not identical. The mapping:

| Three Horizons | CNCF Platform Maturity |
|----------------|------------------------|
| Horizon 1 (Optimize Present) | Operational level on most dimensions |
| Horizon 2 (Emerging Capabilities) | Scalable level on most dimensions |
| Horizon 3 (Transform Future) | Optimizing or AI-Native level on most dimensions |

Three Horizons is a sequencing model (when do we do what); CNCF is a measurement model (what is the current state). The two are complementary; Three Horizons tells the platform team what to build next, and CNCF tells them how mature the result is.

Chapter 10 covers the CNCF Maturity Model in operational depth.

---

## 9. Mapping Three Horizons to the Four Pillars

### 9.1 The Crosswalk

Each of the CNCF Four Pillars (chapter 03) materializes in Three Horizons through specific components. The crosswalk:

| Pillar | Three Horizons Materialization |
|--------|-------------------------------|
| Golden Paths | RHDH Software Templates (H1, H2, H3 catalogs); Tekton-based generated CI/CD; Argo CD-based generated deployment; Terraform-based generated infrastructure |
| Guardrails | Red Hat Advanced Cluster Security policies; OpenShift admission controllers; Azure Policy at cloud and cluster boundary; Workload Identity replacing long-lived credentials; TAP for image signing and admission |
| Safety Nets | OpenShift GitOps reconciliation; OpenShift observability + Azure Monitor + Foundry Observability; Velero backup; OpenShift progressive delivery (Service Mesh-based traffic shifting); ACM-based multi-cluster reconciliation; ACS runtime threat detection |
| Manual Review | OpenShift GitOps environment-specific sync (dev auto, staging gated, production manual); Change Advisory via GitHub Issues templates; AI agent promotion via Microsoft Agent Governance Toolkit |

### 9.2 The Property of Pre-Wired Pillars

The differentiating property of Three Horizons (and of accelerators in general) is that the pillars are **pre-wired at deploy time**. The customer does not start with a blank cluster and configure each pillar separately; the customer starts with a cluster where the pillars are already integrated. The customization is at the policy and content layer, not at the integration layer.

This is the structural reason for the 4-6x time-to-production compression that Forrester documents (chapter 01). The work the accelerator absorbs is the pillar integration work, which is the most-time-consuming portion of platform construction. The customer's work is the workload-specific opinion: which policies, which Golden Paths, which AI workloads.

---

## 10. Mapping Three Horizons to the Dual Mandate

### 10.1 Mandate A in Three Horizons

The Mandate A surface in Three Horizons is dominated by:

- **GitHub Copilot Enterprise** for developers, with Copilot Chat agents scoped to platform domains (the analog of Open Horizons's 17 agents, sized to the Three Horizons toolchain).
- **Red Hat Lightspeed** for operators, providing AI assistance in OpenShift cluster operations, ACM, ACS, and Ansible.
- **Microsoft Agent Framework + Foundry Agent Service** for custom platform-internal agents that the platform team builds (incident triage, runbook authoring, policy review, drift remediation).

The structural property is that the platform team interacts with three AI assistance surfaces depending on context: developers in IDEs use Copilot, operators in clusters use Lightspeed, custom agents in production use Foundry. The Three Horizons accelerator integrates the three so they share context where possible.

### 10.2 Mandate B in Three Horizons

The Mandate B surface in Three Horizons is dominated by:

- **Microsoft Foundry** as the model gateway. Foundry exposes OpenAI, Anthropic, Meta, Mistral, and other models through a unified surface; per-workload routing, metering, and policy are enforced at the gateway.
- **Azure AI Search or pgvector on managed PostgreSQL** as the vector store, provisioned through RHDH Software Templates as Golden Paths.
- **Microsoft Foundry Agent Service** as the agent runtime, with Entra Agent ID for identity and Foundry Observability for trajectories.
- **Microsoft Foundry Evaluations** as the evaluation pipeline, integrated with Tekton pipelines so that every model- or agent-producing workload passes evaluations before promotion.
- **Foundry Observability + OpenShift Observability + Azure Monitor** as the unified observability stack covering application, platform, and AI workloads.

The Mandate B primitives are the same in Three Horizons as in Open Horizons because they live in the shared Microsoft foundation. The differentiation between accelerators is at the IDP and cluster layers, not at the AI primitive layer.

### 10.3 Why the Dual Mandate Is Tractable in Three Horizons

The Three Horizons accelerator ships the Dual Mandate components pre-integrated: Copilot Chat agent infrastructure in RHDH, Lightspeed in OpenShift, Foundry Agent Service in the Microsoft foundation, and Foundry as the model gateway. The customer does not assemble the Dual Mandate; the customer operates and evolves it.

The maturity test from chapter 05 is therefore tractable in Three Horizons by week six of the deployment. By that point, at least one of the platform team's recurring tasks has been absorbed by an agent (Mandate A), and at least one application team is consuming the model gateway through a Golden Path (Mandate B).

---

## 11. Commercial Structure and Joint Support

### 11.1 The Commercial Components

Three Horizons has three commercial components, each of which is independently licensed and supported:

- **Red Hat subscriptions.** RHDH Enterprise, ARO, OpenShift Pipelines, OpenShift GitOps, OpenShift Service Mesh, Red Hat Advanced Cluster Manager, Red Hat Advanced Cluster Security, Red Hat Trusted Application Pipeline, Red Hat Lightspeed (where licensed). Subscriptions are typically purchased through Red Hat's enterprise sales channel or through cloud marketplace.
- **Azure consumption.** ARO compute and storage, Azure infrastructure services (Key Vault, Azure AI Foundry, Azure Monitor, Application Insights, Entra ID, etc.). Consumption is metered and billed by Microsoft Azure.
- **GitHub Enterprise.** GitHub Enterprise Cloud with GitHub Advanced Security, GitHub Copilot Enterprise, and access to GitHub Copilot Coding Agent. Licensed per-seat through GitHub.

The combined commercial structure is more complex than Open Horizons (which does not include Red Hat subscriptions) and simpler than fully self-built platforms (which require negotiating components separately).

### 11.2 The Joint Support Model

The differentiating property of Three Horizons commercial structure is the joint support relationship. Microsoft and Red Hat operate ARO jointly, and the support contract names both vendors as commercial owners with escalation paths between them. For issues that span the Microsoft and Red Hat boundary (a cluster issue that may be in either), the customer engages one party and the resolution flows internally.

This is one of the strongest reasons clients choose Three Horizons. The "one throat to choke" preference reflects an operational reality: incidents that span multiple vendors are slow to resolve when each vendor blames the other. The joint support model removes that friction.

For some clients, joint support is a procurement requirement that is not negotiable. Three Horizons satisfies this requirement; alternatives that do not have a joint support model do not.

### 11.3 The Cost Structure

The Three Horizons cost structure has three line items:

- **Red Hat subscriptions.** Per-cluster and per-user pricing for the Red Hat components. Typically the second-largest line item after Azure consumption, depending on cluster size and subscription mix.
- **Azure consumption.** Cluster compute, storage, and Microsoft foundation services. Scales with workload volume.
- **GitHub Enterprise.** Per-seat licensing with Advanced Security and Copilot Enterprise add-ons.

For organizations comparing Three Horizons to Open Horizons, the Red Hat subscription line item is the primary cost differentiator. Open Horizons (chapter 07) does not include Red Hat subscriptions; the AKS-based stack uses upstream open-source components that have no subscription cost. The trade-off is the Red Hat support contract, which is the value Open Horizons does not provide.

Chapter 08 covers the cost-versus-support trade-off in operational depth.

---

## 12. Client Profiles and LATAM Examples

### 12.1 The Client Profile That Tilts Toward Three Horizons

Based on LATAM enterprise observation, the client profile that tilts toward Three Horizons has at least three of the following properties:

- **Prior Red Hat investment.** Existing on-premise OpenShift deployments, RHEL fleet at scale, Ansible Automation Platform usage. The Red Hat skill set is already in the organization.
- **Regulatory or audit requirements.** Sectors where commercial-supported software with FedRAMP, FIPS, Common Criteria, or sector-specific certifications is procurement-blocking.
- **Vendor strategy preferring "one throat to choke."** Procurement and IT operations prefer fewer vendors with stronger support relationships over more vendors with looser relationships.
- **Sector concentration in financial services, energy, government, healthcare.** These sectors tilt toward Three Horizons more than average due to overlap with the regulatory and vendor-strategy properties.

### 12.2 LATAM Reference Accounts

The playbook's LATAM Three Horizons reference accounts include large institutions in financial services (Caixa, Banco do Brasil, Bradesco, Porto), energy (Petrobras), healthcare (Pacifico Salud, Pacifico Seguros), and other regulated sectors. These accounts share the procurement profile described in section 12.1.

The reference accounts inform the accelerator's defaults. Specifically: the policy library that ships with Three Horizons is opinionated for LATAM regulatory regimes (LGPD, BACEN, ANEEL, ANS); the supply-chain pipeline defaults to artifact retention periods that align with audit requirements; the observability stack pre-configures dashboards for SOX, PCI-DSS, and sector-specific reporting.

These defaults can be overridden, but most reference accounts adopt the defaults because they map to procurement realities.

### 12.3 The Client Profile That Does Not Tilt Toward Three Horizons

Three Horizons is not the right answer for every client. Profiles that tilt away from Three Horizons (and toward Open Horizons, covered in chapter 07) include:

- **No prior Red Hat investment.** The client is Azure-native or AWS-native without Red Hat skill set or prior subscriptions; the marginal cost of adopting Red Hat licensing is high for limited differentiated value.
- **Vendor strategy preferring minimum vendor count.** The client treats Red Hat as one more vendor they would rather not add; the Microsoft foundation alone is sufficient.
- **Strong internal Kubernetes upstream expertise.** The client has dedicated platform engineers who can operate upstream Backstage and AKS at quality. The enterprise-supported Red Hat stack does not provide differentiated value.
- **OSS-first cultural posture.** The client's engineering culture values transparency and customizability over vendor support; they prefer the upstream pace.

Chapter 08 covers the comparative decision in operational depth.

---

## 13. Deployment Sequence and Operational Considerations

### 13.1 The Deployment Sequence

Three Horizons deployment sequences in three phases:

**Phase 1 (weeks 0-4): Foundation.** ARO cluster provisioned with Workload Identity, Key Vault, Azure Monitor integration. RHDH deployed and branded, GitHub-OAuth-secured. OpenShift GitOps deployed with environment-specific sync policies. OpenShift Pipelines deployed. Initial software templates loaded (H1 catalog).

**Phase 2 (weeks 4-12): Onboarding.** First three application teams onboarded via H1 software templates. Service Catalog populated. TechDocs adopted by onboarded teams. ACS deployed and policies applied. TAP integrated with Pipelines. DORA measurements live for onboarded teams.

**Phase 3 (months 3-12): Scaling.** H2 software templates released and adopted. Cost dashboard live. First Copilot Chat agent deployed. Service Catalog reaches ≥80% coverage. Multi-cluster expansion through ACM where applicable. H3 software templates released for early-adopter teams.

### 13.2 Operational Considerations

Three Horizons requires specific operational considerations the platform team must anticipate:

- **OpenShift expertise.** ARO is managed, but ARO workloads still require OpenShift operational skill (SCCs, Routes, OpenShift-specific patterns). The platform team must staff for this skill.
- **Tekton expertise.** OpenShift Pipelines is Tekton-based; the platform team must understand Tekton's task and pipeline model. This differs from GitHub Actions in important ways.
- **Multi-tenancy patterns.** ARO supports multi-tenancy through namespaces, OpenShift Projects, and service mesh sidecars. The platform team must configure tenancy patterns consistent with the customer's organizational structure.
- **Joint vendor escalation.** When issues require Microsoft + Red Hat joint resolution, the platform team must understand the escalation path. This is rarely needed but is operationally important when it is.

Most of these considerations are addressed by the Three Horizons reference deployment guides. The Three Horizons accelerator's deployment guides include opinionated defaults for tenancy, pipeline patterns, and escalation; the customer customizes from there.

### 13.3 The First-Value Milestone

The first-value milestone in Three Horizons is the moment the first application team ships a workload through a Golden Path on the new platform. This is typically week 6-8 of the deployment. The milestone is observable: the team's PR-to-production lead time, measured at the new platform, becomes faster than the team's prior baseline.

This milestone is the trigger for the deployment's expansion phase. Once the first team has shipped, the next three teams onboard with reduced friction (the deployment patterns are validated, the documentation is field-tested). Within 12 weeks, the platform reaches the credible foundation threshold defined in chapter 05.

---

## 14. When Three Horizons Is the Right Choice

The chapter has covered Three Horizons in operational depth. The decision criteria, summarized:

**Choose Three Horizons when:**

- The client has prior Red Hat investment (RHEL, OpenShift, AAP) at material scale.
- The client requires commercial-supported software for regulatory, audit, or procurement reasons.
- The client prefers a single, unified support relationship spanning the application platform and the cloud.
- The client operates in a sector where Red Hat's certifications (FedRAMP, FIPS, Common Criteria) are procurement criteria.
- The client's engineering team is organized around enterprise-supported tooling rather than upstream OSS.
- The client values OpenShift's ecosystem (Operators, OpenShift AI, OpenShift Service Mesh, OperatorHub) as a strategic differentiator.

**Consider Open Horizons (chapter 07) when:**

- The client has no prior Red Hat footprint.
- The client's vendor strategy prefers minimum vendor count.
- The client has strong internal Kubernetes upstream expertise.
- The client's culture is OSS-first.
- The client treats Red Hat licensing line items as cost-undesirable.

**Run a comparative discovery when:**

- The client's leadership is split.
- The client has both Red Hat and Azure-native engineering pockets.
- The client is genuinely undecided.

Chapter 08 covers the comparative decision framework in operational depth, including a one-day discovery method that reaches a defensible recommendation.

The single takeaway: **Three Horizons is the right answer when the client's procurement, engineering, and regulatory profile aligns with the Red Hat ecosystem**. When that alignment is present, Three Horizons is the fastest known path to an Agentic DevOps Platform. When the alignment is absent, Open Horizons (chapter 07) is the fastest known alternative path.

---

## References

- [Red Hat Developer Hub Documentation](https://developers.redhat.com/rhdh). Red Hat, 2026.
- [Azure Red Hat OpenShift Documentation](https://learn.microsoft.com/en-us/azure/openshift/). Microsoft and Red Hat, 2026.
- [OpenShift Pipelines Documentation](https://docs.openshift.com/pipelines/latest/about/about-pipelines.html). Red Hat, 2026.
- [OpenShift GitOps Documentation](https://docs.openshift.com/gitops/latest/understanding_openshift_gitops/about-redhat-openshift-gitops.html). Red Hat, 2026.
- [Red Hat Trusted Application Pipeline](https://www.redhat.com/en/products/trusted-application-pipeline). Red Hat, 2026.
- [Red Hat Advanced Cluster Manager](https://www.redhat.com/en/technologies/management/advanced-cluster-management). Red Hat, 2026.
- [Red Hat Advanced Cluster Security](https://www.redhat.com/en/technologies/cloud-computing/openshift/advanced-cluster-security-kubernetes). Red Hat, 2026.
- [Red Hat OpenShift Service Mesh](https://docs.openshift.com/container-platform/latest/service_mesh/v2x/ossm-about.html). Red Hat, 2026.
- [Red Hat Lightspeed](https://www.redhat.com/en/topics/ai/red-hat-lightspeed). Red Hat, 2026.
- [Tekton Documentation](https://tekton.dev/). Tekton Project, 2026.
- [SLSA Supply-chain Levels for Software Artifacts](https://slsa.dev/). Linux Foundation, 2026.
- [Backstage Documentation](https://backstage.io/docs/). Linux Foundation, 2026.
- [Azure AI Foundry Documentation](https://learn.microsoft.com/en-us/azure/ai-foundry/). Microsoft, 2026.
- [Microsoft Agent Framework 1.0](https://devblogs.microsoft.com/agent-framework/microsoft-agent-framework-version-1-0/). Microsoft, April 2026.
- [GitHub Copilot Enterprise](https://docs.github.com/en/copilot). GitHub, 2026.
- [GitHub Advanced Security](https://github.com/security/advanced-security). GitHub, 2026.
- Silva, P. (2026). *Three Horizons Accelerator v4.0.0*. Microsoft and Red Hat reference deployment.
- Silva, P. (2026). *Three Horizons Lightning Talk*, Red Hat Summit 2026.
- Silva, P. (2026). *The Context Platform Stack: Harness Engineering*, chapter 6 v1.2.0. Microsoft.

---

Paula Silva, Software Global Black Belt
*Pioneering software development with AI and Agentic DevOps*

paulasilva@microsoft.com
