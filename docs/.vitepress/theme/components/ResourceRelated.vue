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
  <div v-if="frontmatter.category && frontmatter.title" class="resource-detail-footer">
    <!-- Utility Action Bar -->
    <div class="action-utility-bar">
      <div class="action-buttons-group">
        <button
          class="util-btn"
          :class="{ 'is-active': copiedLink }"
          :aria-label="copiedLink ? 'Link copied to clipboard' : 'Copy link to this resource'"
          @click="copyPageLink"
        >
          <svg v-if="!copiedLink" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>{{ copiedLink ? 'Copied Link!' : 'Copy Link' }}</span>
        </button>

        <button
          class="util-btn"
          :class="{ 'is-active': copiedMarkdown }"
          :aria-label="copiedMarkdown ? 'Markdown link copied' : 'Copy markdown link snippet'"
          @click="copyMarkdownSnippet"
        >
          <svg v-if="!copiedMarkdown" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2"/>
            <path d="m7 15 3-6 3 6"/>
            <path d="M14 15h3"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>{{ copiedMarkdown ? 'Copied Markdown!' : 'Copy Markdown' }}</span>
        </button>
      </div>

      <div class="edit-link-group">
        <a
          :href="githubEditUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="suggest-edit-link"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
          </svg>
          <span>Suggest an Edit on GitHub</span>
          <span class="external-icon">↗</span>
        </a>
      </div>
    </div>

    <!-- Related Tools Shelf -->
    <section v-if="relatedResources.length > 0" class="related-tools-shelf">
      <div class="shelf-header">
        <div>
          <h3 class="shelf-title">Related Tools & Alternatives</h3>
          <p class="shelf-subtitle">Curated developer references within {{ frontmatter.category }}</p>
        </div>
        <a :href="`/resources/${frontmatter.category}/`" class="category-link">
          Explore all in {{ frontmatter.category }} →
        </a>
      </div>

      <div class="related-grid">
        <ResourceCard
          v-for="res in relatedResources"
          :key="res.urlPath"
          :resource="res"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.resource-detail-footer {
  margin-top: 3.5rem;
  padding-top: 2rem;
  border-top: 1px solid var(--vp-c-divider);
}

/* Action Utility Bar */
.action-utility-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 1.25rem;
  background-color: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: var(--hub-card-radius, 10px);
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.action-buttons-group {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-wrap: wrap;
}

.util-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.85rem;
  min-height: 38px;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  color: var(--vp-c-text-2);
  font-size: 0.78rem;
  font-weight: 500;
  cursor: pointer;
  transition: color var(--hub-transition), border-color var(--hub-transition), background-color var(--hub-transition);
}

.util-btn:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-border-hover);
  background-color: var(--vp-c-bg-hover);
}

.util-btn.is-active {
  border-color: #10b981;
  color: #10b981;
  background-color: rgba(16, 185, 129, 0.08);
}

.suggest-edit-link {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.78rem;
  color: var(--vp-c-text-3);
  text-decoration: none;
  transition: color var(--hub-transition);
}

.suggest-edit-link:hover {
  color: var(--vp-c-text-1);
}

.external-icon {
  font-size: 0.85rem;
  line-height: 1;
}

/* Related Shelf */
.related-tools-shelf {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.shelf-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.shelf-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--vp-c-text-1);
}

.shelf-subtitle {
  margin: 0.25rem 0 0 0;
  font-size: 0.84rem;
  color: var(--vp-c-text-3);
}

.category-link {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color var(--hub-transition);
}

.category-link:hover {
  color: var(--vp-c-text-1);
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

@media (max-width: 640px) {
  .action-utility-bar {
    flex-direction: column;
    align-items: flex-start;
  }
  .related-grid {
    grid-template-columns: 1fr;
  }
}
</style>
