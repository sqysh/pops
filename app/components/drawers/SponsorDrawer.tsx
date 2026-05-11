import { EMPTY_SPONSOR_FORM, LEVEL_ORDER } from '@/app/lib/constants/sponsor.constants'
import { ISponsor } from '@/app/types/entities/sponsor'
import { useState } from 'react'
import { createSponsor } from '@/app/lib/actions/sponsor/createSponsor'
import uploadFileToFirebase from '@/app/utils/firebase.upload'
import { updateSponsor } from '@/app/lib/actions/sponsor/updateSponsor'
import { useRouter } from 'next/navigation'
import { deleteSponsor } from '@/app/lib/actions/sponsor/deleteSponsor'
import { DrawerShell } from '../elements/DrawerShell'
import { PictureUpload } from '../elements/PictureUpload'
import useSoundEffect from '@/app/lib/hooks/useSoundEffect'
import { FormError, FormField, FormInput, FormToggle } from '../elements/FormField'
import { formatLevel, levelColor } from '@/app/lib/utils/sponsor.utils'
import { DangerZone } from '../elements/DangerZone'
import { DrawerFormFooter } from '../elements/DrawerFormFooter'

type TSponsorDrawer = {
  open: boolean
  onClose: () => void
  sponsor?: ISponsor | null
}

export function SponsorDrawer({ open, onClose, sponsor }: TSponsorDrawer) {
  const isEdit = !!sponsor
  const router = useRouter()

  const [form, setForm] = useState(
    sponsor
      ? {
          name: sponsor.name,
          level: sponsor.level.toUpperCase().split(' ').join('_'),
          amount: sponsor.amount ? String(sponsor.amount) : '',
          externalLink: sponsor.externalLink ?? '',
          isActive: sponsor.isActive
        }
      : EMPTY_SPONSOR_FORM
  )
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(sponsor?.filePath || null)
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
    let filePath = isEdit ? (sponsor?.filePath ?? '') : ''
    let filename = isEdit ? (sponsor?.filename ?? '') : ''
    if (file) {
      setUploading(true)
      filePath = await uploadFileToFirebase(file, (p) => setUploadProgress(Math.round(p)), 'image')
      filename = file.name
      setUploading(false)
    }
    const payload = {
      name: form.name.trim(),
      level: form.level,
      amount: form.amount ? parseInt(form.amount, 10) : 0,
      externalLink: form.externalLink.trim(),
      isActive: form.isActive,
      filePath,
      filename
    }
    const result = isEdit ? await updateSponsor(sponsor!.id, payload) : await createSponsor(payload)
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
    if (!sponsor) return
    setDeleting(true)
    const result = await deleteSponsor(sponsor.id)
    setDeleting(false)
    if (result.success) {
      deletedSE()
      router.refresh()
      handleClose()
    } else {
      setError(result.error ?? 'Failed to delete sponsor.')
    }
  }

  return (
    <DrawerShell open={open} onClose={handleClose} label={isEdit ? 'EDIT SPONSOR' : 'NEW SPONSOR'} width="w-[28rem]">
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

          <FormField label="Name" htmlFor="sponsor-name" required>
            <FormInput
              id="sponsor-name"
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Sponsor name"
              autoComplete="off"
            />
          </FormField>

          <FormField label="Level">
            <div className="grid grid-cols-2 gap-1">
              {LEVEL_ORDER.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, level: l }))}
                  className={`text-[8px] font-mono uppercase tracking-widest px-2 py-2 border text-left transition-colors ${
                    form.level === l
                      ? `${levelColor(l)} border-opacity-60`
                      : 'border-border-dark text-muted-dark/70 hover:text-muted-dark hover:border-muted-dark/30'
                  }`}
                >
                  {formatLevel(l)}
                </button>
              ))}
            </div>
          </FormField>

          <FormField label="Amount (USD)" htmlFor="sponsor-amount">
            <FormInput
              id="sponsor-amount"
              type="text"
              inputMode="numeric"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value.replace(/[^\d]/g, '') }))}
              placeholder="0"
            />
          </FormField>

          <FormField label="External Link" htmlFor="sponsor-link">
            <FormInput
              id="sponsor-link"
              type="url"
              value={form.externalLink}
              onChange={(e) => setForm((f) => ({ ...f, externalLink: e.target.value }))}
              placeholder="https://"
            />
          </FormField>

          <FormToggle
            label="Active"
            description="Show on public site"
            value={form.isActive}
            onChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
          />

          <FormError error={error} />

          {isEdit && <DangerZone label="Delete Sponsor" name={sponsor.name} onConfirm={handleDelete} />}
        </div>

        <DrawerFormFooter
          onCancel={handleClose}
          busy={busy}
          uploading={uploading}
          uploadProgress={uploadProgress}
          saving={saving}
          isEdit={isEdit}
          submitLabel="Create Sponsor"
          editLabel="Save Changes"
        />
      </form>
    </DrawerShell>
  )
}
