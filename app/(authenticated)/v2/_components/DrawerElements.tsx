'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export type Tone = 'neutral' | 'emerald' | 'amber' | 'orange' | 'red'

/**
 * One source of colour truth for every drawer. Badges, callouts and action
 * buttons all read from here, so a tone means the same thing wherever it
 * appears and there is one place to change it.
 */
const TONES: Record<
  Tone,
  { dot: string; pill: string; panel: string; heading: string; body: string; icon: string; button: string }
> = {
  neutral: {
    dot: 'bg-neutral-400',
    pill: 'text-neutral-700 bg-neutral-100 ring-neutral-300',
    panel: 'border-neutral-200 bg-neutral-50',
    heading: 'text-neutral-900',
    body: 'text-neutral-700',
    icon: 'text-neutral-500',
    button: 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100'
  },
  emerald: {
    dot: 'bg-emerald-500',
    pill: 'text-emerald-700 bg-emerald-50 ring-emerald-200',
    panel: 'border-emerald-200 bg-emerald-50',
    heading: 'text-emerald-900',
    body: 'text-emerald-800',
    icon: 'text-emerald-600',
    button: 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
  },
  amber: {
    dot: 'bg-amber-500',
    pill: 'text-amber-800 bg-amber-50 ring-amber-200',
    panel: 'border-amber-200 bg-amber-50',
    heading: 'text-amber-900',
    body: 'text-amber-800',
    icon: 'text-amber-600',
    button: 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100'
  },
  orange: {
    dot: 'bg-orange-500',
    pill: 'text-orange-800 bg-orange-50 ring-orange-200',
    panel: 'border-orange-200 bg-orange-50',
    heading: 'text-orange-900',
    body: 'text-orange-800',
    icon: 'text-orange-600',
    button: 'border-orange-300 bg-orange-50 text-orange-800 hover:bg-orange-100'
  },
  red: {
    dot: 'bg-red-500',
    pill: 'text-red-700 bg-red-50 ring-red-200',
    panel: 'border-red-200 bg-red-50',
    heading: 'text-red-900',
    body: 'text-red-800',
    icon: 'text-red-600',
    button: 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100'
  }
}

export const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">{children}</span>
)

export const StatusBadge = ({ tone = 'neutral', children }: { tone?: Tone; children: React.ReactNode }) => (
  <span className={`inline-flex items-center gap-1.5 text-xs font-medium rounded-full ring-1 px-2 py-0.5 ${TONES[tone].pill}`}>
    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${TONES[tone].dot}`} aria-hidden="true" />
    {children}
  </span>
)

export const Callout = ({
  tone = 'neutral',
  icon: Icon,
  title,
  children
}: {
  tone?: Tone
  icon?: React.ElementType
  title?: string
  children: React.ReactNode
}) => (
  <div className={`flex items-start gap-3 px-3 py-3 border ${TONES[tone].panel}`}>
    {Icon && <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${TONES[tone].icon}`} aria-hidden="true" />}
    <div className="flex flex-col gap-1 min-w-0">
      {title && <span className={`font-semibold ${TONES[tone].heading}`}>{title}</span>}
      <span className={`leading-relaxed ${TONES[tone].body}`}>{children}</span>
    </div>
  </div>
)

/** A labelled, read-only block of content: a submitted message, a sent reply. */
export const ReadonlyBlock = ({
  label,
  meta,
  tone = 'neutral',
  children
}: {
  label: string
  meta?: React.ReactNode
  tone?: Tone
  children: React.ReactNode
}) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center justify-between gap-3">
      <FieldLabel>{label}</FieldLabel>
      {meta && <span className="text-neutral-500 tabular-nums">{meta}</span>}
    </div>
    <div className={`px-3 py-3 border ${TONES[tone].panel}`}>
      <p className="text-neutral-900 leading-relaxed whitespace-pre-wrap">{children}</p>
    </div>
  </div>
)

/** Two-column label and value, for the metadata header of a drawer. */
export const MetaField = ({
  label,
  align = 'left',
  children
}: {
  label: string
  align?: 'left' | 'right'
  children: React.ReactNode
}) => (
  <div className={`flex flex-col gap-1 min-w-0 ${align === 'right' ? 'items-end shrink-0' : ''}`}>
    <FieldLabel>{label}</FieldLabel>
    {children}
  </div>
)

export const DrawerActions = ({ label = 'Other actions', children }: { label?: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-2 pt-3 border-t border-neutral-200">
    <FieldLabel>{label}</FieldLabel>
    {children}
  </div>
)

export const DrawerActionButton = ({
  tone = 'neutral',
  icon: Icon,
  busy = false,
  busyLabel,
  onClick,
  children
}: {
  tone?: Tone
  icon?: React.ElementType
  busy?: boolean
  busyLabel?: string
  onClick: () => void
  children: React.ReactNode
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={busy}
    aria-busy={busy}
    className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 border font-medium transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze ${TONES[tone].button}`}
  >
    {busy ? (
      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
    ) : (
      Icon && <Icon className="w-4 h-4" aria-hidden="true" />
    )}
    {busy ? (busyLabel ?? 'Working...') : children}
  </button>
)

/**
 * Destructive action with an inline confirm step. Deliberately not a native
 * confirm() or a second modal: the drawer is already a dialog, and swapping
 * the button in place keeps the decision where the action is.
 */
export const ConfirmActionButton = ({
  tone = 'red',
  icon: Icon,
  busy = false,
  busyLabel,
  question = 'Are you sure?',
  detail,
  confirmLabel = 'Yes, delete',
  onConfirm,
  children
}: {
  tone?: Tone
  icon?: React.ElementType
  busy?: boolean
  busyLabel?: string
  question?: string
  detail?: string
  confirmLabel?: string
  onConfirm: () => void
  children: React.ReactNode
}) => {
  const [confirming, setConfirming] = useState(false)

  if (!confirming) {
    return (
      <DrawerActionButton tone={tone} icon={Icon} onClick={() => setConfirming(true)}>
        {children}
      </DrawerActionButton>
    )
  }

  return (
    <div className={`flex flex-col gap-2 px-3 py-3 border ${TONES[tone].panel}`}>
      <span className={`font-semibold ${TONES[tone].heading}`}>{question}</span>
      {detail && <span className={`leading-relaxed ${TONES[tone].body}`}>{detail}</span>}
      <div className="flex items-center gap-2 mt-1">
        <button
          type="button"
          onClick={onConfirm}
          disabled={busy}
          aria-busy={busy}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 border font-medium transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze ${TONES[tone].button}`}
        >
          {busy && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
          {busy ? (busyLabel ?? 'Working...') : confirmLabel}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={busy}
          className="px-4 py-2.5 border border-neutral-300 bg-white font-medium text-neutral-700 hover:bg-neutral-100 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export const CharCount = ({ value, max, warnAt }: { value: number; max: number; warnAt?: number }) => (
  <span className={`tabular-nums ${value > (warnAt ?? max * 0.9) ? 'text-amber-700' : 'text-neutral-500'}`}>
    {value} / {max}
  </span>
)

/** Footer for a drawer that has nothing left to submit. */
export const DrawerCloseFooter = ({ onClose, label = 'Close' }: { onClose: () => void; label?: string }) => (
  <div className="shrink-0 flex items-center justify-end px-4 py-3 border-t border-neutral-200 bg-neutral-50">
    <button
      type="button"
      onClick={onClose}
      className="px-4 py-2 border border-neutral-300 bg-white font-medium text-neutral-700 hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
    >
      {label}
    </button>
  </div>
)

/** Icon, label, then a bordered card. The shape every detail drawer repeats. */
export const DrawerSection = ({
  label,
  icon: Icon,
  children
}: {
  label: string
  icon?: React.ElementType
  children: React.ReactNode
}) => (
  <section className="flex flex-col gap-2">
    <div className="flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-neutral-400 shrink-0" aria-hidden="true" />}
      <FieldLabel>{label}</FieldLabel>
    </div>
    <div className="border border-neutral-200 bg-neutral-50 px-3 py-3 flex flex-col gap-2">{children}</div>
  </section>
)

/** A label above its value, for the stacked detail rows inside a section. */
export const DetailField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-0.5 min-w-0">
    <FieldLabel>{label}</FieldLabel>
    <span className="text-neutral-900">{children}</span>
  </div>
)

/** The scrolling body every drawer shares. */
export const DrawerBody = ({ children }: { children: React.ReactNode }) => (
  <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 flex flex-col gap-5">{children}</div>
)
