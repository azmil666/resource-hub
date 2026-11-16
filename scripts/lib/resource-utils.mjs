import fs from 'node:fs/promises';
import path from 'node:path';
import { CATEGORIES, VALID_TYPES, VALID_PRICING, VALID_STATUSES, isValidCategory } from './categories.mjs';

/**
 * Converts a string into a clean, URL-friendly slug.
 */
export function slugify(str) {
  if (!str) return '';
  return str
    .toString()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')     // replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, '');        // remove leading/trailing hyphens
}

/**
 * Normalizes a URL for deduplication and consistent comparison.
 * - Trims whitespace
 * - Standardizes protocol & hostname to lowercase
 * - Strips common tracking query params (utm_*, ref, source, etc.)
 * - Strips trailing slashes from path
 * - Strips hash/fragment
 */
export function normalizeUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();
  try {
    const parsed = new URL(trimmed);
    const trackingParams = new Set([
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
      'ref', 'source', 'fbclid', 'gclid', 'mc_cid', 'mc_eid'
    ]);

    // Delete tracking params
    for (const key of Array.from(parsed.searchParams.keys())) {
      if (trackingParams.has(key.toLowerCase()) || key.toLowerCase().startsWith('utm_')) {
        parsed.searchParams.delete(key);
      }
    }

    let pathname = parsed.pathname.replace(/\/+$/, '');
    if (!pathname) pathname = '';

    const search = parsed.search ? parsed.search : '';
    return `${parsed.protocol}//${parsed.hostname.toLowerCase()}${parsed.port ? ':' + parsed.port : ''}${pathname}${search}`;
  } catch {
    // If not a parseable URL, fallback to trimmed string without trailing slash
    return trimmed.replace(/\/+$/, '').toLowerCase();
  }
}

/**
 * Parses simple YAML frontmatter and body from Markdown text without external deps.
 */
export function parseMarkdownFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {}, body: content.trim() };
  }

  const rawYaml = match[1];
  const body = match[2];
  const frontmatter = {};

  const lines = rawYaml.split(/\r?\n/);
  let currentArrayKey = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    // Check for list item under current array key
    if (trimmed.startsWith('- ') && currentArrayKey) {
      const val = trimmed.slice(2).trim().replace(/^["']|["']$/g, '');
      frontmatter[currentArrayKey].push(val);
      continue;
    }

    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;

    const key = line.slice(0, colonIdx).trim();
    let val = line.slice(colonIdx + 1).trim();

    // Check if this starts a list
    if (val === '') {
      currentArrayKey = key;
      frontmatter[key] = [];
      continue;
    }

    currentArrayKey = null;
    // Strip quotes
    val = val.replace(/^["']|["']$/g, '');
    if (val === 'true') val = true;
    else if (val === 'false') val = false;

    frontmatter[key] = val;
  }

  return { frontmatter, body };
}

/**
 * Serializes resource object into standard Markdown format.
 */
export function serializeMarkdownResource(resource) {
  const {
    title,
    description = '',
    category = 'miscellaneous',
    type = 'website',
    url = '',
    pricing = 'unknown',
    tags = [],
    status = 'published',
    overview = '',
    usefulFor = '',
    notes = ''
  } = resource;

  const tagList = Array.isArray(tags)
    ? tags.map(t => String(t).trim()).filter(Boolean)
    : String(tags).split(',').map(t => t.trim()).filter(Boolean);

  const formattedTags = tagList.length > 0
    ? tagList.map(t => `  - ${t}`).join('\n')
    : '  - general';

  const cleanTitle = title.replace(/"/g, '\\"');
  const cleanDesc = description.replace(/"/g, '\\"');

  const defaultOverview = overview || `${title} is a ${type} providing ${description.toLowerCase() || 'curated developer functionality'}.`;
  
  let usefulForContent = '';
  if (usefulFor) {
    if (usefulFor.includes('- ')) {
      usefulForContent = usefulFor;
    } else {
      usefulForContent = usefulFor.split('\n').filter(Boolean).map(l => `- ${l.replace(/^[-*]\s*/, '')}`).join('\n');
    }
  } else {
    usefulForContent = `- Practical ${category} workflows\n- Development and tooling optimization`;
  }

  const notesContent = notes || 'No additional notes documented yet.';

  return `---
title: "${cleanTitle}"
description: "${cleanDesc}"
category: "${category}"
type: "${type}"
url: "${url}"
pricing: "${pricing}"
tags:
${formattedTags}
status: "${status}"
---

# ${title}

## Overview

${defaultOverview}

## Useful for

${usefulForContent}

## Notes

${notesContent}
`;
}

/**
 * Validates resource metadata. Returns an array of error messages.
 */
export function validateResourceMetadata(data, options = {}) {
  const errors = [];
  const { existingUrls = new Map(), existingSlugs = new Set(), currentFilePath = '' } = options;

  // Title
  if (!data.title || typeof data.title !== 'string' || !data.title.trim()) {
    errors.push('Missing or empty "title"');
  }

  // Description
  if (!data.description || typeof data.description !== 'string' || !data.description.trim()) {
    errors.push('Missing or empty "description"');
  }

  // Category
  if (!data.category || typeof data.category !== 'string') {
    errors.push('Missing "category"');
  } else if (!isValidCategory(data.category)) {
    const validCats = CATEGORIES.map(c => c.slug).join(', ');
    errors.push(`Invalid category "${data.category}". Must be one of: ${validCats}`);
  }

  // Type
  if (!data.type || !VALID_TYPES.includes(data.type)) {
    errors.push(`Invalid or missing type "${data.type}". Must be one of: ${VALID_TYPES.join(', ')}`);
  }

  // URL
  if (!data.url || typeof data.url !== 'string') {
    errors.push('Missing "url"');
  } else {
    const trimmedUrl = data.url.trim();
    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      errors.push(`URL must start with http:// or https://: "${trimmedUrl}"`);
    } else {
      try {
        new URL(trimmedUrl);
      } catch {
        errors.push(`Malformed URL: "${trimmedUrl}"`);
      }
    }
  }

  // Pricing
  if (!data.pricing || !VALID_PRICING.includes(data.pricing)) {
    errors.push(`Invalid pricing "${data.pricing}". Must be one of: ${VALID_PRICING.join(', ')}`);
  }

  // Status
  if (!data.status || !VALID_STATUSES.includes(data.status)) {
    errors.push(`Invalid status "${data.status}". Must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  // Tags
  if (data.tags !== undefined) {
    if (!Array.isArray(data.tags)) {
      errors.push('Tags must be an array of strings');
    } else {
      for (const tag of data.tags) {
        if (typeof tag !== 'string' || !tag.trim()) {
          errors.push(`Invalid empty tag found in tags`);
        }
      }
    }
  }

  // Duplicate URL check
  if (data.url) {
    const normalized = normalizeUrl(data.url);
    if (existingUrls.has(normalized)) {
      const existing = existingUrls.get(normalized);
      if (existing.filePath !== currentFilePath) {
        errors.push(`Duplicate URL detected: "${data.url}" already used in ${existing.filePath}`);
      }
    }
  }

  // Slug check
  if (data.title) {
    const slug = slugify(data.title);
    if (existingSlugs.has(slug) && !options.isSameResource) {
      errors.push(`Duplicate resource slug "${slug}" generated from title "${data.title}"`);
    }
  }

  return errors;
}

/**
 * Recursively retrieves all markdown resource files from the resources directory,
 * skipping category index.md files and the root resources/index.md.
 */
export async function getAllResourceFiles(resourcesDir) {
  const files = [];

  async function walk(dir) {
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        // Exclude index.md files (used for category pages or the root directory)
        if (entry.name !== 'index.md') {
          files.push(fullPath);
        }
      }
    }
  }

  await walk(resourcesDir);
  return files;
}

/**
 * Loads and parses all existing resource files in the workspace.
 */
export async function loadAllExistingResources(resourcesDir) {
  const files = await getAllResourceFiles(resourcesDir);
  const resources = [];
  const urlMap = new Map();
  const slugSet = new Set();

  for (const filePath of files) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const { frontmatter, body } = parseMarkdownFrontmatter(content);
      const relative = path.relative(resourcesDir, filePath);
      const slug = path.basename(filePath, '.md');

      const item = {
        filePath,
        relative,
        slug,
        frontmatter,
        body,
        normalizedUrl: frontmatter.url ? normalizeUrl(frontmatter.url) : ''
      };

      resources.push(item);

      if (item.normalizedUrl) {
        urlMap.set(item.normalizedUrl, item);
      }
      slugSet.add(slug);
    } catch (err) {
      console.warn(`Warning: failed to read resource at ${filePath}:`, err.message);
    }
  }

  return { resources, urlMap, slugSet };
}
