---
title: "03 · Models and multipliers"
description: "The complete map of models in GitHub Copilot post-June, model decision per task, configuration in VS Code, GitHub Enterprise, and model routing implementation"
author: "Paula Silva"
role: "Software Global Black Belt"
contact: "paulasilva@microsoft.com"
date: "2026-05-04"
version: "2.0.0"
status: "approved"
language: "en"
chapter: 3
part: "I · Foundations"
tags: ["models", "routing", "vs-code", "github-enterprise", "litellm"]
---

# 03 · Models and multipliers

> Model is the first-order cost lever. The difference between Sonnet 4.6 and Opus 4.7 for the same task can be 5x in cost, without 5x more quality. The difference between bundled (GPT-4.1) and premium can be an order of magnitude. This chapter teaches you to choose and to implement that choice at three levels: developer (VS Code), org (GitHub Enterprise), pipeline (model routing).

## 3.1 Available model families

GitHub Copilot post-June 2026 offers four model families. Each provider has a distinct profile of capabilities, price, and fit by task type.

### OpenAI

**Available models**: GPT-4.1, GPT-5 mini, GPT-5, GPT-5.5, GPT-5.1-Codex (codename Goldeneye).

**Characteristics**:
- GPT-4.1 and GPT-5 mini are the **bundled** models (included in the plan without consuming additional AI Credits)
- GPT-5.1-Codex is optimized for code with speed tradeoff
- GPT-5 is the frontier model for hard problems
- GPT-5.5 is the most recent version, with extended context window

**When to use OpenAI**:
- Historical default of Copilot, natural fit for VS Code integration
- GPT-5.1-Codex for heavy code tasks with low latency
- GPT-5 when you need the best OpenAI model

### Anthropic

**Available models**: Claude Haiku 4.5, Sonnet 4.6, Opus 4.5, Opus 4.6, Opus 4.7.

**Characteristics**:
- Sonnet 4.6 is the **balanced workhorse** most recommended for daily code use
- Opus 4.7 is state-of-the-art in reasoning but with premium cost (US$ 15 input / US$ 75 output)
- Haiku 4.5 is fast & cheap for batch tasks
- Full support for prompt caching, extended tool use, extended thinking

**When to use Anthropic**:
- Sonnet 4.6 as default for deep code review, non-trivial debugging, multi-file refactorings
- Opus 4.7 for architecture, distributed debugging, problems with complex tradeoffs
- Haiku 4.5 for classification, extraction, low-complexity batch completions

### Google

**Available models**: Gemini 3 Flash, Gemini 2.5 Pro, Gemini 3.1 Pro.

**Characteristics**:
- **Strong on long windows (200K-1M tokens) without surcharge** up to 200K
- Gemini 3 Flash competes with Haiku on cost-benefit
- Gemini 3.1 Pro is the dominant long-context option

**When to use Google**:
- Whenever the problem requires context >100K tokens (large codebase analysis, extensive log processing, complete documentation reading)
- Gemini 3 Flash for light tasks in parallel

### xAI

**Available models**: Grok Code Fast 1.

**Characteristics**:
- Focus on routine code
- Aggressive pricing (US$ 0.50/M input)
- Good fit for code classification and low-complexity completions

**When to use xAI**:
- Classification or completions at high scale
- When cost is the dominant criterion

## 3.2 Complete pricing table post-June 1, 2026

Per million tokens, in USD. **Always check [docs.github.com](https://docs.github.com) for updated prices.**

| Model                                | Input  | Output | Cached read | Category                       |
|--------------------------------------|--------|--------|-------------|--------------------------------|
| GPT-4.1 / GPT-5 mini (bundled)       | -      | -      | -           | Default in paid plans          |
| Grok Code Fast 1                     | $0.50  | $2     | $0.05       | Routine code                   |
| Claude Haiku 4.5                     | $1     | $5     | $0.10       | Fast & cheap                   |
| Gemini 3 Flash                       | $1     | $3     | $0.10       | Cheap & long-context           |
| Claude Sonnet 4.6                    | $3     | $15    | $0.30       | **Balanced workhorse**         |
| GPT-5.1-Codex (Goldeneye)            | $3     | $12    | $0.30       | Code-optimized                 |
| Gemini 2.5 Pro / 3.1 Pro (≤200K)     | $5     | $15    | $0.50       | Long-context                   |
| GPT-5 / GPT-5.4 (≤272K)              | $10    | $30    | $1.00       | Frontier                       |
| Claude Opus 4.5 / 4.6 / 4.7          | $15    | $75    | $1.50       | **Premium / top-of-line**      |

### Conversion to AI Credits

1 AI Credit = US$ 0.01. To convert pricing directly:

```
Model                Input/M (credits)    Output/M (credits)
GPT-5 mini bundled   0 (included)         0 (included)
Haiku 4.5            100                  500
Sonnet 4.6           300                  1,500
Opus 4.7             1,500                7,500
GPT-5                1,000                3,000
Gemini 3.1 Pro       500                  1,500
```

Business plan ($19/usr/month) = 1,900 AI Credits/user/month.

## 3.3 When to use each model: heuristic and decision tree

Model choice is **the first-order cost lever**. Reduces average cost by 50-70% without perceived quality loss when well applied.

### Five-level heuristic

**Level 1: Bundled (GPT-4.1, GPT-5 mini)** · ~70% of daily work
- Code completions
- Pointed questions ("what does this error mean?")
- Simple refactorings
- Basic unit test generation
- Effectively free in the plan

**Level 2: Cheap (Haiku 4.5, Gemini 3 Flash, Grok)** · 10-15% of work
- Batch tasks (classification, extraction)
- Boilerplate at scale
- Documentation generation
- Cost US$ 1 to US$ 5/M, good quality for well-defined tasks

**Level 3: Workhorse (Sonnet 4.6, GPT-5.1-Codex)** · 10-15% of work
- Non-trivial debugging
- Complex function design
- Multi-file refactorings
- In-depth code review
- **Recommended default** when bundled is not enough

**Level 4: Premium (Opus 4.7, GPT-5)** · 1-3% of work
- Only for complex problems: architecture, distributed debugging, design tradeoffs
- **Avoid using as default for anything**
- 5-25× higher cost justifies only on irreversible decisions

**Level 5: Long-context (Gemini 3.1 Pro)** · contextual
- When the problem requires context >100K tokens
- Competitive in 200K to 1M token windows

### Complete decision tree

```
Question 1: Is the task completion or local edit?
├── YES → GPT-5 mini / GPT-4.1 (bundled, free) → STOP
└── NO → Question 2

Question 2: Does the required context exceed 100K tokens?
├── YES → Gemini 3.1 Pro (long-context, no surcharge up to 200K) → STOP
└── NO → Question 3

Question 3: Is the task classification, extraction, or batch without nuance?
├── YES → Haiku 4.5 or Gemini 3 Flash ($1-5/M) → STOP
└── NO → Question 4

Question 4: Does the task require multi-step reasoning, non-trivial debugging,
            or local architecture design?
├── YES, but limited scope → Sonnet 4.6 / GPT-5.1-Codex ($3-15/M) ← default
└── YES, genuinely complex problem
    └── Question 5: Have I already tried Sonnet and it was not enough?
        ├── YES → Opus 4.7 / GPT-5 ($10-75/M)
        └── NO → try Sonnet first
```

This tree should be internalized by the entire team. See chapter 13 for visual decision frameworks.

## 3.4 Configuring model in VS Code

GitHub Copilot in VS Code allows configuring default model and model per mode (Ask, Edit, Agent, Plan). Configuration is per user and per workspace.

### 3.4.1 Global user configuration

**Settings UI:**
1. Cmd/Ctrl + Shift + P → "Preferences: Open User Settings"
2. Search for "copilot.advanced.model"
3. Set default model

**Settings JSON** (User Settings: `~/.config/Code/User/settings.json` or `%APPDATA%\Code\User\settings.json`):

```json
{
  "github.copilot.chat.model": "claude-sonnet-4-6",
  "github.copilot.chat.askMode.model": "claude-sonnet-4-6",
  "github.copilot.chat.editMode.model": "claude-sonnet-4-6",
  "github.copilot.chat.agentMode.model": "claude-sonnet-4-6",
  "github.copilot.chat.planMode.model": "claude-opus-4-7"
}
```

**Recommended strategy:**
- **Global default**: Sonnet 4.6 (balanced workhorse)
- **Plan mode**: Opus 4.7 (worth the extra cost for planning that will be reused)
- **Edit mode**: Sonnet 4.6 (sufficient quality, controlled cost)
- **Agent mode**: Sonnet 4.6, but consider Plan mode with Opus for large tasks

### 3.4.2 Workspace configuration (.vscode/settings.json)

For specific projects, override the global default:

```json
// .vscode/settings.json (committed to the repository)
{
  "github.copilot.chat.model": "claude-sonnet-4-6",
  "github.copilot.chat.planMode.model": "claude-opus-4-7",
  "github.copilot.chat.askMode.model": "gpt-5-mini",
  "// rationale": "Sonnet for edit/agent (workhorse), Opus for Plan (plan quality), bundled for Ask (cheap quick questions)"
}
```

**Best practices:**

1. **Commit settings.json in the repository** so the entire team uses the same configuration
2. **Document the rationale** in JSON comment or in CONTRIBUTING.md
3. **For public repositories**, consider whether the model choice exposes internal strategy

### 3.4.3 Model in Copilot Coding Agent (cloud)

The GitHub Coding Agent (asynchronous delegation via "Ask Copilot to do this") runs on GitHub runners in the cloud, separate from local VS Code. Configuration is at the organization or repository level:

**Repository**: `.github/copilot-config.yml`

```yaml
# .github/copilot-config.yml
coding_agent:
  default_model: claude-sonnet-4-6
  plan_model: claude-opus-4-7
  
  # Model per task type
  task_models:
    bug_fix: claude-sonnet-4-6
    feature_implementation: claude-sonnet-4-6
    refactor: claude-sonnet-4-6
    architecture_review: claude-opus-4-7
    documentation: gpt-5-mini
    
  # Token limit to avoid runaway
  max_tokens_per_task: 500000
  max_iterations: 30
```

**Organization**: configuration in `Settings → Copilot → Coding Agent → Default Model`. Override per repository if needed.

### 3.4.4 Custom prompts and declared model

In `.github/prompts/*.prompt.md` (custom prompts), declare model explicitly in frontmatter:

```markdown
---
name: code-review-deep
description: Deep code review with focus on security and architecture
model: claude-opus-4-7
mode: ask
extended_thinking: true
---

# Deep Code Review

Do code review of the PR considering:
- Security: data leaks, authentication, authorization
- Architecture: adherence to project patterns
- Performance: hotspots and complexity
- Tests: coverage and quality

Output: severity-prioritized list of issues.
```

**Critical practice**: **every prompt should declare model explicitly**. Never leave as "whatever is selected". See [Appendix A](./A_appendix_optimized_prompts.md) for templates.

## 3.5 Configuring model in GitHub Enterprise (org policies)

In enterprise environments, model choice cannot be merely individual. There are considerations of cost, security, compliance, and audit that require centralized policies.

### 3.5.1 Models allowlist per org

**Organization Settings → Copilot → Models**

Allows defining which models the organization permits to be used. Models outside the allowlist become invisible to org users.

**Configuration via UI:**

```
Allowed Models:
  ✓ GPT-4.1 (bundled)
  ✓ GPT-5 mini (bundled)
  ✓ Claude Sonnet 4.6
  ✓ Claude Haiku 4.5
  ✓ Gemini 3.1 Pro
  ✗ Claude Opus 4.7    ← disabled by cost
  ✗ GPT-5              ← disabled by cost
  ✗ Grok Code Fast     ← disabled by compliance
```

**Configuration via GitHub API** (for automation):

```bash
# Enable/disable model via REST API
curl -X PATCH \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/orgs/{ORG}/copilot/billing/seats \
  -d '{
    "allowed_models": [
      "gpt-4.1",
      "gpt-5-mini",
      "claude-sonnet-4-6",
      "claude-haiku-4-5",
      "gemini-3.1-pro"
    ]
  }'
```

### 3.5.2 Premium request paid usage policy

The most important policy for cost control. Defines whether the organization permits premium models to consume AI Credits above the base plan, generating overage charged to the account.

**Three possible configurations:**

| Policy                            | Behavior                                                                    | Recommended for          |
|-----------------------------------|-----------------------------------------------------------------------------|--------------------------|
| `disabled`                        | Premium models always available until credits exhaust. Then blocks.          | Conservative             |
| `enabled_with_cap`                | Allows overage up to configured monthly limit                                | **Recommended default**  |
| `enabled_unlimited`               | Allows overage without limit                                                 | Only for R&D             |

**Configuration:**

`Organization Settings → Copilot → Billing → Premium Request Paid Usage`

```
Policy: enabled_with_cap
Monthly Cap: $5,000
Alert at: 50%, 75%, 90%, 100%
Alert recipients: cfo@company.com, ai-finops@company.com
```

### 3.5.3 Audit logs for model choice

GitHub Enterprise Cloud logs every model call. Configure exports for analysis:

```bash
# Export audit log for analysis
gh audit-log list \
  --org=$MY_ORG \
  --filter='action:copilot.model_invoked' \
  --since=2026-05-01 \
  --until=2026-05-31 \
  --format=json > copilot_model_usage.json

# Analysis: top 10 users by cost in Opus
jq '
  [.[] | select(.model == "claude-opus-4-7")] |
  group_by(.actor) |
  map({user: .[0].actor, calls: length, total_credits: (map(.credits_consumed) | add)}) |
  sort_by(-.total_credits) |
  .[0:10]
' copilot_model_usage.json
```

Integrate this export with FinOps Hub for continuous visibility. Details in [chapter 10](./10_finops_ai.md).

### 3.5.4 Model policy by repository type

In large organizations, it makes sense to apply different policies by repo type:

**In `.github/copilot-policy.yml`** in the org's configuration repository:

```yaml
# .github/copilot-policy.yml (special .github repository of the org)
policies:
  - name: production-services
    repositories:
      - prod-*
      - core-*
    rules:
      allowed_models: [gpt-5-mini, claude-sonnet-4-6, claude-opus-4-7]
      premium_paid_usage: enabled_with_cap
      monthly_cap_usd: 2000
      
  - name: experiments-and-pocs
    repositories:
      - experiment-*
      - poc-*
    rules:
      allowed_models: [gpt-5-mini, claude-haiku-4-5]
      premium_paid_usage: disabled
      
  - name: data-science-research
    repositories:
      - research-*
      - ml-*
    rules:
      allowed_models: [gpt-5-mini, claude-sonnet-4-6, gemini-3.1-pro]
      premium_paid_usage: enabled_with_cap
      monthly_cap_usd: 10000
```

## 3.6 Model routing implementation

For organizations that use direct Anthropic API, direct OpenAI API, or Azure AI Foundry, model routing is its own capability that needs to be implemented. Here are three approaches.

### 3.6.1 Approach 1: LiteLLM (open source, recommended)

[LiteLLM](https://github.com/BerriAI/litellm) is an open source proxy that offers unified API for 100+ providers. Includes routing, fallback, caching, rate limiting.

**Basic setup:**

```python
# requirements.txt
litellm>=1.0.0

# router_config.py
from litellm import Router

ROUTER_CONFIG = [
    # Cheap model for trivial tasks
    {
        "model_name": "trivial",
        "litellm_params": {
            "model": "openai/gpt-5-mini",
            "api_key": os.environ["OPENAI_API_KEY"],
        },
    },
    # Cheap model for batch tasks
    {
        "model_name": "routine",
        "litellm_params": {
            "model": "anthropic/claude-haiku-4-5",
            "api_key": os.environ["ANTHROPIC_API_KEY"],
        },
    },
    # Default: workhorse
    {
        "model_name": "complex",
        "litellm_params": {
            "model": "anthropic/claude-sonnet-4-6",
            "api_key": os.environ["ANTHROPIC_API_KEY"],
        },
    },
    # Premium only when necessary
    {
        "model_name": "expert",
        "litellm_params": {
            "model": "anthropic/claude-opus-4-7",
            "api_key": os.environ["ANTHROPIC_API_KEY"],
        },
    },
    # Long-context
    {
        "model_name": "long_context",
        "litellm_params": {
            "model": "vertex_ai/gemini-3.1-pro",
            "api_key": os.environ["GOOGLE_API_KEY"],
        },
    },
]

router = Router(
    model_list=ROUTER_CONFIG,
    fallbacks=[
        {"complex": ["routine"]},  # if Sonnet fails, fall to Haiku
        {"expert": ["complex"]},   # if Opus fails, fall to Sonnet
    ],
    routing_strategy="usage-based-routing",  # balances load
)
```

**Use with complexity classification:**

```python
from litellm import completion

async def classify_complexity(prompt: str) -> str:
    """Classify complexity using cheap model."""
    response = await completion(
        model="anthropic/claude-haiku-4-5",
        messages=[
            {
                "role": "system",
                "content": (
                    "Classify the complexity of this request. "
                    "Output ONLY one word: trivial, routine, complex, expert."
                )
            },
            {"role": "user", "content": prompt}
        ],
        max_tokens=10,
    )
    return response.choices[0].message.content.strip().lower()

async def route_request(prompt: str, context_size: int = 0) -> str:
    """Route request to appropriate model."""
    # Static heuristic first (no cost)
    if context_size > 100_000:
        return "long_context"
    
    # Dynamic classification
    complexity = await classify_complexity(prompt)
    
    return {
        "trivial": "trivial",
        "routine": "routine",
        "complex": "complex",
        "expert": "expert",
    }.get(complexity, "complex")  # safe default

# Complete usage
async def smart_completion(prompt: str, context: str = "") -> str:
    model_alias = await route_request(prompt, len(context.split()) * 1.3)
    response = await router.acompletion(
        model=model_alias,
        messages=[
            {"role": "system", "content": context},
            {"role": "user", "content": prompt}
        ],
    )
    return response.choices[0].message.content
```

**Cost of classification:**
- ~50 input tokens × $1/M = $0.00005
- ~5 output tokens × $5/M = $0.000025
- **Total: $0.000075 per classification**

**Pays off in any session with more than 2 turns.** Reduces average cost by 50-70% with no perceived quality loss.

### 3.6.2 Approach 2: OpenRouter

[OpenRouter](https://openrouter.ai/) is a hosted service that offers unified API with transparent pricing. Good when you don't want to maintain your own proxy.

```python
import openai

client = openai.OpenAI(
    api_key=os.environ["OPENROUTER_API_KEY"],
    base_url="https://openrouter.ai/api/v1",
)

response = client.chat.completions.create(
    model="anthropic/claude-sonnet-4-6",  # or any other provider
    messages=[{"role": "user", "content": prompt}],
)
```

**Tradeoff vs LiteLLM:**
- ✓ No own proxy maintenance
- ✓ Marketplace with 100+ models
- ✗ Extra latency (passes through OpenRouter)
- ✗ Markup over direct pricing (~5-10%)
- ✗ Less control over routing

### 3.6.3 Approach 3: Custom router

For organizations with specific requirements (detailed audit, integration with internal systems), building your own router makes sense:

```python
import asyncio
from dataclasses import dataclass
from enum import Enum
from typing import Any

class ModelTier(Enum):
    BUNDLED = "bundled"
    CHEAP = "cheap"
    WORKHORSE = "workhorse"
    PREMIUM = "premium"
    LONG_CONTEXT = "long_context"

@dataclass
class ModelChoice:
    tier: ModelTier
    model_id: str
    provider: str
    rationale: str

class ModelRouter:
    """Custom enterprise router with audit and fallbacks."""
    
    TIER_DEFAULTS = {
        ModelTier.BUNDLED:      ("gpt-5-mini",        "openai"),
        ModelTier.CHEAP:        ("claude-haiku-4-5",  "anthropic"),
        ModelTier.WORKHORSE:    ("claude-sonnet-4-6", "anthropic"),
        ModelTier.PREMIUM:      ("claude-opus-4-7",   "anthropic"),
        ModelTier.LONG_CONTEXT: ("gemini-3.1-pro",    "google"),
    }
    
    def __init__(self, telemetry, classifier_client):
        self.telemetry = telemetry
        self.classifier = classifier_client
    
    async def route(
        self,
        prompt: str,
        context_size_tokens: int = 0,
        user_id: str = None,
        feature_id: str = None,
    ) -> ModelChoice:
        """Decides the model for the request."""
        # Static heuristic
        if context_size_tokens > 100_000:
            choice = ModelChoice(
                tier=ModelTier.LONG_CONTEXT,
                model_id="gemini-3.1-pro",
                provider="google",
                rationale=f"Context size {context_size_tokens} exceeds 100K threshold"
            )
            self.telemetry.record_routing_decision(choice, user_id, feature_id)
            return choice
        
        # Dynamic classification
        complexity = await self.classifier.classify(prompt)
        
        tier_map = {
            "trivial":  ModelTier.BUNDLED,
            "routine":  ModelTier.CHEAP,
            "complex":  ModelTier.WORKHORSE,
            "expert":   ModelTier.PREMIUM,
        }
        tier = tier_map.get(complexity, ModelTier.WORKHORSE)
        model_id, provider = self.TIER_DEFAULTS[tier]
        
        choice = ModelChoice(
            tier=tier,
            model_id=model_id,
            provider=provider,
            rationale=f"Classified as {complexity}"
        )
        
        # Audit trail
        self.telemetry.record_routing_decision(choice, user_id, feature_id)
        return choice

# Usage
router = ModelRouter(telemetry=app_telemetry, classifier=haiku_client)
choice = await router.route(
    prompt="Refactor this 500-line function into smaller pieces",
    context_size_tokens=15_000,
    user_id="paulasilva",
    feature_id="refactor_assistant",
)
print(f"Routed to {choice.model_id} ({choice.tier.value}): {choice.rationale}")
```

**Advantages of custom approach:**
- Fine audit by user/feature/tier
- Specific fallback policies of the org
- Integration with internal systems (RBAC, cost centers)
- Total control over routing logic

**Disadvantages:**
- Continuous maintenance
- Reimplement features that LiteLLM already offers
- Scales with product complexity

### 3.6.4 When to use each approach

| Situation                                              | Recommended approach          |
|--------------------------------------------------------|-------------------------------|
| Small team, wants to start fast                        | OpenRouter                    |
| Medium team, multi-provider, cost is criterion         | LiteLLM                       |
| Large enterprise, specific requirements                | Custom router                 |
| Only one provider (e.g., only Anthropic)               | Direct API with simple classification |
| Already uses Azure AI Foundry                          | Foundry router (chapter 11)   |

## 3.7 Conclusion and next steps

You now understand:

- **Four model families**: OpenAI, Anthropic, Google, xAI, with distinct profiles
- **Complete pricing table** and conversion to AI Credits
- **Five-level heuristic** and decision tree for model choice
- **VS Code configuration**: User Settings, workspace `.vscode/settings.json`, custom prompts in `.github/prompts/`, Coding Agent
- **GitHub Enterprise configuration**: org allowlist, premium paid usage policy, audit logs, policy by repository type
- **Model routing implementation**: LiteLLM, OpenRouter, and custom router, with tradeoffs

In the next chapter, [04 · Context engineering](./04_context_engineering.md), we enter the discipline of selecting the smallest set of high-signal tokens: context rot, compaction, tool result clearing, persistent memory, subagents, and how all this applies in custom agents in VS Code, AGENTS.md, and copilot-instructions.md.

---

## References for this chapter

- [GitHub Docs · Available Copilot models](https://docs.github.com/en/copilot/using-github-copilot/ai-models)
- [Anthropic · Model overview](https://docs.anthropic.com/en/docs/about-claude/models)
- [OpenAI · Models](https://platform.openai.com/docs/models)
- [Google · Vertex AI Gemini](https://cloud.google.com/vertex-ai/generative-ai/docs/models)
- [LiteLLM · Open source LLM router](https://github.com/BerriAI/litellm)
- [OpenRouter · Multi-provider routing](https://openrouter.ai/)
- [VS Code · Settings reference](https://code.visualstudio.com/docs/getstarted/settings)

---

**Previous chapter**: ← [02 · Anatomy of consumption](./02_consumption_anatomy.md)
**Next chapter**: [04 · Context engineering](./04_context_engineering.md) →
**Back to index**: [00 · README](./00_README_INDEX.md)
