<script setup lang="ts">
import { computed } from 'vue';
import type { ResourceItem } from '../data/resources.data';
import { getCategory } from '../data/categories';

const props = defineProps<{
  resource: ResourceItem;
}>();

const categoryMeta = computed(() => getCategory(props.resource.category));

const pricingDotClass = computed(() => {
  switch (props.resource.pricing) {
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
  <article class="resource-card">
    <!-- Top Metadata Line -->
    <div class="card-header">
      <div class="header-badges">
        <a :href="`/resources/${resource.category}/`" class="category-badge">
          {{ categoryMeta.name }}
        </a>
        <span class="type-badge">{{ resource.type }}</span>
      </div>

      <a
        v-if="resource.url"
        :href="resource.url"
        target="_blank"
        rel="noopener noreferrer"
        class="external-btn"
        :title="`Visit ${resource.title} (${resource.url})`"
        :aria-label="`Visit official site for ${resource.title}`"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="7" y1="17" x2="17" y2="7"/>
          <polyline points="7 7 17 7 17 17"/>
        </svg>
      </a>
    </div>

    <!-- Main Title & Clamped Description -->
    <div class="card-body">
      <a :href="resource.urlPath" class="title-link">
        <h3 class="resource-title">{{ resource.title }}</h3>
      </a>
      <p class="resource-desc">
        {{ resource.description }}
      </p>
    </div>

    <!-- Card Footer: Tags & Pricing -->
    <div class="card-footer">
      <div v-if="resource.tags && resource.tags.length > 0" class="tags-group">
        <span v-for="tag in resource.tags.slice(0, 3)" :key="tag" class="tag-pill">
          #{{ tag }}
        </span>
        <span v-if="resource.tags.length > 3" class="tag-more tabular-nums">
          +{{ resource.tags.length - 3 }}
        </span>
      </div>
      <div v-else class="tags-group"></div>

      <span class="pricing-pill">
        <span class="status-dot" :class="pricingDotClass"></span>
        {{ resource.pricing }}
      </span>
    </div>
  </article>
</template>

<style scoped>
.resource-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1.15rem 1.25rem;
  background-color: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: var(--hub-card-radius, 8px);
  box-shadow: var(--hub-card-shadow);
  transition: transform var(--hub-transition), border-color var(--hub-transition), box-shadow var(--hub-transition);
  position: relative;
}

.resource-card:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-border-hover);
  box-shadow: var(--hub-card-shadow-hover);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.header-badges {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.category-badge {
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  padding: 1px 6px;
  text-decoration: none;
  transition: color var(--hub-transition), border-color var(--hub-transition);
}

.category-badge:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-border-hover);
}

.type-badge {
  font-size: 0.7rem;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-3);
  background-color: transparent;
  padding: 1px 4px;
  text-transform: lowercase;
}

.external-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  color: var(--vp-c-text-3);
  background-color: transparent;
  border: 1px solid transparent;
  transition: color var(--hub-transition), border-color var(--hub-transition), background-color var(--hub-transition);
  flex-shrink: 0;
}

.external-btn:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-border);
  background-color: var(--vp-c-bg-hover);
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex-grow: 1;
  margin-bottom: 1rem;
}

.title-link {
  text-decoration: none;
  align-self: flex-start;
}

.resource-title {
  margin: 0;
  font-size: 0.98rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  letter-spacing: -0.02em;
  line-height: 1.35;
  transition: color var(--hub-transition);
}

.title-link:hover .resource-title {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.resource-desc {
  margin: 0;
  font-size: 0.835rem;
  line-height: 1.5;
  color: var(--vp-c-text-2);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid var(--vp-c-divider);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.tags-group {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  flex-wrap: wrap;
  overflow: hidden;
}

.tag-pill {
  font-size: 0.7rem;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-3);
  background-color: var(--vp-c-bg-soft);
  padding: 1px 5px;
  border-radius: 3px;
  border: 1px solid var(--vp-c-border);
}

.tag-more {
  font-size: 0.68rem;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
}

.pricing-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.7rem;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-2);
  text-transform: lowercase;
  flex-shrink: 0;
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
</style>
