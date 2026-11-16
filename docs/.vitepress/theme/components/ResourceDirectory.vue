<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
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

// Active popover menus for custom filters
const openFilterMenu = ref<'type' | 'pricing' | 'sort' | null>(null);

// Pagination / Progressive Rendering: 36 initial items + 24 per load
const PAGE_SIZE = 36;
const displayLimit = ref(PAGE_SIZE);

// Sync with URL query parameters for deep linking
function syncFromUrl() {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  const tagParam = params.get('tag');
  const catParam = params.get('category');
  const typeParam = params.get('type');
  const pricingParam = params.get('pricing');
  const qParam = params.get('q');

  if (tagParam) selectedTag.value = tagParam;
  if (catParam && !props.initialCategory) selectedCategory.value = catParam;
  if (typeParam) selectedType.value = typeParam;
  if (pricingParam) selectedPricing.value = pricingParam;
  if (qParam) searchQuery.value = qParam;
}

function updateUrlQuery() {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams();
  if (searchQuery.value) params.set('q', searchQuery.value);
  if (selectedCategory.value && selectedCategory.value !== props.initialCategory) {
    params.set('category', selectedCategory.value);
  }
  if (selectedType.value) params.set('type', selectedType.value);
  if (selectedPricing.value) params.set('pricing', selectedPricing.value);
  if (selectedTag.value) params.set('tag', selectedTag.value);

  const queryStr = params.toString();
  const newUrl = queryStr ? `${window.location.pathname}?${queryStr}` : window.location.pathname;
  window.history.replaceState({}, '', newUrl);
}

// Global keyboard shortcuts
function handleGlobalKeydown(e: KeyboardEvent) {
  // Pressing '/' focuses filter input
  if (
    e.key === '/' &&
    !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)
  ) {
    e.preventDefault();
    searchInputRef.value?.focus();
    searchInputRef.value?.select();
  }
  // Pressing 'Escape' closes popovers and clears active search
  if (e.key === 'Escape') {
    if (openFilterMenu.value) {
      openFilterMenu.value = null;
    } else if (searchQuery.value) {
      searchQuery.value = '';
      searchInputRef.value?.blur();
    }
  }
}

// Click outside handler for popovers
function handleClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (!target.closest('.popover-container')) {
    openFilterMenu.value = null;
  }
}

onMounted(() => {
  syncFromUrl();
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleGlobalKeydown);
    window.addEventListener('click', handleClickOutside);
  }
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleGlobalKeydown);
    window.removeEventListener('click', handleClickOutside);
  }
});

// Reset display limit when filter criteria change
watch([searchQuery, selectedCategory, selectedType, selectedPricing, selectedTag, sortBy], () => {
  displayLimit.value = PAGE_SIZE;
  updateUrlQuery();
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

// Filtered and sorted master list
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

// Visible resources sliced for DOM performance
const visibleResources = computed(() => {
  return filteredResources.value.slice(0, displayLimit.value);
});

const hasMore = computed(() => {
  return visibleResources.value.length < filteredResources.value.length;
});

function loadMore() {
  displayLimit.value += 24;
}

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
  openFilterMenu.value = null;
  displayLimit.value = PAGE_SIZE;
  updateUrlQuery();
}

function selectCategory(slug: string) {
  selectedCategory.value = selectedCategory.value === slug ? '' : slug;
}

function handleTagSelect(tag: string) {
  selectedTag.value = selectedTag.value === tag ? '' : tag;
  // Scroll to top of directory smoothly
  const el = document.querySelector('.directory-view');
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

function togglePopover(name: 'type' | 'pricing' | 'sort') {
  openFilterMenu.value = openFilterMenu.value === name ? null : name;
}
</script>

<template>
  <div class="directory-view">
    <!-- Sticky Glassmorphic Filter Bar -->
    <header class="sticky-filter-shell">
      <div class="filter-glass-container">
        <!-- Top Search Row -->
        <div class="search-bar-wrap">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            ref="searchInputRef"
            v-model="searchQuery"
            type="text"
            placeholder="Search resources by title, stack, or tag... (Press / to focus)"
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

        <!-- Category Filter Pills -->
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

        <!-- Secondary Custom Popover Controls -->
        <div class="controls-pill-row">
          <div class="popover-filters-group">
            <!-- Type Popover -->
            <div class="popover-container">
              <button
                class="filter-pill-btn"
                :class="{ 'is-active': selectedType !== '' }"
                aria-haspopup="true"
                :aria-expanded="openFilterMenu === 'type'"
                @click.stop="togglePopover('type')"
              >
                <span>Type: <strong>{{ selectedType || 'All' }}</strong></span>
                <svg class="chevron-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>

              <div v-if="openFilterMenu === 'type'" class="popover-dropdown">
                <button
                  class="dropdown-item"
                  :class="{ 'is-selected': selectedType === '' }"
                  @click="selectedType = ''; openFilterMenu = null"
                >
                  All Types
                </button>
                <button
                  v-for="t in availableTypes"
                  :key="t"
                  class="dropdown-item"
                  :class="{ 'is-selected': selectedType === t }"
                  @click="selectedType = t; openFilterMenu = null"
                >
                  {{ t }}
                </button>
              </div>
            </div>

            <!-- Pricing Popover -->
            <div class="popover-container">
              <button
                class="filter-pill-btn"
                :class="{ 'is-active': selectedPricing !== '' }"
                aria-haspopup="true"
                :aria-expanded="openFilterMenu === 'pricing'"
                @click.stop="togglePopover('pricing')"
              >
                <span>Pricing: <strong>{{ selectedPricing || 'All' }}</strong></span>
                <svg class="chevron-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>

              <div v-if="openFilterMenu === 'pricing'" class="popover-dropdown">
                <button
                  class="dropdown-item"
                  :class="{ 'is-selected': selectedPricing === '' }"
                  @click="selectedPricing = ''; openFilterMenu = null"
                >
                  All Pricing
                </button>
                <button
                  v-for="p in ['free', 'freemium', 'paid', 'unknown']"
                  :key="p"
                  class="dropdown-item"
                  :class="{ 'is-selected': selectedPricing === p }"
                  @click="selectedPricing = p; openFilterMenu = null"
                >
                  <span class="pricing-label">{{ p }}</span>
                </button>
              </div>
            </div>

            <!-- Sort Popover -->
            <div class="popover-container">
              <button
                class="filter-pill-btn"
                aria-haspopup="true"
                :aria-expanded="openFilterMenu === 'sort'"
                @click.stop="togglePopover('sort')"
              >
                <span>Sort: <strong>{{ sortBy === 'title-asc' ? 'A to Z' : 'Z to A' }}</strong></span>
                <svg class="chevron-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>

              <div v-if="openFilterMenu === 'sort'" class="popover-dropdown">
                <button
                  class="dropdown-item"
                  :class="{ 'is-selected': sortBy === 'title-asc' }"
                  @click="sortBy = 'title-asc'; openFilterMenu = null"
                >
                  Alphabetical (A to Z)
                </button>
                <button
                  class="dropdown-item"
                  :class="{ 'is-selected': sortBy === 'title-desc' }"
                  @click="sortBy = 'title-desc'; openFilterMenu = null"
                >
                  Reverse (Z to A)
                </button>
              </div>
            </div>
          </div>

          <!-- Reset Action Button -->
          <button
            v-if="hasActiveFilters"
            class="reset-filters-pill"
            aria-label="Reset all filters"
            @click="resetFilters"
          >
            <span>Reset Filters</span>
            <span class="reset-count tabular-nums">({{ activeFilterCount }})</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Active Filter Status & Screen Reader Announcement -->
    <div class="directory-status-line" role="status" aria-live="polite">
      <span class="results-count tabular-nums">
        Showing <strong>{{ visibleResources.length }}</strong> of {{ filteredResources.length }} {{ filteredResources.length === 1 ? 'resource' : 'resources' }}
        <span v-if="filteredResources.length < allResources.length" class="filtered-total">
          (filtered from {{ allResources.length }})
        </span>
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

    <!-- Strict Directory Grid -->
    <div v-if="visibleResources.length > 0" class="directory-grid">
      <ResourceCard
        v-for="res in visibleResources"
        :key="res.urlPath"
        :resource="res"
        @select-tag="handleTagSelect"
      />
    </div>

    <!-- Progressive Loading: Load More Button -->
    <div v-if="hasMore" class="load-more-container">
      <button class="load-more-btn" @click="loadMore">
        <span>Load More Resources</span>
        <span class="load-count tabular-nums">
          ({{ filteredResources.length - visibleResources.length }} remaining)
        </span>
      </button>
    </div>

    <!-- Premium Vercel / Linear Empty State -->
    <div v-if="filteredResources.length === 0" class="directory-empty-state">
      <div class="empty-icon-box">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
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
            : 'No developer tools or references match your active search terms and selected filters.'
        }}
      </p>
      <div class="empty-button-row">
        <button v-if="hasActiveFilters" class="btn-solid-small" @click="resetFilters">
          Clear All Filters
        </button>
        <a href="/contribute" class="btn-outline-small">
          Suggest a Resource →
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.directory-view {
  margin: 1rem 0 3.5rem 0;
}

/* Sticky Glassmorphic Filter Shell */
.sticky-filter-shell {
  position: sticky;
  top: calc(var(--vp-nav-height, 64px) + 0.5rem);
  z-index: 20;
  margin-bottom: 1.5rem;
}

.filter-glass-container {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding: 1rem 1.15rem;
  background-color: var(--hub-glass-bg);
  backdrop-filter: var(--hub-glass-blur);
  -webkit-backdrop-filter: var(--hub-glass-blur);
  border: 1px solid var(--hub-glass-border);
  border-radius: var(--hub-card-radius, 10px);
  box-shadow: 0 12px 32px -8px rgba(0, 0, 0, 0.4), var(--hub-card-shadow);
  transition: border-color var(--hub-transition);
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
  padding: 0.7rem 3rem 0.7rem 2.6rem;
  background-color: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
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
  border-radius: 4px;
  padding: 2px 7px;
  color: var(--vp-c-text-3);
}

.clear-input-btn {
  background: none;
  border: none;
  color: var(--vp-c-text-3);
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0 0.35rem;
  line-height: 1;
  transition: color var(--hub-transition);
}

.clear-input-btn:hover {
  color: var(--vp-c-text-1);
}

/* Category Tabs */
.category-tabs-wrap {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  overflow-x: auto;
  padding-bottom: 0.2rem;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
}

.category-tab {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.4rem 0.85rem;
  min-height: 36px;
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
  background-color: rgba(0, 0, 0, 0.25);
  color: var(--vp-c-bg);
}

.dark .category-tab.is-active .tab-count {
  background-color: rgba(0, 0, 0, 0.35);
  color: #000000;
}

/* Popover Controls Row */
.controls-pill-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
  padding-top: 0.65rem;
  border-top: 1px solid var(--vp-c-divider);
}

.popover-filters-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.popover-container {
  position: relative;
}

.filter-pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.4rem 0.8rem;
  min-height: 36px;
  background-color: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  color: var(--vp-c-text-2);
  font-size: 0.78rem;
  font-weight: 500;
  cursor: pointer;
  transition: border-color var(--hub-transition), color var(--hub-transition);
}

.filter-pill-btn:hover,
.filter-pill-btn.is-active {
  border-color: var(--vp-c-border-hover);
  color: var(--vp-c-text-1);
}

.filter-pill-btn.is-active {
  border-color: var(--vp-c-brand-1);
}

.chevron-icon {
  color: var(--vp-c-text-3);
  transition: transform var(--hub-transition);
}

.filter-pill-btn[aria-expanded="true"] .chevron-icon {
  transform: rotate(180deg);
}

.popover-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 50;
  min-width: 170px;
  background-color: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  box-shadow: 0 16px 36px -4px rgba(0, 0, 0, 0.6);
  padding: 4px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  font-size: 0.78rem;
  color: var(--vp-c-text-2);
  background: transparent;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-align: left;
  transition: background-color var(--hub-transition), color var(--hub-transition);
}

.dropdown-item:hover {
  background-color: var(--vp-c-bg-hover);
  color: var(--vp-c-text-1);
}

.dropdown-item.is-selected {
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-weight: 600;
}

.reset-filters-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.8rem;
  min-height: 36px;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  color: var(--vp-c-text-2);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: color var(--hub-transition), border-color var(--hub-transition);
}

.reset-filters-pill:hover {
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
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}

.results-count {
  font-size: 0.84rem;
  color: var(--vp-c-text-2);
}

.results-count strong {
  color: var(--vp-c-text-1);
  font-weight: 600;
}

.filtered-total {
  color: var(--vp-c-text-3);
  font-size: 0.78rem;
  margin-left: 0.25rem;
}

.active-chips {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.active-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.72rem;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-2);
  padding: 3px 8px;
  border-radius: 4px;
}

.chip-remove {
  background: none;
  border: none;
  color: var(--vp-c-text-3);
  cursor: pointer;
  font-size: 1rem;
  padding: 0 2px;
  line-height: 1;
}

.chip-remove:hover {
  color: var(--vp-c-text-1);
}

/* Directory Grid */
.directory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.15rem;
}

/* Progressive Loading Container */
.load-more-container {
  display: flex;
  justify-content: center;
  margin-top: 2.5rem;
}

.load-more-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.7rem 1.6rem;
  min-height: 44px;
  background-color: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  color: var(--vp-c-text-1);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: var(--hub-card-shadow);
  transition: border-color var(--hub-transition), transform var(--hub-transition), box-shadow var(--hub-transition);
}

.load-more-btn:hover {
  border-color: var(--vp-c-border-hover);
  transform: translateY(-1px);
  box-shadow: var(--hub-card-shadow-hover);
}

.load-count {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
}

/* Premium Empty State */
.directory-empty-state {
  padding: 4rem 1.5rem;
  text-align: center;
  background-color: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: var(--hub-card-radius, 10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
}

.empty-icon-box {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-3);
  margin-bottom: 1.25rem;
  border: 1px solid var(--vp-c-border);
}

.empty-heading {
  margin: 0 0 0.45rem 0;
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.empty-message {
  margin: 0 auto 1.75rem auto;
  max-width: 440px;
  font-size: 0.88rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.empty-button-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-solid-small {
  font-size: 0.82rem;
  font-weight: 600;
  padding: 0.55rem 1.15rem;
  min-height: 40px;
  background-color: var(--vp-c-brand-1);
  color: var(--vp-c-bg) !important;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: opacity var(--hub-transition);
}

.btn-solid-small:hover {
  opacity: 0.9;
}

.btn-outline-small {
  font-size: 0.82rem;
  font-weight: 500;
  padding: 0.55rem 1.15rem;
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  background-color: var(--vp-c-bg-elv);
  color: var(--vp-c-text-1) !important;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
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
  .controls-pill-row {
    flex-direction: column;
    align-items: flex-start;
  }
  .sticky-filter-shell {
    top: calc(var(--vp-nav-height, 64px) + 0.25rem);
  }
}
</style>
