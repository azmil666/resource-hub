/**
 * Shared context-aware CTA resolver for external resources.
 * Determines the most descriptive button label and icon based on:
 * 1. Specific domain patterns (e.g. YouTube, GitHub, Figma, npm)
 * 2. Resource type fallbacks (e.g. video, tutorial, library, tool)
 * 3. Generic fallback ("Open link")
 */

export interface CtaResult {
  label: string;
  icon: 'play' | 'github' | 'gitlab' | 'package' | 'figma' | 'palette' | 'book-open' | 'sparkles' | 'code' | 'wrench' | 'external-link';
}

export function getCtaLabel(item?: { url?: string; type?: string } | null): CtaResult {
  const url = (item && item.url) ? String(item.url).trim() : '';
  const type = (item && item.type) ? String(item.type).trim().toLowerCase() : '';

  // 1. Domain Resolution (highest precedence)
  if (url) {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.replace(/^www\./, '').toLowerCase();
      const path = parsed.pathname.toLowerCase();

      // YouTube
      if (host === 'youtube.com' || host.endsWith('.youtube.com') || host === 'youtu.be') {
        return { label: 'Watch on YouTube', icon: 'play' };
      }

      // GitHub
      if (host === 'github.com' || host.endsWith('.github.com')) {
        return { label: 'View on GitHub', icon: 'github' };
      }

      // GitLab
      if (host === 'gitlab.com' || host.endsWith('.gitlab.com')) {
        return { label: 'View on GitLab', icon: 'gitlab' };
      }

      // npm
      if (host === 'npmjs.com' || host.endsWith('.npmjs.com')) {
        return { label: 'View on npm', icon: 'package' };
      }

      // PyPI
      if (host === 'pypi.org' || host.endsWith('.pypi.org')) {
        return { label: 'View on PyPI', icon: 'package' };
      }

      // Figma
      if (host === 'figma.com' || host.endsWith('.figma.com')) {
        return { label: 'Open in Figma', icon: 'figma' };
      }

      // Dribbble & Behance
      if (host === 'dribbble.com' || host.endsWith('.dribbble.com')) {
        return { label: 'View on Dribbble', icon: 'palette' };
      }
      if (host === 'behance.net' || host.endsWith('.behance.net')) {
        return { label: 'View on Behance', icon: 'palette' };
      }

      // Articles & Publications
      if (
        host === 'medium.com' || host.endsWith('.medium.com') ||
        host === 'dev.to' || host.endsWith('.dev.to') ||
        host === 'substack.com' || host.endsWith('.substack.com') ||
        host === 'hashnode.dev' || host.endsWith('.hashnode.dev') ||
        host === 'hashnode.com' || host.endsWith('.hashnode.com')
      ) {
        return { label: 'Read article', icon: 'book-open' };
      }

      // Hugging Face
      if (host === 'huggingface.co' || host.endsWith('.huggingface.co')) {
        return { label: 'Open on Hugging Face', icon: 'sparkles' };
      }

      // Interactive Web Demos & Playgrounds
      if (
        host === 'codepen.io' || host.endsWith('.codepen.io') ||
        host === 'codesandbox.io' || host.endsWith('.codesandbox.io') ||
        host === 'stackblitz.com' || host.endsWith('.stackblitz.com')
      ) {
        return { label: 'Open live demo', icon: 'play' };
      }

      // Product Hunt
      if (host === 'producthunt.com' || host.endsWith('.producthunt.com')) {
        return { label: 'View on Product Hunt', icon: 'external-link' };
      }

      // Courses & Learning Platforms
      if (
        host === 'udemy.com' || host.endsWith('.udemy.com') ||
        host === 'coursera.org' || host.endsWith('.coursera.org') ||
        host === 'frontendmasters.com' || host.endsWith('.frontendmasters.com') ||
        host === 'egghead.io' || host.endsWith('.egghead.io')
      ) {
        return { label: 'Start course', icon: 'book-open' };
      }

      // Documentation Subdomains or /docs Paths
      if (host.startsWith('docs.') || path.startsWith('/docs') || path === '/docs') {
        return { label: 'Read documentation', icon: 'book-open' };
      }
    } catch (_) {
      // Fall through to type resolution on invalid URL
    }
  }

  // 2. Resource Type Fallbacks
  switch (type) {
    case 'video':
      return { label: 'Watch video', icon: 'play' };
    case 'github-repository':
      return { label: 'View repository', icon: 'github' };
    case 'tutorial':
      return { label: 'Start tutorial', icon: 'book-open' };
    case 'course':
      return { label: 'Start course', icon: 'book-open' };
    case 'documentation':
      return { label: 'Read documentation', icon: 'book-open' };
    case 'article':
      return { label: 'Read article', icon: 'book-open' };
    case 'library':
      return { label: 'View library', icon: 'package' };
    case 'api':
      return { label: 'Explore API', icon: 'code' };
    case 'tool':
      return { label: 'Open tool', icon: 'wrench' };
    case 'website':
      return { label: 'Visit website', icon: 'external-link' };
    default:
      return { label: 'Open link', icon: 'external-link' };
  }
}
