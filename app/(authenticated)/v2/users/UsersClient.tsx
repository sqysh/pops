'use client'

import { useState } from 'react'
import { TableEmptyState, TableFilterPills, TableSearch, TableShell } from '../../../components/elements/TableShell'
import { useTableFilter } from '@/app/lib/hooks/useTableFilter'
import { CreateAdminDrawer } from '@/app/components/drawers/CreateAdminDrawer'
import { COL, COLUMNS, ROLE_OPTIONS, ROLE_ORDER } from '@/app/lib/constants/user.constants'
import { UserRow } from '@/app/components/rows/UserRow'
import { IUser } from '@/app/types/entities/user'
import { UserDrawer } from '@/app/components/drawers/UserDrawer'

export function UsersClient({ users }: { users: any[] }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [editingUser, setEditingUser] = useState<IUser | null>(null)

  const { filtered, search, setSearch, sortKey, sortDir, toggleSort, clearFilters, isFiltered } = useTableFilter({
    data: users,
    searchKeys: ['firstName', 'lastName', 'email'],
    defaultSortKey: 'role',
    sortConfigs: {
      firstName: { getValue: (u) => `${u.firstName ?? ''} ${u.lastName ?? ''}`.toLowerCase() },
      email: { getValue: (u) => u.email.toLowerCase() },
      role: { getValue: (u) => ROLE_ORDER.indexOf(u.role) },
      createdAt: { getValue: (u) => new Date(u.createdAt).getTime() }
    }
  })

  const visibleFiltered = filtered.filter((u) => (roleFilter === 'ALL' ? true : u.role === roleFilter))

  const superCount = users.filter((u) => u.role === 'SUPER_USER').length
  const conductorCount = users.filter((u) => u.role === 'CONDUCTOR').length
  const adminCount = users.filter((u) => u.role === 'ADMIN').length

  return (
    <>
      <UserDrawer
        key={editingUser?.id ?? 'none'}
        open={editingUser !== null}
        onClose={() => setEditingUser(null)}
        user={editingUser}
      />

      <CreateAdminDrawer key={drawerOpen ? 'open' : 'closed'} open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <TableShell
        label="USERS"
        backHref="/v2/dashboard"
        count={users.length}
        pills={[
          { label: 'Super', value: superCount, accent: false },
          { label: 'Conductor', value: conductorCount, accent: false },
          { label: 'Admin', value: adminCount, accent: false }
        ]}
        action={{ label: '+ New Admin', onClick: () => setDrawerOpen(true) }}
        marquee="Delete removes access immediately · Super User accounts cannot be deleted · New admins receive a verification email · Role changes must be made directly in the database"
        toolbar={
          <>
            <TableSearch value={search} onChange={setSearch} placeholder="Search users..." />
            <div className="ml-auto">
              <TableFilterPills options={ROLE_OPTIONS} active={roleFilter} onChange={setRoleFilter} accentColor="red" />
            </div>
          </>
        }
        columns={COLUMNS}
        colClass={COL}
        sortKey={sortKey}
        sortDir={sortDir}
        toggleSort={toggleSort}
        filteredCount={visibleFiltered.length}
        totalCount={users.length}
        empty={
          <TableEmptyState
            noun="users"
            isFiltered={isFiltered || roleFilter !== 'ALL'}
            onClear={() => {
              clearFilters()
              setRoleFilter('ALL')
            }}
          />
        }
      >
        {visibleFiltered.map((user, i) => (
          <UserRow key={user.id} user={user} index={i} onEdit={setEditingUser} />
        ))}
      </TableShell>
    </>
  )
}
