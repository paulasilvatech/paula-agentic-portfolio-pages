---
title: "05 · Prompt caching"
description: "Prefix cache mechanics, TTLs, anti-patterns, implementation in Anthropic API (Python and Node), external Redis, semantic cache, cache in CI/Actions and VS Code"
author: "Paula Silva"
role: "Software Global Black Belt"
contact: "paulasilva@microsoft.com"
date: "2026-05-04"
version: "2.0.0"
status: "approved"
language: "en"
chapter: 5
part: "II · Technical disciplines"
tags: ["prompt-caching", "kv-cache", "redis", "semantic-cache", "ci-cd"]
---

# 05 · Prompt caching

> Prompt caching is the 90% lever. In conversational workloads, it reduces input cost by up to 90% without changing a single line of prompt. But it requires architectural discipline: prefix-stable + suffix-dynamic structure, cache_control on the right blocks, avoiding anti-patterns. This chapter gives you the mechanics, the implementation in Python and Node, patterns for external Redis, semantic cache, and how to apply all this in CI/CD pipelines and VS Code.

## 5.1 How prefix cache works

Every LLM call goes through the attention mechanism, which computes the relationships between all tokens. That calculation is the most expensive work of the request. The intermediate result, the **attention KV cache**, is stored in GPU memory.

In subsequent requests with the same token prefix, the provider can **retrieve that KV cache** instead of recomputing it. The model "skips" the work of processing those tokens again.

### What counts as prefix

The cache operates by **prefix hash**, byte by byte. For a request:

```
[System prompt] + [Tools definition] + [User message] + [Other context]
```

The hash is calculated over the tokens in order, from the start until where cache_control ends. **Any change in any byte invalidates the cache** from that point on.

```
Session 1: [System v1] [Tools] [Documents] [User Q1]
                    ↑ prefix hash A    ↑ unique
                    
Session 2: [System v1] [Tools] [Documents] [User Q2]
                    ↑ prefix hash A    ↑ unique
                    ↓
                    Cache HIT on prefix, pays 0.1× input
                    User Q2 is fresh, pays 1× input
```

But if the system prompt changes:

```
Session 3: [System v2] [Tools] [Documents] [User Q3]
                    ↑ prefix hash B (DIFFERENT)
                    ↓
                    Cache MISS, pays 1× input on entire prefix
                    + 0.25× extra to write new cache (TTL 5min)
```

### Ideal structure of a cacheable request

The golden rule: **stable content first, dynamic later**.

```
[1. System Prompt]      5K-50K tokens · stable · cache_control
   ├── General instructions
   ├── Persona, role
   └── Long-term documentation

[2. Tools definition]   1K-10K tokens · stable · cache_control
   └── JSON tool definitions

[3. Static context]     5K-100K tokens · optional · cache_control
   ├── Attached documents
   ├── Project context (AGENTS.md content)
   └── Few-shot examples

[4. Conversation history]   dynamic (grows each turn)
[5. Current message]        dynamic  ← NEVER cache_control here
```

**Minimums for cache to be worthwhile:**

| Model                       | Minimum cacheable prefix size       |
|-----------------------------|--------------------------------------|
| Claude Sonnet 4.6 / Opus    | 1,024 tokens                         |
| Claude Haiku 4.5            | 2,048 tokens                         |

Smaller prefixes are not cached; the request runs as regular input.

**Lookback**: Anthropic supports up to **20 blocks** with active `cache_control` simultaneously. In requests with many breakpoints, the oldest unused are evicted.

## 5.2 TTLs, write tokens, and read tokens

The cache is not free. There is cost to write (cache write), and the stored state expires after a TTL.

### Cost table

For Claude Sonnet 4.6 (US$ 3 regular input):

| Operation                | Multiplier    | Cost (US$/M tokens)  |
|--------------------------|---------------|----------------------|
| Regular input            | 1×            | $3.00                |
| Cache write 5min TTL     | 1.25×         | $3.75                |
| Cache write 1h TTL       | 2.0×          | $6.00                |
| Cache read               | 0.1×          | $0.30                |

**Pricing logic:**

- **Cache write** costs more than regular input because it includes the work of storing KV state in GPU memory
- **Cache read** costs only 10% because the processing work was already done; it's just retrieval
- **Larger TTL** costs more to write because the state occupies GPU memory for longer

### When to use TTL 5min vs 1h

**TTL 5min** (recommended default):

- Interactive sessions: chat, edit mode, agent mode
- Each request reactivates TTL: while user is active, cache stays alive
- Write cost: 1.25× regular input
- Risk: if session pauses for >5min, next request is miss

**TTL 1h** (specific use):

- Skill or prompt template used by the entire team over hours
- Voluminous documentation that several users consult
- System prompt of batch processing running multiple tasks
- Write cost: 2× regular input (pays 2x more to ensure 12x more time)

**Economic decision:**

```
Break-even point for TTL 1h vs 5min:
  Cache write 5min:  cost = N × 1.25 × input_price (assuming N writes in 1h)
  Cache write 1h:    cost = 1 × 2.0 × input_price

TTL 1h is cheaper if: N × 1.25 > 2.0
                       N > 1.6 writes in 1h

Conclusion: TTL 1h is worth it if expectation is >2 cache writes in same hour.
```

### Measurable savings

For 100 calls with 10K reused token prefix (Sonnet 4.6):

| Scenario                                | Gross input cost          | Real cost         | Reduction  |
|-----------------------------------------|---------------------------|-------------------|------------|
| No cache                                | 100 × 10,000 × $3/M       | $3.00             | 0%         |
| Cache 5min · 1 write + 99 reads         | 100 × 10,000 × ratio      | $0.3375           | **88.75%** |
| Cache 1h · 1 write + 99 reads           | 100 × 10,000 × ratio      | $0.357            | 88.1%      |

Detailed calculation for 5min:
```
1 write × 10K × $3.75/M = $0.0375
99 reads × 10K × $0.30/M = $0.2970
Output: assuming 1K per call × 100 × $15/M = $1.50
Total: $0.0375 + $0.2970 + $1.50 = $1.8345

Without cache: 100 × 10K × $3/M + 100 × 1K × $15/M = $3.00 + $1.50 = $4.50

Input reduction: $0.3345 / $3.00 = -88.85%
```

**In real conversational workloads**, typical hit rate of 70-85% after first turn. Consistent savings of **40-60% in total cost** (input + output) is achievable in pilots.

## 5.3 Implementation: direct Anthropic API (Python)

This is the canonical implementation using the Anthropic Python SDK. All other approaches derive from it.

### Basic setup

```bash
pip install anthropic>=0.40.0
```

```python
# anthropic_cached_client.py
import os
from anthropic import Anthropic
from anthropic.types import MessageParam

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

# Large stable system prompt
SYSTEM_PROMPT = """You are an expert code reviewer specialized in Python.

Conventions:
- Use type hints for all function signatures
- Follow PEP 8 with 100-char line limit
- Prefer f-strings over .format() or %
- Use pathlib.Path for file operations

[... 10K tokens of detailed conventions ...]
"""

# Project context that varies per session but is stable during the session
PROJECT_CONTEXT = """
Project: Internal billing system
Stack: Python 3.12, FastAPI, PostgreSQL, Redis
Architecture: Hexagonal with ports/adapters

[... 30K tokens of project documentation ...]
"""

async def cached_review(diff: str, conversation_history: list[MessageParam]) -> str:
    """Does code review using prompt caching."""
    response = await client.messages.create(
        model="claude-sonnet-4-6-20260101",
        max_tokens=2000,
        system=[
            {
                "type": "text",
                "text": SYSTEM_PROMPT,
                "cache_control": {"type": "ephemeral", "ttl": "1h"}
            },
            {
                "type": "text",
                "text": PROJECT_CONTEXT,
                "cache_control": {"type": "ephemeral", "ttl": "5m"}
            },
        ],
        messages=[
            *conversation_history,  # dynamic, no cache_control
            {
                "role": "user",
                "content": f"Review this diff:\n\n{diff}"  # dynamic
            }
        ],
    )
    
    # Inspect cache usage for telemetry
    print(f"Cache read tokens: {response.usage.cache_read_input_tokens}")
    print(f"Cache creation tokens: {response.usage.cache_creation_input_tokens}")
    print(f"Input tokens (non-cached): {response.usage.input_tokens}")
    print(f"Output tokens: {response.usage.output_tokens}")
    
    return response.content[0].text
```

### Three-tier cache (pattern)

In complex workloads, it's worth having three cache layers with different TTLs:

```python
async def three_tier_cached_completion(
    user_query: str,
    session_history: list[MessageParam],
    session_context: str,
):
    """Three-tier cache for maximum reuse."""
    response = await client.messages.create(
        model="claude-sonnet-4-6-20260101",
        max_tokens=2000,
        system=[
            # LAYER 1: Global, week or more
            {
                "type": "text",
                "text": GLOBAL_INSTRUCTIONS,  # 5K tokens, entire month
                "cache_control": {"type": "ephemeral", "ttl": "1h"}
            },
            # LAYER 2: Project, days
            {
                "type": "text",
                "text": PROJECT_CONTEXT,  # 30K tokens, entire project
                "cache_control": {"type": "ephemeral", "ttl": "1h"}
            },
            # LAYER 3: Session, minutes
            {
                "type": "text",
                "text": session_context,  # 10K tokens, this session
                "cache_control": {"type": "ephemeral", "ttl": "5m"}
            },
        ],
        messages=[
            *session_history,  # dynamic, no cache
            {"role": "user", "content": user_query}
        ],
    )
    return response
```

**Advantages:**

- Changes in SESSION_CONTEXT don't invalidate GLOBAL or PROJECT
- Changes in GLOBAL (rare) invalidate everything, but rarely happens
- Typical hit rate: 80-90% on GLOBAL, 70-80% on PROJECT, 50-70% on SESSION

## 5.4 Implementation: Node/TypeScript

Equivalent in Node.js for JavaScript/TypeScript teams.

```bash
npm install @anthropic-ai/sdk
```

```typescript
// anthropic-cached-client.ts
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `...`;  // ~10K tokens
const PROJECT_CONTEXT = `...`;  // ~30K tokens

interface CachedReviewArgs {
  diff: string;
  conversationHistory: Anthropic.MessageParam[];
}

export async function cachedReview({
  diff,
  conversationHistory,
}: CachedReviewArgs): Promise<string> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-6-20260101",
    max_tokens: 2000,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral", ttl: "1h" },
      },
      {
        type: "text",
        text: PROJECT_CONTEXT,
        cache_control: { type: "ephemeral", ttl: "5m" },
      },
    ],
    messages: [
      ...conversationHistory,
      {
        role: "user",
        content: `Review this diff:\n\n${diff}`,
      },
    ],
  });

  // Telemetry
  console.log(`Cache read: ${response.usage.cache_read_input_tokens}`);
  console.log(`Cache creation: ${response.usage.cache_creation_input_tokens}`);
  console.log(`Input (non-cached): ${response.usage.input_tokens}`);
  console.log(`Output: ${response.usage.output_tokens}`);

  if (response.content[0].type !== "text") {
    throw new Error("Unexpected content type");
  }
  return response.content[0].text;
}
```

## 5.5 Anti-patterns that break cache

Five recurring mistakes that destroy the benefit of cache. Each is a real case seen in pilots.

### Anti-pattern 1: Timestamp in cached prefix

```python
# WRONG
system_prompt = f"""You are a code reviewer.
Current time: {datetime.now().isoformat()}
[... rest of prompt ...]
"""

# Each request has different timestamp
# → prefix hash changes
# → cache write on every request, never read
# → cost increases 25%
```

**Fix**: remove timestamp from prompt. If you need to know the time, pass via tool or dynamic variable outside the cached block.

### Anti-pattern 2: Cache_control on a block that changes

```python
# WRONG: cache_control on user message (which always changes)
messages = [
    {
        "role": "user",
        "content": [
            {
                "type": "text",
                "text": user_question,  # CHANGES EVERY REQUEST
                "cache_control": {"type": "ephemeral"}  # ❌
            }
        ]
    }
]
# Result: cache write every turn, never read
# Cost increases 25% over regular input
```

**Fix**: cache_control only on stable blocks (system, tools, static context).

### Anti-pattern 3: Block reordering

```python
# Session 1
system = [
    {"type": "text", "text": GENERAL_INSTRUCTIONS, "cache_control": {...}},
    {"type": "text", "text": PROJECT_CONTEXT, "cache_control": {...}},
]

# Session 2 (some dev changed the order)
system = [
    {"type": "text", "text": PROJECT_CONTEXT, "cache_control": {...}},      # ← inverted
    {"type": "text", "text": GENERAL_INSTRUCTIONS, "cache_control": {...}}, # ← inverted
]
# Prefix hash is different → complete cache miss
```

**Fix**: establish canonical order and never change. Lint/check in CI to ensure.

### Anti-pattern 4: Cosmetic variation in system prompt

```python
# Version A
system_prompt = """You are a code reviewer.
Use Python 3.12 features."""

# Version B (same intent, different byte)
system_prompt = """You are a code reviewer. Use Python 3.12 features."""
# (double space, extra comma, swapped word)

# Hash is different → cache miss
```

**Fix**: system prompts in versioned files, read from disk, never formed inline with f-strings that may vary.

### Anti-pattern 5: Not meeting the minimum size

```python
# Cacheable prefix of 800 tokens in Sonnet (minimum is 1024)
system = [
    {
        "type": "text",
        "text": SHORT_PROMPT,  # 800 tokens
        "cache_control": {"type": "ephemeral"}
    }
]
# Cache is not created, request runs as regular input
# cache_control is silently ignored
```

**Fix**: ensure cumulative content up to last cache_control breakpoint is ≥1024 tokens (Sonnet/Opus) or ≥2048 (Haiku). If your prompt is naturally smaller, consider whether cache is worth it.

## 5.6 External Redis: advanced caching at application layer

Anthropic prompt caching is **caching at the provider**. In complex enterprise architectures, it makes sense to also have **caching at the client** with Redis or similar KV store.

### Why external cache?

- **Exact response for same question**: if 100 devs ask the same question about architecture, you answer once and serve 100 cached responses
- **Lower latency**: hit in local Redis responds in <10ms vs 1-5s in LLM call
- **Zero cost**: redis hit consumes no tokens
- **Audit**: you fully control what is served

### Pattern 1: Exact cache by hash

```python
import hashlib
import json
from redis.asyncio import Redis

redis = Redis(host="redis.internal", port=6379, decode_responses=True)

async def cached_completion(prompt: str, system: str, ttl_seconds: int = 3600) -> str:
    """Exact cache in Redis. Hit returns without calling LLM."""
    # Cache key: hash of prompt + system + parameters
    cache_key = hashlib.sha256(
        f"{system}|||{prompt}".encode()
    ).hexdigest()
    
    # Try cache hit
    cached = await redis.get(f"llm:cache:{cache_key}")
    if cached:
        return json.loads(cached)
    
    # Miss: call LLM
    response = await llm_complete(system=system, prompt=prompt)
    
    # Store with TTL
    await redis.set(
        f"llm:cache:{cache_key}",
        json.dumps(response),
        ex=ttl_seconds,
    )
    
    return response
```

**When to use**: frequent questions (FAQ), deterministic responses, contexts where exact precision > variation.

**When NOT to use**: creative tasks, code review (each PR is different), debugging.

### Pattern 2: Semantic cache (similarity)

Exact cache fails when the question is semantically equal but with slightly different words:

```
"How do I implement authentication?"
"What's the best way to add auth?"
"How to implement authentication?"
```

Semantic cache solves this using embeddings to detect similarity.

```python
from sentence_transformers import SentenceTransformer
import numpy as np

embedder = SentenceTransformer("all-MiniLM-L6-v2")

class SemanticCache:
    def __init__(self, redis_client, similarity_threshold: float = 0.93):
        self.redis = redis_client
        self.threshold = similarity_threshold
        self.embedder = embedder
    
    async def get(self, prompt: str) -> str | None:
        """Search for semantically similar response."""
        query_embedding = self.embedder.encode(prompt)
        
        # Searches top-N candidates in Redis (ideally via vector index)
        candidates = await self._search_candidates(query_embedding, top_k=5)
        
        # Filters by threshold
        for candidate in candidates:
            if candidate["similarity"] >= self.threshold:
                return candidate["response"]
        
        return None
    
    async def set(self, prompt: str, response: str, ttl: int = 86400):
        """Stores prompt + response with embedding."""
        embedding = self.embedder.encode(prompt)
        cache_id = hashlib.sha256(prompt.encode()).hexdigest()
        
        await self.redis.hset(
            f"semantic_cache:{cache_id}",
            mapping={
                "prompt": prompt,
                "response": response,
                "embedding": embedding.tobytes(),
                "created_at": time.time(),
            }
        )
        await self.redis.expire(f"semantic_cache:{cache_id}", ttl)
        
        # In production: index in vector index (Redis Search, Pinecone, etc.)
        await self._index_embedding(cache_id, embedding)
    
    async def _search_candidates(self, query_embedding, top_k: int):
        """Search using vector similarity. Implementation depends on backend."""
        # Pseudocode: replace with Redis Search vector index, Pinecone, etc.
        # Real implementation: FT.SEARCH idx KNN query VECTOR_FIELD ...
        ...

# Usage
semantic_cache = SemanticCache(redis_client=redis, similarity_threshold=0.93)

async def smart_completion(prompt: str, system: str) -> str:
    # Try semantic cache
    cached = await semantic_cache.get(prompt)
    if cached:
        log(f"Semantic cache HIT for: {prompt[:50]}...")
        return cached
    
    # Miss: call LLM
    response = await llm_complete(system=system, prompt=prompt)
    
    # Store
    await semantic_cache.set(prompt, response)
    return response
```

**Similarity threshold**: 0.93 is conservative. Lower values (0.85-0.90) increase hit rate but reduce precision. Calibrate per feature.

**Embedding cost**: ~$0.0001 per 1K tokens. Marginal vs LLM call cost.

### Pattern 3: Hybrid cache (provider + client)

```python
class HybridLLMCache:
    """Combines Redis (client) + Anthropic prompt caching (provider)."""
    
    def __init__(self, redis_client, anthropic_client):
        self.redis = redis_client
        self.llm = anthropic_client
        self.semantic = SemanticCache(redis_client)
    
    async def complete(
        self,
        user_query: str,
        system_prompt: str,
        project_context: str,
    ) -> str:
        # Layer 1: exact cache in Redis (hit = 0 cost, <10ms latency)
        exact_key = self._exact_hash(user_query, system_prompt)
        cached_exact = await self.redis.get(f"exact:{exact_key}")
        if cached_exact:
            return cached_exact
        
        # Layer 2: semantic cache in Redis (hit = ~$0.0001, ~20ms)
        cached_semantic = await self.semantic.get(user_query)
        if cached_semantic:
            return cached_semantic
        
        # Layer 3: Anthropic prompt caching (hit = 0.1× input cost)
        response = await self.llm.messages.create(
            model="claude-sonnet-4-6-20260101",
            system=[
                {
                    "type": "text",
                    "text": system_prompt,
                    "cache_control": {"type": "ephemeral", "ttl": "1h"}
                },
                {
                    "type": "text",
                    "text": project_context,
                    "cache_control": {"type": "ephemeral", "ttl": "5m"}
                },
            ],
            messages=[{"role": "user", "content": user_query}],
            max_tokens=2000,
        )
        
        text_response = response.content[0].text
        
        # Stores in both layers for future hits
        await self.redis.setex(f"exact:{exact_key}", 86400, text_response)
        await self.semantic.set(user_query, text_response)
        
        return text_response
```

**Cache hierarchy:**

```
Layer 1: Redis exact     → 0 cost,  <10ms,  hit rate ~10-20%
Layer 2: Redis semantic  → ~marginal, ~20ms, hit rate ~20-40%
Layer 3: Anthropic cache → 0.1×,    ~1s,    hit rate ~70-85%
Layer 4: Fresh LLM       → 1.0×,    ~3s,    fallback
```

In production, combined hit rate can reach 60-90% of requests served in layers 1-2 (without LLM cost), and the rest served in layer 3 with 90% reduction vs fresh.

## 5.7 Cache in CI/CD pipelines

CI workflows running agents (automatic code review, test generation, documentation) can benefit greatly from cache, but require specific patterns.

### Cache in GitHub Actions

GitHub Actions offers `actions/cache@v4` to cache files between runs. Use for:

- System prompts, agent configs, AGENTS.md
- Pre-computed embeddings
- Slow analysis results (test discovery, codebase indexing)

**Example: codebase embeddings cache**

```yaml
# .github/workflows/code-review.yml
name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Cache codebase embeddings
        id: cache-embeddings
        uses: actions/cache@v4
        with:
          path: .cache/embeddings/
          # Key based on hash of source files
          key: embeddings-${{ hashFiles('src/**/*.py', 'src/**/*.ts') }}
          restore-keys: |
            embeddings-
      
      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      
      - name: Install dependencies
        run: pip install -r requirements.txt
      
      - name: Run AI review (with cache)
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          python scripts/ai_review.py \
            --pr-number=${{ github.event.pull_request.number }} \
            --embeddings-cache=.cache/embeddings/
```

**Script logic:**

```python
# scripts/ai_review.py
import os
from pathlib import Path
import pickle
from anthropic import Anthropic

def load_or_generate_embeddings(cache_dir: Path, source_files: list[Path]):
    cache_file = cache_dir / "embeddings.pkl"
    
    if cache_file.exists():
        # Cache hit: load and use
        with open(cache_file, "rb") as f:
            return pickle.load(f)
    
    # Cache miss: generate and save
    embeddings = {}
    for sf in source_files:
        embeddings[str(sf)] = generate_embedding(sf.read_text())
    
    cache_dir.mkdir(parents=True, exist_ok=True)
    with open(cache_file, "wb") as f:
        pickle.dump(embeddings, f)
    
    return embeddings
```

### Cache key strategy

The cache key determines hit rate. Useful patterns:

```yaml
# Cache invalidates when ANY source file changes
key: embeddings-${{ hashFiles('src/**/*.py') }}

# Cache invalidates only when relevant files change
key: embeddings-${{ hashFiles('src/core/**/*.py', 'src/api/**/*.py') }}

# Cache per branch (each branch has its cache, restore-keys allows inheritance)
key: embeddings-${{ github.ref_name }}-${{ hashFiles('src/**') }}
restore-keys: |
  embeddings-${{ github.ref_name }}-
  embeddings-main-

# Cache per month (automatic monthly refresh)
key: embeddings-${{ env.YEAR_MONTH }}-${{ hashFiles('src/**') }}
```

### Cache in Azure DevOps Pipelines

Equivalent in Azure DevOps:

```yaml
# azure-pipelines.yml
steps:
- task: Cache@2
  inputs:
    key: 'embeddings | "$(Agent.OS)" | src/**/*.py'
    restoreKeys: |
      embeddings | "$(Agent.OS)"
    path: $(Pipeline.Workspace)/.cache/embeddings
  displayName: Cache codebase embeddings

- script: |
    python scripts/ai_review.py
  env:
    ANTHROPIC_API_KEY: $(AnthropicApiKey)
  displayName: Run AI review
```

## 5.8 Cache in VS Code Copilot

GitHub Copilot in VS Code has automatic internal cache managed by the provider. You don't directly control, but you can optimize what is cacheable.

### What Copilot already caches automatically

- **Internal Copilot system prompts** (you don't see)
- **Workspace context** (`.vscode/settings.json`, AGENTS.md, copilot-instructions.md) read once per session
- **Tools definitions** of built-in tools

### How you help Copilot's cache

1. **Keep .github/copilot-instructions.md stable**. Changes to that file invalidate session cache. Update in PRs, not ad-hoc.

2. **Use .vscode/settings.json committed**. Stable settings help consistency between devs.

3. **Structure AGENTS.md as cacheable content**. Stable content at the start, more volatile content at the end.

```markdown
# AGENTS.md (good structure for cache)

## Project Identity (stable for months)
[Project type, language, framework - rarely changes]

## Conventions (stable for weeks)
[Code style, naming, structure - changes in occasional PRs]

## Recent Decisions (volatile, end of file)
[Last section, updated more frequently]
- 2026-05: Decided to use FastAPI over Flask for new services
- 2026-04: Migrated to Python 3.12
```

### Custom prompts and cache

In `.github/prompts/*.prompt.md`, long and stable prompts benefit from cache:

```markdown
---
name: deep-code-review
description: Deep code review with security and architecture focus
model: claude-sonnet-4-6
---

# Deep Code Review

[Long prompt of 3-5K tokens, STABLE, ideally cached]

## Review Checklist

### Security
- SQL injection
- XSS
- Authentication
- Authorization
[... long stable list ...]

### Architecture
[... long stable list ...]
```

When this prompt is invoked repeatedly on different PRs, Copilot/Claude reuses prefix cache, paying only for the specific diff of each PR.

## 5.9 Conclusion and next steps

You now understand:

- **Prefix cache mechanics**: byte-by-byte hash, KV state in GPU memory, lookback of 20 blocks
- **Ideal structure**: stable first, dynamic later; cache_control on the right blocks
- **TTLs**: 5min for interactive sessions, 1h for shared skills
- **Anti-patterns**: timestamp, cache on volatile block, reordering, cosmetic variation, below minimum
- **Python and Node implementation**: direct Anthropic SDK, with telemetry
- **External Redis**: exact cache, semantic cache, hybrid pattern
- **CI/CD**: embedding cache, key strategy
- **VS Code**: how you help automatic cache

In the next chapter, [06 · Agent design](./06_agent_design.md), we enter the Anthropic taxonomy, the five fundamental patterns, and how to build custom agents in VS Code, GitHub Coding Agent, MCP servers, and hooks.

---

## References for this chapter

- [Anthropic Docs · Prompt caching](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching)
- [Anthropic Cookbook · Caching examples](https://github.com/anthropics/anthropic-cookbook/tree/main/misc/prompt_caching.ipynb)
- [Redis Search · Vector similarity](https://redis.io/docs/latest/develop/interact/search-and-query/advanced-concepts/vectors/)
- [GitHub Actions · Caching dependencies](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows)
- [Azure Pipelines · Cache task](https://learn.microsoft.com/en-us/azure/devops/pipelines/release/caching)
- [Sentence Transformers · Documentation](https://www.sbert.net/)

---

**Previous chapter**: ← [04 · Context engineering](./04_context_engineering.md)
**Next chapter**: [06 · Agent design](./06_agent_design.md) →
**Back to index**: [00 · README](./00_README_INDEX.md)
