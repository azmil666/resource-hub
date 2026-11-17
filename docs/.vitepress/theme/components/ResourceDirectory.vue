<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { data as allResources } from '../data/resources.data';
import { CATEGORIES, getCategory } from '../data/categories';
import ResourceCard from './ResourceCard.vue';
import { FEATURED_SORT_LABEL } from '../utils/labels';

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
const sortBy = ref<'title-asc' | 'title-desc' | 'newest' | 'featured'>('title-asc');

// View mode: 'grid' | 'list' (persisted in localStorage)
const viewMode = ref<'grid' | 'list'>('grid');

// Active popover menus for custom filters
const openFilterMenu = ref<'category' | 'type' | 'pricing' | 'sort' | null>(null);

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
  const sortParam = params.get('sort');

  if (tagParam) selectedTag.value = tagParam;
  if (catParam && !props.initialCategory) selectedCategory.value = catParam;
  if (typeParam) selectedType.value = typeParam;
  if (pricingParam) selectedPricing.value = pricingParam;
  if (qParam) searchQuery.value = qParam;
  if (sortParam && ['title-asc', 'title-desc', 'newest', 'featured'].includes(sortParam)) {
    sortBy.value = sortParam as any;
  }
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
  if (sortBy.value && sortBy.value !== 'title-asc') params.set('sort', sortBy.value);

  const queryStr = params.toString();
  const newUrl = queryStr ? `${window.location.pathname}?${queryStr}` : window.location.pathname;
  window.history.replaceState({}, '', newUrl);
}

// Global keyboard shortcuts
function handleGlobalKeydown(e: KeyboardEvent) {
  // Pressing '/' focuses search input
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
  if (!target.closest('.rh-popover-root')) {
    openFilterMenu.value = null;
  }
}

onMounted(() => {
  syncFromUrl();
  try {
    const savedMode = localStorage.getItem('rh-view-mode');
    if (savedMode === 'grid' || savedMode === 'list') {
      viewMode.value = savedMode;
    }
  } catch (_) {}

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

function setViewMode(mode: 'grid' | 'list') {
  viewMode.value = mode;
  try {
    localStorage.setItem('rh-view-mode', mode);
  } catch (_) {}
}

// Reset display limit when filter criteria change
watch([searchQuery, selectedCategory, selectedType, selectedPricing, selectedTag, sortBy], () => {
  displayLimit.value = PAGE_SIZE;
  updateUrlQuery();
});

// Dynamic types derived from catalog
const availableTypes = computed(() => {
  const set = new Set<string>();
  allResources.forEach(r => {
    if (r.type) set.add(r.type);
  });
  return Array.from(set).sort();
});

// Dynamic category counts map
const categoryCountMap = computed(() => {
  const map: Record<string, number> = {};
  allResources.forEach(r => {
    map[r.category] = (map[r.category] || 0) + 1;
  });
  return map;
});

// Filtered and sorted master collection
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
      // Search query (fuzzy match title, description, tags, type, url)
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
      if (sortBy.value === 'title-desc') {
        return b.title.localeCompare(a.title);
      }
      if (sortBy.value === 'newest') {
        return (b.dateAdded || '').localeCompare(a.dateAdded || '');
      }
      if (sortBy.value === 'featured') {
        if (a.featured === b.featured) {
          return a.title.localeCompare(b.title);
        }
        return a.featured ? -1 : 1;
      }
      return 0;
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
  openFilterMenu.value = null;
}

function selectType(t: string) {
  selectedType.value = selectedType.value === t ? '' : t;
  openFilterMenu.value = null;
}

function selectPricing(p: string) {
  selectedPricing.value = selectedPricing.value === p ? '' : p;
  openFilterMenu.value = null;
}

function selectSort(s: 'title-asc' | 'title-desc' | 'newest' | 'featured') {
  sortBy.value = s;
  openFilterMenu.value = null;
}

function handleTagSelect(tag: string) {
  selectedTag.value = selectedTag.value === tag ? '' : tag;
  const el = document.querySelector('.rh-directory-root');
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

function togglePopover(name: 'category' | 'type' | 'pricing' | 'sort') {
  openFilterMenu.value = openFilterMenu.value === name ? null : name;
}
</script>

<template>
  <div class="rh-directory-root">
    <!-- 1. STICKY FILTER TOOLBAR -->
    <div class="rh-filter-toolbar">
      <div class="rh-toolbar-main">
        <!-- Search Field -->
        <div class="rh-search-wrapper">
          <svg class="rh-search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            ref="searchInputRef"
            v-model="searchQuery"
            type="text"
            class="rh-search-input"
            placeholder="Filter by keyword, library, or tag..."
            aria-label="Filter resources by keyword"
          />
          <button
            v-if="searchQuery"
            class="rh-clear-btn"
            title="Clear search"
            aria-label="Clear search input"
            @click="searchQuery = ''; searchInputRef?.focus();"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <kbd v-else class="rh-kbd" title="Press / to search">/</kbd>
        </div>

        <!-- Filter Pill Dropdowns -->
        <div class="rh-pill-group">
          <!-- Category Filter Pill (Only when not in fixed category page) -->
          <div v-if="!props.initialCategory" class="rh-popover-root">
            <button
              class="rh-btn rh-btn-sm rh-pill-btn"
              :class="{ 'rh-pill-active': selectedCategory }"
              @click="togglePopover('category')"
              aria-haspopup="true"
              :aria-expanded="openFilterMenu === 'category'"
            >
              <span>{{ selectedCategory ? getCategory(selectedCategory).name : 'All Categories' }}</span>
              <svg class="rh-pill-caret" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            <div v-if="openFilterMenu === 'category'" class="rh-card rh-popover-menu">
              <div class="rh-popover-header">Categories</div>
              <button
                class="rh-popover-item"
                :class="{ 'is-selected': !selectedCategory }"
                @click="selectCategory('')"
              >
                <span>All Categories</span>
                <span class="rh-tnum rh-item-count">{{ allResources.length }}</span>
              </button>
              <button
                v-for="cat in CATEGORIES"
                :key="cat.slug"
                class="rh-popover-item"
                :class="{ 'is-selected': selectedCategory === cat.slug }"
                @click="selectCategory(cat.slug)"
              >
                <span>{{ cat.name }}</span>
                <span class="rh-tnum rh-item-count">{{ categoryCountMap[cat.slug] || 0 }}</span>
              </button>
            </div>
          </div>

          <!-- Type Filter Pill -->
          <div class="rh-popover-root">
            <button
              class="rh-btn rh-btn-sm rh-pill-btn"
              :class="{ 'rh-pill-active': selectedType }"
              @click="togglePopover('type')"
              aria-haspopup="true"
              :aria-expanded="openFilterMenu === 'type'"
            >
              <span style="text-transform: capitalize;">{{ selectedType || 'All Types' }}</span>
              <svg class="rh-pill-caret" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            <div v-if="openFilterMenu === 'type'" class="rh-card rh-popover-menu">
              <div class="rh-popover-header">Resource Type</div>
              <button
                class="rh-popover-item"
                :class="{ 'is-selected': !selectedType }"
                @click="selectType('')"
              >
                <span>All Types</span>
              </button>
              <button
                v-for="t in availableTypes"
                :key="t"
                class="rh-popover-item"
                :class="{ 'is-selected': selectedType === t }"
                @click="selectType(t)"
                style="text-transform: capitalize;"
              >
                <span>{{ t }}</span>
              </button>
            </div>
          </div>

          <!-- Pricing Filter Pill -->
          <div class="rh-popover-root">
            <button
              class="rh-btn rh-btn-sm rh-pill-btn"
              :class="{ 'rh-pill-active': selectedPricing }"
              @click="togglePopover('pricing')"
              aria-haspopup="true"
              :aria-expanded="openFilterMenu === 'pricing'"
            >
              <span style="text-transform: capitalize;">{{ selectedPricing || 'All Pricing' }}</span>
              <svg class="rh-pill-caret" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            <div v-if="openFilterMenu === 'pricing'" class="rh-card rh-popover-menu">
              <div class="rh-popover-header">Pricing Model</div>
              <button
                class="rh-popover-item"
                :class="{ 'is-selected': !selectedPricing }"
                @click="selectPricing('')"
              >
                <span>All Pricing</span>
              </button>
              <button
                class="rh-popover-item"
                :class="{ 'is-selected': selectedPricing === 'free' }"
                @click="selectPricing('free')"
              >
                <span class="rh-badge rh-badge-emerald" style="padding: 1px 6px;">Free</span>
              </button>
              <button
                class="rh-popover-item"
                :class="{ 'is-selected': selectedPricing === 'freemium' }"
                @click="selectPricing('freemium')"
              >
                <span class="rh-badge rh-badge-amber" style="padding: 1px 6px;">Freemium</span>
              </button>
              <button
                class="rh-popover-item"
                :class="{ 'is-selected': selectedPricing === 'paid' }"
                @click="selectPricing('paid')"
              >
                <span class="rh-badge rh-badge-rose" style="padding: 1px 6px;">Paid</span>
              </button>
            </div>
          </div>

          <!-- Sort Selector -->
          <div class="rh-popover-root">
            <button
              class="rh-btn rh-btn-sm rh-pill-btn"
              @click="togglePopover('sort')"
              aria-haspopup="true"
              :aria-expanded="openFilterMenu === 'sort'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="21" y1="10" x2="3" y2="10"/>
                <line x1="21" y1="6" x2="3" y2="6"/>
                <line x1="21" y1="14" x2="3" y2="14"/>
                <line x1="21" y1="18" x2="3" y2="18"/>
              </svg>
              <span>Sort</span>
              <svg class="rh-pill-caret" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            <div v-if="openFilterMenu === 'sort'" class="rh-card rh-popover-menu">
              <div class="rh-popover-header">Sort Order</div>
              <button
                class="rh-popover-item"
                :class="{ 'is-selected': sortBy === 'title-asc' }"
                @click="selectSort('title-asc')"
              >
                <span>Name (A–Z)</span>
              </button>
              <button
                class="rh-popover-item"
                :class="{ 'is-selected': sortBy === 'title-desc' }"
                @click="selectSort('title-desc')"
              >
                <span>Name (Z–A)</span>
              </button>
              <button
                class="rh-popover-item"
                :class="{ 'is-selected': sortBy === 'newest' }"
                @click="selectSort('newest')"
              >
                <span>Recently Added</span>
              </button>
              <button
                class="rh-popover-item"
                :class="{ 'is-selected': sortBy === 'featured' }"
                @click="selectSort('featured')"
              >
                <span>{{ FEATURED_SORT_LABEL }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- View Mode Switcher: Grid vs List -->
        <div class="rh-view-switcher" role="group" aria-label="Catalog view mode">
          <button
            class="rh-view-btn"
            :class="{ 'is-active': viewMode === 'grid' }"
            title="Grid view"
            aria-label="Grid view"
            @click="setViewMode('grid')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
          </button>
          <button
            class="rh-view-btn"
            :class="{ 'is-active': viewMode === 'list' }"
            title="Compact list view"
            aria-label="List view"
            @click="setViewMode('list')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="8" y1="6" x2="21" y2="6"/>
              <line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/>
              <line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- 2. ACTIVE FILTERS CHIP BAR -->
      <div v-if="hasActiveFilters" class="rh-active-filters-bar">
        <span class="rh-active-label">Active filters:</span>

        <span v-if="searchQuery" class="rh-badge rh-badge-brand rh-active-chip">
          <span>q: "{{ searchQuery }}"</span>
          <button class="rh-chip-close" @click="searchQuery = ''" aria-label="Remove search query filter">×</button>
        </span>

        <span v-if="selectedCategory && selectedCategory !== props.initialCategory" class="rh-badge rh-badge-brand rh-active-chip">
          <span>category: {{ getCategory(selectedCategory).name }}</span>
          <button class="rh-chip-close" @click="selectedCategory = props.initialCategory" aria-label="Remove category filter">×</button>
        </span>

        <span v-if="selectedType" class="rh-badge rh-badge-brand rh-active-chip">
          <span>type: {{ selectedType }}</span>
          <button class="rh-chip-close" @click="selectedType = ''" aria-label="Remove type filter">×</button>
        </span>

        <span v-if="selectedPricing" class="rh-badge rh-badge-brand rh-active-chip">
          <span>pricing: {{ selectedPricing }}</span>
          <button class="rh-chip-close" @click="selectedPricing = ''" aria-label="Remove pricing filter">×</button>
        </span>

        <span v-if="selectedTag" class="rh-badge rh-badge-brand rh-active-chip">
          <span>#{{ selectedTag }}</span>
          <button class="rh-chip-close" @click="selectedTag = ''" aria-label="Remove tag filter">×</button>
        </span>

        <button class="rh-btn rh-btn-ghost rh-btn-sm rh-clear-all-btn" @click="resetFilters">
          Clear all filters
        </button>
      </div>

      <!-- Result Counter Line -->
      <div class="rh-result-count-line">
        <span class="rh-tnum rh-result-count">
          Showing <strong>{{ visibleResources.length }}</strong> of <strong>{{ filteredResources.length }}</strong> resources
        </span>
      </div>
    </div>

    <!-- 3. CARDS PRESENTATION (GRID OR LIST) -->
    <div
      v-if="visibleResources.length > 0"
      :class="viewMode === 'grid' ? 'rh-dir-grid' : 'rh-dir-list'"
    >
      <ResourceCard
        v-for="res in visibleResources"
        :key="res.urlPath"
        :resource="res"
        :view-mode="viewMode"
        @select-tag="handleTagSelect"
        @select-category="selectCategory"
      />
    </div>

    <!-- 4. EMPTY SEARCH / FILTER STATE -->
    <div v-else class="rh-card rh-empty-state">
      <div class="rh-empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          <line x1="8" y1="11" x2="14" y2="11"/>
        </svg>
      </div>
      <h3 class="rh-empty-title">No resources matched your criteria</h3>
      <p class="rh-empty-desc">
        We couldn't find any resources matching your current filters. Try refining your keywords, clearing tags, or expanding your category selection.
      </p>
      <div class="rh-empty-actions">
        <button class="rh-btn rh-btn-primary rh-btn-md" @click="resetFilters">
          Reset all filters
        </button>
        <a href="/contribute" class="rh-btn rh-btn-secondary rh-btn-md">
          Suggest missing tool
        </a>
      </div>
    </div>

    <!-- 5. PROGRESSIVE LOAD MORE BUTTON -->
    <div v-if="hasMore" class="rh-load-more-wrap">
      <button class="rh-btn rh-btn-secondary rh-btn-md" @click="loadMore">
        <span>Load More Resources ({{ filteredResources.length - visibleResources.length }} remaining)</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.rh-directory-root {
  width: 100%;
  margin-top: var(--rh-space-4);
  margin-bottom: var(--rh-space-16);
}

/* ==========================================================================
   1. STICKY FILTER TOOLBAR
   ========================================================================== */

.rh-filter-toolbar {
  position: sticky;
  top: 64px;
  z-index: 20;
  background-color: var(--rh-glass-bg);
  backdrop-filter: var(--rh-glass-blur);
  -webkit-backdrop-filter: var(--rh-glass-blur);
  border: 1px solid var(--rh-glass-border);
  border-radius: var(--rh-radius-lg);
  padding: var(--rh-space-3);
  margin-bottom: var(--rh-space-6);
  box-shadow: var(--rh-shadow-sm);
  display: flex;
  flex-direction: column;
  gap: var(--rh-space-3);
}

.rh-toolbar-main {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--rh-space-3);
}

/* Search input wrapper */
.rh-search-wrapper {
  flex: 1;
  min-width: 220px;
  height: 38px;
  display: flex;
  align-items: center;
  gap: var(--rh-space-2);
  background-color: var(--rh-c-bg-surface);
  border: 1px solid var(--rh-c-border);
  border-radius: var(--rh-radius-md);
  padding: 0 var(--rh-space-3);
  transition: border-color var(--rh-transition-fast), box-shadow var(--rh-transition-fast);
}

.rh-search-wrapper:focus-within {
  border-color: var(--rh-c-brand);
  box-shadow: 0 0 0 3px var(--rh-c-brand-soft);
}

.rh-search-icon {
  color: var(--rh-c-text-tertiary);
  flex-shrink: 0;
}

.rh-search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-family: var(--rh-font-sans);
  font-size: 0.875rem;
  color: var(--rh-c-text-primary);
}

.rh-search-input::placeholder {
  color: var(--rh-c-text-tertiary);
}

.rh-clear-btn {
  background: none;
  border: none;
  color: var(--rh-c-text-tertiary);
  cursor: pointer;
  padding: 2px;
  display: flex;
  align-items: center;
  transition: color var(--rh-transition-fast);
}

.rh-clear-btn:hover {
  color: var(--rh-c-text-primary);
}

/* Pill groups */
.rh-pill-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--rh-space-2);
}

.rh-pill-btn {
  background-color: var(--rh-c-bg-surface);
  border: 1px solid var(--rh-c-border);
  color: var(--rh-c-text-secondary);
  border-radius: var(--rh-radius-full);
  padding: 0 12px;
  gap: 6px;
  font-size: 0.8125rem;
}

.rh-pill-btn:hover {
  background-color: var(--rh-c-bg-hover);
  color: var(--rh-c-text-primary);
  border-color: var(--rh-c-border-hover);
}

.rh-pill-active {
  background-color: var(--rh-c-brand-soft);
  border-color: var(--rh-c-brand);
  color: var(--rh-c-text-primary);
  font-weight: 600;
}

.rh-pill-caret {
  opacity: 0.6;
}

/* Popover menus */
.rh-popover-root {
  position: relative;
}

.rh-popover-menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 50;
  min-width: 200px;
  max-height: 320px;
  overflow-y: auto;
  padding: 6px;
  border-radius: var(--rh-radius-md);
  box-shadow: var(--rh-shadow-lg);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.rh-popover-header {
  font-size: 0.725rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--rh-c-text-tertiary);
  padding: 6px 10px 4px 10px;
  letter-spacing: 0.04em;
}

.rh-popover-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 6px 10px;
  border-radius: var(--rh-radius-sm);
  background: transparent;
  border: none;
  font-family: var(--rh-font-sans);
  font-size: 0.8125rem;
  color: var(--rh-c-text-secondary);
  cursor: pointer;
  text-align: left;
  transition: background-color var(--rh-transition-fast), color var(--rh-transition-fast);
}

.rh-popover-item:hover {
  background-color: var(--rh-c-bg-hover);
  color: var(--rh-c-text-primary);
}

.rh-popover-item.is-selected {
  background-color: var(--rh-c-brand-soft);
  color: var(--rh-c-text-primary);
  font-weight: 600;
}

.rh-item-count {
  font-size: 0.75rem;
  color: var(--rh-c-text-tertiary);
}

/* View Switcher */
.rh-view-switcher {
  display: flex;
  align-items: center;
  background-color: var(--rh-c-bg-surface);
  border: 1px solid var(--rh-c-border);
  border-radius: var(--rh-radius-md);
  padding: 2px;
  margin-left: auto;
}

.rh-view-btn {
  background: transparent;
  border: none;
  color: var(--rh-c-text-tertiary);
  padding: 5px 8px;
  border-radius: var(--rh-radius-xs);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--rh-transition-fast);
}

.rh-view-btn:hover {
  color: var(--rh-c-text-primary);
}

.rh-view-btn.is-active {
  background-color: var(--rh-c-bg-hover);
  color: var(--rh-c-text-primary);
}

/* Active filter chip bar */
.rh-active-filters-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--rh-space-2);
  padding-top: var(--rh-space-2);
  border-top: 1px solid var(--rh-c-border-subtle);
}

.rh-active-label {
  font-size: 0.78125rem;
  color: var(--rh-c-text-tertiary);
  font-weight: 500;
}

.rh-active-chip {
  gap: 6px;
  padding: 3px 8px;
}

.rh-chip-close {
  background: none;
  border: none;
  color: inherit;
  font-size: 0.95rem;
  line-height: 1;
  padding: 0;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity var(--rh-transition-fast);
}

.rh-chip-close:hover {
  opacity: 1;
}

.rh-clear-all-btn {
  font-size: 0.78125rem;
  height: 24px;
  padding: 0 8px;
}

/* Result count line */
.rh-result-count-line {
  font-size: 0.8125rem;
  color: var(--rh-c-text-secondary);
}

/* ==========================================================================
   2. CARDS LAYOUT: GRID & LIST
   ========================================================================== */

.rh-dir-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: var(--rh-space-4);
}

@media (min-width: 640px) {
  .rh-dir-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .rh-dir-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.rh-dir-list {
  display: flex;
  flex-direction: column;
  gap: var(--rh-space-3);
}

/* ==========================================================================
   3. EMPTY STATE
   ========================================================================== */

.rh-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--rh-space-12) var(--rh-space-6);
  margin: var(--rh-space-8) 0;
}

.rh-empty-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--rh-radius-full);
  background-color: var(--rh-c-bg-subtle);
  border: 1px solid var(--rh-c-border);
  color: var(--rh-c-text-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--rh-space-4);
}

.rh-empty-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--rh-c-text-primary);
  margin: 0 0 var(--rh-space-2) 0;
}

.rh-empty-desc {
  max-width: 480px;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--rh-c-text-secondary);
  margin: 0 0 var(--rh-space-6) 0;
}

.rh-empty-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--rh-space-3);
  justify-content: center;
}

/* ==========================================================================
   4. LOAD MORE
   ========================================================================== */

.rh-load-more-wrap {
  display: flex;
  justify-content: center;
  margin-top: var(--rh-space-10);
}
</style>
