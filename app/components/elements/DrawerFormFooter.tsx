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
  editLabel = 'Save Changes'
}: Props) {
  const label = uploading ? `Uploading ${uploadProgress}%` : saving ? 'Saving...' : isEdit ? editLabel : submitLabel

  return (
    <div className="shrink-0 flex items-center justify-between px-4 py-3 border-t border-border-dark bg-surface-dark">
      <button
        type="button"
        onClick={onCancel}
        disabled={busy}
        className="text-[8px] font-mono uppercase tracking-widest px-3 py-1.5 border border-border-dark text-muted-dark/50 hover:text-text-dark hover:border-muted-dark/30 transition-colors disabled:opacity-40"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={busy}
        className="text-[8px] font-mono uppercase tracking-widest px-4 py-1.5 border border-emerald-400/40 text-emerald-400 bg-emerald-400/5 hover:bg-emerald-400/10 transition-colors disabled:opacity-40 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400/50"
      >
        {busy && <Loader2 className="w-3 h-3 animate-spin" />}
        {label}
      </button>
    </div>
  )
}
