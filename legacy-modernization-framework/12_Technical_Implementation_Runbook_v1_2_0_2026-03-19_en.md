---
title: "Technical Implementation Runbook, Agentic COBOL & Legacy Modernization"
description: "Complete step-by-step technical guide for executing AI-driven legacy modernization, covering five-layer architecture, specialized agents, MCP integration, application carving, performance assurance, coexistence, testing, governance, and the full journey from assessment to factory model"
author: "Paula Silva"
role: "Software Global Black Belt"
contact: "paulasilva@microsoft.com"
date: "2026-03-19"
version: "1.2.0"
status: "approved"
locale: "en"
series_number: "12"
tags: ["runbook", "technical", "COBOL", "Natural", "architecture", "MCP", "agents", "carving", "performance", "coexistence", "testing", "governance", "Claude Opus 4.6", "Azure AI Foundry", "GitHub"]
---

# Technical Implementation Runbook, Agentic COBOL & Legacy Modernization

> The complete step-by-step technical guide for executing AI-driven legacy modernization using Claude models on Azure AI Foundry + GitHub, from assessment through factory-model scale. This is the HOW document: every phase, every agent, every decision gate, every threshold.

## Change Log

| Version | Date       | Author      | Changes         |
|---------|------------|-------------|-----------------|
| 1.0.0   | 2026-03-13 | Paula Silva | Initial version, consolidated technical runbook integrating architecture, agents, MCP, operational playbook, testing strategy, governance, and end-to-end workflow. All metrics traceable to 14 Gartner/IDC analyst sources. |
| 1.1.0   | 2026-03-16 | Paula Silva | Updated to align with source documents v2.0.0: added Brazil enterprise legacy landscape, regulatory forcing functions, AI cost equation analysis, shadow traffic testing procedures, vendor independence assurance, and additional Gartner/IDC market metrics and citations. |
| 1.2.0   | 2026-03-19 | Paula Silva | Replaced ASCII art timeline with professional SVG diagram (Microsoft 4-color palette). Added new visuals: Five-Layer Architecture stack, Orchestration Patterns comparison, 10-Step Workflow pipeline, Strangler Fig Coexistence Architecture. All visuals saved as standalone SVGs in output/images/svg/. |

---

## Table of Contents

- [1. Runbook Overview, The Complete Journey](#1-runbook-overview--the-complete-journey)
- [1.1 Brazil Enterprise Legacy Landscape](#11-brazil-enterprise-legacy-landscape)
- [1.2 Regulatory Forcing Functions](#12-regulatory-forcing-functions)
- [1.3 How AI Flips the Cost Equation](#13-how-ai-flips-the-cost-equation)
- [1.4 Four AI Capabilities That Change the Game](#14-four-ai-capabilities-that-change-the-game)
- [1.5 What AI Does NOT Replace](#15-what-ai-does-not-replace)
- [2. Five-Layer Reference Architecture](#2-five-layer-reference-architecture)
  - [2.1 Layer 1: Core (Developer Interface)](#21-layer-1--core-developer-interface)
  - [2.2 Layer 2: Agents (Multi-Model Orchestration)](#22-layer-2--agents-multi-model-orchestration)
  - [2.3 Layer 3: MCP Tools (Enterprise Connectors)](#23-layer-3--mcp-tools-enterprise-connectors)
  - [2.4 Layer 4: Platform and Security](#24-layer-4--platform-and-security)
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
- [5. Specialized Agent Design](#5-specialized-agent-design)
  - [5.1 Discovery Agent](#51-discovery-agent)
  - [5.2 Analysis Agent](#52-analysis-agent)
  - [5.3 Translation Agent](#53-translation-agent)
  - [5.4 Test Generation Agent](#54-test-generation-agent)
  - [5.5 Review Agent](#55-review-agent)
  - [5.6 Security Agent](#56-security-agent)
  - [5.7 Deployment Agent](#57-deployment-agent)
  - [5.8 Starter Catalog, Prebuilt Agent Templates](#58-starter-catalog--prebuilt-agent-templates)
- [6. Agent Orchestration Patterns](#6-agent-orchestration-patterns)
  - [6.1 Pattern 1, Hierarchical Orchestration](#61-pattern-1--hierarchical-orchestration)
  - [6.2 Pattern 2, Event-Driven (GitHub Actions)](#62-pattern-2--event-driven-github-actions)
  - [6.3 Pattern 3, Multi-Agent Handoff](#63-pattern-3--multi-agent-handoff)
  - [6.4 Pattern 4, Deterministic Workflow (Temporal + LangGraph)](#64-pattern-4--deterministic-workflow-temporal--langgraph)
  - [6.5 Choosing the Right Pattern](#65-choosing-the-right-pattern)
- [7. GitHub Platform Integration](#7-github-platform-integration)
  - [7.1 GitHub Copilot Agent Mode and SDK](#71-github-copilot-agent-mode-and-sdk)
  - [7.2 GitHub Coding Agent](#72-github-coding-agent)
  - [7.3 GitHub Actions and Agentic Workflows](#73-github-actions-and-agentic-workflows)
  - [7.4 GitHub Advanced Security](#74-github-advanced-security)
- [8. Azure AI Foundry Configuration](#8-azure-ai-foundry-configuration)
  - [8.1 Model Deployment](#81-model-deployment)
  - [8.2 Foundry Agent Service](#82-foundry-agent-service)
  - [8.3 Monitoring and Observability](#83-monitoring-and-observability)
- [9. Phase 1: Assessment and Code Archaeology (Weeks 1-2)](#9-phase-1--assessment-and-code-archaeology-weeks-1-2)
  - [9.1 Automated Discovery with Claude Opus](#91-automated-discovery-with-claude-opus)
  - [9.2 SMF Runtime Behavior Analysis](#92-smf-runtime-behavior-analysis)
  - [9.3 Dependency Graph Analysis](#93-dependency-graph-analysis)
  - [9.4 Tiered Dependency Difficulty Model](#94-tiered-dependency-difficulty-model)
- [10. Phase 2: Application Carving (Weeks 2-4)](#10-phase-2--application-carving-weeks-2-4)
  - [10.1 Bounded Context Identification](#101-bounded-context-identification)
  - [10.2 Cut-Point Analysis](#102-cut-point-analysis)
  - [10.3 Sequencing and Prioritization](#103-sequencing-and-prioritization)
  - [10.4 AI's Role in Carving](#104-ais-role-in-carving)
- [11. Phase 3: Translation and Test Generation (Weeks 3-8)](#11-phase-3--translation-and-test-generation-weeks-3-8)
  - [11.1 End-to-End Workflow Example, Modernizing PAYROLL-CALC.cbl](#111-end-to-end-workflow-example--modernizing-payroll-calccbl)
  - [11.2 COBOL, Natural and Target Architectures](#112-cobol-natural-and-target-architectures)
  - [11.3 Azure Service Mapping](#113-azure-service-mapping)
- [12. Phase 4: Performance Assurance (Ongoing)](#12-phase-4--performance-assurance-ongoing)
  - [12.1 The Performance Challenge](#121-the-performance-challenge)
  - [12.2 Baseline Measurement](#122-baseline-measurement)
  - [12.3 Performance Budget Definition](#123-performance-budget-definition)
  - [12.4 Architecture Patterns for Performance](#124-architecture-patterns-for-performance)
  - [12.5 Batch Processing Performance](#125-batch-processing-performance)
  - [12.6 Online Transaction Performance](#126-online-transaction-performance)
  - [12.7 Continuous Performance Validation](#127-continuous-performance-validation)
- [13. Phase 5: Coexistence and Traffic Migration](#13-phase-5--coexistence-and-traffic-migration)
  - [13.1 Coexistence Architecture, Strangler Fig Pattern](#131-coexistence-architecture--strangler-fig-pattern)
  - [13.2 Data Synchronization Patterns](#132-data-synchronization-patterns)
  - [13.3 Transaction Routing](#133-transaction-routing)
  - [13.4 Gradual Traffic Migration](#134-gradual-traffic-migration)
  - [13.5 Rollback Strategy](#135-rollback-strategy)
  - [13.6 Session and State Management](#136-session-and-state-management)
- [14. Phase 6: Testing and Validation](#14-phase-6--testing-and-validation)
  - [14.1 Four Layers of Testing](#141-four-layers-of-testing)
  - [14.2 Shadow Traffic Implementation](#142-shadow-traffic-implementation)
  - [14.3 Behavioral Equivalence Testing](#143-behavioral-equivalence-testing)
  - [14.4 Mutation Testing for AI-Generated Code](#144-mutation-testing-for-ai-generated-code)
  - [14.5 Performance Regression Testing](#145-performance-regression-testing)
  - [14.6 Go/No-Go Decision Criteria](#146-gono-go-decision-criteria)
- [15. Phase 7: Production Cutover and Factory Model](#15-phase-7--production-cutover-and-factory-model)
  - [15.1 Cutover Checklist](#151-cutover-checklist)
  - [15.2 Factory Model at Scale](#152-factory-model-at-scale)
- [16. Governance Framework](#16-governance-framework)
  - [16.1 Six Governance Dimensions](#161-six-governance-dimensions)
  - [16.2 Three-Tier Permission Matrix](#162-three-tier-permission-matrix)
  - [16.3 Hook System](#163-hook-system)
  - [16.4 Modernization Guardrails](#164-modernization-guardrails)
- [17. Protocol Interoperability, A2A and MCP](#17-protocol-interoperability--a2a-and-mcp)
- [18. MCP Maturity and AgentOps](#18-mcp-maturity-and-agentops)
- [19. Choosing the Right Agentic Solution](#19-choosing-the-right-agentic-solution)
- [20. Common Pitfalls and Mitigations](#20-common-pitfalls-and-mitigations)
- [21. FAQ, Technical Questions](#21-faq--technical-questions)
- [22. Field-Validated Reference Architecture](#22-field-validated-reference-architecture)
- [23. Measuring Impact with Function Points](#23-measuring-impact-with-function-points)
- [24. References](#24-references)

---

## 1. Runbook Overview, The Complete Journey

This runbook provides the step-by-step technical execution guide for the entire modernization journey. Each phase builds on the previous one, with explicit go/no-go gates between phases.

The following timeline visualizes the seven-phase journey with go/no-go gates between each phase. Each gate requires meeting specific criteria before the team can advance to the next phase.

![Modernization Journey Timeline, seven phases from Assessment to Factory Model with go/no-go gates between each phase](../images/svg/12_Modernization_Journey_Timeline_EN_v1.0.0_2026-03-19.svg)

---

## 1.1 Brazil Enterprise Legacy Landscape

Brazil has one of the largest COBOL estates in Latin America, concentrated in regulated industries. Understanding this landscape is critical for resource planning and phasing strategy:

| Industry Segment     | Estimated COBOL LOC | Key Systems                          |
|----------------------|---------------------|--------------------------------------|
| Commercial Banks     | 500M – 1B          | Core banking, payments, clearing     |
| Development Banks    | 100M – 300M        | Credit, treasury, regulatory         |
| Insurance            | 50M – 200M         | Policy admin, claims, actuarial      |
| Government           | 200M – 500M        | Tax, social services, payroll        |
| Retail               | 50M – 100M         | Supply chain, POS, ERP integrations  |

**Total Brazilian COBOL Estate:** 1.25B – 2.1B lines of code across all sectors.

**Organizational Maturity:** The maturity level of most Brazilian enterprises is Level 0-1 (no agentic AI adoption or early experimentation). This creates both urgency and opportunity, organizations that move first will establish competitive advantage.

**Workforce Demographics:** Brazil faces a 15% annual COBOL developer loss as experienced developers retire without replacement. AI-assisted modernization is not optional; it is workforce-critical.

---

## 1.2 Regulatory Forcing Functions

Brazilian enterprises face specific regulatory deadlines that transform modernization from a strategic option to a compliance requirement:

**BACEN 2028 Deadline**, The Central Bank of Brazil has set 2028 as the target for banking modernization, requiring modern technology controls, API-based open banking interfaces, and enhanced cybersecurity capabilities that are difficult to implement on legacy mainframe platforms.

**LGPD (Lei Geral de Proteção de Dados)**, Brazil's data protection law requires data governance capabilities (consent management, data lineage, right to erasure) that mainframe architectures were not designed to support.

**International Compliance Standards**, Financial institutions must demonstrate compliance with SOX, ISAE 3402, and PCI-DSS, all of which increasingly expect modern security controls, encryption practices, and audit mechanisms that legacy platforms struggle to provide.

These deadlines create a 24-36 month window for enterprise modernization. Agentic AI acceleration is essential to meet these compliance targets.

---

## 1.3 How AI Flips the Cost Equation

### Traditional Modernization Cost Structure

The traditional cost structure of COBOL modernization placed the highest expense on **understanding**, reverse-engineering business rules embedded in decades-old code written by developers who have long since retired. **This understanding phase consumed 40-60% of project budgets** and was the primary bottleneck that caused projects to fail or extend indefinitely.

### AI-Driven Economics

AI fundamentally inverts this equation. [Claude Opus 4.6](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/how-to/use-foundry-models-claude) can process up to 1 million tokens in a single context window, enough to analyze an entire COBOL application with all its copybooks, JCL, and data definitions simultaneously. **What previously took a team of COBOL experts weeks to document can now be completed in hours with AI-generated analysis validated by human experts.**

### Operational Cost Addressability

Beyond cost reduction in project delivery, agentic AI addresses a critical business gap in running costs. **Gartner research (G00833880, "AI-Driven Methods for Cost-Efficiency") identifies 5-20% of operational cost as addressable via AI optimization**, particularly in legacy systems where revenue leakage occurs through manual processes and system inefficiencies. The research defines the **"Ten AI Value Metrics" (ROE model)** for measuring AI business impact, providing a structured framework for quantifying whether modernization investments deliver expected returns rather than relying on cost-savings projections alone.

### Market Impact

Additionally, **Gartner projects that agentic AI will reduce the cost-to-value gap by 50% by 2027 (G00842103)**, fundamentally improving modernization project economics. Market adoption is accelerating: Gartner's survey of 3,412 business leaders (G00835157, "Agentic AI Benchmarks", June 2025) shows **61% of enterprises are investing in agentic AI**, with 42% taking a conservative approach and 19% pursuing high-investment strategies.

---

## 1.4 Four AI Capabilities That Change the Game

Based on [Anthropic's Claude model capabilities analysis](https://docs.anthropic.com/en/docs/about-claude/models), AI brings four capabilities to modernization:

**1. Automated exploration and discovery**, Claude Code can map dependencies across thousands of files, identify program entry points, trace execution paths, and surface implicit couplings that even experienced developers may miss. It reads the entire codebase, not just the files someone remembered to document.

**2. Risk analysis and opportunity mapping**, AI evaluates each component's complexity, coupling, test coverage, and business criticality to produce a prioritized modernization roadmap. This replaces subjective expert judgment with data-driven assessment.

**3. Strategic planning with expert oversight**, AI generates modernization plans (target architectures, migration sequences, resource estimates) that human architects review and approve. The human-in-the-loop ensures strategic decisions remain under expert control.

**4. Incremental implementation with validation**, AI assists with code translation, test generation, and documentation, one component at a time, with validation at each step. This is not a black-box conversion; every output is reviewable and reversible.

### Cost Risk Management

This approach addresses a critical agentic AI risk: **Gartner research (G00827372, "When to Use or Not to Use AI Agents", June 2025) warns that agent costs on a pay-per-use basis can increase rapidly at scale, with unknown or limited benefits potentially resulting in negative business cases if unbounded.** By implementing iterative validation gates and human oversight, the modernization framework ensures cost predictability and early termination of unproductive translation paths.

---

## 1.5 What AI Does NOT Replace

AI is a powerful accelerator, not a replacement for human expertise. Critical areas where human judgment remains essential include: 

- Final approval of target architecture decisions
- Validation of business rule preservation
- Performance tuning for specific workload patterns
- Production cutover decisions
- Regulatory compliance sign-off
- Escalation handling for edge cases the AI cannot resolve

### Target Operating Model

The target operating model is approximately **70-80% AI-executed with 20-30% human oversight, validation, and decision-making**, consistent with [Gartner's AI-assisted modernization productivity estimates](https://www.gartner.com/en/documents/5769515).

However, critical success requires measuring actual business impact. **IDC research (US54300026, "2026 Ushers in Deeper Maturity in the Agentic Era", Feb 2026) found that only 45% of AI projects deliver measurable business value**, underscoring the importance of the ROI framework and governance gates detailed in Section 16.

---

**Three-Wave Pilot Structure:**

| Wave | Timeline | Platform | Key Metric |
|---|---|---|---|
| **Wave 1, Quick Win** | Weeks 1-2 | GitHub Copilot + Claude | Reduce triage from 4-8h to 30min |
| **Wave 2, Deep Analysis** | Weeks 3-6 | Azure AI Foundry + Claude Code | 50K-100K LOC analyzed (vs 500-1K manual) |
| **Wave 3, Scale** | Weeks 7-12 | Multi-agent pipeline + Semantic Kernel | 200K-500K LOC, automatic triage |

---

## 2. Five-Layer Reference Architecture

The following diagram illustrates the complete five-layer stack, from developer interfaces at the top through agents, MCP connectors, platform security, down to external perimeter systems. Each layer builds on the one below it.

![Five-Layer Reference Architecture, Core, Agents, MCP Tools, Platform & Security, and Perimeter layers](../images/svg/12_Five_Layer_Architecture_EN_v1.0.0_2026-03-19.svg)

The architecture follows five guiding principles validated by Gartner research [Gartner G00822558, G00827372]:

1. **Multi-model by design**, Opus analyzes, Sonnet translates, Haiku scans. The Model Router optimizes cost automatically.
2. **Human-in-the-loop at decision points**, Agents execute autonomously for routine tasks but pause at approval gates for architecture decisions and production deployments.
3. **Enterprise governance first**, Every agent action is logged, permissioned, and auditable.
4. **Incremental and reversible**, Every step produces a reviewable artifact. Every deployment can roll back.
5. **Platform-native integration**, Uses GitHub and Azure native services rather than custom infrastructure.

### 2.1 Layer 1: Core (Developer Interface)

**[GitHub Copilot in IDE](https://github.blog/news-insights/company-news/pick-your-agent-use-claude-and-codex-on-agent-hq/)**, Developers interact with Claude models through GitHub Copilot Agent Mode in VS Code, JetBrains, or the GitHub web interface. The model picker allows selecting Claude Opus 4.6 or Sonnet 4.6 for specific tasks.

**[Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code/mcp)**, For power users and automation, Claude Code provides a terminal-based interface with MCP integration, allowing direct connection to enterprise systems.

**GitHub Copilot SDK**, For custom agent extensions, the Copilot SDK enables building specialized interfaces tailored to modernization workflows.

**AGENTS.md / CLAUDE.md**, Configuration files in the repository root that provide persistent instructions to Claude about project conventions, architecture, and modernization rules.

### 2.2 Layer 2: Agents (Multi-Model Orchestration)

The agent layer implements the intelligence of the modernization pipeline. The multi-agent architecture is validated by Gartner research [Gartner G00822558 Figure 3], which identifies a five-agent workflow pattern: Specification → Architecture → Code Generation → Verification → Deployment agents, each with their own LLM.

**Orchestrator (Claude Opus 4.6)**, The primary reasoning engine. Receives high-level tasks, decomposes them into subtasks, assigns to workers, consolidates results, and makes architectural recommendations. Uses the full 1M token context window.

**Worker agents (Claude Sonnet 4.6)**, Execute specific tasks: code translation, test generation, documentation writing, PR creation. Each worker has focused scope and clear input/output contract.

**Scanner agents (Claude Haiku 4.5)**, Handle high-volume, low-complexity tasks: syntax validation, pattern matching, triage classification, CI/CD checks. Optimized for speed and cost.

Orchestration is managed by [Microsoft Semantic Kernel](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/) using built-in agent patterns: Sequential (step-by-step), Handoff (agent-to-agent delegation), and Group Chat (collaborative reasoning).

### 2.3 Layer 3: MCP Tools (Enterprise Connectors)

The [Model Context Protocol (MCP)](https://modelcontextprotocol.io/specification/2025-06-18) provides standardized connections between agents and enterprise systems. Eight MCP servers form the integration backbone (detailed in Section 4).

### 2.4 Layer 4: Platform and Security

**[Azure AI Foundry](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/how-to/use-foundry-models-claude)**, Hosts Claude models via serverless deployment. Provides Model Router, Foundry IQ (dynamic RAG), and Fleet Management.

**[Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/identity/)**, Identity provider for all agents and users. RBAC policies control resource access.

**[Azure Key Vault](https://learn.microsoft.com/en-us/azure/key-vault/general/overview)**, Stores all secrets, API keys, and certificates. Agents retrieve credentials through the Vault MCP server.

**[Azure Monitor](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)**, Centralized logging, metrics, and alerting. Every agent action is logged with structured metadata.

**Azure Policy / Defender for Cloud**, Compliance enforcement and security posture management.

### 2.5 Layer 5: Perimeter (External Interfaces)

- **Customer mainframe**, Source COBOL code accessed via secure file transfer, mainframe API adapters, or Git repositories
- **[LeanIX](https://docs-vsm.leanix.net/changelog/leanix-now-integrates-with-github-and-azure-pipelines)**, Enterprise architecture repository providing service catalog, dependency maps, and DORA metrics
- **Azure target services**, AKS, Azure Functions, Azure SQL, Cosmos DB, Service Bus
- **Notification channels**, Slack, Microsoft Teams, email for human notifications

---

## 3. Multi-Model Integration

### 3.1 Model Assignment by Task

| Modernization Task | Primary Model | Fallback | Rationale |
|---|---|---|---|
| Full-application code analysis | Opus 4.6 |, | Requires 1M token context |
| Business rule extraction | Opus 4.6 | Sonnet 4.6 | Complex reasoning across modules |
| Dependency mapping | Opus 4.6 | Sonnet 4.6 | Cross-file analysis with deep context |
| COBOL-to-Java translation | Sonnet 4.6 |, | Balanced cost/quality for code gen |
| COBOL-to-.NET translation | Sonnet 4.6 |, | Same rationale |
| Test case generation | Sonnet 4.6 |, | Structured output, moderate complexity |
| Documentation generation | Sonnet 4.6 | Haiku 4.5 | Writing quality, moderate cost |
| PR review | Sonnet 4.6 |, | Code understanding + judgment |
| Syntax validation | Haiku 4.5 |, | Speed-critical, simple pattern matching |
| Triage classification | Haiku 4.5 |, | High volume, low complexity |
| CI/CD gate checks | Haiku 4.5 |, | Fast, deterministic checks |
| Architecture decisions | Opus 4.6 + Human |, | Strategic decisions require human approval |

### 3.2 Model Router Configuration

The [Azure AI Foundry Model Router](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/model-router) provides automatic model selection:

- Requests tagged `analysis` or `architecture` → route to Opus 4.6
- Requests tagged `translate` or `generate` → route to Sonnet 4.6
- Requests tagged `scan` or `validate` → route to Haiku 4.5
- Untagged requests → Model Router auto-selects based on complexity

Achieves up to **40% token savings** by routing simple requests to smaller models.

### 3.3 Token Optimization Strategy

**Context window management**, Use Opus (1M tokens) only when full-application context is needed. For module-level tasks, use Sonnet with targeted context (10K-100K tokens).

**Prompt caching**, Cache frequently used system prompts (modernization rules, coding standards, architecture guidelines) to reduce per-request overhead.

**Incremental analysis**, Perform initial triage with Haiku, deep analysis with Opus only on high-priority modules, translation with Sonnet on approved modules.

**Batch processing**, Group related small tasks into batched Haiku requests to reduce API call overhead.

---

## 4. MCP Deep Dive, The Eight Servers

### 4.1 What Is MCP

The [Model Context Protocol (MCP)](https://modelcontextprotocol.io/specification/2025-06-18) is an open protocol that provides a standardized way for AI agents to connect to external data sources and tools. Think of it as a "USB for AI agents", a universal connector that allows any MCP-compatible agent to access any MCP-compatible tool without custom integration code.

Each server exposes **tools** (functions the agent can call), **resources** (data the agent can read), and **prompts** (pre-configured instructions).

### 4.2 GitHub API Server

**Purpose:** Repository and code management operations.

**Tools exposed:** `read_file`, `search_code`, `create_branch`, `create_pull_request`, `list_issues`, `add_comment`, `merge_pr`, `get_diff`.

**Modernization use cases:** Reading COBOL source files, creating feature branches for modernized code, opening PRs with translated code, linking modernization issues to commits.

### 4.3 Azure DevOps Server

**Purpose:** Pipeline orchestration and work item tracking.

**Tools exposed:** `trigger_pipeline`, `get_pipeline_status`, `create_work_item`, `update_work_item`, `get_build_logs`.

**Modernization use cases:** Triggering build/test pipelines after translation, tracking modernization work items, correlating agent activities with project management.

### 4.4 Backstage / Service Catalog Server

**Purpose:** Service discovery and ownership mapping.

**Tools exposed:** `get_service`, `list_dependencies`, `get_owner`, `get_api_spec`, `search_catalog`.

**Modernization use cases:** Understanding which team owns each COBOL module, mapping dependencies between services, identifying API contracts that modernized services must honor.

### 4.5 Database Server

**Purpose:** Schema introspection and data context.

**Tools exposed:** `get_schema`, `describe_table`, `sample_data`, `execute_query` (read-only), `get_relationships`.

**Modernization use cases:** Understanding legacy data structures (VSAM layouts, Adabas schemas, DB2 tables), generating target database schemas, validating data migration mappings.

### 4.6 Vault / Secrets Server

**Purpose:** Secure credential management.

**Tools exposed:** `get_secret`, `list_secrets`, `rotate_credential`.

**Modernization use cases:** Retrieving mainframe connection credentials, accessing API keys for target services, all without exposing secrets in agent context or logs.

### 4.7 Observability Server

**Purpose:** Runtime metrics and monitoring.

**Tools exposed:** `get_metrics`, `query_logs`, `get_traces`, `create_alert`, `get_dashboard`.

**Modernization use cases:** Comparing performance metrics between legacy and modernized systems, monitoring agent pipeline health. Connects to [Azure Monitor and Application Insights](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview).

### 4.8 Custom MCP Server

**Purpose:** Customer-specific integrations.

**Implementation:** Built using the MCP SDK (TypeScript or Python). Customers implement tools for mainframe-specific access patterns (CICS transaction monitoring, JCL parsing, mainframe file transfer).

### 4.9 Jira / Work Item Tracking Server

**Purpose:** Bidirectional integration with Jira, Azure Boards, or other tracking systems.

**Tools exposed:** `create_story`, `update_status`, `link_pr_to_story`, `get_sprint`, `create_subtasks`, `get_acceptance_criteria`, `transition_status`.

**Modernization use cases:** Automatic user story creation with acceptance criteria from extracted business rules. Real-time status updates as agents complete tasks.

**Integration pattern:** Orchestrator triggers `create_story` during planning, workers call `update_status` as they complete tasks, deployment agent calls `transition_status` when code reaches staging.

---

## 5. Specialized Agent Design

Each agent implements Gartner's agent anatomy [G00827372]: a primary execution loop (Perception → Decisioning → Actioning), secondary adaptation loop (Knowledge + Adaptability), and tertiary planning/control loop (Agency).

### 5.1 Discovery Agent

| Attribute | Detail |
|---|---|
| **Model** | Claude Haiku 4.5 (initial scan) + Claude Opus 4.6 (deep analysis) |
| **MCP servers** | GitHub API, Database, Backstage |
| **Inputs** | Repository path, file patterns (*.cbl, *.cpy, *.jcl, *.nat) |
| **Outputs** | Application inventory, dependency graph, complexity scores, business rule catalog |
| **Actions** | Scans entire codebase, identifies programs and copybooks, traces CALL dependencies, maps JCL job flows, catalogs data structures. Produces JSON + Markdown report. |

### 5.2 Analysis Agent

| Attribute | Detail |
|---|---|
| **Model** | Claude Opus 4.6 |
| **MCP servers** | GitHub API, Database, Observability |
| **Inputs** | Application inventory from Discovery Agent, production metrics |
| **Outputs** | Modernization priority matrix, risk assessment, target architecture recommendation |
| **Actions** | Analyzes each application against prioritization criteria (business criticality, technical complexity, AI suitability, dependency coupling), recommends strategy, proposes sequencing, estimates effort. |

### 5.3 Translation Agent

| Attribute | Detail |
|---|---|
| **Model** | Claude Sonnet 4.6 |
| **MCP servers** | GitHub API, Database |
| **Inputs** | COBOL source module, target language specification, coding standards |
| **Outputs** | Translated code (Java/.NET/Python), mapping documentation |
| **Actions** | Translates COBOL logic preserving business semantics, generates inline documentation, produces mapping files, creates PR. Does NOT inject any proprietary SDK, output is standard, idiomatic target language code. |

### 5.4 Test Generation Agent

| Attribute | Detail |
|---|---|
| **Model** | Claude Sonnet 4.6 |
| **MCP servers** | GitHub API, Database |
| **Inputs** | Original COBOL source, translated code, sample data |
| **Outputs** | Unit tests, integration tests, behavioral equivalence tests |
| **Actions** | Generates test suites validating translated code produces identical outputs to original COBOL. Creates test data fixtures, edge case tests, boundary condition tests. Targets minimum 85% code coverage. |

### 5.5 Review Agent

| Attribute | Detail |
|---|---|
| **Model** | Claude Sonnet 4.6 |
| **MCP servers** | GitHub API |
| **Inputs** | PR diff, coding standards, modernization rules |
| **Outputs** | Review comments, approval/rejection recommendation |
| **Actions** | Reviews for correctness, idiom compliance, performance patterns, and architecture adherence. Posts review comments directly on PR. |

### 5.6 Security Agent

| Attribute | Detail |
|---|---|
| **Model** | Claude Haiku 4.5 (scan) + Claude Sonnet 4.6 (analysis) |
| **MCP servers** | GitHub API (Advanced Security), Vault |
| **Inputs** | Translated code, dependency manifest |
| **Outputs** | Security scan results, vulnerability report |
| **Actions** | Scans for hardcoded secrets, SQL injection, XSS, insecure dependencies. Validates no PII leaked from COBOL data definitions. Integrates with [GitHub Advanced Security](https://docs.github.com/en/get-started/learning-about-github/about-github-advanced-security) for CodeQL analysis. |

### 5.7 Deployment Agent

| Attribute | Detail |
|---|---|
| **Model** | Claude Haiku 4.5 |
| **MCP servers** | Azure DevOps, Observability |
| **Inputs** | Approved PR, deployment configuration, target environment |
| **Outputs** | Deployment manifest, rollback plan |
| **Actions** | Generates Kubernetes manifests or Azure deployment configs, triggers CI/CD pipeline, monitors deployment health, creates rollback plan. Does NOT deploy to production without human approval. |

### 5.8 Starter Catalog, Prebuilt Agent Templates

To accelerate time-to-value, the framework includes prebuilt agent configurations for common scenarios:

| Template | Scope | Agents Included | Typical LOC |
|---|---|---|---|
| **COBOL Batch Modernization** | JCL + batch COBOL → Azure Batch/Functions | Discovery, Analysis, Translation (Java), Test Gen, Deployment | 5K-50K |
| **CICS Online Transaction** | CICS programs → AKS or App Service (modular monolith or microservices based on application assessment) + REST APIs | Discovery, Analysis, Translation (Java/.NET), Test Gen, Review, Security | 2K-20K |
| **Natural/Adabas Migration** | Natural programs + Adabas → Azure SQL + microservices (includes Adabas FDT → relational DDL schema conversion; code and data migrate together) | Discovery (with Adabas FDT schema reader), Analysis, Translation, Test Gen | 5K-30K |
| **Report Modernization** | COBOL report programs → Power BI + Azure Functions | Discovery, Analysis, Translation (Python), Test Gen | 1K-10K |
| **Data Migration** | VSAM/DB2/Adabas → Azure SQL/Cosmos DB | Discovery (schema focus), Analysis, Data Migration Agent | N/A (data) |
| **Full Estate Assessment** | Complete COBOL estate → prioritized roadmap | Discovery, Analysis | Unlimited |

Templates are stored as AGENTS.md configurations in a shared repository, versioned and maintained as the framework evolves.

---

## 6. Agent Orchestration Patterns

The following diagram compares all four orchestration patterns side by side, showing the flow structure, best-fit scenario, and when to use each pattern.

![Four Agent Orchestration Patterns, Hierarchical, Event-Driven, Multi-Agent Handoff, and Deterministic workflow comparison](../images/svg/12_Orchestration_Patterns_EN_v1.0.0_2026-03-19.svg)

### 6.1 Pattern 1, Hierarchical Orchestration

**Flow:** Trigger → Opus Orchestrator → Sonnet/Haiku Workers → MCP Tools → Consolidation → Human Review.

The orchestrator receives a high-level task, decomposes into subtasks, assigns each to the appropriate worker model, collects results, synthesizes unified output, and presents for review.

**Best for:** Complex, multi-step modernization tasks requiring holistic reasoning.

**Semantic Kernel pattern:** Sequential Agent with Handoff to specialized workers.

### 6.2 Pattern 2, Event-Driven (GitHub Actions)

**Flow:** GitHub Event → [Agentic Workflow](https://github.blog/ai-and-ml/automate-repository-tasks-with-github-agentic-workflows/) → Agent Execution → Result → PR/Issue Update.

Events trigger agent executions: new issue labeled `modernize` triggers discovery, PR with COBOL changes triggers review, merged PR triggers test generation.

**Best for:** Continuous modernization integrated into development workflow.

### 6.3 Pattern 3, Multi-Agent Handoff

**Flow:** Triage Agent → Modernization Agent → Code Agent → Review Agent → Security Agent → Deploy Agent.

Each agent completes its task and hands off to the next. Requires proper planning, explicit handoff protocols, and centralized supervision to avoid "agent anarchy", poorly orchestrated agents creating vicious loops [Gartner G00825163].

**Hallucination gates:** Multi-agent workflows compound hallucination risk [Gartner G00822558]. Implement validation gates between handoffs, particularly after code generation and before deployment.

**Best for:** High-volume modernization with standardized workflows (factory model).

### 6.4 Pattern 4, Deterministic Workflow (Temporal + LangGraph)

**Flow:** LangGraph (dynamic reasoning) → Temporal (deterministic execution) → Azure Foundry (deployment).

Some tasks require deterministic, repeatable execution, regulatory compliance workflows, auditable transformation pipelines, batch sequences.

| Phase | Orchestrator | Why |
|---|---|---|
| Discovery and analysis | LangGraph | Requires adaptive reasoning |
| Translation pipeline | Temporal | Must be deterministic and auditable |
| Test execution | Temporal | Repeatable, versioned test runs |
| Deployment sequencing | Temporal → Azure Foundry | Deterministic with cloud-native integration |
| Architecture decisions | LangGraph + Human | Complex reasoning with human approval |

**Best for:** Regulated industries (banking, insurance, government) where audit trails are compliance requirements.

### 6.5 Choosing the Right Pattern

| Criteria | Hierarchical | Event-Driven | Multi-Agent Handoff | Deterministic |
|---|:---:|:---:|:---:|:---:|
| Complex reasoning | Best | Limited | Moderate | Moderate |
| High volume / factory | Limited | Good | Best | Good |
| CI/CD integration | Manual | Native | Moderate | Moderate |
| Human oversight granularity | High | Per-event | Per-handoff | Per-checkpoint |
| Cost efficiency | Higher (Opus) | Medium | Optimized | Medium |
| Audit trail | Good | Good | Good | Best |

Most enterprises will use a **combination**: hierarchical for assessment (Wave 1-2), event-driven for CI integration, multi-agent handoff for factory model (Wave 3), and deterministic for regulated workflows.

---

## 7. GitHub Platform Integration

### 7.1 GitHub Copilot Agent Mode and SDK

[GitHub Copilot Agent Mode](https://github.blog/news-insights/company-news/pick-your-agent-use-claude-and-codex-on-agent-hq/) enables Claude models to operate as autonomous agents within the IDE:

- **Multi-file editing**, Essential for cross-cutting modernization changes
- **Terminal access**, Run build commands, execute tests, validate translations
- **Model selection**, Choose Claude Opus 4.6 for deep analysis or Sonnet 4.6 for translation
- **AGENTS.md**, Repository-level configuration for modernization conventions

### 7.2 GitHub Coding Agent

The [GitHub Copilot Coding Agent](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent) operates autonomously in GitHub Actions:

- Assign an issue: "Translate PAYROLL-CALC.cbl to Java"
- The coding agent creates a branch, translates code, runs tests, opens a PR
- Self-review capabilities validate output before requesting human review
- Built-in security scanning ensures no vulnerabilities

### 7.3 GitHub Actions and Agentic Workflows

[GitHub Agentic Workflows](https://github.blog/ai-and-ml/automate-repository-tasks-with-github-agentic-workflows/) enable automation defined in plain Markdown:

**Trigger:** Issue created with label `modernize`

**Steps:** (1) Discovery agent scans module → (2) Analysis agent produces assessment → (3) If approved, Translation agent generates code → (4) Test agent creates suite → (5) Review agent validates → (6) Security agent scans → (7) PR created for human review.

### 7.4 GitHub Advanced Security

Integrates with the Security Agent: CodeQL analysis of generated code, secret scanning, dependency review, and Dependabot for automated security updates.

---

## 8. Azure AI Foundry Configuration

### 8.1 Model Deployment

[Claude models in Azure AI Foundry](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/how-to/use-foundry-models-claude) are deployed as serverless endpoints:

- **Claude Opus 4.6**, 1M token context window, prompt caching enabled
- **Claude Sonnet 4.6**, Standard context, code generation workloads
- **Claude Haiku 4.5**, Low-latency, high-throughput scanning

All deployments support **Zero Data Retention (ZDR)**, customer code is not stored or used for training. Content Filters applied by default. API access via Anthropic SDKs (Python, TypeScript, C#, Java, PHP).

### 8.2 Foundry Agent Service

**[Model Router](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/model-router)** (GA), Automatically selects optimal model per request. Up to 40% token savings.

**Foundry IQ** (Preview), Dynamic RAG enabling agents to ground responses in customer documentation, architecture blueprints, and coding standards.

**Fleet Management**, Model versioning, A/B testing, and rollback capabilities.

### 8.3 Monitoring and Observability

Azure Monitor provides centralized telemetry: every agent action logged with agent ID, task ID, model used, tokens consumed, and duration. Custom dashboards track modernization pipeline health, cost per LOC, and quality metrics.

---

## 9. Phase 1: Assessment and Code Archaeology (Weeks 1-2)

### 9.1 Automated Discovery with Claude Opus

The Discovery Agent ingests the entire COBOL estate via the GitHub API MCP server:

**What it scans:** COBOL programs (.cbl), copybooks (.cpy), JCL (.jcl), Natural programs (.nat), CICS transaction definitions, DB2/Adabas schema definitions, screen maps (BMS/Natural maps).

**What it produces:**
- Program catalog with entry points, CALL chains, and COPY dependencies
- Data dictionary mapping data structures across programs and files
- JCL job flow showing batch execution sequences and dependencies
- Transaction map showing CICS/Natural screen flows and program invocations
- Complexity scores (1-10) for each program based on cyclomatic complexity, coupling, and size

Claude Opus 4.6's **1-million-token context window** enables holding thousands of COBOL programs simultaneously, identifying dependencies that span the entire estate rather than analyzing one file at a time.

### 9.2 SMF Runtime Behavior Analysis

For organizations that can export mainframe [SMF (System Management Facilities)](https://www.ibm.com/docs/en/zos/2.5.0?topic=management-system-facilities-smf) records, the Discovery Agent supplements static analysis with runtime behavior data.

| SMF Type | What It Captures | Modernization Value |
|---|---|---|
| Type 30 | Job-level resource consumption | Batch workload profiling, resource sizing |
| Types 70-79 | CPU, memory, I/O utilization | Performance baseline for SLA validation |
| Type 110 | CICS transaction performance | Online transaction profiling, response time baselines |
| Type 80 | RACF security events | Security policy dependency mapping |

SMF analysis reveals implicit dependencies: programs sharing VSAM files without direct calls, batch jobs with data-sequencing dependencies, CICS transactions triggering downstream batch processes. This is the "dark matter" of mainframe dependencies that sinks migration projects when undetected. Runtime analysis accuracy for implicit dependencies is approximately **35-40%**, making it a valuable supplement to (not replacement for) static analysis.

### 9.3 Dependency Graph Analysis

The Discovery Agent output feeds into a dependency graph revealing:

- **Clusters**, Tightly coupled program groups that must modernize together
- **Bridge programs**, Connectors between clusters (integration points for Strangler Fig facade)
- **Orphans**, Programs with minimal dependencies (ideal first candidates)
- **Hub programs**, Programs with many dependents (cannot modernize until dependents are ready)

### 9.4 Tiered Dependency Difficulty Model

Not all dependencies are equally difficult. Based on field experience with large COBOL estates:

| Tier | Dependency Type | Static Analysis Accuracy | Examples |
|---|---|---|---|
| **Easy** | Direct program calls, batch/JCL sequences | 95-100% | COBOL CALL statements, JCL EXEC PGM |
| **Moderate** | Transaction monitor interactions, message queues | 80-90% | CICS LINK/XCTL, MQ Series PUT/GET, Natural CALLNAT |
| **Hard** | Generated code, dynamic calls, custom preprocessors | 50-70% | Code generators, dynamic CALL using variables |
| **Hardest** | Runtime-only behavior, custom transaction monitors | 35-40% | SMF-detected implicit calls, custom CICS extensions |

The Discovery Agent tags each dependency with its difficulty tier:
- **Easy/Moderate** → resolved through automated analysis with high confidence
- **Hard** → require manual expert validation of AI-generated analysis
- **Hardest** → require SMF runtime analysis + manual expert review + iterative discovery

---

## 10. Phase 2: Application Carving (Weeks 2-4)

### 10.1 Bounded Context Identification

Using the dependency graph, the Analysis Agent (Claude Opus 4.6) identifies bounded contexts:

**Domain alignment**, Programs handling payroll, accounts receivable, or claims processing form natural bounded contexts aligned with business functions.

**Data ownership**, Each bounded context should own its data. Shared VSAM files must be resolved (replicated, split, or exposed via API) before either context can be modernized independently.

**Interface identification**, Boundaries between contexts define integration contracts. These become APIs in the modernized architecture, replacing direct CALL chains and shared data areas. **Important:** Bounded contexts can result in modules within a well-structured modular monolith with clear internal API contracts, they do not necessarily require separate deployable microservices. The decision to decompose into independent services should be based on empirical evidence of independent scaling needs, team autonomy requirements, or polyglot technology decisions, not an assumption that bounded context = microservice.

For banking and insurance, mapping to industry reference architectures ([BIAN](https://bian.org/) for financial services, [ACORD](https://www.acord.org/) for insurance) accelerates bounded context identification by providing proven microservice boundaries.

### 10.2 Cut-Point Analysis

Cut-point analysis determines exactly where to "cut" the monolith. A cut-point is a boundary where:

- The dependency graph has minimal cross-links (low coupling)
- Data flows across the boundary are well-defined and low-volume
- Programs on one side form a coherent business function
- An API layer can replace the direct dependency

The Analysis Agent evaluates each potential cut-point and recommends optimal modernization boundaries.

### 10.3 Sequencing and Prioritization

1. **Start with orphans and low-dependency clusters**, Build team capability on easy wins
2. **Progress to medium-complexity contexts**, Apply lessons learned, refine patterns
3. **Address hub programs and high-coupling clusters last**, Tackle hardest problems when most experienced

**Go/no-go threshold per increment:** complexity score ≤ 7, test coverage ≥ 85%, 100% behavioral equivalence, performance within 10% of baseline.

### 10.4 AI's Role in Carving

| Carving Step | AI Contribution | Human Contribution |
|---|---|---|
| Discovery and inventory | 95% automated | Validate completeness |
| Dependency graph | 90% automated | Verify critical paths |
| Bounded context identification | 70% AI recommendation | Business domain validation |
| Cut-point analysis | 80% AI analysis | Architecture decision |
| Sequencing | 60% AI-generated plan | Strategic prioritization |

---

## 11. Phase 3: Translation and Test Generation (Weeks 3-8)

### 11.1 End-to-End Workflow Example, Modernizing PAYROLL-CALC.cbl

This concrete example demonstrates the multi-agent handoff pattern processing a 2,800-LOC COBOL payroll module. The following diagram visualizes all 10 steps of the pipeline, from initial trigger through staging deployment, highlighting the two human approval gates.

![10-Step Modernization Workflow, PAYROLL-CALC.cbl example showing trigger through deploy with human gates at steps 4 and 9](../images/svg/12_Ten_Step_Workflow_EN_v1.0.0_2026-03-19.svg)

**Step 1: Trigger:** A developer creates a GitHub issue: "Modernize PAYROLL-CALC.cbl to Java microservice." The issue is labeled `modernize`.

**Step 2: Discovery Agent (Haiku scan → Opus deep analysis):**
- Haiku scans the repository: identifies PAYROLL-CALC.cbl (2,800 LOC), 12 referenced copybooks, 3 JCL jobs, 4 DB2 tables
- Opus ingests all related files (~45K tokens): produces dependency graph, business rule catalog (tax calculations, deduction logic, overtime rules), complexity score (6/10), recommends target: Spring Boot microservice with REST API

**Step 3: Analysis Agent (Opus 4.6):**
- Evaluates risk: complexity 6 (within threshold), 3 external dependencies (manageable), no shared VSAM files (clean data boundary)
- Recommends: proceed with translation. Target: Java 21 + Spring Boot + Azure SQL. The architecture pattern (standalone service vs. module within a modular monolith) depends on the estate's overall target architecture, in this example, the module is implemented as a Spring Boot application that could be deployed independently or as part of a larger modular monolith.
- Creates GitHub issue with analysis report for human review
- Output is standard Java, no proprietary SDK injected

**Step 4: Human approval gate:**
- Architect reviews analysis report, approves target architecture, adds label `approved`

**Step 5: Translation Agent (Sonnet 4.6):**
- Translates PAYROLL-CALC.cbl to Java, preserving all business rules
- Generates: PayrollCalculationService.java, PayrollController.java (REST API), entity classes, repository interfaces
- Creates feature branch and opens PR

**Step 6: Test Generation Agent (Sonnet 4.6):**
- Generates JUnit test suite: 127 test cases covering normal payroll, overtime, deductions, tax brackets, boundary cases
- Test coverage: 91%. Pushes tests to same PR

**Step 7: Review Agent (Sonnet 4.6):**
- Reviews PR diff against Java coding standards
- Flags 2 minor issues: decimal precision adjustment, missing null check. Posts review comments

**Step 8: Security Agent (Haiku scan → Sonnet analysis):**
- Haiku scans for secrets, SQL injection, vulnerable dependencies
- Sonnet validates no PII from COBOL data definitions leaked into code
- Result: zero critical/high findings

**Step 9: Human merge approval:**
- Developer reviews PR, tests, security scan, review comments. Approves and merges

**Step 10: Deployment Agent (Haiku 4.5):**
- Generates Kubernetes deployment manifest for AKS
- Triggers [GitHub Actions](https://github.blog/ai-and-ml/automate-repository-tasks-with-github-agentic-workflows/) CI/CD pipeline: build → test → deploy to staging
- Does NOT deploy to production (requires separate human approval after shadow traffic validation)

**Total elapsed time:** ~4 hours from trigger to staging deployment (vs. weeks for manual modernization of a 2,800-LOC module).

This workflow aligns with Gartner's recommended 9-step agentic modernization workflow [G00822567]: (1) Generate plan → (2) Validate with human → (3) Retrieve context → (4) Identify artifacts → (5) Validate changes → (6) Make changes file-by-file → (7) Review against standards → (8) Run tests → (9) Create PR.

### 11.2 COBOL, Natural and Target Architectures

Key language-specific considerations during translation:

**COBOL + VSAM/DB2/IMS:** COBOL accesses **multiple data stores**, VSAM (most common, native I/O verbs), DB2 (embedded SQL via `EXEC SQL ... END-EXEC`), IMS/DB (DL/I calls), and sequential files. Unlike Natural+Adabas, COBOL's data access is **explicit and separable** from application code, meaning code conversion and database migration can be independent workstreams. Target databases include Azure SQL, [PostgreSQL Flexible Server](https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/) (open-source, JSONB for semi-structured data), or [Cosmos DB](https://learn.microsoft.com/en-us/azure/cosmos-db/) (document/key-value patterns), the choice depends on data access patterns, not a default assumption. IMS hierarchical data maps more naturally to Cosmos DB or PostgreSQL JSONB than to relational tables. Target architecture can be a **modular monolith** (App Service or AKS single deployment), microservices (only when justified by independent scaling needs), or serverless (Azure Functions for batch). Claude Opus 4.6 can hold thousands of copybooks simultaneously for complete dependency analysis.

**Natural + Adabas:** Natural is Software AG's 4GL with **native, implicit database commands** (`FIND`, `READ`, `STORE`, `UPDATE`, `DELETE`) for Adabas, its primary database. These commands are built into the language (not SQL). While Natural can also access SQL databases (DB2, Oracle) via SQL gateways and VSAM/IMS via dedicated interfaces, 95%+ of enterprise Natural estates use Adabas exclusively. Adabas is a non-relational DBMS using an **inverted-list architecture** with FDT (Field Definition Table) schemas, fundamentally different from relational DDL. This tight coupling means **language and data migration must happen together** (unlike COBOL where code and database are separable). Adabas FDT → Azure SQL requires careful schema redesign because inverted-list structures do not map directly to relational tables.

**Custom dialects:** Claude models learn from sample code corpus and AGENTS.md configuration. No fine-tuning required, in-context learning from examples.

### 11.3 Azure Service Mapping

**Application Architecture Patterns:**

| Pattern | When to Use | Azure Deployment | Best For |
|---|---|---|---|
| **Modular Monolith** | Single team, cohesive domain, <500K LOC, no independent scale needs | [App Service](https://learn.microsoft.com/en-us/azure/app-service/) or AKS (single deployment) | **Most modernization scenarios**, pragmatic default for ~80% of cases |
| **Modular Monolith + Satellites** | Core cohesive + specific functions need independent lifecycle | App Service (core) + Azure Functions (satellites) | Pragmatic hybrid |
| **Microservices** | Multiple independent teams, polyglot, independent scaling per domain | [AKS](https://learn.microsoft.com/en-us/azure/aks/what-is-aks) + [API Management](https://learn.microsoft.com/en-us/azure/api-management/api-management-howto-deploy-multi-region) | Large orgs with mature DevOps **and** clear bounded contexts |
| **Serverless** | Event-driven, variable load, batch, integrations | [Azure Functions](https://learn.microsoft.com/en-us/azure/azure-functions/) + Logic Apps | Batch modernization, event processing |

**Database Target Options:**

| Legacy Data Store | Azure Target Options | When to Use Each |
|---|---|---|
| **VSAM/ISAM** | [Azure SQL](https://learn.microsoft.com/en-us/azure/azure-sql/) | Transactional CRUD, SQL Server expertise |
| | [PostgreSQL Flexible Server](https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/) | Open-source, JSONB, cost-effective, analytics |
| | [Cosmos DB](https://learn.microsoft.com/en-us/azure/cosmos-db/) (NoSQL) | Key-value access, geo-distribution |
| **DB2** | Azure SQL / Managed Instance | Direct SQL migration, stored procedures |
| | PostgreSQL Flexible Server | Open-source, cost optimization |
| **IMS/DB** | Cosmos DB (document model) | Hierarchical → JSON documents (natural mapping) |
| | PostgreSQL JSONB | Hybrid relational + hierarchical queries |
| **Adabas** | Azure SQL (FDT → DDL redesign) | When relational model fits |
| | PostgreSQL JSONB | MU/PE fields → JSON arrays (natural mapping) |
| | Cosmos DB | Inverted-list → document/key-value |
| **MQ** | [Azure Service Bus](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-federation-patterns) | Pub/sub, topics |
| **Screens** | React/Angular or server-rendered web | SPA + REST |
| **Files/Reports** | Blob Storage + Power BI / Functions | On-demand or scheduled |

---

## 12. Phase 4: Performance Assurance (Ongoing)

### 12.1 The Performance Challenge

A z16 mainframe can process over 25,000 CICS transactions per second with sub-millisecond response times. Batch windows process millions of records in hours. The modernized Azure environment must match this performance.

### 12.2 Baseline Measurement

Before modernizing anything, establish a comprehensive performance baseline:

**What to measure:** Transaction response times (by type), batch job durations, peak concurrent users, CPU/MIPS utilization, I/O rates, peak volumes (hourly, daily, month-end).

**How to measure:** SMF records, CICS monitoring data, RMF reports, batch job logs. Export to [Azure Monitor](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview) for side-by-side comparison.

**SMF deep analysis:** SMF types 30, 70-79, and 110 provide granular transaction-level performance data including CPU time per transaction, I/O wait time, and queue depths. This establishes the full distribution (p50, p95, p99) that the modernized system must match.

### 12.3 Performance Budget Definition

| Workload Type | Acceptable Delta | Rationale |
|---|---|---|
| Online transactions (p95) | ≤ 10% slower | User-facing, directly impacts experience |
| Online transactions (p99) | ≤ 20% slower | Tail latency less critical |
| Batch processing (total time) | ≤ 15% slower | Must fit within batch window |
| Batch processing (peak records/sec) | ≤ 10% slower | Critical for month-end processing |
| Data query latency | ≤ 10% slower | Application-dependent |

**Red guardrail:** If the modernized system cannot meet the performance budget, the increment does not proceed to production.

### 12.4 Architecture Patterns for Performance

**Connection pooling**, Modernized services on AKS use connection pooling to avoid per-request connection overhead.

**In-memory caching**, Azure Cache for Redis replaces CICS shared memory for frequently accessed data.

**Async processing**, [Azure Service Bus](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-federation-patterns) enables parallel processing across multiple workers for I/O-bound batch workloads.

**Database optimization**, Azure SQL needs equivalent indexing strategies and query optimization tailored to specific workloads.

**Horizontal scaling**, AKS auto-scaling adjusts replica counts based on load, maintaining response times during traffic spikes.

### 12.5 Batch Processing Performance

**[Azure Batch](https://learn.microsoft.com/en-us/azure/architecture/example-scenario/mainframe/reengineer-mainframe-batch-apps-azure)**, VM pools scaling to thousands of nodes. Job splitting divides large batches into parallel chunks.

**Azure Functions**, Event-driven batch patterns processing records as they arrive via Service Bus.

**Azure Logic Apps**, Visual workflow design for complex multi-step batch sequences (JCL equivalent).

**Key metric:** Modernized batch must complete within the same batch window as legacy.

### 12.6 Online Transaction Performance

**AKS microservices**, Each CICS transaction type maps to an AKS endpoint. Horizontal Pod Autoscaler maintains target response times.

**API Management**, Rate limiting, caching, and request validation equivalent to CICS transaction routing.

**Database connection management**, The #1 cause of performance regression. Use connection pooling, prepared statements, and read replicas.

**Load testing**, Azure Load Testing validates p95 response times under peak load before any production traffic.

### 12.7 Continuous Performance Validation

**[Application Insights](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)**, OpenTelemetry distributed tracing tracks every transaction end-to-end.

**Side-by-side dashboards**, Compare legacy mainframe performance (from SMF/RMF) with modernized system in real time.

**Automated alerts**, If degradation exceeds red guardrail (>20% online, >15% batch), traffic automatically routes back to legacy.

---

## 13. Phase 5: Coexistence and Traffic Migration

### 13.1 Coexistence Architecture, Strangler Fig Pattern

The following diagram shows the complete coexistence architecture with the API facade routing traffic between legacy mainframe and modern Azure services, connected by a CDC sync layer for near-real-time data synchronization.

![Strangler Fig Coexistence Architecture, API Facade, Legacy Mainframe, Modern Azure Services, and CDC Sync Layer](../images/svg/12_Strangler_Fig_Architecture_EN_v1.0.0_2026-03-19.svg)

The [Strangler Fig pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/strangler-fig) uses three infrastructure components:

**API facade**, [Azure API Management](https://learn.microsoft.com/en-us/azure/api-management/api-management-howto-deploy-multi-region) sits in front of both systems. All requests flow through the facade.

**Data synchronization layer**, [Change Data Capture (CDC)](https://www.confluent.io/use-case/liberate-mainframe-data/) replicates changes between mainframe and Azure databases in near-real-time.

**Traffic routing layer**, [Azure Front Door](https://learn.microsoft.com/en-us/azure/frontdoor/routing-methods) with weighted routing controls traffic distribution.

The routing, traffic weighting, and gradual migration mechanisms must be built as **first-class platform features** with clear APIs and dashboards [Gartner G00844741], not manual processes managed by specialists.

### 13.2 Data Synchronization Patterns

**Pattern 1: Change Data Capture (CDC)**, Monitors mainframe DB transaction log, streams changes to Azure in near-real-time. Tools: tcVISION + Confluent Kafka. Latency: 1-5 seconds.

**Pattern 2: Event-Driven Sync**, Each transaction publishes an event to Azure Service Bus. Both systems subscribe and update local state. Provides exactly-once semantics.

**Pattern 3: API-Based Sync**, Scheduled or on-demand API sync for low-frequency reference data changes.

**Critical rule:** Never dual-write. Always designate one system as source of truth for each data domain.

### 13.3 Transaction Routing

**Route-by-transaction-type**, Modernized types to Azure, non-modernized to mainframe. Deterministic.

**Route-by-user-segment**, Early adopter users to Azure, others to mainframe. Controlled rollout.

**Route-by-percentage**, X% to Azure via [Azure Front Door weighted routing](https://learn.microsoft.com/en-us/azure/frontdoor/routing-methods). Start at 1%.

**Route-by-geography**, Specific branches/regions to Azure. Phased regional rollout.

### 13.4 Gradual Traffic Migration

| Step | Traffic | Duration | Criteria to Advance |
|---|---|---|---|
| 0% | Internal testing only | 1-2 weeks | All tests pass |
| Shadow (0% live) | 100% mirrored, 0% served | 1 month (full business cycle) | Functional + performance equivalence |
| 1% | First live traffic | 48+ hours | Zero errors, performance on budget |
| 5% | Expand | 1 week | Sustained stability |
| 10% → 25% → 50% | Progressive | 2-4 weeks each | Validation at each step |
| 100% | Full migration |, | All criteria met |
| Decommission | Mainframe off | After 30-90 day standby | Validation period passed |

### 13.5 Rollback Strategy

Every production cutover step must be reversible within minutes:

**API gateway rollback**, Change routing rules in API Management. Takes effect in seconds.

**Data rollback**, CDC in reverse direction replays changes back to mainframe.

**Feature flag rollback**, Instantly disable modernized code paths.

**Full environment rollback**, Target: complete rollback within 15 minutes.

### 13.6 Session and State Management

**Stateless services**, Modernized services store session state in Azure Cache for Redis or Azure SQL.

**Token-based routing**, User sessions carry a token indicating which system version. API gateway routes consistently for session duration.

**Distributed transaction coordination**, For transactions spanning both systems, use Saga pattern with compensating transactions.

---

## 14. Phase 6: Testing and Validation

### 14.1 Four Layers of Testing

| Layer | What It Tests | When | Tool |
|---|---|---|---|
| **Unit tests** | Individual function correctness | After translation | AI-generated test suites (Sonnet 4.6) |
| **Integration tests** | Component interactions, API contracts | After integration | Automated framework + CI/CD |
| **Mutation tests** | Test suite quality for AI-generated code | During CI/CD | Mutation testing framework (Stryker or equivalent) |
| **Behavioral equivalence** | Same inputs → same outputs | Before traffic routing | Parallel execution comparator |
| **Shadow traffic** | Production behavior under real load | Before live cutover | Traffic mirroring infrastructure |

### 14.2 Shadow Traffic Implementation

Shadow traffic (also called traffic mirroring) is the gold standard for validation before production cutover.

**How it works:** Every production request to the mainframe is simultaneously copied and sent to the modernized system. The mainframe response goes to the user. The modern system response is captured and compared, but never sent to the user.

**Implementation:** [Azure API Management](https://learn.microsoft.com/en-us/azure/api-management/api-management-howto-deploy-multi-region) duplicates requests using policy-based routing:
- `forward-request` policy sends the request to the mainframe (primary)
- `send-one-way-request` policy sends a copy to the modern system (shadow)

**Comparison engine:** A comparison service receives both responses and logs:
- **Functional equivalence**, Do the responses match?
- **Performance delta**, How much slower/faster is the modern system?
- **Error divergence**, Does either system produce errors the other doesn't?

**Duration:** Run shadow traffic for at least 1 full business cycle (typically 1 month) to capture daily, weekly, and month-end processing patterns.

**Key constraint:** Shadow traffic generates load on the modern system equivalent to full production. Size the Azure infrastructure accordingly.

### 14.2a Gradual Cutover Strategy

After shadow traffic validation passes, transition from mainframe to modern system through a carefully managed gradual cutover:

| Step | Traffic to Modern | Duration | Validation Criteria |
|---|---|---|---|
| **Shadow** | 0% live, 100% mirrored | 1 month (full business cycle) | Functional + performance equivalence verified |
| **1%** | 1% production traffic | 48+ hours | Zero critical errors, performance on budget |
| **5%** | 5% production traffic | 1 week | Sustained stability, error rate < 0.1% |
| **10%** | 10% production traffic | 2 weeks | Performance stable, no escalations |
| **25%** | 25% production traffic | 2 weeks | Continued stability |
| **50%** | 50% production traffic | 4 weeks | Full business cycle coverage |
| **100%** | 100% production traffic | Ongoing | Modern system primary |
| **Decommission** | Mainframe offline | After 30-90 day standby period | No production issues, all validation passed |

**Rollback at each step:** Every transition includes a feature flag allowing instant rollback to the previous step. Target rollback time: less than 5 minutes.

**Monitoring during cutover:** Continuous monitoring dashboards compare:
- Response time (p50, p95, p99)
- Error rates by type
- Business transaction volume and latency
- Resource utilization (CPU, memory, connections)

### 14.3 Behavioral Equivalence Testing

**Test data generation**, Claude Sonnet 4.6 generates comprehensive test data covering normal cases, boundaries, edge cases, and historical scenarios (month-end, year-end, leap year).

**Parallel execution**, Same input processed by both systems. Outputs compared field by field.

**Tolerance rules**, Define acceptable differences before testing: timestamp formats, 5th-decimal rounding, field ordering.

**Failure investigation**, AI Review Agent categorizes divergences: cosmetic (acceptable), calculation difference (requires fix), logic error (critical, blocks migration).

### 14.4 Mutation Testing for AI-Generated Code

Gartner specifically recommends mutation testing for validation of AI-generated code [G00822567], as traditional test suites may not catch subtle semantic errors from automated translation.

**Process:** After Sonnet 4.6 translates COBOL to Java/.NET, inject mutations (change `>` to `>=`, remove loop conditions) into translated code and verify the test suite catches each mutation.

**Threshold:** Mutation score < 95% indicates insufficient test coverage for AI-generated code, flag for additional test generation.

### 14.5 Performance Regression Testing

**Load testing**, Azure Load Testing simulates production peak loads (2x expected volume).

**Soak testing**, Sustained load for 48-72 hours to detect memory leaks, connection pool exhaustion.

**Stress testing**, Push beyond peak to find breaking point. Know capacity limits before production.

### 14.6 Go/No-Go Decision Criteria

A modernization increment proceeds to production only when **ALL** criteria are met:

| Criterion | Threshold | Measurement |
|---|---|---|
| Complexity score | ≤ 7 (of 10) | Discovery Agent assessment |
| Test coverage | ≥ 85% | Automated coverage analysis |
| Mutation score | ≥ 95% | Mutation testing framework |
| Behavioral equivalence | 100% | Parallel execution comparison |
| Performance (online p95) | Within 10% of baseline | Load testing results |
| Performance (batch total) | Within 15% of baseline | Batch execution comparison |
| Security findings | Zero critical/high | Security Agent + GitHub Advanced Security |
| Shadow traffic validation | Pass for 1 full business cycle | Comparison engine results |

---

## 15. Phase 7: Production Cutover and Factory Model

### 15.1 Cutover Checklist

Before moving from shadow traffic to live production:

- [ ] All Go/No-Go criteria met (Section 14.6)
- [ ] Rollback plan tested and documented
- [ ] On-call team identified and briefed
- [ ] Communication plan for stakeholders executed
- [ ] Monitoring dashboards validated with comparison views
- [ ] Data synchronization verified (CDC latency < 5 seconds)
- [ ] API gateway routing rules tested in staging
- [ ] Feature flags configured for instant rollback
- [ ] Business stakeholder sign-off obtained
- [ ] Compliance/audit approval (for regulated industries)

### 15.2 Factory Model at Scale

After the first successful increment, establish the modernization factory:

**Parallel teams**, Multiple bounded contexts modernized simultaneously by independent teams.

**Shared conversion libraries**, Proven translation patterns (COBOL data types → Java types, CICS commands → REST patterns) stored as reusable assets.

**Automated testing frameworks**, Pre-built behavioral equivalence, performance regression, and security scanning pipelines.

**Continuous knowledge capture**, Each increment generates insights: AI agents accumulate conversion patterns, identify common anti-patterns, and suggest architectural improvements.

**AgentOps instrumentation**, Track agent behavior, decision rationale, and accuracy metrics. Enable real-time optimization of agent workflows [IDC #US54300026].

**Throughput targets:**

| Wave | LOC per Week | Approach |
|---|---|---|
| Wave 1 (manual + Copilot) | 500-1,000 | Human-driven with AI assistance |
| Wave 2 (Claude Code) | 50,000-100,000 | AI-driven with human validation |
| Wave 3 (multi-agent) | 200,000-500,000 | Factory model, automatic triage |

---

## 15.3 Vendor Independence Assurance

A critical concern for enterprises adopting agentic AI is vendor lock-in. The modernization framework provides explicit guarantees of vendor independence across three dimensions:

### Generated Application Code, No Proprietary Dependencies

Claude models generate standard, idiomatic code in the target language with **zero proprietary dependencies**:

- **Java target:** Standard Java 17/21 + Spring Boot + JPA + JUnit. No Anthropic or Microsoft SDK injected into application code.
- **.NET target:** Standard C# + ASP.NET Core + Entity Framework Core + xUnit. No proprietary dependencies.
- **Python target:** Standard Python 3.11+ + FastAPI + SQLAlchemy + pytest. No proprietary libraries.

**Key distinction:** The AI tooling (Azure AI Foundry, Semantic Kernel, MCP SDK) runs the modernization pipeline. The *output* of that pipeline, the modernized application code, contains only standard, portable code with no proprietary vendor dependencies.

**Implication:** If the enterprise decides to stop using the AI tooling at any point, the already-modernized code continues to work unchanged. The generated applications are completely portable to any cloud platform (AWS, Google Cloud, on-premises) without modification.

### Modernization Pipeline, Open Protocol (MCP)

The [Model Context Protocol (MCP)](https://modelcontextprotocol.io/specification/2025-06-18) is an open standard maintained by Anthropic and implemented by multiple vendors. It is not proprietary to any single cloud platform.

- **Tooling flexibility:** Enterprises can swap Claude for other LLMs without rewriting integration code, MCP provides a standardized interface.
- **Platform portability:** MCP servers can run on any infrastructure (Azure, AWS, on-premises Kubernetes) without lock-in.
- **Custom integration:** The Custom MCP Server pattern allows enterprises to build proprietary integrations that work with any MCP-compatible agent.

### Modernized System, No Runtime Dependencies on AI Tooling

The modernized application code has **zero runtime dependencies on the AI tooling**:

- No Anthropic SDK in production
- No Microsoft Azure AI Foundry SDK in production
- No Semantic Kernel in production
- No MCP SDK in production

All AI tooling runs during the *development* phase (code generation, testing, validation). Once code is generated and deployed, it executes independently with standard runtime libraries (JVM, .NET Runtime, Python runtime).

**This architecture ensures that enterprises own their modernized systems completely.** If a vendor relationship ends or pricing becomes unacceptable, the enterprise's modernized applications continue operating without interruption or modification.

---

## 16. Governance Framework

### 16.1 Six Governance Dimensions

| Dimension | Implementation |
|---|---|
| **Identity** | [Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/identity/), every agent and user has an identity |
| **Permissions** | RBAC + MCP server-level access control |
| **Audit** | Structured logging, every action logged with agent ID, task ID, model, tokens, duration |
| **Approval Gates** | GitHub PR approvals at critical decision points |
| **Cost Control** | Rate limiting + [Azure budgets](https://learn.microsoft.com/en-us/azure/cost-management-billing/) per project/team |
| **Content Safety** | Responsible AI guardrails via Azure AI Content Safety |

### 16.2 Three-Tier Permission Matrix

| Tier | Role | Capabilities |
|---|---|---|
| **Tier 1, Sub-agent** | Scanner, validator | Read-only access to repository and data sources |
| **Tier 2, Worker** | Translator, reviewer, tester | Create branches, open PRs, write test files |
| **Tier 3, Orchestrator** | Pipeline coordinator | Coordinate workers, trigger deployments (staging only), escalate to humans |

No agent has production deployment permissions. Production requires explicit human approval.

### 16.3 Hook System

Four hook types control agent behavior at boundaries:

| Hook Type | When | Example |
|---|---|---|
| **Pre-action** | Before agent executes | Verify human approval exists for architecture changes |
| **Post-action** | After agent completes | Notify Slack/Teams channel with summary |
| **Guardrail** | During execution | Verify no PII or secrets in generated code |
| **Escalation** | On uncertainty | Create GitHub issue for human review when confidence < threshold |

### 16.4 Modernization Guardrails

| Level | Rule | Action |
|---|---|---|
| **Green** | Complexity ≤ 5, all tests pass, no security findings | Proceed automatically |
| **Yellow** | Complexity 6-7, minor test gaps, low-severity findings | Proceed with enhanced review |
| **Red** | Complexity > 7, behavioral divergence, critical findings, performance budget exceeded | Stop. Human decision required. |

Trust builds through **graded autonomy** [Gartner G00844741], start fully supervised, progressively expand autonomy as the system demonstrates reliability. Initially review every PR; over time, review only PRs above a complexity threshold or flagged by security scanning.

---

## 17. Protocol Interoperability, A2A and MCP

The framework supports two complementary protocols for agent connectivity:

**[MCP (Model Context Protocol)](https://modelcontextprotocol.io/specification/2025-06-18)**, Provides tool-level connectivity between agents and enterprise systems. MCP is gaining traction for multiagent orchestration and interoperability [IDC #US54300026].

**A2A (Agent-to-Agent Protocol)**, Emerging standard for direct agent-to-agent communication. Enables agents from different vendors or platforms to collaborate on modernization workflows.

The architecture is designed to support both protocols, ensuring interoperability as standards evolve. MCP provides the primary integration backbone today, with A2A support for future cross-platform scenarios.

---

## 18. MCP Maturity and AgentOps

### MCP Adoption in Enterprise Context

MCP standardization is accelerating in 2026 as enterprises require consistent agent connectivity patterns [IDC #US54300026]. The eight MCP servers in this architecture provide coverage for the core modernization workflow, with the Custom MCP server enabling extension for customer-specific needs.

### AgentOps Capabilities

IDC emphasizes building AgentOps capabilities for model/agent selection, tracking, evaluation, and governance across diverse AI technologies [IDC #US54300026]:

- **Agent telemetry**, Track agent behavior, decision rationale, accuracy metrics
- **Cost attribution**, Token consumption per agent, per task, per project
- **Quality tracking**, Acceptance rate of AI-generated code, test pass rates, security findings
- **A/B testing**, Compare different model versions or prompt strategies
- **Continuous optimization**, Feedback loops from human reviews improve agent performance

### HITL Agentic Workflows

Gartner identifies Human-in-the-Loop (HITL) agentic workflows as the emerging pattern, not fully autonomous systems [Gartner G00822558]. Key touchpoints:

- Validation of business rule interpretation
- Architectural decisions
- Exception handling for complex code
- Final acceptance testing
- Production cutover decisions

AI governance is moving from aspirational principles to operational controls in 2026, driven by EU AI Act, NIST AI RMF, and ISO 42001 [IDC #US54300026].

---

## 19. Choosing the Right Agentic Solution

When evaluating agentic coding solutions for modernization, assess these critical capabilities:

**Deep codebase awareness**, Tools must navigate complex codebases with automatic awareness of project structures, dependencies, and architectural patterns. Claude Code traces execution paths through multiple files and frameworks.

**Working with existing tools**, Seamless integration with version control, testing frameworks, build tools, and deployment pipelines. No changes to established processes.

**Flexible deployment**, Terminals, IDEs, or headless CLI for automation. Claude Code integrates with VS Code, JetBrains IDEs, and Neovim. Cloud and local deployment options.

**Secure by design**, Code goes directly to AI models via encrypted APIs without intermediary servers. Transparent work demonstration. Comprehensive audit trails and RBAC. Zero Data Retention. Integration with enterprise deployments including Azure AI Foundry.

**Advanced features**, Three essential components: **memory systems** for context across long-running projects, **function capabilities** for complex transformations, and **MCP connectivity** for tool integration through open standards.

---

## 20. Common Pitfalls and Mitigations

| Pitfall | Frequency | Mitigation |
|---|---|---|
| **Underestimating data migration** | Very common | Treat as first-class workstream with dedicated resources |
| **Skipping performance baselines** | Common | Establish baselines BEFORE any modernization |
| **Testing as afterthought** | Very common | Build test infrastructure before conversion begins |
| **Big-bang instead of incremental** | Common | Follow Strangler Fig pattern strictly |
| **Ignoring implicit dependencies** | Common | Use SMF runtime analysis + expert interviews |
| **Agent anarchy** | Moderate | Explicit handoff protocols, centralized supervision [G00825163] |
| **JOBOL output** | Common | Combine LLM translation with architectural restructuring [G00822567] |
| **Cost overrun on token usage** | Moderate | Model Router + Haiku for scanning + prompt caching |
| **Losing legacy experts** | Critical | Retain through program; use AI to capture their knowledge |
| **Scope creep (modernize + enhance)** | Very common | Modernize first, enhance later, never simultaneously |

---

## 21. FAQ, Technical Questions

**Q1. Can the framework run entirely within the customer's Azure tenant?**
Yes. Claude models in Azure AI Foundry are accessed as serverless API endpoints. All infrastructure (Monitor, Key Vault, AKS, SQL) runs in the customer's subscription. Zero Data Retention ensures code is not stored or used for training.

**Q2. Does the framework inject any proprietary SDK into generated code?**
No. Output is standard, idiomatic code in the target language (Java, C#, Python) with zero proprietary dependencies. If the customer stops using the AI tooling, all modernized code continues working unchanged.

**Q3. How does it handle custom COBOL variants (custom CICS extensions, etc.)?**
Claude models learn from sample code corpus and AGENTS.md/CLAUDE.md configuration files. No fine-tuning required. Foundry IQ (dynamic RAG) grounds analysis in customer documentation. Developers familiar with customizations must validate non-standard code.

**Q4. Which models are used for which tasks?**
Opus 4.6 (~$15/dev/mo) for deep analysis. Sonnet 4.6 (~$15/dev/mo) for code translation, tests, reviews. Haiku 4.5 (~$2.50/dev/mo) for scanning and triage. Total ~$32.50/dev/month. Model Router auto-selects with up to 40% savings.

**Q5. How is testing handled?**
Four layers: unit tests (AI-generated, 85%+ coverage), integration tests, behavioral equivalence (parallel execution comparison), and shadow traffic (1 full business cycle in production). Plus mutation testing for AI-generated code quality.

**Q6. How does dependency mapping work?**
Discovery Agent (Opus 4.6) ingests entire estate in its 1M-token context window. Traces all CALL chains, COPY references, JCL flows, CICS links, and shared data. Dependencies classified by difficulty tier (Easy→Hardest). SMF runtime data supplements static analysis for implicit dependencies.

**Q7. What is the performance guarantee?**
Performance budget: online p95 within 10% of baseline, batch within 15%. If budget is exceeded, traffic automatically routes back to legacy. No production cutover without performance validation.

**Q8. How does coexistence work during the multi-year transition?**
Strangler Fig pattern: API facade (Azure API Management), CDC data sync (1-5 second latency), weighted traffic routing (Azure Front Door). Gradual migration from 0% to 100% with rollback capability at every step.

**Q9. Can it accept context from customer architecture tools (LeanIX, Backstage, etc.)?**
Yes. The Backstage/Service Catalog MCP server integrates with LeanIX and Backstage for service discovery, ownership mapping, and business capability mapping. Additional context via Foundry IQ (dynamic RAG) for architecture documents.

**Q10. How does governance work?**
Six dimensions: Identity (Entra ID), Permissions (3-tier RBAC), Audit (structured logging), Approval Gates (GitHub PR), Cost Control (budgets + rate limiting), Content Safety (Responsible AI guardrails). Three permission tiers ensure no agent can deploy to production without human approval.

**Q11. Can Jira/DevOps integration create user stories automatically?**
Yes. The Jira/Work Item MCP server creates stories with acceptance criteria from extracted business rules, updates status in real-time as agents complete tasks, and links PRs to stories.

**Q12. Does the approach support industry reference architectures?**
Yes. The Discovery Agent classifies extracted business rules against BIAN (banking) and ACORD (insurance) taxonomies, producing domain mappings that inform bounded context identification and target architecture design.

**Q13. Are there prebuilt templates to accelerate first engagement?**
Yes. The Starter Catalog includes six prebuilt templates: COBOL Batch, CICS Online, Natural/Adabas, Report Modernization, Data Migration, and Full Estate Assessment. Each packages tested agent configurations, MCP connections, and governance rules.

**Q14. Can modernization be delivered as a managed service?**
Yes. Three tiers: Guided (partner sets up, customer runs), Co-managed (shared execution), Fully Managed (partner operates). Technical architecture is identical; only the operator changes. Customer retains full code and infrastructure ownership.

**Q15. How does the framework build trust over time?**
Through graded autonomy [Gartner G00844741]: Phase 1 is fully human-supervised. As agents demonstrate reliability, autonomy gradually increases, from reviewing every PR to reviewing only complex or security-flagged PRs. This graduated approach builds organizational confidence.

---

## 22. Field-Validated Reference Architecture

A field-validated reference architecture for AI-powered legacy modernization has been designed based on five layers, proven in production with large-scale COBOL estates in regulated financial institutions:

**Layer 1: Platform and Security:** Entra ID for authentication, Key Vault for secrets management, ensuring security compliance from the foundation.

**Layer 2: Developer Experience:** VS Code with GitHub Copilot Business as the primary IDE, providing real-time code assistance during modernization work.

**Layer 3: AI Model Layer:** Azure AI Foundry with Claude models (Opus, Sonnet, Haiku) selected via Model Router based on task complexity, Opus for complex architectural analysis, Haiku for simple documentation queries.

**Layer 4: MCP and Tools:** Multiple MCP servers providing specialized tools for code analysis, documentation management, and repository integration.

**Layer 5: Orchestration:** Five specialized agents with mandatory human gates between each:

- `@legacy-analyzer`, Analyzes legacy code and maps dependencies
- `@modernization-planner`, Generates modernization plan and defines priorities
- `@code-modernizer`, Executes code transformation
- `@test-validator`, Creates and runs equivalence test suites
- `@doc-generator`, Produces technical and business documentation

The implementation roadmap follows four phases: Foundation (M1-2), Orchestration (M3-4), Validation (M5-6), and Scale (M7-12), with defined KPIs including analysis time, documentation coverage, modules migrated per cycle, and AI/Human ratio.

---

## 23. Measuring Impact with Function Points

Organizations operating large COBOL and Natural estates, common practice in government, banking, and insurance, particularly across Latin America, frequently measure software productivity using **Function Points** (IFPUG/SISP methodology). For these organizations, the key impact metric is **PDR (Productivity Delivery Rate)**, effort hours divided by function points delivered. A lower PDR indicates higher productivity.

**Reference benchmarks:**

| Context | PDR (hours/FP) |
|---|---|
| Industry average | ~65 h/FP |
| Top performers | ~10 h/FP |
| Government (typical) | ~80-90 h/FP |

**Two proposed impact metrics for AI-assisted modernization:**

- **CU→CE (Unit Construction → Efficient Construction):** Hypothesis of 40-60% reduction in construction time with AI assistance
- **CD→ED (Documented Construction → Documented Delivery):** Hypothesis of 50-70% reduction in documented delivery time

**Three-phase validation approach:**
1. **Hackathon (Month 1)**, Initial validation with controlled test cases
2. **Controlled Pilot (Months 2-6)**, Rigorous measurement with production code
3. **Expansion (Months 7-12)**, Rollout based on validated data

This approach ensures concrete data before investment at scale. Function point analysis provides a language-independent metric enabling consistent estimation, progress tracking, and benchmarking regardless of source or target language.

---

## 24. References

### Gartner Research

1. Gartner, "Predicts 2026: Reduce Structural Rigidity" (G00842103), 2025
2. Gartner, "AI-Driven Methods for Cost-Efficiency" (G00833880), 2025
3. Gartner, "The 3 Business Cases of GenAI Value" (G00823006), 2024
4. Gartner, "First Take: Anthropic Claude Code" (G00850909), 2025
5. Gartner, "Assessing GenAI for Modernizing Legacy Application Code" (G00822567), Dec 2024
6. Gartner, "Tool: AI Agent Assessment Framework" (G00836131), Jun 2025
7. Gartner, "5 Agentic AI Capabilities That Turn Autonomy Into Adoption" (G00844741), Jan 2026
8. Gartner, "Innovation Insight for Software Global Black Belting" (G00822558), Jan 2025
9. Gartner, "Agentic AI Benchmarks" (G00835157), Jun 2025
10. Gartner, "When to Use or Not to Use AI Agents" (G00827372), Jun 2025
11. Gartner, "Innovation Insight for the AI Agent Platform Landscape" (G00825163), Mar 2025

### IDC Research

12. IDC, "Agentic AI Platforms and Strategies" (P47419), Feb 2026
13. IDC, "Claude Opus 4.6 and Cowork" (#lcUS54278226), Feb 2026
14. IDC, "2026 Ushers in Deeper Maturity in the Agentic Era" (#US54300026), Feb 2026

### Microsoft and Platform Documentation

15. [Azure AI Foundry, Claude Models](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/how-to/use-foundry-models-claude)
16. [GitHub Copilot Agent Mode](https://github.blog/news-insights/company-news/pick-your-agent-use-claude-and-codex-on-agent-hq/)
17. [Microsoft Semantic Kernel, Agent Framework](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/)
18. [Azure Kubernetes Service](https://learn.microsoft.com/en-us/azure/aks/what-is-aks)
19. [Azure API Management](https://learn.microsoft.com/en-us/azure/api-management/api-management-howto-deploy-multi-region)
20. [Model Context Protocol Specification](https://modelcontextprotocol.io/specification/2025-06-18)
21. [GitHub Agentic Workflows](https://github.blog/ai-and-ml/automate-repository-tasks-with-github-agentic-workflows/)
22. [Azure AI Foundry Model Router](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/model-router)
23. [Azure Monitor / Application Insights](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)
24. [Azure Key Vault](https://learn.microsoft.com/en-us/azure/key-vault/general/overview)
25. [Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/identity/)
26. [Azure Batch, Mainframe Batch Modernization](https://learn.microsoft.com/en-us/azure/architecture/example-scenario/mainframe/reengineer-mainframe-batch-apps-azure)
27. [Azure Service Bus](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-federation-patterns)
28. [Azure Front Door, Routing Methods](https://learn.microsoft.com/en-us/azure/frontdoor/routing-methods)
29. [Strangler Fig Pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/strangler-fig)
30. [GitHub Advanced Security](https://docs.github.com/en/get-started/learning-about-github/about-github-advanced-security)
31. [GitHub Coding Agent](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent)
32. [LeanIX Integration](https://docs-vsm.leanix.net/changelog/leanix-now-integrates-with-github-and-azure-pipelines)

### Industry Standards

33. [BIAN, Banking Industry Architecture Network](https://bian.org/)
34. [ACORD, Association for Cooperative Operations Research and Development](https://www.acord.org/)
35. [IFPUG, International Function Point Users Group](https://www.ifpug.org/)
36. [Anthropic, Claude Models Documentation](https://docs.anthropic.com/en/docs/about-claude/models)
37. [Anthropic, Claude Code MCP](https://docs.anthropic.com/en/docs/claude-code/mcp)
38. [Confluent, Mainframe CDC](https://www.confluent.io/use-case/liberate-mainframe-data/)
39. [IBM, SMF Documentation](https://www.ibm.com/docs/en/zos/2.5.0?topic=management-system-facilities-smf)
40. [Temporal](https://temporal.io), Deterministic workflow orchestration
41. [LangGraph](https://github.com/langchain-ai/langgraph), Dynamic reasoning orchestration
