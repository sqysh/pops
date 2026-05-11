import { FieldLabel } from '../common/FieldLabel'
import { useRef, useState } from 'react'
import uploadFileToFirebase from '@/app/utils/firebase.upload'
import { store } from '@/app/redux/store'
import { showToast } from '@/app/redux/features/toastSlice'
import { createNews } from '@/app/lib/actions/news/createNews'
import { updateNews } from '@/app/lib/actions/news/updateNews'
import { Check, Loader2, Upload } from 'lucide-react'
import Picture from '../common/Picture'
import { inputCls } from '@/app/lib/constants/common'
import { TNewsEditorPanel } from '@/app/types/entities/news'
import { useFormState } from '@/app/lib/hooks/useFormState'

export function NewsEditorPanel({ news, isNew, onSaved, onCancel }: TNewsEditorPanel) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [imagePreview, setImagePreview] = useState<string | null>(news?.imageUrl || null)

  const { form, set, setForm } = useFormState({
    title: news?.title ?? '',
    excerpt: news?.excerpt ?? '',
    body: news?.body ?? '',
    imageUrl: news?.imageUrl ?? '',
    imageFilename: news?.imageFilename ?? '',
    isPublished: news?.isPublished ?? false,
    externalLink: news?.externalLink ?? ''
  })

  const handleImage = async (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target?.result as string)
    reader.readAsDataURL(file)

    setUploading(true)
    setUploadProgress(0)
    const url = await uploadFileToFirebase(file, setUploadProgress).catch(() => null)
    setUploading(false)

    if (!url) {
      store.dispatch(showToast({ type: 'error', message: 'Image upload failed' }))
      return
    }

    setForm((f) => ({ ...f, imageUrl: url, imageFilename: file.name }))
  }

  const handleSave = async () => {
    if (!form.title.trim()) {
      store.dispatch(showToast({ type: 'error', message: 'Title is required' }))
      return
    }

    setLoading(true)

    const res = isNew ? await createNews(form) : await updateNews(news!.id, form)

    setLoading(false)

    if (res.success && res.data) {
      store.dispatch(showToast({ type: 'success', message: isNew ? 'Article created' : 'Article updated' }))
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
            {isNew ? 'New Article' : 'Edit Article'}
          </span>
        </div>
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5">
        {/* Image */}
        <div>
          <FieldLabel>Cover Image</FieldLabel>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-full border border-border-dark hover:border-primary-dark transition-colors relative overflow-hidden group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark"
            aria-label="Upload cover image"
          >
            {imagePreview ? (
              <div className="relative">
                <Picture priority src={imagePreview} alt="Cover preview" className="w-full h-40 object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4 text-white" aria-hidden="true" />
                  <span className="text-white text-[11px] font-mono">Change Image</span>
                </div>
              </div>
            ) : (
              <div className="h-32 flex flex-col items-center justify-center gap-2 bg-surface-dark">
                <Upload
                  className="w-5 h-5 text-muted-dark group-hover:text-primary-dark transition-colors"
                  aria-hidden="true"
                />
                <span className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-dark group-hover:text-text-dark transition-colors">
                  Upload Cover Image
                </span>
              </div>
            )}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) handleImage(f)
            }}
          />
          {uploading && (
            <div className="mt-1.5">
              <div className="h-px bg-border-dark w-full">
                <div className="h-px bg-primary-dark transition-all" style={{ width: `${uploadProgress}%` }} />
              </div>
              <p className="text-[10px] font-mono text-muted-dark mt-1">Uploading... {Math.round(uploadProgress)}%</p>
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <FieldLabel htmlFor="title" required>
            Title
          </FieldLabel>
          <input
            id="title"
            type="text"
            value={form.title ?? ''}
            onChange={(e) => set('title', e.target.value)}
            placeholder="Pops Announces 51st Season"
            className={inputCls}
          />
        </div>

        {/* Excerpt */}
        <div>
          <FieldLabel htmlFor="excerpt">Excerpt</FieldLabel>
          <textarea
            id="excerpt"
            value={form.excerpt ?? ''}
            onChange={(e) => set('excerpt', e.target.value)}
            placeholder="A short summary shown on the news listing page..."
            rows={3}
            className={`${inputCls} resize-none`}
          />
          <p className="text-[10px] font-mono text-muted-dark/70 mt-1">
            Shown on the news listing page. Keep it to 1-2 sentences.
          </p>
        </div>

        {/* Body */}
        <div>
          <FieldLabel htmlFor="body">Full Article</FieldLabel>
          <textarea
            id="body"
            value={form.body ?? ''}
            onChange={(e) => set('body', e.target.value)}
            placeholder="The full article content..."
            rows={10}
            className={`${inputCls} resize-none`}
          />
        </div>

        <div>
          <FieldLabel htmlFor="externalLink" required>
            External Link
          </FieldLabel>
          <input
            id="externalLink"
            type="text"
            value={form.externalLink ?? ''}
            onChange={(e) => set('externalLink', e.target.value)}
            placeholder="https://www..."
            className={inputCls}
          />
        </div>

        {/* Published */}
        <div className="flex items-center justify-between px-3 py-2.5 border border-border-dark bg-bg-dark">
          <div>
            <p className="text-text-dark text-sm font-medium">Published</p>
            <p className="text-muted-dark text-[11px] mt-0.5">Visible on the public site</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={form.isPublished}
            onClick={() => set('isPublished', !form.isPublished)}
            className={`relative w-9 h-4 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark ${
              form.isPublished ? 'bg-primary-dark' : 'bg-border-dark'
            }`}
          >
            <span
              className={`absolute top-0.5 w-3 h-3 bg-white transition-all duration-200 ${
                form.isPublished ? 'left-5' : 'left-0.5'
              }`}
            />
            <span className="sr-only">{form.isPublished ? 'Published' : 'Draft'}</span>
          </button>
        </div>
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
          disabled={loading || uploading}
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
              {isNew ? 'Create Article' : 'Save Changes'}
            </>
          )}
        </button>
      </div>
    </div>
  )
}
