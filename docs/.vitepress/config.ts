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
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' }],
    ['meta', { name: 'theme-color', content: '#000000' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Developer Resource Hub' }],
    ['meta', { property: 'og:image', content: 'https://developer-resource-hub.vercel.app/og-image.png' }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: 'https://developer-resource-hub.vercel.app/og-image.png' }],
    ['meta', { name: 'twitter:creator', content: '@azmil666' }]
  ],

  transformHead({ pageData }) {
    const head: [string, Record<string, string>][] = [];
    const relativeClean = pageData.relativePath
      .replace(/(^|\/)index\.md$/, '$1')
      .replace(/\.md$/, '');
    const canonical = `https://developer-resource-hub.vercel.app/${relativeClean}`.replace(/\/+$/, '') || 'https://developer-resource-hub.vercel.app';

    head.push(['link', { rel: 'canonical', href: canonical }]);

    if (pageData.frontmatter.title) {
      const pageTitle = `${pageData.frontmatter.title} — Developer Resource Hub`;
      head.push(['meta', { property: 'og:title', content: pageTitle }]);
      head.push(['meta', { name: 'twitter:title', content: pageTitle }]);
    }

    if (pageData.frontmatter.description) {
      head.push(['meta', { property: 'og:description', content: pageData.frontmatter.description }]);
      head.push(['meta', { name: 'twitter:description', content: pageData.frontmatter.description }]);
    }

    return head;
  },

  sitemap: {
    hostname: 'https://developer-resource-hub.vercel.app'
  },

  themeConfig: {
    siteTitle: 'Developer Resource Hub',
    logo: '/icon.svg',

    nav: [
      { text: 'Directory', link: '/resources/' },
      {
        text: 'Categories',
        items: [
          {
            text: 'Engineering & Dev',
            items: [
              { text: 'Frontend Development', link: '/resources/frontend/' },
              { text: 'Backend & APIs', link: '/resources/backend/' },
              { text: 'AI Tools & Agents', link: '/resources/ai-tools/' },
              { text: 'Developer Utilities', link: '/resources/utilities/' },
              { text: 'GitHub & Open Source', link: '/resources/github/' }
            ]
          },
          {
            text: 'Design & Resources',
            items: [
              { text: 'Design & UI', link: '/resources/design/' },
              { text: 'Learning & Guides', link: '/resources/learning/' },
              { text: 'Website Inspiration', link: '/resources/inspiration/' },
              { text: 'Productivity', link: '/resources/productivity/' },
              { text: 'Miscellaneous', link: '/resources/miscellaneous/' }
            ]
          },
          {
            items: [
              { text: 'All Categories Overview', link: '/categories' }
            ]
          }
        ]
      },
      { text: 'About', link: '/about' },
      { text: 'Contribute', link: '/contribute' }
    ],

    sidebar: {
      '/resources/': [
        {
          text: 'Master Catalog',
          collapsed: false,
          items: [
            { text: 'Browse Directory', link: '/resources/' },
            { text: 'Category Index', link: '/categories' }
          ]
        },
        {
          text: 'Engineering & Dev',
          collapsed: false,
          items: [
            { text: 'Frontend Development', link: '/resources/frontend/' },
            { text: 'Backend & APIs', link: '/resources/backend/' },
            { text: 'AI Tools & Agents', link: '/resources/ai-tools/' },
            { text: 'Developer Utilities', link: '/resources/utilities/' },
            { text: 'GitHub & Open Source', link: '/resources/github/' }
          ]
        },
        {
          text: 'Design & Creative',
          collapsed: false,
          items: [
            { text: 'Design & UI', link: '/resources/design/' },
            { text: 'Learning Resources', link: '/resources/learning/' },
            { text: 'Website Inspiration', link: '/resources/inspiration/' },
            { text: 'Productivity', link: '/resources/productivity/' },
            { text: 'Miscellaneous', link: '/resources/miscellaneous/' }
          ]
        },
        {
          text: 'Community & Project',
          collapsed: true,
          items: [
            { text: 'About Developer Hub', link: '/about' },
            { text: 'Suggest a Resource', link: '/contribute' }
          ]
        }
      ],
      '/categories': [
        {
          text: 'Navigation',
          items: [
            { text: 'All Resources', link: '/resources/' },
            { text: 'Category Index', link: '/categories' }
          ]
        },
        {
          text: 'Browse by Category',
          collapsed: false,
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
      { icon: 'github', link: 'https://github.com/azmil666/resource-hub' }
    ],

    footer: {
      message: 'Curated developer knowledge library. Open-source on <a href="https://github.com/azmil666/resource-hub" target="_blank" rel="noopener noreferrer">GitHub</a> under MIT License.',
      copyright: 'Copyright © 2026 Developer Resource Hub.'
    }
  }
});
