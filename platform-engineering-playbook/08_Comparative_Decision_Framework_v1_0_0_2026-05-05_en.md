---
title: "Comparative Decision Framework: Three Horizons vs Open Horizons"
description: "A side-by-side comparison of the two accelerators by client archetype, capability dimension, cost structure, support model, and operational fit. Includes a one-day discovery method that produces a defensible recommendation."
author: "Paula Silva"
role: "Software Global Black Belt"
contact: "paulasilva@microsoft.com"
date: "2026-05-05"
version: "1.0.0"
status: "draft"
locale: "en"
brand: "Agentic DevOps"
tags: [decision-framework, three-horizons, open-horizons, archetype-matrix, discovery-method, build-vs-buy]
---

# Chapter 08: Comparative Decision Framework

> **Argument.** Both Three Horizons and Open Horizons reach the same Horizon 3 destination on the same Microsoft foundation. The choice between them is a stack decision, not a strategy decision. The decision is shaped by procurement profile, engineering capability, regulatory posture, and vendor strategy. This chapter provides a structured decision framework: a side-by-side comparison across 10 dimensions, a client-archetype matrix, a one-day discovery method that produces a defensible recommendation, and explicit guidance on the cases where the choice is genuinely close. The chapter closes with the patterns that should *not* drive the decision.

---

## Table of Contents

1. [The Decision Is a Stack Choice](#1-the-decision-is-a-stack-choice)
2. [Side-by-Side Comparison Across 10 Dimensions](#2-side-by-side-comparison-across-10-dimensions)
3. [The Client-Archetype Matrix](#3-the-client-archetype-matrix)
4. [The Cost Structure Comparison](#4-the-cost-structure-comparison)
5. [The Support Model Comparison](#5-the-support-model-comparison)
6. [The Regulatory Posture Comparison](#6-the-regulatory-posture-comparison)
7. [What Both Accelerators Share](#7-what-both-accelerators-share)
8. [The One-Day Discovery Method](#8-the-one-day-discovery-method)
9. [The Edge Cases](#9-the-edge-cases)
10. [What Should NOT Drive the Decision](#10-what-should-not-drive-the-decision)
11. [The Recommendation Pattern](#11-the-recommendation-pattern)
12. [References](#references)

---

## 1. The Decision Is a Stack Choice

The single most-important framing of the decision is that it is a *stack* choice, not a *strategy* choice. Both accelerators implement the same strategy: build the AI-Native Enterprise Pyramid (chapter 02), materialize the four pillars of platform control (chapter 03), execute both mandates of the Dual Mandate (chapter 05), reach the same Horizon 3 destination at 90-180 day time-to-value.

The components of the strategy that do not vary between the two accelerators:

- The Microsoft foundation: Azure cloud, GitHub Enterprise for source control and DevOps, Microsoft Entra ID + Entra Agent ID for identity, Microsoft Foundry for the model gateway and observability, Microsoft Agent Framework + Foundry Agent Service for agent runtime, Agent 365 for fleet lifecycle, Authorization Fabric for cross-resource permissions.
- The four CNCF pillars: Golden Paths, Guardrails, Safety Nets, Manual Review.
- The Three Horizons maturity model: H1 Foundation, H2 Enhancement, H3 Innovation.
- The Dual Mandate: AI augmenting the platform team's velocity (Mandate A), AI capabilities exposed to application teams (Mandate B).

What varies is the *stack* through which the strategy is materialized: the IDP (RHDH vs Backstage upstream), the cluster (ARO vs AKS), the CI/CD substrate (OpenShift Pipelines vs GitHub Actions), the GitOps controller (OpenShift GitOps vs Argo CD/Flux), the supply-chain stack (Red Hat Trusted Application Pipeline vs GitHub Advanced Security + SLSA + Sigstore), the AI-assist layer (Lightspeed + Copilot vs Copilot alone), and the commercial structure (with vs without Red Hat subscriptions).

This framing matters because it removes a common false dichotomy. Customers sometimes treat the choice as "Microsoft vs Red Hat", which is wrong: the Microsoft foundation is constant. Or they treat it as "open source vs commercial", which is also wrong: Backstage and OpenShift are both open-source upstream, the difference is whether enterprise support is contracted with Red Hat. Or they treat it as "vendor lock-in vs neutrality", which is wrong in both directions: Open Horizons depends on Azure and GitHub (vendor exposure), Three Horizons builds on the same Microsoft foundation plus Red Hat (which is itself an enterprise distribution of largely open-source components).

The accurate framing: **same destination, same foundation, different stack on top**.

---

## 2. Side-by-Side Comparison Across 10 Dimensions

| Dimension | Three Horizons (Red Hat) | Open Horizons (OSS) |
|-----------|--------------------------|----------------------|
| **Internal Developer Platform** | Red Hat Developer Hub (RHDH) | Backstage upstream |
| **Cluster** | Azure Red Hat OpenShift (ARO) | Azure Kubernetes Service (AKS) |
| **Native CI/CD** | OpenShift Pipelines (Tekton) | GitHub Actions |
| **GitOps controller** | OpenShift GitOps (Argo CD) | Argo CD or Flux |
| **Policy as code** | Red Hat Advanced Cluster Security + Azure Policy | OPA Gatekeeper or Kyverno + Azure Policy |
| **Supply chain security** | Red Hat Trusted Application Pipeline | GitHub Advanced Security + SLSA + Sigstore |
| **Service mesh** | OpenShift Service Mesh (Istio) | Istio or Linkerd |
| **Multi-cluster management** | Red Hat Advanced Cluster Manager | Cluster API + Argo CD ApplicationSets |
| **AI assistance** | Red Hat Lightspeed (as it matures) + GitHub Copilot Enterprise | GitHub Copilot Enterprise + Microsoft Foundry Agent Service |
| **Commercial structure** | Red Hat subscriptions + Azure consumption + GitHub Enterprise | Azure consumption + GitHub Enterprise |

The table is the operational compression of chapters 06 and 07. Each row identifies a layer where the accelerators diverge; the rest of the stack (the Microsoft foundation) is identical.

The most-frequently-cited rows in client decisions:

- **Cluster (ARO vs AKS).** The cluster choice carries operational implications that span the engineering team's daily work.
- **IDP (RHDH vs Backstage upstream).** The IDP is the developer-facing surface; the choice shapes the developer experience and the platform team's customization burden.
- **Commercial structure.** The Red Hat subscription line item is the largest single cost differentiator.
- **AI assistance.** Lightspeed availability and maturity in the customer's specific Red Hat estate is sometimes a tipping factor.

The other rows matter operationally but are less frequently the deciding factor.

---

## 3. The Client-Archetype Matrix

The matrix below organizes client profiles by the dominant tilt. The matrix is the playbook's empirical synthesis of LATAM enterprise patterns.

### 3.1 Strong Tilt Toward Three Horizons

These archetypes have clear procurement, engineering, or regulatory drivers that make Three Horizons the fastest defensible answer.

| Archetype | Why Three Horizons |
|-----------|--------------------|
| Large bank (BACEN-regulated) with on-premise OpenShift | Existing Red Hat skill set; commercial-support requirement; FedRAMP/sector-equivalent procurement criteria |
| Government agency / state-owned enterprise | Procurement requires certified commercial support; vendor strategy formalized around joint support relationships |
| Energy or utility (ANEEL-regulated) with operator workforce | RHEL fleet at scale; OpenShift expertise as core competency; long-term vendor relationship preferred |
| Healthcare / health insurance under LGPD/ANS | Regulatory requirement for vendor-supported software; Red Hat's healthcare references count |
| Defense or critical infrastructure | Common Criteria certifications; "one throat to choke" is procurement-required |

### 3.2 Strong Tilt Toward Open Horizons

These archetypes have clear procurement, engineering, or cultural drivers that make Open Horizons the fastest defensible answer.

| Archetype | Why Open Horizons |
|-----------|--------------------|
| Digital-native enterprise (e-commerce, marketplace, SaaS) | OSS-first culture; minimum vendor count; high-velocity engineering team |
| Fintech at scale | Cost optimization is a procurement criterion; engineering team is upstream-Kubernetes-fluent |
| Modern retailer with cloud-first IT | No prior Red Hat footprint; AKS is already the cluster substrate |
| Azure-native ISV building on Microsoft | Aligned with Microsoft as primary vendor; Red Hat is incremental cost |
| State-owned enterprise with strong internal engineering | Internal capability to operate upstream; OSS posture aligns with public-sector neutrality |

### 3.3 The Middle Cohort

Approximately 25-35% of LATAM enterprises sit in a middle cohort where neither tilt is dominant. The middle cohort has a mix of properties that point in both directions. The recommendation for the middle cohort is the one-day discovery method (section 8); the discovery exercise breaks ties on operational evidence rather than abstract preference.

### 3.4 The Hybrid Pattern

Some clients run *both* accelerators in different parts of the organization. Example: the regulated FSI subsidiary runs Three Horizons (BACEN compliance, Red Hat support); the digital-native business unit runs Open Horizons (cost optimization, OSS posture). Both ride the same Microsoft foundation; both share the Backstage/RHDH catalog data through MCP integration; both expose AI primitives through Foundry.

The hybrid pattern is uncommon but valid. The structural requirement is that the customer's identity, foundation, and AI primitives are unified across the two accelerators (which they are, because both ride the Microsoft foundation). The customer operates two cluster substrates and two IDP installations, but the workloads above are portable.

---

## 4. The Cost Structure Comparison

### 4.1 The Line Items

| Cost Line Item | Three Horizons | Open Horizons |
|-----------------|----------------|----------------|
| Azure consumption (compute, storage, foundation services) | Yes | Yes |
| GitHub Enterprise (incl. Advanced Security, Copilot) | Yes | Yes |
| Red Hat subscriptions (RHDH, ARO, Pipelines, GitOps, ACM, ACS, TAP, RHEL where applicable) | Yes | No |
| Sigstore and OPA/Kyverno operational support | N/A (replaced by Red Hat) | Community + customer team or integrator |

The Azure consumption and GitHub Enterprise line items are equivalent between the two accelerators (the Microsoft foundation is constant). The differentiator is the Red Hat subscription bundle.

### 4.2 The Sizing of the Red Hat Line Item

The Red Hat subscription bundle in a typical Three Horizons deployment ranges from 10% to 30% of total platform spend, depending on:

- Cluster size (ARO is priced per node; larger clusters mean more subscription).
- User count (RHDH licensing scales with concurrent users in some plans).
- Add-on coverage (ACM, ACS, TAP each carry independent licensing).

For very small platforms, the Red Hat line item can be a smaller percentage; for very large platforms, it can be larger. The 10-30% range is the most common observation in LATAM enterprise deployments.

### 4.3 The Cost-vs-Support Trade-Off

The decision to incur the Red Hat subscription cost is a trade-off against support model. The trade-off is rarely a simple cost optimization; it depends on:

- **Internal capability cost.** A customer who must hire dedicated engineers to operate Backstage and AKS at quality may incur higher labor costs than the Red Hat subscription cost.
- **Incident cost.** A customer whose cluster outages have material business impact may value the joint Microsoft+Red Hat SLA more than the subscription cost.
- **Audit and compliance cost.** A customer in a regulated sector may incur audit costs that are higher with self-supported open-source than with Red Hat-supported equivalents.

A defensible cost analysis includes all three categories, not only the subscription cost. The playbook's experience is that the trade-off in regulated sectors usually favors Three Horizons; the trade-off in digital-native sectors usually favors Open Horizons.

### 4.4 What Cost Should *Not* Drive

A common mistake is to treat the Red Hat subscription cost in isolation as the deciding factor. This is wrong because:

- The Microsoft foundation cost (Azure consumption, GitHub Enterprise) is a much larger fraction of total cost in most deployments. Saving 15% on the smaller component while ignoring the larger component is an optimization in the wrong direction.
- The cost of the *delay* in time-to-production for a misfit accelerator (e.g., a customer who chose Open Horizons but lacks the internal capability to operate it) is typically larger than the Red Hat subscription savings.
- The cost of a *failure* in production (an incident with regulatory exposure) is typically orders of magnitude larger than the Red Hat subscription cost.

The correct cost framing: *over a 3-year platform lifetime, including labor, incidents, audit, and license, which accelerator produces the lowest total cost of ownership for this specific client?*. The answer is sometimes Three Horizons, sometimes Open Horizons, and almost never determined by the subscription line item alone.

---

## 5. The Support Model Comparison

### 5.1 The Models

| Property | Three Horizons | Open Horizons |
|----------|----------------|----------------|
| Cluster (ARO vs AKS) | Microsoft + Red Hat joint SRE; joint SLA | Microsoft SRE; Microsoft SLA |
| IDP (RHDH vs Backstage upstream) | Red Hat enterprise support, 24x7 | Community support; customer team or integrator |
| Supply chain (TAP vs OSS stack) | Red Hat enterprise support | Community support; customer team or integrator |
| AI/Foundry/Copilot | Microsoft enterprise support | Microsoft enterprise support |
| Joint cross-component issues | Red Hat ↔ Microsoft escalation paths defined | Microsoft + community + integrator coordination |

### 5.2 The Operational Implications

The support model differences translate to operational implications the platform team must staff for.

**In Three Horizons**, the platform team works with Red Hat support for upstream-stack issues. The team's internal capability requirement is operational (run the workloads, customize the platform) rather than engineering (debug upstream issues). This frees the team to focus on customer-specific work.

**In Open Horizons**, the platform team works with the open-source community for upstream-stack issues. The team's internal capability requirement is broader: the team must include engineers comfortable filing upstream bugs, contributing patches, and operating without a vendor SLA. For high-capability teams this is liberating; for lower-capability teams this is operationally costly.

The decision is in part a self-assessment: does the customer's platform team have the upstream capability today, or do they need to acquire it?

### 5.3 The Joint Microsoft + Red Hat Operational Model

A subtle operational property of Three Horizons is the joint Microsoft + Red Hat operational model on ARO. The cluster control plane is operated by the joint team; issues that would otherwise require coordination across two vendor support organizations are resolved internally.

This is one of the strongest reasons clients choose Three Horizons. Customers who have experienced multi-vendor escalation pain (e.g., where vendor A blames vendor B and vice versa) often value the joint model independently of the rest of the stack.

For customers who have not experienced multi-vendor escalation pain (typically because they have not yet operated a multi-vendor platform at scale), the joint model is harder to evaluate. The recommendation for such customers is to weight the joint model lower in the decision; if the customer eventually does experience the pain, they can migrate to Three Horizons later.

---

## 6. The Regulatory Posture Comparison

### 6.1 The Certifications

| Certification | Three Horizons (Red Hat) | Open Horizons (OSS) |
|---------------|--------------------------|----------------------|
| FedRAMP (US Federal) | Red Hat carries certifications for OpenShift, RHEL, and other components | Microsoft carries certifications for AKS, Foundry, GitHub; OSS components are not independently certified |
| FIPS 140-2 / 140-3 | Red Hat carries FIPS validation for relevant components | Microsoft carries FIPS validation for AKS and Foundry; OSS components vary |
| Common Criteria | Red Hat carries Common Criteria for relevant components | Microsoft carries CC for relevant components |
| SOC 2 | Both Microsoft and Red Hat carry SOC 2 | Microsoft carries SOC 2 |
| LGPD (Brazil) | Microsoft + Red Hat support LGPD compliance | Microsoft supports LGPD compliance |
| BACEN Resolution 4658 (Brazil FSI) | Microsoft + Red Hat support compliance | Microsoft supports compliance |
| ANEEL (Brazil energy) | Microsoft + Red Hat support compliance | Microsoft supports compliance |
| HIPAA / US HHS | Microsoft + Red Hat support compliance | Microsoft supports compliance |

### 6.2 The Practical Difference

In regulated sectors, the procurement decision often turns on whether the *upstream stack* (IDP, cluster orchestration, supply chain) carries the certification, not just the foundation. The Red Hat stack components carry their own certifications; the open-source components in Open Horizons do not have equivalent independent certifications (though the Microsoft foundation underneath does).

For some procurement processes, this difference is decisive. The customer's compliance team requires "all platform components must be certified for X"; only Three Horizons satisfies the requirement.

For other procurement processes, the foundation-level certification is sufficient. The customer's compliance team accepts that the Microsoft foundation (Azure, AKS, Foundry, GitHub) carries the relevant certifications, and the open-source components above it are operated under the customer's own compliance program.

The decision is procurement-specific. The playbook recommends that the customer's compliance team participates in the discovery (section 8) to confirm the regulatory posture explicitly rather than infer it.

### 6.3 LATAM Sovereignty Considerations

For LATAM sovereignty (data residency, data sovereignty, sector-specific in-region requirements), both accelerators perform equivalently because the Microsoft foundation supports LATAM regions (Brazil South, Brazil Southeast, Chile Central, Mexico Central). Workloads on either accelerator can be deployed entirely in-region with full data residency.

The exception: if a sector-specific regulation requires that all software components have local-jurisdiction support, Three Horizons may have a slight advantage because Red Hat operates LATAM-local support presence. The advantage is rarely decisive but is occasionally cited.

---

## 7. What Both Accelerators Share

The chapter has emphasized the differentiators. It is equally important to surface what both accelerators share, because the shared properties are larger than the differentiating properties.

| Shared Property | Three Horizons | Open Horizons |
|-----------------|----------------|----------------|
| The Microsoft foundation (Azure, GitHub, Entra, Foundry, Agent Framework) | Yes | Yes |
| The four CNCF pillars (Golden Paths, Guardrails, Safety Nets, Manual Review) | Yes | Yes |
| The Three Horizons maturity model (H1/H2/H3) | Yes | Yes |
| The Dual Mandate execution (Mandate A and Mandate B) | Yes | Yes |
| The 90-180 day time-to-value compression | Yes | Yes |
| The convergence at Horizon 3 destination | Yes | Yes |
| LATAM region availability with data residency | Yes | Yes |
| The semantic context layer (SCL-AD framework) | Yes | Yes |
| Microsoft Foundry as the model gateway | Yes | Yes |
| Microsoft Agent Framework as the agent runtime | Yes | Yes |
| Entra Agent ID for agent identity | Yes | Yes |
| Microsoft Foundry Evaluations as the evaluation pipeline | Yes | Yes |
| MCP servers for agent integration | Yes | Yes |

The shared properties are the substrate of the strategy. Both accelerators implement the same strategy; both ride the same foundation; both materialize the same control plane; both reach the same destination. The shared substrate is what makes the choice between them a stack choice and not a strategy choice.

---

## 8. The One-Day Discovery Method

For clients in the middle cohort, the playbook prescribes a one-day discovery workshop that produces a defensible recommendation with operational evidence. The method is structured to break ties without requiring the customer to commit to either accelerator before the workshop.

### 8.1 The Pre-Work

Two weeks before the workshop, the platform delivery team requests:

- **Inventory of current Red Hat investment.** RHEL fleet size, OpenShift footprint, Ansible Automation Platform usage, existing Red Hat support contracts and renewal dates.
- **Inventory of current Kubernetes investment.** AKS, EKS, GKE, on-premise upstream Kubernetes; cluster count, workload count, engineering team familiarity.
- **Inventory of current GitHub investment.** GitHub Enterprise plan, Advanced Security adoption, Copilot Enterprise adoption, existing GitHub Actions usage.
- **Engineering team profile.** Headcount, seniority distribution, OSS contribution profile, comfort with upstream Kubernetes.
- **Procurement profile.** Vendor strategy (consolidate vs diversify), regulatory posture, audit obligations, sector-specific compliance.
- **Sample of current AI initiatives.** What AI projects are underway, what is their current state, what blockers they have hit.

The pre-work is the substrate for the workshop. Without it, the workshop relies on memory and impression rather than evidence.

### 8.2 The Workshop Agenda

The workshop is a single day, structured in five sessions.

**Session 1 (90 minutes): Strategy alignment.** Review the AI-Native Enterprise Pyramid (chapter 02). Confirm the customer's understanding and commitment to the strategy. The session terminates with explicit agreement that both accelerators implement the same strategy and the choice is a stack choice.

**Session 2 (120 minutes): Stack comparison.** Walk through the side-by-side comparison (chapter 08, section 2). For each row, the customer expresses preference (or no preference). The session captures the customer's tilt across the 10 dimensions.

**Session 3 (90 minutes): Cost modeling.** Walk through the cost structure (section 4) with the customer's specific numbers. Project a 3-year total cost of ownership for both accelerators using the customer's headcount, cluster size, and workload projections. The session produces two TCO numbers; the difference is the candidate cost-driver.

**Session 4 (90 minutes): Support and capability.** Self-assess the customer's internal capability to operate upstream Backstage and AKS at quality. The assessment is structured: 5 specific tasks (e.g., "diagnose a Backstage scaffolder template that hangs at parameter validation"); the customer rates their team's capability on each. The session terminates with a capability score for upstream operation.

**Session 5 (90 minutes): Recommendation and next steps.** Synthesize the workshop's findings into a recommendation. The recommendation is one of three: clear tilt toward Three Horizons, clear tilt toward Open Horizons, or genuinely close (run a 30-day pilot of both). The session captures the recommendation, the rationale, and the next steps.

### 8.3 The Decision Output

The workshop produces a one-page decision output:

```
Customer: [Customer Name]
Date: [Date]
Recommendation: [Three Horizons | Open Horizons | Pilot Both]

Tilt across 10 dimensions:
  IDP:                  [TH | OH | Tie]
  Cluster:              [TH | OH | Tie]
  CI/CD:                [TH | OH | Tie]
  GitOps:               [TH | OH | Tie]
  Policy:               [TH | OH | Tie]
  Supply chain:         [TH | OH | Tie]
  Service mesh:         [TH | OH | Tie]
  Multi-cluster:        [TH | OH | Tie]
  AI assistance:        [TH | OH | Tie]
  Commercial:           [TH | OH | Tie]
  Aggregate tilt:       [TH | OH | Close]

3-year TCO (USD):
  Three Horizons:        $X.XM
  Open Horizons:         $Y.YM
  Difference:            $Z.ZM ([TH | OH] favored)

Internal capability score (0-5):
  Backstage operation:   [score]
  AKS operation:         [score]
  Upstream OSS:          [score]
  Aggregate:             [score]

Recommendation rationale:
  [Two paragraphs explaining the recommendation, citing the dimensions with the strongest tilt and the evidence from the cost and capability sessions.]

Next steps:
  Day 0:  [Sign engagement agreement]
  Day 30: [Foundation deployment milestone]
  Day 90: [Three teams onboarded milestone]
  Day 180: [First production AI workload milestone]
```

The one-page output is the artifact that the customer's executive sponsor can ratify. It is also the artifact that the platform delivery team uses as the reference for the implementation sequence (chapter 09).

### 8.4 The Pilot-Both Option

In rare cases (approximately 5% of LATAM engagements), the workshop produces a "genuinely close" output where neither accelerator has a defensible tilt. In these cases, the recommendation is a 30-day pilot of both accelerators with two real teams, one on each, with explicit comparison criteria.

The pilot-both option is operationally expensive (the platform delivery team essentially runs two parallel deployments) and is reserved for the cases where the customer's risk of choosing wrong is materially larger than the operational cost of choosing carefully. The cases that warrant pilot-both are typically very large enterprises where the wrong choice would be costly to reverse.

---

## 9. The Edge Cases

### 9.1 Customer Already Has OpenShift On-Premise but Wants Azure-Native AI

This is a common LATAM pattern: a financial services or energy customer has OpenShift on-premise from a prior modernization initiative, but their AI initiatives are pulling them toward Azure-native services (Foundry, Copilot, Agent Framework).

The recommendation is usually Three Horizons because the customer's OpenShift investment makes the RHDH-on-ARO path a continuity rather than a substitution. The on-premise OpenShift can connect to ARO through Red Hat Advanced Cluster Manager (ACM) for unified governance.

The edge case: if the on-premise OpenShift footprint is small (say, fewer than 20 nodes) or stagnant, the continuity argument is weaker. Open Horizons may be the right answer if the customer is willing to migrate the on-premise OpenShift workloads to AKS over time.

### 9.2 Customer Wants Both Microsoft and AWS or GCP

Customers running multi-cloud face a different decision. The shared Microsoft foundation in this playbook is Azure-anchored; the foundation does not extend to AWS or GCP without modification.

The recommendation in multi-cloud cases:

- If the customer's primary cloud is Azure and the secondary is AWS/GCP: adopt Three Horizons or Open Horizons on Azure as the primary platform; deploy lightweight equivalents on AWS/GCP for workloads that must run there.
- If the customer's primary cloud is AWS or GCP: this playbook is not the right fit. The customer should consider AWS-native or GCP-native equivalents (which exist but are outside the scope of this playbook).

The honest framing: this playbook is engineered for Azure-anchored deployments. Multi-cloud customers can adopt the strategy and many of the components, but the operational sequence and the integration patterns will differ.

### 9.3 Customer Wants Bare-Metal On-Premise

Some LATAM customers (typically government, defense, and some FSI) require bare-metal on-premise deployment for sovereignty or security reasons. Neither Three Horizons (which uses ARO managed control plane) nor Open Horizons (which uses AKS managed control plane) maps directly.

The closest mapping is Red Hat OpenShift Container Platform on-premise (the on-premise sibling of ARO), with the same RHDH-based developer platform layer. Customers in this profile typically engage a hybrid model: ARO for cloud workloads, OCP on-premise for sovereignty-restricted workloads, both managed through ACM. This is a Three Horizons variant that requires explicit operational planning beyond the standard playbook.

For Open Horizons on-premise, the analog is upstream Kubernetes (kubeadm-based or Cluster API-based) with Backstage upstream. This is operationally feasible but requires materially more internal capability than the AKS-based Open Horizons; the playbook does not generally recommend it for customers who do not already have strong upstream-Kubernetes operations.

### 9.4 Customer Wants to Avoid Microsoft Foundry

A small population of customers wants to avoid Microsoft Foundry as the model gateway, preferring direct API access to model providers or alternative gateways (e.g., LiteLLM, Portkey, a self-hosted gateway).

This is technically feasible with both accelerators, but it forfeits a substantial portion of the value proposition. Foundry is the integration point for evaluation pipelines, observability, multi-model access, agent identity, and cost metering. Replacing Foundry with an alternative requires either replacing the corresponding capabilities (substantial work) or operating without them (substantial risk).

The playbook's recommendation is to adopt Foundry as the default and revisit only if a specific procurement constraint requires otherwise. The Foundry decision is not coupled to the Three Horizons vs Open Horizons decision; both accelerators use Foundry.

---

## 10. What Should NOT Drive the Decision

The chapter has surfaced the patterns that should drive the decision. It is equally important to name the patterns that should not.

### 10.1 Personal Preference

Engineering teams sometimes have strong personal preferences. "We hate OpenShift" or "We love Red Hat" or "Backstage is too complicated" or "AKS is too plain" are common statements. Personal preference should be weighted into the workshop output (it affects internal capability) but should not be allowed to override procurement, regulatory, and cost evidence.

The decision belongs to the enterprise, not to individual engineers. The workshop method (section 8) is structured to elevate evidence over preference.

### 10.2 Vendor Sales Pressure

Both Microsoft and Red Hat have sales teams with quota responsibility. Sales pressure can produce recommendations that do not align with the customer's actual needs. The playbook's recommendation is for the platform delivery team to remain neutral (Microsoft GBB, in this playbook's case, supports both accelerators equally) and for the customer to weight sales recommendations as one input among many.

The structural mitigation is that both accelerators ride the Microsoft foundation, which means Microsoft has revenue in both cases. There is no Microsoft-side incentive to push toward one accelerator over the other; the decision is about the customer's fit.

### 10.3 Trend-Following

"Backstage is the market standard" and "OpenShift is enterprise-standard" are both true; neither is sufficient as a decision driver. The customer's specific procurement, engineering, and regulatory profile is what matters, not the broader market trend.

### 10.4 Visible Reference Customers

A common pattern is "Customer X chose Three Horizons, so we should too" or "Customer Y chose Open Horizons, so we should too". Reference customers are useful for validating that the chosen path is operationally feasible, but they are not sufficient as the decision driver. The customer's profile may not match the reference customer's profile.

The playbook explicitly cautions against treating reference customers as decision drivers. The reference customers cited in chapters 06 (Three Horizons) and 07 (Open Horizons) are illustrative, not prescriptive.

---

## 11. The Recommendation Pattern

### 11.1 The Pattern

The recommendation pattern that the playbook produces in mature engagements:

```
For [Customer], the recommended accelerator is [Three Horizons | Open Horizons].

The recommendation is driven by:
  - [Top 1-2 dimensions where the tilt is strongest, with evidence]
  - [The customer's specific procurement or regulatory constraint, if applicable]
  - [The internal capability assessment]

The cost analysis projects a 3-year TCO of $X.XM for the recommended accelerator, vs $Y.YM for the alternative. The cost difference is $Z.ZM, which represents [N%] of the recommended accelerator's TCO. The cost favors [TH/OH] but is not the dominant factor.

The implementation path is:
  - Days 0-30: Foundation deployment per Chapter 09's sequence.
  - Days 30-90: First three teams onboarded via H1 Golden Paths.
  - Days 90-180: H2 templates adopted, first AI workload in production.
  - Days 180-365: H3 templates exercised, first production agent workloads, CNCF Optimizing maturity.

The risk profile of the chosen path is [bounded / moderate / managed]. The mitigation for the residual risk is [explicit mitigation: support engagement model, capability uplift plan, audit checkpoint].
```

The pattern is explicit. The customer can ratify it; the executive sponsor can defend it; the platform delivery team can execute it.

### 11.2 The Anti-Pattern

The anti-pattern to avoid:

```
We can do either accelerator. Both are good options. Let me know what you prefer.
```

This anti-pattern is operationally common but it pushes the decision back onto the customer without giving them the framework to make it. The customer either chooses arbitrarily (high risk of misfit) or defers indefinitely (program stalls).

The playbook's discipline is that the platform delivery team makes a recommendation, not a list of options. The customer is free to accept, modify, or reject the recommendation, but the recommendation must exist.

### 11.3 The Update Pattern

Decisions are not static. As the customer's program matures, conditions may change: new regulatory requirements emerge, the engineering team's capability evolves, the cost structure shifts, the AI landscape moves.

The playbook's recommendation is to revisit the accelerator decision at the end of Year 1 of the program. Most customers confirm the original decision; a small fraction change. The change is operationally manageable because the Microsoft foundation is constant; the customer migrates the IDP and cluster layers (which is real work but bounded) without rebuilding the strategy.

---

## 12. References

- Silva, P. (2026). *Platform Engineering Playbook: Chapter 06 — Option A: Three Horizons (Red Hat)*. (This playbook.)
- Silva, P. (2026). *Platform Engineering Playbook: Chapter 07 — Option B: Open Horizons (OSS)*. (This playbook.)
- Silva, P. (2026). *The Context Platform Stack: Harness Engineering*, chapter 6 v1.2.0. Microsoft.
- [CNCF Platform Engineering Maturity Model](https://tag-app-delivery.cncf.io/whitepapers/platform-eng-maturity-model/). Cloud Native Computing Foundation, 2025-2026.
- [Forrester Wave: Platform Engineering Solutions Q1 2026](https://www.forrester.com/report/the-forrester-wave-platform-engineering-solutions-q1-2026/). Forrester Research, 2026.
- [DORA 2025 Accelerate State of DevOps Report](https://dora.dev/research/2025/dora-report/). Google Cloud / DORA, 2025.

---

Paula Silva, Software Global Black Belt
*Pioneering software development with AI and Agentic DevOps*

paulasilva@microsoft.com
