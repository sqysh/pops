import { createAdminUser } from '@/app/lib/actions/user/createAdminUser'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { DrawerShell } from '../elements/DrawerShell'
import { ShieldCheck } from 'lucide-react'
import { FormError, FormField, FormInput } from '../elements/FormField'
import { DrawerFormFooter } from '../elements/DrawerFormFooter'
import useSoundEffect from '@/app/lib/hooks/useSoundEffect'

export function CreateAdminDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { play } = useSoundEffect('/mp3/se-1.mp3', true)

  function handleClose() {
    setForm({ firstName: '', lastName: '', email: '' })
    setError(null)
    setSaving(false)
    onClose()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.email.trim()) {
      setError('Email is required.')
      return
    }
    setError(null)
    setSaving(true)
    try {
      const result = await createAdminUser(form.email.trim(), form.firstName.trim(), form.lastName.trim())
      if (!result.success) {
        setError(result.error ?? 'Failed to create admin user.')
        setSaving(false)
        return
      }
      play()
      router.refresh()
      handleClose()
    } catch {
      setError('Something went wrong.')
      setSaving(false)
    }
  }

  return (
    <DrawerShell open={open} onClose={handleClose} label="NEW ADMIN" width="w-[26rem]">
      <form onSubmit={handleSubmit} className="flex-1 min-h-0 overflow-y-auto flex flex-col">
        <div className="flex-1 px-4 py-4 flex flex-col gap-5">
          {/* Role indicator */}
          <div className="flex items-center gap-2 py-2 border border-border-dark bg-surface-dark px-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-mono text-text-dark uppercase tracking-widest">Admin Role</span>
              <span className="text-[9px] font-mono text-muted-dark/80">
                User will receive an email to verify their account
              </span>
            </div>
          </div>

          {/* Name — side by side */}
          <div className="grid grid-cols-2 gap-3">
            <FormField label="First Name" htmlFor="admin-first">
              <FormInput
                id="admin-first"
                type="text"
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                placeholder="Jane"
                autoComplete="off"
              />
            </FormField>
            <FormField label="Last Name" htmlFor="admin-last">
              <FormInput
                id="admin-last"
                type="text"
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                placeholder="Smith"
                autoComplete="off"
              />
            </FormField>
          </div>

          {/* Email */}
          <FormField label="Email" htmlFor="admin-email" required>
            <FormInput
              id="admin-email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="jane@thepopsorchestr.org"
              autoComplete="off"
            />
          </FormField>

          <FormError error={error} />
        </div>

        <DrawerFormFooter
          onCancel={handleClose}
          busy={saving}
          saving={saving}
          isEdit={false}
          submitLabel="Create Admin"
        />
      </form>
    </DrawerShell>
  )
}
