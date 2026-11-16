# Developer Resource Hub

[![GitHub Repository](https://img.shields.io/badge/GitHub-azmil666%2Fresource--hub-181717?style=flat&logo=github)](https://github.com/azmil666/resource-hub)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Framework: VitePress](https://img.shields.io/badge/Framework-VitePress%201.6-4b32c3.svg)](https://vitepress.dev/)
[![Node Version](https://img.shields.io/badge/Node->=18.0.0-339933.svg?logo=node.js)](package.json)

A minimal, professionally designed, high-performance public developer knowledge library and curated resource directory.

**Official Repository:** [https://github.com/azmil666/resource-hub](https://github.com/azmil666/resource-hub)

---

## Overview

**Developer Resource Hub** is a searchable, categorized collection of valuable tools, references, and educational material personally collected and curated for software engineers, designers, and builders.

The catalog encompasses:

- **Websites & Online Tools**: Interactive web utilities, converters, testing platforms, and developer playgrounds.
- **Design Resources**: Icon libraries, typography catalogs, CSS design systems, UI kits, and vector assets.
- **AI Tools**: Large language models, code generation agents, prompt engineering utilities, and AI developer SDKs.
- **GitHub Repositories**: Notable open-source projects, boilerplates, starter kits, and system architectures.
- **Developer Utilities**: Formatters, linters, regex analyzers, API mockers, and debugging aids.
- **APIs & Backend Libraries**: Database engines, headless CMSs, backend frameworks, and public APIs.
- **Programming Tutorials & Courses**: Interactive computer science courses, interview prep guides, and roadmaps.
- **Documentation & References**: Cheat sheets, language specifications, and web standards.
- **Website Inspiration**: Award-winning site galleries, 3D web benchmarks, and interactive showcases.
- **Productivity Resources**: Terminal productivity tools, automation workflows, and developer utilities.

---

## Features

- **Resource Directory**: Comprehensive master catalog with live filtering, tag search, and category grouping.
- **Category-Based Browsing**: 10 focused technical categories with live resource counters and tailored directory views.
- **Built-in Local Search**: Ultra-fast fuzzy full-text search powered by VitePress and Minisearch, indexing titles, descriptions, categories, tags, and page content without external API dependencies.
- **Structured Metadata & Tags**: Every resource includes normalized YAML frontmatter (`title`, `description`, `category`, `type`, `url`, `pricing`, `tags`, `status`).
- **Individual Resource Pages**: Dedicated Markdown documentation pages with breadcrumbs, direct official links, metadata badges, and editorial notes.
- **Light & Dark Themes**: Native theme switcher adapting seamlessly to system preferences with accessible contrast tokens.
- **Resource Addition CLI**: Interactive command-line wizard (`npm run resource:add`) that validates inputs, prevents duplicate URLs, and formats Markdown files.
- **Batch CSV / JSON Importer**: Robust importer (`npm run resource:import`) supporting automated header mapping, URL normalization, and dry-run validation.
- **Resource Integrity Validation**: Automated validation suite (`npm run resource:validate`) checking frontmatter schema, internal links, slug uniqueness, and optional external HTTP URL health.
- **Community Contributions**: Integrated GitHub Issue Forms and streamlined Pull Request guidelines for community submissions.

---

## Technology Stack

The project relies entirely on lightweight, modern static web standards:

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Static Site Generator** | [VitePress](https://vitepress.dev/) | Version 1.6.4. Pre-rendered static HTML, zero client-side routing bloat. |
| **UI Framework** | [Vue 3](https://vuejs.org/) | Version 3.5.45. Used strictly where required by VitePress for custom theme components. |
| **Language & Tooling** | TypeScript & Node.js ESM | Reproducible scripts and types without heavy runtime dependencies. |
| **Content Format** | Markdown (CommonMark + GFM) | Markdown files serve as the single source of truth for all entries. |
| **Styling** | Native CSS Variables | System fonts, typography scales, and CSS custom properties for light/dark themes. |
| **Search Engine** | VitePress Built-in Local Search | Client-side index generated at build time with Minisearch fuzzy matching. |
| **Hosting & CDN** | [Vercel](https://vercel.com/) | Global edge network delivery configured via `vercel.json`. |
| **Version Control & CI** | [GitHub](https://github.com/azmil666/resource-hub) | Source code hosting, issue tracking, and community PR contributions. |

---

## Installation and Local Development

### 1. Clone the Repository

Clone the repository to your local machine using the official GitHub repository URL:

```bash
git clone https://github.com/azmil666/resource-hub.git
cd resource-hub
```

### 2. Install Dependencies

Install the project dependencies using `npm`:

```bash
npm install
```

### 3. Start Local Development Server

Run the VitePress development server with hot module reloading:

```bash
npm run docs:dev
```

Open your browser and navigate to `http://localhost:5173`.

### 4. Build for Production

Compile the static website, build-time content loaders, search index, and sitemap:

```bash
npm run docs:build
```

The pre-rendered static HTML files and client assets will be generated in `docs/.vitepress/dist/`.

### 5. Preview Production Build

Preview the production output locally before deployment:

```bash
npm run docs:preview
```

---

## Resource Management

### Adding an Individual Resource

To add a new resource via the interactive CLI wizard:

```bash
npm run resource:add
```

The interactive prompt will request:
1. **Resource Title** (e.g., `Phosphor Icons`)
2. **Official URL** (e.g., `https://phosphoricons.com`)
3. **Category** (select from the 10 approved categories)
4. **Resource Type** (`website`, `tool`, `library`, `github-repository`, `tutorial`, `course`, etc.)
5. **Pricing Model** (`free`, `freemium`, `paid`, `unknown`)
6. **Description** (1–2 concise, factual sentences)
7. **Tags** (comma-separated lowercase keywords)
8. **Notes** (optional implementation or context notes)

The CLI normalizes the inputs, generates a clean kebab-case slug, verifies that neither the title nor the URL are duplicates, and creates the Markdown file at `docs/resources/<category>/<slug>.md`.

### Batch Importing Resources (CSV / JSON)

To import multiple resources from a CSV or JSON file:

```bash
# Preview what would be created without writing files
npm run resource:import -- ./path/to/resources.csv --dry-run

# Execute the actual batch import
npm run resource:import -- ./path/to/resources.csv
```

The importer features:
- Support for RFC 4180 CSV files and JSON arrays.
- Automatic column mapping for `title`/`name`, `url`/`link`, `category`, `type`, `pricing`, `description`, `tags`, and `notes`.
- URL normalization (stripping tracking query params, fragments, and trailing slashes).
- Intra-batch and project-wide duplicate detection.
- Safe execution: files are never silently overwritten.

### Validating Resource Entries

To ensure all resource files adhere to frontmatter requirements, category constraints, and link validity:

```bash
npm run resource:validate
```

To also test live external URLs via HTTP HEAD requests:

```bash
npm run resource:validate -- --check-urls
```

### Creating a New Category

To introduce a new category:

1. **Register the Category Definition**:
   Add the category object to `CATEGORIES` in [`scripts/lib/categories.mjs`](scripts/lib/categories.mjs):
   ```javascript
   {
     slug: 'new-category',
     name: 'New Category Name',
     description: 'Description of resources in this category.',
     icon: 'folder'
   }
   ```
2. **Register Theme Metadata**:
   Add the identical slug and display data to `CATEGORIES` in [`docs/.vitepress/theme/data/categories.ts`](docs/.vitepress/theme/data/categories.ts).
3. **Create the Category Index Page**:
   Create `docs/resources/<new-category>/index.md`:
   ```markdown
   ---
   title: "New Category Name Resources"
   description: "Description of resources in this category."
   ---

   # New Category Name

   <CategoryPage category="new-category" />
   ```
4. **Rebuild**:
   Run `npm run docs:build` to regenerate category navigation and directories.

### Resource Format & Template

All resources follow the standard schema documented in [`templates/resource-template.md`](templates/resource-template.md):

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

- Primary use case or workflow benefit
- Secondary use case or practical implementation

## Notes

Licensing considerations, limitations, or browser compatibility notes.
```

---

## Project Structure

```text
resource-hub/
├── .github/
│   └── ISSUE_TEMPLATE/
│       └── resource-submission.yml # Community submission form
├── docs/
│   ├── .vitepress/
│   │   ├── config.ts              # Site configuration, navigation, search & sitemap
│   │   └── theme/
│   │       ├── index.ts           # Theme entry and component registration
│   │       ├── style.css          # Minimalist typography and theme design tokens
│   │       ├── data/
│   │       │   ├── categories.ts  # Category definitions and metadata helpers
│   │       │   └── resources.data.ts # Content loader for build-time indexing
│   │       └── components/
│   │           ├── HomeHero.vue          # Homepage hero and catalog statistics
│   │           ├── ResourceDirectory.vue # Master search, category & tag browser
│   │           ├── ResourceCard.vue      # Resource list item component
│   │           ├── CategoryOverview.vue  # Category overview grid with live counts
│   │           ├── CategoryPage.vue      # Individual category view
│   │           └── ResourceMeta.vue      # Header banner for resource detail pages
│   ├── resources/
│   │   ├── index.md               # Master directory page
│   │   ├── ai-tools/              # AI tools & agent resources
│   │   ├── backend/               # Backend runtimes, databases & API resources
│   │   ├── design/                # Design systems, typography & icon libraries
│   │   ├── frontend/              # Frontend frameworks & web libraries
│   │   ├── github/                # Notable GitHub repositories & search tools
│   │   ├── inspiration/           # Web showcases & creative design benchmarks
│   │   ├── learning/              # Computer science courses, books & roadmaps
│   │   ├── miscellaneous/         # Reference cards & technical cheat sheets
│   │   ├── productivity/          # Workflow utilities & job search dorks
│   │   └── utilities/             # Formatters, converters & developer tools
│   ├── index.md                   # Site homepage
│   ├── categories.md              # Categories overview page
│   ├── about.md                   # Mission, curation criteria & architecture
│   └── contribute.md              # Contribution guide and submission workflow
├── scripts/
│   ├── add-resource.mjs           # Interactive resource creation CLI
│   ├── import-resources.mjs       # Batch CSV / JSON resource importer
│   ├── validate-resources.mjs     # Integrity validation script
│   └── lib/
│       ├── categories.mjs         # Category registry
│       ├── csv-parser.mjs         # Zero-dependency RFC 4180 CSV parser
│       └── resource-utils.mjs     # URL normalization & validation utilities
├── templates/
│   └── resource-template.md       # Canonical Markdown resource template
├── CONTRIBUTING.md                # Repository contribution guidelines
├── IMPORT_REPORT.md               # Audit report of imported resource collection
├── LICENSE                        # MIT License
├── package.json                   # Project configuration and npm scripts
├── package-lock.json              # Dependency lockfile
├── vercel.json                    # Vercel deployment configuration
└── README.md
```

---

## Deployment to Vercel

The project is pre-configured for zero-friction deployment on **Vercel** via [`vercel.json`](vercel.json):

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "vitepress",
  "buildCommand": "npm run docs:build",
  "outputDirectory": "docs/.vitepress/dist",
  "cleanUrls": true
}
```

### Deployment Steps:

1. Push your repository branch to [GitHub](https://github.com/azmil666/resource-hub).
2. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New Project**.
3. Import the `azmil666/resource-hub` repository.
4. Vercel will automatically detect **VitePress**, with:
   - **Build Command**: `npm run docs:build`
   - **Output Directory**: `docs/.vitepress/dist`
5. Click **Deploy**. Any future commit pushed to `main` will trigger an automatic preview and production deployment.

---

## Contributing

We welcome suggestions and contributions from the developer community!

### Ways to Contribute:

1. **Submit via GitHub Issue**:
   Use our structured [Resource Submission Form](https://github.com/azmil666/resource-hub/issues/new?template=resource-submission.yml) to suggest tools, libraries, or learning materials without writing code.
2. **Submit via Pull Request**:
   - Fork and clone the repository: `git clone https://github.com/azmil666/resource-hub.git`
   - Add a resource using `npm run resource:add` or create a Markdown file in `docs/resources/<category>/<slug>.md`.
   - Run the validator: `npm run resource:validate`
   - Test the production build: `npm run docs:build`
   - Submit a [Pull Request](https://github.com/azmil666/resource-hub/pulls) against the `main` branch.

Please review [`CONTRIBUTING.md`](CONTRIBUTING.md) for full quality standards and metadata guidelines.

---

## License

This project is open-source software licensed under the **[MIT License](LICENSE)**.

```text
Copyright (c) 2026 Developer Resource Hub Contributors
```

---

## Useful Links

- **GitHub Repository**: [https://github.com/azmil666/resource-hub](https://github.com/azmil666/resource-hub)
- **Submit a Resource**: [Resource Submission Form](https://github.com/azmil666/resource-hub/issues/new?template=resource-submission.yml)
- **GitHub Issues**: [https://github.com/azmil666/resource-hub/issues](https://github.com/azmil666/resource-hub/issues)
- **GitHub Pull Requests**: [https://github.com/azmil666/resource-hub/pulls](https://github.com/azmil666/resource-hub/pulls)
- **Resource Template**: [`templates/resource-template.md`](templates/resource-template.md)
- **Import Audit Report**: [`IMPORT_REPORT.md`](IMPORT_REPORT.md)
