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
  <div class="category-page">
    <header class="category-header">
      <nav class="breadcrumb">
        <a href="/resources/">← Back to All Resources</a>
      </nav>
      <div class="header-main">
        <h1 class="cat-title">{{ meta.name }}</h1>
        <span class="count-badge">
          {{ resourcesInCategory.length }} {{ resourcesInCategory.length === 1 ? 'resource' : 'resources' }}
        </span>
      </div>
      <p class="cat-desc">{{ meta.description }}</p>
    </header>

    <ResourceDirectory :initial-category="props.category" />
  </div>
</template>

<style scoped>
.category-page {
  margin-top: 1rem;
}

.category-header {
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--vp-c-border);
  margin-bottom: 1.5rem;
}

.breadcrumb {
  margin-bottom: 0.75rem;
  font-size: 0.82rem;
}

.breadcrumb a {
  color: var(--vp-c-text-3);
  text-decoration: none;
}

.breadcrumb a:hover {
  color: var(--vp-c-brand-1);
}

.header-main {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin-bottom: 0.35rem;
}

.cat-title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  letter-spacing: -0.02em;
}

.count-badge {
  font-size: 0.8rem;
  font-family: var(--vp-font-family-mono);
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-2);
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid var(--vp-c-border);
}

.cat-desc {
  margin: 0;
  font-size: 0.98rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  max-width: 680px;
}
</style>
