---
title: "Appendix B: Glossary of Acronyms and Key Terms"
description: "Every acronym and technical term used in the playbook, with expanded form, vendor or origin, and the chapter where it first appears in operational depth."
author: "Paula Silva"
role: "Software Global Black Belt"
contact: "paulasilva@microsoft.com"
date: "2026-05-05"
version: "1.0.0"
status: "draft"
locale: "en"
brand: "Agentic DevOps"
tags: [glossary, acronyms, definitions, reference]
---

# Appendix B: Glossary of Acronyms and Key Terms

> **Purpose.** The playbook uses many acronyms, vendor names, and technical terms that are familiar to platform engineers but may be unfamiliar to executive readers, security and compliance partners, finance partners, or new platform team members. This appendix is the consolidated reference, organized alphabetically. Each entry includes the expanded form, vendor or origin, a one-sentence definition, and the chapter where the term first appears in operational depth.

---

## A

**A2A** — Agent-to-Agent protocol. An emerging interoperability protocol allowing agents from different frameworks to coordinate. Microsoft Agent Framework 1.0 supports A2A v1.0. *Used in: chapter 06.*

**ACE** — (1) **Agent Command Environment**, the human-orchestration workbench in the SE 3.0 framework (Hassan et al. 2025). (2) **Agentic Context Engineering**, the framework introduced by Zhang et al. (2026) for evolving contexts through Generation → Reflection → Curation → Accumulation. Distinguish by context. *Used in: chapter 02, chapter 04.*

**ACM** — **Red Hat Advanced Cluster Manager**. Multi-cluster policy, observability, and governance across OpenShift clusters. *Used in: chapter 06.*

**ACR** — **Azure Container Registry**. Microsoft's managed container image registry. *Used in: chapters 04, 06, 07.*

**ACS** — **Red Hat Advanced Cluster Security**. Runtime security, vulnerability management, network policy across clusters. *Used in: chapter 06.*

**ADR** — **Architectural Decision Record**. A document capturing an architecture decision with context, consequences, and rationale. *Used in: chapter 06 (architect agent).*

**AEE** — **Agent Execution Environment**. The agent-execution workbench in the SE 3.0 framework (Hassan et al. 2025), with human-callback capability for complex trade-offs. *Used in: chapter 02.*

**AI Foundry** — See **Microsoft Foundry**.

**AIOps 2.0** — The 2026 vocabulary for the consolidation of observability data with model-driven prediction to surface incidents before they escalate. *Used in: chapter 03.*

**AKS** — **Azure Kubernetes Service**. Microsoft's managed Kubernetes service on Azure. The cluster substrate for Open Horizons. *Used in: chapter 07.*

**Argo CD** — Cloud-native GitOps controller. Reconciles cluster state to declared state in Git. Default GitOps controller in Open Horizons; embedded in OpenShift GitOps in Three Horizons. *Used in: chapters 03, 06, 07.*

**Argo Rollouts** — Progressive-delivery controller for Kubernetes (canary, blue-green deployments). *Used in: chapter 07.*

**ARO** — **Azure Red Hat OpenShift**. The managed OpenShift service jointly operated by Microsoft and Red Hat on Azure. The cluster substrate for Three Horizons. *Used in: chapter 06.*

---

## B

**BACEN** — *Banco Central do Brasil*. Brazil's central banking regulator. Source of Resolution 4658 and other regulatory requirements relevant to Brazilian financial institutions. *Used in: chapters 06, 07, 08, 10.*

**Backstage** — Open-source Internal Developer Platform created by Spotify, donated to CNCF in 2020. Approximately 89% market share among IDP adopters as of 2026. The IDP substrate for Open Horizons. *Used in: chapters 03, 07.*

**BPS** — **Business Process Services**. Outsourced business process operations. The BPS market reached $221.5B in 2024 (Gartner Predicts 2026). *Used in: chapter 04 indirectly.*

---

## C

**CAB** — **Change Advisory Board**. The cross-functional review body that approves high-impact production changes. In the playbook, implemented as GitHub Issues templates plus a labeled approval workflow. *Used in: chapter 03 (Manual Review).*

**CC** — **Common Criteria**. International standard (ISO/IEC 15408) for computer security certification. *Used in: chapter 08.*

**CI/CD** — **Continuous Integration / Continuous Deployment**. The pipeline mechanism that builds, tests, and deploys software changes. *Used in: throughout.*

**CNCF** — **Cloud Native Computing Foundation**. The Linux Foundation organization that governs Kubernetes, Backstage, OpenTelemetry, Argo, Flux, and the Platform Engineering Working Group. *Used in: throughout.*

**CONSTITUTION.md** — In Spec-Driven Development, the strategic intent guide for an agent or system. Defines what the system is, who it serves, what it must always do, what it must never do. *Used in: chapter 02 (Intent layer).*

**CRA** — **Code Review Agent**. An AI agent that performs code review on pull requests. Empirically shown to have a 23pp merge-rate gap compared to human reviewers when used alone (Chowdhury et al. 2026). *Used in: chapter 04.*

**CRP** — **Consultation Request Pack**. In the SE 3.0 framework, the structured handoff packet from agent to human when ambiguity exceeds the agent's capability. *Used in: chapter 02.*

**CWE** — **Common Weakness Enumeration**. The community-maintained list of software weakness types maintained by MITRE. Used by Constitutional SDD as the source of security constraints. *Used in: chapter 04.*

---

## D

**DLQ** — **Dead Letter Queue**. A queue holding messages that could not be processed; used for retries and incident response. *Used in: chapter 06 (batch-job template).*

**DORA** — Originally **DevOps Research and Assessment** (DevOps research group; published the State of DevOps reports annually 2014-2025; acquired by Google in 2018). The Four Key Metrics (deployment frequency, lead time, change failure rate, MTTR) are the operational substrate for delivery measurement. *Used in: throughout.*

**DPA** — **Data Processing Agreement**. The contract between a data controller and processor governing personal data handling. *Used in: chapters 06, 07.*

**Dual Mandate** — The 2026 CNCF framing that platform teams have two simultaneous mandates: (A) use AI to augment the platform team's velocity, (B) expose AI capabilities as platform primitives for application teams. *Used in: chapter 05.*

---

## E

**EBIT** — **Earnings Before Interest and Taxes**. Operating profit margin. Used in Gartner Predicts 2026 in connection with AI-realization metrics. *Used in: chapter 10.*

**EKS** — **Amazon Elastic Kubernetes Service**. AWS's managed Kubernetes service. Comparison reference for AKS (Open Horizons) and ARO (Three Horizons). *Used in: chapter 08 (multi-cloud edge cases).*

**Entra Agent ID** — Microsoft's managed identity service for AI agents. Provides scoped tokens, audit trail, and revocation across the Microsoft foundation. *Used in: chapters 03, 05, 06, 07, 10.*

**Entra ID** — Microsoft's identity provider (formerly Azure Active Directory). The identity substrate for both accelerators in this playbook. *Used in: chapters 06, 07.*

---

## F

**FedRAMP** — **Federal Risk and Authorization Management Program**. US federal government program for cloud-service security authorization. Cited in chapter 08 as a procurement-blocking criterion in some sectors. *Used in: chapters 06, 08.*

**FIPS** — **Federal Information Processing Standards**. US federal cryptographic and security standards (e.g., FIPS 140-2, FIPS 140-3). *Used in: chapter 08.*

**Flux** — Cloud-native GitOps controller, alternative to Argo CD. Both are first-class options in Open Horizons. *Used in: chapters 03, 07.*

**Foundry** — See **Microsoft Foundry**.

**Foundry Agent Service** — Microsoft's managed agent runtime, part of Microsoft Foundry. Provides hosted agent execution with platform identity, observability, and isolation. *Used in: chapters 05, 06, 07.*

**FSI** — **Financial Services Industry**. A sector concentration in Three Horizons typical client profile. *Used in: chapter 06.*

---

## G

**GBB** — **Global Black Belt**. Microsoft's specialist sales role for advanced workloads. The author's role; provides context for the playbook's enterprise framing. *Used in: throughout.*

**GHAS** — **GitHub Advanced Security**. GitHub's security feature set including secret scanning, code scanning (CodeQL), and dependency review. *Used in: chapters 03, 04, 06, 07.*

**GitOps** — The operational pattern where infrastructure and deployments are declared in Git and reconciled by an automated controller. The dominant deployment pattern in 2026 platforms. *Used in: throughout.*

**Golden Path** — An opinionated, self-service workflow that takes a developer or agent from intent to a working, compliant system in minutes. The first pillar in the CNCF Four Pillars framework. *Used in: throughout.*

**GPS** — **Gartner Positioning System**. The "You Are Here" framework from Gartner's "Walking the Golden Path" report (G00841075, January 2026). *Used in: chapter 02.*

**Guardrail** — A mechanism that prevents non-compliant or unsafe configurations from being deployed. The second pillar in the CNCF Four Pillars framework. *Used in: throughout.*

---

## H

**H1, H2, H3** — **Horizon 1, Horizon 2, Horizon 3** in the Three Horizons maturity model: H1 = Optimize Present (Foundation), H2 = Emerging Capabilities (Enhancement), H3 = Transform Future (Innovation). *Used in: chapters 06, 07, 09.*

**Harness Engineering** — The 2026 discipline naming the operating model that wraps the four layers of the Context Platform Stack into a production system. Coined by Hashimoto (Feb 2026), formalized by the OpenAI engineering team and Anthropic in early 2026. *Used in: chapter 06 (cross-reference to Context Platform Stack chapter 06).*

**HIPAA** — **Health Insurance Portability and Accountability Act**. US healthcare data protection regulation. *Used in: chapter 08.*

---

## I

**IDP** — **Internal Developer Platform**. The productized internal platform that exposes self-service primitives to application teams. The IDP is what materializes the Golden Paths pillar. RHDH and Backstage are the two IDP options in this playbook. *Used in: throughout.*

**IFPUG** — **International Function Point Users Group**. Industry standard for software function-point counting; cited in some platform-spend analyses. *Used in: tangentially in playbook.*

---

## J

**Jaeger** — Open-source distributed tracing system. Part of the Open Horizons observability stack. *Used in: chapter 07.*

---

## K

**Key Vault** — **Azure Key Vault**. Microsoft's managed secrets and certificate store. Used by both accelerators for platform-level secret management. *Used in: chapters 04, 06, 07.*

**Kyverno** — Open-source policy engine for Kubernetes, alternative to OPA Gatekeeper. *Used in: chapters 03, 06, 07.*

---

## L

**LATAM** — **Latin America**. The geographical region that is the primary deployment target for the playbook's two accelerators. *Used in: throughout.*

**LGPD** — *Lei Geral de Proteção de Dados*. Brazil's general data protection law (analogous to GDPR). *Used in: chapters 06, 07, 08, 10.*

**Lightspeed** — See **Red Hat Lightspeed**.

**LLM** — **Large Language Model**. The reasoning capability layer in the AI-Native Enterprise Pyramid. *Used in: throughout.*

---

## M

**Mandate A** — In the CNCF Dual Mandate framing, the mandate to use AI to augment the platform team's internal velocity. *Used in: chapter 05.*

**Mandate B** — In the CNCF Dual Mandate framing, the mandate to expose AI capabilities as platform primitives for application teams to consume. *Used in: chapter 05.*

**MCP** — **Model Context Protocol**. The open protocol introduced by Anthropic in 2024-2025 for standardized agent-system integration. The integration substrate for both accelerators in this playbook. *Used in: chapters 02, 07.*

**Microsoft Foundry** — Microsoft's AI platform, including the model gateway, evaluation framework, observability, and hosted agent runtime (Foundry Agent Service). The shared AI platform across both accelerators in this playbook. *Used in: throughout.*

**MITRE** — Non-profit research organization that maintains CWE, ATT&CK, and other security frameworks. Source for Constitutional SDD security constraints. *Used in: chapter 04.*

**MRP** — **Merge-Readiness Pack**. In the SE 3.0 framework, the structured handoff from agent to merge gate, summarizing what was done and what should be reviewed. *Used in: chapter 02.*

**MSA** — **Master Service Agreement**. The umbrella commercial contract under which specific service agreements (SOWs) are executed. *Used in: chapter 06.*

**MSR** — **International Conference on Mining Software Repositories**. Top-tier academic conference for empirical software engineering research. Several Code Review Agent and Agent Failure papers cited in this playbook are from MSR 2026. *Used in: appendix D.*

**MTTR** — **Mean Time to Restore (or Recovery)**. One of the DORA Four Key Metrics. *Used in: chapter 10.*

---

## N

**NPS** — **Net Promoter Score**. Customer-loyalty metric. Cited in Gartner Predicts 2026 as the model for an AI "trust velocity" metric. *Used in: chapter 10.*

**NSG** — **Network Security Group**. Azure's network firewall layer. Used in both accelerators as part of the Guardrails pillar. *Used in: chapters 03, 06, 07.*

---

## O

**OCP** — **OpenShift Container Platform**. Red Hat's self-operated OpenShift product, distinct from the managed ARO service. *Used in: chapter 08 (multi-cloud edge cases).*

**OKR** — **Objectives and Key Results**. The goal-setting framework. Cited in Gartner Predicts 2026 in connection with customer-journey alignment. *Used in: chapter 09.*

**OpenShift** — Red Hat's enterprise Kubernetes distribution. Available as managed service (ARO) or self-operated (OCP). *Used in: chapter 06.*

**OpenShift GitOps** — Red Hat's distribution of Argo CD, integrated with OpenShift. *Used in: chapter 06.*

**OpenShift Pipelines** — Red Hat's distribution of Tekton, integrated with OpenShift. *Used in: chapter 06.*

**OpenShift Service Mesh** — Red Hat's distribution of Istio, integrated with OpenShift. *Used in: chapter 06.*

**OPA** — **Open Policy Agent**. Open-source policy engine. The Gatekeeper component is the Kubernetes admission controller. *Used in: chapters 03, 04, 06, 07.*

---

## P

**PagerDuty** — Incident-management platform. Cited as one of the MCP server integration targets in Open Horizons. *Used in: chapter 07.*

**PCI-DSS** — **Payment Card Industry Data Security Standard**. The security standard for organizations handling payment card data. *Used in: chapter 10.*

**Postgres / PostgreSQL** — Open-source relational database. Used as Backstage's backend in Open Horizons; as a managed service via Azure Database for PostgreSQL. *Used in: chapter 07.*

**Prometheus** — Open-source metrics and monitoring system. Part of the observability stack in both accelerators. The Open Horizons reference deployment configures Prometheus with 2 replicas, 50GB storage, 15-day retention, and 30+ alerting rules. *Used in: chapter 03, 07.*

**Purview** — See **Microsoft Purview**.

---

## R

**RAG** — **Retrieval-Augmented Generation**. The pattern of grounding LLM outputs in retrieved enterprise context. The `rag-application` Golden Path materializes RAG as a productized capability. *Used in: chapters 06, 07.*

**RBAC** — **Role-Based Access Control**. The mechanism for granting and revoking permissions based on roles rather than individual users. Critical for both human and agent identity in 2026 platforms. *Used in: throughout.*

**Red Hat Lightspeed** — Red Hat's AI-assist layer for the Red Hat product portfolio (OpenShift, Ansible, RHEL, etc.). Maturing through 2026. *Used in: chapter 06.*

**RHDH** — **Red Hat Developer Hub**. Red Hat's enterprise-supported distribution of Backstage. The IDP substrate for Three Horizons. *Used in: chapter 06.*

**RHEL** — **Red Hat Enterprise Linux**. Red Hat's enterprise Linux distribution. A common prior investment in customers tilting toward Three Horizons. *Used in: chapters 06, 08.*

---

## S

**SASE** — **Structured Agentic Software Engineering**. The bi-directional partnership process model in SE 3.0 (Hassan et al. 2025). *Used in: chapter 02.*

**SBOM** — **Software Bill of Materials**. The inventory of software components in an artifact. Required by SLSA and other supply-chain security frameworks. *Used in: chapters 04, 06, 07.*

**SCC** — **Security Context Constraint**. OpenShift-specific mechanism for restricting workload security parameters at admission. *Used in: chapter 06.*

**SCL-AD** — **Semantic Context Layer for Agentic DevOps**. Paula Silva's framework for engineering deterministic semantic context. v1.1.0, May 2026. *Used in: chapter 02.*

**SDD** — **Spec-Driven Development**. The development pattern where specifications drive implementation. The constitutional variant (Constitutional SDD) embeds security at the specification layer. *Used in: chapters 02, 04, 06, 09.*

**SE 3.0** — **Software Engineering 3.0**. The Hassan et al. (2025) naming for the agentic software-engineering era. *Used in: chapter 02.*

**Sigstore** — Open-source keyless signing infrastructure for software artifacts. Includes cosign (signing tool), Rekor (transparency log), Fulcio (CA). *Used in: chapters 04, 07.*

**SLSA** — **Supply-chain Levels for Software Artifacts**. The framework defining provenance attestation and tampering protection levels. *Used in: chapters 04, 06, 07.*

**SOC 2** — **System and Organization Controls 2**. Audit standard for service organizations' controls relevant to security, availability, processing integrity, confidentiality, and privacy. *Used in: chapter 08.*

**SOX** — **Sarbanes-Oxley Act**. US legislation governing financial reporting controls. Relevant for the SOX-related dashboard panels in chapter 10. *Used in: chapter 10.*

**SPECIFICATION.md** — In Spec-Driven Development, the tactical intent guide for a specific feature or task. Translates the CONSTITUTION into a particular outcome with acceptance criteria. *Used in: chapters 02, 04, 09.*

**SPIFFE/SPIRE** — **Secure Production Identity Framework for Everyone / SPIFFE Runtime Environment**. Open-source workload-identity framework. Cited in chapter 09 as a phase-3 maturity option for cross-cluster agent identity. *Used in: chapter 09.*

**SRE** — **Site Reliability Engineering**. The discipline of operating production systems with software-engineering rigor. The `sre-agent-integration` template materializes SRE-as-code in both accelerators. *Used in: chapters 05, 06, 07.*

---

## T

**TAP** — **Trusted Application Pipeline**. See **Red Hat Trusted Application Pipeline**.

**TCO** — **Total Cost of Ownership**. Used in chapter 08 for the comparative cost analysis between Three Horizons and Open Horizons. *Used in: chapter 08, 10.*

**TechDocs** — Backstage / RHDH documentation-as-code system. The documentation surface in both accelerators. *Used in: chapters 02, 06, 07.*

**Tekton** — Cloud-native CI/CD project. Distributed by Red Hat as OpenShift Pipelines. *Used in: chapter 06.*

**Trajectory** — In the 2026 vocabulary, the complete record of an agent session: prompts received, tools called, outputs produced, costs incurred. The agent-era extension of traditional observability. *Used in: chapter 02, 03, 10.*

**Triple Debt** — The Storey (2026) framing extending technical debt with cognitive debt and intent debt. *Used in: chapter 04.*

---

## V

**Velero** — Open-source backup and restore for Kubernetes resources. Part of the Safety Nets pillar in both accelerators. *Used in: chapters 03, 04.*

**VNet** — **Virtual Network**. Azure's logical network primitive. Used by both accelerators for cluster networking. *Used in: chapters 06, 07.*

---

## W

**Workload Identity** — Microsoft's mechanism for issuing short-lived, federated credentials to workloads on Azure. Replaces long-lived service credentials. The single most-effective Guardrail against credential leaks in 2026. *Used in: throughout.*

---

## Y

**YAML** — **YAML Ain't Markup Language**. The configuration format used for Kubernetes manifests, Backstage catalog entries, GitHub Actions workflows, and the playbook chapters' frontmatter. *Used in: throughout.*

---

## Cross-Reference Index

For acronyms or terms that have multiple expanded forms or contexts, the table below disambiguates:

| Acronym | Primary Meaning in Playbook | Alternate Meanings to Disambiguate |
|---------|------------------------------|-------------------------------------|
| ACE | Agent Command Environment (chapter 02) | Agentic Context Engineering (chapter 04) — distinguish by context |
| MCP | Model Context Protocol (Anthropic) | Microsoft Cloud Platform — does NOT apply in this playbook |
| MSP | Not used in playbook | Managed Service Provider — does NOT apply in this playbook |
| RPM | Not used in playbook | Various (revolutions, Red Hat Package Manager) — does NOT apply |
| SDS | Not used in playbook | Software-Defined Storage — does NOT apply |

---

## References

This appendix is the consolidated glossary; per-chapter context for each term is in the chapter where the term first appears.

For acronyms specific to academic research (arXiv IDs, conference abbreviations like MSR, ICLR, etc.), see Appendix D for full citations.

For analyst firm conventions (Gartner doc IDs G00xxxxxx, IDC document numbers USxxxxxxxx), see Appendix C for full bibliography.

---

Paula Silva, Software Global Black Belt
*Pioneering software development with AI and Agentic DevOps*

paulasilva@microsoft.com
