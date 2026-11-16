<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { data as allResources } from '../data/resources.data';
import { CATEGORIES, getCategory } from '../data/categories';
import ResourceCard from './ResourceCard.vue';

const props = withDefaults(
  defineProps<{
    initialCategory?: string;
  }>(),
  {
    initialCategory: ''
  }
);

const searchInputRef = ref<HTMLInputElement | null>(null);
const searchQuery = ref('');
const selectedCategory = ref(props.initialCategory);
const selectedType = ref('');
const selectedPricing = ref('');
const selectedTag = ref('');
const sortBy = ref<'title-asc' | 'title-desc'>('title-asc');

// Global shortcut '/' to focus directory search
function handleGlobalKeydown(e: KeyboardEvent) {
  if (
    e.key === '/' &&
    !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)
  ) {
    e.preventDefault();
    searchInputRef.value?.focus();
    searchInputRef.value?.select();
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleGlobalKeydown);
  }
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleGlobalKeydown);
  }
});

// Types derived dynamically from data
const availableTypes = computed(() => {
  const set = new Set<string>();
  allResources.forEach(r => {
    if (r.type) set.add(r.type);
  });
  return Array.from(set).sort();
});

// Category counts
const categoryCounts = computed(() => {
  const map: Record<string, number> = {};
  allResources.forEach(r => {
    map[r.category] = (map[r.category] || 0) + 1;
  });
  return map;
});

// Filtered and sorted resources
const filteredResources = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();

  return allResources
    .filter(res => {
      // Category filter
      if (selectedCategory.value && res.category !== selectedCategory.value) {
        return false;
      }

      // Type filter
      if (selectedType.value && res.type !== selectedType.value) {
        return false;
      }

      // Pricing filter
      if (selectedPricing.value && res.pricing !== selectedPricing.value) {
        return false;
      }

      // Tag filter
      if (selectedTag.value && !res.tags.includes(selectedTag.value)) {
        return false;
      }

      // Search query
      if (query) {
        const inTitle = res.title.toLowerCase().includes(query);
        const inDesc = res.description.toLowerCase().includes(query);
        const inTags = res.tags.some(t => t.toLowerCase().includes(query));
        const inType = res.type.toLowerCase().includes(query);
        const inUrl = res.url.toLowerCase().includes(query);
        if (!inTitle && !inDesc && !inTags && !inType && !inUrl) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy.value === 'title-asc') {
        return a.title.localeCompare(b.title);
      }
      return b.title.localeCompare(a.title);
    });
});

const activeFilterCount = computed(() => {
  let count = 0;
  if (searchQuery.value) count++;
  if (selectedCategory.value && selectedCategory.value !== props.initialCategory) count++;
  if (selectedType.value) count++;
  if (selectedPricing.value) count++;
  if (selectedTag.value) count++;
  return count;
});

const hasActiveFilters = computed(() => activeFilterCount.value > 0);

function resetFilters() {
  searchQuery.value = '';
  selectedCategory.value = props.initialCategory;
  selectedType.value = '';
  selectedPricing.value = '';
  selectedTag.value = '';
  sortBy.value = 'title-asc';
}

function selectCategory(slug: string) {
  selectedCategory.value = selectedCategory.value === slug ? '' : slug;
}
</script>

<template>
  <div class="directory-view">
    <!-- Filter Control Panel -->
    <div class="filter-panel">
      <!-- Search Input -->
      <div class="search-bar-wrap">
        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.3-4.3"/>
        </svg>
        <input
          ref="searchInputRef"
          v-model="searchQuery"
          type="text"
          placeholder="Filter resources by title, description, or tag... (Press / to focus)"
          class="directory-search-input"
          aria-label="Filter resources"
        />
        <div class="search-trailing">
          <button
            v-if="searchQuery"
            class="clear-input-btn"
            title="Clear search"
            aria-label="Clear search"
            @click="searchQuery = ''"
          >
            ×
          </button>
          <kbd v-else class="key-indicator">/</kbd>
        </div>
      </div>

      <!-- Category Filter Pills (Airbnb scrollable/wrap + Linear high-contrast active state) -->
      <div v-if="!initialCategory" class="category-tabs-wrap" role="tablist" aria-label="Category filter tabs">
        <button
          class="category-tab"
          :class="{ 'is-active': selectedCategory === '' }"
          role="tab"
          :aria-selected="selectedCategory === ''"
          @click="selectedCategory = ''"
        >
          <span>All</span>
          <span class="tab-count tabular-nums">{{ allResources.length }}</span>
        </button>
        <button
          v-for="cat in CATEGORIES"
          :key="cat.slug"
          class="category-tab"
          :class="{ 'is-active': selectedCategory === cat.slug }"
          role="tab"
          :aria-selected="selectedCategory === cat.slug"
          @click="selectCategory(cat.slug)"
        >
          <span>{{ cat.name }}</span>
          <span class="tab-count tabular-nums">{{ categoryCounts[cat.slug] || 0 }}</span>
        </button>
      </div>

      <!-- Secondary Controls Row (Type, Pricing, Sort, Reset) -->
      <div class="secondary-controls-row">
        <div class="select-filters-group">
          <div class="control-group">
            <label class="control-label" for="type-filter">Type</label>
            <select id="type-filter" v-model="selectedType" class="control-select">
              <option value="">All Types</option>
              <option v-for="t in availableTypes" :key="t" :value="t">
                {{ t }}
              </option>
            </select>
          </div>

          <div class="control-group">
            <label class="control-label" for="pricing-filter">Pricing</label>
            <select id="pricing-filter" v-model="selectedPricing" class="control-select">
              <option value="">All Pricing</option>
              <option value="free">Free</option>
              <option value="freemium">Freemium</option>
              <option value="paid">Paid</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>

          <div class="control-group">
            <label class="control-label" for="sort-order">Sort</label>
            <select id="sort-order" v-model="sortBy" class="control-select">
              <option value="title-asc">A to Z</option>
              <option value="title-desc">Z to A</option>
            </select>
          </div>
        </div>

        <button
          v-if="hasActiveFilters"
          class="reset-filters-btn"
          @click="resetFilters"
        >
          <span>Reset Filters</span>
          <span class="reset-count tabular-nums">({{ activeFilterCount }})</span>
        </button>
      </div>
    </div>

    <!-- Active Filter Status & Count Line -->
    <div class="directory-status-line">
      <span class="results-count tabular-nums">
        Showing <strong>{{ filteredResources.length }}</strong> of {{ allResources.length }} {{ allResources.length === 1 ? 'resource' : 'resources' }}
      </span>

      <div v-if="hasActiveFilters" class="active-chips">
        <span v-if="selectedCategory && !initialCategory" class="active-chip">
          Category: {{ getCategory(selectedCategory).name }}
          <button class="chip-remove" aria-label="Remove category filter" @click="selectedCategory = ''">×</button>
        </span>
        <span v-if="selectedType" class="active-chip">
          Type: {{ selectedType }}
          <button class="chip-remove" aria-label="Remove type filter" @click="selectedType = ''">×</button>
        </span>
        <span v-if="selectedPricing" class="active-chip">
          Pricing: {{ selectedPricing }}
          <button class="chip-remove" aria-label="Remove pricing filter" @click="selectedPricing = ''">×</button>
        </span>
        <span v-if="selectedTag" class="active-chip">
          Tag: #{{ selectedTag }}
          <button class="chip-remove" aria-label="Remove tag filter" @click="selectedTag = ''">×</button>
        </span>
      </div>
    </div>

    <!-- Resources Strict Grid -->
    <div v-if="filteredResources.length > 0" class="directory-grid">
      <ResourceCard
        v-for="res in filteredResources"
        :key="res.urlPath"
        :resource="res"
      />
    </div>

    <!-- Minimalist Empty State -->
    <div v-else class="directory-empty-state">
      <div class="empty-icon-box">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          <line x1="11" y1="8" x2="11" y2="14"/>
          <line x1="8" y1="11" x2="14" y2="11"/>
        </svg>
      </div>
      <h3 class="empty-heading">No matching resources found</h3>
      <p class="empty-message">
        {{
          allResources.length === 0
            ? 'The resource collection is currently being cataloged.'
            : 'No resources match your active search terms or selected filters.'
        }}
      </p>
      <div class="empty-button-row">
        <button v-if="hasActiveFilters" class="btn-solid-small" @click="resetFilters">
          Clear Filters
        </button>
        <a href="/contribute" class="btn-outline-small">
          Suggest a Resource
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.directory-view {
  margin: 1.5rem 0 3rem 0;
}

/* Filter Panel Container */
.filter-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem;
  background-color: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: var(--hub-card-radius, 8px);
  box-shadow: var(--hub-card-shadow);
  margin-bottom: 1.25rem;
}

/* Search Bar Wrap */
.search-bar-wrap {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 0.95rem;
  color: var(--vp-c-text-3);
  pointer-events: none;
}

.directory-search-input {
  width: 100%;
  padding: 0.65rem 3rem 0.65rem 2.6rem;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  color: var(--vp-c-text-1);
  font-size: 0.88rem;
  font-family: var(--vp-font-family-base);
  transition: border-color var(--hub-transition), box-shadow var(--hub-transition);
}

.directory-search-input:focus {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 1px var(--vp-c-brand-1);
  outline: none;
}

.search-trailing {
  position: absolute;
  right: 0.75rem;
  display: flex;
  align-items: center;
}

.key-indicator {
  font-size: 0.72rem;
  font-family: var(--vp-font-family-mono);
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 3px;
  padding: 1px 6px;
  color: var(--vp-c-text-3);
}

.clear-input-btn {
  background: none;
  border: none;
  color: var(--vp-c-text-3);
  font-size: 1.15rem;
  cursor: pointer;
  padding: 0 0.25rem;
  line-height: 1;
  transition: color var(--hub-transition);
}

.clear-input-btn:hover {
  color: var(--vp-c-text-1);
}

/* Category Tabs (Active high-contrast Vercel style) */
.category-tabs-wrap {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
}

.category-tab {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.35rem 0.75rem;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background-color var(--hub-transition), color var(--hub-transition), border-color var(--hub-transition);
}

.category-tab:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-border-hover);
  background-color: var(--vp-c-bg-hover);
}

/* High-Contrast Active Category Pill */
.category-tab.is-active {
  background-color: var(--vp-c-brand-1);
  color: var(--vp-c-bg) !important;
  border-color: var(--vp-c-brand-1);
  font-weight: 600;
}

.tab-count {
  font-size: 0.7rem;
  font-family: var(--vp-font-family-mono);
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-3);
  padding: 1px 5px;
  border-radius: 3px;
  transition: background-color var(--hub-transition), color var(--hub-transition);
}

.category-tab.is-active .tab-count {
  background-color: rgba(0, 0, 0, 0.2);
  color: var(--vp-c-bg);
}

.dark .category-tab.is-active .tab-count {
  background-color: rgba(0, 0, 0, 0.25);
  color: #000000;
}

/* Secondary Controls Row */
.secondary-controls-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
  padding-top: 0.65rem;
  border-top: 1px solid var(--vp-c-divider);
}

.select-filters-group {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.control-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.control-select {
  padding: 0.3rem 0.65rem;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 5px;
  color: var(--vp-c-text-1);
  font-size: 0.78rem;
  font-family: var(--vp-font-family-base);
  cursor: pointer;
  transition: border-color var(--hub-transition);
}

.control-select:focus {
  border-color: var(--vp-c-brand-1);
  outline: none;
}

.reset-filters-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.65rem;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 5px;
  color: var(--vp-c-text-2);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: color var(--hub-transition), border-color var(--hub-transition);
}

.reset-filters-btn:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-border-hover);
}

.reset-count {
  font-family: var(--vp-font-family-mono);
  font-size: 0.72rem;
}

/* Status Line & Active Chips */
.directory-status-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.results-count {
  font-size: 0.82rem;
  color: var(--vp-c-text-2);
}

.results-count strong {
  color: var(--vp-c-text-1);
  font-weight: 600;
}

.active-chips {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.active-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.72rem;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-2);
  padding: 2px 7px;
  border-radius: 4px;
}

.chip-remove {
  background: none;
  border: none;
  color: var(--vp-c-text-3);
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0;
  line-height: 1;
}

.chip-remove:hover {
  color: var(--vp-c-text-1);
}

/* Strict Directory Grid */
.directory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1rem;
}

/* Empty State */
.directory-empty-state {
  padding: 3.5rem 1.5rem;
  text-align: center;
  background-color: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: var(--hub-card-radius, 8px);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
}

.empty-icon-box {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-3);
  margin-bottom: 1rem;
}

.empty-heading {
  margin: 0 0 0.35rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.empty-message {
  margin: 0 auto 1.5rem auto;
  max-width: 440px;
  font-size: 0.86rem;
  line-height: 1.55;
  color: var(--vp-c-text-2);
}

.empty-button-row {
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
  border: none;
  cursor: pointer;
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

/* Responsive */
@media (max-width: 640px) {
  .directory-grid {
    grid-template-columns: 1fr;
  }
  .secondary-controls-row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
