<script setup lang="ts">
import { computed } from 'vue';
import type { ResourceItem } from '../data/resources.data';
import { getCategory } from '../data/categories';

const props = withDefaults(
  defineProps<{
    resource: ResourceItem;
    viewMode?: 'grid' | 'list';
  }>(),
  {
    viewMode: 'grid'
  }
);

const emit = defineEmits<{
  (e: 'select-tag', tag: string): void;
  (e: 'select-category', cat: string): void;
}>();

const categoryMeta = computed(() => getCategory(props.resource.category));

// Clean domain extraction (e.g., github.com, tailwindcss.com)
const cleanDomain = computed(() => {
  if (!props.resource.url) return '';
  try {
    const parsed = new URL(props.resource.url);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return props.resource.url;
  }
});

// Semantic pricing badge styling class
const pricingBadgeClass = computed(() => {
  switch (props.resource.pricing) {
    case 'free':
      return 'rh-badge-emerald';
    case 'freemium':
      return 'rh-badge-amber';
    case 'paid':
      return 'rh-badge-rose';
    default:
      return 'rh-badge-slate';
  }
});

// Category accent colors mapping
const categoryAccentColor = computed(() => {
  const map: Record<string, string> = {
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
  return map[props.resource.category] || 'var(--rh-c-brand)';
});

const sanitizedTags = computed(() => {
  const raw = props.resource.tags;
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((t: any) => typeof t === 'string' && t.trim().length > 0 && t !== '[object Object]')
    .map((t: string) => t.trim().toLowerCase());
});

function handleTagClick(tag: string, event: MouseEvent) {
  event.stopPropagation();
  event.preventDefault();
  emit('select-tag', tag);
}

function handleCategoryClick(cat: string, event: MouseEvent) {
  event.stopPropagation();
  emit('select-category', cat);
}

function handleCardClick(event: MouseEvent) {
  // If user clicked inside an anchor tag or button, let native browser action occur
  const target = event.target as HTMLElement;
  if (target.closest('a') || target.closest('button')) {
    return;
  }
  if (typeof window !== 'undefined') {
    window.location.href = props.resource.urlPath;
  }
}
</script>

<template>
  <article
    class="rh-card rh-resource-card"
    :class="[
      `rh-card-${viewMode}`,
      { 'rh-card-featured': resource.featured }
    ]"
    @click="handleCardClick"
  >
    <!-- Top Metadata Bar -->
    <div class="rh-rc-header">
      <div class="rh-rc-badges">
        <!-- Category Pill -->
        <a
          :href="`/resources/${resource.category}/`"
          class="rh-badge rh-rc-cat-badge"
          @click="handleCategoryClick(resource.category, $event)"
        >
          <span
            class="rh-rc-cat-dot"
            :style="{ backgroundColor: categoryAccentColor }"
            aria-hidden="true"
          ></span>
          <span>{{ categoryMeta.name }}</span>
        </a>

        <!-- Type Pill -->
        <span class="rh-badge rh-badge-brand rh-rc-type-badge">
          {{ resource.type }}
        </span>

        <!-- Staff Pick Badge if featured -->
        <span v-if="resource.featured" class="rh-badge rh-badge-amber rh-rc-featured-badge">
          ★ Staff Pick
        </span>
      </div>

      <!-- External Outbound Link Affordance -->
      <a
        v-if="resource.url"
        :href="resource.url"
        target="_blank"
        rel="noopener noreferrer"
        class="rh-rc-ext-btn"
        :title="`Visit official site: ${resource.title} (${cleanDomain})`"
        :aria-label="`Open official website for ${resource.title} in new tab`"
        @click.stop
      >
        <span class="rh-rc-domain-text">{{ cleanDomain }}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="7" y1="17" x2="17" y2="7"/>
          <polyline points="7 7 17 7 17 17"/>
        </svg>
      </a>
    </div>

    <!-- Main Content: Title & Clamped Description -->
    <div class="rh-rc-body">
      <h3 class="rh-rc-title">
        <a :href="resource.urlPath" class="rh-rc-title-link">
          {{ resource.title }}
        </a>
      </h3>
      <p class="rh-rc-desc">
        {{ resource.description }}
      </p>
    </div>

    <!-- Footer: Tags & Pricing Indicator -->
    <div class="rh-rc-footer">
      <div v-if="sanitizedTags.length > 0" class="rh-rc-tags">
        <a
          v-for="tag in sanitizedTags.slice(0, 3)"
          :key="tag"
          :href="`/resources/?tag=${encodeURIComponent(tag)}`"
          class="rh-badge rh-rc-tag-chip"
          @click="handleTagClick(tag, $event)"
        >
          #{{ tag }}
        </a>
        <span
          v-if="sanitizedTags.length > 3"
          class="rh-rc-tag-more rh-tnum"
          :title="sanitizedTags.slice(3).join(', ')"
        >
          +{{ sanitizedTags.length - 3 }}
        </span>
      </div>
      <div v-else class="rh-rc-tags"></div>

      <!-- Pricing Badge with Colored Dot -->
      <span class="rh-badge rh-rc-pricing-badge" :class="pricingBadgeClass">
        <span class="rh-rc-pricing-dot" aria-hidden="true"></span>
        <span class="rh-rc-pricing-text">{{ resource.pricing }}</span>
      </span>
    </div>
  </article>
</template>

<style scoped>
.rh-resource-card {
  display: flex;
  flex-direction: column;
  padding: var(--rh-space-5);
  cursor: pointer;
  background-color: var(--rh-c-bg-surface);
  border: 1px solid var(--rh-c-border);
  border-radius: var(--rh-radius-lg);
  box-shadow: var(--rh-shadow-sm);
  transition: transform var(--rh-transition-base),
              box-shadow var(--rh-transition-base),
              border-color var(--rh-transition-base);
}

.rh-resource-card:hover {
  transform: translateY(-2px);
  border-color: var(--rh-c-border-hover);
  box-shadow: var(--rh-shadow-md);
}

.rh-card-featured {
  border-color: rgba(245, 158, 11, 0.35);
  background: linear-gradient(
    145deg,
    var(--rh-c-bg-surface) 0%,
    var(--rh-c-bg-subtle) 100%
  );
}

.dark .rh-card-featured {
  border-color: rgba(245, 158, 11, 0.45);
}

/* ==========================================================================
   HEADER
   ========================================================================== */

.rh-rc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--rh-space-2);
  margin-bottom: var(--rh-space-3);
}

.rh-rc-badges {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--rh-space-2);
}

.rh-rc-cat-badge {
  text-decoration: none !important;
  color: var(--rh-c-text-secondary);
  transition: color var(--rh-transition-fast), border-color var(--rh-transition-fast);
}

.rh-rc-cat-badge:hover {
  color: var(--rh-c-text-primary);
  border-color: var(--rh-c-border-hover);
}

.rh-rc-cat-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.rh-rc-type-badge {
  font-size: 0.7rem;
  text-transform: capitalize;
}

.rh-rc-featured-badge {
  font-size: 0.7rem;
}

/* External Link Button */
.rh-rc-ext-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: var(--rh-c-text-tertiary);
  text-decoration: none !important;
  padding: 3px 6px;
  border-radius: var(--rh-radius-sm);
  transition: color var(--rh-transition-fast), background-color var(--rh-transition-fast);
  flex-shrink: 0;
}

.rh-rc-ext-btn:hover {
  color: var(--rh-c-text-primary);
  background-color: var(--rh-c-bg-hover);
}

.rh-rc-domain-text {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ==========================================================================
   BODY: TITLE & DESCRIPTION
   ========================================================================== */

.rh-rc-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-bottom: var(--rh-space-4);
}

.rh-rc-title {
  margin: 0 0 var(--rh-space-2) 0;
  font-size: 1.0625rem;
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.3;
}

.rh-rc-title-link {
  color: var(--rh-c-text-primary);
  text-decoration: none !important;
  transition: color var(--rh-transition-fast);
}

.rh-rc-title-link:hover {
  color: var(--rh-c-brand);
}

.rh-rc-desc {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.55;
  color: var(--rh-c-text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ==========================================================================
   FOOTER: TAGS & PRICING
   ========================================================================== */

.rh-rc-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--rh-space-2);
  margin-top: auto;
  padding-top: var(--rh-space-3);
  border-top: 1px solid var(--rh-c-border-subtle);
}

.rh-rc-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  overflow: hidden;
}

.rh-rc-tag-chip {
  text-decoration: none !important;
  font-size: 0.7rem;
  padding: 1px 6px;
  transition: background-color var(--rh-transition-fast), color var(--rh-transition-fast);
}

.rh-rc-tag-chip:hover {
  background-color: var(--rh-c-bg-hover);
  color: var(--rh-c-text-primary);
}

.rh-rc-tag-more {
  font-size: 0.7rem;
  color: var(--rh-c-text-tertiary);
  padding: 0 2px;
}

.rh-rc-pricing-badge {
  font-size: 0.725rem;
  text-transform: capitalize;
  flex-shrink: 0;
}

.rh-rc-pricing-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: currentColor;
}

/* ==========================================================================
   LIST VIEW MODE OVERRIDES
   ========================================================================== */

.rh-card-list {
  padding: var(--rh-space-4) var(--rh-space-5);
}

@media (min-width: 768px) {
  .rh-card-list {
    display: grid;
    grid-template-columns: 240px 1fr auto;
    align-items: center;
    gap: var(--rh-space-4);
  }

  .rh-card-list .rh-rc-header {
    margin-bottom: 0;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--rh-space-1);
  }

  .rh-card-list .rh-rc-body {
    margin-bottom: 0;
  }

  .rh-card-list .rh-rc-desc {
    -webkit-line-clamp: 1;
  }

  .rh-card-list .rh-rc-footer {
    border-top: none;
    padding-top: 0;
    margin-top: 0;
    flex-direction: column;
    align-items: flex-end;
    gap: var(--rh-space-2);
  }
}
</style>
