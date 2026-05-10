import { deleteTestimonial } from '@/app/lib/actions/super/deleteTestimonial'
import { createTestimonial } from '@/app/lib/actions/testimonial/createTestimonial'
import { updateTestimonial } from '@/app/lib/actions/testimonial/updateTestimonial'
import { Testimonial } from '@prisma/client'
import { useState } from 'react'
import { DrawerShell } from '../elements/DrawerShell'
import { FormError, FormField, FormInput, FormTextarea, FormToggle } from '../elements/FormField'
import { DrawerFormFooter } from '../elements/DrawerFormFooter'
import useSoundEffect from '@/app/lib/hooks/useSoundEffect'
import { DangerZone } from '../elements/DangerZone'

interface FormData {
  quote: string
  author: string
  title: string
  isPublished: boolean
}

export function TestimonialDrawer({
  open,
  onClose,
  testimonial,
  onSaved,
  onDeleted
}: {
  open: boolean
  onClose: () => void
  testimonial: Testimonial | null
  onSaved: (t: Testimonial) => void
  onDeleted: (id: string) => void
}) {
  const isEdit = !!testimonial

  const [form, setForm] = useState<FormData>(
    testimonial
      ? {
          quote: testimonial.quote,
          author: testimonial.author,
          title: testimonial.title ?? '',
          isPublished: testimonial.isPublished
        }
      : { quote: '', author: '', title: '', isPublished: false }
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
    setSaving(false)
    onClose()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.quote.trim()) {
      setError('Quote is required.')
      return
    }
    if (!form.author.trim()) {
      setError('Author is required.')
      return
    }
    setError(null)
    setSaving(true)
    const res = isEdit ? await updateTestimonial(testimonial!.id, form) : await createTestimonial(form)
    setSaving(false)
    if (res.success && res.data) {
      savedSE()
      onSaved(res.data)
      handleClose()
    } else {
      setError(res.error ?? 'Something went wrong.')
    }
  }

  async function handleDelete() {
    if (!testimonial) return
    setDeleting(true)
    const res = await deleteTestimonial(testimonial.id)
    setDeleting(false)
    if (res.success) {
      deletedSE()
      onDeleted(testimonial.id)
      handleClose()
    } else {
      setError(res.error ?? 'Failed to delete testimonial.')
    }
  }

  return (
    <DrawerShell
      open={open}
      onClose={handleClose}
      label={isEdit ? 'EDIT TESTIMONIAL' : 'NEW TESTIMONIAL'}
      width="w-[32rem]"
    >
      <form onSubmit={handleSubmit} className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 flex flex-col gap-5">
          <FormField label="Quote" htmlFor="t-quote" required>
            <FormTextarea
              id="t-quote"
              value={form.quote}
              onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))}
              placeholder="An unforgettable evening of music..."
              rows={5}
            />
          </FormField>

          <FormField label="Author" htmlFor="t-author" required>
            <FormInput
              id="t-author"
              type="text"
              value={form.author}
              onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
              placeholder="Jane Smith"
              autoComplete="off"
            />
          </FormField>

          <FormField label="Title / Description" htmlFor="t-title">
            <FormInput
              id="t-title"
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Season Ticket Holder"
              autoComplete="off"
            />
          </FormField>

          <FormToggle
            label="Published"
            description="Show on public site"
            value={form.isPublished}
            onChange={(v) => setForm((f) => ({ ...f, isPublished: v }))}
          />

          <FormError error={error} />

          {isEdit && <DangerZone label="Delete Testimonial" name={testimonial.author} onConfirm={handleDelete} />}
        </div>

        <DrawerFormFooter
          onCancel={handleClose}
          busy={busy}
          saving={saving}
          isEdit={isEdit}
          submitLabel="Create Testimonial"
          editLabel="Save Changes"
        />
      </form>
    </DrawerShell>
  )
}
