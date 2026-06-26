'use client'

import { PublicMarquee } from '@/app/components/elements/PublicMarquee'
import { FloatingParticles } from '@/app/components/FloatingParticles'
import { ISubscription } from '@/app/types/entities/subscription.types'
import { motion } from 'framer-motion'
import { Bell, ExternalLink, Phone } from 'lucide-react'
import Link from 'next/link'

const statusCls = (status: string) => {
  switch (status) {
    case 'ON_SALE':
      return 'text-emerald-400 border border-emerald-400/30 bg-emerald-400/5'
    case 'PRESALE':
      return 'text-yellow-400 border border-yellow-400/30 bg-yellow-400/5'
    case 'NOT_ON_SALE':
      return 'text-white/70 border border-white/10'
    case 'SOLD_OUT':
      return 'text-orange-400 border border-orange-400/30 bg-orange-400/5'
    default:
      return 'text-white/60 border border-white/10'
  }
}

const STATUS_LABEL: Record<string, string> = {
  ON_SALE: 'On Sale',
  PRESALE: 'Presale',
  NOT_ON_SALE: 'Coming Soon',
  SOLD_OUT: 'Sold Out',
  CANCELED: 'Canceled'
}

function ItemRow({ item, index, delay = 0 }: { item: ISubscription; index: number; delay?: number }) {
  const fromPrice = item.pricingTiers?.[0]?.price

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ delay: index * 0.06 + delay, duration: 0.4 }}
      className="flex flex-col gap-6 py-8 border-b border-white/8 last:border-0"
    >
      {/* Header — name/tagline/status + CTA */}
      <div className="flex flex-col 480:flex-row 480:items-start justify-between gap-4">
        <div className="flex flex-col gap-2 min-w-0">
          <h3 className="font-changa font-black text-xl 760:text-2xl text-white leading-tight">{item.name}</h3>

          {item.tagline && <p className="font-lato text-white/70 text-sm 760:text-base leading-snug">{item.tagline}</p>}

          {fromPrice && (
            <p className="font-changa text-white text-sm tracking-wide">
              From <span className="text-blaze-text">{fromPrice}</span>
            </p>
          )}

          <div className="flex items-center gap-2 flex-wrap pt-0.5">
            <span className={`font-changa text-[11px] tracking-widest uppercase px-2 py-0.5 ${statusCls(item.status)}`}>
              {STATUS_LABEL[item.status] ?? item.status.replace('_', ' ')}
            </span>
            {!item.isVisible && (
              <span className="font-changa text-[11px] tracking-widest uppercase px-2 py-0.5 text-white/60 border border-white/10">
                Not Yet Available
              </span>
            )}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-3 shrink-0">
          {item.publicUrl && item.isVisible && item.status === 'ON_SALE' && (
            <a
              href={item.publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-changa text-[11px] tracking-widest uppercase px-6 py-2.5 bg-blaze hover:bg-blazehover text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Purchase
              <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            </a>
          )}
          {item.isVisible && item.status === 'NOT_ON_SALE' && (
            <span className="font-changa text-[12px] uppercase tracking-[0.25em] text-white/60">Available Soon</span>
          )}
        </div>
      </div>

      {/* Pricing tiers */}
      {item.pricingTiers && item.pricingTiers.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {item.pricingTiers.map((tier, i) => (
            <div key={i} className="flex flex-col gap-0.5 border border-white/10 px-4 py-3 min-w-32">
              <span className="font-changa text-white text-lg leading-none">{tier.price}</span>
              <span className="font-lato text-white/60 text-[12px] uppercase tracking-wider">{tier.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Description */}
      {item.description && (
        <div className="font-lato text-white/85 text-sm 760:text-base leading-relaxed max-w-3xl flex flex-col gap-3">
          {item.description
            .split(/\n{2,}/)
            .map((para) => para.trim())
            .filter(Boolean)
            .map((para, i) => (
              <p key={i} className="whitespace-pre-line">
                {para}
              </p>
            ))}
        </div>
      )}
    </motion.div>
  )
}

function Section({ title, items, delay = 0 }: { title: string; items: any[]; delay?: number }) {
  return (
    <section>
      <div className="flex items-center gap-4 mb-2">
        <div className="w-6 h-px bg-blaze shrink-0" aria-hidden="true" />
        <h2 className="font-changa font-black text-2xl 760:text-3xl text-white">{title}</h2>
      </div>
      <div className="border-t border-white/10">
        {items.map((item, i) => (
          <ItemRow key={item.id} item={item} index={i} delay={delay} />
        ))}
      </div>
    </section>
  )
}

export function SubscriptionsComingSoon() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-border-dark">
        <div className="max-w-5xl mx-auto px-4 760:px-6 h-12 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 group focus-visible:outline-none">
            <span className="text-primary-dark text-[11px] group-hover:text-white transition-colors" aria-hidden="true">
              ▸
            </span>
            <span className="text-[12px] font-mono uppercase tracking-widest text-muted-dark group-hover:text-text-dark transition-colors">
              The Pops Orchestra
            </span>
          </Link>
        </div>
      </header>

      {/* Coming soon body */}
      <main className="flex-1 flex items-center justify-center px-4 760:px-6 py-20">
        <div className="flex flex-col items-center gap-6 max-w-lg text-center">
          <div className="flex items-center gap-3">
            <div className="w-5 h-px bg-blaze shrink-0" aria-hidden="true" />
            <span className="font-changa text-[12px] uppercase tracking-[0.3em] text-white/50">2026–27 Season</span>
            <div className="w-5 h-px bg-blaze shrink-0" aria-hidden="true" />
          </div>

          <Bell className="w-8 h-8 text-blaze" aria-hidden="true" />

          <h1 className="font-changa font-black text-4xl 760:text-6xl text-white leading-[0.9]">
            Season Packages
            <br />
            Coming Soon
          </h1>

          <p className="font-lato text-white/60 text-base 760:text-lg leading-relaxed">
            Subscriptions and flex packages for the 2026–27 season aren&apos;t available just yet. Check back soon, or
            call our box office and we&apos;ll help you plan ahead.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="tel:9419267677"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-blaze hover:bg-blazehover text-white font-changa text-sm uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
              941-926-POPS
            </a>
            <Link
              href="/"
              className="inline-flex items-center font-changa text-[12px] uppercase tracking-widest px-5 py-3.5 border border-white/20 text-white/80 hover:text-white hover:border-white/40 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function SubscriptionsClient({
  subscriptionsLive,
  subscriptions: items
}: {
  subscriptionsLive: boolean
  subscriptions: ISubscription[]
}) {
  const subscriptions = items.filter((i) => i.type === 'SUBSCRIPTION')
  const flex = items.filter((i) => i.type === 'FLEX')

  if (!subscriptionsLive) {
    return <SubscriptionsComingSoon />
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-border-dark">
        <div className="max-w-5xl mx-auto px-4 760:px-6 h-12 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group focus-visible:outline-none">
            <span className="text-primary-dark text-[11px] group-hover:text-white transition-colors" aria-hidden="true">
              ▸
            </span>
            <span className="text-[12px] font-mono uppercase tracking-widest text-muted-dark group-hover:text-text-dark transition-colors">
              The Pops Orchestra
            </span>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative border-b border-white/10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/nikki-fire.webp')",
            backgroundSize: 'cover',
            backgroundPosition: 'center center'
          }}
          aria-hidden="true"
        />
        <FloatingParticles count={80} />
        <div className="absolute inset-0 bg-linear-to-r from-black via-black/50 to-transparent" />

        <div className="relative max-w-5xl mx-auto px-4 760:px-6 py-20 760:py-28 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="w-5 h-px bg-blaze shrink-0" aria-hidden="true" />
            <span className="font-changa text-[12px] uppercase tracking-[0.3em] text-white/70">The Pops Orchestra</span>
          </div>
          <h1 className="font-changa font-black text-5xl 760:text-7xl text-white leading-[0.9] max-w-xl">
            Season
            <br />
            Packages
          </h1>
          <p className="font-lato text-white/90 text-base 760:text-lg leading-relaxed max-w-lg">
            Experience the full magic of the 2026–27 season. Choose a subscription or flex package and save on the best
            seats in Sarasota and Bradenton.
          </p>
          <div className="flex flex-wrap items-center gap-5 pt-2">
            <a
              href="tel:9419267677"
              className="flex items-center gap-1.5 font-changa text-[12px] uppercase tracking-widest text-white/70 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              941-926-POPS
            </a>
          </div>
        </div>
      </section>

      <PublicMarquee
        items={[
          '2026–27 Season Packages Now Available',
          'Save Up to 20% vs Individual Tickets',
          'Priority Seating for Subscribers',
          'Call 941-926-POPS for Assistance',
          'Flexible Packages — Choose Your Concerts'
        ]}
      />

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 760:px-6 py-16 760:py-20 flex flex-col gap-16">
        {subscriptions.length > 0 && <Section title="Season Subscriptions" items={subscriptions} delay={0} />}

        {flex.length > 0 && <Section title="Flex Packages" items={flex} delay={0.1} />}

        {/* Contact block */}
        <div className="border-t border-white/10 pt-12 flex flex-col 760:flex-row 760:items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <div className="w-4 h-px bg-blaze shrink-0" aria-hidden="true" />
              <span className="font-changa text-[12px] uppercase tracking-[0.25em] text-white/70">
                Need Help Choosing?
              </span>
            </div>
            <p className="font-lato text-white/80 text-base max-w-md">
              Our box office team is happy to help you find the right package for your schedule and interests.
            </p>
          </div>
          <div className="flex flex-col 480:flex-row items-start 480:items-center gap-3 shrink-0">
            <a
              href="tel:9419267677"
              className="inline-flex items-center gap-2 font-changa text-[12px] uppercase tracking-widest px-5 py-2.5 border border-white/20 text-white/80 hover:text-white hover:border-white/40 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              941-926-7677
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 760:px-12 990:px-16 py-5">
        <div className="max-w-5xl mx-auto px-4 760:px-6 flex flex-col 480:flex-row items-start 480:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-4 h-px bg-blaze shrink-0" aria-hidden="true" />
            <span className="font-changa text-[12px] uppercase tracking-[0.25em] text-white/70">
              The Pops Orchestra · 2026–27 Season
            </span>
          </div>
          <nav className="flex items-center gap-5">
            <Link
              href="/"
              className="font-changa text-[12px] uppercase tracking-widest text-white/90 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              href="/concerts-test"
              className="font-changa text-[12px] uppercase tracking-widest text-white/90 hover:text-white transition-colors"
            >
              Concerts
            </Link>
            <Link
              href="/support"
              className="font-changa text-[12px] uppercase tracking-widest text-white/90 hover:text-white transition-colors"
            >
              Support
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
