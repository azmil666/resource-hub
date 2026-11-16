<script setup lang="ts">
import { computed } from 'vue';
import type { ResourceItem } from '../data/resources.data';
import { getCategory } from '../data/categories';

const props = defineProps<{
  resource: ResourceItem;
}>();

const categoryMeta = computed(() => getCategory(props.resource.category));

const pricingClass = computed(() => {
  switch (props.resource.pricing) {
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
  <article class="resource-card">
    <div class="card-header">
      <div class="title-wrap">
        <a :href="resource.urlPath" class="resource-title" :title="`View details for ${resource.title}`">
          {{ resource.title }}
        </a>
        <a
          v-if="resource.url"
          :href="resource.url"
          target="_blank"
          rel="noopener noreferrer"
          class="external-link-btn"
          :title="`Visit official site: ${resource.url}`"
          aria-label="Visit external website"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 3h6v6"/>
            <path d="M10 14 21 3"/>
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          </svg>
        </a>
      </div>

      <div class="badges-wrap">
        <a :href="`/resources/${resource.category}/`" class="category-badge">
          {{ categoryMeta.name }}
        </a>
        <span class="type-badge">{{ resource.type }}</span>
        <span class="pricing-badge" :class="pricingClass">{{ resource.pricing }}</span>
      </div>
    </div>

    <p class="resource-desc">
      {{ resource.description }}
    </p>

    <div v-if="resource.tags && resource.tags.length > 0" class="tags-row">
      <span v-for="tag in resource.tags.slice(0, 4)" :key="tag" class="tag-pill">
        #{{ tag }}
      </span>
      <span v-if="resource.tags.length > 4" class="tag-more">
        +{{ resource.tags.length - 4 }}
      </span>
    </div>
  </article>
</template>

<style scoped>
.resource-card {
  display: flex;
  flex-direction: column;
  padding: 1rem 1.15rem;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  transition: border-color 0.15s ease, background-color 0.15s ease;
}

.resource-card:hover {
  border-color: var(--vp-c-brand-1);
}

.card-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
}

.title-wrap {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.resource-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-decoration: none;
  line-height: 1.3;
}

.resource-title:hover {
  color: var(--vp-c-brand-1);
}

.external-link-btn {
  display: inline-flex;
  align-items: center;
  color: var(--vp-c-text-3);
  padding: 2px;
  border-radius: 3px;
  transition: color 0.15s ease;
}

.external-link-btn:hover {
  color: var(--vp-c-brand-1);
}

.badges-wrap {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.72rem;
}

.category-badge {
  text-decoration: none;
  font-size: 0.72rem;
  padding: 2px 7px;
  border-radius: 3px;
  background-color: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-border);
}

.category-badge:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.type-badge {
  padding: 2px 6px;
  border-radius: 3px;
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-3);
  border: 1px solid var(--vp-c-border);
  text-transform: capitalize;
}

.pricing-badge {
  padding: 2px 6px;
  border-radius: 3px;
  text-transform: capitalize;
  font-weight: 500;
  border: 1px solid transparent;
}

.badge-free {
  background-color: rgba(34, 197, 94, 0.08);
  color: #16a34a;
  border-color: rgba(34, 197, 94, 0.25);
}

.badge-freemium {
  background-color: rgba(59, 130, 246, 0.08);
  color: #2563eb;
  border-color: rgba(59, 130, 246, 0.25);
}

.badge-paid {
  background-color: rgba(245, 158, 11, 0.08);
  color: #d97706;
  border-color: rgba(245, 158, 11, 0.25);
}

.badge-unknown {
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-3);
  border-color: var(--vp-c-border);
}

.resource-desc {
  margin: 0.2rem 0 0.6rem 0;
  font-size: 0.86rem;
  line-height: 1.45;
  color: var(--vp-c-text-2);
}

.tags-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
  margin-top: auto;
}

.tag-pill {
  font-size: 0.7rem;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-3);
  background-color: var(--vp-c-bg-alt);
  padding: 1px 6px;
  border-radius: 3px;
  border: 1px solid var(--vp-c-border);
}

.tag-more {
  font-size: 0.68rem;
  color: var(--vp-c-text-3);
}
</style>
