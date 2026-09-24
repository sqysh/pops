'use client'

import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { COL, STATUS_LABEL, TYPE_LABEL } from '@/app/lib/constants/subscription.constants'
import { ISubscription } from '@/app/types/entities/subscription.types'
import { formatDate } from '@/app/lib/utils/date.utils'

/** Falls back to neutral, so a status added later still renders sensibly. */
const STATUS_TONE: Record<string, { dot: string; pill: string }> = {
  ON_SALE: { dot: 'bg-emerald-500', pill: 'text-emerald-700 bg-emerald-50 ring-emerald-200' },
  PRESALE: { dot: 'bg-amber-500', pill: 'text-amber-800 bg-amber-50 ring-amber-200' },
  SOLD_OUT: { dot: 'bg-orange-500', pill: 'text-orange-800 bg-orange-50 ring-orange-200' },
  NOT_ON_SALE: { dot: 'bg-neutral-400', pill: 'text-neutral-600 bg-neutral-100 ring-neutral-300' },
  ARCHIVED: { dot: 'bg-neutral-400', pill: 'text-neutral-600 bg-neutral-100 ring-neutral-300' }
}

const NEUTRAL_TONE = { dot: 'bg-neutral-400', pill: 'text-neutral-600 bg-neutral-100 ring-neutral-300' }

export function SubscriptionRow({
  subscription: s,
  index,
  onEdit
}: {
  subscription: ISubscription
  index: number
  onEdit: (s: ISubscription) => void
}) {
  const tone = STATUS_TONE[s.status] ?? NEUTRAL_TONE
  // both flags have to be true before a patron can find and buy it
  const isLive = s.status === 'ON_SALE' && s.isVisible

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, delay: Math.min(index * 0.01, 0.15) }}
      role="button"
      tabIndex={0}
      onClick={() => onEdit(s)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onEdit(s)
        }
      }}
      aria-label={`Edit ${s.name}`}
      className={`grid ${COL} items-center gap-3 px-4 py-3 border-b border-neutral-200 last:border-0 cursor-pointer transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-inset`}
    >
      {/* Name */}
      <div className="min-w-0">
        <p className="truncate text-neutral-900">{s.name}</p>
        {s.publicUrl && (
          <a
            href={s.publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            aria-label={`Open the public page for ${s.name} in a new tab`}
            className="inline-flex items-center gap-1 text-neutral-500 hover:text-blaze-text hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze rounded-sm"
          >
            Public page
            <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
          </a>
        )}
      </div>

      {/* Type */}
      <span className="truncate text-neutral-700">{TYPE_LABEL[s.type]}</span>

      {/* Status */}
      <div>
        <span
          className={`inline-flex items-center gap-1.5 shrink-0 text-xs font-medium rounded-full ring-1 px-2 py-0.5 ${tone.pill}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${tone.dot}`} aria-hidden="true" />
          {STATUS_LABEL[s.status]}
        </span>
      </div>

      {/* On the site — the answer, not one of the two flags behind it */}
      <span className={`flex items-center gap-2 ${isLive ? 'text-neutral-900' : 'text-neutral-500'}`}>
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${isLive ? 'bg-emerald-500' : 'bg-neutral-300'}`}
          aria-hidden="true"
        />
        {isLive ? 'Yes' : s.isVisible ? 'No, not on sale' : 'No, hidden'}
      </span>

      {/* Updated */}
      <span className="truncate text-neutral-500 tabular-nums">{formatDate(s.updatedAt)}</span>
    </motion.div>
  )
}
