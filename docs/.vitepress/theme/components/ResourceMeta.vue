<script setup lang="ts">
import { computed } from 'vue';
import { useData } from 'vitepress';
import { getCategory } from '../data/categories';

const { frontmatter } = useData();

const categoryMeta = computed(() => getCategory(frontmatter.value.category));

const pricingClass = computed(() => {
  switch (frontmatter.value.pricing) {
    case 'free':
      return 'badge-free';
    case 'freemium':
      return 'badge-freemium';
    case 'paid':
      return 'badge-paid';
    default:
      return 'badge-unknown';
  }
});
</script>

<template>
  <div v-if="frontmatter.title && frontmatter.category && frontmatter.url" class="resource-meta-banner">
    <!-- Breadcrumb Trail -->
    <nav class="resource-breadcrumb" aria-label="Breadcrumb">
      <a href="/resources/">Resources</a>
      <span class="sep">/</span>
      <a :href="`/resources/${frontmatter.category}/`">{{ categoryMeta.name }}</a>
      <span class="sep">/</span>
      <span class="current">{{ frontmatter.title }}</span>
    </nav>

    <!-- Metadata Grid -->
    <div class="meta-strip">
      <div class="meta-col">
        <span class="meta-label">Category</span>
        <a :href="`/resources/${frontmatter.category}/`" class="meta-val link-val">
          {{ categoryMeta.name }}
        </a>
      </div>

      <div class="meta-col">
        <span class="meta-label">Type</span>
        <span class="meta-val">{{ frontmatter.type || 'website' }}</span>
      </div>

      <div class="meta-col">
        <span class="meta-label">Pricing</span>
        <span class="pricing-pill" :class="pricingClass">{{ frontmatter.pricing || 'unknown' }}</span>
      </div>

      <div v-if="frontmatter.status && frontmatter.status !== 'published'" class="meta-col">
        <span class="meta-label">Status</span>
        <span class="status-pill">{{ frontmatter.status }}</span>
      </div>
    </div>

    <!-- Actions & Tags Row -->
    <div class="action-footer">
      <a
        :href="frontmatter.url"
        target="_blank"
        rel="noopener noreferrer"
        class="official-link-btn"
      >
        <span>Visit Official Website</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 3h6v6"/>
          <path d="M10 14 21 3"/>
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        </svg>
      </a>

      <div v-if="frontmatter.tags && frontmatter.tags.length > 0" class="meta-tags-container">
        <span v-for="tag in frontmatter.tags" :key="tag" class="meta-tag-pill">
          #{{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.resource-meta-banner {
  margin: 1.25rem 0 2rem 0;
  padding: 1.15rem 1.35rem;
  background-color: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
}

.resource-breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  margin-bottom: 0.95rem;
}

.resource-breadcrumb a {
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color var(--hub-transition);
}

.resource-breadcrumb a:hover {
  color: var(--vp-c-text-1);
}

.sep {
  opacity: 0.45;
}

.current {
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.meta-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 1.75rem;
  padding-bottom: 0.95rem;
  border-bottom: 1px solid var(--vp-c-border);
}

.meta-col {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.meta-label {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--vp-c-text-3);
  font-weight: 600;
}

.meta-val {
  font-size: 0.88rem;
  color: var(--vp-c-text-1);
  font-weight: 500;
  text-transform: capitalize;
}

.link-val {
  text-decoration: none;
  transition: color var(--hub-transition);
}

.link-val:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.pricing-pill {
  display: inline-block;
  padding: 1px 7px;
  font-size: 0.75rem;
  border-radius: 3px;
  text-transform: capitalize;
  font-weight: 500;
  width: fit-content;
}

.badge-free {
  background-color: rgba(34, 197, 94, 0.06);
  color: #15803d;
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.dark .badge-free {
  background-color: rgba(74, 222, 128, 0.08);
  color: #4ade80;
  border-color: rgba(74, 222, 128, 0.22);
}

.badge-freemium {
  background-color: rgba(100, 116, 139, 0.07);
  color: #475569;
  border: 1px solid rgba(100, 116, 139, 0.2);
}

.dark .badge-freemium {
  background-color: rgba(148, 163, 184, 0.08);
  color: #94a3b8;
  border-color: rgba(148, 163, 184, 0.22);
}

.badge-paid {
  background-color: rgba(217, 119, 6, 0.06);
  color: #b45309;
  border: 1px solid rgba(217, 119, 6, 0.2);
}

.dark .badge-paid {
  background-color: rgba(251, 191, 36, 0.08);
  color: #fbbf24;
  border-color: rgba(251, 191, 36, 0.22);
}

.badge-unknown {
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-3);
  border: 1px solid var(--vp-c-border);
}

.status-pill {
  font-size: 0.75rem;
  padding: 1px 6px;
  border-radius: 3px;
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-3);
  border: 1px solid var(--vp-c-border);
  text-transform: capitalize;
}

.action-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding-top: 0.95rem;
}

.official-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.84rem;
  font-weight: 500;
  background-color: var(--vp-c-text-1);
  color: var(--vp-c-bg);
  padding: 0.4rem 0.95rem;
  border-radius: 4px;
  text-decoration: none;
  transition: opacity var(--hub-transition);
}

.official-link-btn:hover {
  opacity: 0.88;
}

.meta-tags-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.meta-tag-pill {
  font-size: 0.72rem;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-2);
  background-color: var(--vp-c-bg);
  padding: 1px 6px;
  border-radius: 3px;
  border: 1px solid var(--vp-c-border);
}
</style>
