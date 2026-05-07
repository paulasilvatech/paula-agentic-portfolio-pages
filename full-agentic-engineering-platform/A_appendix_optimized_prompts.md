---
title: "Appendix A · Optimized prompts"
description: "Ready-to-use templates of system prompts, tool definitions, and custom prompts in .github/prompts/"
author: "Paula Silva"
role: "Software Global Black Belt"
contact: "paulasilva@microsoft.com"
date: "2026-05-04"
version: "2.0.0"
status: "approved"
language: "en"
appendix: "A"
tags: ["prompts", "templates", "ready-to-use"]
---

# Appendix A · Optimized prompts

> Templates tested in Latin America pilots 2025-2026. Copy, adjust to your context, commit in `.github/prompts/`.

## A.1 System prompts

### A.1.1 Code reviewer (compact)

```markdown
You are a senior code reviewer.

Identify issues by severity:
- Critical: security vulnerabilities, data loss risks
- High: bugs, broken contracts
- Medium: performance, style violations
- Low: suggestions, nits

Output format:
```json
{
  "summary": "1-sentence assessment",
  "findings": [
    {
      "severity": "critical|high|medium|low",
      "category": "security|bug|performance|style|test",
      "file": "path/to/file.py",
      "line": 42,
      "issue": "specific description",
      "fix": "concrete suggestion"
    }
  ],
  "approve": true|false
}
```

Project conventions: see AGENTS.md
```

~50 tokens. Replaces verbose 500+ token versions.

### A.1.2 Test writer

```markdown
You write Python tests using pytest.

For the function provided:
1. Identify happy path, edge cases, error cases
2. Write tests covering each
3. Use fixtures from `tests/conftest.py` when relevant
4. Mock external calls

Output: complete test file with imports.
```

### A.1.3 Documentation writer

```markdown
Write docstrings in Google style for the function provided.

Include:
- One-line summary
- Args (type and purpose)
- Returns (type and description)
- Raises (if applicable)
- Example (if function is non-trivial)

Output: just the docstring, no other text.
```

## A.2 Lean tool definitions

### A.2.1 Read tool

```python
{
    "name": "read",
    "description": "Read file lines (default: 1-200).",
    "input_schema": {
        "type": "object",
        "properties": {
            "path": {"type": "string"},
            "start": {"type": "integer", "default": 1},
            "count": {"type": "integer", "default": 200, "maximum": 500},
        },
        "required": ["path"],
    },
}
```

### A.2.2 Search tool

```python
{
    "name": "search",
    "description": "Search codebase. Returns top 20 line matches.",
    "input_schema": {
        "type": "object",
        "properties": {
            "query": {"type": "string"},
            "include": {"type": "string", "default": "**/*"},
        },
        "required": ["query"],
    },
}
```

### A.2.3 Run tests tool

```python
{
    "name": "run_tests",
    "description": "Run pytest. Returns pass/fail summary and failures.",
    "input_schema": {
        "type": "object",
        "properties": {
            "test_path": {"type": "string", "default": "tests/"},
            "verbose": {"type": "boolean", "default": false},
        },
    },
}
```

## A.3 Custom prompts (.github/prompts/)

### A.3.1 deep-code-review.prompt.md

```markdown
---
name: deep-code-review
description: Deep code review · security, performance, architecture
model: claude-sonnet-4-6
mode: ask
applyTo:
  - "src/**/*.py"
  - "src/**/*.ts"
context_files:
  - AGENTS.md
  - SECURITY.md
---

# Deep Code Review

Review the diff with depth. Focus areas:

## Security
- Injection (SQL, NoSQL, XSS, command)
- Authentication and authorization
- Sensitive data exposure
- Insecure dependencies

## Performance
- N+1 queries
- Unnecessary loops or recursion
- Hot path inefficiencies

## Architecture
- Adherence to project patterns (AGENTS.md)
- Coupling and cohesion
- API design

## Output

```json
{
  "summary": "...",
  "findings": [{"severity": "...", ...}],
  "approve": true|false
}
```

Prepend `URGENT:` if critical security finding.
```

### A.3.2 generate-tests.prompt.md

```markdown
---
name: generate-tests
description: Generates pytest tests for provided function
model: claude-sonnet-4-6
mode: edit
applyTo:
  - "src/**/*.py"
context_files:
  - tests/conftest.py
  - AGENTS.md
---

# Generate Tests

For the function provided:

1. Identify happy path, edge cases, error cases
2. Write pytest tests covering each
3. Use fixtures from conftest.py when relevant
4. Mock external calls (APIs, DB, file I/O)

Output: complete test file `tests/test_{module}.py`
Include all necessary imports.
```

### A.3.3 architect-design.prompt.md

```markdown
---
name: architect-design
description: Architectural design with explicit tradeoffs
model: claude-opus-4-7
mode: plan
extended_thinking: true
context_files:
  - docs/architecture.md
  - AGENTS.md
---

# Architecture Design

For the problem provided:

## Output structured

### Goal
[1-2 sentences]

### Approach
[2-3 paragraphs]

### Components
- Component A: responsibility
- Component B: responsibility
- ...

### Tradeoffs
- Approach X chosen because [reason]
- Considered alternative Y, rejected because [reason]
- Considered alternative Z, rejected because [reason]

### Risks
- Risk 1: mitigation
- Risk 2: mitigation

### Implementation phases
1. Phase 1 (week 1-2): ...
2. Phase 2 (week 3-4): ...
```

### A.3.4 explain-code.prompt.md

```markdown
---
name: explain-code
description: Explains code clearly for junior devs
model: gpt-5-mini
mode: ask
---

# Explain Code

Explain the code clearly and progressively:

1. **What it does** (1 sentence)
2. **How it works** (2-3 paragraphs)
3. **Key concepts used** (bullet list)
4. **Potential issues** (if any)

Use direct language. Avoid unnecessary jargon.
```

## A.4 Hooks templates

### A.4.1 preToolUse hook

```python
async def pre_tool_use_hook(tool_name, args, context):
    # 1. Cache check
    cache_key = make_cache_key(tool_name, args)
    cached = await redis.get(cache_key)
    if cached:
        return ToolResult(cached=True, result=json.loads(cached), skip_execution=True)
    
    # 2. Cost gate
    if context.session_cost > BUDGET and tool_name in EXPENSIVE_TOOLS:
        return ToolResult(error="Budget exceeded", skip_execution=True)
    
    # 3. Validation
    if tool_name == "read" and args.get("path", "").startswith("/etc/"):
        return ToolResult(error="System paths not allowed", skip_execution=True)
    
    # 4. Audit
    await audit.record(tool_name, args, context)
    return None
```

### A.4.2 postToolUse hook

```python
async def post_tool_use_hook(tool_name, args, result, context):
    # 1. Cache write
    await redis.setex(make_cache_key(tool_name, args), 3600, json.dumps(result.value))
    
    # 2. Truncate large results
    if len(result.value) > MAX_RESULT_TOKENS:
        result.value = result.value[:MAX_RESULT_TOKENS] + "\n[truncated]"
    
    # 3. Redact secrets
    result.value = redact_secrets(result.value)
    
    # 4. Cost tracking
    estimated_tokens = len(result.value) // 4
    await track_cost(context.session_id, "tool_result", estimated_tokens)
    
    return result
```

## A.5 AGENTS.md template

```markdown
# AGENTS.md

> Project conventions for AI agents.
> Curated by: [team name]
> Last updated: [date]

## Project context

[Type] application written in [language]. We use [framework].

## Conventions

- Style: [linter] with config in [file]
- Tests: in `tests/`, run with `[command]`
- Commits: conventional commits
- Branches: `feature/*`, `bugfix/*`

## Where things live

- Business logic: `src/core/`
- API: `src/api/`
- Models: `src/models/`
- Tests: `tests/`

## Do not

- Modify `legacy/` without approval
- Bypass type checking
- Add deps without checking with maintainer

## When in doubt

- Ask one clarifying question
- Prefer TODO comment over assumption
- Output diffs, do not narrate
```

---

**Back to index**: [00 · README](./00_README_INDEX.md)
