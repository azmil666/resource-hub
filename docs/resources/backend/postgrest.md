---
title: "PostgREST"
description: "A standalone web server that turns any PostgreSQL database directly into a fast, documented RESTful API"
category: "backend"
type: "website"
url: "https://postgrest.org"
pricing: "unknown"
tags:
  - backend
  - api
  - database
status: "published"
dateAdded: "2026-09-07"
---

# PostgREST

## Why Use It

Writing repetitive boilerplate CRUD controllers and custom serializers in application code introduces latency, bugs, and maintenance overhead. PostgREST is a standalone web server written in Haskell that inspects the schema of any existing PostgreSQL database and instantly exposes a fast, secure, fully compliant RESTful API. It delegates authentication and data validation directly to PostgreSQL's native Row Level Security (RLS) and SQL functions.

## Key Capabilities

- Instant RESTful API generation reflecting tables, views, and stored procedures with zero backend code
- Built on PostgreSQL's native Row Level Security (RLS) for rock-solid authorization and data tenancy
- High-performance, low-latency execution compiling HTTP requests directly into single SQL queries
- Automatic OpenAPI / Swagger specification generation for instant client SDK generation and documentation

## Stack Fit & Workflow

The core architectural engine behind Supabase, pairing with PostgreSQL across frontend web (React, Vue, Svelte) and mobile clients.
