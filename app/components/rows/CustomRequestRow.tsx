import { URGENCY_LEVELS } from '@/app/lib/constants/custom-requests.constants'
import { STATUS_CONFIG } from '@/app/lib/utils/custom-requests.utils'
import { CustomRequestStatus } from '@/app/types/entities/custom-requests.types'
import { CustomRequest } from '@prisma/client'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

export function CustomRequestRow({ request }: { request: CustomRequest }) {
  const [expanded, setExpanded] = useState(false)

  const urgency = URGENCY_LEVELS.find((u) => u.value === request.urgency)
  const status = STATUS_CONFIG[request.status as CustomRequestStatus] ?? STATUS_CONFIG['PENDING']

  return (
    <div className="border-b border-border-dark/40 last:border-0">
      <div
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-3 px-4 py-3 hover:bg-surface-dark transition-colors cursor-pointer group"
      >
        {/* Status */}
        <span
          className={`text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.5 border flex items-center gap-1 shrink-0 ${status.color}`}
        >
          {status.icon}
          {status.label}
        </span>

        {/* Change type + page */}
        <div className="min-w-0 flex-1">
          <span className="text-[11px] font-mono text-text-dark truncate block">
            {request.changeType} — {request.page}
          </span>
          <span className="text-[9px] font-mono text-muted-dark/80 truncate block">
            {request.what.slice(0, 80)}
            {request.what.length > 80 ? '...' : ''}
          </span>
        </div>

        {/* Urgency */}
        {urgency && (
          <span
            className={`text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.5 border shrink-0 ${urgency.color}`}
          >
            {urgency.label}
          </span>
        )}

        {/* Date */}
        <span className="text-[9px] font-mono text-muted-dark/70 tabular-nums shrink-0">
          {new Date(request.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>

      {/* Expanded detail */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 flex flex-col gap-3 border-t border-border-dark/40 bg-bg-dark pt-3">
              {[
                { label: 'What', value: request.what },
                { label: 'Why', value: request.why },
                ...(request.example ? [{ label: 'Example', value: request.example }] : []),
                { label: 'Submitted by', value: request.submittedBy || '—' }
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-1">
                  <span className="text-[8px] font-mono uppercase tracking-widest text-muted-dark/70">{label}</span>
                  <span className="text-[11px] font-mono text-text-dark leading-relaxed">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
