'use client'

import Link from 'next/link'
import { storeConsent } from '@/app/utils/consent.utils'
import { useConsent } from '@/app/lib/hooks/useConsent'

export function CookieConsent() {
  const consent = useConsent()

  if (consent !== null) return null

  return (
    <div role="region" aria-label="Cookie consent" className="fixed inset-x-0 bottom-0 z-100 p-4 990:p-6">
      <div className="max-w-3xl mx-auto bg-black border border-white/15 shadow-2xl p-5 990:p-6 flex flex-col 760:flex-row 760:items-center gap-4 760:gap-6">
        <p className="font-lato text-white/80 text-sm leading-relaxed flex-1">
          We use cookies for analytics and advertising, including Google Analytics and the Meta Pixel, to understand how our site
          is used and to promote our concerts. You can accept or decline. See our{' '}
          <Link
            href="/privacy-policy"
            className="text-sunburst underline hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunburst rounded-sm"
          >
            Privacy Policy
          </Link>
          .
        </p>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => storeConsent('declined')}
            className="font-changa text-xs uppercase tracking-widest px-5 py-2.5 border border-white/20 text-white/80 hover:text-white hover:border-white/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => storeConsent('accepted')}
            className="font-changa text-xs uppercase tracking-widest px-5 py-2.5 bg-blaze hover:bg-blazehover text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
