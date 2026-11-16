<script setup lang="ts">
import { computed } from 'vue';
import { useData } from 'vitepress';
import { getCategory } from '../data/categories';

const { frontmatter } = useData();

const categoryMeta = computed(() => getCategory(frontmatter.value.category));

const pricingDotClass = computed(() => {
  switch (frontmatter.value.pricing) {
    case 'free':
      return 'dot-free';
    case 'freemium':
      return 'dot-freemium';
    case 'paid':
      return 'dot-paid';
    default:
      return 'dot-unknown';
  }
});

// Format clean domain display for URL (e.g. modelviewer.dev)
const cleanDomain = computed(() => {
  if (!frontmatter.value.url) return '';
  try {
    const parsed = new URL(frontmatter.value.url);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return frontmatter.value.url;
  }
});
</script>

<template>
  <header v-if="frontmatter.title && frontmatter.category && frontmatter.url" class="saas-header">
    <!-- Breadcrumb Trail -->
    <nav class="saas-breadcrumbs" aria-label="Breadcrumbs">
      <a href="/resources/" class="crumb-link">Resources</a>
      <span class="crumb-sep">/</span>
      <a :href="`/resources/${frontmatter.category}/`" class="crumb-link">{{ categoryMeta.name }}</a>
      <span class="crumb-sep">/</span>
      <span class="crumb-current">{{ frontmatter.title }}</span>
    </nav>

    <!-- Top Identity & CTA Row -->
    <div class="saas-hero-main">
      <div class="saas-title-block">
        <div class="saas-badge-strip">
          <a :href="`/resources/${frontmatter.category}/`" class="saas-category-badge">
            <span class="cat-dot"></span>
            {{ categoryMeta.name }}
          </a>
          <span class="saas-type-chip">{{ frontmatter.type || 'website' }}</span>
        </div>

        <h1 class="saas-title">{{ frontmatter.title }}</h1>
        <p v-if="frontmatter.description" class="saas-tagline">
          {{ frontmatter.description }}
        </p>
      </div>

      <!-- High-Impact SaaS Primary Action Button -->
      <div class="saas-cta-box">
        <a
          :href="frontmatter.url"
          target="_blank"
          rel="noopener noreferrer"
          class="saas-primary-btn"
          :title="`Open official website: ${frontmatter.url}`"
        >
          <span>Visit Official Website</span>
          <svg class="cta-arrow" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="7" y1="17" x2="17" y2="7"/>
            <polyline points="7 7 17 7 17 17"/>
          </svg>
        </a>
      </div>
    </div>

    <!-- Specs / Metadata Grid -->
    <div class="saas-specs-panel">
      <div class="specs-grid">
        <div class="spec-cell">
          <span class="spec-label">TYPE</span>
          <span class="spec-val mono">{{ frontmatter.type || 'website' }}</span>
        </div>

        <div class="spec-cell">
          <span class="spec-label">PRICING</span>
          <span class="spec-val pricing-val">
            <span class="status-dot" :class="pricingDotClass"></span>
            {{ frontmatter.pricing || 'unknown' }}
          </span>
        </div>

        <div class="spec-cell">
          <span class="spec-label">STATUS</span>
          <span class="spec-val status-val" :class="{ 'needs-review': frontmatter.status === 'needs-review' }">
            {{ frontmatter.status || 'published' }}
          </span>
        </div>

        <div class="spec-cell">
          <span class="spec-label">DOMAIN</span>
          <a :href="frontmatter.url" target="_blank" rel="noopener noreferrer" class="spec-val domain-link">
            {{ cleanDomain }} ↗
          </a>
        </div>
      </div>

      <!-- Minimalist Rounded Tag Pills -->
      <div v-if="frontmatter.tags && frontmatter.tags.length > 0" class="saas-tags-row">
        <span class="tags-label">TAGS</span>
        <div class="tags-list">
          <span v-for="tag in frontmatter.tags" :key="tag" class="minimal-tag-pill">
            #{{ tag }}
          </span>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.saas-header {
  margin: 1.5rem 0 2.5rem 0;
  padding: 2rem 2.25rem;
  background-color: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  box-shadow: 0 4px 24px -2px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
}

/* Breadcrumbs */
.saas-breadcrumbs {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.78rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.crumb-link {
  color: var(--vp-c-text-3);
  text-decoration: none;
  transition: color var(--hub-transition);
}

.crumb-link:hover {
  color: var(--vp-c-text-1);
}

.crumb-sep {
  color: var(--vp-c-text-3);
  opacity: 0.5;
}

.crumb-current {
  color: var(--vp-c-text-2);
  font-weight: 500;
}

/* Hero Main Section */
.saas-hero-main {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.saas-title-block {
  flex: 1 1 450px;
}

.saas-badge-strip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}

.saas-category-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.74rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  padding: 3px 9px;
  border-radius: 9999px;
  text-decoration: none;
  transition: border-color var(--hub-transition), background-color var(--hub-transition);
}

.saas-category-badge:hover {
  border-color: var(--vp-c-border-hover);
  background-color: var(--vp-c-bg-hover);
}

.cat-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #07FFE1;
  box-shadow: 0 0 8px rgba(7, 255, 225, 0.7);
}

.saas-type-chip {
  font-size: 0.72rem;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-3);
  text-transform: lowercase;
}

.saas-title {
  margin: 0 0 0.5rem 0;
  font-size: 2.75rem;
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.12;
  color: var(--vp-c-text-1);
}

.saas-tagline {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  max-width: 65ch;
  letter-spacing: -0.01em;
}

/* Primary SaaS CTA Button */
.saas-cta-box {
  flex-shrink: 0;
  align-self: flex-start;
  margin-top: 0.5rem;
}

.saas-primary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  padding: 0.85rem 1.65rem;
  background-color: var(--vp-c-brand-1);
  color: var(--vp-c-bg) !important;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  border-radius: 8px;
  text-decoration: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  transition: transform var(--hub-transition), box-shadow var(--hub-transition), opacity var(--hub-transition);
  white-space: nowrap;
}

.dark .saas-primary-btn {
  background-color: #EDEDED;
  color: #000000 !important;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.12);
}

.saas-primary-btn:hover {
  transform: translateY(-2px) scale(1.02);
  opacity: 0.96;
}

.dark .saas-primary-btn:hover {
  box-shadow: 0 0 28px rgba(255, 255, 255, 0.28);
}

.cta-arrow {
  transition: transform var(--hub-transition);
}

.saas-primary-btn:hover .cta-arrow {
  transform: translate(2px, -2px);
}

/* Specs Panel (Tabular Metadata) */
.saas-specs-panel {
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 1.25rem;
}

.spec-cell {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.spec-label {
  font-size: 0.68rem;
  font-family: var(--vp-font-family-mono);
  font-weight: 600;
  letter-spacing: 0.06em;
  color: #666666;
  text-transform: uppercase;
}

.spec-val {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.spec-val.mono {
  font-family: var(--vp-font-family-mono);
  text-transform: lowercase;
}

.pricing-val {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--vp-font-family-mono);
  text-transform: capitalize;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dot-free {
  background-color: #10b981;
  box-shadow: 0 0 6px rgba(16, 185, 129, 0.6);
}

.dot-freemium {
  background-color: #06b6d4;
  box-shadow: 0 0 6px rgba(6, 182, 212, 0.6);
}

.dot-paid {
  background-color: #f59e0b;
  box-shadow: 0 0 6px rgba(245, 158, 11, 0.6);
}

.dot-unknown {
  background-color: #71717a;
}

.status-val.needs-review {
  color: #f59e0b;
}

.domain-link {
  color: var(--vp-c-text-2);
  text-decoration: none;
  font-family: var(--vp-font-family-mono);
  font-size: 0.85rem;
  transition: color var(--hub-transition);
}

.domain-link:hover {
  color: var(--vp-c-text-1);
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* Minimalist Tag Pills */
.saas-tags-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  padding-top: 0.5rem;
}

.tags-label {
  font-size: 0.68rem;
  font-family: var(--vp-font-family-mono);
  font-weight: 600;
  letter-spacing: 0.06em;
  color: #666666;
  text-transform: uppercase;
  flex-shrink: 0;
}

.tags-list {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.minimal-tag-pill {
  font-size: 0.72rem;
  font-family: var(--vp-font-family-mono);
  color: #888888;
  background-color: transparent;
  border: 1px solid #333333;
  padding: 3px 10px;
  border-radius: 9999px;
  transition: color var(--hub-transition), border-color var(--hub-transition);
}

.minimal-tag-pill:hover {
  color: var(--vp-c-text-1);
  border-color: #555555;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .saas-header {
    padding: 1.5rem 1.25rem;
  }
  .saas-title {
    font-size: 2.15rem;
  }
  .saas-hero-main {
    flex-direction: column;
    gap: 1.25rem;
  }
  .saas-cta-box {
    width: 100%;
  }
  .saas-primary-btn {
    width: 100%;
  }
  .specs-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
