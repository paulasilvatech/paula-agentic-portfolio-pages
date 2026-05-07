---
title: "Technical Architecture, Agentic Framework for COBOL & Legacy Modernization"
description: "Five-layer reference architecture, MCP integration, multi-agent orchestration patterns, governance framework, and Azure service mapping for AI-driven legacy modernization"
author: "Paula Silva"
role: "Software Global Black Belt"
contact: "paulasilva@microsoft.com"
date: "2026-03-13"
version: "2.0.0"
status: "approved"
locale: "en"
series_number: "06"
tags: ["architecture", "agentic AI", "MCP", "Claude Opus 4.6", "Azure AI Foundry", "GitHub", "Semantic Kernel", "governance", "agents"]
related_documents:
  - "01_Market_Trends_Predictions.md"
  - "02_Legacy_Modernization_Strategy_Guide.md"
  - "03_AI_Driven_Modernization_Claude_Opus_Analysis.md"
  - "04_Comprehensive_Assessment_Framework.md"
  - "05_Agentic_COBOL_Modernization_Strategy_Business_Case.md"
  - "07_Operational_Playbook_Carving_Performance_Coexistence.md"
  - "08_Customer_FAQ_Agentic_Modernization.md"
  - "09_Comparative_Analysis_Kyndryl_vs_Our_Strategy.md"
  - "10_Comparative_Analysis_Generated_vs_Source_Materials.md"
---

# Technical Architecture, Agentic Framework for COBOL & Legacy Modernization

> Five-layer reference architecture detailing how Claude models (Opus 4.6, Sonnet 4.6, Haiku 4.5) are orchestrated through GitHub Copilot, Azure AI Foundry, MCP, and Semantic Kernel to deliver enterprise-grade legacy modernization with full governance.

## Change Log

| Version | Date       | Author      | Changes         |
|---------|------------|-------------|-----------------|
| 2.0.0   | 2026-03-13 | Paula Silva | Major update: Gartner/IDC validation of multi-agent architecture and operational governance; added citations G00822558, G00827372, G00822567, G00844741, G00825163, US54300026 |
| 1.2.0   | 2026-03-12 | Paula Silva | Renumbered as Doc 06 in 10-document strategy series; updated all cross-references to new numbering |
| 1.1.0   | 2026-03-12 | Paula Silva | Added Jira/Work Item MCP server, Temporal/LangGraph dual orchestration pattern, Starter Catalog concept, A2A protocol support, incorporating field intelligence from Kyndryl competitive analysis |
| 1.0.0   | 2026-03-12 | Paula Silva | Initial version |

## Table of Contents

- [1. Architecture Principles](#1-architecture-principles)
- [2. Five-Layer Reference Architecture](#2-five-layer-reference-architecture)
  - [2.1 Layer 1: Core (Developer Interface)](#21-layer-1--core-developer-interface)
  - [2.2 Layer 2: Agents (Multi-Model Orchestration)](#22-layer-2--agents-multi-model-orchestration)
  - [2.3 Layer 3: MCP Tools (Enterprise Connectors)](#23-layer-3--mcp-tools-enterprise-connectors)
  - [2.4 Layer 4: Platform & Security](#24-layer-4--platform--security)
  - [2.5 Layer 5: Perimeter (External Interfaces)](#25-layer-5--perimeter-external-interfaces)
- [3. Multi-Model Integration](#3-multi-model-integration)
  - [3.1 Model Assignment by Task](#31-model-assignment-by-task)
  - [3.2 Model Router Configuration](#32-model-router-configuration)
  - [3.3 Token Optimization Strategy](#33-token-optimization-strategy)
- [4. MCP Deep Dive, The Eight Servers](#4-mcp-deep-dive--the-eight-servers)
  - [4.1 What Is MCP](#41-what-is-mcp)
  - [4.2 GitHub API Server](#42-github-api-server)
  - [4.3 Azure DevOps Server](#43-azure-devops-server)
  - [4.4 Backstage / Service Catalog Server](#44-backstage--service-catalog-server)
  - [4.5 Database Server](#45-database-server)
  - [4.6 Vault / Secrets Server](#46-vault--secrets-server)
  - [4.7 Observability Server](#47-observability-server)
  - [4.8 Custom MCP Server](#48-custom-mcp-server)
  - [4.9 Jira / Work Item Tracking Server](#49-jira--work-item-tracking-server)
- [5. Agent Orchestration Patterns](#5-agent-orchestration-patterns)
  - [5.1 Pattern 1, Hierarchical Orchestration](#51-pattern-1--hierarchical-orchestration)
  - [5.2 Pattern 2, Event-Driven (GitHub Actions)](#52-pattern-2--event-driven-github-actions)
  - [5.3 Pattern 3, Multi-Agent Handoff](#53-pattern-3--multi-agent-handoff)
  - [5.4 Choosing the Right Pattern](#54-choosing-the-right-pattern)
  - [5.5 Pattern 4, Deterministic Workflow (Temporal + LangGraph)](#55-pattern-4--deterministic-workflow-temporal--langgraph)
- [6. Specialized Agent Design](#6-specialized-agent-design)
  - [6.1 Discovery Agent](#61-discovery-agent)
  - [6.2 Analysis Agent](#62-analysis-agent)
  - [6.3 Translation Agent](#63-translation-agent)
  - [6.4 Test Generation Agent](#64-test-generation-agent)
  - [6.5 Review Agent](#65-review-agent)
  - [6.6 Security Agent](#66-security-agent)
  - [6.7 Deployment Agent](#67-deployment-agent)
  - [6.8 Starter Catalog, Prebuilt Agent Templates](#68-starter-catalog--prebuilt-agent-templates)
- [7. GitHub Platform Integration](#7-github-platform-integration)
  - [7.1 GitHub Copilot Agent Mode and SDK](#71-github-copilot-agent-mode-and-sdk)
  - [7.2 GitHub Coding Agent](#72-github-coding-agent)
  - [7.3 GitHub Actions and Agentic Workflows](#73-github-actions-and-agentic-workflows)
  - [7.4 GitHub Advanced Security](#74-github-advanced-security)
- [8. Azure AI Foundry Configuration](#8-azure-ai-foundry-configuration)
  - [8.1 Model Deployment](#81-model-deployment)
  - [8.2 Foundry Agent Service](#82-foundry-agent-service)
  - [8.3 Monitoring and Observability](#83-monitoring-and-observability)
- [9. Governance Framework](#9-governance-framework)
  - [9.1 Six Governance Dimensions](#91-six-governance-dimensions)
  - [9.2 Three-Tier Permission Matrix](#92-three-tier-permission-matrix)
  - [9.3 Hook System](#93-hook-system)
  - [9.4 Modernization Guardrails](#94-modernization-guardrails)
- [10. Azure Service Mapping](#10-azure-service-mapping)
- [11. Protocol Interoperability, A2A and MCP](#11-protocol-interoperability--a2a-and-mcp)
- [12. MCP Maturity and AgentOps](#12-mcp-maturity-and-agentops)
  - [12.1 MCP Adoption in Enterprise Agentic Orchestration](#121-mcp-adoption-in-enterprise-agentic-orchestration)
  - [12.2 AgentOps Capabilities Required](#122-agentops-capabilities-required)
  - [12.3 HITL Agentic Workflows](#123-hitl-human-in-the-loop-agentic-workflows)
- [References](#references)

## 1. Architecture Principles

The architecture follows five guiding principles, validated by Gartner research on agentic AI governance and modernization workflows [Gartner G00822558, G00827372]:

**Multi-model by design**, No single model handles all tasks. Opus analyzes, Sonnet translates, Haiku scans. The [Model Router](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/model-router) optimizes cost automatically.

**Human-in-the-loop at decision points**, Agents execute autonomously for routine tasks but pause at approval gates for architecture decisions, production deployments, and security-sensitive operations. This aligns with Gartner's research on "productizing levels of autonomy" [Gartner G00844741], where graded autonomy builds organizational trust in AI systems.

**Enterprise governance first**, Every agent action is logged, permissioned, and auditable. Identity flows through [Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/identity/). Secrets are in [Azure Key Vault](https://learn.microsoft.com/en-us/azure/key-vault/general/overview).

**Incremental and reversible**, Every modernization step produces a reviewable artifact (PR, test report, documentation). Every deployment can roll back.

**Platform-native integration**, Uses GitHub and Azure native services (Actions, Copilot, Foundry, AKS, Service Bus) rather than custom infrastructure.

## 2. Five-Layer Reference Architecture

### 2.1 Layer 1: Core (Developer Interface)

The developer interface layer provides the human touchpoint for the entire modernization pipeline:

**GitHub Copilot in IDE**, Developers interact with Claude models through [GitHub Copilot Agent Mode](https://github.blog/news-insights/company-news/pick-your-agent-use-claude-and-codex-on-agent-hq/) in VS Code, JetBrains, or the GitHub web interface. The model picker allows selecting Claude Opus 4.6 or Sonnet 4.6 for specific tasks.

**Claude Code CLI**, For power users and automation, [Claude Code](https://docs.anthropic.com/en/docs/claude-code/mcp) provides a terminal-based interface with MCP integration, allowing direct connection to enterprise systems.

**GitHub Copilot SDK**, For custom agent extensions, the Copilot SDK enables building specialized interfaces tailored to modernization workflows (e.g., a COBOL analysis dashboard, a migration progress tracker).

**AGENTS.md / CLAUDE.md**, Configuration files in the repository root that provide persistent instructions to Claude about the project's conventions, architecture, and modernization rules.

### 2.2 Layer 2: Agents (Multi-Model Orchestration)

The agent layer implements the intelligence of the modernization pipeline. The multi-agent architecture is directly validated by Gartner research on AI-native software engineering [Gartner G00822558 Figure 3], which identifies a five-agent workflow pattern: Specification → Architecture → Code Generation → Verification → Deployment agents, each with their own LLM.

**Orchestrator (Claude Opus 4.6)**, The primary reasoning engine. Receives high-level modernization tasks, decomposes them into subtasks, assigns subtasks to worker agents, consolidates results, and makes architectural recommendations. Uses the full 1M token context window for holistic codebase understanding. Implements the decisioning loop component of Gartner's agent anatomy [G00827372]: Perception → Decisioning → Actioning.

**Worker agents (Claude Sonnet 4.6)**, Execute specific tasks: code translation, test generation, documentation writing, PR creation. Each worker has a focused scope and clear input/output contract.

**Scanner agents (Claude Haiku 4.5)**, Handle high-volume, low-complexity tasks: syntax validation, pattern matching, triage classification, CI/CD checks. Optimized for speed and cost efficiency.

Orchestration is managed by [Microsoft Semantic Kernel](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/) using its built-in agent patterns: Sequential (step-by-step pipeline), Handoff (agent-to-agent delegation), and Group Chat (collaborative multi-agent reasoning). Multi-agent systems (MAS) provide measurable benefits: robustness and resilience through agent redundancy, reliability through result comparison across agents, and architectural reuse through specialized agent composition [Gartner G00827372].

### 2.3 Layer 3: MCP Tools (Enterprise Connectors)

The [Model Context Protocol (MCP)](https://modelcontextprotocol.io/specification/2025-06-18) provides standardized connections between agents and enterprise systems. Eight MCP servers form the integration backbone:

1. **GitHub API Server**, Repository access, PR management, issue tracking
2. **Azure DevOps Server**, Pipeline orchestration, work item management
3. **Backstage / Service Catalog Server**, Service discovery, ownership mapping
4. **Database Server**, Schema introspection, data sampling, query execution
5. **Vault / Secrets Server**, Credential retrieval, certificate management
6. **Observability Server**, Metrics, logs, traces from Azure Monitor
7. **Custom MCP Server**, Customer-specific integrations (mainframe connectors, legacy APIs)
8. **Jira / Work Item Tracking Server**, User story management, sprint tracking, status synchronization

Each server exposes tools that agents can invoke. MCP handles authentication, rate limiting, and response formatting. See [Section 4](#4-mcp-deep-dive--the-eight-servers) for details on each server.

### 2.4 Layer 4: Platform & Security

The platform layer provides the runtime environment and security boundary:

**Azure AI Foundry**, Hosts Claude models via serverless deployment. Provides [Model Router](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/model-router) for intelligent model selection, Foundry IQ for dynamic RAG, and Fleet Management for model versioning.

**Microsoft Entra ID**, Identity provider for all agents and users. RBAC policies control which agents can access which resources.

**Azure Key Vault**, Stores all secrets, API keys, and certificates. Agents retrieve credentials through the Vault MCP server, never storing secrets locally.

**Azure Monitor**, Centralized logging, metrics, and alerting. Every agent action is logged with structured metadata (agent ID, task ID, model used, tokens consumed, duration).

**Azure Policy / Defender for Cloud**, Compliance enforcement and security posture management.

### 2.5 Layer 5: Perimeter (External Interfaces)

The perimeter layer manages interactions with systems outside the modernization platform:

**Customer mainframe**, Source COBOL code accessed via secure file transfer, mainframe API adapters, or Git-based repositories.

**[LeanIX](https://docs-vsm.leanix.net/changelog/leanix-now-integrates-with-github-and-azure-pipelines)**, Enterprise architecture repository providing service catalog, dependency maps, and DORA metrics integration.

**Azure target services**, AKS, Azure Functions, Azure SQL, Cosmos DB, Service Bus, the runtime targets for modernized applications.

**Notification channels**, Slack, Microsoft Teams, email, for human notifications from agent hooks.

## 3. Multi-Model Integration

### 3.1 Model Assignment by Task

| Modernization Task | Primary Model | Fallback | Rationale |
|--------------------|--------------|----------|-----------|
| Full-application code analysis | Opus 4.6 |, | Requires 1M token context for holistic understanding |
| Business rule extraction | Opus 4.6 | Sonnet 4.6 | Complex reasoning across multiple modules |
| Dependency mapping | Opus 4.6 | Sonnet 4.6 | Cross-file analysis with deep context |
| COBOL-to-Java translation | Sonnet 4.6 |, | Balanced cost/quality for code generation |
| COBOL-to-.NET translation | Sonnet 4.6 |, | Same rationale |
| Test case generation | Sonnet 4.6 |, | Structured output, moderate complexity |
| Documentation generation | Sonnet 4.6 | Haiku 4.5 | Writing quality needs, moderate cost |
| PR review | Sonnet 4.6 |, | Code understanding + judgment |
| Syntax validation | Haiku 4.5 |, | Speed-critical, simple pattern matching |
| Triage classification | Haiku 4.5 |, | High volume, low complexity |
| CI/CD gate checks | Haiku 4.5 |, | Fast, deterministic checks |
| Architecture decisions | Opus 4.6 + Human |, | Strategic decisions require human approval |

### 3.2 Model Router Configuration

The [Azure AI Foundry Model Router](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/model-router) provides automatic model selection based on request characteristics. Configuration for the modernization pipeline:

- Requests tagged `analysis` or `architecture` → route to Opus 4.6
- Requests tagged `translate` or `generate` → route to Sonnet 4.6
- Requests tagged `scan` or `validate` → route to Haiku 4.5
- Untagged requests → Model Router auto-selects based on complexity estimation

The Model Router achieves up to 40% token savings by routing simple requests to smaller, cheaper models without developer intervention.

### 3.3 Token Optimization Strategy

Token consumption is the primary cost driver. Optimization strategies include:

**Context window management**, Use Opus (1M tokens) only when full-application context is needed. For module-level tasks, use Sonnet with targeted context (10K-100K tokens).

**Prompt caching**, Cache frequently used system prompts (modernization rules, coding standards, architecture guidelines) to reduce per-request token overhead.

**Incremental analysis**, For large applications, perform initial triage with Haiku, deep analysis with Opus only on high-priority modules, and translation with Sonnet on approved modules.

**Batch processing**, Group related small tasks (syntax checks, naming validations) into batched Haiku requests to reduce API call overhead.

## 4. MCP Deep Dive, The Eight Servers

### 4.1 What Is MCP

The [Model Context Protocol (MCP)](https://modelcontextprotocol.io/specification/2025-06-18) is an open protocol that provides a standardized way for AI agents to connect to external data sources and tools. Think of it as a "USB for AI agents", a universal connector that allows any MCP-compatible agent to access any MCP-compatible tool without custom integration code.

In the modernization architecture, MCP servers are the bridge between Claude agents and enterprise systems. Each server exposes a set of tools (functions the agent can call), resources (data the agent can read), and prompts (pre-configured instructions for common tasks).

### 4.2 GitHub API Server

**Purpose:** Repository and code management operations.

**Tools exposed:** `read_file`, `search_code`, `create_branch`, `create_pull_request`, `list_issues`, `add_comment`, `merge_pr`, `get_diff`.

**Modernization use cases:** Reading COBOL source files, creating feature branches for modernized code, opening PRs with translated code, linking modernization issues to commits, reviewing PR diffs.

### 4.3 Azure DevOps Server

**Purpose:** Pipeline orchestration and work item tracking.

**Tools exposed:** `trigger_pipeline`, `get_pipeline_status`, `create_work_item`, `update_work_item`, `get_build_logs`.

**Modernization use cases:** Triggering build/test pipelines after translation, tracking modernization work items, correlating agent activities with project management.

### 4.4 Backstage / Service Catalog Server

**Purpose:** Service discovery and ownership mapping.

**Tools exposed:** `get_service`, `list_dependencies`, `get_owner`, `get_api_spec`, `search_catalog`.

**Modernization use cases:** Understanding which team owns each COBOL module, mapping dependencies between services, identifying API contracts that modernized services must honor. Integrates with [LeanIX for enterprise architecture](https://docs-vsm.leanix.net/changelog/leanix-now-integrates-with-github-and-azure-pipelines).

### 4.5 Database Server

**Purpose:** Schema introspection and data context.

**Tools exposed:** `get_schema`, `describe_table`, `sample_data`, `execute_query` (read-only), `get_relationships`.

**Modernization use cases:** Understanding legacy data structures (VSAM layouts, Adabas schemas, DB2 tables), generating target database schemas, validating data migration mappings.

### 4.6 Vault / Secrets Server

**Purpose:** Secure credential management.

**Tools exposed:** `get_secret`, `list_secrets`, `rotate_credential`.

**Modernization use cases:** Retrieving mainframe connection credentials, accessing API keys for target services, managing database connection strings, all without exposing secrets in agent context or logs.

### 4.7 Observability Server

**Purpose:** Runtime metrics and monitoring.

**Tools exposed:** `get_metrics`, `query_logs`, `get_traces`, `create_alert`, `get_dashboard`.

**Modernization use cases:** Comparing performance metrics between legacy and modernized systems, monitoring agent pipeline health, detecting anomalies in modernized application behavior. Connects to [Azure Monitor and Application Insights](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview).

### 4.8 Custom MCP Server

**Purpose:** Customer-specific integrations that do not fit standard servers.

**Implementation:** Built using the MCP SDK (TypeScript or Python). Customers implement their own tools for mainframe-specific access patterns (e.g., CICS transaction monitoring, JCL parsing, mainframe file transfer).

**Modernization use cases:** Reading COBOL source directly from mainframe PDS libraries, accessing customer-specific configuration management systems, integrating with proprietary testing frameworks.

### 4.9 Jira / Work Item Tracking Server

**Purpose:** Bidirectional integration with Jira, Azure Boards, or other work item tracking systems for automatic user story management.

**Tools exposed:** `create_story`, `update_status`, `link_pr_to_story`, `get_sprint`, `create_subtasks`, `get_acceptance_criteria`, `transition_status`.

**Modernization use cases:** When the Translation Agent generates modernized code, the Jira MCP server automatically creates user stories with acceptance criteria derived from the extracted business rules. As agents complete tasks (PR created, tests passed, review approved), the server updates story status in real-time. This closes the loop between AI-driven modernization execution and project management visibility, stakeholders see progress without requiring manual updates.

**Integration pattern:** The orchestrator agent triggers `create_story` during planning, worker agents call `update_status` as they complete tasks, and the deployment agent calls `transition_status` when code reaches staging or production.

## 5. Agent Orchestration Patterns

Multi-agent orchestration patterns balance autonomy with human oversight. Gartner's agentic modernization research [G00822567] identifies a nine-step workflow that underpins all orchestration patterns: (1) Generate plan → (2) Validate plan with human → (3) Retrieve information → (4) Identify code/artifacts → (5) Validate changes with human → (6) Make changes file-by-file → (7) Review against standards → (8) Run tests and fix → (9) Create PR for review. The patterns below implement variations of this core workflow.

### 5.1 Pattern 1, Hierarchical Orchestration

**Flow:** Trigger → Opus Orchestrator → Sonnet/Haiku Workers → MCP Tools → Consolidation → Human Review.

The Opus orchestrator receives a high-level task (e.g., "analyze and translate module PAYROLL-CALC"), decomposes it into subtasks (read source, map dependencies, extract business rules, translate, generate tests), assigns each subtask to the appropriate worker model, collects results, synthesizes a unified output, and presents it for human review.

**Best for:** Complex, multi-step modernization tasks requiring holistic reasoning.

**Semantic Kernel pattern:** Sequential Agent with Handoff to specialized workers.

### 5.2 Pattern 2, Event-Driven (GitHub Actions)

**Flow:** GitHub Event → [Agentic Workflow](https://github.blog/ai-and-ml/automate-repository-tasks-with-github-agentic-workflows/) → Agent Execution → Result → PR/Issue Update.

Events in the GitHub repository trigger agent executions: a new issue labeled `modernize` triggers the discovery agent, a PR with COBOL changes triggers the review agent, a merged PR triggers the test generation agent. Each agent runs in a sandboxed GitHub Actions environment.

**Best for:** Continuous modernization integrated into the development workflow.

**Semantic Kernel pattern:** Event-triggered Sequential Agent.

### 5.3 Pattern 3, Multi-Agent Handoff

**Flow:** Triage Agent → Modernization Agent → Code Agent → Review Agent → Security Agent → Deploy Agent.

A chain of specialized agents where each agent completes its task and hands off to the next. The triage agent classifies the component, the modernization agent plans the approach, the code agent translates, the review agent validates, the security agent scans, and the deploy agent packages.

**Risk mitigation:** Poorly orchestrated agents can collide and create vicious loops ("agent anarchy") [Gartner G00825163]. Mitigation requires proper planning, explicit handoff protocols, and centralized supervision to ensure each agent's outputs align with downstream expectations.

**Hallucination gates:** Multi-agent workflows compound hallucination risk, each agent's errors propagate downstream [Gartner G00822558]. Implement validation gates between handoffs, particularly after code generation and before deployment.

**Best for:** High-volume modernization with standardized workflows (factory model).

**Semantic Kernel pattern:** Handoff Agent with defined routing.

### 5.4 Choosing the Right Pattern

| Criteria | Hierarchical | Event-Driven | Multi-Agent Handoff |
|----------|:------------:|:------------:|:-------------------:|
| Complex reasoning required | Best | Limited | Moderate |
| High volume / factory model | Limited | Good | Best |
| CI/CD integration | Manual | Native | Moderate |
| Human oversight granularity | High | Per-event | Per-handoff |
| Cost efficiency | Higher (Opus) | Medium | Optimized (right model per step) |

Most enterprises will use a **combination**: hierarchical for initial assessment (Wave 2), event-driven for continuous integration (Wave 2-3), and multi-agent handoff for scaled modernization (Wave 3).

### 5.5 Pattern 4, Deterministic Workflow (Temporal + LangGraph)

**Flow:** LangGraph (dynamic reasoning) → Temporal (deterministic execution) → Azure Foundry (deployment).

Some modernization tasks require deterministic, repeatable execution, regulatory compliance workflows, auditable transformation pipelines, and batch processing sequences where every step must execute identically every time. This pattern implements an OODA-inspired autonomous improvement loop [Gartner G00822558 Figure 4]: Observe (LangGraph reasoning) → Orient (architecture decision) → Decide (policy selection) → Act (Temporal execution).

**LangGraph**, Handles the dynamic, reasoning-intensive phases: code analysis, dependency discovery, architecture recommendations, and business rule extraction. These tasks benefit from the AI's ability to adapt its approach based on what it finds.

**Temporal**, Handles the deterministic, repeatable phases: code translation execution, test suite runs, deployment sequencing, and compliance checkpoints. Temporal workflows are versioned, auditable, and replay-capable, critical for regulated industries.

**Temporal Adapters for Azure Foundry**, Temporal workflows can be exported to Azure AI Foundry Agent Service using adapters that translate Temporal workflow definitions into Foundry-native orchestration. This allows organizations that standardize on Azure to run deterministic workflows without maintaining a separate Temporal infrastructure.

| Phase | Orchestrator | Why |
|-------|-------------|-----|
| Discovery and analysis | LangGraph | Requires adaptive reasoning |
| Translation pipeline | Temporal | Must be deterministic and auditable |
| Test execution | Temporal | Repeatable, versioned test runs |
| Deployment sequencing | Temporal → Azure Foundry | Deterministic with cloud-native integration |
| Architecture decisions | LangGraph + Human | Complex reasoning with human approval |

**Best for:** Regulated industries (banking, insurance, government) where audit trails and deterministic execution are compliance requirements.

## 6. Specialized Agent Design

Each specialized agent implements Gartner's agent anatomy [G00827372]: a primary execution loop (Perception → Decisioning → Actioning), secondary adaptation loop (Knowledge + Adaptability), and tertiary planning/control loop (Agency). Learning agents add causal inferencing, reinforcement learning, and simulation capabilities.

### 6.1 Discovery Agent

**Model:** Claude Haiku 4.5 (initial scan) + Claude Opus 4.6 (deep analysis)

**MCP servers used:** GitHub API, Database, Backstage

**Inputs:** Repository path, file patterns (*.cbl, *.cpy, *.jcl, *.nat)

**Outputs:** Application inventory, dependency graph, complexity scores, business rule catalog

**Actions:** Scans entire codebase, identifies COBOL programs and copybooks, traces CALL dependencies, maps JCL job flows, catalogs data structures, produces machine-readable inventory in JSON + human-readable report in Markdown.

### 6.2 Analysis Agent

**Model:** Claude Opus 4.6

**MCP servers used:** GitHub API, Database, Observability

**Inputs:** Application inventory from Discovery Agent, production metrics

**Outputs:** Modernization priority matrix, risk assessment, target architecture recommendation

**Actions:** Analyzes each application against prioritization criteria (business criticality, technical complexity, AI suitability, dependency coupling), recommends modernization strategy (refactor, rearchitect, replace), proposes sequencing, estimates effort.

### 6.3 Translation Agent

**Model:** Claude Sonnet 4.6

**MCP servers used:** GitHub API, Database

**Inputs:** COBOL source module, target language specification, coding standards

**Outputs:** Translated code (Java/.NET/Python), mapping documentation

**Actions:** Translates COBOL logic to target language preserving business semantics, generates inline documentation, produces mapping files linking source to target constructs, creates PR with translated code. Does NOT inject any proprietary SDK, output is standard, idiomatic target language code.

### 6.4 Test Generation Agent

**Model:** Claude Sonnet 4.6

**MCP servers used:** GitHub API, Database

**Inputs:** Original COBOL source, translated code, sample data

**Outputs:** Unit tests, integration tests, behavioral equivalence tests

**Actions:** Generates test suites that validate the translated code produces identical outputs to the original COBOL for the same inputs. Creates test data fixtures, edge case tests, and boundary condition tests. Targets minimum 85% code coverage.

### 6.5 Review Agent

**Model:** Claude Sonnet 4.6

**MCP servers used:** GitHub API

**Inputs:** PR diff, coding standards, modernization rules

**Outputs:** Review comments, approval/rejection recommendation

**Actions:** Reviews translated code for correctness, idiom compliance, performance patterns, and adherence to target architecture standards. Flags potential issues and suggests improvements. Posts review comments directly on the PR.

### 6.6 Security Agent

**Model:** Claude Haiku 4.5 (scan) + Claude Sonnet 4.6 (analysis)

**MCP servers used:** GitHub API (Advanced Security), Vault

**Inputs:** Translated code, dependency manifest

**Outputs:** Security scan results, vulnerability report

**Actions:** Scans for hardcoded secrets, SQL injection, XSS, insecure dependencies. Validates that no PII or secrets leaked from COBOL data definitions into code. Integrates with [GitHub Advanced Security](https://docs.github.com/en/get-started/learning-about-github/about-github-advanced-security) for CodeQL analysis.

### 6.7 Deployment Agent

**Model:** Claude Haiku 4.5

**MCP servers used:** Azure DevOps, Observability

**Inputs:** Approved PR, deployment configuration, target environment

**Outputs:** Deployment manifest, rollback plan

**Actions:** Generates Kubernetes manifests or Azure deployment configurations, triggers CI/CD pipeline, monitors deployment health, creates rollback plan. Does NOT deploy to production without human approval (Tier 3 permission gate).

### 6.8 Starter Catalog, Prebuilt Agent Templates

To accelerate time-to-value, the framework includes a starter catalog of prebuilt agent configurations for common modernization scenarios. Each starter template packages a tested combination of agent roles, MCP server connections, orchestration patterns, and governance rules:

| Starter Template | Scope | Agents Included | Typical LOC |
|-----------------|-------|-----------------|-------------|
| **COBOL Batch Modernization** | JCL + batch COBOL → Azure Batch/Functions | Discovery, Analysis, Translation (Java), Test Gen, Deployment | 5K-50K |
| **CICS Online Transaction** | CICS programs → AKS microservices + REST APIs | Discovery, Analysis, Translation (Java/.NET), Test Gen, Review, Security | 2K-20K |
| **Natural/Adabas Migration** | Natural programs + Adabas → Azure SQL + microservices | Discovery (with Adabas schema reader), Analysis, Translation, Test Gen | 5K-30K |
| **Report Modernization** | COBOL report programs → Power BI + Azure Functions | Discovery, Analysis, Translation (Python), Test Gen | 1K-10K |
| **Data Migration** | VSAM/DB2/Adabas → Azure SQL/Cosmos DB | Discovery (schema focus), Analysis, Data Migration Agent | N/A (data) |
| **Full Estate Assessment** | Complete COBOL estate → prioritized roadmap | Discovery, Analysis | Unlimited |

Each template is customizable, teams start with the closest match and adjust agent configurations, MCP connections, and governance rules to their specific needs. The templates encode proven patterns from successful modernization engagements, reducing the setup time from weeks to days.

Templates are stored as AGENTS.md configurations in a shared GitHub repository, versioned and maintained as the framework evolves.

## 7. GitHub Platform Integration

### 7.1 GitHub Copilot Agent Mode and SDK

[GitHub Copilot Agent Mode](https://github.blog/news-insights/company-news/pick-your-agent-use-claude-and-codex-on-agent-hq/) enables Claude models to operate as autonomous agents within the IDE. Key capabilities for modernization:

- **Multi-file editing**, Claude can modify multiple files in a single session, essential for cross-cutting modernization changes
- **Terminal access**, Agents can run build commands, execute tests, and validate translations directly
- **Model selection**, Developers choose Claude Opus 4.6 for deep analysis or Sonnet 4.6 for translation tasks
- **AGENTS.md**, Repository-level configuration that instructs Claude about modernization conventions

The **Copilot SDK** enables building custom Copilot Extensions that provide modernization-specific interfaces beyond the standard chat.

### 7.2 GitHub Coding Agent

The [GitHub Copilot Coding Agent](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent) operates autonomously in GitHub Actions to complete development tasks assigned through issues. For modernization:

- Assign an issue: "Translate PAYROLL-CALC.cbl to Java"
- The coding agent creates a branch, translates the code, runs tests, and opens a PR
- Self-review capabilities validate the output before requesting human review
- Built-in security scanning ensures no vulnerabilities in generated code

### 7.3 GitHub Actions and Agentic Workflows

[GitHub Agentic Workflows](https://github.blog/ai-and-ml/automate-repository-tasks-with-github-agentic-workflows/) (technical preview) enable automation defined in plain Markdown rather than YAML. A modernization workflow example:

**Trigger:** Issue created with label `modernize`

**Steps:** (1) Discovery agent scans the referenced COBOL module, (2) Analysis agent produces priority assessment, (3) If approved, Translation agent generates target code, (4) Test agent creates test suite, (5) Review agent validates output, (6) Security agent scans for vulnerabilities, (7) PR created for human review.

Execution is sandboxed with read-only repository access by default. Write operations (branch creation, PR) require explicit permission.

### 7.4 GitHub Advanced Security

Integrates with the Security Agent to provide: CodeQL analysis of generated code, secret scanning to prevent credential leaks, dependency review for third-party vulnerabilities, and Dependabot for automated security updates of translated application dependencies.

## 8. Azure AI Foundry Configuration

Azure AI Foundry is positioned as an **agent development platform** within Gartner's four-category agent platform landscape [G00825163]: prebuilt agents (business users), no-code builders (citizen developers), development platforms (developers), and training platforms (AI experts). This architecture assumes organizations with platform engineering and AI expertise using the development platform model.

### 8.1 Model Deployment

[Claude models in Azure AI Foundry](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/how-to/use-foundry-models-claude) are deployed as serverless endpoints. Configuration:

- **Claude Opus 4.6**, Deploy with 1M token context window. Enable prompt caching for system prompts.
- **Claude Sonnet 4.6**, Deploy with standard context. Configure for code generation workloads.
- **Claude Haiku 4.5**, Deploy with low-latency configuration. Optimize for high-throughput scanning.

All deployments support Zero Data Retention (ZDR), customer code is not stored or used for training. Content Filters are applied by default. API access via Anthropic SDKs (Python, TypeScript, C#, Java, PHP).

### 8.2 Foundry Agent Service

Key capabilities for modernization:

**[Model Router](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/model-router)** (GA), Automatically selects optimal model per request. Up to 40% token savings.

**Foundry IQ** (Preview), Dynamic RAG that grounds agent responses in customer documentation (system design documents, coding standards, architecture blueprints).

**Fleet Management**, Manages multiple model deployments, versioning, and A/B testing of different model configurations.

**Routing Profiles**, Custom rules that route specific request patterns to designated model deployments.

**[Semantic Kernel](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/) integration**, Native support for Semantic Kernel agent patterns (Sequential, Handoff, Group Chat) with built-in middleware for logging and policy enforcement.

**Copilot Studio**, Low-code interface for building and deploying agents without custom code.

### 8.3 Monitoring and Observability

All agent activity is monitored through [Azure Monitor](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview):

- **Token consumption** per model, per agent, per task, for cost tracking
- **Latency** per request, for performance optimization
- **Error rates**, for reliability monitoring
- **Agent action log**, structured log of every tool call, MCP request, and output
- **Modernization KPIs**, LOC processed, translation success rate, test coverage achieved

## 9. Governance Framework

Governance of agentic AI systems must embed five critical capabilities [Gartner G00844741, "5 Agentic AI Capabilities That Turn Autonomy Into Adoption", Jan 2026]:
1. **Productize levels of autonomy**, Graded autonomy builds trust (Tier 1/2/3 gates below)
2. **Treat workflows as living value assets**, Version, monitor, and improve orchestration patterns
3. **Design explicitly for human+AI collaboration**, Approval gates at decision points
4. **Engineer for low cognitive load**, Developers and operators meet the agents where they work (IDE, GitHub, Azure portal)
5. **Embed CS best practices into runtime**, Telemetry, drift detection, validation gates

### 9.1 Six Governance Dimensions

| Dimension | Implementation | Azure Service |
|-----------|---------------|---------------|
| **Identity** | Every agent has a managed identity | Microsoft Entra ID |
| **Permissions** | RBAC + MCP-level tool access control | Entra ID + MCP config |
| **Audit** | Structured logging of all agent actions | Azure Monitor + Log Analytics |
| **Approval Gates** | Human approval required at defined checkpoints | GitHub PR approvals |
| **Cost Control** | Per-model rate limiting, budget alerts | Azure Budgets + Foundry quotas |
| **Content Safety** | PII/secret detection, responsible AI guardrails | Azure AI Content Safety |

### 9.2 Three-Tier Permission Matrix

| Tier | Agent Role | Allowed Actions | Prohibited Actions |
|------|-----------|----------------|--------------------|
| **Tier 1: Sub-agent** | Scanner, validator | Read repository, read database (schema only), read metrics | Write to any system, create branches, modify data |
| **Tier 2: Worker** | Translator, test generator, reviewer | All Tier 1 + create branches, create PRs, write test files, post review comments | Merge PRs, deploy to any environment, modify production data |
| **Tier 3: Orchestrator** | Pipeline coordinator | All Tier 2 + coordinate workers, trigger pipelines, create issues | Direct production deployment, delete branches, modify access controls |

**Critical constraint:** No agent at any tier can deploy to production without explicit human approval through a GitHub PR review.

### 9.3 Hook System

Four hook types enforce governance without manual intervention:

**Pre-action hooks**, Execute before an agent takes an action. Example: verify that a translation PR has at least 85% test coverage before allowing the Review Agent to approve.

**Post-action hooks**, Execute after an agent completes an action. Example: notify the team Slack/Teams channel when a translation is completed and a PR is ready for review.

**Guardrail hooks**, Continuously active during agent execution. Example: scan all agent outputs for PII (CPF numbers, account numbers) and secrets (API keys, passwords) before allowing any write operation.

**Escalation hooks**, Trigger when an agent encounters a situation it cannot resolve. Example: if translation confidence is below 70%, create a GitHub issue for human review instead of proceeding.

### 9.4 Modernization Guardrails

| Category | Rule | Action |
|----------|------|--------|
| **Green (automated)** | Complexity score ≤5, high test coverage, no external dependencies | Agent proceeds autonomously |
| **Yellow (needs approval)** | Complexity score 6-7, moderate test coverage, external API dependencies | Agent pauses, requests human review |
| **Red (prohibited without testing)** | Complexity score >7, low test coverage, critical system, regulatory component | Full manual review required before any automated action |

## 10. Azure Service Mapping

Complete mapping of mainframe components to Azure target services:

| Function | Legacy | Azure Target | Integration Pattern |
|----------|--------|-------------|-------------------|
| Online transactions | CICS | [AKS microservices](https://learn.microsoft.com/en-us/azure/architecture/example-scenario/mainframe/extend-mainframe-applications) + [API Management](https://learn.microsoft.com/en-us/azure/api-management/api-management-howto-deploy-multi-region) | REST APIs with canary deployment |
| Batch processing | JCL / batch | [Azure Batch](https://learn.microsoft.com/en-us/azure/architecture/example-scenario/mainframe/reengineer-mainframe-batch-apps-azure) / Azure Functions / Logic Apps | Event-driven or scheduled |
| Message queuing | MQ Series | [Azure Service Bus](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-federation-patterns) | Topics + subscriptions |
| Data storage (relational) | DB2 | Azure SQL | Schema migration + CDC |
| Data storage (hierarchical) | IMS DB / Adabas | Cosmos DB (document model) | Schema redesign |
| File storage | VSAM / ISAM | Azure Blob Storage + Azure SQL | ETL migration |
| Transaction monitoring | CICS monitors | [Application Insights](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview) + Azure Monitor | OpenTelemetry |
| Job scheduling | CA7 / TWS | Azure Logic Apps / Azure Automation | Cron or event triggers |
| Security | RACF / ACF2 | Microsoft Entra ID + Key Vault + Defender | Zero Trust |
| Traffic routing |, | [Azure Front Door](https://learn.microsoft.com/en-us/azure/frontdoor/routing-methods) (weighted routing) | [Strangler Fig](https://learn.microsoft.com/en-us/azure/architecture/patterns/strangler-fig) |
| Data sync (coexistence) |, | [Change Data Capture](https://www.confluent.io/use-case/liberate-mainframe-data/) | CDC + Service Bus |
| Source control | PDS / Endevor | GitHub | Git migration |
| CI/CD | Manual / custom | [GitHub Actions](https://github.blog/ai-and-ml/automate-repository-tasks-with-github-agentic-workflows/) | Agentic workflows |
| Architecture catalog |, | [LeanIX](https://docs-vsm.leanix.net/changelog/leanix-now-integrates-with-github-and-azure-pipelines) + Backstage | MCP integration |

## 11. Protocol Interoperability, A2A and MCP

### 11.1 Agent-to-Agent (A2A) Protocol

The [Google A2A (Agent-to-Agent) protocol](https://google.github.io/A2A/) enables interoperability between agents built on different frameworks. In the modernization context, A2A support means:

**Multi-vendor agent collaboration**, Agents built with Semantic Kernel (Microsoft), LangGraph (LangChain), or other frameworks can participate in the same modernization pipeline through standardized A2A communication.

**Partner agent integration**, System integrators and ISVs can contribute specialized agents (e.g., a mainframe-specific data extraction agent) that communicate with the core modernization agents via A2A, without requiring adoption of the same orchestration framework.

**Agent discovery**, A2A's agent card mechanism allows agents to advertise their capabilities, enabling dynamic composition of modernization pipelines based on available agent capabilities.

### 11.2 MCP + A2A Complementarity

MCP and A2A serve complementary purposes:

| Protocol | Purpose | Analogy |
|----------|---------|---------|
| **MCP** | Agent ↔ Tool communication | USB (connecting devices) |
| **A2A** | Agent ↔ Agent communication | HTTP (connecting services) |

An agent uses MCP to access enterprise tools (GitHub, Jira, databases) and A2A to communicate with other agents. Both protocols are open standards, avoiding vendor lock-in.

In the modernization architecture, this means the Semantic Kernel orchestrator can coordinate agents via A2A while each agent accesses tools via MCP, creating a fully interoperable, multi-vendor modernization ecosystem.

## 12. MCP Maturity and AgentOps

### 12.1 MCP Adoption in Enterprise Agentic Orchestration

The Model Context Protocol is gaining significant traction for multi-agent orchestration, agent connectivity, and distributed state management [IDC #US54300026, "2026 Ushers in Deeper Maturity in the Agentic Era", Feb 2026]. Key drivers:

- **Agent-to-tool standardization**, MCP eliminates custom integration code, reducing deployment time and technical debt.
- **Vendor independence**, MCP servers from different vendors (GitHub, Atlassian, AWS, Azure, custom) work seamlessly with any MCP-compatible agent.
- **Distributed state management**, MCP resources and tools naturally distribute state across enterprise systems, avoiding centralized state bottlenecks.
- **Multi-vendor agent collaboration**, Combined with A2A protocols, MCP enables agents from different frameworks (Semantic Kernel, LangGraph, custom) to participate in the same pipeline.

### 12.2 AgentOps Capabilities Required

Managing agentic AI systems at scale requires new operational capabilities [IDC #US54300026]:

| Capability | Purpose | Implementation in this Architecture |
|-----------|---------|-----------------------------------|
| **Model/Agent Selection** | Choose optimal model for each task | Azure AI Foundry Model Router + routing profiles |
| **Tracking** | Monitor agent actions, decisions, tool calls | Azure Monitor + structured event logging |
| **Evaluation** | Validate agent outputs against quality criteria | Automated test gates + human review checkpoints |
| **Governance** | Control and audit agent permissions across diverse AI technologies | RBAC + MCP tool access control + approval hooks |

These capabilities are essential as organizations move beyond isolated chatbots to fleet-scale agentic systems where dozens of agents coordinate across hundreds of enterprise tools.

### 12.3 HITL (Human-In-The-Loop) Agentic Workflows

Human oversight is evolving from "chatbot oversight" to structured approval gates within deterministic workflows. Emerging patterns [Gartner G00822558]:

- **GitHub**, Coding agents with human PR review gates
- **Lovable**, AI-driven design with human validation loops
- **Replit**, Autonomous IDE agents with developer checkpoints
- **StackBlitz**, Agent-assisted infrastructure provisioning with approval gates

The modernization architecture implements this pattern through approval gates in the three-tier permission matrix and OODA-inspired workflows where agents observe/orient, humans decide, agents act.

## Document Series Navigation

| # | Document | Status |
|---|----------|--------|
| 1 | 01_Market_Trends_Predictions.md |  |
| 2 | 02_Legacy_Modernization_Strategy_Guide.md |  |
| 3 | 03_AI_Driven_Modernization_Claude_Opus_Analysis.md |  |
| 4 | 04_Comprehensive_Assessment_Framework.md |  |
| 5 | 05_Agentic_COBOL_Modernization_Strategy_Business_Case.md |  |
| **6** | **06_Technical_Architecture_Agentic_Framework.md** | **← You are here** |
| 7 | 07_Operational_Playbook_Carving_Performance_Coexistence.md |  |
| 8 | 08_Customer_FAQ_Agentic_Modernization.md |  |
| 9 | 09_Comparative_Analysis_Kyndryl_vs_Our_Strategy.md |  |
| 10 | 10_Comparative_Analysis_Generated_vs_Source_Materials.md |  |

## References

### Gartner Research
- **[Gartner G00822558]** "Innovation Insight for Software Global Black Belting" (Jan 2025), Validates multi-agent workflow pattern (Specification → Architecture → Code Generation → Verification → Deployment), OODA-inspired autonomous loops, HITL integration patterns, and compounded hallucination risks in multi-agent systems.
- **[Gartner G00827372]** "When to Use or Not to Use AI Agents" (Jun 2025), Defines agent anatomy (Perception → Decisioning → Actioning + Knowledge + Adaptability + Agency loops), MAS benefits (robustness, reliability, reuse), and single vs. multiagent criteria.
- **[Gartner G00822567]** "Assessing GenAI for Modernizing Legacy Application Code" (Dec 2024), Details 9-step agentic modernization workflow: plan → validate → retrieve → identify → validate → change → review → test → PR review.
- **[Gartner G00844741]** "5 Agentic AI Capabilities That Turn Autonomy Into Adoption" (Jan 2026), Establishes five critical governance capabilities: productized autonomy levels, living workflows, human+AI collaboration, low cognitive load, embedded CS best practices.
- **[Gartner G00825163]** "Innovation Insight for the AI Agent Platform Landscape" (Mar 2025), Categorizes four agent platform types (prebuilt, no-code, development, training) and identifies agent anarchy risks requiring proper orchestration and supervision.

### IDC Research
- **[IDC #US54300026]** "2026 Ushers in Deeper Maturity in the Agentic Era" (Feb 2026), Validates MCP adoption for multi-agent orchestration and state management, defines AgentOps capabilities (model selection, tracking, evaluation, governance), and identifies maturation of HITL workflows across industry platforms.

### Microsoft & Anthropic Documentation
- [Model Context Protocol (MCP) Specification](https://modelcontextprotocol.io/specification/2025-06-18)
- [Azure AI Foundry, Claude Models](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/how-to/use-foundry-models-claude)
- [Azure AI Foundry, Model Router](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/model-router)
- [Microsoft Semantic Kernel, Agent Framework](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/)
- [GitHub Copilot Agent Mode](https://github.blog/news-insights/company-news/pick-your-agent-use-claude-and-codex-on-agent-hq/)
- [GitHub Copilot Coding Agent](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent)
- [GitHub Agentic Workflows](https://github.blog/ai-and-ml/automate-repository-tasks-with-github-agentic-workflows/)
- [Claude Code MCP Documentation](https://docs.anthropic.com/en/docs/claude-code/mcp)
- [Anthropic, Tool Use and Model Context Protocol](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use)
- [Azure Architecture, Strangler Fig Pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/strangler-fig)
- [Azure Architecture, Extend Mainframe Applications](https://learn.microsoft.com/en-us/azure/architecture/example-scenario/mainframe/extend-mainframe-applications)
- [Azure Architecture, Reengineer Mainframe Batch Apps](https://learn.microsoft.com/en-us/azure/architecture/example-scenario/mainframe/reengineer-mainframe-batch-apps-azure)
- [Azure Front Door, Routing Methods](https://learn.microsoft.com/en-us/azure/frontdoor/routing-methods)
- [Azure Service Bus, Federation Patterns](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-federation-patterns)
- [Azure Monitor, Application Insights](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)
- [LeanIX, GitHub and Azure Pipelines Integration](https://docs-vsm.leanix.net/changelog/leanix-now-integrates-with-github-and-azure-pipelines)
- [Google A2A, Agent-to-Agent Protocol](https://google.github.io/A2A/)
- [BIAN, Banking Industry Architecture Network](https://bian.org/)
- [Temporal, Durable Execution Platform](https://temporal.io/)
- [LangGraph, Agent Orchestration](https://langchain-ai.github.io/langgraph/)
