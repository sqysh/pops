'use client'

import { setCloseContactSubmissionSuccessModal } from '@/app/redux/features/uiSlice'
import { store, useUiSelector } from '@/app/redux/store'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useEffect } from 'react'

export default function ContactSubmissionSuccessModal() {
  const { contactSubmissionModal } = useUiSelector()
  const onClose = () => store.dispatch(setCloseContactSubmissionSuccessModal())

  useEffect(() => {
    if (!contactSubmissionModal) return

    const previouslyFocused = document.activeElement as HTMLElement

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
      previouslyFocused?.focus()
    }
  }, [contactSubmissionModal])

  return (
    <AnimatePresence>
      {contactSubmissionModal && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="success-modal-heading"
          aria-describedby="success-modal-description"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 backdrop-blur-2xl bg-black/80 flex items-center justify-center z-100 p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="w-full max-w-md bg-neutral-900 border border-neutral-800 overflow-hidden"
          >
            <div
              className="h-1.5 w-full"
              style={{ background: 'linear-gradient(90deg, #da0032, #ff9000)' }}
              aria-hidden="true"
            />

            <div className="p-8 text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sunburst mb-1" aria-hidden="true">
                The Pops Orchestra
              </p>
              <h2 id="success-modal-heading" className="text-2xl font-black text-white mb-2">
                Question Submitted!
              </h2>
              <p id="success-modal-description" className="text-neutral-400 text-sm leading-relaxed mb-8">
                Thank you for reaching out! We&apos;ve received your message and will get back to you shortly.
              </p>

              <Link
                href="/"
                onClick={onClose}
                autoFocus
                aria-label="Question submitted successfully — return to home page"
                className="block w-full py-3 text-sm font-bold text-white text-center transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
                style={{ background: 'linear-gradient(90deg, #da0032, #ff9000)' }}
              >
                Return to Home
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
