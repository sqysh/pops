'use client'

import { useSyncExternalStore } from 'react'

export type ConsentState = 'granted' | 'denied' | 'unset'

const KEY = 'pops-cookie-consent'

const listeners = new Set<() => void>()

let cached: ConsentState | null = null

function readStored(): ConsentState {
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw === 'granted' || raw === 'denied' ? raw : 'unset'
  } catch {
    return 'unset'
  }
}

function emit() {
  listeners.forEach((listener) => listener())
}

export function setConsent(state: ConsentState) {
  try {
    window.localStorage.setItem(KEY, state)
  } catch {
    // private browsing and blocked storage both throw, and neither should
    // stop the banner from closing
  }

  cached = state
  emit()
}

export function getConsent(): ConsentState {
  if (cached === null) cached = readStored()
  return cached
}

function subscribe(onChange: () => void) {
  listeners.add(onChange)

  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return
    cached = null
    onChange()
  }

  window.addEventListener('storage', onStorage)

  return () => {
    listeners.delete(onChange)
    window.removeEventListener('storage', onStorage)
  }
}

const getServerSnapshot = (): ConsentState => 'unset'

export function useConsent() {
  return useSyncExternalStore(subscribe, getConsent, getServerSnapshot)
}
