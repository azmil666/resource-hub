<script setup lang="ts">
import { computed } from 'vue';
import { data as allResources } from '../data/resources.data';
import ResourceCard from './ResourceCard.vue';
import AnnouncementBar from './landing/AnnouncementBar.vue';
import HeroSection from './landing/HeroSection.vue';
import CategoryMarquee from './landing/CategoryMarquee.vue';
import BentoGrid from './landing/BentoGrid.vue';
import CategoryShowcase from './landing/CategoryShowcase.vue';

// Dynamic computed statistics
const totalResources = computed(() => allResources.length);
const totalCategories = computed(() => CATEGORIES.length);

const freeResourcesCount = computed(() => {
  return allResources.filter(r => r.pricing === 'free' || r.pricing === 'freemium').length;
});

const freePercentage = computed(() => {
  if (!allResources.length) return 0;
  return Math.round((freeResourcesCount.value / allResources.length) * 100);
});

// Category counts map
const categoryCountMap = computed(() => {
  const counts: Record<string, number> = {};
  for (const item of allResources) {
    counts[item.category] = (counts[item.category] || 0) + 1;
  }
  return counts;
});

// Featured resources (prominent spotlight)
const featuredResources = computed(() => {
  return allResources.filter(r => r.featured).slice(0, 4);
});

// Recently added resources sorted by dateAdded descending
const recentResources = computed(() => {
  return [...allResources]
    .sort((a, b) => (b.dateAdded || '').localeCompare(a.dateAdded || ''))
    .slice(0, 6);
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
  <div class="rh-home">
    <!-- Announcement Pulse Bar -->
    <AnnouncementBar />

    <!-- Grade-S Hero with Product Window Mockup -->
    <HeroSection />

    <!-- Category Marquee Strip -->
    <CategoryMarquee />

    <!-- Bento Engineering Highlights -->
    <BentoGrid />

    <!-- Category Showcase Grid -->
    <CategoryShowcase />

    <!-- 4. FEATURED SPOTLIGHT SECTION -->
    <section v-if="featuredResources.length > 0" class="rh-home-section">
      <div class="rh-section-header">
        <div>
          <div class="rh-badge rh-badge-amber" style="margin-bottom: var(--rh-space-2);">Staff Picks</div>
          <h2 class="rh-section-title">Spotlight Resources</h2>
          <p class="rh-section-subtitle">High-utility tools and architectural references recognized across the industry.</p>
        </div>
        <a href="/resources/?type=tool" class="rh-btn rh-btn-ghost rh-btn-sm rh-section-link">
          <span>View spotlight tools</span>
          <span aria-hidden="true">→</span>
        </a>
      </div>

      <div class="rh-featured-grid">
        <ResourceCard
          v-for="res in featuredResources"
          :key="res.urlPath"
          :resource="res"
        />
      </div>
    </section>

    <!-- 5. RECENTLY ADDED FEED -->
    <section v-if="recentResources.length > 0" class="rh-home-section">
      <div class="rh-section-header">
        <div>
          <h2 class="rh-section-title">Recently Added</h2>
          <p class="rh-section-subtitle">The freshest additions to the community repository.</p>
        </div>
        <a href="/resources/" class="rh-btn rh-btn-ghost rh-btn-sm rh-section-link">
          <span>Explore all ({{ totalResources }})</span>
          <span aria-hidden="true">→</span>
        </a>
      </div>

      <div class="rh-resources-grid">
        <ResourceCard
          v-for="res in recentResources"
          :key="res.urlPath"
          :resource="res"
        />
      </div>
    </section>

    <!-- 6. VALUE PROPOSITION & HOW IT WORKS -->
    <section class="rh-home-section">
      <div class="rh-section-header">
        <div>
          <h2 class="rh-section-title">Built for Developer Speed</h2>
          <p class="rh-section-subtitle">Designed to remove friction from tooling discovery and research.</p>
        </div>
      </div>

      <div class="rh-features-grid">
        <div class="rh-card rh-feature-card">
          <div class="rh-feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>
            </svg>
          </div>
          <h3 class="rh-feature-title">Keyboard-First Flow</h3>
          <p class="rh-feature-desc">Tap <kbd class="rh-kbd">/</kbd> anywhere to focus search or use fuzzy matching to jump straight to libraries.</p>
        </div>

        <div class="rh-card rh-feature-card">
          <div class="rh-feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </div>
          <h3 class="rh-feature-title">Shareable Deep Links</h3>
          <p class="rh-feature-desc">Every query, category facet, and tag selection immediately reflects in the URL parameters for easy bookmarking.</p>
        </div>

        <div class="rh-card rh-feature-card">
          <div class="rh-feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <h3 class="rh-feature-title">Strict Quality Gate</h3>
          <p class="rh-feature-desc">Automated CI verifies schema integrity, enforces HTTPS, and audits weekly for broken external links.</p>
        </div>

        <div class="rh-card rh-feature-card">
          <div class="rh-feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
              <path d="M9 18c-4.51 2-5-2-7-2"/>
            </svg>
          </div>
          <h3 class="rh-feature-title">100% Open Markdown</h3>
          <p class="rh-feature-desc">No database lock-in. Every resource is an open-source Markdown record you can clone, edit, or extend via pull request.</p>
        </div>
      </div>
    </section>

    <!-- 7. COMMUNITY CONTRIBUTION BANNER -->
    <section class="rh-card rh-cta-banner">
      <div class="rh-cta-content">
        <h3 class="rh-cta-title">Know an exceptional developer tool?</h3>
        <p class="rh-cta-desc">
          Developer Resource Hub is fully open-source. Suggest a new framework, tool, or design resource through our streamlined workflow.
        </p>
      </div>
      <div class="rh-cta-actions">
        <a href="/contribute" class="rh-btn rh-btn-primary rh-btn-md">
          <span>Suggest a Resource</span>
          <span aria-hidden="true">→</span>
        </a>
        <a
          href="https://github.com/azmil666/resource-hub"
          target="_blank"
          rel="noopener noreferrer"
          class="rh-btn rh-btn-secondary rh-btn-md"
        >
          <span>Star on GitHub</span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.rh-home {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--rh-space-4) var(--rh-space-16) var(--rh-space-4);
}

@media (min-width: 768px) {
  .rh-home {
    padding: 0 var(--rh-space-6) var(--rh-space-20) var(--rh-space-6);
  }
}

/* ==========================================================================
   1. HERO STYLING
   ========================================================================== */

.rh-hero {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--rh-space-12) var(--rh-space-2) var(--rh-space-10) var(--rh-space-2);
  overflow: hidden;
}

@media (min-width: 768px) {
  .rh-hero {
    padding: var(--rh-space-16) var(--rh-space-4) var(--rh-space-12) var(--rh-space-4);
  }
}

/* Ambient glow & grid mesh */
.rh-hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.rh-hero-grid {
  position: absolute;
  inset: -100px;
  background-size: 40px 40px;
  background-image:
    linear-gradient(to right, var(--rh-c-border-subtle) 1px, transparent 1px),
    linear-gradient(to bottom, var(--rh-c-border-subtle) 1px, transparent 1px);
  mask-image: radial-gradient(ellipse 65% 55% at 50% 30%, black 20%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse 65% 55% at 50% 30%, black 20%, transparent 75%);
  opacity: 0.6;
}

@keyframes rh-pulse-glow {
  0%, 100% { transform: translate(-50%, -20%) scale(1); opacity: 0.7; }
  50% { transform: translate(-50%, -18%) scale(1.08); opacity: 0.9; }
}

.rh-hero-glow {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -20%);
  width: 680px;
  max-width: 95vw;
  height: 380px;
  border-radius: var(--rh-radius-full);
  background: radial-gradient(
    circle,
    rgba(59, 130, 246, 0.15) 0%,
    rgba(147, 51, 234, 0.08) 45%,
    transparent 70%
  );
  filter: blur(50px);
  animation: rh-pulse-glow 8s ease-in-out infinite;
}

.dark .rh-hero-glow {
  background: radial-gradient(
    circle,
    rgba(59, 130, 246, 0.22) 0%,
    rgba(147, 51, 234, 0.14) 45%,
    transparent 75%
  );
}

.rh-hero-badge-wrap {
  position: relative;
  z-index: 1;
  margin-bottom: var(--rh-space-4);
}

.rh-hero-badge {
  text-decoration: none;
  padding: 4px 14px;
  font-size: 0.8125rem;
  border-radius: var(--rh-radius-full);
  background: var(--rh-c-bg-surface);
  border: 1px solid var(--rh-c-border);
  box-shadow: var(--rh-shadow-xs);
  transition: border-color var(--rh-transition-fast), transform var(--rh-transition-fast);
}

.rh-hero-badge:hover {
  border-color: var(--rh-c-border-hover);
  transform: translateY(-1px);
}

.rh-badge-pulse {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: var(--rh-color-emerald-text);
  box-shadow: 0 0 8px var(--rh-color-emerald-text);
}

.rh-hero-title {
  position: relative;
  z-index: 1;
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.04em;
  color: var(--rh-c-text-primary);
  margin: 0 0 var(--rh-space-4) 0;
}

@media (min-width: 640px) {
  .rh-hero-title {
    font-size: 3.25rem;
  }
}

@media (min-width: 1024px) {
  .rh-hero-title {
    font-size: 3.75rem;
  }
}

.rh-hero-lead {
  position: relative;
  z-index: 1;
  max-width: 640px;
  margin: 0 auto var(--rh-space-8) auto;
  font-size: 1.0625rem;
  line-height: 1.6;
  color: var(--rh-c-text-secondary);
}

/* Hero live search box */
.rh-hero-search-box {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 620px;
  margin: 0 auto var(--rh-space-6) auto;
}

.rh-hero-search-inner {
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

.rh-hero-search-inner:focus-within {
  border-color: var(--rh-c-brand);
  box-shadow: 0 0 0 3px var(--rh-c-brand-soft), var(--rh-shadow-md);
}

.rh-hero-search-icon {
  color: var(--rh-c-text-tertiary);
  flex-shrink: 0;
}

.rh-hero-search-input {
  flex: 1;
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

.rh-hero-search-btn {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.rh-hero-ctas {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: var(--rh-space-3);
}

/* ==========================================================================
   2. METRICS STRIP
   ========================================================================== */

.rh-metrics-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
  gap: var(--rh-space-4);
  padding: var(--rh-space-5) var(--rh-space-6);
  background-color: var(--rh-c-bg-subtle);
  border: 1px solid var(--rh-c-border);
  border-radius: var(--rh-radius-lg);
  margin-bottom: var(--rh-space-12);
}

.rh-metric-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.rh-metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--rh-c-text-primary);
  line-height: 1.2;
}

.rh-metric-label {
  font-size: 0.78125rem;
  color: var(--rh-c-text-tertiary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.rh-metric-divider {
  display: none;
  width: 1px;
  height: 32px;
  background-color: var(--rh-c-border);
}

@media (min-width: 640px) {
  .rh-metric-divider {
    display: block;
  }
}

/* ==========================================================================
   3. SECTIONS & CATEGORY GRID
   ========================================================================== */

.rh-home-section {
  margin-bottom: var(--rh-space-12);
}

@media (min-width: 768px) {
  .rh-home-section {
    margin-bottom: var(--rh-space-16);
  }
}

.rh-section-header {
  display: flex;
  flex-direction: column;
  gap: var(--rh-space-2);
  margin-bottom: var(--rh-space-6);
}

@media (min-width: 640px) {
  .rh-section-header {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
}

.rh-section-title {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--rh-c-text-primary);
  margin: 0;
}

.rh-section-subtitle {
  font-size: 0.9375rem;
  color: var(--rh-c-text-secondary);
  margin: var(--rh-space-1) 0 0 0;
}

.rh-section-link {
  align-self: flex-start;
}

/* Category cards */
.rh-category-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: var(--rh-space-4);
}

@media (min-width: 640px) {
  .rh-category-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .rh-category-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.rh-category-card {
  display: flex;
  flex-direction: column;
  padding: var(--rh-space-5);
  text-decoration: none !important;
  color: inherit;
}

.rh-category-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--rh-space-3);
}

.rh-category-dot {
  width: 10px;
  height: 10px;
  border-radius: var(--rh-radius-full);
}

.rh-category-count {
  font-size: 0.725rem;
}

.rh-category-name {
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--rh-c-text-primary);
  margin: 0 0 var(--rh-space-2) 0;
  letter-spacing: -0.02em;
}

.rh-category-desc {
  font-size: 0.875rem;
  line-height: 1.55;
  color: var(--rh-c-text-secondary);
  margin: 0 0 var(--rh-space-4) 0;
  flex: 1;
}

.rh-category-foot {
  display: flex;
  align-items: center;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--rh-c-brand);
}

.rh-category-arrow {
  transition: transform var(--rh-transition-fast);
}

.rh-category-card:hover .rh-category-arrow {
  transform: translateX(4px);
}

/* ==========================================================================
   4. FEATURED & RECENT CARDS GRID
   ========================================================================== */

.rh-featured-grid,
.rh-resources-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: var(--rh-space-4);
}

@media (min-width: 640px) {
  .rh-featured-grid,
  .rh-resources-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .rh-featured-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .rh-resources-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* ==========================================================================
   5. FEATURE HIGHLIGHTS
   ========================================================================== */

.rh-features-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: var(--rh-space-4);
}

@media (min-width: 640px) {
  .rh-features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .rh-features-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.rh-feature-card {
  padding: var(--rh-space-5);
  display: flex;
  flex-direction: column;
  gap: var(--rh-space-2);
}

.rh-feature-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--rh-radius-md);
  background-color: var(--rh-c-brand-soft);
  color: var(--rh-c-text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--rh-space-2);
}

.rh-feature-title {
  font-size: 0.975rem;
  font-weight: 600;
  color: var(--rh-c-text-primary);
  margin: 0;
}

.rh-feature-desc {
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--rh-c-text-secondary);
  margin: 0;
}

/* ==========================================================================
   6. CTA BANNER
   ========================================================================== */

.rh-cta-banner {
  padding: var(--rh-space-8) var(--rh-space-6);
  display: flex;
  flex-direction: column;
  gap: var(--rh-space-6);
  background: linear-gradient(
    135deg,
    var(--rh-c-bg-surface) 0%,
    var(--rh-c-bg-subtle) 100%
  );
}

@media (min-width: 768px) {
  .rh-cta-banner {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: var(--rh-space-10) var(--rh-space-8);
  }
}

.rh-cta-content {
  max-width: 560px;
}

.rh-cta-title {
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--rh-c-text-primary);
  margin: 0 0 var(--rh-space-2) 0;
}

.rh-cta-desc {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--rh-c-text-secondary);
  margin: 0;
}

.rh-cta-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--rh-space-3);
  flex-shrink: 0;
}
</style>
