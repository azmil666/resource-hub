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

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h(ResourceMeta)
    });
  },
  enhanceApp({ app }) {
    app.component('HomeHero', HomeHero);
    app.component('ResourceDirectory', ResourceDirectory);
    app.component('CategoryOverview', CategoryOverview);
    app.component('CategoryPage', CategoryPage);
    app.component('ResourceCard', ResourceCard);
    app.component('ResourceMeta', ResourceMeta);
  }
} satisfies Theme;
