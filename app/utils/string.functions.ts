export const isStringInPath = (path: string, searchString: string) => {
  return path.includes(searchString)
}

export const toggleHeaderFooter = (pathname: string) => {
  const validPaths = [
    '/',
    '/concerts',
    '/venues',
    '/about',
    '/robyn-bell',
    '/board-members',
    '/staff',
    '/contact',
    '/education',
    '/support',
    '/advertise-with-us',
    '/subscribe',
    '/camp-application',
    '/camp-info',
    '/photo-gallery',
    '/coming-soon',
    '/accessibility',
    '/privacy-policy',
    '/student-performers',
    '/student-scholarships',
    '/media',
    '/hidden-gems',
    '/sponsorship-opportunities',
    '/musicians',
    '/news',
    '/donate',
    '/subscriptions',
    '/sundays-at-neel'
  ]

  const validPatterns = [/^\/concerts\/[^\/]+$/]

  const isValidPath = validPaths.some((path) => pathname === path)
  const containsPath = validPatterns.some((pattern: { test: (arg0: string) => any }) => pattern.test(pathname))

  // If the current pathname is invalid (not in the valid paths), exclude header and footer
  return isValidPath || containsPath
}
