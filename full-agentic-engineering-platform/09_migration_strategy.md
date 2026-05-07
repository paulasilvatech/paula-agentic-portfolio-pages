---
title: "09 · Migration · strategy, calendar, and decisions"
description: "Critical 16-week timeline, Pro/Pro+ annual decisions, CIO playbook in 4 phases, internal communication, and structured training"
author: "Paula Silva"
role: "Software Global Black Belt"
contact: "paulasilva@microsoft.com"
date: "2026-05-04"
version: "2.0.0"
status: "approved"
language: "en"
chapter: 9
part: "III · The change and migration"
tags: ["migration", "timeline", "cio-playbook", "training", "communication"]
---

# 09 · Migration · strategy, calendar, and decisions

> The migration window is approximately 16 weeks, from bill preview availability in May 2026 to steady-state in September. Those who act early capture savings. Those who wait pay overage. This chapter gives you the critical timeline, decisions for annual subscribers, CIO playbook in 4 phases, and ready-to-use templates of internal communication and training.

## 9.1 Critical 16-week timeline

The transition is not a one-day event. It is a 4-month process. Here is the complete timeline, with actions per week.

### Weeks 1-4 (May): Discovery and preparation

**Week 1 (May 5-11)**
- Bill preview available in Billing Overview
- **Access** preview and analyze projection
- **Identify** top 10 users by consumption
- **Map** features most consuming tokens

**Week 2 (May 12-18)**
- **Decide** fate of Pro/Pro+ annual plans (continue/convert/cancel)
- **Action by May 20**: annual subscribers who want to cancel with refund
- **Action by May 25**: annual subscribers who want to convert to monthly
- **Approve** monthly budget per organization and cost center

**Week 3 (May 19-25)**
- **Activate** `premium_request_paid_usage` policy with configured cap
- **Configure** alerts at 50%, 75%, 90%, 100% of budget
- **Define** FinOps owner for AI Copilot
- **Create** centralized configuration repository (.github/copilot-config.yml)

**Week 4 (May 26 - June 1)**
- **Train** tech leads in this playbook (4h workshop, see section 9.5)
- **Distribute** internal disciplined usage guide
- **Validate** consumption dashboards per team
- **Communicate** change to all users (templates section 9.4)
- **May 31**: last week of PRUs in monthly plans

### Week 5 (June 1-7): D-Day

- **June 1**: Transition. AI Credits active. Annual multipliers increased.
- **Monitor** consumption daily in first week
- **Validate** alerts working correctly
- **Collect** dev feedback on limitations
- **Distribute** weekly consumption report

### Weeks 6-8 (June): Stabilization and quick wins

- **Apply** complexity-based routing (chapter 03 and 07)
- **Implement** prompt caching in top consuming workloads
- **Identify** outliers and anomalies
- **Adjust** thresholds if 90% reached too early
- **GitHub promotion**: extra credits for Business/Enterprise (valid until August)

### Weeks 9-12 (July): Systematic optimization

- **Iteration**: weekly/monthly showback for tech leads
- **Implement** custom prompts in `.github/prompts/`
- **Train** devs in applied patterns (chapter 12)
- **Configure** enterprise-grade observability (chapter 10)
- **Refinement** of model policy based on data

### Weeks 13-16 (August): Maturation

- **End of GitHub promotion** (extra credits from June)
- **Steady-state costs visible**
- **Retrospective** of FinOps with leadership
- **Document** lessons learned
- **September**: first complete month of realistic billing post-promotion

## 9.2 Decision for Pro/Pro+ annual subscribers

For users who subscribed to Pro or Pro+ on annual plan before June 1, there are three paths. Each with specific tradeoffs.

### Path A: Continue on annual in PRUs until expiration

**How it works**: user maintains current annual plan. Continues consuming PRUs. But multipliers increased (3.6× to 6×).

**Advantages:**
- No action needed
- Maintains paid annual price

**Disadvantages:**
- Real capacity falls 3-6×
- Whoever did 100 sessions with Opus/month → goes to 28
- No granular cost visibility (still PRUs)

**Makes sense if:**
- User uses mainly bundled (GPT-4.1, GPT-5 mini)
- Premium is occasional use
- Annual plan expires in <3 months

### Path B: Convert to monthly

**How it works**: GitHub offers prorated credits corresponding to remaining time on annual. In June, user enters new AI Credits model directly.

**Prorated calculation:**

```
Pro+ annual plan paid: $390 (annual value of $39/month × 12 months, with possible discount)
Time remaining: 4 months
Prorated credit: ($390 / 12) × 4 = $130 in AI Credits

User enters June with:
  - Monthly Pro+ plan activated: $39/month = 3,900 credits/month
  - Migration bonus: 13,000 credits ($130 prorated)
  - Total available in June: 16,900 credits
  
From July: just 3,900/month standard
```

**Advantages:**
- Enters new model right away, captures savings
- Transparent token-based pricing
- Granular visibility
- Newer premium models available

**Disadvantages:**
- In some cases, accumulated monthly cost may be higher than original annual

**Makes sense if:**
- User uses premium frequently
- Wants to take advantage of detailed visibility
- Annual plan expires in >3 months

### Path C: Cancel and receive prorated refund

**How it works**: user cancels the annual before May 20. GitHub processes refund proportional to unused time.

**Refund calculation:**

```
Pro+ annual plan paid: $390
Time used: 8 months
Time remaining: 4 months
Refund: ($390 / 12) × 4 = $130
```

**Advantages:**
- Recovers unused value
- Freedom to choose another provider (direct Anthropic API, Cursor, etc.)

**Disadvantages:**
- Loses Copilot access during transition (unless re-subscribes monthly)
- Refund bureaucracy

**Makes sense if:**
- User decides to migrate to direct Anthropic API (path explored in 9.3)
- Company change, loses access to plan
- Not actively using Copilot

### Decision by persona

| Profile                                       | Recommendation |
|-----------------------------------------------|----------------|
| Individual dev using mostly bundled           | Path A         |
| Power user who takes advantage of premium     | Path B         |
| Wants to migrate to another provider          | Path C         |
| Company/employee losing access                | Path C         |

## 9.3 Alternative migration: direct Anthropic API

For some organizations, it makes sense to migrate critical workloads to direct Anthropic API (with own account), outside GitHub Copilot. Here is when and how.

### When to consider direct API

- **High volume workloads**: more aggressive caching gives better effective pricing
- **Need for total control**: tokens, models, behavior
- **Specific compliance**: data cannot transit through GitHub
- **Use case outside coding**: product chatbots, analytics, etc.

### When NOT to migrate

- **Only for IDE coding**: Copilot has native integration, worth the markup
- **Small teams (<20 devs)**: overhead of maintaining direct API > benefit
- **No capacity to implement**: cache, routing, observability cost to build

### Cost comparison

```
Scenario: 500 devs, 50 agentic sessions/month each, 200K tokens average

Via GitHub Copilot Business:
  Plan: 500 × $19 = $9,500/month
  Estimated overage: $5,000/month (premium consumption)
  Total: ~$14,500/month

Via direct Anthropic API + aggressive cache + routing:
  Tokens: 500 × 50 × 200K = 5B tokens/month
  With routing (50% Sonnet, 30% Haiku, 15% bundled-equivalent, 5% Opus):
    50% × 2.5B × $3/M = $3,750
    30% × 1.5B × $1/M = $1,500
    5%  × 250M × $15/M = $3,750
    Total fresh: $9,000
  With cache 80%:
    Effective: $9,000 × 0.4 = $3,600
  + Infra (proxy, observability): $500/month
  Total: ~$4,100/month

Potential savings: $10,000/month = $120K/year
```

**Caveats:**
- Devs lose native Copilot integration in VS Code
- Team needs to build and maintain wrapper
- Team needs to implement routing, cache, telemetry
- Dev support and productivity may fall during transition

### Reference architecture for direct API

```
┌─────────────────────────────────────────────────────────┐
│ Devs (VS Code with custom extension OR Cursor OR custom)│
└────────────────────────┬────────────────────────────────┘
                         │
                         ↓
              ┌──────────────────────┐
              │ Internal LLM Gateway │ ← LiteLLM, custom
              └──────────┬───────────┘
                         │
              ┌──────────┼──────────┐
              ↓          ↓          ↓
      ┌─────────┐ ┌──────────┐ ┌──────────┐
      │ Routing │ │  Cache   │ │ Telemetry│
      │ Engine  │ │  Layer   │ │  Layer   │
      └────┬────┘ └────┬─────┘ └─────┬────┘
           │           │             │
           ↓           ↓             ↓
   ┌─────────────────────────────────────┐
   │  Anthropic API · OpenAI · Gemini   │
   └─────────────────────────────────────┘
```

Detailed implementation is in [Appendix D · Complete code](./D_appendix_complete_code.md).

### Hybrid: Copilot + direct API

The choice is not binary. Many orgs adopt hybrid:

- **GitHub Copilot**: for IDE coding (rich dev experience)
- **Direct Anthropic API**: for high-volume non-IDE workloads (chatbots, analytics, RAG)

This pattern captures the best of both worlds.

## 9.4 Internal communication: ready-to-use templates

The transition needs to be communicated to multiple audiences. Here are templates based on real communications from companies that migrated in 2026.

### Template 1: Email to all devs

**Subject**: [Important] Change in GitHub Copilot starting June 1

```
Hello team,

On June 1, 2026, GitHub Copilot changes to a token-based billing model. 
Here's what you need to know in 5 minutes.

## What changes

- Premium Request Units (PRUs) are retired
- Replaced by GitHub AI Credits (1 Credit = US$ 0.01)
- Code completions and bundled models (GPT-4.1, GPT-5 mini) continue unlimited
- Premium models (Sonnet, Opus, Gemini Pro) consume credits per token

## What does NOT change

- Your plan price
- Basic functionality
- Your day-to-day productivity (if you use mainly bundled)

## What you need to do

1. **This week**: read internal playbook on token discipline
   Link: [intranet/copilot-playbook]

2. **This week**: configure VS Code with our recommended settings
   - Sonnet 4.6 as default for Edit/Agent mode
   - Opus 4.7 only for Plan mode (and in justified cases)
   - GPT-5 mini for quick questions (Ask mode)
   
   Settings in: .vscode/settings.json (committed in repos)

3. **From June 1**: monitor your usage
   - Copilot icon in VS Code status bar shows remaining credits
   - You'll receive alerts at 75% and 90% of your monthly budget

## Support

- Questions: #copilot-help on Slack
- FinOps: ai-finops@company.com
- Complete documentation: [intranet/copilot-playbook]

## TLDR

The change rewards disciplined usage. Devs who apply the playbook pay 30-70% less for the
same work. The difference is not talent, it is practice.

Thanks,
Engineering Leadership
```

### Template 2: Slack/Teams message (short)

```
🚨 GitHub Copilot · Change on June 1

TLDR: Copilot starts charging by tokens instead of "premium requests".

3 actions for you:
1️⃣ Configure VS Code with Sonnet 4.6 as default (not Opus)
2️⃣ Use plan mode for big tasks (cheaper in the end)
3️⃣ Read the playbook: [link]

Bundled (GPT-4.1, GPT-5 mini) continues free. Use whenever possible.

Questions: #copilot-help
```

### Template 3: Communication for leadership (CFO, VPs)

**Subject**: GitHub Copilot · Transition plan and projected financial impact

```
Dear [Names],

Summary of the GitHub Copilot transition plan that takes effect on June 1, 2026.

## Context

GitHub is migrating from per-request billing (PRUs) to token-based billing (AI Credits) 
on June 1. This is the biggest commercial change to the product since its launch.

## Projected financial impact

### Without action scenario
- Current baseline: $X/month ($Y/year)
- Projected post-transition overage: +30% to +50%
- Annual impact: +$Z

### With playbook applied scenario (recommended)
- Investment in training and tooling: $K (one-time)
- Expected reduction vs current baseline: 25-45%
- Projected annual savings: $W
- Payback: <60 days

## Actions already underway

1. ✅ Bill preview analyzed (week 1 of May)
2. ✅ `premium_request_paid_usage` policy activated with $X cap
3. 🔄 Tech leads workshop in progress (4h structured)
4. 🔄 Custom prompts and VS Code settings distributed
5. 📋 FinOps observability plan in implementation (chapter 10 of playbook)

## Owner

[Name] was designated as FinOps Engineer for AI Copilot. Will report monthly review.

## Necessary decisions

- [ ] Approval of $X monthly cap
- [ ] Approval of investment in observability tooling ($K one-time)

Complete details in shared playbook: [link]

Thanks,
[Senior Tech Lead / VP Eng / CTO]
```

### Template 4: Communication for tech leads (4h workshop)

See section 9.5 below.

## 9.5 Structured training: 1h, 4h, full-day agendas

The transition requires structured training. Here are three ready-to-use agendas, by audience and depth.

### 1h agenda: All-hands engineering

**Audience**: all devs, quick context
**Format**: webinar/all-hands
**Duration**: 1 hour

```
00:00-00:10  Context of the change
             - What changes on June 1
             - Why happened (ch. 8.5)

00:10-00:25  The essential in 15 minutes
             - GitHub AI Credits explained (ch. 8.2)
             - Models: bundled vs premium (ch. 03)
             - 3 tips: routing, caching, plan mode

00:25-00:40  Practical demo
             - Configure VS Code correctly
             - Difference Plan/Edit/Agent modes
             - Custom prompts in .github/prompts/

00:40-00:55  Q&A

00:55-01:00  Next steps
             - Link to playbook
             - Optional 4h workshop for tech leads
             - Slack channel #copilot-help
```

### 4h agenda: Tech leads workshop

**Audience**: tech leads, staff engineers, architects
**Format**: hands-on workshop
**Duration**: 4 hours (with break)

```
00:00-00:30  Foundations (ch. 01-02)
             - What is token, BPE
             - Three categories: input/output/cached
             - Agentic multiplier

00:30-01:00  Models and routing (ch. 03)
             - 4 families, decision tree
             - Configure VS Code
             - GitHub Enterprise org policies
             - Hands-on: configure settings.json

01:00-01:15  BREAK

01:15-02:00  Context engineering (ch. 04)
             - Context rot
             - Compaction
             - Tool result clearing
             - AGENTS.md and copilot-instructions.md
             - Hands-on: create AGENTS.md for pilot project

02:00-02:45  Prompt caching (ch. 05)
             - Prefix cache mechanics
             - 5 anti-patterns
             - Hands-on: implement caching in Python script

02:45-03:00  BREAK

03:00-03:30  Agent design (ch. 06)
             - Workflow vs agent
             - 5 patterns
             - Custom agents .agents/

03:30-04:00  Basic FinOps + Q&A
             - Metrics, showback
             - Next steps in the team
```

### Full-day agenda: Platform engineers

**Audience**: platform engineers, FinOps engineers, enterprise architects
**Format**: advanced workshop, deep hands-on
**Duration**: 8 hours (full day)

```
09:00-09:30  Welcome + enterprise context
             
09:30-10:30  Deep foundations (ch. 01-02)
             - Includes math of agentic multiplier
             - Tokenomics distribution

10:30-10:45  BREAK

10:45-12:30  Models + routing implementation (ch. 03 + 07)
             - Decision tree
             - Hands-on: implement router with LiteLLM
             - Comparison custom vs LiteLLM vs OpenRouter

12:30-13:30  LUNCH

13:30-15:00  Advanced context engineering (ch. 04)
             - Subagents with fan-out
             - Persistent memory
             - Hands-on: structure repository with Spec-Kit

15:00-15:15  BREAK

15:15-16:30  Enterprise prompt caching (ch. 05)
             - Three-tier cache
             - External Redis, semantic cache
             - Hands-on: implement hybrid cache

16:30-17:30  FinOps observability (ch. 10)
             - OpenTelemetry instrumentation
             - FOCUS export, FinOps Hub
             - Power BI dashboards
             - Hands-on: basic setup

17:30-18:00  Q&A + implementation plan in the team
```

### Support materials

For each workshop, provide:

1. **Slide deck** with the main concepts
2. **Hands-on lab repository** with example code
3. **Cheat sheet** PDF (1 page) with quick decisions
4. **Link to complete playbook** (this document)
5. **Slack channel** for post-workshop support

## 9.6 Conclusion and next steps

You now understand:

- **Critical 16-week timeline**: from bill preview to steady-state
- **3 paths for annual subscribers**: continue, convert, cancel
- **Alternative migration to direct Anthropic API**: when it makes sense, architecture
- **Communication templates**: email, Slack, leadership, by audience
- **Training agendas**: 1h all-hands, 4h tech leads, full-day platform engineers

In the next chapter, [10 · FinOps for AI](./10_finops_ai.md), we enter governance at scale: the three phases (Inform/Optimize/Operate), key metrics, showback/chargeback, and complete observability implementation with OpenTelemetry, FOCUS export, FinOps Hub, Power BI, and Grafana.

---

## References for this chapter

- [GitHub Docs · Plan migration guide](https://docs.github.com/en/copilot)
- [FinOps Foundation · Migration playbook](https://www.finops.org/)
- [Microsoft Learn · Azure Cost Management migration](https://learn.microsoft.com/en-us/azure/cost-management-billing/)
- [Anthropic API · Pricing direct](https://www.anthropic.com/pricing)

---

**Previous chapter**: ← [08 · GitHub Copilot · The June 2026 change](./08_github_copilot_june_change.md)
**Next chapter**: [10 · FinOps for AI](./10_finops_ai.md) →
**Back to index**: [00 · README](./00_README_INDEX.md)
