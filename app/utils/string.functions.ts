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
    '/connect-with-us',
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
    '/news'
  ]

  const validPatterns = [/^\/concerts\/[^\/]+$/]

  const isValidPath = validPaths.some((path) => pathname === path)
  const containsPath = validPatterns.some((pattern: { test: (arg0: string) => any }) => pattern.test(pathname))

  // If the current pathname is invalid (not in the valid paths), exclude header and footer
  return isValidPath || containsPath
}

export const formatPhoneNumberForMailchimp = (phone?: string | null) => {
  if (!phone) return ''

  const digitsOnly = phone.replace(/\D/g, '')

  // If it starts with 1 and is 11 digits, strip the 1
  const cleaned = digitsOnly.length === 11 && digitsOnly.startsWith('1') ? digitsOnly.slice(1) : digitsOnly

  // Format only if it's exactly 10 digits now
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }

  return ''
}
