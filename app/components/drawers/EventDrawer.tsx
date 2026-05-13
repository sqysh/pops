import { createEvent } from '@/app/lib/actions/event/createEvent'
import { updateEvent } from '@/app/lib/actions/event/updateEvent'
import { deleteEvent } from '@/app/lib/actions/super/deleteEvent'
import useSoundEffect from '@/app/lib/hooks/useSoundEffect'
import { Event, EventStatus } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { DrawerShell } from '../elements/DrawerShell'
import { FormError, FormField, FormInput, FormTextarea } from '../elements/FormField'
import { STATUS_COLORS } from '@/app/lib/constants/event.constants'
import { DangerZone } from '../elements/DangerZone'
import { DrawerFormFooter } from '../elements/DrawerFormFooter'

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
  const [error, setError] = useState<string | null>(null)
  const { play: savedSE } = useSoundEffect('/mp3/se-1.mp3', true)
  const { play: deletedSE } = useSoundEffect('/mp3/se-2.mp3', true)

  const busy = saving || deleting

  function handleClose() {
    if (busy) return
    setError(null)
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
    <DrawerShell open={open} onClose={handleClose} label={isEdit ? 'EDIT EVENT' : 'NEW EVENT'} width="w-[32rem]">
      <form onSubmit={handleSubmit} className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 flex flex-col gap-5">
          <FormField label="Title" htmlFor="event-title" required>
            <FormInput
              id="event-title"
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Spring Gala..."
              autoComplete="off"
            />
          </FormField>

          <FormField label="Date & Time" htmlFor="event-date" required>
            <FormInput
              id="event-date"
              type="datetime-local"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
          </FormField>

          <FormField label="Location" htmlFor="event-location">
            <FormInput
              id="event-location"
              type="text"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              placeholder="Van Wezel Performing Arts Hall..."
              autoComplete="off"
            />
          </FormField>

          <FormField label="Description" htmlFor="event-description">
            <FormTextarea
              id="event-description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Event details..."
              rows={5}
            />
          </FormField>

          {/* Status */}
          <FormField label="Status">
            <div className="flex gap-1">
              {Object.keys(STATUS_COLORS).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, status: s as EventStatus }))}
                  className={`flex-1 text-[9px] font-mono uppercase tracking-widest px-2 py-2 border transition-colors ${
                    form.status === s
                      ? STATUS_COLORS[s]
                      : 'border-border-dark text-muted-dark/70 hover:text-muted-dark hover:border-muted-dark/30'
                  }`}
                >
                  {s.charAt(0) + s.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </FormField>

          <FormError error={error} />

          {isEdit && <DangerZone label="Delete Event" name={event.title} onConfirm={handleDelete} />}
        </div>

        <DrawerFormFooter
          onCancel={handleClose}
          busy={busy}
          saving={saving}
          isEdit={isEdit}
          submitLabel="Create Event"
          editLabel="Save Changes"
        />
      </form>
    </DrawerShell>
  )
}
