---
title: "Appendix B · Pricing reference card"
description: "Complete pricing table by model, PRU to AI Credits converter, and per-session cost calculator"
author: "Paula Silva"
role: "Software Global Black Belt"
contact: "paulasilva@microsoft.com"
date: "2026-05-04"
version: "2.0.0"
status: "approved"
language: "en"
appendix: "B"
tags: ["pricing", "reference", "calculator"]
---

# Appendix B · Pricing reference card

> Complete pricing post-June 1, 2026. Always check [docs.github.com](https://docs.github.com) and [anthropic.com/pricing](https://www.anthropic.com/pricing) for updated prices.

## B.1 Complete table by provider

### Anthropic (USD per million tokens)

| Model                | Input  | Output | Cached read | Cache write 5m | Cache write 1h |
|----------------------|--------|--------|-------------|----------------|----------------|
| Claude Haiku 4.5     | $1     | $5     | $0.10       | $1.25          | $2             |
| Claude Sonnet 4.6    | $3     | $15    | $0.30       | $3.75          | $6             |
| Claude Opus 4.5      | $15    | $75    | $1.50       | $18.75         | $30            |
| Claude Opus 4.6      | $15    | $75    | $1.50       | $18.75         | $30            |
| Claude Opus 4.7      | $15    | $75    | $1.50       | $18.75         | $30            |

### OpenAI

| Model                       | Input  | Output | Cached read |
|-----------------------------|--------|--------|-------------|
| GPT-4.1 (bundled)           | -      | -      | -           |
| GPT-5 mini (bundled)        | -      | -      | -           |
| GPT-5.1-Codex (Goldeneye)   | $3     | $12    | $0.30       |
| GPT-5                       | $10    | $30    | $1          |
| GPT-5.4                     | $10    | $30    | $1          |
| GPT-5.5                     | $10    | $30    | $1          |

### Google

| Model                        | Input  | Output | Cached read |
|------------------------------|--------|--------|-------------|
| Gemini 3 Flash               | $1     | $3     | $0.10       |
| Gemini 2.5 Pro (≤200K)       | $5     | $15    | $0.50       |
| Gemini 3.1 Pro (≤200K)       | $5     | $15    | $0.50       |
| Gemini 3.1 Pro (>200K)       | $10    | $30    | $1          |

### xAI

| Model                 | Input  | Output | Cached read |
|-----------------------|--------|--------|-------------|
| Grok Code Fast 1      | $0.50  | $2     | $0.05       |

## B.2 PRU → AI Credits conversion

For users on annual plans still in PRUs, new multiplier (3.6x to 6x).

| Model                 | Old multiplier      | New multiplier      | Increase |
|-----------------------|---------------------|---------------------|----------|
| Claude Opus 4.7       | 7.5×                | 27×                 | 3.6×     |
| Claude Sonnet 4.6     | 1.25×               | 4.5×                | 3.6×     |
| GPT-5.5               | 7.5×                | similar             | 3.6×     |
| GPT-5                 | 7.5×                | similar             | 3.6×     |
| GPT-5.3 Codex         | 1×                  | 6×                  | 6×       |
| Gemini 3.1 Pro        | 1×                  | 6×                  | 6×       |

**Always check exact table on docs.github.com.**

## B.3 Capacity per plan

```
Copilot Free:        Limited (sample)
Copilot Pro:         $10/month  → 1,000 AI Credits/month
Copilot Pro+:        $39/month  → 3,900 AI Credits/month
Copilot Business:    $19/usr   → 1,900 Credits/usr/month
Copilot Enterprise:  $39/usr   → 3,900 Credits/usr/month
```

## B.4 Per-session cost calculator

### Simple Python calculator

```python
def session_cost_estimate(
    input_tokens: int,
    output_tokens: int,
    model: str,
    cache_hit_rate: float = 0,  # 0 to 1
) -> dict:
    """Estimates session cost."""
    
    pricing = {
        "haiku-4-5":    {"input": 1, "output": 5, "cached": 0.10},
        "sonnet-4-6":   {"input": 3, "output": 15, "cached": 0.30},
        "opus-4-7":     {"input": 15, "output": 75, "cached": 1.50},
        "gpt-5-codex":  {"input": 3, "output": 12, "cached": 0.30},
        "gpt-5":        {"input": 10, "output": 30, "cached": 1.0},
        "gemini-flash": {"input": 1, "output": 3, "cached": 0.10},
        "gemini-pro":   {"input": 5, "output": 15, "cached": 0.50},
    }
    
    p = pricing[model]
    
    # Cache split
    cached_input = input_tokens * cache_hit_rate
    fresh_input = input_tokens * (1 - cache_hit_rate)
    
    cost = (
        fresh_input * p["input"] / 1_000_000
        + cached_input * p["cached"] / 1_000_000
        + output_tokens * p["output"] / 1_000_000
    )
    
    credits = cost * 100
    
    return {
        "cost_usd": round(cost, 4),
        "ai_credits": round(credits, 2),
        "breakdown": {
            "fresh_input_cost": round(fresh_input * p["input"] / 1_000_000, 4),
            "cached_input_cost": round(cached_input * p["cached"] / 1_000_000, 4),
            "output_cost": round(output_tokens * p["output"] / 1_000_000, 4),
        }
    }

# Examples
print(session_cost_estimate(50000, 5000, "sonnet-4-6", cache_hit_rate=0.7))
# {'cost_usd': 0.0995, 'ai_credits': 9.95, 'breakdown': {...}}
```

### Simple JavaScript calculator

```javascript
function sessionCostEstimate(inputTokens, outputTokens, model, cacheHitRate = 0) {
  const pricing = {
    "haiku-4-5":    { input: 1, output: 5, cached: 0.10 },
    "sonnet-4-6":   { input: 3, output: 15, cached: 0.30 },
    "opus-4-7":     { input: 15, output: 75, cached: 1.50 },
    "gpt-5-codex":  { input: 3, output: 12, cached: 0.30 },
    "gpt-5":        { input: 10, output: 30, cached: 1.0 },
    "gemini-flash": { input: 1, output: 3, cached: 0.10 },
    "gemini-pro":   { input: 5, output: 15, cached: 0.50 },
  };
  
  const p = pricing[model];
  const cachedInput = inputTokens * cacheHitRate;
  const freshInput = inputTokens * (1 - cacheHitRate);
  
  const cost = (
    freshInput * p.input / 1_000_000
    + cachedInput * p.cached / 1_000_000
    + outputTokens * p.output / 1_000_000
  );
  
  return {
    costUsd: cost.toFixed(4),
    aiCredits: (cost * 100).toFixed(2),
  };
}
```

## B.5 Estimates for common profiles

### Profile 1: Short chat

```
Input: 2K tokens, Output: 200 tokens, no cache
Sonnet 4.6: $0.009
Opus 4.7:   $0.045
Haiku 4.5:  $0.003
```

### Profile 2: Edit mode

```
Input: 8K, Output: 1.5K, cache hit 50%
Sonnet 4.6: $0.039
Opus 4.7:   $0.195
```

### Profile 3: Agent mode (complete session)

```
Cumulative input: 500K, Output: 50K, cache hit 75%
Sonnet 4.6: $1.50
Opus 4.7:   $7.50
```

### Profile 4: Plan mode with Opus + Execute with Sonnet

```
Plan: Input 10K, Output 1K with Opus
Execute: Input 50K, Output 5K with Sonnet, cache hit 80%
Total: $0.225 (Plan) + $0.180 (Execute) = $0.405
```

## B.6 Total capacity per plan in typical sessions

| Plan                       | AI Credits/month | Sonnet sessions | Opus sessions |
|----------------------------|------------------|-----------------|---------------|
| Pro ($10)                  | 1,000            | ~250            | ~50           |
| Pro+ ($39)                 | 3,900            | ~975            | ~195          |
| Business 50 devs           | 95,000           | ~23,000         | ~4,700        |
| Enterprise 500 devs        | 1,950,000        | ~487,500        | ~97,500       |

**Assuming typical mix profile (profiles 1, 2, 3 above).**

---

**Back to index**: [00 · README](./00_README_INDEX.md)
