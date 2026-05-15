'use client'

import { useState, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useTableFilter } from '@/app/lib/hooks/useTableFilter'
import { TableEmptyState, TableSearch } from '../../../components/elements/TableShell'
import { CampApplicationWithRelations } from '@/app/types/entities/camp-application'
import { COL, YEAR_COLORS } from '@/app/lib/constants/camp-application.constants'
import { CampApplicationRow } from '@/app/components/rows/CampApplicationRow'
import { CampApplicationDetailDrawer } from '@/app/components/drawers/CampApplicationDetailDrawer'
import { CampStatus } from '@prisma/client'

function YearGroup({
  year,
  applications,
  onSelect,
  colorClass,
  handleAcknowledged
}: {
  year: string
  applications: CampApplicationWithRelations[]
  onSelect: (a: CampApplicationWithRelations) => void
  colorClass: string
  handleAcknowledged: any
}) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="border-b border-border-dark last:border-0">
      {/* Year header */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2 bg-bg-dark hover:bg-surface-dark transition-colors group/yr"
      >
        <div className="flex items-center gap-3">
          <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.15 }}>
            <ChevronRight className="w-3 h-3 text-muted-dark" />
          </motion.div>
          <span className={`text-sm font-mono uppercase tracking-widest font-bold ${colorClass}`}>{year}</span>
          <span className="text-sm font-mono uppercase tracking-widest px-1.5 py-0.5 border border-border-dark text-muted-dark">
            {applications.length} application{applications.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center gap-4 pr-1">
          {/* Instrument breakdown */}
          {Object.entries(
            applications.reduce<Record<string, number>>((acc, a) => {
              if (a.instrument) acc[a.instrument] = (acc[a.instrument] ?? 0) + 1
              return acc
            }, {})
          )
            .sort(([, a], [, b]) => b - a)
            .slice(0, 4)
            .map(([inst, count]) => (
              <span key={inst} className="text-sm font-mono text-muted-dark uppercase tracking-widest hidden sm:block">
                {count} {inst}
              </span>
            ))}
        </div>
      </button>

      {/* Column headers */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            {/* Column headers */}
            <div
              className={`grid ${COL} items-center gap-3 px-3 py-1.5 border-y border-border-dark/40 bg-surface-dark`}
            >
              {[
                { label: 'Student' },
                { label: 'Email' },
                { label: 'Instrument' },
                { label: 'Submitted' },
                { label: '' }
              ].map(({ label }, i) => (
                <span key={i} className="text-sm font-mono uppercase tracking-widest text-muted-dark">
                  {label}
                </span>
              ))}
            </div>

            {/* Rows */}
            <AnimatePresence initial={false}>
              {applications.map((app, i) => (
                <CampApplicationRow
                  key={`${app.id}-${app.isNew}`}
                  application={app}
                  index={i}
                  onClick={onSelect}
                  onAcknowledged={handleAcknowledged}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function CampApplicationsClient({
  applications: initialApplications
}: {
  applications: CampApplicationWithRelations[]
}) {
  const [applications, setApplications] = useState(initialApplications)
  const [selectedApplication, setSelectedApplication] = useState<CampApplicationWithRelations | null>(null)

  const { search, setSearch, isFiltered, clearFilters } = useTableFilter({
    data: applications,
    searchKeys: ['instrument'],
    defaultSortKey: 'createdAt',
    defaultSortDir: 'desc',
    sortConfigs: {
      createdAt: { getValue: (a) => new Date(a.createdAt).getTime() }
    }
  })

  const grouped = useMemo(() => {
    const q = search.toLowerCase().trim()

    const searched = q
      ? applications.filter((a) => {
          const name = `${a.Student?.firstName ?? ''} ${a.Student?.lastName ?? ''}`.toLowerCase()
          const email = (a.Student?.studentEmailAddress ?? '').toLowerCase()
          const phone = String(a.Student?.studentPhoneNumber ?? '').toLowerCase()
          const instrument = (a.instrument ?? '').toLowerCase()
          return name.includes(q) || email.includes(q) || phone.includes(q) || instrument.includes(q)
        })
      : applications

    const map: Record<string, CampApplicationWithRelations[]> = {}
    searched.forEach((a) => {
      const year = new Date(a.createdAt).getFullYear().toString()
      if (!map[year]) map[year] = []
      map[year].push(a)
    })
    return Object.entries(map).sort(([a], [b]) => b.localeCompare(a))
  }, [applications, search])

  function handleDeleted(id: string) {
    setApplications((prev) => prev.filter((a) => a.id !== id))
  }

  function handleAcknowledged(id: string) {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, isNew: false } : a)))
  }

  function handleStatusChanged(id: string, campStatus: CampStatus) {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, campStatus } : a)))
  }

  return (
    <>
      <CampApplicationDetailDrawer
        key={selectedApplication?.id ?? 'none'}
        application={selectedApplication}
        onClose={() => setSelectedApplication(null)}
        onDelete={handleDeleted}
        onStatusChanged={handleStatusChanged}
      />

      <div className="flex flex-col h-screen bg-bg-dark overflow-hidden">
        <div className="bg-black shrink-0 border-b border-border-dark">
          {/* Header */}
          <div className="flex items-center justify-between px-3 760:px-4 py-2 760:py-2.5 gap-2">
            {/* Left */}
            <div className="flex items-center gap-2 760:gap-3 min-w-0 flex-1 overflow-hidden">
              <Link
                href="/v2/dashboard"
                className="text-[10px] font-mono uppercase tracking-widest text-muted-dark hover:text-primary-dark transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark shrink-0"
              >
                ←<span className="hidden 480:inline"> Dashboard</span>
              </Link>
              <div className="w-px h-3 bg-border-dark shrink-0" aria-hidden="true" />
              <span className="text-[10px] 760:text-sm font-mono text-muted-dark uppercase tracking-widest shrink-0 truncate">
                <span className="hidden 480:inline">[ CAMP APPLICATIONS ]</span>
                <span className="480:hidden">[ CAMP ]</span>
              </span>
              <div className="w-px h-3 bg-border-dark shrink-0 hidden 480:block" aria-hidden="true" />
              <span className="text-sm font-mono text-muted-dark hidden 480:block shrink-0">
                {applications.length} total
              </span>

              {/* Year pills — inline on 760+ */}
              <div className="w-px h-3 bg-border-dark shrink-0 hidden 760:block" aria-hidden="true" />
              <div className="hidden 760:flex items-center divide-x divide-border-dark border-x border-border-dark">
                {Object.entries(
                  applications.reduce<Record<string, number>>((acc, a) => {
                    const year = new Date(a.createdAt).getFullYear().toString()
                    acc[year] = (acc[year] ?? 0) + 1
                    return acc
                  }, {})
                )
                  .sort(([a], [b]) => b.localeCompare(a))
                  .map(([year, count], i) => (
                    <div key={year} className="flex flex-col items-center justify-center px-3 py-1.5 shrink-0 gap-0.5">
                      <span className={`font-mono text-sm font-bold tabular-nums ${YEAR_COLORS[i % 5]}`}>{count}</span>
                      <span className="text-sm font-mono tracking-[0.12em] uppercase text-muted-dark whitespace-nowrap">
                        {year}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Right */}
            <Link
              href="/v2/settings"
              className="text-[10px] font-mono uppercase tracking-widest text-muted-dark hover:text-text-dark transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark shrink-0"
            >
              Settings →
            </Link>
          </div>

          {/* Year pills on mobile — scrollable strip */}
          <div className="760:hidden flex items-center divide-x divide-border-dark border-t border-border-dark overflow-x-auto">
            {grouped.map(([year, apps], i) => (
              <div key={year} className="flex flex-col items-center justify-center px-4 py-1.5 shrink-0 gap-0.5">
                <span className={`font-mono text-sm font-bold tabular-nums ${YEAR_COLORS[i % 5]}`}>{apps.length}</span>
                <span className="text-sm font-mono tracking-[0.12em] uppercase text-muted-dark whitespace-nowrap">
                  {year}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Marquee */}
        <div className="border-t border-border-dark/40 bg-white/2 overflow-hidden py-1">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="flex whitespace-nowrap"
          >
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <span key={i} className="text-[10px] font-mono text-muted-dark pr-12">
                <span className="text-primary-dark">▸</span> Applications matching the same first name, last name, and
                phone number are automatically marked as duplicate
                <span className="text-muted-dark/30 mx-3">·</span>
                Click any row to view full application details
                <span className="text-muted-dark/30 mx-3">·</span>
                Toggle accepting applications from the settings page
                <span className="text-muted-dark/30 mx-3">·</span>
              </span>
            ))}
          </motion.div>
        </div>

        {/* Toolbar */}
        <div className="shrink-0 flex items-center gap-2 px-4 py-2 border-b border-border-dark bg-surface-dark">
          <TableSearch value={search} onChange={setSearch} placeholder="Search by name, email, phone number..." />
          {isFiltered && (
            <button
              onClick={clearFilters}
              className="text-[10px] font-mono uppercase tracking-widest text-muted-dark hover:text-primary-dark transition-colors"
            >
              Clear
            </button>
          )}
          <span className="ml-auto text-[10px] font-mono uppercase tracking-widest text-muted-dark tabular-nums">
            {grouped.length} of {applications.length}
          </span>
        </div>

        {/* Year groups */}
        <div className="flex-1 min-h-0 overflow-y-auto bg-surface-dark m-2">
          {grouped.length === 0 ? (
            <TableEmptyState noun="applications" isFiltered={isFiltered} onClear={clearFilters} />
          ) : (
            grouped.map(([year, apps], i) => (
              <YearGroup
                key={year}
                year={year}
                applications={apps}
                onSelect={setSelectedApplication}
                colorClass={YEAR_COLORS[i % 5]}
                handleAcknowledged={handleAcknowledged}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 flex items-center justify-between px-4 py-2 border-t border-border-dark bg-surface-dark">
          <Link
            href="/v2/dashboard"
            className="text-[10px] font-mono uppercase tracking-widest text-muted-dark hover:text-primary-dark transition-colors"
          >
            &larr; Dashboard
          </Link>
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-dark">
            {applications.length} total applications
          </span>
        </div>
      </div>
    </>
  )
}
