import { IUser } from '@/app/types/entities/user'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { COL, ROLE_ORDER } from '@/app/lib/constants/user.constants'
import { formatRole, roleColor } from '@/app/lib/utils/user.utils'
import { ChevronsUpDown } from 'lucide-react'
import { UserRole } from '@prisma/client'
import { updateUserRole } from '@/app/lib/actions/user/updateUserRole'
import useSoundEffect from '@/app/lib/hooks/useSoundEffect'

function RolePopover({
  currentRole,
  onSelect,
  onClose
}: {
  currentRole: string
  onSelect: (role: UserRole) => void
  onClose: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className="absolute left-0 top-full mt-1 z-50 bg-bg-dark border border-border-dark w-40 shadow-xl"
    >
      <div className="px-2 py-1.5 border-b border-border-dark">
        <span className="text-[9px] font-mono uppercase tracking-widest text-muted-dark/70">Change Role</span>
      </div>
      {ROLE_ORDER.map((role) => (
        <button
          key={role}
          type="button"
          onClick={() => {
            onSelect(role as UserRole)
            onClose()
          }}
          className={`w-full flex items-center justify-between px-3 py-2 text-[9px] font-mono uppercase tracking-widest transition-colors hover:bg-surface-dark ${
            currentRole === role ? roleColor(role) : 'text-muted-dark/80'
          }`}
        >
          {formatRole(role)}
          {currentRole === role && <span className="text-[9px]">✓</span>}
        </button>
      ))}
    </motion.div>
  )
}

export function UserRow({ user, index, onEdit }: { user: IUser; index: number; onEdit: any }) {
  const router = useRouter()
  const [rolePopover, setRolePopover] = useState(false)
  const [updatingRole, setUpdatingRole] = useState(false)

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || '—'
  const isSuperUser = user.role === 'SUPER_USER'
  const { play: roleChangeSE } = useSoundEffect('/mp3/se-1.mp3', true)

  async function handleRoleChange(role: UserRole) {
    if (role === user.role) return
    setUpdatingRole(true)
    const result = await updateUserRole(user.id, role)
    if (result.success) {
      roleChangeSE()
      router.refresh()
    }
    setUpdatingRole(false)
  }

  return (
    <motion.div
      onClick={() => onEdit(user)}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, duration: 0.2 }}
      className={`grid ${COL} items-center gap-3 px-3 py-2.5 border-b border-border-dark/40 last:border-0 group hover:bg-black transition-colors cursor-pointer`}
    >
      {/* Name */}
      <div className="min-w-0">
        <span className="text-[12px] font-mono text-text-dark truncate block">{fullName}</span>
        <span className="text-[9px] font-mono text-muted-dark/80 truncate block">
          {new Date(user.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </span>
      </div>

      {/* Email */}
      <span className="text-[11px] font-mono text-text-dark truncate">{user.email}</span>

      {/* Role — clickable to change */}
      <div className="relative">
        <button
          type="button"
          onClick={() => !isSuperUser && setRolePopover((v) => !v)}
          disabled={isSuperUser || updatingRole}
          className={`flex items-center gap-1 text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 border transition-colors ${roleColor(user.role)} ${!isSuperUser ? 'hover:opacity-80 cursor-pointer' : 'cursor-default'} disabled:opacity-50`}
          aria-label={`Change role for ${fullName}`}
        >
          {formatRole(user.role)}
          {!isSuperUser && <ChevronsUpDown className="w-2.5 h-2.5 opacity-50" />}
        </button>
        <AnimatePresence>
          {rolePopover && (
            <RolePopover currentRole={user.role} onSelect={handleRoleChange} onClose={() => setRolePopover(false)} />
          )}
        </AnimatePresence>
      </div>

      {/* Joined */}
      <span className="text-[10px] font-mono text-muted-dark/80 tabular-nums">
        {new Date(user.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })}
      </span>
    </motion.div>
  )
}
