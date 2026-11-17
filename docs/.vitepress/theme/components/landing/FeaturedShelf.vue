<script setup lang="ts">
import { computed } from 'vue';
import { data as allResources } from '../../data/resources.data';
import ResourceCard from '../ResourceCard.vue';

const featuredResources = computed(() => {
  return allResources.filter(r => r.featured).slice(0, 6);
});
</script>

<template>
  <section
    v-if="featuredResources.length > 0"
    class="rh-featured-section rh-cv-auto"
    aria-labelledby="featured-heading"
  >
    <div class="rh-section-header-row">
      <div>
        <div class="rh-section-eyebrow">EDITORIAL SPOTLIGHT</div>
        <h2 id="featured-heading" class="rh-section-title">Staff Picks & Standards</h2>
        <p class="rh-section-subtitle">
          Foundational benchmarks and industry-standard utilities selected for exceptional craft.
        </p>
      </div>
      <a href="/resources/?featured=true" class="rh-btn rh-btn-secondary rh-btn-sm rh-view-featured-link">
        <span>View all spotlight tools</span>
        <span aria-hidden="true">→</span>
      </a>
    </div>

    <!-- Scroll-snap carousel on mobile, 3-col grid on desktop -->
    <div class="rh-featured-scroll-container">
      <div class="rh-featured-cards-track">
        <div
          v-for="res in featuredResources"
          :key="res.urlPath"
          class="rh-featured-card-wrapper"
        >
          <ResourceCard :resource="res" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.rh-featured-section {
  width: 100%;
  max-width: 1200px;
  margin: var(--rh-space-12) auto;
  padding: 0 var(--rh-space-4);
}

@media (min-width: 768px) {
  .rh-featured-section {
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

.rh-view-featured-link {
  align-self: flex-start;
}

/* Horizontal scroll-snap on mobile (<768px), 3-col grid on desktop */
.rh-featured-scroll-container {
  width: 100%;
  overflow-x: auto;
  padding-bottom: var(--rh-space-4);
  -webkit-overflow-scrolling: touch;
}

.rh-featured-cards-track {
  display: flex;
  gap: var(--rh-space-4);
  scroll-snap-type: x mandatory;
}

.rh-featured-card-wrapper {
  flex: 0 0 85vw;
  max-width: 380px;
  scroll-snap-align: start;
}

@media (min-width: 768px) {
  .rh-featured-scroll-container {
    overflow-x: visible;
    padding-bottom: 0;
  }

  .rh-featured-cards-track {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }

  .rh-featured-card-wrapper {
    flex: auto;
    max-width: none;
  }
}

@media (min-width: 1024px) {
  .rh-featured-cards-track {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
