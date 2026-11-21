'use client'

import { useState } from 'react'
import { User, UserRole } from '@prisma/client'
import { useTableFilter } from '@/app/lib/hooks/useTableFilter'
import { COL, COLUMNS, ROLE_ORDER } from '@/app/lib/constants/user.constants'
import { TableEmptyState, TableShell } from '../_components/TableShell'
import { CreateAdminDrawer } from './_components/CreateAdminDrawer'
import { UserDrawer } from './_components/UserDrawer'
import { UserRow } from './_components/UserRow'

export function UsersClient({ users }: { users: User[] }) {
  const [creating, setCreating] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const { filtered, sortKey, sortDir, toggleSort } = useTableFilter({
    data: users,
    defaultSortKey: 'role',
    sortConfigs: {
      firstName: { getValue: (u) => `${u.firstName ?? ''} ${u.lastName ?? ''}`.toLowerCase() },
      email: { getValue: (u) => u.email.toLowerCase() },
      role: { getValue: (u) => ROLE_ORDER.indexOf(u.role) },
      createdAt: { getValue: (u) => new Date(u.createdAt).getTime() }
    }
  })

  const byRole = users.reduce<Record<string, number>>((acc, u) => {
    acc[u.role] = (acc[u.role] ?? 0) + 1
    return acc
  }, {})

  const count = (role: UserRole) => byRole[role] ?? 0

  return (
    <>
      <UserDrawer
        key={editingUser?.id ?? 'none'}
        open={editingUser !== null}
        onClose={() => setEditingUser(null)}
        user={editingUser}
      />

      <CreateAdminDrawer key={creating ? 'open' : 'closed'} open={creating} onClose={() => setCreating(false)} />

      <TableShell
        label="Users"
        count={users.length}
        pills={[
          { label: 'super', value: count('SUPER_USER') },
          { label: 'conductor', value: count('CONDUCTOR') },
          { label: 'admin', value: count('ADMIN') }
        ]}
        action={{ label: 'New admin', onClick: () => setCreating(true) }}
        note="New admins get a verification email before they can sign in. Change someone's role from their row or by opening it. Deleting a user removes their access straight away."
        columns={COLUMNS}
        colClass={COL}
        sortKey={sortKey}
        sortDir={sortDir}
        toggleSort={toggleSort}
        filteredCount={filtered.length}
        totalCount={users.length}
        empty={<TableEmptyState noun="users" isFiltered={false} onClear={() => {}} />}
      >
        {filtered.map((user, i) => (
          <UserRow key={user.id} user={user} index={i} onEdit={setEditingUser} />
        ))}
      </TableShell>
    </>
  )
}
