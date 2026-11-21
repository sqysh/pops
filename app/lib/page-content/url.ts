/** Where staff manage CueBox. Visitors cannot open it, so it is never a valid public link. */
const CUEBOX_ADMIN_HOST = 'app.getcuebox.com'

export type PublicUrlProblem = 'format' | 'admin-link'

/** null when the text is a web address a visitor can open (or is blank). */
export function publicUrlProblem(text: string): PublicUrlProblem | null {
  const value = text.trim()
  if (!value) return null

  let url: URL
  try {
    url = new URL(value)
  } catch {
    return 'format'
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') return 'format'
  if (!url.hostname.includes('.')) return 'format'
  if (url.hostname === CUEBOX_ADMIN_HOST) return 'admin-link'
  return null
}

export const publicUrlMessage = (problem: PublicUrlProblem, label: string) =>
  problem === 'admin-link'
    ? `"${label}" is the CueBox admin link, which visitors cannot open. Use the public ticket link instead.`
    : `"${label}" must be a full web address that starts with https://`
