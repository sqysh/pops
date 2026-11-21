'use client'

import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { acknowledgeApplication } from '@/app/lib/actions/camp-applications/acknowledgeApplication'
import { COL } from '@/app/lib/constants/camp-application.constants'
import { CampApplicationWithRelations } from '@/app/types/entities/camp-application'
import { formatDate, formatTime } from '@/app/lib/utils/date.utils'

const STATUS = {
  ADMITTED: { label: 'Admitted', dot: 'bg-emerald-500', pill: 'text-emerald-700 bg-emerald-50 ring-emerald-200' },
  DENIED: { label: 'Not admitted', dot: 'bg-red-500', pill: 'text-red-700 bg-red-50 ring-red-200' },
  PENDING: { label: 'No decision', dot: 'bg-neutral-400', pill: 'text-neutral-600 bg-neutral-100 ring-neutral-300' }
} as const

export function CampApplicationRow({
  application,
  index,
  onClick,
  onAcknowledged
}: {
  application: CampApplicationWithRelations
  index: number
  onClick: (a: CampApplicationWithRelations) => void
  onAcknowledged: (id: string) => void
}) {
  const s = application.Student
  const fullName = s ? `${s.firstName} ${s.lastName}` : '—'
  const email = s?.studentEmailAddress ?? '—'
  const status = STATUS[(application.campStatus ?? 'PENDING') as keyof typeof STATUS] ?? STATUS.PENDING

  async function handleOpen() {
    onClick(application)
    if (application.isNew) {
      await acknowledgeApplication(application.id)
      onAcknowledged(application.id)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, delay: Math.min(index * 0.01, 0.15) }}
      role="button"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleOpen()
        }
      }}
      aria-label={`Open application from ${fullName}`}
      // the left border is always 2px so an unread row does not shift the grid
      className={`grid ${COL} items-center gap-3 px-4 py-3 border-b border-neutral-200 last:border-0 border-l-2 cursor-pointer transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-inset group ${
        application.isNew ? 'border-l-sky-500 bg-sky-50/50' : 'border-l-transparent'
      }`}
    >
      {/* Student */}
      <div className="min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`truncate ${application.isNew ? 'font-semibold text-neutral-900' : 'text-neutral-900'}`}>
            {fullName}
          </span>
          {application.isNew && (
            <span className="shrink-0 text-xs font-medium text-sky-800 bg-sky-100 ring-1 ring-sky-200 rounded-full px-2 py-0.5">
              New
            </span>
          )}
          {application.isDuplicate && (
            <span
              className="shrink-0 text-xs font-medium text-orange-800 bg-orange-100 ring-1 ring-orange-200 rounded-full px-2 py-0.5"
              title="Matches another application by name and phone number"
            >
              Duplicate
            </span>
          )}
        </div>
        {s?.school && <span className="block truncate text-neutral-500">{s.school}</span>}
      </div>

      {/* Email */}
      <span className="truncate text-neutral-600">{email}</span>

      {/* Instrument — a value, not a status, so it reads as text */}
      <span className="truncate text-neutral-900">{application.instrument || '—'}</span>

      {/* Submitted */}
      <div className="flex flex-col min-w-0">
        <span className="truncate text-neutral-900 tabular-nums">{formatDate(application.createdAt)}</span>
        <span className="truncate text-neutral-500 tabular-nums">{formatTime(application.createdAt)}</span>
      </div>

      {/* Decision */}
      <div className="flex justify-center">
        <span
          className={`inline-flex items-center gap-1.5 shrink-0 text-xs font-medium rounded-full ring-1 px-2 py-0.5 ${status.pill}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${status.dot}`} aria-hidden="true" />
          {status.label}
        </span>
      </div>

      <div className="flex justify-end">
        <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-600 transition-colors" aria-hidden="true" />
      </div>
    </motion.div>
  )
}
