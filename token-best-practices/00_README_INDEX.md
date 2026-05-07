---
title: "Token Management & Agent Design · Playbook v2.0.0"
description: "Comprehensive modular playbook on token management, agent design, and the GitHub Copilot transition to token-based billing in June 2026"
author: "Paula Silva"
role: "Software Global Black Belt"
contact: "paulasilva@microsoft.com"
date: "2026-05-04"
version: "2.0.0"
status: "approved"
language: "en"
audience: "Microsoft Latin America customers · Enterprise architects · FinOps · Engineering leaders"
tags: ["github-copilot", "token-billing", "agent-design", "context-engineering", "finops-ai", "vs-code", "azure-ai-foundry"]
---

# Token Management & Agent Design

> Comprehensive modular playbook for the era of token-based billing. How to treat tokens as a finite resource, architect agents with discipline, and instrument governance at scale. For Microsoft Latin America customers.

## Change Log

| Version | Date       | Author      | Changes                                                                  |
|---------|------------|-------------|--------------------------------------------------------------------------|
| 1.0.0   | 2026-05-04 | Paula Silva | Initial playbook (single document, ~13K words)                            |
| 2.0.0   | 2026-05-04 | Paula Silva | Modular restructure into 13 chapters + 4 appendices. Added practical content: VS Code, GitHub Enterprise, Actions/CI, Azure AI Foundry, Redis cache, MCP servers, custom agents. ~50K words total. |

---

## The fact

On **June 1, 2026**, GitHub Copilot stops charging per request. Premium Request Units (PRUs) are retired. **GitHub AI Credits** take over. 1 AI Credit = US$ 0.01. Input, output, and cached tokens are accounted for at the published API rate of each model.

This change is documented in the [GitHub Blog · Pricing transition](https://github.blog/changelog/) and was announced by [Mario Rodriguez, GitHub CPO, in April 2026](https://github.blog/news-insights/product-news/).

The difference is structural: under PRUs, cost was per user **intent**. Under tokens, cost is per **work performed** by the model. A 4-hour agentic session refactoring 50 files is genuinely 100x more expensive than a single chat question. The billing model now reflects this.

## The thesis of this playbook

Token-based billing rewards disciplined engineering. Teams that treat tokens as a finite resource, apply **context engineering**, architect agents with the right pattern, and instrument observability will pay between **30% and 70% less** than teams that use Copilot as a black box.

The difference between the two groups is not talent. It is practice.

## The numbers that justify the effort

For an organization with **500 developers on GitHub Copilot Business**:

- **Current baseline**: US$ 19/dev × 500 = **US$ 9,500/month**
- **Historical overage under PRUs**: typically +30%, leading to US$ 12,350/month
- **Without discipline post-June**: average overage observed in pilots reaches +50-100%
- **With this playbook applied**: **25-45% reduction over baseline** achievable in 60-90 days
- **Effort payback**: typically less than 60 days

In enterprise organizations with 5,000+ developers, annual savings exceed **US$ 1 million**. The difference between the team that pays the implicit subsidy that was in the PRU and the team that captures the real value of the product **is not talent. It is applied discipline.**

---

## How to use this playbook

This is a **modular playbook**. Each chapter is an independent file that can be read in isolation but makes more sense in the complete sequence. You can:

1. **Read in complete order** (recommended for architects, tech leads, FinOps in first pass)
2. **Skip to the relevant chapter** using the persona map below
3. **Use as operational reference** marking specific chapters for recurring consultation

### Reading map by persona

| Persona                        | Priority chapters                                       | Estimated time |
|--------------------------------|---------------------------------------------------------|----------------|
| **CIO / VP Engineering**       | Index, 03, 08, 09, 10                                   | 60-90 min      |
| **CFO / FinOps**               | Index, 08, 09, 10, Appendix C                           | 90 min         |
| **Tech Lead / Staff Engineer** | 01, 02, 03, 04, 05, 06, 07, 12, 13                      | 4-6 hours      |
| **Developer**                  | 03, 04, 05, 07, 12, Appendix A                          | 3-4 hours      |
| **Platform Engineer**          | All, with focus on 06, 07, 10, 11, 12                   | 1 day          |
| **Azure Architect**            | 03, 04, 05, 10, 11, 12                                  | 4 hours        |
| **MCP server developer**       | 04, 06, 07, 12 (pattern 7), Appendix D                  | 2 hours        |

---

## Chapter index

### Part I · Foundations

**[01 · Token fundamentals](./01_token_fundamentals.md)**
What a token is, BPE/WordPiece/Unigram, why tokens and not words, input/output/cached, how tokens become money.

**[02 · Anatomy of consumption](./02_consumption_anatomy.md)**
Input-processing-output cycle, empirical distribution in real workflows (Tokenomics), the agentic multiplier and its math.

**[03 · Models and multipliers](./03_models_multipliers.md)**
Model families (OpenAI, Anthropic, Google, xAI), complete pricing table, model decision per task, VS Code configuration, GitHub Enterprise org policies, model routing implementation.

### Part II · Technical disciplines

**[04 · Context engineering](./04_context_engineering.md)**
Context rot, compaction, tool result clearing, persistent memory vs context window, subagents, custom agents, AGENTS.md and copilot-instructions.md per project.

**[05 · Prompt caching](./05_prompt_caching.md)**
Prefix cache mechanics, TTLs, anti-patterns, implementation in Anthropic API (Python and Node), external Redis, semantic cache, cache in CI/Actions, cache in VS Code Copilot.

**[06 · Agent design](./06_agent_design.md)**
Workflow vs agent, augmented LLM, the five Anthropic patterns, when NOT to use agents, custom agents in VS Code, GitHub Coding Agent, MCP servers, hooks.

**[07 · Token-efficient strategies](./07_token_efficient_strategies.md)**
Less-is-more, progressive disclosure, lean tool design, evaluator-optimizer with stop, complexity-based routing, custom prompts in .github/prompts/, applyTo patterns.

### Part III · The change and migration

**[08 · GitHub Copilot · The June 2026 change](./08_github_copilot_june_change.md)**
What changes exactly, GitHub AI Credits explained, annual multipliers, why now, impacts by persona, how to enable paid usage policy.

**[09 · Migration · strategy, calendar, and decisions](./09_migration_strategy.md)**
Critical timeline, Pro/Pro+ annual decision (3 paths), CIO playbook in 4 phases, bill preview interpretation, internal communication, structured training.

### Part IV · Governance and operations

**[10 · FinOps for AI](./10_finops_ai.md)**
Inform/Optimize/Operate, key metrics, showback and chargeback, budgets/alerts/anomaly detection, observability with OpenTelemetry, FOCUS export, FinOps Hub, Power BI, Application Insights, Grafana.

**[11 · Azure AI Foundry in the ecosystem](./11_azure_ai_foundry.md)**
Foundry vs Copilot vs direct API, model catalog, prompt flow, content safety, PTU vs PAYG, governance with AAD/RBAC, decision on when to use each platform.

### Part V · Practical application

**[12 · Applied optimization patterns](./12_applied_optimization_patterns.md)**
8 patterns with full code: dynamic routing, hierarchical cache, subagent fan-out, plan/execution mode, semantic cache, tool composition, lean MCP design, custom agent SDD.

**[13 · Anti-patterns and decision frameworks](./13_anti_patterns_decision.md)**
10 cataloged anti-patterns, 3 decision frameworks (model, agent vs workflow, optimization order), complete operational checklist in 4 phases.

### Appendices

**[A · Optimized prompts](./A_appendix_optimized_prompts.md)**
Ready-to-use templates of system prompts, tool definitions, custom prompts in .github/prompts/.

**[B · Pricing reference card](./B_appendix_pricing_reference.md)**
Complete pricing table by model, PRU to AI Credits converter, per-session cost calculator.

**[C · FinOps report templates](./C_appendix_finops_reports.md)**
Weekly and monthly report templates, Power BI dashboards, KQL queries for Application Insights, Grafana JSON.

**[D · Complete code](./D_appendix_complete_code.md)**
Complete Model router class, cache helpers, telemetry instrumentation, token-efficient MCP server template.

---

## Glossary

Core technical terms used throughout the playbook. For each term, there is a cross-reference to the chapter where it is discussed in depth.

| Term                       | Quick definition                                                                                          | Chapter |
|----------------------------|-----------------------------------------------------------------------------------------------------------|---------|
| **AGENTS.md**              | File at the root of the repository with persistent instructions for code agents.                          | 04, 06  |
| **AI Credits**             | Internal currency of GitHub Copilot post-June. 1 Credit = US$ 0.01.                                       | 08      |
| **Anti-pattern**           | Recurring pattern that seems good but degrades cost, quality, or both.                                    | 13      |
| **BPE**                    | Byte Pair Encoding. Sub-word tokenization algorithm used by GPT, Claude, Mistral.                         | 01      |
| **Cache hit / miss**       | Hit: prefix found in cache, cost 0.1x input. Miss: cache write needed, cost 1.25x or 2x input.            | 05      |
| **Compaction**             | Structured compression of session history by the model itself, reducing tokens by 22-57%.                 | 04      |
| **Context engineering**    | Discipline of selecting the smallest set of high-signal tokens that maximizes the probability of the result. | 04   |
| **Context rot**            | Quality degradation when adding irrelevant tokens. Concave curve with peak.                                | 04      |
| **Custom agent**           | Custom agent defined in `.agents/` with persona, tools, and specific instructions.                        | 06      |
| **FinOps**                 | Financial discipline for cloud and AI, with three phases: Inform, Optimize, Operate.                      | 10      |
| **FOCUS**                  | FinOps Open Cost & Usage Specification. Standard schema for cost management exports.                      | 10      |
| **Foundry**                | Azure AI Foundry: Microsoft platform for deploy, governance, and operation of AI models.                  | 11      |
| **Hooks**                  | Extension points (preToolUse, postToolUse) that run code before or after a tool.                          | 06      |
| **KV cache**               | Key-value pairs of attention stored in GPU memory between requests with the same prefix.                  | 02, 05  |
| **MCP**                    | Model Context Protocol. Open standard for connecting agents to tools and data sources.                    | 06, 12  |
| **Plan mode**              | VS Code Copilot mode where the agent plans without modifying files. Optimized for Opus.                   | 06, 12  |
| **PRU**                    | Premium Request Unit. Billing system retired on June 1. Replaced by AI Credits.                            | 08      |
| **PTU**                    | Provisioned Throughput Unit in Azure AI Foundry. Reserved capacity with predictable pricing.              | 11      |
| **Prompt caching**         | Reuse of KV cache from a stable prefix between requests. Savings up to 90% on input.                       | 05      |
| **Semantic cache**         | Cache based on semantic similarity of prompts (via embeddings), not exact hash.                           | 12      |
| **Showback / Chargeback**  | Showback: shows cost without charging. Chargeback: debits from team budget.                                | 10      |
| **SKILL.md**               | Skill definition file with YAML frontmatter, description, and progressive disclosure.                     | 07      |
| **Spec-Kit**               | Spec-Driven Development framework with CONSTITUTION.md, SPECIFICATION.md, IMPLEMENTATION_PLAN.md.          | 06, 12  |
| **Token**                  | Atomic unit the model processes. Typically sub-word. ~0.75 words/token in English.                         | 01      |
| **Tool result clearing**   | Removal of old tool results from context to avoid recurring payment.                                       | 04      |

---

## References

This section lists all sources cited in the playbook. Individual chapters include specific references; this is the consolidated list.

### Official GitHub sources

- [GitHub Docs · Copilot billing](https://docs.github.com/en/copilot/managing-copilot/managing-copilot-as-an-individual-subscriber/about-billing-for-github-copilot)
- [GitHub Blog · Pricing transition (April 2026)](https://github.blog/news-insights/product-news/)
- [GitHub Docs · GitHub AI Credits](https://docs.github.com/en/copilot)
- Mario Rodriguez, GitHub CPO. Transition announcement (April 2026).
- [GitHub Docs · Copilot Coding Agent](https://docs.github.com/en/copilot/using-github-copilot/coding-agent)

### Official Anthropic sources

- [Anthropic Docs · Prompt caching](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching)
- [Anthropic · Building effective agents](https://www.anthropic.com/research/building-effective-agents)
- [Anthropic · Effective context engineering for AI agents](https://www.anthropic.com/research/effective-context-engineering)
- [Anthropic API · Claude pricing](https://www.anthropic.com/pricing)

### Official Microsoft sources

- [Microsoft Learn · Azure Cost Management](https://learn.microsoft.com/en-us/azure/cost-management-billing/)
- [Microsoft Learn · Azure AI Foundry](https://learn.microsoft.com/en-us/azure/ai-foundry/)
- [Microsoft Learn · Azure AI Content Safety](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/)
- [Microsoft FinOps Hub for Azure (open source)](https://github.com/microsoft/finops-toolkit)
- [Microsoft Learn · OpenTelemetry in Application Insights](https://learn.microsoft.com/en-us/azure/azure-monitor/app/opentelemetry-overview)

### Academic research · arXiv

| arXiv ID    | Topic                                                | Where cited |
|-------------|------------------------------------------------------|-------------|
| 2601.07190  | Structured compaction in SWE-bench Lite (-22.7%)     | Ch. 04      |
| 2601.14470  | Tokenomics: empirical distribution in SDLC           | Ch. 02      |
| 2601.21714  | E-mem: subagent hierarchy (-70% tokens)              | Ch. 04      |
| 2603.13017  | Persistent memory: 11x compression                   | Ch. 04      |
| 2603.29919  | SkillReducer: 39% body, 48% description              | Ch. 07      |
| 2502.08235  | Danger of overthinking: -43% cost, +30% quality      | Ch. 06      |
| Sennrich 2016 | BPE for NLP                                         | Ch. 01      |

### FinOps Foundation

- [FinOps Framework v2 · finops.org](https://www.finops.org/framework/)
- [FOCUS Specification · finops.org](https://focus.finops.org/)
- [FinOps for AI · Working group](https://www.finops.org/working-groups/)

### Community and practice

- [VS Code release notes · 1.118 (June 2026)](https://code.visualstudio.com/updates)
- [LiteLLM · Open source LLM router](https://github.com/BerriAI/litellm)
- [OpenRouter · Multi-provider routing](https://openrouter.ai/)
- [Model Context Protocol · Specification](https://modelcontextprotocol.io/)

---

## About the playbook

**Author**: Paula Silva, Software Global Black Belt, Microsoft Latin America
**Contact**: [paulasilva@microsoft.com](mailto:paulasilva@microsoft.com)
**Version**: 2.0.0
**Date**: 2026-05-04
**Language**: English
**Audience**: Microsoft Latin America customers, enterprise architects, FinOps, engineering leaders

This playbook is provided as technical enablement material for Microsoft Latin America customers. It does not constitute financial or contractual recommendation. For official prices and updated terms, always consult [docs.github.com](https://docs.github.com) and [microsoft.com](https://www.microsoft.com).

The reduction numbers cited (25-45%) are based on real pilots conducted with customers in Latin America between December 2025 and April 2026. Individual results vary by context, team size, usage profile, and prior maturity.
