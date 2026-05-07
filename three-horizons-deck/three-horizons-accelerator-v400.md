# Three Horizons Accelerator v4.0.0 - Complete Reference

## Document Overview

This is a comprehensive reference guide for the **Three Horizons Accelerator** - a unified platform engineering framework combining **GitHub + Azure + Red Hat OpenShift (ARO)** for building, deploying, and operating cloud-native applications at scale with AI-powered automation.

**Creator:** Paula Silva, Software Engineer & Global Black Belt, Latam Leader at Microsoft Americas  
**Contact:** paulasilva@microsoft.com | @paulanunes85 | @paulasilvatech | linkedin.com/in/paulanunes

---

## Table of Contents

1. [Introduction](#introduction)
2. [Overview](#overview)
3. [Three Horizons Model](#three-horizons-model)
4. [H1 - Foundation](#h1---foundation)
5. [H2 - Enhancement](#h2---enhancement)
6. [H3 - Innovation](#h3---innovation)
7. [By the Numbers](#by-the-numbers)
8. [AI Copilot Agents](#ai-copilot-agents)

---

## Introduction

### What Is the Three Horizons Accelerator?

The Three Horizons Accelerator is a complete, opinionated platform accelerator — everything your engineering team needs in a single GitHub template repository to build an enterprise-grade Internal Developer Platform (IDP).

### Key Features

- **Unified Toolchain:** Single pane of glass from code commit to production deployment
- **Horizons Roadmap:** Three-phase maturity model: Foundation → Enhancement → Innovation
- **Opinionated Defaults:** Pre-configured golden paths that teams can adopt on day one
- **Enterprise Governance:** Built-in compliance, security scanning & policy-as-code from the start

### Impact by the Numbers

| Metric | Impact |
|--------|--------|
| Deployment Speed | 60% Faster Deployments - Automated pipelines cut release cycles from weeks to hours |
| Operational Efficiency | 40% Less Operational Toil - IaC, GitOps & self-service portals free engineers for innovation |
| Developer Experience | 3x Developer Satisfaction - Golden paths & Copilot-assisted workflows boost team morale |
| Compliance | 100% Compliance Coverage - Policy-as-code ensures every deploy meets regulatory standards |

---

## Overview

### Repository Structure & Content

The accelerator provides a production-ready, enterprise-scale platform in a single GitHub template repository:

| Component | Quantity | Details |
|-----------|----------|---------|
| Files | 120+ | ~20,000 lines of curated, documented code |
| Terraform Modules | 16 | Covering every Azure infrastructure layer |
| Golden Path Templates | 22 | Self-service scaffolding for every workload type |
| AI Copilot Agents | 17 | Specialized agents with 16 operational skills |
| Prometheus Alerts | 30+ | Across infrastructure, apps, AI, and security |
| MCP Servers | 13 | Model Context Protocol tool integrations |

### The Platform Challenge

Modern engineering teams face compounding friction that slows delivery and increases risk:

- **Fragmented Tooling:** Disconnected tools, inconsistent standards, and no single source of truth
- **Slow Onboarding:** New developers take weeks to ship their first change — blocking velocity
- **Inconsistent Deployments:** Manual processes lead to environment drift and hard-to-reproduce failures
- **No Observability:** Without unified monitoring, incidents are detected late and resolved slowly

### The Solution: A Unified Platform

The Three Horizons Accelerator solves these challenges by providing:

1. **Infrastructure as Code:** 16 production-ready Terraform modules for Azure, ready to apply
2. **GitOps Workflows:** ArgoCD with App-of-Apps pattern, sync waves, and environment policies
3. **Developer Experience:** Developer Hub IDP with 22 Golden Path templates for self-service delivery
4. **AI Agents:** 17 specialized Copilot Chat agents powering guided automation in VS Code
5. **Full Observability:** Prometheus, Grafana, Jaeger, and 30+ alerting rules out of the box

---

## Three Horizons Model

### Architecture Overview

The Three Horizons Accelerator is structured as a layered architecture — build confidence at each horizon before advancing to the next. Each horizon delivers independent value — start with H1 and progressively unlock platform capabilities as your organization matures.

```
Layer 3: H3 — Innovation
         AI Capabilities
         
Layer 2: H2 — Enhancement
         Platform Services
         
Layer 1: H1 — Foundation
         Core Infrastructure
```

### H1: Foundation

**Core platform, CI/CD pipelines, IaC, monitoring & security baseline.**

Core infrastructure overview. The H1 Foundation layer provisions a production-grade Azure environment using Terraform — ARO, networking, security, databases, container registry, and identity management — everything your platform needs to stand up securely.

**Key Components:**
- ARO Cluster - Kubernetes compute layer
- Networking - VNet, NSGs, Private DNS
- Security - Key Vault, Managed Identity
- Databases - PostgreSQL, Redis, Cosmos
- Container Registry - ACR with geo-replication
- Disaster Recovery - Velero backups
- Cost Management & Naming

### H2: Enhancement

**Advanced automation, self-service portals, observability & cost optimization.**

Transforms raw infrastructure into a fully functioning Internal Developer Platform — adding GitOps, self-service portals, observability, secrets management, and CI/CD runners.

**Key Components:**
- ArgoCD GitOps
- Developer Hub Internal Developer Portal
- 22 Golden Path Templates
- Observability Stack (Prometheus, Grafana, Jaeger)
- External Secrets Operator
- GitHub Self-Hosted Runners
- Ingress & TLS Management

### H3: Innovation

**AI-driven operations, chaos engineering, platform-as-product & predictive scaling.**

Brings enterprise AI to your platform — Azure AI Foundry, model deployments, RAG applications, multi-agent systems, MLOps pipelines, and custom Copilot extensions.

**Key Components:**
- Azure AI Foundry Module
- 7 AI-Focused Golden Path Templates
- RAG Applications
- Multi-Agent Systems
- MLOps Pipelines
- AI Evaluation Pipelines
- 17 Specialized Copilot Agents

### Cross-Cutting Concerns

**Security, DevEx & automation thread through every horizon.**

---

## H1 - Foundation

### Complete Foundation Layer Components

```
H1 Foundation
├── ARO Cluster (Production Kubernetes)
├── Network (Zero-trust segmentation)
├── Security (Vault + Identity)
├── ACR (Secure image registry)
├── Databases (PostgreSQL + Redis)
└── FinOps (Budget + naming)
```

With H1 deployed, your Azure foundation is secure, observable, and ready for platform services.

### ARO Cluster Module

#### Cluster Capabilities

- Fully managed OpenShift by Red Hat & Microsoft
- Built-in OpenShift SDN networking
- Private cluster with Azure Private Link
- Cluster autoscaler via MachineSet replicas

#### Worker Node Configuration

- **Infra nodes:** Router, registry, monitoring components
- **Worker nodes:** Application workloads, autoscaling via MachineSets
- **GPU nodes:** AI/ML inference workloads (optional)

#### Security

Full RBAC with Azure AD & OpenShift OAuth, SCC (Security Context Constraints) enforced at cluster level.

### Networking Module

A zero-trust network architecture with complete isolation for all PaaS services.

| Component | Description |
|-----------|-------------|
| Virtual Network & Subnets | Segmented subnets for ARO master and worker nodes, private endpoints, and management traffic — enforcing separation of concerns |
| Network Security Groups | Granular NSG rules restricting inbound and outbound traffic at every subnet boundary |
| Private Endpoints & DNS | All PaaS services (Key Vault, ACR, databases) accessed via private endpoints with Azure Private DNS Zone resolution — no public exposure |

### Security Module

| Component | Description |
|-----------|-------------|
| Azure Key Vault | Soft delete + purge protection enabled. Single source of truth for all secrets |
| Managed Identities | Every service uses a managed identity — no passwords, no service principal secrets in code |
| Workload Identity Federation | GitHub Actions and Kubernetes workloads authenticate via OIDC federation — zero long-lived credentials |
| RBAC Assignments | Least-privilege role assignments scoped to resource groups, following Azure RBAC best practices |

### Container Registry

#### Azure Container Registry (ACR)

Enterprise-grade container registry with full security integration:

- Geo-replication for multi-region availability
- Built-in vulnerability scanning on push
- Private endpoint — no public registry exposure
- ARO integration via managed identity (no credentials)

**Why This Matters:** Geo-replicated images reduce pull latency across regions, while managed identity pull authentication eliminates the risk of leaked registry credentials entirely.

### Databases Module

| Database | Purpose | Features |
|----------|---------|----------|
| PostgreSQL Flexible Server | Powers Developer Hub IDP backend | Private endpoint, automatic backups, high-availability for production sizing |
| Redis Cache | Session management and caching layer | Reduces PostgreSQL load, improves portal responsiveness |
| Cosmos DB (Optional) | Globally distributed data access | Low-latency access available via optional Terraform variable flag |

**All database resources are accessed exclusively via private endpoints — no public internet exposure in any configuration.**

### Microsoft Defender for Cloud

#### Runtime Protection

Defender for Containers provides continuous threat detection across the ARO cluster, alerting on:
- Suspicious process activity
- Privilege escalation
- Lateral movement attempts

#### Integrated Security Posture

- Container image vulnerability scanning
- Runtime threat protection for ARO
- Compliance assessment against CIS benchmarks
- Security recommendations surfaced in Azure portal

### Disaster Recovery

| Strategy | Description |
|----------|-------------|
| Velero Backup & Restore | Cluster state and persistent volumes backed up to Azure Blob Storage on a configurable schedule |
| Cross-Region Replication | Data replicated to a secondary Azure region. Storage accounts and databases configured for geo-redundant replication |
| RPO & RTO by Profile | Recovery objectives are explicitly defined per sizing profile — from best-effort dev to strict production SLAs |

### Cost Management & Naming

#### Cost Management Module

- Azure budgets with threshold alerts
- Automated cost alerts to email and Teams
- Mandatory tagging policies on all resources
- Spending analysis dashboards in Grafana

#### CAF Naming Module

All Azure resources are named using Cloud Adoption Framework (CAF) conventions — ensuring consistency, searchability, and compliance across every environment and subscription.

---

## H2 - Enhancement

### Platform Services Overview

The H2 Enhancement layer transforms raw infrastructure into a fully functioning Internal Developer Platform — adding GitOps, self-service portals, observability, secrets management, and CI/CD runners.

### Complete Enhancement Layer Components

```
H2 Enhancement
├── ArgoCD GitOps
├── Developer Hub IDP
├── Observability
├── Secrets Management
├── CI/CD Runners
└── Ingress & TLS
```

### ArgoCD GitOps

#### App-of-Apps Pattern

A root ArgoCD Application manages all child applications — enabling ordered, declarative rollout of the entire platform stack using sync waves.

#### Environment Sync Policies

| Environment | Sync Policy | Details |
|-------------|------------|---------|
| Dev | Auto-sync | Changes deploy immediately |
| Staging | Semi-auto | Sync with approval |
| Prod | Manual | Human approval required |

#### Access Control

SSO via Dex (Azure AD), with platform-admin and developer RBAC roles enforced.

### Developer Hub - Internal Developer Portal

Developer Hub serves as the unified front door for all developers — a single place to discover services, scaffold new applications, browse documentation, and monitor system health.

#### Key Features

- **Software Catalog:** Centralized registry of every service, API, and component in your organization
- **TechDocs:** Auto-generated, version-controlled documentation rendered alongside each catalog entity
- **Golden Path Templates:** Self-service scaffolding for 22 curated workload types — no platform team required
- **GitHub Integration:** OAuth authentication and GitHub App integration for seamless repository and workflow access

### 22 Golden Path Templates

Self-service scaffolding organized across all three horizons — every template includes a template.yaml, skeleton code, and documentation.

#### H1 Foundation Templates (6 templates)

| Template | Description |
|----------|-------------|
| basic-cicd | Bootstrap CI/CD pipelines with GitHub Actions for any project |
| documentation-site | Scaffold a TechDocs-ready documentation site with automated publishing |
| infrastructure-provisioning | Template for new Terraform modules following organizational standards |
| new-microservice | Full-stack microservice with Dockerfile, Helm chart, and CI/CD wired up |
| security-baseline | Apply organizational security standards to any existing repository |
| web-application | Production-ready web app with ingress, TLS, and observability pre-configured |

#### H2 Enhancement Templates (9 templates)

| Template | Description |
|----------|-------------|
| api-gateway | API gateway scaffolding with rate limiting, authentication, and routing policies |
| api-microservice | RESTful API service with ThreeAPI spec, validation, and auto-generated docs |
| batch-job | Kubernetes CronJob template with retry logic and alerting |
| data-pipeline | Event-driven data ingestion pipeline wired to Azure Event Hub |
| event-driven-microservice | Async messaging patterns with Service Bus or Event Hub integration |
| gitops-deployment | ArgoCD Application manifest generator for rapid service onboarding |
| reusable-workflows | Shared GitHub Actions workflow library for platform-wide standardization |
| ado-to-github-migration | Guided migration of Azure DevOps pipelines and repos to GitHub |
| microservice | General-purpose microservice template with standard tooling |

#### H3 Innovation Templates (7 templates)

| Template | Description |
|----------|-------------|
| ai-evaluation-pipeline | Automated quality, safety, and compliance evaluation of AI model outputs |
| copilot-extension | Build custom GitHub Copilot extensions powered by Azure AI services |
| foundry-agent | Single-agent applications built on Azure AI Foundry with tool integration |
| mlops-pipeline | End-to-end ML lifecycle: training → evaluation → registry → deployment → monitoring |
| multi-agent-system | Multi-agent orchestration framework with tool use, handoffs, and collaborative reasoning |
| rag-application | Retrieval-Augmented Generation with Azure AI Search, document ingestion, vector embeddings, and chat interface |
| sre-agent-integration | AI-assisted SRE workflows — incident triage, runbook execution, and root cause analysis |

### Observability Stack

#### Components

| Component | Configuration |
|-----------|----------------|
| Prometheus | 2 replicas, 15-day retention, 50GB storage, 30+ alerting rules |
| Grafana | Azure AD SSO, 3 curated dashboards, cost and platform views |
| Alertmanager | PagerDuty + Microsoft Teams routing, silence and inhibit rules |
| Jaeger Tracing | Distributed request tracing across all microservices |

### Grafana Dashboards

| Dashboard | Purpose |
|-----------|---------|
| Platform Overview | Cluster health, node resource utilization, pod status, and namespace-level breakdowns the platform team's daily command center |
| Cost Management | Azure spending analysis, resource cost attribution by team and namespace, and optimization recommendations |
| Golden Path Application | Per-service golden signals (latency, throughput, errors, saturation) for every application deployed via a Golden Path template |

### 30+ Alerting Rules

Comprehensive alerting coverage across every layer of the platform stack.

#### Infrastructure Alerts

- Node pressure
- Disk utilization
- Network errors
- ARO component health

#### Application Alerts

- Error rate SLOs
- Latency thresholds
- Crash loops
- Pending deployments

#### AI Workload Alerts

- Token quota
- Inference latency
- Model endpoint availability
- Evaluation failures

#### GitOps Alerts

- ArgoCD sync failures
- Out-of-sync applications
- Repository health

#### Security Alerts

- Defender alerts
- Policy violations
- Unusual access patterns
- Certificate expiry

### External Secrets Operator

```
Azure Key Vault (Source of truth for secrets)
    ↓
External Secrets Operator (Continuously syncs and rotates)
    ↓
Kubernetes Secret (Consumed by pods at runtime)
```

The External Secrets Operator continuously synchronizes secrets from Azure Key Vault into Kubernetes Secrets using a ClusterSecretStore pattern, with automatic rotation and zero secrets stored in Git or environment variables.

### GitHub Self-Hosted Runners

#### Why Self-Hosted?

Self-hosted runners on ARO give CI/CD workflows access to private Azure resources — ACR, Key Vault, ARO — without exposing anything to the public internet.

#### Runner Capabilities

- Deployed via dedicated Terraform module
- Autoscaling based on workflow queue depth
- Network access to all private endpoints
- Managed identity for Azure authentication
- Ephemeral runners — clean state per job

### Ingress & TLS

| Component | Description |
|-----------|-------------|
| NGINX Ingress Controller | Routes external traffic to services with path-based and host-based routing rules, rate limiting, and WAF capabilities |
| cert-manager | Automatically provisions and renews TLS certificates from Let's Encrypt — zero manual certificate management |
| External DNS | Automatically creates and updates Azure DNS records when Kubernetes Ingress resources are created or modified |

---

## H3 - Innovation

### AI Capabilities Overview

The H3 Innovation layer brings enterprise AI to your platform — Azure AI Foundry, model deployments, RAG applications, multi-agent systems, MLOps pipelines, and custom Copilot extensions.

### Azure AI Foundry Module

#### Terraform-Managed AI

The AI Foundry module provisions the complete Azure AI infrastructure — hub, projects, model deployments, and search — as code, reproducible and version-controlled.

#### Model Deployments

| Model | Capability |
|-------|-----------|
| GPT-4o | Multimodal reasoning and generation |
| o3 | Advanced logical reasoning |
| GPT-5 preview | Next-generation capability |

#### Additional Services

- Azure AI Search for RAG vector retrieval
- Managed online endpoints for inference

### H3 Innovation Golden Path Templates

Scaffolding for enterprise AI workloads:

1. **rag-application:** Retrieval-Augmented Generation with Azure AI Search, document ingestion, vector embeddings, and chat interface
2. **multi-agent-system:** Multi-agent orchestration framework with tool use, handoffs, and collaborative reasoning
3. **mlops-pipeline:** End-to-end ML lifecycle: training → evaluation → registry → deployment → monitoring
4. **copilot-extension:** Build custom GitHub Copilot extensions powered by Azure AI services
5. **ai-evaluation-pipeline:** Automated quality, safety, and compliance evaluation of AI model outputs
6. **foundry-agent:** Single-agent applications built on Azure AI Foundry with tool integration
7. **sre-agent-integration:** AI-assisted SRE workflows — incident triage, runbook execution, and root cause analysis

### RAG Application Template

The RAG Golden Path scaffolds a complete Retrieval-Augmented Generation application — from document ingestion pipelines to conversational interfaces — all deployed on the Three Horizons platform with built-in observability.

### Multi-Agent System Template

#### What It Provides

- Orchestrator pattern with specialist sub-agents
- Tool use with MCP server integrations
- Agent handoff protocols and state management
- Collaborative reasoning across agents

#### Use Cases

Customer support systems, code review pipelines, research assistants, automated ops workflows — any scenario where specialization and collaboration yield better outcomes than a single generalist model.

### MLOps Pipeline Template

A fully automated ML lifecycle — from experiment to production inference — with model versioning, automated evaluation gates, and continuous monitoring for model drift and performance degradation.

### AI Evaluation Pipeline

#### Quality Evaluation

Automated scoring of model outputs for relevance, coherence, and groundedness against reference datasets.

#### Safety Evaluation

Detects harmful, biased, or policy-violating content before models are promoted to production.

#### Compliance Gates

Evaluation results act as CI/CD gates — failed evaluations block deployment automatically.

---

## By the Numbers

### Repository Contents

| Metric | Value |
|--------|-------|
| Total Files | 120+ |
| Lines of Code | ~20,000 curated, documented code |
| Terraform Modules | 16 |
| Golden Path Templates | 22 |
| AI Copilot Agents | 17 |
| Prometheus Alerting Rules | 30+ |
| MCP Server Integrations | 13 |

### Platform Benefits

| Metric | Impact |
|--------|--------|
| Deployment Speed | 60% Faster |
| Operational Efficiency | 40% Less Toil |
| Developer Satisfaction | 3x Improvement |
| Compliance Coverage | 100% |

---

## AI Copilot Agents

### 17 Specialized Copilot Chat Agents

Each agent operates directly in VS Code via Copilot Chat — providing guided, context-aware automation with clearly defined roles, tool access, and three-tier behavioral boundaries: **ALWAYS / ASK FIRST / NEVER**.

The complete platform includes 17 specialized agents with 16 operational skills, enabling AI-powered automation across development, deployment, operations, and incident management workflows.

---

## Summary

The **Three Horizons Accelerator v4.0.0** provides a production-ready, enterprise-scale platform engineering solution that:

1. **Establishes a secure, scalable foundation** (H1) with ARO, networking, security, and databases
2. **Enables self-service delivery** (H2) through GitOps, Developer Hub IDP, observability, and 22 golden path templates
3. **Integrates enterprise AI** (H3) with Azure AI Foundry, RAG applications, multi-agent systems, and MLOps pipelines
4. **Automates operations** with 17 specialized Copilot Chat agents and 30+ alerting rules
5. **Ensures compliance and governance** through policy-as-code, mandatory tagging, and comprehensive security controls

Combined, these components deliver:
- **60% faster deployments**
- **40% less operational toil**
- **3x developer satisfaction**
- **100% compliance coverage**

This is a complete reference document for understanding, implementing, and extending the Three Horizons Accelerator framework.

