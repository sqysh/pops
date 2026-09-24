'use client'

import { Loader2 } from 'lucide-react'

interface Props {
  onCancel: () => void
  busy: boolean
  uploading?: boolean
  uploadProgress?: number
  saving?: boolean
  isEdit?: boolean
  submitLabel?: string
  editLabel?: string
}

export function DrawerFormFooter({
  onCancel,
  busy,
  uploading = false,
  uploadProgress = 0,
  saving = false,
  isEdit = false,
  submitLabel = 'Create',
  editLabel = 'Save changes'
}: Props) {
  const label = uploading ? `Uploading ${uploadProgress}%` : saving ? 'Saving...' : isEdit ? editLabel : submitLabel

  return (
    <div className="shrink-0 flex items-center justify-end gap-2 px-4 py-3 border-t border-neutral-200 bg-neutral-50">
      <button
        type="button"
        onClick={onCancel}
        disabled={busy}
        className="h-9 px-4 border border-neutral-300 bg-white font-medium text-neutral-700 hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={busy}
        aria-busy={busy}
        className="inline-flex items-center gap-2 h-9 px-4 bg-blaze hover:bg-blazehover text-white font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-offset-2"
      >
        {busy && <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />}
        {label}
      </button>
    </div>
  )
}
