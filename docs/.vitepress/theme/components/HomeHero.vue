<script setup lang="ts">
import { computed } from 'vue';
import { data as allResources } from '../data/resources.data';
import { CATEGORIES } from '../data/categories';
import ResourceCard from './ResourceCard.vue';
import CategoryOverview from './CategoryOverview.vue';

const totalCount = computed(() => allResources.length);

const freeCount = computed(() => {
  return allResources.filter(r => r.pricing === 'free' || r.pricing === 'freemium').length;
});

const featuredResources = computed(() => {
  return allResources.filter(r => r.featured);
});

const recentResources = computed(() => {
  // Take last added or first 4
  return allResources.slice(0, 4);
});

function openVitePressSearch() {
  // VitePress search button trigger
  const btn = document.querySelector('.DocSearch-Button, .VPNavBarSearchButton, [aria-label*="Search"]') as HTMLButtonElement | null;
  if (btn) {
    btn.click();
  } else {
    window.location.href = '/resources/';
  }
}
</script>

<template>
  <div class="home-container">
    <!-- Hero Header -->
    <header class="hero-section">
      <div class="pill-badge">
        <span class="status-dot"></span>
        <span>Curated Developer Knowledge Library</span>
      </div>

      <h1 class="hero-title">Developer Resource Hub</h1>
      <p class="hero-description">
        A minimalist, high-performance library of essential developer tools, design systems, APIs, utilities, and learning references.
      </p>

      <!-- Prominent Search Trigger -->
      <div class="hero-search-wrap">
        <button class="hero-search-btn" @click="openVitePressSearch" aria-label="Open search dialog">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <span class="placeholder-text">Search <strong>{{ totalCount }}</strong> resources by keyword, technology, or tag...</span>
          <kbd class="shortcut-key">⌘K</kbd>
        </button>
      </div>

      <!-- Quick Action Buttons -->
      <div class="hero-actions">
        <a href="/resources/" class="action-btn primary-btn">
          Browse All Resources →
        </a>
        <a href="/categories" class="action-btn secondary-btn">
          Explore Categories
        </a>
        <a href="/contribute" class="action-btn outline-btn">
          Suggest a Resource
        </a>
      </div>

      <!-- Live Metrics Bar -->
      <div class="metrics-bar">
        <div class="metric-item">
          <span class="metric-num">{{ totalCount }}</span>
          <span class="metric-label">Published Resources</span>
        </div>
        <div class="metric-divider"></div>
        <div class="metric-item">
          <span class="metric-num">{{ CATEGORIES.length }}</span>
          <span class="metric-label">Curated Categories</span>
        </div>
        <div class="metric-divider"></div>
        <div class="metric-item">
          <span class="metric-num">{{ freeCount }}</span>
          <span class="metric-label">Free & Open Access</span>
        </div>
        <div class="metric-divider"></div>
        <div class="metric-item">
          <span class="metric-num">100%</span>
          <span class="metric-label">Static & Fast</span>
        </div>
      </div>
    </header>

    <!-- Category Overview Section -->
    <section class="home-section">
      <div class="section-header">
        <div>
          <h2 class="section-title">Browse by Category</h2>
          <p class="section-desc">Explore organized collections across development, design, and engineering.</p>
        </div>
        <a href="/categories" class="section-link">View all 10 categories →</a>
      </div>
      <CategoryOverview />
    </section>

    <!-- Recently Added Section -->
    <section v-if="allResources.length > 0" class="home-section">
      <div class="section-header">
        <div>
          <h2 class="section-title">Recently Added</h2>
          <p class="section-desc">The latest additions to the resource library.</p>
        </div>
        <a href="/resources/" class="section-link">Browse directory →</a>
      </div>
      <div class="recent-grid">
        <ResourceCard
          v-for="res in recentResources"
          :key="res.urlPath"
          :resource="res"
        />
      </div>
    </section>

    <!-- Featured Section (Initially empty state) -->
    <section class="home-section">
      <div class="section-header">
        <div>
          <h2 class="section-title">Featured Selections</h2>
          <p class="section-desc">Hand-picked standouts and foundational utilities.</p>
        </div>
      </div>

      <div v-if="featuredResources.length > 0" class="recent-grid">
        <ResourceCard
          v-for="res in featuredResources"
          :key="res.urlPath"
          :resource="res"
        />
      </div>
      <div v-else class="featured-empty">
        <p class="featured-empty-text">
          Featured entries will appear here once spotlight resources are tagged. All resources remain fully accessible in the directory.
        </p>
        <a href="/resources/" class="inline-link">Browse all resources in the directory →</a>
      </div>
    </section>

    <!-- Contribution Banner -->
    <section class="contribution-banner">
      <div class="banner-content">
        <h3 class="banner-title">Know a high-value developer tool?</h3>
        <p class="banner-desc">
          This library is community-driven and open-source. Help fellow developers by submitting your favorite tools, libraries, and guides.
        </p>
      </div>
      <div class="banner-actions">
        <a href="/contribute" class="banner-btn">Suggest a Resource</a>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="github-btn">
          GitHub Repository ↗
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-container {
  max-width: 1040px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 4rem 1.5rem;
}

.hero-section {
  text-align: center;
  padding: 1.5rem 0 3rem 0;
  border-bottom: 1px solid var(--vp-c-border);
}

.pill-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  background-color: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-border);
  padding: 3px 12px;
  border-radius: 999px;
  margin-bottom: 1.25rem;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #22c55e;
}

.hero-title {
  font-size: 2.75rem;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.03em;
  color: var(--vp-c-text-1);
  margin: 0 0 1rem 0;
}

.hero-description {
  font-size: 1.12rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  max-width: 680px;
  margin: 0 auto 1.75rem auto;
}

.hero-search-wrap {
  max-width: 620px;
  margin: 0 auto 1.5rem auto;
}

.hero-search-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.15rem;
  background-color: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.15s ease, background-color 0.15s ease;
  color: var(--vp-c-text-2);
}

.hero-search-btn:hover {
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-bg);
}

.search-icon {
  color: var(--vp-c-brand-1);
}

.placeholder-text {
  font-size: 0.94rem;
  color: var(--vp-c-text-3);
  text-align: left;
  flex-grow: 1;
}

.placeholder-text strong {
  color: var(--vp-c-text-1);
}

.shortcut-key {
  font-size: 0.75rem;
  font-family: var(--vp-font-family-mono);
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--vp-c-text-3);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 2.5rem;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.55rem 1.25rem;
  font-size: 0.88rem;
  font-weight: 500;
  border-radius: 5px;
  text-decoration: none;
  transition: all 0.15s ease;
}

.primary-btn {
  background-color: var(--vp-c-brand-1);
  color: #ffffff;
}

.primary-btn:hover {
  opacity: 0.92;
}

.secondary-btn {
  background-color: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-1);
}

.secondary-btn:hover {
  border-color: var(--vp-c-brand-1);
}

.outline-btn {
  background-color: transparent;
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-2);
}

.outline-btn:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-text-3);
}

.metrics-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 1.15rem 1.5rem;
  background-color: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  max-width: 820px;
  margin: 0 auto;
}

.metric-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
}

.metric-num {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-mono);
}

.metric-label {
  font-size: 0.74rem;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.metric-divider {
  width: 1px;
  height: 32px;
  background-color: var(--vp-c-border);
}

.home-section {
  margin-top: 3.5rem;
}

.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid var(--vp-c-border);
  padding-bottom: 0.75rem;
}

.section-title {
  margin: 0 0 0.2rem 0;
  font-size: 1.45rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  letter-spacing: -0.01em;
}

.section-desc {
  margin: 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-3);
}

.section-link {
  font-size: 0.85rem;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-weight: 500;
  white-space: nowrap;
}

.section-link:hover {
  text-decoration: underline;
}

.recent-grid {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.featured-empty {
  padding: 2rem 1.5rem;
  text-align: center;
  background-color: var(--vp-c-bg-alt);
  border: 1px dashed var(--vp-c-border);
  border-radius: 6px;
}

.featured-empty-text {
  margin: 0 0 0.5rem 0;
  font-size: 0.88rem;
  color: var(--vp-c-text-3);
}

.inline-link {
  font-size: 0.85rem;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.inline-link:hover {
  text-decoration: underline;
}

.contribution-banner {
  margin-top: 4rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  padding: 1.5rem 1.75rem;
  background-color: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
}

.banner-title {
  margin: 0 0 0.35rem 0;
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.banner-desc {
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.5;
  color: var(--vp-c-text-2);
  max-width: 600px;
}

.banner-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.banner-btn {
  padding: 0.45rem 1rem;
  font-size: 0.85rem;
  font-weight: 500;
  background-color: var(--vp-c-brand-1);
  color: #ffffff;
  border-radius: 4px;
  text-decoration: none;
}

.github-btn {
  padding: 0.45rem 1rem;
  font-size: 0.85rem;
  font-weight: 500;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-1);
  border-radius: 4px;
  text-decoration: none;
}

.github-btn:hover {
  border-color: var(--vp-c-brand-1);
}

@media (max-width: 640px) {
  .hero-title {
    font-size: 2.1rem;
  }
  .metric-divider {
    display: none;
  }
  .metrics-bar {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}
</style>
