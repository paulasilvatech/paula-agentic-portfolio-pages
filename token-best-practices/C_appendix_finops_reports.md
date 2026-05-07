---
title: "Appendix C · FinOps report templates"
description: "Weekly and monthly templates, Power BI dashboards, KQL queries for Application Insights, JSON for Grafana"
author: "Paula Silva"
role: "Software Global Black Belt"
contact: "paulasilva@microsoft.com"
date: "2026-05-04"
version: "2.0.0"
status: "approved"
language: "en"
appendix: "C"
tags: ["finops", "reports", "templates", "power-bi", "grafana", "kql"]
---

# Appendix C · FinOps report templates

> Templates tested in enterprise pilots. Copy, adapt to your context and cadence.

## C.1 Weekly report · operational

For tech leads, FinOps engineers. Cadence: every Monday.

```markdown
# Copilot Usage · Week of [DATE]

## Summary

- **Total spend**: $X (vs $Y last week, +/-Z%)
- **Total tokens**: NM (vs N last week, +/-Z%)
- **Cost per 1K tokens**: $X.XXXX (target: <$0.005)
- **Cache hit rate**: X% (target: >60%)

## Top 10 consumers

| User              | Cost    | Sessions | Avg cost/session |
|-------------------|---------|----------|------------------|
| user_alice        | $245    | 38       | $6.45            |
| user_bob          | $178    | 22       | $8.09            |
| ...               |         |          |                  |

**Action**: review user_bob with tech lead (avg $8/session is high).

## Top 5 features

| Feature           | Cost    | Pct of total |
|-------------------|---------|--------------|
| coding_agent      | $1,200  | 40%          |
| chat              | $850    | 28%          |
| ...               |         |              |

## Anomalies detected

- 2026-MM-DD: spike in coding_agent (+85% vs average)
  - Investigated: 1 session with 50 iterations in loop
  - Action: bug fixed, stop criteria adjusted

## Models distribution

- Bundled (free):    65% of calls
- Sonnet 4.6:        25% of calls
- Opus 4.7:           7% of calls
- Gemini Pro:         3% of calls

## Alerts triggered

- ✓ 50% budget alert: 2026-MM-DD (expected)
- ✓ 75% budget alert: 2026-MM-DD (expected)
- (none others)

## Action items

- [ ] User user_bob: review coding patterns, possible training
- [ ] Feature coding_agent: reduce default iterations from 50 to 30
- [ ] Cache hit rate dropped from 68% to 55%: investigate cause
```

## C.2 Monthly report · executive

For CFO, VP Engineering, monthly review with leadership.

```markdown
# Copilot Usage · [Month YYYY]

## Executive summary

[Month] cost was $X, [+/-Z%] vs [previous month]. [Key insight in one sentence.]

## Financial overview

| Metric                  | This month | Last month | Trend  |
|-------------------------|-----------|------------|--------|
| Total spend             | $X        | $Y         | +/-Z%  |
| Cost per dev (avg)      | $X        | $Y         | +/-Z%  |
| Cost per 1K tokens      | $X.XXXX   | $X.XXXX    | +/-Z%  |
| Budget utilization      | X%        | Y%         |        |

## Distribution

### By cost center

| Cost center          | Cost    | Pct  |
|----------------------|---------|------|
| Engineering Core     | $4,500  | 35%  |
| Engineering Platform | $3,200  | 25%  |
| Engineering Product  | $2,800  | 22%  |
| Data Science         | $1,800  | 14%  |
| Other                | $500    | 4%   |

### By model

| Model               | Cost    | Pct of premium |
|---------------------|---------|----------------|
| Sonnet 4.6          | $7,500  | 58%            |
| Opus 4.7            | $3,200  | 25%            |
| Gemini Pro          | $1,500  | 12%            |
| Haiku 4.5           | $600    | 5%             |

## Optimization wins

- ✓ Complexity-based routing implemented: 35% reduction in Opus calls
- ✓ Prompt caching audit: cache hit rate 45% → 70%
- ✓ Tool result clearing: agent sessions 30% cheaper

## Areas of concern

- ⚠️ User outliers: top 5% consume 35% (investigate)
- ⚠️ Coding agent overhead: avg session $4.50 (target: $2)

## Plans for next month

- [ ] 4h workshop for tech leads (ch. 09)
- [ ] Custom prompts in .github/prompts/ for top 5 features
- [ ] Anomaly detection with auto-remediation

## ROI

- Estimated cost without playbook: $18,000
- Actual cost with playbook: $12,800
- **Savings: $5,200/month ($62K/year)**
```

## C.3 Power BI dashboard templates

### Dashboard 1: Executive Overview

Main components:

```
┌─────────────────────────────────────────────────────┐
│ Copilot · Executive Overview                        │
├─────────────────────────────────────────────────────┤
│                                                      │
│  TOTAL SPEND      vs LAST MONTH    BUDGET UTIL      │
│  $12,800          +8%              68%               │
│                                                      │
│  ┌────────────────────────────┐  ┌────────────────┐│
│  │ Cost trend daily, last 90d │  │ Cost by model  ││
│  │ [line chart]               │  │ [pie chart]    ││
│  └────────────────────────────┘  └────────────────┘│
│                                                      │
│  ┌────────────────────────────┐  ┌────────────────┐│
│  │ Top 5 cost drivers         │  │ Days remaining ││
│  │ - coding_agent  $4,500     │  │ at current rate││
│  │ - chat          $3,200     │  │ 12 days        ││
│  │ - edit_mode     $2,400     │  │                ││
│  │ ...                        │  │                ││
│  └────────────────────────────┘  └────────────────┘│
└─────────────────────────────────────────────────────┘
```

### Dashboard 2: Tech Lead Operational

```
┌─────────────────────────────────────────────────────┐
│ Copilot · Tech Lead View                            │
├─────────────────────────────────────────────────────┤
│  Cost per dev (P50/P90/P99): $25 / $80 / $245       │
│  Cache hit rate: 70% (↑ from 55% last week)         │
│                                                      │
│  ┌────────────────────────────────────────────────┐│
│  │ Top 10 consumers (drill-down enabled)          ││
│  │ user        cost   sessions   avg              ││
│  │ alice       $245   38         $6.45            ││
│  │ bob         $178   22         $8.09  ⚠️         ││
│  │ ...                                            ││
│  └────────────────────────────────────────────────┘│
│                                                      │
│  ┌────────────────────────────────────────────────┐│
│  │ Sessions with runaway cost (>$5)               ││
│  │ session_id   user    cost   model              ││
│  │ s_1234       bob     $12    opus-4-7           ││
│  │ s_5678       alice   $8     sonnet-4-6         ││
│  └────────────────────────────────────────────────┘│
│                                                      │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐│
│  │ Anomalies 7d │ │ Models split │ │ Top features ││
│  │ 2 detected   │ │ [pie]        │ │ [bar]        ││
│  └──────────────┘ └──────────────┘ └──────────────┘│
└─────────────────────────────────────────────────────┘
```

### Dashboard 3: FinOps Detail

```
┌─────────────────────────────────────────────────────┐
│ Copilot · FinOps Detail                             │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Token breakdown (last 7 days):                      │
│  Input fresh:    420M  (52%)                        │
│  Input cached:   320M  (40%)                        │
│  Output:          80M  (8%)                         │
│                                                      │
│  Cache effectiveness by feature:                     │
│  chat:            85% hit rate                       │
│  coding_agent:    72% hit rate                       │
│  edit_mode:       68% hit rate                       │
│  plan_mode:       45% hit rate ⚠️                    │
│                                                      │
│  Routing efficacy:                                   │
│  Bundled chosen: 65%                                 │
│  Cheap chosen:    8%                                 │
│  Workhorse:      22%                                 │
│  Premium:         5%                                 │
│                                                      │
│  Tool result inflation:                              │
│  Avg tokens per session: 45K                         │
│  Sessions >100K tokens: 12% (target: <5%)           │
└─────────────────────────────────────────────────────┘
```

## C.4 KQL queries for Application Insights

```kql
// 1. Cost per team in last 7 days
customMetrics
| where name == "llm.cost_usd"
| where timestamp >= ago(7d)
| extend Team = tostring(customDimensions.team_id)
| summarize TotalCost = sum(value) by Team
| order by TotalCost desc

// 2. Top 10 sessions with runaway cost
customMetrics
| where name == "llm.cost_usd"
| where timestamp >= ago(24h)
| extend SessionId = tostring(customDimensions.session_id)
| summarize SessionCost = sum(value) by SessionId
| where SessionCost > 5
| top 10 by SessionCost desc

// 3. Cache hit rate per feature
customMetrics
| where timestamp >= ago(7d)
| where name in ("llm.tokens.input", "llm.tokens.cached_read")
| extend Feature = tostring(customDimensions.feature_id)
| summarize 
    Input = sumif(value, name == "llm.tokens.input"),
    Cached = sumif(value, name == "llm.tokens.cached_read")
    by Feature
| extend HitRate = Cached / (Input + Cached)
| order by HitRate asc

// 4. Anomaly detection: days with cost > 3σ
customMetrics
| where name == "llm.cost_usd"
| where timestamp >= ago(60d)
| summarize DailyCost = sum(value) by Day = bin(timestamp, 1d)
| extend Mean = avg(DailyCost) by Day
| extend StDev = stdev(DailyCost) by Day
| extend ZScore = (DailyCost - Mean) / StDev
| where ZScore > 3
| order by Day desc

// 5. Distribution of models per user
customMetrics
| where name == "llm.calls"
| where timestamp >= ago(30d)
| extend User = tostring(customDimensions.user_id)
| extend Model = tostring(customDimensions.model)
| summarize Calls = sum(value) by User, Model
| evaluate pivot(Model, sum(Calls))

// 6. Output/input ratio per feature (red flags)
customMetrics
| where timestamp >= ago(7d)
| where name in ("llm.tokens.input", "llm.tokens.output")
| extend Feature = tostring(customDimensions.feature_id)
| summarize 
    Input = sumif(value, name == "llm.tokens.input"),
    Output = sumif(value, name == "llm.tokens.output")
    by Feature
| extend Ratio = Output / Input
| where Ratio > 0.5  // potential anti-pattern
| order by Ratio desc
```

## C.5 Grafana dashboard JSON

```json
{
  "dashboard": {
    "title": "GitHub Copilot · FinOps",
    "tags": ["copilot", "finops"],
    "timezone": "browser",
    "panels": [
      {
        "id": 1,
        "title": "Total Cost (Last 30 Days)",
        "type": "stat",
        "gridPos": {"h": 4, "w": 6, "x": 0, "y": 0},
        "targets": [
          {
            "expr": "sum(increase(llm_cost_usd_total[30d]))",
            "legendFormat": "Total"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "unit": "currencyUSD",
            "color": {"mode": "thresholds"},
            "thresholds": {
              "steps": [
                {"value": 0, "color": "green"},
                {"value": 10000, "color": "yellow"},
                {"value": 20000, "color": "red"}
              ]
            }
          }
        }
      },
      {
        "id": 2,
        "title": "Cost per Feature",
        "type": "piechart",
        "gridPos": {"h": 8, "w": 12, "x": 0, "y": 4},
        "targets": [
          {
            "expr": "sum by (feature) (increase(llm_cost_usd_total[7d]))"
          }
        ]
      },
      {
        "id": 3,
        "title": "Token Consumption Trend",
        "type": "graph",
        "gridPos": {"h": 8, "w": 12, "x": 12, "y": 4},
        "targets": [
          {
            "expr": "sum by (type) (rate(llm_tokens_total[5m]))",
            "legendFormat": "{{type}}"
          }
        ]
      },
      {
        "id": 4,
        "title": "Cache Hit Rate",
        "type": "gauge",
        "gridPos": {"h": 8, "w": 8, "x": 0, "y": 12},
        "targets": [
          {
            "expr": "sum(rate(llm_tokens_total{type=\"cached_read\"}[1h])) / sum(rate(llm_tokens_total{type=~\"input|cached_read\"}[1h]))"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "unit": "percentunit",
            "min": 0,
            "max": 1,
            "thresholds": {
              "steps": [
                {"value": 0, "color": "red"},
                {"value": 0.3, "color": "yellow"},
                {"value": 0.6, "color": "green"}
              ]
            }
          }
        }
      },
      {
        "id": 5,
        "title": "Top 10 Users",
        "type": "table",
        "gridPos": {"h": 8, "w": 16, "x": 8, "y": 12},
        "targets": [
          {
            "expr": "topk(10, sum by (user_id) (increase(llm_cost_usd_total[7d])))"
          }
        ]
      }
    ]
  }
}
```

---

**Back to index**: [00 · README](./00_README_INDEX.md)
