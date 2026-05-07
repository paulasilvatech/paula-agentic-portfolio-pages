---
title: "Operational Playbook, Application Carving, Performance Assurance & Coexistence"
description: "Step-by-step operational guide for the three hardest challenges in COBOL modernization: how to slice applications, maintain performance parity, and run legacy and modern systems side by side"
author: "Paula Silva"
role: "Software Global Black Belt"
contact: "paulasilva@microsoft.com"
date: "2026-03-13"
version: "2.0.0"
status: "approved"
locale: "en"
series_number: "07"
tags: ["COBOL", "Natural", "application carving", "performance", "coexistence", "strangler fig", "shadow traffic", "testing", "CDC", "operational"]
related_documents:
  - "01_Market_Trends_Predictions.md"
  - "02_Legacy_Modernization_Strategy_Guide.md"
  - "03_AI_Driven_Modernization_Claude_Opus_Analysis.md"
  - "04_Comprehensive_Assessment_Framework.md"
  - "05_Agentic_COBOL_Modernization_Strategy_Business_Case.md"
  - "06_Technical_Architecture_Agentic_Framework.md"
  - "08_Customer_FAQ_Agentic_Modernization.md"
  - "09_Comparative_Analysis_Kyndryl_vs_Our_Strategy.md"
  - "10_Comparative_Analysis_Generated_vs_Source_Materials.md"
---

# Operational Playbook, Application Carving, Performance Assurance & Coexistence

> The code translation is the part everyone focuses on. This document addresses the three challenges that actually determine success or failure: how to slice a monolithic COBOL estate into modernizable units, how to ensure modernized systems match mainframe performance, and how to run both systems together during the multi-year transition.

## Change Log

| Version | Date       | Author      | Changes         |
|---------|------------|-------------|-----------------|
| 2.0.0   | 2026-03-13 | Paula Silva | Enhanced with 7+ Gartner/IDC analyst citations for enterprise credibility; added AgentOps, mutation testing, AI governance, and agent anarchy risk data; all metrics traceable to specific analyst document IDs |
| 1.2.0   | 2026-03-12 | Paula Silva | Renumbered as Doc 07 in 10-document strategy series; updated all cross-references to new numbering |
| 1.1.0   | 2026-03-12 | Paula Silva | Added SMF runtime behavior analysis, tiered dependency difficulty model, incorporating field intelligence from Kyndryl competitive analysis |
| 1.0.0   | 2026-03-12 | Paula Silva | Initial version |

## Table of Contents

- [1. Why This Is the Hard Part](#1-why-this-is-the-hard-part)
- [2. Application Carving, Slicing the Monolith](#2-application-carving--slicing-the-monolith)
  - [2.1 The Problem: Everything Is Connected](#21-the-problem-everything-is-connected)
  - [2.2 Step 1: Automated Discovery with Claude Opus](#22-step-1--automated-discovery-with-claude-opus)
  - [2.3 Step 2: Dependency Graph Analysis](#23-step-2--dependency-graph-analysis)
  - [2.4 Step 3: Bounded Context Identification](#24-step-3--bounded-context-identification)
  - [2.5 Step 4: Cut-Point Analysis](#25-step-4--cut-point-analysis)
  - [2.6 Step 5: Sequencing and Prioritization](#26-step-5--sequencing-and-prioritization)
  - [2.7 AI's Role in Carving](#27-ais-role-in-carving)
- [3. Performance Assurance, Matching Mainframe Speed](#3-performance-assurance--matching-mainframe-speed)
  - [3.1 The Performance Challenge](#31-the-performance-challenge)
  - [3.2 Step 1: Baseline Measurement](#32-step-1--baseline-measurement)
  - [3.3 Step 2: Performance Budget Definition](#33-step-2--performance-budget-definition)
  - [3.4 Step 3: Architecture Patterns for Performance](#34-step-3--architecture-patterns-for-performance)
  - [3.5 Step 4: Batch Processing Performance](#35-step-4--batch-processing-performance)
  - [3.6 Step 5: Online Transaction Performance](#36-step-5--online-transaction-performance)
  - [3.7 Step 6: Continuous Performance Validation](#37-step-6--continuous-performance-validation)
  - [3.8 AI's Role in Performance](#38-ais-role-in-performance)
- [4. Coexistence, Running Two Worlds Together](#4-coexistence--running-two-worlds-together)
  - [4.1 The Coexistence Reality](#41-the-coexistence-reality)
  - [4.2 Coexistence Architecture](#42-coexistence-architecture)
  - [4.3 Data Synchronization Patterns](#43-data-synchronization-patterns)
  - [4.4 Transaction Routing](#44-transaction-routing)
  - [4.5 Gradual Traffic Migration](#45-gradual-traffic-migration)
  - [4.6 Rollback Strategy](#46-rollback-strategy)
  - [4.7 Session and State Management](#47-session-and-state-management)
- [5. Testing Strategy, Shadow Traffic and Behavioral Equivalence](#5-testing-strategy--shadow-traffic-and-behavioral-equivalence)
  - [5.1 Four Layers of Testing](#51-four-layers-of-testing)
  - [5.2 Shadow Traffic Implementation](#52-shadow-traffic-implementation)
  - [5.3 Behavioral Equivalence Testing](#53-behavioral-equivalence-testing)
  - [5.4 Performance Regression Testing](#54-performance-regression-testing)
  - [5.5 Go/No-Go Decision Criteria](#55-gono-go-decision-criteria)
- [6. End-to-End Workflow, From Discovery to Production](#6-end-to-end-workflow--from-discovery-to-production)
  - [6.1 Phase 1: Code Archaeology (Weeks 1-2)](#61-phase-1--code-archaeology-weeks-1-2)
  - [6.2 Phase 2: Carving and Planning (Weeks 3-4)](#62-phase-2--carving-and-planning-weeks-3-4)
  - [6.3 Phase 3: Translation and Testing (Weeks 5-8)](#63-phase-3--translation-and-testing-weeks-5-8)
  - [6.4 Phase 4: Parallel Run and Validation (Weeks 9-10)](#64-phase-4--parallel-run-and-validation-weeks-9-10)
  - [6.5 Phase 5: Gradual Cutover (Weeks 11-12)](#65-phase-5--gradual-cutover-weeks-11-12)
  - [6.6 Phase 6: Factory Model (Month 3+)](#66-phase-6--factory-model-month-3)
- [7. Azure Services for Each Challenge](#7-azure-services-for-each-challenge)
- [8. Common Pitfalls and Mitigations](#8-common-pitfalls-and-mitigations)
- [References](#references)

## 1. Why This Is the Hard Part

Converting COBOL to Java or .NET is a well-understood problem that AI handles effectively. Claude Sonnet 4.6 can translate a COBOL paragraph into idiomatic Java while preserving business logic. That is not where modernization projects fail.

Projects fail on three operational challenges that no amount of code translation solves:

**Application carving**, A typical banking COBOL estate has 500 million lines of code with decades of accumulated cross-dependencies. How do you decide what to modernize first? Where are the boundaries? Which modules can be extracted independently, and which require their neighbors to move together?

**Performance assurance**, A mainframe processes millions of batch transactions in minutes and handles thousands of concurrent CICS transactions with sub-second response times. The modernized system on Azure must match this performance, or business stakeholders will block the migration. How do you measure, compare, and guarantee performance equivalence?

**Coexistence**, The modernization takes 2-5 years. During that entire period, the COBOL system and the modernized system must run side by side, sharing data and serving users. How do you synchronize data between two worlds? How do you route transactions? How do you roll back if something goes wrong?

This playbook provides the step-by-step answers.

## 2. Application Carving, Slicing the Monolith

### 2.1 The Problem: Everything Is Connected

Mainframe COBOL applications were not designed as modular, loosely-coupled services. They evolved over decades with implicit dependencies: shared copybooks, common data areas, CICS program-to-program LINK calls, JCL job chains, and VSAM files accessed by multiple programs. Extracting one piece requires understanding what it touches.

The traditional approach, assembling a team of COBOL experts who manually trace dependencies over months, is too slow, too expensive, and too dependent on tribal knowledge that may no longer exist.

### 2.2 Step 1: Automated Discovery with Claude Opus

The Discovery Agent (powered by Claude Opus 4.6) ingests the entire COBOL estate via the [GitHub API MCP server](./06_Technical_Architecture_Agentic_Framework_v1.2.0_2026-03-12.md#42-github-api-server) and produces a complete application inventory:

**What it scans:** COBOL programs (.cbl), copybooks (.cpy), JCL (.jcl), Natural programs (.nat), CICS transaction definitions, DB2/Adabas schema definitions, screen maps (BMS/Natural maps).

**Advanced discovery input, SMF runtime behavior data:** For organizations that can export mainframe [SMF (System Management Facilities)](https://www.ibm.com/docs/en/zos/2.5.0?topic=management-system-facilities-smf) records, the Discovery Agent can supplement static code analysis with runtime behavior data. SMF records capture actual program invocations, transaction volumes, and resource consumption patterns that may reveal dependencies invisible to static analysis, such as programs invoked via dynamic CALL, indirect CICS routing, or generated code paths. Runtime analysis accuracy for implicit dependencies is approximately 35-40%, making it a valuable supplement to (not replacement for) static analysis.

**What it produces:**
- Program catalog with entry points, CALL chains, and COPY dependencies
- Data dictionary mapping data structures across programs and files
- JCL job flow showing batch execution sequences and dependencies
- Transaction map showing CICS/Natural screen flows and program invocations
- Complexity scores (1-10) for each program based on cyclomatic complexity, coupling, and size

Claude Opus 4.6's 1-million-token context window is critical here, it can hold thousands of COBOL programs simultaneously, enabling it to trace dependencies that span the entire estate rather than analyzing one file at a time.

### 2.3 Step 2: Dependency Graph Analysis

The Discovery Agent output feeds into a dependency graph that visualizes relationships between programs, data structures, and jobs. The graph reveals:

**Clusters**, Groups of programs that are tightly coupled and must be modernized together. These become modernization units.

**Bridge programs**, Programs that connect clusters. These are the integration points where the [Strangler Fig pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/strangler-fig) facade must be placed.

**Orphans**, Programs with minimal dependencies that can be modernized independently. These are ideal first candidates.

**Hub programs**, Programs with many dependencies (called by many others). These cannot be modernized until their dependents are ready or a backward-compatible API is in place.

**Tiered Dependency Difficulty Model**

Not all dependencies are equally difficult to analyze and resolve. Based on field experience with large COBOL estates, dependencies fall into four tiers of difficulty:

| Tier | Dependency Type | Analysis Difficulty | Static Analysis Accuracy | Examples |
|------|----------------|--------------------|-----------------------|----------|
| **Easy** | Direct program calls, batch/JCL sequences | Low | 95-100% | COBOL CALL statements, JCL EXEC PGM, batch job chains |
| **Moderate** | Transaction monitor interactions, message queues | Medium | 80-90% | CICS LINK/XCTL, MQ Series PUT/GET, Natural CALLNAT |
| **Hard** | Generated code, dynamic calls, custom preprocessors | High | 50-70% | Code generators (e.g., C-Equal Gen), dynamic CALL using variables, proprietary preprocessor output |
| **Hardest** | Runtime-only behavior, custom transaction monitors | Very High | 35-40% | SMF-detected implicit calls, custom CICS extensions (e.g., GRB/GRBE), dynamically routed transactions |

The tiered model informs the modernization approach for each dependency type:
- **Easy and Moderate** dependencies can be resolved through automated analysis with high confidence
- **Hard** dependencies require manual expert validation of AI-generated analysis
- **Hardest** dependencies require a combination of SMF runtime analysis, manual expert review, and iterative discovery, plan additional time and human oversight for these

The Discovery Agent tags each dependency with its difficulty tier, allowing the sequencing algorithm to prioritize modernization increments that contain predominantly Easy/Moderate dependencies while deferring Hard/Hardest-heavy modules until the team has built sufficient expertise.

### 2.4 Step 3: Bounded Context Identification

Using the dependency graph, the Analysis Agent (Claude Opus 4.6) identifies bounded contexts, groups of programs that share a coherent business domain and can operate as a unit:

**Domain alignment**, Programs that handle payroll, accounts receivable, or claims processing form natural bounded contexts aligned with business functions.

**Data ownership**, Each bounded context should own its data. If two contexts share a VSAM file, that shared file must be resolved (replicated, split, or exposed via API) before either context can be independently modernized.

**Interface identification**, The boundaries between contexts define the integration contracts. These become APIs in the modernized architecture, replacing direct program CALL chains and shared data areas.

### 2.5 Step 4: Cut-Point Analysis

Cut-point analysis determines exactly where to "cut" the monolith. A cut-point is a boundary where:

- The dependency graph has minimal cross-links (low coupling)
- Data flows across the boundary are well-defined and low-volume
- The programs on one side of the boundary form a coherent business function
- An API or integration layer can replace the direct dependency

The Analysis Agent evaluates each potential cut-point against these criteria and recommends the optimal modernization boundary. Programs inside the boundary become a modernization increment; programs outside continue running on the mainframe.

### 2.6 Step 5: Sequencing and Prioritization

With bounded contexts and cut-points identified, the sequencing follows a clear logic:

1. **Start with orphans and low-dependency clusters**, Build team capability on easy wins
2. **Progress to medium-complexity contexts**, Apply lessons learned, refine patterns
3. **Address hub programs and high-coupling clusters last**, Tackle the hardest problems when the team is most experienced

Prioritization criteria combine business value (revenue impact, regulatory urgency, customer experience) with technical feasibility (complexity score, test coverage, dependency count). The go/no-go threshold is: complexity score ≤7, test coverage ≥85%, 100% behavioral equivalence validation, performance within 10% of baseline.

### 2.7 AI's Role in Carving

| Carving Step | AI Contribution | Human Contribution |
|-------------|----------------|-------------------|
| Discovery and inventory | 95% automated | Validate completeness |
| Dependency graph | 90% automated | Verify critical paths |
| Bounded context identification | 70% AI recommendation | Business domain validation |
| Cut-point analysis | 80% AI analysis | Architecture decision |
| Sequencing | 60% AI-generated plan | Strategic prioritization |

**AgentOps Instrumentation:** IDC research (US54300026) emphasizes building AgentOps capabilities for model/agent selection, tracking, evaluation, and governance across diverse AI technologies. In the context of carving, this means instrumenting the Discovery and Analysis Agents with telemetry that tracks agent behavior, decision rationale, and accuracy metrics, enabling real-time optimization of agent workflows and governance of multi-agent orchestration.

## 3. Performance Assurance, Matching Mainframe Speed

### 3.1 The Performance Challenge

Mainframes are purpose-built for high-throughput, low-latency transaction processing. A z16 mainframe can process over 25,000 CICS transactions per second with sub-millisecond response times. Batch windows process millions of records in hours.

The modernized Azure environment uses general-purpose cloud infrastructure. It can match mainframe performance, but only with intentional architecture designed for it. The critical metrics are:

**Online transactions**, Response time (p50, p95, p99), throughput (transactions per second), error rate.

**Batch processing**, Total processing time, records per second, resource utilization.

**Data operations**, Query latency, write throughput, consistency guarantees.

### 3.2 Step 1: Baseline Measurement

Before modernizing anything, establish a comprehensive performance baseline of the legacy system:

**What to measure:** Transaction response times (by transaction type), batch job duration (by job), peak concurrent user load, CPU/MIPS utilization patterns, I/O rates (disk reads/writes per second), peak transaction volumes (by hour, day, month-end).

**How to measure:** Mainframe SMF records, CICS monitoring data, RMF reports, batch job logs. Export this data to [Azure Monitor](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview) for side-by-side comparison with modernized system metrics.

**SMF deep analysis for performance baselining:** Beyond standard RMF reports, detailed SMF record analysis (particularly SMF types 30, 70-79, and 110) provides granular transaction-level performance data including CPU time per transaction, I/O wait time, and queue depths. This data establishes not just average performance but the full distribution (p50, p95, p99) that the modernized system must match. Organizations with mature mainframe monitoring can extract this data using tools like IBM SMF Explorer or custom DFSORT/ICETOOL jobs, exporting to CSV for ingestion into Azure Monitor.

**Output:** Performance baseline document specifying target thresholds for each workload type. This becomes the acceptance criteria for the modernized system.

### 3.3 Step 2: Performance Budget Definition

Define a performance budget for each modernization increment, the maximum acceptable performance delta versus the legacy baseline:

| Workload Type | Acceptable Delta | Rationale |
|--------------|-----------------|-----------|
| Online transactions (p95) | ≤10% slower | User-facing, directly impacts experience |
| Online transactions (p99) | ≤20% slower | Tail latency less critical |
| Batch processing (total time) | ≤15% slower | Must fit within batch window |
| Batch processing (peak records/sec) | ≤10% slower | Critical for month-end processing |
| Data query latency | ≤10% slower | Application-dependent |

If the modernized system cannot meet the performance budget, the modernization increment does not proceed to production (red guardrail).

### 3.4 Step 3: Architecture Patterns for Performance

Specific architecture patterns for matching mainframe performance on Azure:

**Connection pooling**, Mainframe programs maintain persistent connections. Modernized services on [AKS](https://learn.microsoft.com/en-us/azure/aks/what-is-aks) use connection pooling to avoid the overhead of creating new connections per request.

**In-memory caching**, Mainframe CICS uses shared memory for frequently accessed data. Modernized equivalents use Azure Cache for Redis or in-process caching.

**Async processing**, Mainframe batch uses sequential file processing. Modernized batch uses [Azure Service Bus](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-federation-patterns) for parallel processing across multiple workers, dramatically improving throughput for I/O-bound workloads.

**Database optimization**, Mainframe DB2 is highly optimized for specific access patterns. Modernized Azure SQL databases need equivalent indexing strategies, query optimization, and connection management tailored to the specific workload.

**Horizontal scaling**, Unlike mainframes (which scale vertically), cloud architectures scale horizontally. AKS auto-scaling policies adjust replica counts based on load, maintaining response times during traffic spikes.

### 3.5 Step 4: Batch Processing Performance

Mainframe batch is often the hardest performance challenge because batch windows are fixed and processing volumes are enormous. Azure strategies:

**[Azure Batch](https://learn.microsoft.com/en-us/azure/architecture/example-scenario/mainframe/reengineer-mainframe-batch-apps-azure)**, For compute-intensive batch jobs, Azure Batch provides VM pools that scale to thousands of nodes. Job splitting divides a large batch (e.g., process 10M records) into parallel chunks (100 x 100K records) that execute simultaneously.

**Azure Functions**, For event-driven batch patterns, Azure Functions processes records as they arrive via Service Bus queue, eliminating the need for a fixed batch window.

**Azure Logic Apps**, For orchestrating complex multi-step batch sequences (the JCL equivalent), Logic Apps provides visual workflow design with retry logic, error handling, and monitoring.

**Key metric:** The modernized batch must complete within the same batch window as the legacy system. If the legacy batch runs from midnight to 6am, the modernized batch must also complete within that window, or finish faster.

### 3.6 Step 5: Online Transaction Performance

For CICS-equivalent online transactions:

**AKS microservices**, Each CICS transaction type maps to an [AKS microservice](https://learn.microsoft.com/en-us/azure/architecture/example-scenario/mainframe/extend-mainframe-applications) endpoint. Kubernetes Horizontal Pod Autoscaler maintains target response times by scaling replicas.

**[API Management](https://learn.microsoft.com/en-us/azure/api-management/api-management-howto-deploy-multi-region)**, API gateway provides rate limiting, caching, and request validation, equivalent to CICS transaction routing.

**Database connection management**, The number-one cause of performance regression in modernized online transactions is database connection overhead. Use connection pooling, prepared statements, and read replicas.

**Performance testing under load**, Use Azure Load Testing to simulate peak concurrent user loads and validate that p95 response times meet the performance budget before any production traffic is routed to the modernized system.

### 3.7 Step 6: Continuous Performance Validation

Performance validation is not a one-time test, it runs continuously:

**[Application Insights](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)**, Distributed tracing with OpenTelemetry tracks every transaction from API gateway through microservices to database, identifying latency hotspots.

**Dashboard comparison**, Side-by-side dashboards in Azure Monitor compare legacy mainframe performance (exported from SMF/RMF) with modernized system performance in real time.

**Continuous value realization via telemetry**, Gartner research (G00844741) recommends embedding customer success best practices into runtime through real-time adoption telemetry signals, citing Celonis as a model example. Translate this into the operational context: embed telemetry into the monitoring layer that tracks not just technical metrics but business value metrics (transactions per second, cost per transaction, error rate impact on business process). This enables automatic feedback loops where performance data drives continuous optimization of the modernized system.

**Automated alerts**, If modernized system performance degrades beyond the budget threshold, automated alerts trigger investigation. If degradation exceeds the red guardrail (>20% for online, >15% for batch), traffic is automatically routed back to the legacy system.

### 3.8 AI's Role in Performance

| Performance Step | AI Contribution | Human Contribution |
|-----------------|----------------|-------------------|
| Baseline measurement | Automate data extraction and analysis | Validate measurement completeness |
| Performance budget | Recommend thresholds from historical data | Approve budgets per workload type |
| Architecture design | Suggest patterns based on workload characteristics | Final architecture decisions |
| Code optimization | Identify and fix performance bottlenecks in translated code | Review critical path optimizations |
| Load testing | Generate realistic test scenarios from production patterns | Validate test coverage |
| Monitoring | Detect anomalies, correlate with code changes | Diagnose root causes of complex issues |

## 4. Coexistence, Running Two Worlds Together

### 4.1 The Coexistence Reality

A 200-million-line COBOL estate cannot be modernized overnight. Even with AI assistance, the migration takes years. During this entire period, both the legacy mainframe and the modernized Azure environment must operate as a coherent system. Users do not know (and should not care) which system is serving their request.

This coexistence requires solving three sub-problems: data synchronization (how do both systems see the same data?), transaction routing (how does each request reach the right system?), and rollback capability (how do you revert if the modernized system fails?).

**Change Management as Product Feature:** Gartner (G00844741) emphasizes that change management must be engineered as a product feature, not wrapped as a service layer, organizations that rely on services-led adoption face competitive disadvantage by 2028. In the context of coexistence, this means the routing, traffic weighting, and gradual migration mechanisms (Sections 4.4-4.5) must be built as first-class platform features with clear APIs and dashboards, not manual toil-heavy processes managed by specialists. The platform should enable business stakeholders to observe and adjust cutover progress directly, reducing friction and accelerating confidence in the migration.

### 4.2 Coexistence Architecture

The coexistence architecture uses the [Strangler Fig pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/strangler-fig) with three infrastructure components:

**API facade**, [Azure API Management](https://learn.microsoft.com/en-us/azure/api-management/api-management-howto-deploy-multi-region) sits in front of both legacy and modern systems. All requests flow through the facade, which routes to the appropriate backend based on rules.

**Data synchronization layer**, [Change Data Capture (CDC)](https://www.confluent.io/use-case/liberate-mainframe-data/) replicates data changes between mainframe databases and Azure databases in near-real-time. Both systems see consistent data.

**Traffic routing layer**, [Azure Front Door](https://learn.microsoft.com/en-us/azure/frontdoor/routing-methods) with weighted routing controls what percentage of traffic goes to each system. Weights are adjustable without deployment.

### 4.3 Data Synchronization Patterns

### 4.3 Data Synchronization Patterns

Data synchronization is the most technically challenging aspect of coexistence. Three patterns address different scenarios:

**Pattern 1: Change Data Capture (CDC)**, For database-backed applications. CDC monitors the mainframe database (DB2, Adabas) transaction log and streams changes to the Azure database in near-real-time. Tools like tcVISION + Confluent Kafka handle mainframe-specific CDC. Latency: 1-5 seconds typical.

**Pattern 2: Event-Driven Sync**, For transaction-based applications. Each transaction on either system publishes an event to [Azure Service Bus](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-federation-patterns). Both systems subscribe to relevant events and update their local state. More complex but provides exactly-once semantics.

**Pattern 3: API-Based Sync**, For reference data that changes infrequently. A scheduled process or on-demand API call synchronizes reference tables between systems. Simplest to implement but only suitable for low-frequency changes.

**Critical rule:** Never dual-write. If both systems write to their own databases independently based on the same request, data will diverge. Always designate one system as the source of truth for each data domain and synchronize to the other.

### 4.4 Transaction Routing

The API facade routes each transaction based on rules:

**Route-by-transaction-type**, Modernized transaction types (e.g., account inquiry) route to Azure. Non-modernized types (e.g., wire transfer) route to mainframe. Simple and deterministic.

**Route-by-user-segment**, Early adopter users route to Azure. Other users route to mainframe. Enables controlled rollout to a subset of users.

**Route-by-percentage**, X% of all requests route to Azure, (100-X)% to mainframe. [Azure Front Door weighted routing](https://learn.microsoft.com/en-us/azure/frontdoor/routing-methods) implements this natively. Start at 1% and increase as confidence grows.

**Route-by-geography**, Specific branches or regions route to Azure. Others route to mainframe. Useful for phased regional rollout.

### 4.5 Gradual Traffic Migration

The traffic migration follows a controlled sequence:

1. **0%**, Modern system deployed, not serving traffic. Internal testing only.
2. **Shadow (0% live, 100% mirrored)**, All traffic goes to mainframe. Copies go to modern system for comparison (see [Section 5.2](#52-shadow-traffic-implementation)). No impact on users.
3. **1%**, First live traffic to modern system. Monitor for errors and performance.
4. **5%**, Expand if 1% is stable for 48+ hours. Continue monitoring.
5. **10% → 25% → 50%**, Progressive increase with validation at each step.
6. **100%**, Full migration. Mainframe enters standby (kept available for 30-90 days for emergency rollback).
7. **Decommission**, Mainframe decommissioned only after 100% validation period passes.

Each step requires meeting the go/no-go criteria (Section 5.5) before proceeding.

### 4.6 Rollback Strategy

Every production cutover step must be reversible within minutes:

**API gateway rollback**, Change routing rules in Azure API Management to redirect all traffic back to mainframe. Takes effect in seconds.

**Data rollback**, If the modern system has been the source of truth, recent changes must be replayed back to the mainframe database. CDC in reverse direction handles this.

**Feature flag rollback**, Application-level feature flags can instantly disable modernized code paths and fall back to legacy behavior for specific functions.

**Full environment rollback**, For catastrophic scenarios, the entire modern environment can be taken offline and all traffic routed to mainframe. Target: complete rollback within 15 minutes.

### 4.7 Session and State Management

When transactions split between two systems, session state must be consistent:

**Stateless services**, Design modernized services as stateless. Session state lives in Azure Cache for Redis or Azure SQL, accessible by any service instance.

**Token-based routing**, User sessions carry a token indicating which system version they are using. The API gateway reads the token and routes consistently for the duration of the session.

**Distributed transaction coordination**, For transactions that span both systems (rare but possible during transition), use the Saga pattern with compensating transactions rather than distributed two-phase commit.

## 5. Testing Strategy, Shadow Traffic and Behavioral Equivalence

### 5.1 Four Layers of Testing

| Layer | What It Tests | When | Tool |
|-------|--------------|------|------|
| **Unit tests** | Individual function correctness | After translation | AI-generated test suites (Claude Sonnet 4.6) |
| **Integration tests** | Component interactions, API contracts | After integration | Automated test framework + CI/CD |
| **Mutation tests** | Test suite quality for AI-generated code | During CI/CD | Mutation testing framework (Stryker, Mutants, or equivalent) |
| **Behavioral equivalence** | Same inputs → same outputs (legacy vs. modern) | Before any traffic routing | Parallel execution comparator |
| **Shadow traffic** | Production behavior under real load | Before live traffic cutover | Traffic mirroring infrastructure |

**Mutation Testing for AI Code Quality:** Gartner (G00822567) specifically recommends mutation testing for validation of AI-generated code, as traditional test suites may not catch subtle semantic errors introduced during automated translation. After Claude Sonnet 4.6 translates COBOL to Java/.NET, inject mutations (e.g., change `>` to `>=`, remove loop conditions) into the translated code and verify that the test suite catches each mutation. A mutation score <95% indicates insufficient test coverage for AI-generated code, flag for additional test generation.

### 5.2 Shadow Traffic Implementation

Shadow traffic (also called traffic mirroring) is the gold standard for validation before production cutover. The approach:

**How it works:** Every production request to the mainframe is simultaneously copied and sent to the modernized system. The mainframe response goes to the user. The modern system response is captured and compared, but never sent to the user.

**Implementation on Azure:** [Azure API Management](https://learn.microsoft.com/en-us/azure/api-management/api-management-howto-deploy-multi-region) can duplicate requests using policy-based routing. The `forward-request` policy sends the request to the mainframe (primary) and a `send-one-way-request` policy sends a copy to the modern system (shadow).

**Comparison engine:** A comparison service receives both responses and logs: functional equivalence (do the responses match?), performance delta (how much slower/faster is the modern system?), and error divergence (does either system produce errors the other doesn't?).

**Duration:** Run shadow traffic for at least 1 full business cycle (typically 1 month) to capture daily, weekly, and month-end processing patterns.

**Key constraint:** Shadow traffic generates load on the modern system equivalent to full production. Size the Azure infrastructure accordingly.

### 5.3 Behavioral Equivalence Testing

Behavioral equivalence ensures the modernized system produces identical business outcomes for the same inputs:

**Test data generation**, Claude Sonnet 4.6 generates comprehensive test data covering normal cases, boundary conditions, edge cases, and historical scenarios (month-end, year-end, leap year).

**Parallel execution**, The same input transaction is processed by both the legacy COBOL system and the modernized system. Outputs are captured and compared field by field.

**Tolerance rules**, Some differences are acceptable: timestamp formats, rounding in decimal calculations (5th decimal place), field ordering in responses. Define explicit tolerance rules before testing begins.

**Failure investigation**, Any behavioral divergence triggers investigation. The AI Review Agent categorizes divergences: cosmetic (acceptable), calculation difference (requires fix), logic error (critical, blocks migration).

### 5.4 Performance Regression Testing

Performance testing runs continuously alongside functional testing:

**Load testing**, Azure Load Testing simulates production peak loads (2x expected volume) against the modernized system while monitoring response times, throughput, and error rates.

**Soak testing**, Run the modernized system under sustained load for 48-72 hours to detect memory leaks, connection pool exhaustion, and other time-dependent issues.

**Stress testing**, Push beyond expected peak to find the breaking point. Know the capacity limits before production.

**Comparison reporting**, Automated reports compare modernized system performance against the legacy baseline. Any metric outside the performance budget (Section 3.3) is flagged for investigation.

**AI-Generated Tests in CI/CD:** Gartner (G00822567) recommends incorporating AI-generated tests into CI/CD pipelines as a primary quality gate, with the caveat that code generation tools tend to produce less secure code than human-written alternatives. Configure the CI/CD pipeline (Section 6.3) to automatically generate comprehensive test suites with Claude Sonnet 4.6 for each translated code increment, enforce mutation testing (see Section 5.1) as a gate, and supplement with automated security scanning (GitHub Advanced Security) before any code reaches main branch.

### 5.5 Go/No-Go Decision Criteria

A modernization increment proceeds to production only when ALL criteria are met:

| Criterion | Threshold | Measurement |
|-----------|-----------|-------------|
| Complexity score | ≤ 7 (of 10) | Discovery Agent assessment |
| Test coverage | ≥ 85% | Automated coverage analysis |
| Behavioral equivalence | 100% | Parallel execution comparison |
| Performance (online p95) | Within 10% of baseline | Load testing results |
| Performance (batch total time) | Within 15% of baseline | Batch execution comparison |
| Security scan | Zero critical/high findings | GitHub Advanced Security |
| Shadow traffic validation | 1 full business cycle clean | Comparison engine report |

If any criterion fails, the increment stays in testing. The guardrail system (green/yellow/red) from the [governance framework](./06_Technical_Architecture_Agentic_Framework_v1.2.0_2026-03-12.md#94-modernization-guardrails) enforces this automatically.

## 6. End-to-End Workflow, From Discovery to Production

### 6.1 Phase 1: Code Archaeology (Weeks 1-2)

**Objective:** Complete understanding of the COBOL estate.

**Activities:** Deploy Discovery Agent (Claude Opus 4.6 + Haiku 4.5). Scan entire repository. Generate application inventory, dependency graph, complexity scores. Identify bounded contexts and cut-points. Present findings to architecture team.

**Outputs:** Application inventory (JSON + Markdown), dependency graph, complexity matrix, initial carving proposal.

**Key resources:** [Claude Code MCP documentation](https://docs.anthropic.com/en/docs/claude-code/mcp), [Anthropic Tool Use and MCP Guide](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use).

### 6.2 Phase 2: Carving and Planning (Weeks 3-4)

**Objective:** Finalize modernization units and target architecture.

**Activities:** Refine bounded contexts with business stakeholders. Validate cut-points with architecture team. Define target architecture per context (AKS microservices, Azure Functions, Azure SQL). Establish performance baselines. Set up data synchronization infrastructure (CDC). Configure Azure AI Foundry with Claude models. Set up MCP servers.

**Outputs:** Approved modernization plan, target architecture document, performance baseline, infrastructure ready.

### 6.3 Phase 3: Translation and Testing (Weeks 5-8)

**Objective:** Translate first modernization increment and achieve 85%+ test coverage.

**Activities:** Translation Agent (Claude Sonnet 4.6) converts COBOL to target language. Test Generation Agent creates unit and integration tests. Review Agent validates code quality. Security Agent scans for vulnerabilities. CI/CD pipeline via [GitHub Actions](https://github.blog/ai-and-ml/automate-repository-tasks-with-github-agentic-workflows/) automates build and test.

**Outputs:** Translated code in GitHub repository, test suite with 85%+ coverage, security scan report, code review approvals.

### 6.4 Phase 4: Parallel Run and Validation (Weeks 9-10)

**Objective:** Validate behavioral equivalence and performance under real conditions.

**Activities:** Deploy modernized system to Azure staging environment. Run behavioral equivalence tests with production data samples. Start shadow traffic (mirror production traffic to modern system). Compare responses and performance. Fix any divergences found.

**Outputs:** Behavioral equivalence report (100% match), performance comparison report (within budget), shadow traffic validation report.

### 6.5 Phase 5: Gradual Cutover (Weeks 11-12)

**Objective:** Migrate production traffic to modernized system with zero downtime.

**Activities:** Begin gradual traffic migration (1% → 5% → 10% → 25% → 50% → 100%). Monitor in real-time via [Azure Monitor](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview). Validate go/no-go criteria at each step. Maintain rollback capability throughout. Legacy system enters standby mode after 100% migration.

**Outputs:** Production modernization complete for first increment, monitoring dashboards, rollback plan tested and documented.

### 6.6 Phase 6: Factory Model (Month 3+)

**Objective:** Apply learned patterns at scale.

**Activities:** Package proven patterns into reusable agent workflows. Train additional team members. Apply multi-agent pipeline ([Document 6, Section 5](./06_Technical_Architecture_Agentic_Framework_v1.2.0_2026-03-12.md#5-agent-orchestration-patterns)) to next modernization increments. Track throughput: target 200K-500K LOC per month at Maturity Level 4.

**Outputs:** Repeatable modernization factory, throughput metrics, continuous improvement process.

## 7. Azure Services for Each Challenge

| Challenge | Azure Service | Role |
|-----------|--------------|------|
| **Carving: Discovery** | Azure AI Foundry (Claude Opus) | Full-estate code analysis |
| **Carving: Dependency mapping** | GitHub (source), LeanIX (catalog) | Source code + service catalog |
| **Performance: Baseline** | Azure Monitor | Ingest mainframe SMF/RMF metrics |
| **Performance: Load testing** | Azure Load Testing | Simulate production loads |
| **Performance: Monitoring** | [Application Insights](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview) | Distributed tracing (OpenTelemetry) |
| **Performance: Compute** | [AKS](https://learn.microsoft.com/en-us/azure/aks/what-is-aks) + auto-scaling | Online transaction processing |
| **Performance: Batch** | [Azure Batch](https://learn.microsoft.com/en-us/azure/architecture/example-scenario/mainframe/reengineer-mainframe-batch-apps-azure) / Functions | Batch processing equivalence |
| **Coexistence: Facade** | [API Management](https://learn.microsoft.com/en-us/azure/api-management/api-management-howto-deploy-multi-region) | Traffic routing and shadowing |
| **Coexistence: Data sync** | [CDC (Confluent/tcVISION)](https://www.confluent.io/use-case/liberate-mainframe-data/) + Service Bus | Real-time data replication |
| **Coexistence: Traffic routing** | [Azure Front Door](https://learn.microsoft.com/en-us/azure/frontdoor/routing-methods) | Weighted traffic distribution |
| **Testing: Shadow traffic** | API Management (duplicate requests) | Mirror production traffic |
| **Testing: Comparison** | Azure Functions + Cosmos DB | Response comparison engine |
| **Rollback** | API Management + Front Door | Instant traffic rerouting |

## 8. Common Pitfalls and Mitigations

| Pitfall | Impact | Mitigation |
|---------|--------|-----------|
| Modernize and enhance simultaneously | Scope explosion, 3-5x timeline | Modernize first (functional equivalence), enhance second (new features) |
| Underinvest in testing | Production defects, stakeholder loss of confidence | Automated testing from Day 1, 85% coverage minimum, mandatory shadow traffic |
| Ignore data synchronization complexity | Data inconsistency between systems, business errors | Design CDC infrastructure in Phase 2, test thoroughly before any traffic routing |
| Skip performance baselining | No way to validate performance equivalence | Baseline in Phase 1, measure continuously, automated performance regression |
| Assume big-bang cutover | All-or-nothing risk, no rollback path | Gradual traffic migration (1% → 100%), rollback at every step |
| Treat AI as magic | Over-reliance on AI translation without validation | Human-in-the-loop at all decision points, AI assists but humans approve |
| Forget about Natural/Adabas | Different migration patterns needed | Separate assessment for Natural estates, Adabas→SQL requires schema redesign |
| Ignore month-end/year-end scenarios | Batch failures during critical processing periods | Test with month-end and year-end data, validate batch windows specifically |

## 9. AI Governance and Risk Management

### AI Governance Evolution

IDC (US54300026) reports that AI governance is evolving from manual, principles-based approaches to automated operational controls in 2026, driven by the EU AI Act, NIST AI Risk Management Framework (AI RMF), and ISO 42001. In the context of COBOL modernization:

**Governance layers:**
- **Model governance**, Track which Claude models (Opus, Sonnet, Haiku) perform which tasks in the multi-agent pipeline (Document 6, Section 5). Log model versions, context windows used, cost per agent run, and accuracy metrics.
- **Agent governance**, IDC (US54300026) emphasizes AgentOps capabilities for agent selection, tracking, evaluation, and governance. In practice: instrument Discovery, Analysis, Translation, Review, and Security agents with telemetry; track decision rationale; enable rollback of agent decisions if behavioral equivalence fails.
- **Data governance**, Ensure COBOL source code, test data, and runtime metrics are handled per organizational data classification and regulatory requirements (GDPR, HIPAA, SOC 2).
- **Escalation governance**, Define decision gates where AI recommends but humans must approve: high-complexity carving decisions (Complexity >8), performance budget violations, security findings above Medium severity.

Embed these controls into the [governance framework](./06_Technical_Architecture_Agentic_Framework_v1.2.0_2026-03-12.md#94-modernization-guardrails) from Day 1. Automated governance reduces compliance risk and enables confident deployment of agentic workflows at scale.

### Agent Anarchy Risk

Gartner (G00825163) warns of "agent anarchy" risk where poorly orchestrated agents cause vicious loops and unpredictable behavior, making robust agent lifecycle management essential. In the COBOL modernization context:

**Agent anarchy scenarios:**
- Discovery Agent and Analysis Agent contradict each other's carving recommendations, causing circular re-analysis.
- Translation Agent and Review Agent enter a loop: Review rejects code, Translation re-generates, Review rejects again due to different criteria.
- Multiple agents writing to shared metadata simultaneously, causing data corruption.

**Mitigations:**
- **Agent orchestration**, Use the [master orchestration pattern](./06_Technical_Architecture_Agentic_Framework_v1.2.0_2026-03-12.md#5-agent-orchestration-patterns) from Document 6, Section 5. Each agent has clear inputs, outputs, and state ownership. No agent reads/writes another agent's outputs without explicit handoff.
- **Agent versioning**, Version each agent (Discovery v1.0, v1.1, etc.) and lock to specific versions in production workflows. Do not auto-upgrade agents mid-increment.
- **Timeout and circuit breaker**, Set execution timeouts and max-retry limits. If an agent exceeds time or retry budget, escalate to human instead of looping.
- **Validation gates**, After each agent, validate that outputs are stable and non-contradictory before proceeding to next agent. A behavioral divergence between two consecutive agent runs triggers investigation before proceeding.

These controls are built into the governance framework and tested in Maturity Level 2 and 3 scenarios (Document 6, Section 7.2).


## Document Series Navigation

| # | Document | Status |
|---|----------|--------|
| 1 | 01_Market_Trends_Predictions.md |  |
| 2 | 02_Legacy_Modernization_Strategy_Guide.md |  |
| 3 | 03_AI_Driven_Modernization_Claude_Opus_Analysis.md |  |
| 4 | 04_Comprehensive_Assessment_Framework.md |  |
| 5 | 05_Agentic_COBOL_Modernization_Strategy_Business_Case.md |  |
| 6 | 06_Technical_Architecture_Agentic_Framework.md |  |
| **7** | **07_Operational_Playbook_Carving_Performance_Coexistence.md** | **← You are here** |
| 8 | 08_Customer_FAQ_Agentic_Modernization.md |  |
| 9 | 09_Comparative_Analysis_Kyndryl_vs_Our_Strategy.md |  |
| 10 | 10_Comparative_Analysis_Generated_vs_Source_Materials.md |  |

## References

### Analyst Research (Cited)

- **Gartner**, "Assessing GenAI for Modernizing Legacy Application Code" (G00822567), Dec 2024. Cited for mutation testing recommendations and AI-generated test quality guidance.
- **Gartner**, "5 Agentic AI Capabilities That Turn Autonomy Into Adoption" (G00844741), Jan 2026. Cited for change management as product feature and continuous value realization via telemetry.
- **Gartner**, "Innovation Insight for the AI Agent Platform Landscape" (G00825163), Mar 2025. Cited for agent anarchy risk and agent lifecycle management.
- **IDC**, "2026 Ushers in Deeper Maturity in the Agentic Era" (US54300026), Feb 2026. Cited for AgentOps capabilities and AI governance evolution.

### Architecture and Technical References

- [Azure Architecture, Strangler Fig Pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/strangler-fig)
- [Azure Architecture, Extend Mainframe Applications](https://learn.microsoft.com/en-us/azure/architecture/example-scenario/mainframe/extend-mainframe-applications)
- [Azure Architecture, Reengineer Mainframe Batch Apps](https://learn.microsoft.com/en-us/azure/architecture/example-scenario/mainframe/reengineer-mainframe-batch-apps-azure)
- [Azure API Management, Multi-Region Deployment](https://learn.microsoft.com/en-us/azure/api-management/api-management-howto-deploy-multi-region)
- [Azure Front Door, Routing Methods](https://learn.microsoft.com/en-us/azure/frontdoor/routing-methods)
- [Azure Service Bus, Federation Patterns](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-federation-patterns)
- [Azure Monitor, Application Insights](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)
- [Azure AKS Overview](https://learn.microsoft.com/en-us/azure/aks/what-is-aks)
- [Confluent, Liberate Mainframe Data (CDC)](https://www.confluent.io/use-case/liberate-mainframe-data/)
- [Azure Cloud Adoption Framework, Mainframe Migration](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/infrastructure/mainframe-migration/migration-strategies)
- [LeanIX, GitHub and Azure Pipelines Integration](https://docs-vsm.leanix.net/changelog/leanix-now-integrates-with-github-and-azure-pipelines)
- [IBM, System Management Facilities (SMF)](https://www.ibm.com/docs/en/zos/2.5.0?topic=management-system-facilities-smf)
- [Anthropic, Tool Use and Model Context Protocol](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use)
- [Claude Code MCP Documentation](https://docs.anthropic.com/en/docs/claude-code/mcp)
