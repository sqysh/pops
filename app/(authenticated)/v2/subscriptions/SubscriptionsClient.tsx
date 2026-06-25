'use client'

import { useState } from 'react'
import { TableEmptyState, TableFilterPills, TableSearch, TableShell } from '@/app/components/elements/TableShell'
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
import { SubscriptionDrawer } from '@/app/components/drawers/SubscriptionDrawer'
import { SubscriptionRow } from '@/app/components/rows/SubscriptionRow'

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
  const onSaleCount = rows.filter((s) => s.status === 'ON_SALE').length

  // ── local-state callbacks (no router.refresh) ──
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
        label="SUBSCRIPTIONS"
        backHref="/v2/dashboard"
        count={rows.length}
        pills={[
          { label: 'Subscriptions', value: subCount, accent: false },
          { label: 'Flex', value: flexCount, accent: false },
          { label: 'On Sale', value: onSaleCount, accent: true }
        ]}
        action={{ label: '+ New Subscription', onClick: () => setIsCreating(true) }}
        marquee="Subscriptions are managed here, not in CueBox — CueBox does not expose subscriptions to the website · Set a subscription to On Sale and Visible for it to appear on the public site · The Public URL is where patrons buy · The CueBox Edit URL is your private management link"
        toolbar={
          <>
            <TableSearch value={search} onChange={setSearch} placeholder="Search subscriptions..." />
            <div className="ml-auto">
              <TableFilterPills options={TYPE_OPTIONS} active={typeFilter} onChange={setTypeFilter} accentColor="red" />
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
