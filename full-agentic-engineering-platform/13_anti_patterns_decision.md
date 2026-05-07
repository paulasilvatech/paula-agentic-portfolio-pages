---
title: "13 · Anti-patterns and decision frameworks"
description: "10 cataloged anti-patterns, 3 decision frameworks (model, agent vs workflow, optimization order), and complete 4-phase operational checklist"
author: "Paula Silva"
role: "Software Global Black Belt"
contact: "paulasilva@microsoft.com"
date: "2026-05-04"
version: "2.0.0"
status: "approved"
language: "en"
chapter: 13
part: "V · Practical application"
tags: ["anti-patterns", "decision-frameworks", "checklist", "operations"]
---

# 13 · Anti-patterns and decision frameworks

> Knowing what to do is half the work. Knowing what NOT to do is the other half. This chapter catalogs 10 recurring anti-patterns in Latin America pilots between 2025 and 2026, offers 3 decision frameworks (model, agent vs workflow, optimization order), and closes with operational checklist in 4 phases for organized rollout.

## 13.1 The 10 cataloged anti-patterns

These are patterns observed in multiple enterprise customers in Latin America. Each one has root cause, detection signal, and specific correction.

### Anti-pattern 1: The agent graveyard

**The pattern**: teams create agents for everything. 3 months later, 80% of agents are not used, but continue consuming tokens in systems where they were wired.

**Detection signal**: telemetry shows >20% of agents with <5 invocations in last month but active in the system.

**Root cause**: agents created as POC, never retired.

**Correction**: 
- Monthly audit: agents with <10 invocations/month are candidates for sunset
- Policy: agents need to be re-approved if inactive for 60 days
- Documentation: each agent has explicit owner who defends or retires

### Anti-pattern 2: Everything is an agent

**The pattern**: deterministic workflow that could run in structured workflow is implemented as agent "for future flexibility".

**Detection signal**: workflow with fixed sequence running in agentic mode with 5-15 iterations.

**Root cause**: hype, "agents are the future", we forget that workflow wins in 70% of cases.

**Correction**:
- Heuristic: always start with workflow. Add agency only when proven necessary.
- Refactor existing agents: map typical sequence, convert to structured workflow
- Typical savings: 50-80% cost reduction + more predictable latency

### Anti-pattern 3: Opus as default

**The pattern**: team configures VS Code with Opus 4.7 as default in Edit/Agent mode "because it's the best".

**Detection signal**: telemetry shows >50% of calls in Opus 4.7 with tasks Sonnet would solve equally.

**Root cause**: bias of "premium is always better".

**Correction**:
- Default: Sonnet 4.6 (workhorse)
- Plan mode in Opus only for large tasks
- Training: chapter 03 decision tree

### Anti-pattern 4: Monolithic system prompt

**The pattern**: system prompt of 30K tokens with **all** company conventions, examples, edge cases.

**Detection signal**: prompt grows >5K tokens, devs complain that cache is not helping.

**Root cause**: "if it's in the prompt, guarantees the agent will know".

**Correction**:
- Progressive disclosure: core in prompt, details lazy-load via tools/resources
- Curated AGENTS.md, <500 lines
- Ch. 04 and 07 implemented

### Anti-pattern 5: Tool result blowup

**The pattern**: agent does 20 `read_file` in a session, each returning 30K tokens. Session accumulates 600K tokens just of tool results.

**Detection signal**: sessions with >10 tool calls and cost >$2.

**Root cause**: naive tool design (read_file returns entire file).

**Correction**:
- Tools with range parameters (lines, count)
- Tool result clearing (ch. 04)
- Tools that return automatic summary for large results

### Anti-pattern 6: Absence of stop criteria

**The pattern**: evaluator-optimizer or agent loop without robust stopping criterion. Can run indefinitely.

**Detection signal**: sessions with 30+ iterations, cost >$10.

**Root cause**: "I'll just go by score threshold, it'll stop when good".

**Correction**:
- 4 combined criteria (ch. 07): max_iter, score_target, improvement_delta, token_budget
- Logs in each iteration to detect plateau
- Token budget is last resort, but mandatory

### Anti-pattern 7: Cache that never caches

**The pattern**: team thinks they have cache configured but hit rate is <10%.

**Detection signal**: telemetry shows cache_read_tokens consistently low.

**Root cause**: caching anti-patterns (timestamp in prompt, cache_control in volatile block, reordering, prefix below minimum).

**Correction**:
- Audit prompts following ch. 5.5
- Automatic lint in CI: detects timestamps in system prompts
- Prefix-stable + suffix-dynamic structure

### Anti-pattern 8: Long context misuse

**The pattern**: team uses Gemini 3.1 Pro with contexts of 1M tokens "because it fits".

**Detection signal**: calls with >300K input regular in context for simple tasks.

**Root cause**: confusion between **fitting** and **being worth it**.

**Correction**:
- Context engineering first (ch. 04)
- Long context only when RAG fails structurally
- Cost: 1M tokens in Gemini 3.1 Pro = $10 per call. Accumulates fast.

### Anti-pattern 9: Multi-agent without coordination

**The pattern**: 5 agents (orchestrator + 4 workers) where 2 workers would do the work. Inter-agent communication consumes 30% of tokens.

**Detection signal**: handoffs between agents >50% of session total tokens.

**Root cause**: bloated architecture, "each perspective needs its agent".

**Correction**:
- Re-evaluate if sectioning or orchestrator-workers is really necessary
- Consolidate agents with adjacent responsibilities
- Workers with isolated context (subagent fan-out, ch. 04 and 12)

### Anti-pattern 10: No instrumentation

**The pattern**: team migrated to tokens 3 months ago but has no dashboards. Real cost is surprise at end of month.

**Detection signal**: leadership cannot answer "which feature consumes the most?"

**Root cause**: wrong prioritization in transition. Optimization without data is guessing.

**Correction**:
- Per-request telemetry from day 1 (ch. 10)
- Minimum viable: Power BI or Grafana dashboards with 5 key metrics
- Anomaly detection: catch outliers before they become problems

## 13.2 Decision framework 1 · Which model to use

Simplified tree decision. Internalize as reflex.

```
Task arrives
    │
    ↓
[1] Is it inline autocomplete or short question (<2K tokens context)?
    │
    ├─ YES → GPT-5 mini / GPT-4.1 (bundled, free)
    │
    └─ NO ↓
    
[2] Does context exceed 100K tokens?
    │
    ├─ YES → Gemini 3.1 Pro (long context, $5/$15 per M up to 200K)
    │
    └─ NO ↓

[3] Is it classification, extraction, or batch task without nuance?
    │
    ├─ YES → Haiku 4.5 or Gemini 3 Flash ($1-3 per M)
    │
    └─ NO ↓

[4] Is it refactor, debugging, or non-trivial local design?
    │
    ├─ YES → Sonnet 4.6 or GPT-5.1-Codex ($3 per M) ← DEFAULT
    │
    └─ Only if Sonnet failed or problem is genuinely complex (architecture,
       distributed systems, irreversible tradeoffs)
       │
       ↓
       Opus 4.7 or GPT-5 ($15-75 per M)
```

**Rule of thumb**: Sonnet 4.6 covers 70% of non-bundled cases. Opus for the 5-10% genuinely difficult. Long context for context >100K. Bundled for everything else.

## 13.3 Decision framework 2 · Workflow or agent?

```
Structural decision
    │
    ↓
[1] Is the sequence of steps known and stable?
    │
    ├─ YES → WORKFLOW
    │
    └─ NO, varies by input ↓

[2] Is it possible to decompose into N independent parts?
    │
    ├─ YES → PARALLEL WORKFLOW (sectioning)
    │
    └─ NO, there are dynamic dependencies ↓

[3] Is there measurable quality criterion?
    │
    ├─ YES → EVALUATOR-OPTIMIZER WORKFLOW (with stop criteria)
    │
    └─ NO, quality is subjective ↓

[4] Does decomposition vary a lot by input?
    │
    ├─ YES → AGENT (orchestrator-workers)
    │
    └─ NO ↓

[5] Is agency really necessary or are we overengineering?
    │
    └─ Start with workflow. Add agency only if proven necessary.
```

**Golden rule**: 70% of enterprise cases are solved with workflow. Use agency only when workflow no longer suffices.

## 13.4 Decision framework 3 · Optimization order

When the team is with high cost and wants to reduce, **in what order to apply optimizations**? Each has specific ROI.

### Order by ROI (largest to smallest)

```
1. COMPLEXITY ROUTING (40-70% reduction)
   - Implementation: ~2-3 days for LiteLLM setup
   - No change in prompts or tools
   - Highest quick win
   
2. PROMPT CACHING (60-80% reduction in input)
   - Implementation: ~1-2 days for audit + structure
   - Requires continuous discipline
   - Compatible with routing
   
3. SUBAGENT FAN-OUT (70-90% in iterative workflows)
   - Implementation: ~1 week
   - Only for exploration workflows
   - Greatest impact in this subset
   
4. TOOL RESULT CLEARING (30-50% in long sessions)
   - Implementation: ~2-3 days
   - Applicable where sessions >10 turns
   
5. LEAN TOOL DESIGN (30-60% in system prompt overhead)
   - Implementation: ~1 week refactor
   - Impact on all calls
   
6. SYSTEM PROMPT AUDIT (10-30%)
   - Implementation: ~2-3 days
   - SkillReducer pattern (ch. 07)
   
7. STOP CRITERIA (prevents overrun)
   - Implementation: ~1-2 days
   - More defense than direct savings
   - But prevents runaway incidents
   
8. STRUCTURED COMPACTION (20%+)
   - Implementation: ~3-5 days
   - Only in very long sessions
   - Anthropic beta (await GA)
```

### Recommended sequencing

**Week 1-2**: Routing + Prompt caching (combined, max ROI)
**Week 3-4**: Subagent fan-out + Tool result clearing
**Week 5-6**: Tool design + System prompt audit
**Week 7-8**: Stop criteria + Compaction (defensive)

After 8 weeks, typical reduction of 40-70% over pre-optimization baseline.

## 13.5 VS Code-specific anti-patterns

In addition to the 10 cataloged, there are patterns specific to Copilot usage in VS Code.

### VS Code Anti-pattern 1: Agent mode for simple questions

**Symptom**: dev opens Agent mode, asks "how does string interpolation work in Python?"

**Extra cost**: Agent mode is designed for long sessions with tools. For simple question, spends 5-10x more than Ask mode with bundled.

**Correction**: 
- Train devs in modes: Ask for questions, Edit for local changes, Agent for large tasks, Plan for planning
- Cheat sheet: print on team wall

### VS Code Anti-pattern 2: Default without workspace settings

**Symptom**: each dev configures VS Code differently. Chosen model is "lottery" based on who the person is.

**Cost**: some devs default to Opus, some to Sonnet, some to bundled. Cost per team varies 3-5x without technical reason.

**Correction**:
- `.vscode/settings.json` committed in every critical repo
- Org-wide policy via `.github/copilot-policy.yml`
- Onboarding includes configuration validation

### VS Code Anti-pattern 3: Non-versioned custom prompts

**Symptom**: devs have useful prompts in local snippets that nobody shares.

**Indirect cost**: each dev reinvents the wheel. Quality inconsistency.

**Correction**:
- `.github/prompts/` committed (ch. 07)
- Custom prompts review in PRs
- "Prompt of the month" shared in team

## 13.6 Anti-patterns in custom agents

### Custom Agent Anti-pattern 1: Swiss Army Knife

**Symptom**: "code-reviewer" agent does security + performance + style + tests + docs.

**Problem**: bloated context, inconsistent decisions, too many tools (each is tokens).

**Correction**: single-responsibility. 5 specialized agents instead of 1 generalist.

### Custom Agent Anti-pattern 2: Write agents by default

**Symptom**: all agents have `edit_file` and `run_command` in allowed list.

**Risk**: high potential damage, difficult debugging.

**Correction**: read-only by default. Only explicit implementing agents have write.

### Custom Agent Anti-pattern 3: No token budget

**Symptom**: agent without `max_tokens_per_session` defined.

**Risk**: runaway costs in loop or unlimited exploration.

**Correction**: always define `max_tokens_per_session` (e.g., 200K-500K). Use as circuit breaker.

## 13.7 Anti-patterns in MCP servers

### MCP Anti-pattern 1: Tools with long descriptive names

**Example**: `search_codebase_for_specific_patterns_with_advanced_filtering`

**Problem**: each character in name and description becomes tokens in every turn.

**Correction**: short names (`search`, `read`, `list`). Descriptions of 5-10 words.

### MCP Anti-pattern 2: 15 optional parameters

**Example**: tool with `case_sensitive`, `use_regex`, `whole_word`, `multiline`, etc.

**Problem**: agent gets confused, each parameter inflates schema.

**Correction**: 2-4 essential parameters with sensible defaults. Advanced features become separate tools if really needed.

### MCP Anti-pattern 3: Unlimited returns

**Example**: `list_files()` returns complete list of 10K files.

**Problem**: becomes tool result of 100K+ tokens, inflates history.

**Correction**: pagination, automatic summary for large results, hard limits.

## 13.8 Decision matrix: VS Code chat modes

When to use Ask vs Edit vs Agent vs Plan in VS Code Copilot.

| Scenario                                     | Mode         | Recommended model                  |
|----------------------------------------------|--------------|-------------------------------------|
| "How does X work?"                           | **Ask**      | GPT-5 mini (bundled)                |
| "Explain this code"                          | **Ask**      | GPT-5 mini (bundled)                |
| Add docstring                                | **Edit**     | GPT-5 mini (bundled)                |
| Rename variable                              | **Edit**     | GPT-5 mini (bundled)                |
| Refactor function to reduce complexity       | **Edit**     | Sonnet 4.6                          |
| Add small feature                            | **Edit**     | Sonnet 4.6                          |
| Implement complete feature                   | **Agent**    | Sonnet 4.6                          |
| Migrate 10 files to new pattern              | **Agent**    | Sonnet 4.6                          |
| Debug complex multi-file bug                 | **Agent**    | Sonnet 4.6 (then Opus if it fails)  |
| Decide architecture                          | **Plan**     | Opus 4.7                            |
| Plan for large refactor                      | **Plan**     | Opus 4.7                            |
| Irreversible decisions with tradeoffs        | **Plan**     | Opus 4.7                            |

**Rule**: Plan costs little (few calls, even with Opus). Execute costs a lot (many calls). That's why plan is worth Opus, execute is worth Sonnet.

## 13.9 Operational checklist · 4 phases

To deploy the playbook in an organized way, follow these 4 phases. Each phase has verifiable deliverables.

### Phase 1: Discovery (Week 1-2)

**Objective**: understand current state.

```
☐ Bill preview analyzed
☐ Top 10 users by consumption identified
☐ Top 10 features by consumption identified
☐ Distribution per model measured (% bundled, Sonnet, Opus, etc.)
☐ Current cache hit rate measured (probably <30%)
☐ Sessions with runaway cost (>$5) listed
☐ FinOps owner designated
☐ Stakeholders aligned (CFO, VP Eng, tech leads)
```

### Phase 2: Quick Wins (Week 3-4)

**Objective**: capture obvious savings.

```
☐ `premium_request_paid_usage` policy activated with cap
☐ Alerts configured (50%, 75%, 90%, 100%)
☐ Default model in VS Code workspace settings: Sonnet 4.6
☐ Plan mode with Opus for large tasks (configured and trained)
☐ Complexity-based routing implemented (LiteLLM or similar)
☐ AGENTS.md or copilot-instructions.md in critical projects (human curated)
☐ Custom prompts in .github/prompts/ for recurring tasks
☐ Internal communication done (email + Slack + 1h webinar)
```

**Expected at end of Phase 2**: 25-40% reduction in average cost.

### Phase 3: Technical disciplines (Week 5-8)

**Objective**: institute systematic patterns.

```
☐ Prompt caching audit in system prompts
☐ Anti-patterns corrected (timestamps, reordering, etc.)
☐ Three-tier caching structured in critical workloads
☐ Tool result clearing in long sessions
☐ Lean tool design in MCP servers
☐ Subagent fan-out in exploration workflows
☐ Robust stop criteria in agentic loops
☐ 4h workshop for tech leads conducted
☐ 1h workshop for all devs conducted
```

**Expected at end of Phase 3**: additional 10-20% reduction.

### Phase 4: Continuous operation (Week 9+)

**Objective**: establish improvement cycle.

```
☐ OpenTelemetry telemetry instrumented
☐ FOCUS export configured for Cost Management
☐ FinOps Hub deployed (if Azure)
☐ Power BI dashboards distributed (Executive, Tech Lead, FinOps)
☐ Anomaly detection active
☐ Monthly FinOps meetings with leadership
☐ Showback running for tech leads
☐ Chargeback plan being designed (month 6+)
☐ Advanced custom agents (.agents/) in selected projects
☐ Spec-Kit pattern adopted in large features
☐ Quarterly retraining on new practices
```

**Expected at end of Phase 4**: total reduction of 40-70% over pre-optimization baseline, with consolidated FinOps culture.

## 13.10 Summary of summaries · one page

If you have time to read just one page of this playbook, read this.

### The 5 changes that save the most

1. **Complexity routing**: cheap classifier decides model. 40-70% reduction.
2. **Prompt caching**: prefix-stable + suffix-dynamic. 60-80% in input.
3. **Subagent fan-out**: isolated context in exploration. 70-90% in iterative workflows.
4. **Plan/Execute**: Opus for plan, Sonnet for execute. 64% cheaper than all Opus.
5. **Lean tool design**: 60-70% reduction in system prompt overhead.

### The 5 actions before June 1

1. **Bill preview analyzed**: know your scenario (1, 2, 3, or 4 of ch. 8.8)
2. **Paid usage policy with cap**: prevents runaway
3. **VS Code with Sonnet default**: avoids accidental Opus as default
4. **AGENTS.md in critical projects**: persistent instruction, always read
5. **Internal communication**: team understands what changes

### The 5 anti-traps

1. **Don't use Opus as default** (anti-pattern 3)
2. **Don't say "agents for everything"** (anti-pattern 2)
3. **Don't skip instrumentation** (anti-pattern 10)
4. **Don't skip stop criteria** (anti-pattern 6)
5. **Don't leave agents without owner** (anti-pattern 1)

### The mindset

> Tokens are finite resource. Each token is money and quality. Teams that internalize this pay 30-70% less for the same work. The difference is not talent. It is applied discipline.

## 13.11 Conclusion and next steps

You have completed the 13 chapters of the v2.0.0 playbook. You now have:

- **Foundations**: what is token, how it becomes money, the agentic multiplier
- **Models**: 4 families, decision tree, configuration in VS Code, GitHub Enterprise, model routing
- **Technical disciplines**: context engineering, prompt caching, agent design, token-efficient strategies
- **The change and migration**: what changes in June, 16-week calendar, communication, training
- **Governance and operation**: FinOps with 5 metrics, observability, Azure AI Foundry
- **Practical application**: 8 patterns with code, 10 anti-patterns, 3 decision frameworks, 4-phase checklist

The next steps are cross references via appendices:

- [A · Optimized prompts appendix](./A_appendix_optimized_prompts.md): ready-to-use templates
- [B · Pricing reference appendix](./B_appendix_pricing_reference.md): tables and calculators
- [C · FinOps reports appendix](./C_appendix_finops_reports.md): report templates
- [D · Complete code appendix](./D_appendix_complete_code.md): all centralized implementation

And, importantly, **revisit this playbook quarterly**. The model, pricing, and pattern ecosystem evolves quickly. Future versions (v2.1, v2.2) will be published as the landscape changes.

---

## References for this chapter

- [Anthropic · Building effective agents](https://www.anthropic.com/research/building-effective-agents)
- [FinOps Framework v2 · finops.org](https://www.finops.org/framework/)
- [GitHub Docs · Best practices for Copilot at scale](https://docs.github.com/en/copilot)
- arXiv:2603.29919 (SkillReducer)
- arXiv:2502.08235 (Danger of Overthinking)
- Compilation of enterprise pilots in Latin America 2025-2026

---

**Previous chapter**: ← [12 · Applied optimization patterns](./12_applied_optimization_patterns.md)
**Next**: [Appendix A · Optimized prompts](./A_appendix_optimized_prompts.md) →
**Back to index**: [00 · README](./00_README_INDEX.md)
