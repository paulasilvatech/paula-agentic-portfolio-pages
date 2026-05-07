---
title: "08 · GitHub Copilot · The June 2026 change"
description: "What changes exactly, GitHub AI Credits explained, annual multipliers, impacts by persona, and how to enable paid usage policy step-by-step"
author: "Paula Silva"
role: "Software Global Black Belt"
contact: "paulasilva@microsoft.com"
date: "2026-05-04"
version: "2.0.0"
status: "approved"
language: "en"
chapter: 8
part: "III · The change and migration"
tags: ["github-copilot", "ai-credits", "june-2026", "paid-usage-policy", "billing"]
---

# 08 · GitHub Copilot · The June 2026 change

> On June 1, 2026, GitHub Copilot stops charging per request. Premium Request Units (PRUs) are retired. GitHub AI Credits take over. 1 AI Credit = US$ 0.01. Input, output, and cached tokens are accounted for at the published API rate of each model. This change is structural: under PRUs, cost was per intent; under tokens, it is per work performed.

## 8.1 What changes exactly

The June 2026 transition involves **seven concrete changes** that affect all paid GitHub Copilot plans.

### Change 1: PRUs retired in monthly plans

Premium Request Units (PRUs) were the billing unit for premium models (Opus, GPT-5, etc.) above the included plan quota.

**Before (until May 2026):**
- Each premium model call cost N PRUs (N = model multiplier)
- Business plan included X PRUs/month
- Above quota, charges in additional PRUs

**After (starting June 1, 2026):**
- PRUs cease to exist in monthly plans
- Replaced by GitHub AI Credits
- Pricing based on real tokens (input + output + cached) at published API rate

### Change 2: GitHub AI Credits replace PRUs

GitHub AI Credits are the new internal currency of Copilot.

**Direct conversion**: 1 AI Credit = US$ 0.01.

```
Pro plan        → US$ 10/month → 1,000 AI Credits/month
Pro+ plan       → US$ 39/month → 3,900 AI Credits/month
Business plan   → US$ 19/usr/month → 1,900 AI Credits/user/month
Enterprise plan → US$ 39/usr/month → 3,900 AI Credits/user/month
```

Each model call (except bundled) consumes AI Credits proportional to token usage.

### Change 3: Plan base price does not change

Monthly plan prices remain the same. Only the **billing model above the plan** changes.

| Plan                 | Price/month   | Included AI Credits      |
|----------------------|---------------|--------------------------|
| Copilot Free         | US$ 0         | Limited (sample)         |
| Copilot Pro          | US$ 10        | US$ 10 (1,000 credits)   |
| Copilot Pro+         | US$ 39        | US$ 39 (3,900 credits)   |
| Copilot Business     | US$ 19/user   | US$ 19 (1,900) per user  |
| Copilot Enterprise   | US$ 39/user   | US$ 39 (3,900) per user  |

### Change 4: Code completions and Next Edit Suggestions included

Core functionalities continue **included in plan without consuming AI Credits**:

- Inline code completions (Tab to accept)
- Next Edit Suggestions
- Copilot Chat with bundled models (GPT-4.1, GPT-5 mini)

Only calls to premium models (Sonnet, Opus, Gemini Pro, GPT-5, etc.) consume AI Credits.

### Change 5: Fallback experiences removed

**Before**: when PRUs ran out, Copilot fell to bundled models automatically. Work continued (with reduced quality).

**After**: when AI Credits exhaust **and** the `premium_request_paid_usage` policy is disabled, **work stops**. Message to the user: "Out of AI Credits this month".

```
Scenario 1: AI Credits remaining > 0
  → User can use any allowed model
  
Scenario 2: AI Credits = 0, paid usage = enabled
  → Continues, charges to org budget as overage
  
Scenario 3: AI Credits = 0, paid usage = disabled
  → Work blocked for premium models
  → Bundled models (GPT-4.1, GPT-5 mini) continue working
```

This is a significant change: **budget becomes continuity control**, not just cost control.

### Change 6: Code review doubles in billing

GitHub Copilot Code Review (the auto-PR-review feature) now consumes **two resources**:

1. **AI Credits**: by model usage
2. **GitHub Actions minutes**: by the runner that executes the review

Before it was only Actions minutes (model was considered part of the feature). Now charged in both dimensions.

### Change 7: Pro/Pro+ annual plans continue in PRUs

For users who subscribed to Pro or Pro+ annual plans **before June 1, 2026**, there is differentiated transition:

- **Maintain PRU system until annual plan expiration date**
- But **multipliers increase** (3.6x to 6x more expensive)
- Real capacity falls proportionally

Details in section 8.4.

## 8.2 GitHub AI Credits explained

AI Credits work as an internal prepaid wallet of Copilot. Here's how they work in detail.

### The conversion formula

```python
def calculate_credits_consumed(
    input_tokens: int,
    output_tokens: int,
    cached_read_tokens: int,
    cached_write_5min_tokens: int,
    cached_write_1h_tokens: int,
    model_pricing: dict,  # published API prices
) -> float:
    """Calculates AI Credits consumed by a call."""
    cost_usd = (
        input_tokens             * model_pricing["input"]              / 1_000_000
      + output_tokens            * model_pricing["output"]             / 1_000_000
      + cached_read_tokens       * model_pricing["cached_read"]        / 1_000_000
      + cached_write_5min_tokens * model_pricing["cached_write_5min"]  / 1_000_000
      + cached_write_1h_tokens   * model_pricing["cached_write_1h"]    / 1_000_000
    )
    return cost_usd * 100  # 1 credit = $0.01
```

### Monthly reset

```python
# Balance reset every day 1 at 00:00:00 UTC
# Does not accumulate between months
# Use it or lose it
```

This means organizations with seasonal usage need to plan: credits unused in January are not carried to February.

### What happens when balance hits zero

```python
def handle_request(user, model, tokens_estimated):
    credits_needed = estimate_credits(model, tokens_estimated)
    
    if user.credits_remaining >= credits_needed:
        # Case 1: still has credits
        deduct_credits(user, credits_needed)
        return execute_request()
    
    elif org.premium_paid_usage_enabled and org.budget_remaining > 0:
        # Case 2: org allows overage
        org_charge = credits_needed - user.credits_remaining
        deduct_credits(user, user.credits_remaining)  # zeros
        charge_organization(org, org_charge)
        return execute_request()
    
    else:
        # Case 3: blocked
        return BlockedResponse(
            message="Out of AI Credits. Contact your admin.",
            suggestion="Use bundled models (GPT-4.1, GPT-5 mini) instead."
        )
```

### Balance visibility

Users see their balance in real time:

- **VS Code**: Copilot icon in status bar shows remaining credits
- **GitHub.com**: Settings → Copilot → Usage → Current month
- **CLI**: `gh copilot usage --me`

Admins see org aggregate:

- **Organization**: Settings → Copilot → Billing → Usage by user

## 8.3 Complete pricing table post-June 1

Pricing per million tokens in USD. **Always check [docs.github.com](https://docs.github.com) for updated prices, may change.**

### Anthropic

| Model                | Input  | Output | Cached read | Cached write 5m | Cached write 1h |
|----------------------|--------|--------|-------------|-----------------|-----------------|
| Claude Haiku 4.5     | $1     | $5     | $0.10       | $1.25           | $2              |
| Claude Sonnet 4.6    | $3     | $15    | $0.30       | $3.75           | $6              |
| Claude Opus 4.5      | $15    | $75    | $1.50       | $18.75          | $30             |
| Claude Opus 4.6      | $15    | $75    | $1.50       | $18.75          | $30             |
| Claude Opus 4.7      | $15    | $75    | $1.50       | $18.75          | $30             |

### OpenAI

| Model                | Input  | Output | Cached read |
|----------------------|--------|--------|-------------|
| GPT-4.1 (bundled)    | -      | -      | -           |
| GPT-5 mini (bundled) | -      | -      | -           |
| GPT-5.1-Codex        | $3     | $12    | $0.30       |
| GPT-5                | $10    | $30    | $1          |
| GPT-5.4              | $10    | $30    | $1          |
| GPT-5.5              | $10    | $30    | $1          |

### Google

| Model                       | Input  | Output | Cached read |
|-----------------------------|--------|--------|-------------|
| Gemini 3 Flash              | $1     | $3     | $0.10       |
| Gemini 2.5 Pro (≤200K)      | $5     | $15    | $0.50       |
| Gemini 3.1 Pro (≤200K)      | $5     | $15    | $0.50       |
| Gemini 3.1 Pro (>200K)      | $10    | $30    | $1          |

### xAI

| Model                | Input  | Output | Cached read |
|----------------------|--------|--------|-------------|
| Grok Code Fast 1     | $0.50  | $2     | $0.05       |

### Quick practical calculations

**1,000 calls per user/month with average profile (5K input + 500 output):**

```
Sonnet 4.6: 1000 × (5K × $3/M + 500 × $15/M) = 1000 × ($0.015 + $0.0075) = $22.50/user
Opus 4.7:   1000 × (5K × $15/M + 500 × $75/M) = 1000 × ($0.075 + $0.0375) = $112.50/user

Difference: 5x ($112.50 - $22.50 = $90/user/month)
```

**1 long agentic session (100K input + 8K output):**

```
Sonnet 4.6: 100K × $3/M + 8K × $15/M = $0.30 + $0.12 = $0.42
Opus 4.7:   100K × $15/M + 8K × $75/M = $1.50 + $0.60 = $2.10

Difference: 5x ($2.10 - $0.42 = $1.68 per session)
```

In organizations with 500 devs doing 5 agentic sessions/month with Opus instead of Sonnet:
```
Difference = 500 × 5 × $1.68 = $4,200/month
Annual = $50,400 wasted on unnecessary Opus usage
```

## 8.4 Multipliers for annual plans

For those who subscribed to Pro or Pro+ on annual plan (12 months prepaid), the transition is different. **They continue in PRUs until expiration**, but with increased multipliers.

### The increase table

| Model                 | Old multiplier  | New multiplier | Increase |
|-----------------------|-----------------|-----------------|----------|
| Claude Opus 4.7       | 7.5×            | 27×             | **3.6×** |
| Claude Sonnet 4.6     | 1.25×           | 4.5×            | 3.6×     |
| GPT-5.5               | 7.5×            | similar         | 3.6×     |
| GPT-5                 | 7.5×            | similar         | 3.6×     |
| GPT-5.3 Codex         | 1×              | 6×              | **6×**   |
| Gemini 3.1 Pro        | 1×              | 6×              | **6×**   |

**Always check exact and updated table on docs.github.com.**

### Practical impact

Real capacity (interactions per month) falls approximately 3.6× to 6×:

- Whoever did 100 sessions with Opus per month → goes to 28
- Whoever did 100 sessions with Sonnet per month → goes to 28
- Whoever did 100 sessions with Codex per month → goes to 17

### Why GitHub did this

Direct economic reason: cover the real cost of inference under new agentic architecture. Under old multipliers, the implicit subsidy was unsustainable.

### Decision for annual subscribers

Three paths:

1. **Keep annual until expiration**: zero action, but real capacity falls 3-6x
2. **Convert to monthly**: GitHub offers prorated credits, enters new model directly
3. **Cancel**: prorated refund of remaining time

Details in [09 · Migration](./09_migration_strategy.md).

## 8.5 Why this change happened now

The transition is not arbitrary. It is a direct consequence of a change in Copilot's usage profile that happened in the last 18 months.

### The root cause is architectural, not commercial

In Mario Rodriguez's words, GitHub CPO, in April 2026:

> Today, a quick question in a multi-hour autonomous coding session can cost the user the same. GitHub absorbed much of the increasing inference cost behind this usage, but the current premium request model is no longer sustainable.

### What changed in the usage profile

**In 2024 (original PRU world):**
- 95% of interactions were short chats (30s-2min)
- 5% were refactorings via Edit mode (5-15min)
- Inference cost per interaction was predictable

**In 2026 (agentic world):**
- 60% of interactions are short chats
- 25% are Edit mode
- 15% are **Agent mode with sessions of 30min to 4h**

Long agentic sessions have **order of magnitude greater** inference cost:

```
Short chat: ~5K total tokens (input + output)
Agent mode 30min: ~200K tokens
Agent mode 4h: ~2M tokens

Ratio: 1 4h agentic session = 400 short chats in consumption
       But under PRUs, they cost the same (1 PRU each)
```

### Why June 2026 and not before

Three factors converged:

1. **Agent mode adoption reached critical mass** (~30% of PRs in some enterprise customers)
2. **Costs of Opus 4.7 and GPT-5 are significantly higher** than previous models
3. **GitHub's implicit subsidy was increasing 8-12% month over month**

The transition is rational from a sustainability standpoint. **The question for customers is not "if" but "how to navigate".**

## 8.6 The real impacts by persona

The change dramatically affects different profiles. Here is the detailed impact per persona.

### Persona 1: Pro (US$ 10/month) - individual dev

**Typical profile**: independent developer, freelancer, or contractor. Uses Copilot mainly for code completions and pointed questions.

**Post-June capacity:**

```
US$ 10/month = 1,000 AI Credits

Code completions and Next Edit: unlimited (included)
Chat with bundled (GPT-4.1, GPT-5 mini): unlimited (included)

Premium consumption:
- Sonnet 4.6: ~$0.04/typical session → ~250 premium sessions/month
- Opus 4.7:    ~$0.20/typical session → ~50 premium sessions/month
- Realistic mix: ~30-40 substantive Opus sessions per month
```

**Recommendation for Pro**:
- **Bundled as default**: configure VS Code for GPT-5 mini/GPT-4.1 default
- **Premium for critical tasks**: architecture, hard debugging
- **Learn the 5 patterns** (ch. 06) and routing (ch. 07): makes US$ 10 stretch much further

### Persona 2: Pro+ (US$ 39/month) - power user

**Typical profile**: experienced developer, uses premium frequently, long sessions.

**Post-June capacity:**

```
US$ 39/month = 3,900 AI Credits

Premium consumption:
- Opus 4.7 in agent mode: ~$1-2/hour
- US$ 39 = ~1-2 hours of Opus 4.7 with long window per month
- Or: 100-200 substantial Sonnet 4.6 sessions
- Or: mix
```

**Recommendation for Pro+**:
- **Sonnet 4.6 default**: balanced workhorse
- **Opus 4.7 when justified**: architecture, problems with complex tradeoffs
- **Plan mode with Opus, Execution with Sonnet**: pattern that reduces cost (ch. 12)
- **Configure alerts**: 50%, 75%, 90% of monthly budget
- **Cache discipline**: learn chapter 05

### Persona 3: Business 50 devs (US$ 950/month) - mid-size team

**Typical profile**: medium-sized company, cohesive team, model policy needed.

**Post-June capacity:**

```
50 × US$ 19 = US$ 950/month = 95,000 collective AI Credits

Typical observed distribution:
- 70% work in bundled (consumes nothing) → completions, basic questions
- 20% work in Sonnet → ~$0.04/session × 20,000 sessions = $800
- 8% work in Opus → ~$0.20/session × 1,500 sessions = $300
- 2% work in Gemini long-context → ~$0.10/session × 500 = $50

Estimated total: $1,150 (overage of $200 over plan)
```

**Recommendation for Business**:
- **Adopt this complete playbook**
- **Configure org policy**: model allowlist, paid usage policy with cap
- **Train devs**: structured 4h workshop (ch. 09)
- **Observability**: dashboards per team (ch. 10)
- **Monthly review**: FinOps review with tech leads
- **Expected**: 25-45% reduction vs usage without discipline = $480 to $860/month saved

### Persona 4: Enterprise 500+ devs - token management as capability

**Typical profile**: enterprise company, multiple teams, compliance, governance.

**Post-June capacity:**

```
500 × US$ 39 = US$ 19,500/month = 1,950,000 collective AI Credits

Without governance, observed historical overage: 30%+
Estimated without playbook: $25,350/month = $304,200/year

With playbook applied: 25-45% reduction
Estimated with playbook: $14,300 to $19,500/month
Savings: $5,000 to $11,000/month = $60K to $132K/year
```

**Recommendation for Enterprise**:
- **Dedicated AI platform team** (1-3 full-time engineers for 500+)
- **Explicit responsibility for cost**: initial showback, mature chargeback
- **Enterprise-grade observability**: OpenTelemetry, FinOps Hub, Power BI (ch. 10)
- **Patterns versioned as code**: AGENTS.md, custom prompts, custom agents
- **Structured training**: 1h/4h/full-day agendas per persona (ch. 09)
- **Expected**: $60K-132K/year in direct savings

## 8.7 How to enable Premium Request Paid Usage Policy

The most important policy to configure before June 1. Allows your organization to continue working when AI Credits from the plan exhaust, controlling overage explicitly.

### Step 1: Access Organization Settings

```
github.com/orgs/{your-org}/settings/copilot/policies
```

Or navigate: Organization → Settings → Copilot → Policies.

### Step 2: Activate the policy

Find the "Premium Request Paid Usage" section and select:

```
Policy: Enabled with cap
Monthly cap: $5,000 (adjust according to org size)
```

**Initial recommendation by size:**

| Org size                  | Recommended initial cap |
|---------------------------|-------------------------|
| 10-50 devs                | US$ 1,000               |
| 50-200 devs               | US$ 5,000               |
| 200-1,000 devs            | US$ 20,000              |
| 1,000+ devs               | US$ 50,000+             |

Initial cap should be **20-30% above** historical consumption, giving buffer for natural growth but limiting runaway costs.

### Step 3: Configure alerts

Configure alerts at multiple thresholds:

```
Alerts:
  ✓ At 50% of cap → email, slack
  ✓ At 75% of cap → email, slack
  ✓ At 90% of cap → email, slack, pagerduty
  ✓ At 100% of cap → email, slack, pagerduty, lock policy

Recipients:
  - cfo@company.com
  - ai-finops@company.com
  - engineering-leads@company.com
```

**Threshold logic:**

- **50%**: warning to adjust behavior, still time
- **75%**: corrective action begins to be necessary
- **90%**: emergency, immediate intervention
- **100%**: budget cap applied, premium models blocked (fall to bundled)

### Step 4: Designate explicit owner

Define who is responsible for:

- Monitoring daily/weekly consumption
- Responding to alerts
- Making decisions to increase/reduce cap
- Reporting to leadership monthly

Typically FinOps engineer or senior tech lead. **Without owner, policy becomes invisible.**

### Step 5: Test before June 1

In May (bill preview window):

1. Use bill preview to project June consumption
2. Compare projection with configured cap
3. Adjust cap if necessary (don't let work stop on June 1 due to too low cap)
4. Validate alerts are reaching correct recipients

### Configuration via GitHub API (automation)

For teams with IaC (Infrastructure as Code) approach:

```bash
# Enable policy via REST API
curl -X PATCH \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/orgs/$ORG/copilot/billing/paid-usage-policy \
  -d '{
    "policy": "enabled_with_cap",
    "monthly_cap_usd": 5000,
    "alert_thresholds": [50, 75, 90, 100],
    "alert_recipients": [
      "cfo@company.com",
      "ai-finops@company.com"
    ],
    "policy_on_cap_reached": "block_premium_models"
  }'
```

## 8.8 Bill preview in Billing Overview

GitHub provides **bill preview** since early May 2026 so orgs can project June cost before transition.

### How to access

```
Organization → Settings → Billing → AI Usage → Preview for June 2026
```

The preview shows:

- Projected June cost based on May consumption in PRUs
- Conversion to new metric (AI Credits)
- Top 10 users by consumption
- Top 10 features by consumption
- Model distribution

### How to interpret

The difference between current charge and preview signals action priority:

**Scenario 1: Equal or less**
```
Current (PRU): $9,500/month
Preview (tokens): $9,200/month

Meaning: disciplined usage already exists
Action: institutionalize, maintain
```

**Scenario 2: 0-30% increase**
```
Current: $9,500/month
Preview: $11,500/month (+21%)

Meaning: normal non-optimized usage
Action: apply this playbook in 60-90 days, expect to bring below baseline
```

**Scenario 3: 30-100% increase**
```
Current: $9,500/month
Preview: $15,000/month (+58%)

Meaning: premium in long agentic workflows
Action: immediate focus on complexity routing and prompt caching
       Quick wins in 2-4 weeks
```

**Scenario 4: >100% increase**
```
Current: $9,500/month
Preview: $25,000/month (+163%)

Meaning: Opus in agent mode without discipline
Action: immediate corrective before June 1
       Serious operational risk if nothing is done
```

## 8.9 Emergency rollback options

If something goes wrong post-June 1 (overage well above expected, operational problem), there are emergency rollback options.

### Option 1: Block premium models temporarily

```
Settings → Copilot → Allowed Models
  Disable all premium models temporarily
  Keep only: GPT-4.1, GPT-5 mini (bundled)
  
Result: team continues productive with bundled, zero additional cost
Application time: immediate
```

### Option 2: Reduce paid usage cap

```
Settings → Copilot → Premium Request Paid Usage
  Reduce cap to 50% of current
  
Result: limits overage automatically
```

### Option 3: Pause problematic feature

Identify the problematic feature/team via dashboards:

```
Dashboard shows: copilot-coding-agent spent 80% of budget in 5 days
  
Action: disable Copilot Coding Agent at org level temporarily
  Settings → Copilot → Coding Agent → Disabled
  
Investigate root cause, adjust configuration, re-enable
```

### Option 4: Emergency migration to direct Anthropic API

In extreme cases, migrating critical workloads to direct Anthropic API (with your own account, outside Copilot) can give:

- Direct pricing (no markup)
- More aggressive caching
- Full control over tokens

See [09 · Migration](./09_migration_strategy.md) for that alternative path.

## 8.10 Conclusion and next steps

You now understand:

- **The 7 concrete changes**: PRUs retired, AI Credits active, fallback removed, code review doubles
- **GitHub AI Credits explained**: conversion formula, monthly reset, behavior at zero
- **Complete pricing table post-June** by model
- **Multipliers for annual plans**: 3.6× to 6× increase, 3 paths for annual subscribers
- **Why happened now**: architectural cause, not commercial
- **Impacts by persona**: Pro, Pro+, Business 50, Enterprise 500+
- **How to enable paid usage policy**: 5 detailed steps + API
- **Bill preview**: 4 interpretation scenarios
- **Emergency rollback**: 4 options for critical situations

In the next chapter, [09 · Migration · strategy, calendar, and decisions](./09_migration_strategy.md), we deepen the critical 16-week timeline, decisions for annual plans, CIO playbook in 4 phases, and how to communicate and train internally.

---

## References for this chapter

- [GitHub Blog · Pricing transition (April 2026)](https://github.blog/news-insights/product-news/)
- [GitHub Docs · Copilot billing](https://docs.github.com/en/copilot/managing-copilot/managing-copilot-as-an-individual-subscriber/about-billing-for-github-copilot)
- [GitHub Docs · GitHub AI Credits](https://docs.github.com/en/copilot)
- Mario Rodriguez, GitHub CPO. Transition announcement (April 2026).

---

**Previous chapter**: ← [07 · Token-efficient strategies](./07_token_efficient_strategies.md)
**Next chapter**: [09 · Migration · strategy, calendar, and decisions](./09_migration_strategy.md) →
**Back to index**: [00 · README](./00_README_INDEX.md)
