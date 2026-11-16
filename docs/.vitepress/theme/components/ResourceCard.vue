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
  <article class="resource-row">
    <div class="row-main">
      <div class="header-line">
        <div class="title-group">
          <a :href="resource.urlPath" class="resource-title" :title="`View details for ${resource.title}`">
            {{ resource.title }}
          </a>
          <a
            v-if="resource.url"
            :href="resource.url"
            target="_blank"
            rel="noopener noreferrer"
            class="external-btn"
            :title="`Visit official site: ${resource.url}`"
            :aria-label="`Visit official site for ${resource.title}`"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 3h6v6"/>
              <path d="M10 14 21 3"/>
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            </svg>
          </a>
        </div>

        <div class="meta-chips">
          <a :href="`/resources/${resource.category}/`" class="category-chip">
            {{ categoryMeta.name }}
          </a>
          <span class="type-chip">{{ resource.type }}</span>
          <span class="pricing-chip" :class="pricingClass">{{ resource.pricing }}</span>
        </div>
      </div>

      <p class="resource-desc">
        {{ resource.description }}
      </p>

      <div v-if="resource.tags && resource.tags.length > 0" class="tags-list">
        <span v-for="tag in resource.tags.slice(0, 4)" :key="tag" class="tag-pill">
          #{{ tag }}
        </span>
        <span v-if="resource.tags.length > 4" class="tag-more tabular-nums">
          +{{ resource.tags.length - 4 }}
        </span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.resource-row {
  display: flex;
  flex-direction: column;
  padding: 1.1rem 1.25rem;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  transition: border-color var(--hub-transition), background-color var(--hub-transition);
}

.resource-row:hover {
  border-color: var(--vp-c-text-2);
  background-color: var(--vp-c-bg-hover);
}

.row-main {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.header-line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.resource-title {
  font-size: 0.98rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-decoration: none;
  letter-spacing: -0.015em;
  line-height: 1.35;
}

.resource-title:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.external-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-text-3);
  padding: 3px;
  border-radius: 3px;
  transition: color var(--hub-transition), background-color var(--hub-transition);
}

.external-btn:hover {
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-bg-soft);
}

.meta-chips {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.72rem;
}

.category-chip {
  text-decoration: none;
  padding: 2px 7px;
  border-radius: 3px;
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-border);
  font-weight: 500;
  transition: border-color var(--hub-transition), color var(--hub-transition);
}

.category-chip:hover {
  border-color: var(--vp-c-text-1);
  color: var(--vp-c-text-1);
}

.type-chip {
  padding: 2px 6px;
  border-radius: 3px;
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-3);
  border: 1px solid var(--vp-c-border);
  text-transform: capitalize;
}

.pricing-chip {
  padding: 2px 6px;
  border-radius: 3px;
  text-transform: capitalize;
  font-weight: 500;
  border: 1px solid transparent;
}

/* Subtle, restrained semantic colors */
.badge-free {
  background-color: rgba(34, 197, 94, 0.06);
  color: #15803d;
  border-color: rgba(34, 197, 94, 0.2);
}

.dark .badge-free {
  background-color: rgba(74, 222, 128, 0.08);
  color: #4ade80;
  border-color: rgba(74, 222, 128, 0.22);
}

.badge-freemium {
  background-color: rgba(100, 116, 139, 0.07);
  color: #475569;
  border-color: rgba(100, 116, 139, 0.2);
}

.dark .badge-freemium {
  background-color: rgba(148, 163, 184, 0.08);
  color: #94a3b8;
  border-color: rgba(148, 163, 184, 0.22);
}

.badge-paid {
  background-color: rgba(217, 119, 6, 0.06);
  color: #b45309;
  border-color: rgba(217, 119, 6, 0.2);
}

.dark .badge-paid {
  background-color: rgba(251, 191, 36, 0.08);
  color: #fbbf24;
  border-color: rgba(251, 191, 36, 0.22);
}

.badge-unknown {
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-3);
  border-color: var(--vp-c-border);
}

.resource-desc {
  margin: 0.2rem 0 0.5rem 0;
  font-size: 0.86rem;
  line-height: 1.5;
  color: var(--vp-c-text-2);
  max-width: 75ch;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.2rem;
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

@media (max-width: 600px) {
  .header-line {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.4rem;
  }
}
</style>
