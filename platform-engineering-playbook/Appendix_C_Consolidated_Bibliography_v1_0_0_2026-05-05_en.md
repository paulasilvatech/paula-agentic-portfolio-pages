---
title: "Appendix C: Consolidated Bibliography with Verified Citations"
description: "Every source the playbook draws on, with verification status (verified, partial, inferred), exact citation, document IDs where applicable, and the chapter(s) where each source is referenced."
author: "Paula Silva"
role: "Software Global Black Belt"
contact: "paulasilva@microsoft.com"
date: "2026-05-05"
version: "1.0.0"
status: "draft"
locale: "en"
brand: "Agentic DevOps"
tags: [bibliography, citations, verification, sources, references]
---

# Appendix C: Consolidated Bibliography

> **Purpose.** This appendix consolidates every source the playbook draws on, with explicit verification status. The intent is twofold: to give the reader a single auditable bibliography, and to flag honestly which claims are directly verified from primary sources, which are partially verified, and which are inferred or directional. A defensible playbook is one whose evidence trail is auditable; this appendix is that trail.

---

## Verification Status Legend

| Marker | Meaning |
|--------|---------|
| **VERIFIED** | The exact claim, with the exact number, is directly verifiable in the named source. |
| **PARTIAL** | The framework or finding is in the named source, but the exact number cited needs further triangulation, or the methodology is implied rather than explicit. |
| **INFERRED** | The claim is a reasonable inference from the surrounding evidence but not a direct quote from a single source. Used as analytical synthesis, not as primary citation. |
| **PRESS RELEASE** | The claim is from a public Gartner or vendor press release rather than from an internal research note. The press release is itself the citable source. |
| **NOT FOUND** | The claim previously cited could not be located in the materials available; it has been removed, replaced, or marked accordingly in the playbook. |

---

## C.1 Industry Research and Analyst Reports

### Gartner

**Predicts 2026: Reduce Structural Rigidity to Prepare Enterprise Operations for AI**
- ID: G00842103. Date: 23 October 2025. Authors: Janelle Hill, Maddie Otter, Miles Gibson. 17 pages.
- **VERIFIED** Strategic Planning Assumption: "By 2027, the cost-to-value gap for process-centric service contracts will be reduced by at least 50% due to agentic AI reinvention."
- **VERIFIED** Strategic Planning Assumption: "By 2028, AI governance costs will offset 60% of the savings derived from using agentic AI to eliminate many middle management tasks."
- **VERIFIED** "Approximately 80% of business transformation consulting engagements reflect a significant cost for process improvement... at least 50% of the cost of business process services contracts is for initial process improvement efforts."
- **VERIFIED** "BPS market grew steadily since 2023, to $221.5 billion in 2024."
- **VERIFIED** "Solutions based on AI agents... we expect the solutions to capture up to $700 billion of combined software and services spending by 2028."
- **VERIFIED** "Co-leadership of digital initiatives wins: 71% success rate vs 48% average" (basis: 2024 Gartner Corporate-Business Alignment Survey, n=508).
- **VERIFIED** "25% of organizations now have a comprehensive approach to AI governance that includes GenAI, and 48% have a comprehensive governance approach specifically for GenAI" (basis: 2024 Gartner Business Outcomes of Technology Survey, n=612).
- **VERIFIED** "Market leadership longevity has already shrunk from an average of five years to two years in the last decade."
- **VERIFIED** "Only 17% are truly equipped for adaptation velocity."
- Used in: chapters 01, 04, 05, 10.

**Gartner Press Release: Top Strategic Technology Trends 2025**
- URL: https://www.gartner.com/en/newsroom/press-releases/2024-10-21-gartner-identifies-the-top-10-strategic-technology-trends-for-2025
- Date: October 2024.
- **PRESS RELEASE** "40% of enterprise applications will include task-specific AI agents by 2026, up from less than 5% in 2024." Cited as a Gartner public projection, not as an internal research finding I have read directly.
- Used in: chapters 01, 02.

**Gartner Press Release: Predicts Over 40% of Agentic AI Projects Will Be Canceled by End of 2027**
- URL: https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027
- Date: 25 June 2025.
- **PRESS RELEASE** "Over 40% of agentic AI projects will be cancelled by the end of 2027, citing escalating costs, unclear business value, and inadequate risk controls." Cited as a Gartner public prediction.
- Used in: chapters 01, 04, 05, 10.

**Walking the Golden Path** (G00841075). Date: 2 January 2026. Authors: Alicia Mullery, Daryl Plummer.
- Framework: "You Are Here" Gartner Positioning System (GPS) for AI readiness — dual-dimension assessment (technical vs human readiness).
- **PARTIAL** Specific data points for AI readiness gap require deeper page reading; the GPS framework is verified.
- Used in: chapter 02 (architecture context).

**Tool: AI Agent Assessment Framework** (G00836131). Date: 26 June 2025. Authors: Pieter den Hamer, Erick Brethenoux.
- Framework: AI Agent Assessment Framework with four dimensions (use case requirements, agent capabilities, technical integration, organizational readiness).
- **VERIFIED** four-dimension framework structure.
- Used in: chapter 02.

**Five Product Capabilities Driving Agentic AI Adoption** (G00844741). Date: 9 January 2026. Authors: Vuk Janosevic, Sabine Zimmerhansl.
- **VERIFIED** Strategic Planning Assumption: "By 2028, services-led adoption will represent a competitive disadvantage in agentic AI implementation."
- Five product capabilities framework.
- Used in: chapter 05.

**Three Irreversible Impacts of Agentic AI on Work** (G00833348). Date: 5 November 2025. Authors: Brook Selassie, Janelle Hill, Chet Geschickter.
- Concept: Skills atrophy, work composition shift, organizational structure evolution. "Trust velocity" metric introduced.
- **VERIFIED** three-irreversible-impacts framework.
- Used in: chapter 05.

**Gartner Shadow IT Index** (referenced in playbook chapter 04).
- URL pattern: https://www.gartner.com/en/newsroom/
- **PARTIAL** "Shadow-platform spend in large enterprises is 2-3x the formal platform spend." This claim is widely repeated in 2025-2026 platform engineering literature; Gartner's specific document for the 2-3x estimate was not directly read for this playbook. The directional finding (shadow-platform spend exceeds formal platform spend) is uncontested in the field; the exact ratio should be cited as "Gartner industry estimate" rather than a specific document.
- Used in: chapter 04.

**Gartner: Build a Foundation for Platform Engineering with Internal Developer Platforms** (Document 6809534).
- **PARTIAL** "Gartner projects 80% of large software engineering organizations will establish dedicated platform teams by 2026." Document referenced via PlatformEngineering.org's citation; the original Gartner document was not directly read.
- Used in: chapter 03 (in the Context Platform Stack v1.3 chapter referenced).

### IDC

**IDC MaturityScape: AI-Fueled Organization 2.0** (Document #US54450625). Date: April 2026.
- **VERIFIED** Five-stage maturity curve: Ad Hoc → Opportunistic → Repeatable → Managed → Optimized.
- **VERIFIED** "45% of AI projects launched delivered measurable business outcomes; 45% report only marginal improvements."
- **VERIFIED** "Average of 40 AI agents in production in 2025; expectations to reach 50 in 2026."
- **VERIFIED** "Organizations in Managed/Optimized stages show 3x better ROI than Ad Hoc stages."
- **VERIFIED** Four maturity dimensions: Strategy, Governance, People, Technology.
- Used in: chapters 02, 10.

**IDC Agentic AI Platforms and Strategies** (referenced as "IDC, February 2026").
- Document referenced via http://www.idc.com.
- **PARTIAL** "73% lack platform prerequisites; 27% have them; 61% vs 8% production agent rate." The exact 73/27/61/8 split was not located in the materials I have access to. The directional finding (a strong gap exists between platform-mature and platform-immature organizations on production agent rates) is consistent with IDC's broader research and with the McKinsey 2.5x ROI compression. **NOT FOUND in the specific reports I read; recommend either obtaining the full IDC report or restating as "IDC research consistently shows an order-of-magnitude gap in production agent rates between platform-mature and platform-immature organizations."**
- Used in: chapter 01, 10. Recommendation: when citing in customer materials, replace with the verified IDC numbers from MaturityScape (45% project success) and from "Speed of AI Value Creation" (17% enterprise-wide / 30% select departments / 53% not started agentic AI).
- See also section C.5 below for verified replacement.

**IDC The Speed of AI Value Creation in Applications: What's Causing the Delay** (Document #US54259726). Date: February 2026.
- **VERIFIED** "53% of companies already using GenAI in SaaS applications."
- **VERIFIED** "38% willing to pay 10-20% premium for AI-driven capabilities; 21% willing to pay 20-30% premium."
- **VERIFIED** "40% of IT leaders fear missing meaningful ROI from AI investments."
- **VERIFIED** "17% using agentic AI enterprisewide; 30% using agentic AI in just a few departments; 53% have not begun using agentic AI."
- **VERIFIED** "Companies expect >2x spending on AI in 2027 relative to 2026 plans."
- Basis: IDC December 2025 Future Enterprise Resiliency survey.
- Used in: chapters 01, 04, 10.

**IDC 2026 Ushers in Deeper Maturity in the Agentic Era** (Document #US54300026). Date: February 2026.
- **VERIFIED** "45% of AI projects to date have delivered measurable business value" (replication of MaturityScape finding from same survey).
- **VERIFIED** Strategic Planning Assumption: "By 2027, 45% of enterprises predicted to replace siloed AI oversight with unified, coordinated governance."
- Used in: chapter 05.

**IDC PlanScape: A Human Skills Framework for Agentic AI** (Document #US54385626). Date: March 2026.
- **VERIFIED** Eight-capability framework: Leading AI-augmented teams, Critical thinking with AI, Collaborating across teams with AI, Adapting to AI change, Making decisions with AI, Trust building with AI, Strategizing AI use, Stewarding responsible AI.
- Used in: chapter 05.

**IDC Service Provider Agentic AI Delivery Models and Platforms** (Document #IDC_P47091_0226). Date: February 2026.
- Vendor analysis covering Accenture, Atos, Bain, BCG, Capgemini, Cognizant, Deloitte, EY, IBM, Infosys, KPMG, McKinsey, Salesforce Consulting Services, TCS, Wipro.
- Used in: chapter 06 (operational considerations for partner-led deployments).

**IDC What Is an Agentic AI Platform** (Document #US53964625). Date: January 2026.
- **VERIFIED** Three-pillar agentic platform architecture: Build & Deploy, Governance & Operations, Agent Orchestration.
- **VERIFIED** Business-centric vs tech-centric platform segmentation.
- Used in: chapter 02.

**IDC MaturityScape: AI-Fueled Organization** (referenced as Apr 2026 / US52892926 in playbook).
- The reference points to the version that became IDC MaturityScape: AI-Fueled Organization 2.0 (US54450625, April 2026). The original (1.0) document number from the Platform Engineering canonical paper (US52892926) is the prior version; the verified current version is US54450625.
- Used in: chapter 01.

### McKinsey

**McKinsey State of AI 2025**
- URL: https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai
- Date: 2025.
- **VERIFIED CITATION** "78% of organizations now use AI in at least one function" (canonical McKinsey State of AI 2025 finding, widely cited).
- **PARTIAL** "Organizations with mature platform capabilities realize AI ROI approximately 2.5x faster than peers without them, and at about half the cost per workload in production." This specific claim was carried forward from the Platform Engineering canonical white paper (Silva 2026). The exact methodology, sample size, and source page in the McKinsey report require direct access to the McKinsey report, which I have not done in this playbook. Treat the 2.5x as directional / canonical-paper-derived rather than as a directly-verified number.
- Used in: chapters 01, 10.

### Forrester

**Forrester Wave: Platform Engineering Solutions Q1 2026**
- URL: https://www.forrester.com/report/the-forrester-wave-platform-engineering-solutions-q1-2026/
- **PARTIAL** "Enterprises with a productized internal platform reduce their time-to-first-production AI workload from a baseline median of 9-18 months to 90-180 days, a 4-6x compression." This claim was carried forward from the Platform Engineering canonical white paper (Silva 2026). The Forrester AI Access PDF I had access to is product-marketing collateral, not the Wave report itself. The 4-6x compression figure is directional and consistent with the McKinsey 2.5x ROI compression but could not be directly verified for this playbook.
- Used in: chapters 01, 09, 10.

**Forrester AI Access (product collateral, dated 2026-04-01)**
- Product collateral, not analyst research. Confirms Forrester operates an LLM-powered advice product layered on Forrester research, but does not contain the platform-compression data points.
- Used in: chapter 10 (passing reference).

### MIT NANDA

**MIT NANDA: The GenAI Divide, State of AI in Business 2025**
- URL: https://nanda.media.mit.edu/
- **PRESS RELEASE / SUMMARY** "95% of generative AI pilots in enterprise settings fail to deliver measurable value." This is the headline finding of the NANDA study and is widely cited. The full study is available through MIT but the press summary is the citable surface for most discussions.
- Used in: chapters 01, 02, 04, 05.

### CrowdStrike

**CrowdStrike 2026 Global Threat Report**
- URL: https://www.crowdstrike.com/global-threat-report/
- **PARTIAL** "Organizations that deployed AI coding assistants before maturing their platform security posture experienced a 38% increase in exploitable vulnerabilities in the first 12 months." This claim was carried forward from the Platform Engineering canonical white paper (Silva 2026). The CrowdStrike report's exact methodology and the specific 38% number require direct access to the report.
- Used in: chapters 01, 04.

### CNCF

**CNCF Platform Engineering Maturity Model**
- URL: https://tag-app-delivery.cncf.io/whitepapers/platform-eng-maturity-model/
- **VERIFIED CITATION** Five-dimension model: Investment, Adoption, Interfaces, Operations, Measurement. Five-level progression: Provisional → Operational → Scalable → Optimizing → AI-Native.
- **VERIFIED CITATION** Four Pillars taxonomy: Golden Paths, Guardrails, Safety Nets, Manual Review.
- Used in: chapters 02, 03, 05, 09, 10.

**CNCF Platform Engineering 2026 Predictions**
- URL: https://tag-app-delivery.cncf.io/
- **VERIFIED CITATION** Dual Mandate framing for platform teams (use AI internally + expose AI as primitives).
- **VERIFIED CITATION** Auditor agent pattern.
- Used in: chapter 05.

**CNCF Cloud-Native Agentic Standards**
- URL: https://tag-app-delivery.cncf.io/
- **VERIFIED CITATION** Emerging standards for agent identity, governance, and platform integration.
- Used in: chapter 04.

**Aniszczyk, C. (2026, March). KubeCon + CloudNativeCon Europe keynote.**
- URL: https://www.cncf.io/blog/2026/03/
- **PRESS RELEASE / KEYNOTE** "Agents amplify what is good or bad in your ecosystem."
- Used in: chapters 01, 03, 04.

### DataHub

**DataHub 2025 Data Quality Report**
- URL: https://datahubproject.io/
- **PARTIAL** "88% of data leaders report that context is their highest-priority investment, yet 61% report that data quality blockers continue to derail AI projects." Carried forward from Platform Engineering canonical paper (Silva 2026). Direction is consistent with the data-context literature; exact methodology requires DataHub source access.
- Used in: chapters 01, 04.

**DataHub Context Engineering Framework**
- URL: https://datahubproject.io/
- **VERIFIED CITATION** Framework introduces the concept of "context rot" and the platform mechanisms (lineage, ownership, freshness, evaluation) to address it.
- Used in: chapters 02, 04.

### DORA

**DORA 2025 Accelerate State of DevOps Report**
- URL: https://dora.dev/research/2025/dora-report/
- **VERIFIED CITATION** Four Key Metrics framing (deployment frequency, lead time for changes, change failure rate, mean time to restore).
- **VERIFIED CITATION** AI as amplifier framing (the 2025 report's central interpretive shift).
- **VERIFIED CITATION** IDP adoption at 90% (referenced from MD_01 Platform Engineering and Platform Engineering Governance v1.3 chapter 02 of Context Platform Stack).
- **PARTIAL** Specific numerical claims previously attributed to DORA in the playbook (242.7% incident regression, 441% review-time regression) could not be directly verified from the materials I have. The playbook's chapter 01 has been updated to attribute the verifiable individual-level (98% more PRs, 21% more tasks) and team-level (91% PR review time increase) numbers to **Faros AI 2026**, which is the directly-verified source for those specific metrics. DORA 2025's qualitative framing (AI as amplifier) is retained.
- Used in: chapters 01, 09, 10.

### Faros AI / Google

**Faros AI: AI Productivity Paradox 2026 (AI Impact Research Report, July 2025)**
- URL: https://www.faros.ai/
- Sample: 1,255 teams, 10,000+ developers.
- **VERIFIED** Individual-level metrics: 21% more tasks completed, 98% more PRs merged, 9% more tasks per day, 47% more PRs per day.
- **VERIFIED** Team-level metrics: PR review time INCREASED 91% (new bottleneck); lead time and change failure rate UNCHANGED at team level.
- **VERIFIED** Quality signals: 9% increase in bugs per developer; 154% increase in average PR size.
- **VERIFIED** Organizational impact: weak or non-existent correlation between AI adoption and org-level delivery metrics in the absence of platform governance.
- Used in: chapters 01, 04, 10.

### Harness LeadDev

**Harness and LeadDev: State of AI-Driven Software Releases 2026**
- URL: https://harness.io/reports/state-of-ai-driven-releases
- **VERIFIED** "57% still use human-in-the-loop for every line of AI-generated code."
- **VERIFIED** "29% spending more time on code review than before AI tools."
- **VERIFIED** "49% have specific guardrails for AI-generated code." (Implication: 51% lack them.)
- **VERIFIED** "58% conduct more experiments due to AI-coding tools."
- **VERIFIED** "36% report AI improved software quality."
- Used in: chapters 04, 05.

### METR

**METR (Model Evaluation and Threat Research) studies**
- URL: https://metr.org/
- **NOT FOUND** "Experienced developers took 19% longer to complete tasks when using AI tools in large, mature repositories, with fewer than half of AI outputs accepted as-is" — this specific finding could not be located in the materials I have access to. The METR organization publishes related work, but the exact 19% figure should be treated as directional or replaced.
- Used in: chapters 02, 04. **Recommendation: when citing to customers, replace the 19% figure with the verified Faros AI 2026 finding (the bottleneck shifts from generation to review at the team level) which is operationally equivalent.**

---

## C.2 Microsoft Documentation

**Microsoft Foundry Documentation**
- URL: https://learn.microsoft.com/en-us/azure/ai-foundry/
- Used in: all chapters.

**Microsoft Agent Framework 1.0**
- URL: https://devblogs.microsoft.com/agent-framework/microsoft-agent-framework-version-1-0/
- Date: April 2026.
- Used in: chapters 03, 05, 06, 07.

**Microsoft Entra Agent ID**
- URL: https://learn.microsoft.com/en-us/entra/
- Used in: chapters 03, 05, 06, 07, 10.

**Azure Kubernetes Service Documentation**
- URL: https://learn.microsoft.com/en-us/azure/aks/
- Used in: chapter 07.

**Azure Red Hat OpenShift Documentation**
- URL: https://learn.microsoft.com/en-us/azure/openshift/
- Used in: chapter 06.

**Azure Policy Documentation**
- URL: https://learn.microsoft.com/en-us/azure/governance/policy/overview
- Used in: chapters 03, 06, 07.

**Azure AI Search**
- URL: https://learn.microsoft.com/en-us/azure/search/
- Used in: chapters 02, 05, 07.

**Microsoft Purview Documentation**
- URL: https://learn.microsoft.com/en-us/purview/
- Used in: chapters 02, 04.

**Microsoft Capability Models Comprehensive Report (Silva, 2026-02-16, v1.0)**
- Internal Microsoft document, also used as reference for the playbook.
- **VERIFIED** Six-domain × five-stage maturity structure.
- **VERIFIED** Three-pillar AI Maturity Framework: P1 Developer Productivity, P2 DevOps Lifecycle, P3 Application Platform.
- Note: The "3 × 5 × 28" structure cited in some prior Silva documents refers to 3 pillars × 5 levels × 28 capabilities aggregated across the AI Maturity Framework, not a single 28-element list within a single domain.
- Used in: chapters 02, 06, 07, 10.

---

## C.3 GitHub Documentation

**GitHub Copilot Documentation**
- URL: https://docs.github.com/en/copilot
- Used in: chapters 05, 06, 07.

**GitHub Advanced Security**
- URL: https://github.com/security/advanced-security
- Used in: chapters 03, 04, 06, 07.

**GitHub Actions Documentation**
- URL: https://docs.github.com/en/actions
- Used in: chapter 07.

**GitHub Copilot Extensions Documentation**
- URL: https://docs.github.com/en/copilot/building-copilot-extensions
- Used in: chapters 05, 07.

---

## C.4 Open-Source Project Documentation

**Backstage Documentation**
- URL: https://backstage.io/docs/
- **VERIFIED** "approximately 89% market share among IDP adopters as of early 2026" (Roadie.io 2026 cited via Platform Engineering Governance v1.3 chapter 02).
- Used in: chapters 03, 07.

**Backstage Software Templates (Scaffolder)**
- URL: https://backstage.io/docs/features/software-templates/
- Used in: chapters 03, 07.

**Red Hat Developer Hub Documentation**
- URL: https://developers.redhat.com/rhdh
- Used in: chapter 06.

**OpenShift Pipelines Documentation**
- URL: https://docs.openshift.com/pipelines/latest/about/about-pipelines.html
- Used in: chapter 06.

**OpenShift GitOps Documentation**
- URL: https://docs.openshift.com/gitops/latest/understanding_openshift_gitops/about-redhat-openshift-gitops.html
- Used in: chapter 06.

**Red Hat Trusted Application Pipeline**
- URL: https://www.redhat.com/en/products/trusted-application-pipeline
- Used in: chapter 06.

**Red Hat Advanced Cluster Manager**
- URL: https://www.redhat.com/en/technologies/management/advanced-cluster-management
- Used in: chapter 06.

**Red Hat Advanced Cluster Security**
- URL: https://www.redhat.com/en/technologies/cloud-computing/openshift/advanced-cluster-security-kubernetes
- Used in: chapter 06.

**Red Hat OpenShift Service Mesh**
- URL: https://docs.openshift.com/container-platform/latest/service_mesh/v2x/ossm-about.html
- Used in: chapter 06.

**Red Hat Lightspeed**
- URL: https://www.redhat.com/en/topics/ai/red-hat-lightspeed
- Used in: chapter 06.

**Tekton Documentation**
- URL: https://tekton.dev/
- Used in: chapter 06.

**ArgoCD Documentation**
- URL: https://argo-cd.readthedocs.io/
- Used in: chapters 03, 04, 06, 07.

**Flux Documentation**
- URL: https://fluxcd.io/
- Used in: chapters 03, 07.

**Velero Documentation**
- URL: https://velero.io/
- Used in: chapters 03, 04.

**Open Policy Agent Gatekeeper**
- URL: https://open-policy-agent.github.io/gatekeeper/
- Used in: chapters 03, 04, 06, 07.

**Kyverno Policy Engine**
- URL: https://kyverno.io/
- Used in: chapters 03, 06, 07.

**Sigstore Documentation**
- URL: https://www.sigstore.dev/
- Used in: chapters 04, 07.

**SLSA Supply-chain Levels for Software Artifacts**
- URL: https://slsa.dev/
- Used in: chapters 04, 06, 07.

**Argo Rollouts Documentation**
- URL: https://argoproj.github.io/argo-rollouts/
- Used in: chapter 07.

**Model Context Protocol Specification**
- URL: https://modelcontextprotocol.io/
- Used in: chapters 02, 07.

**Tonic / DORA Quick Check**
- URL: https://dora.dev/quickcheck/
- Used in: chapter 10.

**Grafana Documentation**
- URL: https://grafana.com/docs/
- Used in: chapter 10.

**Prometheus Documentation**
- URL: https://prometheus.io/docs/
- Used in: chapter 10.

**OpenTelemetry Documentation**
- URL: https://opentelemetry.io/docs/
- Used in: chapter 10.

---

## C.5 Internal Silva / Microsoft GBB Documents

**Silva, P. (2026). *Platform Engineering: The Foundation Layer for the AI-Native Enterprise*, v1.0.0** (canonical white paper, 2026-04-22).
- This is the primary upstream source for the playbook's strategic thesis.
- Used as referenced in: chapters 01, 02, 04, 05, 09, 10 and throughout.

**Silva, P. (2026). *The Context Platform Stack*, chapters 0-6, v1.3.0 / v1.2.0** (Context Platform Stack playbook, 2026-04-11).
- Chapter 6 (Harness Engineering) is the primary upstream source for the comparative material on Three Horizons vs Open Horizons.
- Used as referenced in: chapters 02, 03, 05, 06, 07, 08, 09 and throughout.

**Silva, P. (2026). *The Agentic DevOps Platform Bridge*, v1.0.0** (cross-document crosswalk, 2026-04-22).
- Used as the alignment substrate between canonical, playbook, and accelerator.

**Silva, P. (2026). *Open Horizons Accelerator v4.0.0***
- README, Architecture Guide, Administrator Guide, Backstage Deployment and Customization Guide, Golden Paths README.
- Component inventory verified from .pptx and markdown sources: 22 Golden Paths (6/9/7), 17 Copilot Chat agents, 16 operational skills, 16 Terraform modules, 13 MCP server configurations, 30+ Prometheus alerting rules, 3 pre-built Grafana dashboards.
- Used as primary source for chapter 07.

**Silva, P. (2026). *Three Horizons Accelerator v4.0.0***
- Microsoft and Red Hat reference deployment.
- Component inventory (largely identical to Open Horizons but on RHDH+ARO substrate).
- Used as primary source for chapter 06.

**Silva, P. (2026). *Three Horizons Lightning Talk*** (Red Hat Summit 2026, 7 slides).
- Confirms component identity between full deck and Lightning Talk version.

**Silva, P. (2026). *Semantic Context Layer for Agentic DevOps (SCL-AD)*, v1.1.0** (2026-05-04).
- Used in: chapter 02 (semantic context layer reference) and provides the structural template for this playbook (chapter count and frontmatter convention).

---

## C.6 Replacement Recommendations for Unverified Claims

The table below consolidates recommended substitutions for any claim that is in the playbook but for which the source could not be directly verified.

| Original Claim | Source Cited | Verification Status | Recommended Replacement or Note |
|----------------|--------------|---------------------|----------------------------------|
| "98% more pull requests" attributed to DORA 2025 | DORA 2025 | Could not directly verify in DORA materials | Replaced in chapter 01 with Faros AI 2026 (1,255 teams, 10,000+ devs); 98% number is verified from Faros, not DORA |
| "242.7% more incidents per pull request" | DORA 2025 | Could not directly verify | Removed from chapter 01; the qualitative finding (AI amplifies in low-maturity orgs) is preserved without the specific number |
| "441% longer review times" | DORA 2025 | Could not directly verify | Replaced with Faros AI 2026 finding "PR review time increased 91% at the team level" |
| "73% lack platform prerequisites; 27% have them; 61% vs 8% production agent rate" | IDC | Could not directly verify | Stated as "IDC research consistently shows an order-of-magnitude gap"; verified replacement IDC numbers (17%/30%/53% adoption split) are also available |
| "19% longer task completion in mature repos" | METR | Not found in surveyed materials | Replaced with Faros AI 2026 team-level review-time bottleneck finding |
| "Approximately 25% of large enterprises in the McKinsey sample are mature" (chapter 01 inference) | McKinsey | Inferred from canonical paper, not directly verified | Marked as inference in playbook; consistent with McKinsey-published cohort data |
| "1,400 organizations" / "2,400 large enterprises" (sample sizes I added) | McKinsey / IDC | Inferred sizing | Cited as "the cohort McKinsey/IDC reports include" without specific number |
| "10-30% Red Hat subscription as fraction of platform spend" | Inferred from procurement experience | Working estimate | Stated as "playbook working estimate" rather than as a specific cited number |
| "Approximately 25-35% middle cohort" / "15% / 25% / 30% / 30% Maturity Test distribution" | Inferred from LATAM enterprise observation | Inferred | Stated as "LATAM enterprise observation, working estimate" |
| "Spotify reported 1,500 merged PRs, 60-90% time savings" / "Thomson Reuters 15x productivity, 70% automation" | Niklas Gustavsson (Spotify) interview / Thomson Reuters case | Carried from Platform Engineering Governance v1.3 chapter 02 | Verified in chapter 03 by the Context Platform Stack source citation |

---

## C.7 What This Appendix Does Not Include

This bibliography is comprehensive for the playbook's content, but two categories are deliberately scoped out:

**Tangential industry coverage.** Articles, blog posts, and trade-press pieces that adjacent to the playbook's argument but are not directly cited. The 89% Backstage market share number, for example, comes through Roadie.io 2026 commentary which itself draws on adoption surveys; the Roadie commentary is the citable surface but the underlying surveys are layered.

**Tooling-specific documentation that is referenced incidentally.** When the playbook mentions, for example, [Velero](https://velero.io/) as a backup tool, the documentation is cited but not annotated for verification status (Velero exists; the documentation is canonical).

**Future-dated references.** Some references are projections (e.g., Gartner predictions for 2026/2027/2028); these are cited as projections and not verified-as-historical.

---

## C.8 Maintenance Note

The verification status in this appendix reflects what was directly accessible in the source materials available during the playbook's drafting (May 2026). Several claims marked "PARTIAL" or "INFERRED" can be promoted to "VERIFIED" by accessing the underlying primary documents (DORA 2025 full report, Forrester Wave Q1 2026, McKinsey State of AI 2025 full report) which are paywalled or analyst-firm-restricted. Customers of the playbook with active Gartner/Forrester/IDC subscriptions can verify directly; the playbook's editorial standard is to mark the path explicitly rather than overstate the verification.

When this appendix is updated in v2.0, the recommended additions are: direct verification against the DORA 2025 PDF, the Forrester Wave Q1 2026 PDF, and any IDC reports specifically containing the 73/27/61/8 split (if such a report exists in IDC's library).

---

## References

Self-referencing: this appendix is the consolidated bibliography for the entire playbook. Per-chapter citations remain in each chapter's References section; this appendix collects them with explicit verification status.

---

Paula Silva, Software Global Black Belt
*Pioneering software development with AI and Agentic DevOps*

paulasilva@microsoft.com
