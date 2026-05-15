import { deleteCampApplication } from '@/app/lib/actions/camp-applications/deleteCampApplication'
import { CampApplicationWithRelations } from '@/app/types/entities/camp-application'
import { AnimatePresence, motion } from 'framer-motion'
import { GraduationCap, Loader2, Mail, MapPin, Music, Phone, User, X } from 'lucide-react'
import { DangerZone } from '../elements/DangerZone'
import { useState } from 'react'
import { updateCampApplicationStatus } from '@/app/lib/actions/camp-applications/updateCampApplicationStatus'
import { FormError } from '../elements/FormField'
import useSoundEffect from '@/app/lib/hooks/useSoundEffect'

export function CampApplicationDetailDrawer({
  application,
  onClose,
  onDelete,
  onStatusChanged
}: {
  application: CampApplicationWithRelations | null
  onClose: () => void
  onDelete: (id: string) => void
  onStatusChanged: (id: string, campStatus: string) => void
}) {
  const open = application !== null

  const [error, setError] = useState<string | null>(null)
  const { play: statusChangeSE } = useSoundEffect('/mp3/se-1.mp3', true)
  const { play: deleteSE } = useSoundEffect('/mp3/se-2.mp3', true)

  async function handleDelete() {
    if (!application) return

    const result = await deleteCampApplication(application.id)
    if (result.success) {
      deleteSE()
      onDelete(application.id)
      onClose()
    }
  }

  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  async function handleSetStatus(status: 'ADMITTED' | 'DENIED' | 'PENDING') {
    if (!application) return
    setUpdatingStatus(status)
    const result = await updateCampApplicationStatus(application.id, status)
    setUpdatingStatus(null)
    if (result.success) {
      statusChangeSE()
      onStatusChanged(application.id, status)
      onClose()
    } else {
      setError(result.error ?? 'Failed to update status.')
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
              <span className="text-[12px] font-mono text-muted-dark/70 uppercase tracking-widest">
                [ APPLICATION ]
              </span>
              <button
                onClick={onClose}
                className="text-muted-dark/70 hover:text-text-dark transition-colors focus-visible:outline-none"
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
                    <span className="text-[9px] font-mono uppercase tracking-widest text-muted-dark">Submitted</span>
                    <span className="text-[12px] font-mono text-text-dark tabular-nums">
                      {new Date(application.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="text-[12px] font-mono text-muted-dark/70 tabular-nums">
                      {new Date(application.createdAt).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-muted-dark">Instrument</span>
                    <span className="text-[12px] font-mono uppercase tracking-widest px-2 py-1 border text-violet-400 border-violet-400/30 bg-violet-400/5">
                      {application.instrument || '—'}
                    </span>
                  </div>
                </div>

                {/* Student */}
                {s && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-3 h-3 text-muted-dark/70" />
                      <span className="text-[9px] font-mono uppercase tracking-widest text-muted-dark">Student</span>
                    </div>
                    <div className="bg-surface-dark border border-border-dark px-3 py-3 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-mono text-text-dark font-bold">
                          {s.firstName} {s.lastName}
                        </span>
                        <span className="text-[10px] font-mono text-muted-dark">Grade {s.grade}</span>
                      </div>
                      <span className="text-[12px] font-mono text-muted-dark">{s.school}</span>
                      <div className="flex flex-col gap-1 pt-1 border-t border-border-dark/40">
                        <div className="flex items-center gap-2">
                          <Mail className="w-2.5 h-2.5 text-muted-dark/60 shrink-0" />
                          <a
                            href={`mailto:${s.studentEmailAddress}`}
                            className="text-[12px] font-mono text-primary-dark hover:text-blaze-text transition-colors truncate"
                          >
                            {s.studentEmailAddress}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-2.5 h-2.5 text-muted-dark/60 shrink-0" />
                          <a
                            href={`tel:${s.studentPhoneNumber}`}
                            className="text-[12px] font-mono text-muted-dark hover:text-text-dark transition-colors"
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
                      <User className="w-3 h-3 text-muted-dark/70" />
                      <span className="text-[9px] font-mono uppercase tracking-widest text-muted-dark">
                        Parent / Guardian
                      </span>
                    </div>
                    <div className="bg-surface-dark border border-border-dark px-3 py-3 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-mono text-text-dark font-bold">
                          {p.firstName} {p.lastName}
                        </span>
                        {p.relationshipToStudent && (
                          <span className="text-[10px] font-mono text-muted-dark uppercase tracking-widest">
                            {p.relationshipToStudent}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1 pt-1 border-t border-border-dark/40">
                        <div className="flex items-center gap-2">
                          <Mail className="w-2.5 h-2.5 text-muted-dark/60 shrink-0" />
                          <a
                            href={`mailto:${p.parentEmailAddress}`}
                            className="text-[12px] font-mono text-primary-dark hover:text-blaze-text transition-colors truncate"
                          >
                            {p.parentEmailAddress}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-2.5 h-2.5 text-muted-dark/60 shrink-0" />
                          <a
                            href={`tel:${p.parentPhoneNumber}`}
                            className="text-[12px] font-mono text-muted-dark hover:text-text-dark transition-colors"
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
                      <MapPin className="w-3 h-3 text-muted-dark/70" />
                      <span className="text-[9px] font-mono uppercase tracking-widest text-muted-dark">Address</span>
                    </div>
                    <div className="bg-surface-dark border border-border-dark px-3 py-3">
                      <p className="text-[12px] font-mono text-muted-dark leading-relaxed">
                        {[a.addressLine1, a.addressLine2, a.city, a.state, a.zipPostalCode].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </div>
                )}

                {/* Music details */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Music className="w-3 h-3 text-muted-dark/70" />
                    <span className="text-[9px] font-mono uppercase tracking-widest text-muted-dark">Music Info</span>
                  </div>
                  <div className="bg-surface-dark border border-border-dark px-3 py-3 flex flex-col gap-2.5">
                    {[
                      { label: 'Music Teacher', value: application.musicTeacher },
                      { label: 'Strings', value: application.strings },
                      { label: 'Brass & Percussion', value: application.brassAndPercussion },
                      { label: 'Woodwinds', value: application.woodwinds },
                      { label: 'Referral Source', value: application.referralSource }
                    ]
                      .filter(({ value }) => value)
                      .map(({ label, value }) => (
                        <div key={label} className="flex flex-col gap-0.5">
                          <span className="text-[9px] font-mono uppercase tracking-widest text-muted-dark/70">
                            {label}
                          </span>
                          <span className="text-[12px] font-mono text-text-dark">{value}</span>
                        </div>
                      ))}
                    {/* Consent */}
                    <div className="flex items-center justify-between pt-1 border-t border-border-dark/40">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-muted-dark/70">Consent</span>
                      <span
                        className={`text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 border ${
                          application.consent
                            ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5'
                            : 'text-red-400 border-red-400/30 bg-red-400/5'
                        }`}
                      >
                        {application.consent ? 'Agreed' : 'Not agreed'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Camp Decision */}
                <div className="flex flex-col gap-2 pt-2 border-t border-border-dark">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-muted-dark">Camp Decision</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleSetStatus('ADMITTED')}
                      disabled={!!updatingStatus || application.campStatus === 'ADMITTED'}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 border text-[9px] font-mono uppercase tracking-widest transition-colors disabled:opacity-40 ${
                        application.campStatus === 'ADMITTED'
                          ? 'border-emerald-400/60 text-emerald-400 bg-emerald-400/10'
                          : 'border-emerald-400/30 text-emerald-400/70 bg-emerald-400/5 hover:bg-emerald-400/10 hover:border-emerald-400/60'
                      }`}
                    >
                      {updatingStatus === 'ADMITTED' && <Loader2 className="w-3 h-3 animate-spin" />}✓ Admit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetStatus('DENIED')}
                      disabled={!!updatingStatus || application.campStatus === 'DENIED'}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 border text-[9px] font-mono uppercase tracking-widest transition-colors disabled:opacity-40 ${
                        application.campStatus === 'DENIED'
                          ? 'border-red-400/60 text-red-400 bg-red-400/10'
                          : 'border-red-400/30 text-red-400/70 bg-red-400/5 hover:bg-red-400/10 hover:border-red-400/60'
                      }`}
                    >
                      {updatingStatus === 'DENIED' && <Loader2 className="w-3 h-3 animate-spin" />}✗ Deny
                    </button>
                    {application.campStatus !== 'PENDING' && (
                      <button
                        type="button"
                        onClick={() => handleSetStatus('PENDING')}
                        disabled={!!updatingStatus}
                        className="px-3 py-2.5 border border-border-dark text-[9px] font-mono uppercase tracking-widest text-muted-dark/60 hover:text-text-dark hover:border-muted-dark/30 transition-colors disabled:opacity-40"
                        title="Reset to pending"
                      >
                        ↺
                      </button>
                    )}
                  </div>

                  <div
                    className={`text-center py-1.5 text-[9px] font-mono uppercase tracking-widest ${
                      application.campStatus === 'ADMITTED'
                        ? 'text-emerald-400'
                        : application.campStatus === 'DENIED'
                          ? 'text-red-400'
                          : 'text-muted-dark'
                    }`}
                  >
                    {application.campStatus === 'ADMITTED'
                      ? '● Admitted to camp'
                      : application.campStatus === 'DENIED'
                        ? '● Denied'
                        : '● Pending decision'}
                  </div>

                  <FormError error={error} />
                </div>

                <DangerZone
                  label="Delete Application"
                  name={s ? `${s.firstName} ${s.lastName}` : 'this application'}
                  onConfirm={handleDelete}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="shrink-0 flex items-center justify-end px-4 py-3 border-t border-border-dark bg-surface-dark">
              <button
                type="button"
                onClick={onClose}
                className="text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 border border-border-dark text-muted-dark hover:text-text-dark hover:border-muted-dark/30 transition-colors"
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
