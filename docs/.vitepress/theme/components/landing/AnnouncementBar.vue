<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { data as allResources } from '../../data/resources.data';

const isDismissed = ref(false);

onMounted(() => {
  try {
    if (sessionStorage.getItem('rh-announcement-dismissed') === 'true') {
      isDismissed.value = true;
    }
  } catch (_) {}
});

function dismiss() {
  isDismissed.value = true;
  try {
    sessionStorage.setItem('rh-announcement-dismissed', 'true');
  } catch (_) {}
}

// Compute the most recently added resource with a dateAdded
const latestResource = computed(() => {
  const sorted = [...allResources]
    .filter(r => Boolean(r.dateAdded))
    .sort((a, b) => (b.dateAdded || '').localeCompare(a.dateAdded || ''));
  return sorted[0] || null;
});
</script>

<template>
  <aside v-if="!isDismissed" class="rh-announcement-bar" aria-label="Announcement">
    <div class="rh-announcement-inner">
      <span class="rh-announcement-pill">New</span>
      <span class="rh-announcement-text">
        <template v-if="latestResource">
          Just cataloged: <strong>{{ latestResource.title }}</strong> in <em>{{ latestResource.category }}</em>
        </template>
        <template v-else>
          Open-source developer resource library — 100% community maintained
        </template>
      </span>
      <a
        :href="latestResource ? latestResource.urlPath : '/resources/'"
        class="rh-announcement-link"
        aria-label="View newly added resource"
      >
        <span>Explore</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
      </a>
      <button
        class="rh-announcement-dismiss"
        title="Dismiss announcement"
        aria-label="Dismiss announcement banner"
        @click="dismiss"
      >
        ×
      </button>
    </div>
  </aside>
</template>

<style scoped>
.rh-announcement-bar {
  width: 100%;
  background: linear-gradient(
    90deg,
    rgba(59, 130, 246, 0.08) 0%,
    rgba(147, 51, 234, 0.06) 50%,
    rgba(59, 130, 246, 0.08) 100%
  );
  border-bottom: 1px solid var(--rh-c-border);
  font-size: 0.8125rem;
  color: var(--rh-c-text-primary);
  position: relative;
  z-index: 10;
}

.rh-announcement-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.rh-announcement-pill {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background-color: var(--rh-c-brand);
  color: var(--rh-c-bg);
  padding: 1px 7px;
  border-radius: var(--rh-radius-full);
}

.rh-announcement-text {
  color: var(--rh-c-text-secondary);
}

.rh-announcement-text strong {
  color: var(--rh-c-text-primary);
}

.rh-announcement-text em {
  font-style: normal;
  text-transform: capitalize;
  color: var(--rh-c-text-primary);
}

.rh-announcement-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
  color: var(--rh-c-brand);
  text-decoration: none !important;
  transition: opacity var(--rh-transition-fast);
}

.rh-announcement-link:hover {
  opacity: 0.8;
}

.rh-announcement-dismiss {
  background: none;
  border: none;
  color: var(--rh-c-text-tertiary);
  font-size: 1.1rem;
  line-height: 1;
  padding: 0 4px;
  cursor: pointer;
  margin-left: 6px;
  transition: color var(--rh-transition-fast);
}

.rh-announcement-dismiss:hover {
  color: var(--rh-c-text-primary);
}
</style>
