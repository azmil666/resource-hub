---
title: "PocketBase"
description: "An open-source backend in a single file featuring an embedded SQLite database, real-time subscriptions, authentication, and file storage"
category: "backend"
type: "website"
url: "https://pocketbase.io"
pricing: "free"
tags:
  - backend
  - database
status: "published"
dateAdded: "2026-09-07"
---

# PocketBase

## Why Use It

Scaffolding a custom backend for small to medium applications often introduces significant operational bloat: configuring ORMs, auth microservices, S3 buckets, and websocket servers. PocketBase is an open-source, all-in-one backend packaged into a single Go binary with an embedded SQLite database with WAL mode enabled. It provides an instant REST API, real-time subscriptions, user management, and file storage out of the box with zero runtime dependencies.

## Key Capabilities

- Single-binary deployment with embedded SQLite database capable of handling 10,000+ persistent real-time connections
- Built-in user authentication supporting email/password, OAuth2 providers, and multi-factor auth
- Real-time SSE (Server-Sent Events) subscriptions for instant client-side data updates
- Embedded admin dashboard for visual data browsing, schema migrations, and role-based access rules

## Stack Fit & Workflow

Pairs exceptionally well with SvelteKit, React, Vue, Flutter, and mobile app developers building MVPs, local tools, and SaaS products.
