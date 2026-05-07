---
title: "02 · Anatomy of consumption"
description: "Where tokens go in real workflows. Input-processing-output cycle, empirical distribution in SDLC, and the math of the agentic multiplier."
author: "Paula Silva"
role: "Software Global Black Belt"
contact: "paulasilva@microsoft.com"
date: "2026-05-04"
version: "2.0.0"
status: "approved"
language: "en"
chapter: 2
part: "I · Foundations"
tags: ["tokenomics", "agentic", "consumption", "multiplier"]
---

# 02 · Anatomy of consumption

> Tokens are not consumed uniformly. In real workflows, certain phases dominate cost while others seem expensive but are not. In agentic sessions, input grows quadratically. Understanding this empirical distribution is what separates blind optimization from surgical optimization.

## 2.1 The input-processing-output cycle

Every LLM call follows three distinct phases. Each with a different cost, hardware, and latency profile. Optimizing each requires different techniques.

### Phase 1: Input (parallel attention)

The model receives the complete sequence of input tokens and calculates the relationship between all of them in a single pass. The attention mechanism computes, for each pair of tokens, how relevant they are to each other.

**Characteristic**: massively parallelizable. The entire sequence can be processed simultaneously on GPU.

**Hardware bottleneck**: memory. How many tokens fit in the attention KV cache? Models with 1M token windows need huge GPU memory to maintain state.

**Cost per token**: the cheapest. In Sonnet 4.6, US$ 3 per million.

**Latency**: relatively low. Time-to-first-token (TTFT) is dominated by this phase.

### Phase 2: Output (autoregressive generation)

The model generates tokens one by one, sequentially. Each new token depends on **all previous tokens**, including tokens already generated in this response.

```
Token 1 generated: depends on the N input tokens
Token 2 generated: depends on N+1 tokens (input + token 1)
Token 3 generated: depends on N+2 tokens (input + token 1 + token 2)
...
Token K generated: depends on N+K-1 tokens
```

**Characteristic**: strictly sequential. There is no possible parallelization within a response.

**Hardware bottleneck**: compute. Each new token requires a complete forward pass through the network.

**Cost per token**: 3-5× more expensive than input. In Sonnet 4.6, US$ 15 per million. It is not arbitrary: it is the real computational cost.

**Latency**: grows linearly with response size. Tokens-per-second is the relevant metric.

### Phase 3: Cache (state reused)

The provider stores the internal state (KV cache) generated during the input phase. In subsequent requests with the same prefix, this state is recovered instead of recomputed.

**Characteristic**: savings of redundant work. Without cache, teams pay to recompute the same thing on every call.

**Hardware bottleneck**: GPU storage. Cache TTL exists because memory is not infinite.

**Cost per token**: 10% of regular input for reads, 25-100% extra for writes (TTL determines). In Sonnet 4.6: US$ 0.30/M for read, US$ 3.75/M for write 5min, US$ 6/M for write 1h.

**Latency**: TTFT much lower in cache hits, because phase 1 is already done.

### Why this matters for your architecture

The distinction between the three phases changes how you optimize:

- **To reduce input cost**: prompt caching, context engineering, tool result clearing
- **To reduce output cost**: prompts requesting concise responses, dense formats (JSON > prose), stop when sufficient
- **To use cache efficiently**: prefix-stable + suffix-dynamic structure (chapter 05)

Treating all three as "tokens in general" leads to wrong optimizations. See, for example, teams that try to reduce cost by shortening system prompts (which cache well) instead of cutting verbose outputs (which are 5× more expensive).

## 2.2 Tokenomics: distribution in real workflows

[arXiv 2601.14470 (Tokenomics)](https://arxiv.org/) empirically studied how tokens are consumed in multi-agent systems for SDLC. The results are counterintuitive: the phase that seems most expensive rarely is, and the phase that seems simple often dominates cost.

### Empirical distribution in agentic workflows

In multi-agent systems doing software development (reading specs, writing code, testing, refining), the typical distribution of token consumption is:

| Workflow phase                | % of total consumption | Characteristic                                                |
|-------------------------------|------------------------|---------------------------------------------------------------|
| Task understanding            | 5-10%                  | Reading spec, initial files, context                          |
| Planning                      | 5-15%                  | Decomposition into subtasks                                   |
| **Implementation**            | **30-50%**             | **Code generation, file editing · highest weight**            |
| Verification and testing      | 15-25%                 | Test execution, output reading, debug                          |
| **Refinement**                | **15-30%**             | **Iterations to fix issues · villain without stop criteria** |
| Inter-agent communication     | 5-15%                  | When there is multi-agent orchestration                       |

### Practical insights

**1. Implementation dominates, but refinement is the villain.** Implementation consumes 30-50% because it is where code is generated, but this is legitimate work. Refinement (15-30%) is often waste: iterations that could have been avoided with better planning, vague stopping criteria, or wrong model for the task.

**2. Understanding is cheap if done well.** Initial reading of spec consumes little. What kills is rereading the same file several times during the session. See "tool result clearing" in chapter 04.

**3. Inter-agent communication is proportional to architecture.** Systems with many handoffs between agents (orchestrator + 5 workers + reviewer) spend significant tokens on messages between agents. Single-agent systems do not have this cost. Weigh whether multi-agent is worth the overhead.

### How to measure in your organization

Do not trust general averages. Each workflow has its own distribution. To map:

```python
# Telemetry pseudocode by phase (structure)
class TokenTelemetry:
    def __init__(self, session_id):
        self.session_id = session_id
        self.phases = {}

    def record(self, phase: str, input_tokens: int, output_tokens: int):
        if phase not in self.phases:
            self.phases[phase] = {"input": 0, "output": 0}
        self.phases[phase]["input"] += input_tokens
        self.phases[phase]["output"] += output_tokens

    def report(self):
        total = sum(p["input"] + p["output"] for p in self.phases.values())
        for phase, tokens in self.phases.items():
            phase_total = tokens["input"] + tokens["output"]
            pct = phase_total / total * 100
            print(f"{phase}: {phase_total:,} tokens ({pct:.1f}%)")

# Usage
telem = TokenTelemetry(session_id="agent-pr-1234")
# ... during workflow, call telem.record() in each phase
telem.report()
```

See chapter 10 for complete observability implementation with OpenTelemetry and Application Insights.

## 2.3 Cost of input, output, and cache compared

Back to the cost comparison of the three categories, now with concrete enterprise scale.

### Scenario: team of 50 devs, typical daily session

Let's calculate the impact of each category in a typical enterprise operation.

**Profile per developer per day:**

- 100 calls to Copilot Chat (short questions)
- 5 sessions of Edit/Agent mode (refactorings)
- 1 long agentic session (feature implementation)

**Tokens per call category:**

| Call type                  | Typical input | Typical output | Frequency/dev/day  |
|----------------------------|---------------|----------------|---------------------|
| Short chat                 | 2,000         | 200            | 100                 |
| Edit mode                  | 8,000         | 1,500          | 5                   |
| Agent mode (feature)       | 50,000        | 8,000          | 1                   |

**Calculation without cache (Sonnet 4.6, $3 input / $15 output / M):**

```
Chat:    100 × (2000 × $3/M + 200 × $15/M)   = 100 × ($0.006 + $0.003) = $0.90/dev
Edit:      5 × (8000 × $3/M + 1500 × $15/M)  = 5 × ($0.024 + $0.0225)  = $0.23/dev
Agent:     1 × (50000 × $3/M + 8000 × $15/M) = 1 × ($0.15 + $0.12)     = $0.27/dev

Total/dev/day:  $1.40
Total/team/day (50 devs): $70
Total/team/month (22 days): $1,540
```

**Calculation with aggressive cache (cache hit rate 70%):**

In conversational calls, system prompt + tools + history are stable. 70% of input tokens become cache reads (0.1×).

```
Cache reads:  70% × input × $0.30/M
Cache writes: 30% × input × $3.75/M (assuming TTL 5min)
Output:       always $15/M

Chat:    100 × (2000 × 0.7 × $0.3/M + 2000 × 0.3 × $3.75/M + 200 × $15/M)
       = 100 × ($0.00042 + $0.00225 + $0.003)
       = 100 × $0.005670 = $0.567/dev
Edit:      5 × ($0.00168 + $0.009 + $0.0225) = 5 × $0.0332 = $0.166/dev
Agent:     1 × ($0.0105 + $0.05625 + $0.12) = 1 × $0.187 = $0.187/dev

Total/dev/day:  $0.92 (-34% vs no cache)
Total/team/month: $1,012
```

**Monthly savings: US$ 528** with just 70% cache hit rate. For 500 devs: **US$ 5,280/month = US$ 63K/year**.

### Implication

Cache is not marginal optimization. It is **first-order lever**. Teams that ignore cache pay the gross price. Teams that apply systematic cache save 30-50% without changing anything else.

Detailed implementation is in [chapter 05 · Prompt caching](./05_prompt_caching.md).

## 2.4 The agentic multiplier

Here is the most underestimated effect in token billing: **in long agentic sessions, input grows quadratically**, not linearly. This dramatically changes the cost of iterative workflows.

### Why it grows quadratically

In a multi-turn conversation, each turn adds to history. But the history of each turn is re-sent integrally as input on the next turn.

```
Turn 1: input = system + tools + msg1                = N tokens
Turn 2: input = system + tools + msg1 + resp1 + msg2 = N + 2K tokens
Turn 3: input = system + tools + msg1 + resp1 + msg2 + resp2 + msg3 = N + 4K tokens
...
Turn T: input = N + (T-1) × 2K tokens
```

The **cumulative input** throughout the entire session is the sum of the arithmetic progression:

```
total_input = N × T + 2K × (1 + 2 + 3 + ... + T-1)
            = N × T + 2K × T(T-1)/2
            = N × T + K × T(T-1)
```

The dominant term is **T²** (quadratic). For large T, growth is quadratic in the number of turns.

### Concrete example

Agentic session of 20 iterations, base of 100K tokens (system + tools + files), 2K tokens of increment per turn (message + response), average output of 1K per turn, Sonnet 4.6 model.

**Without cache:**

```
Cumulative input:
  Turn 1:  100K
  Turn 2:  102K
  Turn 3:  104K
  ...
  Turn 20: 138K
  
Sum of inputs across all turns = Σ(100K + 2K × (i-1)) for i in 1 to 20
                                = 20 × 100K + 2K × (0+1+...+19)
                                = 2,000K + 2K × 190
                                = 2,000K + 380K
                                = 2,380K = 2.38M tokens

Total output: 20 × 1K = 20K tokens

Total cost = 2,380,000 × $3/M + 20,000 × $15/M
           = $7.14 + $0.30
           = $7.44 for one session

Cost per turn (average): $0.37
```

**With aggressive cache (TTL 5min, cache hit rate ~85% after first turn):**

```
Turn 1: 100K input fresh (cache write) = 100K × $3.75/M = $0.375
Turns 2-20: 
  - Cache hit on ~85% of cumulative input: read price
  - Fresh on 15% (the new portion of each turn)
  
For turn T (T >= 2):
  cumulative = 100K + 2K × (T-1)
  cached_read   ≈ 0.85 × cumulative
  fresh_input   ≈ 0.15 × cumulative

Aggregate sum across remaining 19 turns:
  Total cumulative input = Σ(100K + 2K(T-1)) for T=2..20 = 19×100K + 2K×190 = 2,280K
  Cached reads ≈ 1,938K × $0.30/M = $0.581
  Fresh input  ≈ 342K × $3/M    = $1.026
  Cache writes ≈ 342K × $3.75/M = $1.283 (writes to cache new blocks)
  
Total output: 20K × $15/M = $0.300

Total cost ≈ $0.375 + $0.581 + $1.026 + $1.283 + $0.300
           ≈ $3.57 for the session
           
Reduction: $7.44 → $3.57 = 52% savings
```

(The numbers above are approximations; the exact calculation depends on details of which prefix is cacheable and how cache_control is applied. See chapter 05 for exact implementation.)

### When the agentic multiplier becomes a problem

Sessions with **more than 10 turns** start feeling the effect. Sessions with **more than 20 turns** become dominated by accumulated input, with cache being the only practical lever.

In iterative workflows without stop criteria (eternal evaluator-optimizer, agent that keeps trying), cost grows without limit. That's why **explicit stop criteria** are so important: chapter 06.

### Strategies to tame the multiplier

Four strategies, in order of impact:

**1. Prompt caching** (chapter 05): the primary lever. Reduces recurring input from 1× to 0.1× on ~85% of context.

**2. Structured compaction** (chapter 04): every 10-15 turns, ask the model to compress history into a summary. Reduces tokens by 22-57% with no loss of accuracy ([arXiv 2601.07190](https://arxiv.org/)).

**3. Tool result clearing** (chapter 04): removes results from old tools that are no longer relevant. In long sessions, this can free 50K+ tokens.

**4. Subagent fan-out** (chapter 04): instead of the lead agent accumulating context, dispatches subagents with isolated context. Each subagent returns just the summary. Reduces tokens by 70-90% in exploration workflows.

## 2.5 Conclusion and next steps

You now understand:

- **The three technical phases**: input (parallel), output (sequential 3-5× more expensive), cache (10% of input)
- **Tokenomics**: implementation dominates (30-50%), refinement is the villain (15-30%), inter-agent communication is proportional to architecture
- **Practical comparison**: cache can reduce cost by 30-50% without other changes
- **The agentic multiplier**: input grows quadratically in long sessions, cache is the primary lever

In the next chapter, [03 · Models and multipliers](./03_models_multipliers.md), we enter the complete map of models available in GitHub Copilot post-June, their characteristics, and how to configure model choice in VS Code, in GitHub Enterprise (org policies), and in CI/CD pipelines.

---

## References for this chapter

- arXiv:2601.14470 (Tokenomics). *Token consumption distribution in multi-agent SDLC systems*.
- arXiv:2601.07190. *Compaction on SWE-bench Lite*.
- [Anthropic Docs · Prompt caching](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching)
- [Anthropic · Effective context engineering for AI agents](https://www.anthropic.com/research/effective-context-engineering)

---

**Previous chapter**: ← [01 · Token fundamentals](./01_token_fundamentals.md)
**Next chapter**: [03 · Models and multipliers](./03_models_multipliers.md) →
**Back to index**: [00 · README](./00_README_INDEX.md)
