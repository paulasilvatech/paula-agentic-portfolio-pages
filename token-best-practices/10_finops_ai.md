---
title: "10 · FinOps for AI"
description: "Governance at scale: Inform/Optimize/Operate, metrics, showback/chargeback, observability with OpenTelemetry, FOCUS export, FinOps Hub, Power BI, Grafana"
author: "Paula Silva"
role: "Software Global Black Belt"
contact: "paulasilva@microsoft.com"
date: "2026-05-04"
version: "2.0.0"
status: "approved"
language: "en"
chapter: 10
part: "IV · Governance and operations"
tags: ["finops", "observability", "opentelemetry", "focus", "power-bi", "grafana"]
---

# 10 · FinOps for AI

> Without data, optimization is guessing. FinOps for AI is the discipline of instrumenting, measuring, optimizing, and operating AI with the same rigor we apply to other cloud resources. This chapter gives you the three phases (Inform/Optimize/Operate), key metrics, showback/chargeback patterns, and complete observability implementation with OpenTelemetry, FOCUS export, FinOps Hub, Power BI, and Grafana.

## 10.1 Inform, Optimize, Operate · the three FinOps Foundation phases

The [FinOps Foundation](https://www.finops.org/) defines three iterative phases that every organization passes through in its FinOps journey. **Each phase has specific objectives, capabilities, and deliverables.**

### Phase 1: Inform

**Objective**: granular visibility. Who uses, how much, with which model, in which feature.

**Necessary capabilities:**
- Telemetry per request (model, tokens, user, feature)
- Aggregation and dashboards (rolling 30 days, top users, top features)
- Cost allocation (tags, cost centers, projects)
- Reporting (weekly operational, monthly executive)

**Without data, there is no optimization.** Inform is the prerequisite of everything.

**Typical stack:**

```
Applications with Copilot
    ↓ (telemetry via OpenTelemetry)
Application Insights / OTLP collector
    ↓
Azure Cost Management
    ↓ (FOCUS export)
Storage Account
    ↓
FinOps Hub (Microsoft toolkit)
    ↓
Power BI / Grafana (visualization)
```

### Phase 2: Optimize

**Objective**: identify specific opportunities. Inefficient prompts, poorly chosen models, lack of cache, untrained teams.

**Necessary capabilities:**
- Anomaly detection (consumption out of pattern)
- Pattern recognition (top consumers, outliers)
- A/B testing of prompts
- Recommendations engine

**Each optimization has estimable payback.** "Applying caching reduces 40% input cost" is measurable and attributable.

**Typical quick wins by impact order** (chapter 13):

1. Complexity routing: 40-70% average reduction
2. Prompt caching: 60-80% reduction in input
3. Subagent fan-out: 70-90% in iterative workflows
4. Tool result clearing: 30-50% in long sessions
5. Lean tool design: 30-60%
6. System prompt audit: 10-30%
7. Stop criteria: prevents overrun
8. Structured compaction: 20%+

### Phase 3: Operate

**Objective**: continuous improvement cycle. Monthly FinOps meetings, leadership reporting, budget adjustments, retraining.

**Necessary capabilities:**
- Recurring meetings with stakeholders
- Continuously updated KPI dashboards
- Policy and budget adjustment based on data
- Continuous training and enablement

### Maturity over time

Maturation is not in days, it is in months. Typical iteration:

- **Month 1**: establish baseline (Inform). How much do we consume today? Where?
- **Month 2-3**: start seeing savings (Optimize). Quick wins first.
- **Month 4-6**: institutionalize (Operate). Continuous improvement cycle established.
- **Month 6+**: maturity. Showback evolves to chargeback. Data-driven decisions.

## 10.2 Key metrics · cost-per-token, cost-per-feature, cost-per-user

Five metrics to instrument from day 1. Each one answers a different question.

### Metric 1: Cost per 1K tokens

**Definition**: total spend / (total tokens consumed / 1,000)

**Question it answers**: "Are we paying the fair average price per 1K tokens given our model mix?"

**Enterprise target**: decreasing trend month over month.

```python
def cost_per_1k_tokens(period_data):
    total_spend = sum(call["cost_usd"] for call in period_data)
    total_tokens = sum(
        call["input_tokens"] + call["output_tokens"] + call["cached_tokens"]
        for call in period_data
    )
    return total_spend / (total_tokens / 1000)

# Typical targets by mix:
# Mix 100% Sonnet: ~$0.005/1K tokens (baseline)
# Mix balanced (70% bundled, 25% Sonnet, 5% Opus): ~$0.002/1K
# Mix premium-heavy (20% bundled, 50% Sonnet, 30% Opus): ~$0.012/1K
```

**Decreasing trend** indicates:
- More cache (cache reads cost 10% of input)
- Efficient routing (more bundled, less premium)
- Context engineering (fewer tokens per outcome)

### Metric 2: Cost per feature

**Definition**: aggregated feature cost divided by usage (e.g., per PR reviewed)

**Question it answers**: "Is this AI feature giving ROI?"

**Target**: comparable with business value.

```python
def cost_per_feature(feature_name, period_data):
    feature_calls = [c for c in period_data if c["feature"] == feature_name]
    total_cost = sum(c["cost_usd"] for c in feature_calls)
    total_uses = len({(c["session_id"]) for c in feature_calls})  # unique sessions
    return total_cost / total_uses

# Examples:
# code-review feature: $0.50 per PR reviewed
# auto-test-gen feature: $0.20 per test file generated
# refactor-assist feature: $1.20 per refactor session
```

Compare with value: if code-review costs $0.50 and identifies on average 1 critical bug every 5 PRs, the value is clear.

### Metric 3: Cost per user

**Definition**: average cost per active user

**Question it answers**: "Who are the outliers that deserve attention (training, behavior review)?"

```python
def cost_per_user(period_data):
    by_user = defaultdict(float)
    for call in period_data:
        by_user[call["user_id"]] += call["cost_usd"]
    
    # Distribution
    costs = list(by_user.values())
    avg = sum(costs) / len(costs)
    p50 = statistics.median(costs)
    p90 = statistics.quantiles(costs, n=10)[-1]
    p99 = statistics.quantiles(costs, n=100)[-1]
    
    return {
        "avg": avg,
        "p50": p50,
        "p90": p90,
        "p99": p99,
        "by_user": dict(sorted(by_user.items(), key=lambda x: -x[1])),
    }

# Focus on outliers:
# Top 10% (p90) typically consumes 40-50% of total
# Top 1% (p99) can consume 10-15% alone
# Investigate outliers: are they doing legitimate work? Need training?
```

### Metric 4: Cache hit rate

**Definition**: % of tokens read from cache vs regular input

**Question it answers**: "Are we applying prompt caching effectively?"

**Target**: >60% in conversational workloads.

```python
def cache_hit_rate(period_data):
    total_input = 0
    cached_reads = 0
    
    for call in period_data:
        total_input += call["input_tokens"] + call["cached_read_tokens"]
        cached_reads += call["cached_read_tokens"]
    
    return cached_reads / total_input if total_input > 0 else 0

# Targets:
# < 30%: cache poorly applied, clear opportunity
# 30-60%: initial application, can improve
# 60-85%: well applied
# > 85%: great, hard ceiling in diverse workloads
```

If hit rate is low, investigate:
- Anti-patterns in system prompt (ch. 5.5)
- Prefixes below minimum size
- Incorrect TTLs for usage pattern

### Metric 5: Output/input ratio

**Definition**: output tokens / input tokens

**Question it answers**: "Are models generating responses proportional to input?"

**Healthy target**: 0.1 to 0.3 (i.e., output is 10% to 30% of input).

```python
def output_input_ratio(period_data):
    total_input = sum(c["input_tokens"] for c in period_data)
    total_output = sum(c["output_tokens"] for c in period_data)
    return total_output / total_input

# Interpretation:
# < 0.05: very short responses, may be truncating
# 0.05 - 0.15: concise responses, generally good
# 0.15 - 0.30: detailed responses, ok for code generation
# > 0.30: verbose model, or poorly formulated prompt
# > 0.50: red flag, output disproportionate to input
```

Output/input high signals:
- Verbose model (ask for conciseness in prompt)
- Generation task (code, documentation) where high ratio is natural
- Poorly formulated prompt (model "explains too much")

## 10.3 Showback and chargeback

Two classic strategies to create cost accountability. **Showback is the starting point in any org.**

### Showback (soft)

**What it is**: shows each team the cost it generated, **without charging**.

**Mechanics**: dashboards and reports attributed to cost centers, but without real financial impact.

**Why it works**: creates visibility. Most teams have no idea how much they consume in tokens. Showback fixes that. Behavior changes when the number is seen.

**Advantages:**
- Initial stage, no financial friction
- Builds awareness culture
- Easy to implement
- Allows adjustments before "really charging"

**How to implement:**

```
Month 1-3: showback for tech leads (private)
Month 4-6: showback for engineering managers
Month 6+: public showback between teams (constructive peer pressure)
```

### Chargeback (firm)

**What it is**: actually debits the cost from the team's budget.

**Mechanics**: team's cost center is debited monthly based on real consumption.

**Why it works**: creates direct financial responsibility. Team that consumes too much feels it in the budget.

**Advantages:**
- Behavior reinforced by financial incentive
- Teams prioritize real optimization
- Model decisions gain economic dimension

**Prerequisites:**
- Consistent tagging (each call has cost center attribution)
- Mature showback (>6 months of history)
- Agreement between finance and engineering

### When to move from showback to chargeback

| Readiness signal                                | Chargeback OK?  |
|-------------------------------------------------|-----------------|
| Showback running for <3 months                  | No              |
| Inconsistent tagging (>10% of calls untagged)   | No              |
| Teams resistant to showback                     | No              |
| Showback running for 6+ months, reliable data   | Yes             |
| Teams already act in response to showback       | Yes             |
| Finance and engineering aligned                 | Yes             |

### Gradual chargeback

Don't go from 0 to 100. Do gradual:

```
Month 7: chargeback of 25% of consumption (75% still absorbed by org)
Month 8: 50%
Month 9: 75%
Month 10: 100%
```

Allows adjustments and avoids cultural shock.

## 10.4 Budgets, alerts, and anomaly detection

Four levels of control, from softest to most invasive.

### Level 1: Budget alerts (soft)

**What it does**: notifications at 50%, 75%, 90% of budget. Signal to react, do not stop work.

**When to use**: always. Baseline of every budget.

**Configuration:**

```yaml
budget_alerts:
  - threshold_percent: 50
    recipients: [tech-lead@company.com]
    message: "Monthly budget at 50%. Reviewing consumption is prudent."
  
  - threshold_percent: 75
    recipients: [tech-lead@company.com, eng-manager@company.com]
    message: "Budget at 75%. Identify outliers and review policy."
  
  - threshold_percent: 90
    recipients: [tech-lead@company.com, eng-manager@company.com, vp-eng@company.com]
    message: "Budget at 90%. Immediate corrective action."
```

### Level 2: Budget caps (medium)

**What it does**: when reaching 100%, **interrupts premium models but continues bundled**. Keeps team productive.

**When to use**: when overage is not acceptable but you don't want to stop work.

**GitHub configuration:**

```
Settings → Copilot → Premium Request Paid Usage
  Policy: enabled_with_cap
  Monthly cap: $5,000
  At cap reached: block_premium_models
```

Bundled models (GPT-4.1, GPT-5 mini) continue working. Devs lose access to Sonnet/Opus/Gemini Pro until next month.

### Level 3: Hard limits (hard)

**What it does**: stops everything until next period start.

**When to use**: rarely. Only in cases where overage cannot happen **at all** (e.g., fixed POC budget, contract with client).

**Configuration:**

```
Policy: hard_limit
At cap reached: block_all_copilot_features
```

Even bundled is blocked. Devs need to use classic autocomplete.

### Level 4: Anomaly detection (proactive)

**What it does**: algorithms compare current consumption with history, flag deviations. Allows investigation before overrun.

**How it works:**

```python
def detect_anomalies(daily_data: list[dict], window: int = 30):
    """Detects days with anomalous consumption."""
    if len(daily_data) < window:
        return []
    
    # Basic statistics
    historical = daily_data[:-1][-window:]
    historical_costs = [d["cost"] for d in historical]
    
    mean = statistics.mean(historical_costs)
    stdev = statistics.stdev(historical_costs)
    
    # Threshold: 3 sigma above mean
    threshold = mean + 3 * stdev
    
    anomalies = []
    today = daily_data[-1]
    if today["cost"] > threshold:
        anomalies.append({
            "date": today["date"],
            "actual": today["cost"],
            "expected_max": threshold,
            "deviation_sigma": (today["cost"] - mean) / stdev,
        })
    
    return anomalies
```

**Typical anomaly investigation:**

1. Day X had consumption 4.5σ above mean
2. Drill-down: top 10 users on that day
3. Identifies: 1 user consumed 80% of the day
4. Drill-down: features/sessions of that user
5. Identifies: ran Coding Agent 50 times in loop due to bug
6. Action: temporarily block user, investigate, fix

**Automated anomaly detection** prevents these situations from reaching end of month.

## 10.5 Observability · what to instrument

Without instrumentation, all the metrics above are impossible. Here's how to instrument enterprise-grade.

### Layer 1: Telemetry per request

For each LLM call, capture:

- **Request metadata**: timestamp, request_id, session_id, user_id, team_id, feature_id
- **Model info**: provider, model_name, mode (ask/edit/agent/plan)
- **Tokens**: input, output, cached_read, cached_write_5m, cached_write_1h
- **Latency**: time_to_first_token, total_latency
- **Outcome**: success, error_code, retry_count
- **Cost**: cost_usd, ai_credits_consumed
- **Tools**: tool_calls_count, tool_results_total_tokens

### Implementation with OpenTelemetry

OpenTelemetry is the industry standard. Works in any backend (Application Insights, Datadog, Honeycomb, Grafana, etc.).

**Setup Python:**

```bash
pip install opentelemetry-api opentelemetry-sdk \
  opentelemetry-exporter-otlp \
  opentelemetry-instrumentation-anthropic
```

```python
# telemetry_setup.py
from opentelemetry import trace, metrics
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.exporter.otlp.proto.grpc.metric_exporter import OTLPMetricExporter
from opentelemetry.sdk.resources import Resource

def setup_telemetry(service_name: str):
    resource = Resource.create({
        "service.name": service_name,
        "service.namespace": "github-copilot-tracking",
        "deployment.environment": os.getenv("ENV", "production"),
    })
    
    # Traces
    tracer_provider = TracerProvider(resource=resource)
    tracer_provider.add_span_processor(
        BatchSpanProcessor(OTLPSpanExporter(endpoint=os.getenv("OTLP_ENDPOINT")))
    )
    trace.set_tracer_provider(tracer_provider)
    
    # Metrics
    metric_exporter = OTLPMetricExporter(endpoint=os.getenv("OTLP_ENDPOINT"))
    meter_provider = MeterProvider(resource=resource)
    metrics.set_meter_provider(meter_provider)

setup_telemetry("copilot-tracker")

tracer = trace.get_tracer(__name__)
meter = metrics.get_meter(__name__)

# Counters for key metrics
tokens_counter = meter.create_counter(
    "llm.tokens",
    description="Tokens consumed",
    unit="token"
)
cost_counter = meter.create_counter(
    "llm.cost_usd",
    description="Cost in USD",
    unit="USD"
)
calls_counter = meter.create_counter(
    "llm.calls",
    description="Number of LLM calls",
    unit="call"
)
```

**Usage:**

```python
async def instrumented_llm_call(
    prompt: str,
    model: str,
    user_id: str,
    feature_id: str,
):
    with tracer.start_as_current_span("llm.call") as span:
        span.set_attributes({
            "llm.model": model,
            "llm.user_id": user_id,
            "llm.feature_id": feature_id,
        })
        
        try:
            response = await call_llm(prompt, model)
            
            # Record metrics
            attrs = {
                "model": model,
                "user_id": user_id,
                "feature_id": feature_id,
            }
            
            tokens_counter.add(
                response.usage.input_tokens,
                {**attrs, "type": "input"}
            )
            tokens_counter.add(
                response.usage.output_tokens,
                {**attrs, "type": "output"}
            )
            tokens_counter.add(
                response.usage.cache_read_input_tokens,
                {**attrs, "type": "cached_read"}
            )
            
            cost_usd = calculate_cost(response.usage, model)
            cost_counter.add(cost_usd, attrs)
            calls_counter.add(1, attrs)
            
            span.set_attributes({
                "llm.tokens.input": response.usage.input_tokens,
                "llm.tokens.output": response.usage.output_tokens,
                "llm.tokens.cached": response.usage.cache_read_input_tokens,
                "llm.cost_usd": cost_usd,
            })
            
            return response
        except Exception as e:
            span.record_exception(e)
            span.set_status(trace.Status(trace.StatusCode.ERROR))
            raise
```

### Layer 2: Aggregation and dashboards

After telemetry is in backend (Application Insights, etc.), build aggregations and dashboards.

**Standard dashboard for tech leads:**

```
┌─────────────────────────────────────────────────────────┐
│ Copilot Usage · Last 30 Days                            │
│                                                         │
│ Total spend:           $12,450  (+8% vs prev 30 days) │
│ Total tokens:          850M     (+12%)                  │
│ Cost per 1K tokens:    $0.0146  (-3%)                   │
│                                                         │
│ Top consumers (users):                                  │
│   user_alice    $1,200   (9.6%)                        │
│   user_bob      $890     (7.1%)                        │
│   user_carol    $650     (5.2%)                        │
│   ...                                                   │
│                                                         │
│ Top features:                                           │
│   coding_agent  $4,500   (36%)                         │
│   chat          $3,200   (26%)                         │
│   edit_mode     $2,400   (19%)                         │
│                                                         │
│ Cache hit rate:        72%      (target: >60%)         │
│ Output/input ratio:    0.18     (target: 0.1-0.3)      │
│ Anomalies detected:    2        [click to investigate]  │
└─────────────────────────────────────────────────────────┘
```

## 10.6 FOCUS export and Azure Cost Management

Microsoft provides FOCUS-compliant pipeline that connects GitHub billing to Azure Cost Management for unified analysis.

### What is FOCUS

[FOCUS (FinOps Open Cost & Usage Specification)](https://focus.finops.org/) is a standard schema for cost management exports, maintained by FinOps Foundation. Allows unified analysis between multiple providers.

### Setup FOCUS export for GitHub Copilot

```yaml
# Azure Cost Management → Exports → New export
exportConfiguration:
  type: FocusCost
  source: github_copilot_billing
  destination:
    storageAccount: "myorgfinopsdata"
    container: "focus-exports"
    folder: "copilot/{Year}/{Month}"
  schedule:
    frequency: Daily
    startDate: 2026-06-01
  format: Parquet
```

### Structure of FOCUS data

```
focus_exports/
  copilot/
    2026/06/
      day=01/data.parquet
      day=02/data.parquet
      ...
```

FOCUS-compliant schema:

```
BillingAccountId, BillingAccountName, BillingPeriodStart, BillingPeriodEnd,
ChargePeriodStart, ChargePeriodEnd, ServiceName, ResourceId, ResourceName,
ConsumedQuantity, ConsumedUnit, EffectiveCost, ListUnitPrice,
ProviderName, PublisherName, RegionId, ResourceType,
SkuId, SkuPriceId, Tags, UsageQuantity, ...
```

### Analysis via Power BI or KQL

FOCUS data can be consumed directly in Power BI or queried via KQL:

```kql
// KQL: top 10 cost centers in June
GitHubCopilotUsage
| where TimeGenerated >= datetime(2026-06-01)
| where TimeGenerated < datetime(2026-07-01)
| extend CostCenter = tostring(parse_json(Tags).cost_center)
| summarize TotalCost = sum(EffectiveCost) by CostCenter
| top 10 by TotalCost desc
```

## 10.7 FinOps Hub deploy

[Microsoft FinOps Hub](https://github.com/microsoft/finops-toolkit) is an open source toolkit that automates enterprise cost management setup. Includes Power BI templates, dashboards, and queries.

### Deploy step-by-step

**Prerequisites:**
- Azure subscription
- Azure CLI installed
- PowerShell 7+
- Permissions: Owner or Contributor on subscription

**Step 1: Clone the toolkit**

```bash
git clone https://github.com/microsoft/finops-toolkit.git
cd finops-toolkit/src/templates/finops-hub
```

**Step 2: Deploy via ARM template**

```bash
# Deploy main hub
az deployment sub create \
  --location "eastus2" \
  --template-file finops-hub.bicep \
  --parameters \
    hubName="myorg-finops-hub" \
    storageSku="Standard_LRS" \
    tags='{"environment":"prod","team":"finops"}'
```

**Step 3: Configure exports**

After deploy, configure exports in Azure Cost Management:

```bash
# Export FOCUS data to created storage account
az costmanagement export create \
  --name "github-copilot-focus" \
  --scope "/subscriptions/{sub-id}" \
  --type "FocusCost" \
  --recurrence Daily \
  --recurrence-period from="2026-06-01" to="2026-12-31" \
  --storage-account-id "/subscriptions/{sub-id}/resourceGroups/finops/providers/Microsoft.Storage/storageAccounts/myorgfinopshub" \
  --storage-container "exports" \
  --storage-path "copilot/" \
  --format Parquet
```

**Step 4: Import Power BI template**

FinOps Hub comes with ready Power BI template:

```
1. Open Power BI Desktop
2. File → Import → Power BI template
3. Select: finops-toolkit/src/power-bi/finops-hub-template.pbit
4. Configure data source: storage account created in Step 2
5. Refresh data
```

**Step 5: Customize for GitHub Copilot**

Add Copilot-specific fields to schema:

```
Expanded tags:
  - copilot_user
  - copilot_feature (chat, edit, agent, plan)
  - copilot_model
  - copilot_session_id
  - copilot_organization
```

## 10.8 Power BI dashboard template

FinOps Hub Power BI template includes ready dashboards. Here are the main ones.

### Dashboard 1: Executive Overview

For CFO, VP Engineering, monthly review.

```
Top metrics:
  - Total spend this month vs last month (delta %)
  - Burn rate vs budget
  - Days remaining at current rate
  - Top 5 cost drivers

Charts:
  - Line chart: cost trend daily, last 90 days
  - Stacked bar: cost per feature, monthly
  - Pie: distribution per model
  - Heatmap: cost per day of week × hour
```

### Dashboard 2: Tech Lead Operational

For tech leads, weekly review.

```
Metrics:
  - Cost per dev (avg, p50, p90)
  - Cache hit rate trend
  - Top 10 outliers (users and features)
  - Anomalies last 7 days

Tables:
  - Top consumers with drill-down
  - Top features with cost-per-use
  - Sessions with runaway cost (>$5)
```

### Dashboard 3: FinOps Detail

For FinOps engineers, daily monitoring.

```
Everything from previous +
  - Token breakdown (input/output/cached)
  - Cost per model, drill-down
  - Cache effectiveness per feature
  - Routing hit rate (% bundled vs premium)
  - Tool result inflation tracking
```

## 10.9 KQL queries for Application Insights

For teams using Application Insights, useful queries:

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
| extend Mean = avg(DailyCost), StDev = stdev(DailyCost)
| extend ZScore = (DailyCost - Mean) / StDev
| where ZScore > 3
| order by Day desc
```

## 10.10 Grafana dashboard JSON example

For teams using Grafana (alternative to Power BI), here's an example of dashboard JSON:

```json
{
  "dashboard": {
    "title": "GitHub Copilot · FinOps",
    "panels": [
      {
        "title": "Total Cost (Last 30 Days)",
        "type": "stat",
        "targets": [
          {
            "expr": "sum(increase(llm_cost_usd_total[30d]))",
            "legendFormat": "Total"
          }
        ]
      },
      {
        "title": "Cost per Feature",
        "type": "piechart",
        "targets": [
          {
            "expr": "sum by (feature) (increase(llm_cost_usd_total[7d]))"
          }
        ]
      },
      {
        "title": "Token Consumption Trend",
        "type": "graph",
        "targets": [
          {
            "expr": "sum by (type) (rate(llm_tokens_total[5m]))",
            "legendFormat": "{{type}}"
          }
        ]
      },
      {
        "title": "Cache Hit Rate",
        "type": "gauge",
        "targets": [
          {
            "expr": "sum(rate(llm_tokens_total{type=\"cached_read\"}[1h])) / sum(rate(llm_tokens_total{type=~\"input|cached_read\"}[1h]))"
          }
        ],
        "thresholds": [
          {"value": 0.3, "color": "red"},
          {"value": 0.6, "color": "yellow"},
          {"value": 0.85, "color": "green"}
        ]
      },
      {
        "title": "Top 10 Users",
        "type": "table",
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

## 10.11 Conclusion and next steps

You now understand:

- **Inform/Optimize/Operate**: the three iterative phases of FinOps Foundation
- **5 key metrics**: cost-per-token, cost-per-feature, cost-per-user, cache hit rate, output/input ratio
- **Showback vs chargeback**: start soft, evolve to firm
- **4 levels of control**: alerts, caps, hard limits, anomaly detection
- **Observability with OpenTelemetry**: complete Python/Node setup
- **FOCUS export and Azure Cost Management**: standard Microsoft pipeline
- **FinOps Hub deploy**: step-by-step with Bicep/ARM
- **Power BI templates**: 3 ready dashboards
- **KQL queries**: for Application Insights
- **Grafana JSON**: for Prometheus/Grafana teams

In the next chapter, [11 · Azure AI Foundry in the ecosystem](./11_azure_ai_foundry.md), we explore how Azure AI Foundry positions itself in the ecosystem (Foundry vs Copilot vs direct API), model catalog, prompt flow, content safety, PTU vs PAYG, and enterprise governance.

---

## References for this chapter

- [FinOps Framework v2 · finops.org](https://www.finops.org/framework/)
- [FOCUS Specification · finops.org](https://focus.finops.org/)
- [Microsoft FinOps Toolkit (open source)](https://github.com/microsoft/finops-toolkit)
- [Azure Cost Management documentation](https://learn.microsoft.com/en-us/azure/cost-management-billing/)
- [OpenTelemetry · Documentation](https://opentelemetry.io/docs/)
- [Application Insights · OpenTelemetry support](https://learn.microsoft.com/en-us/azure/azure-monitor/app/opentelemetry-overview)
- [Grafana · Documentation](https://grafana.com/docs/)

---

**Previous chapter**: ← [09 · Migration · strategy, calendar, and decisions](./09_migration_strategy.md)
**Next chapter**: [11 · Azure AI Foundry in the ecosystem](./11_azure_ai_foundry.md) →
**Back to index**: [00 · README](./00_README_INDEX.md)
