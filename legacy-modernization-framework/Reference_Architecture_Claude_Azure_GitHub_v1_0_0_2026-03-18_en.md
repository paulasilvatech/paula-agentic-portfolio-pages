---
title: "Reference Architecture: Claude + Azure Foundry + GitHub Platform"
description: "Five-layer reference architecture diagram showing how Claude models, Azure services, GitHub platform, MCP servers, and orchestration components integrate into a unified agentic system"
author: Paula Silva
role: "Software Global Black Belt"
contact: "paulasilva@microsoft.com"
date: 2026-03-18
version: 1.0.0
status: "approved"
locale: "en"
tags:
  - architecture
  - reference
  - claude
  - azure
  - github
  - mcp
  - orchestration
source_image: ../../sources/images/diagrams/Reference Architecture_ Claude + Azure Foundry + GitHub Platform.jpg
---

# Reference Architecture: Claude + Azure Foundry + GitHub Platform

## Visual Description

This diagram presents a five-layer horizontal architecture with interconnecting arrows showing data and control flow between components. Each layer is displayed as a horizontal band containing multiple service boxes, color-coded by provider: red/pink for Azure/security, blue for GitHub, purple for Claude/AI models, green for MCP servers, and orange for orchestration services. Lines connect components across layers showing integration pathways.

## Layer 1 -- Platform and Security Layer (Top)

The foundational security and identity layer:

| Component | Purpose |
|-----------|---------|
| **Microsoft Entra ID** | Identity and access management for all platform users and services |
| **GitHub Advanced Security** | Code scanning, secret detection, dependency review |
| **Azure Key Vault** | Secure storage of API keys, certificates, and secrets |
| **Azure Compliance** | Regulatory compliance monitoring and policy enforcement |
| **Azure Monitor** | Observability, logging, and alerting across all services |

## Layer 2 -- Developer Experience Layer

The tools developers interact with directly:

| Component | Purpose |
|-----------|---------|
| **VS Code / Copilot** | Primary IDE with AI-assisted code editing and generation |
| **Claude CLI** | Command-line interface for Claude Code agent interactions |
| **GitHub Copilot Chat** | Conversational AI interface within the GitHub ecosystem |
| **GitHub.com** | Repository hosting, pull requests, issues, and project management |

**Connections**: Identity flows down from Entra ID; security scans connect from GitHub Advanced Security; code and prompts flow down to the AI Model Layer.

## Layer 3 -- AI Model Layer (Microsoft Foundry)

The AI inference layer hosting multiple model options:

| Component | Purpose |
|-----------|---------|
| **Claude Opus 4** | Highest-capability Claude model for complex reasoning and long-context tasks |
| **Claude Sonnet 4** | Balanced Claude model for general-purpose coding and analysis |
| **Claude Haiku 4** | Fast, efficient Claude model for simple tasks and high-throughput operations |
| **GPT-4o / o1** | OpenAI models available as alternatives through Azure OpenAI |

**Connections**: Receives code and prompts from the Developer Experience Layer; receives chat requests from Copilot; sends orchestration commands down to the MCP and Tools Layer.

## Layer 4 -- MCP and Tools Layer

The integration layer connecting AI models to external services:

| Component | Purpose |
|-----------|---------|
| **Database MCP** | Connects agents to database systems for querying and schema analysis |
| **Observability MCP** | Provides monitoring data, logs, and metrics to agents |
| **Key Vault MCP** | Secure access to secrets during agent execution |
| **Azure DevOps MCP** | Integration with Azure DevOps pipelines, boards, and repos |
| **Backstage MCP** | Service catalog and developer portal integration |
| **GitHub API MCP** | Programmatic access to GitHub repositories, PRs, and issues |

**Connections**: Receives coding tasks from AI models; provides service catalog, config files, and operational data to the Orchestration Layer.

## Layer 5 -- Orchestration Layer (Bottom)

The agent orchestration and routing layer:

| Component | Purpose |
|-----------|---------|
| **Mode Router** | Routes requests to the appropriate agent or model based on task type |
| **Semantic Kernel** | Microsoft's AI orchestration framework for composing agent pipelines |
| **Foundry Agent Service** | Azure-hosted agent execution runtime |
| **Azure AI Agent Service** | Managed agent hosting with built-in scaling and monitoring |

## Key Concepts

- **Multi-Model Strategy**: The architecture supports Claude (Opus, Sonnet, Haiku) and GPT-4o models simultaneously, enabling model selection based on task complexity and cost.
- **MCP as Integration Standard**: Model Context Protocol servers provide a standardized interface between AI models and external tools/services.
- **Security-First Design**: Every layer connects back to the Platform and Security Layer, ensuring all interactions are authenticated, authorized, and auditable.
- **Hybrid Orchestration**: Both Semantic Kernel and Azure AI Agent Service are available for orchestration, supporting different deployment patterns.

## How It Relates to the Framework

This reference architecture is the infrastructure blueprint for deploying the Legacy Modernization Framework in enterprise environments. It shows how the abstract agent-skill model maps to concrete Azure and GitHub services, providing the technical foundation for scalable, secure modernization at enterprise scale.

## References

- [Technical Architecture: Agentic Framework](06_Technical_Architecture_Agentic_Framework_v1.2.0_2026-03-12.md) -- the logical architecture that this physical reference architecture implements
- [Orchestration Flow: Agents + Skills](../agents-skills/orchestration-flow-agents-skills_v1.0.0_2026-03-18.md) -- the runtime flow that executes on this infrastructure
- [Ecosystem Reference Map](../agents-skills/ecosystem-reference-map_v1.0.0_2026-03-18.md) -- maps the file types that configure components in this architecture
