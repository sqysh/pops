import { COL } from '@/app/lib/constants/camp-application.constants'
import { CampApplicationWithRelations } from '@/app/types/entities/camp-application'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

export function CampApplicationRow({
  application,
  index,
  onClick
}: {
  application: CampApplicationWithRelations
  index: number
  onClick: (a: CampApplicationWithRelations) => void
}) {
  const s = application.Student
  const fullName = s ? `${s.firstName} ${s.lastName}` : '—'
  const email = s?.studentEmailAddress ?? '—'

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.02, duration: 0.2 }}
      onClick={() => onClick(application)}
      className={`grid ${COL} items-center gap-3 px-3 py-2.5 border-b border-border-dark/40 last:border-0 hover:bg-surface-dark transition-colors cursor-pointer group`}
    >
      {/* Name */}
      <div className="min-w-0">
        <span className="text-[11px] font-mono text-text-dark truncate block">{fullName}</span>
        {s?.school && <span className="text-[8px] font-mono text-muted-dark/50 truncate block">{s.school}</span>}
      </div>

      {/* Email */}
      <span className="text-[10px] font-mono text-text-dark/80 truncate">{email}</span>

      {/* Instrument */}
      <div>
        <span className="text-[7px] font-mono uppercase tracking-widest px-1.5 py-0.5 border text-violet-400 border-violet-400/30 bg-violet-400/5 truncate block max-w-full">
          {application.instrument || '—'}
        </span>
      </div>

      {/* Date */}
      <div className="flex flex-col">
        <span className="text-[9px] font-mono text-muted-dark/60 tabular-nums">
          {new Date(application.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          })}
        </span>
        <span className="text-[8px] font-mono text-muted-dark/40 tabular-nums">
          {new Date(application.createdAt).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit'
          })}
        </span>
      </div>

      {/* Arrow */}
      <div className="flex justify-end">
        <ChevronRight className="w-3 h-3 text-muted-dark/20 group-hover:text-muted-dark/60 transition-colors" />
      </div>
    </motion.div>
  )
}
