'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import useSoundEffect from '@/app/lib/hooks/useSoundEffect'
import { deleteUser } from '@/app/lib/actions/super/deleteUser'
import { updateUser } from '@/app/lib/actions/user/updateUser'
import { DrawerShell } from '@/app/(authenticated)/v2/_components/DrawerShell'
import { FormError, FormField, FormInput } from '@/app/(authenticated)/v2/_components/FormField'
import { DangerZone } from '@/app/(authenticated)/v2/_components/DangerZone'
import { DrawerFormFooter } from '@/app/(authenticated)/v2/_components/DrawerFormFooter'
import { DrawerBody, ReadonlyBlock } from '@/app/(authenticated)/v2/_components/DrawerElements'
import { formatRole } from '@/app/lib/utils/user.utils'
import { ROLE_ORDER } from '@/app/lib/constants/user.constants'
import { User, UserRole } from '@prisma/client'

const ROLE_DESCRIPTION: Record<string, string> = {
  SUPER_USER: 'Full access, including other admins and system settings.',
  CONDUCTOR: 'Manages concerts, programs and musicians.',
  ADMIN: 'Day to day access to the admin area.'
}

export function UserDrawer({ open, onClose, user }: { open: boolean; onClose: () => void; user: User | null }) {
  const router = useRouter()

  const [form, setForm] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    role: user?.role ?? 'ADMIN'
  })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { play: savedSE } = useSoundEffect('/mp3/se-1.mp3', true)
  const { play: deletedSE } = useSoundEffect('/mp3/se-2.mp3', true)

  const busy = saving || deleting
  const isSuperUser = user?.role === 'SUPER_USER'

  function handleClose() {
    if (busy) return
    setError(null)
    onClose()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setError(null)
    setSaving(true)
    const result = await updateUser(user.id, {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      role: form.role
    })
    setSaving(false)
    if (result.success) {
      savedSE()
      router.refresh()
      handleClose()
    } else {
      setError(result.error ?? 'Something went wrong.')
    }
  }

  async function handleDelete() {
    if (!user) return
    setError(null)
    setDeleting(true)
    const result = await deleteUser(user.id)
    setDeleting(false)
    if (result.success) {
      deletedSE()
      router.refresh()
      handleClose()
    } else {
      setError(result.error ?? 'Failed to delete this user.')
    }
  }

  if (!user) return null

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email

  return (
    <DrawerShell open={open} onClose={handleClose} label={`Edit ${fullName}`} width="w-[30rem]">
      <form onSubmit={handleSubmit} className="flex-1 min-h-0 flex flex-col overflow-hidden bg-white text-sm">
        <DrawerBody>
          <ReadonlyBlock label="Email">{user.email}</ReadonlyBlock>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="First name" htmlFor="user-first">
              <FormInput
                id="user-first"
                type="text"
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                placeholder="Jane"
                autoComplete="off"
              />
            </FormField>
            <FormField label="Last name" htmlFor="user-last">
              <FormInput
                id="user-last"
                type="text"
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                placeholder="Smith"
                autoComplete="off"
              />
            </FormField>
          </div>

          <FormField label="Role">
            <div className="flex flex-col gap-2" role="radiogroup" aria-label="Role">
              {ROLE_ORDER.map((role) => {
                // only an existing super user stays one; nobody is promoted here
                const locked = role === 'SUPER_USER' && !isSuperUser
                const selected = form.role === role

                return (
                  <button
                    key={role}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    disabled={locked || busy}
                    onClick={() => setForm((f) => ({ ...f, role: role as UserRole }))}
                    className={`flex items-start gap-3 px-3 py-2.5 border text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze ${
                      selected ? 'border-blaze bg-blaze/5' : 'border-neutral-300 bg-white hover:bg-neutral-50'
                    }`}
                  >
                    <span
                      className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                        selected ? 'border-blaze bg-blaze' : 'border-neutral-300'
                      }`}
                      aria-hidden="true"
                    >
                      {selected && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                    </span>
                    <span className="flex flex-col gap-0.5 min-w-0">
                      <span className={`font-medium ${selected ? 'text-neutral-900' : 'text-neutral-800'}`}>
                        {formatRole(role)}
                      </span>
                      {ROLE_DESCRIPTION[role] && (
                        <span className="text-neutral-600 leading-relaxed">
                          {locked ? 'Only an existing super user can hold this role.' : ROLE_DESCRIPTION[role]}
                        </span>
                      )}
                    </span>
                  </button>
                )
              })}
            </div>
          </FormField>

          <FormError error={error} />

          {!isSuperUser && <DangerZone label="Delete user" name={fullName} onConfirm={handleDelete} />}
        </DrawerBody>

        <DrawerFormFooter onCancel={handleClose} busy={busy} saving={saving} isEdit editLabel="Save changes" />
      </form>
    </DrawerShell>
  )
}
