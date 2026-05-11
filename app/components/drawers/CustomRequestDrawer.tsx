import { sendCustomRequest } from '@/app/lib/actions/custom-request/sendCustomRequest'
import { CHANGE_TYPES, URGENCY_LEVELS } from '@/app/lib/constants/custom-requests.constants'
import { CustomRequest } from '@prisma/client'
import { useState } from 'react'
import { DrawerShell } from '../elements/DrawerShell'
import { FormError, FormField, FormInput, FormTextarea } from '../elements/FormField'
import { DrawerFormFooter } from '../elements/DrawerFormFooter'

const EMPTY_FORM = {
  changeType: CHANGE_TYPES[0],
  page: '',
  what: '',
  why: '',
  example: '',
  urgency: 'MEDIUM'
}

export function CustomRequestDrawer({
  open,
  onClose,
  onCreated
}: {
  open: boolean
  onClose: () => void
  onCreated: (r: CustomRequest) => void
}) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleClose() {
    if (saving) return
    setForm(EMPTY_FORM)
    setError(null)
    onClose()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.page.trim()) {
      setError('Page is required.')
      return
    }
    if (!form.what.trim()) {
      setError('Please describe what you need.')
      return
    }
    if (!form.why.trim()) {
      setError('Please describe why this is needed.')
      return
    }
    setError(null)
    setSaving(true)
    const result = await sendCustomRequest({ ...form })
    setSaving(false)
    if (result.success && result.data) {
      onCreated(result.data)
      handleClose()
    } else {
      setError(result.error ?? 'Failed to submit request.')
    }
  }

  return (
    <DrawerShell open={open} onClose={handleClose} label="NEW REQUEST" width="w-[32rem]">
      <form onSubmit={handleSubmit} className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 flex flex-col gap-5">
          {/* Change type */}
          <FormField label="Type of Change">
            <div className="grid grid-cols-2 gap-1">
              {CHANGE_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, changeType: t }))}
                  className={`text-[8px] font-mono uppercase tracking-widest px-2 py-2 border text-left transition-colors ${
                    form.changeType === t
                      ? 'border-primary-dark/40 text-primary-dark bg-primary-dark/5'
                      : 'border-border-dark text-muted-dark/70 hover:text-muted-dark hover:border-muted-dark/30'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </FormField>

          {/* Urgency */}
          <FormField label="Urgency">
            <div className="flex gap-1">
              {URGENCY_LEVELS.map(({ value, label, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, urgency: value }))}
                  className={`flex-1 text-[8px] font-mono uppercase tracking-widest px-2 py-2 border transition-colors ${
                    form.urgency === value
                      ? color
                      : 'border-border-dark text-muted-dark/70 hover:text-muted-dark hover:border-muted-dark/30'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </FormField>

          {/* Page */}
          <FormField label="Page / Section" htmlFor="cr-page" required>
            <FormInput
              id="cr-page"
              type="text"
              value={form.page}
              onChange={(e) => setForm((f) => ({ ...f, page: e.target.value }))}
              placeholder="e.g. Home page hero, Concerts page..."
              autoComplete="off"
            />
          </FormField>

          {/* What */}
          <FormField label="What do you need?" htmlFor="cr-what" required>
            <FormTextarea
              id="cr-what"
              value={form.what}
              onChange={(e) => setForm((f) => ({ ...f, what: e.target.value }))}
              placeholder="Describe the change you're requesting..."
              rows={4}
            />
          </FormField>

          {/* Why */}
          <FormField label="Why is this needed?" htmlFor="cr-why" required>
            <FormTextarea
              id="cr-why"
              value={form.why}
              onChange={(e) => setForm((f) => ({ ...f, why: e.target.value }))}
              placeholder="Explain the reason or context..."
              rows={3}
            />
          </FormField>

          {/* Example */}
          <FormField label="Example or Reference" htmlFor="cr-example">
            <FormTextarea
              id="cr-example"
              value={form.example}
              onChange={(e) => setForm((f) => ({ ...f, example: e.target.value }))}
              placeholder="Link, screenshot description, or example site..."
              rows={2}
            />
          </FormField>

          <FormError error={error} />
        </div>

        <DrawerFormFooter
          onCancel={handleClose}
          busy={saving}
          saving={saving}
          isEdit={false}
          submitLabel="Submit Request"
        />
      </form>
    </DrawerShell>
  )
}
