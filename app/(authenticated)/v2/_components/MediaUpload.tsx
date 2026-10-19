'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ImagePlus, Upload, X } from 'lucide-react'
import { LABEL } from './FormField'
import Picture from '@/components/common/Picture'

type MediaKind = 'image' | 'video'

interface Props {
  file: File | null
  preview: string | null
  uploading: boolean
  uploadProgress: number
  onFileChange: (file: File, preview: string) => void
  onRemove: () => void
  kind?: MediaKind
  label?: string
  maxSizeMb?: number
}

const DEFAULTS: Record<MediaKind, { label: string; maxSizeMb: number }> = {
  image: { label: 'Image', maxSizeMb: 5 },
  video: { label: 'Video', maxSizeMb: 50 }
}

export function MediaUpload({
  file,
  preview,
  uploading,
  uploadProgress,
  onFileChange,
  onRemove,
  kind = 'image',
  label,
  maxSizeMb
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const objectUrlRef = useRef<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const heading = label ?? DEFAULTS[kind].label
  const limitMb = maxSizeMb ?? DEFAULTS[kind].maxSizeMb
  const noun = heading.toLowerCase()
  const accept = `${kind}/*`

  // every createObjectURL needs a matching revoke or the blob is held for the
  // life of the document
  const releaseObjectUrl = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
  }

  useEffect(() => releaseObjectUrl, [])

  const acceptFile = useCallback(
    (f: File) => {
      if (!f.type.startsWith(`${kind}/`)) {
        setError(`That file is not ${kind === 'image' ? 'an image' : 'a video'}.`)
        return
      }

      if (f.size > limitMb * 1024 * 1024) {
        setError(`That file is larger than ${limitMb}MB. Please choose a smaller one.`)
        return
      }

      setError(null)
      releaseObjectUrl()

      const url = URL.createObjectURL(f)
      objectUrlRef.current = url
      onFileChange(f, url)
    },
    [kind, limitMb, onFileChange]
  )

  const openPicker = () => fileRef.current?.click()

  function handleRemove() {
    releaseObjectUrl()
    setError(null)
    onRemove()
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className={LABEL}>{heading}</span>

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
          const f = e.dataTransfer.files?.[0]
          if (f) acceptFile(f)
        }}
        className={`relative border border-dashed transition-colors ${
          dragging ? 'border-blaze bg-blaze/5' : error ? 'border-red-300 bg-red-50/40' : 'border-neutral-300 bg-neutral-50'
        }`}
      >
        {preview ? (
          // once there is a preview the area is no longer one big button, so
          // Replace and Remove can be real buttons rather than nested ones
          <div className="flex flex-col">
            {/* big enough to tell at a glance whether it is the right one */}
            <div className="flex items-center justify-center p-3 bg-white">
              {kind === 'video' ? (
                <video
                  src={preview}
                  controls
                  muted
                  playsInline
                  preload="metadata"
                  className="w-auto h-auto max-w-full max-h-60 bg-black"
                />
              ) : (
                <Picture
                  src={preview}
                  alt=""
                  width={640}
                  height={360}
                  className="object-contain w-auto h-auto max-w-full max-h-60"
                />
              )}
            </div>

            <div className="flex items-center justify-between gap-3 px-3 py-2.5 border-t border-neutral-200 bg-neutral-50">
              <span className="truncate text-neutral-600 min-w-0">{file?.name ?? `Current ${noun}`}</span>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={openPicker}
                  disabled={uploading}
                  className="h-9 px-3 border border-neutral-300 bg-white font-medium text-neutral-700 hover:bg-neutral-100 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={uploading}
                  className="inline-flex items-center gap-1.5 h-9 px-3 border border-neutral-300 bg-white font-medium text-neutral-700 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={openPicker}
            disabled={uploading}
            className="w-full flex flex-col items-center justify-center gap-2 h-32 px-4 text-center transition-colors hover:bg-neutral-100 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-inset group"
          >
            {dragging ? (
              <ImagePlus className="w-6 h-6 text-blaze" aria-hidden="true" />
            ) : (
              <Upload className="w-6 h-6 text-neutral-400 group-hover:text-neutral-600 transition-colors" aria-hidden="true" />
            )}

            <span className="text-neutral-700">
              {dragging ? `Drop the ${noun} here` : `Drop your ${noun} here, or click to choose one`}
            </span>
            <span className="text-neutral-500">Up to {limitMb}MB</span>
          </button>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center gap-2 px-6 z-10">
            <div
              className="w-full max-w-60 h-1.5 bg-neutral-200 overflow-hidden"
              role="progressbar"
              aria-valuenow={uploadProgress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Uploading ${noun}`}
            >
              <div className="h-full bg-blaze transition-all" style={{ width: `${uploadProgress}%` }} />
            </div>
            <span className="text-neutral-700 tabular-nums">{uploadProgress}% uploaded</span>
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept={accept}
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) acceptFile(f)
          }}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
        />
      </div>

      {error && (
        <p role="alert" className="text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}
