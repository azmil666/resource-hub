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
    <nav class="saas-breadcrumbs" aria-label="Breadcrumb navigation">
      <a href="/resources/" class="crumb-link">Resources</a>
      <span class="crumb-sep" aria-hidden="true">/</span>
      <a :href="`/resources/${frontmatter.category}/`" class="crumb-link">{{ categoryMeta.name }}</a>
      <span class="crumb-sep" aria-hidden="true">/</span>
      <span class="crumb-current" aria-current="page">{{ frontmatter.title }}</span>
    </nav>

    <!-- Integrated SaaS App Store Hero Grid -->
    <div class="saas-split-layout">
      <!-- Left Column: Title, Category, Tagline, Tags -->
      <div class="saas-main-col">
        <div class="saas-badge-strip">
          <a :href="`/resources/${frontmatter.category}/`" class="saas-category-badge">
            <span class="cat-dot" aria-hidden="true"></span>
            {{ categoryMeta.name }}
          </a>
          <span class="saas-type-chip">{{ frontmatter.type || 'website' }}</span>
        </div>

        <h1 class="saas-title">{{ frontmatter.title }}</h1>
        <p v-if="frontmatter.description" class="saas-tagline">
          {{ frontmatter.description }}
        </p>

        <!-- Interactive Tags List -->
        <div v-if="frontmatter.tags && frontmatter.tags.length > 0" class="saas-tags-row">
          <a
            v-for="tag in frontmatter.tags"
            :key="tag"
            :href="`/resources/?tag=${encodeURIComponent(tag)}`"
            class="saas-tag-pill"
          >
            #{{ tag }}
          </a>
        </div>
      </div>

      <!-- Right Column: Specs Panel & Prominent Primary CTA -->
      <div class="saas-side-col">
        <!-- Prominent Primary Action Button -->
        <div class="saas-cta-box">
          <a
            :href="frontmatter.url"
            target="_blank"
            rel="noopener noreferrer"
            class="saas-primary-btn"
            :title="`Open official website: ${frontmatter.url}`"
            :aria-label="`Visit official website for ${frontmatter.title} (${cleanDomain})`"
          >
            <span>Visit Website</span>
            <svg class="cta-arrow" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="7" y1="17" x2="17" y2="7"/>
              <polyline points="7 7 17 7 17 17"/>
            </svg>
          </a>
        </div>

        <!-- Compact Metadata Specs Card -->
        <div class="saas-specs-card">
          <div class="spec-row">
            <span class="spec-label">TYPE</span>
            <span class="spec-val mono">{{ frontmatter.type || 'website' }}</span>
          </div>

          <div class="spec-row">
            <span class="spec-label">PRICING</span>
            <span class="spec-val pricing-val">
              <span class="status-dot" :class="pricingDotClass" aria-hidden="true"></span>
              {{ frontmatter.pricing || 'unknown' }}
            </span>
          </div>

          <div class="spec-row">
            <span class="spec-label">STATUS</span>
            <span class="spec-val status-val" :class="{ 'needs-review': frontmatter.status === 'needs-review' }">
              {{ frontmatter.status || 'published' }}
            </span>
          </div>

          <div class="spec-row">
            <span class="spec-label">DOMAIN</span>
            <a :href="frontmatter.url" target="_blank" rel="noopener noreferrer" class="spec-val domain-link">
              {{ cleanDomain }} ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.saas-header {
  margin: 1rem 0 2.5rem 0;
  padding: 1.75rem 0 2rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
  display: flex;
  flex-direction: column;
}

/* Breadcrumbs */
.saas-breadcrumbs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
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
  opacity: 0.4;
}

.crumb-current {
  color: var(--vp-c-text-2);
  font-weight: 500;
}

/* Split Hero Layout */
.saas-split-layout {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 2.5rem;
  flex-wrap: wrap;
}

.saas-main-col {
  flex: 1 1 480px;
  min-width: 280px;
}

.saas-side-col {
  flex: 0 0 300px;
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

/* Badge Strip */
.saas-badge-strip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.85rem;
  flex-wrap: wrap;
}

.saas-category-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.74rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  padding: 3px 10px;
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
  background-color: var(--vp-c-brand-1);
  box-shadow: 0 0 6px var(--vp-c-brand-1);
}

.saas-type-chip {
  font-size: 0.72rem;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-3);
  text-transform: lowercase;
}

/* Title & Description */
.saas-title {
  margin: 0 0 0.65rem 0;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.15;
  color: var(--vp-c-text-1);
}

.saas-tagline {
  margin: 0 0 1.35rem 0;
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  letter-spacing: -0.01em;
}

/* Tags Row */
.saas-tags-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.saas-tag-pill {
  font-size: 0.72rem;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-3);
  background-color: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  padding: 3px 8px;
  border-radius: 5px;
  text-decoration: none;
  transition: color var(--hub-transition), border-color var(--hub-transition), background-color var(--hub-transition);
}

.saas-tag-pill:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-border-hover);
  background-color: var(--vp-c-bg-hover);
}

/* Primary Action Button (The High-Contrast Anchor) */
.saas-cta-box {
  width: 100%;
}

.saas-primary-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  width: 100%;
  min-height: 46px;
  padding: 0.75rem 1.4rem;
  background-color: var(--vp-c-brand-1);
  color: var(--vp-c-bg) !important;
  font-size: 0.92rem;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: transform var(--hub-transition), opacity var(--hub-transition), box-shadow var(--hub-transition);
}

.saas-primary-btn:hover {
  opacity: 0.92;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
}

.cta-arrow {
  transition: transform var(--hub-transition);
}

.saas-primary-btn:hover .cta-arrow {
  transform: translate(2px, -2px);
}

/* Specs Panel */
.saas-specs-card {
  background-color: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 0.85rem 1.15rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.spec-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.spec-label {
  font-size: 0.68rem;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-3);
  letter-spacing: 0.05em;
  font-weight: 600;
}

.spec-val {
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.spec-val.mono {
  font-family: var(--vp-font-family-mono);
  font-size: 0.76rem;
  text-transform: lowercase;
}

.pricing-val {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--vp-font-family-mono);
  font-size: 0.76rem;
  text-transform: lowercase;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.dot-free {
  background-color: #10b981;
  box-shadow: 0 0 6px rgba(16, 185, 129, 0.4);
}

.dot-freemium {
  background-color: #06b6d4;
  box-shadow: 0 0 6px rgba(6, 182, 212, 0.4);
}

.dot-paid {
  background-color: #f59e0b;
  box-shadow: 0 0 6px rgba(245, 158, 11, 0.4);
}

.dot-unknown {
  background-color: #71717a;
}

.status-val {
  font-family: var(--vp-font-family-mono);
  font-size: 0.76rem;
  color: #10b981;
}

.status-val.needs-review {
  color: #f59e0b;
}

.domain-link {
  font-family: var(--vp-font-family-mono);
  font-size: 0.78rem;
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color var(--hub-transition);
}

.domain-link:hover {
  color: var(--vp-c-text-1);
  text-decoration: underline;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .saas-split-layout {
    flex-direction: column;
    gap: 1.5rem;
  }
  .saas-side-col {
    width: 100%;
    flex: 1 1 100%;
  }
  .saas-title {
    font-size: 2rem;
  }
}
</style>
