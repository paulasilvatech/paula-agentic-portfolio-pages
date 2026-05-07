---
title: "The AI-Native Enterprise Pyramid: The Architecture of the Stack"
description: "The five-layer architectural model for the AI-native enterprise (Platform, Context, Cognitive, Intent, Agentic), the dependency stacking rule, and how the model translates the amplification thesis into engineering decisions."
author: "Paula Silva"
role: "Software Global Black Belt"
contact: "paulasilva@microsoft.com"
date: "2026-05-05"
version: "1.0.0"
status: "draft"
locale: "en"
brand: "Agentic DevOps"
tags: [pyramid, five-layers, platform-engineering, context-engineering, cognitive-layer, intent-engineering, agentic-layer, stacking-rule]
---

# Chapter 02: The AI-Native Enterprise Pyramid

> **Argument.** The AI-native enterprise is not a single architectural object. It is a pyramid of five layers, each of which depends on the one below it, each of which is meaningful only when the dependency is satisfied. Platform Engineering is the base; Context, Cognitive, Intent, and Agentic layers stack on top. The stacking rule is not a recommendation; it is a structural law. Layers can be retrofitted, but only in dependency order. Building agents on a missing platform foundation does not produce agents; it produces an amplified mess. This chapter maps the pyramid, defines each layer, and codifies the stacking rule that governs sequencing decisions for the rest of the playbook.

---

## Table of Contents

1. [Why a Pyramid, Not a Layer Cake](#1-why-a-pyramid-not-a-layer-cake)
2. [The Five Layers](#2-the-five-layers)
3. [Layer 1: Platform Engineering](#3-layer-1-platform-engineering)
4. [Layer 2: Context](#4-layer-2-context)
5. [Layer 3: Cognitive](#5-layer-3-cognitive)
6. [Layer 4: Intent](#6-layer-4-intent)
7. [Layer 5: Agentic](#7-layer-5-agentic)
8. [The Stacking Rule](#8-the-stacking-rule)
9. [Common Mistakes and How the Pyramid Names Them](#9-common-mistakes-and-how-the-pyramid-names-them)
10. [How the Pyramid Maps to the Two Accelerators](#10-how-the-pyramid-maps-to-the-two-accelerators)
11. [Synthesis: From Architecture to Sequencing](#11-synthesis-from-architecture-to-sequencing)
12. [References](#references)

---

## 1. Why a Pyramid, Not a Layer Cake

The AI-native enterprise is sometimes diagrammed as a stack of horizontal layers (a cake), with arrows running between them. The cake metaphor is misleading because it implies the layers are roughly equal in size, in difficulty, and in investment. They are not.

A pyramid is a more honest geometry. The base layer (Platform Engineering) is broader, takes more investment, and supports everything above it. Each layer above is narrower, more specialized, and explicitly conditional on the layer below it. The pyramid metaphor captures three properties the cake metaphor obscures.

**First, the foundation is wider than the apex.** Platform Engineering serves every workload (human-driven, AI-driven, agentic) and every team (engineering, data, security). The Agentic layer at the top serves a narrower set of well-bounded use cases. Investing equally in all five layers is structurally wrong; the lower layers warrant disproportionate investment because they support disproportionate scope.

**Second, removing a stone does not produce a smaller pyramid.** It produces a collapse. If the Context layer is missing, the Intent layer cannot exist, because intent without context is description without grounding. If the Platform layer is weak, all four layers above it inherit the weakness. The pyramid is not a Lego model where blocks can be removed and the rest stays standing. It is a load-bearing structure.

**Third, the pyramid is built bottom-up.** A pyramid cannot be constructed top-down; you cannot suspend the apex in the air and assemble the base around it later. The same is true of the AI-native enterprise. The Platform layer is built first because the layers above it require platform primitives to exist. The construction order is non-negotiable.

These three properties are why this chapter calls the model a pyramid. The geometry is the argument.

---

## 2. The Five Layers

The pyramid has five layers. Reading from base to apex:

```
            +-----------------------------+
            |      5. Agentic Layer       |   Autonomous, goal-driven agents
            +-----------------------------+
            |      4. Intent Layer        |   Codified goals, policies, specifications
            +-----------------------------+
            |     3. Cognitive Layer      |   Models, reasoning, evaluation
            +-----------------------------+
            |      2. Context Layer       |   Codified enterprise knowledge
            +-----------------------------+
            |  1. Platform Engineering    |   Self-service, policy, observability
            +-----------------------------+
```

Each layer answers a specific question. Each layer is operated by a specific organizational owner. Each layer has specific outputs that feed the layer above it.

| Layer | Question It Answers | Operational Owner | Primary Outputs |
|-------|---------------------|-------------------|-----------------|
| 1. Platform Engineering | How do we deliver software safely at scale? | Platform team | Golden Paths, Guardrails, Safety Nets, Manual Review |
| 2. Context | What does the enterprise know? | Platform team + data and knowledge teams | Service catalog, lineage graph, vector stores, MCP servers, semantic context layer |
| 3. Cognitive | What models and evaluators do we use? | Platform team + AI/ML team | Model gateway, evaluation pipelines, prompt registry, fine-tuned models |
| 4. Intent | What does the enterprise want? | Product, business, and platform teams | Constitutions, specifications, policy-as-code, agent permission scopes |
| 5. Agentic | What autonomous work runs in production? | Application teams | Production agents with identity, scope, observability, and governance |

The remainder of the chapter goes deep on each layer. The layer-by-layer treatment serves two purposes: it makes each layer's contribution to the whole legible, and it surfaces the dependencies that the stacking rule (section 8) makes operative.

---

## 3. Layer 1: Platform Engineering

### 3.1 What the Layer Does

Platform Engineering is the self-service, policy-governed, observable substrate that abstracts infrastructure complexity into developer-usable primitives. Its outputs are the [CNCF Four Pillars](https://tag-app-delivery.cncf.io/whitepapers/platform-eng-maturity-model/) (Golden Paths, Guardrails, Safety Nets, Review Workflows), covered in depth in chapter 03.

Without this layer, nothing above it is reliable at scale. With it, the enterprise has the deterministic primitives required to compose context, cognition, intent, and agency into a coherent operating system.

### 3.2 What "Self-Service" Actually Means

Self-service is the most-misunderstood property of Platform Engineering. It does not mean a wiki page with deployment instructions. It does not mean an internal Stack Overflow. It means:

- A developer (or an agent) can go from "I want to build X" to "X is running in a compliant configuration in production" without filing a ticket with the platform team.
- The path from intent to running system is a single workflow that the platform team owns, versions, and improves continuously.
- The path produces a configuration that satisfies enterprise policy by construction, not by review.

In practice, self-service in 2026 means a Backstage scaffolder template (Open Horizons) or an RHDH software template (Three Horizons) that, when invoked, generates a complete project including code skeleton, CI/CD pipeline, infrastructure-as-code, observability configuration, and policy bindings. The developer (or agent) provides the parameters that legitimately vary; the platform encodes everything else.

### 3.3 What "Policy-Governed" Actually Means

Policy-governed means policies are enforced at admission, not detected after deployment. This distinction is the difference between preventive and detective controls, and it is the structural reason the foundation matters more in 2026 than it did in 2022.

Detective controls are too slow for AI-driven workloads. By the time a detective control surfaces a violation, the agent that produced the violation has already moved on to the next action, and the violation is propagating. Preventive controls reject the violation before it is committed, before it is built, before it is deployed.

Preventive controls in 2026 are implemented via [OPA Gatekeeper](https://open-policy-agent.github.io/gatekeeper/), [Kyverno](https://kyverno.io/), [Azure Policy](https://learn.microsoft.com/en-us/azure/governance/policy/overview), and Workload Identity. Each of these is a platform primitive. Each is part of the Platform layer.

### 3.4 What "Observable" Actually Means

Observable means every action on the platform produces a trace, a metric, a log, and (in 2026) a trajectory. The trajectory is the agent-era extension of traditional observability: the complete record of what an agent did in a session, including the prompts it received, the tools it called, the outputs it produced, and the costs it incurred.

The platform must capture trajectories from day one. Without trajectories, there is no debugging, no improvement loop, and no audit. Chapter 06 of the Context Platform Stack covers trajectory observability as a harness component; the Platform layer of the pyramid is what makes trajectory capture deterministic.

### 3.5 The Layer's Boundary

The Platform layer ends where the Context layer begins. The Platform owns the primitives (compute, identity, secrets, networking, observability, policy enforcement); the Context layer above owns the *content* that flows through those primitives (service catalogs, documentation, vector stores, lineage graphs).

The boundary is sometimes blurred in practice because both layers are operated by the platform team in most organizations. The conceptual separation matters because the layers fail differently and warrant different investments. A weak Platform layer fails as outages and security incidents. A weak Context layer fails as hallucinations and stale information. Understanding which layer is producing which failure is the first step in fixing either.

---

## 4. Layer 2: Context

### 4.1 What the Layer Does

The Context layer is the codified representation of the enterprise's knowledge, data, and decisions in machine-consumable form. It is what arXiv:2602.20478 ("Codified Context Infrastructure") frames as the **context graph**: the integration of service catalogs, documentation systems, data catalogs, and vector stores into a single retrievable surface.

The Context layer answers the question "what does the enterprise know?" in a form that is queryable by humans and by agents. It produces the substrate without which the layers above it have nothing to reason over.

### 4.2 The Surfaces of the Context Layer

The Context layer materializes through several surfaces, each exposing a different facet of enterprise knowledge.

**Service catalog.** The authoritative inventory of services, their owners, their dependencies, their operational status. In Open Horizons this is the Backstage catalog; in Three Horizons it is the RHDH catalog. The catalog is the discovery surface for both human developers (what services exist?) and agents (what can I integrate with?).

**Documentation graph.** Documentation-as-code, versioned alongside the system it documents, queryable in the same surface as the service catalog. Backstage TechDocs and RHDH TechDocs are the operational implementations. The documentation graph is what allows an agent to retrieve "how do we do X here?" with the enterprise's own answer rather than a generic answer.

**Data catalog and lineage.** [Microsoft Purview](https://learn.microsoft.com/en-us/purview/) or equivalent tooling that tracks data assets, their schemas, their owners, and their lineage. Lineage answers the question "where did this data come from?" which is the precondition for any data quality intervention and for any compliance assertion.

**Vector stores and embedding pipelines.** Azure AI Search, pgvector on managed PostgreSQL, or Cosmos DB vector. Embedded representations of enterprise text artifacts (documents, code, conversations) that allow semantic retrieval rather than keyword retrieval. The vector store is what makes Retrieval-Augmented Generation work at enterprise scale.

**MCP servers.** The [Model Context Protocol](https://modelcontextprotocol.io/) servers that expose enterprise systems (Azure, GitHub, Slack, ServiceNow, ITSM, monitoring, etc.) to AI agents through a standard protocol. MCP is the integration surface that converts existing enterprise systems into agent-consumable context sources without bespoke per-system integration.

**Semantic context layer.** The deterministic, semantic representation of how the enterprise's codebase actually works (Paula Silva's [SCL-AD framework](#)). Semantic context is what reduces hallucinations and token consumption in large-scale agent deployments.

### 4.3 Why the Context Layer Depends on the Platform Layer

The Context layer cannot exist without the Platform layer because the Context layer's freshness, accuracy, and trust depend on platform primitives.

- **Lineage requires platform-level event capture.** Without standard events emitted by the platform's CI/CD, deploy, and runtime surfaces, lineage is incomplete and stale.
- **Service catalog requires platform-level service registration.** Without a platform that registers services automatically when they are deployed, the catalog drifts toward fiction.
- **Vector stores require platform-level identity and access control.** Without RBAC scoped to the vector store, agents see what they should not see, and audit becomes impossible.
- **MCP servers require platform-level networking and identity.** Without Workload Identity, MCP servers run with long-lived credentials, which is a security regression no security review will tolerate.

The DataHub 88% paradox covered in chapter 01 is the empirical evidence for this dependency. Organizations that prioritize context investment without the platform foundation discover that the context they built rots faster than they can refresh it. The platform is the mechanism that keeps context fresh.

### 4.4 The Layer's Boundary

The Context layer ends where the Cognitive layer begins. The Context layer owns the *retrievable knowledge*; the Cognitive layer owns the *reasoning over that knowledge*. The two are tightly coupled in operational practice (a RAG application straddles both), but conceptually they are separable: replacing the model in a RAG application does not change the context layer, and replacing the vector store does not change the model.

---

## 5. Layer 3: Cognitive

### 5.1 What the Layer Does

The Cognitive layer is the models and reasoning services that consume context to produce outputs. This includes foundation models (Claude, GPT, Gemini, open-weight models), fine-tuned models, embedding services, and evaluation pipelines.

The Cognitive layer answers the question "what reasoning capabilities are available, and at what cost, and with what guarantees?". It exposes those capabilities as platform primitives that the layers above can consume without having to negotiate with model vendors directly.

### 5.2 The Components of the Cognitive Layer

**Model gateway.** A central proxy through which all model traffic flows. The gateway provides routing (which model gets which request), metering (what does each request cost), governance (which workloads can call which models), and observability (latency, errors, content filters). [Azure AI Foundry](https://learn.microsoft.com/en-us/azure/ai-foundry/) is the canonical model gateway in both accelerators in this playbook.

**Multi-model access.** Foundry exposes OpenAI models, Anthropic Claude, Meta Llama, Mistral, and others through a unified surface. Multi-model is operationally important because no single model is best for every workload; the gateway lets the platform route appropriately without requiring application teams to negotiate per-model integrations.

**Embedding services.** Models specialized for producing vector embeddings used by the vector store in the Context layer. Embedding choices have compounding consequences (you cannot easily change the embedding model without re-embedding the entire corpus), so the platform layer typically standardizes on one or two embedding models and exposes them as platform primitives.

**Fine-tuned models.** Where the enterprise has invested in fine-tuning, the fine-tuned model lives behind the gateway like any other model. Fine-tuning is decreasingly important in 2026 (RAG and prompting cover most use cases), but the cognitive layer must support it for the cases where it remains operationally justified.

**Evaluation pipelines.** Frameworks ([Microsoft Foundry Evaluations](https://learn.microsoft.com/en-us/azure/ai-foundry/), [LangSmith Evals](https://docs.smith.langchain.com/), [Inspect AI](https://inspect.ai-safety-institute.org.uk/), [Promptfoo](https://www.promptfoo.dev/), [DeepEval](https://www.confident-ai.com/)) that test prompts and agents against golden datasets, return quantitative metrics, and feed back into the prompt or agent registry. Evaluation is a cognitive-layer capability that becomes critical at the Intent layer above.

### 5.3 The Cognitive Layer Is Mostly Build-vs-Buy

Unlike the Platform and Context layers, the Cognitive layer is dominated by build-vs-buy decisions. The major platforms (Foundry, Bedrock, Vertex AI) provide most of the components most enterprises need. The cognitive layer is rarely the bottleneck for AI-native success because the components are commoditizing rapidly.

The bottleneck the Cognitive layer creates is around governance: which models are approved for which classes of data, what is the data residency posture, how is content filtering configured, how is misuse detected and stopped. These are policy questions, but the answers materialize as cognitive-layer configuration: model allowlists, region restrictions, content-filter thresholds, abuse-detection rules.

### 5.4 The Layer's Boundary

The Cognitive layer ends where the Intent layer begins. The Cognitive layer provides reasoning *capability*; the Intent layer above codifies *what to reason about, in service of what goal, under what constraints*. A model is a model; an intent is a model plus a constitution plus a specification plus a permission scope.

---

## 6. Layer 4: Intent

### 6.1 What the Layer Does

The Intent layer is the codified representation of *what the enterprise wants*, expressed in a form that agents can plan against. This is the domain of [Vishnyakova et al. (arXiv:2603.09619)](https://arxiv.org/abs/2603.09619), which lays out a dependency hierarchy from prompt engineering through context engineering, intent engineering, and specification engineering.

Intent without context is hallucination; context without intent is description without direction. The Intent layer is where the enterprise's strategy meets the agent's capability.

### 6.2 The Artifacts of the Intent Layer

**`CONSTITUTION.md`.** The strategic guide for the agent or for the system the agent is operating in. The constitution defines what the system is, who it serves, what it must always do, what it must never do, and what trade-offs are acceptable in ambiguous cases. The constitution is the most-stable artifact in the Intent layer; it changes rarely and deliberately.

**`SPECIFICATION.md`.** The tactical guide for a specific feature or task. The specification translates the constitution into a particular outcome the agent is expected to produce, with acceptance criteria. The specification is the gate input for the implementation work that follows.

**Policy-as-code.** The mechanical representation of the rules the agent must obey. Permission scopes, action allowlists, cost ceilings, data-access restrictions. Policy-as-code is the bridge between Intent (strategic) and Platform (enforced); it is where intent becomes operational.

**Agent permission scopes.** The specific set of resources and actions an agent is authorized to access. In Microsoft's foundation, these are managed via [Entra Agent ID](https://learn.microsoft.com/en-us/entra/) and Authorization Fabric. In both accelerators, agent permission scopes are versioned alongside the agent's code and reviewed on every change.

**Pre-implementation gates.** The harness components that block implementation work until intent is sufficiently codified. The Spec-Driven Development workflow covered in chapter 04 of the Context Platform Stack is the canonical pattern: Constitution → Specification → Implementation Plan → Approval → Implementation. Each transition is a gate; each gate is part of the Intent layer.

### 6.3 Why the Intent Layer Depends on the Cognitive and Context Layers

The Intent layer cannot exist meaningfully without the Cognitive layer below it because intent is expressed in natural language, which only becomes operational when a cognitive system can interpret it. A `CONSTITUTION.md` without a model that can read and apply it is a Word document.

The Intent layer cannot exist meaningfully without the Context layer because intent is grounded in the enterprise's specific reality. A constitution that says "follow our coding conventions" is empty without a context layer that exposes what those coding conventions actually are. A specification that says "integrate with our payment system" is empty without a context layer that exposes what the payment system is, where it lives, and what its contracts are.

This is the structural reason why Intent Engineering as a discipline emerged after Context Engineering. You cannot codify intent productively until context is codified, because intent without context produces plausible-sounding hallucination at scale.

### 6.4 The Layer's Boundary

The Intent layer ends where the Agentic layer begins. The Intent layer codifies *what should happen*; the Agentic layer is *what actually runs in production* with the codified intent as its operating contract. The boundary is sometimes faint (an agent's system prompt is intent that lives inside the agent), but conceptually the separation matters: an agent without codified intent is non-deterministic; an agent with codified intent is governed.

---

## 7. Layer 5: Agentic

### 7.1 What the Layer Does

The Agentic layer is autonomous, goal-driven agents that combine intent, context, and cognition to take action. This is the visible layer for most AI investment in 2026, and it is the layer most likely to fail when the layers beneath it are missing.

Gartner's 40% cancellation prediction (chapter 01) is, structurally, a prediction about agent deployments on unfit foundations. The agents that get cancelled are the agents whose pyramid is missing one or more lower layers.

### 7.2 What an Agent Is, Operationally

The 2026 working definition of an agent, as it has consolidated across the literature, is compact:

> Agent = Model + Harness

The model is the reasoning capability (covered by the Cognitive layer). The harness is everything around the model: tools, memory, state, context, validation, security, lifecycle, gates, sensors, guides. The harness is composed from the Platform, Context, and Intent layers underneath.

When somebody says "I built an agent," what they actually built is a harness pointed at a model. The model is the pluggable component. The harness is the differentiator. The harness is the AI-Native Enterprise Pyramid in operational form.

### 7.3 What Agents Need from the Layers Below

| The agent needs | Provided by | Failure mode if missing |
|------------------|-------------|-------------------------|
| Identity that audit can attribute | Platform (Entra Agent ID) | Agent actions cannot be audited; regulatory exposure |
| Permission scope that risk can certify | Intent (policy-as-code) + Platform (enforcement) | Agent acts outside its authorized scope |
| Context that grounds its outputs | Context (catalog, MCP, vector stores) | Hallucination; outputs not aligned with enterprise reality |
| Reasoning capability with cost ceiling | Cognitive (model gateway, metering) | Runaway cost; no SLA on latency |
| Observability that can replay decisions | Platform (trajectory capture) | Cannot debug, cannot improve, cannot certify |
| Promotion gates that protect production | Platform (Manual Review) + Intent (specs) | Agent is promoted to scope it has not been validated for |

The Agentic layer is the consumer of every other layer. An agent in production is the integrated test of whether the four lower layers are operating correctly. If the agent is succeeding, the foundation is sound. If the agent is failing in production, the failure mode is almost always traceable to a specific lower-layer gap.

### 7.4 The Three Patterns of Agentic Workloads

Three patterns dominate agentic deployments in 2026, each with different demands on the layers below.

**Single-agent, scoped task.** The agent has a narrow, well-defined task (issue triage, document summarization, report generation). The harness demand is minimal. The pyramid below can be relatively lean (Platform + Context + Cognitive at moderate maturity, Intent layer can be light).

**Multi-agent, complex orchestration.** Multiple agents coordinate (Planner, Generator, Evaluator, per Anthropic's 2026 paper). The harness demand is significant: shared state, routing, sprint contracts, evaluation gates. The pyramid below must be at higher maturity, especially the Intent layer.

**Long-running autonomous agent.** The agent runs over hours, days, or weeks, accumulating state, recovering from failures, completing complex multi-session work. The harness demand is the highest: context compaction, persistent memory, garbage collection, drift detection, continuous evaluation. The pyramid must be at near-full maturity at every layer.

The implication for sequencing: enterprises starting their agentic journey should start with single-agent scoped tasks, validating the pyramid is correctly composed, before progressing to multi-agent and long-running patterns. Skipping to long-running autonomous agents on a young pyramid is the most common cause of project cancellation in the Gartner cohort.

---

## 8. The Stacking Rule

### 8.1 The Rule

Each layer of the pyramid can be retrofitted, but only in dependency order. The stacking rule is non-negotiable:

> **You cannot build layer N+1 faster than layer N. You can only build them faster in parallel if you are willing to carry the debt that comes from the gap.**

The rule sounds rigid because it is. It is also empirically grounded. The 2025-2026 evidence in chapter 01 is the macro-scale validation; every client engagement that has failed in LATAM in the past two years is the micro-scale validation. The failures share a common shape: a layer above was scaled before the layer below it was ready.

### 8.2 The Failure Pattern: Skipping Forward

The most common skip pattern is to invest in the Agentic layer (visible, exciting, easy to fund) without investing in the Platform and Context layers (invisible, unglamorous, harder to fund). The result is an agent that works in demos and fails in production. The agent does not have grounded context; it does not have governed permissions; it does not have observable trajectories. It hallucinates. It exceeds its budget. It triggers an incident. It gets cancelled.

The remediation is not to fix the agent. The remediation is to retrofit the missing layers. The retrofit is more expensive than building correctly the first time, because the agent has already been deployed, has been demoed to executives, and has built up expectations that the platform now has to absorb retroactively.

### 8.3 The Failure Pattern: Building Out of Order

A subtler skip pattern is to invest in the Intent layer before the Context layer is ready. The team writes elaborate constitutions, specifications, and policy-as-code. The artifacts look impressive. They reference systems, conventions, and decisions that the Context layer does not yet expose in machine-consumable form. When an agent tries to consume the intent artifacts at runtime, it produces plausible-sounding output that does not actually align with enterprise reality.

This pattern is harder to detect because the intent artifacts look correct in isolation. The detection signal is that agents using the intent artifacts produce inconsistent outputs and require human review to be useful. The diagnosis is that the intent is grounded in a context that does not yet exist.

### 8.4 The Failure Pattern: Building in Parallel Without Naming the Debt

The third pattern is the most operationally common. The organization invests in all layers in parallel, on equal footing, without acknowledging the dependency structure. The layers progress unevenly. The lower layers fall behind. The upper layers wait for them, but the wait is not visible to the executive sponsor, who sees only that the program is slower than promised.

This pattern manifests as a quarterly review where the platform team reports "60% complete" on the Platform layer and the AI team reports "80% complete" on the Agentic layer, and the executive sponsor wonders why the agents are not in production. The answer is that the 80% complete agents depend on the 60% complete platform. The agents cannot move past the platform's bottleneck. The visible delay is the agent program; the actual delay is the platform program.

The solution is to make the dependency structure explicit. The platform team owns the foundation; the upper layers cannot move past the foundation; the program plan must respect this. Chapter 09 (Implementation Sequence) is built around this principle.

### 8.5 The Stacking Rule as a Sequencing Tool

The stacking rule is the sequencing tool that prevents all three failure patterns. The rule:

1. Establish Layer 1 (Platform) at credible maturity. Three teams onboarded via Golden Paths, basic Guardrails enforced at admission, observability live.
2. Establish Layer 2 (Context) baseline. Service catalog populated, documentation-as-code adopted, MCP servers exposing the most-used systems.
3. Establish Layer 3 (Cognitive) baseline. Model gateway live, evaluation pipeline available, multi-model access governed.
4. Establish Layer 4 (Intent) for specific use cases as they arise. Constitution and specification per agent project, policy-as-code per agent permission scope.
5. Deploy Layer 5 (Agentic) workloads. First single-agent scoped tasks, then multi-agent orchestration, then long-running autonomous agents.

This is the sequence chapter 09 prescribes. The stacking rule is what makes the sequence not arbitrary.

---

## 9. Common Mistakes and How the Pyramid Names Them

The pyramid is useful diagnostically. When a client engagement is failing, the failure can almost always be named in pyramid terms. The common mistakes and their pyramid framings:

| Symptom | Root Cause in Pyramid Terms | Remediation |
|---------|------------------------------|-------------|
| Agent hallucinates frequently | Layer 2 (Context) under-built; agent has no enterprise grounding | Build service catalog, document graph, MCP servers |
| Agent succeeds in demos, fails in production | Layer 1 (Platform) under-built; production-grade observability and governance missing | Build the four pillars at production maturity |
| Agent exceeds cost projections | Layer 3 (Cognitive) under-built; model gateway not metering or routing | Implement model gateway with cost ceilings and routing |
| Agent acts outside scope | Layer 4 (Intent) under-built; permission scopes vague or unenforced | Codify intent in policy-as-code, enforce at platform |
| Multi-agent system inconsistent | Layer 4 (Intent) under-built; specs not versioned or evaluated | Implement Spec-Driven Development with explicit gates |
| Audit cannot certify agent activity | Layer 1 (Platform) under-built; trajectory observability missing | Add trajectory capture; integrate with Foundry Observability |
| Agent works for one team, breaks for another | Layer 2 (Context) inconsistent across teams | Centralize context layer; enforce service catalog coverage |
| Compliance review blocks production | Layer 1 (Platform) and Layer 4 (Intent) gaps; controls not codified | Translate compliance into policy-as-code, enforce at admission |

The diagnostic value of the pyramid is that it converts vague problem statements ("the agent doesn't work") into specific layer gaps ("the context layer is missing the service catalog coverage that this agent needs to ground its outputs"). Specific gaps are remediable; vague problems are not.

---

## 10. How the Pyramid Maps to the Two Accelerators

Both Three Horizons and Open Horizons materialize all five layers of the pyramid. The materialization differs in tooling but not in structure. The crosswalk:

| Pyramid Layer | Three Horizons (Red Hat) Materialization | Open Horizons (OSS) Materialization |
|---------------|------------------------------------------|--------------------------------------|
| Layer 1: Platform Engineering | Red Hat Developer Hub, Azure Red Hat OpenShift, OpenShift Pipelines, OpenShift GitOps, OpenShift Service Mesh, Red Hat Trusted Application Pipeline | Backstage, Azure Kubernetes Service, GitHub Actions, Argo CD or Flux, Istio or Linkerd, GitHub Advanced Security + SLSA + Sigstore |
| Layer 2: Context | RHDH catalog plugins, RHDH TechDocs, Microsoft Purview, Azure AI Search, MCP servers, semantic context layer | Backstage catalog, Backstage TechDocs, Microsoft Purview, Azure AI Search, MCP servers, semantic context layer |
| Layer 3: Cognitive | Microsoft Foundry (model gateway), GitHub Models, Foundry Evaluations, Red Hat Lightspeed (as it matures) | Microsoft Foundry (model gateway), GitHub Models, Foundry Evaluations |
| Layer 4: Intent | Constitutions and specs in Git, Azure Policy + Red Hat Advanced Cluster Security, Entra Agent ID for permission scopes | Constitutions and specs in Git, Azure Policy + OPA Gatekeeper or Kyverno, Entra Agent ID for permission scopes |
| Layer 5: Agentic | Microsoft Agent Framework, Foundry Agent Service, GitHub Copilot Coding Agent, custom agents on ARO, Red Hat Lightspeed | Microsoft Agent Framework, Foundry Agent Service, GitHub Copilot Coding Agent, custom agents on AKS |

The crosswalk shows that the Cognitive layer (Microsoft Foundry, Agent Framework) is identical between the two accelerators because it lives in the shared Microsoft foundation. The Intent layer is largely identical because it is implemented in Git and policy-as-code regardless of the underlying cluster technology. The differentiation between the two accelerators is concentrated in the Platform and Context layers, where the choice of cluster technology and IDP determines the specific tools.

This is the structural reason why "the choice between Three Horizons and Open Horizons is a stack choice, not a strategy choice." The strategy (build the pyramid, in order, on the Microsoft foundation) is identical. The stack (which IDP, which cluster, which CI/CD primitives) is what varies.

Chapters 06, 07, and 08 cover the choice in operational depth. The pyramid is the structural argument that the choice is bounded.

---

## 11. Synthesis: From Architecture to Sequencing

The chapter started with a pyramid. It ends with a sequencing principle.

The pyramid model produces three operational outputs:

**A diagnostic tool.** When a project is failing, the pyramid lets you name the failing layer and the missing dependency. The diagnosis is specific and remediable.

**An investment prioritization.** The pyramid orders investments in dependency order. The Platform layer warrants the largest investment because it supports the broadest scope. Each layer above gets proportionally less investment, but in dependency order.

**A sequencing rule.** Layers are built bottom-up, with each layer requiring the previous layer at credible maturity before the next layer can be built without accumulating debt. The sequencing rule is what chapter 09 turns into a 90/180/365-day plan.

The pyramid is also the ground for the evidence in chapter 01. The amplification thesis (AI amplifies whatever delivery system it inherits) is the macro-scale observation; the pyramid is the micro-scale architectural model that explains *why* the amplification works the way it does. AI consumes the pyramid bottom-up. A weak base produces a weak top, regardless of how strong the top is in isolation.

The chapter that follows (03) goes deep on the Platform layer. Specifically, the CNCF Four Pillars of Platform Control: Golden Paths, Guardrails, Safety Nets, and Manual Review. These pillars are how the Platform layer is operationalized in 2026. They are also how the platform team materializes the AI control plane. The four pillars are the answer to "what specifically must we build at the base of the pyramid?".

---

## References

- [CNCF Platform Engineering Maturity Model](https://tag-app-delivery.cncf.io/whitepapers/platform-eng-maturity-model/). Cloud Native Computing Foundation, 2025-2026.
- [DORA 2025 Accelerate State of DevOps Report](https://dora.dev/research/2025/dora-report/). Google Cloud / DORA, 2025.
- [Model Context Protocol Specification](https://modelcontextprotocol.io/). Anthropic and MCP Working Group, 2025-2026.
- [Microsoft Purview Documentation](https://learn.microsoft.com/en-us/purview/). Microsoft, 2026.
- [Azure AI Foundry Documentation](https://learn.microsoft.com/en-us/azure/ai-foundry/). Microsoft, 2026.
- [Microsoft Agent Framework 1.0](https://devblogs.microsoft.com/agent-framework/microsoft-agent-framework-version-1-0/). Microsoft, April 2026.
- [Azure Policy Documentation](https://learn.microsoft.com/en-us/azure/governance/policy/overview). Microsoft, 2026.
- [Open Policy Agent Gatekeeper](https://open-policy-agent.github.io/gatekeeper/). OPA Project, 2026.
- [Kyverno Policy Engine](https://kyverno.io/). Kyverno Project, 2026.
- Vishnyakova et al. (2026). [From Context Engineering to Multi-Agent Architecture](https://arxiv.org/abs/2603.09619). arXiv:2603.09619.
- (2026). [Codified Context Infrastructure for Enterprise AI](https://arxiv.org/abs/2602.20478). arXiv:2602.20478.
- Silva, P. (2026). *The Context Platform Stack*, chapters 0-6, v1.3.0/v1.2.0. Microsoft.
- Silva, P. (2026). *Platform Engineering: The Foundation Layer for the AI-Native Enterprise*, v1.0.0. Microsoft.
- Silva, P. (2026). *Semantic Context Layer for Agentic DevOps (SCL-AD)*, v1.1.0. Microsoft.

---

Paula Silva, Software Global Black Belt
*Pioneering software development with AI and Agentic DevOps*

paulasilva@microsoft.com
