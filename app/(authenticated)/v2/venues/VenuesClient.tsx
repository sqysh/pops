'use client'

import { TableEmptyState, TableSearch, TableShell } from '@/app/components/elements/TableShell'
import { COL, COLUMNS } from '@/app/lib/constants/venue.constants'
import { useTableFilter } from '@/app/lib/hooks/useTableFilter'
import { IVenue } from '@/app/types/entities/venue'
import { useState } from 'react'
import { VenueRow } from '../../../components/rows/VenueRow'
import { VenueDrawer } from '@/app/components/drawers/VenueDrawer'

export function VenuesClient({ venues }: { venues: IVenue[] }) {
  const [editingVenue, setEditingVenue] = useState<IVenue | null | 'new'>(null)

  const { filtered, search, setSearch, sortKey, sortDir, toggleSort, clearFilters, isFiltered } = useTableFilter({
    data: venues,
    searchKeys: ['name', 'city', 'address', 'capacity', 'createdAt'],
    defaultSortKey: 'name',
    sortConfigs: {
      name: { getValue: (v) => v.name.toLowerCase() },
      city: { getValue: (v) => v.city.toLowerCase() },
      address: { getValue: (v) => v.address.toLowerCase() },
      capacity: { getValue: (v) => v.capacity.toLowerCase() },
      createdAt: { getValue: (v) => new Date(v.createdAt).getTime() }
    }
  })

  const drawerOpen = editingVenue !== null
  const isEdit = editingVenue !== null && editingVenue !== 'new'

  return (
    <>
      <VenueDrawer
        key={isEdit ? (editingVenue as IVenue).id : 'new'}
        open={drawerOpen}
        onClose={() => setEditingVenue(null)}
        venue={isEdit ? (editingVenue as IVenue) : null}
      />

      <TableShell
        label="VENUES"
        backHref="/v2/dashboard"
        count={venues.length}
        action={{ label: '+ New Venue', onClick: () => setEditingVenue('new') }}
        marquee="Click any row to open · Edit venue details, address, and accessibility info · Upload a venue photo · Changes reflect immediately after saving"
        toolbar={<TableSearch value={search} onChange={setSearch} placeholder="Search venues..." />}
        columns={COLUMNS}
        colClass={COL}
        sortKey={sortKey}
        sortDir={sortDir}
        toggleSort={toggleSort}
        filteredCount={filtered.length}
        totalCount={venues.length}
        empty={<TableEmptyState noun="venues" isFiltered={isFiltered} onClear={clearFilters} />}
      >
        {filtered.map((venue, i) => (
          <VenueRow key={venue.id} venue={venue} index={i} onEdit={setEditingVenue} />
        ))}
      </TableShell>
    </>
  )
}
