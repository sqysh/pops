import { acknowledgeApplication } from '@/app/lib/actions/camp-applications/acknowledgeApplication'
import { COL } from '@/app/lib/constants/camp-application.constants'
import { CampApplicationWithRelations } from '@/app/types/entities/camp-application'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

export function CampApplicationRow({
  application,
  index,
  onClick,
  onAcknowledged
}: {
  application: CampApplicationWithRelations
  index: number
  onClick: (a: CampApplicationWithRelations) => void
  onAcknowledged: any
}) {
  const s = application.Student
  const fullName = s ? `${s.firstName} ${s.lastName}` : '—'
  const email = s?.studentEmailAddress ?? '—'

  async function handleClick() {
    onClick(application)
    if (application.isNew) {
      await acknowledgeApplication(application.id)
      onAcknowledged(application.id)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.02, duration: 0.2 }}
      onClick={handleClick}
      className={`grid ${COL} items-center gap-3 px-3 py-2.5 border-b border-border-dark/40 last:border-0 hover:bg-black transition-colors cursor-pointer group ${
        application.isNew ? 'border-l-2 border-l-sky-400/60 bg-sky-400/3' : ''
      }`}
    >
      {/* Name */}
      <div className="min-w-0 flex items-start gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-mono text-text-dark truncate block">{fullName}</span>
            {application.isNew && (
              <span className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 border text-sky-400 border-sky-400/30 bg-sky-400/5 shrink-0">
                New
              </span>
            )}
          </div>
          {s?.school && <span className="text-[9px] font-mono text-muted-dark/80 truncate block">{s.school}</span>}
        </div>
        {application.isDuplicate && (
          <span className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 border text-orange-400 border-orange-400/30 bg-orange-400/5 shrink-0 h-fit">
            Duplicate
          </span>
        )}
      </div>

      {/* Email */}
      <span className="text-[11px] font-mono text-text-dark truncate">{email}</span>

      {/* Instrument */}
      <div>
        <span className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 border text-violet-400 border-violet-400/30 bg-violet-400/5 truncate block max-w-full">
          {application.instrument || '—'}
        </span>
      </div>

      {/* Date */}
      <div className="flex flex-col">
        <span className="text-[10px] font-mono text-muted-dark/80 tabular-nums">
          {new Date(application.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
        <span className="text-[9px] font-mono text-muted-dark/70 tabular-nums">
          {new Date(application.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
        </span>
      </div>

      {/* Status */}
      <div className="flex justify-center">
        <span
          className={`text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 border ${
            application.campStatus === 'ADMITTED'
              ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5'
              : application.campStatus === 'DENIED'
                ? 'text-red-400 border-red-400/30 bg-red-400/5'
                : 'text-muted-dark/50 border-border-dark'
          }`}
        >
          {application.campStatus === 'ADMITTED'
            ? 'Admitted'
            : application.campStatus === 'DENIED'
              ? 'Denied'
              : 'Pending'}
        </span>
      </div>

      {/* Arrow */}
      <div className="flex justify-end">
        <ChevronRight className="w-3 h-3 text-muted-dark group-hover:text-muted-dark/80 transition-colors" />
      </div>
    </motion.div>
  )
}
