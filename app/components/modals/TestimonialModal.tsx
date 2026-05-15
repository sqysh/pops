'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageSquare, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Testimonial } from '@prisma/client'
import { store } from '@/app/redux/store'
import { showToast } from '@/app/redux/features/toastSlice'
import { createTestimonial } from '@/app/lib/actions/testimonial/createTestimonial'
import { updateTestimonial } from '@/app/lib/actions/testimonial/updateTestimonial'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  testimonial?: Testimonial | null
  onClose: () => void
}

interface FormState {
  quote: string
  author: string
  title: string
  isPublished: boolean
}

// ─── Field ────────────────────────────────────────────────────────────────────

function FieldLabel({
  htmlFor,
  children,
  required
}: {
  htmlFor?: string
  children: React.ReactNode
  required?: boolean
}) {
  return (
    <label htmlFor={htmlFor} className="block text-[10px] font-mono tracking-[0.25em] uppercase text-muted-dark mb-1.5">
      {children}
      {required && <span className="text-primary-dark ml-1">*</span>}
    </label>
  )
}

const inputCls =
  'w-full px-3 py-2.5 bg-bg-dark border border-border-dark text-text-dark text-sm placeholder:text-muted-dark/60 focus:outline-none focus:border-primary-dark transition-colors'

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function TestimonialModal({ testimonial, onClose }: Props) {
  const router = useRouter()
  const isEditing = !!testimonial

  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<FormState>({
    quote: testimonial?.quote ?? '',
    author: testimonial?.author ?? '',
    title: testimonial?.title ?? '',
    isPublished: testimonial?.isPublished ?? false
  })

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    if (!form.quote.trim()) {
      store.dispatch(showToast({ type: 'error', message: 'Quote is required' }))
      return
    }
    if (!form.author.trim()) {
      store.dispatch(showToast({ type: 'error', message: 'Author is required' }))
      return
    }

    setLoading(true)

    const res = isEditing && testimonial ? await updateTestimonial(testimonial.id, form) : await createTestimonial(form)

    setLoading(false)

    if (res.success) {
      store.dispatch(
        showToast({
          type: 'success',
          message: isEditing ? 'Testimonial updated' : 'Testimonial created'
        })
      )
      router.refresh()
      onClose()
    } else {
      store.dispatch(showToast({ type: 'error', message: res.error ?? 'Something went wrong' }))
    }
  }

  return (
    <AnimatePresence>
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          aria-hidden="true"
        />

        {/* Drawer */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%', transition: { type: 'tween', duration: 0.25, ease: 'easeIn' } }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="fixed inset-x-0 bottom-0 z-50 bg-surface-dark border-t border-border-dark sm:inset-auto sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-md sm:border sm:border-border-dark flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label={isEditing ? 'Edit testimonial' : 'Add testimonial'}
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-10 h-1 bg-border-dark" aria-hidden="true" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-dark shrink-0">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary-dark" aria-hidden="true" />
              <h2 className="font-quicksand font-black text-text-dark text-base leading-none">
                {isEditing ? 'Edit Testimonial' : 'Add Testimonial'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-muted-dark hover:text-text-dark transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Fields */}
          <div className="px-4 py-4 space-y-4 overflow-y-auto flex-1">
            {/* Quote */}
            <div>
              <FieldLabel htmlFor="quote" required>
                Quote
              </FieldLabel>
              <textarea
                id="quote"
                value={form.quote}
                onChange={(e) => set('quote', e.target.value)}
                placeholder="An unforgettable evening of music..."
                rows={4}
                className={`${inputCls} resize-none`}
              />
            </div>

            {/* Author */}
            <div>
              <FieldLabel htmlFor="author" required>
                Author
              </FieldLabel>
              <input
                id="author"
                type="text"
                value={form.author}
                onChange={(e) => set('author', e.target.value)}
                placeholder="Jane Smith"
                className={inputCls}
              />
            </div>

            {/* Title */}
            <div>
              <FieldLabel htmlFor="title">Title / Description</FieldLabel>
              <input
                id="title"
                type="text"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="Season Ticket Holder"
                className={inputCls}
              />
            </div>

            {/*  Published */}

            <div className="flex flex-col">
              <div className="flex items-center justify-between px-3 py-2.5 border border-border-dark bg-bg-dark h-10.5">
                <span className="text-text-dark text-sm">Published</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.isPublished}
                  onClick={() => set('isPublished', !form.isPublished)}
                  className={`relative w-9 h-4 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark ${
                    form.isPublished ? 'bg-primary-dark' : 'bg-border-dark'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-3 h-3 bg-white transition-all duration-200 ${
                      form.isPublished ? 'left-5' : 'left-0.5'
                    }`}
                  />
                  <span className="sr-only">{form.isPublished ? 'Published' : 'Draft'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 px-4 py-3 border-t border-border-dark shrink-0">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-border-dark text-muted-dark hover:text-text-dark text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 py-2.5 bg-primary-dark hover:bg-secondary-light text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
              {loading ? 'Saving...' : isEditing ? 'Update' : 'Add Testimonial'}
            </button>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  )
}
