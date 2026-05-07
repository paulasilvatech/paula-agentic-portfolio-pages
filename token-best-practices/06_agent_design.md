---
title: "06 · Agent design"
description: "Workflow vs agent, augmented LLM, the five Anthropic patterns, custom agents in VS Code, GitHub Coding Agent, MCP servers, and hooks"
author: "Paula Silva"
role: "Software Global Black Belt"
contact: "paulasilva@microsoft.com"
date: "2026-05-04"
version: "2.0.0"
status: "approved"
language: "en"
chapter: 6
part: "II · Technical disciplines"
tags: ["agents", "workflow", "mcp", "hooks", "custom-agents", "coding-agent"]
---

# 06 · Agent design

> There is a hype bias: using agents for everything. It is expensive and unnecessary. Agents solve specific problems with specific tradeoffs. Deterministic workflows solve 70% of enterprise cases at a fraction of the cost. This chapter teaches you to distinguish, choose, and correctly implement agents when they make sense: custom agents in VS Code, GitHub Coding Agent in the cloud, MCP servers as tools, and hooks to reduce cost.

## 6.1 Workflow vs agent: the distinction that matters

The Anthropic taxonomy separates two types of LLM-powered systems, and the choice between them is an architectural decision that changes cost, latency, and operational risk.

### Workflow

**Definition**: LLMs and tools orchestrated via predefined code paths. Deterministic flow, controlled by the developer. The LLM does parts of the work, but does not decide what to do next.

**Characteristics:**

- Known and stable sequence
- Predictable cost
- Easy to instrument and debug
- Auditable step by step
- Low and stable latency

**Example of simple workflow:**

```python
async def code_review_workflow(diff: str) -> dict:
    """Deterministic workflow: 3 fixed steps, known sequence."""
    
    # Step 1: security analysis (specific LLM call)
    security_findings = await llm_complete(
        system=SECURITY_PROMPT,
        user=f"Find security issues in:\n{diff}",
    )
    
    # Step 2: performance analysis (specific LLM call)
    performance_findings = await llm_complete(
        system=PERFORMANCE_PROMPT,
        user=f"Find performance issues in:\n{diff}",
    )
    
    # Step 3: synthesis (specific LLM call)
    summary = await llm_complete(
        system=SYNTHESIS_PROMPT,
        user=f"Summarize:\nSecurity: {security_findings}\nPerformance: {performance_findings}",
    )
    
    return {
        "security": security_findings,
        "performance": performance_findings,
        "summary": summary,
    }
```

The LLM does parts (analysis, synthesis), but **the sequence is decided by code**. Cost is predictable: 3 LLM calls per execution, regardless of input.

### Agent

**Definition**: LLM dynamically directs its own processes and tool usage. Decides what to do, with which tools, in which order, based on intermediate results.

**Characteristics:**

- Sequence decided by model, varies per input
- Variable cost (10x or more between executions)
- Difficult to instrument (each execution is unique)
- Costly audit (needs replay)
- High and variable latency

**Example of agent:**

```python
async def code_review_agent(diff: str) -> str:
    """Agent: LLM decides which tools to use and when to stop."""
    messages = [
        {"role": "system", "content": GENERIC_REVIEWER_PROMPT},
        {"role": "user", "content": f"Review this diff:\n{diff}"},
    ]
    
    for iteration in range(MAX_ITERATIONS):  # typically 10-30
        response = await llm_complete(
            messages=messages,
            tools=[
                read_file_tool,
                search_codebase_tool,
                run_tests_tool,
                get_dependencies_tool,
            ],
        )
        
        if response.stop_reason == "end_turn":
            return response.content  # agent decided it finished
        
        # Agent decided to use tools
        for tool_call in response.tool_calls:
            result = await execute_tool(tool_call)
            messages.append({"role": "tool", "content": result})
        
        messages.append({"role": "assistant", "content": response.content})
    
    return "Review terminated by iteration limit"
```

The LLM **decides** how many times to read files, whether to search the codebase, whether to run tests, and when to finish. Cost varies from US$ 0.30 to US$ 5+ on the same task, depending on how much the agent "wanders".

### The decision heuristic

> **Start with workflows. 70% of enterprise cases are solved this way.**

The choice between workflow and agent should be justified. Default to workflow. Add agency only when workflow demonstrably is not enough.

| Situation                                          | Choice                             |
|----------------------------------------------------|------------------------------------|
| Sequence of steps is known and stable              | **Workflow**                       |
| Wide solution space, sequence varies               | Agent                              |
| Cost predictability is more important than flex    | **Workflow**                       |
| Latency is critical                                | **Workflow**                       |
| Fine audit is required (compliance)                | **Workflow**                       |
| Independent subproblems, benefit parallelization   | Parallel workflow (sectioning)     |
| Iteration between generation and evaluation        | Evaluator-optimizer workflow       |
| Decomposition varies a lot per input               | Agent (orchestrator-workers)       |

## 6.2 The augmented LLM as building block

At the core of any agentic system is the **augmented LLM**: a language model with three additional capabilities that transform it from text generator to a system capable of reasoning, acting, and learning.

### The three capabilities

**1. Retrieval**

Capability to search information in external corpus. Typically via vector search, full-text search, or database query. Allows the agent to operate on data not seen in training: internal documentation, proprietary code, updated knowledge.

**2. Tools**

Capability to call external functions: APIs, code execution, file I/O, integration with systems. Allows affecting the real world, not just generating text. The difference between "LLM that suggests PR" and "agent that actually creates PR" is the presence of tools.

**3. Memory**

Capability to persist information between turns or sessions. Typically via vector store or external KV store. Detailed in chapter 04.

### How to combine them

These three components are added to the LLM **via interface**, not modifying the model. Combined, they transform a text generator into a system capable of:

- **Reasoning**: about information it has not seen before (retrieval)
- **Acting**: in the real world (tools)
- **Learning**: between sessions (memory)

The result is what we call "agent". But note that each capability increases token cost: retrieval injects documents in context, tools need definitions and generate tool results, memory needs to be queried and stored. Each capability has specific ROI.

## 6.3 The five Anthropic patterns

Anthropic published in [Building effective agents](https://www.anthropic.com/research/building-effective-agents) five fundamental patterns for LLM-powered systems. **They are composable, not frameworks**. You can combine two or three in an application.

### Pattern 1: Prompt Chaining

**Structure**: Fixed sequence of LLM calls, output of one becomes input of the next.

```
Input → LLM call 1 → Output 1 → LLM call 2 → Output 2 → ... → Final
```

**When to use**: tasks with well-defined phases where each phase has different expertise.

**Concrete example**: generating technical article. Step 1: generate outline (model focused on structure). Step 2: expand each section (model focused on content). Step 3: review and polish (model focused on style).

**Advantages**: predictable, debuggable, each step can use different model. **Cost**: linear in number of steps.

### Pattern 2: Routing

**Structure**: LLM classifies input and directs to specialized pipeline.

```
Input → Classifier LLM → Directs to:
                          ├── Pipeline A (specific case)
                          ├── Pipeline B (other case)
                          └── Pipeline C (default)
```

**When to use**: types of question require different treatment. In customer support: refund vs technical issue vs sales.

**Concrete example**: routing by complexity (chapter 03). Question → Haiku classifies → trivial → GPT-5 mini, routine → Haiku 4.5, complex → Sonnet 4.6, expert → Opus 4.7.

**Advantages**: uses right model for each case, reduces average cost by 50-70%. **Cost**: classifier is overhead, but small (~$0.00005 per call).

### Pattern 3: Parallelization

**Structure**: Multiple LLM calls in parallel, aggregation of results.

Two variants:

**Sectioning**: divides problem into independent parts, each part in parallel.
```
Input → Split → 
  ├── LLM call A (part 1)
  ├── LLM call B (part 2)
  └── LLM call C (part 3)
       ↓
       Aggregator → Final
```

**Voting**: same problem, multiple different LLMs, vote for robustness.

**When to use sectioning**: multi-aspect analysis (security + performance + style), parallel exploration, content generation by section.

**When to use voting**: critical decisions where robustness is worth the extra cost (reduce hallucinations).

**Cost**: N× calls, but executed in parallel. Total latency ≈ slowest call latency.

### Pattern 4: Orchestrator-Workers

**Structure**: Central LLM dynamically decomposes task and delegates to workers.

```
Input → Orchestrator LLM (decomposes) →
  ├── Worker 1 (subtask A)
  ├── Worker 2 (subtask B)
  └── Worker N (subtask N)
       ↓
       Orchestrator (synthesizes) → Final
```

**When to use**: decomposition depends on input. Coding tasks that change radically in structure.

**Concrete example**: GitHub Coding Agent. Receives issue, decomposes into tasks, delegates execution.

**Advantages**: real flexibility, adapts to the problem. **It is the pattern closest to "true agent".** **Cost**: variable and potentially high. Orchestrator + N workers, each with its cost.

### Pattern 5: Evaluator-Optimizer

**Structure**: Generator + evaluator in loop, with stopping criterion.

```
Input → Generator → Candidate output
                       ↓
                    Evaluator → score
                       ↓
                    Score >= threshold? 
                       ├── YES → Final output
                       └── NO → Generator with feedback → loop
```

**When to use**: tasks with measurable quality (math, testable code, technical writing).

**Concrete example**: TDD agent. Generator writes code based on test, test runner executes (evaluator), test passes? Yes → done. No → feedback to Generator → loop.

**Advantages**: self-correcting, convergent quality. **Cost**: indeterminate if without stopping criterion. **Explicit stop criteria are essential** (see chapter 07).

### Composing patterns

Real systems combine patterns. The key is not to overengineer. Start with the simplest pattern that solves the problem. Add complexity only when proven necessary.

## 6.4 When NOT to use agents

The hype bias pushes teams to use agents for everything. Here are the scenarios where **workflow clearly wins**.

### Don't use agents when:

**1. The task is deterministic and unique**: Format conversion (CSV to JSON), generation of fixed boilerplate, list processing with clear rule. Extra agent cost buys nothing.

**2. The problem has closed and short answer**: Binary classification, extraction of specific fields, response to simple factual questions. Workflow with 1-2 LLM calls is sufficient.

**3. Cost predictability is more important than flexibility**: Production functions with cost SLA, volume data processing pipelines, features offered with fixed pricing to users.

**4. Latency is critical**: Inline code completions (need <500ms), real-time interactions, systems in the hot path of applications.

**5. Fine audit is required**: Regulatory compliance (HIPAA, SOC 2, GDPR), decisions with legal consequences, financial approvals. Workflow is easy to audit; agent is expensive.

### Use agents when:

**1. Solution space is wide, sequence varies per problem**: "Implement feature X" can involve 5 or 50 files, debug of non-trivial issue requires dynamic investigation.

**2. Independent subproblems that benefit from parallelization**: Multi-source analysis, code review with multiple perspectives, multi-vector research.

**3. Iteration between generation and evaluation**: TDD with test feedback, code generation with iterative validation, optimization with clear objective function.

**4. Agent can learn or adapt between runs**: Persistent memory accumulates value, patterns emerge from previous executions.

### The final rule

> Start simple. Add agency only when workflow no longer suffices.

## 6.5 Custom agents in VS Code (.agents/, agent.md)

VS Code 1.118+ (June 2026) introduced native support for custom agents via `.agents/` directory. Each agent is an `.agent.md` file with frontmatter and prompt.

### Structure of a custom agent

```markdown
---
name: security-auditor
description: Security auditor specialized in Python backend code
model: claude-opus-4-7
mode: ask
extended_thinking: true
tools:
  - read_file
  - search_codebase
  - run_command:
      allowed: ["grep", "find", "ls"]
      denied: ["rm", "git push", "npm install"]
context_files:
  - .github/security-policy.md
  - SECURITY.md
max_iterations: 15
max_tokens_per_session: 200000
---

# Security Auditor

You are a security auditor specialized in Python backend applications.

## Focus

Identify and prioritize:

1. **Injection vulnerabilities** (SQL, NoSQL, command, LDAP)
2. **Authentication and authorization** flaws (broken access control)
3. **Sensitive data exposure** (secrets in code, verbose logs, headers)
4. **Misconfigurations** (CORS, security headers, vulnerable deps)

## Output format

For each finding return JSON with severity, category, file, line, description, remediation.

## Constraints

- Read-only: do NOT modify code
- Stay within security scope
- Use repository context: SECURITY.md, .github/security-policy.md
- When uncertain, mark as "investigate" with rationale
```

### Complete directory structure

```
.agents/
  ├── security-auditor.agent.md
  ├── code-reviewer.agent.md
  ├── test-writer.agent.md
  ├── architect.agent.md
  ├── performance-analyst.agent.md
  └── README.md  # documentation of available agents
```

### Invoking custom agents

**In VS Code Chat**:
```
@security-auditor review src/auth.py
@code-reviewer analyze last commit
@test-writer generate tests for src/utils/parser.py
```

**Via Copilot CLI**:
```bash
copilot agent invoke security-auditor --target=src/auth.py
copilot agent invoke code-reviewer --pr=1234
```

### Design patterns for custom agents

**Pattern 1: Single-responsibility**. Each agent has **one** clear responsibility. Don't create "do-everything-agent". Create 5 specialized agents.

**Pattern 2: Read-only by default**. Investigative agents (auditor, analyst, reviewer) should be **read-only**. Only implementing agents (test-writer, refactor-bot) write files.

```yaml
# Read-only agent
tools:
  - read_file
  - search_codebase
  # NOT included: edit_file, write_file, run_command with side effects

# Implementing agent (with caution)
tools:
  - read_file
  - search_codebase
  - edit_file
  - write_file
  - run_tests  # but not generic run_command
```

**Pattern 3: Constrained tools**. Always constrain `run_command` with explicit allowlist. Never permit arbitrary command.

```yaml
tools:
  - run_command:
      allowed: ["grep", "find", "wc", "ls", "cat"]
      denied: ["rm", "mv", "git push", "npm install", "pip install"]
```

**Pattern 4: Token budget**. Define `max_tokens_per_session` to avoid runaway costs.

```yaml
max_iterations: 15
max_tokens_per_session: 200000  # ~$0.60 with Sonnet
```

**Pattern 5: Explicit context files**. Use `context_files` to inject AGENTS.md, SECURITY.md, etc. in agent context, instead of asking the agent to discover.

## 6.6 GitHub Coding Agent (cloud)

GitHub Coding Agent is an asynchronous agent that runs on GitHub runners in the cloud. You delegate a task via comment on issue/PR, and the agent creates the PR back with the implementation.

### How it works

1. User comments on issue: `@github-copilot please implement this`
2. GitHub provisions a runner (Actions runner or dedicated)
3. Agent clones the repo, reads AGENTS.md, copilot-instructions.md
4. Decomposes the task (orchestrator-workers pattern)
5. Executes: reads code, modifies files, runs tests
6. Creates PR with diff and description
7. Closes the runner

### Repository configuration

`.github/copilot-config.yml`:

```yaml
coding_agent:
  default_model: claude-sonnet-4-6
  plan_model: claude-opus-4-7
  
  task_models:
    bug_fix: claude-sonnet-4-6
    feature_implementation: claude-sonnet-4-6
    refactor: claude-sonnet-4-6
    architecture_review: claude-opus-4-7
    documentation: gpt-5-mini
    
  max_tokens_per_task: 500000
  max_iterations: 30
  max_runtime_minutes: 60
  
  allowed_tools:
    - read_file
    - edit_file
    - search_codebase
    - run_tests
    - run_linter
  
  denied_tools:
    - run_command_arbitrary
    - delete_file
    - force_push
  
  allowed_branches:
    - "feature/copilot/*"
    - "bugfix/copilot/*"
  
  denied_branches:
    - main
    - production
    - "release/*"
```

### Cost control for Coding Agent

Coding Agent is particularly expensive because it runs autonomously, can iterate 20-30 times per task, and each iteration can use Opus for complex problems.

**Cost control best practices:**

1. **Limit max_tokens_per_task**: 500K tokens is a reasonable ceiling (~$1.50 with Sonnet)
2. **Limit max_iterations**: 30 is generally sufficient
3. **Use Plan mode before**: agent generates plan with Opus → human approves → agent executes with Sonnet
4. **Mandatory human approval**: configure require approval for all PRs
5. **Audit log**: monitor Coding Agent invocations in audit log

### When to use Coding Agent vs local Custom Agent

| Situation                                       | Use                          |
|-------------------------------------------------|------------------------------|
| Long task (>30min), can run async              | **Coding Agent (cloud)**     |
| Complete feature implementation                | **Coding Agent**             |
| Quick analysis during development              | Custom Agent (VS Code local) |
| Interactive code review                         | Local Custom Agent           |
| Large multi-file refactor                       | **Coding Agent**             |
| Exploratory investigation                       | Local Custom Agent           |

## 6.7 MCP servers as tools

Model Context Protocol (MCP) is the open standard for connecting agents to tools and data sources. MCP servers are processes that expose tools, prompts, and resources to the agent via JSON-RPC.

### Why MCP matters for tokens

MCP servers are one of the **largest sources of token overhead** in agentic systems. Tool definitions are injected in every system prompt. Tool results inflate history. A poorly designed MCP server can double the cost of a session.

### Anatomy of a token-efficient MCP server

**1. Lean tool definitions**

Each tool definition is injected in the system prompt every turn. Keep minimal.

```python
# BAD: verbose definitions (~500 tokens per tool, every turn)
TOOL_BAD = {
    "name": "search_codebase_for_specific_patterns_with_advanced_filtering",
    "description": (
        "This is a comprehensive search tool that allows you to search "
        "through the entire codebase using various patterns and filters. "
        "..."
    ),
    "input_schema": {
        "type": "object",
        "properties": {
            "pattern_to_search_for": {"type": "string", "description": "..."},
            # ... 15 parameters
        }
    }
}

# GOOD: lean definitions (~80 tokens per tool, every turn)
TOOL_GOOD = {
    "name": "search",
    "description": "Search codebase. Returns line matches with file paths.",
    "input_schema": {
        "type": "object",
        "properties": {
            "query": {"type": "string", "description": "Pattern (regex supported)"},
            "include": {"type": "string", "description": "Glob pattern, e.g. '*.py'"},
        },
        "required": ["query"],
    }
}
```

**2. Focused tool results**

Tool results enter history and are paid on every subsequent call. Return what is needed, not what is possible.

```python
# BAD: complete dump (can return 50K tokens)
@mcp_tool
async def read_file(path: str) -> str:
    return Path(path).read_text()

# GOOD: parameterized range (typically 1-3K tokens)
@mcp_tool
async def read_file(path: str, line_start: int = 1, line_end: int | None = None) -> str:
    lines = Path(path).read_text().splitlines()
    if line_end is None:
        line_end = min(line_start + 100, len(lines))
    return "\n".join(lines[line_start-1:line_end])
```

**3. Automatic summarization**

For tools that naturally return large volumes, return summary with on-demand retrieval.

```python
@mcp_tool
async def list_files_in_repo(directory: str = ".") -> dict:
    """Lists files. For large directories, returns summary."""
    files = list(Path(directory).rglob("*"))
    
    if len(files) <= 50:
        return {"files": [str(f) for f in files]}
    
    by_extension = defaultdict(list)
    for f in files:
        by_extension[f.suffix].append(str(f))
    
    return {
        "summary": f"{len(files)} total files",
        "by_extension": {
            ext: f"{len(paths)} files (use list_files_filtered to see)"
            for ext, paths in by_extension.items()
        }
    }
```

**4. Lazy resources**

MCP supports `resources` as data available on demand. Use instead of injecting everything in the system prompt.

### Configuring MCP in VS Code

`.vscode/mcp.json`:

```json
{
  "mcpServers": {
    "code-tools-lean": {
      "command": "python",
      "args": ["mcp_servers/code_tools_lean.py"],
      "env": {
        "REPO_ROOT": "${workspaceFolder}"
      }
    },
    "github-mcp": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${env:GITHUB_TOKEN}"
      }
    }
  }
}
```

### Anti-patterns in MCP design

1. **Tool with long descriptive name**: `search_codebase_for_specific_patterns_with_advanced_filtering`
2. **Verbose description**: 500+ tokens explaining the obvious
3. **15 optional parameters**: agent gets confused
4. **Returning whole dumps**: files, lists, results without limit
5. **Hidden side effects**: tool that seems read but writes to log/db

## 6.8 Hooks: preToolUse and postToolUse

Hooks are extension points that execute code before or after a tool is called by the agent. They allow optimizations, validations, and transformations without modifying the tool itself.

### preToolUse hook

Executes **before** the tool is called. Useful for:

- **Cache hit detection**: if we already called this tool with these args, return from cache
- **Argument validation**: reject invalid calls before spending tokens
- **Cost gating**: block expensive tools if budget exceeded
- **Audit**: log of intent before execution

```python
async def pre_tool_use_hook(tool_name: str, args: dict, context: AgentContext):
    """Hook that runs before each tool call."""
    
    # 1. Cache lookup
    cache_key = f"{tool_name}:{hash(json.dumps(args, sort_keys=True))}"
    cached = await redis.get(cache_key)
    if cached:
        return ToolResult(
            cached=True,
            result=json.loads(cached),
            skip_execution=True,
        )
    
    # 2. Cost gate
    session_cost = await get_session_cost(context.session_id)
    if tool_name in EXPENSIVE_TOOLS and session_cost > BUDGET_THRESHOLD:
        return ToolResult(
            error="Budget threshold exceeded for expensive tools",
            skip_execution=True,
        )
    
    # 3. Argument validation
    if tool_name == "read_file" and args.get("path", "").startswith("/etc/"):
        return ToolResult(
            error="Cannot read system files",
            skip_execution=True,
        )
    
    # 4. Audit log
    await audit_log.record({
        "session_id": context.session_id,
        "user_id": context.user_id,
        "tool": tool_name,
        "args": args,
        "timestamp": datetime.utcnow(),
    })
    
    return None  # proceed with normal execution
```

### postToolUse hook

Executes **after** the tool returns. Useful for cache write, result transformation, sensitive data redaction, cost tracking.

```python
async def post_tool_use_hook(
    tool_name: str,
    args: dict,
    result: ToolResult,
    context: AgentContext,
):
    """Hook that runs after each tool call."""
    
    # 1. Cache write
    cache_key = f"{tool_name}:{hash(json.dumps(args, sort_keys=True))}"
    await redis.setex(cache_key, 3600, json.dumps(result.value))
    
    # 2. Truncate large results
    if len(result.value) > MAX_TOOL_RESULT_TOKENS:
        result.value = (
            result.value[:MAX_TOOL_RESULT_TOKENS]
            + "\n[... truncated, use refined query for full result]"
        )
    
    # 3. Redact sensitive data
    result.value = redact_secrets(result.value)
    result.value = redact_pii(result.value)
    
    # 4. Cost tracking
    estimated_tokens = len(result.value) // 4
    await track_cost(context.session_id, "tool_result_input", estimated_tokens)
    
    return result
```

### Impact of hooks on cost

Well-designed hooks can reduce cost by 30-50% in agentic workflows: cache hit on repeated tool calls (0 tokens consumed), truncation of large results (limits context inflation), cost gates (avoids runaway costs), argument validation (avoids wasted calls).

## 6.9 Conclusion and next steps

You now understand:

- **Workflow vs agent**: the most important architectural distinction. Default to workflow.
- **Augmented LLM**: retrieval + tools + memory are the blocks
- **5 Anthropic patterns**: chaining, routing, parallelization, orchestrator-workers, evaluator-optimizer. Composable.
- **When NOT to use agents**: 5 scenarios where workflow wins
- **Custom agents in VS Code**: `.agents/` structure, design patterns, constraints
- **GitHub Coding Agent**: configuration, cost control, when to use vs local
- **Token-efficient MCP servers**: lean tool definitions, focused results, lazy resources
- **Hooks**: preToolUse and postToolUse for cache, validation, cost gating

In the next chapter, [07 · Token-efficient strategies](./07_token_efficient_strategies.md), we deepen the construction strategies: less-is-more, progressive disclosure, tool design, evaluator-optimizer with stop, routing, and how to apply all this via custom prompts in `.github/prompts/` and applyTo patterns.

---

## References for this chapter

- [Anthropic · Building effective agents](https://www.anthropic.com/research/building-effective-agents)
- [GitHub Docs · Copilot Coding Agent](https://docs.github.com/en/copilot/using-github-copilot/coding-agent)
- [Model Context Protocol · Specification](https://modelcontextprotocol.io/)
- [VS Code · Custom agents documentation](https://code.visualstudio.com/docs/copilot/custom-agents)
- [Claude SDK · Hooks API](https://docs.anthropic.com/)

---

**Previous chapter**: ← [05 · Prompt caching](./05_prompt_caching.md)
**Next chapter**: [07 · Token-efficient strategies](./07_token_efficient_strategies.md) →
**Back to index**: [00 · README](./00_README_INDEX.md)
