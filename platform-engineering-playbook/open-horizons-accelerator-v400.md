# Open Horizons Accelerator v4.0

**Enterprise Platform Engineering for Azure: Build, Deploy, and Operate Cloud-Native Applications at Scale with AI-Powered Automation.**

**Created by:** Paula Silva, Software Engineer & Global Black Belt, Latam Leader at Microsoft Americas
- Email: paulasilva@microsoft.com
- Twitter: @paulanunes85 | @paulasilvatech
- LinkedIn: linkedin.com/in/paulanunes

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [The Problem](#the-problem)
3. [The Solution](#the-solution)
4. [By The Numbers](#by-the-numbers)
5. [The Horizons Model](#the-horizons-model)
6. [H1 Foundation: Core Infrastructure](#h1-foundation-core-infrastructure)
7. [H2 Enhancement: Platform Services](#h2-enhancement-platform-services)
8. [H3 Innovation: AI Capabilities](#h3-innovation-ai-capabilities)
9. [AI Agent System](#ai-agent-system)
10. [Automation & Operations](#automation--operations)
11. [Security & Compliance](#security--compliance)
12. [Developer Experience](#developer-experience)
13. [Template Repository](#template-repository)
14. [Deployment & Sizing](#deployment--sizing)

---

## Executive Summary

**You already solve complex problems. Now with Super Powers.**

Open Horizons Accelerator is a complete, opinionated platform accelerator built by Microsoft. It provides everything your engineering team needs in a single GitHub template repository to build a production-grade Internal Developer Platform (IDP) on Azure.

The accelerator packages enterprise field experience into:
- 120+ files with ~20,000 lines of curated, documented code
- 16 production-ready Terraform modules covering every Azure infrastructure layer
- 22 Golden Path templates for self-service scaffolding
- 17 specialized Copilot Chat agents with guided automation in VS Code
- Full observability stack with 30+ alerting rules
- 13 MCP Server integrations
- Zero-trust security architecture with comprehensive identity and access management

**Time to production: Hours, not months.**

---

## The Problem

Modern engineering teams face compounding friction that slows delivery and increases risk.

### Fragmented Tooling
Disconnected tools, inconsistent standards, and no single source of truth prevent teams from moving with velocity.

### Slow Onboarding
New developers take weeks to ship their first change, blocking team velocity and delaying project starts.

### Inconsistent Deployments
Manual processes lead to environment drift and hard-to-reproduce failures, increasing mean time to recovery (MTTR).

### No Observability
Without unified monitoring, incidents are detected late and resolved slowly, impacting system reliability and SLOs.

---

## The Solution

Open Horizons Accelerator addresses these challenges through four pillars:

### Infrastructure as Code
- 16 production-ready Terraform modules for Azure
- Every infrastructure layer pre-configured and version-controlled
- Ready to apply immediately

### GitOps Workflows
- ArgoCD with App-of-Apps pattern
- Sync waves and environment policies
- Declarative, auditable deployment patterns

### Developer Experience
- Backstage IDP with 22 Golden Path templates
- Self-service delivery with zero platform team overhead
- Complete onboarding in under 2 hours

### AI Agents
- 17 specialized Copilot Chat agents
- Guided automation directly in VS Code
- 16 operational skills with validated, safe execution patterns

### Full Observability
- Prometheus, Grafana, Jaeger
- 30+ alerting rules out of the box
- Comprehensive coverage of infrastructure, applications, AI, and security

---

## By The Numbers

| Metric | Value | Description |
|--------|-------|-------------|
| Files | 120+ | Repository file count |
| Code | ~20,000 lines | Curated, documented code |
| Terraform Modules | 16 | Covering every Azure infrastructure layer |
| Golden Path Templates | 22 | Self-service scaffolding for every workload type |
| AI Copilot Agents | 17 | Specialized agents with 16 operational skills |
| Prometheus Alerts | 30+ | Across infrastructure, apps, AI, and security |
| MCP Servers | 13 | Model Context Protocol tool integrations |

---

## The Horizons Model

Open Horizons is structured as a layered architecture — **build confidence at each horizon before advancing to the next**. Each horizon delivers independent value, allowing organizations to adopt progressively as they mature.

```
H3 — Innovation
  AI Capabilities

H2 — Enhancement
  Platform Services

H1 — Foundation
  Core Infrastructure
```

### Deployment Strategy
- **Start with H1** for core infrastructure and baseline security
- **Add H2** when ready for GitOps and self-service developer experience
- **Advance to H3** to unlock enterprise AI capabilities

Each layer builds on the previous, but provides independent operational value.

---

## H1 Foundation: Core Infrastructure

The H1 Foundation layer provisions a production-grade Azure environment using Terraform. It includes AKS, networking, security, databases, container registry, and identity management — everything your platform needs to stand up securely.

### Core Components

| Component | Purpose |
|-----------|---------|
| AKS Cluster | Kubernetes compute layer with multi-pool configuration |
| Networking | VNet, NSGs, Private DNS with zero-trust segmentation |
| Security | Key Vault, Managed Identity, Workload Identity Federation |
| Databases | PostgreSQL Flexible Server, Redis Cache, Cosmos DB (optional) |
| Container Registry | Azure Container Registry with geo-replication and security |
| Monitoring | Defender for Cloud, cost management, CAF naming conventions |

### AKS Cluster Module

**Cluster Capabilities:**
- Workload Identity federation for passwordless authentication
- Azure CNI pod networking for advanced network control
- Private cluster option for enhanced security
- Cluster autoscaler enabled for dynamic scaling

**Node Pool Configuration:**
- **System pool:** Reserved for critical workloads and platform services
- **User pool:** Application workloads with autoscaling enabled
- **GPU pool:** AI/ML inference workloads using GPU acceleration

**Security:**
- Full RBAC integration with Azure AD
- Pod security standards enforced at cluster level
- Network policies for workload isolation

### Networking Module

**Zero-trust network architecture with complete isolation for all PaaS services.**

**Virtual Network & Subnets:**
- Segmented subnets for AKS nodes, pods, private endpoints, and management traffic
- Enforced separation of concerns through subnet boundaries

**Network Security Groups:**
- Granular NSG rules restricting inbound and outbound traffic
- Rules enforced at every subnet boundary
- Least-privilege inbound rules with explicit allow statements

**Private Endpoints & DNS:**
- All PaaS services (Key Vault, ACR, databases) accessed via private endpoints
- Azure Private DNS Zone resolution ensures no public exposure
- No public internet access for any sensitive resource

### Security Module

**Azure Key Vault:**
- Soft delete + purge protection enabled
- Single source of truth for all secrets
- Rotation policies and audit logging

**Managed Identities:**
- Every Azure service uses a managed identity
- No passwords, no service principal secrets in code
- Automatic credential management by Azure

**Workload Identity Federation:**
- GitHub Actions authenticate via OIDC federation
- Kubernetes workloads authenticate to Azure without long-lived credentials
- Zero secrets stored in code or configuration

**RBAC Assignments:**
- Least-privilege role assignments scoped to resource groups
- Follows Azure RBAC best practices
- Regular access reviews and cleanup

### Container Registry Module

**Azure Container Registry (ACR) — Enterprise-grade container registry**

**Features:**
- Geo-replication for multi-region availability and reduced pull latency
- Built-in vulnerability scanning on every image push
- Private endpoint — no public registry exposure
- AKS integration via managed identity (no credentials needed)

**Why This Matters:**
- Geo-replicated images reduce pull latency across regions
- Managed identity pull authentication eliminates leaked registry credential risks
- Built-in scanning catches vulnerabilities before deployment
- Private endpoints ensure no public attack surface

### Databases Module

| Database | Purpose | Configuration |
|----------|---------|----------------|
| PostgreSQL Flexible Server | Backstage IDP backend | Private endpoint, automatic backups, HA for production |
| Redis Cache | Session management and caching | Reduces PostgreSQL load, improves portal responsiveness |
| Cosmos DB (Optional) | Global, low-latency distributed data | Provisioned via Terraform variable flag |

**Access Pattern:**
All database resources are accessed **exclusively via private endpoints** — no public internet exposure in any configuration.

**Sizing for Production:**
- High-availability configuration for critical workloads
- Configurable backup windows and retention policies
- Read replicas for scaling read-heavy workloads

### Microsoft Defender for Cloud

**Runtime Protection:**
- Defender for Containers provides continuous threat detection across AKS
- Alerts on suspicious process activity, privilege escalation, lateral movement
- Real-time response capabilities

**Integrated Security Posture:**
- Container image vulnerability scanning on push
- Runtime threat protection for AKS workloads
- Compliance assessment against CIS benchmarks
- Security recommendations surfaced in Azure portal

### Disaster Recovery

| Component | Strategy | Details |
|-----------|----------|---------|
| Velero Backup & Restore | Cluster state and volume backups | Scheduled backups to Azure Blob Storage |
| Cross-Region Replication | Secondary Azure region setup | Storage accounts and databases configured for geo-redundancy |
| RPO & RTO | Recovery objectives by profile | Dev: best-effort, Prod: strict SLA guarantees |

**Recovery Time Estimates:**
- Data replicated to secondary Azure region automatically
- Recovery objectives explicitly defined per sizing profile
- Rollback procedures documented and tested

### Cost Management & Naming

**Cost Management Module:**
- Azure budgets with threshold alerts
- Automated cost alerts to email and Microsoft Teams
- Mandatory tagging policies on all resources
- Spending analysis dashboards in Grafana

**CAF Naming Module:**
- All Azure resources use Cloud Adoption Framework (CAF) conventions
- Ensures consistency, searchability, and compliance
- Naming applied across all environments and subscriptions
- Automated validation in CI/CD

### H1 Foundation Architecture Summary

```
┌─────────────────────────────────────────────┐
│ H1 Foundation — Core Infrastructure        │
├──────────────────┬──────────────────────────┤
│ AKS              │ Network                  │
│ Production K8s   │ Zero-trust segmentation  │
├──────────────────┼──────────────────────────┤
│ Security         │ ACR                      │
│ Vault + Identity │ Secure image registry    │
├──────────────────┼──────────────────────────┤
│ Databases        │ FinOps                   │
│ PostgreSQL+Redis │ Budget + naming          │
└──────────────────┴──────────────────────────┘
```

**Status:** With H1 deployed, your Azure foundation is secure, observable, and ready for platform services.

---

## H2 Enhancement: Platform Services

The H2 Enhancement layer transforms raw infrastructure into a fully functioning Internal Developer Platform. It adds GitOps, self-service portals, observability, secrets management, and CI/CD runners.

### Core Components

| Component | Purpose |
|-----------|---------|
| ArgoCD | GitOps deployment automation with App-of-Apps pattern |
| Backstage | Internal Developer Portal with 22 Golden Path templates |
| Observability Stack | Prometheus, Grafana, Jaeger, Alertmanager |
| External Secrets | Automatic synchronization from Azure Key Vault |
| GitHub Runners | Self-hosted CI/CD runners with Azure integration |
| Ingress & TLS | NGINX ingress controller with auto-TLS provisioning |

### ArgoCD GitOps

**App-of-Apps Pattern:**
- Single root ArgoCD Application manages all child applications
- Enables ordered, declarative rollout using sync waves
- Complete platform stack deployed through single source of truth

**Environment Sync Policies:**
- **Dev:** Auto-sync — changes deploy immediately for rapid iteration
- **Staging:** Semi-auto — sync requires approval from platform team
- **Production:** Manual — human approval required for every deployment

**Access Control:**
- SSO via Dex with Azure AD integration
- Two RBAC roles enforced:
  - **platform-admin:** Full ArgoCD, Kubernetes, and Terraform access
  - **developer:** Application namespace access, read-only platform views

**GitOps Benefits:**
- Declarative configuration as source of truth
- Complete audit trail of all deployments
- Automated rollback on failed syncs
- Environment consistency guaranteed

### Backstage Internal Developer Portal

**Unified Platform Front Door**

Backstage serves as the central hub where developers discover, scaffold, and operate services without platform team involvement.

**Software Catalog:**
- Centralized registry of every service, API, and component
- Dependency mapping and service ownership
- Integration with GitHub repositories
- Real-time component status and health

**TechDocs:**
- Auto-generated, version-controlled documentation
- Markdown rendered alongside each catalog entity
- Automatically published from every repository
- Always in sync with code

**Golden Path Templates:**
- Self-service scaffolding for 22 curated workload types
- No platform team required — fully automated provisioning
- Complete skeleton code and CI/CD setup
- Best practices embedded in every template

**GitHub Integration:**
- OAuth authentication for seamless GitHub access
- GitHub App integration for repository management
- Workflow access and pull request automation
- Branch protection and code owner enforcement

### 22 Golden Path Templates

Organized across all three horizons. **Each template includes a template.yaml, skeleton code, and documentation.**

#### H1 Foundation Templates (6 templates)

| Template | Purpose |
|----------|---------|
| **basic-cicd** | Bootstrap CI/CD pipelines with GitHub Actions for any project |
| **documentation-site** | Scaffold a TechDocs-ready documentation site with automated publishing |
| **infrastructure-provisioning** | Template for new Terraform modules following organizational standards |
| **new-microservice** | Full-stack microservice with Dockerfile, Helm chart, and CI/CD |
| **security-baseline** | Apply organizational security standards to any existing repository |
| **web-application** | Production-ready web app with ingress, TLS, and observability |

#### H2 Enhancement Templates (9 templates)

| Template | Purpose |
|----------|---------|
| **api-gateway** | API gateway scaffolding with rate limiting, authentication, routing policies |
| **api-microservice** | RESTful API service with OpenAPI spec, validation, auto-generated docs |
| **batch-job** | Kubernetes CronJob template with retry logic and alerting |
| **data-pipeline** | Event-driven data ingestion pipeline with Azure Event Hub integration |
| **event-driven-microservice** | Async messaging patterns with Service Bus or Event Hub integration |
| **gitops-deployment** | ArgoCD Application manifest generator for rapid service onboarding |
| **microservice** | Reusable microservice scaffolding with observability pre-configured |
| **ado-to-github-migration** | Guided migration of Azure DevOps pipelines and repos to GitHub |
| **reusable-workflows** | Shared GitHub Actions workflow library for platform-wide standardization |

#### H3 Innovation Templates (7 templates)

| Template | Purpose |
|----------|---------|
| **ai-evaluation-pipeline** | Automated quality, safety, and compliance evaluation of AI model outputs |
| **copilot-extension** | Build custom GitHub Copilot extensions powered by Azure AI services |
| **foundry-agent** | Single-agent applications built on Azure AI Foundry with tool integration |
| **mlops-pipeline** | End-to-end ML lifecycle: training → evaluation → registry → deployment → monitoring |
| **multi-agent-system** | Multi-agent orchestration framework with tool use, handoffs, collaborative reasoning |
| **rag-application** | Retrieval-Augmented Generation with Azure AI Search, document ingestion, chat interface |
| **sre-agent-integration** | AI-assisted SRE workflows — incident triage, runbook execution, root cause analysis |

### Observability Stack

**Complete monitoring and observability for the entire platform.**

#### Prometheus
- **Replicas:** 2 for high availability
- **Retention:** 15 days of metric history
- **Storage:** 50GB persistent volume
- **Alerting Rules:** 30+ pre-configured rules covering all layers

#### Grafana
- **Authentication:** Azure AD SSO via Dex
- **Dashboards:** 3 curated dashboards out of the box
  - Platform Overview
  - Cost Management
  - Golden Path Application Metrics
- **Visualization:** Time series, heat maps, service topology

#### Alertmanager
- **Routing:** PagerDuty + Microsoft Teams integration
- **Policies:** Silence and inhibit rules for alert deduplication
- **Escalation:** Automatic escalation paths for critical alerts

#### Jaeger Tracing
- **Distributed Tracing:** Request tracing across all microservices
- **Span Analysis:** Latency bottleneck identification
- **Service Dependencies:** Visual service dependency mapping

### Grafana Dashboards

#### Platform Overview Dashboard
- Cluster health and node resource utilization
- Pod status across namespaces
- Network traffic and connection metrics
- Platform team's daily command center

#### Cost Management Dashboard
- Azure spending analysis by resource
- Resource cost attribution by team and namespace
- Optimization recommendations
- Budget tracking and forecasting

#### Golden Path Application Dashboard
- Per-service golden signals for every application
  - Latency (p50, p95, p99)
  - Throughput (requests per second)
  - Error rates and SLO status
  - Saturation metrics
- Namespace-scoped visibility

### 30+ Alerting Rules

**Comprehensive alerting coverage across every platform layer:**

| Category | Alerts | Examples |
|----------|--------|----------|
| Infrastructure | Node pressure, disk utilization, network errors, AKS component health | Node NotReady, MemoryPressure, DiskPressure, PIDPressure |
| Applications | Error rate SLOs, latency thresholds, crash loops, pending deployments | ErrorRate > 1%, p99 latency > 500ms, CrashLoopBackOff |
| AI Workloads | Token quota, inference latency, model endpoint availability, evaluation failures | TokenQuotaExceeded, HighInferenceLatency, ModelOffline |
| GitOps | ArgoCD sync failures, out-of-sync applications, repository health | SyncFailed, ApplicationOutOfSync, RepoUnreachable |
| Security | Defender alerts, policy violations, unusual access patterns, certificate expiry | PrivilegeEscalation, UnusualAccess, CertExpiring |

### External Secrets Operator

**Continuous synchronization of secrets from Azure Key Vault to Kubernetes.**

**Flow:**
```
Azure Key Vault
      ↓
      (Secret sync flow)
      ↓
External Secrets Operator
      ↓
      (Continuously syncs & rotates)
      ↓
Kubernetes Secret
      ↓
      (Consumed by pods at runtime)
```

**Key Features:**
- **ClusterSecretStore pattern** for single source of truth
- **Automatic rotation** of synchronized secrets
- **Zero secrets in Git** — all managed in Key Vault
- **Role-based access control** for secret synchronization
- **Audit logging** of all secret access

### GitHub Self-Hosted Runners

**Why Self-Hosted Runners?**

Self-hosted runners on AKS give CI/CD workflows direct access to private Azure resources — ACR, Key Vault, AKS — **without exposing anything to the public internet**.

**Runner Capabilities:**
- **Deployed via dedicated Terraform module** for consistency
- **Autoscaling based on workflow queue depth** for cost efficiency
- **Network access to all private endpoints** within the VNet
- **Managed identity for Azure authentication** — no credentials in workflow files
- **Ephemeral runners** — clean state per job, no cross-job state pollution

**Security Benefits:**
- No credentials exposed to GitHub (uses managed identity)
- No traffic through public internet for private resource access
- Automatic cleanup after job completion
- Audit trail of runner actions

### Ingress & TLS

**Automatic traffic routing and certificate management.**

| Component | Purpose | Features |
|-----------|---------|----------|
| NGINX Ingress Controller | Routes external traffic to services | Path-based and host-based routing, rate limiting, WAF capabilities |
| cert-manager | TLS certificate provisioning | Auto-provisioning from Let's Encrypt, automatic renewal, no manual management |
| External DNS | Azure DNS integration | Automatically creates/updates DNS records when Ingress resources change |

**Certificate Management:**
- Automatic provisioning from Let's Encrypt
- Automatic renewal before expiry
- Complete elimination of manual certificate management
- Audit trail of all certificate operations

### H2 Enhancement Architecture Summary

```
┌──────────────────────────────────────┐
│ H2 Enhancement — Platform Services   │
├──────────────────┬───────────────────┤
│ ArgoCD GitOps    │ Backstage IDP      │
│ (22 templates)   │ (22 templates)     │
├──────────────────┼───────────────────┤
│ Ingress & TLS    │ Observability      │
│ (NGINX, cert-mgr)│ (Prom, Grafana)    │
├──────────────────┼───────────────────┤
│ CI/CD Runners    │ Secrets Mgmt       │
│ (Self-hosted)    │ (External Secrets) │
└──────────────────┴───────────────────┘
```

**Status:** With H2 deployed, your platform offers full GitOps deployments, self-service developer experience, and complete observability.

---

## H3 Innovation: AI Capabilities

The H3 Innovation layer brings enterprise AI to your platform — Azure AI Foundry, OpenAI model deployments, RAG applications, multi-agent systems, MLOps pipelines, and custom Copilot extensions.

### Azure AI Foundry Module

**Terraform-Managed AI Infrastructure**

The AI Foundry module provisions the complete Azure AI infrastructure as code:
- Hubs and projects for multi-tenant AI operations
- Model deployments with automatic scaling
- Azure AI Search for RAG vector retrieval
- Managed online endpoints for inference

**Model Deployments Available:**
- **GPT-4o:** Multimodal reasoning and generation with vision
- **o3:** Advanced logical reasoning and complex problem solving
- **GPT-5 preview:** Next-generation capability (preview access)

**Additional Services:**
- **Azure AI Search:** For RAG vector retrieval and semantic search
- **Managed Online Endpoints:** Scalable inference with autoscaling
- **Monitoring Integration:** Full observability of model performance

### H3 Golden Path Templates (7 templates)

#### RAG Application Template
**Retrieval-Augmented Generation with Azure AI Search**

Scaffolds a complete RAG application:
- Document ingestion pipelines
- Vector embedding generation
- Semantic search with Azure AI Search
- Conversational chat interface
- Deployed on Open Horizons platform
- Built-in observability and monitoring

**Flow:**
```
Ingest → Embed → Retrieve → Generate
```

#### Multi-Agent System Template
**Multi-agent orchestration framework with tool use and collaborative reasoning**

**What It Provides:**
- Orchestrator pattern with specialist sub-agents
- Tool use with MCP server integrations
- Agent handoff protocols and state management
- Collaborative reasoning across agents
- Error handling and fallback mechanisms

**Use Cases:**
- Customer support systems with specialized agents
- Code review pipelines with multiple analytical perspectives
- Research assistants with delegated tasks
- Automated ops workflows with agent collaboration
- Any scenario where specialization yields better outcomes

#### MLOps Pipeline Template
**End-to-end ML lifecycle automation**

**Pipeline Stages:**
```
Training → Evaluation → Registry → Deployment → Monitoring
```

**Features:**
- Automated model training workflows
- Evaluation gates and performance thresholds
- Model versioning and registry management
- Automated deployment to managed endpoints
- Continuous monitoring for model drift
- Performance degradation alerts

#### AI Evaluation Pipeline
**Automated quality, safety, and compliance evaluation**

**Quality Evaluation:**
- Automated scoring for relevance against reference datasets
- Coherence and semantic correctness assessment
- Groundedness evaluation (faithful to source material)

**Safety Evaluation:**
- Detects harmful, biased, or offensive content
- Policy violation detection
- PII and confidential data identification
- Jailbreak attempt detection

**Compliance Gates:**
- Evaluation results act as CI/CD gates
- Failed evaluations automatically block deployment
- Audit trail of evaluation decisions
- Policy-driven compliance enforcement

#### Copilot Extension Template
**Build custom GitHub Copilot extensions**

Scaffolds extensions powered by Azure AI services:
- Custom context awareness
- Domain-specific intelligence
- Tool integration
- Keyboard shortcuts and UX
- Testing and deployment automation

#### SRE Agent Integration Template
**AI-assisted SRE workflows**

**Capabilities:**
- Incident triage and classification
- Automatic runbook execution
- Root cause analysis assistance
- Remediation recommendations
- Post-incident automation

#### Foundry Agent Template
**Single-agent applications on Azure AI Foundry**

**Features:**
- Built-in tool integration
- Context management
- Conversation history
- Response validation
- Deployment automation

---

## AI Agent System

### 17 Specialized Copilot Chat Agents

All agents operate directly in VS Code via Copilot Chat — providing **guided, context-aware automation** with clearly defined roles, tool access, and three-tier behavioral boundaries: **ALWAYS / ASK FIRST / NEVER**.

Each agent has:
- **Defined scope:** Specific domain of responsibility
- **Tool access:** Curated set of MCP servers and operational skills
- **Behavioral boundaries:** Clear guardrails on what agent can/cannot do
- **Error handling:** Graceful degradation and user notification

### Core Platform Agents (5 agents)

#### @architect
**System design, architecture decision records, and technology selection**

- Guides teams through major architectural choices
- Documents architectural reasoning and constraints
- Reviews proposed architectures for alignment with standards
- Generates Architecture Decision Records (ADRs)
- Tool access: @terraform, design rationale documentation

#### @terraform
**Infrastructure as Code authoring and review**

- Generates Terraform modules and configurations
- Reviews Terraform plans for best practices
- Validates against organizational standards
- Assists with safe apply orchestration
- Tool access: terraform-cli, validation-scripts, compliance checking

#### @devops
**CI/CD pipeline design and deployment strategy**

- GitHub Actions workflow design and optimization
- GitOps configuration and ArgoCD setup
- Deployment strategy guidance
- Multi-environment promotion patterns
- Tool access: github-cli, argocd-cli, deploy-orchestration

#### @platform
**Backstage catalog management and platform configuration**

- Golden Path template creation
- Backstage entity creation and updates
- Platform configuration assistance
- Catalog metadata organization
- Tool access: github-cli, template-scaffold, backstage APIs

#### @deploy
**Deployment orchestration across environments**

- Coordinates full deployment sequence from validation → production
- Supports safe deployment patterns
- Orchestrates rollback procedures
- Monitors deployment status
- Tool access: kubectl-cli, argocd-cli, deploy-orchestration

### Operations Agents (2 agents)

#### @sre
**Incident response and observability analysis**

- First responder for production incidents
- Observability data analysis and interpretation
- Automatic runbook execution
- Post-mortem generation and lessons learned
- Tool access: observability-stack, kubernetes, kubectl-cli

#### @security
**Compliance and security hardening**

- Compliance assessment against standards
- Vulnerability scanning orchestration
- Security policy review
- Hardening guidance and best practices
- Tool access: defender, purview, security-scanning

### Specialized Integration Agents (2 agents)

#### @backstage-expert
**Deep Backstage expertise on AKS**

- Plugin configuration and troubleshooting
- Catalog customization and entity relationships
- Portal scaling and performance optimization
- Custom scaffolder steps
- Tool access: github-cli, kubernetes, backstage APIs

#### @github-integration
**GitHub App configuration and Advanced Security**

- GitHub App setup and permissions
- GitHub Advanced Security (GHAS) enablement
- CodeQL analysis configuration
- Repository automation
- Tool access: github-cli, security-scanning

### Additional Integration Agent (1 agent)

#### @ado-integration
**Azure DevOps integration and migration**

- Azure DevOps pipeline management
- Board integration and tracking
- Migration assistance from ADO to GitHub
- Legacy pipeline transformation
- Tool access: github-cli, deployment automation

### Supporting Agents (4 agents)

#### @docs
**Documentation authoring and maintenance**

- Technical documentation generation
- TechDocs creation and publishing
- ADR assistance and formatting
- Runbook authoring
- Tool access: documentation-gen, github-cli

#### @onboarding
**New team member guidance**

- Prerequisites validation
- Repository setup assistance
- Environment configuration
- First deployment guidance
- Target: Under 2 hours to first live service

#### @template-engineer
**Golden Path template creation**

- New template scaffolding
- Backstage template YAML authoring
- Template testing and validation
- Documentation generation
- Tool access: template-scaffold, github-cli

#### @context-architect
**System context modeling and design support**

- Architectural intent articulation
- Context mapping and domain understanding
- Stakeholder alignment assistance
- Design decision documentation

### Specialized Agent (@hybrid-scenarios)

**GitHub + Azure DevOps coexistence patterns**

- Dual-platform management during migration
- Synchronization patterns
- Credential management across platforms
- Gradual migration strategies

### Agent Review Agent (@reviewer)

**Code review assistance**

- PR analysis and feedback generation
- Security and quality checks
- Best practices identification
- Constructive feedback generation
- Tool access: code-analysis, security-scanning

### Agent Test Agent (@test)

**Test generation and strategy**

- Unit test scaffolding
- Integration test design
- E2E test case generation
- Test strategy definition
- Tool access: test-execution, code-analysis

---

## 16 Operational Skills

Every agent draws from a shared library of operational skills — executable capabilities with validated, safe execution patterns.

### Infrastructure Skills
- **terraform-cli:** Terraform execution and plan analysis
- **azure-cli:** Azure resource management
- **helm-cli:** Kubernetes Helm chart management
- **kubectl-cli:** Kubernetes resource management
- **validation-scripts:** Pre-flight checks and configuration validation

### Platform Skills
- **argocd-cli:** GitOps application management
- **github-cli:** GitHub repository and workflow management
- **deploy-orchestration:** Safe multi-environment deployment
- **template-scaffold:** Golden Path template generation

### Operations Skills
- **observability-stack:** Monitoring and log analysis
- **security-scanning:** Vulnerability and compliance scanning
- **backup-restore:** Disaster recovery automation
- **log-analysis:** Observability data investigation

### Development Skills
- **code-analysis:** Static analysis and code quality
- **test-execution:** Test suite execution and reporting
- **documentation-gen:** Automated documentation generation

---

## 13 MCP Server Configurations

Model Context Protocol servers provide agents with secure, role-based access to tools and platform APIs.

| MCP Server | Purpose | Access Control |
|-----------|---------|-----------------|
| **azure** | Azure resource management and queries | Role-based per environment |
| **github** | Repository, PR, and workflow management | OAuth + GitHub App permissions |
| **terraform** | Terraform execution and state inspection | Plan review before apply |
| **kubernetes** | Cluster resource management | RBAC-aligned with cluster roles |
| **helm** | Chart management and deployments | Namespace-scoped access |
| **docker** | Container image building and registry ops | ACR managed identity auth |
| **defender** | Security alerts and threat analysis | Read-only access |
| **purview** | Governance and compliance metadata | Policy-level visibility |
| **entra** | Azure AD / Entra identity operations | Limited to non-destructive ops |

**Additional MCP Servers:**
- **argocd:** GitOps application deployment
- **backstage:** IDP catalog and operations
- **grafana:** Observability and alerting
- **observability:** Prometheus, Jaeger, log aggregation

**Security Model:**
Each MCP server is configured with **role-based access control** — agents only receive permissions appropriate to their defined scope.

---

## Automation & Operations

### 14+ Automation Scripts

Every script written with **strict mode (`set -euo pipefail`)** — fail fast, fail loudly, never silently continue on errors.

#### Deployment Scripts
- **deploy-full.sh:** End-to-end platform deployment automation
- **platform-bootstrap.sh:** Complete platform initialization

#### Validation Scripts
- **validate-prerequisites.sh:** Confirm tooling, permissions, Azure configuration
- **validate-config.sh:** Validate environment variables and settings
- **validate-deployment.sh:** Post-deployment verification

#### Setup & Migration Scripts
- **setup-github-app.sh:** GitHub App configuration
- **setup-identity-federation.sh:** OIDC federation setup
- **ado-to-github-migration.sh:** Azure DevOps to GitHub migration

### Three Deployment Paths

Flexibility for different operational styles:

#### Path 1: Agent-Guided Deployment
- Use **@deploy** agent in VS Code
- Conversational, step-by-step orchestration
- Validation at each stage
- Interactive approval for critical operations
- **Best for:** Learning, team alignment, complex environments

#### Path 2: Automated Script Deployment
- Run **deploy-full.sh**
- Fully automated deployment with prerequisite checks
- Automatic rollback on failure
- Unattended execution possible with prerequisites met
- **Best for:** CI/CD integration, consistent deployments

#### Path 3: Manual Terraform
- Traditional `terraform init / plan / apply`
- Full control over each resource
- Custom integration into existing pipelines
- **Best for:** Advanced users, exceptional configurations

### Deployment Time Estimates

| Environment | Time | Characteristics |
|-------------|------|-----------------|
| Dev | 75-105 minutes | Minimal footprint, fast iteration |
| Staging | 100-130 minutes | Production-like configuration |
| Prod | 130-175 minutes | Full HA, DR, and compliance |

**Includes:** Terraform provisioning, ArgoCD bootstrapping, Backstage initialization, full observability stack startup. Agent-guided and script deployments run in parallel where Azure allows.

### 4 Sizing Profiles

#### Small
- **1 AKS cluster**
- **3 nodes (D2s_v5)**
- **Use case:** Dev/test workloads, single environment
- **Estimated cost:** $200-300/month

#### Medium
- **1 AKS cluster**
- **5 nodes (D4s_v5) with autoscaling**
- **Use case:** Small production teams, staging environments
- **Estimated cost:** $600-800/month

#### Large
- **Multiple node pools (system, user, GPU)**
- **GPU nodes for AI/ML workloads**
- **Private cluster configuration**
- **HA PostgreSQL and Redis**
- **Use case:** Multi-team production, AI-heavy workloads
- **Estimated cost:** $1500-2500/month

#### XLarge
- **Multi-region active-active setup**
- **Disaster recovery failover region**
- **Geo-replication for all data stores**
- **Azure Front Door for global load balancing**
- **Use case:** Global enterprises, strict SLA requirements
- **Estimated cost:** $3500+/month

### Region Strategy

Deployment patterns configured via variables to match compliance requirements:

| Region | Use Case | Key Characteristics |
|--------|----------|-------------------|
| **Brazil South** | LGPD compliance primary | Data residency required for Brazilian customers, regional AI services |
| **East US 2** | AI-heavy workloads | Full Azure AI service availability, GPU availability |
| **South Central US** | LATAM compromise | Balances data sovereignty with AI service access |
| **West US 2** | Disaster recovery | Cross-region replication target, failover destination |

**Patterns:**
- **brazil-centric:** Primary in Brazil South, DR in South Central US
- **multi-latam:** Primary in South Central US, DR in Brazil South
- **us-based:** Primary in East US 2, DR in West US 2

### Policy as Code

#### Kubernetes Policies

**OPA Gatekeeper enforces security at admission time** — blocking non-compliant workloads before they reach the cluster.

Policies cover:
- Container image registries (only internal ACR allowed)
- Resource limits (memory, CPU minimum requirements)
- Privilege escalation prevention (no privileged containers)
- Namespace labels (required metadata)

#### Terraform Policies

**tfsec: Static analysis of Terraform plans**
- Detects security misconfigurations
- Validates Azure resource configurations
- Blocks deployment of high-risk patterns

**Sentinel: Policy-as-code in Terraform Cloud/Enterprise**
- Enforces organizational standards
- Requires approval for policy violations
- Audit trail of policy enforcement

**CI/CD Integration:**
- PRs with policy violations are blocked automatically
- Prevents non-compliant resources from being deployed
- Audit logs maintained for compliance

---

## Security & Compliance

### Zero Trust Architecture

**Core Principle:** No implicit trust. Every service-to-service communication is authenticated.

**No Public Endpoints in Production**
- All Azure PaaS services hidden from public internet
- Only application ingress exposed via NGINX
- Management access via private endpoints or bastion hosts

### Private Endpoints Everywhere

All sensitive Azure services accessed exclusively via private endpoints:
- **Key Vault:** Secret and key management
- **ACR:** Container image registry
- **Databases:** PostgreSQL, Redis, Cosmos DB
- **Storage:** Blob, file, queue storage
- **All PaaS services** accessed through private endpoints within VNet

**DNS Resolution:**
- Azure Private DNS Zone handles resolution
- No DNS leakage to public resolvers
- Automatic DNS records managed by Terraform

### Pod Security Standards

**Restricted Pod Security Standards enforced at namespace level:**
- No privileged containers in any environment
- No host network access
- No unsafe syscalls
- Read-only root filesystem required
- No root user execution

**Enforcement:**
- Admission webhooks validate all pod creations
- Policy violations trigger pod rejection
- Audit logs capture violation attempts

### Network Segmentation

**Azure CNI with NSG-enforced least-privilege flows:**
- AKS subnets isolated from management subnets
- Pod-to-pod communication controlled via network policies
- Egress rules explicit (deny-by-default pattern)
- No cross-namespace communication without policy

---

## Identity & Access Management

### Workload Identity Federation

**Every Azure service authenticates without long-lived credentials:**

**GitHub Actions:**
- OIDC federation with GitHub
- No personal access tokens or secrets
- Audience: GitHub repository
- Automatic token exchange via Azure

**Kubernetes Workloads:**
- OIDC federation with AKS
- Pods authenticate directly to Azure
- Managed identity on each workload
- Automatic credential refresh

**Benefits:**
- Zero long-lived service principal secrets
- Automatic credential rotation
- Complete audit trail of authentication
- No credential storage in code

### Managed Identities

**Azure Service Managed Identities:**
Every Azure service authenticates using managed identities:
- **AKS:** For cluster-to-Azure resource communication
- **ACR:** For image pulling and pushing
- **Key Vault:** For secret retrieval
- **Databases:** For SQL authentication

**Key Benefits:**
- No passwords in configuration
- Automatic credential management by Azure
- Least-privilege role assignments per resource
- Built-in audit logging

### Azure AD / Entra SSO

**Developer and Operator Authentication:**
- Grafana uses Azure AD SSO via Dex
- ArgoCD uses Azure AD for authentication
- Backstage uses OAuth with GitHub + Azure AD
- Developers use corporate identity everywhere

**Single Sign-On Benefits:**
- No separate password for platform tools
- Centralized access control
- Audit trail in Entra logs
- Automatic offboarding when users leave

---

## Secret Management

**Single source of truth for all secrets with automatic rotation:**

```
Dev Commit → Azure Key Vault → External Secrets Operator → Kubernetes Secret → Pod Runtime
```

**Secrets never appear in:**
- Git repositories (committed or in history)
- Container images
- Environment variable definitions
- Application logs

**Synchronization:**
- External Secrets Operator continuously syncs from Key Vault
- Automatic rotation on schedule
- Pods immediately receive updated secrets
- No restart required for rotation

---

## Security Scanning Stack

Comprehensive scanning at every layer:

| Scanner | Purpose | Timing |
|---------|---------|--------|
| **Trivy** | Container image vulnerabilities | Every push to ACR, blocks critical CVEs |
| **tfsec** | Terraform configuration security | Pre-apply in PR checks |
| **gitleaks** | Secret detection in Git | Pre-commit hooks + PR checks |
| **Microsoft Defender** | Runtime threat detection | Continuous monitoring in cluster |
| **GHAS** | GitHub Advanced Security | CodeQL, dependency review, secret scanning |

**Blocking Policies:**
- High/critical vulnerabilities block ACR push
- tfsec violations block Terraform apply
- Secret detection blocks Git commits
- Evaluation failures block AI model deployment

---

## RBAC Model

### Least Privilege by Design

Every role assignment scoped to minimum required permissions:
- No broad Owner or Contributor roles in production
- No service principal permissions at subscription level
- All roles explicitly defined per resource
- Regular access reviews and cleanup

### Role Definitions

| Role | Permissions | Scope |
|------|-----------|-------|
| **platform-admin** | Full ArgoCD, Kubernetes, Terraform access | Cluster and management resources |
| **developer** | Application namespace access, read-only platform views | Application namespaces only |
| **reader** | View-only access to cluster and platform | All resources, no modification |

### RBAC Alignment

- **Kubernetes RBAC:** Aligned with Azure AD group membership
- **Azure RBAC:** Managed identity roles + group assignments
- **GitHub RBAC:** Teams correspond to Kubernetes namespaces
- **Backstage:** Permissions plugin enables fine-grained catalog access

---

## Developer Experience

### Self-Service Developer Portal

**Backstage gives every developer a unified front door — no Slack messages to platform team, no waiting for manual provisioning.**

#### Discover Services
- Browse the software catalog
- Understand dependencies and ownership
- Find API documentation
- View service health and deployment status

#### Scaffold New Services
- Select a Golden Path template
- Fill in configuration parameters
- Get a production-ready repository in minutes
- Automatic GitHub repo creation
- CI/CD wired up and running

#### Monitor Health
- View deployment status across environments
- See recent CI/CD runs and build logs
- Monitor service health and SLOs
- Access service dashboards and logs
- All from one unified interface

### The Golden Path Workflow

**From template selection to live, observable, production-ready service — without any platform team involvement.**

```
1. Select Template
   ↓
2. Fill Parameters
   ↓
3. Scaffold Repo (GitHub Actions triggered)
   ↓
4. ArgoCD Sync (automatic deployment)
   ↓
5. Service Live (complete with observability)
```

**Time to live:** 5-10 minutes for a new microservice.

### Documentation as Code

#### TechDocs in Backstage
- MkDocs-based documentation
- Auto-published from every repository
- Always in sync with code
- Searchable within Backstage catalog

#### Architecture Decision Records (ADRs)
- Version-controlled alongside code
- Generated with assistance from @architect agent
- Searchable in Backstage
- Complete architectural history

#### Operational Runbooks
- 7 runbooks covering:
  - Deployment procedures
  - Incident response
  - Rollback procedures
  - Disaster recovery
  - Node replacement
  - Emergency procedures
  - Performance tuning
- Linked from Backstage service entities
- Executable via agents

### Onboarding in Under 2 Hours

#### Step 1: Prerequisites Check
- @onboarding validates required tools (git, GitHub CLI, Terraform, kubectl)
- Verifies Azure permissions
- Checks local environment setup

#### Step 2: Environment Configuration
- Customize sizing profile (Small, Medium, Large, XLarge)
- Select deployment region (Brazil South, East US 2, etc.)
- Configure feature flags (AI, observability level)
- Set organizational naming conventions

#### Step 3: Repository Setup
- Fork the template repository
- Configure environment variables
- Set up GitHub App for automation
- Enable required workflows

#### Step 4: First Deployment
- Deploy H1 Foundation (core infrastructure)
- Access live platform with full observability
- Deploy sample application from Golden Path template
- Verify metrics and logs in Grafana

---

## Template Repository

### How to Use This Template

1. **Fork the Repository**
   - Use as a GitHub template
   - Configure environment variables
   - Set organization-specific secrets

2. **Validate Prerequisites**
   - Run `validate-prerequisites.sh`
   - Confirm tooling: terraform, azure-cli, kubectl, helm
   - Verify Azure subscriptions and permissions

3. **Deploy H1 Foundation**
   - Provision core Azure infrastructure
   - Create AKS cluster, networking, security
   - Set up databases and container registry
   - Estimated time: 75-105 minutes

4. **Deploy H2 Enhancement**
   - Install ArgoCD and Backstage
   - Deploy observability stack
   - Set up CI/CD runners and ingress
   - Estimated time: 25-50 minutes additional

5. **Optionally Deploy H3**
   - Enable Azure AI Foundry
   - Deploy model endpoints
   - Unlock AI Golden Path templates
   - Estimated time: 15-30 minutes additional

**Total time to production-grade platform: 115-175 minutes**

Each horizon delivers independent value. Start with H1 for core infrastructure, add H2 for developer experience, optionally add H3 for AI capabilities.

### Version History

| Version | Release Date | Key Additions |
|---------|-------------|----------------|
| **v1.0** | Sep 2024 | Initial foundational template structure |
| **v2.0** | Jan 2025 | Azure Terraform modules, GitHub Actions CI/CD pipelines |
| **v3.0** | Jun 2025 | Open Horizons architecture, ArgoCD GitOps, Backstage IDP |
| **v4.0** | Dec 2025 | AI capabilities, 22 templates, 17 agents, full observability stack |

**Evolution:**
- Each major version brought step-change in capability
- v4.0 represents culmination of one year of enterprise field experience
- Distilled into single template repository ready for production use

---

## Deployment & Operations Summary

### Prerequisites (Before Deploying)
- Azure subscription with sufficient quota
- Terraform >= 1.5
- kubectl >= 1.28
- Azure CLI >= 2.50
- GitHub account with permissions to create repositories

### Three Deployment Paths

| Path | Method | Best For |
|------|--------|----------|
| Agent-Guided | VS Code @deploy agent | Learning, team alignment |
| Automated | deploy-full.sh script | CI/CD integration, consistency |
| Manual Terraform | terraform init/plan/apply | Advanced users, custom setups |

### Sizing & Regions

**Choose sizing profile:**
- Small (dev/test)
- Medium (small production)
- Large (multi-team production)
- XLarge (global enterprise)

**Choose primary region:**
- Brazil South (LGPD compliance)
- East US 2 (AI services)
- South Central US (LATAM compromise)
- West US 2 (DR secondary)

### Platform Capabilities by Horizon

| Capability | H1 | H2 | H3 |
|-----------|-----|-----|-----|
| Infrastructure as Code | ✓ | ✓ | ✓ |
| AKS Cluster | ✓ | ✓ | ✓ |
| Networking & Security | ✓ | ✓ | ✓ |
| Databases | ✓ | ✓ | ✓ |
| GitOps (ArgoCD) | | ✓ | ✓ |
| Developer Portal (Backstage) | | ✓ | ✓ |
| Golden Path Templates (22) | | ✓ | ✓ |
| Observability Stack | | ✓ | ✓ |
| CI/CD Runners | | ✓ | ✓ |
| Azure AI Foundry | | | ✓ |
| AI Agents (17) | | | ✓ |
| RAG Applications | | | ✓ |
| MLOps Pipelines | | | ✓ |

---

## The Future of Platform Engineering Is Here

**Open Horizons Accelerator is open source and ready to use today.**

### Get Started Now
1. Fork the repository
2. Customize for your organization
3. Deploy via agent, script, or manual Terraform
4. Go from zero to production-grade Internal Developer Platform in hours — not months

### Complete Feature Set
- **Azure + Terraform:** 16 production-ready Infrastructure as Code modules
- **ArgoCD + Backstage:** GitOps and self-service developer portal
- **17 Copilot Agents:** AI-guided operations in VS Code
- **Open Source:** Fork, customize, contribute back to the community

### Enterprise-Ready
- Comprehensive security (zero-trust, RBAC, secrets management)
- Full observability (Prometheus, Grafana, Jaeger)
- Policy as code (OPA Gatekeeper, tfsec, Sentinel)
- Disaster recovery and high availability
- Multi-region deployment support
- AI capabilities for modern applications

---

## Appendix: Architecture Layers

### H1 Foundation Modules
1. **aks** - Kubernetes cluster with multiple node pools
2. **vnet** - Virtual network with zero-trust segmentation
3. **nsg** - Network Security Groups for traffic control
4. **acr** - Container Registry with geo-replication
5. **keyvault** - Secrets management with soft delete
6. **postgresql** - Managed PostgreSQL Flexible Server
7. **redis** - In-memory caching layer
8. **cosmosdb** - Optional globally distributed database
9. **bastion** - Management bastion host
10. **monitoring** - Defender for Cloud integration
11. **backup** - Velero backup and restore
12. **naming** - CAF naming conventions
13. **budgets** - Cost management and alerts
14. **identities** - Managed identities for all services
15. **federation** - Workload Identity Federation
16. **frontdoor** - Optional global load balancer

### H2 Platform Modules
1. **argocd** - GitOps deployment automation
2. **backstage** - Internal Developer Portal
3. **observability** - Prometheus, Grafana, Jaeger stack
4. **ingress** - NGINX with automatic TLS
5. **runners** - Self-hosted GitHub Actions
6. **secrets** - External Secrets Operator integration
7. **dex** - OIDC federation for portal SSO
8. **policies** - OPA Gatekeeper admission control

### H3 AI Modules
1. **ai-foundry** - Azure AI Foundry hub and projects
2. **model-endpoints** - Managed online endpoints
3. **ai-search** - Azure AI Search for RAG
4. **mlops** - ML experiment tracking and registry

---

**Last Updated:** December 2025 (v4.0)

**Open Source Repository:** Ready to fork and customize for your enterprise

**Estimated Time to Production:** 2-3 hours for complete platform deployment with all three horizons
