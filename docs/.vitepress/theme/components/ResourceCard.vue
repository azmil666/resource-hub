<script setup lang="ts">
import { computed } from 'vue';
import type { ResourceItem } from '../data/resources.data';
import { getCategory } from '../data/categories';

const props = defineProps<{
  resource: ResourceItem;
}>();

const emit = defineEmits<{
  (e: 'select-tag', tag: string): void;
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

function handleTagClick(tag: string, event: MouseEvent) {
  emit('select-tag', tag);
}
</script>

<template>
  <article class="resource-card">
    <!-- Top Metadata Header -->
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
        :title="`Visit official site: ${resource.title} (${resource.url})`"
        :aria-label="`Visit official site for ${resource.title}`"
      >
        <span class="btn-icon-wrapper" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="7" y1="17" x2="17" y2="7"/>
            <polyline points="7 7 17 7 17 17"/>
          </svg>
        </span>
      </a>
    </div>

    <!-- Main Title & Description -->
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
        <a
          v-for="tag in resource.tags.slice(0, 3)"
          :key="tag"
          :href="`/resources/?tag=${encodeURIComponent(tag)}`"
          class="tag-pill"
          @click.prevent="handleTagClick(tag, $event)"
        >
          #{{ tag }}
        </a>
        <span v-if="resource.tags.length > 3" class="tag-more tabular-nums" :title="resource.tags.slice(3).join(', ')">
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
  padding: 1.25rem 1.35rem;
  background-color: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: var(--hub-card-radius, 10px);
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
  margin-bottom: 0.85rem;
}

.header-badges {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.category-badge {
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  padding: 2px 7px;
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
  padding: 1px 4px;
  text-transform: lowercase;
}

/* 44x44px Accessible Hit Target for External Link */
.external-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  margin: -10px -10px -10px 0;
  color: var(--vp-c-text-3);
  background: transparent;
  border-radius: 6px;
  text-decoration: none;
  transition: color var(--hub-transition);
  flex-shrink: 0;
}

.btn-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 5px;
  background-color: transparent;
  border: 1px solid transparent;
  transition: background-color var(--hub-transition), border-color var(--hub-transition), color var(--hub-transition);
}

.external-btn:hover .btn-icon-wrapper {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-border);
  background-color: var(--vp-c-bg-hover);
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  flex-grow: 1;
  margin-bottom: 1.15rem;
}

.title-link {
  text-decoration: none;
  align-self: flex-start;
}

.resource-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  letter-spacing: -0.02em;
  line-height: 1.35;
  transition: color var(--hub-transition);
}

.title-link:hover .resource-title {
  color: var(--vp-c-brand-1);
}

.resource-desc {
  margin: 0;
  font-size: 0.84rem;
  line-height: 1.55;
  color: var(--vp-c-text-2);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  margin-top: auto;
  padding-top: 0.85rem;
  border-top: 1px solid var(--vp-c-divider);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.tags-group {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-wrap: wrap;
  overflow: hidden;
}

/* Interactive Tag Link */
.tag-pill {
  font-size: 0.7rem;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-3);
  background-color: var(--vp-c-bg-soft);
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid var(--vp-c-border);
  text-decoration: none;
  transition: color var(--hub-transition), border-color var(--hub-transition), background-color var(--hub-transition);
}

.tag-pill:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-border-hover);
  background-color: var(--vp-c-bg-hover);
}

.tag-more {
  font-size: 0.68rem;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  cursor: default;
}

.pricing-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.72rem;
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
