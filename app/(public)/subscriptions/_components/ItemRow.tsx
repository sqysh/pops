import { motion } from 'framer-motion'
import { STATUS_LABEL } from '@/app/lib/constants/subscription.constants'
import { ISubscription, SubscriptionStatus } from '@/app/types/entities/subscription.types'
import { ExternalLink } from 'lucide-react'

const STATUS_CLASS: Record<SubscriptionStatus, string> = {
  ON_SALE: 'text-emerald-400 border border-emerald-400/30 bg-emerald-400/5',
  NOT_ON_SALE: 'text-white/70 border border-white/10'
}

/** The page only passes visible items through, so every item here is public. */
export function ItemRow({ item, index, delay = 0 }: { item: ISubscription; index: number; delay?: number }) {
  const tiers = item.pricingTiers ?? []
  const fromPrice = tiers[0]?.price
  const onSale = item.status === 'ON_SALE'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ delay: index * 0.06 + delay, duration: 0.4 }}
      className="flex flex-col gap-6 py-8 border-b border-white/8 last:border-0"
    >
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
            <span className={`font-changa text-[11px] tracking-widest uppercase px-2 py-0.5 ${STATUS_CLASS[item.status]}`}>
              {STATUS_LABEL[item.status]}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {onSale && item.publicUrl && (
            <a
              href={item.publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Purchase ${item.name}, opens our ticketing site in a new tab`}
              className="inline-flex items-center gap-2 font-changa text-[11px] tracking-widest uppercase px-6 py-2.5 bg-blaze hover:bg-blazehover text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Purchase
              <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>

      {tiers.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {tiers.map((tier) => (
            <div key={tier.label} className="flex flex-col gap-0.5 border border-white/10 px-4 py-3 min-w-32">
              <span className="font-changa text-white text-lg leading-none">{tier.price}</span>
              <span className="font-lato text-white/60 text-[12px] uppercase tracking-wider">{tier.label}</span>
            </div>
          ))}
        </div>
      )}

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

export function Section({ title, items, delay = 0 }: { title: string; items: ISubscription[]; delay?: number }) {
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
