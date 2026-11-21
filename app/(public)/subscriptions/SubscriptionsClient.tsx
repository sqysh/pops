'use client'

import { Phone } from 'lucide-react'
import CompactPageHero from '@/app/(public)/_components/CompactPageHero'
import { ISubscription } from '@/app/types/entities/subscription.types'
import { pageCopy } from '@/app/lib/page-content/copy'
import { pageContent } from '@/app/lib/constants/page-content/subscriptions'
import { Section } from './_components/ItemRow'
import { SubscriptionsComingSoon } from './_components/SubscriptionsComingSoon'

export default function SubscriptionsClient({
  subscriptionsLive,
  subscriptions: items,
  content
}: {
  subscriptionsLive: boolean
  subscriptions: ISubscription[]
  content: unknown
}) {
  const { t } = pageCopy(content, pageContent)
  const phone = t('subscriptions_phone')

  if (!subscriptionsLive) {
    return <SubscriptionsComingSoon content={content} />
  }

  const subscriptions = items.filter((i) => i.type === 'SUBSCRIPTION')
  const flex = items.filter((i) => i.type === 'FLEX')

  return (
    <div className="min-h-screen bg-black text-white">
      <CompactPageHero
        homeLabel={t('subscriptions_hero_home_crumb')}
        breadcrumbLabel={t('subscriptions_sr_breadcrumb')}
        breadcrumb={t('subscriptions_hero_breadcrumb')}
        eyebrow={t('subscriptions_hero_overline')}
        heading={t('subscriptions_hero_heading')}
        description={t('subscriptions_hero_description')}
      />

      <div className="max-w-5xl mx-auto px-4 760:px-6 py-16 760:py-20 flex flex-col gap-16">
        {flex.length > 0 && <Section title={t('subscriptions_flex_heading')} items={flex} content={content} />}
        {subscriptions.length > 0 && (
          <Section title={t('subscriptions_season_heading')} items={subscriptions} delay={0.1} content={content} />
        )}

        <div className="border-t border-white/10 pt-12 flex flex-col 760:flex-row 760:items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <div className="w-4 h-px bg-blaze shrink-0" aria-hidden="true" />
              <span className="font-changa text-[12px] uppercase tracking-[0.25em] text-white/70">
                {t('subscriptions_help_heading')}
              </span>
            </div>
            <p className="font-lato text-white/80 text-base max-w-md">{t('subscriptions_help_message')}</p>
          </div>

          <div className="flex flex-col 480:flex-row items-start 480:items-center gap-3 shrink-0">
            <a
              href={`tel:+1${phone.replace(/\D/g, '')}`}
              className="inline-flex items-center gap-2 font-changa text-[12px] uppercase tracking-widest px-5 py-2.5 border border-white/20 text-white/80 hover:text-white hover:border-white/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Phone className="w-3.5 h-3.5" aria-hidden="true" />
              {phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
