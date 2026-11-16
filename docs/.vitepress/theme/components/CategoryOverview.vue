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
        <span class="explore-cue">
          Explore category
          <span class="explore-arrow">→</span>
        </span>
      </div>
    </a>
  </div>
</template>

<style scoped>
.category-index-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin: 1.25rem 0 2rem 0;
}

.category-entry {
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
  background-color: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: var(--hub-card-radius, 8px);
  box-shadow: var(--hub-card-shadow);
  text-decoration: none;
  transition: transform var(--hub-transition), border-color var(--hub-transition), box-shadow var(--hub-transition);
}

.category-entry:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-border-hover);
  box-shadow: var(--hub-card-shadow-hover);
}

.entry-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.category-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  letter-spacing: -0.02em;
}

.category-count {
  font-size: 0.72rem;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  background-color: var(--vp-c-bg-soft);
  padding: 1px 6px;
  border-radius: 4px;
  border: 1px solid var(--vp-c-border);
}

.category-description {
  margin: 0 0 1rem 0;
  font-size: 0.84rem;
  line-height: 1.5;
  color: var(--vp-c-text-2);
  flex-grow: 1;
}

.entry-footer {
  margin-top: auto;
  font-size: 0.78rem;
  color: var(--vp-c-text-3);
  font-weight: 500;
  display: flex;
  align-items: center;
  transition: color var(--hub-transition);
}

.explore-arrow {
  display: inline-block;
  margin-left: 0.35rem;
  transition: transform var(--hub-transition);
}

.category-entry:hover .entry-footer {
  color: var(--vp-c-text-1);
}

.category-entry:hover .explore-arrow {
  transform: translateX(4px);
}
</style>
