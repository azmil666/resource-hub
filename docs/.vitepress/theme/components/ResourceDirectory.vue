<script setup lang="ts">
import { ref, computed } from 'vue';
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

const searchQuery = ref('');
const selectedCategory = ref(props.initialCategory);
const selectedType = ref('');
const selectedPricing = ref('');
const selectedTag = ref('');
const sortBy = ref<'title-asc' | 'title-desc'>('title-asc');

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
    selectedCategory.value !== props.initialCategory ||
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
  <div class="directory-container">
    <!-- Controls Bar -->
    <div class="controls-panel">
      <!-- Search Input -->
      <div class="search-box-wrap">
        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.3-4.3"/>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Filter resources by name, description, tags..."
          class="search-input"
          aria-label="Filter resources"
        />
        <button
          v-if="searchQuery"
          class="clear-search-btn"
          title="Clear search"
          @click="searchQuery = ''"
        >
          ×
        </button>
      </div>

      <!-- Filter Row -->
      <div class="filters-row">
        <!-- Category Filter -->
        <div class="filter-item">
          <label class="filter-label" for="category-select">Category:</label>
          <select id="category-select" v-model="selectedCategory" class="filter-select">
            <option value="">All Categories ({{ allResources.length }})</option>
            <option v-for="cat in CATEGORIES" :key="cat.slug" :value="cat.slug">
              {{ cat.name }} ({{ categoryCounts[cat.slug] || 0 }})
            </option>
          </select>
        </div>

        <!-- Type Filter -->
        <div class="filter-item">
          <label class="filter-label" for="type-select">Type:</label>
          <select id="type-select" v-model="selectedType" class="filter-select">
            <option value="">All Types</option>
            <option v-for="t in availableTypes" :key="t" :value="t">
              {{ t }}
            </option>
          </select>
        </div>

        <!-- Pricing Filter -->
        <div class="filter-item">
          <label class="filter-label" for="pricing-select">Pricing:</label>
          <select id="pricing-select" v-model="selectedPricing" class="filter-select">
            <option value="">All Pricing</option>
            <option value="free">Free</option>
            <option value="freemium">Freemium</option>
            <option value="paid">Paid</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>

        <!-- Sort Select -->
        <div class="filter-item sort-item">
          <label class="filter-label" for="sort-select">Sort:</label>
          <select id="sort-select" v-model="sortBy" class="filter-select">
            <option value="title-asc">A to Z</option>
            <option value="title-desc">Z to A</option>
          </select>
        </div>

        <button
          v-if="hasActiveFilters"
          class="reset-btn"
          @click="resetFilters"
        >
          Reset filters
        </button>
      </div>

      <!-- Category Quick Pills -->
      <div v-if="!initialCategory" class="category-pills">
        <button
          class="category-pill"
          :class="{ active: selectedCategory === '' }"
          @click="selectedCategory = ''"
        >
          All ({{ allResources.length }})
        </button>
        <button
          v-for="cat in CATEGORIES"
          :key="cat.slug"
          class="category-pill"
          :class="{ active: selectedCategory === cat.slug }"
          @click="selectCategory(cat.slug)"
        >
          {{ cat.name }}
          <span class="pill-count">{{ categoryCounts[cat.slug] || 0 }}</span>
        </button>
      </div>
    </div>

    <!-- Results Status Bar -->
    <div class="status-bar">
      <span class="count-text">
        Showing <strong>{{ filteredResources.length }}</strong> of {{ allResources.length }} resources
      </span>
      <span v-if="selectedCategory" class="active-category-note">
        Category: <strong>{{ getCategory(selectedCategory).name }}</strong>
      </span>
      <span v-if="selectedTag" class="active-tag-note">
        Tag: <strong>#{{ selectedTag }}</strong>
        <button class="remove-tag" @click="selectedTag = ''">×</button>
      </span>
    </div>

    <!-- Resources Listing -->
    <div v-if="filteredResources.length > 0" class="resources-grid">
      <ResourceCard
        v-for="res in filteredResources"
        :key="res.urlPath"
        :resource="res"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <svg class="empty-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
      <h3 class="empty-title">No resources found</h3>
      <p class="empty-desc">
        {{ allResources.length === 0 ? 'No resources have been published yet.' : 'No resources match your active search or filter criteria.' }}
      </p>
      <div class="empty-actions">
        <button v-if="hasActiveFilters" class="clear-btn" @click="resetFilters">
          Clear Filters
        </button>
        <a href="/contribute" class="suggest-btn">
          Suggest a Resource
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.directory-container {
  margin: 1.5rem 0 3rem 0;
}

.controls-panel {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding: 1rem;
  background-color: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  margin-bottom: 1rem;
}

.search-box-wrap {
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

.search-input {
  width: 100%;
  padding: 0.55rem 2rem 0.55rem 2.4rem;
  font-size: 0.92rem;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 5px;
  color: var(--vp-c-text-1);
  outline: none;
  transition: border-color 0.15s ease;
}

.search-input:focus {
  border-color: var(--vp-c-brand-1);
}

.clear-search-btn {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: var(--vp-c-text-3);
  font-size: 1.2rem;
  cursor: pointer;
  line-height: 1;
  padding: 2px 6px;
}

.filters-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.filter-label {
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.filter-select {
  padding: 0.32rem 0.6rem;
  font-size: 0.82rem;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  color: var(--vp-c-text-1);
  outline: none;
  cursor: pointer;
}

.filter-select:focus {
  border-color: var(--vp-c-brand-1);
}

.reset-btn {
  font-size: 0.78rem;
  color: var(--vp-c-brand-1);
  background: none;
  border: none;
  padding: 0.2rem 0.5rem;
  cursor: pointer;
  text-decoration: underline;
}

.category-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  padding-top: 0.25rem;
  border-top: 1px solid var(--vp-c-border);
}

.category-pill {
  font-size: 0.76rem;
  padding: 0.25rem 0.6rem;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.12s ease;
}

.category-pill:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-text-1);
}

.category-pill.active {
  background-color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: #ffffff;
}

.pill-count {
  opacity: 0.75;
  font-size: 0.7rem;
  margin-left: 2px;
}

.status-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.85rem;
  font-size: 0.82rem;
  color: var(--vp-c-text-2);
  padding: 0 0.25rem;
}

.active-tag-note {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background-color: var(--vp-c-bg-alt);
  padding: 1px 6px;
  border-radius: 3px;
  border: 1px solid var(--vp-c-border);
}

.remove-tag {
  background: none;
  border: none;
  cursor: pointer;
  font-weight: bold;
}

.resources-grid {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1.5rem;
  background-color: var(--vp-c-bg-alt);
  border: 1px dashed var(--vp-c-border);
  border-radius: 6px;
}

.empty-icon {
  margin: 0 auto 0.75rem auto;
  color: var(--vp-c-text-3);
}

.empty-title {
  margin: 0 0 0.4rem 0;
  font-size: 1.1rem;
  color: var(--vp-c-text-1);
}

.empty-desc {
  margin: 0 0 1.25rem 0;
  font-size: 0.88rem;
  color: var(--vp-c-text-3);
}

.empty-actions {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
}

.clear-btn, .suggest-btn {
  font-size: 0.84rem;
  padding: 0.4rem 0.85rem;
  border-radius: 4px;
  text-decoration: none;
  cursor: pointer;
}

.clear-btn {
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-1);
}

.suggest-btn {
  background-color: var(--vp-c-brand-1);
  color: #ffffff;
  border: 1px solid var(--vp-c-brand-1);
}
</style>
