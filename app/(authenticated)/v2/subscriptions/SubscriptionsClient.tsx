'use client'

import { useState } from 'react'
import { TableEmptyState, TableFilterPills, TableSearch, TableShell } from '@/app/(authenticated)/v2/_components/TableShell'
import { useTableFilter } from '@/app/lib/hooks/useTableFilter'
import {
  COL,
  COLUMNS,
  EMPTY_SUBSCRIPTION,
  STATUS_ORDER,
  TYPE_OPTIONS,
  TYPE_ORDER
} from '@/app/lib/constants/subscription.constants'
import { ISubscription } from '@/app/types/entities/subscription.types'
import { SubscriptionDrawer } from '@/app/(authenticated)/v2/subscriptions/_components/SubscriptionDrawer'
import { SubscriptionRow } from './_components/SubscriptionRow'

export function SubscriptionsClient({ subscriptions }: { subscriptions: ISubscription[] }) {
  const [rows, setRows] = useState<ISubscription[]>(subscriptions)
  const [typeFilter, setTypeFilter] = useState('ALL')

  // editing holds the row being edited; a blank EMPTY_SUBSCRIPTION means "create"
  const [editing, setEditing] = useState<ISubscription | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const { filtered, search, setSearch, sortKey, sortDir, toggleSort, clearFilters, isFiltered } = useTableFilter({
    data: rows,
    searchKeys: ['name', 'publicUrl'],
    defaultSortKey: 'type',
    sortConfigs: {
      name: { getValue: (s) => s.name.toLowerCase() },
      type: { getValue: (s) => TYPE_ORDER.indexOf(s.type) },
      status: { getValue: (s) => STATUS_ORDER.indexOf(s.status) },
      isVisible: { getValue: (s) => (s.isVisible ? 0 : 1) },
      updatedAt: { getValue: (s) => new Date(s.updatedAt).getTime() }
    }
  })

  const visibleFiltered = filtered.filter((s) => (typeFilter === 'ALL' ? true : s.type === typeFilter))

  const subCount = rows.filter((s) => s.type === 'SUBSCRIPTION').length
  const flexCount = rows.filter((s) => s.type === 'FLEX').length
  // what a patron can actually find and buy needs both flags, not just the status
  const liveCount = rows.filter((s) => s.status === 'ON_SALE' && s.isVisible).length

  const handleSaved = (saved: ISubscription) => {
    setRows((prev) => {
      const exists = prev.some((s) => s.id === saved.id)
      return exists ? prev.map((s) => (s.id === saved.id ? saved : s)) : [...prev, saved]
    })
    setEditing(null)
    setIsCreating(false)
  }

  const handleDeleted = (id: string) => {
    setRows((prev) => prev.filter((s) => s.id !== id))
    setEditing(null)
    setIsCreating(false)
  }

  const drawerOpen = editing !== null || isCreating

  return (
    <>
      <SubscriptionDrawer
        key={editing?.id ?? (isCreating ? 'create' : 'none')}
        open={drawerOpen}
        mode={isCreating ? 'create' : 'edit'}
        subscription={isCreating ? EMPTY_SUBSCRIPTION : editing}
        onClose={() => {
          setEditing(null)
          setIsCreating(false)
        }}
        onSaved={handleSaved}
        onDeleted={handleDeleted}
      />

      <TableShell
        label="Subscriptions"
        count={rows.length}
        pills={[
          { label: 'season', value: subCount, accent: false },
          { label: 'flex', value: flexCount, accent: false },
          { label: 'live on the site', value: liveCount, accent: liveCount > 0 }
        ]}
        action={{ label: 'New subscription', onClick: () => setIsCreating(true) }}
        note="Subscriptions live here, not in CueBox, because CueBox does not send them to the website. A subscription appears on the public site once it is both On Sale and visible."
        toolbar={
          <>
            <TableSearch value={search} onChange={setSearch} placeholder="Search subscriptions..." />
            <div className="ml-auto">
              <TableFilterPills options={TYPE_OPTIONS} active={typeFilter} onChange={setTypeFilter} />
            </div>
          </>
        }
        columns={COLUMNS}
        colClass={COL}
        sortKey={sortKey}
        sortDir={sortDir}
        toggleSort={toggleSort}
        filteredCount={visibleFiltered.length}
        totalCount={rows.length}
        empty={
          <TableEmptyState
            noun="subscriptions"
            isFiltered={isFiltered || typeFilter !== 'ALL'}
            onClear={() => {
              clearFilters()
              setTypeFilter('ALL')
            }}
          />
        }
      >
        {visibleFiltered.map((subscription, i) => (
          <SubscriptionRow key={subscription.id} subscription={subscription} index={i} onEdit={setEditing} />
        ))}
      </TableShell>
    </>
  )
}
