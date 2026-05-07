---
title: "01 · Token fundamentals"
description: "What a token is, tokenization algorithms (BPE, WordPiece, Unigram), why tokens and not words, and how tokens become money"
author: "Paula Silva"
role: "Software Global Black Belt"
contact: "paulasilva@microsoft.com"
date: "2026-05-04"
version: "2.0.0"
status: "approved"
language: "en"
chapter: 1
part: "I · Foundations"
tags: ["token", "bpe", "wordpiece", "unigram", "tokenization"]
---

# 01 · Token fundamentals

> The model never sees text. It operates on sequences of integers. Understanding how text becomes tokens, and how tokens become money, is the prerequisite for any cost optimization. Without this foundation, everything else in this playbook is superficial.

## 1.1 Formal definition

A **token** is the atomic unit that a language model (LLM) processes internally. Technically, it is a positive integer that indexes an entry in a fixed vocabulary, typically between 32,000 and 200,000 entries depending on the model.

Most modern LLMs use **Byte Pair Encoding (BPE)**, a compression algorithm originally designed by Philip Gage in 1994 and adapted for NLP by [Sennrich et al. in 2016](https://arxiv.org/abs/1508.07909). BPE empirically discovers sub-word units from a training corpus, finding the balance between vocabulary size and granularity.

### Practical equivalences

As a rule of thumb for estimating consumption:

| Language / content                       | Words per token   | Comment                                                       |
|------------------------------------------|-------------------|---------------------------------------------------------------|
| General English                          | ~0.75             | Common everyday text                                          |
| Brazilian Portuguese                     | ~0.60             | Accents and cedillas reduce density                           |
| Spanish                                  | ~0.65             | Similar to Portuguese, but with slightly denser words         |
| Python code                              | ~0.40             | Symbols, indentation, and identifiers reduce density          |
| TypeScript / JavaScript code             | ~0.35             | JSX symbols, generics, costly imports                         |
| Structured JSON                          | ~0.30             | Separators, quotes, and braces consume many tokens            |

**Practical example**: A 1,000-line Python file with average complexity represents about **12,000 tokens**. A 2,000-word markdown document in Portuguese represents about **3,300 tokens**. A 500-word chat response in English represents about **670 tokens**.

### Why this matters for cost

Knowing these equivalences allows quick rule-of-thumb estimates for any interaction. If you know you will inject three 500-line files and ask 10 questions, you can predict that the session will consume approximately:

```
Input per turn: 3 files × 500 lines × 12 tokens/line = 18,000 tokens
Cumulative history after 10 turns: ~150,000 tokens (with response overhead)
Estimated cost in Sonnet 4.6: 150,000 × $3/M = $0.45 per session
```

Without this foundation, any cost estimate is a guess.

## 1.2 Tokenization: BPE, WordPiece, and Unigram

There are three dominant families of tokenization algorithms. Each model provider chose one and maintains compatibility throughout the lifecycle of the model family.

### Byte Pair Encoding (BPE)

**Used by**: GPT-2, GPT-3, GPT-4, GPT-5, Claude, Mistral, Llama.

**How it works**: iterates over the training corpus, finds the most frequent token pair, merges into a new token, repeats until reaching the desired vocabulary size.

```
Iteration 1: starts with all bytes/characters of the corpus
Iteration 2: finds most frequent pair (e.g., "th"), merges into single token
Iteration 3: finds next most frequent pair (e.g., "the_"), merges
...
Iteration N: vocabulary reaches 100,000 tokens, stops
```

**Critical variant - Byte-level BPE**: operates at the level of UTF-8 bytes instead of Unicode characters. This ensures that **the model never encounters an unknown token (UNK)**. Any string, in any language, with any emoji, can be tokenized. Critical for multilinguality and for code with special characters.

### WordPiece

**Used by**: BERT, DistilBERT, BERT-derived models.

**Difference vs BPE**: uses **probability likelihood** criterion, not raw frequency. The choice of which pair to merge is made by maximizing the probability of the corpus given the vocabulary, not simply by counting occurrences.

WordPiece tends to produce vocabularies better aligned with meaningful morphological units, but the practical difference for the user is minimal. WordPiece is more common in encoder-only models for classification and extraction tasks.

### Unigram Language Model

**Used by**: T5, Google models via SentencePiece.

**Difference vs BPE**: inverse strategy. Starts with a **large** vocabulary and removes tokens iteratively, keeping those that contribute most to the corpus probability.

The result tends to recover morphological units more aligned with linguistics (roots, prefixes, suffixes), which can help in inflective languages. For the user, again, the practical difference is small.

### Practical summary

The choice of algorithm is a design decision of the model provider, not something you control. What matters for token management is:

- **Portuguese text is ~25% denser in tokens than English**: adjust your estimates
- **Code consumes more tokens per line than prose**: large code files weigh a lot
- **Special characters and rare Unicode can use 2-4 tokens each**: emojis in particular

## 1.3 Why tokens, not words

This is a fundamental design decision of modern LLMs. Sub-word tokenization solves **three problems simultaneously** that word-level or character-level approaches cannot.

### Problem 1: open vocabulary

Human languages have effectively infinite vocabulary: proper names, neologisms, technical jargon, regional slang, compound words. If the model used a closed vocabulary of whole words, any word outside training would become `UNK` (unknown), losing information.

With sub-word tokenization, **never-before-seen words decompose into known sub-tokens**. The word "antidisestablishmentarianism" (which may never appear in training) decomposes into something like `["anti", "dis", "establish", "ment", "arian", "ism"]`, all known tokens. The model never encounters UNK.

This is exactly why BPE was adapted for NLP: to solve the out-of-vocabulary word problem that plagued word-level models.

### Problem 2: efficient compression

Char-level tokenization (each character is a token) generates very long sequences. The phrase "The model processes tokens" has 26 characters, so 26 tokens. This destroys the context window and inflates cost.

Word-level tokenization (each word is a token) generates short sequences but requires a giant vocabulary (hundreds of thousands of words). And still fails for new words.

Sub-word is the sweet spot: common tokens (frequent short words) become one token, rare words become multiple tokens. On average, **shortens sequences by 30-40% over char-level** while keeping vocabulary manageable.

### Problem 3: multilinguality

Char-level with Unicode has 150,000+ possible characters. Word-level with multilingual vocabulary easily exceeds one million. Neither scales well.

Byte-level BPE operates on **256 possible bytes** (all UTF-8 bytes). Works in any natural language, any programming language, emojis, Asian characters, mathematical symbols. A single model, trained once, works in all languages.

### Practical implication

Tokens are not words or characters. They are **the sweet spot between granularity and vocabulary size**, empirically discovered for each provider. That's why the same text can have different token count in GPT-5 vs Claude vs Gemini: each has its specific vocabulary.

For precise estimates, always use the provider's [tokenizer playground](https://platform.openai.com/tokenizer). For rule-of-thumb estimates, the equivalences from section 1.1 are sufficient.

## 1.4 Input, output, and cached tokens

Every LLM call has three categories of tokens, each with a distinct cost profile. Understanding the three is a prerequisite for any optimization.

### Input tokens

These are the tokens sent to the model: system prompt, tool definitions, conversation history, additional context, current user message. Everything that enters the context.

**Computational characteristic**: processed in parallel via the attention mechanism. The model computes the relationship between all tokens in a single pass. Hardware is GPU memory-bound: the bottleneck is available memory, not computation.

**Typical cost**: US$ 1 to US$ 15 per million tokens in premium models. Cheaper per token than output because the work is parallelizable.

### Output tokens

These are the tokens generated by the model in response: text, code, tool calls, reasoning tokens (in models with extended thinking). Everything that comes out.

**Computational characteristic**: generated sequentially in autoregressive mode. Each new token requires recomputing attention over everything that came before. The model cannot generate token N before having generated token N-1. Hardware is GPU compute-bound: latency grows linearly with size.

**Typical cost**: US$ 5 to US$ 75 per million tokens in premium models. **Typically 3-5× more expensive than input** per token. It is not arbitrary: it is the real computational cost.

**Critical attention**: in models with extended thinking (Opus 4.7 with thinking, GPT-5 with reasoning_effort), reasoning tokens are also accounted for as output, even though they are invisible to the user. A 500-token visible response may have consumed 5,000 invisible reasoning tokens, costing 10× more than it appeared.

### Cached tokens

These are tokens whose internal model state (KV cache of attention) was stored in GPU memory by the provider and reused between requests with the same prefix.

**Computational characteristic**: state already computed is recovered, not recalculated. The model "skips" the work of processing those tokens again.

**Typical cost**: **10% of regular input price** (0.1× input) for reads. Cache writes have a price of 1.25× input for 5-minute TTL, or 2× input for 1-hour TTL.

**Why it exists**: in conversational or agentic workloads, the beginning of the context (system prompt, tools, attached documents) is stable between requests. Without cache, the provider would recompute the KV state of these tokens on every call. With cache, the state is saved after the first write and reused on subsequent reads.

**Savings vector**: up to **90% reduction in input cost** in long conversational sessions. This is the most underutilized lever in teams that migrate to token billing without discipline. See chapter 05 for complete implementation.

### Cost summary

| Category         | Multiplier (Sonnet 4.6) | Behavior                                          |
|------------------|-------------------------|---------------------------------------------------|
| Regular input    | 1× (US$ 3/M)            | Parallel, memory-bound                             |
| Output           | 5× (US$ 15/M)           | Sequential, compute-bound                          |
| Cache write 5min | 1.25× (US$ 3.75/M)      | Like input, but pays 25% extra to store            |
| Cache write 1h   | 2× (US$ 6/M)            | Like input, pays 100% extra to store 12x longer    |
| Cache read       | 0.1× (US$ 0.30/M)       | State already computed, retrieves                  |

## 1.5 How tokens become money

The billing formula is direct. Each API call is priced as the sum of contributions from each token category, using the published prices of each model.

### Basic formula

```python
def calculate_call_cost(
    input_tokens: int,
    output_tokens: int,
    cached_read_tokens: int = 0,
    cached_write_5min_tokens: int = 0,
    cached_write_1h_tokens: int = 0,
    model_pricing: dict = None,
) -> float:
    """Calculates cost in USD for an API call."""
    p = model_pricing  # prices per million tokens
    cost = (
        input_tokens             * p["input"]              / 1_000_000
      + output_tokens            * p["output"]             / 1_000_000
      + cached_read_tokens       * p["cached_read"]        / 1_000_000
      + cached_write_5min_tokens * p["cached_write_5min"]  / 1_000_000
      + cached_write_1h_tokens   * p["cached_write_1h"]    / 1_000_000
    )
    return cost

# Example: Sonnet 4.6 with 8K input + 1K output, no cache
SONNET_46 = {
    "input":             3.00,
    "output":           15.00,
    "cached_read":       0.30,
    "cached_write_5min": 3.75,
    "cached_write_1h":   6.00,
}

cost = calculate_call_cost(
    input_tokens=8000,
    output_tokens=1000,
    model_pricing=SONNET_46,
)
# = 8000 * 3 / 1M + 1000 * 15 / 1M
# = 0.024 + 0.015
# = $0.039 per call
```

### Enterprise scale

A team of 50 developers making 1,000 calls/day at this profile:

```
Daily cost:    $0.039 × 1000 × 50    = $1,950/day
Monthly cost:  $1,950 × 22 business days = $42,900/month
Annual cost:   $42,900 × 12          = ~$515K/year
```

These are numbers for relatively light calls. In agentic sessions, each "call" can involve dozens of turns with growing cumulative input. See chapter 02 for the agentic multiplier.

### Conversion to GitHub AI Credits

In GitHub Copilot post-June 2026, the calculation is the same, but the bill unit is AI Credits:

```python
def usd_to_ai_credits(cost_usd: float) -> float:
    """1 AI Credit = US$ 0.01"""
    return cost_usd * 100

# Example: $0.039 call
credits = usd_to_ai_credits(0.039)  # = 3.9 AI Credits
```

A Copilot Business plan has **US$ 19 in credits = 1,900 AI Credits per user per month**. At a rate of $0.039 per call, this allows about **48,700 calls/month per user** under that specific profile. In agentic mode with Opus 4.7 and heavy context, that same budget covers **30-40 sessions**.

The order-of-magnitude difference between the two scenarios is exactly what motivated the transition. Under PRUs, both cost the same. Under tokens, they reflect real work.

### Invisible tokens: extended thinking

Models like Opus 4.7 with thinking enabled, or GPT-5 with `reasoning_effort=high`, generate internal reasoning tokens before the visible response. These tokens **count as output** and are billed normally.

```python
# Scenario: Opus 4.7 with thinking enabled
# Visible response: 500 tokens
# Internal reasoning (invisible): 5000 tokens
# Total billed output: 5500 tokens

cost = calculate_call_cost(
    input_tokens=10_000,
    output_tokens=5_500,  # includes invisible thinking!
    model_pricing=OPUS_47,
)
# = 10000 * 15 / 1M + 5500 * 75 / 1M
# = 0.15 + 0.4125
# = $0.5625 per call
```

Without this awareness, teams are surprised by costs 5-10× higher than expected when they enable thinking. **Use thinking only where the extra quality justifies the cost.** See chapter 06 for the heuristic.

## 1.6 Conclusion and next steps

You now understand:

- **What a token is**: the atomic unit the model processes, empirically discovered via BPE/WordPiece/Unigram
- **Why tokens, not words**: open vocabulary, efficient compression, multilinguality
- **The three categories**: input (parallel, cheap), output (sequential, expensive 3-5×), cached (10% of input, savings lever)
- **How tokens become money**: direct formula, with special attention to thinking tokens

In the next chapter, [02 · Anatomy of consumption](./02_consumption_anatomy.md), we deepen where tokens go in real workflows, the empirical distribution in multi-agent systems (Tokenomics), and the math of the agentic multiplier that makes long sessions grow quadratically in cost.

---

## References for this chapter

- Sennrich, R., Haddow, B., Birch, A. (2016). [*Neural Machine Translation of Rare Words with Subword Units*](https://arxiv.org/abs/1508.07909). ACL 2016. arXiv:1508.07909
- [Anthropic Docs · Models and pricing](https://www.anthropic.com/pricing)
- [OpenAI Tokenizer Playground](https://platform.openai.com/tokenizer)
- Gage, P. (1994). *A New Algorithm for Data Compression*. The C Users Journal.

---

**Next chapter**: [02 · Anatomy of consumption](./02_consumption_anatomy.md) →
**Back to index**: [00 · README](./00_README_INDEX.md)
