<script setup lang="ts">
import { computed } from 'vue';
import { data as allResources } from '../../data/resources.data';
import { CATEGORIES } from '../../data/categories';

const totalCount = computed(() => allResources.length);
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="rh-landing-footer" role="contentinfo">
    <div class="rh-footer-inner">
      <div class="rh-footer-grid">
        <!-- Col 1: Brand & Philosophy -->
        <div class="rh-footer-col rh-col-brand">
          <div class="rh-footer-logo">
            <span class="rh-logo-dot"></span>
            <span class="rh-logo-text">Developer Resource Hub</span>
          </div>
          <p class="rh-footer-desc">
            A minimalist, high-contrast library of developer utilities, UI design systems, APIs, and open-source references.
          </p>
          <div class="rh-footer-badge-strip">
            <span class="rh-badge rh-badge-brand rh-tnum">MIT Open Source</span>
            <span class="rh-badge rh-badge-emerald rh-tnum">{{ totalCount }} Resources</span>
          </div>
        </div>

        <!-- Col 2: Explore Catalogs -->
        <div class="rh-footer-col">
          <h4 class="rh-footer-col-title">Explore</h4>
          <ul class="rh-footer-links">
            <li><a href="/resources/">All Resources</a></li>
            <li><a href="/resources/frontend/">Frontend Development</a></li>
            <li><a href="/resources/backend/">Backend & APIs</a></li>
            <li><a href="/resources/ai-tools/">AI Tools & Agents</a></li>
            <li><a href="/resources/design/">Design & UI</a></li>
            <li><a href="/categories">All 10 Categories</a></li>
          </ul>
        </div>

        <!-- Col 3: Community & Git -->
        <div class="rh-footer-col">
          <h4 class="rh-footer-col-title">Community</h4>
          <ul class="rh-footer-links">
            <li>
              <a href="https://github.com/azmil666/resource-hub" target="_blank" rel="noopener noreferrer">
                GitHub Repository ↗
              </a>
            </li>
            <li><a href="/contribute">Contribution Guide</a></li>
            <li>
              <a href="https://github.com/azmil666/resource-hub/issues" target="_blank" rel="noopener noreferrer">
                Submit an Issue ↗
              </a>
            </li>
            <li>
              <a href="https://github.com/azmil666/resource-hub/pulls" target="_blank" rel="noopener noreferrer">
                Pull Requests ↗
              </a>
            </li>
          </ul>
        </div>

        <!-- Col 4: Platform & Architecture -->
        <div class="rh-footer-col">
          <h4 class="rh-footer-col-title">Architecture</h4>
          <ul class="rh-footer-links">
            <li><span class="rh-footer-static-text">SSG on VitePress 1.6</span></li>
            <li><span class="rh-footer-static-text">Vue 3.5 Composition API</span></li>
            <li><span class="rh-footer-static-text">Git-Backed Markdown Store</span></li>
            <li><span class="rh-footer-static-text">Zero Tracking or Ads</span></li>
            <li><a href="/about">About This Project</a></li>
          </ul>
        </div>
      </div>

      <!-- Bottom Status Bar -->
      <div class="rh-footer-bottom-bar">
        <p class="rh-footer-copy">
          © {{ currentYear }} Developer Resource Hub Contributors. Released under the MIT License.
        </p>
        <div class="rh-footer-status">
          <span class="rh-status-pulse"></span>
          <span>Catalog verified • Edge deployed on Vercel</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.rh-landing-footer {
  width: 100%;
  border-top: 1px solid var(--rh-c-border);
  background-color: var(--rh-c-bg-subtle);
  padding: var(--rh-space-12) 0 var(--rh-space-10) 0;
  margin-top: var(--rh-space-16);
}

.rh-footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--rh-space-4);
}

@media (min-width: 768px) {
  .rh-footer-inner {
    padding: 0 var(--rh-space-6);
  }
}

.rh-footer-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: var(--rh-space-8);
  margin-bottom: var(--rh-space-12);
}

@media (min-width: 640px) {
  .rh-footer-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .rh-footer-grid {
    grid-template-columns: 2fr 1fr 1fr 1fr;
  }
}

.rh-col-brand {
  max-width: 360px;
}

.rh-footer-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 1.0625rem;
  letter-spacing: -0.025em;
  color: var(--rh-c-text-primary);
  margin-bottom: var(--rh-space-3);
}

.rh-logo-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--rh-c-brand);
}

.rh-footer-desc {
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--rh-c-text-secondary);
  margin: 0 0 var(--rh-space-4) 0;
}

.rh-footer-badge-strip {
  display: flex;
  gap: 8px;
}

.rh-footer-col-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--rh-c-text-tertiary);
  font-family: var(--rh-font-mono);
  margin: 0 0 var(--rh-space-4) 0;
}

.rh-footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--rh-space-2);
}

.rh-footer-links a {
  font-size: 0.84375rem;
  color: var(--rh-c-text-secondary);
  text-decoration: none !important;
  transition: color var(--rh-transition-fast);
}

.rh-footer-links a:hover {
  color: var(--rh-c-text-primary);
}

.rh-footer-static-text {
  font-size: 0.84375rem;
  color: var(--rh-c-text-tertiary);
}

.rh-footer-bottom-bar {
  display: flex;
  flex-direction: column;
  gap: var(--rh-space-3);
  padding-top: var(--rh-space-6);
  border-top: 1px solid var(--rh-c-border);
  font-size: 0.8125rem;
  color: var(--rh-c-text-tertiary);
}

@media (min-width: 640px) {
  .rh-footer-bottom-bar {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.rh-footer-copy {
  margin: 0;
}

.rh-footer-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rh-status-pulse {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--rh-color-emerald-text);
  box-shadow: 0 0 6px var(--rh-color-emerald-text);
}
</style>
