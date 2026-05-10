'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Trash2, Loader2 } from 'lucide-react'

interface Props {
  label?: string
  name: string
  onConfirm: () => Promise<void>
}

export function DangerZone({ label = 'Delete', name, onConfirm }: Props) {
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleConfirm() {
    setDeleting(true)
    await onConfirm()
    setDeleting(false)
    setConfirming(false)
  }

  return (
    <div className="flex flex-col gap-2 pt-3 border-t border-red-500/20">
      <span className="text-[7px] font-mono uppercase tracking-widest text-red-500/50">Danger Zone</span>

      <AnimatePresence mode="wait">
        {!confirming ? (
          <motion.button
            key="trigger"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            type="button"
            onClick={() => setConfirming(true)}
            disabled={deleting}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-red-500/30 bg-red-500/5 text-[8px] font-mono uppercase tracking-widest text-red-400 hover:bg-red-500/10 hover:border-red-500/50 transition-colors disabled:opacity-40 focus-visible:outline-none"
          >
            <Trash2 className="w-3 h-3" />
            {label}
          </motion.button>
        ) : (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-2 border border-red-500/30 bg-red-500/5 px-3 py-3"
          >
            <p className="text-[9px] font-mono text-red-400">
              Delete <span className="text-text-dark">{name}</span>? This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleConfirm}
                disabled={deleting}
                className="flex-1 flex items-center justify-center gap-2 py-1.5 border border-red-500/40 text-[8px] font-mono uppercase tracking-widest text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40 focus-visible:outline-none"
              >
                {deleting && <Loader2 className="w-2.5 h-2.5 animate-spin" />}
                {deleting ? 'Deleting...' : 'Confirm'}
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                disabled={deleting}
                className="px-4 py-1.5 border border-border-dark text-[8px] font-mono uppercase tracking-widest text-muted-dark/50 hover:text-text-dark hover:border-muted-dark/30 transition-colors disabled:opacity-40 focus-visible:outline-none"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
