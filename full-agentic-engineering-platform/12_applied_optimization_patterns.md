---
title: "12 · Applied optimization patterns"
description: "8 ready-to-implement patterns with complete code: dynamic routing, hierarchical cache, subagent fan-out, plan/execution mode, semantic cache, tool composition, lean MCP design, custom agent SDD"
author: "Paula Silva"
role: "Software Global Black Belt"
contact: "paulasilva@microsoft.com"
date: "2026-05-04"
version: "2.0.0"
status: "approved"
language: "en"
chapter: 12
part: "V · Practical application"
tags: ["patterns", "implementation", "code", "routing", "caching", "subagent", "spec-kit"]
---

# 12 · Applied optimization patterns

> Theory without code does not save tokens. This chapter brings eight patterns ready for you to implement tomorrow, with complete code and measurable impact. Each pattern solves a specific cost problem. Combined, they reduce total cost by 40-70% in enterprise agentic workloads.

## 12.1 Pattern 1 · Dynamic routing by complexity

**Problem**: team uses Sonnet 4.6 or Opus 4.7 as default for everything. Pays $3-15 input for questions that GPT-5 mini ($0 bundled) or Haiku ($1) would solve.

**Solution**: cheap classifier decides model by request complexity.

**Impact**: 40-70% reduction in average cost without perceived quality loss.

### Complete code

```python
# patterns/dynamic_routing.py
import os
from enum import Enum
from anthropic import AsyncAnthropic
from openai import AsyncOpenAI

class Tier(Enum):
    BUNDLED = "bundled"        # GPT-5 mini, GPT-4.1 (free in plan)
    CHEAP = "cheap"            # Haiku, Gemini Flash
    WORKHORSE = "workhorse"    # Sonnet 4.6
    PREMIUM = "premium"        # Opus 4.7
    LONG_CONTEXT = "long_ctx"  # Gemini 3.1 Pro

# Static heuristics by keywords (no cost)
PREMIUM_KEYWORDS = {
    "architect", "architecture", "redesign",
    "trade-off", "tradeoff", "design decision",
    "complex bug", "race condition", "deadlock",
    "distributed system", "consensus",
}

CHEAP_KEYWORDS = {
    "rename", "format", "extract function",
    "add docstring", "fix typo", "simple",
    "what is", "explain briefly", "summarize",
}

class ModelRouter:
    def __init__(
        self,
        anthropic_client: AsyncAnthropic,
        openai_client: AsyncOpenAI,
        telemetry=None,
    ):
        self.anthropic = anthropic_client
        self.openai = openai_client
        self.telemetry = telemetry
    
    def static_classify(self, prompt: str, context_tokens: int) -> Tier | None:
        """Static classification (no LLM call, no cost)."""
        prompt_lower = prompt.lower()
        
        # Long context has priority
        if context_tokens > 100_000:
            return Tier.LONG_CONTEXT
        
        # Keyword-based heuristic
        if any(kw in prompt_lower for kw in PREMIUM_KEYWORDS):
            return Tier.PREMIUM
        
        if any(kw in prompt_lower for kw in CHEAP_KEYWORDS):
            return Tier.CHEAP
        
        # Cannot classify statically
        return None
    
    async def dynamic_classify(self, prompt: str) -> Tier:
        """Dynamic classification using Haiku ($0.00007 per classification)."""
        response = await self.anthropic.messages.create(
            model="claude-haiku-4-5",
            max_tokens=10,
            messages=[{
                "role": "user",
                "content": (
                    f"Classify this coding request as ONE word: "
                    f"trivial, routine, complex, or expert.\n\n"
                    f"Request: {prompt[:500]}\n\n"
                    f"Output only the classification."
                )
            }],
        )
        
        text = response.content[0].text.strip().lower()
        return {
            "trivial": Tier.BUNDLED,
            "routine": Tier.CHEAP,
            "complex": Tier.WORKHORSE,
            "expert": Tier.PREMIUM,
        }.get(text, Tier.WORKHORSE)  # safe default
    
    async def route(
        self,
        prompt: str,
        context_tokens: int = 0,
        force_tier: Tier | None = None,
    ) -> dict:
        """Decide tier and model."""
        if force_tier:
            tier = force_tier
            method = "explicit"
        else:
            # Try static first (free)
            tier = self.static_classify(prompt, context_tokens)
            method = "static"
            
            if tier is None:
                # Dynamic fallback
                tier = await self.dynamic_classify(prompt)
                method = "dynamic"
        
        model_map = {
            Tier.BUNDLED: ("gpt-5-mini", "openai"),
            Tier.CHEAP: ("claude-haiku-4-5", "anthropic"),
            Tier.WORKHORSE: ("claude-sonnet-4-6", "anthropic"),
            Tier.PREMIUM: ("claude-opus-4-7", "anthropic"),
            Tier.LONG_CONTEXT: ("gemini-3.1-pro", "google"),
        }
        
        model, provider = model_map[tier]
        decision = {
            "tier": tier.value,
            "model": model,
            "provider": provider,
            "method": method,
        }
        
        if self.telemetry:
            self.telemetry.record_routing(decision)
        
        return decision
    
    async def complete(self, prompt: str, system: str = "", **kwargs) -> str:
        decision = await self.route(prompt, kwargs.get("context_tokens", 0))
        
        if decision["provider"] == "anthropic":
            response = await self.anthropic.messages.create(
                model=decision["model"],
                system=system,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=kwargs.get("max_tokens", 2000),
            )
            return response.content[0].text
        elif decision["provider"] == "openai":
            response = await self.openai.chat.completions.create(
                model=decision["model"],
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user", "content": prompt},
                ],
                max_tokens=kwargs.get("max_tokens", 2000),
            )
            return response.choices[0].message.content
```

### Usage

```python
import asyncio
from anthropic import AsyncAnthropic
from openai import AsyncOpenAI

router = ModelRouter(
    anthropic_client=AsyncAnthropic(),
    openai_client=AsyncOpenAI(),
)

# In production: each call automatically routed
result = await router.complete(
    "Add a docstring to this function",  # → BUNDLED
)
result = await router.complete(
    "Refactor this 500-line function into smaller pieces",  # → WORKHORSE
)
result = await router.complete(
    "Architect a distributed cache layer for our microservices",  # → PREMIUM
)
```

## 12.2 Pattern 2 · Hierarchical cache (3 layers)

**Problem**: exact cache in Redis misses when question has cosmetic variation. Cache at provider (Anthropic) only works in session.

**Solution**: 3 combined layers - exact Redis + semantic Redis + Anthropic prompt cache.

**Impact**: combined hit rate 60-90%, 50-80% reduction in input cost.

### Complete code

```python
# patterns/hierarchical_cache.py
import hashlib
import json
import time
from redis.asyncio import Redis
from anthropic import AsyncAnthropic
from sentence_transformers import SentenceTransformer
import numpy as np

class HierarchicalCache:
    """Cache in 3 layers: exact → semantic → provider."""
    
    def __init__(
        self,
        redis_client: Redis,
        anthropic_client: AsyncAnthropic,
        similarity_threshold: float = 0.93,
    ):
        self.redis = redis_client
        self.llm = anthropic_client
        self.threshold = similarity_threshold
        self.embedder = SentenceTransformer("all-MiniLM-L6-v2")
        
        # Telemetry
        self.stats = {
            "exact_hits": 0,
            "semantic_hits": 0,
            "anthropic_hits": 0,
            "fresh_calls": 0,
        }
    
    def _exact_key(self, system: str, user: str) -> str:
        """Deterministic hash of system+user pair."""
        return hashlib.sha256(f"{system}|||{user}".encode()).hexdigest()
    
    async def _try_exact(self, system: str, user: str) -> str | None:
        """Layer 1: exact cache in Redis."""
        key = f"exact:{self._exact_key(system, user)}"
        cached = await self.redis.get(key)
        if cached:
            self.stats["exact_hits"] += 1
            return cached.decode() if isinstance(cached, bytes) else cached
        return None
    
    async def _try_semantic(self, user: str) -> str | None:
        """Layer 2: semantic cache via embedding similarity."""
        embedding = self.embedder.encode(user)
        
        # In production: use Redis Search with vector index
        # Here simplified: scan last 1000 entries
        candidates = await self.redis.zrevrange("semantic:index", 0, 999, withscores=True)
        
        for cand_id, _ in candidates:
            cand_data = await self.redis.hgetall(f"semantic:{cand_id.decode()}")
            if not cand_data:
                continue
            
            cand_emb = np.frombuffer(cand_data[b"embedding"], dtype=np.float32)
            similarity = float(np.dot(embedding, cand_emb) / 
                              (np.linalg.norm(embedding) * np.linalg.norm(cand_emb)))
            
            if similarity >= self.threshold:
                self.stats["semantic_hits"] += 1
                return cand_data[b"response"].decode()
        
        return None
    
    async def _store_semantic(self, user: str, response: str):
        """Stores in semantic cache."""
        cache_id = hashlib.sha256(user.encode()).hexdigest()[:16]
        embedding = self.embedder.encode(user).astype(np.float32)
        
        await self.redis.hset(
            f"semantic:{cache_id}",
            mapping={
                "user": user,
                "response": response,
                "embedding": embedding.tobytes(),
                "ts": int(time.time()),
            },
        )
        await self.redis.expire(f"semantic:{cache_id}", 86400)  # 24h
        await self.redis.zadd("semantic:index", {cache_id: time.time()})
    
    async def complete(
        self,
        system: str,
        user: str,
        project_context: str = "",
        model: str = "claude-sonnet-4-6",
    ) -> str:
        """Completion with hierarchical cache."""
        
        # Layer 1: exact cache (0 cost, <10ms)
        exact = await self._try_exact(system, user)
        if exact:
            return exact
        
        # Layer 2: semantic cache (~$0.0001 embed, ~20ms)
        semantic = await self._try_semantic(user)
        if semantic:
            # Also store as exact for next call
            await self.redis.setex(
                f"exact:{self._exact_key(system, user)}",
                3600,
                semantic,
            )
            return semantic
        
        # Layer 3: LLM call with Anthropic prompt caching
        response = await self.llm.messages.create(
            model=model,
            max_tokens=2000,
            system=[
                {
                    "type": "text",
                    "text": system,
                    "cache_control": {"type": "ephemeral", "ttl": "1h"},
                },
                {
                    "type": "text",
                    "text": project_context,
                    "cache_control": {"type": "ephemeral", "ttl": "5m"},
                },
            ],
            messages=[{"role": "user", "content": user}],
        )
        
        text = response.content[0].text
        
        # Telemetry of what came from Anthropic cache
        if response.usage.cache_read_input_tokens > 0:
            self.stats["anthropic_hits"] += 1
        else:
            self.stats["fresh_calls"] += 1
        
        # Stores in both layers
        await self.redis.setex(
            f"exact:{self._exact_key(system, user)}",
            3600,
            text,
        )
        await self._store_semantic(user, text)
        
        return text
    
    def report(self) -> dict:
        """Hit rate report."""
        total = sum(self.stats.values())
        if total == 0:
            return self.stats
        
        return {
            **self.stats,
            "exact_hit_rate": self.stats["exact_hits"] / total,
            "semantic_hit_rate": self.stats["semantic_hits"] / total,
            "anthropic_hit_rate": self.stats["anthropic_hits"] / total,
            "any_hit_rate": (
                total - self.stats["fresh_calls"]
            ) / total,
        }
```

## 12.3 Pattern 3 · Subagent fan-out

**Problem**: lead agent accumulates context (800K+ tokens) when exploring large codebase.

**Solution**: fan-out to subagents with isolated context, each returns summary ≤2K tokens. Lead synthesizes.

**Impact**: 70-90% reduction in exploration workflows.

### Complete code

```python
# patterns/subagent_fanout.py
import asyncio
from dataclasses import dataclass, field
from anthropic import AsyncAnthropic

@dataclass
class SubagentResult:
    subtask: str
    summary: str
    findings: list[str] = field(default_factory=list)
    cost_estimate: float = 0.0

class SubagentFanout:
    def __init__(self, client: AsyncAnthropic):
        self.client = client
    
    async def run_subagent(
        self,
        subtask: str,
        relevant_files: list[str],
        max_iterations: int = 8,
    ) -> SubagentResult:
        """Executes subagent with isolated context and limited budget."""
        
        system = (
            f"You are a focused subagent. Your task: {subtask}\n"
            f"You have access to these files only: {', '.join(relevant_files)}\n\n"
            f"Constraints:\n"
            f"- Maximum {max_iterations} tool calls\n"
            f"- Output: structured summary, max 2000 tokens\n"
            f"- Format: ## Findings (bullet list) ## Summary (2-3 paragraphs)\n"
            f"- Do NOT continue beyond your subtask scope"
        )
        
        # Read-only tools (subagents do not modify state)
        tools = [
            {
                "name": "read_file",
                "description": "Read file contents",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "path": {"type": "string"},
                        "lines": {"type": "string", "description": "e.g. '1-100'"},
                    },
                    "required": ["path"],
                },
            },
            {
                "name": "search",
                "description": "Search for pattern in files",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "query": {"type": "string"},
                        "files": {"type": "array", "items": {"type": "string"}},
                    },
                    "required": ["query"],
                },
            },
        ]
        
        messages = [{"role": "user", "content": subtask}]
        total_tokens = 0
        
        for iteration in range(max_iterations):
            response = await self.client.messages.create(
                model="claude-sonnet-4-6",
                max_tokens=2000,
                system=system,
                tools=tools,
                messages=messages,
            )
            
            total_tokens += response.usage.input_tokens + response.usage.output_tokens
            
            messages.append({"role": "assistant", "content": response.content})
            
            if response.stop_reason == "end_turn":
                break
            
            if response.stop_reason == "tool_use":
                # Execute tool calls
                tool_results = []
                for block in response.content:
                    if block.type == "tool_use":
                        result = await self._execute_tool(block.name, block.input)
                        tool_results.append({
                            "type": "tool_result",
                            "tool_use_id": block.id,
                            "content": result,
                        })
                messages.append({"role": "user", "content": tool_results})
        
        # Extract summary from last response
        last_text = next(
            (b.text for b in response.content if hasattr(b, "text")),
            "No summary produced"
        )
        
        # Estimate cost (Sonnet 4.6: $3/M input, $15/M output)
        cost = total_tokens * 3 / 1_000_000  # approximation
        
        return SubagentResult(
            subtask=subtask,
            summary=last_text,
            findings=self._extract_findings(last_text),
            cost_estimate=cost,
        )
    
    async def _execute_tool(self, name: str, args: dict) -> str:
        """Implement real tools here."""
        if name == "read_file":
            return f"[Contents of {args['path']}]"  # placeholder
        elif name == "search":
            return f"[Search results for '{args['query']}']"
        return "Tool not implemented"
    
    def _extract_findings(self, text: str) -> list[str]:
        """Extract bullet points from summary."""
        findings = []
        for line in text.split("\n"):
            line = line.strip()
            if line.startswith(("- ", "* ", "• ")):
                findings.append(line[2:])
        return findings
    
    async def explore(
        self,
        original_task: str,
        subtasks: list[dict],  # [{"task": "...", "files": [...]}, ...]
    ) -> dict:
        """Lead orchestrates: decompose, dispatch subagents, synthesize."""
        
        # Dispatch subagents in parallel
        results = await asyncio.gather(*[
            self.run_subagent(
                subtask=st["task"],
                relevant_files=st["files"],
                max_iterations=8,
            )
            for st in subtasks
        ])
        
        # Lead synthesizes only the summaries
        synthesis_prompt = (
            f"Original task: {original_task}\n\n"
            f"Subagent findings:\n\n" +
            "\n\n".join([
                f"### Subtask: {r.subtask}\n{r.summary}"
                for r in results
            ])
        )
        
        synthesis_response = await self.client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=2000,
            system=(
                "You are the lead agent. Synthesize the findings from your "
                "subagents into a coherent answer to the original task. "
                "Do not repeat raw findings; integrate them."
            ),
            messages=[{"role": "user", "content": synthesis_prompt}],
        )
        
        return {
            "answer": synthesis_response.content[0].text,
            "subagent_results": results,
            "total_subagent_cost": sum(r.cost_estimate for r in results),
            "synthesis_tokens": (
                synthesis_response.usage.input_tokens
                + synthesis_response.usage.output_tokens
            ),
        }
```

## 12.4 Pattern 4 · Plan/Execution mode

**Problem**: using Opus 4.7 in agent mode for large tasks costs a lot. But Sonnet alone may fail at complex planning.

**Solution**: Plan mode with Opus (high quality planning), Execution with Sonnet (cheap execution).

**Impact**: cost similar to "all Sonnet" + quality similar to "all Opus" = best possible ROI.

### Complete code

```python
# patterns/plan_execution.py
from anthropic import AsyncAnthropic

class PlanExecutionAgent:
    """Plan with Opus, Execute with Sonnet. Best of both worlds."""
    
    def __init__(self, client: AsyncAnthropic):
        self.client = client
    
    async def plan(self, task: str, project_context: str) -> dict:
        """Phase 1: Plan with Opus 4.7 (premium quality, low volume)."""
        
        response = await self.client.messages.create(
            model="claude-opus-4-7",
            max_tokens=3000,
            system=[
                {
                    "type": "text",
                    "text": (
                        "You are a senior architect planning a coding task. "
                        "Decompose the task into clear, sequenced steps. "
                        "Do NOT write code yet. Output a structured plan only.\n\n"
                        "Format:\n"
                        "## Goal\n[one sentence]\n\n"
                        "## Approach\n[2-3 sentences]\n\n"
                        "## Steps\n"
                        "1. [step] (rationale)\n"
                        "2. [step] (rationale)\n"
                        "...\n\n"
                        "## Risks\n[potential issues]\n"
                    ),
                },
                {
                    "type": "text",
                    "text": project_context,
                    "cache_control": {"type": "ephemeral", "ttl": "1h"},
                },
            ],
            messages=[{"role": "user", "content": task}],
        )
        
        plan_text = response.content[0].text
        
        return {
            "plan": plan_text,
            "tokens_used": (
                response.usage.input_tokens
                + response.usage.output_tokens
            ),
            "cost_estimate": (
                response.usage.input_tokens * 15 / 1_000_000
                + response.usage.output_tokens * 75 / 1_000_000
            ),
        }
    
    async def execute(
        self,
        task: str,
        plan: str,
        project_context: str,
    ) -> dict:
        """Phase 2: Execute with Sonnet 4.6 (workhorse, high volume)."""
        
        # Plan is cached for 1h TTL - multiple executions reuse
        response = await self.client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=4000,
            system=[
                {
                    "type": "text",
                    "text": (
                        "You are an expert engineer executing an approved plan. "
                        "Follow the plan exactly. Output code with explanations."
                    ),
                },
                {
                    "type": "text",
                    "text": f"## Approved plan\n\n{plan}",
                    "cache_control": {"type": "ephemeral", "ttl": "5m"},
                },
                {
                    "type": "text",
                    "text": project_context,
                    "cache_control": {"type": "ephemeral", "ttl": "1h"},
                },
            ],
            messages=[{"role": "user", "content": f"Execute: {task}"}],
        )
        
        return {
            "implementation": response.content[0].text,
            "tokens_used": (
                response.usage.input_tokens
                + response.usage.output_tokens
            ),
            "cache_read": response.usage.cache_read_input_tokens,
            "cost_estimate": (
                response.usage.input_tokens * 3 / 1_000_000
                + response.usage.output_tokens * 15 / 1_000_000
                + response.usage.cache_read_input_tokens * 0.3 / 1_000_000
            ),
        }
    
    async def run(self, task: str, project_context: str) -> dict:
        """Complete workflow: plan → human review (optional) → execute."""
        
        plan_result = await self.plan(task, project_context)
        
        # Here in production: human review of plan
        # In automation: proceeds directly
        
        exec_result = await self.execute(task, plan_result["plan"], project_context)
        
        return {
            "plan": plan_result["plan"],
            "implementation": exec_result["implementation"],
            "total_cost": plan_result["cost_estimate"] + exec_result["cost_estimate"],
            "breakdown": {
                "plan_cost": plan_result["cost_estimate"],
                "exec_cost": exec_result["cost_estimate"],
            },
        }
```

### Cost comparison

```
Scenario: large feature implementation, 50K input total

All Opus 4.7:
  Plan + Execute in Opus
  Total: 50K × $15/M + 5K output × $75/M = $1.125

All Sonnet 4.6:
  Plan + Execute in Sonnet
  Total: 50K × $3/M + 5K × $15/M = $0.225
  Risk: plan may be inferior, generating extra refactor

Plan-Execute (Opus + Sonnet):
  Plan: 10K × $15/M + 1K × $75/M = $0.225
  Execute: 40K × $3/M + 4K × $15/M = $0.180
  Total: $0.405
  
ROI: 64% cheaper than Opus, with Opus plan quality
```

## 12.5 Pattern 5 · Semantic cache with fallback

Already partially covered in 12.2. I'll expand with standalone version for use outside hierarchical.

**Problem**: exact cache misses when questions are semantically equal but with cosmetic variation.

**Solution**: cache by embedding similarity with adjustable threshold.

**Impact**: additional hit rate 20-40% over exact cache in FAQs and recurring questions.

```python
# patterns/semantic_cache_standalone.py
# Complete implementation in /D_appendix_complete_code.md
# Here: the standalone version for direct use

from sentence_transformers import SentenceTransformer
import numpy as np
import time

class SemanticCacheStandalone:
    """Standalone semantic cache, in-memory or with Redis."""
    
    def __init__(self, threshold: float = 0.93, max_entries: int = 10_000):
        self.embedder = SentenceTransformer("all-MiniLM-L6-v2")
        self.threshold = threshold
        self.max_entries = max_entries
        self.entries = []  # [{"prompt": ..., "embedding": ..., "response": ..., "ts": ...}]
    
    def get(self, prompt: str) -> str | None:
        """Search semantically similar response."""
        if not self.entries:
            return None
        
        query_emb = self.embedder.encode(prompt)
        
        best_match = None
        best_sim = 0
        
        for entry in self.entries:
            sim = float(np.dot(query_emb, entry["embedding"]) / 
                       (np.linalg.norm(query_emb) * np.linalg.norm(entry["embedding"])))
            if sim > best_sim:
                best_sim = sim
                best_match = entry
        
        if best_sim >= self.threshold:
            return best_match["response"]
        
        return None
    
    def set(self, prompt: str, response: str):
        """Stores with LRU eviction."""
        if len(self.entries) >= self.max_entries:
            # LRU: remove oldest
            self.entries.sort(key=lambda e: e["ts"])
            self.entries.pop(0)
        
        self.entries.append({
            "prompt": prompt,
            "embedding": self.embedder.encode(prompt),
            "response": response,
            "ts": time.time(),
        })
```

## 12.6 Pattern 6 · Tool composition for token efficiency

**Problem**: 10 individual tools, each with 200 tokens of definition = 2,000 tokens of overhead in every turn.

**Solution**: composed tools that combine related operations. 3 tools covering the same space.

**Impact**: 60-70% reduction in system prompt overhead.

```python
# patterns/tool_composition.py

# BAD: 8 individual tools (~1,500 tokens in definitions)
TOOLS_GRANULAR = [
    {"name": "read_file", "description": "Read entire file", ...},
    {"name": "read_lines", "description": "Read specific lines", ...},
    {"name": "search_in_file", "description": "Search within a file", ...},
    {"name": "search_in_directory", "description": "Search a directory", ...},
    {"name": "search_recursive", "description": "Recursive search", ...},
    {"name": "list_files", "description": "List files in dir", ...},
    {"name": "find_files", "description": "Find files by name", ...},
    {"name": "grep_content", "description": "Grep file contents", ...},
]

# GOOD: 3 composed tools (~400 tokens)
TOOLS_COMPOSED = [
    {
        "name": "read",
        "description": "Read file or section. Use 'lines' for ranges.",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string"},
                "lines": {
                    "type": "string",
                    "description": "Optional. e.g. '1-100' or 'all' (default: 1-200)"
                },
            },
            "required": ["path"],
        },
    },
    {
        "name": "search",
        "description": "Search by content (regex) or filename. Returns top 20 matches.",
        "input_schema": {
            "type": "object",
            "properties": {
                "pattern": {"type": "string"},
                "type": {
                    "type": "string",
                    "enum": ["content", "filename"],
                    "default": "content"
                },
                "scope": {
                    "type": "string",
                    "description": "Glob, e.g. 'src/**/*.py' (default: '**/*')"
                },
            },
            "required": ["pattern"],
        },
    },
    {
        "name": "list",
        "description": "List directory. Returns counts by extension if >50 files.",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string", "default": "."},
                "depth": {"type": "integer", "default": 1, "maximum": 5},
            },
        },
    },
]

# Backend implementation
async def execute_tool(name: str, args: dict) -> str:
    if name == "read":
        return await read_impl(args["path"], args.get("lines", "1-200"))
    elif name == "search":
        return await search_impl(
            args["pattern"],
            args.get("type", "content"),
            args.get("scope", "**/*"),
        )
    elif name == "list":
        return await list_impl(args.get("path", "."), args.get("depth", 1))
    raise ValueError(f"Unknown tool: {name}")
```

## 12.7 Pattern 7 · Lean MCP server design (template)

Complements chapter 06 with **complete template of token-efficient MCP server**.

```python
# patterns/mcp_server_lean_template.py
"""
Complete template of lean MCP server.
Total tokens in definitions: ~250 (vs 1000+ in verbose servers).
"""
from mcp.server import Server
from mcp.types import Tool, Resource, TextContent
from pathlib import Path
import re

server = Server("code-tools-lean")

# ── Lean tools ───────────────────────────────────────────────────────

@server.list_tools()
async def list_tools() -> list[Tool]:
    return [
        Tool(
            name="read",
            description="Read file lines (default: 1-200).",
            inputSchema={
                "type": "object",
                "properties": {
                    "path": {"type": "string"},
                    "start": {"type": "integer", "default": 1},
                    "count": {"type": "integer", "default": 200, "maximum": 500},
                },
                "required": ["path"],
            },
        ),
        Tool(
            name="search",
            description="Search codebase. Returns top 20 matches.",
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {"type": "string"},
                    "include": {"type": "string", "default": "**/*"},
                },
                "required": ["query"],
            },
        ),
        Tool(
            name="summary",
            description="Summarize directory contents.",
            inputSchema={
                "type": "object",
                "properties": {"path": {"type": "string"}},
                "required": ["path"],
            },
        ),
    ]

@server.call_tool()
async def call_tool(name: str, args: dict) -> list[TextContent]:
    if name == "read":
        return [TextContent(type="text", text=await read_impl(**args))]
    elif name == "search":
        return [TextContent(type="text", text=await search_impl(**args))]
    elif name == "summary":
        return [TextContent(type="text", text=await summary_impl(**args))]

# ── Focused implementations ──────────────────────────────────────────

async def read_impl(path: str, start: int = 1, count: int = 200) -> str:
    p = Path(path)
    if not p.exists():
        return f"File not found: {path}"
    lines = p.read_text().splitlines()
    end = min(start + count - 1, len(lines))
    section = "\n".join(lines[start-1:end])
    
    return (
        f"# {path} (lines {start}-{end} of {len(lines)})\n\n"
        f"{section}\n\n"
        + (f"[More lines available: {end+1}-{len(lines)}]" if end < len(lines) else "")
    )

async def search_impl(query: str, include: str = "**/*") -> str:
    pattern = re.compile(query)
    matches = []
    
    for path in Path(".").rglob(include.lstrip("**/")):
        if not path.is_file():
            continue
        try:
            for ln, line in enumerate(path.read_text().splitlines(), 1):
                if pattern.search(line):
                    matches.append((str(path), ln, line.strip()[:100]))
                    if len(matches) >= 20:
                        break
        except (UnicodeDecodeError, PermissionError):
            continue
        if len(matches) >= 20:
            break
    
    if not matches:
        return f"No matches for '{query}'"
    
    return "\n".join([
        f"{path}:{ln}: {line}"
        for path, ln, line in matches
    ])

async def summary_impl(path: str) -> str:
    p = Path(path)
    if not p.exists() or not p.is_dir():
        return f"Not a directory: {path}"
    
    counts = {}
    for f in p.rglob("*"):
        if f.is_file():
            ext = f.suffix or "(no_ext)"
            counts[ext] = counts.get(ext, 0) + 1
    
    total = sum(counts.values())
    
    return (
        f"# {path}\n\n"
        f"Total files: {total}\n\n"
        + "\n".join([f"- {ext}: {n}" for ext, n in sorted(counts.items(), key=lambda x: -x[1])])
    )

# ── Lazy-load resources ──────────────────────────────────────────────

@server.list_resources()
async def list_resources() -> list[Resource]:
    return [
        Resource(uri="agents.md", name="Project conventions"),
        Resource(uri="package.json", name="Dependencies"),
    ]

@server.read_resource()
async def read_resource(uri: str) -> str:
    if uri == "agents.md":
        return Path("AGENTS.md").read_text() if Path("AGENTS.md").exists() else "Not found"
    elif uri == "package.json":
        return Path("package.json").read_text() if Path("package.json").exists() else "Not found"
    return f"Unknown resource: {uri}"

# ── Run ──────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import asyncio
    from mcp.server.stdio import stdio_server
    
    async def main():
        async with stdio_server() as (read_stream, write_stream):
            await server.run(read_stream, write_stream)
    
    asyncio.run(main())
```

## 12.8 Pattern 8 · Custom agent with Spec-Kit (SDD)

**Problem**: customized agents without structure repeat work, lose context, generate code that does not respect project constraints.

**Solution**: combine custom agent (`.agents/`) with Spec-Kit (CONSTITUTION + SPECIFICATION + IMPLEMENTATION_PLAN).

**Impact**: 40-60% reduction in refinement iterations (ch. 06).

### Complete structure

```
.agents/
  └── feature-implementer.agent.md
.specs/
  └── auth-rate-limiting/
      ├── CONSTITUTION.md
      ├── SPECIFICATION.md
      └── IMPLEMENTATION_PLAN.md
```

### `.agents/feature-implementer.agent.md`

```markdown
---
name: feature-implementer
description: Implements features following Spec-Kit
model: claude-sonnet-4-6
mode: agent
tools:
  - read
  - search
  - edit_file
  - run_tests
context_files:
  - AGENTS.md
  - .specs/{feature}/CONSTITUTION.md
  - .specs/{feature}/SPECIFICATION.md
  - .specs/{feature}/IMPLEMENTATION_PLAN.md
max_iterations: 25
max_tokens_per_session: 500000
---

# Feature Implementer

You implement features following Spec-Kit strictly.

## Workflow

1. **Read CONSTITUTION.md first**. Non-negotiable principles.
2. **Read SPECIFICATION.md**. Requirements in EARS notation.
3. **Read IMPLEMENTATION_PLAN.md**. Ordered tasks with [P] markers.
4. **Execute tasks in plan order**. Tasks with [P] can run in parallel via subagents.
5. **For each task**:
   - Read existing code (use search)
   - Implement following AGENTS.md conventions
   - Run tests
   - Mark task as done

## Constraints

- Never violate CONSTITUTION principles
- Never implement something outside SPECIFICATION
- If requirements are ambiguous, write a question in the PR and stop
- Each implemented task must pass tests before continuing

## Output

When finished, generate PR with:
- Title: `feat(auth): {summary from spec}`
- Body referencing .specs/{feature}/SPECIFICATION.md
- Each commit references a task: `T2.1: implement /auth/login endpoint`
```

### `.specs/auth-rate-limiting/CONSTITUTION.md`

```markdown
# Constitution: Auth Rate Limiting

## Non-negotiable principles

1. NEVER expose user IDs in rate limit error messages
2. ALWAYS log rate limit violations to security audit log
3. NEVER use IP-only rate limiting (combine with user ID for authenticated endpoints)
4. ALWAYS use Redis with TTL, not in-memory state
5. NEVER block more than necessary (return 429 with Retry-After)

## Compliance

- LGPD: log only IP hash, not raw IP
- SOC 2: complete audit trail of blocks
```

### `.specs/auth-rate-limiting/SPECIFICATION.md`

```markdown
# Specification: Auth Rate Limiting

## Functional Requirements (EARS)

### Ubiquitous
- The system SHALL track login attempts using Redis with key `ratelimit:login:{user_id_hash}`.
- The system SHALL track unauthenticated attempts using `ratelimit:login:ip:{ip_hash}`.

### Event-driven
- WHEN a user fails authentication 5 times in 15 minutes, the system SHALL block further attempts for 15 minutes.
- WHEN an IP exceeds 20 unauthenticated attempts in 5 minutes, the system SHALL return 429 for 30 minutes.
- WHEN the system blocks an attempt, the system SHALL log to security_audit with severity=warning.

### State-driven
- WHILE a user is blocked, the system SHALL return 429 with Retry-After header.

### Optional
- WHERE 2FA is enabled for the user, the system SHALL use stricter limits (3 attempts per 15 min).

## Non-functional Requirements

- Performance: <5ms overhead per request
- Availability: graceful degradation if Redis is down (fail-open with logging)
```

### `.specs/auth-rate-limiting/IMPLEMENTATION_PLAN.md`

```markdown
# Implementation Plan: Auth Rate Limiting

## Phase 1: Foundation
- [ ] T1.1 [P] Create Redis client wrapper with health check
- [ ] T1.2 [P] Define RateLimitConfig dataclass
- [ ] T1.3 Setup audit logger integration

## Phase 2: Core middleware (after Phase 1)
- [ ] T2.1 Implement RateLimiter class with sliding window
- [ ] T2.2 [P] Implement IP-based rate limiter
- [ ] T2.3 [P] Implement user-based rate limiter
- [ ] T2.4 Compose middleware combining both

## Phase 3: Integration (after Phase 2)
- [ ] T3.1 Apply middleware to /auth/login route
- [ ] T3.2 [P] Add 2FA stricter limits branch
- [ ] T3.3 [P] Add fail-open logic for Redis down

## Phase 4: Tests (after Phase 3)
- [ ] T4.1 [P] Unit tests for RateLimiter class
- [ ] T4.2 [P] Integration tests for happy path
- [ ] T4.3 [P] Integration tests for blocked path
- [ ] T4.4 [P] Integration tests for Redis-down scenario
- [ ] T4.5 Security audit test (verify no PII leaked)
```

### How agent uses this structure

When the agent is invoked:

```bash
# In VS Code
@feature-implementer implements .specs/auth-rate-limiting/
```

The agent:
1. Reads CONSTITUTION (principles)
2. Reads SPECIFICATION (requirements)
3. Reads IMPLEMENTATION_PLAN (tasks)
4. For each task, executes in order
5. `[P]` tasks are dispatched to subagents in parallel
6. Each task ends with tests passing or question in PR
7. Final PR references spec and has granular commits

## 12.9 Conclusion and next steps

You now have **8 patterns implementable today**:

1. **Dynamic routing**: static + dynamic classifier, 40-70% reduction
2. **Hierarchical cache**: 3 layers (exact + semantic + Anthropic), hit rate 60-90%
3. **Subagent fan-out**: isolated context, 70-90% reduction in exploration
4. **Plan/Execute**: Opus for plan, Sonnet for execute, 64% cheaper than all Opus
5. **Standalone semantic cache**: hit rate +20-40% over exact cache
6. **Tool composition**: 60-70% reduction in system prompt overhead
7. **Lean MCP server**: complete template, 250 tokens in definitions
8. **Spec-Kit + custom agent**: 40-60% reduction in refinement iterations

Combined in enterprise workloads, these patterns deliver **40-70% reduction in total cost**.

In the next chapter, [13 · Anti-patterns and decision frameworks](./13_anti_patterns_decision.md), we close the playbook with 10 cataloged anti-patterns, 3 decision frameworks (model, agent vs workflow, optimization order), and a complete operational checklist in 4 phases.

---

## References for this chapter

- [Anthropic · Building effective agents](https://www.anthropic.com/research/building-effective-agents)
- [Anthropic · Effective context engineering](https://www.anthropic.com/research/effective-context-engineering)
- [Spec-Kit · Spec-Driven Development](https://github.com/github/spec-kit)
- [EARS · Easy Approach to Requirements Syntax](https://alistairmavin.com/ears/)
- [MCP · Specification](https://modelcontextprotocol.io/)
- arXiv:2603.29919. *SkillReducer*.
- arXiv:2601.21714. *E-mem subagent hierarchy*.

---

**Previous chapter**: ← [11 · Azure AI Foundry in the ecosystem](./11_azure_ai_foundry.md)
**Next chapter**: [13 · Anti-patterns and decision frameworks](./13_anti_patterns_decision.md) →
**Back to index**: [00 · README](./00_README_INDEX.md)
