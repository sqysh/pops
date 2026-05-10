import { createNews } from '@/app/lib/actions/news/createNews'
import { updateNews } from '@/app/lib/actions/news/updateNews'
import { deleteNews } from '@/app/lib/actions/super/deleteNews'
import uploadFileToFirebase from '@/app/utils/firebase.upload'
import { News } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { DrawerShell } from '../elements/DrawerShell'
import { PictureUpload } from '../elements/PictureUpload'
import { FormError, FormField, FormInput, FormTextarea, FormToggle } from '../elements/FormField'
import { DrawerFormFooter } from '../elements/DrawerFormFooter'
import useSoundEffect from '@/app/lib/hooks/useSoundEffect'
import { DangerZone } from '../elements/DangerZone'

interface NewsFormData {
  title: string
  excerpt: string
  body: string
  externalLink: string
  isPublished: boolean
}

export function NewsDrawer({ open, onClose, news }: { open: boolean; onClose: () => void; news: News | null }) {
  const router = useRouter()
  const isEdit = !!news

  const [form, setForm] = useState<NewsFormData>(
    news
      ? {
          title: news.title,
          excerpt: news.excerpt,
          body: news.body,
          externalLink: news.externalLink ?? '',
          isPublished: news.isPublished
        }
      : { title: '', excerpt: '', body: '', externalLink: '', isPublished: false }
  )
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(news?.imageUrl || null)
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
    if (!form.title.trim()) {
      setError('Title is required.')
      return
    }
    setError(null)
    setSaving(true)
    let imageUrl = isEdit ? (news?.imageUrl ?? '') : ''
    let imageFilename = isEdit ? (news?.imageFilename ?? '') : ''
    if (file) {
      setUploading(true)
      imageUrl = await uploadFileToFirebase(file, (p) => setUploadProgress(Math.round(p)), 'image')
      imageFilename = file.name
      setUploading(false)
    }
    const result = isEdit
      ? await updateNews(news!.id, { ...form, imageUrl, imageFilename })
      : await createNews({ ...form, imageUrl, imageFilename })
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
    if (!news) return
    setDeleting(true)
    const result = await deleteNews(news.id)
    setDeleting(false)
    if (result.success) {
      deletedSE()
      router.refresh()
      handleClose()
    } else {
      setError(result.error ?? 'Failed to delete article.')
    }
  }

  return (
    <DrawerShell open={open} onClose={handleClose} label={isEdit ? 'EDIT NEWS' : 'NEW NEWS'} width="w-[36rem]">
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

          <FormField label="Title" htmlFor="news-title" required>
            <FormInput
              id="news-title"
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Season opener announced..."
              autoComplete="off"
            />
          </FormField>

          <FormField label="Excerpt" htmlFor="news-excerpt">
            <FormTextarea
              id="news-excerpt"
              value={form.excerpt}
              onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
              placeholder="A short summary shown in previews..."
              rows={3}
            />
          </FormField>

          <FormField label="Body" htmlFor="news-body">
            <FormTextarea
              id="news-body"
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              placeholder="Full article content..."
              rows={8}
            />
          </FormField>

          <FormField label="External Link" htmlFor="news-link">
            <FormInput
              id="news-link"
              type="url"
              value={form.externalLink}
              onChange={(e) => setForm((f) => ({ ...f, externalLink: e.target.value }))}
              placeholder="https://"
            />
          </FormField>

          <FormToggle
            label="Published"
            description="Show on public site"
            value={form.isPublished}
            onChange={(v) => setForm((f) => ({ ...f, isPublished: v }))}
          />

          <FormError error={error} />

          {isEdit && <DangerZone label="Delete Article" name={news.title} onConfirm={handleDelete} />}
        </div>

        <DrawerFormFooter
          onCancel={handleClose}
          busy={busy}
          uploading={uploading}
          uploadProgress={uploadProgress}
          saving={saving}
          isEdit={isEdit}
          submitLabel="Create Article"
          editLabel="Save Changes"
        />
      </form>
    </DrawerShell>
  )
}
