export interface CategoryMeta {
  slug: string;
  name: string;
  description: string;
  icon: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    slug: 'design',
    name: 'Design & UI',
    description: 'Design systems, UI kits, icon libraries, color palettes, typography, and styling tools.',
    icon: 'palette'
  },
  {
    slug: 'frontend',
    name: 'Frontend Development',
    description: 'Frameworks, CSS architectures, component libraries, state management, and web standards.',
    icon: 'layout'
  },
  {
    slug: 'backend',
    name: 'Backend & APIs',
    description: 'Server runtimes, databases, ORMs, REST/GraphQL APIs, authentication, and cloud infrastructure.',
    icon: 'server'
  },
  {
    slug: 'ai-tools',
    name: 'AI Tools',
    description: 'Large language models, code generation assistants, AI SDKs, vector databases, and prompt tools.',
    icon: 'sparkles'
  },
  {
    slug: 'utilities',
    name: 'Developer Utilities',
    description: 'Code formatters, linters, regex tools, JSON utilities, converters, and debugging aids.',
    icon: 'wrench'
  },
  {
    slug: 'learning',
    name: 'Learning Resources',
    description: 'Free interactive courses, programming tutorials, architectural roadmaps, and technical books.',
    icon: 'book-open'
  },
  {
    slug: 'github',
    name: 'GitHub & Open Source',
    description: 'Standout open-source repositories, starter templates, developer boilerplates, and community tools.',
    icon: 'github'
  },
  {
    slug: 'inspiration',
    name: 'Website Inspiration',
    description: 'Showcase galleries, award-winning web design, creative coding examples, and UI benchmarks.',
    icon: 'compass'
  },
  {
    slug: 'productivity',
    name: 'Productivity',
    description: 'Terminal workflows, shell enhancements, window managers, time savers, and developer notes.',
    icon: 'zap'
  },
  {
    slug: 'miscellaneous',
    name: 'Miscellaneous',
    description: 'Useful cheat sheets, curated lists, domain tools, and uncategorized technical gems.',
    icon: 'archive'
  }
];

export const CATEGORY_MAP = new Map<string, CategoryMeta>(
  CATEGORIES.map(c => [c.slug, c])
);

export function getCategory(slug: string): CategoryMeta {
  if (!slug) {
    return {
      slug: 'miscellaneous',
      name: 'Miscellaneous',
      description: 'Useful developer references and uncategorized tools.',
      icon: 'archive'
    };
  }
  const clean = slug.toLowerCase().trim();
  return (
    CATEGORY_MAP.get(clean) || {
      slug: clean,
      name: clean.charAt(0).toUpperCase() + clean.slice(1),
      description: `Curated resources in the ${clean} domain.`,
      icon: 'folder'
    }
  );
}
