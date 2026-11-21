'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, Image as Img, Info, Loader2, Trash2, Upload } from 'lucide-react'
import type { PhotoGalleryImage } from '@prisma/client'
import uploadFileToFirebase from '@/app/utils/firebase.upload'
import { createGalleryPhoto } from '@/app/lib/actions/photo-gallery-image/createGalleryPhoto'
import { deleteGalleryPhoto } from '@/app/lib/actions/super/deleteGalleryPhoto'
import Picture from '@/components/common/Picture'
import useSoundEffect from '@/app/lib/hooks/useSoundEffect'
import { formatDate } from '@/app/lib/utils/date.utils'

const MAX_SIZE_MB = 5

function PhotoCard({
  photo,
  index,
  onDeleted,
  onError
}: {
  photo: PhotoGalleryImage
  index: number
  onDeleted: (id: string) => void
  onError: (message: string) => void
}) {
  const router = useRouter()
  const { play: deletedSE } = useSoundEffect('/mp3/se-2.mp3', true)
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    const result = await deleteGalleryPhoto(photo.id)
    setDeleting(false)

    if (!result.success) {
      setConfirming(false)
      onError(result.error ?? 'That photo could not be deleted. Please try again.')
      return
    }

    deletedSE()
    onDeleted(photo.id)
    router.refresh()
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="border border-neutral-300 bg-white overflow-hidden flex flex-col"
    >
      <Picture
        src={photo.imageUrl}
        alt=""
        width={400}
        height={300}
        // only the first row is worth preloading, the rest can wait for scroll
        priority={index < 5}
        className="w-full h-40 object-cover"
      />

      <div className="px-3 py-2 border-t border-neutral-200 flex items-center justify-between gap-2 shrink-0 min-h-11">
        {confirming ? (
          <>
            <span className="text-neutral-700 truncate">Delete this photo?</span>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-1.5 h-8 px-2.5 text-xs font-medium text-red-700 border border-red-300 hover:bg-red-50 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />}
                Delete
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                disabled={deleting}
                className="h-8 px-2.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
              >
                Keep
              </button>
            </div>
          </>
        ) : (
          <>
            <span className="text-neutral-500 truncate">{formatDate(photo.createdAt)}</span>
            <button
              type="button"
              onClick={() => setConfirming(true)}
              aria-label={`Delete the photo added ${formatDate(photo.createdAt)}`}
              className="shrink-0 flex items-center justify-center w-8 h-8 text-neutral-400 hover:text-red-700 hover:bg-red-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
            </button>
          </>
        )}
      </div>
    </motion.div>
  )
}

function UploadZone({
  onUpload,
  onError
}: {
  onUpload: (file: File, onProgress: (pct: number) => void) => Promise<void>
  onError: (message: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dragging, setDragging] = useState(false)

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      onError('That file is not an image.')
      return
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      onError(`That photo is larger than ${MAX_SIZE_MB}MB. Please choose a smaller one.`)
      return
    }

    setUploading(true)
    setProgress(0)

    await onUpload(file, (pct) => setProgress(Math.round(pct)))

    setUploading(false)
    setProgress(0)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={(e) => {
        if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) setDragging(false)
      }}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        const file = e.dataTransfer.files?.[0]
        if (file) handleFile(file)
      }}
      className={`border border-dashed transition-colors ${dragging ? 'border-blaze bg-blaze/5' : 'border-neutral-300 bg-white'}`}
    >
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full h-full min-h-40 flex flex-col items-center justify-center gap-2 px-3 text-center transition-colors hover:bg-neutral-50 disabled:cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-inset group"
      >
        {uploading ? (
          <>
            <Loader2 className="w-5 h-5 text-blaze animate-spin" aria-hidden="true" />
            <div
              className="w-24 h-1.5 bg-neutral-200 overflow-hidden"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Uploading photo"
            >
              <div className="h-full bg-blaze transition-all" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-neutral-600 tabular-nums">{progress}% uploaded</span>
          </>
        ) : (
          <>
            <Upload className="w-5 h-5 text-neutral-400 group-hover:text-neutral-600 transition-colors" aria-hidden="true" />
            <span className="text-neutral-700">Add a photo</span>
            <span className="text-neutral-500">Drop one here, up to {MAX_SIZE_MB}MB</span>
          </>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) handleFile(f)
        }}
      />
    </div>
  )
}

export default function GalleryClient({ photos: initialPhotos }: { photos: PhotoGalleryImage[] }) {
  const [photos, setPhotos] = useState(initialPhotos)
  const [error, setError] = useState<string | null>(null)
  const { play: savedSE } = useSoundEffect('/mp3/se-1.mp3', true)

  async function handleUpload(file: File, onProgress: (pct: number) => void) {
    setError(null)

    const imageUrl = await uploadFileToFirebase(file, onProgress, 'image').catch(() => null)

    if (!imageUrl) {
      setError('That photo could not be uploaded. Check your connection and try again.')
      return
    }

    const result = await createGalleryPhoto({ imageUrl, imageFilename: file.name })

    if (!result.success || !result.data) {
      setError(result.error ?? 'The photo uploaded but could not be saved. Please try again.')
      return
    }

    savedSE()
    setPhotos((prev) => [result.data!, ...prev])
  }

  function handleDeleted(id: string) {
    setPhotos((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="flex flex-col h-full min-h-125 bg-neutral-200 text-sm">
      <div className="shrink-0 bg-white border-b border-neutral-300">
        <div className="px-6 py-4">
          <h1 className="text-lg font-semibold text-neutral-900">Gallery</h1>
          <p className="text-neutral-600 mt-0.5">
            {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
          </p>
        </div>

        <p className="flex items-start gap-2 px-6 py-2.5 border-t border-neutral-200 bg-neutral-50 text-neutral-600 leading-relaxed">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-neutral-400" aria-hidden="true" />
          <span>
            Photos added here show on the public Media page straight away. The images on the home page are separate, so email
            Sqysh to change those.
          </span>
        </p>

        {error && (
          <p
            role="alert"
            className="flex items-start gap-2 px-6 py-2.5 border-t border-red-200 bg-red-50 text-red-800 leading-relaxed"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" aria-hidden="true" />
            <span>{error}</span>
          </p>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-4 760:p-6">
        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 760:gap-4">
          <UploadZone onUpload={handleUpload} onError={setError} />

          <AnimatePresence>
            {photos.map((photo, i) => (
              <PhotoCard key={photo.id} photo={photo} index={i} onDeleted={handleDeleted} onError={setError} />
            ))}
          </AnimatePresence>
        </motion.div>

        {photos.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <Img className="w-8 h-8 text-neutral-300" aria-hidden="true" />
            <p className="text-neutral-600">No photos yet. Add the first one above.</p>
          </div>
        )}
      </div>
    </div>
  )
}
