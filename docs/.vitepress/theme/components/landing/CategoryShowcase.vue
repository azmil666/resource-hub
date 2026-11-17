<script setup lang="ts">
import { computed } from 'vue';
import { CATEGORIES } from '../../data/categories';
import { data as allResources } from '../../data/resources.data';

const categoryCounts = computed(() => {
  const map: Record<string, number> = {};
  for (const item of allResources) {
    map[item.category] = (map[item.category] || 0) + 1;
  }
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
  <section class="rh-cat-showcase-section rh-cv-auto" aria-labelledby="cat-showcase-heading">
    <!-- Header -->
    <div class="rh-section-header-row">
      <div>
        <div class="rh-section-eyebrow">CURATED DISCIPLINES</div>
        <h2 id="cat-showcase-heading" class="rh-section-title">Explore by Category</h2>
        <p class="rh-section-subtitle">
          Structured catalogs organized by technical domain and development focus.
        </p>
      </div>
      <a href="/categories" class="rh-btn rh-btn-secondary rh-btn-sm rh-view-all-link">
        <span>View all categories</span>
        <span aria-hidden="true">→</span>
      </a>
    </div>

    <!-- 4/3/2/1 Responsive Category Grid -->
    <div class="rh-showcase-grid">
      <a
        v-for="cat in CATEGORIES"
        :key="cat.slug"
        :href="`/resources/${cat.slug}/`"
        class="rh-card rh-card-interactive rh-showcase-card"
      >
        <div class="rh-showcase-card-top">
          <span
            class="rh-showcase-dot"
            :style="{ backgroundColor: categoryAccents[cat.slug] || 'var(--rh-c-brand)' }"
            aria-hidden="true"
          ></span>
          <span class="rh-badge rh-tnum rh-showcase-count">
            {{ categoryCounts[cat.slug] || 0 }} resources
          </span>
        </div>

        <h3 class="rh-showcase-name">{{ cat.name }}</h3>
        <p class="rh-showcase-desc">{{ cat.description }}</p>

        <div class="rh-showcase-foot">
          <span class="rh-showcase-cue">
            Browse category
            <span class="rh-showcase-arrow" aria-hidden="true">→</span>
          </span>
        </div>
      </a>
    </div>
  </section>
</template>

<style scoped>
.rh-cat-showcase-section {
  width: 100%;
  max-width: 1200px;
  margin: var(--rh-space-12) auto;
  padding: 0 var(--rh-space-4);
}

@media (min-width: 768px) {
  .rh-cat-showcase-section {
    padding: 0 var(--rh-space-6);
    margin: var(--rh-space-16) auto;
  }
}

.rh-section-header-row {
  display: flex;
  flex-direction: column;
  gap: var(--rh-space-3);
  margin-bottom: var(--rh-space-8);
}

@media (min-width: 640px) {
  .rh-section-header-row {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
}

.rh-section-eyebrow {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--rh-c-text-tertiary);
  font-family: var(--rh-font-mono);
  margin-bottom: var(--rh-space-1);
}

.rh-section-title {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.035em;
  color: var(--rh-c-text-primary);
  margin: 0 0 var(--rh-space-1) 0;
}

.rh-section-subtitle {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--rh-c-text-secondary);
  margin: 0;
}

.rh-view-all-link {
  align-self: flex-start;
}

/* 4/3/2/1 Responsive Columns Grid */
.rh-showcase-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: var(--rh-space-4);
}

@media (min-width: 580px) {
  .rh-showcase-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 900px) {
  .rh-showcase-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1200px) {
  .rh-showcase-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.rh-showcase-card {
  display: flex;
  flex-direction: column;
  padding: var(--rh-space-5);
  text-decoration: none !important;
  color: inherit;
  background-color: var(--rh-c-bg-surface);
  border: 1px solid var(--rh-c-border);
  border-radius: var(--rh-radius-lg);
  box-shadow: var(--rh-shadow-xs);
  transition: transform var(--rh-transition-fast), border-color var(--rh-transition-fast), box-shadow var(--rh-transition-fast);
}

.rh-showcase-card:hover {
  transform: translateY(-2px);
  border-color: var(--rh-c-border-hover);
  box-shadow: var(--rh-shadow-md);
}

.rh-showcase-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--rh-space-3);
}

.rh-showcase-dot {
  width: 9px;
  height: 9px;
  border-radius: var(--rh-radius-full);
}

.rh-showcase-count {
  font-size: 0.7rem;
}

.rh-showcase-name {
  margin: 0 0 var(--rh-space-2) 0;
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--rh-c-text-primary);
  letter-spacing: -0.02em;
}

.rh-showcase-desc {
  margin: 0 0 var(--rh-space-4) 0;
  font-size: 0.84375rem;
  line-height: 1.5;
  color: var(--rh-c-text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 1;
}

.rh-showcase-foot {
  margin-top: auto;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--rh-c-brand);
  display: flex;
  align-items: center;
}

.rh-showcase-arrow {
  display: inline-block;
  margin-left: 4px;
  transition: transform var(--rh-transition-fast);
}

.rh-showcase-card:hover .rh-showcase-arrow {
  transform: translateX(4px);
}
</style>
