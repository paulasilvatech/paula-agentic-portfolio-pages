---
title: "Option B — Open Horizons: The Open-Source Path to an Agentic DevOps Platform"
description: "Operational deep-dive on the Open Horizons accelerator: Backstage upstream on Azure Kubernetes Service, GitHub Actions, OPA Gatekeeper or Kyverno, 22 Golden Paths, 17 Copilot Chat agents, 16 Terraform modules, 13 MCP server configurations, and approximately 20,000 lines of production code."
author: "Paula Silva"
role: "Software Global Black Belt"
contact: "paulasilva@microsoft.com"
date: "2026-05-05"
version: "1.0.0"
status: "draft"
locale: "en"
brand: "Agentic DevOps"
tags: [open-horizons, backstage, aks, github-actions, argo-cd, flux, opa-gatekeeper, kyverno, golden-paths, copilot-chat-agents, terraform-modules, mcp-servers]
---

# Chapter 07: Option B — Open Horizons (Open Source)

> **Argument.** Open Horizons is the accelerator for clients optimizing for vendor neutrality, open-source posture, or strong internal Kubernetes upstream expertise. The Internal Developer Platform is Backstage upstream, the cluster is Azure Kubernetes Service (AKS), the delivery substrate is GitHub Actions plus Argo CD or Flux, the supply-chain security is GitHub Advanced Security plus SLSA plus Sigstore, and the AI-assist layer is GitHub Copilot Enterprise plus Microsoft Foundry Agent Service. Open Horizons v4.0.0 ships approximately 20,000 lines of production code across 22 Golden Path templates (6 H1 / 9 H2 / 7 H3), 17 GitHub Copilot Chat agents, 16 operational skills, 16 Terraform modules, 13 MCP server configurations, 28 GitHub Issues templates, 14 automation scripts, 30+ Prometheus alerting rules, and 3 pre-built Grafana dashboards (Platform Overview, Cost Management, Golden Path Application). The accelerator materializes all four CNCF Pillars and both mandates of the Dual Mandate, riding the same Microsoft foundation as Three Horizons. This chapter goes deep on the Open Horizons stack, what ships in v4.0.0, and when to choose it.

---

## Table of Contents

1. [What Open Horizons Is](#1-what-open-horizons-is)
2. [The Component Inventory](#2-the-component-inventory)
3. [Backstage Upstream as the IDP](#3-backstage-upstream-as-the-idp)
4. [Azure Kubernetes Service (AKS) as the Cluster](#4-azure-kubernetes-service-aks-as-the-cluster)
5. [GitHub Actions and Argo CD or Flux for Delivery](#5-github-actions-and-argo-cd-or-flux-for-delivery)
6. [Supply Chain: GitHub Advanced Security + SLSA + Sigstore](#6-supply-chain-github-advanced-security--slsa--sigstore)
7. [The 22 Golden Path Templates](#7-the-22-golden-path-templates)
8. [The 17 Copilot Chat Agents](#8-the-17-copilot-chat-agents)
9. [The 16 Terraform Modules](#9-the-16-terraform-modules)
10. [The 13 MCP Server Configurations](#10-the-13-mcp-server-configurations)
11. [Mapping Open Horizons to the Four Pillars](#11-mapping-open-horizons-to-the-four-pillars)
12. [Mapping Open Horizons to the Dual Mandate](#12-mapping-open-horizons-to-the-dual-mandate)
13. [Commercial Structure and Support Model](#13-commercial-structure-and-support-model)
14. [Client Profiles and LATAM Examples](#14-client-profiles-and-latam-examples)
15. [Deployment Sequence and Time-to-Value](#15-deployment-sequence-and-time-to-value)
16. [When Open Horizons Is the Right Choice](#16-when-open-horizons-is-the-right-choice)
17. [References](#references)

---

## 1. What Open Horizons Is

Open Horizons (v5.0.0) is a customer-deployed open-source accelerator that materializes the AI-Native Enterprise Pyramid (chapter 02) and the CNCF Four Pillars (chapter 03) on the upstream open-source stack running on Azure. It is engineered for clients who optimize for vendor neutrality, who treat OSS-first posture as a strategic value, or who have strong internal Kubernetes upstream expertise that they prefer to deploy.

Open Horizons is created in partnership between Microsoft and GitHub. It is open-source and customer-readable; every component is auditable, and there is no black-box behavior. The accelerator's reference implementation is published with its full source code, deployment guides, and operational runbooks.

The accelerator's value proposition has three components.

**Speed.** A green-field deployment that would take 9-18 months to assemble from raw components is compressed to 90-180 days because the accelerator ships the integration patterns, the Golden Path catalog, the supply-chain wiring, the GitOps configuration, and the agent infrastructure pre-integrated. The customer customizes; the customer does not assemble.

**Vendor neutrality.** Every layer above the Microsoft foundation (Azure, Entra, Foundry, GitHub) is open-source upstream. The customer's exit cost is bounded; if they ever want to migrate to a different cloud, the IDP, cluster orchestration, GitOps, and supply-chain primitives are portable.

**OSS upstream pace.** Backstage releases approximately every two weeks; Argo CD releases monthly; the Kubernetes ecosystem releases continuously. Open Horizons clients consume the upstream pace directly rather than waiting for an enterprise distribution to land.

The remainder of this chapter goes deep on the Open Horizons component inventory, the operational pattern, and the procurement decision.

---

## 2. The Component Inventory

Open Horizons v5.0.0 ships a deliberately concrete component inventory. The numbers below are the accelerator's stated v5.0.0 reference; later versions add components as new H3 patterns mature.

| Component Class | Count | Form |
|------------------|-------|------|
| Golden Path templates | **22** | Backstage scaffolder templates organized by H1/H2/H3 |
| GitHub Copilot Chat agents | **17** | Scoped, context-rich agents covering platform, DevOps, security, SRE, docs, onboarding, architecture, testing |
| Terraform modules | **16** | AKS, ACR, Key Vault, VNet, PostgreSQL, Redis, Foundry, identity, etc. |
| GitHub Issues templates | **28** | Workflow templates encoding platform process |
| Automation scripts | **14** | Setup, validation, cost audit, deploy verification |
| MCP servers | **15** | Integration with Azure, GitHub, observability, and other systems |
| Observability dashboards | **4** | Grafana dashboards covering platform, cost, AI usage, security |
| Total production code | **~20,000 lines across 120+ files** | Open-source, customer-readable, auditable |

The practical consequence is that an enterprise adopting Open Horizons does not write a platform from scratch. It customizes an opinionated starting point. The customization work is bounded and additive; the assembly work is done.

This is the structural reason Open Horizons compresses time-to-production from the Forrester baseline of 9-18 months to roughly 90-180 days. The accelerator absorbs the assembly work, which is the most time-consuming portion of platform construction.

---

## 3. Backstage Upstream as the IDP

### 3.1 What Backstage Is

[Backstage](https://backstage.io/) is the open-source Internal Developer Platform created by Spotify and donated to the [Cloud Native Computing Foundation](https://www.cncf.io/projects/backstage/) in 2020. As of 2026, Backstage commands approximately **89% market share** among IDP adopters, with 270+ public adopters including LinkedIn, CVS Health, and Vodafone. In 2024 it ranked as the 4th most-contributed CNCF project.

Backstage's market dominance is one of the structural reasons Open Horizons adopts it as the upstream choice. The plugin ecosystem (100+ open-source plugins), the active community, and the rapid release cadence all favor upstream Backstage for clients with strong internal capability.

### 3.2 Backstage as the Golden Paths Surface

In Open Horizons, Backstage is the Golden Paths pillar (chapter 03) materialized. Specifically:

- **The Software Catalog** is the inventory of services, components, APIs, and resources, populated automatically through Backstage discovery plugins and declaratively through `catalog-info.yaml` files.
- **Software Templates (Scaffolder)** is the Golden Path mechanism: developers and agents invoke templates to create new components, and the templates produce the complete project scaffold.
- **TechDocs** is the documentation-as-code system, with documentation stored alongside code and rendered through Backstage.
- **Backstage Plugins** integrate with external systems (Kubernetes, Argo CD, Prometheus, Grafana, Azure, GitHub, etc.) so the developer's Backstage view is the unified developer surface.

The Open Horizons accelerator ships Backstage with branding, GitHub OAuth authentication, a populated catalog, the 22 Golden Path templates loaded, and the relevant plugins pre-configured. The customer customizes branding and adds enterprise-specific plugins; the customer does not configure Backstage from scratch.

### 3.3 Why Upstream Rather Than RHDH

The Open Horizons choice of upstream Backstage rather than RHDH (the Three Horizons choice) reflects three considerations:

**Pace.** Upstream Backstage releases every two weeks; RHDH releases on Red Hat's enterprise cadence (slower). Customers who value being on the upstream pace prefer Backstage upstream.

**Plugin ecosystem.** The full Backstage plugin ecosystem (100+ plugins) is available upstream; RHDH supports a curated subset (typically 30-40 plugins). Customers with custom integration needs that depend on community plugins prefer upstream.

**Cost structure.** Upstream Backstage has no licensing cost; RHDH does. For customers with strong internal Backstage operational capability, the upstream cost structure is preferable.

The trade-off is the Red Hat support contract. Upstream Backstage does not have a comparable enterprise support contract; customers operate with community support, internal capability, and (optionally) third-party integrators. Chapter 08 covers this trade-off in operational depth.

---

## 4. Azure Kubernetes Service (AKS) as the Cluster

### 4.1 What AKS Is

[Azure Kubernetes Service](https://learn.microsoft.com/en-us/azure/aks/) is Microsoft's managed Kubernetes service on Azure. AKS provisions Kubernetes clusters with managed control planes; the customer operates workloads on the cluster but does not operate the control plane.

AKS is the cluster layer in Open Horizons because it is the most-direct upstream Kubernetes offering on Azure. Workloads on AKS run on standard Kubernetes APIs without OpenShift-specific abstractions; the customer's Kubernetes expertise transfers directly.

### 4.2 AKS vs Self-Operated Kubernetes

AKS differs from self-operated Kubernetes (kubeadm-based, Cluster API-based) in two important ways:

- **Managed control plane.** Microsoft operates the API server, etcd, and control-plane components. The customer does not configure or patch these. Operational complexity drops substantially.
- **Azure integration.** AKS integrates natively with Azure-side services (Workload Identity, Key Vault, Monitor, Policy, Defender for Cloud). The integrations are first-class rather than ad-hoc.

For customers with dedicated Kubernetes operations teams who prefer maximum control, self-operated Kubernetes can be a reasonable choice. For customers who prefer to focus on workload operation rather than control-plane operation, AKS is usually the right answer.

### 4.3 AKS and the Microsoft Foundation

AKS integrates natively with the Microsoft foundation components covered in chapter 00:

- **Entra ID** is the cluster's identity provider; cluster RBAC is governed by Entra groups via [Microsoft Entra integration with AKS](https://learn.microsoft.com/en-us/azure/aks/azure-ad-rbac).
- **Workload Identity** issues short-lived federated credentials to workloads on AKS.
- **Azure Monitor and Container Insights** ingest cluster telemetry alongside application telemetry.
- **Azure Policy** applies governance policies at the cluster boundary, enforced by Azure Policy add-on for AKS.
- **Defender for Containers** provides runtime threat detection on AKS clusters.

These integrations are pre-configured in the Open Horizons accelerator. The customer's setup is governed by Terraform modules that provision both the AKS cluster and the Azure-side integrations.

### 4.4 LATAM Region Availability

AKS is available in LATAM regions including Brazil South. For data-residency sensitive workloads, AKS in Brazil South provides a fully in-region deployment. The data-residency posture is comparable to ARO in the Three Horizons stack.

---

## 5. GitHub Actions and Argo CD or Flux for Delivery

### 5.1 GitHub Actions as the CI Substrate

[GitHub Actions](https://github.com/features/actions) is the CI/CD substrate in Open Horizons. Application teams' workflows (build, test, security scan, package, push to ACR) execute as GitHub Actions workflows.

The choice of GitHub Actions rather than Tekton (the Three Horizons choice) reflects three considerations:

- **Developer affinity.** Most developers in 2026 are familiar with GitHub Actions; the per-team learning cost is low.
- **Ecosystem.** The GitHub Actions Marketplace contains 25,000+ actions; nearly any integration the platform needs is available off-the-shelf.
- **Native integration with GitHub.** GitHub Actions runs on the same platform as the source repository and the issue tracker; cross-system integration is friction-free.

The Open Horizons accelerator ships a library of **reusable GitHub Actions workflows** (one of the 22 Golden Paths). The reusable workflows encode platform conventions: how the platform expects builds to authenticate, how artifacts are pushed to ACR with signing, how policy gates are applied, how SBOMs are produced.

### 5.2 Argo CD or Flux as the GitOps Controller

Open Horizons supports either [Argo CD](https://argo-cd.readthedocs.io/) or [Flux](https://fluxcd.io/) as the GitOps controller. Both projects implement the GitOps model with similar guarantees; the choice between them is operational rather than philosophical.

The default in Open Horizons v5.0.0 is Argo CD because of the broader plugin ecosystem and the more-mature multi-cluster patterns. Customers with prior Flux experience can switch to Flux without changing the rest of the stack; the Open Horizons Terraform modules support either.

Both are configured with environment-specific sync policies (dev auto, staging gated, production manual) consistent with the Manual Review pillar (chapter 03).

### 5.3 The GitHub Actions + Argo CD Pattern

The combined pattern is:

1. A developer or agent commits code to a Git repository.
2. GitHub Actions builds, tests, and validates the change. The build produces a signed image pushed to Azure Container Registry (ACR), an SBOM uploaded with the artifact, and a SLSA provenance attestation.
3. GitHub Actions updates the GitOps repository (a separate repository or branch) with the new image reference.
4. Argo CD detects the GitOps repository update and reconciles the cluster according to the environment-specific sync policy.
5. Cluster state is observed; if it diverges from health expectations, Safety Nets respond.

This is structurally identical to the Three Horizons OpenShift Pipelines + OpenShift GitOps pattern (chapter 06, section 5.3). The differences are at the implementation level (GitHub Actions vs Tekton, Argo CD vs OpenShift GitOps); the operational pattern is the same.

---

## 6. Supply Chain: GitHub Advanced Security + SLSA + Sigstore

### 6.1 The Stack

Open Horizons's supply-chain security is composed from three open-source projects plus GitHub Advanced Security:

- **[GitHub Advanced Security](https://github.com/security/advanced-security)**: secret scanning (push protection, repository scanning), code scanning (CodeQL), dependency review and Dependabot alerting at the source layer.
- **[SLSA](https://slsa.dev/)** (Supply-chain Levels for Software Artifacts): the framework that defines provenance attestations and tampering protections at the build layer.
- **[Sigstore](https://www.sigstore.dev/)** (cosign, Rekor, Fulcio): keyless signing infrastructure for artifacts, with public transparency log for verification.
- **[OPA Gatekeeper](https://open-policy-agent.github.io/gatekeeper/) or [Kyverno](https://kyverno.io/)**: policy-as-code at admission, rejecting unsigned or non-attested artifacts at deploy time.

This stack is the open-source equivalent of Red Hat Trusted Application Pipeline. The differences are commercial (no Red Hat subscription required) and operational (the customer integrates the components themselves through the Open Horizons accelerator's reference workflows, rather than consuming a pre-integrated Red Hat product).

### 6.2 The Pattern

The supply-chain pattern in Open Horizons:

1. Developer commits code; GitHub Advanced Security scans for secrets and vulnerabilities at commit time.
2. GitHub Actions builds the artifact; the build produces an SBOM (using [syft](https://github.com/anchore/syft) or [tern](https://github.com/tern-tools/tern)).
3. The built artifact is signed via Sigstore cosign; the signature is recorded in Rekor.
4. SLSA provenance attestation is generated documenting the build pipeline's identity, the source commit, the build environment, and the build steps.
5. The artifact, signature, SBOM, and attestation are pushed to ACR.
6. At admission time, OPA Gatekeeper or Kyverno verifies the artifact is signed by the sanctioned key, that the attestation matches the sanctioned pipeline, and that no policy violations exist. Non-compliant artifacts are rejected.

The pattern closes the supply-chain attack surface that the [CrowdStrike 2026 Global Threat Report](https://www.crowdstrike.com/global-threat-report/) documents (chapter 04). Customers running Open Horizons with the supply-chain pattern operational do not exhibit the 38% vulnerability regression that the CrowdStrike data identifies.

### 6.3 The Trade-Off vs Three Horizons TAP

The Open Horizons supply-chain stack is functionally equivalent to Red Hat Trusted Application Pipeline (TAP) but is composed from open-source components. The trade-offs:

| Property | Open Horizons (OSS) | Three Horizons (TAP) |
|----------|---------------------|------------------------|
| Functional capability | Equivalent | Equivalent |
| Subscription cost | None (Sigstore, syft, OPA, Kyverno are all OSS) | Red Hat TAP subscription required |
| Support model | Community + customer team + integrators | Red Hat enterprise support |
| Integration burden | Customer integrates components (accelerator absorbs most of it) | Pre-integrated by Red Hat |
| Customizability | Full source visibility; customer can extend | Closed-source extensions require Red Hat coordination |

Both stacks meet the same audit and compliance posture; both pass FedRAMP, SOC 2, and sector-specific reviews when deployed correctly. The decision is procurement-driven: subscription cost vs vendor support.

---

## 7. The 22 Golden Path Templates

### 7.1 The Catalog by Horizon

Open Horizons v5.0.0 ships **22 Backstage scaffolder templates** organized by the H1/H2/H3 maturity model. The catalog is opinionated for AKS-native, Azure-native, GitHub-native deployments.

#### 7.1.1 Horizon 1: Foundation (6 templates)

The baseline every enterprise needs before doing anything else:

| Template | Purpose |
|----------|---------|
| `basic-cicd` | Minimum viable CI/CD pipeline with branch protection, status checks, automated testing using GitHub Actions |
| `security-baseline` | Org-wide security policy configuration (signing, scanning, secret protection, Workload Identity) |
| `documentation-site` | Documentation-as-code site with MkDocs, versioned publishing, Backstage TechDocs integration |
| `web-application` | Full-stack web application scaffold with ingress, observability, and health checks on AKS |
| `new-microservice` | Basic microservice starter with service mesh registration and golden observability |
| `infrastructure-provisioning` | Terraform module scaffolding (so infrastructure is also productized via the platform) |

H1 is the *Foundational* maturity level: self-service, focused on the primitives every team needs. A team onboarded via H1 templates has a complete vertical slice of the platform from the first commit.

#### 7.1.2 Horizon 2: Enhancement (9 templates)

Advanced application patterns assuming H1 is in place:

| Template | Purpose |
|----------|---------|
| `ado-to-github-migration` | Azure DevOps to GitHub migration following Microsoft's Playbook |
| `api-gateway` | Azure API Management configuration as code |
| `api-microservice` | RESTful API service with OpenAPI, authentication, rate limiting |
| `batch-job` | Scheduled batch processing with retries, DLQ, alerting |
| `data-pipeline` | ETL with Databricks, lineage emission via OpenLineage, Purview registration |
| `event-driven-microservice` | Event Hubs / Service Bus integration with outbox, idempotency, replay |
| `gitops-deployment` | ArgoCD application with environment promotion, sync policy, rollback |
| `microservice` | Complete microservice with every platform feature enabled (the canonical reference template) |
| `reusable-workflows` | GitHub Actions reusable workflow library |

H2 is where platform ROI first becomes visible at the business level, because application teams stop rebuilding infrastructure and start shipping features.

#### 7.1.3 Horizon 3: Innovation (7 templates)

AI / ML / Agentic templates assuming H1 and H2 are in place:

| Template | Purpose |
|----------|---------|
| `foundry-agent` | Azure AI Foundry agent with identity, observability, evaluation pipeline |
| `sre-agent-integration` | SRE automation agent wired to incident management |
| `mlops-pipeline` | Complete ML pipeline (data → train → evaluate → deploy → monitor) |
| `multi-agent-system` | Multi-agent orchestration with shared state, routing, guardrails |
| `copilot-extension` | GitHub Copilot extension scaffolding (skill, agent, MCP) |
| `rag-application` | Retrieval-Augmented Generation application with vector store, evaluation, observability |
| `ai-evaluation-pipeline` | Model and agent evaluation framework (quality, cost, safety, compliance) |

The critical design property of H3 is that *every H3 template inherits H1 and H2 primitives*. A `foundry-agent` is, structurally, a `microservice` plus a model binding plus an evaluation pipeline. It is not a separate architecture.

### 7.2 Why 22 Templates

The number 22 reflects the playbook's empirical answer to the question "what application patterns recur across LATAM enterprise customers?". Fewer than 22 leaves common patterns uncovered (teams build their own templates, defeating the purpose of the catalog); more than 22 fragments the catalog (developers cannot find what they need).

Customers that adopt Open Horizons inherit the 22 as a starting point. Most customers add 3-7 additional templates that are specific to their domain (e.g., a fintech customer adds a `payment-microservice` template; a healthcare customer adds a `hipaa-compliant-data-pipeline` template). The customer's customization is additive, not replacing the 22.

### 7.3 The Template Implementation

Each template is a Backstage scaffolder template, which is a YAML file plus a directory of skeleton code. Invoking a template produces:

- A new GitHub repository with the project skeleton.
- A CI/CD workflow file (GitHub Actions) configured for the project.
- An infrastructure-as-code module (Terraform) for any infrastructure the project needs.
- An ArgoCD application manifest for deploying the project.
- A Backstage `catalog-info.yaml` registering the project in the catalog.
- TechDocs scaffold for the project's documentation.
- A `CONSTITUTION.md`-style guide for any agent that operates on the project (where applicable).

The complete project scaffold is generated in 30-60 seconds. The team starts work with a compliant, observable, deployable system from minute one.

---

## 8. The 17 Copilot Chat Agents

### 8.1 The Catalog

Open Horizons v5.0.0 ships 17 GitHub Copilot Chat agents, each scoped to a recurring task domain. Chapter 05, section 5 lists them; this section adds the operational depth.

| Agent | Domain | Primary User |
|-------|--------|--------------|
| `platform` | Platform capability navigation, Golden Path selection | Developer, agent |
| `devops` | CI/CD authoring, GitHub Actions, pipeline troubleshooting | Developer |
| `architect` | Architecture review, ADR drafting, design choice trade-offs | Tech lead, architect |
| `security` | Security policy explanation, compliance checking, threat modeling | Security engineer, developer |
| `sre` | Incident triage, runbook generation, postmortem drafting | SRE, on-call engineer |
| `deploy` | Deployment operations, environment promotion, rollback | Developer, SRE |
| `reviewer` | PR review, policy-as-code review | Reviewer, platform engineer |
| `terraform` | Infrastructure module authoring, drift analysis | Platform engineer, developer |
| `test` | Test authoring, coverage analysis | Developer |
| `docs` | Documentation drafting, TechDocs authoring | Developer, technical writer |
| `onboarding` | New-hire / new-team onboarding walkthroughs | New hire, onboarding |
| `backstage-expert` | Backstage configuration, plugin authoring | Platform engineer |
| `github-integration` | GitHub org configuration, org policy | Platform engineer |
| `ado-integration` | Azure DevOps migration and hybrid workflows | Platform engineer, migration team |
| `azure-portal-deploy` | Azure deploy assistance | Developer, ops |
| `hybrid-scenarios` | Hybrid and multi-cloud patterns | Architect, platform engineer |
| `ops` | Day-2 operational playbooks | SRE, ops |

### 8.2 What Makes the Agents Different from Generic Copilot

The 17 agents are not generic Copilot Chat instances. Each is a **context-rich, scoped agent** grounded in the enterprise's own platform. The grounding is achieved through three mechanisms:

- **Custom system prompts** that define the agent's domain, scope, and refusal behavior.
- **MCP server connections** that give the agent access to enterprise context (the relevant Backstage catalog entries, the relevant policy-as-code, the relevant runbooks, the relevant observability dashboards).
- **Agent skills and instructions files** that encode the platform's specific conventions, naming patterns, and operational defaults.

The design principle is: the platform *itself* is the agent's context, and the platform's Golden Paths are the agent's action surface. An agent that recommends a Golden Path is an agent grounded in the platform's productized capabilities; an agent that recommends a generic pattern is an agent that has not been grounded in the platform.

### 8.3 The Agents' Role in the Dual Mandate

Each of the 17 agents serves both Mandate A and Mandate B (chapter 05).

- **Mandate A (internal velocity).** The platform team uses the agents internally. The `platform` agent answers "how do I update Golden Path X?". The `terraform` agent generates new Terraform modules. The `docs` agent drafts platform documentation. The platform team's recurring work is absorbed by the agents.
- **Mandate B (external velocity).** Application teams consume the agents as discovery and onboarding surfaces. The `platform` agent helps a new team find the right Golden Path. The `architect` agent helps a tech lead make design decisions. The `reviewer` agent helps reviewers approve PRs faster.

The same agent infrastructure serves both mandates simultaneously. This is the structural reason Open Horizons reaches the Dual Mandate maturity test (chapter 05, section 4) within weeks of deployment.

### 8.4 Agent Customization

Customers customize the 17 agents in three ways:

- **Domain replacement.** A customer in healthcare replaces the generic `architect` agent's training context with a healthcare-specific architectural pattern library.
- **Tool extension.** A customer adds new MCP servers to extend the agent's tool surface (e.g., a connection to the customer's specific ITSM system).
- **Persona refinement.** A customer adjusts the agent's tone, refusal behavior, and escalation paths to match the customer's culture.

Most customers keep all 17 agents and customize 3-7 of them. A few customers add 2-3 new agents specific to their domain (e.g., a financial services customer adds a `regulatory-compliance` agent that consumes BACEN documentation).

---

## 9. The 16 Terraform Modules

### 9.1 The Module Catalog

Open Horizons v5.0.0 ships 16 Terraform modules covering the AKS-based foundation:

| Module | Purpose |
|--------|---------|
| `aks-cluster` | AKS cluster provisioning with Workload Identity, Azure CNI, Standard load balancer |
| `acr` | Azure Container Registry with private endpoint and managed identity |
| `key-vault` | Azure Key Vault with private endpoint and Workload Identity federation |
| `vnet` | Virtual Network with subnet topology for AKS, ACR, services, and management |
| `nsg` | Network Security Groups with platform-default rules |
| `postgresql` | Managed PostgreSQL with private endpoint, backup, and disaster recovery |
| `redis` | Azure Cache for Redis with private endpoint and TLS |
| `foundry` | Azure AI Foundry workspace with model gateway and observability |
| `ai-search` | Azure AI Search with private endpoint, used as default vector store |
| `entra-agent-id` | Entra Agent ID provisioning with default permission scope template |
| `monitor` | Azure Monitor workspace with Container Insights and Application Insights |
| `policy` | Azure Policy assignment for the platform's baseline policy set |
| `defender` | Defender for Cloud and Defender for Containers with platform-default rules |
| `backstage` | Backstage deployment on AKS with PostgreSQL backend and GitHub OAuth |
| `argo-cd` | Argo CD deployment on AKS with environment-specific sync policy |
| `github-app` | GitHub Apps for platform integrations (RBAC, observability, automation) |

### 9.2 The Module Pattern

Each module follows a consistent pattern:

- **Inputs.** A small set of required inputs (typically: name, location, owner, environment) and a larger set of optional inputs that override defaults.
- **Defaults.** Every module ships with opinionated defaults that satisfy enterprise policy, security, and observability requirements out of the box.
- **Outputs.** Documented outputs that downstream modules can consume.
- **Tests.** Each module has [Terratest](https://terratest.gruntwork.io/)-based tests that validate the module's behavior on real Azure resources.
- **Versioning.** Modules are versioned with semver; breaking changes go in a major version, deprecations are explicit.

The 16 modules compose. A complete Open Horizons deployment is a Terraform configuration that calls all 16 modules in dependency order. The customer adjusts inputs and adds modules; the customer does not write infrastructure from scratch.

### 9.3 The `infrastructure-provisioning` Golden Path

One of the 22 Golden Paths is `infrastructure-provisioning`, which is itself a Backstage scaffolder template that generates new Terraform modules. The recursion is intentional: the platform productizes infrastructure-as-code authoring, the same way it productizes application authoring. Application teams that need infrastructure that is not in the 16-module catalog use the `infrastructure-provisioning` Golden Path to generate a new module that follows the platform's conventions.

This is one of the highest-leverage Golden Paths in the catalog because it scales the customer's infrastructure-as-code surface without scaling the platform team's headcount.

---

## 10. The 13 MCP Server Configurations

### 10.1 What MCP Is

The [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) is the open protocol, originated by Anthropic and developed in partnership across the AI industry, that defines how AI agents discover and consume context from external systems. MCP servers expose tools and resources to agents through a standard interface.

In Open Horizons, MCP is the integration mechanism between agents and enterprise systems. Rather than building per-system custom integrations, the platform exposes each system through an MCP server, and any agent can discover and consume any MCP server.

### 10.2 The MCP Server Inventory

Open Horizons v4.0.0 ships 13 MCP server configurations covering the most-common enterprise systems. The reference inventory below is illustrative; the exact set evolves with each release:

| MCP Server | System Exposed |
|------------|-----------------|
| `azure-mcp` | Azure Resource Manager (read), Azure subscription metadata |
| `aks-mcp` | AKS cluster operations (read kubectl-equivalent, certain write operations with policy) |
| `github-mcp` | GitHub repositories, issues, PRs, Actions, code search |
| `monitor-mcp` | Azure Monitor logs and metrics |
| `app-insights-mcp` | Application Insights traces and metrics |
| `key-vault-mcp` | Key Vault secret retrieval (with strict scope) |
| `acr-mcp` | Azure Container Registry image inventory |
| `argo-cd-mcp` | Argo CD application state and sync operations |
| `backstage-mcp` | Backstage catalog, TechDocs, software templates |
| `terraform-mcp` | Terraform state inspection (read), drift analysis |
| `policy-mcp` | Azure Policy + OPA Gatekeeper assignment and compliance state |
| `defender-mcp` | Defender for Cloud security findings |
| `purview-mcp` | Microsoft Purview data catalog and lineage |
| `foundry-mcp` | Azure AI Foundry models, evaluations, observability |
| `sre-mcp` | Incident management integration (typically PagerDuty, Opsgenie, or similar) |

### 10.3 The MCP Pattern

Each MCP server is a small, focused service that exposes a specific system through MCP's standard interface. The pattern:

1. The MCP server is deployed (typically as a Kubernetes deployment on AKS, or as a managed service).
2. The MCP server's identity is registered (Entra Agent ID for the server itself).
3. Agents (Copilot Chat agents, custom agents) are granted permission to call specific MCP servers based on their declared scope.
4. When an agent needs information or wants to take action, it discovers the relevant MCP server, retrieves the relevant tool, and invokes it.

The pattern scales linearly: adding a new system to the platform's agent surface is a single MCP server deployment, not a per-agent integration. This is the structural reason MCP has consolidated as the standard agent-integration protocol in 2026.

### 10.4 The MCP Server's Role in Mandate B

The 13 MCP server configurations are a substantial portion of the Mandate B surface. Application teams that build custom agents inherit access to all 13 servers (subject to permission scope); the agents discover and consume the relevant servers without per-agent integration work.

For application teams, the MCP server inventory eliminates the most common reason custom agent projects fail (the MIT NANDA "integration" problem from chapter 01). The agent has a reliable surface to call; the surface is governed; the cost of building the agent is bounded.

---

## 11. Mapping Open Horizons to the Four Pillars

The crosswalk:

| Pillar | Open Horizons Materialization |
|--------|------------------------------|
| Golden Paths | 22 Backstage scaffolder templates (H1: 6, H2: 9, H3: 7); reusable GitHub Actions workflow library; 16 Terraform modules; `infrastructure-provisioning` Golden Path that productizes IaC authoring |
| Guardrails | OPA Gatekeeper policies + Kyverno + Azure Policy at admission; Workload Identity replacing long-lived service credentials; Sigstore-signed image admission via cosign verification; SLSA provenance attestation enforcement; pre-commit secret scanning via gitleaks; GitHub Advanced Security at PR-time |
| Safety Nets | ArgoCD self-heal sync policy; Prometheus + Grafana + Alertmanager; OpenTelemetry-based tracing in Application Insights; Velero backup; progressive-delivery defaults via Argo Rollouts; Container Insights + Defender for Containers runtime detection |
| Manual Review | ArgoCD environment-specific sync policies (dev auto, staging gated, prod manual); Change Advisory via 28 GitHub Issues templates; AI agent promotion workflow via Microsoft Agent Governance Toolkit |

The structural property: **the four pillars are pre-wired at deploy time**. Each pillar is integrated with the others through the accelerator's reference Terraform configuration. The customer does not configure pillars; the customer customizes the policies, content, and agent inventory within pre-wired pillars.

---

## 12. Mapping Open Horizons to the Dual Mandate

### 12.1 Mandate A in Open Horizons

The 17 GitHub Copilot Chat agents (section 8) are the primary Mandate A surface. They absorb the platform team's recurring work across the seventeen domains. By the time the deployment reaches Horizon 2, the platform team's velocity has visibly improved.

In addition to the Copilot Chat agents, Open Horizons includes:

- **The `sre-agent-integration` Golden Path** for the platform team's incident-response workflow.
- **The 14 automation scripts** that absorb routine operational tasks (cost audit, deploy verification, validation).
- **Microsoft Agent Framework and Foundry Agent Service** for custom platform-internal agents the platform team builds.

### 12.2 Mandate B in Open Horizons

The five Mandate B primitives (chapter 05, section 3) are all present in Open Horizons:

- **Model gateway**: Microsoft Foundry, provisioned by the `foundry` Terraform module.
- **Vector store**: Azure AI Search, provisioned by the `ai-search` Terraform module, exposed as a platform primitive consumable through the `rag-application` Golden Path.
- **Agent runtime**: Microsoft Foundry Agent Service with Microsoft Agent Framework, exposed through the `foundry-agent` and `multi-agent-system` Golden Paths.
- **Evaluation pipeline**: The `ai-evaluation-pipeline` Golden Path, integrated with Foundry Evaluations, GitHub Actions for CI integration, and Foundry Observability.
- **Agent observability**: Foundry Observability + Application Insights + the AI Usage Grafana dashboard.

The Mandate B primitives are the same as in Three Horizons because they live in the shared Microsoft foundation. The differentiation between accelerators is at the IDP and cluster layers.

### 12.3 The Dual Mandate Maturity Test in Open Horizons

The chapter 05 maturity test (section 4) is tractable in Open Horizons by week 4-6 of the deployment:

- **Mandate A signal.** At least one of the 17 Copilot Chat agents is in active use by the platform team. The agent is absorbing recurring work; the team's velocity has improved in measurable ways.
- **Mandate B signal.** At least one application team is consuming an AI primitive through a Golden Path. Typically the first signal is a team consuming the model gateway via the `rag-application` template, or consuming Foundry Agent Service via the `foundry-agent` template.

Both signals appear in the platform's observability dashboards (the AI Usage Grafana dashboard tracks agent invocations and model gateway usage). The platform team's quarterly review cites the metrics directly.

---

## 13. Commercial Structure and Support Model

### 13.1 The Commercial Components

Open Horizons has two commercial components, each independently licensed:

- **Azure consumption.** AKS compute and storage, Azure infrastructure services (Key Vault, Azure AI Foundry, Azure AI Search, Azure Monitor, Application Insights, Entra ID, etc.). Consumption is metered and billed by Microsoft Azure.
- **GitHub Enterprise.** GitHub Enterprise Cloud with GitHub Advanced Security, GitHub Copilot Enterprise, and access to GitHub Copilot Coding Agent. Licensed per-seat through GitHub.

There are no Red Hat subscriptions. The differentiation from Three Horizons is concentrated in this commercial structure.

### 13.2 The Support Model

The Open Horizons support model has three tiers:

- **Microsoft (Azure + GitHub).** Microsoft supports the foundation: Azure services, AKS, Entra, Foundry, GitHub Enterprise, GitHub Advanced Security, GitHub Copilot. This is comparable to Three Horizons's Microsoft side.
- **Open-source community.** Backstage, Argo CD, Kyverno, OPA Gatekeeper, Sigstore, syft, and other OSS components are community-supported. The customer participates in the community, files issues upstream, and contributes back where appropriate.
- **Integrators (optional).** Customers without internal capability for upstream OSS support can engage system integrators who provide commercial support for Backstage, Argo CD, or other components. Integrator relationships are optional; the platform does not require them.

The trade-off versus Three Horizons is that the upstream layer of the stack (IDP, GitOps, supply chain) does not have a single vendor providing 24x7 enterprise support. Customers compensate through internal capability or integrator engagement.

### 13.3 The Cost Structure

The Open Horizons cost structure has two line items:

- **Azure consumption.** Cluster compute, storage, and Microsoft foundation services. Scales with workload volume.
- **GitHub Enterprise.** Per-seat licensing with Advanced Security and Copilot Enterprise add-ons.

For organizations comparing Open Horizons to Three Horizons, the absence of the Red Hat subscription line item is the primary cost differentiator. The cost reduction is meaningful (Red Hat subscriptions in a typical enterprise deployment are 10-30% of total platform spend). The trade-off is the support model.

Chapter 08 covers the cost-versus-support trade-off in operational depth.

---

## 14. Client Profiles and LATAM Examples

### 14.1 The Client Profile That Tilts Toward Open Horizons

Based on LATAM enterprise observation, the client profile that tilts toward Open Horizons has at least three of the following properties:

- **No prior Red Hat investment.** The client is Azure-native or AWS-native without significant Red Hat skill set or prior subscriptions.
- **Vendor strategy preferring minimum vendor count.** Procurement and IT operations prefer to consolidate on fewer vendors with deeper integration.
- **Strong internal Kubernetes upstream expertise.** The client has dedicated platform engineers comfortable operating upstream Backstage and AKS at quality.
- **OSS-first cultural posture.** The client's engineering culture values transparency, customizability, and upstream pace.
- **Cost optimization as a procurement criterion.** The Red Hat subscription line item is treated as cost-undesirable.

### 14.2 LATAM Reference Accounts

The playbook's Open Horizons reference accounts include digital-native enterprises, fintechs at scale, modern retailers, and certain state-owned enterprises with strong internal engineering capability. These accounts share the procurement profile described in section 14.1.

The reference accounts inform the accelerator's defaults. Specifically: the 22 Golden Paths are opinionated for AKS-native, GitHub-native deployments; the 17 agents are scoped to the platform domains common in digital-native enterprises; the policy library defaults are tuned for high-velocity teams that prefer guidance over enforcement at the boundary cases.

These defaults can be overridden, but most reference accounts adopt the defaults because they map to operational realities.

### 14.3 The Client Profile That Does Not Tilt Toward Open Horizons

Open Horizons is not the right answer for every client. Profiles that tilt away from Open Horizons (and toward Three Horizons, chapter 06) include:

- **Significant prior Red Hat investment.** Existing on-premise OpenShift deployments and a Red Hat-certified engineering team.
- **Regulatory or audit requirements that demand commercial-supported software.** Sectors where Red Hat's certifications are procurement-blocking criteria.
- **Vendor strategy preferring "one throat to choke."** The customer's IT operations would rather have one commercial relationship for the application platform.
- **Sectors heavily concentrated in financial services, energy, government, healthcare.** These sectors tilt toward Three Horizons more than average due to the procurement profile.

---

## 15. Deployment Sequence and Time-to-Value

### 15.1 The Median Deploy Times

Open Horizons documents the following median deploy times:

| Environment | Median Time |
|-------------|-------------|
| Development | 75-105 minutes |
| Staging | 100-130 minutes |
| Production | 130-175 minutes |

These are end-to-end deploy times for a complete Open Horizons foundation: AKS cluster + Backstage + Argo CD + Foundry + Key Vault + ACR + the 16 Terraform modules + the 22 Golden Paths + the 17 Copilot Chat agents + the 13 MCP server configurations + the 3 pre-built Grafana dashboards (Platform Overview, Cost Management, Golden Path Application).

The deploy times reflect that the accelerator is fully wired at deploy time. There is no "now please configure Backstage" step for the customer; the accelerator ships with Backstage branded, authenticated, and populated, with Golden Paths live and agents available.

### 15.2 The 90-180 Day Compression

Compared to the Forrester baseline median of 9-18 months to first production AI workload (chapter 01), Open Horizons compresses the timeline to roughly 90-180 days for a full-scope rollout (foundation + platform + H1-H2 Golden Paths + first H3 agent template + observability + governance). The compression factor is 4-6x, which matches the Forrester productized-platform prediction almost exactly.

The compression breaks down approximately as:

- **Days 0-30 (Foundation phase).** AKS, Backstage, Argo CD, Foundry, baseline Terraform modules deployed. First three application teams onboarded via H1 Golden Paths.
- **Days 30-90 (Enhancement phase).** H2 Golden Paths in use. Service Catalog populated. Cost dashboard live. First Copilot Chat agent in active use by the platform team. First application team building an AI workload through Open Horizons primitives.
- **Days 90-180 (Innovation phase).** H3 Golden Paths in use. First production AI workload running with full observability and evaluation. Multi-agent orchestration patterns explored. Platform reaches CNCF Optimizing level on most dimensions.

Chapter 09 covers the implementation sequence in operational depth, applicable to both accelerators.

---

## 16. When Open Horizons Is the Right Choice

The chapter has covered Open Horizons in operational depth. The decision criteria, summarized:

**Choose Open Horizons when:**

- The client has no prior Red Hat footprint.
- The client's vendor strategy prefers minimum vendor count.
- The client has strong internal Kubernetes upstream expertise that they want to deploy.
- The client's culture values OSS transparency, customizability, and upstream pace.
- The client treats Red Hat licensing as a cost-undesirable line item.
- The client is digital-native, a fintech at scale, a modern retailer, or otherwise Azure-native.

**Consider Three Horizons (chapter 06) when:**

- The client has significant prior Red Hat investment.
- The client requires commercial-supported software for regulatory reasons.
- The client prefers a single, unified support relationship.
- The client operates in a sector where Red Hat's certifications are procurement criteria.

**Run a comparative discovery when:**

- The client's leadership is split.
- The client has both Red Hat and Azure-native engineering pockets.
- The client is genuinely undecided.

Chapter 08 covers the comparative decision framework in operational depth.

The single takeaway: **Open Horizons is the right answer when the client's procurement, engineering, and cultural profile aligns with the open-source upstream ecosystem on the Microsoft foundation**. When that alignment is present, Open Horizons is the fastest known path to an Agentic DevOps Platform. When the alignment is absent, Three Horizons (chapter 06) is the fastest known alternative path.

---

## References

- [Backstage Documentation](https://backstage.io/docs/). Linux Foundation, 2026.
- [Backstage Software Templates (Scaffolder)](https://backstage.io/docs/features/software-templates/). Linux Foundation, 2026.
- [Azure Kubernetes Service Documentation](https://learn.microsoft.com/en-us/azure/aks/). Microsoft, 2026.
- [GitHub Actions Documentation](https://docs.github.com/en/actions). GitHub, 2026.
- [ArgoCD Documentation](https://argo-cd.readthedocs.io/). Argo Project, 2026.
- [Flux Documentation](https://fluxcd.io/). Flux Project, 2026.
- [Open Policy Agent Gatekeeper](https://open-policy-agent.github.io/gatekeeper/). OPA Project, 2026.
- [Kyverno Policy Engine](https://kyverno.io/). Kyverno Project, 2026.
- [Sigstore Documentation](https://www.sigstore.dev/). Linux Foundation, 2026.
- [SLSA Supply-chain Levels for Software Artifacts](https://slsa.dev/). Linux Foundation, 2026.
- [GitHub Advanced Security](https://github.com/security/advanced-security). GitHub, 2026.
- [Model Context Protocol Specification](https://modelcontextprotocol.io/). Anthropic and MCP Working Group, 2025-2026.
- [Azure AI Foundry Documentation](https://learn.microsoft.com/en-us/azure/ai-foundry/). Microsoft, 2026.
- [Microsoft Agent Framework 1.0](https://devblogs.microsoft.com/agent-framework/microsoft-agent-framework-version-1-0/). Microsoft, April 2026.
- [Azure AI Search](https://learn.microsoft.com/en-us/azure/search/). Microsoft, 2026.
- [Microsoft Entra Agent ID](https://learn.microsoft.com/en-us/entra/). Microsoft, 2026.
- [Argo Rollouts Documentation](https://argoproj.github.io/argo-rollouts/). Argo Project, 2026.
- Silva, P. (2026). *Open Horizons Accelerator v5.0.0*. Microsoft and GitHub. README, Architecture Guide, Administrator Guide, Backstage Deployment and Customization Guide, Golden Paths README.
- Silva, P. (2026). *The Context Platform Stack: Harness Engineering*, chapter 6 v1.2.0. Microsoft.
- Silva, P. (2026). *Platform Engineering: The Foundation Layer for the AI-Native Enterprise*, v1.0.0. Microsoft.

---

Paula Silva, Software Global Black Belt
*Pioneering software development with AI and Agentic DevOps*

paulasilva@microsoft.com
