import { EventStatus } from '@prisma/client'
import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'

const STATUS_STYLES: Record<EventStatus, string> = {
  DRAFT: 'text-muted-dark/70',
  PUBLISHED: 'text-emerald-400',
  CANCELLED: 'text-red-400',
  PAST: 'text-muted-dark/70'
}

export function EventListItem({ event, i, handleSelect, selected, isNew }) {
  return (
    <motion.button
      key={event.id}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.03 }}
      onClick={() => handleSelect(event)}
      className={`w-full flex items-start gap-3 px-4 py-3.5 border-b border-border-dark/50 last:border-0 text-left transition-colors focus-visible:outline-none group ${
        selected?.id === event.id && !isNew
          ? 'bg-primary-dark/10 border-l-2 border-l-primary-dark'
          : 'hover:bg-surface-dark'
      }`}
    >
      {/* Date block */}
      <div className="shrink-0 w-10 flex flex-col items-center border border-border-dark bg-bg-dark py-1.5">
        <span className="text-[9px] font-mono uppercase text-muted-dark leading-none">
          {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
        </span>
        <span className="font-quicksand font-black text-lg text-text-dark leading-none">
          {new Date(event.date).getDate()}
        </span>
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className="text-text-dark text-sm font-medium truncate group-hover:text-primary-dark transition-colors">
            {event.title}
          </p>
          <span className={`text-[9px] font-mono uppercase shrink-0 ${STATUS_STYLES[event.status]}`}>
            {event.status}
          </span>
        </div>
        {event.location && (
          <div className="flex items-center gap-1 text-muted-dark/80 text-[11px]">
            <MapPin className="w-2.5 h-2.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{event.location}</span>
          </div>
        )}
        {event.description && <p className="text-muted-dark/80 text-[11px] mt-1 line-clamp-1">{event.description}</p>}
      </div>
    </motion.button>
  )
}
