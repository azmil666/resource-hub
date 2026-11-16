<script setup lang="ts">
import { computed } from 'vue';
import { getCategory } from '../data/categories';
import { data as allResources } from '../data/resources.data';
import ResourceDirectory from './ResourceDirectory.vue';

const props = defineProps<{
  category: string;
}>();

const meta = computed(() => getCategory(props.category));

const resourcesInCategory = computed(() => {
  return allResources.filter(r => r.category === props.category.toLowerCase());
});
</script>

<template>
  <div class="category-view">
    <header class="category-header-block">
      <nav class="breadcrumb-trail" aria-label="Breadcrumbs">
        <a href="/resources/" class="back-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          <span>All Resources</span>
        </a>
      </nav>

      <div class="title-line">
        <h1 class="cat-page-title">{{ meta.name }}</h1>
        <span class="count-tag tabular-nums">
          {{ resourcesInCategory.length }} {{ resourcesInCategory.length === 1 ? 'resource' : 'resources' }}
        </span>
      </div>
      <p class="cat-page-desc">{{ meta.description }}</p>
    </header>

    <ResourceDirectory :initial-category="props.category" />
  </div>
</template>

<style scoped>
.category-view {
  margin-top: 0.5rem;
}

.category-header-block {
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--vp-c-border);
  margin-bottom: 1.75rem;
}

.breadcrumb-trail {
  margin-bottom: 0.85rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.82rem;
  color: var(--vp-c-text-3);
  text-decoration: none;
  transition: color var(--hub-transition);
}

.back-link:hover {
  color: var(--vp-c-text-1);
}

.title-line {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.4rem;
}

.cat-page-title {
  margin: 0;
  font-size: 1.85rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  letter-spacing: -0.025em;
  line-height: 1.2;
}

.count-tag {
  font-size: 0.78rem;
  font-family: var(--vp-font-family-mono);
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid var(--vp-c-border);
}

.cat-page-desc {
  margin: 0;
  font-size: 0.96rem;
  color: var(--vp-c-text-2);
  line-height: 1.55;
  max-width: 65ch;
  text-wrap: pretty;
}
</style>
