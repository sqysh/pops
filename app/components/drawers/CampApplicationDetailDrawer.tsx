import { deleteCampApplication } from '@/app/lib/actions/camp-applications/deleteCampApplication'
import { CampApplicationWithRelations } from '@/app/types/entities/camp-application'
import { AnimatePresence, motion } from 'framer-motion'
import { GraduationCap, Mail, MapPin, Music, Phone, User, X } from 'lucide-react'
import { useState } from 'react'
import { DeleteConfirm } from '../elements/DeleteConfirmt'

export function CampApplicationDetailDrawer({
  application,
  onClose,
  onDelete
}: {
  application: CampApplicationWithRelations | null
  onClose: () => void
  onDelete: (id: string) => void
}) {
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const open = application !== null

  async function handleDelete() {
    if (!application) return
    setDeleting(true)
    const result = await deleteCampApplication(application.id)
    if (result.success) {
      onDelete(application.id)
      onClose()
    } else {
      setDeleting(false)
      setConfirming(false)
    }
  }

  const s = application?.Student
  const p = application?.Parent
  const a = application?.Address

  return (
    <AnimatePresence>
      {open && application && (
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
            className="fixed right-0 top-0 h-full z-50 w-lg bg-bg-dark border-l border-border-dark flex flex-col"
            role="dialog"
            aria-modal="true"
          >
            {/* Drawer header */}
            <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-border-dark">
              <span className="text-[9px] font-mono text-muted-dark/40 uppercase tracking-widest">[ APPLICATION ]</span>
              <button
                onClick={onClose}
                className="text-muted-dark/40 hover:text-text-dark transition-colors focus-visible:outline-none"
                aria-label="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="px-4 py-4 flex flex-col gap-5">
                {/* Submitted + instrument */}
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-[7px] font-mono uppercase tracking-widest text-muted-dark/50">Submitted</span>
                    <span className="text-[10px] font-mono text-text-dark tabular-nums">
                      {new Date(application.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="text-[9px] font-mono text-muted-dark/40 tabular-nums">
                      {new Date(application.createdAt).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[7px] font-mono uppercase tracking-widest text-muted-dark/50">
                      Instrument
                    </span>
                    <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-1 border text-violet-400 border-violet-400/30 bg-violet-400/5">
                      {application.instrument || '—'}
                    </span>
                  </div>
                </div>

                {/* Student */}
                {s && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-3 h-3 text-muted-dark/40" />
                      <span className="text-[7px] font-mono uppercase tracking-widest text-muted-dark/50">Student</span>
                    </div>
                    <div className="bg-surface-dark border border-border-dark px-3 py-3 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-text-dark font-bold">
                          {s.firstName} {s.lastName}
                        </span>
                        <span className="text-[8px] font-mono text-muted-dark/50">Grade {s.grade}</span>
                      </div>
                      <span className="text-[9px] font-mono text-muted-dark/60">{s.school}</span>
                      <div className="flex flex-col gap-1 pt-1 border-t border-border-dark/40">
                        <div className="flex items-center gap-2">
                          <Mail className="w-2.5 h-2.5 text-muted-dark/30 shrink-0" />
                          <a
                            href={`mailto:${s.studentEmailAddress}`}
                            className="text-[9px] font-mono text-primary-dark hover:text-blaze-text transition-colors truncate"
                          >
                            {s.studentEmailAddress}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-2.5 h-2.5 text-muted-dark/30 shrink-0" />
                          <a
                            href={`tel:${s.studentPhoneNumber}`}
                            className="text-[9px] font-mono text-muted-dark/60 hover:text-text-dark transition-colors"
                          >
                            {s.studentPhoneNumber}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Parent */}
                {p && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3 text-muted-dark/40" />
                      <span className="text-[7px] font-mono uppercase tracking-widest text-muted-dark/50">
                        Parent / Guardian
                      </span>
                    </div>
                    <div className="bg-surface-dark border border-border-dark px-3 py-3 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-text-dark font-bold">
                          {p.firstName} {p.lastName}
                        </span>
                        {p.relationshipToStudent && (
                          <span className="text-[8px] font-mono text-muted-dark/50 uppercase tracking-widest">
                            {p.relationshipToStudent}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1 pt-1 border-t border-border-dark/40">
                        <div className="flex items-center gap-2">
                          <Mail className="w-2.5 h-2.5 text-muted-dark/30 shrink-0" />
                          <a
                            href={`mailto:${p.parentEmailAddress}`}
                            className="text-[9px] font-mono text-primary-dark hover:text-blaze-text transition-colors truncate"
                          >
                            {p.parentEmailAddress}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-2.5 h-2.5 text-muted-dark/30 shrink-0" />
                          <a
                            href={`tel:${p.parentPhoneNumber}`}
                            className="text-[9px] font-mono text-muted-dark/60 hover:text-text-dark transition-colors"
                          >
                            {p.parentPhoneNumber}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Address */}
                {a && (a.addressLine1 || a.city) && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-muted-dark/40" />
                      <span className="text-[7px] font-mono uppercase tracking-widest text-muted-dark/50">Address</span>
                    </div>
                    <div className="bg-surface-dark border border-border-dark px-3 py-3">
                      <p className="text-[9px] font-mono text-muted-dark/60 leading-relaxed">
                        {[a.addressLine1, a.addressLine2, a.city, a.state, a.zipPostalCode].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </div>
                )}

                {/* Music details */}
                {(application.musicTeacher || application.referralSource) && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Music className="w-3 h-3 text-muted-dark/40" />
                      <span className="text-[7px] font-mono uppercase tracking-widest text-muted-dark/50">
                        Music Info
                      </span>
                    </div>
                    <div className="bg-surface-dark border border-border-dark px-3 py-3 flex flex-col gap-2">
                      {application.musicTeacher && (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[7px] font-mono uppercase tracking-widest text-muted-dark/40">
                            Music Teacher
                          </span>
                          <span className="text-[9px] font-mono text-text-dark/80">{application.musicTeacher}</span>
                        </div>
                      )}
                      {application.referralSource && (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[7px] font-mono uppercase tracking-widest text-muted-dark/40">
                            Heard About Us
                          </span>
                          <span className="text-[9px] font-mono text-text-dark/80">{application.referralSource}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Danger zone */}
                <div className="flex items-center justify-between pt-2 border-t border-border-dark">
                  <span className="text-[7px] font-mono uppercase tracking-widest text-muted-dark/30">Danger Zone</span>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setConfirming(true)}
                      disabled={deleting}
                      className="text-[8px] font-mono uppercase tracking-widest text-muted-dark/30 hover:text-red-400 transition-colors disabled:opacity-40"
                    >
                      Delete Application
                    </button>
                    <AnimatePresence>
                      {confirming && (
                        <DeleteConfirm
                          name={s ? `${s.firstName} ${s.lastName}` : 'this application'}
                          onConfirm={handleDelete}
                          onCancel={() => setConfirming(false)}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="shrink-0 flex items-center justify-end px-4 py-3 border-t border-border-dark bg-surface-dark">
              <button
                type="button"
                onClick={onClose}
                className="text-[8px] font-mono uppercase tracking-widest px-3 py-1.5 border border-border-dark text-muted-dark/50 hover:text-text-dark hover:border-muted-dark/30 transition-colors"
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
