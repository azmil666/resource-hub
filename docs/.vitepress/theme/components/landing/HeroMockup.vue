<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { data as allResources } from '../../data/resources.data';
import { getCategory } from '../../data/categories';

// Real tags to cycle through in the mock typing animation
const searchTerms = ['icons', 'css', 'ai', 'tools'];
const currentTermIndex = ref(0);
const displayedQuery = ref('');
const isDeleting = ref(false);
const activeFilterCategory = ref('all');
let timer: any = null;

// Filter 6 real resources based on the simulated search or active category
const mockTiles = computed(() => {
  const q = displayedQuery.value.toLowerCase().trim();
  const pool = allResources.filter(r => {
    if (activeFilterCategory.value !== 'all' && r.category !== activeFilterCategory.value) {
      return false;
    }
    if (q) {
      return (
        r.title.toLowerCase().includes(q) ||
        r.tags.some(t => t.toLowerCase().includes(q)) ||
        r.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Fallback to top featured or curated resources if pool is small
  if (pool.length < 6) {
    return allResources.slice(0, 6);
  }
  return pool.slice(0, 6);
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

function tick() {
  const fullTerm = searchTerms[currentTermIndex.value];

  if (!isDeleting.value) {
    displayedQuery.value = fullTerm.substring(0, displayedQuery.value.length + 1);
    if (displayedQuery.value === fullTerm) {
      timer = setTimeout(() => {
        isDeleting.value = true;
        tick();
      }, 2400);
      return;
    }
  } else {
    displayedQuery.value = fullTerm.substring(0, displayedQuery.value.length - 1);
    if (displayedQuery.value === '') {
      isDeleting.value = false;
      currentTermIndex.value = (currentTermIndex.value + 1) % searchTerms.length;
      timer = setTimeout(tick, 500);
      return;
    }
  }

  const speed = isDeleting.value ? 60 : 120;
  timer = setTimeout(tick, speed);
}

onMounted(() => {
  // Check prefers-reduced-motion
  if (typeof window !== 'undefined') {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      timer = setTimeout(tick, 1000);
    } else {
      displayedQuery.value = 'icons';
    }
  }
});

onUnmounted(() => {
  if (timer) clearTimeout(timer);
});
</script>

<template>
  <div class="rh-mockup-wrapper" aria-hidden="true">
    <!-- Ambient Backdrop Glow -->
    <div class="rh-mockup-glow-effect"></div>

    <!-- Browser / App Window Container -->
    <div class="rh-card rh-mockup-window">
      <!-- Window Titlebar with Traffic Lights -->
      <div class="rh-mockup-titlebar">
        <div class="rh-mockup-traffic-lights">
          <span class="rh-light rh-light-red"></span>
          <span class="rh-light rh-light-yellow"></span>
          <span class="rh-light rh-light-green"></span>
        </div>
        <div class="rh-mockup-address-pill">
          <svg class="rh-lock-icon" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span class="rh-mockup-url">developer-resource-hub.vercel.app/resources</span>
        </div>
        <div class="rh-mockup-tab-spacer"></div>
      </div>

      <!-- App Content Area -->
      <div class="rh-mockup-body">
        <!-- Mock Search Bar & Filters -->
        <div class="rh-mockup-toolbar">
          <div class="rh-mockup-search">
            <svg class="rh-mockup-search-lens" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
            <span class="rh-mockup-typed-query">{{ displayedQuery }}</span>
            <span class="rh-mockup-cursor">|</span>
          </div>

          <div class="rh-mockup-pills">
            <span class="rh-mockup-pill is-active">All</span>
            <span class="rh-mockup-pill">Design</span>
            <span class="rh-mockup-pill">Frontend</span>
            <span class="rh-mockup-pill">AI Tools</span>
          </div>
        </div>

        <!-- 2x3 Grid of Real Resource Cards -->
        <div class="rh-mockup-grid">
          <div
            v-for="(tile, i) in mockTiles"
            :key="tile.slug"
            class="rh-card rh-mock-tile"
            :class="{ 'is-simulated-hover': i === 1 }"
          >
            <div class="rh-mock-tile-header">
              <div class="rh-mock-tile-cat">
                <span
                  class="rh-mock-cat-dot"
                  :style="{ backgroundColor: categoryAccents[tile.category] || 'var(--rh-c-brand)' }"
                ></span>
                <span>{{ getCategory(tile.category).name }}</span>
              </div>
              <span class="rh-badge rh-mock-pricing" :class="`rh-badge-${tile.pricing === 'free' ? 'emerald' : tile.pricing === 'freemium' ? 'amber' : 'slate'}`">
                {{ tile.pricing }}
              </span>
            </div>

            <div class="rh-mock-tile-title">{{ tile.title }}</div>
            <div class="rh-mock-tile-desc">{{ tile.description }}</div>

            <div class="rh-mock-tile-footer">
              <div class="rh-mock-tags">
                <span v-for="tag in tile.tags.slice(0, 2)" :key="tag" class="rh-mock-tag">
                  #{{ tag }}
                </span>
              </div>
              <svg class="rh-mock-ext" xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="7" y1="17" x2="17" y2="7"/>
                <polyline points="7 7 17 7 17 17"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rh-mockup-wrapper {
  position: relative;
  width: 100%;
  max-width: 1080px;
  margin: var(--rh-space-8) auto 0 auto;
  user-select: none;
  pointer-events: none;
}

/* Ambient glow placed precisely behind the window */
.rh-mockup-glow-effect {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  height: 380px;
  background: var(--rh-mockup-glow);
  filter: blur(50px);
  z-index: 0;
  border-radius: var(--rh-radius-full);
}

/* 3D Perspective Browser Frame */
.rh-mockup-window {
  position: relative;
  z-index: 1;
  background-color: var(--rh-c-bg-surface);
  border: 1px solid var(--rh-c-border);
  border-radius: var(--rh-radius-lg);
  box-shadow: var(--rh-shadow-xl), 0 0 0 1px rgba(255, 255, 255, 0.05);
  overflow: hidden;
  mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
}

@media (min-width: 1024px) {
  .rh-mockup-window {
    transform: perspective(1200px) rotateX(2.5deg);
    transition: transform 0.4s var(--rh-ease);
  }
}

/* Window Chrome Titlebar */
.rh-mockup-titlebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background-color: var(--rh-c-bg-subtle);
  border-bottom: 1px solid var(--rh-c-border);
}

.rh-mockup-traffic-lights {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 50px;
}

.rh-light {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.rh-light-red { background-color: #ff5f56; }
.rh-light-yellow { background-color: #ffbd2e; }
.rh-light-green { background-color: #27c93f; }

.rh-mockup-address-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: var(--rh-c-bg-surface);
  border: 1px solid var(--rh-c-border);
  border-radius: var(--rh-radius-full);
  padding: 3px 14px;
  font-size: 0.75rem;
  color: var(--rh-c-text-tertiary);
  font-family: var(--rh-font-mono);
}

.rh-lock-icon {
  opacity: 0.6;
}

.rh-mockup-tab-spacer {
  width: 50px;
}

/* Mockup Content Area */
.rh-mockup-body {
  padding: var(--rh-space-5);
  background-color: var(--rh-c-bg);
}

.rh-mockup-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--rh-space-3);
  margin-bottom: var(--rh-space-4);
  flex-wrap: wrap;
}

.rh-mockup-search {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: var(--rh-c-bg-surface);
  border: 1px solid var(--rh-c-border);
  border-radius: var(--rh-radius-md);
  padding: 5px 12px;
  min-width: 200px;
  font-size: 0.78125rem;
  color: var(--rh-c-text-primary);
}

.rh-mockup-search-lens {
  color: var(--rh-c-text-tertiary);
}

.rh-mockup-typed-query {
  font-weight: 500;
  color: var(--rh-c-text-primary);
}

.rh-mockup-cursor {
  font-weight: 300;
  color: var(--rh-c-brand);
  animation: rh-blink 1s step-end infinite;
}

@keyframes rh-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.rh-mockup-pills {
  display: flex;
  align-items: center;
  gap: 6px;
}

.rh-mockup-pill {
  font-size: 0.725rem;
  padding: 3px 10px;
  border-radius: var(--rh-radius-full);
  border: 1px solid var(--rh-c-border);
  background-color: var(--rh-c-bg-surface);
  color: var(--rh-c-text-secondary);
}

.rh-mockup-pill.is-active {
  background-color: var(--rh-c-brand-soft);
  border-color: var(--rh-c-brand);
  color: var(--rh-c-text-primary);
  font-weight: 600;
}

/* 2x3 Grid of Tiles */
.rh-mockup-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--rh-space-3);
}

@media (max-width: 520px) {
  .rh-mockup-grid {
    grid-template-columns: 1fr;
  }
  .rh-mock-tile:nth-child(n+3) {
    display: none;
  }
}

@media (min-width: 768px) {
  .rh-mockup-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.rh-mock-tile {
  padding: 12px 14px;
  background-color: var(--rh-c-bg-surface);
  border: 1px solid var(--rh-c-border);
  border-radius: var(--rh-radius-md);
  display: flex;
  flex-direction: column;
  transition: transform var(--rh-transition-fast), border-color var(--rh-transition-fast);
}

.rh-mock-tile.is-simulated-hover {
  border-color: var(--rh-c-border-hover);
  transform: translateY(-2px);
  box-shadow: var(--rh-shadow-md);
}

.rh-mock-tile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.rh-mock-tile-cat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.6875rem;
  color: var(--rh-c-text-secondary);
}

.rh-mock-cat-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
}

.rh-mock-pricing {
  font-size: 0.65rem;
  padding: 1px 5px;
  text-transform: capitalize;
}

.rh-mock-tile-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--rh-c-text-primary);
  margin-bottom: 4px;
  letter-spacing: -0.015em;
}

.rh-mock-tile-desc {
  font-size: 0.75rem;
  line-height: 1.4;
  color: var(--rh-c-text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 8px;
}

.rh-mock-tile-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 6px;
  border-top: 1px solid var(--rh-c-border-subtle);
}

.rh-mock-tags {
  display: flex;
  gap: 4px;
}

.rh-mock-tag {
  font-size: 0.6875rem;
  color: var(--rh-c-text-tertiary);
}

.rh-mock-ext {
  color: var(--rh-c-text-tertiary);
}
</style>
