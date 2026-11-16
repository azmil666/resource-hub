---
title: "Contribute to Developer Resource Hub"
description: "Guidelines and workflows for submitting new resources, improving documentation, and reporting updates."
---

# Contributing to Developer Resource Hub

We welcome contributions from the developer community! Whether you want to recommend a valuable tool, fix a broken link, or expand documentation for an existing entry, this guide explains the process.

---

## Ways to Contribute

### 1. Submit a Resource via GitHub Issue (Fastest)

If you don't want to write code, submit a resource directly through GitHub:

1. Go to the [GitHub Issue Form](https://github.com).
2. Choose **Resource Submission**.
3. Fill in the title, URL, category, type, pricing, and why it is helpful.
4. Our maintainers review the submission, run automated checks, and merge it into the catalog.

### 2. Add via Command Line (For Contributors with Local Clone)

Clone the repository and run our interactive CLI:

```bash
# 1. Install dependencies
npm install

# 2. Run the interactive resource creator
npm run resource:add
```

The CLI guides you through the metadata fields, generates the slug, validates the inputs, and verifies that the URL is not a duplicate.

### 3. Submit a Pull Request (Manual Markdown)

You can create a new Markdown file under `docs/resources/<category>/<slug>.md`:

```markdown
---
title: "Resource Name"
description: "Short factual description of what the tool or resource does."
category: "frontend"
type: "library"
url: "https://example.com"
pricing: "free"
tags:
  - react
  - ui-components
status: "published"
---

# Resource Name

## Overview

A factual explanation of what this resource offers and its core capabilities.

## Useful for

- Workflow optimization
- Component styling and state handling

## Notes

Licensing considerations, limitations, or browser compatibility notes.
```

---

## Quality & Curation Guidelines

To ensure the library remains high-signal, submissions are evaluated against these criteria:

### What We Accept

- Active, well-maintained developer utilities and libraries.
- High-quality open-source projects and boilerplates.
- Free or transparently priced tools with genuine developer utility.
- Canonical documentation, roadmaps, and educational platforms.
- Curated design systems, fonts, and icon collections.

### What We Reject

- Unverified affiliate links or commercial spam.
- Tools requiring mandatory paid plans with no trial or free utility.
- Abandoned, unmaintained, or broken repositories.
- Plagiarized or low-effort AI-generated content hubs.

---

## Pre-commit Verification

Before opening a pull request, always run the validation suite and verify the build:

```bash
# Validate frontmatter, URLs, tags, and internal paths
npm run resource:validate

# Build the static site to ensure no compilation issues
npm run docs:build
```

Thank you for helping build a better, cleaner resource hub for developers worldwide!
