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
</script>

<template>
  <div v-if="frontmatter.title && frontmatter.category && frontmatter.url" class="doc-meta-header">
    <!-- Breadcrumb Trail -->
    <nav class="doc-breadcrumbs" aria-label="Breadcrumbs">
      <a href="/resources/" class="crumb-link">Resources</a>
      <span class="crumb-sep">/</span>
      <a :href="`/resources/${frontmatter.category}/`" class="crumb-link">{{ categoryMeta.name }}</a>
      <span class="crumb-sep">/</span>
      <span class="crumb-current">{{ frontmatter.title }}</span>
    </nav>

    <!-- Technical Spec Strip -->
    <div class="meta-spec-grid">
      <div class="spec-cell">
        <span class="spec-label">Category</span>
        <a :href="`/resources/${frontmatter.category}/`" class="spec-value-link">
          {{ categoryMeta.name }}
        </a>
      </div>

      <div class="spec-cell">
        <span class="spec-label">Type</span>
        <span class="spec-value mono">{{ frontmatter.type || 'website' }}</span>
      </div>

      <div class="spec-cell">
        <span class="spec-label">Pricing</span>
        <span class="spec-pricing-pill">
          <span class="status-dot" :class="pricingDotClass"></span>
          {{ frontmatter.pricing || 'unknown' }}
        </span>
      </div>

      <div v-if="frontmatter.status && frontmatter.status !== 'published'" class="spec-cell">
        <span class="spec-label">Status</span>
        <span class="spec-status-pill">{{ frontmatter.status }}</span>
      </div>
    </div>

    <!-- Official Site Action & Tags Row -->
    <div class="meta-action-row">
      <a
        :href="frontmatter.url"
        target="_blank"
        rel="noopener noreferrer"
        class="official-website-btn"
      >
        <span>Visit Official Website</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="7" y1="17" x2="17" y2="7"/>
          <polyline points="7 7 17 7 17 17"/>
        </svg>
      </a>

      <div v-if="frontmatter.tags && frontmatter.tags.length > 0" class="meta-tags-list">
        <span v-for="tag in frontmatter.tags" :key="tag" class="meta-tag-item">
          #{{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.doc-meta-header {
  margin: 1.5rem 0 2rem 0;
  padding: 1.25rem 1.35rem;
  background-color: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: var(--hub-card-radius, 8px);
  box-shadow: var(--hub-card-shadow);
}

/* Breadcrumbs */
.doc-breadcrumbs {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.78rem;
  margin-bottom: 1.15rem;
  flex-wrap: wrap;
}

.crumb-link {
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color var(--hub-transition);
}

.crumb-link:hover {
  color: var(--vp-c-text-1);
}

.crumb-sep {
  color: var(--vp-c-text-3);
  opacity: 0.6;
}

.crumb-current {
  color: var(--vp-c-text-1);
  font-weight: 500;
}

/* Technical Spec Strip */
.meta-spec-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 1rem;
  padding-bottom: 1.15rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.spec-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.spec-label {
  font-size: 0.68rem;
  font-family: var(--vp-font-family-mono);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-3);
}

.spec-value {
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.spec-value.mono {
  font-family: var(--vp-font-family-mono);
  text-transform: lowercase;
}

.spec-value-link {
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color var(--hub-transition);
}

.spec-value-link:hover {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.spec-pricing-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.82rem;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-1);
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

.spec-status-pill {
  display: inline-flex;
  align-self: flex-start;
  font-size: 0.7rem;
  font-family: var(--vp-font-family-mono);
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  color: #f59e0b;
  padding: 1px 6px;
  border-radius: 4px;
}

/* Action & Tags Row */
.meta-action-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.official-website-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.5rem 1rem;
  background-color: var(--vp-c-brand-1);
  color: var(--vp-c-bg) !important;
  font-size: 0.82rem;
  font-weight: 600;
  border-radius: 6px;
  text-decoration: none;
  transition: opacity var(--hub-transition), transform var(--hub-transition);
}

.official-website-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.meta-tags-list {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.meta-tag-item {
  font-size: 0.72rem;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-2);
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  padding: 2px 7px;
  border-radius: 4px;
}
</style>
