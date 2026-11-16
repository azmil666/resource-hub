# Contributing to Developer Resource Hub

Thank you for your interest in contributing to **Developer Resource Hub**!

This project is an open-source, community-curated collection of high-value tools, documentation, design systems, and utilities for software engineers, designers, and builders.

---

## Code of Conduct

All contributors and maintainers are expected to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please treat fellow contributors with respect, empathy, and constructive collaboration.

---

## How to Contribute

### 1. Suggesting a Resource via GitHub Issues
If you do not wish to write markdown or submit code, open a new issue using our [Resource Submission Form](https://github.com/azmil666/resource-hub/issues/new?template=resource-submission.yml).

### 2. Submitting a Pull Request
If you would like to add or update resources directly via Git:

1. **Fork & Clone**:
   ```bash
   git clone https://github.com/azmil666/resource-hub.git
   cd resource-hub
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Add a Resource**:
   You can either use the interactive CLI wizard:
   ```bash
   npm run resource:add
   ```
   Or manually create a new `.md` file under `docs/resources/<category>/<slug>.md`.

4. **Verify Frontmatter & Build**:
   ```bash
   # Run the automated integrity validation suite
   npm run resource:validate

   # Confirm production build compiles without SSR or routing errors
   npm run docs:build
   ```
5. **Open a Pull Request**:
   Commit your changes with a conventional commit message (e.g. `feat(resource): add tailwind-merge`) and open a Pull Request against `main`. Ensure all checks in the [Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md) pass.

---

## Frontmatter Schema Requirements

All resource markdown files must provide valid YAML frontmatter conforming to our schema:

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `title` | `string` | **Yes** | The official project or tool name. |
| `description` | `string` | **Yes** | Concise, factual 1–2 sentence summary of core capabilities. |
| `category` | `string` | **Yes** | One of: `design`, `frontend`, `backend`, `ai-tools`, `utilities`, `learning`, `github`, `inspiration`, `productivity`, `miscellaneous`. |
| `type` | `string` | **Yes** | One of: `website`, `tool`, `github-repository`, `tutorial`, `course`, `documentation`, `article`, `video`, `library`, `api`, `other`. |
| `url` | `string` | **Yes** | **Must strictly use secure `https://`** (unencrypted `http://` is forbidden). Canonical direct links only (no tracking/affiliate params). |
| `pricing` | `string` | **Yes** | One of: `free`, `freemium`, `paid`, `unknown`. |
| `tags` | `array` | **Yes** | List of lowercase alphanumeric kebab-case strings (e.g. `['frontend', 'react']`). |
| `status` | `string` | **Yes** | One of: `published`, `needs-review`, `archived`. |
| `dateAdded` | `string` | Optional | ISO format date (`YYYY-MM-DD`). |
| `featured` | `boolean` | Optional | Set to `true` for flagship tools featured on the homepage. |

### Quality Guidelines
- **No Affiliate / Tracking Links:** All URLs must be direct canonical links free from UTM codes, affiliate tags, or referral identifiers.
- **Factual, Neutral Prose:** Avoid subjective marketing hype (e.g., *"The best tool in the world"*). Focus on what the tool does and what problem it solves.
- **Duplicate Prevention:** Before creating a submission, search the directory or run `npm run resource:validate` to ensure the URL or slug does not already exist.

---

## Local Development & Validation Commands

```bash
# Start local VitePress development server
npm run docs:dev

# Run automated integrity validator
npm run resource:validate

# Run concurrent external dead-link check
npm run resource:validate -- --check-urls

# Run tag migration utility
npm run resource:migrate-tags

# Run production static site build test
npm run docs:build
```
