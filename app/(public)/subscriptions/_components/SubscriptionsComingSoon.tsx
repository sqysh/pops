import { Bell, Phone } from 'lucide-react'
import Link from 'next/link'
import { pageCopy } from '@/app/lib/page-content/copy'
import { pageContent } from '@/app/lib/constants/page-content/subscriptions'

export function SubscriptionsComingSoon({ content }: { content: unknown }) {
  const { t } = pageCopy(content, pageContent)
  const phone = t('subscriptions_phone')

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-border-dark">
        <div className="max-w-5xl mx-auto px-4 760:px-6 h-12 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 group focus-visible:outline-none">
            <span className="text-primary-dark text-[11px] group-hover:text-white transition-colors" aria-hidden="true">
              ▸
            </span>
            <span className="text-[12px] font-mono uppercase tracking-widest text-muted-dark group-hover:text-text-dark transition-colors">
              {t('subscriptions_soon_brand')}
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 760:px-6 py-20">
        <div className="flex flex-col items-center gap-6 max-w-lg text-center">
          <div className="flex items-center gap-3">
            <div className="w-5 h-px bg-blaze shrink-0" aria-hidden="true" />
            <span className="font-changa text-[12px] uppercase tracking-[0.3em] text-white/50">
              {t('subscriptions_soon_eyebrow')}
            </span>
            <div className="w-5 h-px bg-blaze shrink-0" aria-hidden="true" />
          </div>

          <Bell className="w-8 h-8 text-blaze" aria-hidden="true" />

          <h1 className="font-changa font-black text-4xl 760:text-6xl text-white leading-[0.9]">
            {t('subscriptions_soon_heading_line1')}
            <br />
            {t('subscriptions_soon_heading_line2')}
          </h1>

          <p className="font-lato text-white/60 text-base 760:text-lg leading-relaxed">{t('subscriptions_soon_message')}</p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href={`tel:+1${phone.replace(/\D/g, '')}`}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-blaze hover:bg-blazehover text-white font-changa text-sm uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
              {t('subscriptions_soon_call_button')}
            </a>
            <Link
              href="/"
              className="inline-flex items-center font-changa text-[12px] uppercase tracking-widest px-5 py-3.5 border border-white/20 text-white/80 hover:text-white hover:border-white/40 transition-colors"
            >
              {t('subscriptions_soon_home_button')}
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
