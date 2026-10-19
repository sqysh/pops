'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TeamMember } from '@prisma/client'
import { createTeamMember } from '@/app/lib/actions/team/createTeamMember'
import { updateTeamMember } from '@/app/lib/actions/team/updateTeamMember'
import { deleteTeamMember } from '@/app/lib/actions/super/deleteTeamMember'
import { TEAM_MEMBER_ROLES } from '@/app/lib/constants/team-member.constants'
import uploadFileToFirebase from '@/app/utils/firebase.upload'
import useSoundEffect from '@/app/lib/hooks/useSoundEffect'
import { DrawerShell } from '../../_components/DrawerShell'
import { DrawerBody } from '../../_components/DrawerElements'
import { DrawerFormFooter } from '../../_components/DrawerFormFooter'
import { DangerZone } from '../../_components/DangerZone'
import {
  FormError,
  FormField,
  FormInput,
  FormSelect,
  FormTextarea,
  FormToggle
} from '@/app/(authenticated)/v2/_components/FormField'
import { MediaUpload } from '../../_components/MediaUpload'

interface FormData {
  firstName: string
  lastName: string
  position: string
  role: string
  bio: string
  isPublished: boolean
}

const EMPTY_FORM: FormData = {
  firstName: '',
  lastName: '',
  position: '',
  role: TEAM_MEMBER_ROLES[0].value,
  bio: '',
  isPublished: true
}

export function TeamMemberDrawer({ open, onClose, member }: { open: boolean; onClose: () => void; member: TeamMember | null }) {
  const router = useRouter()

  const isEdit = !!member

  const [form, setForm] = useState<FormData>(
    member
      ? {
          firstName: member.firstName,
          lastName: member.lastName,
          position: member.position,
          role: member.role,
          bio: member.bio,
          isPublished: member.isPublished
        }
      : EMPTY_FORM
  )

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(member?.imageUrl || null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(member?.videoUrl || null)

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

    const errors: Partial<Record<keyof FormData, string>> = {}
    if (!form.firstName.trim()) errors.firstName = 'A first name is required.'
    if (!form.position.trim()) errors.position = 'A position is required.'
    if (!form.bio.trim()) errors.bio = 'Write a short bio before saving.'

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setError(null)
    setFieldErrors({})
    setSaving(true)

    // clearing a preview means the file should go, so only keep the existing
    // one while the preview is still showing it
    let imageUrl = imagePreview && !imageFile ? (member?.imageUrl ?? '') : ''
    let imageFilename = imagePreview && !imageFile ? (member?.imageFilename ?? '') : ''
    let videoUrl = videoPreview && !videoFile ? (member?.videoUrl ?? '') : ''
    let videoFilename = videoPreview && !videoFile ? (member?.videoFilename ?? '') : ''

    try {
      if (imageFile) {
        setUploading(true)
        imageUrl = await uploadFileToFirebase(imageFile, (p) => setUploadProgress(Math.round(p)), 'image')
        imageFilename = imageFile.name
        setUploading(false)
      }

      if (videoFile) {
        setUploading(true)
        videoUrl = await uploadFileToFirebase(videoFile, (p) => setUploadProgress(Math.round(p)), 'video')
        videoFilename = videoFile.name
        setUploading(false)
      }

      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        position: form.position.trim(),
        role: form.role,
        bio: form.bio.trim(),
        displayOrder: member?.displayOrder ?? 0,
        isPublished: form.isPublished,
        imageUrl,
        imageFilename,
        videoUrl,
        videoFilename
      }

      const result = isEdit && member ? await updateTeamMember(member.id, payload) : await createTeamMember(payload)

      if (result.success) {
        savedSE()
        router.refresh()
        handleClose()
      } else {
        setError(result.error ?? 'Something went wrong.')
      }
    } catch {
      // without this the drawer stays busy for good if an upload throws
      setError('The photo or video could not be uploaded. Check your connection and try again.')
    } finally {
      setUploading(false)
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!member) return

    setError(null)
    setDeleting(true)

    const result = await deleteTeamMember(member.id)
    setDeleting(false)

    if (result.success) {
      deletedSE()
      router.refresh()
      handleClose()
    } else {
      setError(result.error ?? 'Failed to delete this member.')
    }
  }

  return (
    <DrawerShell
      open={open}
      onClose={handleClose}
      label={isEdit ? `${member.firstName} ${member.lastName}` : 'New member'}
      width="w-[36rem]"
    >
      <form onSubmit={handleSubmit} noValidate className="flex-1 min-h-0 flex flex-col overflow-hidden bg-white text-sm">
        <DrawerBody>
          <MediaUpload
            label="Photo"
            file={imageFile}
            preview={imagePreview}
            uploading={uploading}
            uploadProgress={uploadProgress}
            onFileChange={(f, p) => {
              setImageFile(f)
              setImagePreview(p)
            }}
            onRemove={() => {
              setImageFile(null)
              setImagePreview(null)
            }}
          />

          <MediaUpload
            kind="video"
            label="Video"
            file={videoFile}
            preview={videoPreview}
            uploading={uploading}
            uploadProgress={uploadProgress}
            onFileChange={(f, p) => {
              setVideoFile(f)
              setVideoPreview(p)
            }}
            onRemove={() => {
              setVideoFile(null)
              setVideoPreview(null)
            }}
          />

          <div className="grid grid-cols-2 gap-3">
            <FormField label="First name" required error={fieldErrors.firstName}>
              <FormInput
                type="text"
                value={form.firstName}
                onChange={(e) => update('firstName', e.target.value)}
                placeholder="Nikki"
                autoComplete="off"
              />
            </FormField>

            <FormField label="Last name">
              <FormInput
                type="text"
                value={form.lastName}
                onChange={(e) => update('lastName', e.target.value)}
                placeholder="Rinsema"
                autoComplete="off"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Position" required error={fieldErrors.position}>
              <FormInput
                type="text"
                value={form.position}
                onChange={(e) => update('position', e.target.value)}
                placeholder="Concertmaster"
                autoComplete="off"
              />
            </FormField>

            <FormField label="Group">
              <FormSelect value={form.role} onChange={(e) => update('role', e.target.value)}>
                {TEAM_MEMBER_ROLES.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </FormSelect>
            </FormField>
          </div>

          <div className="border-t border-neutral-200" />

          <FormField
            label="Bio"
            required
            hint="Add a pipe ( | ) after a sentence to turn it into a bullet point."
            error={fieldErrors.bio}
          >
            <FormTextarea
              value={form.bio}
              onChange={(e) => update('bio', e.target.value)}
              placeholder="Where they trained, what they play, what they have done with The Pops"
              rows={6}
            />
          </FormField>

          <FormToggle
            label="Published"
            description="Show this person on the public team page."
            value={form.isPublished}
            onChange={(val) => update('isPublished', val)}
          />

          <FormError error={error} />

          {isEdit && member && (
            <DangerZone label="Delete member" name={`${member.firstName} ${member.lastName}`} onConfirm={handleDelete} />
          )}
        </DrawerBody>

        <DrawerFormFooter
          onCancel={handleClose}
          busy={busy}
          uploading={uploading}
          uploadProgress={uploadProgress}
          saving={saving}
          isEdit={isEdit}
          submitLabel="Create member"
          editLabel="Save changes"
        />
      </form>
    </DrawerShell>
  )
}
