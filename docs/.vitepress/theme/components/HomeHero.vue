<script setup lang="ts">
import { computed } from 'vue';
import { data as allResources } from '../data/resources.data';
import { CATEGORIES } from '../data/categories';
import ResourceCard from './ResourceCard.vue';
import CategoryOverview from './CategoryOverview.vue';

const totalCount = computed(() => allResources.length);

const featuredResources = computed(() => {
  return allResources.filter(r => r.featured);
});

const recentResources = computed(() => {
  return allResources.slice(0, 4);
});

function openVitePressSearch() {
  const btn = document.querySelector('.DocSearch-Button, .VPNavBarSearchButton, [aria-label*="Search"]') as HTMLButtonElement | null;
  if (btn) {
    btn.click();
  } else {
    window.location.href = '/resources/';
  }
}
</script>

<template>
  <div class="home-layout">
    <!-- Editorial Hero -->
    <header class="hero-block">
      <h1 class="hero-heading">Developer Resource Hub</h1>
      <p class="hero-summary">
        A curated, high-performance library of developer utilities, design systems, APIs, and technical references. Built for discovery, speed, and long-term utility.
      </p>

      <!-- Prominent Search Interface -->
      <div class="search-trigger-container">
        <button class="search-trigger-box" @click="openVitePressSearch" aria-label="Open search dialog">
          <svg class="search-lens" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <span class="search-label">
            Search {{ totalCount > 0 ? `${totalCount} resources` : 'library' }} by title, technology, or tag...
          </span>
          <kbd class="key-hint">⌘K</kbd>
        </button>
      </div>

      <!-- Linear / MUJI Action Buttons -->
      <div class="hero-actions-row">
        <a href="/resources/" class="btn-solid">
          Browse Directory
        </a>
        <a href="/categories" class="btn-outline">
          View Categories
        </a>
        <a href="/contribute" class="btn-ghost">
          Suggest a Resource
        </a>
      </div>
    </header>

    <!-- Category Section -->
    <section class="content-section">
      <div class="section-title-bar">
        <div>
          <h2 class="section-heading">Browse by Category</h2>
          <p class="section-subtext">Organized collections across engineering, design, and developer workflows.</p>
        </div>
        <a href="/categories" class="section-action-link">All 10 categories →</a>
      </div>
      <CategoryOverview />
    </section>

    <!-- Recently Added Section -->
    <section v-if="allResources.length > 0" class="content-section">
      <div class="section-title-bar">
        <div>
          <h2 class="section-heading">Recently Added</h2>
          <p class="section-subtext">The latest additions to the resource collection.</p>
        </div>
        <a href="/resources/" class="section-action-link">View all in directory →</a>
      </div>
      <div class="resources-stack">
        <ResourceCard
          v-for="res in recentResources"
          :key="res.urlPath"
          :resource="res"
        />
      </div>
    </section>

    <!-- Featured Section -->
    <section class="content-section">
      <div class="section-title-bar">
        <div>
          <h2 class="section-heading">Featured Resources</h2>
          <p class="section-subtext">Curated foundational tools and exceptional utilities.</p>
        </div>
      </div>

      <div v-if="featuredResources.length > 0" class="resources-stack">
        <ResourceCard
          v-for="res in featuredResources"
          :key="res.urlPath"
          :resource="res"
        />
      </div>
      <!-- Friendly Duolingo-style empty state with clear next action -->
      <div v-else class="empty-guide-box">
        <div class="empty-icon-circle">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </div>
        <h3 class="empty-guide-title">Featured selections will appear here</h3>
        <p class="empty-guide-text">
          Hand-picked spotlights will be featured as resources are cataloged. All resources remain immediately browsable in the directory.
        </p>
        <div class="empty-actions">
          <a href="/resources/" class="btn-outline-small">Browse Directory</a>
          <a href="/contribute" class="btn-ghost-small">Suggest a Spotlight Resource</a>
        </div>
      </div>
    </section>

    <!-- Minimalist Contribution Footer Banner -->
    <section class="editorial-callout">
      <div class="callout-text-wrap">
        <h3 class="callout-heading">Suggest a valuable tool</h3>
        <p class="callout-desc">
          Know a high-utility library, design system, or reference? Submissions are community-driven, reviewed for quality, and open-source.
        </p>
      </div>
      <div class="callout-actions">
        <a href="/contribute" class="btn-solid-small">Suggest Resource</a>
        <a href="https://github.com/azmil666/resource-hub" target="_blank" rel="noopener noreferrer" class="btn-outline-small">
          GitHub ↗
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-layout {
  max-width: 960px;
  margin: 0 auto;
  padding: 3rem 1.5rem 5rem 1.5rem;
}

/* Hero Section */
.hero-block {
  text-align: left;
  padding-bottom: 2.75rem;
  border-bottom: 1px solid var(--vp-c-border);
}

.hero-heading {
  font-size: 2.6rem;
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.035em;
  color: var(--vp-c-text-1);
  margin: 0 0 1rem 0;
}

.hero-summary {
  font-size: 1.12rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  max-width: 62ch;
  margin: 0 0 1.75rem 0;
  text-wrap: pretty;
}

.search-trigger-container {
  max-width: 620px;
  margin-bottom: 1.5rem;
}

.search-trigger-box {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background-color: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  cursor: pointer;
  transition: border-color var(--hub-transition), background-color var(--hub-transition);
  text-align: left;
}

.search-trigger-box:hover {
  border-color: var(--vp-c-text-2);
  background-color: var(--vp-c-bg);
}

.search-lens {
  color: var(--vp-c-text-3);
  flex-shrink: 0;
}

.search-label {
  font-size: 0.92rem;
  color: var(--vp-c-text-3);
  flex-grow: 1;
}

.key-hint {
  font-size: 0.72rem;
  font-family: var(--vp-font-family-mono);
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--vp-c-text-3);
}

.hero-actions-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

/* Button styles - Linear / MUJI aesthetic */
.btn-solid {
  display: inline-flex;
  align-items: center;
  padding: 0.55rem 1.15rem;
  font-size: 0.88rem;
  font-weight: 500;
  background-color: var(--vp-c-text-1);
  color: var(--vp-c-bg);
  border-radius: 5px;
  text-decoration: none;
  transition: opacity var(--hub-transition);
}

.btn-solid:hover {
  opacity: 0.88;
}

.btn-outline {
  display: inline-flex;
  align-items: center;
  padding: 0.55rem 1.15rem;
  font-size: 0.88rem;
  font-weight: 500;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-1);
  border-radius: 5px;
  text-decoration: none;
  transition: border-color var(--hub-transition), background-color var(--hub-transition);
}

.btn-outline:hover {
  border-color: var(--vp-c-text-1);
  background-color: var(--vp-c-bg-hover);
}

.btn-ghost {
  display: inline-flex;
  align-items: center;
  padding: 0.55rem 0.85rem;
  font-size: 0.88rem;
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color var(--hub-transition);
}

.btn-ghost:hover {
  color: var(--vp-c-text-1);
}

/* Content Sections */
.content-section {
  margin-top: 3.25rem;
}

.section-title-bar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
  padding-bottom: 0.65rem;
  border-bottom: 1px solid var(--vp-c-border);
}

.section-heading {
  margin: 0 0 0.2rem 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  letter-spacing: -0.02em;
}

.section-subtext {
  margin: 0;
  font-size: 0.88rem;
  color: var(--vp-c-text-3);
}

.section-action-link {
  font-size: 0.84rem;
  color: var(--vp-c-text-2);
  text-decoration: none;
  font-weight: 500;
  white-space: nowrap;
  transition: color var(--hub-transition);
}

.section-action-link:hover {
  color: var(--vp-c-text-1);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.resources-stack {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

/* Friendly Empty State (Duolingo reference) */
.empty-guide-box {
  padding: 2.5rem 1.5rem;
  text-align: center;
  background-color: var(--vp-c-bg-alt);
  border: 1px dashed var(--vp-c-border);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-icon-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--vp-c-bg-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-text-2);
  margin-bottom: 0.75rem;
}

.empty-guide-title {
  margin: 0 0 0.35rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.empty-guide-text {
  margin: 0 0 1.25rem 0;
  font-size: 0.86rem;
  color: var(--vp-c-text-3);
  max-width: 50ch;
  line-height: 1.5;
}

.empty-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  justify-content: center;
}

.btn-solid-small {
  padding: 0.4rem 0.85rem;
  font-size: 0.82rem;
  font-weight: 500;
  background-color: var(--vp-c-text-1);
  color: var(--vp-c-bg);
  border-radius: 4px;
  text-decoration: none;
  transition: opacity var(--hub-transition);
}

.btn-solid-small:hover {
  opacity: 0.88;
}

.btn-outline-small {
  padding: 0.4rem 0.85rem;
  font-size: 0.82rem;
  font-weight: 500;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-1);
  border-radius: 4px;
  text-decoration: none;
  transition: border-color var(--hub-transition);
}

.btn-outline-small:hover {
  border-color: var(--vp-c-text-1);
}

.btn-ghost-small {
  padding: 0.4rem 0.85rem;
  font-size: 0.82rem;
  color: var(--vp-c-text-2);
  text-decoration: none;
}

.btn-ghost-small:hover {
  color: var(--vp-c-text-1);
}

/* Editorial Callout */
.editorial-callout {
  margin-top: 4rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1.5rem 1.75rem;
  background-color: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
}

.callout-heading {
  margin: 0 0 0.3rem 0;
  font-size: 1.08rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.callout-desc {
  margin: 0;
  font-size: 0.86rem;
  color: var(--vp-c-text-2);
  max-width: 58ch;
  line-height: 1.5;
}

.callout-actions {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

@media (max-width: 640px) {
  .hero-heading {
    font-size: 2rem;
  }
  .editorial-callout {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
