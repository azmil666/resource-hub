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

// Category accent colors mapping
const categoryAccents: Record<string, string> = {
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
</script>

<template>
  <div class="rh-cat-overview-grid">
    <a
      v-for="cat in CATEGORIES"
      :key="cat.slug"
      :href="`/resources/${cat.slug}/`"
      class="rh-card rh-card-interactive rh-cat-entry"
    >
      <div class="rh-cat-entry-top">
        <span
          class="rh-cat-entry-dot"
          :style="{ backgroundColor: categoryAccents[cat.slug] || 'var(--rh-c-brand)' }"
          aria-hidden="true"
        ></span>
        <span class="rh-badge rh-tnum">
          {{ categoryCounts[cat.slug] || 0 }} resources
        </span>
      </div>

      <h3 class="rh-cat-entry-title">{{ cat.name }}</h3>
      <p class="rh-cat-entry-desc">{{ cat.description }}</p>

      <div class="rh-cat-entry-footer">
        <span class="rh-cat-entry-cue">
          Explore category
          <span class="rh-cat-entry-arrow" aria-hidden="true">→</span>
        </span>
      </div>
    </a>
  </div>
</template>

<style scoped>
.rh-cat-overview-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: var(--rh-space-4);
  margin: var(--rh-space-6) 0 var(--rh-space-12) 0;
}

@media (min-width: 640px) {
  .rh-cat-overview-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .rh-cat-overview-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.rh-cat-entry {
  display: flex;
  flex-direction: column;
  padding: var(--rh-space-5);
  text-decoration: none !important;
  color: inherit;
}

.rh-cat-entry-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--rh-space-3);
}

.rh-cat-entry-dot {
  width: 10px;
  height: 10px;
  border-radius: var(--rh-radius-full);
}

.rh-cat-entry-title {
  margin: 0 0 var(--rh-space-2) 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--rh-c-text-primary);
  letter-spacing: -0.025em;
}

.rh-cat-entry-desc {
  margin: 0 0 var(--rh-space-4) 0;
  font-size: 0.875rem;
  line-height: 1.55;
  color: var(--rh-c-text-secondary);
  flex-grow: 1;
}

.rh-cat-entry-footer {
  margin-top: auto;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--rh-c-brand);
  display: flex;
  align-items: center;
}

.rh-cat-entry-arrow {
  display: inline-block;
  margin-left: 4px;
  transition: transform var(--rh-transition-fast);
}

.rh-cat-entry:hover .rh-cat-entry-arrow {
  transform: translateX(4px);
}
</style>
