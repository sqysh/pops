'use client'

import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { COL, STATUS_COLOR, STATUS_LABEL, TYPE_LABEL } from '@/app/lib/constants/subscription.constants'
import { ISubscription } from '@/app/types/entities/subscription.types'

interface Props {
  subscription: ISubscription
  index: number
  onEdit: (s: ISubscription) => void
}

function formatDate(iso: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'America/New_York'
  })
}

export function SubscriptionRow({ subscription: s, index, onEdit }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.3) }}
      onClick={() => onEdit(s)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onEdit(s)
        }
      }}
      className={`${COL} px-4 py-3 border-b border-border-dark cursor-pointer hover:bg-surface-dark transition-colors focus-visible:outline-none focus-visible:bg-surface-dark`}
    >
      {/* Name */}
      <div className="min-w-0">
        <p className="text-sm font-mono text-text-dark truncate">{s.name}</p>
        <a
          href={s.publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-0.5 inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-[0.12em] text-muted-dark/70 hover:text-primary-dark transition-colors"
        >
          Public page <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>

      {/* Type */}
      <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-muted-dark whitespace-nowrap">
        {TYPE_LABEL[s.type]}
      </span>

      {/* Status */}
      <span
        className="text-[10px] font-mono uppercase tracking-[0.12em] whitespace-nowrap"
        style={{ color: STATUS_COLOR[s.status] }}
      >
        {STATUS_LABEL[s.status]}
      </span>

      {/* Visible */}
      <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.12em] text-muted-dark">
        <span
          className={`inline-block w-1.5 h-1.5 rounded-full ${s.isVisible ? 'bg-emerald-400' : 'bg-border-dark'}`}
          aria-hidden="true"
        />
        {s.isVisible ? 'Visible' : 'Hidden'}
      </span>

      {/* Updated */}
      <span className="text-[10px] font-mono text-muted-dark tabular-nums whitespace-nowrap">
        {formatDate(s.updatedAt)}
      </span>
    </motion.div>
  )
}
