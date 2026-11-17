<script setup lang="ts">
import { ref, computed } from 'vue';
import { useData } from 'vitepress';
import { getCategory } from '../data/categories';

const { frontmatter } = useData();

const copiedLink = ref(false);

const categoryMeta = computed(() => getCategory(frontmatter.value.category));

// Category accent colors mapping
const categoryAccentColor = computed(() => {
  const map: Record<string, string> = {
    frontend: 'var(--cat-accent-frontend)',
    backend: 'var(--cat-accent-backend)',
    'ai-tools': 'var(--cat-accent-ai-tools)',
    utilities: 'var(--cat-accent-utilities)',
    github: 'var(--cat-accent-github)',
    design: 'var(--cat-accent-design)',
    learning: 'var(--cat-accent-learning)',
    inspiration: 'var(--cat-accent-inspiration)',
    productivity: 'var(--cat-accent-productivity)',
    miscellaneous: 'var(--cat-accent-miscellaneous)'
  };
  return map[frontmatter.value.category] || 'var(--rh-c-brand)';
});

// Semantic pricing badge styling class
const pricingBadgeClass = computed(() => {
  switch (frontmatter.value.pricing) {
    case 'free':
      return 'rh-badge-emerald';
    case 'freemium':
      return 'rh-badge-amber';
    case 'paid':
      return 'rh-badge-rose';
    default:
      return 'rh-badge-slate';
  }
});

// Clean domain extraction
const cleanDomain = computed(() => {
  if (!frontmatter.value.url) return '';
  try {
    const parsed = new URL(frontmatter.value.url);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return frontmatter.value.url;
  }
});

const sanitizedTags = computed(() => {
  const raw = frontmatter.value.tags;
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((t: any) => typeof t === 'string' && t.trim().length > 0 && t !== '[object Object]')
    .map((t: string) => t.trim().toLowerCase());
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
    console.error('Failed to copy link:', err);
  }
}
</script>

<template>
  <header v-if="frontmatter.title && frontmatter.category && frontmatter.url" class="rh-meta-header">
    <!-- Breadcrumb Navigation -->
    <nav class="rh-breadcrumbs" aria-label="Breadcrumb navigation">
      <a href="/resources/" class="rh-crumb-link">Resources</a>
      <span class="rh-crumb-sep" aria-hidden="true">/</span>
      <a :href="`/resources/${frontmatter.category}/`" class="rh-crumb-link">{{ categoryMeta.name }}</a>
      <span class="rh-crumb-sep" aria-hidden="true">/</span>
      <span class="rh-crumb-current" aria-current="page">{{ frontmatter.title }}</span>
    </nav>

    <!-- Split SaaS Header: Main Content Left + Specs Panel Right -->
    <div class="rh-meta-split">
      <!-- Left Column: Title, Badges, Tagline, Tags -->
      <div class="rh-meta-main">
        <!-- Badges row -->
        <div class="rh-meta-badges">
          <a :href="`/resources/${frontmatter.category}/`" class="rh-badge rh-badge-brand rh-meta-cat-badge">
            <span
              class="rh-meta-cat-dot"
              :style="{ backgroundColor: categoryAccentColor }"
              aria-hidden="true"
            ></span>
            <span>{{ categoryMeta.name }}</span>
          </a>

          <span class="rh-badge rh-badge-brand" style="text-transform: capitalize;">
            {{ frontmatter.type || 'website' }}
          </span>

          <span v-if="frontmatter.featured" class="rh-badge rh-badge-amber">
            ★ Staff Pick
          </span>
        </div>

        <!-- Resource Title -->
        <h1 class="rh-meta-title">{{ frontmatter.title }}</h1>

        <!-- Subtitle / Tagline -->
        <p v-if="frontmatter.description" class="rh-meta-tagline">
          {{ frontmatter.description }}
        </p>

        <!-- Tags List -->
        <div v-if="sanitizedTags.length > 0" class="rh-meta-tags">
          <a
            v-for="tag in sanitizedTags"
            :key="tag"
            :href="`/resources/?tag=${encodeURIComponent(tag)}`"
            class="rh-badge rh-meta-tag-pill"
          >
            #{{ tag }}
          </a>
        </div>
      </div>

      <!-- Right Column: Action CTAs & Sticky Specs Panel -->
      <div class="rh-meta-sidebar">
        <!-- Primary & Secondary Action CTAs -->
        <div class="rh-meta-actions">
          <a
            :href="frontmatter.url"
            target="_blank"
            rel="noopener noreferrer"
            class="rh-btn rh-btn-primary rh-btn-lg rh-visit-btn"
            :title="`Visit official site: ${frontmatter.title} (${cleanDomain})`"
            :aria-label="`Visit official site for ${frontmatter.title}`"
          >
            <span>Visit Website</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"/>
              <polyline points="7 7 17 7 17 17"/>
            </svg>
          </a>

          <button
            class="rh-btn rh-btn-secondary rh-btn-md rh-copy-btn"
            :class="{ 'is-copied': copiedLink }"
            @click="copyPageLink"
            :aria-label="copiedLink ? 'Link copied' : 'Copy page URL'"
          >
            <svg v-if="!copiedLink" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span>{{ copiedLink ? 'Link Copied!' : 'Copy Link' }}</span>
          </button>
        </div>

        <!-- Sticky Metadata Specs Panel -->
        <div class="rh-card rh-specs-card">
          <div class="rh-spec-row">
            <span class="rh-spec-label">TYPE</span>
            <span class="rh-spec-val" style="text-transform: capitalize;">{{ frontmatter.type || 'website' }}</span>
          </div>

          <div class="rh-spec-row">
            <span class="rh-spec-label">PRICING</span>
            <span class="rh-badge rh-spec-badge" :class="pricingBadgeClass">
              {{ frontmatter.pricing || 'unknown' }}
            </span>
          </div>

          <div class="rh-spec-row">
            <span class="rh-spec-label">STATUS</span>
            <span class="rh-spec-val rh-spec-status">{{ frontmatter.status || 'published' }}</span>
          </div>

          <div v-if="frontmatter.dateAdded" class="rh-spec-row">
            <span class="rh-spec-label">ADDED</span>
            <span class="rh-spec-val rh-tnum">{{ frontmatter.dateAdded }}</span>
          </div>

          <div class="rh-spec-row">
            <span class="rh-spec-label">DOMAIN</span>
            <a :href="frontmatter.url" target="_blank" rel="noopener noreferrer" class="rh-spec-val rh-domain-link">
              <span>{{ cleanDomain }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="7" y1="17" x2="17" y2="7"/>
                <polyline points="7 7 17 7 17 17"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.rh-meta-header {
  margin: var(--rh-space-4) 0 var(--rh-space-8) 0;
  padding-bottom: var(--rh-space-8);
  border-bottom: 1px solid var(--rh-c-border);
}

/* Breadcrumbs */
.rh-breadcrumbs {
  display: flex;
  align-items: center;
  gap: var(--rh-space-2);
  font-size: 0.8125rem;
  margin-bottom: var(--rh-space-6);
  flex-wrap: wrap;
}

.rh-crumb-link {
  color: var(--rh-c-text-tertiary);
  text-decoration: none !important;
  transition: color var(--rh-transition-fast);
}

.rh-crumb-link:hover {
  color: var(--rh-c-text-primary);
}

.rh-crumb-sep {
  color: var(--rh-c-text-tertiary);
  opacity: 0.4;
}

.rh-crumb-current {
  color: var(--rh-c-text-secondary);
  font-weight: 500;
}

/* Split Layout */
.rh-meta-split {
  display: flex;
  flex-direction: column;
  gap: var(--rh-space-8);
}

@media (min-width: 860px) {
  .rh-meta-split {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--rh-space-8);
  }
}

.rh-meta-main {
  flex: 1 1 500px;
}

.rh-meta-badges {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--rh-space-2);
  margin-bottom: var(--rh-space-3);
}

.rh-meta-cat-badge {
  text-decoration: none !important;
}

.rh-meta-cat-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.rh-meta-title {
  font-size: 2.25rem;
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.15;
  color: var(--rh-c-text-primary);
  margin: 0 0 var(--rh-space-3) 0;
}

@media (min-width: 640px) {
  .rh-meta-title {
    font-size: 2.75rem;
  }
}

.rh-meta-tagline {
  font-size: 1.0625rem;
  line-height: 1.6;
  color: var(--rh-c-text-secondary);
  margin: 0 0 var(--rh-space-5) 0;
}

.rh-meta-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.rh-meta-tag-pill {
  text-decoration: none !important;
  font-size: 0.75rem;
  padding: 2px 8px;
  transition: background-color var(--rh-transition-fast), color var(--rh-transition-fast);
}

.rh-meta-tag-pill:hover {
  background-color: var(--rh-c-bg-hover);
  color: var(--rh-c-text-primary);
}

/* Sidebar / Specs Panel */
.rh-meta-sidebar {
  flex: 0 0 320px;
  display: flex;
  flex-direction: column;
  gap: var(--rh-space-4);
}

@media (min-width: 860px) {
  .rh-meta-sidebar {
    position: sticky;
    top: 80px;
  }
}

.rh-meta-actions {
  display: flex;
  flex-direction: column;
  gap: var(--rh-space-2);
}

.rh-visit-btn {
  width: 100%;
}

.rh-copy-btn {
  width: 100%;
}

.rh-copy-btn.is-copied {
  border-color: var(--rh-color-emerald-border);
  color: var(--rh-color-emerald-text) !important;
}

/* Specs Card */
.rh-specs-card {
  padding: var(--rh-space-4);
  background-color: var(--rh-c-bg-surface);
  border: 1px solid var(--rh-c-border);
  border-radius: var(--rh-radius-md);
  display: flex;
  flex-direction: column;
  gap: var(--rh-space-3);
}

.rh-spec-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8125rem;
}

.rh-spec-label {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: var(--rh-c-text-tertiary);
}

.rh-spec-val {
  color: var(--rh-c-text-primary);
  font-weight: 500;
}

.rh-spec-badge {
  font-size: 0.7rem;
  text-transform: capitalize;
}

.rh-spec-status {
  text-transform: capitalize;
  color: var(--rh-color-emerald-text);
}

.rh-domain-link {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  color: var(--rh-c-text-secondary);
  text-decoration: none !important;
  transition: color var(--rh-transition-fast);
}

.rh-domain-link:hover {
  color: var(--rh-c-brand);
}
</style>
