---
title: "11 · Azure AI Foundry in the ecosystem"
description: "Foundry vs Copilot vs direct API, model catalog, prompt flow, content safety, PTU vs PAYG, enterprise governance"
author: "Paula Silva"
role: "Software Global Black Belt"
contact: "paulasilva@microsoft.com"
date: "2026-05-04"
version: "2.0.0"
status: "approved"
language: "en"
chapter: 11
part: "IV · Governance and operations"
tags: ["azure-ai-foundry", "ptu", "paygo", "content-safety", "governance", "rbac"]
---

# 11 · Azure AI Foundry in the ecosystem

> Azure AI Foundry is the Microsoft platform for deploy, governance, and operation of AI models at enterprise scale. It is not an alternative to GitHub Copilot, it is a complement. Copilot solves coding in IDE; Foundry solves production workloads, long-term integrations, and regulatory governance. This chapter teaches you when to use each, how to deploy models via catalog, configure content safety, and decide between PTU and PAYG.

## 11.1 Where Foundry fits: Foundry vs Copilot vs direct API

There are three paths to consume LLMs in enterprise environment. **Each has a specific sweet spot**, and the choice is not binary, many orgs use all three simultaneously.

### GitHub Copilot

**Sweet spot**: developer productivity within IDE.

**Characteristics:**
- Native integration in VS Code, Visual Studio, JetBrains
- Code completions, chat, edit/agent/plan modes
- AGENTS.md, copilot-instructions.md
- Coding Agent in the cloud
- AI Credits pricing (ch. 08)

**Use Copilot when:**
- Workload is IDE coding
- Devs need rich integration
- Team doesn't want to build own wrapper
- Compliance allows code to be sent to GitHub

### Anthropic / OpenAI / Google direct API

**Sweet spot**: high-volume application workloads with full control.

**Characteristics:**
- Direct API without markup
- Most aggressive caching possible
- Full control over tokens and models
- Published, transparent pricing
- Your infra, your responsibility

**Use direct API when:**
- Workload is outside IDE (chatbot, RAG, batch)
- Volume justifies building own wrapper
- Compliance requires direct flow without intermediaries
- You have capacity to build cache, routing, observability

### Azure AI Foundry

**Sweet spot**: enterprise workloads with governance, compliance, and Azure integration.

**Characteristics:**
- Model catalog with 1,800+ models (Anthropic, OpenAI, Llama, Mistral, etc.)
- Managed deploy (PTU or PAYG)
- Azure Active Directory (Microsoft Entra ID) integration
- Built-in content safety filters
- Audit logs, RBAC, network isolation
- Compliance certifications (HIPAA, SOC, FedRAMP, etc.)
- Predictable pricing with PTU or consumption with PAYG

**Use Foundry when:**
- Regulatory compliance requires (healthcare, government, financial)
- You're already on Azure, want native integration
- Workload needs network isolation (VNet, private endpoints)
- Enterprise audit trail is mandatory
- PTU makes sense for cost predictability

### Practical decision

| Scenario                                        | Recommendation                            |
|-------------------------------------------------|-------------------------------------------|
| Code completions and chat in IDE                | **GitHub Copilot**                        |
| Coding agent in the cloud                       | **GitHub Copilot Coding Agent**           |
| Product chatbot, high volume                    | **Direct API** or **Foundry**             |
| Regulated workflow (healthcare, gov, financial) | **Azure AI Foundry**                      |
| RAG over sensitive data in Azure                | **Azure AI Foundry**                      |
| Quick POC, small team                           | **Direct API**                            |
| Need Anthropic + OpenAI + Llama unified         | **Azure AI Foundry** (model catalog)      |

### Typical enterprise combination

```
┌─────────────────────────────────────────────────────────┐
│ Microsoft Latin America Enterprise · 2,000 devs         │
└─────────────────────────────────────────────────────────┘

IDE coding (all engineering)
    → GitHub Copilot Business/Enterprise
    
Production application workloads (chatbots, RAG, automation)
    → Azure AI Foundry
    → Model deployment via Foundry catalog
    → Content safety, RBAC, audit
    
Experimentation and R&D
    → Direct Anthropic API (with R&D key)
    → More flexibility, less overhead
```

The three coexist. The choice **per workload**, not **per organization**.

## 11.2 Model catalog · 1,800+ available models

Azure AI Foundry exposes a **model catalog** with models from multiple providers: OpenAI, Anthropic, Meta (Llama), Mistral, Cohere, Microsoft (Phi), Stability AI, and dozens of others.

### Catalog categories

| Category               | Typical providers                             | Use case                          |
|------------------------|-----------------------------------------------|-----------------------------------|
| Frontier models        | Anthropic Claude, OpenAI GPT-5, Google        | Complex reasoning, premium tasks  |
| Open-source            | Llama 3/4, Mistral, Phi-4                     | Self-hosted, custom fine-tuning   |
| Embedding              | OpenAI ada, Cohere, BGE                       | Vector search, RAG                |
| Multimodal             | GPT-4V, Claude vision, Gemini                 | Image + text, document AI         |
| Speech                 | Whisper, Azure Speech                         | STT, TTS                          |
| Specialized            | Phi-4 (small reasoning), MedPaLM              | Domain-specific                   |

### How to navigate the catalog

```
Azure Portal → Azure AI Foundry → Model Catalog

Useful filters:
  - Provider: Anthropic / OpenAI / Llama / etc.
  - Task: Text generation / Embedding / Vision / Audio
  - License: Commercial / Open source
  - Deployment: Serverless / Managed compute / PTU
  - Region: East US 2, West Europe, etc.
```

### How to deploy a model

**Scenario**: deploy Claude Sonnet 4.6 for use via Azure private API.

**Step 1: Select model in catalog**

```
Catalog → Search "Claude Sonnet 4.6" → Deploy
```

**Step 2: Choose deployment type**

```
Deployment options:
  ○ Serverless API (pay-per-use, no reserved capacity)
  ○ Provisioned Throughput Units (PTU) - reserved capacity
  ○ Managed Compute (self-hosted on Azure VMs)
```

**Step 3: Configure deployment**

```yaml
# Example deployment YAML
deploymentName: "claude-sonnet-46-prod"
modelId: "anthropic/claude-sonnet-4-6"
deploymentType: "Serverless"
region: "EastUS2"

# Network
networkConfig:
  publicAccess: false
  privateEndpoint: "vnet-prod-pe-foundry"

# Identity
auth:
  type: "ManagedIdentity"
  
# Content safety
contentSafety:
  enabled: true
  policy: "default-prod"

# Tagging for FinOps
tags:
  team: "engineering"
  costCenter: "CC-1234"
  environment: "production"
```

**Step 4: Access the endpoint**

After deploy, model becomes available on private endpoint:

```python
from azure.ai.inference import ChatCompletionsClient
from azure.identity import DefaultAzureCredential

client = ChatCompletionsClient(
    endpoint="https://myorg-foundry.eastus2.inference.ai.azure.com",
    credential=DefaultAzureCredential(),  # Microsoft Entra ID
)

response = client.complete(
    messages=[
        {"role": "system", "content": "You are a helpful assistant"},
        {"role": "user", "content": "Hello"}
    ],
    model="claude-sonnet-46-prod",  # deployment name
    max_tokens=500,
)
```

The difference vs direct Anthropic API: you use **Microsoft Entra ID**, data stays **inside your Azure tenant**, billing goes to your **Azure subscription**.

## 11.3 Prompt flow · visual orchestration + token efficiency

Prompt flow is an Azure AI Foundry feature to build and version LLM pipelines visually and code-first simultaneously.

### What prompt flow solves

Complex workflows with multiple LLM calls, retrieval, processing, and branching become difficult to maintain in pure code. Prompt flow offers:

- **Visual designer**: drag-and-drop of nodes (LLM call, Python code, branch, etc.)
- **Code-first too**: everything is YAML + Python, versionable in Git
- **Built-in tracing**: each execution logged with tokens and cost
- **Eval framework**: A/B testing of prompts integrated

### Basic structure of a prompt flow

```yaml
# flow.dag.yaml
inputs:
  user_question:
    type: string
  conversation_history:
    type: list

nodes:
  - name: classify_intent
    type: llm
    source:
      type: code
      path: classify.jinja2
    inputs:
      prompt: ${inputs.user_question}
    connection: anthropic-haiku
    api: chat
  
  - name: route_decision
    type: python
    source:
      type: code
      path: router.py
    inputs:
      classification: ${classify_intent.output}
  
  - name: complex_response
    type: llm
    source:
      type: code
      path: complex_prompt.jinja2
    activate:
      when: ${route_decision.output} == "complex"
    inputs:
      question: ${inputs.user_question}
      history: ${inputs.conversation_history}
    connection: anthropic-sonnet
    api: chat
  
  - name: simple_response
    type: llm
    activate:
      when: ${route_decision.output} == "simple"
    inputs:
      question: ${inputs.user_question}
    connection: openai-gpt4-mini
    api: chat
  
  - name: aggregator
    type: python
    source:
      type: code
      path: aggregate.py
    inputs:
      complex: ${complex_response.output}
      simple: ${simple_response.output}

outputs:
  response:
    type: string
    reference: ${aggregator.output}
```

### Token efficiency in prompt flow

Prompt flow facilitates applying patterns from this playbook:

**Pattern 1: Visual routing**

The example above implements complexity-based routing (ch. 03 and 07). Visual makes intent clear, automatic telemetry shows which branch is more used.

**Pattern 2: Automatic caching**

```yaml
- name: expensive_call
  type: llm
  source:
    type: code
    path: prompt.jinja2
  inputs:
    context: ${static_context}
  connection: anthropic-sonnet
  api: chat
  # Foundry can auto-cache based on input hash
  cache:
    enabled: true
    ttl_seconds: 3600
```

**Pattern 3: Telemetry per node**

Each node in a flow is automatically instrumented. You see:
- Tokens consumed per node
- Latency per node
- Cost per node
- Visual bottlenecks

Without manually instrumenting, which saves effort.

### When NOT to use prompt flow

- Simple apps with 1-2 LLM calls (overhead > benefit)
- Teams with strong code-first culture (visual may seem like friction)
- Workloads with target latency <100ms (platform overhead)

## 11.4 Content safety · built-in filters

Azure AI Content Safety is a managed service to filter sensitive content in LLM inputs and outputs. Built-in in Foundry deployments.

### What is filtered

**Default categories:**

- **Hate**: hate speech
- **Violence**: explicit violence
- **Sexual**: sexual content
- **Self-harm**: suicide, self-mutilation

Each category has **4 severity levels** (safe / low / medium / high).

**Additional categories (opt-in):**

- **Prompt injection**: jailbreak attempts
- **Protected materials**: copyright, protected code
- **Groundedness**: hallucination detection in RAG

### Configuration

```yaml
# content-safety-policy.yaml
name: "production-strict"
categories:
  hate:
    inputThreshold: 2  # blocks medium and high
    outputThreshold: 2
  violence:
    inputThreshold: 2
    outputThreshold: 2
  sexual:
    inputThreshold: 0  # blocks down to low (any)
    outputThreshold: 0
  self_harm:
    inputThreshold: 0
    outputThreshold: 0

# Opt-in categories
promptShields:
  enabled: true
  jailbreakDetection: true
  
protectedMaterial:
  enabled: true
  text: true
  code: true
```

### Application to deployment

```yaml
deploymentName: "claude-sonnet-46-prod"
contentSafety:
  enabled: true
  policy: "production-strict"
  blockOnViolation: true  # if true, blocks. If false, just logs.
  reportingEndpoint: "https://myorg-monitoring.azure.com"
```

### Cost of content safety

Content safety is **not free**. Typical pricing:

```
Text moderation: $0.40 / 1,000 calls
Prompt shields:  $0.30 / 1,000 calls
Protected materials: $0.60 / 1,000 calls
Groundedness: $0.75 / 1,000 calls
```

For 100K calls/month with all filters: ~$200/month additional.

### When to enable each filter

| Scenario                             | Recommended filters                              |
|--------------------------------------|--------------------------------------------------|
| Internal B2B application             | Default categories (low threshold)               |
| Public B2C app (chatbot)             | Default categories + prompt shields              |
| Healthcare / financial app           | Default + protected materials + groundedness     |
| RAG over proprietary docs            | Default + groundedness                           |

## 11.5 PTU (Provisioned Throughput Units) vs PAYG

Foundry offers two billing models for deployments. **The choice has large financial impact** and depends fundamentally on usage pattern.

### PAYG (Pay-As-You-Go)

**How it works**: you pay per token consumed, at published API price. No reserved capacity.

**Characteristics:**
- Direct pricing: $X per million input/output tokens
- No minimum, no commitment
- Variable latency (shares capacity with other tenants)
- Throttling possible at peak hours

**Use PAYG when:**
- Volume is variable or unpredictable
- Load is spiky (some peaks per day, low rest)
- You're experimenting, don't yet know steady-state
- Monthly volume <$5K in specific model

### PTU (Provisioned Throughput Units)

**How it works**: you reserve inference capacity. Pay for capacity, not per token. Throughput guaranteed.

**Characteristics:**
- Predictable pricing: $Y per PTU/hour, X PTUs reserved
- Guaranteed capacity, no throttling
- Consistent latency
- Monthly/annual commitment with discount

**Use PTU when:**
- Volume is stable and predictable
- Consistent latency is requirement
- Monthly volume > $5K in specific model
- You can benchmark needed PTUs

### Calculation: when PTU beats PAYG

**Example**: workload of 50M tokens/month in GPT-5

```
PAYG:
  50M tokens × $10/M = $500/month × 12 = $6,000/year

PTU:
  Model needs ~5 PTUs for that throughput
  5 PTU × $50/hour × 730 hours/month = $182,500/month
  Without discount, PTU is 365× more expensive

Conclusion: PAYG wins clearly.
```

**Another example**: workload of 5B tokens/month in GPT-5

```
PAYG:
  5B × $10/M = $50,000/month × 12 = $600,000/year

PTU (with 30% annual discount):
  ~50 PTUs reserved (1 PTU = ~10K tokens/min sustained)
  50 × $50 × 730 × 12 × 0.7 = $153,300/year

PTU is 75% cheaper at high scale.
```

### Simplified decision

```python
def should_use_ptu(monthly_tokens: int, model: str) -> bool:
    """Simple PTU vs PAYG heuristic."""
    
    # API pricing (varies by model)
    api_price_per_million = {
        "gpt-5": 10,
        "claude-sonnet-46": 3,
        "claude-opus-47": 15,
    }
    
    monthly_paygo_cost = (monthly_tokens / 1_000_000) * api_price_per_million.get(model, 5)
    
    # PTU is typically worth it above $30K/month for that model
    return monthly_paygo_cost > 30_000
```

**General rule:**

- **<$5K/month in one model**: PAYG always
- **$5K-30K/month**: depends on latency requirement; PAYG is generally OK
- **$30K+/month**: seriously evaluate PTU, generally wins
- **>$100K/month**: PTU almost always wins

## 11.6 Enterprise governance · AAD, RBAC, audit logs

Foundry was designed for enterprise with fine governance. Here are the main components.

### Microsoft Entra ID (Azure Active Directory)

Foundry integrates natively with Microsoft Entra ID for authentication and authorization.

**Authentication modes:**

```yaml
auth:
  # Option 1: Managed Identity (recommended for Azure apps)
  type: ManagedIdentity
  
  # Option 2: Service Principal (for apps outside Azure)
  type: ServicePrincipal
  clientId: "..."
  
  # Option 3: API Key (only for POCs)
  type: ApiKey
```

**Best practice**: never use API Key in production. Use Managed Identity or Service Principal.

### RBAC (Role-Based Access Control)

Foundry has built-in roles:

| Role                              | Permissions                                                    |
|-----------------------------------|----------------------------------------------------------------|
| Azure AI Foundry User             | List and use existing deployments                               |
| Azure AI Foundry Developer        | Create deployments, run prompt flows                            |
| Azure AI Foundry Admin            | Everything + manage users, billing                              |
| Cognitive Services User           | Read-only access                                                |

**Assignment:**

```bash
# Assign Developer role for a team
az role assignment create \
  --assignee-object-id $TEAM_GROUP_ID \
  --role "Azure AI Foundry Developer" \
  --scope "/subscriptions/$SUB_ID/resourceGroups/foundry-prod"
```

### Audit logs

Every Foundry operation is logged in **Azure Monitor**.

**Log types:**

- **ActivityLog**: create/edit/delete deployments, configuration changes
- **DiagnosticSettings**: inference calls (prompts, completions, tokens)
- **SignInLogs**: authentication
- **AuditLogs (Entra ID)**: role and permission changes

**Export to SIEM:**

```yaml
diagnosticSettings:
  - name: "to-sentinel"
    targetResource: "azureml-foundry-prod"
    logs:
      - category: "AuditEvent"
        enabled: true
      - category: "RequestResponse"
        enabled: true
        # Caution: can be expensive if logging full prompts/completions
        retentionPolicy:
          days: 90
    sink:
      type: "LogAnalyticsWorkspace"
      workspaceId: "/.../security-monitoring-law"
```

### Network isolation

For sensitive workloads, network isolation is mandatory.

**Configurations:**

```yaml
networkConfig:
  # Blocks public access completely
  publicNetworkAccess: Disabled
  
  # Only via private endpoint on VNet
  privateEndpointConnections:
    - name: "pe-prod-foundry"
      vnet: "vnet-prod"
      subnet: "subnet-private-endpoints"
  
  # IP allowlist if needed
  ipAllowlist:
    - "10.0.0.0/8"
    - "172.16.0.0/12"
```

With this, model is only accessible from within private VNet. Traffic does not pass through public internet.

### Compliance certifications

Foundry has certifications relevant for enterprise compliance:

- **HIPAA**: for healthcare data in USA
- **SOC 2 Type II**: operational controls
- **ISO 27001**: information security management
- **FedRAMP High**: USA gov
- **PCI DSS**: card data
- **GDPR / LGPD**: personal data (Europe, Brazil)

Complete list in [Microsoft Trust Center](https://www.microsoft.com/trust-center).

## 11.7 When to use Foundry vs Copilot vs direct API · revisited

With all this in mind, here is the complete decision matrix.

| Criterion                         | GitHub Copilot | Direct API     | Azure AI Foundry  |
|-----------------------------------|----------------|----------------|-------------------|
| Coding in IDE                     | **Wins**       | -              | -                 |
| Product chatbot                   | -              | OK             | **Wins**          |
| Corporate RAG                     | -              | OK             | **Wins**          |
| Regulatory compliance             | -              | -              | **Wins**          |
| Data residency requirements       | -              | -              | **Wins**          |
| Quick setup (POC)                 | -              | **Wins**       | -                 |
| Multi-provider unified            | -              | -              | **Wins**          |
| Lowest pricing                    | -              | **Wins**       | depends           |
| Network isolation                 | -              | -              | **Wins**          |
| Complete audit                    | partial        | build it       | **Wins built-in** |
| Small team, low overhead          | -              | **Wins**       | -                 |
| Enterprise team, scale            | OK             | -              | **Wins**          |

## 11.8 Conclusion and next steps

You now understand:

- **Foundry vs Copilot vs direct API**: each with sweet spot. Not binary, they coexist.
- **Model catalog**: 1,800+ models, deployment via Serverless / PTU / Managed Compute
- **Prompt flow**: visual + code orchestration, automatic telemetry per node
- **Content Safety**: 4 default categories + 4 opt-in, additional cost but mandatory in production
- **PTU vs PAYG**: PAYG up to $30K/month per model, PTU above
- **Governance**: Entra ID, RBAC, audit logs in Azure Monitor, network isolation
- **Compliance**: HIPAA, SOC 2, ISO, FedRAMP, GDPR/LGPD certifications

In the next chapter, [12 · Applied optimization patterns](./12_applied_optimization_patterns.md), we bring 8 concrete patterns with complete code to implement everything seen up to now: dynamic routing, hierarchical cache, subagent fan-out, plan/execution mode, semantic cache, tool composition, lean MCP design, custom agent SDD.

---

## References for this chapter

- [Microsoft Learn · Azure AI Foundry](https://learn.microsoft.com/en-us/azure/ai-foundry/)
- [Microsoft Learn · Azure AI Content Safety](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/)
- [Microsoft Learn · Prompt flow](https://learn.microsoft.com/en-us/azure/machine-learning/prompt-flow/)
- [Microsoft Trust Center · Compliance](https://www.microsoft.com/trust-center)
- [Microsoft Learn · PTU pricing and deployments](https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/provisioned-throughput)
- [Azure Architecture Center · LLM patterns](https://learn.microsoft.com/en-us/azure/architecture/)

---

**Previous chapter**: ← [10 · FinOps for AI](./10_finops_ai.md)
**Next chapter**: [12 · Applied optimization patterns](./12_applied_optimization_patterns.md) →
**Back to index**: [00 · README](./00_README_INDEX.md)
