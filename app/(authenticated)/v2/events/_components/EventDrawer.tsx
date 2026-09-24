import { createEvent } from '@/app/lib/actions/event/createEvent'
import { updateEvent } from '@/app/lib/actions/event/updateEvent'
import { deleteEvent } from '@/app/lib/actions/super/deleteEvent'
import useSoundEffect from '@/app/lib/hooks/useSoundEffect'
import { Event, EventStatus } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { DrawerShell } from '@/app/(authenticated)/v2/_components/DrawerShell'
import { FormError, FormField, FormInput, FormTextarea } from '@/app/(authenticated)/v2/_components/FormField'
import { STATUS_COLORS } from '@/app/lib/constants/event.constants'
import { DangerZone } from '@/app/(authenticated)/v2/_components/DangerZone'
import { DrawerFormFooter } from '@/app/(authenticated)/v2/_components/DrawerFormFooter'
import { DrawerBody } from '../../_components/DrawerElements'

interface EventFormData {
  title: string
  date: string
  location: string
  description: string
  status: EventStatus
}

export function EventDrawer({ open, onClose, event }: { open: boolean; onClose: () => void; event: Event | null }) {
  const isEdit = !!event
  const router = useRouter()

  const toDatetimeLocal = (d: Date | string) => {
    const date = new Date(d)
    const offset = date.getTimezoneOffset()
    const local = new Date(date.getTime() - offset * 60000)
    return local.toISOString().slice(0, 16)
  }

  const [form, setForm] = useState<EventFormData>(
    event
      ? {
          title: event.title,
          date: toDatetimeLocal(event.date),
          location: event.location,
          description: event.description,
          status: event.status
        }
      : { title: '', date: '', location: '', description: '', status: 'DRAFT' }
  )
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof EventFormData, string>>>({})
  const [error, setError] = useState<string | null>(null)
  const { play: savedSE } = useSoundEffect('/mp3/se-1.mp3', true)
  const { play: deletedSE } = useSoundEffect('/mp3/se-2.mp3', true)

  const formatStatus = (s: string) => s.charAt(0) + s.slice(1).toLowerCase().replace(/_/g, ' ')

  const update = <K extends keyof EventFormData>(key: K, value: EventFormData[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
    // clear the field's error as soon as it is being corrected
    setFieldErrors((e) => (e[key] ? { ...e, [key]: undefined } : e))
  }

  const busy = saving || deleting

  function handleClose() {
    if (busy) return
    setError(null)
    setFieldErrors({})
    onClose()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('Title is required.')
      return
    }
    if (!form.date) {
      setError('Date is required.')
      return
    }
    setError(null)
    setFieldErrors({})
    setSaving(true)

    const payload = {
      title: form.title.trim(),
      date: new Date(form.date),
      location: form.location.trim(),
      description: form.description.trim(),
      status: form.status
    }
    const result = isEdit ? await updateEvent(event!.id, payload) : await createEvent(payload)
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
    if (!event) return
    setDeleting(true)
    const result = await deleteEvent(event.id)
    setDeleting(false)
    if (result.success) {
      deletedSE()
      router.refresh()
      handleClose()
    } else {
      setError(result.error ?? 'Failed to delete event.')
    }
  }

  return (
    <DrawerShell open={open} onClose={handleClose} label={isEdit ? event.title : 'New event'} width="w-[32rem]">
      <form onSubmit={handleSubmit} noValidate className="flex-1 min-h-0 flex flex-col overflow-hidden bg-white text-sm">
        <DrawerBody>
          <FormField label="Title" required error={fieldErrors.title}>
            <FormInput
              type="text"
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="Spring Gala"
              autoComplete="off"
            />
          </FormField>

          <FormField label="Date and time" required error={fieldErrors.date}>
            <FormInput type="datetime-local" value={form.date} onChange={(e) => update('date', e.target.value)} />
          </FormField>

          <FormField label="Location">
            <FormInput
              type="text"
              value={form.location}
              onChange={(e) => update('location', e.target.value)}
              placeholder="Van Wezel Performing Arts Hall"
              autoComplete="off"
            />
          </FormField>

          <FormField label="Description" hint="What patrons will read on the events page.">
            <FormTextarea
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="What the evening is, who is playing, what to expect"
              rows={5}
            />
          </FormField>

          <FormField label="Status">
            <div
              role="radiogroup"
              aria-label="Event status"
              className="inline-flex w-full border border-neutral-300 divide-x divide-neutral-300 overflow-hidden"
            >
              {Object.keys(STATUS_COLORS).map((s) => {
                const selected = form.status === s

                return (
                  <button
                    key={s}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => update('status', s as EventStatus)}
                    className={`flex-1 h-9 px-3 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-inset ${
                      selected ? 'bg-blaze text-white' : 'bg-white text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    {formatStatus(s)}
                  </button>
                )
              })}
            </div>
          </FormField>

          <FormError error={error} />

          {isEdit && <DangerZone label="Delete event" name={event.title} onConfirm={handleDelete} />}
        </DrawerBody>

        <DrawerFormFooter
          onCancel={handleClose}
          busy={busy}
          saving={saving}
          isEdit={isEdit}
          submitLabel="Create event"
          editLabel="Save changes"
        />
      </form>
    </DrawerShell>
  )
}
