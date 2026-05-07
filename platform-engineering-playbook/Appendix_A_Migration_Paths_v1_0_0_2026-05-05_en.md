---
title: "Appendix A: Migration Paths Between the Two Accelerators"
description: "Operational guidance for migrating from Three Horizons to Open Horizons (or vice versa). What carries over zero-friction, what is moderate-friction, and what is high-friction. Cost analysis and decision triggers."
author: "Paula Silva"
role: "Software Global Black Belt"
contact: "paulasilva@microsoft.com"
date: "2026-05-05"
version: "1.0.0"
status: "draft"
locale: "en"
brand: "Agentic DevOps"
tags: [migration, three-horizons, open-horizons, cluster-migration, idp-migration, lift-and-shift]
---

# Appendix A: Migration Paths Between the Two Accelerators

> **Purpose.** Customers sometimes ask: "If we adopt Three Horizons today and later want to move to Open Horizons (or vice versa), what is the migration cost?". This appendix answers that operationally. The headline answer: because both accelerators ride the same Microsoft foundation, migration is bounded and predictable. The work concentrates on the IDP, the cluster, and the GitOps controller; the rest of the stack is portable.

---

## A.1 The Three Friction Tiers

A migration between Three Horizons and Open Horizons can be decomposed into three friction tiers based on how much rework each layer requires.

### Tier 1: Zero-Friction (Microsoft Foundation)

These layers are identical between the two accelerators and require no migration work whatsoever.

| Layer | Component | Notes |
|-------|-----------|-------|
| Cloud | Azure subscription, regions, networking, billing | Same Azure tenant; same regions; same billing. |
| Identity | Microsoft Entra ID, Microsoft Entra Agent ID | Same identity provider; same group structure; same agent identity model. |
| AI Platform | Microsoft Foundry (model gateway, evaluations, observability) | Same Foundry workspace; same models; same evaluation pipelines. |
| Agent Runtime | Microsoft Agent Framework 1.0, Microsoft Foundry Agent Service | Same runtime; agent code portable. |
| Source Control | GitHub Enterprise Cloud (Advanced Security, Copilot Enterprise) | Same GitHub organization; same repositories; same workflows. |
| Secrets | Azure Key Vault | Same vault; same access policies; same federation. |
| Container Registry | Azure Container Registry | Same registry; same image inventory; same signing chain. |
| Cloud Governance | Azure Policy, Microsoft Purview, Defender for Cloud | Same policy assignments; same data catalog; same security posture. |
| Compliance | LATAM regulatory alignment (LGPD, BACEN, ANEEL, ANS) | Same compliance posture. |

Migration work for Tier 1: **zero**. The Microsoft foundation is constant.

### Tier 2: Moderate-Friction (Templates, Policies, Configurations)

These layers require translation between accelerator-specific formats but the underlying logic is portable.

| Layer | Component | Source Format | Target Format | Migration Work |
|-------|-----------|---------------|----------------|-----------------|
| IDP | Software templates / scaffolder templates | RHDH or Backstage YAML | Backstage or RHDH YAML | YAML schema is largely identical; plugin references differ; ~20% rewrite per template |
| IDP | Catalog entries (`catalog-info.yaml`) | RHDH catalog | Backstage catalog | Format identical; entity types identical; zero rewrite for most entries |
| IDP | TechDocs documentation | TechDocs source | TechDocs source | Identical format; pages portable as-is |
| Policy | OPA Gatekeeper rules | Rego files | Rego files (Open Horizons) or Red Hat ACS bundle (Three Horizons) | Rego files are portable; ACS bundle requires translation; ~30% rewrite |
| Policy | Kyverno policies | Kyverno YAML | OPA Rego or Kyverno (Open Horizons keeps both) | Translate Kyverno → Rego, or maintain both; ~50% rewrite if translating |
| GitOps | Argo CD applications | Argo CD YAML | OpenShift GitOps YAML or Argo CD YAML | OpenShift GitOps is Argo CD; format identical; namespace and RBAC scope require adjustment |
| GitOps | Sync policies, sync waves | Argo CD config | OpenShift GitOps config | Identical concept; configuration syntax identical |
| Observability | Grafana dashboards | Grafana JSON | Grafana JSON | Format identical; panel queries may need datasource adjustment |
| Observability | Prometheus alerting rules | Prometheus YAML | Prometheus YAML | Identical format; alert thresholds may need adjustment for cluster-specific behavior |
| MCP | MCP server configurations | MCP server YAML | MCP server YAML | Identical format; identity binding adjustment |

Migration work for Tier 2: **moderate**. Estimated effort for a typical 22-template, 50-policy, 4-dashboard deployment: 4-8 platform-engineer-weeks of translation work, depending on customization depth.

### Tier 3: High-Friction (Cluster, CI/CD Substrate, Service Mesh)

These layers require cluster-level migration and are the most-significant portion of the work.

| Layer | Component | Migration Work |
|-------|-----------|-----------------|
| Cluster | ARO ↔ AKS | Workloads run on Kubernetes APIs; lift-and-shift feasible for most. OpenShift-specific resources (Routes, SCCs, BuildConfigs) require translation to Kubernetes-native equivalents (Ingress, PSPs / Pod Security Standards, Tekton). |
| CI/CD substrate | OpenShift Pipelines (Tekton) ↔ GitHub Actions | Re-author CI/CD workflows. Tekton tasks → GitHub Actions composite actions. ~40-60% rewrite depending on Tekton complexity. |
| Service Mesh | OpenShift Service Mesh (Istio) ↔ Istio or Linkerd | If both are Istio, configuration is portable. If migrating to Linkerd, traffic-management and policy patterns require translation. |
| Supply Chain | Red Hat Trusted Application Pipeline ↔ GHAS + SLSA + Sigstore | Conceptually equivalent; tooling is different. Re-implement signing chain, attestation flow, admission verification. ~3-4 platform-engineer-weeks. |
| Multi-cluster | Red Hat ACM ↔ Cluster API + Argo CD ApplicationSets | If multi-cluster is in use, this is significant rework. Single-cluster customers skip this entirely. |

Migration work for Tier 3: **high**. Estimated effort for a typical mid-sized deployment: 3-6 platform-engineer-months including parallel-run and validation. Larger deployments scale roughly linearly.

---

## A.2 Migration Direction Matters

Migrations are not symmetric. Three Horizons → Open Horizons and Open Horizons → Three Horizons have different operational characteristics.

### A.2.1 Three Horizons → Open Horizons

Typical drivers: customer reduces Red Hat footprint, prefers minimum vendor count, builds internal capability for upstream operation.

**Easier-than-symmetric work:**

- **Backstage upstream is more permissive than RHDH.** Plugin ecosystem is broader. Customer can adopt plugins they previously could not.
- **OPA Gatekeeper is well-documented; more practitioners.** Easier to find skill set than for ACS.
- **GitHub Actions is more familiar** to most developers than Tekton; CI/CD migration onboards developers faster.
- **Open Horizons has fewer commercial dependencies.** Procurement simplification.

**Harder-than-symmetric work:**

- **Loss of Red Hat enterprise support.** Customer must build internal capability or engage integrators.
- **OpenShift-specific resources require translation** (Routes, SCCs, BuildConfigs).
- **Multi-cluster patterns require ACM replacement** (Cluster API + Argo CD ApplicationSets).
- **Red Hat-specific certifications** (FedRAMP, FIPS, Common Criteria) are no longer carried at the upstream-stack layer.

### A.2.2 Open Horizons → Three Horizons

Typical drivers: customer regulatory or audit requirements demand commercial-supported software; Red Hat investment grows organically; mergers/acquisitions add Red Hat footprint.

**Easier-than-symmetric work:**

- **Backstage scaffolder templates port to RHDH** with minimal rewrite (RHDH is Backstage upstream + Red Hat plugins + Red Hat support).
- **Argo CD applications port to OpenShift GitOps** with effectively zero rewrite (OpenShift GitOps is Argo CD).
- **GitHub Actions CI/CD coexists** with Tekton on OpenShift; customer can keep GitHub Actions and add Tekton selectively.
- **Red Hat enterprise support adds operational coverage.** Reduces internal capability requirement.

**Harder-than-symmetric work:**

- **Red Hat licensing introduces commercial overhead.** Procurement, renewal, true-up cycles.
- **OpenShift cluster is more opinionated than AKS.** Workloads that took advantage of AKS-specific features (e.g., azure-cni-overlay specific patterns, certain managed addons) require accommodation.
- **TAP integration replaces SLSA + Sigstore.** Conceptually equivalent but operationally different; the customer's signing keys, trust roots, and attestation chain require migration.
- **Sigstore-signed images may not validate** under TAP without re-signing; the cutover window requires planning.

---

## A.3 Cost Estimates for a Typical Migration

These are working estimates from LATAM enterprise observation, applicable to a mid-sized deployment (3-10 application teams, 50-200 workloads).

| Migration Direction | Total Effort | Calendar Time | Estimated Cost (Loaded) |
|---------------------|--------------|----------------|--------------------------|
| Three Horizons → Open Horizons | 6-12 platform-engineer-months | 4-8 calendar months | $400K-$800K USD |
| Open Horizons → Three Horizons | 4-10 platform-engineer-months | 3-6 calendar months | $300K-$700K USD |

The cost ranges include:

- Platform team time (translation work, parallel-run, validation).
- Application team time (workload re-deployment, smoke testing).
- Vendor support engagement (Red Hat for Three Horizons direction, integrator for Open Horizons direction).
- Consulting / Microsoft GBB time.
- Pilot environment infrastructure.

The cost ranges do *not* include:

- Net annual licensing change (Red Hat subscriptions added or removed).
- Headcount changes if the team's skill mix changes.
- Re-training and certification costs.

---

## A.4 When to Migrate vs Stay

Migration is rarely the right answer. The default recommendation is to stay on the chosen accelerator unless one of the following triggers fires.

### Triggers That Justify Migration

1. **Regulatory mandate.** A new sector regulation (BACEN, ANEEL, sector-specific) requires commercial-supported software for the full stack, and the customer is on Open Horizons.
2. **Major M&A event.** Acquisition adds significant Red Hat footprint (or the inverse, divestiture removes Red Hat footprint), and consolidation is operationally rational.
3. **Sustained capability gap.** The customer chose Three Horizons but cannot fund the Red Hat subscriptions; or the customer chose Open Horizons but cannot build the internal capability for upstream operation. The gap has persisted for >12 months and is producing measurable program delay.
4. **Vendor strategy change at executive level.** New CIO or CTO mandates a vendor rationalization that affects the accelerator choice.
5. **Open-source posture change.** Customer's culture shifts decisively toward OSS-first; the Red Hat licensing line item becomes politically untenable.

### Triggers That Do NOT Justify Migration

1. **Personal preference at the engineering-team level.** Engineers' opinions matter operationally but not as migration drivers. Address through internal training and tool customization.
2. **A specific feature appears in the other accelerator first.** Both stacks evolve; if a feature is important, customize the current stack rather than migrate.
3. **Dissatisfaction with the current stack's specific incident.** Investigate the specific incident; in 9 of 10 cases the resolution is configuration, not migration.
4. **Vendor sales pressure from Microsoft, Red Hat, or any other party.** Stay neutral; the customer's procurement profile, not vendor pressure, drives the decision.

---

## A.5 The Migration Sequence

When migration is the right answer, the recommended sequence:

### Phase M0: Pre-migration assessment (Weeks 0-4)

- Audit the current deployment against this appendix's three friction tiers.
- Estimate effort and cost specifically for the customer's footprint.
- Identify workloads that cannot migrate (or require significant rework).
- Ratify the migration with the executive sponsor; document the trigger.
- Stand up a parallel pilot environment of the target accelerator.

### Phase M1: Tier 2 translation (Weeks 4-12)

- Translate IDP templates, policies, GitOps applications.
- Validate translated artifacts in the parallel pilot environment.
- Establish CI/CD parity (workflows produce equivalent artifacts in both stacks).
- Document conventions changes the customer's developers will need to absorb.

### Phase M2: Tier 3 cluster migration (Weeks 12-24)

- Migrate workloads cluster-by-cluster (or namespace-by-namespace) using parallel-run.
- Validate each cohort under operational load before retiring the source cluster.
- Migrate observability dashboards and alert rules in parallel.
- Migrate supply-chain pipeline (TAP ↔ SLSA+Sigstore).

### Phase M3: Cutover (Weeks 24-30)

- Final workload migrations.
- Source cluster decommission with documented retention period.
- Vendor contract changes (Red Hat subscription cancellation or commencement).
- Final retrospective: lessons learned, runbook updates, training gaps.

### Phase M4: Stabilization (Weeks 30-40)

- Monitor migrated workloads for 90 days.
- Address residual issues (configuration drift, unsigned artifacts, etc.).
- Update internal training to reflect the new stack.
- Re-baseline DORA Four Keys against the new platform.

The 30-week sequence is the typical pattern. Larger deployments stretch to 40-50 weeks; smaller deployments compress to 20-25.

---

## A.6 What Does NOT Migrate (Re-Implementation Required)

Some artifacts are stack-specific and re-implementation is the only path:

- **OpenShift Routes and Routing**: re-implement as Kubernetes Ingress with appropriate ingress controller in AKS.
- **OpenShift BuildConfigs**: re-implement as GitHub Actions workflows.
- **OpenShift ImageStreams**: re-implement as ACR image tags.
- **OpenShift Templates**: re-implement as Helm charts or Kustomize bases (or as Backstage scaffolder templates).
- **Red Hat Operators (specific to RH-licensed products)**: re-implement using equivalent OSS or Microsoft alternatives; the operator inventory varies per customer.
- **TAP-specific attestation chains**: re-implement via Sigstore Rekor + cosign attestations.

These re-implementations are predictable but they are work. The migration estimate accounts for them.

---

## A.7 The Hybrid Pattern (Avoid Migration Through Coexistence)

For some customers, the right answer is to run *both* accelerators in different parts of the organization. The hybrid pattern is described in chapter 08, section 3.4. When the customer's organization is genuinely heterogeneous (a regulated subsidiary plus a digital-native business unit), the hybrid pattern eliminates the need for migration.

Operational requirements for the hybrid pattern:

- **Single Microsoft foundation.** Both accelerators share Azure, Entra, Foundry, GitHub Enterprise.
- **Unified catalog data.** RHDH catalog and Backstage catalog cross-reference each other (typically via MCP integration).
- **Workloads portable.** A workload on either stack can be redeployed to the other if business needs change.
- **Consistent observability.** Both stacks emit telemetry into the same Azure Monitor / Foundry Observability plane.

The hybrid pattern is uncommon but it is operationally valid. For ~5-10% of LATAM enterprise customers, it is the right answer.

---

## A.8 Summary: The Migration Headline

| Aspect | Reality |
|--------|---------|
| Microsoft foundation | Constant. Zero migration work. |
| Application code | Largely portable. Containerized workloads run on both clusters. |
| Identity, secrets, observability | Constant. Zero migration. |
| AI primitives (Foundry, Agent Framework, Copilot) | Constant. Zero migration. |
| IDP templates, policies, GitOps | Translation work. 4-8 engineer-weeks for moderate footprint. |
| Cluster substrate, CI/CD, service mesh, supply chain | Re-implementation work. 3-6 engineer-months for moderate footprint. |
| Total typical migration | 6-12 engineer-months calendar time, 4-8 months. |
| Customer downtime | Near-zero with parallel-run pattern. |
| Cost range (loaded) | $300K-$800K USD for mid-sized deployments. |

The single takeaway: **migration between Three Horizons and Open Horizons is bounded, predictable, and recoverable**. The accelerator choice is not a one-way door. Customers who choose conservatively today have a clear path to migrate later if conditions change. The headline is that conditions usually do not change enough to justify migration; when they do, the path is well-mapped.

---

## References

- Silva, P. (2026). *Platform Engineering Playbook: Chapter 06 — Three Horizons (Red Hat)*. (This playbook.)
- Silva, P. (2026). *Platform Engineering Playbook: Chapter 07 — Open Horizons (OSS)*. (This playbook.)
- Silva, P. (2026). *Platform Engineering Playbook: Chapter 08 — Comparative Decision Framework*. (This playbook.)
- [Backstage Documentation](https://backstage.io/docs/). Linux Foundation, 2026.
- [Red Hat Developer Hub Documentation](https://developers.redhat.com/rhdh). Red Hat, 2026.
- [Azure Kubernetes Service Documentation](https://learn.microsoft.com/en-us/azure/aks/). Microsoft, 2026.
- [Azure Red Hat OpenShift Documentation](https://learn.microsoft.com/en-us/azure/openshift/). Microsoft and Red Hat, 2026.

---

Paula Silva, Software Global Black Belt
*Pioneering software development with AI and Agentic DevOps*

paulasilva@microsoft.com
