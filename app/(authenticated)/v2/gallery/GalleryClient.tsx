'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Image as Img, Upload, Loader2, Trash2 } from 'lucide-react'
import Link from 'next/link'
import type { PhotoGalleryImage } from '@prisma/client'
import uploadFileToFirebase from '@/app/utils/firebase.upload'
import { createGalleryPhoto } from '@/app/lib/actions/photo-gallery-image/createGalleryPhoto'
import { deleteGalleryPhoto } from '@/app/lib/actions/super/deleteGalleryPhoto'
import Picture from '../../../components/common/Picture'
import { useRouter } from 'next/navigation'
import useSoundEffect from '@/app/lib/hooks/useSoundEffect'

function PhotoCard({ photo, onDeleted }: { photo: PhotoGalleryImage; onDeleted: (id: string) => void }) {
  const router = useRouter()
  const { play: deletedSE } = useSoundEffect('/mp3/se-2.mp3', true)
  const [confirming, setConfirming] = useState(false)

  async function handleDelete() {
    const result = await deleteGalleryPhoto(photo.id)
    if (result.success) {
      deletedSE()
      onDeleted(photo.id)
      router.refresh()
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative border border-border-dark overflow-hidden group bg-surface-dark flex flex-col"
    >
      {/* Image */}
      <Picture priority src={photo.imageUrl} alt={photo.imageFilename} className="w-full h-40 object-cover" />

      {/* Footer */}
      <div className="px-3 py-2 border-t border-border-dark flex items-center justify-between gap-2 shrink-0">
        <span className="text-[9px] font-mono text-muted-dark/70 truncate flex-1">
          {new Date(photo.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </span>
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setConfirming((v) => !v)}
            className="text-muted-dark/60 hover:text-red-400 transition-colors focus-visible:outline-none"
            aria-label={`Delete ${photo.imageFilename}`}
          >
            <Trash2 className="w-3 h-3" />
          </button>

          {/* Inline confirm — positioned above the button */}
          <AnimatePresence>
            {confirming && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="absolute bottom-full right-0 mb-1 z-20 bg-bg-dark border border-border-dark p-3 w-48 shadow-xl"
              >
                <p className="text-[10px] font-mono text-muted-dark mb-2 uppercase tracking-widest">
                  Delete this photo?
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex-1 py-1.5 border border-red-500/40 text-[9px] font-mono uppercase tracking-widest text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirming(false)}
                    className="px-3 py-1.5 border border-border-dark text-[9px] font-mono uppercase tracking-widest text-muted-dark/80 hover:text-text-dark transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

// ─── UploadZone ───────────────────────────────────────────────────────────────

function UploadZone({ onUpload }: { onUpload: (file: File) => Promise<void> }) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setUploading(true)
    setProgress(0)
    await onUpload(file)
    setUploading(false)
    setProgress(0)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border border-dashed border-border-dark hover:border-primary-dark transition-colors relative group h-40 flex flex-col items-center justify-center gap-2 cursor-pointer"
      onClick={() => inputRef.current?.click()}
    >
      {uploading ? (
        <>
          <Loader2 className="w-4 h-4 text-primary-dark animate-spin" />
          <span className="text-[9px] font-mono text-muted-dark tabular-nums">{Math.round(progress)}%</span>
          <div className="w-20 h-px bg-border-dark relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-primary-dark transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </>
      ) : (
        <>
          <Upload className="w-4 h-4 text-muted-dark/60 group-hover:text-primary-dark transition-colors" />
          <span className="text-[9px] font-mono uppercase tracking-widest text-muted-dark/60 group-hover:text-muted-dark/80 transition-colors">
            Upload Photo
          </span>
          <span className="text-[9px] font-mono text-muted-dark/20">or drag & drop</span>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        aria-label="Upload gallery photo"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) handleFile(f)
        }}
      />
    </div>
  )
}

// ─── GalleryClient ────────────────────────────────────────────────────────────

export default function GalleryClient({ photos: initialPhotos }: { photos: PhotoGalleryImage[] }) {
  const [photos, setPhotos] = useState(initialPhotos)
  const { play: savedSE } = useSoundEffect('/mp3/se-1.mp3', true)

  async function handleUpload(file: File) {
    const imageUrl = await uploadFileToFirebase(file, () => {}, 'image').catch(() => null)
    if (!imageUrl) return
    const result = await createGalleryPhoto({ imageUrl, imageFilename: file.name })
    if (result.success && result.data) {
      savedSE()
      setPhotos((prev) => [result.data!, ...prev])
    }
  }

  function handleDeleted(id: string) {
    setPhotos((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="flex flex-col h-screen bg-bg-dark overflow-hidden">
      {/* Header */}
      <div className="bg-black shrink-0 border-b border-border-dark">
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-3">
            <Link
              href="/v2/dashboard"
              className="text-[9px] font-mono uppercase tracking-widest text-muted-dark/70 hover:text-primary-dark transition-colors"
            >
              &larr; Dashboard
            </Link>
            <div className="w-px h-3 bg-border-dark" aria-hidden="true" />
            <span className="text-[10px] font-mono text-muted-dark/70 uppercase tracking-widest">[ GALLERY ]</span>
            <div className="w-px h-3 bg-border-dark" aria-hidden="true" />
            <span className="text-[10px] font-mono text-muted-dark">{photos.length} photos</span>
          </div>
        </div>

        {/* Notice marquee */}
        <div className="border-t border-yellow-500/20 bg-yellow-500/5 overflow-hidden py-1">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="flex whitespace-nowrap"
          >
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <span key={i} className="text-[9px] font-mono text-yellow-400/60 pr-12">
                <span className="text-yellow-400">●</span> Images uploaded here appear on the public Media page
                <span className="text-yellow-400/30 mx-3">·</span>
                Home hero images are managed separately — contact Sqysh to update them
                <span className="text-yellow-400/30 mx-3">·</span>
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4">
        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          <UploadZone onUpload={handleUpload} />
          <AnimatePresence>
            {photos.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} onDeleted={handleDeleted} />
            ))}
          </AnimatePresence>
        </motion.div>

        {photos.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 gap-2 mt-8">
            <Img className="w-8 h-8 text-border-dark" aria-hidden="true" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-dark/60">No photos yet</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="shrink-0 flex items-center justify-between px-4 py-2 border-t border-border-dark bg-surface-dark">
        <Link
          href="/v2/dashboard"
          className="text-[9px] font-mono uppercase tracking-widest text-muted-dark/70 hover:text-primary-dark transition-colors"
        >
          &larr; Dashboard
        </Link>
        <span className="text-[9px] font-mono uppercase tracking-widest text-muted-dark/60 tabular-nums">
          {photos.length} photo{photos.length !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  )
}
