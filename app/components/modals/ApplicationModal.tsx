import { FullApplication } from '@/app/types/entities/camp-application'
import { AnimatePresence, motion } from 'framer-motion'
import { MapPin, Music, User, X } from 'lucide-react'

export function ApplicationModal({
  application,
  onClose
}: {
  application: FullApplication | null
  onClose: () => void
}) {
  return (
    <AnimatePresence>
      {application && (
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
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-10 h-1 bg-border-dark" aria-hidden="true" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-dark shrink-0">
              <div>
                <h2 className="font-quicksand font-black text-text-dark text-base leading-none">
                  {application.Student?.firstName} {application.Student?.lastName}
                </h2>
                <p className="text-[10px] font-mono text-muted-dark mt-0.5">
                  {new Date(application.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-muted-dark hover:text-text-dark transition-colors focus-visible:outline-none"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1 px-4 py-4 space-y-4">
              {/* Student */}
              {application.Student && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-3 h-3 text-primary-dark" aria-hidden="true" />
                    <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-dark">Student</span>
                  </div>
                  <div className="border border-border-dark divide-y divide-border-dark">
                    {[
                      ['Name', `${application.Student.firstName} ${application.Student.lastName}`],
                      ['Grade', application.Student.grade],
                      ['School', application.Student.school],
                      ['Email', application.Student.studentEmailAddress],
                      ['Phone', application.Student.studentPhoneNumber]
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center gap-3 px-3 py-2">
                        <span className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-dark w-16 shrink-0">
                          {label}
                        </span>
                        <span className="text-text-dark text-sm truncate">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Parent */}
              {application.Parent && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-3 h-3 text-primary-dark" aria-hidden="true" />
                    <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-dark">
                      Parent / Guardian
                    </span>
                  </div>
                  <div className="border border-border-dark divide-y divide-border-dark">
                    {[
                      ['Name', `${application.Parent.firstName} ${application.Parent.lastName}`],
                      ['Relationship', application.Parent.relationshipToStudent ?? '—'],
                      ['Email', application.Parent.parentEmailAddress],
                      ['Phone', application.Parent.parentPhoneNumber]
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center gap-3 px-3 py-2">
                        <span className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-dark w-24 shrink-0">
                          {label}
                        </span>
                        <span className="text-text-dark text-sm truncate">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Address */}
              {application.Address && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-3 h-3 text-primary-dark" aria-hidden="true" />
                    <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-dark">Address</span>
                  </div>
                  <div className="border border-border-dark px-3 py-2">
                    <p className="text-text-dark text-sm">
                      {application.Address.addressLine1}
                      {application.Address.addressLine2 && `, ${application.Address.addressLine2}`}
                    </p>
                    <p className="text-muted-dark text-sm mt-0.5">
                      {application.Address.city}, {application.Address.state} {application.Address.zipPostalCode}
                    </p>
                  </div>
                </div>
              )}

              {/* Music */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Music className="w-3 h-3 text-primary-dark" aria-hidden="true" />
                  <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-dark">Music</span>
                </div>
                <div className="border border-border-dark divide-y divide-border-dark">
                  {[
                    ['Instrument', application.instrument || '—'],
                    ['Teacher', application.musicTeacher ?? '—'],
                    ['Strings', application.strings ?? '—'],
                    ['Brass & Perc', application.brassAndPercussion ?? '—'],
                    ['Woodwinds', application.woodwinds ?? '—'],
                    ['Referral', application.referralSource ?? '—']
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center gap-3 px-3 py-2">
                      <span className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-dark w-24 shrink-0">
                        {label}
                      </span>
                      <span className="text-text-dark text-sm truncate">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-border-dark px-4 py-3">
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
