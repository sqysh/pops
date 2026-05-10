'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { IUser } from '@/app/types/entities/user'
import useSoundEffect from '@/app/lib/hooks/useSoundEffect'
import { deleteUser } from '@/app/lib/actions/super/deleteUser'
import { DrawerShell } from '../elements/DrawerShell'
import { FormError, FormField, FormInput } from '../elements/FormField'
import { DangerZone } from '../elements/DangerZone'
import { DrawerFormFooter } from '../elements/DrawerFormFooter'
import { roleColor } from '@/app/lib/utils/user.utils'
import { updateUser } from '@/app/lib/actions/user/updateUser'
import { ROLE_ORDER } from '@/app/lib/constants/user.constants'

export function UserDrawer({ open, onClose, user }: { open: boolean; onClose: () => void; user: IUser | null }) {
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
    setError(null)
    setSaving(true)
    const result = await updateUser(user!.id, {
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
    setDeleting(true)
    const result = await deleteUser(user.id)
    setDeleting(false)
    if (result.success) {
      deletedSE()
      router.refresh()
      handleClose()
    } else {
      setError(result.error ?? 'Failed to delete user.')
    }
  }

  if (!user) return null

  return (
    <DrawerShell open={open} onClose={handleClose} label="EDIT USER" width="w-[28rem]">
      <form onSubmit={handleSubmit} className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 flex flex-col gap-5">
          {/* Email — read only */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[7px] font-mono uppercase tracking-widest text-muted-dark/50">Email</span>
            <div className="bg-bg-dark border border-border-dark px-3 py-2">
              <span className="text-[11px] font-mono text-muted-dark/60">{user.email}</span>
            </div>
          </div>

          {/* Name */}
          <div className="grid grid-cols-2 gap-3">
            <FormField label="First Name" htmlFor="user-first">
              <FormInput
                id="user-first"
                type="text"
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                placeholder="Jane"
                autoComplete="off"
              />
            </FormField>
            <FormField label="Last Name" htmlFor="user-last">
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

          {/* Role */}
          <FormField label="Role">
            <div className="flex flex-col gap-1">
              {ROLE_ORDER.map((role) => (
                <button
                  key={role}
                  type="button"
                  disabled={role === 'SUPER_USER' && user.role !== 'SUPER_USER'}
                  onClick={() => setForm((f) => ({ ...f, role: role }))}
                  className={`text-[8px] font-mono uppercase tracking-widest px-3 py-2 border text-left transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                    form.role === role
                      ? roleColor(role)
                      : 'border-border-dark text-muted-dark/40 hover:text-muted-dark hover:border-muted-dark/30'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </FormField>

          <FormError error={error} />

          {/* Danger zone — not for super users */}
          {!isSuperUser && (
            <DangerZone
              label="Delete User"
              name={[user.firstName, user.lastName].filter(Boolean).join(' ') || user.email}
              onConfirm={handleDelete}
            />
          )}
        </div>

        <DrawerFormFooter onCancel={handleClose} busy={busy} saving={saving} isEdit={true} editLabel="Save Changes" />
      </form>
    </DrawerShell>
  )
}
