import { createContentLoader } from 'vitepress';

export interface ResourceItem {
  title: string;
  description: string;
  category: string;
  type: string;
  url: string;
  pricing: 'free' | 'freemium' | 'paid' | 'unknown';
  tags: string[];
  status: 'published' | 'needs-review' | 'archived';
  featured?: boolean;
  dateAdded?: string;
  urlPath: string;
  slug: string;
}

export declare const data: ResourceItem[];

export default createContentLoader('resources/**/*.md', {
  includeSrc: false,
  transform(raw): ResourceItem[] {
    return raw
      .filter(({ url, frontmatter }) => {
        // Exclude directory index pages
        if (!url) return false;
        const clean = url.replace(/\/$/, '');
        if (clean === '/resources' || clean.endsWith('/index')) return false;
        // Verify this is a resource page and published
        return frontmatter && frontmatter.title && (frontmatter.status === 'published' || !frontmatter.status);
      })
      .map(({ url, frontmatter }) => {
        const cleanUrl = url.replace(/\.html$/, '');
        const parts = cleanUrl.split('/').filter(Boolean);
        const slug = parts[parts.length - 1] || '';

        return {
          title: String(frontmatter.title || slug),
          description: String(frontmatter.description || ''),
          category: String(frontmatter.category || 'miscellaneous').toLowerCase(),
          type: String(frontmatter.type || 'website').toLowerCase(),
          url: String(frontmatter.url || ''),
          pricing: (frontmatter.pricing || 'unknown') as ResourceItem['pricing'],
          tags: Array.isArray(frontmatter.tags)
            ? Array.from(
                new Set(
                  frontmatter.tags
                    .filter((t: any) => typeof t === 'string' && t.trim().length > 0)
                    .map((t: string) => t.trim().toLowerCase())
                    .filter((t: string) => t !== '[object object]' && !t.includes('[object'))
                )
              )
            : [],
          status: (frontmatter.status || 'published') as ResourceItem['status'],
          featured: Boolean(frontmatter.featured),
          dateAdded: frontmatter.dateAdded ? String(frontmatter.dateAdded) : '',
          urlPath: cleanUrl,
          slug
        };
      })
      .sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
  }
});
