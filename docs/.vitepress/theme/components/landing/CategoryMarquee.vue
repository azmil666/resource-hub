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
  <div class="rh-marquee-wrapper" aria-label="Quick category selector">
    <div class="rh-marquee-container">
      <!-- Track 1 -->
      <div class="rh-marquee-track">
        <a
          v-for="cat in CATEGORIES"
          :key="`track1-${cat.slug}`"
          :href="`/resources/${cat.slug}/`"
          class="rh-badge rh-marquee-chip"
        >
          <span
            class="rh-marquee-dot"
            :style="{ backgroundColor: categoryAccents[cat.slug] || 'var(--rh-c-brand)' }"
            aria-hidden="true"
          ></span>
          <span class="rh-marquee-name">{{ cat.name }}</span>
          <span class="rh-marquee-count rh-tnum">{{ categoryCounts[cat.slug] || 0 }}</span>
        </a>
      </div>

      <!-- Track 2 (Duplicate for seamless infinite loop) -->
      <div class="rh-marquee-track" aria-hidden="true">
        <a
          v-for="cat in CATEGORIES"
          :key="`track2-${cat.slug}`"
          :href="`/resources/${cat.slug}/`"
          class="rh-badge rh-marquee-chip"
          tabindex="-1"
        >
          <span
            class="rh-marquee-dot"
            :style="{ backgroundColor: categoryAccents[cat.slug] || 'var(--rh-c-brand)' }"
          ></span>
          <span class="rh-marquee-name">{{ cat.name }}</span>
          <span class="rh-marquee-count rh-tnum">{{ categoryCounts[cat.slug] || 0 }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rh-marquee-wrapper {
  width: 100%;
  max-width: 1200px;
  margin: var(--rh-space-8) auto var(--rh-space-12) auto;
  padding: 0 var(--rh-space-4);
  position: relative;
}

.rh-marquee-chip {
  padding: 6px 14px;
  font-size: 0.8125rem;
  border-radius: var(--rh-radius-full);
  background-color: var(--rh-c-bg-surface);
  border: 1px solid var(--rh-c-border);
  color: var(--rh-c-text-secondary);
  text-decoration: none !important;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  transition: all var(--rh-transition-fast);
}

.rh-marquee-chip:hover {
  background-color: var(--rh-c-bg-hover);
  color: var(--rh-c-text-primary);
  border-color: var(--rh-c-border-hover);
  transform: translateY(-1px);
}

.rh-marquee-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

.rh-marquee-name {
  font-weight: 500;
}

.rh-marquee-count {
  font-size: 0.725rem;
  color: var(--rh-c-text-tertiary);
  background-color: var(--rh-c-bg-hover);
  padding: 1px 6px;
  border-radius: var(--rh-radius-full);
}
</style>
