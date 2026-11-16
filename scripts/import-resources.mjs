#!/usr/bin/env node

/**
 * Bulk Resource Import Tool for Developer Resource Hub.
 *
 * Usage:
 *   npm run resource:import -- <path-to-file.csv|json> [--dry-run]
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseCSV } from './lib/csv-parser.mjs';
import {
  CATEGORIES,
  VALID_TYPES,
  VALID_PRICING,
  VALID_STATUSES,
  isValidCategory
} from './lib/categories.mjs';
import {
  slugify,
  normalizeUrl,
  serializeMarkdownResource,
  validateResourceMetadata,
  loadAllExistingResources
} from './lib/resource-utils.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const RESOURCES_DIR = path.resolve(ROOT_DIR, 'docs', 'resources');

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const fileArgs = args.filter(a => !a.startsWith('--'));

  if (fileArgs.length === 0) {
    console.error('\x1b[31mError: No input file provided.\x1b[0m');
    console.log('Usage: npm run resource:import -- <path-to-file.csv|json> [--dry-run]');
    process.exit(1);
  }

  const inputFilePath = path.resolve(process.cwd(), fileArgs[0]);
  console.log(`\nReading import file: ${inputFilePath}`);
  if (dryRun) {
    console.log('\x1b[33m[DRY-RUN MODE ACTIVATED - No files will be written]\x1b[0m');
  }

  let fileContent;
  try {
    fileContent = await fs.readFile(inputFilePath, 'utf8');
  } catch (err) {
    console.error(`\x1b[31mFailed to read input file: ${err.message}\x1b[0m`);
    process.exit(1);
  }

  // Parse records from CSV or JSON
  let rawRecords = [];
  if (inputFilePath.endsWith('.json')) {
    try {
      const parsed = JSON.parse(fileContent);
      rawRecords = Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
      console.error(`\x1b[31mInvalid JSON file: ${e.message}\x1b[0m`);
      process.exit(1);
    }
  } else {
    rawRecords = parseCSV(fileContent);
  }

  if (rawRecords.length === 0) {
    console.log('\x1b[33mNo records found in import file.\x1b[0m');
    process.exit(0);
  }

  console.log(`Loaded ${rawRecords.length} records. Inspecting existing resources...`);
  const { urlMap, slugSet } = await loadAllExistingResources(RESOURCES_DIR);
  console.log(`Existing library contains ${urlMap.size} resources.\n`);

  const results = {
    total: rawRecords.length,
    created: [],
    duplicateUrl: [],
    duplicateSlug: [],
    invalid: [],
    skippedExistingFile: []
  };

  // Track batch-internal duplicates so the same CSV doesn't add duplicates
  const batchUrls = new Set();
  const batchSlugs = new Set();

  for (let idx = 0; idx < rawRecords.length; idx++) {
    const raw = rawRecords[idx];
    const rowNum = idx + 2; // header is row 1

    // Flexible column naming
    const title = (raw.title || raw.name || raw.resource || '').trim();
    const url = (raw.url || raw.link || raw.website || raw.href || '').trim();
    let category = (raw.category || raw.cat || 'miscellaneous').toLowerCase().trim();
    let type = (raw.type || 'website').toLowerCase().trim();
    let pricing = (raw.pricing || raw.price || 'unknown').toLowerCase().trim();
    const description = (raw.description || raw.desc || raw.summary || '').trim();
    const tagsRaw = raw.tags || raw.keywords || '';
    const notes = (raw.notes || raw.note || raw.comment || '').trim();
    const status = (raw.status || 'published').toLowerCase().trim();

    // Normalization & defaults
    if (!isValidCategory(category)) {
      category = 'miscellaneous';
    }
    if (!VALID_TYPES.includes(type)) {
      type = 'website';
    }
    if (!VALID_PRICING.includes(pricing)) {
      pricing = 'unknown';
    }
    if (!VALID_STATUSES.includes(status)) {
      status = 'published';
    }

    const tags = Array.isArray(tagsRaw)
      ? tagsRaw.map(t => slugify(String(t))).filter(Boolean)
      : String(tagsRaw).split(/[,;|]/).map(t => slugify(t.trim())).filter(Boolean);

    if (tags.length === 0 && category) {
      tags.push(category);
    }

    const resource = {
      title,
      description,
      category,
      type,
      url,
      pricing,
      tags,
      status,
      notes
    };

    // Basic validity check
    if (!title || !url) {
      results.invalid.push({
        row: rowNum,
        title,
        reason: 'Missing required title or URL'
      });
      continue;
    }

    const normUrl = normalizeUrl(url);

    // 1. Existing URL duplicate check
    if (urlMap.has(normUrl)) {
      const existing = urlMap.get(normUrl);
      results.duplicateUrl.push({
        row: rowNum,
        title,
        url,
        conflict: existing.relative
      });
      continue;
    }

    // 2. Batch-internal URL duplicate check
    if (batchUrls.has(normUrl)) {
      results.duplicateUrl.push({
        row: rowNum,
        title,
        url,
        conflict: 'Duplicate URL within current import batch'
      });
      continue;
    }

    // 3. Slug check
    const slug = slugify(title);
    if (!slug) {
      results.invalid.push({
        row: rowNum,
        title,
        reason: 'Unable to derive valid slug from title'
      });
      continue;
    }

    if (slugSet.has(slug)) {
      results.duplicateSlug.push({
        row: rowNum,
        title,
        slug,
        conflict: 'Slug already exists in library'
      });
      continue;
    }

    if (batchSlugs.has(slug)) {
      results.duplicateSlug.push({
        row: rowNum,
        title,
        slug,
        conflict: 'Duplicate slug within current import batch'
      });
      continue;
    }

    // Full validation
    const errors = validateResourceMetadata(resource, {
      existingUrls: urlMap,
      existingSlugs: slugSet
    });

    if (errors.length > 0) {
      results.invalid.push({
        row: rowNum,
        title,
        reason: errors.join('; ')
      });
      continue;
    }

    // Determine target path
    const targetDir = path.join(RESOURCES_DIR, category);
    const targetFile = path.join(targetDir, `${slug}.md`);

    // Verify file doesn't already exist on disk
    try {
      await fs.access(targetFile);
      results.skippedExistingFile.push({
        row: rowNum,
        title,
        path: targetFile
      });
      continue;
    } catch {
      // Good to proceed
    }

    // Mark as consumed in batch
    batchUrls.add(normUrl);
    batchSlugs.add(slug);

    if (!dryRun) {
      await fs.mkdir(targetDir, { recursive: true });
      const mdContent = serializeMarkdownResource(resource);
      await fs.writeFile(targetFile, mdContent, 'utf8');
    }

    results.created.push({
      title,
      category,
      slug,
      path: path.relative(ROOT_DIR, targetFile)
    });
  }

  // Print summary report
  console.log('\n=============================================');
  console.log('              IMPORT SUMMARY                 ');
  console.log('=============================================');
  console.log(`Total records processed:     ${results.total}`);
  console.log(`\x1b[32mSuccessfully imported:       ${results.created.length}\x1b[0m`);
  console.log(`\x1b[33mDuplicate URLs skipped:      ${results.duplicateUrl.length}\x1b[0m`);
  console.log(`\x1b[33mDuplicate Slugs skipped:     ${results.duplicateSlug.length}\x1b[0m`);
  console.log(`\x1b[31mInvalid records skipped:     ${results.invalid.length}\x1b[0m`);
  console.log(`\x1b[33mExisting files preserved:    ${results.skippedExistingFile.length}\x1b[0m`);
  console.log('=============================================\n');

  if (results.duplicateUrl.length > 0) {
    console.log('\x1b[33mDuplicate URLs:\x1b[0m');
    results.duplicateUrl.slice(0, 10).forEach(d => {
      console.log(`  - [Row ${d.row}] "${d.title}" (${d.url}) -> conflict with ${d.conflict}`);
    });
    if (results.duplicateUrl.length > 10) {
      console.log(`    ... and ${results.duplicateUrl.length - 10} more`);
    }
    console.log();
  }

  if (results.invalid.length > 0) {
    console.log('\x1b[31mInvalid Records:\x1b[0m');
    results.invalid.slice(0, 10).forEach(inv => {
      console.log(`  - [Row ${inv.row}] "${inv.title}": ${inv.reason}`);
    });
    if (results.invalid.length > 10) {
      console.log(`    ... and ${results.invalid.length - 10} more`);
    }
    console.log();
  }

  if (results.created.length > 0) {
    console.log(`\x1b[32mSample imported entries (${Math.min(5, results.created.length)} shown):\x1b[0m`);
    results.created.slice(0, 5).forEach(c => {
      console.log(`  - ${c.title} -> ${c.path}`);
    });
    console.log();
  }
}

main().catch(err => {
  console.error('\n\x1b[31mFatal error during import:\x1b[0m', err);
  process.exit(1);
});
