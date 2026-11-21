const PAGE_NAMES: Record<string, string> = {
  home: 'Home',
  footer: 'Site footer',
  'sundays-at-neel': 'Sundays@Neel',
  'robyn-bell': 'Robyn Bell',
  'bubbles-bash': 'Bubbles Bash',
  navigation: 'Site menu',
  'not-found': 'Page not found (404)',
  'server-error': 'Error page (500)',
  login: 'Staff sign in',
  'auth-error': 'Sign in error',
  'chair-sponsorships': 'Chair Sponsorships (retired page)'
}

/** Slugs that are site furniture rather than a page you can open. */
const NOT_ROUTABLE = new Set(['footer', 'navigation', 'not-found', 'server-error', 'chair-sponsorships'])

/** Slugs whose page lives somewhere other than /<slug>. */
const PATHS: Record<string, string> = { home: '/', 'auth-error': '/auth/error' }

const MINOR_WORDS = new Set(['a', 'an', 'and', 'at', 'for', 'in', 'of', 'on', 'or', 'the', 'to', 'with'])

export function pageName(slug: string) {
  if (PAGE_NAMES[slug]) return PAGE_NAMES[slug]

  return slug
    .split('-')
    .map((word, i, all) => {
      const minor = i > 0 && i < all.length - 1 && MINOR_WORDS.has(word)
      return minor ? word : word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

/** Where the page lives on the public site, or null when there is nowhere to go. */
export function pagePath(slug: string) {
  if (NOT_ROUTABLE.has(slug)) return null
  return PATHS[slug] ?? `/${slug}`
}
