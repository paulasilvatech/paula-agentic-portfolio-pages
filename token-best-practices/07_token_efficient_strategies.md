---
title: "07 · Token-efficient strategies"
description: "Less-is-more, progressive disclosure, lean tool design, evaluator-optimizer with stop criteria, complexity-based routing, custom prompts in .github/prompts/"
author: "Paula Silva"
role: "Software Global Black Belt"
contact: "paulasilva@microsoft.com"
date: "2026-05-04"
version: "2.0.0"
status: "approved"
language: "en"
chapter: 7
part: "II · Technical disciplines"
tags: ["less-is-more", "progressive-disclosure", "tool-design", "stop-criteria", "github-prompts"]
---

# 07 · Token-efficient strategies

> Tokens are a finite resource. Every token spent unnecessarily is money burned and quality compromised (context rot). This chapter gives you the five fundamental token-efficient construction strategies, with concrete application in VS Code via custom prompts in `.github/prompts/` and applyTo patterns.

## 7.1 The "less is more" paradigm

The common intuition: the more details in the prompt, the better the response. Wrong.

Empirical research shows that **more compact prompts often perform better** than verbose prompts, especially in well-defined tasks.

### The paper that measured

[arXiv 2603.29919 (SkillReducer)](https://arxiv.org/) tested token reduction in skills injected in agent context. Counterintuitive result:

- **39% reduction** in skill body
- **48% reduction** in descriptions
- **+2.8% improvement** in functional quality

Not only does cost fall, **quality increases**. Why?

### Why compact skills perform better

Three mechanisms:

**1. Signal vs noise**
Long skills dilute the central signal with redundant explanations. The model spends attention filtering noise before focusing on intent.

**2. Attention is finite**
Models have an attention gradient: tokens in the middle receive less focus. Long skills push critical information to lower-attention zones.

**3. Context window is shared**
Each token spent on skill is one less token for the real problem. Lean skills leave more space for the task content.

### The prompt quality metric

> The quality metric of a prompt is (response quality) / (tokens consumed).
> Maximize both factors.

Don't just optimize quality. Don't just cut tokens. You want to **maximize the ratio**: maximum quality for minimum tokens.

### How to apply

For each prompt in production, do this exercise:

1. **Measure baseline**: current quality and tokens consumed
2. **Cut 30% of tokens**: identify repetitions, obvious examples, redundant explanations
3. **Re-measure**: did quality fall? By how much?
4. **Decision**: if drop <5%, keep the short prompt. If >10%, recover the critical parts.

```python
# Example of reduction
PROMPT_VERBOSE = """
You are an expert code reviewer. You have many years of experience reviewing
code in various languages and frameworks. Your job is to carefully review
the code that the user provides and identify any issues that you find.
You should look for various types of problems, including but not limited to:
- Bugs and logical errors
- Performance issues
- Security vulnerabilities
- Code style violations
- Documentation gaps
- Test coverage issues

Please be thorough in your review and provide detailed explanations
for each issue you identify. Use markdown formatting for your response.
[... continues for another 500 tokens ...]
"""
# ~700 tokens

PROMPT_COMPACT = """
You are a code reviewer. Identify issues in the diff:
- Bugs, security, performance
- Style violations
- Missing tests

Output: severity-prioritized list. Markdown format.
"""
# ~50 tokens

# Reduction is ~93%. In tests, review quality is equivalent or better.
```

## 7.2 Progressive disclosure

Compact skills don't mean information-poor. They mean **details only appear when relevant**. This is the **progressive disclosure** pattern.

### How it works

Structure skills/prompts in layers:

```
┌─────────────────────────────────────────────┐
│ Always loaded (core rules)                  │ ← Always injected
│ ~50-200 tokens                              │
├─────────────────────────────────────────────┤
│ Examples (load on demand)                   │ ← Loaded if requested
├─────────────────────────────────────────────┤
│ Background and rationale (load on demand)   │ ← Loaded if requested
├─────────────────────────────────────────────┤
│ References (load on demand)                 │ ← Loaded if requested
└─────────────────────────────────────────────┘
```

**Always loaded**: the absolute minimum the agent needs to start any task.

**On demand**: details that only make sense in specific cases. Loaded via tool call when the agent needs them.

### Practical example: SKILL.md with progressive disclosure

```markdown
---
name: code-reviewer
description: "Review code changes with focus on security, performance, style"
---

# Code Reviewer

Review the provided diff. Identify and prioritize issues.

## Quick start (always loaded)

For each issue found, output:
- Severity (critical/high/medium/low)
- Category (security/performance/style/test)
- File and line number
- Brief description
- Concrete fix

## Detailed checklists (load on demand via load_section)

- `load_section("security")` for OWASP Top 10 checks
- `load_section("performance")` for hotspot patterns
- `load_section("style")` for language-specific style rules
- `load_section("examples")` for output format examples
```

### Implementation as skill loader

```python
# skills/loader.py
from pathlib import Path
from functools import lru_cache

SKILLS_DIR = Path(".skills")

@lru_cache(maxsize=128)
def load_skill_section(section_name: str) -> str:
    """Tool exposed to the agent: load detailed section on demand."""
    section_file = SKILLS_DIR / f"{section_name}.md"
    if not section_file.exists():
        return f"Section '{section_name}' not found. Available: {available_sections()}"
    return section_file.read_text()

def available_sections() -> list[str]:
    return [f.stem for f in SKILLS_DIR.glob("*.md")]

# Tool definition for the agent
LOAD_SKILL_TOOL = {
    "name": "load_skill_section",
    "description": "Load detailed skill section if needed for current task.",
    "input_schema": {
        "type": "object",
        "properties": {
            "section_name": {"type": "string"},
        },
        "required": ["section_name"],
    },
}
```

### When to use progressive disclosure

- **Complex skills/prompts** (>500 tokens) that will be used in a variety of cases
- **When 60-70% of tasks** use only the core subset
- **When there is clear tradeoff** between full coverage and cost

**When NOT to use:**

- Short skills (<300 tokens) where loading overhead > benefit
- When all information is almost always needed
- When extra latency (1-2s for load) is unacceptable

## 7.3 Lean tool design

Every tool call has three components that cost tokens:

1. **Tool definition** (in system prompt, every turn)
2. **Tool arguments** (in model output, expensive)
3. **Tool result** (becomes input for next call)

Optimizing all three reduces cost significantly.

### Tool definitions: lean

Each tool definition is injected in the system prompt every turn. 10 verbose tools can sum 5K tokens every turn.

**Heuristics:**

- **Short name**: `search` instead of `search_codebase_for_specific_patterns`
- **One-line description**: name + 5-10 words of context
- **Minimum parameters**: 2-4 inputs, sensible defaults for the rest
- **No optional advanced features**: separate into specialized tools if necessary

### Tool results: focused

Tool results inflate history. Each result becomes input on subsequent calls.

**General rule**: return **what the agent needs**, not **everything it might want**.

```python
# BAD: complete dump
async def read_file(path: str) -> str:
    return Path(path).read_text()
# Can return 50K tokens in a large file

# BETTER: ranged
async def read_file(path: str, start: int = 1, count: int = 50) -> str:
    lines = Path(path).read_text().splitlines()
    return "\n".join(lines[start-1:start-1+count])
# Typically 2-3K tokens

# EVEN BETTER: with summary
async def read_file(path: str, start: int = 1, count: int = 50) -> dict:
    lines = Path(path).read_text().splitlines()
    section = "\n".join(lines[start-1:start-1+count])
    return {
        "content": section,
        "total_lines": len(lines),
        "showing": f"lines {start}-{start+count-1}",
        "more_available": start + count < len(lines),
    }
```

### Automatic summarization

For tools that naturally return large volumes:

```python
async def list_files(directory: str) -> dict:
    """Lists files with automatic summarization for large directories."""
    files = list(Path(directory).rglob("*"))
    
    if len(files) <= 50:
        # Small: returns everything
        return {"files": [str(f.relative_to(directory)) for f in files]}
    
    # Large: returns summary with refined retrieval
    by_ext = defaultdict(list)
    for f in files:
        by_ext[f.suffix or "no_ext"].append(str(f.relative_to(directory)))
    
    return {
        "summary": f"{len(files)} files in {directory}",
        "extensions": {
            ext: {
                "count": len(paths),
                "examples": paths[:3],
                "tip": f"Call list_files_filtered with extension='{ext}' for full list"
            }
            for ext, paths in by_ext.items()
        }
    }
```

### Dense formats

Structured JSON is more token-efficient than prose, in general.

```python
# BAD: prose (~200 tokens for 2 findings)
def review_result_prose(findings):
    text = "I have completed the code review. I found several issues. "
    text += "First, in src/auth.py at line 42, there is a potential SQL injection "
    text += "vulnerability because the query is constructed using string concatenation "
    text += "with user input. This is a high severity issue. "
    return text

# GOOD: JSON (~80 tokens for 2 findings, same information)
def review_result_json(findings):
    return [
        {
            "file": "src/auth.py",
            "line": 42,
            "severity": "high",
            "category": "security",
            "issue": "SQL injection: query concatenation with user input",
        },
    ]
```

## 7.4 Evaluator-optimizer with stopping criteria

The evaluator-optimizer pattern (generator + evaluator in loop) is powerful, but it is one of the largest token traps without explicit stopping criteria.

### The trap

```python
# DANGEROUS CODE
async def evaluator_optimizer_naive(task: str):
    """Version without stop criteria. Can run forever."""
    while True:  # ❌ potential infinite loop
        candidate = await generator.generate(task)
        score = await evaluator.score(candidate)
        if score > 0.9:  # single threshold
            return candidate
        # else, regenerates with feedback... and regenerates... and regenerates...
```

Without robust stop criterion, the loop can spend hundreds of thousands of tokens trying to "improve" a response that is already good, or trying to reach a threshold it never achieves.

### Stopping criteria

Use **multiple combined criteria**:

**Criterion 1: Max iterations**
```python
max_iter = 5  # never more than 5 attempts, no exceptions
```

**Criterion 2: Score threshold**
```python
score_target = 0.9  # if score >= 0.9, finished
```

**Criterion 3: Improvement delta**
```python
# If new iteration didn't improve by at least 0.05, stop
# Indicates convergence (no more gain)
if abs(new_score - prev_score) < 0.05:
    break
```

**Criterion 4: Token budget**
```python
session_budget = 100_000  # if exceeded, force stop
```

**Robust combination:**

```python
async def evaluator_optimizer_safe(task: str):
    """Version with robust stop criteria."""
    MAX_ITER = 5
    SCORE_TARGET = 0.9
    MIN_IMPROVEMENT = 0.05
    TOKEN_BUDGET = 100_000
    
    candidates = []
    tokens_used = 0
    prev_score = 0
    
    for iteration in range(MAX_ITER):
        # Criterion: token budget
        if tokens_used >= TOKEN_BUDGET:
            log.warning(f"Stopping: token budget exceeded ({tokens_used}/{TOKEN_BUDGET})")
            break
        
        # Generate candidate
        candidate, gen_tokens = await generator.generate(task, history=candidates)
        tokens_used += gen_tokens
        
        # Evaluate
        score, eval_tokens = await evaluator.score(candidate)
        tokens_used += eval_tokens
        
        candidates.append({"candidate": candidate, "score": score})
        
        # Criterion: score target
        if score >= SCORE_TARGET:
            log.info(f"Stopping: score target reached ({score})")
            return candidate
        
        # Criterion: improvement delta
        if iteration > 0 and (score - prev_score) < MIN_IMPROVEMENT:
            log.info(f"Stopping: improvement plateaued ({score - prev_score})")
            return candidates[-1]["candidate"]  # best found
        
        prev_score = score
    
    # Criterion: max iterations
    log.warning(f"Stopping: max iterations ({MAX_ITER}) reached")
    
    # Returns best candidate found
    best = max(candidates, key=lambda c: c["score"])
    return best["candidate"]
```

### Real application: TDD agent

```python
async def tdd_agent(test_path: str, function_signature: str):
    """TDD agent with explicit stop criteria."""
    
    async def generate_implementation(prev_attempts):
        """Generator: writes implementation."""
        prompt = (
            f"Implement function with signature: {function_signature}\n"
            f"Tests in {test_path}\n"
        )
        if prev_attempts:
            prompt += "Previous attempts and their failures:\n"
            for attempt in prev_attempts[-2:]:  # only last 2 (token efficiency)
                prompt += f"- {attempt['code']}\n  Failure: {attempt['error']}\n"
        return await llm_complete(prompt=prompt)
    
    async def evaluate_implementation(code: str):
        """Evaluator: runs tests."""
        write_file("src/impl.py", code)
        result = await run_tests(test_path)
        score = result.passed / result.total
        return score, result.errors
    
    MAX_ATTEMPTS = 5
    attempts = []
    
    for i in range(MAX_ATTEMPTS):
        code = await generate_implementation(attempts)
        score, errors = await evaluate_implementation(code)
        
        attempts.append({"code": code, "errors": errors, "score": score})
        
        if score == 1.0:  # all tests pass
            log.info(f"TDD success in iteration {i+1}")
            return code
    
    log.error(f"TDD failed after {MAX_ATTEMPTS} attempts")
    return attempts[-1]["code"]  # best attempt
```

## 7.5 Routing by complexity

We saw in chapter 03 that complexity-based routing is one of the highest cost levers. Here we deepen the implementation.

### Why it's worth the investment

Without routing, teams use a single model for everything:

- Default to Sonnet 4.6: pay $3 input for questions GPT-5 mini (bundled, free) would equally solve
- Default to Opus 4.7: pay $15 input for tasks Sonnet 4.6 ($3) would equally solve
- Result: **3-5x overpay** on average cost

With smart routing:

- Trivial → bundled (free)
- Routine → Haiku ($1)
- Complex → Sonnet ($3)
- Expert → Opus ($15)

Average cost reduction is **50-70% with no perceived quality loss**.

### Implementation: classifier + router

```python
# src/llm_router.py
from enum import Enum
from anthropic import AsyncAnthropic
from openai import AsyncOpenAI

class Complexity(Enum):
    TRIVIAL = "trivial"
    ROUTINE = "routine"
    COMPLEX = "complex"
    EXPERT = "expert"

class ModelRouter:
    def __init__(self, anthropic_client, openai_client, gemini_client):
        self.anthropic = anthropic_client
        self.openai = openai_client
        self.gemini = gemini_client
    
    async def classify_complexity(self, prompt: str) -> Complexity:
        """Classify using cheap model (Haiku)."""
        response = await self.anthropic.messages.create(
            model="claude-haiku-4-5",
            max_tokens=10,
            messages=[
                {
                    "role": "user",
                    "content": (
                        f"Classify the complexity of this request as one word: "
                        f"trivial, routine, complex, or expert.\n\n"
                        f"Request: {prompt}\n\n"
                        f"Output only the classification word."
                    )
                }
            ],
        )
        text = response.content[0].text.strip().lower()
        return Complexity(text) if text in [c.value for c in Complexity] else Complexity.COMPLEX
    
    async def route(
        self,
        prompt: str,
        context_tokens: int = 0,
        force_model: str | None = None,
    ) -> dict:
        """Route to appropriate model."""
        
        if force_model:
            return {"model": force_model, "reason": "explicit override"}
        
        # Static heuristic (no cost)
        if context_tokens > 100_000:
            return {
                "model": "gemini-3.1-pro",
                "provider": "google",
                "reason": "long context",
            }
        
        # Dynamic classification (cost: ~$0.00005)
        complexity = await self.classify_complexity(prompt)
        
        routing_table = {
            Complexity.TRIVIAL: ("gpt-5-mini", "openai", "trivial: bundled"),
            Complexity.ROUTINE: ("claude-haiku-4-5", "anthropic", "routine: cheap & fast"),
            Complexity.COMPLEX: ("claude-sonnet-4-6", "anthropic", "complex: workhorse"),
            Complexity.EXPERT: ("claude-opus-4-7", "anthropic", "expert: premium"),
        }
        
        model, provider, reason = routing_table[complexity]
        return {"model": model, "provider": provider, "reason": reason}
```

### Cost of routing vs benefit

```
Cost of classification per call:
- Input: ~50 tokens × $1/M (Haiku) = $0.00005
- Output: ~5 tokens × $5/M = $0.000025
- Total: ~$0.000075

Pays off from any call >$0.0001 (~all in Sonnet+)
Pays off in any session with more than 2 turns
```

The 50-70% reduction in average cost is proportionally much greater than the classification overhead.

## 7.6 Custom prompts in .github/prompts/

`.github/prompts/*.prompt.md` is GitHub Copilot's mechanism to define reusable prompts with versioning and governance.

### Structure of a custom prompt

```markdown
---
name: deep-code-review
description: Deep code review with focus on security, performance, and architecture
model: claude-sonnet-4-6
mode: ask
extended_thinking: false
applyTo:
  - "src/**/*.py"
  - "src/**/*.ts"
context_files:
  - AGENTS.md
  - SECURITY.md
---

# Deep Code Review

You are a senior code reviewer. Review the provided diff with depth.

## Focus areas

### Security
- Injection vulnerabilities (SQL, NoSQL, command, XSS)
- Authentication and authorization flaws
- Sensitive data exposure
- Insecure dependencies

### Performance
- N+1 queries
- Unnecessary loops or recursion
- Memory leaks
- Hot path inefficiencies

### Architecture
- Adherence to project patterns (see AGENTS.md)
- Coupling and cohesion
- Single responsibility violations
- API design issues

## Output format

```json
{
  "summary": "Brief overall assessment",
  "findings": [
    {
      "severity": "critical|high|medium|low",
      "category": "security|performance|architecture|style",
      "file": "path/to/file.py",
      "line": 42,
      "description": "...",
      "suggestion": "..."
    }
  ],
  "approve": true|false,
  "reason_to_block": "..."
}
```

## When to escalate

If you find a critical security issue, prepend `URGENT: ` to your response.
```

### applyTo patterns

`applyTo` defines when this prompt is suggested by Copilot:

```yaml
applyTo:
  - "src/**/*.py"           # only in Python files in src/
  - "tests/**/*.py"         # also in tests
  - "!src/legacy/**"        # but not in legacy/
  - "**/*.security.md"      # or in files with .security.md
```

Patterns follow gitignore glob syntax. Allows different prompts to be contextual:

```
.github/prompts/
  ├── frontend-review.prompt.md       (applyTo: src/web/**, *.tsx, *.css)
  ├── backend-review.prompt.md        (applyTo: src/api/**, src/core/**)
  ├── infra-review.prompt.md          (applyTo: terraform/**, *.tf, k8s/**)
  ├── security-audit.prompt.md        (applyTo: ALL with critical priority)
  └── docs-review.prompt.md           (applyTo: docs/**, README.md, *.md)
```

### Patterns for effective custom prompts

**Pattern 1: One responsibility per prompt**

```
✓ deep-security-review.prompt.md
✓ performance-analysis.prompt.md
✓ test-generation.prompt.md

✗ swiss-army-knife-reviewer.prompt.md (everything)
```

**Pattern 2: Model declared explicitly**

```yaml
# ALWAYS declare model
---
model: claude-sonnet-4-6
mode: ask
---

# NEVER leave implicit
---
# (no model specified)
---
```

**Pattern 3: Context files as dependency injection**

```yaml
context_files:
  - AGENTS.md           # project conventions
  - SECURITY.md         # security policy
  - .github/CODEOWNERS  # ownership info
```

These files are injected before the prompt, forming consistent context.

**Pattern 4: Output format specified**

Always specify output format (JSON, structured markdown, etc.). Reduces variability and facilitates programmatic parsing.

**Pattern 5: Escalation triggers**

Define when the agent should signal urgency:

```markdown
## Escalation

If you find any of the following, prepend `URGENT:` to your response:
- Hardcoded secrets
- SQL injection vulnerabilities
- Missing auth checks on sensitive endpoints
```

### Versioning custom prompts

As `.github/prompts/` is committed to repo, prompts evolve as code:

```bash
# History of changes in the prompt
git log --oneline .github/prompts/deep-code-review.prompt.md

# Diff between versions
git diff HEAD~5 -- .github/prompts/deep-code-review.prompt.md

# A/B test of prompts via branches
git checkout -b experiment/security-review-v2
# edit the prompt
# compare metrics
```

Eventually, mature prompts become part of the "project playbook", versioned, reviewed in PRs, with changelog.

## 7.7 Conclusion and next steps

You now understand:

- **Less-is-more**: compact skills reduce 39% body, 48% description, improve 2.8% quality
- **Progressive disclosure**: core always, details on demand. SKILL.md as example.
- **Lean tool design**: definitions <100 tokens, focused results, dense formats
- **Evaluator-optimizer with stop**: 4 combined criteria (max_iter, score, delta, budget)
- **Routing by complexity**: Haiku classification costs ~$0.00005, reduces average cost 50-70%
- **Custom prompts in .github/prompts/**: applyTo patterns, single-responsibility, model explicit

In the next chapter, [08 · GitHub Copilot · The June 2026 change](./08_github_copilot_june_change.md), we go in detail into the transition: what changes exactly, GitHub AI Credits explained in depth, annual multipliers, impacts by persona, and how to enable paid usage policy step-by-step.

---

## References for this chapter

- arXiv:2603.29919. *SkillReducer: 39% body, 48% description, +2.8% quality*.
- [Anthropic · Effective context engineering](https://www.anthropic.com/research/effective-context-engineering)
- [GitHub Docs · Custom prompts](https://docs.github.com/en/copilot/customizing-copilot/about-customizing-github-copilot-chat-responses)
- [VS Code · applyTo patterns](https://code.visualstudio.com/docs/copilot/copilot-customization)

---

**Previous chapter**: ← [06 · Agent design](./06_agent_design.md)
**Next chapter**: [08 · GitHub Copilot · The June 2026 change](./08_github_copilot_june_change.md) →
**Back to index**: [00 · README](./00_README_INDEX.md)
