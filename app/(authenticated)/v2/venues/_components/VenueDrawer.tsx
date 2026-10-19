'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createVenue } from '@/app/lib/actions/venue/createVenue'
import { updateVenue } from '@/app/lib/actions/venue/updateVenue'
import { deleteVenue } from '@/app/lib/actions/super/deleteVenue'
import { EMPTY_VENUE_FORM } from '@/app/lib/constants/venue.constants'
import { IVenue } from '@/app/types/entities/venue'
import uploadFileToFirebase from '@/app/utils/firebase.upload'
import { DrawerShell } from '@/app/(authenticated)/v2/_components/DrawerShell'
import { FormError, FormField, FormInput, FormSelect, FormTextarea } from '@/app/(authenticated)/v2/_components/FormField'
import { DrawerFormFooter } from '@/app/(authenticated)/v2/_components/DrawerFormFooter'
import { DangerZone } from '@/app/(authenticated)/v2/_components/DangerZone'
import { DrawerBody } from '@/app/(authenticated)/v2/_components/DrawerElements'
import useSoundEffect from '@/app/lib/hooks/useSoundEffect'
import { MediaUpload } from '../../_components/MediaUpload'

interface FormData {
  name: string
  capacity: string
  accessibility: string
  immersiveEnvironment: string
  parking: string
  address: string
  city: string
}

const CITIES = ['Sarasota', 'Bradenton', 'Parrish']

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
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [error, setError] = useState<string | null>(null)
  const { play: savedSE } = useSoundEffect('/mp3/se-1.mp3', true)
  const { play: deletedSE } = useSoundEffect('/mp3/se-2.mp3', true)

  const busy = uploading || saving || deleting

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
    setFieldErrors((e) => (e[key] ? { ...e, [key]: undefined } : e))
  }

  function handleClose() {
    if (busy) return
    setError(null)
    setFieldErrors({})
    onClose()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!form.name.trim()) {
      setFieldErrors({ name: 'Give the venue a name before saving.' })
      return
    }

    setError(null)
    setFieldErrors({})
    setSaving(true)

    // clearing the preview means the image should go, so only keep the
    // existing one while the preview is still showing it
    let imageUrl = preview && !file ? (venue?.imageUrl ?? '') : ''
    let imageFilename = preview && !file ? (venue?.imageFilename ?? '') : ''

    try {
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

      const result = isEdit && venue ? await updateVenue(venue.id, payload) : await createVenue(payload)

      if (result.success) {
        savedSE()
        router.refresh()
        handleClose()
      } else {
        setError(result.error ?? 'Something went wrong.')
      }
    } catch {
      // without this the drawer stays busy for good if the upload throws
      setError('The image could not be uploaded. Check your connection and try again.')
    } finally {
      setUploading(false)
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!venue) return
    setError(null)
    setDeleting(true)
    const result = await deleteVenue(venue.id)
    setDeleting(false)
    if (result.success) {
      deletedSE()
      router.refresh()
      handleClose()
    } else {
      setError(result.error ?? 'Failed to delete this venue.')
    }
  }

  return (
    <DrawerShell open={open} onClose={handleClose} label={isEdit ? venue.name : 'New venue'} width="w-[32rem]">
      <form onSubmit={handleSubmit} noValidate className="flex-1 min-h-0 flex flex-col overflow-hidden bg-white text-sm">
        <DrawerBody>
          <MediaUpload
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

          <FormField label="Name" required error={fieldErrors.name}>
            <FormInput
              type="text"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="Neel Performing Arts Center"
              autoComplete="off"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="City">
              <FormSelect value={form.city} onChange={(e) => update('city', e.target.value)}>
                <option value="">Select a city</option>
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </FormSelect>
            </FormField>

            <FormField label="Capacity">
              <FormInput
                type="text"
                inputMode="numeric"
                value={form.capacity}
                onChange={(e) => update('capacity', e.target.value)}
                placeholder="1,500"
              />
            </FormField>
          </div>

          <FormField label="Address">
            <FormInput
              type="text"
              value={form.address}
              onChange={(e) => update('address', e.target.value)}
              placeholder="123 Main St"
              autoComplete="off"
            />
          </FormField>

          <div className="border-t border-neutral-200" />

          <FormField label="Accessibility" hint="What patrons should know before they arrive.">
            <FormTextarea
              value={form.accessibility}
              onChange={(e) => update('accessibility', e.target.value)}
              placeholder="Wheelchair access, hearing loops, step-free entrances"
              rows={3}
            />
          </FormField>

          <FormField label="Parking">
            <FormTextarea
              value={form.parking}
              onChange={(e) => update('parking', e.target.value)}
              placeholder="Where to park, cost, how far the walk is"
              rows={3}
            />
          </FormField>

          <FormField label="Immersive environment">
            <FormTextarea
              value={form.immersiveEnvironment}
              onChange={(e) => update('immersiveEnvironment', e.target.value)}
              placeholder="What the room feels like to sit in"
              rows={3}
            />
          </FormField>

          <FormError error={error} />

          {isEdit && <DangerZone label="Delete venue" name={venue.name} onConfirm={handleDelete} />}
        </DrawerBody>

        <DrawerFormFooter
          onCancel={handleClose}
          busy={busy}
          uploading={uploading}
          uploadProgress={uploadProgress}
          saving={saving}
          isEdit={isEdit}
          submitLabel="Create venue"
          editLabel="Save changes"
        />
      </form>
    </DrawerShell>
  )
}
