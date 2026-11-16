<script setup lang="ts">
import { computed } from 'vue';
import { CATEGORIES } from '../data/categories';
import { data as allResources } from '../data/resources.data';

const categoryCounts = computed(() => {
  const map: Record<string, number> = {};
  allResources.forEach(r => {
    map[r.category] = (map[r.category] || 0) + 1;
  });
  return map;
});
</script>

<template>
  <div class="category-index-grid">
    <a
      v-for="cat in CATEGORIES"
      :key="cat.slug"
      :href="`/resources/${cat.slug}/`"
      class="category-entry"
    >
      <div class="entry-header">
        <h3 class="category-title">{{ cat.name }}</h3>
        <span class="category-count tabular-nums">
          {{ categoryCounts[cat.slug] || 0 }}
        </span>
      </div>
      <p class="category-description">{{ cat.description }}</p>
      <div class="entry-footer">
        <span class="explore-cue">Explore category →</span>
      </div>
    </a>
  </div>
</template>

<style scoped>
.category-index-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 0.75rem;
  margin: 1.25rem 0 2rem 0;
}

.category-entry {
  display: flex;
  flex-direction: column;
  padding: 1.15rem 1.25rem;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  text-decoration: none;
  transition: border-color var(--hub-transition), background-color var(--hub-transition);
}

.category-entry:hover {
  border-color: var(--vp-c-text-2);
  background-color: var(--vp-c-bg-hover);
}

.entry-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
}

.category-title {
  margin: 0;
  font-size: 0.98rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  letter-spacing: -0.015em;
}

.category-count {
  font-size: 0.74rem;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  background-color: var(--vp-c-bg-soft);
  padding: 1px 6px;
  border-radius: 3px;
  border: 1px solid var(--vp-c-border);
}

.category-description {
  margin: 0 0 0.85rem 0;
  font-size: 0.85rem;
  line-height: 1.48;
  color: var(--vp-c-text-2);
  flex-grow: 1;
}

.entry-footer {
  margin-top: auto;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  font-weight: 500;
  transition: color var(--hub-transition);
}

.category-entry:hover .explore-cue {
  color: var(--vp-c-text-1);
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>
