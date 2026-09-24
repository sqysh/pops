'use client'

import { useState } from 'react'
import { Check, GraduationCap, Loader2, Mail, MapPin, Music, Phone, RotateCcw, User, X } from 'lucide-react'
import { CampStatus } from '@prisma/client'
import { deleteCampApplication } from '@/app/lib/actions/camp-applications/deleteCampApplication'
import { updateCampApplicationStatus } from '@/app/lib/actions/camp-applications/updateCampApplicationStatus'
import { CampApplicationWithRelations } from '@/app/types/entities/camp-application'
import { DrawerShell } from '@/app/(authenticated)/v2/_components/DrawerShell'
import { FormError } from '@/app/(authenticated)/v2/_components/FormField'
import { DangerZone } from '@/app/(authenticated)/v2/_components/DangerZone'
import {
  DetailField,
  DrawerBody,
  DrawerCloseFooter,
  DrawerSection,
  FieldLabel,
  MetaField,
  StatusBadge
} from '@/app/(authenticated)/v2/_components/DrawerElements'
import useSoundEffect from '@/app/lib/hooks/useSoundEffect'
import { formatDate, formatTime } from '@/app/lib/utils/date.utils'

const STATUS_TONE = {
  ADMITTED: 'emerald',
  DENIED: 'red',
  PENDING: 'neutral'
} as const

const STATUS_LABEL = {
  ADMITTED: 'Admitted to camp',
  DENIED: 'Not admitted',
  PENDING: 'No decision yet'
} as const

const ContactLine = ({ icon: Icon, href, children }: { icon: React.ElementType; href: string; children: React.ReactNode }) => (
  <div className="flex items-center gap-2 min-w-0">
    <Icon className="w-4 h-4 text-neutral-400 shrink-0" aria-hidden="true" />
    <a
      href={href}
      className="truncate text-blaze-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze rounded-sm"
    >
      {children}
    </a>
  </div>
)

export function CampApplicationDetailDrawer({
  application,
  onClose,
  onDelete,
  onStatusChanged
}: {
  application: CampApplicationWithRelations | null
  onClose: () => void
  onDelete: (id: string) => void
  onStatusChanged: (id: string, campStatus: CampStatus) => void
}) {
  const [error, setError] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<CampStatus | null>(null)
  const { play: statusChangeSE } = useSoundEffect('/mp3/se-1.mp3', true)
  const { play: deleteSE } = useSoundEffect('/mp3/se-2.mp3', true)

  async function handleDelete() {
    if (!application) return
    setError(null)
    const result = await deleteCampApplication(application.id)
    if (result.success) {
      deleteSE()
      onDelete(application.id)
      onClose()
    } else {
      setError(result.error ?? 'Failed to delete this application.')
    }
  }

  async function handleSetStatus(status: CampStatus) {
    if (!application) return
    setError(null)
    setUpdatingStatus(status)
    const result = await updateCampApplicationStatus(application.id, status)
    setUpdatingStatus(null)
    if (result.success) {
      statusChangeSE()
      onStatusChanged(application.id, status)
      onClose()
    } else {
      setError(result.error ?? 'Failed to update the decision.')
    }
  }

  const s = application?.Student
  const p = application?.Parent
  const a = application?.Address
  const status = (application?.campStatus ?? 'PENDING') as keyof typeof STATUS_LABEL

  const musicDetails = [
    { label: 'Music teacher', value: application?.musicTeacher },
    { label: 'Strings', value: application?.strings },
    { label: 'Brass and percussion', value: application?.brassAndPercussion },
    { label: 'Woodwinds', value: application?.woodwinds },
    { label: 'Heard about us via', value: application?.referralSource }
  ].filter(({ value }) => value)

  return (
    <DrawerShell
      open={application !== null}
      onClose={onClose}
      label={s ? `${s.firstName} ${s.lastName}` : 'Camp application'}
      width="w-[34rem]"
    >
      {application && (
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-white text-sm">
          <DrawerBody>
            {/* Submitted + instrument */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-200">
              <MetaField label="Submitted">
                <span className="text-neutral-900 tabular-nums">{formatDate(application.createdAt)}</span>
                <span className="text-neutral-500 tabular-nums">{formatTime(application.createdAt)}</span>
              </MetaField>

              <MetaField label="Instrument" align="right">
                <span className="font-semibold text-neutral-900">{application.instrument || '—'}</span>
              </MetaField>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</StatusBadge>
              {!application.consent && <StatusBadge tone="red">Consent not given</StatusBadge>}
            </div>

            {s && (
              <DrawerSection label="Student" icon={GraduationCap}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-semibold text-neutral-900 truncate">
                    {s.firstName} {s.lastName}
                  </span>
                  <span className="text-neutral-600 shrink-0">Grade {s.grade}</span>
                </div>
                {s.school && <span className="text-neutral-700">{s.school}</span>}
                <div className="flex flex-col gap-1.5 pt-2 border-t border-neutral-200">
                  <ContactLine icon={Mail} href={`mailto:${s.studentEmailAddress}`}>
                    {s.studentEmailAddress}
                  </ContactLine>
                  <ContactLine icon={Phone} href={`tel:${s.studentPhoneNumber}`}>
                    {s.studentPhoneNumber}
                  </ContactLine>
                </div>
              </DrawerSection>
            )}

            {p && (
              <DrawerSection label="Parent or guardian" icon={User}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-semibold text-neutral-900 truncate">
                    {p.firstName} {p.lastName}
                  </span>
                  {p.relationshipToStudent && <span className="text-neutral-600 shrink-0">{p.relationshipToStudent}</span>}
                </div>
                <div className="flex flex-col gap-1.5 pt-2 border-t border-neutral-200">
                  <ContactLine icon={Mail} href={`mailto:${p.parentEmailAddress}`}>
                    {p.parentEmailAddress}
                  </ContactLine>
                  <ContactLine icon={Phone} href={`tel:${p.parentPhoneNumber}`}>
                    {p.parentPhoneNumber}
                  </ContactLine>
                </div>
              </DrawerSection>
            )}

            {a && (a.addressLine1 || a.city) && (
              <DrawerSection label="Address" icon={MapPin}>
                <p className="text-neutral-900 leading-relaxed">
                  {[a.addressLine1, a.addressLine2, a.city, a.state, a.zipPostalCode].filter(Boolean).join(', ')}
                </p>
              </DrawerSection>
            )}

            {musicDetails.length > 0 && (
              <DrawerSection label="Music background" icon={Music}>
                {musicDetails.map(({ label, value }) => (
                  <DetailField key={label} label={label}>
                    {value}
                  </DetailField>
                ))}
              </DrawerSection>
            )}

            {/* Decision */}
            <div className="flex flex-col gap-2 pt-3 border-t border-neutral-200">
              <FieldLabel>Camp decision</FieldLabel>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleSetStatus('ADMITTED')}
                  disabled={!!updatingStatus || status === 'ADMITTED'}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 border font-medium transition-colors disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze ${
                    status === 'ADMITTED'
                      ? 'border-emerald-400 bg-emerald-100 text-emerald-900'
                      : 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  {updatingStatus === 'ADMITTED' ? (
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Check className="w-4 h-4" aria-hidden="true" />
                  )}
                  Admit
                </button>

                <button
                  type="button"
                  onClick={() => handleSetStatus('DENIED')}
                  disabled={!!updatingStatus || status === 'DENIED'}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 border font-medium transition-colors disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze ${
                    status === 'DENIED'
                      ? 'border-red-400 bg-red-100 text-red-900'
                      : 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100'
                  }`}
                >
                  {updatingStatus === 'DENIED' ? (
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <X className="w-4 h-4" aria-hidden="true" />
                  )}
                  Decline
                </button>

                {status !== 'PENDING' && (
                  <button
                    type="button"
                    onClick={() => handleSetStatus('PENDING')}
                    disabled={!!updatingStatus}
                    aria-label="Undo this decision"
                    title="Undo this decision"
                    className="px-3 py-2.5 border border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
                  >
                    {updatingStatus === 'PENDING' ? (
                      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <RotateCcw className="w-4 h-4" aria-hidden="true" />
                    )}
                  </button>
                )}
              </div>

              <FormError error={error} />
            </div>

            <DangerZone
              label="Delete application"
              name={s ? `${s.firstName} ${s.lastName}` : 'this application'}
              onConfirm={handleDelete}
            />
          </DrawerBody>

          <DrawerCloseFooter onClose={onClose} />
        </div>
      )}
    </DrawerShell>
  )
}
