---
title: "Appendix D: Verified Research Data Points"
description: "Curated, verified data points from peer-reviewed and arXiv research published 2025-2026, organized by platform engineering theme. Every entry has full citation, sample size, methodology, and the specific finding suitable for citation in customer materials."
author: "Paula Silva"
role: "Software Global Black Belt"
contact: "paulasilva@microsoft.com"
date: "2026-05-05"
version: "1.0.0"
status: "draft"
locale: "en"
brand: "Agentic DevOps"
tags: [research-data-points, arxiv, verified, ai-coding-agents, context-engineering, platform-governance, multi-agent, evaluation]
---

# Appendix D: Verified Research Data Points

> **Purpose.** This appendix consolidates the empirical findings the playbook leans on, drawn from peer-reviewed papers and arXiv preprints published in 2025-2026. Each entry includes full citation, sample size, methodology, the specific verified finding, and the chapter where the finding is referenced. The appendix is engineered to be quotable directly: every metric here is suitable for customer-facing materials with the citation as given.

---

## D.1 Code Review Agents and Human-in-the-Loop

### D.1.1 The CRA Effectiveness Gap

**Citation:** Chowdhury, K., Banik, D., Ferdous, K.M., & Shamim, S.I. (2026). "From Industry Claims to Empirical Reality: An Empirical Study of Code Review Agents in Pull Requests." *Proceedings of the 23rd International Conference on Mining Software Repositories (MSR '26)*, Rio de Janeiro, Brazil. arXiv:2604.03196. DOI: https://doi.org/10.1145/3793302.3793614

**Sample:** 19,450 pull requests across hundreds of repositories. 3,109 unique commented-state PRs. 98 closed CRA-only PRs (subset analyzed for signal quality). 13 unique code review agents.

**Methodology:** Empirical analysis of GitHub PRs, comparing merge rates, review signal quality (categorical scoring), and abandonment rates between CRA-only, human-only, and mixed-review conditions.

**Verified findings:**

- **CRA-only merge rate: 45.20%** (281 PRs analyzed in the CRA-only cohort).
- **Human-only merge rate: 68.37%** (1,176 PRs in the human-only cohort).
- **Delta: 23.17 percentage points** lower for CRA-only review.
- **CRA-only abandonment rate: 34.88%** vs **human-only 21.60%**.
- **Signal quality distribution: 60.2% of closed CRA-only PRs have signal ratios in the 0-30% range** (i.e., low-actionability feedback).
- **Of 13 CRAs studied, 12 (92.31%) exhibit average signal ratios below 60%.**

**Used in playbook:** chapter 04 (Failure Modes — Cognitive Overload on Reviewers), chapter 03 (Manual Review pillar discussion).

**Operational implication:** Code Review Agents alone reduce merge rates by 23 percentage points compared to human review, driven by low signal-to-noise in the agent-generated feedback. Platform discipline: never use CRA as a sole review gate; pair CRA with human review and treat CRA as the first pass that increases throughput, not as a replacement.

---

### D.1.2 Human-AI Synergy in Code Review

**Citation:** Queen's University research team (2026). "Human-AI Synergy in Agentic Code Review." arXiv:2603.15911.

**Sample:** 278,790 review conversations across 300 GitHub projects.

**Verified findings:**

- AI comments average **29.6 tokens per line of code**.
- Human comments average **4.1 tokens per line of code**.
- Humans exchange **11.8% more review rounds** when reviewing AI-generated code.
- AI reviewers focus on code improvement and defect detection.
- Human reviewers add understanding, testing guidance, and knowledge transfer.

**Used in playbook:** chapter 03 (Manual Review pillar), chapter 04 (Cognitive Overload).

**Operational implication:** AI and human reviewers contribute complementary value; they are not interchangeable. The platform's review workflow should sequence them deliberately: AI for first-pass (defects, security, code quality), human for second-pass (intent alignment, knowledge transfer, understanding).

---

## D.2 AI Coding Agent Failure Modes

### D.2.1 Where AI Coding Agents Fail

**Citation:** Ehsani, R., Pathak, S., Rawal, S., Mujahid, A.A., Imran, M.M., & Chatterjee, P. (2026). "Where Do AI Coding Agents Fail? An Empirical Study of Failed Agentic Pull Requests in GitHub." *Proceedings of MSR 2026*, Rio de Janeiro, Brazil. arXiv:2601.15195.

**Sample:** 33,596 agentic PRs across 5 coding agents (Aider, Devin, GitHub Copilot, Cursor, Claude Code). 600 PRs qualitatively analyzed.

**Verified findings:**

- **Total dataset:** 33,596 agent-authored PRs analyzed.
- **Agent merge rates by task type:**
  - Documentation: ~84%
  - CI/Build updates: 75-94%
  - Bug fixes: 64%
  - Performance improvements: 55%
- **Agent merge rates per agent:** Codex ~82.59%; Cursor ~65.22%; Copilot ~43.04%.
- **Rejection taxonomy (600 PRs analyzed):**
  - Reviewer abandonment: 228 PRs (38%) — **most frequent rejection reason**
  - Duplicate PRs: 142 PRs (23%)
  - CI/test failures: 99 PRs (17%)
  - Unwanted features: 24 PRs (4%)
  - Incomplete implementations: 15 PRs (2%)

**Used in playbook:** chapters 03, 04, 09.

**Operational implication:** Agent failures concentrate at human-agent handoff points (38% reviewer abandonment), not at code generation. The platform must provide explicit mechanisms for human callbacks, ambiguity escalation, and atomic-PR enforcement. PR-size limits and clear PR descriptions are not nice-to-have; they are the single most-effective lever to reduce reviewer abandonment.

---

### D.2.2 Code Quality Beyond Merge Rate

**Citation:** University of Saskatchewan research team (2026). "Beyond Bug Fixes: Code Quality After Agentic Merges." arXiv:2601.20109.

**Sample:** 1,210 merged agent-generated bug-fix PRs analyzed via SonarQube.

**Verified findings:**

- Code smells dominate at critical and major severity levels in agent-merged PRs.
- The Cursor agent generated **331 total issues across its merged PRs**, averaging **8.3 issues per PR**.
- **Merge rate is not a quality proxy** (a key paper-level claim).

**Used in playbook:** chapter 04 (Failure Modes — Vibe-Coding Trap).

**Operational implication:** Platform teams that gate on "did it merge?" are measuring the wrong thing. Mandatory post-merge quality gates (SonarQube or equivalent) are essential. Agent-generated code that merges does not automatically meet quality bars; the platform must enforce post-merge quality continuously.

---

## D.3 Context Engineering and AGENTS.md

### D.3.1 AGENTS.md Efficiency Impact

**Citation:** Lulla et al. (2026). "On the Impact of AGENTS.md Files on the Efficiency of [Coding Agents]." arXiv:2601.20404. ICSE JAWs.

**Sample:** Longitudinal measurement of wall-clock execution time and token consumption across agent invocations with and without curated AGENTS.md.

**Verified findings:**

- **Median runtime reduction with human-curated AGENTS.md: 28.64%**.
- **Median output token reduction with human-curated AGENTS.md: 16.58%**.
- **Mean runtime reduction: 20.27%**.
- **Mean output token reduction: 20.08%**.
- LLM-generated AGENTS.md files do not consistently produce gains; human-curation is the active ingredient.

**Used in playbook:** chapters 02, 03 (Context engineering and Golden Paths).

**Operational implication:** Human-curated AGENTS.md is one of the highest-ROI investments in agent infrastructure. The 28.64% runtime reduction and 16.58% token cost reduction translate directly to cost savings at scale. The platform should make AGENTS.md authoring a Golden Path with templates, conventions, and continuous improvement cycles.

---

### D.3.2 Agent Context File Empirical Characteristics

**Citation:** Chatlatanagulchai, W., Li, H., Kashiwa, Y., Reid, B., Thonglek, K., Leelaprute, P., Rungsawang, A., Manaskasemsak, B., Adams, B., Hassan, A.E., & Iida, H. (2025). "Agent READMEs: An Empirical Study of Context Files for Agentic Coding." *ACM Transactions on Software Engineering and Methodology* (preprint). arXiv:2511.12884.

**Sample:** 2,303 agent context files from 1,925 repositories. Content analysis of 16 instruction types.

**Verified findings:**

- **Context file prevalence:** 2,303 files across 1,925 repos.
- **Functional context (developer priority):**
  - Build/run commands: 62.3% of files
  - Implementation details: 69.9% of files
  - Architecture documentation: 67.7% of files
- **Non-functional context (safety-related, dramatic gap):**
  - Security requirements: 14.5% of files
  - Performance constraints: 14.5% of files
- Context files evolve through frequent, small additions (configuration-code-like evolution).

**Used in playbook:** chapter 02 (Context layer), chapter 04 (Failure Modes).

**Operational implication:** Organizations specify what to build (functional) in 62-70% of context files but how to build safely (non-functional) in only 14.5%. This 5x specification gap is the security regression's structural cause. Platform discipline: AGENTS.md templates must include security and performance specification sections by default.

---

### D.3.3 Codified Context Infrastructure at Scale

**Citation:** Vasilopoulos, A. (2026). "Codified Context: Infrastructure for AI Agents in a Complex Codebase." arXiv:2602.20478. Independent publication with open-source framework.

**Sample:** 108,000-line C# distributed system. 283 development sessions. 2,801 human prompts. 1,197 agent invocations. 16,522 agent turns.

**Verified findings:**

- **Three-component context architecture:**
  1. Hot-memory constitution (always-loaded conventions)
  2. **19 domain-expert agents** (specialized knowledge)
  3. Cold-memory knowledge base (**34 on-demand specification documents**)
- **Single-file manifests do not scale beyond ~1,000 lines of codebase.**
- Context propagates across development sessions to prevent repeated failures.
- Session interaction tracked across 2,801 prompts → 1,197 agent invocations → 16,522 agent turns.

**Used in playbook:** chapter 02 (Context layer), chapter 03 (Golden Paths).

**Operational implication:** Enterprise-scale agentic development requires tiered context architecture (hot/cold memory separation), not single manifest files. The platform's Context layer must support multi-tier context with on-demand retrieval. This is the architectural answer to the AGENTS.md scaling limitation.

---

### D.3.4 Agentic Context Engineering (ACE Framework)

**Citation:** Zhang, Q., Hu, C., Upasani, S., Ma, B., Hong, F., Kamanuru, V., Rainton, J., Wu, C., Ji, M., Li, H., Thakker, U., Zou, J., & Olukotun, K. (2026). "Agentic Context Engineering: Evolving Contexts for Self-Improving Language Models." *Published as a conference paper at ICLR 2026*. arXiv:2510.04618.

**Verified findings:**

- **Performance gains: +10.6% on agent benchmarks, +8.6% on finance domain knowledge** through structured ACE pipeline.
- **Framework pattern:** Generation → Reflection → Curation → Accumulation.
- ACE matches top-ranked production agent performance even when using a smaller open-source model.
- **Identified failure modes that ACE prevents:** "context collapse" (iterative rewriting erodes details) and "brevity bias" (compression drops domain insights).

**Used in playbook:** chapters 02, 04.

**Operational implication:** Contexts must evolve through structured reflection and curation cycles, not by iterative rewriting or compression. The platform should provide context-versioning primitives that preserve detail rather than compress.

---

### D.3.5 Planner-Coder Gap as Multi-Agent Bottleneck

**Citation:** From the same Zhang, Q., et al. (2026) ACE paper, ICLR 2026, arXiv:2510.04618. (Cross-cited with planner-coder gap research at arXiv:2510.10460.)

**Verified findings:**

- **75.3% of multi-agent failures originate at the planner-coder interface.**
- Performance degradation: Multi-Agent Systems fail to solve **7.9% to 83.3% of problems** under semantic-preserving input transformations.
- Root cause: Information loss in multi-stage transformation across agent handoffs.
- **Repair mechanism:** Monitor agents bridge the gap, fixing **40.0% to 88.9% of identified failures**.
- Long-term impact: detected failures decrease by **up to 85.7%** on repaired systems.

**Used in playbook:** chapter 04 (Failure Modes), chapter 06 (Multi-agent orchestration).

**Operational implication:** Three-quarters of multi-agent failures stem from agent-to-agent handoff information loss. The platform's multi-agent orchestration pattern (Planner / Generator / Evaluator) must include explicit context-bridging mechanisms and monitor agents that observe handoffs.

---

## D.4 Spec-Driven and Constitutional Development

### D.4.1 Constitutional Spec-Driven Development

**Citation:** Marri, S.R. (2026, January). "Constitutional Spec-Driven Development: Enforcing Security by Construction in AI-Assisted Code Generation." Preprint. arXiv:2602.02584.

**Sample:** Banking microservices with 10 critical CWE vulnerabilities.

**Verified findings:**

- **Security defect reduction: 73%** vs unconstrained AI generation.
- **Developer velocity: maintained** (no slowdown from constitutional constraints).
- **Full traceability: every security principle mapped to specific code locations.**
- Constitutional constraints derived from CWE/MITRE security frameworks.

**Used in playbook:** chapters 03 (Guardrails), 04 (Security Regression), 06 (Three Horizons supply-chain), 07 (Open Horizons supply-chain).

**Operational implication:** Embedding security at the specification layer (CONSTITUTION.md + machine-readable constraints) reduces security defects by 73% without slowing development. This is the empirical answer to the CrowdStrike 38% security regression: prevention at specification time, not detection at deployment time.

---

### D.4.2 Agentic Software Engineering: Foundational Pillars

**Citation:** Hassan, A.E., Li, H., Lin, D., Adams, B., Chen, T.-H., Kashiwa, Y., & Qiu, D. (2025). "Agentic Software Engineering: Foundational Pillars and a Research Roadmap." Preprint. arXiv:2509.06216.

**Verified findings:**

- **Dual modality framework:** "SE for Humans" and "SE for Agents" require distinct workbenches.
- **Agent Command Environment (ACE):** Human orchestration, oversight, management of Merge-Readiness Packs (MRPs) and Consultation Request Packs (CRPs).
- **Agent Execution Environment (AEE):** Agent execution with human-callback capability for complex trade-offs.
- **Structured Agentic Software Engineering (SASE):** Bi-directional partnership process model.

**Used in playbook:** chapters 02 (Pyramid), 05 (Dual Mandate).

**Operational implication:** The platform must support not just agent code generation but orchestrated agent teams with human oversight, human-initiated callbacks, and structured decision handoff protocols. The Manual Review pillar is operationalized through the SASE framework.

---

## D.5 Triple Debt and Cognitive / Intent Layers

### D.5.1 Triple Debt Framework

**Citation:** Storey, M.-A. (2026). "From Technical Debt to Cognitive and Intent Debt: Rethinking Software Health in the Age of AI." Preprint. arXiv:2603.22106.

**Verified findings:**

- **Three interacting debt types:**
  1. **Technical debt:** Problems in the code layer (messy code, architectural shortcuts).
  2. **Cognitive debt:** Erosion of shared understanding across the team over time.
  3. **Intent debt:** Lack of externalized goals, constraints, and rationale.
- **Key insight:** AI acceleration may reduce technical debt while simultaneously accelerating accumulation of cognitive and intent debt. Developers lack time to develop the understanding that would save them time (paradoxical effect).

**Used in playbook:** chapter 04 (Triple Debt section).

**Operational implication:** The Context layer (codified knowledge) and Intent layer (codified goals and policies) of the AI-Native Enterprise Pyramid are the platform mechanisms that prevent cognitive and intent debt from compounding. Without them, AI's technical-debt reduction is offset by cognitive-and-intent-debt growth.

---

## D.6 Productivity and Organizational Impact

### D.6.1 Faros AI Productivity Paradox

**Citation:** Faros AI. (2025-2026). "AI Productivity Paradox: Executive Summary." AI Impact Research Report, July 2025. https://www.faros.ai/

**Sample:** 1,255 teams, 10,000+ developers across multiple organizations.

**Verified findings:**

**Individual (developer) level:**
- Task completion: **21% more tasks completed**.
- PR merge rate: **98% more pull requests merged**.
- Activity: **9% more tasks per day, 47% more PRs per day**.

**Team level (no organizational benefit):**
- Lead time: **unchanged**.
- Change failure rate: **unchanged**.
- **PR review time INCREASED 91%** (the new bottleneck).
- Quality signals (mixed): 9% increase in bugs per developer; **154% increase in average PR size**.

**Organizational (company) level:**
- Delivery metrics: weak or non-existent correlation with AI adoption in the absence of platform governance.
- Root causes: uneven adoption, workflow bottlenecks, fragmented tooling, lack of coordinated enablement.

**Used in playbook:** chapters 01, 04, 10.

**Operational implication:** Individual AI productivity gains do not scale to organizational impact without platform coordination. The bottleneck shifts from code generation to code review, with PR review time increasing 91% at the team level. The platform's investment in Manual Review automation and atomic-PR enforcement is the structural answer.

---

### D.6.2 Harness LeadDev: State of AI-Driven Software Releases 2026

**Citation:** Harness and LeadDev. (2026). "State of AI-Driven Software Releases 2026 Report." https://harness.io/reports/state-of-ai-driven-releases

**Verified findings:**

- **57%** still use human-in-the-loop for every line of AI-generated code.
- **29%** spending more time on code review than before AI tools.
- **49%** have specific guardrails for AI-generated code (i.e., **51% lack them**).
- **58%** conduct more experiments due to AI-coding tools.
- **36%** report AI improved software quality.

**Used in playbook:** chapters 04, 05.

**Operational implication:** A majority of organizations (51%) lack automated guardrails for AI-generated code, and a majority (57%) require human review for every line. This is the empirical signature of the platform-immaturity gap. Investment in automated guardrails and atomic-PR enforcement is the highest-leverage move to escape this state.

---

## D.7 Test-Driven and Quality Engineering

### D.7.1 LLM-Based TDD

**Citation:** Various (2024-2026). Selected papers including:
- arXiv:2402.13521 — "Test-Driven Development for LLM Code Generation."
- arXiv:2312.04687 — "LLM4TDD: Best Practices for Test-Driven Development with LLMs."
- arXiv:2404.10100 — "LLM-Based Test-Driven Interactive Code Generation."
- arXiv:2505.09027 — "Tests as Prompt: TDD Benchmark for LLM WebApp1k."

**Verified findings (synthesized across papers):**

- TDD with LLMs significantly reduces error rates compared to direct generation.
- LLM-generated tests can be a strong specification surface for downstream code generation.
- Benchmarks consistently show TDD prompting outperforms unconstrained generation.

**Used in playbook:** chapter 03 (Safety Nets — sensors), chapter 04 (vibe-coding remediation).

---

### D.7.2 Testing AI Agents Empirically

**Citation:** Research team (2026). "Testing with AI Agents: An Empirical Study of Test Generation." arXiv:2603.13724.

**Used in playbook:** chapter 10 (Evaluation pipelines).

---

## D.8 Vibe Coding vs Agentic Coding

### D.8.1 Professional Developers Don't Vibe

**Citation:** Research team (2025). "Professional Developers Don't Vibe — They Control AI Agents." arXiv:2512.14012.

**Used in playbook:** chapter 04 (Vibe-Coding Trap section).

---

### D.8.2 Vibe Coding vs Agentic Coding Fundamentals

**Citation:** Research team (2025). "Vibe Coding vs Agentic Coding Fundamentals." arXiv:2505.09027.

**Used in playbook:** chapter 04.

**Operational implication:** The vibe-coding pattern (developer asks agent to "just do X" without specifying intent) is empirically associated with lower-quality outputs. The platform's discipline (Spec-Driven Development, atomic PRs, evaluation pipelines) is the structural countermeasure.

---

## D.9 Agentic Software Engineering: Multi-Agent Patterns

### D.9.1 LLM-Based Multi-Agent Systems for Software Engineering

**Citation:** Research team (2024). "LLM-Based Multi-Agent Systems for Software Engineering." arXiv:2404.04834.

**Used in playbook:** chapter 02, chapter 06 (multi-agent system Golden Path).

---

### D.9.2 Multi-Agent LLM Orchestration for Incident Response

**Citation:** Research team (2025). "Multi-Agent LLM Orchestration for Incident Response." arXiv:2511.15755.

**Used in playbook:** chapter 03 (Safety Nets), chapter 05 (Mandate A — sre-agent-integration).

---

### D.9.3 Context Engineering for Multi-Agent LLM Code Assistants

**Citation:** Research team (2025). "Context Engineering for Multi-Agent LLM Code Assistants." arXiv:2508.08322.

**Used in playbook:** chapter 02 (Context layer), chapter 06 (multi-agent orchestration in Three Horizons).

---

## D.10 Security and Quality of LLM-Generated Code

### D.10.1 Security and Quality Empirical Study

**Citation:** Research team (2025). "Security and Quality in LLM-Generated Code: Empirical Study." arXiv:2502.01853.

**Used in playbook:** chapter 04 (Security Regression).

**Operational implication:** Independently verifies the CrowdStrike directional finding: LLM-generated code, absent platform-level enforcement, exhibits security and quality regressions consistent with the patterns the playbook's Guardrails pillar is engineered to prevent.

---

## D.11 Aggregate Citation Patterns

The 12 highest-leverage research findings, ordered by their direct utility in the playbook's argument:

1. **Faros AI 2026** — 21% individual gains; 91% team-level review-time bottleneck; 1,255 teams. *Chapter 01, 04, 10.*
2. **Lulla et al. 2026 (AGENTS.md)** — 28.64% runtime / 16.58% token reduction with human-curated context. *Chapter 02, 03.*
3. **Chowdhury et al. 2026 (CRA)** — 45.20% vs 68.37% merge rate; 23pp gap; 19,450 PRs. *Chapter 03, 04.*
4. **Ehsani et al. 2026 (Agent Failures)** — 38% reviewer abandonment as primary failure; 33,596 PRs. *Chapter 04, 09.*
5. **Marri 2026 (Constitutional SDD)** — 73% security defect reduction. *Chapter 03, 04, 06, 07.*
6. **Storey 2026 (Triple Debt)** — Technical / Cognitive / Intent debt taxonomy. *Chapter 04.*
7. **Zhang et al. 2026 (Planner-Coder Gap, ACE)** — 75.3% of multi-agent failures at handoff; ACE +10.6% gains. *Chapter 02, 04.*
8. **Vasilopoulos 2026 (Codified Context)** — 108K-line C# system, 19 domain agents, 34 spec docs; tiered architecture. *Chapter 02, 03.*
9. **Chatlatanagulchai et al. 2025 (Agent READMEs)** — 14.5% security spec coverage in agent context files. *Chapter 02, 04.*
10. **Saskatchewan 2026 (SonarQube)** — Cursor 331 issues / 8.3 per PR; merge rate is not quality. *Chapter 04.*
11. **Hassan et al. 2025 (SE 3.0 / SASE)** — Dual workbench architecture (ACE/AEE). *Chapter 02, 05.*
12. **Harness LeadDev 2026** — 51% lack guardrails for AI-generated code. *Chapter 04, 05.*

---

## D.12 What This Appendix Does Not Cover

- **DORA 2025 specific numbers** beyond the conceptual framing. The DORA Four Keys taxonomy and the AI-as-amplifier framing are verified; specific percentages from the DORA 2025 report are not included here because direct verification was not performed.
- **Gartner-restricted research** beyond the press releases and the Predicts 2026 document directly read. Gartner subscribers can verify numbers cited as "Gartner press release" against internal documents directly.
- **IDC-restricted research** beyond the seven reports surveyed for this playbook. IDC subscribers can verify the 73/27/61/8 split against IDC's full library.
- **Industry-specific case studies** (Spotify, Thomson Reuters, etc.) which are referenced via Niklas Gustavsson interviews and similar; these are anecdotal evidence, not primary research.

---

## D.13 Recommendation for Customer Materials

When citing data points from this appendix in customer-facing materials:

1. **Always include the citation** (author, year, arXiv ID or DOI).
2. **State the sample size** when it materially affects the argument's force.
3. **Distinguish individual / team / organizational findings** — the Faros study is the cleanest example of how mixing these levels produces wrong conclusions.
4. **Prefer 2026 research over 2024-2025** for the operational current-state claims; the field has moved fast.
5. **For LATAM-specific implications**, note that most of these studies use US/EU samples; the directional findings are robust, but quantitative magnitudes may differ.

---

## References

- Each entry in this appendix is itself a primary citation; the appendix's bibliography is the union of the entries.
- For non-research (industry / vendor) sources, see Appendix C: Consolidated Bibliography.

---

Paula Silva, Software Global Black Belt
*Pioneering software development with AI and Agentic DevOps*

paulasilva@microsoft.com
