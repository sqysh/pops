import { createEvent } from '@/app/lib/actions/event/createEvent'
import { updateEvent } from '@/app/lib/actions/event/updateEvent'
import { toDateInput } from '@/app/lib/utils/dateUtils'
import { showToast } from '@/app/redux/features/toastSlice'
import { store } from '@/app/redux/store'
import { TEventsEditorPanel } from '@/app/types/entities/event'
import { toTimeInput } from '@/app/utils/time.utils'
import { EventStatus } from '@prisma/client'
import { useState } from 'react'
import { FieldLabel } from '../common/FieldLabel'
import { Calendar, Check, Clock, Loader2, MapPin } from 'lucide-react'
import { inputCls } from '@/app/lib/constants/common'
import { useFormState } from '@/app/lib/hooks/useFormState'

const STATUS_OPTIONS: { value: EventStatus; label: string }[] = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'PAST', label: 'Past' }
]

export function EventsEditorPanel({ event, isNew, onSaved, onCancel }: TEventsEditorPanel) {
  const [loading, setLoading] = useState(false)

  const { form, set } = useFormState({
    title: event?.title ?? '',
    date: event?.date ? toDateInput(event.date) : '',
    time: event?.date ? toTimeInput(event.date) : '',
    location: event?.location ?? '',
    description: event?.description ?? '',
    status: (event?.status ?? 'DRAFT') as EventStatus
  })

  const handleSave = async () => {
    if (!form.title.trim()) {
      store.dispatch(showToast({ type: 'error', message: 'Title is required' }))
      return
    }
    if (!form.date) {
      store.dispatch(showToast({ type: 'error', message: 'Date is required' }))
      return
    }

    setLoading(true)

    const payload = {
      title: form.title,
      date: new Date(`${form.date}T${form.time || '00:00'}`).toISOString(),
      location: form.location,
      description: form.description,
      status: form.status
    }

    const res = isNew ? await createEvent(payload) : await updateEvent(event!.id, payload)

    setLoading(false)

    if (res.success && res.data) {
      store.dispatch(showToast({ type: 'success', message: isNew ? 'Event created' : 'Event updated' }))
      onSaved(res.data)
    } else {
      store.dispatch(showToast({ type: 'error', message: res.error ?? 'Something went wrong' }))
    }
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Panel header */}
      <div className="shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-border-dark bg-surface-dark">
        <div className="flex items-center gap-2">
          <div className="w-3 h-px bg-primary-dark" aria-hidden="true" />
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-dark">
            {isNew ? 'New Event' : 'Edit Event'}
          </span>
        </div>
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5">
        {/* Title */}
        <div>
          <FieldLabel htmlFor="title" required>
            Title
          </FieldLabel>
          <input
            id="title"
            type="text"
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="Open Rehearsal Night"
            className={inputCls}
          />
        </div>

        {/* Date + Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel htmlFor="date" required>
              Date
            </FieldLabel>
            <div className="relative">
              <Calendar
                className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-dark pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => set('date', e.target.value)}
                className={`${inputCls} pl-9`}
              />
            </div>
          </div>
          <div>
            <FieldLabel htmlFor="time">Time</FieldLabel>
            <div className="relative">
              <Clock
                className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-dark pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="time"
                type="time"
                value={form.time}
                onChange={(e) => set('time', e.target.value)}
                className={`${inputCls} pl-9`}
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <FieldLabel htmlFor="location">Location</FieldLabel>
          <div className="relative">
            <MapPin
              className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-dark pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="location"
              type="text"
              value={form.location}
              onChange={(e) => set('location', e.target.value)}
              placeholder="Riverview Performing Arts Center"
              className={`${inputCls} pl-9`}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <textarea
            id="description"
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="A short description of the event..."
            rows={4}
            className={`${inputCls} resize-none`}
          />
        </div>

        {/* Status */}
        <div>
          <FieldLabel>Status</FieldLabel>
          <div className="grid grid-cols-2 gap-2">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => set('status', s.value)}
                className={`px-3 py-2.5 border text-[10px] font-mono tracking-[0.15em] uppercase transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark ${
                  form.status === s.value
                    ? 'border-primary-dark bg-primary-dark/10 text-text-dark'
                    : 'border-border-dark text-muted-dark hover:border-muted-dark hover:bg-button-dark'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        {(form.title || form.date) && (
          <div className="border border-border-dark bg-bg-dark p-4">
            <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-dark mb-3">Preview</p>
            <div>
              <p className="text-text-dark text-sm font-medium">{form.title || '—'}</p>
              {form.date && (
                <div className="flex items-center gap-1.5 text-muted-dark text-xs mt-1">
                  <Calendar className="w-3 h-3 text-primary-dark" aria-hidden="true" />
                  {new Date(`${form.date}T${form.time || '00:00'}`).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                  {form.time &&
                    ` · ${new Date(`${form.date}T${form.time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`}
                </div>
              )}
              {form.location && (
                <div className="flex items-center gap-1.5 text-muted-dark text-xs mt-0.5">
                  <MapPin className="w-3 h-3 text-primary-dark" aria-hidden="true" />
                  {form.location}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="shrink-0 flex gap-3 px-4 py-3 border-t border-border-dark bg-surface-dark">
        <button
          onClick={onCancel}
          className="px-4 py-2.5 border border-border-dark text-muted-dark hover:text-text-dark text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex-1 py-2.5 bg-primary-dark hover:bg-secondary-light text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              {isNew ? 'Create Event' : 'Save Changes'}
            </>
          )}
        </button>
      </div>
    </div>
  )
}
