---
title: "07 Governance and Compliance"
description: "Policies, controls, audit requirements, and compliance considerations for operating SCL-AD in regulated and enterprise environments."
author: "Paula Silva"
date: "2026-05-04"
version: "1.0.0"
status: "draft"
tags: ["scl-ad", "governance", "compliance", "security", "audit"]
---

# 07 Governance and Compliance

> The policies, controls, and operational disciplines that make SCL-AD safe to deploy in regulated industries and enterprise-scale organizations.

## Change Log

| Version | Date       | Author      | Changes         |
|---------|------------|-------------|-----------------|
| 1.0.0   | 2026-05-04 | Paula Silva | Initial version |

## Table of Contents

- [1. Why Governance Matters Here](#1-why-governance-matters-here)
- [2. Governance Principles](#2-governance-principles)
- [3. Roles and Responsibilities](#3-roles-and-responsibilities)
- [4. Policy Domains](#4-policy-domains)
- [5. Control Catalog](#5-control-catalog)
- [6. Audit Requirements](#6-audit-requirements)
- [7. Industry-Specific Considerations](#7-industry-specific-considerations)
- [8. Incident Response](#8-incident-response)
- [References](#references)

## 1. Why Governance Matters Here

Semantic context derived from source code is not neutral data. It encodes architectural decisions, security postures, dependency footprints, and proprietary patterns. The registry that stores this context is, in effect, a high-fidelity description of how the organization's software actually works.

Three risks emerge when this is poorly governed:

The **information leak risk** occurs when context derived from sensitive repositories reaches agents or users without authorization. An agent that can read context from the payment processing service has, in practice, read the architecture of the payment processing service.

The **integrity risk** occurs when artifacts are tampered with, fabricated, or substituted. An agent reasoning from corrupted context produces flawed code with confident assertions. Trust in the context layer is irrecoverable once broken.

The **compliance risk** occurs when context contains regulated data (personal data identifiers, security details subject to disclosure rules) and is stored or transmitted in ways that violate applicable regulations.

The framework treats governance as a peer to architecture, not a layer above it. Every component has governance obligations. The remainder of this document specifies what those are.

## 2. Governance Principles

Five principles govern SCL-AD operations. They are non-negotiable in regulated deployments.

**Identity-first.** Every read, write, and refresh operation is tied to an authenticated identity. Service accounts are identities; "the system" is not.

**Trace-by-default.** Every artifact is traceable to its source recipe, source code, and source operator. Trace data is a first-class output, not an afterthought.

**Least exposure.** Agents, tools, and humans see the minimum context required for their task. Default deny is the default.

**Verifiable integrity.** Every artifact carries a signature or content hash that proves it was produced by the registered recipe and has not been altered.

**Documented purpose.** Every recipe, every artifact type, and every integration declares its purpose in writing. Undocumented context flows are anti-patterns.

## 3. Roles and Responsibilities

Five roles are recognized in SCL-AD governance. In smaller organizations, individuals may hold multiple roles.

### 3.1 Platform Owner

Owns the operation of the SCL-AD platform end-to-end. Accountable for availability, performance, and adherence to policy.

### 3.2 Recipe Steward

Owns one or more recipes. Responsible for their correctness, evolution, and deprecation. Recipe stewards are typically platform engineers with deep knowledge of the language stacks they cover.

### 3.3 Repository Owner

Owns the source code in a repository. Decides what context derived from their repository can be exposed, with what classification, to whom. Repository owners are not bypassable.

### 3.4 Security and Compliance Reviewer

Reviews recipes that touch sensitive material (security configuration, dependency advisories, regulated data identifiers). Approves or rejects classification labels and access policies.

### 3.5 Auditor

External or internal party with read-only access to logs and configuration for the purpose of compliance verification. Auditors do not have artifact access by default; their role is to verify that the system operates as documented.

## 4. Policy Domains

Six policy domains require documented organizational decisions. The framework specifies the question; the answer is organization-specific.

### 4.1 Scope Policy

Which repositories are in scope for SCL-AD? The default is "all production-impacting code." Documented exclusions might include experimental projects, archived repositories, or third-party-maintained code.

### 4.2 Classification Policy

What classification labels exist, what they mean, and how they map to access rules. A typical scheme: public, internal, confidential, restricted. Each label has a defined audience and retention rule.

### 4.3 Access Policy

Who can read what. The baseline is identity propagation: registry access mirrors source code access. Exceptions (auditors, security reviewers, certain platform agents) require explicit policy statements.

### 4.4 Refresh Policy

How frequently each artifact type is refreshed and what triggers an unscheduled refresh. Linked to the staleness windows in [05 Context Registry and Distribution](./05_Context_Registry_and_Distribution_v1.0.0_2026-05-04.md).

### 4.5 Retention Policy

How long artifacts are retained, when they are archived, and when they are deleted. Aligned with source code retention and applicable regulatory requirements.

### 4.6 Integration Policy

Which agents are approved to consume registry context, with which classification levels, and through which integration patterns. New integrations require review before they can call the registry.

## 5. Control Catalog

Twelve controls implement the governance policies. Every SCL-AD deployment in a regulated environment should map its operations to this catalog.

### 5.1 Identity and Access Controls

**SCL-IAM-01 Identity propagation.** Every registry read carries authenticated identity. Anonymous reads are not permitted.

**SCL-IAM-02 Authorization mirror.** Registry authorization decisions reproduce source code authorization decisions. Read access to an artifact requires read access to the source repository.

**SCL-IAM-03 Privileged access management.** Registry administrative operations (deletion, classification override, recipe registration) require elevated authentication and just-in-time access.

### 5.2 Integrity Controls

**SCL-INT-01 Artifact signing.** Every artifact is signed by the recipe execution pipeline. Signatures are verifiable using publicly accessible keys.

**SCL-INT-02 Content addressing.** Every artifact has a content hash. Tamper detection is automatic on read.

**SCL-INT-03 Recipe attestation.** Every artifact's manifest names the recipe version and includes a recipe attestation that links the recipe code to its compiled form.

### 5.3 Lifecycle Controls

**SCL-LCY-01 Refresh enforcement.** Artifacts that exceed their staleness window are flagged. Stale artifacts in critical categories block agent consumption until refreshed.

**SCL-LCY-02 Archival.** Artifacts for archived repositories are archived in parallel within a defined window (typically 7 days).

**SCL-LCY-03 Deletion.** Deletion of an artifact is logged, requires authorization, and triggers a downstream notification to dependent agents and integrations.

### 5.4 Observability Controls

**SCL-OBS-01 Read logging.** Every artifact read produces an audit log entry as specified in [05 Context Registry and Distribution](./05_Context_Registry_and_Distribution_v1.0.0_2026-05-04.md), section 6.3.

**SCL-OBS-02 Write logging.** Every artifact write (creation, refresh, deletion) produces an audit log entry with operator identity, recipe version, and source commit.

**SCL-OBS-03 Anomaly detection.** Deviations from baseline access patterns (volume spikes, unusual cross-repository access, off-hours administrative actions) generate alerts.

## 6. Audit Requirements

Audit data is the basis for trust in SCL-AD. The following minimums apply.

### 6.1 Audit Scope

Audit data covers:

- Every recipe execution (which recipe, which inputs, which output, which operator)
- Every registry read (who, when, what artifact, calling context)
- Every registry write (who, when, what change)
- Every administrative action (configuration changes, policy updates, recipe registration)
- Every authorization decision, both allow and deny

### 6.2 Audit Retention

Default retention is 12 months. Regulated environments commonly require 36 to 84 months. Retention policy is documented and enforced through immutable storage.

### 6.3 Audit Integrity

Audit data is append-only. Logs cannot be modified or selectively deleted. Where regulations require, audit data is replicated to a separate, isolated log store with independent access controls.

### 6.4 Audit Access

Auditors have read access to audit data through a dedicated audit interface. They do not have access to artifact bodies unless explicitly granted for a specific investigation.

### 6.5 Audit Reports

The platform produces standard reports on a schedule:

- Monthly access summary by repository and identity
- Quarterly classification compliance report
- Annual access pattern review
- Ad hoc investigation support reports

## 7. Industry-Specific Considerations

The following considerations apply to specific regulated industries. The framework is industry-neutral; these notes highlight typical extensions.

### 7.1 Financial Services

Financial services environments typically require:

- Data residency compliance (artifacts derived from regulated systems may be subject to residency rules)
- Trading system separation (artifacts from trading codebases may be separated from broader registry access)
- Regulatory reporting integration (artifact access logs may need to feed into broader regulatory reporting)
- Recipe approval workflows aligned with model risk management or equivalent governance

For organizations using SCL-AD in financial contexts, additional recipe categories often emerge for regulatory mappings (such as records demonstrating which code implements which regulatory control).

### 7.2 Healthcare

Healthcare environments typically require:

- Strict separation of artifacts that could leak protected health information patterns (even where the PHI itself is not in the registry, the access patterns can be sensitive)
- Audit retention aligned with health data retention rules (often 6 years or longer)
- Specific access controls for systems under direct regulator oversight

### 7.3 Public Sector

Public sector environments typically require:

- Sovereignty controls (registry must be hosted in compliant jurisdictions)
- Citizenship or clearance-based access (in some contexts, identity propagation extends to clearance verification)
- Integration with approved evaluation programs (registry must align with applicable security assessment regimes)

### 7.4 Critical Infrastructure

Energy, telecom, and other critical infrastructure environments typically require:

- Air-gapped deployments or strictly controlled connectivity
- Tighter integration with operational technology (OT) inventory systems
- Long retention of audit data for forensic investigations
- Tighter classification of artifacts that describe control system codebases

In all four cases, the framework's components remain unchanged. Industry-specific configuration adjusts policies, retention, classifications, and approval workflows.

## 8. Incident Response

Incidents in SCL-AD fall into three categories. Each has a defined response template.

### 8.1 Integrity Incident

Suspected tampering, fabrication, or unauthorized modification of artifacts.

Response template:

1. Freeze the affected repository's artifacts (mark as quarantined; agents stop consuming).
2. Identify the scope through audit data.
3. Verify signatures and content hashes against pipeline records.
4. Regenerate artifacts from a clean pipeline run.
5. Communicate to consumers (developers, agents, dependent systems).
6. Postmortem within 30 days.

### 8.2 Disclosure Incident

Suspected unauthorized access to artifacts of restricted classification.

Response template:

1. Identify the affected artifacts and the unauthorized identities through audit data.
2. Revoke access; rotate credentials if applicable.
3. Notify affected repository owners.
4. Engage security and compliance teams per organizational policy.
5. Document in the incident register.
6. Postmortem within 30 days.

### 8.3 Availability Incident

Registry unavailable or significantly degraded.

Response template:

1. Activate the documented degraded-mode procedures (typically: agents fall back to whatever static files were last distributed).
2. Restore service per platform runbooks.
3. Verify that artifacts and audit logs are intact.
4. Communicate restoration to consumers.
5. Postmortem if duration exceeds defined thresholds.

The three response templates are minimum standards. Each organization extends them with specific contact lists, escalation paths, and regulatory notification triggers.

## References

1. [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework). Reference framework for control catalog organization.
2. [SLSA Specification](https://slsa.dev/). Reference for build provenance and integrity attestation.
3. [SOC 2 Trust Services Criteria](https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2). Reference for audit and controls in service organizations.
4. [ISO/IEC 27001](https://www.iso.org/standard/27001). Reference for information security management.
5. [ISO/IEC 42001](https://www.iso.org/standard/81230.html). Reference for AI management systems, applicable to agentic deployments.
