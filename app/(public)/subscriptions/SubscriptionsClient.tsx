'use client'

import { Phone } from 'lucide-react'
import CompactPageHero from '@/app/(public)/_components/CompactPageHero'
import { ISubscription } from '@/app/types/entities/subscription.types'
import { Section } from './_components/ItemRow'
import { SubscriptionsComingSoon } from './_components/SubscriptionsComingSoon'

export default function SubscriptionsClient({
  subscriptionsLive,
  subscriptions: items
}: {
  subscriptionsLive: boolean
  subscriptions: ISubscription[]
}) {
  if (!subscriptionsLive) {
    return <SubscriptionsComingSoon />
  }

  const subscriptions = items.filter((i) => i.type === 'SUBSCRIPTION')
  const flex = items.filter((i) => i.type === 'FLEX')

  return (
    <div className="min-h-screen bg-black text-white">
      <CompactPageHero
        breadcrumb="Subscriptions"
        heading="Season Packages"
        description="Experience the full magic of the 2026–27 season. Choose a subscription or flex package and save on the best seats in Sarasota and Bradenton."
      />

      <div className="max-w-5xl mx-auto px-4 760:px-6 py-16 760:py-20 flex flex-col gap-16">
        {flex.length > 0 && <Section title="Flex Packages" items={flex} />}
        {subscriptions.length > 0 && <Section title="Season Subscriptions" items={subscriptions} delay={0.1} />}

        <div className="border-t border-white/10 pt-12 flex flex-col 760:flex-row 760:items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <div className="w-4 h-px bg-blaze shrink-0" aria-hidden="true" />
              <span className="font-changa text-[12px] uppercase tracking-[0.25em] text-white/70">Need Help Choosing?</span>
            </div>
            <p className="font-lato text-white/80 text-base max-w-md">
              Our box office team is happy to help you find the right package for your schedule and interests.
            </p>
          </div>

          <div className="flex flex-col 480:flex-row items-start 480:items-center gap-3 shrink-0">
            <a
              href="tel:+19419267677"
              className="inline-flex items-center gap-2 font-changa text-[12px] uppercase tracking-widest px-5 py-2.5 border border-white/20 text-white/80 hover:text-white hover:border-white/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Phone className="w-3.5 h-3.5" aria-hidden="true" />
              941-926-7677
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
