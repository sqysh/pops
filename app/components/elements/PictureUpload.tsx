'use client'

import { useRef, useCallback } from 'react'
import { Upload, X } from 'lucide-react'
import Picture from '../common/Picture'

interface Props {
  file: File | null
  preview: string | null
  uploading: boolean
  uploadProgress: number
  onFileChange: (file: File, preview: string) => void
  onRemove: () => void
  label?: string
  accept?: string
}

export function PictureUpload({
  file,
  preview,
  uploading,
  uploadProgress,
  onFileChange,
  onRemove,
  label = 'Image',
  accept = 'image/*'
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    onFileChange(f, URL.createObjectURL(f))
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const f = e.dataTransfer.files?.[0]
      if (!f) return
      onFileChange(f, URL.createObjectURL(f))
    },
    [onFileChange]
  )

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[9px] font-mono uppercase tracking-widest text-muted-dark/80">{label}</span>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileRef.current?.click()}
        className="relative border border-dashed border-border-dark hover:border-muted-dark/40 transition-colors cursor-pointer bg-surface-dark flex flex-col items-center justify-center gap-2 h-28 group"
      >
        {preview ? (
          <>
            <Picture priority src={preview} alt={label} width={80} height={80} className="object-contain max-h-20" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onRemove()
              }}
              className="absolute top-1.5 right-1.5 text-muted-dark/70 hover:text-red-400 transition-colors"
              aria-label={`Remove ${label}`}
            >
              <X className="w-3 h-3" />
            </button>
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 text-muted-dark/60 group-hover:text-muted-dark/80 transition-colors" />
            <span className="text-[9px] font-mono uppercase tracking-widest text-muted-dark/60 group-hover:text-muted-dark/80 transition-colors">
              Drop or click to upload {label.toLowerCase()}
            </span>
          </>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-bg-dark/80 flex flex-col items-center justify-center gap-2">
            <div className="w-3/4 h-px bg-border-dark relative overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-primary-dark transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <span className="text-[9px] font-mono text-primary-dark tabular-nums">{uploadProgress}%</span>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept={accept}
          onChange={handleFile}
          className="sr-only"
          aria-label={`Upload ${label}`}
        />
      </div>
      {file && <span className="text-[9px] font-mono text-muted-dark/70 truncate">{file.name}</span>}
    </div>
  )
}
