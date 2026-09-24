import { COL } from '@/app/lib/constants/camp-application.constants'
import { CampApplicationRow } from '@/app/(authenticated)/v2/camp-applications/_components/CampApplicationRow'
import { CampApplicationWithRelations } from '@/app/types/entities/camp-application'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

const COLUMNS = ['Student', 'Email', 'Instrument', 'Submitted', '']

export function YearGroup({
  year,
  applications,
  onSelect,
  colorClass,
  onAcknowledged
}: {
  year: string
  applications: CampApplicationWithRelations[]
  onSelect: (a: CampApplicationWithRelations) => void
  colorClass: string
  onAcknowledged: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)

  const topInstruments = Object.entries(
    applications.reduce<Record<string, number>>((acc, a) => {
      if (a.instrument) acc[a.instrument] = (acc[a.instrument] ?? 0) + 1
      return acc
    }, {})
  )
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)

  return (
    <div className="border-b border-neutral-300 last:border-0">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="w-full flex items-center justify-between gap-4 px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-inset"
      >
        <div className="flex items-center gap-3 min-w-0">
          <motion.span animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.15 }}>
            <ChevronRight className="w-4 h-4 text-neutral-500" aria-hidden="true" />
          </motion.span>
          <span className={`text-base font-bold tabular-nums ${colorClass}`}>{year}</span>
          <span className="text-neutral-600">
            {applications.length} application{applications.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="hidden 760:flex items-center gap-4 shrink-0 text-neutral-500">
          {topInstruments.map(([instrument, count]) => (
            <span key={instrument} className="tabular-nums">
              {count} {instrument.toLowerCase()}
            </span>
          ))}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div
              className={`grid ${COL} items-center gap-3 px-4 py-2 border-b border-neutral-200 bg-neutral-50 text-xs font-semibold uppercase tracking-wide text-neutral-600`}
            >
              {COLUMNS.map((label, i) => (
                <span key={i}>{label}</span>
              ))}
            </div>

            <AnimatePresence initial={false}>
              {applications.map((app, i) => (
                <CampApplicationRow
                  key={`${app.id}-${app.isNew}`}
                  application={app}
                  index={i}
                  onClick={onSelect}
                  onAcknowledged={onAcknowledged}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
