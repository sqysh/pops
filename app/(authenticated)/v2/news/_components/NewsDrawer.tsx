'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { News } from '@prisma/client'
import { createNews } from '@/app/lib/actions/news/createNews'
import { updateNews } from '@/app/lib/actions/news/updateNews'
import { deleteNews } from '@/app/lib/actions/super/deleteNews'
import uploadFileToFirebase from '@/app/utils/firebase.upload'
import { DrawerShell } from '@/app/(authenticated)/v2/_components/DrawerShell'
import { FormError, FormField, FormInput, FormTextarea, FormToggle } from '@/app/(authenticated)/v2/_components/FormField'
import { DrawerFormFooter } from '@/app/(authenticated)/v2/_components/DrawerFormFooter'
import { DangerZone } from '@/app/(authenticated)/v2/_components/DangerZone'
import { CharCount, DrawerBody } from '@/app/(authenticated)/v2/_components/DrawerElements'
import useSoundEffect from '@/app/lib/hooks/useSoundEffect'
import { PictureUpload } from '../../_components/PictureUpload'

interface NewsFormData {
  title: string
  excerpt: string
  body: string
  externalLink: string
  isPublished: boolean
}

const EXCERPT_MAX = 300

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
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof NewsFormData, string>>>({})
  const [error, setError] = useState<string | null>(null)
  const { play: savedSE } = useSoundEffect('/mp3/se-1.mp3', true)
  const { play: deletedSE } = useSoundEffect('/mp3/se-2.mp3', true)

  const busy = uploading || saving || deleting

  const update = <K extends keyof NewsFormData>(key: K, value: NewsFormData[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
    // clear the field's error as soon as it is being corrected
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

    if (!form.title.trim()) {
      setFieldErrors({ title: 'Give the article a title before saving.' })
      return
    }

    setError(null)
    setFieldErrors({})
    setSaving(true)

    // clearing the preview means the image should go, so only keep the
    // existing one while the preview is still showing it
    let imageUrl = preview && !file ? (news?.imageUrl ?? '') : ''
    let imageFilename = preview && !file ? (news?.imageFilename ?? '') : ''

    try {
      if (file) {
        setUploading(true)
        imageUrl = await uploadFileToFirebase(file, (p) => setUploadProgress(Math.round(p)), 'image')
        imageFilename = file.name
        setUploading(false)
      }

      const result =
        isEdit && news
          ? await updateNews(news.id, { ...form, imageUrl, imageFilename })
          : await createNews({ ...form, imageUrl, imageFilename })

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
    if (!news) return
    setError(null)
    setDeleting(true)
    const result = await deleteNews(news.id)
    setDeleting(false)
    if (result.success) {
      deletedSE()
      router.refresh()
      handleClose()
    } else {
      setError(result.error ?? 'Failed to delete this article.')
    }
  }

  return (
    <DrawerShell open={open} onClose={handleClose} label={isEdit ? news.title : 'New article'} width="w-[36rem]">
      <form onSubmit={handleSubmit} noValidate className="flex-1 min-h-0 flex flex-col overflow-hidden bg-white text-sm">
        <DrawerBody>
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

          <FormField label="Title" required error={fieldErrors.title}>
            <FormInput
              type="text"
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="Season opener announced..."
              autoComplete="off"
            />
          </FormField>

          <FormField label="Excerpt" hint="A short summary, shown wherever the article is previewed.">
            <FormTextarea
              value={form.excerpt}
              onChange={(e) => update('excerpt', e.target.value)}
              placeholder="One or two sentences"
              rows={3}
              maxLength={EXCERPT_MAX}
            />
            <CharCount value={form.excerpt.length} max={EXCERPT_MAX} />
          </FormField>

          <FormField label="Body">
            <FormTextarea
              value={form.body}
              onChange={(e) => update('body', e.target.value)}
              placeholder="The full article"
              rows={10}
            />
          </FormField>

          <FormField label="External link" hint="Optional. Sends readers to another site instead of opening the article here.">
            <FormInput
              type="url"
              value={form.externalLink}
              onChange={(e) => update('externalLink', e.target.value)}
              placeholder="https://"
            />
          </FormField>

          <FormToggle
            label="Published"
            description="Show this article on the public site"
            value={form.isPublished}
            onChange={(v) => update('isPublished', v)}
            disabled={busy}
          />

          <FormError error={error} />

          {isEdit && <DangerZone label="Delete article" name={news.title} onConfirm={handleDelete} />}
        </DrawerBody>

        <DrawerFormFooter
          onCancel={handleClose}
          busy={busy}
          uploading={uploading}
          uploadProgress={uploadProgress}
          saving={saving}
          isEdit={isEdit}
          submitLabel="Create article"
          editLabel="Save changes"
        />
      </form>
    </DrawerShell>
  )
}
