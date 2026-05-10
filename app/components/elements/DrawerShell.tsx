'use client'

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
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25, ease: 'easeInOut' }}
            className={`fixed right-0 top-0 h-full z-50 ${width} bg-bg-dark border-l border-border-dark flex flex-col`}
            role="dialog"
            aria-modal="true"
            aria-label={label}
          >
            <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-border-dark">
              <span className="text-[9px] font-mono text-muted-dark/40 uppercase tracking-widest">[ {label} ]</span>
              <button
                onClick={onClose}
                className="text-muted-dark/40 hover:text-text-dark transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark"
                aria-label="Close drawer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
