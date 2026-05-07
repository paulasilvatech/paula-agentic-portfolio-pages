---
title: "05 Context Registry and Distribution"
description: "Storage, distribution, discovery, and refresh patterns for the SCL-AD Context Registry layer."
author: "Paula Silva"
date: "2026-05-04"
version: "1.0.0"
status: "draft"
tags: ["scl-ad", "registry", "distribution", "storage", "discovery"]
---

# 05 Context Registry and Distribution

> Where semantic artifacts live, how agents find them, how they stay fresh, and how access is governed. The interface between recipe execution and agent consumption.

## Change Log

| Version | Date       | Author      | Changes         |
|---------|------------|-------------|-----------------|
| 1.0.0   | 2026-05-04 | Paula Silva | Initial version |

## Table of Contents

- [1. Registry Responsibilities](#1-registry-responsibilities)
- [2. Storage Patterns](#2-storage-patterns)
- [3. Discovery and Search](#3-discovery-and-search)
- [4. Versioning and Content Addressing](#4-versioning-and-content-addressing)
- [5. Refresh Strategy](#5-refresh-strategy)
- [6. Access Control](#6-access-control)
- [7. Distribution to Agents](#7-distribution-to-agents)
- [8. Reference Implementations](#8-reference-implementations)
- [References](#references)

## 1. Registry Responsibilities

The Context Registry sits between two clocks. On one side, recipes execute on a build cadence (commit, schedule, event). On the other side, agents query for context on a session cadence (every developer interaction). The registry must serve both.

Five responsibilities define a compliant registry:

The registry **stores** semantic artifacts durably. Once an artifact is published, it is retrievable until explicitly archived.

The registry **discovers**. Agents and tools find artifacts by repository, by type, by version, or by content attribute, without needing prior knowledge of internal storage layout.

The registry **versions**. Every artifact is content-addressed and has a stable identifier. Older versions remain accessible until lifecycle policies remove them.

The registry **enforces access**. Every read is authenticated and authorized against the same policies that govern the underlying source code.

The registry **observes**. Every read and write is logged with sufficient detail to reconstruct what context any agent saw at any moment.

## 2. Storage Patterns

Three storage patterns are recognized, corresponding to organizational maturity and scale.

### 2.1 Co-Located Storage

Artifacts are stored within the source repository they describe, typically under `.context/` at the repository root.

**Advantages:** simplest possible setup; access control is identical to the source code; artifacts are versioned by Git; agents already configured to read repository files need no additional configuration.

**Disadvantages:** does not support cross-repository queries; refresh is bounded by Git operations; large artifacts inflate repository size; difficult to enforce centralized governance.

**When to use:** pilot phase; single-repository proofs of concept; small to mid-size organizations where centralized infrastructure is overkill.

### 2.2 Centralized Registry

A dedicated service stores artifacts from all repositories. The service exposes APIs for write (from recipe execution) and read (from agents and tools).

**Advantages:** cross-repository queries are native; refresh and lifecycle are managed centrally; separation from source repositories enables artifact-specific governance; storage is optimized for artifact access patterns.

**Disadvantages:** introduces a new service to operate; access control must be synchronized with source code permissions; agents need additional configuration to consume from the registry.

**When to use:** platform-scale deployments; organizations with hundreds or thousands of repositories; environments where centralized governance is a hard requirement.

### 2.3 Federated Storage

Multiple registries are linked through a common discovery layer. Each registry serves a subset of repositories, typically scoped by business unit, region, or compliance domain.

**Advantages:** respects sovereignty and regulatory constraints (data residency, regulated industries); scales horizontally; isolates failure domains.

**Disadvantages:** most complex to operate; discovery layer becomes critical infrastructure; cross-region queries require careful design.

**When to use:** multinational organizations with data residency requirements; conglomerates with autonomous business units; regulated industries where some artifacts cannot leave specific jurisdictions.

## 3. Discovery and Search

Discovery is the operation by which an agent or tool locates an artifact without prior knowledge of its identifier. The framework specifies a minimum discovery API that all compliant registries implement.

### 3.1 Discovery by Repository

The most common pattern. Given a repository (URL or canonical name), return all artifacts available for it.

```
GET /v1/repositories/{repo}/artifacts
GET /v1/repositories/{repo}/artifacts?type=structural-inventory
GET /v1/repositories/{repo}/artifacts?commit={sha}
```

### 3.2 Discovery by Capability

Given a capability (a recipe category or output schema), return repositories that have artifacts of that capability.

```
GET /v1/artifacts?type=service-topology
GET /v1/artifacts?type=dependency-intelligence&min_freshness=24h
```

### 3.3 Search by Content

For organizations that need cross-cutting queries ("which repositories use library X?"), the registry supports content search across artifacts.

```
POST /v1/search
{
  "artifact_type": "dependency-intelligence",
  "filter": {
    "dependency.group": "org.springframework",
    "dependency.version_lt": "5.3.0"
  }
}
```

### 3.4 Stable URIs

Every artifact has a stable URI of the form:

```
scl://{registry-id}/{repo-slug}/{commit}/{artifact-type}/{recipe-version}
```

This URI is the canonical reference for citations, links, and cross-references. It does not change for the lifetime of the artifact.

## 4. Versioning and Content Addressing

Versioning in the registry serves three purposes: traceability, reproducibility, and lifecycle management.

### 4.1 Content Addressing

Every artifact body is hashed (SHA-256 by default). The hash serves as the immutable identifier. Two recipe runs that produce identical bytes share the same content hash, which deduplicates storage.

### 4.2 Manifest Versioning

The artifact manifest carries explicit version fields:

- The **recipe version** (which recipe produced this artifact)
- The **schema version** (which schema this artifact conforms to)
- The **model version** (which code intelligence model was the input)
- The **registry version** (which registry contract this manifest follows)

These four versions enable safe evolution. A schema change does not invalidate older artifacts; it changes which schema agents validate against.

### 4.3 Artifact Aliases

The registry supports aliases that resolve to specific artifacts. Common aliases include:

- `latest` resolves to the most recent artifact for a repository and type
- `stable` resolves to the most recent artifact that has passed validation
- `commit:{sha}` resolves to the artifact for a specific commit

Aliases are critical for agent integration because agents typically request "the latest service topology" rather than a specific content hash.

## 5. Refresh Strategy

Stale context is the failure mode the registry must prevent. Refresh strategy is multi-modal.

### 5.1 Commit-Driven Refresh

A push to a tracked branch triggers selective recipe re-execution. The orchestration layer determines which recipes are affected by the changed files. Recipes that depend only on unchanged files are not re-executed.

This is the most precise refresh mode. Latency is bounded by the recipe execution time, typically minutes.

### 5.2 Scheduled Refresh

A periodic full refresh (typically daily for active repositories, weekly for stable ones) catches drift caused by:

- Transitive dependency updates
- Third-party API changes resolved at build time
- Convention drift that emerges from many small commits

Scheduled refresh ensures that even repositories with no recent activity have current artifacts.

### 5.3 Event-Driven Refresh

Specific events trigger targeted refreshes:

- A security advisory affecting a tracked dependency triggers Dependency Intelligence regeneration
- A major framework upgrade triggers Convention Extraction regeneration
- A regulatory deadline triggers Security Posture Snapshot regeneration

Event-driven refresh keeps the registry aligned with operational reality.

### 5.4 Staleness Policy

Each artifact type has a defined freshness window. When an artifact exceeds its window, the registry surfaces a staleness signal to agents. Stale artifacts are not removed automatically; their staleness is visible so consumers can decide whether to use them.

A typical policy:

| Artifact Type             | Acceptable Staleness | Reason                                            |
|---------------------------|----------------------|---------------------------------------------------|
| Structural Inventory      | 7 days               | Structure changes infrequently                    |
| Dependency Intelligence   | 24 hours             | Security advisories require fast propagation      |
| Service Topology          | 7 days               | Topology changes are deliberate and slow          |
| Convention Extraction     | 30 days              | Conventions are stable                            |
| Test Intent Mapping       | 7 days               | Test changes are continuous but not urgent        |
| Configuration Surface     | 24 hours             | Configuration drives runtime behavior             |
| Security Posture Snapshot | 24 hours             | Security posture must be current                  |

## 6. Access Control

Access control in the registry follows two principles: **identity propagation** and **least privilege**.

### 6.1 Identity Propagation

Every read of the registry is authenticated. The identity of the requester (a developer, an agent acting on behalf of a developer, a service principal) is checked against the access policy of the underlying source code.

If the requester cannot read repository X in the source control system, they cannot read artifacts derived from repository X in the registry. Without exception.

### 6.2 Classification Labels

Artifacts carry classification labels (public, internal, confidential, restricted). Labels are inherited from the source repository's classification but can be overridden upward (more restrictive) by recipe configuration. They cannot be overridden downward.

Restricted artifacts may carry additional access requirements (need-to-know group membership, multi-party authorization, audit acknowledgment) enforced at read time.

### 6.3 Audit Logging

Every artifact read produces an audit log entry with at minimum:

- Timestamp
- Requester identity
- Artifact URI
- Artifact content hash at time of read
- Access result (allowed, denied, with reason)
- Calling context (agent name, session ID, tool invocation ID where applicable)

Audit logs are retained according to organizational policy, typically 12 to 36 months for regulated environments.

## 7. Distribution to Agents

The final mile is delivering artifacts to the agents that consume them. Three distribution modes are supported.

### 7.1 Static File Distribution

Artifacts are written to predetermined file paths in the repository or developer workspace. The agent reads them as part of its standard repository scan. This works with any agent that respects repository-level instruction files.

This mode trades fidelity for compatibility. The agent receives the artifacts but cannot query them dynamically.

### 7.2 MCP Server Distribution

The registry exposes a Model Context Protocol server. Agents that support MCP query the server with structured tool calls and receive artifacts on demand.

This mode supports dynamic queries and is the recommended path for new deployments. It requires MCP support in the agent platform.

### 7.3 API Distribution

The registry exposes its native API directly to agents that can call HTTP services. This is the most flexible mode but requires agent-side custom integration.

A given organization typically uses more than one mode. Static files for broad coverage and quick wins, MCP for advanced agents, direct API for custom tooling. The registry serves all modes from the same underlying storage.

## 8. Reference Implementations

The framework does not mandate a specific implementation. Several reasonable starting points are available depending on the organization's existing platform.

### 8.1 Object Storage Plus Index

A minimal implementation uses object storage (S3, Azure Blob Storage, Google Cloud Storage) for artifact bodies and a relational database for the manifest index. An API layer (typically a small REST service) implements the discovery contract.

This is the lowest-cost option and adequate for many organizations.

### 8.2 OCI Registry

Artifacts can be stored as OCI artifacts in a container registry (Harbor, Azure Container Registry, GitHub Container Registry). This reuses existing authentication, replication, and lifecycle infrastructure.

This option is attractive for organizations with mature container platform investments.

### 8.3 Knowledge Graph Backend

For organizations that need rich cross-artifact queries (impact analysis, dependency traversal, architectural search), a graph database backend (Neo4j, Azure Cosmos DB Gremlin, Amazon Neptune) is appropriate.

This option is the highest fidelity for advanced use cases and the most expensive to operate.

### 8.4 Commercial Platform

Commercial code intelligence platforms (Moderne, Sourcegraph) offer integrated registry capabilities. The trade-off is platform dependency in exchange for reduced build effort.

The decision is not binary. Many production deployments combine a commercial platform for the code intelligence layer with self-built registry components, or vice versa.

## References

1. [Model Context Protocol Specification](https://modelcontextprotocol.io/). Standard for MCP-based distribution.
2. [OCI Distribution Specification](https://github.com/opencontainers/distribution-spec). Foundation for OCI-based registries.
3. [SLSA Provenance Specification](https://slsa.dev/spec/v1.0/provenance). Reference for artifact provenance and signing.
4. [Sigstore Project](https://www.sigstore.dev/). Reference for artifact signing without managing certificate infrastructure.
