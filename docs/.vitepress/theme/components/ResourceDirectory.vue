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

// Keyboard shortcut `/` to focus directory search input
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

// Available types derived dynamically from data
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

const hasActiveFilters = computed(() => {
  return Boolean(
    searchQuery.value ||
    (selectedCategory.value && selectedCategory.value !== props.initialCategory) ||
    selectedType.value ||
    selectedPricing.value ||
    selectedTag.value
  );
});

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
    <!-- Filter Panel (Airbnb discoverability + Linear minimalism) -->
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
        <button
          v-if="searchQuery"
          class="clear-input-btn"
          title="Clear search"
          aria-label="Clear search"
          @click="searchQuery = ''"
        >
          ×
        </button>
      </div>

      <!-- Category Filter Pills (Airbnb scrollable/wrap style) -->
      <div v-if="!initialCategory" class="category-tabs-wrap" role="tablist" aria-label="Category filter tabs">
        <button
          class="category-tab"
          :class="{ active: selectedCategory === '' }"
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
          :class="{ active: selectedCategory === cat.slug }"
          role="tab"
          :aria-selected="selectedCategory === cat.slug"
          @click="selectCategory(cat.slug)"
        >
          <span>{{ cat.name }}</span>
          <span class="tab-count tabular-nums">{{ categoryCounts[cat.slug] || 0 }}</span>
        </button>
      </div>

      <!-- Secondary Controls Row -->
      <div class="secondary-controls-row">
        <div class="control-group">
          <label class="control-label" for="type-filter">Type:</label>
          <select id="type-filter" v-model="selectedType" class="control-select">
            <option value="">All Types</option>
            <option v-for="t in availableTypes" :key="t" :value="t">
              {{ t }}
            </option>
          </select>
        </div>

        <div class="control-group">
          <label class="control-label" for="pricing-filter">Pricing:</label>
          <select id="pricing-filter" v-model="selectedPricing" class="control-select">
            <option value="">All Pricing</option>
            <option value="free">Free</option>
            <option value="freemium">Freemium</option>
            <option value="paid">Paid</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>

        <div class="control-group sort-control">
          <label class="control-label" for="sort-order">Sort:</label>
          <select id="sort-order" v-model="sortBy" class="control-select">
            <option value="title-asc">A to Z</option>
            <option value="title-desc">Z to A</option>
          </select>
        </div>

        <button
          v-if="hasActiveFilters"
          class="reset-filters-btn"
          @click="resetFilters"
        >
          Reset filters
        </button>
      </div>
    </div>

    <!-- Active Filter Status & Count -->
    <div class="directory-status-line">
      <span class="results-count tabular-nums">
        Showing <strong>{{ filteredResources.length }}</strong> of {{ allResources.length }} {{ allResources.length === 1 ? 'resource' : 'resources' }}
      </span>

      <div class="active-chips">
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

    <!-- Resources Listing -->
    <div v-if="filteredResources.length > 0" class="directory-list">
      <ResourceCard
        v-for="res in filteredResources"
        :key="res.urlPath"
        :resource="res"
      />
    </div>

    <!-- Duolingo-inspired friendly empty state -->
    <div v-else class="directory-empty-state">
      <div class="empty-icon-box">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          <line x1="11" y1="8" x2="11" y2="14"/>
          <line x1="8" y1="11" x2="14" y2="11"/>
        </svg>
      </div>
      <h3 class="empty-heading">No matching resources</h3>
      <p class="empty-message">
        {{
          allResources.length === 0
            ? 'The resource collection is currently being cataloged. Resources will be published here.'
            : 'No resources match your active search terms or selected filters.'
        }}
      </p>
      <div class="empty-button-row">
        <button v-if="hasActiveFilters" class="empty-btn-secondary" @click="resetFilters">
          Clear Filters
        </button>
        <a href="/contribute" class="empty-btn-primary">
          Suggest a Resource
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.directory-view {
  margin: 1.5rem 0 3.5rem 0;
}

.filter-panel {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding: 1.15rem;
  background-color: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  margin-bottom: 1.25rem;
}

.search-bar-wrap {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 0.85rem;
  color: var(--vp-c-text-3);
  pointer-events: none;
}

.directory-search-input {
  width: 100%;
  padding: 0.55rem 2rem 0.55rem 2.35rem;
  font-size: 0.9rem;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 5px;
  color: var(--vp-c-text-1);
  outline: none;
  transition: border-color var(--hub-transition);
}

.directory-search-input:focus {
  border-color: var(--vp-c-text-1);
}

.clear-input-btn {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: var(--vp-c-text-3);
  font-size: 1.2rem;
  cursor: pointer;
  line-height: 1;
  padding: 2px 6px;
  transition: color var(--hub-transition);
}

.clear-input-btn:hover {
  color: var(--vp-c-text-1);
}

/* Category Tabs (Airbnb discoverability) */
.category-tabs-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  padding-top: 0.25rem;
}

@media (max-width: 640px) {
  .category-tabs-wrap {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 0.4rem;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .category-tabs-wrap::-webkit-scrollbar {
    display: none;
  }
}

.category-tab {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.76rem;
  padding: 0.3rem 0.65rem;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  white-space: nowrap;
  transition: all var(--hub-transition);
}

.category-tab:hover {
  border-color: var(--vp-c-text-2);
  color: var(--vp-c-text-1);
}

.category-tab.active {
  background-color: var(--vp-c-text-1);
  border-color: var(--vp-c-text-1);
  color: var(--vp-c-bg);
}

.tab-count {
  font-size: 0.7rem;
  opacity: 0.75;
}

/* Secondary Controls */
.secondary-controls-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  padding-top: 0.65rem;
  border-top: 1px solid var(--vp-c-border);
}

.control-group {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.control-label {
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--vp-c-text-3);
}

.control-select {
  padding: 0.3rem 0.6rem;
  font-size: 0.8rem;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  color: var(--vp-c-text-1);
  outline: none;
  cursor: pointer;
  transition: border-color var(--hub-transition);
}

.control-select:focus {
  border-color: var(--vp-c-text-1);
}

.reset-filters-btn {
  font-size: 0.78rem;
  color: var(--vp-c-text-2);
  background: none;
  border: none;
  padding: 0.2rem 0.4rem;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
  margin-left: auto;
}

.reset-filters-btn:hover {
  color: var(--vp-c-text-1);
}

/* Status Line & Active Chips */
.directory-status-line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.85rem;
  margin-bottom: 0.85rem;
  font-size: 0.82rem;
  color: var(--vp-c-text-3);
  padding: 0 0.25rem;
}

.results-count strong {
  color: var(--vp-c-text-1);
}

.active-chips {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
}

.active-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.74rem;
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-2);
  padding: 1px 7px;
  border-radius: 3px;
  border: 1px solid var(--vp-c-border);
}

.chip-remove {
  background: none;
  border: none;
  color: var(--vp-c-text-3);
  cursor: pointer;
  font-weight: bold;
  padding: 0 2px;
}

.chip-remove:hover {
  color: var(--vp-c-text-1);
}

.directory-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

/* Empty State */
.directory-empty-state {
  text-align: center;
  padding: 3.5rem 1.5rem;
  background-color: var(--vp-c-bg-alt);
  border: 1px dashed var(--vp-c-border);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-icon-box {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: var(--vp-c-bg-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-text-3);
  margin-bottom: 0.85rem;
}

.empty-heading {
  margin: 0 0 0.35rem 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.empty-message {
  margin: 0 0 1.35rem 0;
  font-size: 0.86rem;
  color: var(--vp-c-text-3);
  max-width: 46ch;
  line-height: 1.5;
}

.empty-button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  justify-content: center;
}

.empty-btn-primary {
  padding: 0.45rem 1rem;
  font-size: 0.84rem;
  font-weight: 500;
  background-color: var(--vp-c-text-1);
  color: var(--vp-c-bg);
  border-radius: 4px;
  text-decoration: none;
  transition: opacity var(--hub-transition);
}

.empty-btn-primary:hover {
  opacity: 0.88;
}

.empty-btn-secondary {
  padding: 0.45rem 1rem;
  font-size: 0.84rem;
  font-weight: 500;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-1);
  border-radius: 4px;
  cursor: pointer;
  transition: border-color var(--hub-transition);
}

.empty-btn-secondary:hover {
  border-color: var(--vp-c-text-1);
}
</style>
