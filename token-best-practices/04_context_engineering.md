---
title: "04 · Context engineering"
description: "Context rot, compaction, tool result clearing, persistent memory, subagents, and how to apply all of this in custom agents, AGENTS.md and copilot-instructions.md"
author: "Paula Silva"
role: "Software Global Black Belt"
contact: "paulasilva@microsoft.com"
date: "2026-05-04"
version: "2.0.0"
status: "approved"
language: "en"
chapter: 4
part: "II · Technical disciplines"
tags: ["context-engineering", "compaction", "subagents", "agents-md", "custom-agents"]
---

# 04 · Context engineering

> Context engineering is the discipline of selecting the smallest set of high-signal tokens that maximizes the probability of the desired outcome. It is not "filling the context with everything that might help". It is the opposite: curating with surgery. Teams that master this discipline pay 30-50% less for the same work, with equal or better quality.

## 4.1 Context rot and the marginal utility curve

The common intuition is that more context always helps the model. More information, better response, right? Wrong.

The relationship between amount of context and response quality is **concave with peak**, not monotonically increasing. Adding irrelevant tokens first has neutral effect, then negative effect.

### How context rot works

When you inject irrelevant context, three things happen:

1. **The signal becomes diluted**. For a question about module X, injecting 50 files from module Y makes the model's attention distract. The model needs to "filter" the noise before focusing on the relevant.

2. **The attention window is finite**. Even models with 1M token windows have attention gradient: tokens in the middle of the window receive less attention than tokens at the start and end. Diluting with irrelevant material pushes relevant material to less-attention zones.

3. **Cost increases without benefit**. More tokens = more money, always. If quality does not increase, it is pure waste.

### The golden rule of context engineering

> The smallest set of high-signal tokens that maximizes the probability of the desired outcome.
>
> **Anthropic · Effective context engineering for AI agents · 2026**

Not "all possible context". Not "the context that seemed relevant at first sight". The **minimum** that effectively sustains the probability of the correct outcome.

### How to measure context rot in practice

In a controlled environment, do this experiment with your agent:

```python
# Pseudo-experiment of context rot
async def measure_context_rot(task_prompt: str, relevant_context: str):
    results = {}
    
    for noise_multiplier in [0, 1, 5, 10, 50]:
        # Adds N×relevant_context of irrelevant material
        noise = generate_irrelevant_context(len(relevant_context) * noise_multiplier)
        full_context = relevant_context + "\n\n" + noise
        
        response = await llm_complete(
            system=full_context,
            user=task_prompt
        )
        quality = evaluate_response(response, expected_outcome)
        cost = calculate_cost(len(full_context), len(response))
        
        results[noise_multiplier] = {"quality": quality, "cost": cost}
    
    return results

# Typical result:
# noise=0:   quality=0.95, cost=$0.10
# noise=1:   quality=0.94, cost=$0.20  ← cost doubles, quality stable
# noise=5:   quality=0.88, cost=$0.60  ← quality starts to fall
# noise=10:  quality=0.79, cost=$1.10  ← visible degradation
# noise=50:  quality=0.62, cost=$5.10  ← severe context rot
```

### Practical implication

Every time you are going to add context, ask:

1. **Is this information necessary for this specific task?**
2. **Can I retrieve it on demand instead of injecting in advance?**
3. **Am I injecting because it helps, or because it "guarantees"?**

The "guarantees" answer is typically the signal that you are causing context rot.

## 4.2 Compaction: structured compression

Compaction is the act of the model compressing its own conversation history into a structured summary, keeping critical information and discarding irrelevant details.

### The numbers

[arXiv 2601.07190](https://arxiv.org/) measured compaction in Claude Haiku 4.5 doing SWE-bench Lite. Results:

- **22.7% average token reduction** when compaction is applied aggressively
- **57% reduction in individual cases** with very long sessions
- **6.0 average compressions per task** (every 10-15 tool calls)
- **0% accuracy loss** vs sessions without compaction

Available via Anthropic API with beta `compact-2026-01-12` for Opus 4.7, Opus 4.6, and Sonnet 4.6.

### How to implement manually

Before the native beta is available, you can implement compaction manually:

```python
async def compact_history(messages: list[dict]) -> list[dict]:
    """Compresses history keeping critical context."""
    # Determines cutoff point (keep last N complete turns)
    cutoff = len(messages) - 6  # keep last 6 turns
    if cutoff < 4:
        return messages  # not yet worth compressing
    
    old_messages = messages[:cutoff]
    recent_messages = messages[cutoff:]
    
    # Asks the model to summarize
    summary_prompt = (
        "Compress the following conversation history into a structured summary. "
        "Preserve: decisions made, files modified, errors encountered, key findings. "
        "Discard: failed attempts, redundant explanations, conversational filler. "
        "Output format: ## Decisions, ## Files Touched, ## Errors, ## Findings."
    )
    
    summary_response = await llm_complete(
        system=summary_prompt,
        messages=old_messages,
        max_tokens=2000,
    )
    
    # Replaces old history with summary
    compressed = [
        {"role": "system", "content": f"PRIOR SESSION SUMMARY:\n{summary_response}"},
        *recent_messages,
    ]
    return compressed

# In agentic loop
async def agentic_loop_with_compaction(initial_task: str):
    messages = [{"role": "user", "content": initial_task}]
    
    for iteration in range(MAX_ITERATIONS):
        response = await llm_complete(messages=messages)
        messages.append({"role": "assistant", "content": response})
        
        # Compress every 10 turns
        if iteration > 0 and iteration % 10 == 0:
            messages = await compact_history(messages)
            log(f"Compacted at iteration {iteration}: {len(messages)} messages remaining")
        
        if is_task_complete(response):
            break
        
        next_input = decide_next_step(response)
        messages.append({"role": "user", "content": next_input})
```

### When to use compaction

- **Sessions with >10 tool calls**: consistent gain
- **Long iterative workflows**: refinements, extensive debugging
- **When token budget approaches the limit**: emergency

**When NOT to use:**
- Short sessions (<5 turns): compression overhead > benefit
- When exact history matters (audit, replay): compacting loses fidelity
- Sessions that depend on direct comparison between previous states

## 4.3 Tool result clearing

Tool results are often the **largest consumer** of tokens in agentic workflows. A single `read_file` on a 2,000-line file can inject 30,000 tokens. If 10 files are read in a session, that's 300,000 tokens just of tool results, all paid on every subsequent call.

### The concrete problem

```
Turn 1:   read_file("src/main.py")           → injects 30K tokens into history
Turn 2:   read_file("src/utils.py")          → +20K tokens
Turn 3:   read_file("tests/test_main.py")    → +25K tokens
Turn 4:   search_codebase("authentication")  → +5K tokens
Turn 5:   read_file("src/auth.py")           → +15K tokens
...
Turn 20:  agent refining code in main.py     → but all 95K+ of old tool 
                                                results still in context
```

In turn 20, the agent is paying to send all those old tool results as input, even though only two files are relevant for the current task.

### Implementation

```python
def clean_old_tool_results(
    messages: list[dict],
    keep_recent_tool_results: int = 5,
    preserve_critical: bool = True,
) -> list[dict]:
    """Removes old tool results from context.
    
    Args:
        messages: message history
        keep_recent_tool_results: how many tool results to keep (most recent)
        preserve_critical: preserve tool results marked as critical
    """
    # Identifies tool result indices
    tool_result_indices = [
        i for i, m in enumerate(messages)
        if m.get("role") == "tool"
    ]
    
    if len(tool_result_indices) <= keep_recent_tool_results:
        return messages  # still within limit
    
    # Determines which to remove (oldest)
    to_remove = set(tool_result_indices[:-keep_recent_tool_results])
    
    # Filters preserving criticals
    cleaned = []
    for i, m in enumerate(messages):
        if i not in to_remove:
            cleaned.append(m)
        elif preserve_critical and m.get("metadata", {}).get("critical"):
            # Replace with minimal marker
            cleaned.append({
                "role": "tool",
                "content": f"[Critical tool result preserved: {m['metadata']['summary']}]",
                "tool_call_id": m.get("tool_call_id"),
            })
    
    return cleaned

# In agentic loop
async def agentic_loop_with_clearing(initial_task: str):
    messages = [{"role": "user", "content": initial_task}]
    
    for iteration in range(MAX_ITERATIONS):
        # Clean before each call (after first turns)
        if iteration > 5:
            messages = clean_old_tool_results(messages, keep_recent_tool_results=5)
        
        response = await llm_complete(messages=messages)
        messages.append({"role": "assistant", "content": response})
        
        if response.tool_calls:
            for tc in response.tool_calls:
                result = await execute_tool(tc)
                messages.append({
                    "role": "tool",
                    "content": result,
                    "tool_call_id": tc.id,
                    "metadata": {"critical": is_critical(result)},
                })
        
        if is_task_complete(response):
            break
```

### Heuristics

- **Keep the last 5-10 tool results** is the sweet spot in most workflows
- **Mark results as `critical=true`** when they contain information that will be referenced continuously (e.g., configuration read at the start that will be used throughout the session)
- **Replace removed tool results with minimal markers** ("[Read file src/main.py: 1234 lines]") preserves referentiality without the cost

## 4.4 Persistent memory vs context window

The distinction between **context window** and **persistent memory** is often confused, but it is fundamental for reducing recurring cost.

### Context window

Working memory of a single request. Volatile, costly, finite (200K to 1M tokens depending on model).

**Characteristics:**
- Reset on every new request (actually, persists only via explicitly injected history)
- Each turn rereads all sent context
- Each turn pays again for the context (except cached portions)

### Persistent memory

Information stored **outside the context**, in vector store, KV store, or database. Retrieved on demand when needed.

**Characteristics:**
- Accumulates indefinitely without context inflation
- Storage cost: negligible (cents/GB/month)
- Retrieval cost: only when consulted
- Typical volume: gigabytes of organizational information

### The paper that measured the impact

[arXiv 2603.13017](https://arxiv.org/) demonstrated that 4,182 conversations can be distilled into a compact layer with **11× compression** maintaining retrieval capacity. The information **is available**, but does not inflate context.

### Implementation: the pattern

```python
from typing import Optional

class PersistentMemoryStore:
    """Persistent memory for agents.
    
    Stores facts, decisions, configurations in vector DB.
    Retrieval by semantic similarity when needed.
    """
    
    def __init__(self, vector_db_client, embedding_model):
        self.db = vector_db_client
        self.embed = embedding_model
    
    async def store(self, content: str, metadata: dict = None):
        """Stores fact/decision/config for future use."""
        embedding = await self.embed(content)
        await self.db.upsert(
            content=content,
            embedding=embedding,
            metadata=metadata or {},
        )
    
    async def retrieve(self, query: str, top_k: int = 3) -> list[str]:
        """Searches relevant information for current query."""
        embedding = await self.embed(query)
        results = await self.db.search(embedding, top_k=top_k)
        return [r.content for r in results]


class AgentWithMemory:
    """Agent that uses persistent memory instead of inflated context window."""
    
    def __init__(self, memory_store, llm_client):
        self.memory = memory_store
        self.llm = llm_client
    
    async def handle_request(self, user_query: str):
        # 1. Search relevant memory (don't inject everything)
        relevant_memories = await self.memory.retrieve(user_query, top_k=3)
        
        # 2. Build minimal context
        context = "\n".join([
            "Relevant prior context:",
            *[f"- {m}" for m in relevant_memories]
        ]) if relevant_memories else ""
        
        # 3. Call LLM with lean context
        response = await self.llm.complete(
            system=context,
            user=user_query,
        )
        
        # 4. Persist relevant findings
        if extract_decisions(response):
            for decision in extract_decisions(response):
                await self.memory.store(decision, metadata={
                    "type": "decision",
                    "session_id": session_id,
                })
        
        return response
```

### When persistent memory beats context window

| Scenario                                            | Winner                | Reason                                                |
|-----------------------------------------------------|-----------------------|-------------------------------------------------------|
| Project facts (architecture, patterns)              | Persistent memory     | Does not change between sessions, cheap retrieval     |
| Recent history of current conversation              | Context window        | Volatile, order matters                                |
| Company configurations, policies                    | Persistent memory     | Stable, referenceable on demand                        |
| Intermediate state of agentic iteration             | Context window        | In active use                                          |
| Lessons learned from previous sessions              | Persistent memory     | Accumulates value without recurring cost               |

### The test question

Before injecting something into the context, ask:

> **"Is this in active use in this interaction or is it potentially useful reference?"**

- "In active use" → context window
- "Potentially useful reference" → persistent memory

Teams that confuse the two pay to reread information that could be permanently available.

## 4.5 Subagents and context isolation

When a task requires exploration of a large space (codebase, documents, options), the naive pattern is the lead agent loading everything in its context. This becomes a problem fast: 800K tokens in a repo exploration session is not uncommon.

The solution is **fan-out with central synthesis**: lead dispatches subagents with isolated context, each returns just a summary, and the lead synthesizes the summaries.

### The numbers

[arXiv 2601.21714 (E-mem)](https://arxiv.org/) demonstrated that hierarchy with isolated assistant agents reaches **54% F1 in LoCoMo (+7.75% over SOTA) with 70%+ less tokens**.

### Direct comparison

**Without subagents (single-agent doing everything):**

```
Lead agent needs to explore /api/, /web/, /data/
  → read_file(*) in /api/    → +20K tokens context
  → analyzes, processes
  → read_file(*) in /web/    → +30K tokens context
  → analyzes, processes
  → read_file(*) in /data/   → +15K tokens context
  → analyzes, processes
  → finally synthesizes

Total: ~800K tokens consumed during the session
```

**With fan-out + synthesis:**

```
Lead agent decomposes the task into 3 subtasks
  → Subagent A explores /api/    (isolated context, 20K → returns 1K summary)
  → Subagent B explores /web/    (isolated context, 30K → returns 1.5K summary)
  → Subagent C explores /data/   (isolated context, 15K → returns 0.8K summary)

Lead receives 3.3K of summaries, synthesizes with 5K of additional context

Total: ~78K tokens consumed
Reduction: 88%
```

### Complete implementation

```python
import asyncio
from dataclasses import dataclass

@dataclass
class SubagentResult:
    subtask: str
    summary: str
    findings: list[str]
    artifacts: dict  # files modified, data extracted, etc.

async def run_subagent(
    subtask: str,
    context_budget: int = 30_000,
    output_format: str = "summary_max_2k_tokens",
) -> SubagentResult:
    """Executes subagent with isolated context and limited budget."""
    subagent_messages = [
        {
            "role": "system",
            "content": (
                f"You are a subagent. Execute this subtask: {subtask}\n"
                f"Constraints:\n"
                f"- Maximum {context_budget} tokens of context\n"
                f"- Output format: structured summary, max 2000 tokens\n"
                f"- Return findings as bullet list\n"
                f"- Do NOT continue beyond your subtask scope"
            )
        }
    ]
    
    result = await llm_complete(
        messages=subagent_messages,
        tools=read_only_tools(),  # subagents do not modify state
        max_iterations=10,
    )
    
    return SubagentResult(
        subtask=subtask,
        summary=result.content,
        findings=extract_findings(result),
        artifacts={},
    )

async def explore_codebase_with_fan_out(task: str):
    """Lead agent with fan-out to subagents."""
    # 1. Lead decomposes the task
    plan_response = await llm_complete(
        system="Decompose this task into 3-5 independent subtasks for parallel exploration.",
        user=task,
    )
    subtasks = parse_subtasks(plan_response)
    
    # 2. Dispatches subagents in parallel
    summaries = await asyncio.gather(*[
        run_subagent(
            subtask=st,
            context_budget=30_000,
            output_format="summary_max_2k_tokens",
        )
        for st in subtasks
    ])
    
    # 3. Lead synthesizes only the summaries
    synthesis_response = await llm_complete(
        system=(
            "You are the lead agent. Synthesize the findings from your subagents "
            "into a coherent answer to the original task."
        ),
        user=(
            f"Original task: {task}\n\n"
            f"Subagent findings:\n" +
            "\n".join([
                f"### {s.subtask}\n{s.summary}\n"
                for s in summaries
            ])
        ),
    )
    
    return synthesis_response
```

### When to use fan-out

- **Large codebase exploration**: reading multiple directories
- **Long document analysis**: each subagent reads a section
- **Multi-source research**: each subagent investigates a source
- **Comparison between alternatives**: each subagent evaluates an option

**When NOT to use:**
- Strictly sequential tasks (subagent B depends on A's output)
- Short tasks where dispatch overhead > real task
- When shared context is essential

## 4.6 AGENTS.md, copilot-instructions.md, and Spec-Kit

The theory of context engineering is abstract. The concrete application, in the developer flow, is via **instruction files** placed in known repository locations that agents read automatically. Let's see the three main ones.

### 4.6.1 AGENTS.md (repository root)

`AGENTS.md` at the repository root is the **persistent instruction file** read by agents (including Copilot Coding Agent, Claude Code, and custom agents) every time they start a session in the repo.

**The paper that measured**: [arXiv 2601.20404 (AGENTS.md Impact)](https://arxiv.org/) demonstrated that human-curated AGENTS.md reduces runtime by 28.64% and token usage by 16.58%. LLM-generated AGENTS.md **performs 3% worse** than sessions without the file. Human curation is mandatory.

**Recommended template:**

```markdown
# AGENTS.md

> Instructions for AI agents working in this repository.
> Last updated: 2026-05-04

## Project context

This is a [TYPE] application written in [LANGUAGE]. We use [FRAMEWORK] and follow [PATTERN].

## Conventions

- Code style: [linting tool] with config in `.eslintrc` / `pyproject.toml`
- Tests: located in `tests/`, run with `[command]`
- Commits: conventional commits (feat:, fix:, refactor:)
- Branches: `feature/*`, `bugfix/*`, never push to main

## Where things live

- Business logic: `src/core/`
- API handlers: `src/api/`
- Database models: `src/models/`
- External integrations: `src/integrations/`
- Tests: `tests/` mirrors `src/` structure

## What NOT to do

- Do not modify `legacy/` without explicit approval
- Do not bypass type checking with `# type: ignore` or `any`
- Do not add new dependencies without checking with the maintainer
- Do not auto-generate AGENTS.md (this file is human-curated)

## When in doubt

- Ask one clarifying question before guessing
- Prefer to leave a TODO comment over making an assumption
- Output in diff format, do not narrate the change
```

**Best practices:**

1. **Manually curated** - never generate via LLM
2. **Updated in PRs** when conventions change
3. **Kept lean** - 50-200 lines, not encyclopedia
4. **Used by all agents** - Copilot, Claude Code, custom agents

### 4.6.2 copilot-instructions.md (.github/)

`.github/copilot-instructions.md` is the GitHub Copilot-specific equivalent. Read automatically by Copilot Chat and Copilot Coding Agent when starting repository context.

**Difference vs AGENTS.md**: copilot-instructions.md is **specific to Copilot** and rendered in the VS Code UI. AGENTS.md is broader open source convention. In organizations that use only Copilot, copilot-instructions.md is the canonical. In multi-tool orgs, both.

**Location**: `.github/copilot-instructions.md` (committed to repo)

**Template:**

```markdown
# GitHub Copilot Instructions

## Project: [Project Name]

Version: 2.0
Language: TypeScript / Node.js
Framework: Next.js 15

## When asked to write code

- Use TypeScript strict mode
- Prefer functional components with hooks
- Use Tailwind CSS for styling
- Follow the existing pattern in `src/components/`

## When asked to write tests

- Use Vitest, not Jest
- Place tests next to source: `Component.tsx` → `Component.test.tsx`
- Use `screen` and `userEvent` from Testing Library
- Mock external APIs with MSW

## When asked to refactor

- Maintain test coverage
- Update related documentation
- Follow conventional commits in your suggested commit message

## Files to never touch without explicit request

- `prisma/migrations/` (auto-generated)
- `package-lock.json` (managed by npm)
- `.env*` (secrets)
```

### 4.6.3 Custom agents in `.agents/` (Spec-Kit pattern)

For advanced use, custom agents allow defining specialized personas for specific tasks. Compatible with VS Code, Claude Code, and other agent runners.

**Structure:**

```
.agents/
  ├── code-reviewer.agent.md
  ├── security-auditor.agent.md
  ├── test-writer.agent.md
  └── architect.agent.md
```

**Example: `.agents/security-auditor.agent.md`**

```markdown
---
name: security-auditor
description: Security auditor specialized in backend code
model: claude-opus-4-7
mode: ask
extended_thinking: true
tools:
  - read_file
  - search_codebase
  - run_command  # only for grep, never write
---

# Security Auditor

You are a security auditor specialized in web backend applications.

## Focus

Identify and prioritize:

1. **Injection vulnerabilities** (SQL, NoSQL, command, LDAP)
2. **Authentication and authorization** (broken access control, session management)
3. **Sensitive data exposure** (secrets in code, verbose logs, headers)
4. **Misconfigurations** (CORS, security headers, vulnerable deps)

## Output

For each finding, return in JSON format:

```json
{
  "severity": "critical|high|medium|low",
  "category": "injection|auth|data_exposure|misconfig",
  "file": "path/to/file.py",
  "line": 42,
  "description": "...",
  "remediation": "..."
}
```

## Do not

- Do not modify code (read-only)
- Do not issue style opinions
- Do not look for issues outside the security scope
```

### 4.6.4 Spec-Kit for Spec-Driven Development

Spec-Kit is an SDD (Spec-Driven Development) framework that structures specifications in three artifacts:

```
.specs/
  feature-xyz/
    ├── CONSTITUTION.md      # non-negotiable principles
    ├── SPECIFICATION.md     # requirements in EARS notation
    └── IMPLEMENTATION_PLAN.md  # tasks with [P] markers
```

**CONSTITUTION.md**: principles that govern the feature. Does not change during implementation.

```markdown
# Constitution: Authentication Module

## Non-negotiable principles

1. NEVER store passwords in plaintext (use bcrypt with cost >= 12)
2. ALWAYS use OAuth 2.0 for third-party integrations (no API keys)
3. NEVER expose internal user IDs in URLs (use UUIDs)
4. ALWAYS log authentication events (success AND failure)
5. NEVER trust client-side validation alone

## Compliance requirements

- GDPR: right to deletion within 30 days
- SOC 2: audit trail for all auth events
- LGPD: explicit consent for data processing
```

**SPECIFICATION.md**: what the system should do, in EARS format (Easy Approach to Requirements Syntax).

```markdown
# Specification: User Login Flow

## Functional Requirements (EARS)

### Ubiquitous (always true)
- The system SHALL hash all passwords with bcrypt cost 12.

### State-driven
- WHILE the user is unauthenticated, the system SHALL deny access to /api/private/*.

### Event-driven
- WHEN a user submits valid credentials, the system SHALL issue a JWT with 1h expiration.
- WHEN a user submits invalid credentials, the system SHALL log the attempt with IP and timestamp.

### Optional features
- WHERE 2FA is enabled, the system SHALL require TOTP code after password validation.

### Unwanted behavior
- IF login attempts exceed 5 in 10 minutes, THEN the system SHALL lock the account for 15 minutes.
```

**IMPLEMENTATION_PLAN.md**: ordered tasks with parallelization markers.

```markdown
# Implementation Plan: User Login

## Phase 1: Foundation
- [ ] T1.1 [P] Create bcrypt password hashing utility
- [ ] T1.2 [P] Create JWT generation/validation utility
- [ ] T1.3 Setup auth middleware

## Phase 2: API endpoints (after Phase 1)
- [ ] T2.1 POST /auth/login implementation
- [ ] T2.2 [P] POST /auth/logout implementation
- [ ] T2.3 [P] GET /auth/me implementation

## Phase 3: Validation (after Phase 2)
- [ ] T3.1 Integration tests for login flow
- [ ] T3.2 Security audit (use security-auditor agent)
```

`[P]` marks parallelizable tasks. Agents can dispatch subagents (section 4.5) for parallel tasks.

### 4.6.5 Workspace context vs project context

VS Code distinguishes two configuration levels:

**Workspace context** (`.vscode/settings.json`): configuration shared by all project files.

**Project context** (`copilot-instructions.md`, `AGENTS.md`): persistent instructions for agents operating in this project.

The difference is important: workspace settings are **mechanical** (which model to use, which mode). Project context is **semantic** (how agents should behave).

```
Workspace Settings (.vscode/settings.json)
  ├── github.copilot.chat.model: "claude-sonnet-4-6"
  ├── github.copilot.chat.planMode.model: "claude-opus-4-7"
  └── editor.formatOnSave: true
       ↓ control HOW

Project Context (.github/copilot-instructions.md, AGENTS.md)
  ├── "Use TypeScript strict mode"
  ├── "Place tests next to source"
  └── "Never modify legacy/"
       ↓ control WHAT and WHY
```

Both are committed to the repository for use by the entire team.

## 4.7 Conclusion and next steps

You now understand:

- **Context rot**: more context is not better; the curve is concave with peak
- **Structured compaction**: 22-57% reduction with 0% accuracy loss
- **Tool result clearing**: the largest source of recurring tokens in long sessions
- **Persistent memory vs context window**: the distinction that eliminates recurring cost
- **Subagents with fan-out**: 70-90% reduction in exploration workflows
- **AGENTS.md, copilot-instructions.md, .agents/, Spec-Kit**: concrete application in the developer flow

In the next chapter, [05 · Prompt caching](./05_prompt_caching.md), we enter the 90% lever: how to store and reuse the model's internal representation between requests, with complete implementation in Python and Node, patterns for external Redis, and cache in CI/CD pipelines.

---

## References for this chapter

- arXiv:2601.07190. *Compaction on SWE-bench Lite*.
- arXiv:2601.21714. *E-mem: subagent hierarchy with -70% tokens*.
- arXiv:2603.13017. *Persistent memory: 11x compression*.
- arXiv:2601.20404. *AGENTS.md Impact (JAWs)*.
- [Anthropic · Effective context engineering for AI agents](https://www.anthropic.com/research/effective-context-engineering)
- [GitHub Docs · Customizing Copilot with copilot-instructions.md](https://docs.github.com/en/copilot/customizing-copilot/about-customizing-github-copilot-chat-responses)
- [Spec-Kit · Spec-Driven Development framework](https://github.com/github/spec-kit)
- [EARS · Easy Approach to Requirements Syntax](https://alistairmavin.com/ears/)

---

**Previous chapter**: ← [03 · Models and multipliers](./03_models_multipliers.md)
**Next chapter**: [05 · Prompt caching](./05_prompt_caching.md) →
**Back to index**: [00 · README](./00_README_INDEX.md)
