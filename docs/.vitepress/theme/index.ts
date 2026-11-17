import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { h } from 'vue';
import './style.css';

import HomeHero from './components/HomeHero.vue';
import ResourceDirectory from './components/ResourceDirectory.vue';
import CategoryOverview from './components/CategoryOverview.vue';
import CategoryPage from './components/CategoryPage.vue';
import ResourceCard from './components/ResourceCard.vue';
import ResourceMeta from './components/ResourceMeta.vue';
import ResourceRelated from './components/ResourceRelated.vue';

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h(ResourceMeta),
      'doc-after': () => h(ResourceRelated)
    });
  },
  enhanceApp({ app }) {
    app.component('HomeHero', HomeHero);
    app.component('ResourceDirectory', ResourceDirectory);
    app.component('CategoryOverview', CategoryOverview);
    app.component('CategoryPage', CategoryPage);
    app.component('ResourceCard', ResourceCard);
    app.component('ResourceMeta', ResourceMeta);
    app.component('ResourceRelated', ResourceRelated);

    // Global ergonomic shortcut: Pressing `/` opens search or focuses filter input
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', (e) => {
        if (
          e.key === '/' &&
          !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)
        ) {
          e.preventDefault();
          const dirInput = document.querySelector('.rh-search-input, .rh-hero-search-input, .directory-search-input') as HTMLInputElement | null;
          if (dirInput) {
            dirInput.focus();
            dirInput.select();
          } else {
            const searchBtn = document.querySelector('.DocSearch-Button, .VPNavBarSearchButton, [aria-label*="Search"]') as HTMLButtonElement | null;
            searchBtn?.click();
          }
        }
      });
    }
  }
} satisfies Theme;
