'use client'

import { useMemo, useState } from 'react'
import { CampStatus } from '@prisma/client'
import { TableEmptyState, TableSearch } from '../_components/TableShell'
import { CampApplicationWithRelations } from '@/app/types/entities/camp-application'
import { YEAR_COLORS } from '@/app/lib/constants/camp-application.constants'
import { YearGroup } from './_components/YearGroup'
import { CampApplicationDetailDrawer } from './_components/CampApplicationDetailDrawer'

export function CampApplicationsClient({ applications: initialApplications }: { applications: CampApplicationWithRelations[] }) {
  const [applications, setApplications] = useState(initialApplications)
  const [selectedApplication, setSelectedApplication] = useState<CampApplicationWithRelations | null>(null)
  const [search, setSearch] = useState('')

  const matches = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return applications

    return applications.filter((a) => {
      const haystack = [
        `${a.Student?.firstName ?? ''} ${a.Student?.lastName ?? ''}`,
        a.Student?.studentEmailAddress ?? '',
        String(a.Student?.studentPhoneNumber ?? ''),
        a.instrument ?? ''
      ]
        .join(' ')
        .toLowerCase()

      return haystack.includes(q)
    })
  }, [applications, search])

  // Both the year strip and the groups read from the same list, so a search
  // narrows the counts at the top rather than leaving them showing the total.
  const grouped = useMemo(() => {
    const map: Record<string, CampApplicationWithRelations[]> = {}
    matches.forEach((a) => {
      const year = new Date(a.createdAt).getFullYear().toString()
      if (!map[year]) map[year] = []
      map[year].push(a)
    })
    return Object.entries(map).sort(([a], [b]) => b.localeCompare(a))
  }, [matches])

  const newCount = applications.filter((a) => a.isNew).length

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

      <div className="flex flex-col h-full min-h-125 bg-white border border-neutral-300 text-sm overflow-hidden">
        {/* Header */}
        <div className="shrink-0 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 px-4 py-3 border-b border-neutral-300">
          <div className="flex items-baseline gap-4 flex-wrap min-w-0">
            <h1 className="text-base font-semibold text-neutral-900">Camp Applications</h1>
            <dl className="flex items-baseline gap-4 flex-wrap text-neutral-600">
              <div className="flex items-baseline gap-1.5">
                <dd className="font-semibold text-neutral-900 tabular-nums">{applications.length}</dd>
                <dt>total</dt>
              </div>
              {newCount > 0 && (
                <div className="flex items-baseline gap-1.5">
                  <dd className="font-semibold text-blaze-text tabular-nums">{newCount}</dd>
                  <dt>unread</dt>
                </div>
              )}
            </dl>
          </div>

          {/* Year counts, following the search */}
          <div className="flex items-center gap-4 flex-wrap text-neutral-600">
            {grouped.map(([year, apps], i) => (
              <div key={year} className="flex items-baseline gap-1.5">
                <span className={`font-semibold tabular-nums ${YEAR_COLORS[i % 5]}`}>{apps.length}</span>
                <span className="tabular-nums">{year}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Toolbar */}
        <div className="shrink-0 flex flex-wrap items-center gap-2 px-4 py-3 border-b border-neutral-300 bg-neutral-50">
          <TableSearch value={search} onChange={setSearch} placeholder="Search by name, email, phone or instrument..." />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="h-9 px-3 border border-neutral-300 bg-white font-medium text-neutral-700 hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
            >
              Clear
            </button>
          )}
        </div>

        {/* Year groups */}
        <div className="flex-1 min-h-0 overflow-auto">
          {grouped.length === 0 ? (
            <TableEmptyState noun="applications" isFiltered={!!search} onClear={() => setSearch('')} />
          ) : (
            grouped.map(([year, apps], i) => (
              <YearGroup
                key={year}
                year={year}
                applications={apps}
                onSelect={setSelectedApplication}
                colorClass={YEAR_COLORS[i % 5]}
                onAcknowledged={handleAcknowledged}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 flex items-center justify-between gap-4 px-4 py-2.5 border-t border-neutral-300 bg-neutral-50">
          <span className="text-neutral-600 tabular-nums">
            Showing {matches.length} of {applications.length}
          </span>
          <span className="text-neutral-600 tabular-nums">
            {grouped.length} {grouped.length === 1 ? 'year' : 'years'}
          </span>
        </div>
      </div>
    </>
  )
}
