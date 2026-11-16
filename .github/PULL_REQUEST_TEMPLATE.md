## Description
<!-- Provide a brief summary of the changes, newly added tools, or documentation updates. -->

## Type of Change
- [ ] New resource submission (`docs/resources/<category>/<slug>.md`)
- [ ] Existing resource update / fix
- [ ] UI / Component improvement
- [ ] Documentation or script optimization
- [ ] Bug fix

## Pre-Merge Quality Checklist
Please verify the following before submitting this pull request:

- [ ] **Frontmatter Validation:** I ran `npm run resource:validate` locally and it passed with **0 errors**.
- [ ] **Build Verification:** I ran `npm run docs:build` and confirmed the site compiles cleanly without SSR errors.
- [ ] **Secure Protocol:** All external URLs strictly use `https://` (no `http://`).
- [ ] **No Duplicate Links:** The URL is not already cataloged in the directory.
- [ ] **Zero Affiliate Links:** The URL points directly to the canonical project, documentation, or tool without tracking codes, UTM parameters, or affiliate IDs.
- [ ] **Valid Category & Tags:** The `category` matches one of the 10 defined categories and tags are lowercase/kebab-case.
- [ ] **Code of Conduct:** I have read and agree to follow the project's [Code of Conduct](CODE_OF_CONDUCT.md).
