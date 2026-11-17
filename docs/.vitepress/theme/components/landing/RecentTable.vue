<script setup lang="ts">
import { computed } from 'vue';
import { data as allResources } from '../../data/resources.data';
import { getCategory } from '../../data/categories';
import { getCtaLabel } from '../../utils/cta';

const recentItems = computed(() => {
  return [...allResources]
    .sort((a, b) => (b.dateAdded || '').localeCompare(a.dateAdded || ''))
    .slice(0, 8);
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

function getDomain(urlStr: string) {
  if (!urlStr) return '';
  try {
    return new URL(urlStr).hostname.replace(/^www\./, '');
  } catch {
    return urlStr;
  }
}
</script>

<template>
  <section class="rh-recent-section rh-cv-auto" aria-labelledby="recent-heading">
    <div class="rh-section-header-row">
      <div>
        <div class="rh-section-eyebrow">CHRONOLOGICAL FEED</div>
        <h2 id="recent-heading" class="rh-section-title">Recently Added</h2>
        <p class="rh-section-subtitle">
          The latest validated tools, libraries, and design assets indexed in the community repository.
        </p>
      </div>
      <a href="/resources/" class="rh-btn rh-btn-secondary rh-btn-sm rh-view-all-link">
        <span>See all ({{ allResources.length }})</span>
        <span aria-hidden="true">→</span>
      </a>
    </div>

    <!-- Compact Row-Based Feed Table -->
    <div class="rh-card rh-recent-table-card">
      <div class="rh-recent-table">
        <div class="rh-recent-thead" aria-hidden="true">
          <div class="rh-th rh-th-name">Resource</div>
          <div class="rh-th rh-th-cat">Category</div>
          <div class="rh-th rh-th-price">Model</div>
          <div class="rh-th rh-th-date">Added</div>
          <div class="rh-th rh-th-action">Action</div>
        </div>

        <div
          v-for="item in recentItems"
          :key="item.urlPath"
          class="rh-recent-row"
        >
          <!-- Col 1: Title & Domain -->
          <div class="rh-td rh-td-name">
            <a :href="item.urlPath" class="rh-row-title-link">
              <span class="rh-row-title">{{ item.title }}</span>
            </a>
            <span class="rh-row-domain">{{ getDomain(item.url) }}</span>
          </div>

          <!-- Col 2: Category Pill -->
          <div class="rh-td rh-td-cat">
            <a :href="`/resources/${item.category}/`" class="rh-row-cat-link">
              <span
                class="rh-row-cat-dot"
                :style="{ backgroundColor: categoryAccents[item.category] || 'var(--rh-c-brand)' }"
                aria-hidden="true"
              ></span>
              <span>{{ getCategory(item.category).name }}</span>
            </a>
          </div>

          <!-- Col 3: Pricing Badge -->
          <div class="rh-td rh-td-price">
            <span
              class="rh-badge"
              :class="`rh-badge-${item.pricing === 'free' ? 'emerald' : item.pricing === 'freemium' ? 'amber' : item.pricing === 'paid' ? 'rose' : 'slate'}`"
            >
              {{ item.pricing }}
            </span>
          </div>

          <!-- Col 4: Added Date -->
          <div class="rh-td rh-td-date">
            <span class="rh-tnum rh-row-date">{{ item.dateAdded || 'Recent' }}</span>
          </div>

          <!-- Col 5: External Direct Link -->
          <div class="rh-td rh-td-action">
            <a
              v-if="item.url"
              :href="item.url"
              target="_blank"
              rel="noopener noreferrer"
              class="rh-btn rh-btn-ghost rh-btn-sm rh-row-visit-btn"
              :title="`${getCtaLabel(item).label}: ${item.title}`"
              :aria-label="`${getCtaLabel(item).label} for ${item.title} (opens in a new tab)`"
            >
              <span>{{ getCtaLabel(item).label }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="7" y1="17" x2="17" y2="7"/>
                <polyline points="7 7 17 7 17 17"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.rh-recent-section {
  width: 100%;
  max-width: 1200px;
  margin: var(--rh-space-12) auto;
  padding: 0 var(--rh-space-4);
}

@media (min-width: 768px) {
  .rh-recent-section {
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

/* Compact Table Layout */
.rh-recent-table-card {
  padding: 0;
  overflow: hidden;
  background-color: var(--rh-c-bg-surface);
  border: 1px solid var(--rh-c-border);
  border-radius: var(--rh-radius-lg);
  box-shadow: var(--rh-shadow-sm);
}

.rh-recent-table {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.rh-recent-thead {
  display: none;
  padding: 10px 16px;
  background-color: var(--rh-c-bg-subtle);
  border-bottom: 1px solid var(--rh-c-border);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--rh-c-text-tertiary);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

@media (min-width: 768px) {
  .rh-recent-thead {
    display: grid;
    grid-template-columns: 2.2fr 1.4fr 1fr 1fr 0.8fr;
    align-items: center;
  }
}

.rh-recent-row {
  display: flex;
  flex-direction: column;
  gap: var(--rh-space-2);
  padding: 14px 16px;
  border-bottom: 1px solid var(--rh-c-border-subtle);
  transition: background-color var(--rh-transition-fast);
}

.rh-recent-row:last-child {
  border-bottom: none;
}

.rh-recent-row:hover {
  background-color: var(--rh-c-bg-hover);
}

@media (min-width: 768px) {
  .rh-recent-row {
    display: grid;
    grid-template-columns: 2.2fr 1.4fr 1fr 1fr 0.8fr;
    align-items: center;
    padding: 12px 16px;
  }
}

.rh-td-name {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rh-row-title-link {
  text-decoration: none !important;
  color: var(--rh-c-text-primary);
  font-weight: 600;
  font-size: 0.9375rem;
  overflow-wrap: anywhere;
  transition: color var(--rh-transition-fast);
}

.rh-row-title-link:hover {
  color: var(--rh-c-brand);
}

.rh-row-domain {
  font-size: 0.75rem;
  color: var(--rh-c-text-tertiary);
  font-family: var(--rh-font-mono);
}

.rh-td-cat {
  display: flex;
  align-items: center;
}

.rh-row-cat-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  color: var(--rh-c-text-secondary);
  text-decoration: none !important;
}

.rh-row-cat-link:hover {
  color: var(--rh-c-text-primary);
}

.rh-row-cat-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.rh-td-price {
  display: flex;
  align-items: center;
}

.rh-td-date {
  font-size: 0.8125rem;
  color: var(--rh-c-text-tertiary);
}

.rh-td-action {
  display: flex;
  justify-content: flex-start;
}

@media (min-width: 768px) {
  .rh-td-action {
    justify-content: flex-end;
  }
}

.rh-row-visit-btn {
  height: 28px;
  padding: 0 8px;
  font-size: 0.75rem;
}
</style>
