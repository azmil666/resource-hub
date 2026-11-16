#!/usr/bin/env node

/**
 * CLI to add a new resource to Developer Resource Hub.
 * Supports both interactive prompts and non-interactive command-line flags.
 *
 * Usage:
 *   npm run resource:add
 *   npm run resource:add -- --title "Vite" --url "https://vite.dev" --category frontend --type tool --pricing free --description "Next generation frontend tooling." --tags "vite,bundler"
 */

import readline from 'node:readline';
import { stdin as input, stdout as output } from 'node:process';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import {
  CATEGORIES,
  VALID_TYPES,
  VALID_PRICING,
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

function parseArgs(args) {
  const flags = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = args[i + 1];
      if (next && !next.startsWith('--')) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = true;
      }
    }
  }
  return flags;
}

async function createLineReader() {
  const isTTY = Boolean(input.isTTY);

  if (isTTY) {
    const rl = readline.createInterface({ input, output });
    return {
      ask: (question) => new Promise((resolve) => rl.question(question, resolve)),
      close: () => rl.close()
    };
  }

  // Piped or non-TTY stream
  const rl = readline.createInterface({ input, crlfDelay: Infinity });
  const iterator = rl[Symbol.asyncIterator]();

  return {
    ask: async (question) => {
      output.write(question);
      const next = await iterator.next();
      if (next.done) return '';
      output.write(`${next.value}\n`);
      return next.value;
    },
    close: () => rl.close()
  };
}

async function main() {
  const flags = parseArgs(process.argv.slice(2));
  const isFlagMode = Boolean(flags.title || flags.url);

  console.log('\n=============================================');
  console.log('  Developer Resource Hub - Add New Resource  ');
  console.log('=============================================\n');

  // Load existing resources for instant duplicate checking
  const { urlMap, slugSet } = await loadAllExistingResources(RESOURCES_DIR);

  let title = flags.title || '';
  let url = flags.url || '';
  let category = flags.category || '';
  let type = flags.type || '';
  let pricing = flags.pricing || '';
  let description = flags.description || '';
  let tagsInput = flags.tags || '';
  let notes = flags.notes || '';

  // Fast check in flag mode
  if (isFlagMode) {
    if (title && slugSet.has(slugify(title))) {
      console.error(`\x1b[31mError: A resource with slug "${slugify(title)}" already exists in the library.\x1b[0m\n`);
      process.exit(1);
    }
    if (url && urlMap.has(normalizeUrl(url))) {
      const existing = urlMap.get(normalizeUrl(url));
      console.error(`\x1b[31mError: Duplicate URL! Already documented at: ${existing.relative}\x1b[0m\n`);
      process.exit(1);
    }
  }

  const reader = !isFlagMode ? await createLineReader() : null;

  try {
    // 1. Title
    while (!title) {
      const ans = await reader.ask('Resource Title: ');
      title = ans.trim();
      if (!title) {
        console.log('  \x1b[31mError: Title is required.\x1b[0m');
      } else {
        const slug = slugify(title);
        if (slugSet.has(slug)) {
          console.log(`  \x1b[31mError: A resource with slug "${slug}" already exists!\x1b[0m`);
          title = '';
        }
      }
    }

    // 2. URL
    while (!url) {
      const ans = await reader.ask('Official URL: ');
      url = ans.trim();
      if (!url) {
        console.log('  \x1b[31mError: URL is required.\x1b[0m');
        continue;
      }
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        console.log('  \x1b[31mError: URL must begin with http:// or https://\x1b[0m');
        url = '';
        continue;
      }
      const norm = normalizeUrl(url);
      if (urlMap.has(norm)) {
        const existing = urlMap.get(norm);
        console.log(`  \x1b[31mError: Duplicate URL! Already documented at: ${existing.relative}\x1b[0m`);
        url = '';
      }
    }

    // 3. Category
    if (!category) {
      console.log('\nAvailable Categories:');
      CATEGORIES.forEach((cat, idx) => {
        console.log(`  [${idx + 1}] ${cat.slug.padEnd(14)} (${cat.name})`);
      });
      while (!category) {
        const ans = await reader.ask('\nSelect Category (number or slug) [miscellaneous]: ');
        const raw = ans.trim();
        if (!raw) {
          category = 'miscellaneous';
          break;
        }
        const num = parseInt(raw, 10);
        if (!isNaN(num) && num >= 1 && num <= CATEGORIES.length) {
          category = CATEGORIES[num - 1].slug;
        } else if (isValidCategory(raw)) {
          category = raw.toLowerCase();
        } else {
          console.log(`  \x1b[31mError: Invalid category. Choose 1-${CATEGORIES.length} or type a valid slug.\x1b[0m`);
        }
      }
    }

    // 4. Type
    if (!type) {
      console.log('\nAvailable Types:');
      VALID_TYPES.forEach((t, idx) => {
        console.log(`  [${idx + 1}] ${t}`);
      });
      while (!type) {
        const ans = await reader.ask('\nSelect Type (number or name) [website]: ');
        const raw = ans.trim();
        if (!raw) {
          type = 'website';
          break;
        }
        const num = parseInt(raw, 10);
        if (!isNaN(num) && num >= 1 && num <= VALID_TYPES.length) {
          type = VALID_TYPES[num - 1];
        } else if (VALID_TYPES.includes(raw.toLowerCase())) {
          type = raw.toLowerCase();
        } else {
          console.log(`  \x1b[31mError: Invalid type. Choose 1-${VALID_TYPES.length} or enter a supported type.\x1b[0m`);
        }
      }
    }

    // 5. Pricing
    if (!pricing) {
      console.log('\nPricing options:');
      VALID_PRICING.forEach((p, idx) => {
        console.log(`  [${idx + 1}] ${p}`);
      });
      while (!pricing) {
        const ans = await reader.ask('\nSelect Pricing (number or name) [free]: ');
        const raw = ans.trim();
        if (!raw) {
          pricing = 'free';
          break;
        }
        const num = parseInt(raw, 10);
        if (!isNaN(num) && num >= 1 && num <= VALID_PRICING.length) {
          pricing = VALID_PRICING[num - 1];
        } else if (VALID_PRICING.includes(raw.toLowerCase())) {
          pricing = raw.toLowerCase();
        } else {
          console.log('  \x1b[31mError: Invalid pricing model.\x1b[0m');
        }
      }
    }

    // 6. Description
    while (!description) {
      const ans = await reader.ask('\nShort Description: ');
      description = ans.trim();
      if (!description) {
        console.log('  \x1b[31mError: Description cannot be empty.\x1b[0m');
      }
    }

    // 7. Tags
    if (!tagsInput && !isFlagMode) {
      tagsInput = await reader.ask('\nTags (comma-separated, e.g. "ui, components, react"): ');
    }
    const tags = tagsInput
      ? tagsInput.split(/[,;|]/).map(t => slugify(t.trim())).filter(Boolean)
      : [category || 'general'];

    // 8. Notes
    if (!notes && !isFlagMode) {
      const ans = await reader.ask('\nPersonal Notes / Caveats (optional, press Enter to skip): ');
      notes = ans.trim();
    }

    // Prepare resource object
    const resource = {
      title,
      description,
      category: category || 'miscellaneous',
      type: type || 'website',
      url,
      pricing: pricing || 'unknown',
      tags,
      status: 'published',
      notes
    };

    // Validation pass
    const validationErrors = validateResourceMetadata(resource, {
      existingUrls: urlMap,
      existingSlugs: slugSet
    });

    if (validationErrors.length > 0) {
      console.log('\n\x1b[31mValidation failed with errors:\x1b[0m');
      validationErrors.forEach(err => console.log(`  - ${err}`));
      process.exit(1);
    }

    // Destination target
    const slug = slugify(title);
    const categoryDir = path.join(RESOURCES_DIR, resource.category);
    await fs.mkdir(categoryDir, { recursive: true });

    const targetFilePath = path.join(categoryDir, `${slug}.md`);

    // Guard against overwriting
    try {
      await fs.access(targetFilePath);
      console.log(`\n\x1b[31mError: Target file already exists at ${targetFilePath}. Aborting.\x1b[0m`);
      process.exit(1);
    } catch {
      // File does not exist, good to proceed
    }

    const markdownContent = serializeMarkdownResource(resource);
    await fs.writeFile(targetFilePath, markdownContent, 'utf8');

    const relPath = path.relative(ROOT_DIR, targetFilePath);
    console.log('\n\x1b[32m✔ Successfully created resource!\x1b[0m');
    console.log(`  File: \x1b[36m${relPath}\x1b[0m`);
    console.log(`  Doc route: \x1b[36m/resources/${resource.category}/${slug}\x1b[0m\n`);

  } finally {
    if (reader) reader.close();
  }
}

main().catch(err => {
  console.error('\n\x1b[31mFatal error:\x1b[0m', err);
  process.exit(1);
});
