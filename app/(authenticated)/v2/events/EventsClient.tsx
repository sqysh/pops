'use client'

import { useState } from 'react'
import { useTableFilter } from '@/app/lib/hooks/useTableFilter'
import { EventDrawer } from '../../../components/drawers/EventDrawer'
import { TableEmptyState, TableFilterPills, TableSearch, TableShell } from '../../../components/elements/TableShell'
import { COL, COLUMNS, STATUS_OPTIONS } from '@/app/lib/constants/event.constants'
import { EventRow } from '../../../components/rows/EventRow'
import { Event } from '@prisma/client'

export function EventsClient({ events: initialEvents }: { events: Event[] }) {
  const [editingEvent, setEditingEvent] = useState<Event | null | 'new'>(null)

  const { filtered, search, setSearch, sortKey, sortDir, toggleSort, filters, setFilter, clearFilters, isFiltered } =
    useTableFilter({
      data: initialEvents,
      searchKeys: ['title', 'location', 'description'],
      defaultSortKey: 'date',
      defaultSortDir: 'asc',
      sortConfigs: {
        title: { getValue: (e) => e.title.toLowerCase() },
        location: { getValue: (e) => e.location.toLowerCase() },
        date: { getValue: (e) => new Date(e.date).getTime() },
        status: { getValue: (e) => e.status }
      }
    })

  const visibleFiltered = filtered.filter((e) => {
    const f = filters.status ?? 'ALL'
    if (f === 'ALL') return true
    return e.status === f
  })

  const publishedCount = initialEvents.filter((e) => e.status === 'PUBLISHED').length
  const upcomingCount = initialEvents.filter((e) => new Date(e.date) >= new Date()).length
  const drawerOpen = editingEvent !== null
  const isEdit = editingEvent !== null && editingEvent !== 'new'

  return (
    <>
      <EventDrawer
        key={isEdit ? (editingEvent as Event).id : 'new'}
        open={drawerOpen}
        onClose={() => setEditingEvent(null)}
        event={isEdit ? (editingEvent as Event) : null}
      />

      <TableShell
        label="EVENTS"
        backHref="/v2/dashboard"
        count={initialEvents.length}
        pills={[
          { label: 'Published', value: publishedCount, accent: false },
          { label: 'Upcoming', value: upcomingCount, accent: upcomingCount > 0 }
        ]}
        action={{ label: '+ New Event', onClick: () => setEditingEvent('new') }}
        marquee="Click any row to edit · Past events are dimmed · Published events appear on the public site"
        toolbar={
          <>
            <TableSearch value={search} onChange={setSearch} placeholder="Search events..." />
            <div className="ml-auto">
              <TableFilterPills
                options={STATUS_OPTIONS}
                active={filters.status ?? 'ALL'}
                onChange={(v) => setFilter('status', v)}
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
        filteredCount={visibleFiltered.length}
        totalCount={initialEvents.length}
        empty={
          <TableEmptyState
            noun="events"
            isFiltered={isFiltered || (filters.status ?? 'ALL') !== 'ALL'}
            onClear={() => {
              clearFilters()
            }}
          />
        }
      >
        {visibleFiltered.map((event, i) => (
          <EventRow key={event.id} event={event} index={i} onEdit={setEditingEvent} />
        ))}
      </TableShell>
    </>
  )
}
