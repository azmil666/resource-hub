#!/usr/bin/env node

/**
 * Resource Validation Tool for Developer Resource Hub.
 * Optimized with concurrent batching and strict HTTPS protocol enforcement.
 *
 * Usage:
 *   npm run resource:validate [--check-urls]
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  CATEGORIES,
  VALID_TYPES,
  VALID_PRICING,
  VALID_STATUSES,
  isValidCategory
} from './lib/categories.mjs';
import {
  normalizeUrl,
  parseMarkdownFrontmatter,
  getAllResourceFiles
} from './lib/resource-utils.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const RESOURCES_DIR = path.resolve(ROOT_DIR, 'docs', 'resources');

const CONCURRENCY_LIMIT = 15;
const REQUEST_TIMEOUT_MS = 5000;

async function checkUrlBatch(urlEntries) {
  const results = [];
  const queue = [...urlEntries];

  async function worker() {
    while (queue.length > 0) {
      const item = queue.shift();
      if (!item) break;
      const [normUrl, file] = item;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      try {
        const res = await fetch(normUrl, {
          method: 'HEAD',
          signal: controller.signal,
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DeveloperResourceHub/1.0)' }
        }).catch(() => {
          return fetch(normUrl, {
            method: 'GET',
            signal: controller.signal,
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DeveloperResourceHub/1.0)' }
          });
        });
        clearTimeout(timer);

        if (!res.ok && res.status !== 403 && res.status !== 401 && res.status !== 429) {
          results.push({ file, message: `External URL returned HTTP ${res.status}: ${normUrl}` });
        }
      } catch (err) {
        clearTimeout(timer);
        results.push({
          file,
          message: `External URL unreachable (${err.name || err.message}): ${normUrl}`
        });
      }
    }
  }

  const workers = Array.from({ length: Math.min(CONCURRENCY_LIMIT, urlEntries.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

async function main() {
  const args = process.argv.slice(2);
  const checkLiveUrls = args.includes('--check-urls');

  console.log('\n=============================================');
  console.log('   Developer Resource Hub - Validation Check ');
  console.log('=============================================\n');

  const files = await getAllResourceFiles(RESOURCES_DIR);
  console.log(`Found ${files.length} resource markdown files to validate.\n`);

  if (files.length === 0) {
    console.log('\x1b[33mNo resource files found to validate in docs/resources/\x1b[0m\n');
    process.exit(0);
  }

  const errors = [];
  const warnings = [];

  const seenUrls = new Map();   // normalizedUrl -> filePath
  const seenSlugs = new Map();  // slug -> filePath

  for (const filePath of files) {
    const relativePath = path.relative(ROOT_DIR, filePath);
    const slug = path.basename(filePath, '.md');
    const expectedCategory = path.basename(path.dirname(filePath));

    let content;
    try {
      content = await fs.readFile(filePath, 'utf8');
    } catch (err) {
      errors.push({ file: relativePath, message: `Could not read file: ${err.message}` });
      continue;
    }

    const { frontmatter, body } = parseMarkdownFrontmatter(content);

    // 1. Required fields
    const required = ['title', 'description', 'category', 'type', 'url', 'pricing', 'tags', 'status'];
    for (const field of required) {
      if (frontmatter[field] === undefined || frontmatter[field] === null || frontmatter[field] === '') {
        errors.push({ file: relativePath, message: `Missing required frontmatter field: "${field}"` });
      }
    }

    // 2. Validate category
    if (frontmatter.category) {
      if (!isValidCategory(frontmatter.category)) {
        errors.push({
          file: relativePath,
          message: `Invalid category "${frontmatter.category}". Valid: ${CATEGORIES.map(c => c.slug).join(', ')}`
        });
      } else if (frontmatter.category !== expectedCategory && expectedCategory !== 'resources') {
        warnings.push({
          file: relativePath,
          message: `Category in frontmatter ("${frontmatter.category}") does not match directory name ("${expectedCategory}")`
        });
      }
    }

    // 3. Validate type
    if (frontmatter.type && !VALID_TYPES.includes(frontmatter.type)) {
      errors.push({
        file: relativePath,
        message: `Invalid type "${frontmatter.type}". Valid: ${VALID_TYPES.join(', ')}`
      });
    }

    // 4. Validate pricing
    if (frontmatter.pricing && !VALID_PRICING.includes(frontmatter.pricing)) {
      errors.push({
        file: relativePath,
        message: `Invalid pricing "${frontmatter.pricing}". Valid: ${VALID_PRICING.join(', ')}`
      });
    }

    // 5. Validate status
    if (frontmatter.status && !VALID_STATUSES.includes(frontmatter.status)) {
      errors.push({
        file: relativePath,
        message: `Invalid status "${frontmatter.status}". Valid: ${VALID_STATUSES.join(', ')}`
      });
    } else if (frontmatter.status === 'needs-review') {
      warnings.push({
        file: relativePath,
        message: `Resource is flagged with status "needs-review" (excluded from live directory).`
      });
    }

    // 6. Validate tags
    if (frontmatter.tags) {
      if (!Array.isArray(frontmatter.tags)) {
        errors.push({ file: relativePath, message: `Frontmatter "tags" must be a YAML array` });
      } else if (frontmatter.tags.length === 0) {
        warnings.push({ file: relativePath, message: `No tags provided for resource` });
      }
    }

    // 7. Validate URL format and strictly enforce HTTPS
    if (frontmatter.url) {
      const trimmed = String(frontmatter.url).trim();
      if (!trimmed.startsWith('https://')) {
        errors.push({
          file: relativePath,
          message: `Insecure URL protocol. Must use secure https://: "${trimmed}"`
        });
      } else {
        try {
          new URL(trimmed);
        } catch {
          errors.push({ file: relativePath, message: `Malformed URL: "${trimmed}"` });
        }
      }

      const normalized = normalizeUrl(trimmed);
      if (seenUrls.has(normalized)) {
        errors.push({
          file: relativePath,
          message: `Duplicate URL "${trimmed}" (normalized: "${normalized}") previously defined in ${seenUrls.get(normalized)}`
        });
      } else if (frontmatter.status === 'published') {
        seenUrls.set(normalized, relativePath);
      }
    }

    // 8. Validate slug uniqueness
    if (seenSlugs.has(slug)) {
      errors.push({
        file: relativePath,
        message: `Duplicate slug "${slug}" also used in ${seenSlugs.get(slug)}`
      });
    } else {
      seenSlugs.set(slug, relativePath);
    }

    // 9. Check internal markdown links inside body
    const linkMatches = body.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g);
    for (const match of linkMatches) {
      const target = match[2].trim();
      if (target.startsWith('/') || target.startsWith('./') || target.startsWith('../')) {
        const cleanTarget = target.split('#')[0].split('?')[0];
        if (cleanTarget && !cleanTarget.endsWith('.html') && !cleanTarget.endsWith('.md') && !cleanTarget.endsWith('/')) {
          const resolved = target.startsWith('/')
            ? path.join(ROOT_DIR, 'docs', target)
            : path.resolve(path.dirname(filePath), target);
          try {
            await fs.access(resolved);
          } catch {
            try {
              await fs.access(`${resolved}.md`);
            } catch {
              warnings.push({
                file: relativePath,
                message: `Potential broken internal link: "${target}"`
              });
            }
          }
        }
      }
    }
  }

  // Concurrent live URL health check
  if (checkLiveUrls && seenUrls.size > 0) {
    console.log(`Checking ${seenUrls.size} external URLs (Concurrency: ${CONCURRENCY_LIMIT})...`);
    const startTime = Date.now();
    const urlWarnings = await checkUrlBatch(Array.from(seenUrls.entries()));
    warnings.push(...urlWarnings);
    console.log(`URL verification completed in ${((Date.now() - startTime) / 1000).toFixed(1)}s\n`);
  }

  // Output report
  console.log('=============================================');
  console.log(`Validation Completed: ${files.length} resources checked.`);
  console.log(`Errors:   ${errors.length > 0 ? `\x1b[31m${errors.length}\x1b[0m` : `\x1b[32m0\x1b[0m`}`);
  console.log(`Warnings: ${warnings.length > 0 ? `\x1b[33m${warnings.length}\x1b[0m` : `\x1b[32m0\x1b[0m`}`);
  console.log('=============================================\n');

  if (warnings.length > 0) {
    console.log('\x1b[33mWarnings:\x1b[0m');
    warnings.forEach(w => console.log(`  [${w.file}] ${w.message}`));
    console.log();
  }

  if (errors.length > 0) {
    console.log('\x1b[31mErrors found:\x1b[0m');
    errors.forEach(e => console.log(`  [${e.file}] ${e.message}`));
    console.log();
    process.exit(1);
  }

  console.log('\x1b[32m✔ All resource files passed validation!\x1b[0m\n');
}

main().catch(err => {
  console.error('\n\x1b[31mValidation script crashed:\x1b[0m', err);
  process.exit(1);
});
