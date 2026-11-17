<script setup lang="ts">
import { ref, computed } from 'vue';
import { useData } from 'vitepress';
import { data as allResources } from '../data/resources.data';
import ResourceCard from './ResourceCard.vue';

const { frontmatter, page } = useData();

const copiedLink = ref(false);
const copiedMarkdown = ref(false);

const currentSlug = computed(() => {
  const rel = page.value.relativePath || '';
  const clean = rel.replace(/\.md$/, '');
  const parts = clean.split('/').filter(Boolean);
  return parts[parts.length - 1] || '';
});

const currentUrlPath = computed(() => {
  return '/' + (page.value.relativePath || '').replace(/\.md$/, '');
});

const githubEditUrl = computed(() => {
  const path = page.value.relativePath || '';
  return `https://github.com/azmil666/resource-hub/edit/main/docs/${path}`;
});

async function copyPageLink() {
  if (typeof window === 'undefined') return;
  try {
    await navigator.clipboard.writeText(window.location.href);
    copiedLink.value = true;
    setTimeout(() => {
      copiedLink.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy URL:', err);
  }
}

async function copyMarkdownSnippet() {
  if (typeof window === 'undefined') return;
  const title = frontmatter.value.title || 'Resource';
  const url = frontmatter.value.url || window.location.href;
  const snippet = `[${title}](${url})`;

  try {
    await navigator.clipboard.writeText(snippet);
    copiedMarkdown.value = true;
    setTimeout(() => {
      copiedMarkdown.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy Markdown snippet:', err);
  }
}

const relatedResources = computed(() => {
  if (!frontmatter.value.category || !frontmatter.value.title) return [];

  const category = String(frontmatter.value.category).toLowerCase();
  const currentTags = Array.isArray(frontmatter.value.tags)
    ? frontmatter.value.tags.map((t: string) => String(t).toLowerCase())
    : [];

  // Filter pool excluding current page
  const pool = allResources.filter(r => {
    return r.slug !== currentSlug.value && r.urlPath !== currentUrlPath.value;
  });

  // 1. Same category + matching tags
  const matchingBoth = pool.filter(r => {
    const isSameCat = r.category.toLowerCase() === category;
    const hasSharedTag = r.tags.some(t => currentTags.includes(t.toLowerCase()));
    return isSameCat && hasSharedTag;
  });

  if (matchingBoth.length >= 3) {
    return matchingBoth.slice(0, 3);
  }

  // 2. Same category fallback to fill up to 3
  const sameCatOnly = pool.filter(r => {
    return r.category.toLowerCase() === category && !matchingBoth.includes(r);
  });

  const combined = [...matchingBoth, ...sameCatOnly];
  return combined.slice(0, 3);
});
</script>

<template>
  <div v-if="frontmatter.category && frontmatter.title" class="rh-detail-footer">
    <!-- Utility Action Bar -->
    <div class="rh-card rh-detail-action-bar">
      <div class="rh-action-btns">
        <button
          class="rh-btn rh-btn-secondary rh-btn-sm"
          :class="{ 'is-active': copiedLink }"
          :aria-label="copiedLink ? 'Link copied to clipboard' : 'Copy link to this resource'"
          @click="copyPageLink"
        >
          <svg v-if="!copiedLink" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>{{ copiedLink ? 'Copied Link!' : 'Copy Link' }}</span>
        </button>

        <button
          class="rh-btn rh-btn-secondary rh-btn-sm"
          :class="{ 'is-active': copiedMarkdown }"
          :aria-label="copiedMarkdown ? 'Markdown snippet copied' : 'Copy markdown link snippet'"
          @click="copyMarkdownSnippet"
        >
          <svg v-if="!copiedMarkdown" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2"/>
            <path d="m7 15 3-6 3 6"/>
            <path d="M14 15h3"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>{{ copiedMarkdown ? 'Copied Markdown!' : 'Copy Markdown' }}</span>
        </button>
      </div>

      <div class="rh-edit-link-wrap">
        <a
          :href="githubEditUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="rh-btn rh-btn-ghost rh-btn-sm rh-github-edit-link"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
          </svg>
          <span>Edit this record on GitHub</span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>

    <!-- Related Resources Shelf -->
    <section v-if="relatedResources.length > 0" class="rh-related-shelf">
      <div class="rh-related-header">
        <div>
          <h2 class="rh-related-title">Related Resources</h2>
          <p class="rh-related-subtitle">Similar developer tools and alternatives in this space.</p>
        </div>
        <a
          :href="`/resources/${frontmatter.category}/`"
          class="rh-btn rh-btn-ghost rh-btn-sm"
        >
          <span>More in category</span>
          <span aria-hidden="true">→</span>
        </a>
      </div>

      <div class="rh-related-grid">
        <ResourceCard
          v-for="item in relatedResources"
          :key="item.urlPath"
          :resource="item"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.rh-detail-footer {
  margin-top: var(--rh-space-12);
  padding-top: var(--rh-space-8);
  border-top: 1px solid var(--rh-c-border);
}

.rh-detail-action-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--rh-space-3);
  padding: var(--rh-space-3) var(--rh-space-4);
  background-color: var(--rh-c-bg-subtle);
  border: 1px solid var(--rh-c-border);
  border-radius: var(--rh-radius-md);
  margin-bottom: var(--rh-space-10);
}

.rh-action-btns {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--rh-space-2);
}

.rh-github-edit-link {
  font-size: 0.8125rem;
  color: var(--rh-c-text-secondary);
}

.rh-related-shelf {
  margin-top: var(--rh-space-8);
}

.rh-related-header {
  display: flex;
  flex-direction: column;
  gap: var(--rh-space-2);
  margin-bottom: var(--rh-space-6);
}

@media (min-width: 640px) {
  .rh-related-header {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
}

.rh-related-title {
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--rh-c-text-primary);
  margin: 0;
}

.rh-related-subtitle {
  font-size: 0.875rem;
  color: var(--rh-c-text-secondary);
  margin: var(--rh-space-1) 0 0 0;
}

.rh-related-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: var(--rh-space-4);
}

@media (min-width: 640px) {
  .rh-related-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .rh-related-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
