---
title: "Temporal"
description: "An open-source durable execution platform for building fault-tolerant, scalable microservices and long-running workflows"
category: "backend"
type: "website"
url: "https://temporal.io"
pricing: "free"
tags:
  - backend
status: "published"
dateAdded: "2026-09-10"
---

# Temporal

## Why Use It

Orchestrating multi-step distributed transactions across microservices usually requires brittle custom retry mechanisms, message queues, state machines, and compensation logic that fails under network partitions. Temporal is an open-source durable execution platform that preserves workflow execution state across server crashes, network outages, and process restarts. It allows developers to write complex, long-running business logic as standard procedural code while guaranteeing exactly-once completion.

## Key Capabilities

- Durable state persistence automatically replaying execution history to recover workflow state after infrastructure failures
- Support for long-running workflows spanning milliseconds to years without memory leaks or timeout constraints
- Deterministic workflow orchestration with native support for timers, signals, queries, and automated exponential backoff retries
- Polyglot SDK ecosystem providing first-class durable primitives for TypeScript, Go, Python, and Java

## Stack Fit & Workflow

Essential for mission-critical distributed systems, financial transaction pipelines, complex order fulfillment, and AI agent loop execution.
