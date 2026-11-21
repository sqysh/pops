'use client'

import Link from 'next/link'
import { storeConsent } from '@/app/utils/consent.utils'
import { useConsent } from '@/app/lib/hooks/useConsent'
import { pageCopy } from '@/app/lib/page-content/copy'
import { pageContent } from '@/app/lib/constants/page-content/footer'

export function CookieConsentBanner({ content }: { content: unknown }) {
  const consent = useConsent()
  const { t } = pageCopy(content, pageContent)

  if (consent !== null) return null

  return (
    <div role="region" aria-label={t('footer_cookie_banner_label')} className="fixed inset-x-0 bottom-0 z-100 p-4 990:p-6">
      <div className="max-w-3xl mx-auto bg-black border border-white/15 shadow-2xl p-5 990:p-6 flex flex-col 760:flex-row 760:items-center gap-4 760:gap-6">
        <p className="font-lato text-white/80 text-sm leading-relaxed flex-1">
          {t('footer_cookie_text')}{' '}
          <Link
            href="/privacy-policy"
            className="text-sunburst underline hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunburst rounded-sm"
          >
            {t('footer_cookie_policy_link')}
          </Link>
          {t('footer_cookie_text_end')}
        </p>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => storeConsent('declined')}
            className="font-changa text-xs uppercase tracking-widest px-5 py-2.5 border border-white/20 text-white/80 hover:text-white hover:border-white/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {t('footer_cookie_decline')}
          </button>
          <button
            type="button"
            onClick={() => storeConsent('accepted')}
            className="font-changa text-xs uppercase tracking-widest px-5 py-2.5 bg-blaze hover:bg-blazehover text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {t('footer_cookie_accept')}
          </button>
        </div>
      </div>
    </div>
  )
}
