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

// Category accent colors mapping
const categoryAccentColor = computed(() => {
  const map: Record<string, string> = {
    frontend: 'var(--cat-accent-frontend)',
    backend: 'var(--cat-accent-backend)',
    'ai-tools': 'var(--cat-accent-ai-tools)',
    utilities: 'var(--cat-accent-utilities)',
    github: 'var(--cat-accent-github)',
    design: 'var(--cat-accent-design)',
    learning: 'var(--cat-accent-learning)',
    inspiration: 'var(--cat-accent-inspiration)',
    productivity: 'var(--cat-accent-productivity)',
    miscellaneous: 'var(--cat-accent-miscellaneous)'
  };
  return map[props.category.toLowerCase()] || 'var(--rh-c-brand)';
});
</script>

<template>
  <div class="rh-cat-page-view">
    <header class="rh-cat-header-block">
      <nav class="rh-cat-breadcrumb" aria-label="Breadcrumbs">
        <a href="/resources/" class="rh-cat-back-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          <span>All Resources</span>
        </a>
      </nav>

      <div class="rh-cat-title-row">
        <span
          class="rh-cat-page-dot"
          :style="{ backgroundColor: categoryAccentColor }"
          aria-hidden="true"
        ></span>
        <h1 class="rh-cat-title">{{ meta.name }}</h1>
        <span class="rh-badge rh-tnum">
          {{ resourcesInCategory.length }} {{ resourcesInCategory.length === 1 ? 'resource' : 'resources' }}
        </span>
      </div>
      <p class="rh-cat-desc">{{ meta.description }}</p>
    </header>

    <ResourceDirectory :initial-category="props.category" />
  </div>
</template>

<style scoped>
.rh-cat-page-view {
  margin-top: var(--rh-space-2);
}

.rh-cat-header-block {
  padding-bottom: var(--rh-space-6);
  border-bottom: 1px solid var(--rh-c-border);
  margin-bottom: var(--rh-space-6);
}

.rh-cat-breadcrumb {
  margin-bottom: var(--rh-space-3);
}

.rh-cat-back-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8125rem;
  color: var(--rh-c-text-tertiary);
  text-decoration: none !important;
  transition: color var(--rh-transition-fast);
}

.rh-cat-back-link:hover {
  color: var(--rh-c-text-primary);
}

.rh-cat-title-row {
  display: flex;
  align-items: center;
  gap: var(--rh-space-3);
  margin-bottom: var(--rh-space-2);
  flex-wrap: wrap;
}

.rh-cat-page-dot {
  width: 12px;
  height: 12px;
  border-radius: var(--rh-radius-full);
  flex-shrink: 0;
}

.rh-cat-title {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: var(--rh-c-text-primary);
  letter-spacing: -0.035em;
  line-height: 1.2;
}

.rh-cat-desc {
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--rh-c-text-secondary);
}
</style>
