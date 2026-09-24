'use client'

import { useEffect, useId, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  label: string
  width?: string
  children: React.ReactNode
}

export function DrawerShell({ open, onClose, label, width = 'w-[28rem]', children }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const headingId = useId()

  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)

    // keep the page behind from scrolling under the drawer
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // move focus into the dialog so the keyboard is not left behind it
    panelRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-neutral-900/40"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25, ease: 'easeInOut' }}
            className={`fixed right-0 top-0 h-full z-50 max-w-full ${width} bg-white border-l border-neutral-200 shadow-xl flex flex-col focus:outline-none`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={headingId}
          >
            <div className="shrink-0 flex items-center justify-between gap-3 px-4 h-14 border-b border-neutral-200">
              <h2 id={headingId} className="text-base font-semibold text-neutral-900 truncate">
                {label}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 p-2 -mr-2 rounded text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
                aria-label="Close"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
