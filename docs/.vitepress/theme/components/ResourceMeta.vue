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
    <!-- Breadcrumb -->
    <nav class="resource-breadcrumb">
      <a href="/resources/">Resources</a>
      <span class="sep">/</span>
      <a :href="`/resources/${frontmatter.category}/`">{{ categoryMeta.name }}</a>
      <span class="sep">/</span>
      <span class="current">{{ frontmatter.title }}</span>
    </nav>

    <!-- Metadata Grid -->
    <div class="meta-details">
      <div class="meta-cell">
        <span class="meta-label">Category</span>
        <a :href="`/resources/${frontmatter.category}/`" class="meta-val cat-link">
          {{ categoryMeta.name }}
        </a>
      </div>

      <div class="meta-cell">
        <span class="meta-label">Type</span>
        <span class="meta-val type-val">{{ frontmatter.type || 'website' }}</span>
      </div>

      <div class="meta-cell">
        <span class="meta-label">Pricing</span>
        <span class="pricing-pill" :class="pricingClass">{{ frontmatter.pricing || 'unknown' }}</span>
      </div>

      <div v-if="frontmatter.status && frontmatter.status !== 'published'" class="meta-cell">
        <span class="meta-label">Status</span>
        <span class="status-pill">{{ frontmatter.status }}</span>
      </div>
    </div>

    <!-- Direct Action Button -->
    <div v-if="frontmatter.url" class="action-row">
      <a
        :href="frontmatter.url"
        target="_blank"
        rel="noopener noreferrer"
        class="visit-btn"
      >
        <span>Visit Official Website</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 3h6v6"/>
          <path d="M10 14 21 3"/>
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        </svg>
      </a>

      <div v-if="frontmatter.tags && frontmatter.tags.length > 0" class="tags-container">
        <span class="tags-label">Tags:</span>
        <span v-for="tag in frontmatter.tags" :key="tag" class="tag-pill">
          #{{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.resource-meta-banner {
  margin: 1rem 0 1.75rem 0;
  padding: 1rem 1.25rem;
  background-color: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
}

.resource-breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  margin-bottom: 0.85rem;
}

.resource-breadcrumb a {
  color: var(--vp-c-text-2);
  text-decoration: none;
}

.resource-breadcrumb a:hover {
  color: var(--vp-c-brand-1);
}

.sep {
  opacity: 0.5;
}

.current {
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.meta-details {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid var(--vp-c-border);
}

.meta-cell {
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
}

.cat-link {
  text-decoration: none;
  color: var(--vp-c-brand-1);
}

.type-val {
  text-transform: capitalize;
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
  background-color: rgba(34, 197, 94, 0.1);
  color: #16a34a;
  border: 1px solid rgba(34, 197, 94, 0.25);
}

.badge-freemium {
  background-color: rgba(59, 130, 246, 0.1);
  color: #2563eb;
  border: 1px solid rgba(59, 130, 246, 0.25);
}

.badge-paid {
  background-color: rgba(245, 158, 11, 0.1);
  color: #d97706;
  border: 1px solid rgba(245, 158, 11, 0.25);
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
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.25);
  text-transform: capitalize;
}

.action-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding-top: 0.85rem;
}

.visit-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.84rem;
  font-weight: 500;
  background-color: var(--vp-c-brand-1);
  color: #ffffff;
  padding: 0.35rem 0.85rem;
  border-radius: 4px;
  text-decoration: none;
  transition: opacity 0.15s ease;
}

.visit-btn:hover {
  opacity: 0.9;
}

.tags-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.tags-label {
  font-size: 0.76rem;
  color: var(--vp-c-text-3);
  margin-right: 0.2rem;
}

.tag-pill {
  font-size: 0.72rem;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-2);
  background-color: var(--vp-c-bg);
  padding: 1px 6px;
  border-radius: 3px;
  border: 1px solid var(--vp-c-border);
}
</style>
