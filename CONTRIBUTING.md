# Contributing to Developer Resource Hub

Thank you for your interest in contributing to **Developer Resource Hub**!

This project is an open-source, community-curated collection of high-value tools, documentation, design systems, and utilities for software engineers and designers.

---

## Code of Conduct

Please be respectful, constructive, and helpful when interacting with fellow contributors and maintainers.

---

## How to Suggest a Resource

1. **GitHub Issues**: Open a new issue using the [Resource Submission template](.github/ISSUE_TEMPLATE/resource-submission.yml).
2. **Pull Requests**:
   - Clone the repository: `git clone <repo-url>`
   - Install dependencies: `npm install`
   - Use the CLI tool: `npm run resource:add`
   - Run validation: `npm run resource:validate`
   - Test build: `npm run docs:build`
   - Open a Pull Request against `main`.

---

## Metadata Requirements

All resource markdown files must provide valid YAML frontmatter:

- `title`: String. The official project or tool name.
- `description`: String. 1-2 factual sentences summarizing capabilities.
- `category`: One of `design`, `frontend`, `backend`, `ai-tools`, `utilities`, `learning`, `github`, `inspiration`, `productivity`, `miscellaneous`.
- `type`: One of `website`, `tool`, `github-repository`, `tutorial`, `course`, `documentation`, `article`, `video`, `library`, `api`, `other`.
- `url`: Valid `http://` or `https://` URL.
- `pricing`: One of `free`, `freemium`, `paid`, `unknown`.
- `tags`: YAML list of lowercase alphanumeric or kebab-case strings.
- `status`: One of `published`, `needs-review`, `archived`.

---

## Validation Commands

```bash
# Start local dev server
npm run docs:dev

# Run automated integrity validator
npm run resource:validate

# Production build test
npm run docs:build
```
