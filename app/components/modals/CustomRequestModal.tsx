'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, ArrowRight, ArrowLeft, Wrench } from 'lucide-react'
import { store } from '@/app/redux/store'
import { showToast } from '@/app/redux/features/toastSlice'
import { sendCustomRequest } from '@/app/lib/actions/custom-request/sendCustomRequest'
import { useRouter } from 'next/navigation'

interface Props {
  onClose: () => void
}

const PAGES = [
  'Home',
  'About',
  'Concerts',
  'Contact',
  'Donate',
  'Student Performers',
  'Gallery',
  'Team',
  'Sponsors',
  'Venues',
  'Events',
  'News',
  'A new page entirely',
  'Not sure'
]

const CHANGE_TYPES = [
  { value: 'new_feature', label: 'New Feature', description: "Something that doesn't exist yet" },
  { value: 'edit', label: 'Edit Existing', description: 'Change something that already exists' },
  { value: 'new_page', label: 'New Page', description: 'A brand new page on the site' },
  { value: 'bug', label: 'Something is Broken', description: 'A bug or something not working right' },
  { value: 'design', label: 'Design Change', description: 'How something looks or feels' }
]

const URGENCY = [
  { value: 'whenever', label: 'Whenever you get to it', color: 'text-emerald-400' },
  { value: 'soon', label: 'Within the next few weeks', color: 'text-yellow-400' },
  { value: 'urgent', label: 'As soon as possible', color: 'text-primary-dark' }
]

interface FormState {
  changeType: string
  page: string
  what: string
  why: string
  example: string
  urgency: string
}

// ─── Step components ──────────────────────────────────────────────────────────

function StepChangeType({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-3">
      <div className="mb-6">
        <h3 className="font-quicksand font-black text-text-dark text-xl mb-1">What kind of change is this?</h3>
        <p className="text-muted-dark text-sm">Pick the one that best describes what you need.</p>
      </div>
      {CHANGE_TYPES.map((type) => (
        <button
          key={type.value}
          type="button"
          onClick={() => onChange(type.value)}
          className={`w-full flex items-center justify-between gap-3 px-4 py-3.5 border text-left transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark ${
            value === type.value
              ? 'border-primary-dark bg-primary-dark/10'
              : 'border-border-dark hover:border-muted-dark hover:bg-button-dark'
          }`}
        >
          <div>
            <p className={`text-sm font-medium ${value === type.value ? 'text-text-dark' : 'text-muted-dark'}`}>
              {type.label}
            </p>
            <p className="text-[11px] text-muted-dark/80 mt-0.5">{type.description}</p>
          </div>
          {value === type.value && <div className="w-2 h-2 bg-primary-dark shrink-0" aria-hidden="true" />}
        </button>
      ))}
    </div>
  )
}

function StepPage({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div className="mb-6">
        <h3 className="font-quicksand font-black text-text-dark text-xl mb-1">Which page is this for?</h3>
        <p className="text-muted-dark text-sm">Select all that apply or your best guess.</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {PAGES.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onChange(page)}
            className={`px-3 py-2.5 border text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark ${
              value === page
                ? 'border-primary-dark bg-primary-dark/10 text-text-dark'
                : 'border-border-dark hover:border-muted-dark hover:bg-button-dark text-muted-dark'
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  )
}

function StepWhat({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div className="mb-6">
        <h3 className="font-quicksand font-black text-text-dark text-xl mb-1">What do you want?</h3>
        <p className="text-muted-dark text-sm">
          Describe exactly what you&apos;d like. Don&apos;t worry about technical details — just explain what you want
          to see or happen.
        </p>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="I want a section on the home page that shows our upcoming events with a date, title, and a button to learn more..."
        rows={6}
        autoFocus
        className="w-full px-3 py-2.5 bg-bg-dark border border-border-dark text-text-dark text-sm placeholder:text-muted-dark/60 focus:outline-none focus:border-primary-dark transition-colors resize-none"
      />
      <p className="text-[10px] font-mono text-muted-dark/70 mt-2">
        Be as specific as possible. More detail = faster turnaround.
      </p>
    </div>
  )
}

function StepWhy({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div className="mb-6">
        <h3 className="font-quicksand font-black text-text-dark text-xl mb-1">Why do you need this?</h3>
        <p className="text-muted-dark text-sm">
          Help us understand the problem you&apos;re trying to solve. This helps us build exactly the right thing.
        </p>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Patrons keep calling asking about non-concert events and we have no way to list them on the site..."
        rows={5}
        autoFocus
        className="w-full px-3 py-2.5 bg-bg-dark border border-border-dark text-text-dark text-sm placeholder:text-muted-dark/60 focus:outline-none focus:border-primary-dark transition-colors resize-none"
      />
    </div>
  )
}

function StepExample({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div className="mb-6">
        <h3 className="font-quicksand font-black text-text-dark text-xl mb-1">Any examples or references?</h3>
        <p className="text-muted-dark text-sm">
          A link to another website, a screenshot description, or even just &quot;like the concerts section but for
          events&quot; — anything helps.
        </p>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Like how the Sarasota Symphony site lists their events at sarasotaorchestra.org/events..."
        rows={4}
        autoFocus
        className="w-full px-3 py-2.5 bg-bg-dark border border-border-dark text-text-dark text-sm placeholder:text-muted-dark/60 focus:outline-none focus:border-primary-dark transition-colors resize-none"
      />
      <p className="text-[10px] font-mono text-muted-dark/70 mt-2">Optional but helpful.</p>
    </div>
  )
}

function StepUrgency({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div className="mb-6">
        <h3 className="font-quicksand font-black text-text-dark text-xl mb-1">How urgent is this?</h3>
        <p className="text-muted-dark text-sm">Be honest — this helps prioritize the workload.</p>
      </div>
      <div className="space-y-3">
        {URGENCY.map((u) => (
          <button
            key={u.value}
            type="button"
            onClick={() => onChange(u.value)}
            className={`w-full flex items-center justify-between gap-3 px-4 py-4 border text-left transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark ${
              value === u.value
                ? 'border-primary-dark bg-primary-dark/10'
                : 'border-border-dark hover:border-muted-dark hover:bg-button-dark'
            }`}
          >
            <span className={`text-sm font-medium ${value === u.value ? u.color : 'text-muted-dark'}`}>{u.label}</span>
            {value === u.value && <div className="w-2 h-2 bg-primary-dark shrink-0" aria-hidden="true" />}
          </button>
        ))}
      </div>
    </div>
  )
}

function StepReview({ form }: { form: FormState }) {
  const changeType = CHANGE_TYPES.find((t) => t.value === form.changeType)
  const urgency = URGENCY.find((u) => u.value === form.urgency)

  return (
    <div>
      <div className="mb-6">
        <h3 className="font-quicksand font-black text-text-dark text-xl mb-1">Review your request</h3>
        <p className="text-muted-dark text-sm">Make sure everything looks right before sending.</p>
      </div>

      <div className="space-y-px border border-border-dark">
        {[
          { label: 'Type', value: changeType?.label },
          { label: 'Page', value: form.page },
          { label: 'Urgency', value: urgency?.label }
        ].map(({ label, value }) => (
          <div key={label} className="flex gap-4 px-4 py-3 bg-bg-dark border-b border-border-dark last:border-0">
            <span className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-dark w-16 shrink-0 mt-0.5">
              {label}
            </span>
            <span className="text-text-dark text-sm">{value || '—'}</span>
          </div>
        ))}

        {[
          { label: 'What', value: form.what },
          { label: 'Why', value: form.why },
          { label: 'Example', value: form.example }
        ].map(({ label, value }) =>
          value ? (
            <div key={label} className="flex gap-4 px-4 py-3 bg-bg-dark border-b border-border-dark last:border-0">
              <span className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-dark w-16 shrink-0 mt-0.5">
                {label}
              </span>
              <span className="text-text-dark text-sm leading-relaxed">{value}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const STEPS = ['type', 'page', 'what', 'why', 'example', 'urgency', 'review'] as const
type Step = (typeof STEPS)[number]

const STEP_LABELS: Record<Step, string> = {
  type: 'Type',
  page: 'Page',
  what: 'What',
  why: 'Why',
  example: 'Example',
  urgency: 'Urgency',
  review: 'Review'
}

export default function CustomRequestModal({ onClose }: Props) {
  const router = useRouter()
  const [step, setStep] = useState<Step>('type')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<FormState>({
    changeType: '',
    page: '',
    what: '',
    why: '',
    example: '',
    urgency: ''
  })

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }))

  const currentIndex = STEPS.indexOf(step)

  const canAdvance = () => {
    if (step === 'type') return !!form.changeType
    if (step === 'page') return !!form.page
    if (step === 'what') return form.what.trim().length > 10
    if (step === 'why') return form.why.trim().length > 5
    if (step === 'urgency') return !!form.urgency
    return true
  }

  const next = () => {
    const nextIndex = currentIndex + 1
    if (nextIndex < STEPS.length) setStep(STEPS[nextIndex])
  }

  const back = () => {
    const prevIndex = currentIndex - 1
    if (prevIndex >= 0) setStep(STEPS[prevIndex])
  }

  const handleSubmit = async () => {
    setLoading(true)
    const res = await sendCustomRequest(form)
    setLoading(false)

    if (res.success) {
      router.refresh()
      store.dispatch(showToast({ type: 'success', message: "Request sent — we'll be in touch!" }))
      onClose()
    } else {
      store.dispatch(showToast({ type: 'error', message: res.error ?? 'Failed to send request' }))
    }
  }

  return (
    <AnimatePresence>
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
          className="fixed inset-x-0 bottom-0 z-50 bg-surface-dark border-t border-border-dark sm:inset-auto sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg sm:border sm:border-border-dark flex flex-col max-h-[90vh]"
          role="dialog"
          aria-modal="true"
          aria-label="Custom request"
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-10 h-1 bg-border-dark" aria-hidden="true" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-dark shrink-0">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-primary-dark" aria-hidden="true" />
              <h2 className="font-quicksand font-black text-text-dark text-base leading-none">Custom Request</h2>
            </div>
            <button
              onClick={onClose}
              className="text-muted-dark hover:text-text-dark transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Progress */}
          <div className="flex border-b border-border-dark shrink-0">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className={`flex-1 h-0.5 transition-colors ${i <= currentIndex ? 'bg-primary-dark' : 'bg-border-dark'}`}
              />
            ))}
          </div>

          {/* Step label */}
          <div className="px-4 py-2 border-b border-border-dark shrink-0 flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-dark">
              Step {currentIndex + 1} of {STEPS.length} — {STEP_LABELS[step]}
            </span>
          </div>

          {/* Step content */}
          <div className="flex-1 overflow-y-auto px-4 py-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
              >
                {step === 'type' && <StepChangeType value={form.changeType} onChange={(v) => set('changeType', v)} />}
                {step === 'page' && <StepPage value={form.page} onChange={(v) => set('page', v)} />}
                {step === 'what' && <StepWhat value={form.what} onChange={(v) => set('what', v)} />}
                {step === 'why' && <StepWhy value={form.why} onChange={(v) => set('why', v)} />}
                {step === 'example' && <StepExample value={form.example} onChange={(v) => set('example', v)} />}
                {step === 'urgency' && <StepUrgency value={form.urgency} onChange={(v) => set('urgency', v)} />}
                {step === 'review' && <StepReview form={form} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="flex gap-3 px-4 py-3 border-t border-border-dark shrink-0">
            {currentIndex > 0 ? (
              <button
                onClick={back}
                className="flex items-center gap-2 px-4 py-2.5 border border-border-dark text-muted-dark hover:text-text-dark text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark"
              >
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                Back
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2.5 border border-border-dark text-muted-dark hover:text-text-dark text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark"
              >
                Cancel
              </button>
            )}

            {step !== 'review' ? (
              <button
                onClick={next}
                disabled={!canAdvance()}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary-dark hover:bg-secondary-light text-white text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark"
              >
                {step === 'example' ? 'Skip' : 'Continue'}
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary-dark hover:bg-secondary-light text-white text-sm font-medium transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
                {loading ? 'Sending...' : 'Send Request'}
              </button>
            )}
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  )
}
