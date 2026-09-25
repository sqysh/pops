'use client'

import { useSyncExternalStore } from 'react'
import { getStoredConsent, type ConsentValue } from '@/app/utils/consent.utils'

/** 'unknown' on the server and in the first client render, null once we know nobody has decided. */
export type ConsentState = ConsentValue | null | 'unknown'

function subscribe(callback: () => void) {
  window.addEventListener('consentchange', callback)
  window.addEventListener('storage', callback)

  return () => {
    window.removeEventListener('consentchange', callback)
    window.removeEventListener('storage', callback)
  }
}

// The server can't know what's in localStorage, so it reports 'unknown' rather
// than null. Without that the banner renders in the HTML for everyone and
// flashes on for returning visitors before hydration hides it again.
const getServerSnapshot = (): ConsentState => 'unknown'

export function useConsent(): ConsentState {
  return useSyncExternalStore(subscribe, getStoredConsent, getServerSnapshot)
}
