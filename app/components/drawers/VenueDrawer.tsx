'use client'

import { createVenue } from '@/app/lib/actions/venue/createVenue'
import { updateVenue } from '@/app/lib/actions/venue/updateVenue'
import { EMPTY_VENUE_FORM } from '@/app/lib/constants/venue.constants'
import { IVenue } from '@/app/types/entities/venue'
import uploadFileToFirebase from '@/app/utils/firebase.upload'
import { useState } from 'react'
import { DrawerShell } from '../elements/DrawerShell'
import { PictureUpload } from '../elements/PictureUpload'
import { FormError, FormField, FormInput, FormTextarea } from '../elements/FormField'
import { DrawerFormFooter } from '../elements/DrawerFormFooter'
import { useRouter } from 'next/navigation'
import useSoundEffect from '@/app/lib/hooks/useSoundEffect'
import { deleteVenue } from '@/app/lib/actions/super/deleteVenue'
import { DangerZone } from '../elements/DangerZone'

interface FormData {
  name: string
  capacity: string
  accessibility: string
  immersiveEnvironment: string
  parking: string
  address: string
  city: string
}

export function VenueDrawer({ open, onClose, venue }: { open: boolean; onClose: () => void; venue: IVenue | null }) {
  const isEdit = !!venue
  const router = useRouter()

  const [form, setForm] = useState<FormData>(
    venue
      ? {
          name: venue.name,
          capacity: venue.capacity,
          accessibility: venue.accessibility,
          immersiveEnvironment: venue.immersiveEnvironment,
          parking: venue.parking,
          address: venue.address,
          city: venue.city
        }
      : EMPTY_VENUE_FORM
  )
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(venue?.imageUrl || null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { play: savedSE } = useSoundEffect('/mp3/se-1.mp3', true)
  const { play: deletedSE } = useSoundEffect('/mp3/se-2.mp3', true)

  const busy = uploading || saving || deleting

  function handleClose() {
    if (busy) return
    setError(null)
    onClose()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Name is required.')
      return
    }
    setError(null)
    setSaving(true)
    let imageUrl = isEdit ? (venue?.imageUrl ?? '') : ''
    let imageFilename = isEdit ? (venue?.imageFilename ?? '') : ''
    if (file) {
      setUploading(true)
      imageUrl = await uploadFileToFirebase(file, (p) => setUploadProgress(Math.round(p)), 'image')
      imageFilename = file.name
      setUploading(false)
    }
    const payload = {
      name: form.name.trim(),
      capacity: form.capacity.trim(),
      accessibility: form.accessibility.trim(),
      immersiveEnvironment: form.immersiveEnvironment.trim(),
      parking: form.parking.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      imageUrl,
      imageFilename
    }
    const result = isEdit ? await updateVenue(venue!.id, payload) : await createVenue(payload)
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
    if (!venue) return
    setDeleting(true)
    const result = await deleteVenue(venue.id)
    setDeleting(false)
    if (result.success) {
      deletedSE()
      router.refresh()
      handleClose()
    } else {
      setError(result.error ?? 'Failed to delete venue.')
    }
  }

  return (
    <DrawerShell open={open} onClose={handleClose} label={isEdit ? 'EDIT VENUE' : 'NEW VENUE'} width="w-[32rem]">
      <form onSubmit={handleSubmit} className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 flex flex-col gap-5">
          <PictureUpload
            file={file}
            preview={preview}
            uploading={uploading}
            uploadProgress={uploadProgress}
            onFileChange={(f, p) => {
              setFile(f)
              setPreview(p)
            }}
            onRemove={() => {
              setFile(null)
              setPreview(null)
            }}
          />

          <FormField label="Name" htmlFor="venue-name" required>
            <FormInput
              id="venue-name"
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Venue name"
              autoComplete="off"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="City" htmlFor="venue-city">
              <select
                id="venue-city"
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                className="bg-surface-dark border border-border-dark px-3 py-2 text-[12px] font-mono text-text-dark outline-none focus:border-muted-dark/40 transition-colors w-full appearance-none cursor-pointer"
              >
                <option value="" disabled className="bg-bg-dark">
                  Select city...
                </option>
                <option value="Sarasota" className="bg-bg-dark">
                  Sarasota
                </option>
                <option value="Bradenton" className="bg-bg-dark">
                  Bradenton
                </option>
              </select>
            </FormField>
            <FormField label="Capacity" htmlFor="venue-capacity">
              <FormInput
                id="venue-capacity"
                type="text"
                value={form.capacity}
                onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
                placeholder="1,500"
              />
            </FormField>
          </div>

          <FormField label="Address" htmlFor="venue-address">
            <FormInput
              id="venue-address"
              type="text"
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              placeholder="123 Main St"
            />
          </FormField>

          <div className="border-t border-border-dark" />

          <FormField label="Accessibility" htmlFor="venue-accessibility">
            <FormTextarea
              id="venue-accessibility"
              value={form.accessibility}
              onChange={(e) => setForm((f) => ({ ...f, accessibility: e.target.value }))}
              placeholder="Wheelchair access, hearing loops, etc."
              rows={3}
            />
          </FormField>

          <FormField label="Parking" htmlFor="venue-parking">
            <FormTextarea
              id="venue-parking"
              value={form.parking}
              onChange={(e) => setForm((f) => ({ ...f, parking: e.target.value }))}
              placeholder="Parking details..."
              rows={3}
            />
          </FormField>

          <FormField label="Immersive Environment" htmlFor="venue-immersive">
            <FormTextarea
              id="venue-immersive"
              value={form.immersiveEnvironment}
              onChange={(e) => setForm((f) => ({ ...f, immersiveEnvironment: e.target.value }))}
              placeholder="Describe the venue atmosphere..."
              rows={3}
            />
          </FormField>

          <FormError error={error} />

          {isEdit && <DangerZone label="Delete Venue" name={venue.name} onConfirm={handleDelete} />}
        </div>

        <DrawerFormFooter
          onCancel={handleClose}
          busy={busy}
          uploading={uploading}
          uploadProgress={uploadProgress}
          saving={saving}
          isEdit={isEdit}
          submitLabel="Create Venue"
          editLabel="Save Changes"
        />
      </form>
    </DrawerShell>
  )
}
