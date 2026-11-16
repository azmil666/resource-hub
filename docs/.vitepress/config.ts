import { defineConfig } from 'vitepress';
import { CATEGORIES } from '../../scripts/lib/categories.mjs';

const categorySidebarItems = CATEGORIES.map(cat => ({
  text: cat.name,
  link: `/resources/${cat.slug}/`
}));

export default defineConfig({
  title: 'Developer Resource Hub',
  description: 'A minimal, high-performance public developer knowledge library and curated resource directory.',
  lang: 'en-US',
  cleanUrls: true,
  lastUpdated: true,

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%233b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>' }],
    ['meta', { name: 'theme-color', content: '#0f172a' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Developer Resource Hub' }],
    ['meta', { property: 'og:description', content: 'A curated, high-performance library of developer tools, design resources, APIs, and references.' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }]
  ],

  sitemap: {
    hostname: 'https://developer-resource-hub.vercel.app'
  },

  themeConfig: {
    siteTitle: 'Developer Resource Hub',
    logo: {
      light: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%230f172a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>',
      dark: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23f8fafc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>'
    },

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Browse Resources', link: '/resources/' },
      { text: 'Categories', link: '/categories' },
      { text: 'About', link: '/about' },
      { text: 'Contribute', link: '/contribute' }
    ],

    sidebar: {
      '/resources/': [
        {
          text: 'Resource Directory',
          items: [
            { text: 'All Resources', link: '/resources/' },
            { text: 'Category Overview', link: '/categories' }
          ]
        },
        {
          text: 'Categories',
          collapsed: false,
          items: categorySidebarItems
        },
        {
          text: 'Information',
          items: [
            { text: 'About This Project', link: '/about' },
            { text: 'Contribute & Submit', link: '/contribute' }
          ]
        }
      ],
      '/categories': [
        {
          text: 'Categories',
          items: categorySidebarItems
        }
      ]
    },

    search: {
      provider: 'local',
      options: {
        detailedView: true,
        translations: {
          button: {
            buttonText: 'Search resources...',
            buttonAriaLabel: 'Search resources'
          },
          modal: {
            displayDetails: 'Display detailed list',
            resetButtonTitle: 'Reset search',
            backButtonTitle: 'Close search',
            noResultsText: 'No resources found matching',
            footer: {
              selectText: 'to select',
              navigateText: 'to navigate',
              closeText: 'to close'
            }
          }
        }
      }
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com' }
    ],

    footer: {
      message: 'Curated developer knowledge library. Built with VitePress.',
      copyright: 'Copyright © 2026 Developer Resource Hub. Open source under MIT License.'
    }
  }
});
