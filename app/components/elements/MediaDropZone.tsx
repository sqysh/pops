import { Play, Upload, X } from 'lucide-react'
import { useCallback, useRef } from 'react'
import Picture from '../common/Picture'

export function MediaDropZone({
  label,
  accept,
  file,
  preview,
  uploading,
  uploadProgress,
  onFileChange,
  onRemove,
  isVideo
}: {
  label: string
  accept: string
  file: File | null
  preview: string | null
  uploading: boolean
  uploadProgress: number
  onFileChange: (f: File, preview: string) => void
  onRemove: () => void
  isVideo?: boolean
}) {
  const fileRef = useRef<HTMLInputElement>(null)

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
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => !preview && fileRef.current?.click()}
        className={`relative border border-dashed border-border-dark bg-surface-dark flex flex-col items-center justify-center gap-2 overflow-hidden ${preview ? 'cursor-default' : 'hover:border-muted-dark/40 cursor-pointer'} group`}
        style={{ height: isVideo ? 120 : 160 }}
      >
        {preview ? (
          <>
            {isVideo ? (
              <div className="w-full h-full flex items-center justify-center bg-black">
                <Play className="w-6 h-6 text-muted-dark/70" />
                <span className="text-[9px] font-mono text-muted-dark/70 ml-2 truncate max-w-32">
                  {file?.name ?? 'video uploaded'}
                </span>
              </div>
            ) : (
              <Picture
                src={preview}
                alt="Preview"
                width={240}
                height={160}
                className="object-cover w-full h-full"
                priority
              />
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onRemove()
              }}
              className="absolute top-1.5 right-1.5 text-muted-dark/70 hover:text-red-400 transition-colors bg-bg-dark/80 p-0.5"
              aria-label={`Remove ${label}`}
            >
              <X className="w-3 h-3" />
            </button>
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 text-muted-dark/60 group-hover:text-muted-dark/80 transition-colors" />
            <span className="text-[9px] font-mono uppercase tracking-widest text-muted-dark/60 group-hover:text-muted-dark/80 transition-colors">
              Drop or click to upload {label}
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
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (!f) return
            onFileChange(f, URL.createObjectURL(f))
          }}
          className="sr-only"
          aria-label={`Upload ${label}`}
        />
      </div>
      {file && <span className="text-[8px] font-mono text-muted-dark/70 truncate">{file.name}</span>}
    </div>
  )
}
