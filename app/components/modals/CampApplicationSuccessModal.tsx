'use client'

import { setCloseCampApplicationSuccessModal } from '@/app/redux/features/uiSlice'
import { store, useUiSelector } from '@/app/redux/store'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Music } from 'lucide-react'
import Link from 'next/link'

export default function CampApplicationSuccessModal() {
  const { campApplicationSuccessModal } = useUiSelector()
  const onClose = () => store.dispatch(setCloseCampApplicationSuccessModal())

  return (
    <AnimatePresence>
      {campApplicationSuccessModal && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="camp-success-heading"
          aria-describedby="camp-success-description"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0  bg-black/80 backdrop-blur-2xl flex items-center justify-center z-100 p-4 430:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 16 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md bg-black border border-white/10 overflow-hidden"
          >
            {/* Top accent */}
            <div className="h-px w-full bg-blaze" aria-hidden="true" />

            <div className="p-6 430:p-8">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 400, damping: 20 }}
                className="w-12 h-12 mx-auto mb-6 border border-blaze/30 bg-blaze/10 flex items-center justify-center"
                aria-hidden="true"
              >
                <CheckCircle className="w-6 h-6 text-blaze-text" />
              </motion.div>

              {/* Heading */}
              <div className="text-center mb-6">
                <p
                  className="font-changa text-[11px] uppercase tracking-[0.3em] text-blaze-text mb-2"
                  aria-hidden="true"
                >
                  Youth Music Camp
                </p>
                <h2
                  id="camp-success-heading"
                  className="font-changa text-2xl 430:text-3xl text-white leading-none mb-3"
                >
                  Application Submitted
                </h2>
                <p id="camp-success-description" className="font-lato text-white/80 text-sm leading-relaxed">
                  Thank you for applying to the Pops Orchestra Youth Music Camp. We&apos;ve received your application
                  and will be in touch soon.
                </p>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-white/10 mb-6" aria-hidden="true" />

              {/* What's next */}
              <div className="flex items-start gap-3 mb-6">
                <div
                  className="w-8 h-8 border border-blaze/30 bg-blaze/5 flex items-center justify-center shrink-0"
                  aria-hidden="true"
                >
                  <Music className="w-3.5 h-3.5 text-blaze-text" />
                </div>
                <div>
                  <p className="font-changa text-white text-sm mb-0.5">What happens next?</p>
                  <p className="font-lato text-white/70 text-xs leading-relaxed">
                    Our team will review your application and reach out to the email address provided.
                  </p>
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/"
                onClick={onClose}
                autoFocus
                aria-label="Application submitted successfully — return to home page"
                className="flex items-center justify-center w-full py-3 bg-blaze hover:bg-blazehover text-white font-changa uppercase tracking-widest text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
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
