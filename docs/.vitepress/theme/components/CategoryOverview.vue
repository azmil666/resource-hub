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
  <div class="category-grid">
    <a
      v-for="cat in CATEGORIES"
      :key="cat.slug"
      :href="`/resources/${cat.slug}/`"
      class="category-card"
    >
      <div class="card-top">
        <h3 class="category-name">{{ cat.name }}</h3>
        <span class="category-count">
          {{ categoryCounts[cat.slug] || 0 }} {{ (categoryCounts[cat.slug] || 0) === 1 ? 'resource' : 'resources' }}
        </span>
      </div>
      <p class="category-desc">{{ cat.description }}</p>
      <div class="card-footer">
        <span class="view-link">Explore category →</span>
      </div>
    </a>
  </div>
</template>

<style scoped>
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0.85rem;
  margin: 1.5rem 0 2.5rem 0;
}

.category-card {
  display: flex;
  flex-direction: column;
  padding: 1.15rem;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  text-decoration: none;
  transition: border-color 0.15s ease, transform 0.15s ease;
}

.category-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-1px);
}

.card-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
}

.category-name {
  margin: 0;
  font-size: 1.02rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.category-count {
  font-size: 0.76rem;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  background-color: var(--vp-c-bg-alt);
  padding: 1px 6px;
  border-radius: 3px;
  border: 1px solid var(--vp-c-border);
}

.category-desc {
  margin: 0 0 0.85rem 0;
  font-size: 0.86rem;
  line-height: 1.45;
  color: var(--vp-c-text-2);
  flex-grow: 1;
}

.card-footer {
  margin-top: auto;
  font-size: 0.82rem;
  color: var(--vp-c-brand-1);
  font-weight: 500;
}

.category-card:hover .view-link {
  text-decoration: underline;
}
</style>
