---
title: "03 Code Intelligence Layer"
description: "Implementation guidance for building a compiler-accurate code intelligence layer across multiple languages and runtimes."
author: "Paula Silva"
date: "2026-05-04"
version: "1.0.0"
status: "draft"
tags: ["scl-ad", "code-intelligence", "static-analysis", "implementation"]
---

# 03 Code Intelligence Layer

> The substrate that makes everything else possible. How to build a compiler-accurate, queryable model of source code, per language and at enterprise scale.

## Change Log

| Version | Date       | Author      | Changes         |
|---------|------------|-------------|-----------------|
| 1.0.0   | 2026-05-04 | Paula Silva | Initial version |

## Table of Contents

- [1. Why Compiler Accuracy Matters](#1-why-compiler-accuracy-matters)
- [2. Required Capabilities](#2-required-capabilities)
- [3. Implementation Strategies](#3-implementation-strategies)
- [4. Per-Language Guidance](#4-per-language-guidance)
- [5. Cross-Repository Resolution](#5-cross-repository-resolution)
- [6. Performance and Scale](#6-performance-and-scale)
- [7. Build vs. Buy Decision](#7-build-vs-buy-decision)
- [References](#references)

## 1. Why Compiler Accuracy Matters

Most code analysis tools are not compiler-accurate. They parse syntax, recognize tokens, and apply heuristics. They are fast, but they make assumptions where the compiler resolves facts. For agent grounding, the difference is decisive.

Consider a simple example. A function call `service.process(item)` in Java means different things depending on:

- The static type of `service` (which interface or class it implements)
- The runtime type if the call is virtual
- The generic type parameter of `item`
- Whether `process` is overloaded
- Which dependency injection configuration is active

A heuristic parser sees a method call. A compiler-accurate model resolves it to a specific method on a specific type with specific generic parameters. When an agent reasons about impact ("what calls this function?"), the difference is the difference between a useful answer and a misleading one.

The Code Intelligence layer must produce models that the compiler would recognize as correct. Anything less and the higher layers compound the inaccuracy.

## 2. Required Capabilities

A valid Code Intelligence layer provides the following capabilities. Each can be tested with a finite set of fixtures.

### 2.1 Symbol Resolution

For every reference to a symbol (variable, function, class, method, type), the layer resolves the reference to its definition. The resolution accounts for scoping rules, visibility, imports, and generic parameters.

### 2.2 Type Resolution

For every expression, the layer resolves the static type. For polymorphic dispatch, it identifies the set of possible runtime types based on declared interfaces and known implementations.

### 2.3 Inheritance and Implementation Graphs

The layer produces a directed graph of inheritance relationships (extends, implements) for object-oriented languages, including interface implementation chains and multiple inheritance where applicable.

### 2.4 Call Graphs

The layer produces a directed graph of call relationships. For dynamic dispatch, the graph includes the set of possible target methods, not just the declared one.

### 2.5 Dependency Resolution

External dependencies are resolved to specific versions. Transitive dependencies are computed. Conflict resolution rules are applied per the build system in use.

### 2.6 Configuration Mapping

Configuration files (application.yaml, appsettings.json, .env) are parsed and linked to the code that consumes them, with key paths preserved for traceability.

### 2.7 Source Range Preservation

Every fact in the model is anchored to a source range (file, start line, end line, start column, end column) so artifacts can reference original code precisely.

## 3. Implementation Strategies

Three implementation strategies are common. They differ in cost, maintenance burden, and language coverage.

### 3.1 Language-Native Compilers

Use the compiler or language server for each language directly. This produces the highest fidelity at the cost of running multiple toolchains.

- For .NET languages: Roslyn APIs
- For Java/Kotlin: Eclipse JDT, javac with Compiler Tree API, or Kotlin compiler embeddable
- For TypeScript/JavaScript: TypeScript Compiler API (`tsc --noEmit` mode)
- For Python: Pyright or Pylance language server, or LibCST plus type stubs
- For Go: go/types and go/ast packages
- For Rust: rust-analyzer

This strategy is the gold standard for accuracy. The trade-off is operational complexity: each language requires its own runner, sandboxed environment, and version compatibility matrix.

### 3.2 Unified Static Analysis Platforms

Use a single platform that supports many languages with semantic accuracy. Examples include CodeQL (which builds a relational database from compiled code), Semgrep with its semantic mode, and commercial platforms like Moderne.

This strategy reduces operational complexity but introduces a vendor or framework dependency. The accuracy approaches but does not match language-native compilation in some edge cases.

### 3.3 Tree-Sitter Plus Type Resolvers

Use tree-sitter for parsing and combine it with language-specific type resolvers. This is a common approach for IDEs that need broad coverage with reasonable accuracy.

This strategy is operationally simple but does not meet the compiler-accuracy bar by itself. It is suitable as a fallback for languages where a full compiler-based pipeline is impractical, with the explicit understanding that artifacts derived from such languages will carry a lower fidelity label.

## 4. Per-Language Guidance

The framework recommends specific tooling per language family. The recommendations balance fidelity, maintenance, and ecosystem maturity.

### 4.1 JVM Languages (Java, Kotlin, Scala)

Recommended: **OpenRewrite LST** (Moderne's open-source Lossless Semantic Tree implementation) or direct use of Eclipse JDT.

OpenRewrite produces a compiler-accurate, format-preserving model with broad ecosystem support. It handles cross-repository linkage natively and is the most mature open option for JVM at scale.

### 4.2 .NET Languages (C#, F#, VB.NET)

Recommended: **Roslyn Workspaces API**.

Roslyn is the official compiler-as-a-service for .NET. It produces fully resolved syntax trees and semantic models. It integrates with MSBuild for project resolution and supports incremental compilation.

### 4.3 TypeScript and JavaScript

Recommended: **TypeScript Compiler API** with project references resolved.

For pure JavaScript, the TypeScript compiler in `allowJs` mode provides type inference where types can be deduced. For higher accuracy on JavaScript, JSDoc type annotations should be enforced.

### 4.4 Python

Recommended: **Pyright** for type resolution combined with **LibCST** for format-preserving syntax trees.

Python's dynamic nature makes full compiler accuracy theoretically impossible. The framework recommends conservative resolution (resolving what can be resolved, marking the rest as dynamic) rather than guessing.

### 4.5 Go

Recommended: **go/packages** and **go/types** standard library packages.

Go has an unusually clean compilation model. The standard library tools produce compiler-accurate semantic information out of the box.

### 4.6 Rust

Recommended: **rust-analyzer** with its IDE-grade semantic model.

Rust's macros and type system require deep tooling. rust-analyzer is the de facto standard and produces models suitable for SCL-AD recipes.

### 4.7 Mainframe Languages (COBOL, PL/I)

Recommended: **commercial modernization platforms** (Moderne, IBM watsonx Code Assistant for Z, Microsoft mainframe modernization tooling).

Open-source compiler-accurate tooling for mainframe languages is limited. For organizations modernizing legacy estates, commercial platforms are the practical path. The framework accommodates this by treating the code intelligence layer as pluggable.

## 5. Cross-Repository Resolution

Single-repository analysis is solved. Cross-repository resolution is where most implementations break down.

The fundamental problem is that a function in repository A may call a method on a class defined in repository B, which depends on an interface defined in repository C. To resolve this chain, the analyzer must have access to all three repositories simultaneously, with consistent versions.

Three approaches are recommended:

### 5.1 Monorepo-Style Workspace

If the organization uses a monorepo or a workspace tool (Nx, Bazel, Turborepo), the Code Intelligence layer leverages the workspace boundaries directly. This is the simplest case and produces the highest fidelity.

### 5.2 Internal Package Registry

If repositories publish to an internal package registry (Artifactory, Azure Artifacts, GitHub Packages), the Code Intelligence layer resolves cross-repository references by consuming published artifacts. The accuracy is bounded by the publish cadence.

### 5.3 Coordinated Multi-Repository Analysis

For organizations without monorepos or internal registries, the layer must orchestrate analysis across repositories explicitly. This requires:

- A repository inventory with dependency declarations
- A scheduling system that processes dependencies before dependents
- A linkage step that resolves cross-repository references after individual analysis completes

This is the most complex pattern and is where commercial platforms typically provide the most value.

## 6. Performance and Scale

At enterprise scale (thousands of repositories, millions of lines of code), naive implementations break down. Three patterns address scale.

### 6.1 Incremental Analysis

Re-analyze only what changed. Most language-native compilers support incremental compilation natively. The Code Intelligence layer must surface this capability so recipe execution does not require full reanalysis on every commit.

### 6.2 Caching by Content Hash

Cache analysis results by content hash of the inputs (source files plus dependency manifest). A repository at the same commit produces the same model, which can be reused across recipe executions.

### 6.3 Parallel Execution

Analysis is embarrassingly parallel across repositories. The orchestration layer should distribute work across worker pools sized to the available compute budget.

Cost containment is a real concern. Compiler-accurate analysis is more expensive than syntactic analysis. The framework recommends scoping analysis to repositories that meet defined criteria (active development, in production, in scope for AI agent assistance) rather than analyzing every artifact in the source control system.

## 7. Build vs. Buy Decision

Most enterprises will not build the Code Intelligence layer entirely from scratch. The realistic options are:

- **Use language-native tooling directly** for the dominant language(s). Build once, maintain once. Suitable when one or two languages dominate.
- **Adopt a commercial platform** for breadth across many languages. Pay for the integration, focus engineering on Layer 2 and above. Suitable for diverse polyglot estates.
- **Hybrid.** Use commercial tooling for legacy and exotic languages, language-native tooling for primary stack. Most pragmatic for large enterprises.

The decision should be guided by:

- Number of languages in active scope
- Existing investments in static analysis platforms
- Required refresh latency and freshness guarantees
- Available platform engineering capacity
- Compliance requirements that may favor on-premises or sovereign-cloud options

The framework is deliberately neutral on this choice. Layer 2 and above operate against the model interface, not the implementation.

## References

1. [OpenRewrite Documentation](https://docs.openrewrite.org/). Open-source LST implementation for JVM languages.
2. [Roslyn Compiler Platform](https://learn.microsoft.com/dotnet/csharp/roslyn-sdk/). Microsoft's official .NET compiler-as-a-service.
3. [TypeScript Compiler API](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API). Reference for TypeScript and JavaScript analysis.
4. [Pyright Documentation](https://microsoft.github.io/pyright/). Recommended Python type resolver.
5. [CodeQL Documentation](https://codeql.github.com/docs/). GitHub's semantic analysis platform.
6. [tree-sitter](https://tree-sitter.github.io/tree-sitter/). General-purpose parser generator for fallback scenarios.
