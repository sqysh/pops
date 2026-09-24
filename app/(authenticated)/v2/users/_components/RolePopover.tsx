import { UserRole } from '@prisma/client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ROLE_ORDER } from '@/app/lib/constants/user.constants'
import { formatRole } from '@/app/lib/utils/user.utils'
import { Check } from 'lucide-react'

export function RolePopover({
  currentRole,
  onSelect,
  onClose
}: {
  currentRole: string
  onSelect: (role: UserRole) => void
  onClose: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    const onPointerDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [onClose])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.12 }}
      role="menu"
      onClick={(e) => e.stopPropagation()}
      className="absolute left-0 top-full mt-1 z-50 w-48 bg-white border border-neutral-300 shadow-lg"
    >
      <div className="px-3 py-2 border-b border-neutral-200">
        <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">Change role</span>
      </div>
      {ROLE_ORDER.map((role) => {
        const isCurrent = currentRole === role

        return (
          <button
            key={role}
            type="button"
            role="menuitem"
            onClick={() => {
              onSelect(role as UserRole)
              onClose()
            }}
            className={`w-full flex items-center justify-between gap-2 px-3 h-9 text-left transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-inset ${
              isCurrent ? 'font-semibold text-neutral-900' : 'text-neutral-700'
            }`}
          >
            {formatRole(role)}
            {isCurrent && <Check className="w-4 h-4 shrink-0 text-blaze-text" aria-hidden="true" />}
          </button>
        )
      })}
    </motion.div>
  )
}
