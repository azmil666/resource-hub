---
title: "Contribute to Developer Resource Hub"
description: "Guidelines and workflows for submitting new resources, improving documentation, and reporting updates."
---

# Contributing to Developer Resource Hub

We welcome contributions from the developer community! Whether you want to recommend a valuable tool, fix a broken link, or expand documentation for an existing entry, this guide explains the process.

---

## Submission Workflows

<div class="rh-contribute-grid">
  <div class="rh-card rh-contribute-card">
    <div class="rh-step-badge">Option 1 • Fastest</div>
    <h3 class="rh-step-title">Submit via GitHub Issue</h3>
    <p class="rh-step-desc">
      No code or git knowledge required. Fill out our structured issue template directly in GitHub:
    </p>
    <ol class="rh-step-list">
      <li>Open the submission issue form.</li>
      <li>Provide the tool name, URL, category, and why it's valuable.</li>
      <li>Our maintainers review and merge it.</li>
    </ol>
    <div class="rh-step-action">
      <a
        href="https://github.com/azmil666/resource-hub/issues/new?template=resource-submission.yml"
        target="_blank"
        rel="noopener noreferrer"
        class="rh-btn rh-btn-primary rh-btn-sm"
      >
        <span>Open Issue Form</span>
        <span aria-hidden="true">↗</span>
      </a>
    </div>
  </div>

  <div class="rh-card rh-contribute-card">
    <div class="rh-step-badge">Option 2 • Recommended for Devs</div>
    <h3 class="rh-step-title">Add via Interactive CLI</h3>
    <p class="rh-step-desc">
      Clone the repository and run our automated terminal resource wizard:
    </p>
    <pre class="rh-step-code"><code>git clone https://github.com/azmil666/resource-hub.git
cd resource-hub
npm install
npm run resource:add</code></pre>
    <p class="rh-step-note">
      The CLI automatically creates the slug, validates URLs against duplicates, and writes the Markdown file.
    </p>
  </div>

  <div class="rh-card rh-contribute-card">
    <div class="rh-step-badge">Option 3 • Manual PR</div>
    <h3 class="rh-step-title">Submit a Pull Request</h3>
    <p class="rh-step-desc">
      Create a new Markdown file under <code>docs/resources/&lt;category&gt;/&lt;slug&gt;.md</code>:
    </p>
    <pre class="rh-step-code"><code>---
title: "Resource Name"
description: "Factual description."
category: "frontend"
type: "library"
url: "https://example.com"
pricing: "free"
tags:
  - react
  - ui
status: "published"
---</code></pre>
  </div>
</div>

---

## Quality & Curation Guidelines

To ensure the library remains high-signal and free of spam, submissions are evaluated against strict criteria:

<div class="rh-guidelines-grid">
  <div class="rh-card rh-guide-box rh-guide-accept">
    <div class="rh-guide-header">
      <span class="rh-guide-icon">✔</span>
      <strong>What We Accept</strong>
    </div>
    <ul>
      <li>Active, well-maintained developer utilities and libraries.</li>
      <li>High-quality open-source projects and boilerplates.</li>
      <li>Free or transparently priced tools with genuine developer utility.</li>
      <li>Canonical documentation, roadmaps, and educational platforms.</li>
      <li>Curated design systems, fonts, and icon collections.</li>
    </ul>
  </div>

  <div class="rh-card rh-guide-box rh-guide-reject">
    <div class="rh-guide-header">
      <span class="rh-guide-icon">✖</span>
      <strong>What We Reject</strong>
    </div>
    <ul>
      <li>Unverified affiliate links or commercial referral spam.</li>
      <li>Tools requiring mandatory paid subscriptions with zero free utility.</li>
      <li>Abandoned, unmaintained, or broken repositories.</li>
      <li>Low-effort AI generated content scrapers.</li>
    </ul>
  </div>
</div>

---

## Verification & Submitting

Before opening a [Pull Request](https://github.com/azmil666/resource-hub/pulls), always verify locally:

```bash
# 1. Validate frontmatter, URLs, tags, and internal paths
npm run resource:validate

# 2. Build the static site to ensure clean compilation
npm run docs:build
```

<style scoped>
.rh-contribute-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: var(--rh-space-4);
  margin: var(--rh-space-6) 0 var(--rh-space-10) 0;
}

@media (min-width: 768px) {
  .rh-contribute-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.rh-contribute-card {
  padding: var(--rh-space-5);
  display: flex;
  flex-direction: column;
}

.rh-step-badge {
  font-size: 0.725rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--rh-color-emerald-text);
  letter-spacing: 0.04em;
  margin-bottom: var(--rh-space-2);
}

.rh-step-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 var(--rh-space-2) 0;
  color: var(--rh-c-text-primary);
  letter-spacing: -0.02em;
}

.rh-step-desc {
  font-size: 0.875rem;
  line-height: 1.55;
  color: var(--rh-c-text-secondary);
  margin: 0 0 var(--rh-space-3) 0;
}

.rh-step-list {
  padding-left: 1.25rem;
  margin: 0 0 var(--rh-space-4) 0;
  font-size: 0.85rem;
  color: var(--rh-c-text-secondary);
  line-height: 1.6;
}

.rh-step-code {
  font-size: 0.75rem;
  background-color: var(--rh-c-bg-subtle);
  border: 1px solid var(--rh-c-border);
  border-radius: var(--rh-radius-sm);
  padding: 8px 10px;
  overflow-x: auto;
  margin: 0 0 var(--rh-space-3) 0;
}

.rh-step-note {
  font-size: 0.78125rem;
  color: var(--rh-c-text-tertiary);
  margin: auto 0 0 0;
  line-height: 1.5;
}

.rh-step-action {
  margin-top: auto;
  padding-top: var(--rh-space-4);
}

.rh-guidelines-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: var(--rh-space-4);
  margin: var(--rh-space-6) 0 var(--rh-space-8) 0;
}

@media (min-width: 640px) {
  .rh-guidelines-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.rh-guide-box {
  padding: var(--rh-space-5);
}

.rh-guide-accept {
  border-color: var(--rh-color-emerald-border);
}

.rh-guide-reject {
  border-color: var(--rh-color-rose-border);
}

.rh-guide-header {
  display: flex;
  align-items: center;
  gap: var(--rh-space-2);
  margin-bottom: var(--rh-space-3);
  font-size: 0.95rem;
  color: var(--rh-c-text-primary);
}

.rh-guide-accept .rh-guide-icon {
  color: var(--rh-color-emerald-text);
  font-weight: bold;
}

.rh-guide-reject .rh-guide-icon {
  color: var(--rh-color-rose-text);
  font-weight: bold;
}

.rh-guide-box ul {
  margin: 0;
  padding-left: 1.25rem;
  font-size: 0.875rem;
  color: var(--rh-c-text-secondary);
  line-height: 1.6;
}
</style>
