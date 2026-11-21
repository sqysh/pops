'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronsUpDown, Loader2 } from 'lucide-react'
import { User, UserRole } from '@prisma/client'
import { COL } from '@/app/lib/constants/user.constants'
import { formatRole } from '@/app/lib/utils/user.utils'
import { updateUserRole } from '@/app/lib/actions/user/updateUserRole'
import { formatDate } from '@/app/lib/utils/date.utils'
import useSoundEffect from '@/app/lib/hooks/useSoundEffect'
import { RolePopover } from './RolePopover'

/** Falls back to neutral, so a role added later still renders. */
const ROLE_TONE: Record<string, string> = {
  SUPER_USER: 'text-blaze-text bg-blaze/5 ring-blaze/20',
  CONDUCTOR: 'text-purple-700 bg-purple-50 ring-purple-200',
  ADMIN: 'text-emerald-700 bg-emerald-50 ring-emerald-200'
}

const roleTone = (role: string) => ROLE_TONE[role] ?? 'text-neutral-600 bg-neutral-100 ring-neutral-300'

export function UserRow({ user, index, onEdit }: { user: User; index: number; onEdit: (u: User) => void }) {
  const router = useRouter()
  const [rolePopover, setRolePopover] = useState(false)
  const [updatingRole, setUpdatingRole] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || '—'
  const isSuperUser = user.role === 'SUPER_USER'
  const { play: roleChangeSE } = useSoundEffect('/mp3/se-1.mp3', true)

  async function handleRoleChange(role: UserRole) {
    if (role === user.role) return
    setError(null)
    setUpdatingRole(true)
    const result = await updateUserRole(user.id, role)
    setUpdatingRole(false)
    if (result.success) {
      roleChangeSE()
      router.refresh()
    } else {
      setError(result.error ?? 'Could not change this role.')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, delay: Math.min(index * 0.01, 0.15) }}
      role="button"
      tabIndex={0}
      onClick={() => onEdit(user)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onEdit(user)
        }
      }}
      aria-label={`Edit ${fullName}`}
      className={`grid ${COL} items-center gap-3 px-4 py-3 border-b border-neutral-200 last:border-0 cursor-pointer transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-inset`}
    >
      {/* Name */}
      <span className="truncate text-neutral-900">{fullName}</span>

      {/* Email */}
      <span className="truncate text-neutral-600">{user.email}</span>

      {/* Role */}
      <div className="relative">
        <button
          type="button"
          // without this the row's own handler fires too and the edit drawer
          // opens behind the popover
          onClick={(e) => {
            e.stopPropagation()
            if (!isSuperUser) setRolePopover((v) => !v)
          }}
          disabled={isSuperUser || updatingRole}
          aria-haspopup={isSuperUser ? undefined : 'menu'}
          aria-expanded={isSuperUser ? undefined : rolePopover}
          aria-label={isSuperUser ? `${fullName} is a super user` : `Change role for ${fullName}`}
          className={`inline-flex items-center gap-1.5 text-xs font-medium rounded-full ring-1 px-2 py-0.5 transition-colors ${roleTone(
            user.role
          )} ${
            isSuperUser
              ? 'cursor-default'
              : 'cursor-pointer hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze'
          } disabled:opacity-60`}
        >
          {updatingRole && <Loader2 className="w-3 h-3 animate-spin shrink-0" aria-hidden="true" />}
          {formatRole(user.role)}
          {!isSuperUser && !updatingRole && <ChevronsUpDown className="w-3 h-3 shrink-0 opacity-60" aria-hidden="true" />}
        </button>

        <AnimatePresence>
          {rolePopover && (
            <RolePopover currentRole={user.role} onSelect={handleRoleChange} onClose={() => setRolePopover(false)} />
          )}
        </AnimatePresence>

        {error && (
          <p role="alert" className="text-xs text-red-700 mt-1">
            {error}
          </p>
        )}
      </div>

      {/* Joined */}
      <span className="truncate text-neutral-500 tabular-nums">{formatDate(user.createdAt)}</span>
    </motion.div>
  )
}
