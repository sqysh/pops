'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Wrench } from 'lucide-react'
import type { CustomRequest, CustomRequestStatus } from '@prisma/client'

interface Props {
  request: CustomRequest | null
  onClose: () => void
}

const STATUS_STYLES: Record<CustomRequestStatus, string> = {
  PENDING: 'text-primary-dark border-primary-dark/30 bg-primary-dark/10',
  IN_PROGRESS: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
  COMPLETE: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
  DECLINED: 'text-muted-dark border-border-dark bg-surface-dark'
}

const URGENCY_LABELS: Record<string, string> = {
  whenever: 'Whenever you get to it',
  soon: 'Within the next few weeks',
  urgent: 'As soon as possible'
}

const URGENCY_COLORS: Record<string, string> = {
  whenever: 'text-emerald-400',
  soon: 'text-yellow-400',
  urgent: 'text-primary-dark'
}

export default function CustomRequestDetailModal({ request, onClose }: Props) {
  return (
    <AnimatePresence>
      {request && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            aria-hidden="true"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%', transition: { type: 'tween', duration: 0.25, ease: 'easeIn' } }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-surface-dark border-t border-border-dark max-h-[85vh] flex flex-col sm:inset-auto sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg sm:border sm:border-border-dark"
            role="dialog"
            aria-modal="true"
            aria-label="Custom request details"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-10 h-1 bg-border-dark" aria-hidden="true" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-dark shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <Wrench className="w-4 h-4 text-primary-dark shrink-0" aria-hidden="true" />
                <h2 className="font-quicksand font-black text-text-dark text-base leading-none truncate">
                  {request.page} — {request.changeType}
                </h2>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <span
                  className={`text-[10px] font-mono tracking-widest uppercase px-2 py-1 border ${STATUS_STYLES[request.status]}`}
                >
                  {request.status.replace('_', ' ')}
                </span>
                <button
                  onClick={onClose}
                  className="text-muted-dark hover:text-text-dark transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {/* Meta */}
              <div className="border border-border-dark divide-y divide-border-dark">
                {[
                  ['Type', request.changeType, ''],
                  ['Page', request.page, ''],
                  ['Urgency', URGENCY_LABELS[request.urgency] ?? request.urgency, URGENCY_COLORS[request.urgency]],
                  ['Submitted By', request.submittedBy, ''],
                  [
                    'Date',
                    new Date(request.submittedAt).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }),
                    ''
                  ]
                ].map(([label, value, color]) => (
                  <div key={label} className="flex gap-4 px-3 py-2.5">
                    <span className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-dark w-24 shrink-0 mt-0.5">
                      {label}
                    </span>
                    <span className={`text-sm ${color || 'text-text-dark'}`}>{value}</span>
                  </div>
                ))}
              </div>

              {/* What */}
              <div>
                <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-dark mb-2">What</p>
                <p className="text-text-dark text-sm leading-relaxed border-l-2 border-primary-dark pl-3">
                  {request.what}
                </p>
              </div>

              {/* Why */}
              <div>
                <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-dark mb-2">Why</p>
                <p className="text-text-dark text-sm leading-relaxed border-l-2 border-border-dark pl-3">
                  {request.why}
                </p>
              </div>

              {/* Example */}
              {request.example && (
                <div>
                  <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-dark mb-2">
                    Example / Reference
                  </p>
                  <p className="text-muted-dark text-sm leading-relaxed border-l-2 border-border-dark pl-3">
                    {request.example}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="shrink-0 px-4 py-3 border-t border-border-dark">
              <button
                onClick={onClose}
                className="w-full py-2.5 border border-border-dark text-muted-dark hover:text-text-dark text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark"
              >
                Close
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
