# Developer Resource Hub

A minimal, professionally designed, high-performance public developer knowledge library and curated resource directory.

Built with **VitePress**, **TypeScript**, and **Markdown-first** architecture. Designed for speed, extreme simplicity, and zero maintenance overhead.

---

## Key Highlights

- **Static & Blazing Fast**: Pre-rendered static HTML with minimal client-side JavaScript. No runtime database or server needed.
- **Markdown as Source of Truth**: Every resource is an individual, self-contained Markdown file with structured frontmatter.
- **Automatic Build-Time Indexing**: Directory views, category listings, tag discovery, and counts automatically update whenever a Markdown file is added or modified.
- **Built-in Local Search**: Fast fuzzy full-text search indexing titles, descriptions, categories, tags, and page content without external third-party services.
- **Developer-Friendly Workflows**: Interactive CLI (`npm run resource:add`), batch CSV/JSON importer (`npm run resource:import`), and integrity validator (`npm run resource:validate`).
- **Clean Aesthetic**: Restrained typography, subtle borders, system fonts, and polished dark & light mode support.
- **Vercel & Git Ready**: Zero-config deployment on Vercel with structured GitHub issue submission templates.

---

## Technology Stack

- **Framework**: [VitePress](https://vitepress.dev/)
- **Language**: TypeScript & Node.js ESM
- **Data Layer**: VitePress Build-Time Content Loaders (`resources.data.ts`)
- **Search**: VitePress Built-in Local Search (Minisearch)
- **Deployment**: Vercel Static Hosting
- **Styling**: Native CSS Variables with light/dark theme tokens

---

## Directory Architecture

```text
developer-resource-hub/
│
├── docs/
│   ├── .vitepress/
│   │   ├── config.ts              # VitePress site configuration, search & sitemap
│   │   └── theme/
│   │       ├── index.ts           # Theme entry and component registration
│   │       ├── style.css          # Minimalist typography and theme design tokens
│   │       ├── data/
│   │       │   ├── categories.ts  # Category definitions and metadata helpers
│   │       │   └── resources.data.ts # Build-time content loader for markdown resources
│   │       └── components/
│   │           ├── HomeHero.vue          # Minimalist homepage hero & live stats
│   │           ├── ResourceDirectory.vue # Search, category & tag browser
│   │           ├── ResourceCard.vue      # Clean resource listing row/card
│   │           ├── CategoryOverview.vue  # Category overview grid with live counts
│   │           ├── CategoryPage.vue      # Individual category directory view
│   │           └── ResourceMeta.vue      # Editorial header for individual resource pages
│   │
│   ├── index.md                   # Homepage
│   ├── resources/
│   │   ├── index.md               # Master resource directory
│   │   ├── design/                # Design & UI category index & resources
│   │   ├── frontend/              # Frontend development resources
│   │   ├── backend/               # Backend & API resources
│   │   ├── ai-tools/              # AI tools & LLM resources
│   │   ├── utilities/             # Developer utilities
│   │   ├── learning/              # Learning & tutorial resources
│   │   ├── github/                # GitHub repositories & open-source projects
│   │   ├── inspiration/           # Design inspiration & showcase sites
│   │   ├── productivity/          # Productivity & workflow tools
│   │   └── miscellaneous/         # Cheat sheets & references
│   │
│   ├── categories.md              # Categories catalog overview
│   ├── about.md                   # Project mission, standards & architecture
│   └── contribute.md              # Community contribution guide
│
├── templates/
│   └── resource-template.md       # Standard Markdown resource template
│
├── scripts/
│   ├── add-resource.mjs           # Interactive CLI to add a resource
│   ├── import-resources.mjs       # Batch CSV/JSON importer with duplicate checks
│   ├── validate-resources.mjs     # Integrity validator & external link auditor
│   └── lib/
│       ├── categories.mjs         # Shared category definitions
│       ├── csv-parser.mjs         # Zero-dependency RFC 4180 CSV parser
│       └── resource-utils.mjs     # Slugify, URL normalization, metadata validator
│
├── .github/
│   └── ISSUE_TEMPLATE/
│       └── resource-submission.yml # GitHub issue form for community suggestions
│
├── package.json
├── package-lock.json
├── vercel.json                    # Vercel deployment configuration
├── README.md
├── CONTRIBUTING.md
├── LICENSE
└── .gitignore
```

---

## Quick Start

### 1. Installation

```bash
git clone <repository-url>
cd developer-resource-hub
npm install
```

### 2. Run Local Development Server

```bash
npm run docs:dev
```

Visit `http://localhost:5173` to explore the site with hot module reloading.

### 3. Build for Production

```bash
npm run docs:build
```

Static HTML, assets, and sitemap will be compiled into `docs/.vitepress/dist/`.

### 4. Preview Production Build

```bash
npm run docs:preview
```

---

## Managing Resources

### Add an Individual Resource Interactively

```bash
npm run resource:add
```

The interactive CLI prompts for:
- Resource Title
- Official URL
- Category (select by number or slug)
- Resource Type (`website`, `tool`, `library`, etc.)
- Pricing Model (`free`, `freemium`, `paid`, `unknown`)
- Short Description
- Tags (comma-separated)
- Optional Notes

The CLI automatically generates the slug, checks for duplicate URLs and titles, formats the Markdown file, and saves it in `docs/resources/<category>/<slug>.md`.

### Batch Import Resources from CSV / JSON

```bash
# Preview what would be created without writing files
npm run resource:import -- ./path/to/resources.csv --dry-run

# Perform actual import
npm run resource:import -- ./path/to/resources.csv
```

The import utility:
- Accepts CSV and JSON files.
- Auto-maps flexible column headers (`title`/`name`, `url`/`link`, `category`, `type`, `pricing`, `description`, `tags`, `notes`).
- Normalizes URLs and verifies that no existing resource uses the same link.
- Detects intra-batch duplicate URLs and slugs.
- Never silently overwrites existing files.

#### Sample CSV Format:

```csv
title,url,category,type,pricing,description,tags,notes
"Tailwind CSS","https://tailwindcss.com","frontend","library","free","A utility-first CSS framework packed with classes.","css,frontend,design-system","Version 4 available"
"Figma","https://figma.com","design","tool","freemium","Collaborative interface design tool and vector graphics editor.","ui,design,prototyping","Industry standard"
```

### Validate Resource Integrity

```bash
npm run resource:validate
```

Validates:
- All required frontmatter fields.
- Category validity against the approved registry.
- Supported resource types, pricing models, and status values.
- URL structure and syntax.
- Duplicate URL detection (normalized).
- Duplicate slug detection across the entire project.
- Internal link integrity.

To also audit live external URLs:

```bash
npm run resource:validate -- --check-urls
```

---

## Deployment to Vercel

The project includes a ready-to-use `vercel.json`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "vitepress",
  "buildCommand": "npm run docs:build",
  "outputDirectory": "docs/.vitepress/dist",
  "cleanUrls": true
}
```

### Deploying via Vercel CLI or Dashboard:

1. Push your repository to GitHub.
2. In Vercel, click **Add New Project** and select the repository.
3. Vercel automatically detects the VitePress framework settings.
4. Click **Deploy**.

---

## Importing an Existing Collection of Resources

To import your existing collection of 257 resources, you can use:

1. **Option A (CSV / JSON Import)**: If your resources are stored in a spreadsheet, export them as a CSV file and run:
   ```bash
   npm run resource:import -- ./my-257-resources.csv
   ```
2. **Option B (Ingestion Prompt)**: If your resources are unstructured notes, use our import prompt to generate the structured CSV or directly generate the Markdown files according to `templates/resource-template.md`.

---

## License

Released under the [MIT License](LICENSE).
