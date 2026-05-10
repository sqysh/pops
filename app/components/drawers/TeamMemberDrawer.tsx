'use client'

import { createTeamMember } from '@/app/lib/actions/team/createTeamMember'
import { updateTeamMember } from '@/app/lib/actions/team/updateTeamMember'
import uploadFileToFirebase from '@/app/utils/firebase.upload'
import { TeamMember } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { DrawerShell } from '../elements/DrawerShell'
import useSoundEffect from '@/app/lib/hooks/useSoundEffect'
import { FormError, FormField, FormInput, FormTextarea, FormToggle } from '../elements/FormField'
import { TEAM_MEMBER_ROLES } from '@/app/lib/constants/team-member.constants'
import { DrawerFormFooter } from '../elements/DrawerFormFooter'
import { deleteTeamMember } from '@/app/lib/actions/super/deleteTeamMember'
import { DangerZone } from '../elements/DangerZone'
import { PictureUpload } from '../elements/PictureUpload'
import { VideoUpload } from '../elements/VideoUpload'
import { useSession } from 'next-auth/react'

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  position: '',
  role: '',
  bio: '',
  displayOrder: '0',
  isPublished: true
}

export function TeamMemberDrawer({
  open,
  onClose,
  member
}: {
  open: boolean
  onClose: () => void
  member: TeamMember | null
}) {
  const session = useSession()

  const isEdit = !!member
  const router = useRouter()

  const [form, setForm] = useState(
    member
      ? {
          firstName: member.firstName,
          lastName: member.lastName,
          position: member.position,
          role: member.role,
          bio: member.bio,
          displayOrder: String(member.displayOrder),
          isPublished: member.isPublished,
          imageFile: member.imageUrl,
          imageFilename: member.imageFilename,
          videoFile: member.videoUrl,
          videoFilename: member.videoFilename
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
    if (!form.firstName.trim()) {
      setError('First name is required.')
      return
    }
    if (!form.position.trim()) {
      setError('Position is required.')
      return
    }
    if (!form.bio.trim()) {
      setError('Bio is required.')
      return
    }
    setError(null)
    setSaving(true)

    let imageUrl = isEdit ? (member?.imageUrl ?? '') : ''
    let imageFilename = isEdit ? (member?.imageFilename ?? '') : ''
    let videoUrl = isEdit ? (member?.videoUrl ?? '') : undefined
    let videoFilename = isEdit ? (member?.videoFilename ?? '') : undefined

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
      displayOrder: parseInt(form.displayOrder || '0', 10),
      isPublished: form.isPublished,
      imageUrl,
      imageFilename,
      videoUrl,
      videoFilename
    }

    const result = isEdit ? await updateTeamMember(member!.id, payload) : await createTeamMember(payload)
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
    if (!member) return
    setDeleting(true)
    const result = await deleteTeamMember(member.id)
    setDeleting(false)
    if (result.success) {
      deletedSE()
      router.refresh()
      handleClose()
    } else {
      setError(result.error ?? 'Failed to delete member.')
    }
  }

  return (
    <DrawerShell
      open={open}
      onClose={handleClose}
      label={isEdit ? `${member.firstName} ${member.lastName}` : 'NEW MEMBER'}
      width="w-[36rem]"
    >
      <form onSubmit={handleSubmit} className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 flex flex-col gap-5">
          <PictureUpload
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

          {session.data.user.role === 'SUPER_USER' && (
            <VideoUpload
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
          )}

          {/* Identity */}
          <div className="flex flex-col gap-3">
            <span className="flex items-center gap-2 text-[7px] font-mono uppercase tracking-widest text-primary-dark">
              <span className="w-4 h-px bg-primary-dark" />
              Identity
            </span>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="First Name" htmlFor="tm-first" required>
                <FormInput
                  id="tm-first"
                  type="text"
                  value={form.firstName}
                  onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                  placeholder="Nikki"
                  autoComplete="off"
                />
              </FormField>
              <FormField label="Last Name" htmlFor="tm-last">
                <FormInput
                  id="tm-last"
                  type="text"
                  value={form.lastName}
                  onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                  placeholder="Rinsema"
                  autoComplete="off"
                />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Position" htmlFor="tm-position" required>
                <FormInput
                  id="tm-position"
                  type="text"
                  value={form.position}
                  onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))}
                  placeholder="Concertmaster"
                  autoComplete="off"
                />
              </FormField>
              <FormField label="Role" htmlFor="tm-role">
                <select
                  id="tm-role"
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  className="bg-surface-dark border border-border-dark px-3 py-2 text-[11px] font-mono text-text-dark outline-none focus:border-muted-dark/40 transition-colors w-full appearance-none cursor-pointer"
                >
                  {TEAM_MEMBER_ROLES.map(({ value, label }) => (
                    <option key={value} value={value} className="bg-bg-dark">
                      {label}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-3">
            <span className="flex items-center gap-2 text-[7px] font-mono uppercase tracking-widest text-primary-dark">
              <span className="w-4 h-px bg-primary-dark" />
              Details
            </span>
            <FormField label="Bio" htmlFor="tm-bio" required>
              <FormTextarea
                id="tm-bio"
                value={form.bio}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                placeholder="Write a bio..."
                rows={6}
              />
              <span className="text-[7px] font-mono text-muted-dark/30 mt-1">
                Add a pipe ( | ) after each sentence to display as bullet points.
              </span>
            </FormField>
          </div>

          {/* Settings */}
          <div className="flex flex-col gap-3">
            <span className="flex items-center gap-2 text-[7px] font-mono uppercase tracking-widest text-primary-dark">
              <span className="w-4 h-px bg-primary-dark" />
              Settings
            </span>
            <FormToggle
              label="Published"
              description="Show on public site"
              value={form.isPublished}
              onChange={(v) => setForm((f) => ({ ...f, isPublished: v }))}
            />
          </div>

          <FormError error={error} />

          {isEdit && (
            <DangerZone
              label="Delete Member"
              name={`${member.firstName} ${member.lastName}`}
              onConfirm={handleDelete}
            />
          )}
        </div>

        <DrawerFormFooter
          onCancel={handleClose}
          busy={busy}
          uploading={uploading}
          uploadProgress={uploadProgress}
          saving={saving}
          isEdit={isEdit}
          submitLabel="Create Member"
          editLabel="Save Changes"
        />
      </form>
    </DrawerShell>
  )
}
