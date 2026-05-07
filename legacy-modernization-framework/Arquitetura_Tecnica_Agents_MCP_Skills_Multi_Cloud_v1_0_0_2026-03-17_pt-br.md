---
title: "Arquitetura Técnica: Agents, MCP, Skills e Multi-Cloud Orchestration"
description: "Reference architecture para agentic AI com Claude no Microsoft Foundry, Azure AI Agent Service e GitHub Platform - convertido de deck PDF de março/2026"
author: "Paula Silva"
role: "Software Global Black Belt"
contact: "paulasilva@microsoft.com"
date: "2026-03-17"
version: "1.0.0"
status: "approved"
locale: "pt-br"
tags: ["agents", "mcp", "skills", "multi-cloud", "claude", "azure-ai-foundry", "github-platform", "agentic-ai", "modernization", "reference-architecture"]
source_format: "PDF dump (17 pages)"
---

# Arquitetura-Tecnica-Agents-MCP-Skills-and-Multi-Cloud-Orchestration

> **Source:** `Arquitetura-Tecnica-Agents-MCP-Skills-and-Multi-Cloud-Orchestration.pdf`  

> **Type:** PDF (17 pages)  

> **Converted:** 2026-03-17

---


## Page 1

Arquitetura Técnica:
Agents, MCP, Skills &
Multi-Cloud Orchestration
Claude + Azure AI Agent Service + GitHub Platform
Reference Architecture
MICROSOFT CONFIDENTIAL
MARÇO 2026 | V1.0


## Page 2

Visão Executiva, Arquitetura Agentic AI
O Paradigma Agentic Proposta de Valor Técnica
Model Context Azure AI Agent
A evolução de LLMs de "chatbots" para "agents" representa a maior Protocol (MCP) Service
mudança em arquitetura de software desde microservices. Agents
Protocolo aberto para Orquestração enterprise-
são sistemas de IA que podem raciocinar, usar ferramentas, tomar conexão agent-to-tool, grade com Foundry IQ
decisões e executar tarefas de forma autônoma, com guardrails e Claude nativo. integration. Governança,
Interoperabilidade e escala e observabilidade
supervisão humana.
portabilidade de agents. unificada.
A combinação de Claude models no Microsoft Foundry com Azure
GitHub Platform Multi-Model via
AI Agent Service e GitHub Platform cria a stack mais completa para Foundry
CI/CD, security, code review
enterprise agentic AI.
integrados ao ciclo agentic. Claude para deep
Agents que operam dentro reasoning, GPT para
do SDLC com guardrails. general tasks, Haiku para
sub-agents. Otimização de
custo/performance por
tarefa.
Microsoft Confidential | Americas Software GBB


## Page 3

Cenário Atual, Desafios de Adoção Agentic
Panorama Técnico Análise de Maturidade, Enterprise Brasil
A maioria das organizações está experimentando com LLMs de forma Nível
isolada, chatbots internos, assistentes de código, PoCs
desconectados. O salto para agents requer arquitetura, governance e Nível 0 Experimental
orquestração que poucas organizações têm.
Pain Points Identificados
Nível 1 Assistive
Sem padrão para tool integration → cada agent tem sua própria
lógica de conexão
Nível 2 Agentic Básico
Sem orquestração → agents operam isolados, sem handoff ou
coordenação
Nível 3 Orquestrado
Sem observabilidade → impossível medir impacto, custo ou risco
de agents
Nível 4 Autônomo
0 5 10 15 20 25 30 35 40
Sem governance → quem aprova o que um agent faz? Como
% Enterprise Brasil
auditamos?
Microsoft Confidential | Americas Software GBB


## Page 4

Arquitetura & Solução, Reference Architecture em 5 Camadas
Perímetro: Plataforma
& Segurança
MCP, ferramentas,
orquestração e segurança
Camada: Agentes
Orquestrador Opus e
workers Sonnet/Haiku
Núcleo: Interface Dev
GitHub, VS Code, Copilot,
Claude Code
A arquitetura em 5 camadas separa claramente as responsabilidades: da interface do desenvolvedor até a plataforma de segurança, cada camada tem componentes específicos que se integram de forma padronizada
via MCP e Azure AI Agent Service.
Integração Multi-Model
Modelo Role no Ecosystem Custo Latência
Claude Opus 4.6 Orchestrator agent, deep analysis, complex reasoning $$$ Alto (com thinking)
Claude Sonnet 4.6 Worker agents, coding tasks, standard analysis $$ Médio
Claude Haiku 4.5 Sub-agents, classification, routing, triage $ Baixo
GPT-4o Alternativa para tasks gerais, multimodal $$ Médio
Llama/DeepSeek Tasks específicos, fine-tuning, edge deployment $ Variável
Microsoft Confidential | Americas Software GBB


## Page 5

Componentes Técnicos, Deep Dive
Model Context Protocol (MCP), O Padrão Aberto Claude Code Configuration para Foundry
O MCP é um protocolo aberto criado pela Anthropic que padroniza como agents se
# Variáveis de Ambiente
conectam a ferramentas externas. Pense nele como "USB para AI agents", uma
CLAUDE_CODE_USE_FOUNDRY=1
interface universal que permite qualquer modelo se conectar a qualquer ferramenta.
ANTHROPIC_FOUNDRY_RESOURCE={resource-name}
ANTHROPIC_DEFAULT_OPUS_MODEL=claude-opus-4-6
MCP Server Função Exemplo de Uso
ANTHROPIC_DEFAULT_SONNET_MODEL=claude-sonnet-4-6
GitHub API MCP CRUD issues, PRs, Agent cria PR com código ANTHROPIC_DEFAULT_HAIKU_MODEL=claude-haiku-4-5
repos, Actions modernizado
Azure DevOps MCP Pipelines, boards, Agent monitora pipeline e
GitHub Platform Integration Points
artifacts diagnostica falhas
Backstage/RH Dev Hub Service catalog, Agent consulta catálogo Componente Integração com Agents Trigger
MCP scaffolding para dependências
GitHub Actions Agents como steps em on: push, PR, schedule
Database MCP Query e análise de Agent consulta métricas de workflows CI/CD
dados performance
Copilot Extensions Claude como backend para @agent-name em
Vault MCP (Key Vault) Gerenciamento de Agent rotaciona Copilot Chat Copilot Chat
secrets credentials com segurança
GitHub Apps Agents com permissões Webhooks (issues,
Observability MCP Logs, métricas, traces Agent diagnostica granulares PRs, reviews)
incidentes em tempo real
Advanced Security Agents que respondem a code_scanning,
Custom MCP Qualquer API interna Agent interage com security alerts secret_scanning
sistemas proprietários
GitHub Projects Agents que atualizam boards e project_v2 events
métricas
Microsoft Confidential | Americas Software GBB


## Page 6

Fluxos & Processos, Agent Orchestration Patterns
Pattern 1: Hierarchical Orchestration Pattern 2: Event-Driven Agents (via GitHub Actions)
01
on: issues.opened on: pull_request.opened
Trigger
Agent de triage (Haiku) classifica e roteia Agent de review (Sonnet) analisa código e sugere
Evento chega (GitHub webhook, schedule, human request) melhorias
02
on: workflow_run.failure on: security_alert
Opus Orchestrator
Agent de diagnóstico (Opus) investiga falha e propõe Agent de segurança (Sonnet) avalia risco e aplica
Claude Opus 4.6 analisa contexto e decompõe em subtasks
fix remediação
03
Pattern 3: Multi-Agent Handoff
Sonnet Workers
Agent Trigger Ação Handoff Para
Claude Sonnet 4.6 executa cada subtask (coding, analysis, docs)
Triage Agent Issue aberta Classifica por tipo/prioridade Modernization ou Dev
04 Agent
Haiku Sub-agents Modernization Agent Label "modernize" Analisa COBOL, propõe plano Code Agent
Claude Haiku 4.5 faz classificação, routing, validação rápida Code Agent Plano aprovado Gera código moderno + testes Review Agent
Review Agent PR criada Code review automatizado Security Agent
05
Security Agent PR em review Scan de vulnerabilidades Deploy Agent (human
MCP Tools
approval)
Workers usam MCP servers para interagir com GitHub, Azure, DBs
Diagnostics Agent Pipeline failure Root cause analysis Triage Agent (loop)
06
Consolidation & Output
Opus consolida resultados, aplica guardrails, gera output final
Microsoft Confidential | Americas Software GBB


## Page 7

Implementação & Roadmap, Agent Deployment
Fase 1: Skills Fase 2: Agents Fase 3: Orchestration
Semana 1–4 Semana 5–8 Semana 9–12
Deploy Claude models no Foundry (Opus, Triage Agent (Haiku), classifica issues Opus como orchestrator central
Sonnet, Haiku) automaticamente Azure AI Agent Service para state
Claude Code como ferramenta de análise Code Review Agent (Sonnet), review de PRs management e routing
individual GitHub Actions como trigger layer Handoff maps entre agents
GitHub Copilot com Claude como backend MCP servers expandidos (Backstage, Guardrails e human-in-the-loop approval
MCP servers básicos (GitHub API, Azure Observability) gates
DevOps)
Entregável: 2 agents operacionais com métricas Entregável: Sistema multi-agent orquestrado
Entregável: Devs usando Claude Code + Copilot de impacto com governance
no dia-a-dia
Fase Período Foco Entregáveis Owner
Skills S1–S4 Individual productivity Claude Code + Copilot operacional Dev Team
Agents S5–S8 Task automation 2 agents com GitHub Actions Platform Team
Orchestration S9–S12 Multi-agent coordination Sistema orquestrado com governance Architecture Team
Microsoft Confidential | Americas Software GBB


## Page 8

Modelo de
Progressão:
Do Copilot ao
Foundry


## Page 9

Visão Executiva
O Poder da Escolha
As organizações não precisam escolher entre GitHub Copilot e Microsoft Foundry. São camadas complementares que se ativam conforme a complexidade e
maturidade evoluem. Claude está nativamente integrado em todo o ecossistema Microsoft, do IDE ao pipeline enterprise.
Proposta de Valor, Quatro Camadas de Claude
Camada Ferramenta Complexidade Custo
1. Dev Productivity Claude no Copilot Chat (Opus 4.6, Zero setup, já incluso no Copilot Premium requests inclusos
Sonnet 4.6)
2. Coding Agent Claude como Partner Agent no Mínima, habilitar no admin 1 premium request/session
GitHub
3. Enterprise Coding Claude Code via Foundry (CLI + VS Média, Foundry resource + RBAC ~$32.50/dev/mês
Code + Actions)
4. Multi-Agent Azure AI Agent Service + Foundry Alta, arquitetura completa Pay-as-you-go variável
Agent Service
Resultado: Início imediato com zero friction, escalando sob demanda até multi-agent enterprise.
Microsoft Confidential | Americas Software GBB


## Page 10

Claude no GitHub Copilot, Status GA
Modelos Disponíveis (Março 2026) Privacidade Enterprise
Modelo GA desde IDEs Suportadas Destaque
Zero Data Retention Content Filters
Claude Opus 4.6 05/Fev/2026 VS Code, Visual Studio, Tarefas complexas
ZDR com Anthropic para features Copilot filters para public code
JetBrains, Xcode, de planning e tool
GA matching e harmful content
Eclipse, github.com, calling
Mobile, CLI
Performance
Claude Sonnet 4.6 17/Fev/2026 VS Code, Visual Studio, Agentic coding e
JetBrains, Xcode, operações de busca
Prompt caching para performance otimizada
Eclipse, github.com,
Mobile, CLI
GA CONFIRMADO
Como Funciona
Seleção de Modelo
Developer seleciona Claude no model picker do Copilot, mesmo fluxo que GPT
Todos os Modos
Disponível em chat, ask, edit e agent, sem fricção
Zero Custo Adicional
Incluído no Copilot Business/Enterprise/Pro/Pro+
Admin Habilitação
Copilot Settings → Model Policies → Claude Opus 4.6 / Sonnet 4.6
Microsoft Confidential | Americas Software GBB


## Page 11

Claude como Coding Agent, Automação Nativa
Partner Agents no GitHub (GA Fev/2026) Fluxo de Trabalho
Claude funciona como coding agent autônomo dentro do GitHub, sem sair da plataforma. 01
Disponível para Copilot Business e Pro desde 26 de fevereiro.
Admin Habilita
Capacidades do Agent
Claude em Partner Agents (Enterprise + Organization)
Capacidade Como Usar Superfície 02
Agent Sessions Criar tasks direto de issues, PRs, github.com, Mobile, VS
Dev Abre Issue
aba Agents Code
Navega para aba Agents no repositório
@claude mentions Mencionar @claude em PRs no github.com
comentários de PR
03
Issue Assignment Atribuir issues ao Claude para Issues no github.com
Seleciona Claude
resolução
Define Claude como agent e descreve a tarefa
Multi-agent Compare Atribuir mesma issue a Claude + Issues no github.com
Copilot + Codex
04
Cross-client Iniciar no Mobile, acompanhar no Experiência unificada
Claude Trabalha
VS Code
Assincronamente, cria branches, commits, abre draft PRs
Live Progress Logs detalhados de atividade em Sessions view
tempo real
05
Dev Revisa
Comenta com @claude para ajustes, aprova e merge
Caso de Uso: COBOL Triage
Issue "Analyze COBOL module PGMCLI01" → Claude (Opus 4.6) analisa código, mapeia
dependências, documenta business logic, abre PR com relatório técnico.
Microsoft Confidential | Americas Software GBB


## Page 12

Claude Code via Foundry, Enterprise Scale
Comparativo: Copilot vs. Foundry Quando Escalar para o Foundry
O Foundry entra quando a complexidade exige controle total:
Critério Copilot + Claude Claude Code via Foundry
context windows de 1M tokens, orquestração customizada,
Context Window Limitado pelo Copilot Até 1M tokens (Opus 4.6 beta) billing via MACC, e compliance enterprise.
Configuração
Controle de Modelo Model picker (UI) Variáveis de ambiente por
modelo
MCP Servers Não suportado Configurável via CLAUDE.md / export CLAUDE_CODE_USE_FOUNDRY=1
CLI export ANTHROPIC_FOUNDRY_RESOURCE=
contoso-foundry-prod
Billing Premium requests (incluso) Pay-as-you-go Azure export ANTHROPIC_DEFAULT_OPUS_MODEL=
Marketplace (MACC) claude-opus-4-6
export ANTHROPIC_DEFAULT_SONNET_MODEL=
RBAC Copilot policies Entra ID + Key Vault + RBAC
claude-sonnet-4-6
completo
export ANTHROPIC_DEFAULT_HAIKU_MODEL=
claude-haiku-4-5
GitHub Actions Agent sessions automáticas claude-code-action@v1 com
az login # Entra ID (produção)
Foundry env vars
Auditoria Copilot logs Azure Monitor + Git history
completo
Ideal Para Produtividade diária, code COBOL analysis profunda,
review modernização escala
Microsoft Confidential | Americas Software GBB


## Page 13

Foundry Agent Service, Orquestração Multi-Agent
Capacidades Chave Model Router, Single Endpoint,
Multi-Model
Feature Descrição Benefício
Model Router (GA) Roteia prompts para o modelo Até 40% economia
Haiku 4.5 Sonnet 4.6
ideal por complexidade/custo em tokens
Classificações, triage, high- Coding, translation, testing
Foundry IQ (Preview) RAG dinâmico com reasoning Qualidade superior
volume, $2.50/dev/mês, $15/dev/mês
iterativo de grounding
Fleet Management Gerenciamento centralizado Visibilidade e
Opus 4.6 GPT-4o, DeepSeek,
de todos os agents controle operacional
Llama
Deep analysis,
Routing Profiles Balanceia qualidade vs. custo Customizável por use
com performance mínima case orchestration, COBOL 1M Disponíveis no mesmo
ctx, $15/dev/mês router
Semantic Kernel SDK open-source para Flexibilidade de
orquestração multi-agent implementação
Agent Skills: 126 disponíveis, 5 core skills + 121 language-
Copilot Studio Build e deploy agents sem Acessível para non-
specific (Python, .NET, TypeScript, Java). Sync automático
custom code developers
diário com docs do Foundry.
Microsoft Confidential | Americas Software GBB


## Page 14

Jornada de 3 Ondas para o Piloto
1 2 3
Onda 1 Onda 2 Onda 3
Quick Win Deep Analysis Scale
Semana 1-2 Semana 3-6 Semana 7-12
CAMADA 1+2 CAMADA 3 CAMADA 4
Onda 1: Quick Win Onda 2: Deep Analysis Onda 3: Scale
Ação Resultado Ação Resultado Ação Resultado
Habilitar Claude Modelos disponíveis Setup Foundry resource Ambiente enterprise Multi-agent: Scanner + Pipeline automatizado
Opus/Sonnet 4.6 no imediatamente com Claude models configurado Analyzer + Translator + end-to-end
Copilot policy Tester
Claude Code para análise Codebase inteira
Devs usam para code Produtividade imediata, COBOL com 1M token analisada de uma vez Model Router para cost ~40% economia em
review e chat zero custo adicional context optimization custos de token
Agent sessions para Time familiarizado com GitHub Actions com Automação em CI/CD Foundry IQ para Agents contextualizam
issues simples de capabilities claude-code-action@v1 grounding em docs com dados do cliente
COBOL enterprise
MCP servers para GitHub Integração com
@claude em PRs para Feedback loop API + Database ferramentas existentes Fleet Management para Visibilidade centralizada
review automatizado estabelecido operações
Microsoft Confidential | Americas Software GBB


## Page 15

Arquitetura Integrada, Todas as Camadas
Plataforma &
Segurança
Entra, Key Vault, Monitor,
RBAC
Camada de Modelos
Claude, Sonnet, Haiku,
GPT, Router
Experiência Dev
GitHub, VS Code, Copilot,
Agents
Fluxo de Dados Integração GitHub Actions + Foundry
01 Claude Code em Actions usa variáveis Foundry para billing via MACC:
Dev Interage CLAUDE_CODE_USE_FOUNDRY=1
ANTHROPIC_FOUNDRY_RESOURCE={resource}
Via Copilot Chat ou Agent Sessions (Camada 1) # Entra ID ou API Key para autenticação
02
Billing MACC: Todo consumo de Claude Code via Foundry é elegível para Microsoft Azure Consumption Commitment, simplificando o processo de aprovação
Request Roteia em grandes enterprises.
Para modelo ideal via Model Router (Camada 2)
03
Modelo Acessa
Ferramentas via MCP Servers (Camada 3)
04
Agents Coordenam
Via orchestration patterns (Camada 4)
05
Governança
Entra ID, RBAC e audit trail (Camada 5)
Microsoft Confidential | Americas Software GBB


## Page 16

Métricas & ROI, Agent Performance
KPIs de Agent Performance Impacto por Desenvolvedor/Mês
KPI Baseline Target Método 96%
Issue Triage Time 4–8 horas < 5 minutos GitHub Projects
timestamps
Redução Triage
PR Review Time 24–48 horas < 2 horas GitHub PR metrics
De 4–8h para <5min por issue
MTTR 4–6 horas 1–2 horas GitHub Actions + App
Insights
$32
Code Coverage Baseline % +15–25%/quarter GitHub Actions
(coverage)
Custo/Dev/Mês
COBOL LOC/Semana 500–1K (manual) 50K–100K (auto) Claude Code metrics
Total estimado de tokens
Developer Satisfaction Survey baseline +30–40% Developer survey
quarterly
100x
Cost Optimization Strategy
Modelo Use Case Token Cost Volume/mês Custo Est. COBOL Throughput
Haiku 4.5 Triage, classification, routing $0.25/1M input 10M tokens ~$2.50 50K–100K LOC vs 500–1K manual
Sonnet 4.6 Code review, generation, $3/1M input 5M tokens ~$15
$650
analysis
Opus 4.6 Deep analysis, orchestration $15/1M input 1M tokens ~$15
Equipe de 20 Devs
Total ~$32.50
vs. custo de 1 consultor COBOL
Custos são por desenvolvedor/mês. Para equipe de 20 devs, estimativa
de ~$650/mês, significativamente menor que 1 consultor de
modernização COBOL.
Microsoft Confidential | Americas Software GBB


## Page 17

Métricas e ROI por Camada
ROI Progressivo KPIs por Onda
Camada Investimento Retorno Mensal Payback ROI Ano 1 KPI Onda 1 Onda 2 Onda 3
1. Copilot + Claude $0 adicional 20-30% produtividade dev Imediato Incluso no Copilot ROI Issue triage time 4-8h → 30min 30min → 5min 5min → automático
2. Coding Agent $0 adicional (preview) 40-60% redução triage/review Imediato +$15-25K/time PR review time 24-48h → 4h 4h → 1h 1h → automático
3. Claude Code Foundry ~$32.50/dev/mês 85% redução custo modernização 3-4 meses R$ 8-15 por R$ 1 COBOL LOC/semana 500-1K (manual) 50-100K (Claude Code) 200-500K (multi-agent)
4. Multi-Agent Service Variável por consumo Pipeline automatizado end-to-end 4-6 meses R$ 5-10 por R$ 1 Documentação gerada Manual 20-30% 80-90% automática 95-100% automática
Pilot Business Case Total Custo por módulo R$ 2-5M R$ 500K-1M R$ 200-500K
R$130K R$1M
Investimento Total Retorno Potencial
85%
Foundry R$30K + Team R$80K + Training R$20K Savings + documentation + framework replicável
3-4m R$15
Payback ROI Ano 1
Meses para retorno do investimento Para cada R$1 investido no enterprise Redução de Custo
Modernização com Claude Code Foundry
40%
Economia em Tokens
Com Model Router ativo
95%
Documentação Auto
Gerada na Onda 3 multi-agent
Microsoft Confidential | Americas Software GBB
