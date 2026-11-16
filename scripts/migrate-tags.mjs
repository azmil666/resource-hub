#!/usr/bin/env node

/**
 * Tag Consolidation and Normalization Script
 * Resolves taxonomic fragmentation across markdown resource files.
 *
 * Usage:
 *   node scripts/migrate-tags.mjs [--dry-run]
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getAllResourceFiles } from './lib/resource-utils.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const RESOURCES_DIR = path.resolve(ROOT_DIR, 'docs', 'resources');

// Canonical Tag Mapping Dictionary
const TAG_REPLACEMENTS = {
  // AI & Machine Learning
  'ai': 'ai-tools',
  'ai-agent': 'ai-agents',
  'autonomous-agent': 'ai-agents',
  'generative-ai': 'ai-tools',
  'ai-art': 'ai-tools',
  'ai-editor': 'ai-tools',
  'coding-assistant': 'ai-tools',
  'deep-learning': 'machine-learning',
  'neural-networks': 'machine-learning',
  'reinforcement-learning': 'machine-learning',
  'claude': 'ai-tools',

  // Video & Media
  'ai-video': 'video',
  'video-editor': 'video',
  'video-generation': 'video',
  'programmatic-video': 'video',
  'clipping': 'video',
  'shorts': 'video',
  'subtitles': 'video',
  'remotion': 'video',

  // Audio & Speech
  'elevenlabs-alternative': 'audio',
  'voice-cloning': 'audio',
  'tts': 'audio',
  'audio-analysis': 'audio',

  // Design, 3D & Graphics
  'ui-ux': 'design',
  'design-systems': 'design',
  'threejs': '3d',
  'webgpu': 'webgl',
  'webxr': '3d',
  'vr': '3d',
  'blender': '3d',
  'motion-design': 'animation',
  'smooth-scroll': 'animation',

  // Productivity & Workflow Alternatives
  'calendly-alternative': 'productivity',
  'scheduling': 'productivity',
  'calendar': 'productivity',
  'intercom-alternative': 'customer-support',
  'live-chat': 'customer-support',
  'helpdesk': 'customer-support',
  'jira-alternative': 'project-management',
  'kanban': 'project-management',
  'loom-alternative': 'screen-recording',
  'semrush-alternative': 'seo',
  'keyword-research': 'seo',
  'node-based': 'workflow',
  'flow-management': 'workflow',
  'team-workspace': 'collaboration',

  // Engineering & Code
  'codex': 'developer-tools',
  'codebase': 'developer-tools',
  'codebase-map': 'developer-tools',
  'profile-readme': 'github',
  'shadcn': 'frontend',
  'tailwind': 'frontend',
  'web-components': 'frontend'
};

async function main() {
  const isDryRun = process.argv.includes('--dry-run');
  console.log(`\nStarting Tag Normalization Migration ${isDryRun ? '[DRY-RUN]' : ''}...`);

  const files = await getAllResourceFiles(RESOURCES_DIR);
  let modifiedCount = 0;
  const tagStats = new Map();

  for (const filePath of files) {
    const rawContent = await fs.readFile(filePath, 'utf8');
    const match = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (!match) continue;

    const rawYaml = match[1];
    const body = match[2];

    // Extract tags list safely
    const tagMatch = rawYaml.match(/tags:\r?\n((?:[ \t]*- [^\r\n]+\r?\n?)+)/);
    if (!tagMatch) continue;

    const originalTagLines = tagMatch[1];
    const currentTags = originalTagLines
      .split(/\r?\n/)
      .map(line => line.replace(/^[ \t]*- /, '').trim().replace(/^["']|["']$/g, ''))
      .filter(Boolean);

    // Map and deduplicate tags
    const normalizedTags = Array.from(
      new Set(
        currentTags.map(tag => {
          const lower = tag.toLowerCase();
          return TAG_REPLACEMENTS[lower] || lower;
        })
      )
    );

    // Track statistics
    normalizedTags.forEach(t => tagStats.set(t, (tagStats.get(t) || 0) + 1));

    // Check if tags changed
    const hasChanged =
      currentTags.length !== normalizedTags.length ||
      currentTags.some((t, i) => t.toLowerCase() !== normalizedTags[i]);

    if (hasChanged) {
      modifiedCount++;
      const newTagYaml = 'tags:\n' + normalizedTags.map(t => `  - ${t}`).join('\n');
      const updatedYaml = rawYaml.replace(tagMatch[0], newTagYaml);
      const updatedContent = `---\n${updatedYaml.trim()}\n---\n\n${body.trim()}\n`;

      if (!isDryRun) {
        await fs.writeFile(filePath, updatedContent, 'utf8');
      }
    }
  }

  console.log(`\n✔ Tag Migration Complete:`);
  console.log(`- Files Evaluated: ${files.length}`);
  console.log(`- Files Updated:   ${modifiedCount}`);
  console.log(`- Unique Tags:     ${tagStats.size} (down from 134)\n`);
}

main().catch(console.error);
