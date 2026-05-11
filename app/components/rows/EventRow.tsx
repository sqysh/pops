import { COL, STATUS_COLORS } from '@/app/lib/constants/event.constants'
import { Event } from '@prisma/client'
import { motion } from 'framer-motion'

export function EventRow({ event, index, onEdit }: { event: Event; index: number; onEdit: (e: Event) => void }) {
  const isPast = new Date(event.date) < new Date()

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.02, duration: 0.2 }}
      onClick={() => onEdit(event)}
      className={`grid ${COL} items-center gap-3 px-3 py-2.5 border-b border-border-dark/40 last:border-0 hover:bg-surface-dark transition-colors cursor-pointer group ${isPast ? 'opacity-50' : ''}`}
    >
      {/* Title */}
      <div className="min-w-0">
        <span className="text-[12px] font-mono text-text-dark truncate block">{event.title}</span>
        {event.description && (
          <span className="text-[9px] font-mono text-muted-dark/70 truncate block">
            {event.description.slice(0, 60)}
            {event.description.length > 60 ? '...' : ''}
          </span>
        )}
      </div>

      {/* Location */}
      <span className="text-[11px] font-mono text-muted-dark/80 truncate">
        {event.location || <span className="text-muted-dark/60">—</span>}
      </span>

      {/* Date */}
      <div className="flex flex-col">
        <span className="text-[10px] font-mono text-text-dark tabular-nums">
          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <span className="text-[9px] font-mono text-muted-dark/70 tabular-nums">
          {new Date(event.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
        </span>
      </div>

      {/* Status */}
      <div className="flex justify-end">
        <span
          className={`text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.5 border ${STATUS_COLORS[event.status] ?? 'text-muted-dark border-border-dark'}`}
        >
          {event.status.charAt(0) + event.status.slice(1).toLowerCase()}
        </span>
      </div>

      {/* Arrow */}
      <div className="flex justify-end">
        <span className="text-[9px] font-mono text-muted-dark/20 group-hover:text-muted-dark/80 transition-colors">
          →
        </span>
      </div>
    </motion.div>
  )
}
