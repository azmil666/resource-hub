<script setup lang="ts">
import { computed } from 'vue';
import { data as allResources } from '../data/resources.data';
import ResourceCard from './ResourceCard.vue';
import CategoryOverview from './CategoryOverview.vue';

const totalCount = computed(() => allResources.length);

const featuredResources = computed(() => {
  return allResources.filter(r => r.featured);
});

const recentResources = computed(() => {
  return allResources.slice(0, 6);
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
    <!-- Ambient Glow & High-Impact Hero -->
    <header class="hero-block">
      <div class="ambient-glow" aria-hidden="true"></div>

      <div class="hero-badge-wrap">
        <span class="hero-badge">
          <span class="badge-dot"></span>
          Curated Knowledge Directory • {{ totalCount }} Resources
        </span>
      </div>

      <h1 class="hero-heading">
        The Modern Developer<br />
        <span class="gradient-text">Resource Hub</span>
      </h1>

      <p class="hero-summary">
        A minimalist, high-contrast library of developer utilities, UI design systems, APIs, and engineering references. Engineered for rapid discovery.
      </p>

      <!-- Center Vercel / Linear Command Bar Search -->
      <div class="search-trigger-container">
        <button class="search-trigger-box" @click="openVitePressSearch" aria-label="Open command palette search">
          <svg class="search-lens" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <span class="search-label">
            Search {{ totalCount > 0 ? `${totalCount} resources` : 'library' }} by title, stack, or tag...
          </span>
          <div class="command-pill" aria-hidden="true">
            <kbd class="kbd-mod">⌘</kbd>
            <kbd class="kbd-char">K</kbd>
          </div>
        </button>
      </div>

      <!-- Linear Action Buttons -->
      <div class="hero-actions-row">
        <a href="/resources/" class="btn-solid">
          <span>Browse All Resources</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </a>
        <a href="/categories" class="btn-outline">
          View Categories
        </a>
        <a href="/contribute" class="btn-ghost">
          Suggest a Resource →
        </a>
      </div>
    </header>

    <!-- Categories Section -->
    <section class="content-section">
      <div class="section-title-bar">
        <div>
          <h2 class="section-heading">Browse by Discipline</h2>
          <p class="section-subtext">10 curated categories spanning full-stack development, design, and developer tools.</p>
        </div>
        <a href="/categories" class="section-action-link">All Categories →</a>
      </div>
      <CategoryOverview />
    </section>

    <!-- Recently Added Section (Strict Grid) -->
    <section v-if="allResources.length > 0" class="content-section">
      <div class="section-title-bar">
        <div>
          <h2 class="section-heading">Recently Added</h2>
          <p class="section-subtext">The latest tools and references added to the catalog.</p>
        </div>
        <a href="/resources/" class="section-action-link">Open Directory ({{ totalCount }}) →</a>
      </div>
      <div class="resources-grid">
        <ResourceCard
          v-for="res in recentResources"
          :key="res.urlPath"
          :resource="res"
        />
      </div>
    </section>

    <!-- Featured Spotlight Section -->
    <section class="content-section">
      <div class="section-title-bar">
        <div>
          <h2 class="section-heading">Spotlight Resources</h2>
          <p class="section-subtext">Foundational benchmarks and standout open-source utilities.</p>
        </div>
      </div>

      <div v-if="featuredResources.length > 0" class="resources-grid">
        <ResourceCard
          v-for="res in featuredResources"
          :key="res.urlPath"
          :resource="res"
        />
      </div>
      <div v-else class="empty-guide-box">
        <div class="empty-icon-circle">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </div>
        <h3 class="empty-guide-title">Curated spotlights will appear here</h3>
        <p class="empty-guide-text">
          Hand-picked highlights will appear as community suggestions are verified. All 251 resources are immediately browsable in the directory.
        </p>
        <div class="empty-actions">
          <a href="/resources/" class="btn-solid-small">Browse Directory</a>
          <a href="/contribute" class="btn-outline-small">Suggest Spotlight</a>
        </div>
      </div>
    </section>

    <!-- Minimalist Contribution Callout -->
    <section class="editorial-callout">
      <div class="callout-text-wrap">
        <h3 class="callout-heading">Know a high-utility resource?</h3>
        <p class="callout-desc">
          Developer Resource Hub is open-source and community-maintained. Suggest libraries, frameworks, or guides via simple Markdown PRs.
        </p>
      </div>
      <div class="callout-actions">
        <a href="/contribute" class="btn-solid-small">Suggest Resource</a>
        <a href="https://github.com/azmil666/resource-hub" target="_blank" rel="noopener noreferrer" class="btn-outline-small">
          GitHub Repository ↗
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-layout {
  max-width: 1040px;
  margin: 0 auto;
  padding: 0 1.5rem 4rem 1.5rem;
}

/* Hero Block & Ambient Glow */
.hero-block {
  position: relative;
  padding: 4.5rem 1rem 3.5rem 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ambient-glow {
  position: absolute;
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
  width: 700px;
  max-width: 100vw;
  height: 380px;
  background: radial-gradient(
    ellipse 60% 50% at 50% 20%,
    rgba(7, 255, 225, 0.15) 0%,
    rgba(255, 229, 0, 0.04) 40%,
    rgba(0, 0, 0, 0) 70%
  );
  pointer-events: none;
  z-index: 0;
  filter: blur(40px);
}

.hero-badge-wrap {
  margin-bottom: 1.25rem;
  z-index: 1;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  background-color: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  padding: 4px 12px;
  border-radius: 9999px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #07FFE1;
  box-shadow: 0 0 8px rgba(7, 255, 225, 0.8);
}

.hero-heading {
  margin: 0 0 1.25rem 0;
  font-size: 3.25rem;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.04em;
  color: var(--vp-c-text-1);
  z-index: 1;
}

.gradient-text {
  background: linear-gradient(135deg, var(--vp-c-text-1) 30%, var(--vp-c-text-2) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-summary {
  margin: 0 auto 2.25rem auto;
  max-width: 620px;
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  letter-spacing: -0.01em;
  z-index: 1;
}

/* Center Command Bar Search */
.search-trigger-container {
  width: 100%;
  max-width: 600px;
  margin-bottom: 2rem;
  z-index: 1;
}

.search-trigger-box {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.85rem 1.25rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid #333333;
  border-radius: 12px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.5);
  transition: border-color var(--hub-transition), box-shadow var(--hub-transition), transform var(--hub-transition);
}

.search-trigger-box:hover,
.search-trigger-box:focus-visible {
  border-color: rgba(7, 255, 225, 0.5);
  box-shadow: 0 0 24px -2px rgba(7, 255, 225, 0.22), 0 0 0 1px rgba(7, 255, 225, 0.25);
  transform: translateY(-1px);
}

.search-trigger-box:hover .search-lens,
.search-trigger-box:focus-visible .search-lens {
  color: #07FFE1;
}

.search-lens {
  color: var(--vp-c-text-3);
  flex-shrink: 0;
  transition: color var(--hub-transition);
}

.search-label {
  font-size: 0.92rem;
  color: var(--vp-c-text-3);
  flex-grow: 1;
  text-align: left;
  letter-spacing: -0.01em;
}

.command-pill {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  padding: 3px 8px;
  border-radius: 6px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: border-color var(--hub-transition);
}

.search-trigger-box:hover .command-pill {
  border-color: rgba(7, 255, 225, 0.35);
}

.kbd-mod,
.kbd-char {
  font-family: var(--vp-font-family-mono);
  font-size: 0.74rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1;
}

/* Action Buttons */
.hero-actions-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  z-index: 1;
}

.btn-solid {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.65rem 1.25rem;
  background-color: var(--vp-c-brand-1);
  color: var(--vp-c-bg) !important;
  font-size: 0.88rem;
  font-weight: 600;
  border-radius: 6px;
  text-decoration: none;
  transition: opacity var(--hub-transition), transform var(--hub-transition);
}

.btn-solid:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-outline {
  display: inline-flex;
  align-items: center;
  padding: 0.65rem 1.25rem;
  background-color: var(--vp-c-bg-elv);
  color: var(--vp-c-text-1) !important;
  border: 1px solid var(--vp-c-border);
  font-size: 0.88rem;
  font-weight: 500;
  border-radius: 6px;
  text-decoration: none;
  transition: border-color var(--hub-transition), background-color var(--hub-transition), transform var(--hub-transition);
}

.btn-outline:hover {
  border-color: var(--vp-c-border-hover);
  background-color: var(--vp-c-bg-hover);
  transform: translateY(-1px);
}

.btn-ghost {
  display: inline-flex;
  align-items: center;
  padding: 0.65rem 1rem;
  color: var(--vp-c-text-2) !important;
  font-size: 0.88rem;
  font-weight: 500;
  text-decoration: none;
  transition: color var(--hub-transition);
}

.btn-ghost:hover {
  color: var(--vp-c-text-1) !important;
}

/* Content Sections */
.content-section {
  margin-top: 3.5rem;
}

.section-title-bar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid var(--vp-c-border);
  margin-bottom: 1.5rem;
}

.section-heading {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 600;
  letter-spacing: -0.025em;
  color: var(--vp-c-text-1);
}

.section-subtext {
  margin: 0.25rem 0 0 0;
  font-size: 0.86rem;
  color: var(--vp-c-text-2);
}

.section-action-link {
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  text-decoration: none;
  white-space: nowrap;
  transition: color var(--hub-transition);
}

.section-action-link:hover {
  color: var(--vp-c-text-1);
}

/* Resources Strict Grid */
.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
  gap: 1rem;
}

/* Empty Spotlight Guide Box */
.empty-guide-box {
  padding: 2.5rem 1.5rem;
  text-align: center;
  background-color: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: var(--hub-card-radius, 8px);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-icon-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-3);
  margin-bottom: 0.85rem;
}

.empty-guide-title {
  margin: 0 0 0.35rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.empty-guide-text {
  margin: 0 auto 1.25rem auto;
  max-width: 480px;
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}

.empty-actions {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.btn-solid-small {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.45rem 0.95rem;
  background-color: var(--vp-c-brand-1);
  color: var(--vp-c-bg) !important;
  border-radius: 5px;
  text-decoration: none;
  transition: opacity var(--hub-transition);
}

.btn-solid-small:hover {
  opacity: 0.9;
}

.btn-outline-small {
  font-size: 0.8rem;
  font-weight: 500;
  padding: 0.45rem 0.95rem;
  background-color: var(--vp-c-bg-elv);
  color: var(--vp-c-text-1) !important;
  border: 1px solid var(--vp-c-border);
  border-radius: 5px;
  text-decoration: none;
  transition: border-color var(--hub-transition);
}

.btn-outline-small:hover {
  border-color: var(--vp-c-border-hover);
}

/* Bottom Callout Banner */
.editorial-callout {
  margin-top: 4.5rem;
  padding: 2rem 2.25rem;
  background-color: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: var(--hub-card-radius, 8px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.callout-heading {
  margin: 0 0 0.25rem 0;
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.callout-desc {
  margin: 0;
  font-size: 0.86rem;
  color: var(--vp-c-text-2);
  max-width: 540px;
}

.callout-actions {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-shrink: 0;
}

/* Mobile responsive breakpoints */
@media (max-width: 768px) {
  .hero-heading {
    font-size: 2.35rem;
  }
  .section-title-bar {
    flex-direction: column;
    align-items: flex-start;
  }
  .editorial-callout {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
