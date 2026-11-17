<script setup lang="ts">
import { ref, computed } from 'vue';
import { useData } from 'vitepress';
import { getCategory } from '../data/categories';
import { getCtaLabel } from '../utils/cta';
import { FEATURED_BADGE } from '../utils/labels';

const { frontmatter } = useData();

const copiedLink = ref(false);

const categoryMeta = computed(() => getCategory(frontmatter.value.category));

const cta = computed(() => getCtaLabel({ url: frontmatter.value.url, type: frontmatter.value.type }));

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

          <span
            v-if="frontmatter.featured"
            class="rh-badge rh-badge-amber"
            title="Featured resource"
            aria-label="Featured resource"
          >
            ★ {{ FEATURED_BADGE }}
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
            :title="`${cta.label}: ${frontmatter.title} (${cleanDomain})`"
            :aria-label="`${cta.label} for ${frontmatter.title} (opens in a new tab)`"
          >
            <!-- Lead Icon matching rule -->
            <svg v-if="cta.icon === 'play'" class="rh-cta-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
              <polygon points="6 4 20 12 6 20 6 4"/>
            </svg>
            <svg v-else-if="cta.icon === 'github'" class="rh-cta-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
              <path d="M9 18c-4.51 2-5-2-7-2"/>
            </svg>
            <svg v-else-if="cta.icon === 'gitlab'" class="rh-cta-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="m22 13.29-3.33-10a.42.42 0 0 0-.14-.18.38.38 0 0 0-.22-.11.44.44 0 0 0-.23.05.42.42 0 0 0-.17.16L15.3 9.43H8.7L6.09 3.21a.42.42 0 0 0-.17-.16.44.44 0 0 0-.23-.05.38.38 0 0 0-.22.11.42.42 0 0 0-.14.18L2 13.29a.74.74 0 0 0 .27.83L12 21l9.69-6.88a.71.71 0 0 0 .31-.83Z"/>
            </svg>
            <svg v-else-if="cta.icon === 'package'" class="rh-cta-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="m7.5 4.27 9 5.15"/>
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
              <path d="m3.3 7 8.7 5 8.7-5"/>
              <path d="M12 22V12"/>
            </svg>
            <svg v-else-if="cta.icon === 'figma'" class="rh-cta-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"/>
              <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"/>
              <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z"/>
              <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z"/>
              <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"/>
            </svg>
            <svg v-else-if="cta.icon === 'palette'" class="rh-cta-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
              <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
              <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
              <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2z"/>
            </svg>
            <svg v-else-if="cta.icon === 'book-open'" class="rh-cta-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
            <svg v-else-if="cta.icon === 'sparkles'" class="rh-cta-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
              <path d="M5 3v4"/>
              <path d="M19 17v4"/>
              <path d="M3 5h4"/>
              <path d="M17 19h4"/>
            </svg>
            <svg v-else-if="cta.icon === 'code'" class="rh-cta-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="16 18 22 12 16 6"/>
              <polyline points="8 6 2 12 8 18"/>
            </svg>
            <svg v-else-if="cta.icon === 'wrench'" class="rh-cta-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
            </svg>
            <svg v-else class="rh-cta-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>

            <span>{{ cta.label }}</span>

            <!-- Trailing Diagonal Arrow -->
            <svg class="rh-btn-arrow" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
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

.rh-cta-icon {
  flex-shrink: 0;
}

.rh-btn-arrow {
  flex-shrink: 0;
  transition: transform var(--rh-transition-fast);
}

.rh-visit-btn:hover .rh-btn-arrow {
  transform: translate(2px, -2px);
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
