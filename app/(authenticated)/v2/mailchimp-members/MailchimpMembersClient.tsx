'use client'

import { useState } from 'react'
import { useTableFilter } from '@/app/lib/hooks/useTableFilter'
import { TableEmptyState, TableFilterPills, TableSearch, TableShell } from '@/app/components/elements/TableShell'
import { COL, COLUMNS, STATUS_OPTIONS } from '@/app/lib/constants/mailchimp.constants'
import { MailchimpMemberRow } from '@/app/components/rows/MailchimpMemberRow'

export function MailchimpMembersClient({ members, count }: { members: any[]; count: number }) {
  const [statusFilter, setStatusFilter] = useState('ALL')

  const { filtered, search, setSearch, sortKey, sortDir, toggleSort, clearFilters, isFiltered } = useTableFilter({
    data: members,
    searchKeys: ['name', 'email', 'phoneNumber'],
    defaultSortKey: 'name',
    sortConfigs: {
      name: { getValue: (m) => (m.name ?? '').toLowerCase() },
      createdAt: { getValue: (m) => (m.createdAt ? new Date(m.createdAt).getTime() : 0) },
      status: { getValue: (m) => m.status ?? '' }
    }
  })

  const visibleFiltered = filtered.filter((m) => (statusFilter === 'ALL' ? true : m.status === statusFilter))

  const subscribedCount = members.filter((m) => m.status === 'subscribed').length

  return (
    <TableShell
      label="MAILCHIMP"
      backHref="/v2/dashboard"
      count={count}
      pills={[
        { label: 'Subscribed', value: subscribedCount, accent: false },
        { label: 'Unsubscribed', value: members.filter((m) => m.status === 'unsubscribed').length, accent: false },
        { label: 'Cleaned', value: members.filter((m) => m.status === 'cleaned').length, accent: false },
        { label: 'Pending', value: members.filter((m) => m.status === 'pending').length, accent: false }
      ]}
      action={{
        label: 'Mailchimp ↗',
        onClick: () => window.open('https://us2.admin.mailchimp.com/audience/', '_blank')
      }}
      marquee="Read-only — showing the most recent 100 subscribers · Manage subscribers directly in Mailchimp · Click ↗ to view a member's full profile · Interest tags show self-reported preferences"
      marqueeNode={
        <span className="text-[9px] font-mono">
          <span className="text-emerald-400">● Subscribed</span>
          <span className="text-muted-dark/20 mx-3">—</span>
          <span className="text-muted-dark/80">active, receiving emails</span>
          <span className="text-muted-dark/20 mx-6">·</span>
          <span className="text-red-400">● Unsubscribed</span>
          <span className="text-muted-dark/20 mx-3">—</span>
          <span className="text-muted-dark/80">opted out</span>
          <span className="text-muted-dark/20 mx-6">·</span>
          <span className="text-yellow-400">● Cleaned</span>
          <span className="text-muted-dark/20 mx-3">—</span>
          <span className="text-muted-dark/80">bounced or invalid email</span>
          <span className="text-muted-dark/20 mx-6">·</span>
          <span className="text-sky-400">● Pending</span>
          <span className="text-muted-dark/20 mx-3">—</span>
          <span className="text-muted-dark/80">awaiting confirmation</span>
          <span className="text-muted-dark/20 mx-6">·</span>
        </span>
      }
      toolbar={
        <>
          <TableSearch value={search} onChange={setSearch} placeholder="Search by name or email..." />
          <div className="ml-auto">
            <TableFilterPills
              options={STATUS_OPTIONS}
              active={statusFilter}
              onChange={setStatusFilter}
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
      totalCount={count}
      footerExtra={
        <span className="text-[9px] font-mono uppercase tracking-widest text-muted-dark/60">
          {subscribedCount} active subscribers
        </span>
      }
      empty={
        <TableEmptyState
          noun="members"
          isFiltered={isFiltered || statusFilter !== 'ALL'}
          onClear={() => {
            clearFilters()
            setStatusFilter('ALL')
          }}
        />
      }
    >
      {visibleFiltered.map((member, i) => (
        <MailchimpMemberRow key={member.contactId} member={member} index={i} />
      ))}
    </TableShell>
  )
}
