'use client'

import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { MetaPixel } from './Metapixel'
import { useConsent } from '@/app/lib/hooks/useConsent'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export function SiteAnalytics() {
  const tracking = useConsent() === 'accepted'

  return (
    <>
      {/* Cookieless and carries no identifier, so it runs without consent. */}
      <Analytics />

      {tracking && GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="lazyOnload" />
          <Script id="google-analytics" strategy="lazyOnload">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}
          </Script>
        </>
      )}

      {tracking && <MetaPixel />}
    </>
  )
}
