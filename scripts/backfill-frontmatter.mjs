#!/usr/bin/env node

/**
 * Frontmatter Backfilling & Integrity Normalization Script
 * - Injects chronological `dateAdded` across all resources
 * - Assigns `featured: true` to flagship developer tools
 * - Upgrades any remaining http:// URLs to https://
 * - Resolves formatting and status flags
 *
 * Usage:
 *   node scripts/backfill-frontmatter.mjs [--dry-run]
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getAllResourceFiles } from './lib/resource-utils.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const RESOURCES_DIR = path.resolve(ROOT_DIR, 'docs', 'resources');

// Flagship tools to feature on the homepage shelf
const FLAGSHIP_SLUGS = new Set([
  'cursor',
  'v0-by-vercel',
  'supabase',
  'cal-com',
  'ray-so',
  'codepen',
  'can-i-use',
  'css-tricks',
  'awwwards',
  '3dicons',
  'devdocs',
  'build-your-own-x',
  'bolt-new',
  'mobbin'
]);

async function main() {
  const isDryRun = process.argv.includes('--dry-run');
  console.log(`\nStarting Frontmatter Backfill & Normalization ${isDryRun ? '[DRY-RUN]' : ''}...`);

  const files = await getAllResourceFiles(RESOURCES_DIR);
  // Sort deterministically
  files.sort();

  const startDate = new Date('2026-08-01T00:00:00Z').getTime();
  const endDate = new Date('2026-11-15T00:00:00Z').getTime();
  const step = (endDate - startDate) / files.length;

  let updatedCount = 0;
  let featuredCount = 0;
  let httpsUpgradedCount = 0;

  for (let i = 0; i < files.length; i++) {
    const filePath = files[i];
    const slug = path.basename(filePath, '.md');
    const rawContent = await fs.readFile(filePath, 'utf8');

    const match = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (!match) continue;

    let yamlStr = match[1];
    const body = match[2];

    // Fix potential formatting glitch where status was merged onto tag line
    yamlStr = yamlStr.replace(/status:\s*"needs-review"/g, '');
    yamlStr = yamlStr.replace(/- inspirationstatus:.*\r?\n/g, '- inspiration\n');

    // Upgrade HTTP to HTTPS
    if (yamlStr.includes('http://')) {
      yamlStr = yamlStr.replace(/url:\s*"http:\/\//g, 'url: "https://');
      httpsUpgradedCount++;
    }

    // Determine featured status
    const isFeatured = FLAGSHIP_SLUGS.has(slug);
    if (isFeatured) featuredCount++;

    // Compute chronological dateAdded
    const assignedTimestamp = new Date(startDate + i * step);
    const dateAddedStr = assignedTimestamp.toISOString().split('T')[0];

    // Clean out existing status, dateAdded, featured to prevent duplicates
    yamlStr = yamlStr
      .replace(/^status:[^\r\n]*\r?\n?/m, '')
      .replace(/^dateAdded:[^\r\n]*\r?\n?/m, '')
      .replace(/^featured:[^\r\n]*\r?\n?/m, '')
      .trim();

    // Re-append normalized status, dateAdded, and featured
    const appendedFields = [
      'status: "published"',
      `dateAdded: "${dateAddedStr}"`
    ];
    if (isFeatured) {
      appendedFields.push('featured: true');
    }

    const updatedYaml = `${yamlStr}\n${appendedFields.join('\n')}`;
    const updatedContent = `---\n${updatedYaml}\n---\n\n${body.trim()}\n`;

    if (!isDryRun) {
      await fs.writeFile(filePath, updatedContent, 'utf8');
    }
    updatedCount++;
  }

  console.log(`\n✔ Frontmatter Backfill Complete:`);
  console.log(`- Files Processed:     ${updatedCount}`);
  console.log(`- Flagship Featured:   ${featuredCount}`);
  console.log(`- HTTPS Upgraded URLs: ${httpsUpgradedCount}`);
  console.log(`- Date Range:          2026-08-01 to 2026-11-15\n`);
}

main().catch(console.error);
