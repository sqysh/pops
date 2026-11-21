'use client'

import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import Picture from '@/components/common/Picture'
import { COL, formatLevel, levelColor } from '@/app/lib/constants/sponsor.constants'
import { ISponsor } from '@/app/types/entities/sponsor'
import { formatAmount } from '@/app/utils/currency.utils'
import { formatDate } from '@/app/lib/utils/date.utils'

export function SponsorRow({
  sponsor,
  index,
  setEditingSponsor
}: {
  sponsor: ISponsor
  index: number
  setEditingSponsor: (s: ISponsor) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, delay: Math.min(index * 0.01, 0.15) }}
      role="button"
      tabIndex={0}
      onClick={() => setEditingSponsor(sponsor)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setEditingSponsor(sponsor)
        }
      }}
      aria-label={`Edit ${sponsor.name}`}
      className={`grid ${COL} items-center gap-3 px-4 py-3 border-b border-neutral-200 last:border-0 cursor-pointer transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-inset group`}
    >
      <span className="text-neutral-400 tabular-nums">{String(index + 1).padStart(2, '0')}</span>

      <div className="w-10 h-10 shrink-0 overflow-hidden border border-neutral-200 bg-white flex items-center justify-center">
        {sponsor.filePath ? (
          <Picture src={sponsor.filePath} alt="" width={40} height={40} className="object-contain w-full h-auto p-1" />
        ) : (
          <span className="text-xs font-semibold uppercase text-neutral-500">{sponsor.name.slice(0, 2)}</span>
        )}
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="truncate text-neutral-900">{sponsor.name}</span>
          {sponsor.externalLink && (
            <a
              href={sponsor.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              // without this the row's own handler fires and the drawer opens
              // behind the new tab
              onClick={(e) => e.stopPropagation()}
              aria-label={`Visit ${sponsor.name} in a new tab`}
              className="shrink-0 p-1 -m-1 rounded text-neutral-400 hover:text-blaze-text hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
            >
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>
          )}
        </div>
        <span className="block truncate text-neutral-500 tabular-nums">{formatDate(sponsor.createdAt)}</span>
      </div>

      <div>
        <span className={`inline-flex shrink-0 text-xs font-medium rounded-full ring-1 px-2 py-0.5 ${levelColor(sponsor.level)}`}>
          {formatLevel(sponsor.level)}
        </span>
      </div>

      <span className="text-neutral-900 tabular-nums">{formatAmount(sponsor.amount)}</span>

      <div className="flex items-center gap-2">
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${sponsor.isActive ? 'bg-emerald-500' : 'bg-neutral-300'}`}
          aria-hidden="true"
        />
        <span className={sponsor.isActive ? 'text-neutral-900' : 'text-neutral-500'}>
          {sponsor.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
    </motion.div>
  )
}
