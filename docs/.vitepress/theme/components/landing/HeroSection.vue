<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { data as allResources } from '../../data/resources.data';
import { CATEGORIES } from '../../data/categories';
import HeroMockup from './HeroMockup.vue';

const heroQuery = ref('');

function onSearchSubmit() {
  const q = heroQuery.value.trim();
  if (typeof window !== 'undefined') {
    if (q) {
      window.location.href = `/resources/?q=${encodeURIComponent(q)}`;
    } else {
      window.location.href = '/resources/';
    }
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    onSearchSubmit();
  }
}

// Compute dynamic numbers from real data
const totalResources = computed(() => allResources.length);
const totalCategories = computed(() => CATEGORIES.length);

const freePercentage = computed(() => {
  if (!allResources.length) return 0;
  const freeCount = allResources.filter(r => r.pricing === 'free' || r.pricing === 'freemium').length;
  return Math.round((freeCount / allResources.length) * 100);
});

// Latest added resource date
const latestDate = computed(() => {
  const dates = allResources.map(r => r.dateAdded).filter(Boolean).sort().reverse();
  return dates[0] || 'Weekly';
});

// Derive top 5 most frequent tags from the dataset
const topTags = computed(() => {
  const counts: Record<string, number> = {};
  for (const item of allResources) {
    if (Array.isArray(item.tags)) {
      for (const t of item.tags) {
        counts[t] = (counts[t] || 0) + 1;
      }
    }
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag]) => tag);
});

// Smooth Count-Up Animation for statistics
const animatedResources = ref(0);
const animatedCategories = ref(0);
const animatedFreeRate = ref(0);

onMounted(() => {
  if (typeof window === 'undefined') return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    animatedResources.value = totalResources.value;
    animatedCategories.value = totalCategories.value;
    animatedFreeRate.value = freePercentage.value;
    return;
  }

  // Count up numbers over 1.2s
  const duration = 1200;
  const start = performance.now();

  function step(now: number) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    animatedResources.value = Math.floor(ease * totalResources.value);
    animatedCategories.value = Math.floor(ease * totalCategories.value);
    animatedFreeRate.value = Math.floor(ease * freePercentage.value);

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      animatedResources.value = totalResources.value;
      animatedCategories.value = totalCategories.value;
      animatedFreeRate.value = freePercentage.value;
    }
  }

  requestAnimationFrame(step);
});
</script>

<template>
  <section class="rh-hero-zone" aria-labelledby="hero-heading">
    <!-- Ambient Radial Mesh Glow -->
    <div class="rh-hero-radial-glow" aria-hidden="true"></div>

    <div class="rh-hero-content">
      <!-- Pill Eyebrow -->
      <div class="rh-hero-eyebrow-wrap">
        <a href="/resources/" class="rh-badge rh-badge-brand rh-hero-eyebrow">
          <span class="rh-eyebrow-dot" aria-hidden="true"></span>
          <span>Open source · Updated weekly</span>
        </a>
      </div>

      <!-- Main Headline (Tight tracking, 39 chars) -->
      <h1 id="hero-heading" class="rh-hero-headline">
        Every tool worth knowing.<br />
        <span class="rh-gradient-text">In one place.</span>
      </h1>

      <!-- Short, concrete subcopy (15 words) -->
      <p class="rh-hero-subcopy">
        A fast, searchable directory of verified libraries, developer tools, and design systems.
      </p>

      <!-- Primary & Secondary Action CTAs -->
      <div class="rh-hero-actions">
        <a href="/resources/" class="rh-btn rh-btn-primary rh-btn-lg">
          <span>Browse {{ totalResources }} resources</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </a>
        <a href="/contribute" class="rh-btn rh-btn-secondary rh-btn-lg">
          <span>Contribute</span>
          <span aria-hidden="true">→</span>
        </a>
      </div>

      <!-- Interactive Search Input & Tag Suggestions -->
      <div class="rh-hero-search-container">
        <div class="rh-hero-search-bar">
          <svg class="rh-hero-search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            v-model="heroQuery"
            type="text"
            class="rh-hero-search-input"
            placeholder="Search by name, category, or stack..."
            aria-label="Search resources directly"
            @keydown="onKeydown"
          />
          <button
            class="rh-btn rh-btn-primary rh-btn-sm rh-hero-search-submit"
            @click="onSearchSubmit"
          >
            <span>Search</span>
            <kbd class="rh-kbd" aria-hidden="true">/</kbd>
          </button>
        </div>

        <!-- Suggestion Chips: Top 5 Real Tags -->
        <div class="rh-hero-suggestions">
          <span class="rh-suggestions-label">Popular tags:</span>
          <a
            v-for="tag in topTags"
            :key="tag"
            :href="`/resources/?tag=${encodeURIComponent(tag)}`"
            class="rh-badge rh-suggestion-chip"
          >
            #{{ tag }}
          </a>
        </div>
      </div>
    </div>

    <!-- Centerpiece: Product Window Mockup -->
    <HeroMockup />

    <!-- Compact Trust / Stats Row -->
    <div class="rh-trust-strip" aria-label="Catalog statistics">
      <div class="rh-trust-stat">
        <span class="rh-trust-num rh-tnum">{{ animatedResources }}</span>
        <span class="rh-trust-label">Indexed Resources</span>
      </div>
      <div class="rh-trust-divider" aria-hidden="true"></div>
      <div class="rh-trust-stat">
        <span class="rh-trust-num rh-tnum">{{ animatedCategories }}</span>
        <span class="rh-trust-label">Categories</span>
      </div>
      <div class="rh-trust-divider" aria-hidden="true"></div>
      <div class="rh-trust-stat">
        <span class="rh-trust-num rh-tnum">{{ animatedFreeRate }}%</span>
        <span class="rh-trust-label">Free or Freemium</span>
      </div>
      <div class="rh-trust-divider" aria-hidden="true"></div>
      <div class="rh-trust-stat">
        <span class="rh-trust-num rh-tnum">{{ latestDate }}</span>
        <span class="rh-trust-label">Latest Addition</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.rh-hero-zone {
  position: relative;
  width: 100%;
  padding-top: clamp(2.5rem, 5vw, 4.5rem);
  padding-bottom: clamp(3rem, 6vw, 5rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

/* Ambient Radial Mesh Glow */
.rh-hero-radial-glow {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 720px;
  max-width: 95vw;
  height: 420px;
  background: radial-gradient(
    circle,
    rgba(59, 130, 246, 0.16) 0%,
    rgba(147, 51, 234, 0.08) 40%,
    transparent 70%
  );
  filter: blur(60px);
  pointer-events: none;
  z-index: 0;
}

.dark .rh-hero-radial-glow {
  background: radial-gradient(
    circle,
    rgba(59, 130, 246, 0.22) 0%,
    rgba(147, 51, 234, 0.14) 45%,
    transparent 75%
  );
}

.rh-hero-content {
  position: relative;
  z-index: 1;
  max-width: 820px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.rh-hero-eyebrow-wrap {
  margin-bottom: var(--rh-space-4);
}

.rh-hero-eyebrow {
  text-decoration: none !important;
  padding: 4px 14px;
  font-size: 0.8125rem;
  border-radius: var(--rh-radius-full);
  background: var(--rh-c-bg-surface);
  border: 1px solid var(--rh-c-border);
  box-shadow: var(--rh-shadow-xs);
  transition: border-color var(--rh-transition-fast), transform var(--rh-transition-fast);
}

.rh-hero-eyebrow:hover {
  border-color: var(--rh-c-border-hover);
  transform: translateY(-1px);
}

.rh-eyebrow-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: var(--rh-color-emerald-text);
  box-shadow: 0 0 8px var(--rh-color-emerald-text);
}

/* Main Display Headline */
.rh-hero-headline {
  font-size: var(--rh-text-display);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.045em;
  color: var(--rh-c-text-primary);
  margin: 0 0 var(--rh-space-4) 0;
}

.rh-hero-subcopy {
  max-width: 540px;
  margin: 0 auto var(--rh-space-8) auto;
  font-size: 1.125rem;
  line-height: 1.6;
  color: var(--rh-c-text-secondary);
}

/* Action CTAs */
.rh-hero-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: var(--rh-space-3);
  margin-bottom: var(--rh-space-6);
}

/* Search Bar with Tag Suggestions */
.rh-hero-search-container {
  width: 100%;
  max-width: 580px;
  margin: 0 auto;
}

.rh-hero-search-bar {
  display: flex;
  align-items: center;
  gap: var(--rh-space-2);
  background-color: var(--rh-c-bg-surface);
  border: 1px solid var(--rh-c-border);
  border-radius: var(--rh-radius-lg);
  padding: 6px 8px 6px var(--rh-space-4);
  box-shadow: var(--rh-shadow-md);
  transition: border-color var(--rh-transition-fast), box-shadow var(--rh-transition-fast);
}

.rh-hero-search-bar:focus-within {
  border-color: var(--rh-c-brand);
  box-shadow: 0 0 0 3px var(--rh-c-brand-soft), var(--rh-shadow-md);
}

.rh-hero-search-icon {
  color: var(--rh-c-text-tertiary);
  flex-shrink: 0;
}

.rh-hero-search-input {
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  outline: none;
  font-family: var(--rh-font-sans);
  font-size: 0.9375rem;
  color: var(--rh-c-text-primary);
  padding: 4px 0;
}

.rh-hero-search-input::placeholder {
  color: var(--rh-c-text-tertiary);
}

.rh-hero-search-submit {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Suggestion Chips */
.rh-hero-suggestions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: var(--rh-space-3);
  font-size: 0.78125rem;
}

.rh-suggestions-label {
  color: var(--rh-c-text-tertiary);
  margin-right: 2px;
}

.rh-suggestion-chip {
  text-decoration: none !important;
  color: var(--rh-c-text-secondary);
  transition: all var(--rh-transition-fast);
}

.rh-suggestion-chip:hover {
  background-color: var(--rh-c-bg-hover);
  color: var(--rh-c-text-primary);
  transform: translateY(-1px);
}

/* Compact Trust Row */
.rh-trust-strip {
  position: relative;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
  gap: var(--rh-space-4);
  width: 100%;
  max-width: 900px;
  margin-top: var(--rh-space-10);
  padding: var(--rh-space-5) var(--rh-space-6);
  background-color: var(--rh-c-bg-surface);
  border: 1px solid var(--rh-c-border);
  border-radius: var(--rh-radius-lg);
  box-shadow: var(--rh-shadow-sm);
}

.rh-trust-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.rh-trust-num {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--rh-c-text-primary);
  line-height: 1.2;
}

.rh-trust-label {
  font-size: 0.78125rem;
  color: var(--rh-c-text-tertiary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.rh-trust-divider {
  display: none;
  width: 1px;
  height: 32px;
  background-color: var(--rh-c-border);
}

@media (min-width: 640px) {
  .rh-trust-divider {
    display: block;
  }
}
</style>
