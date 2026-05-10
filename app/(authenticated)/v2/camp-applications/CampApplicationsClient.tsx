'use client'

import { useState, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { SiteSetting } from '@prisma/client'
import { useTableFilter } from '@/app/lib/hooks/useTableFilter'
import { TableEmptyState, TableSearch } from '../../../components/elements/TableShell'
import { toggleSiteSetting } from '@/app/lib/actions/site-setting/toggleSiteSetting'
import { CampApplicationWithRelations } from '@/app/types/entities/camp-application'
import { COL, YEAR_COLORS } from '@/app/lib/constants/camp-application.constants'
import { CampApplicationRow } from '@/app/components/rows/CampApplicationRow'
import { CampApplicationDetailDrawer } from '@/app/components/drawers/CampApplicationDetailDrawer'

function YearGroup({
  year,
  applications,
  onSelect,
  colorClass
}: {
  year: string
  applications: CampApplicationWithRelations[]
  onSelect: (a: CampApplicationWithRelations) => void
  colorClass: string
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
            <ChevronRight className="w-3 h-3 text-muted-dark/40" />
          </motion.div>
          <span className={`text-[9px] font-mono uppercase tracking-widest font-bold ${colorClass}`}>{year}</span>
          <span className="text-[7px] font-mono uppercase tracking-widest px-1.5 py-0.5 border border-border-dark text-muted-dark/40">
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
              <span
                key={inst}
                className="text-[7px] font-mono text-muted-dark/30 uppercase tracking-widest hidden sm:block"
              >
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
                <span key={i} className="text-[7px] font-mono uppercase tracking-widest text-muted-dark/40">
                  {label}
                </span>
              ))}
            </div>

            {/* Rows */}
            <AnimatePresence initial={false}>
              {applications.map((app, i) => (
                <CampApplicationRow key={app.id} application={app} index={i} onClick={onSelect} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function CampApplicationsClient({
  applications: initialApplications,
  setting
}: {
  applications: CampApplicationWithRelations[]
  setting: SiteSetting
}) {
  const [applications, setApplications] = useState(initialApplications)
  const [selectedApplication, setSelectedApplication] = useState<CampApplicationWithRelations | null>(null)
  const [campApplicationsEnabled, setCampApplicationsEnabled] = useState(setting.value)
  const [toggling, setToggling] = useState(false)

  const { filtered, search, setSearch, isFiltered, clearFilters } = useTableFilter({
    data: applications,
    searchKeys: ['instrument'],
    defaultSortKey: 'createdAt',
    defaultSortDir: 'desc',
    sortConfigs: {
      createdAt: { getValue: (a) => new Date(a.createdAt).getTime() }
    }
  })

  // Also search student name + email
  const visibleFiltered = search.trim()
    ? filtered.filter((a) => {
        const q = search.toLowerCase()
        const name = `${a.Student?.firstName ?? ''} ${a.Student?.lastName ?? ''}`.toLowerCase()
        const email = (a.Student?.studentEmailAddress ?? '').toLowerCase()
        return name.includes(q) || email.includes(q) || (a.instrument ?? '').toLowerCase().includes(q)
      })
    : filtered

  // Group by year descending
  const grouped = useMemo(() => {
    const map: Record<string, CampApplicationWithRelations[]> = {}
    visibleFiltered.forEach((a) => {
      const year = new Date(a.createdAt).getFullYear().toString()
      if (!map[year]) map[year] = []
      map[year].push(a)
    })
    return Object.entries(map).sort(([a], [b]) => b.localeCompare(a))
  }, [visibleFiltered])

  function handleDeleted(id: string) {
    setApplications((prev) => prev.filter((a) => a.id !== id))
  }

  async function handleToggle() {
    setToggling(true)
    const result = await toggleSiteSetting('campApplicationsEnabled', !campApplicationsEnabled)
    if (result.success) setCampApplicationsEnabled((v) => !v)
    setToggling(false)
  }

  return (
    <>
      <CampApplicationDetailDrawer
        key={selectedApplication?.id ?? 'none'}
        application={selectedApplication}
        onClose={() => setSelectedApplication(null)}
        onDelete={handleDeleted}
      />

      <div className="flex flex-col h-screen bg-bg-dark overflow-hidden">
        {/* Header */}
        <div className="bg-black shrink-0 border-b border-border-dark">
          <div className="flex items-center justify-between px-3 760:px-4 py-2 760:py-2.5 gap-2">
            {/* Left */}
            <div className="flex items-center gap-2 760:gap-3 min-w-0 flex-1 overflow-hidden">
              <Link
                href="/v2/dashboard"
                className="text-[8px] font-mono uppercase tracking-widest text-muted-dark/40 hover:text-primary-dark transition-colors shrink-0"
              >
                ←<span className="hidden 480:inline"> Dashboard</span>
              </Link>
              <div className="w-px h-3 bg-border-dark shrink-0" aria-hidden="true" />
              <span className="text-[8px] 760:text-[9px] font-mono text-muted-dark/40 uppercase tracking-widest shrink-0 truncate">
                <span className="hidden 480:inline">[ CAMP APPLICATIONS ]</span>
                <span className="480:hidden">[ CAMP ]</span>
              </span>
              <div className="w-px h-3 bg-border-dark shrink-0 hidden 480:block" aria-hidden="true" />
              <span className="text-[9px] font-mono text-muted-dark hidden 480:block shrink-0">
                {applications.length} total
              </span>

              {/* Year pills — inline on 760+ */}
              <div className="w-px h-3 bg-border-dark shrink-0 hidden 760:block" aria-hidden="true" />
              <div className="hidden 760:flex items-center divide-x divide-border-dark border-x border-border-dark">
                {grouped.map(([year, apps], i) => (
                  <div key={year} className="flex flex-col items-center justify-center px-3 py-1.5 shrink-0 gap-0.5">
                    <span className={`font-mono text-xs font-bold tabular-nums ${YEAR_COLORS[i % 5]}`}>
                      {apps.length}
                    </span>
                    <span className="text-[7px] font-mono tracking-[0.12em] uppercase text-muted-dark/50 whitespace-nowrap">
                      {year}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — toggle */}
            <button
              type="button"
              onClick={handleToggle}
              disabled={toggling}
              className={`flex items-center gap-2 text-[8px] font-mono uppercase tracking-widest px-2 760:px-3 py-1.5 border transition-colors disabled:opacity-50 focus-visible:outline-none shrink-0 ${
                campApplicationsEnabled
                  ? 'border-emerald-400/40 text-emerald-400 bg-emerald-400/5 hover:bg-emerald-400/10'
                  : 'border-border-dark text-muted-dark/50 hover:text-text-dark hover:border-muted-dark/30'
              }`}
            >
              {toggling ? (
                <Loader2 className="w-2.5 h-2.5 animate-spin" />
              ) : (
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${campApplicationsEnabled ? 'bg-emerald-400' : 'bg-border-dark'}`}
                  aria-hidden="true"
                />
              )}
              <span className="hidden 480:inline">
                {campApplicationsEnabled ? 'Accepting Applications' : 'Applications Closed'}
              </span>
              <span className="480:hidden">{campApplicationsEnabled ? 'Open' : 'Closed'}</span>
            </button>
          </div>

          {/* Year pills on mobile — scrollable strip */}
          <div className="760:hidden flex items-center divide-x divide-border-dark border-t border-border-dark overflow-x-auto">
            {grouped.map(([year, apps], i) => (
              <div key={year} className="flex flex-col items-center justify-center px-4 py-1.5 shrink-0 gap-0.5">
                <span className={`font-mono text-xs font-bold tabular-nums ${YEAR_COLORS[i % 5]}`}>{apps.length}</span>
                <span className="text-[7px] font-mono tracking-[0.12em] uppercase text-muted-dark/50 whitespace-nowrap">
                  {year}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Toolbar */}
        <div className="shrink-0 flex items-center gap-2 px-4 py-2 border-b border-border-dark bg-surface-dark">
          <TableSearch value={search} onChange={setSearch} placeholder="Search by name, email, instrument..." />
          {isFiltered && (
            <button
              onClick={clearFilters}
              className="text-[8px] font-mono uppercase tracking-widest text-muted-dark/40 hover:text-primary-dark transition-colors"
            >
              Clear
            </button>
          )}
          <span className="ml-auto text-[8px] font-mono uppercase tracking-widest text-muted-dark/30 tabular-nums">
            {visibleFiltered.length} of {applications.length}
          </span>
        </div>

        {/* Year groups */}
        <div className="flex-1 min-h-0 overflow-y-auto">
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
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 flex items-center justify-between px-4 py-2 border-t border-border-dark bg-surface-dark">
          <Link
            href="/v2/dashboard"
            className="text-[8px] font-mono uppercase tracking-widest text-muted-dark/40 hover:text-primary-dark transition-colors"
          >
            &larr; Dashboard
          </Link>
          <span className="text-[8px] font-mono uppercase tracking-widest text-muted-dark/30">
            {applications.length} total applications
          </span>
        </div>
      </div>
    </>
  )
}
