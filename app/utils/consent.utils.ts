export const CONSENT_KEY = 'pops_cookie_consent'

export type ConsentValue = 'accepted' | 'declined'

// When storage is blocked the choice can't persist, but it still has to hold
// for this page view or the banner never closes.
let inMemory: ConsentValue | null = null

export function getStoredConsent(): ConsentValue | null {
  if (typeof window === 'undefined') return null

  try {
    const v = window.localStorage.getItem(CONSENT_KEY)
    if (v === 'accepted' || v === 'declined') return v
  } catch {
    // fall through to the in-memory value
  }

  return inMemory
}

export function storeConsent(value: ConsentValue) {
  inMemory = value

  try {
    window.localStorage.setItem(CONSENT_KEY, value)
  } catch {
    // blocked storage, so the choice lasts the session only
  }

  window.dispatchEvent(new CustomEvent('consentchange', { detail: value }))
}
