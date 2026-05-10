'use client'

import { useState, useMemo } from 'react'
import { formatLevel } from '@/app/lib/utils/sponsor.utils'
import { ISponsor } from '@/app/types/entities/sponsor'
import { ACTIVE_OPTIONS, COL, COLUMNS, LEVEL_ORDER } from '@/app/lib/constants/sponsor.constants'
import { SponsorRow } from '../../../components/rows/SponsorRow'
import { formatAmount } from '@/app/utils/currency.utils'
import { SponsorDrawer } from '@/app/components/drawers/SponsorDrawer'
import { useTableFilter } from '@/app/lib/hooks/useTableFilter'
import { TableEmptyState, TableFilterPills, TableSearch, TableShell } from '@/app/components/elements/TableShell'

export function SponsorsClient({ sponsors }: { sponsors: ISponsor[] }) {
  const [editingSponsor, setEditingSponsor] = useState<ISponsor | null | 'new'>(null)

  const { filtered, search, setSearch, sortKey, sortDir, toggleSort, filters, setFilter, clearFilters, isFiltered } =
    useTableFilter({
      data: sponsors,
      searchKeys: ['name', 'level'],
      defaultSortKey: 'level',
      sortConfigs: {
        level: { getValue: (s) => LEVEL_ORDER.indexOf(s.level.toUpperCase()) },
        amount: { getValue: (s) => s.amount },
        createdAt: { getValue: (s) => new Date(s.createdAt).getTime() },
        name: { getValue: (s) => s.name.toLowerCase() }
      }
    })

  const activeCount = sponsors.filter((s) => s.isActive).length
  const totalAmount = sponsors.reduce((sum, s) => sum + (s.amount ?? 0), 0)
  const drawerOpen = editingSponsor !== null
  const isEdit = editingSponsor !== null && editingSponsor !== 'new'

  const levels = useMemo(() => {
    const unique = Array.from(new Set(sponsors.map((s) => s.level.toUpperCase())))
    return [
      { label: 'All', value: 'ALL' },
      ...LEVEL_ORDER.filter((l) => unique.includes(l)).map((l) => ({ label: formatLevel(l), value: l })),
      ...unique.filter((l) => !LEVEL_ORDER.includes(l)).map((l) => ({ label: formatLevel(l), value: l }))
    ]
  }, [sponsors])

  return (
    <>
      <SponsorDrawer
        key={isEdit ? (editingSponsor as ISponsor).id : 'new'}
        open={drawerOpen}
        onClose={() => setEditingSponsor(null)}
        sponsor={isEdit ? (editingSponsor as ISponsor) : null}
      />

      <TableShell
        label="SPONSORS"
        backHref="/v2/dashboard"
        count={sponsors.length}
        pills={[
          { label: 'Active', value: activeCount, accent: true },
          { label: 'Inactive', value: sponsors.length - activeCount },
          { label: 'Total Value', value: formatAmount(totalAmount) }
        ]}
        action={{ label: '+ New Sponsor', onClick: () => setEditingSponsor('new') }}
        marquee="Click any row to open · Edit sponsor details, level, and amount · Toggle active to show or hide on the public site · Logo uploads go to Firebase Storage"
        toolbar={
          <>
            <TableSearch value={search} onChange={setSearch} placeholder="Search sponsors..." />
            <TableFilterPills
              options={levels}
              active={filters.level ?? 'ALL'}
              onChange={(v) => setFilter('level', v)}
              accentColor="red"
            />
            <div className="ml-auto">
              <TableFilterPills
                options={ACTIVE_OPTIONS}
                active={filters.isActive ?? 'ALL'}
                onChange={(v) => setFilter('isActive', v)}
                accentColor="emerald"
              />
            </div>
          </>
        }
        columns={COLUMNS}
        colClass={COL}
        sortKey={sortKey}
        sortDir={sortDir}
        toggleSort={toggleSort}
        filteredCount={filtered.length}
        totalCount={sponsors.length}
        footerExtra={
          <span className="text-[8px] font-mono uppercase tracking-widest text-muted-dark/30 tabular-nums">
            {filtered.filter((s) => s.isActive).length} active in view
          </span>
        }
        empty={<TableEmptyState noun="sponsors" isFiltered={isFiltered} onClear={clearFilters} />}
      >
        {filtered.map((sponsor, i) => (
          <SponsorRow key={sponsor.id} sponsor={sponsor} index={i} setEditingSponsor={setEditingSponsor} />
        ))}
      </TableShell>
    </>
  )
}
