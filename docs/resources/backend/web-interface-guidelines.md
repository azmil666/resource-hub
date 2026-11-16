---
title: "Web Interface Guidelines"
description: "Vercel’s official UI review skill that audits your codebase against web design best practices and flags issues with exact file:line references"
category: "backend"
type: "github-repository"
url: "https://github.com/vercel-labs/agent-skills"
pricing: "free"
tags:
  - backend
  - open-source
  - ai-agents
status: "published"
dateAdded: "2026-09-11"
---

# Web Interface Guidelines

## Why Use It

Automated code linters and standard CI checks catch syntax errors and type mismatches, but consistently miss interface anti-patterns like layout shifts, missing focus states, and broken mobile tap targets. Web Interface Guidelines (by Vercel Labs) is a specialized agent skill that audits frontend codebases against industry-standard web interface best practices. It inspects component markup and stylesheets to flag accessibility oversights, typography defects, and layout regressions with exact file and line references.

## Key Capabilities

- Automated scanning of frontend codebases against curated web interface guidelines and interaction standards
- High-precision issue identification flagging accessibility (WCAG), layout shift (CLS), tap target, and typography issues
- Concrete remediation diffs outputting exact file paths and line numbers for rapid agentic or manual fixes
- Seamless integration with Claude Code, Cursor, and custom agent review harnesses

## Stack Fit & Workflow

Designed for React, Next.js, and Tailwind CSS codebases within pull-request review pipelines and AI agent quality-assurance workflows.
