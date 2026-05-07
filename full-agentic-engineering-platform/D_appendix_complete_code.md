---
title: "Appendix D · Complete code"
description: "Centralized implementation: Model router class, cache helpers, telemetry instrumentation, token-efficient MCP server template"
author: "Paula Silva"
role: "Software Global Black Belt"
contact: "paulasilva@microsoft.com"
date: "2026-05-04"
version: "2.0.0"
status: "approved"
language: "en"
appendix: "D"
tags: ["code", "implementation", "reference"]
---

# Appendix D · Complete code

> All implementation centralized. Use as starting point. Adapt to your stack.

## D.1 Production-ready enterprise model router

```python
# src/llm_router/router.py
"""
Production-ready model router for enterprise.
Supports: Anthropic, OpenAI, Google. Static + dynamic routing.
Telemetry, audit, fallbacks.
"""
import asyncio
import logging
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Any, Optional

from anthropic import AsyncAnthropic, APIError as AnthropicError
from openai import AsyncOpenAI, APIError as OpenAIError

logger = logging.getLogger(__name__)


class Tier(Enum):
    BUNDLED = "bundled"
    CHEAP = "cheap"
    WORKHORSE = "workhorse"
    PREMIUM = "premium"
    LONG_CONTEXT = "long_context"


@dataclass
class RoutingDecision:
    tier: Tier
    model: str
    provider: str
    method: str  # "static", "dynamic", "explicit", "fallback"
    rationale: str
    timestamp: datetime = field(default_factory=datetime.utcnow)


class TelemetryClient:
    """Plug your OTLP collector here."""
    
    async def record_routing(self, decision: RoutingDecision, **context):
        logger.info(
            f"Routing: tier={decision.tier.value} model={decision.model} "
            f"provider={decision.provider} method={decision.method}"
        )
        # In production: send to OTLP collector
    
    async def record_completion(self, model: str, usage: dict, **context):
        logger.info(f"Completion: model={model} usage={usage}")


class ModelRouter:
    """Enterprise router with static + dynamic classifier, audit, fallbacks."""
    
    PREMIUM_KEYWORDS = {
        "architect", "architecture", "redesign",
        "trade-off", "tradeoff", "design decision",
        "complex bug", "race condition", "deadlock",
        "distributed system", "consensus", "concurrency",
    }
    
    CHEAP_KEYWORDS = {
        "rename", "format", "extract function",
        "add docstring", "fix typo", "what is",
        "explain briefly", "summarize",
    }
    
    TIER_DEFAULTS = {
        Tier.BUNDLED:      ("gpt-5-mini",        "openai"),
        Tier.CHEAP:        ("claude-haiku-4-5",  "anthropic"),
        Tier.WORKHORSE:    ("claude-sonnet-4-6", "anthropic"),
        Tier.PREMIUM:      ("claude-opus-4-7",   "anthropic"),
        Tier.LONG_CONTEXT: ("gemini-3.1-pro",    "google"),
    }
    
    FALLBACK_CHAIN = {
        Tier.PREMIUM: Tier.WORKHORSE,
        Tier.WORKHORSE: Tier.CHEAP,
        Tier.CHEAP: Tier.BUNDLED,
        Tier.LONG_CONTEXT: Tier.WORKHORSE,
    }
    
    def __init__(
        self,
        anthropic_client: AsyncAnthropic,
        openai_client: AsyncOpenAI,
        google_client: Optional[Any] = None,
        telemetry: Optional[TelemetryClient] = None,
    ):
        self.anthropic = anthropic_client
        self.openai = openai_client
        self.google = google_client
        self.telemetry = telemetry or TelemetryClient()
    
    def _static_classify(self, prompt: str, context_tokens: int) -> Optional[Tier]:
        """Static heuristic (free)."""
        if context_tokens > 100_000:
            return Tier.LONG_CONTEXT
        
        prompt_lower = prompt.lower()
        if any(kw in prompt_lower for kw in self.PREMIUM_KEYWORDS):
            return Tier.PREMIUM
        if any(kw in prompt_lower for kw in self.CHEAP_KEYWORDS):
            return Tier.CHEAP
        return None
    
    async def _dynamic_classify(self, prompt: str) -> Tier:
        """Dynamic classification via Haiku (~$0.00007 per call)."""
        try:
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
            }.get(text, Tier.WORKHORSE)
        except Exception as e:
            logger.warning(f"Dynamic classify failed: {e}, defaulting to WORKHORSE")
            return Tier.WORKHORSE
    
    async def route(
        self,
        prompt: str,
        context_tokens: int = 0,
        force_tier: Optional[Tier] = None,
        user_id: Optional[str] = None,
        feature_id: Optional[str] = None,
    ) -> RoutingDecision:
        if force_tier:
            tier = force_tier
            method = "explicit"
            rationale = "Explicit override"
        else:
            tier = self._static_classify(prompt, context_tokens)
            if tier:
                method = "static"
                rationale = f"Matched static heuristic"
            else:
                tier = await self._dynamic_classify(prompt)
                method = "dynamic"
                rationale = f"Classified by Haiku"
        
        model, provider = self.TIER_DEFAULTS[tier]
        decision = RoutingDecision(
            tier=tier,
            model=model,
            provider=provider,
            method=method,
            rationale=rationale,
        )
        
        await self.telemetry.record_routing(
            decision,
            user_id=user_id,
            feature_id=feature_id,
        )
        
        return decision
    
    async def complete(
        self,
        prompt: str,
        system: str = "",
        context: str = "",
        max_tokens: int = 2000,
        force_tier: Optional[Tier] = None,
        user_id: Optional[str] = None,
        feature_id: Optional[str] = None,
    ) -> dict:
        """Complete completion with automatic routing and fallback."""
        decision = await self.route(
            prompt=prompt,
            context_tokens=len(context.split()) * 1.3,
            force_tier=force_tier,
            user_id=user_id,
            feature_id=feature_id,
        )
        
        try:
            return await self._call(decision, prompt, system, context, max_tokens)
        except (AnthropicError, OpenAIError) as e:
            logger.warning(f"Primary call failed for {decision.tier}: {e}")
            
            # Fallback chain
            fallback_tier = self.FALLBACK_CHAIN.get(decision.tier)
            if fallback_tier:
                fallback_model, fallback_provider = self.TIER_DEFAULTS[fallback_tier]
                fallback_decision = RoutingDecision(
                    tier=fallback_tier,
                    model=fallback_model,
                    provider=fallback_provider,
                    method="fallback",
                    rationale=f"Fallback from {decision.tier.value} due to {type(e).__name__}",
                )
                await self.telemetry.record_routing(
                    fallback_decision,
                    user_id=user_id,
                    feature_id=feature_id,
                )
                return await self._call(fallback_decision, prompt, system, context, max_tokens)
            raise
    
    async def _call(
        self,
        decision: RoutingDecision,
        prompt: str,
        system: str,
        context: str,
        max_tokens: int,
    ) -> dict:
        if decision.provider == "anthropic":
            return await self._call_anthropic(decision.model, prompt, system, context, max_tokens)
        elif decision.provider == "openai":
            return await self._call_openai(decision.model, prompt, system, context, max_tokens)
        elif decision.provider == "google":
            return await self._call_google(decision.model, prompt, system, context, max_tokens)
        raise ValueError(f"Unknown provider: {decision.provider}")
    
    async def _call_anthropic(self, model, prompt, system, context, max_tokens):
        system_blocks = []
        if system:
            system_blocks.append({
                "type": "text",
                "text": system,
                "cache_control": {"type": "ephemeral", "ttl": "1h"},
            })
        if context:
            system_blocks.append({
                "type": "text",
                "text": context,
                "cache_control": {"type": "ephemeral", "ttl": "5m"},
            })
        
        response = await self.anthropic.messages.create(
            model=model,
            max_tokens=max_tokens,
            system=system_blocks if system_blocks else "",
            messages=[{"role": "user", "content": prompt}],
        )
        
        return {
            "text": response.content[0].text,
            "model": model,
            "usage": {
                "input_tokens": response.usage.input_tokens,
                "output_tokens": response.usage.output_tokens,
                "cache_read_tokens": response.usage.cache_read_input_tokens or 0,
                "cache_write_tokens": response.usage.cache_creation_input_tokens or 0,
            },
        }
    
    async def _call_openai(self, model, prompt, system, context, max_tokens):
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        if context:
            messages.append({"role": "system", "content": context})
        messages.append({"role": "user", "content": prompt})
        
        response = await self.openai.chat.completions.create(
            model=model,
            messages=messages,
            max_tokens=max_tokens,
        )
        
        return {
            "text": response.choices[0].message.content,
            "model": model,
            "usage": {
                "input_tokens": response.usage.prompt_tokens,
                "output_tokens": response.usage.completion_tokens,
                "cache_read_tokens": getattr(response.usage, "prompt_tokens_cached", 0),
                "cache_write_tokens": 0,
            },
        }
    
    async def _call_google(self, model, prompt, system, context, max_tokens):
        # Implement according to Google Vertex AI SDK
        raise NotImplementedError("Google client implementation needed")
```

## D.2 Cache helpers (Redis + semantic + Anthropic)

```python
# src/llm_cache/hierarchical.py
"""Hierarchical cache: exact Redis + semantic Redis + Anthropic provider."""
import hashlib
import json
import time
from dataclasses import dataclass
from typing import Optional

import numpy as np
from redis.asyncio import Redis
from sentence_transformers import SentenceTransformer


@dataclass
class CacheStats:
    exact_hits: int = 0
    semantic_hits: int = 0
    provider_hits: int = 0
    fresh_calls: int = 0
    
    @property
    def total(self) -> int:
        return self.exact_hits + self.semantic_hits + self.provider_hits + self.fresh_calls
    
    @property
    def any_hit_rate(self) -> float:
        return (self.total - self.fresh_calls) / self.total if self.total else 0


class HierarchicalCache:
    """Cache in 3 layers with telemetry."""
    
    def __init__(
        self,
        redis_client: Redis,
        similarity_threshold: float = 0.93,
        embedder_model: str = "all-MiniLM-L6-v2",
    ):
        self.redis = redis_client
        self.threshold = similarity_threshold
        self.embedder = SentenceTransformer(embedder_model)
        self.stats = CacheStats()
    
    @staticmethod
    def _exact_key(system: str, user: str) -> str:
        return hashlib.sha256(f"{system}|||{user}".encode()).hexdigest()
    
    async def try_get(self, system: str, user: str) -> Optional[str]:
        """Try Redis hits (exact + semantic). None if miss."""
        # Layer 1: exact
        exact_key = f"exact:{self._exact_key(system, user)}"
        cached = await self.redis.get(exact_key)
        if cached:
            self.stats.exact_hits += 1
            return cached.decode() if isinstance(cached, bytes) else cached
        
        # Layer 2: semantic
        semantic_match = await self._semantic_lookup(user)
        if semantic_match:
            self.stats.semantic_hits += 1
            # Promote: also store as exact
            await self.redis.setex(exact_key, 3600, semantic_match)
            return semantic_match
        
        return None
    
    async def store(self, system: str, user: str, response: str, ttl: int = 3600):
        """Store in both layers."""
        # Layer 1: exact
        exact_key = f"exact:{self._exact_key(system, user)}"
        await self.redis.setex(exact_key, ttl, response)
        
        # Layer 2: semantic
        await self._semantic_store(user, response, ttl)
    
    async def _semantic_lookup(self, user: str) -> Optional[str]:
        """Search by similarity. Returns None if below threshold."""
        embedding = self.embedder.encode(user).astype(np.float32)
        
        # Search top 50 most recent (in production: vector index)
        candidates = await self.redis.zrevrange("semantic:index", 0, 49)
        
        best_sim = 0
        best_response = None
        
        for cand_id in candidates:
            cand_data = await self.redis.hgetall(f"semantic:{cand_id.decode() if isinstance(cand_id, bytes) else cand_id}")
            if not cand_data:
                continue
            
            cand_emb = np.frombuffer(cand_data[b"embedding"], dtype=np.float32)
            sim = float(np.dot(embedding, cand_emb) / 
                       (np.linalg.norm(embedding) * np.linalg.norm(cand_emb)))
            
            if sim > best_sim and sim >= self.threshold:
                best_sim = sim
                best_response = cand_data[b"response"].decode()
        
        return best_response
    
    async def _semantic_store(self, user: str, response: str, ttl: int):
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
        await self.redis.expire(f"semantic:{cache_id}", ttl)
        await self.redis.zadd("semantic:index", {cache_id: time.time()})
        
        # Eviction: keep only last 10K entries
        await self.redis.zremrangebyrank("semantic:index", 0, -10001)
    
    def report(self) -> dict:
        return {
            "exact_hits": self.stats.exact_hits,
            "semantic_hits": self.stats.semantic_hits,
            "provider_hits": self.stats.provider_hits,
            "fresh_calls": self.stats.fresh_calls,
            "total": self.stats.total,
            "any_hit_rate": round(self.stats.any_hit_rate, 3),
        }
```

## D.3 Telemetry instrumentation with OpenTelemetry

```python
# src/observability/telemetry.py
"""Complete OpenTelemetry setup for Copilot tracking."""
import os
from typing import Optional

from opentelemetry import metrics, trace
from opentelemetry.exporter.otlp.proto.grpc.metric_exporter import OTLPMetricExporter
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.sdk.metrics.export import PeriodicExportingMetricReader
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor


class CopilotTelemetry:
    """Complete instrumentation for Copilot usage tracking."""
    
    def __init__(self, service_name: str, otlp_endpoint: Optional[str] = None):
        endpoint = otlp_endpoint or os.getenv("OTLP_ENDPOINT", "http://localhost:4317")
        
        resource = Resource.create({
            "service.name": service_name,
            "service.namespace": "copilot-tracking",
            "deployment.environment": os.getenv("ENV", "production"),
        })
        
        # Tracing
        tracer_provider = TracerProvider(resource=resource)
        tracer_provider.add_span_processor(
            BatchSpanProcessor(OTLPSpanExporter(endpoint=endpoint))
        )
        trace.set_tracer_provider(tracer_provider)
        self.tracer = trace.get_tracer(__name__)
        
        # Metrics
        metric_reader = PeriodicExportingMetricReader(
            OTLPMetricExporter(endpoint=endpoint),
            export_interval_millis=30_000,
        )
        meter_provider = MeterProvider(
            resource=resource,
            metric_readers=[metric_reader],
        )
        metrics.set_meter_provider(meter_provider)
        self.meter = metrics.get_meter(__name__)
        
        # Counters
        self.tokens_counter = self.meter.create_counter(
            "llm.tokens",
            description="Tokens consumed",
            unit="token",
        )
        self.cost_counter = self.meter.create_counter(
            "llm.cost_usd",
            description="Cost in USD",
            unit="USD",
        )
        self.calls_counter = self.meter.create_counter(
            "llm.calls",
            description="Number of LLM calls",
            unit="call",
        )
    
    def record_call(
        self,
        model: str,
        usage: dict,
        cost_usd: float,
        user_id: str,
        feature_id: str,
        team_id: Optional[str] = None,
    ):
        """Record metrics for an LLM call."""
        attrs = {
            "model": model,
            "user_id": user_id,
            "feature_id": feature_id,
        }
        if team_id:
            attrs["team_id"] = team_id
        
        # Tokens
        self.tokens_counter.add(usage.get("input_tokens", 0), {**attrs, "type": "input"})
        self.tokens_counter.add(usage.get("output_tokens", 0), {**attrs, "type": "output"})
        self.tokens_counter.add(
            usage.get("cache_read_tokens", 0),
            {**attrs, "type": "cached_read"},
        )
        self.tokens_counter.add(
            usage.get("cache_write_tokens", 0),
            {**attrs, "type": "cached_write"},
        )
        
        # Cost and calls
        self.cost_counter.add(cost_usd, attrs)
        self.calls_counter.add(1, attrs)


def calculate_cost(model: str, usage: dict) -> float:
    """Calculates cost based on published pricing."""
    pricing = {
        "claude-haiku-4-5":    {"input": 1, "output": 5, "cached_read": 0.10, "cached_write": 1.25},
        "claude-sonnet-4-6":   {"input": 3, "output": 15, "cached_read": 0.30, "cached_write": 3.75},
        "claude-opus-4-7":     {"input": 15, "output": 75, "cached_read": 1.50, "cached_write": 18.75},
        "gpt-5-mini":          {"input": 0, "output": 0, "cached_read": 0, "cached_write": 0},
        "gpt-4.1":             {"input": 0, "output": 0, "cached_read": 0, "cached_write": 0},
        "gpt-5":               {"input": 10, "output": 30, "cached_read": 1, "cached_write": 0},
        "gemini-3.1-pro":      {"input": 5, "output": 15, "cached_read": 0.50, "cached_write": 0},
    }
    
    p = pricing.get(model, {"input": 0, "output": 0, "cached_read": 0, "cached_write": 0})
    
    return (
        usage.get("input_tokens", 0) * p["input"] / 1_000_000
        + usage.get("output_tokens", 0) * p["output"] / 1_000_000
        + usage.get("cache_read_tokens", 0) * p["cached_read"] / 1_000_000
        + usage.get("cache_write_tokens", 0) * p["cached_write"] / 1_000_000
    )
```

## D.4 Token-efficient MCP server template

```python
# mcp_servers/lean_code_tools.py
"""Complete template of lean MCP server.
Total tokens in definitions: ~250.
"""
import re
from pathlib import Path
from typing import Any

from mcp.server import Server
from mcp.types import Resource, TextContent, Tool

server = Server("lean-code-tools")


@server.list_tools()
async def list_tools() -> list[Tool]:
    return [
        Tool(
            name="read",
            description="Read file lines (default: 1-200, max: 500).",
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
            description="Search codebase. Returns top 20 line matches.",
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "Pattern (regex)"},
                    "include": {"type": "string", "default": "**/*"},
                },
                "required": ["query"],
            },
        ),
        Tool(
            name="summary",
            description="Summarize directory: file count by extension.",
            inputSchema={
                "type": "object",
                "properties": {"path": {"type": "string", "default": "."}},
            },
        ),
    ]


@server.call_tool()
async def call_tool(name: str, args: dict) -> list[TextContent]:
    handlers = {
        "read": read_impl,
        "search": search_impl,
        "summary": summary_impl,
    }
    handler = handlers.get(name)
    if not handler:
        return [TextContent(type="text", text=f"Unknown tool: {name}")]
    
    result = await handler(**args)
    return [TextContent(type="text", text=result)]


async def read_impl(path: str, start: int = 1, count: int = 200) -> str:
    p = Path(path)
    if not p.exists():
        return f"Not found: {path}"
    if not p.is_file():
        return f"Not a file: {path}"
    
    try:
        lines = p.read_text(errors="replace").splitlines()
    except Exception as e:
        return f"Error reading {path}: {e}"
    
    end = min(start + count - 1, len(lines))
    section = "\n".join(lines[start-1:end])
    
    suffix = (
        f"\n\n[Lines {end+1}-{len(lines)} not shown. Call again with start={end+1}]"
        if end < len(lines)
        else ""
    )
    
    return f"# {path} (lines {start}-{end} of {len(lines)})\n\n{section}{suffix}"


async def search_impl(query: str, include: str = "**/*") -> str:
    try:
        pattern = re.compile(query)
    except re.error as e:
        return f"Invalid regex: {e}"
    
    pattern_glob = include.lstrip("**/")
    matches = []
    
    for path in Path(".").rglob(pattern_glob):
        if not path.is_file():
            continue
        try:
            for ln, line in enumerate(path.read_text(errors="replace").splitlines(), 1):
                if pattern.search(line):
                    matches.append((str(path), ln, line.strip()[:120]))
                    if len(matches) >= 20:
                        break
        except Exception:
            continue
        if len(matches) >= 20:
            break
    
    if not matches:
        return f"No matches for '{query}'"
    
    return "\n".join([f"{p}:{ln}: {line}" for p, ln, line in matches])


async def summary_impl(path: str = ".") -> str:
    p = Path(path)
    if not p.exists() or not p.is_dir():
        return f"Not a directory: {path}"
    
    counts: dict[str, int] = {}
    for f in p.rglob("*"):
        if f.is_file():
            ext = f.suffix or "(no_ext)"
            counts[ext] = counts.get(ext, 0) + 1
    
    total = sum(counts.values())
    sorted_counts = sorted(counts.items(), key=lambda x: -x[1])
    
    top10 = "\n".join([f"- {ext}: {n}" for ext, n in sorted_counts[:10]])
    suffix = (
        f"\n... and {len(sorted_counts) - 10} more extensions"
        if len(sorted_counts) > 10
        else ""
    )
    
    return f"# {path}\n\nTotal files: {total}\n\nTop extensions:\n{top10}{suffix}"


@server.list_resources()
async def list_resources() -> list[Resource]:
    return [
        Resource(uri="agents.md", name="Project conventions", mimeType="text/markdown"),
        Resource(uri="readme.md", name="Project README", mimeType="text/markdown"),
    ]


@server.read_resource()
async def read_resource(uri: str) -> str:
    file_map = {
        "agents.md": "AGENTS.md",
        "readme.md": "README.md",
    }
    target = file_map.get(uri)
    if not target:
        return f"Unknown resource: {uri}"
    
    p = Path(target)
    if not p.exists():
        return f"Resource not found: {target}"
    
    return p.read_text()


if __name__ == "__main__":
    import asyncio
    from mcp.server.stdio import stdio_server
    
    async def main():
        async with stdio_server() as (read_stream, write_stream):
            await server.run(read_stream, write_stream)
    
    asyncio.run(main())
```

## D.5 Custom agent template (.agents/feature-implementer.agent.md)

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
  - .specs/${FEATURE}/CONSTITUTION.md
  - .specs/${FEATURE}/SPECIFICATION.md
  - .specs/${FEATURE}/IMPLEMENTATION_PLAN.md
max_iterations: 25
max_tokens_per_session: 500000
hooks:
  pre_tool_use: hooks/pre_tool.py:pre_tool_use_hook
  post_tool_use: hooks/post_tool.py:post_tool_use_hook
---

# Feature Implementer

You implement features following Spec-Kit strictly.

## Workflow

1. Read CONSTITUTION.md (non-negotiable principles)
2. Read SPECIFICATION.md (requirements in EARS)
3. Read IMPLEMENTATION_PLAN.md (ordered tasks with [P] markers)
4. Execute tasks in plan order
5. `[P]` tasks can run in parallel via subagents
6. For each task: implement, run tests, mark done

## Constraints

- Never violate CONSTITUTION principles
- Never implement outside SPECIFICATION
- If requirements ambiguous: write question in PR and stop
- Each task must pass tests before continuing

## Output

PR with:
- Title: `feat(${SCOPE}): {summary from spec}`
- Body referencing .specs/
- Granular commits per task
```

---

**Back to index**: [00 · README](./00_README_INDEX.md)
