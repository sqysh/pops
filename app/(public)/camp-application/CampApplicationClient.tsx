'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Check } from 'lucide-react'
import Breadcrumb from '../../components/common/Breadcrumb'
import { createCampApplication } from '@/app/lib/actions/camp-applications/createCampApplication'
import { useRouter } from 'next/navigation'
import { store } from '@/app/redux/store'
import { showToast } from '@/app/redux/features/toastSlice'
import { setOpenCampApplicationSuccessModal } from '@/app/redux/features/uiSlice'
import {
  fieldLabels,
  formSteps,
  initialState,
  inputClass,
  labelClass,
  requiredByStep,
  variants
} from '@/app/lib/constants/camp-application.constants'
import { FormState } from '@/app/types/entities/camp-application'

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      {label && <label className={labelClass}>{label}</label>}
      {children}
      {error && <p className="mt-1.5 text-[11px] font-mono text-blaze-text uppercase tracking-widest">{error}</p>}
    </div>
  )
}

export default function CampApplicationClient({ data }) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [form, setForm] = useState<FormState>(initialState)
  const [isLoading, setIsLoading] = useState(false)

  const schedule = [
    {
      date: data?.content?.find?.((d) => d.id === 'camp_schedule_monday_date')?.value,
      time: data?.content?.find?.((d) => d.id === 'camp_schedule_monday_time')?.value,
      items: data?.content?.find?.((d) => d.id === 'camp_schedule_monday_items')?.value.split('\n') ?? []
    },
    {
      date: data?.content?.find?.((d) => d.id === 'camp_schedule_tuesday_date')?.value,
      time: data?.content?.find?.((d) => d.id === 'camp_schedule_tuesday_time')?.value,
      items: data?.content?.find?.((d) => d.id === 'camp_schedule_tuesday_items')?.value.split('\n') ?? []
    },
    {
      date: data?.content?.find?.((d) => d.id === 'camp_schedule_wednesday_date')?.value,
      time: data?.content?.find?.((d) => d.id === 'camp_schedule_wednesday_time')?.value,
      items: data?.content?.find?.((d) => d.id === 'camp_schedule_wednesday_items')?.value.split('\n') ?? []
    },
    {
      date: data?.content?.find?.((d) => d.id === 'camp_schedule_thursday_date')?.value,
      time: data?.content?.find?.((d) => d.id === 'camp_schedule_thursday_time')?.value,
      items: data?.content?.find?.((d) => d.id === 'camp_schedule_thursday_items')?.value.split('\n') ?? []
    },
    {
      date: data?.content?.find?.((d) => d.id === 'camp_schedule_friday_date')?.value,
      time: data?.content?.find?.((d) => d.id === 'camp_schedule_friday_time')?.value,
      items: data?.content?.find?.((d) => d.id === 'camp_schedule_friday_items')?.value.split('\n') ?? []
    },
    {
      date: data?.content?.find?.((d) => d.id === 'camp_schedule_saturday_date')?.value,
      time: data?.content?.find?.((d) => d.id === 'camp_schedule_saturday_time')?.value,
      items: data?.content?.find?.((d) => d.id === 'camp_schedule_saturday_items')?.value.split('\n') ?? []
    }
  ]

  const set = (field: keyof FormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = (s: number): boolean => {
    const required = requiredByStep[s] ?? []
    const newErrors: Partial<Record<keyof FormState, string>> = {}
    for (const field of required) {
      const val = form[field]
      if (field === 'consent') {
        if (!val) newErrors[field] = fieldLabels[field] ?? 'Required'
      } else if (!String(val).trim()) {
        newErrors[field] = `${fieldLabels[field] ?? 'This field'} is required`
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const go = (next: number) => {
    if (next > step && step > 0 && !validate(step)) return
    setDirection(next > step ? 1 : -1)
    setStep(next)
    setErrors({})
  }

  const e = (field: keyof FormState) => errors[field]

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!validate(4)) return

    try {
      setIsLoading(true)
      await createCampApplication(form)
      store.dispatch(setOpenCampApplicationSuccessModal())
      router.refresh()
      setForm(initialState)
      store.dispatch(showToast({ type: 'success', message: 'Successfully submitted camp application.' }))
      setStep(1)
    } catch {
      store.dispatch(showToast({ type: 'error', message: 'Fail to submit camp application.' }))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Breadcrumb breadcrumb="Camp Application" classname="1200:max-w-screen-1400" />

      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <section className="relative px-6 py-8 bg-black border-b border-white/10">
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-2">
            <div className="flex items-center gap-3">
              <div className="w-5 h-px bg-blaze shrink-0" aria-hidden="true" />
              <span className="font-changa text-[10px] uppercase tracking-[0.3em] text-white/30">
                The Pops Orchestra
              </span>
              <div className="w-5 h-px bg-blaze shrink-0" aria-hidden="true" />
            </div>
            <h1 className="font-changa font-black text-2xl 760:text-3xl text-white leading-none">Youth Music Camp</h1>
            <p className="font-lato text-white/60 text-sm leading-relaxed max-w-lg">
              Complete the application below. At least two years of playing experience required.
            </p>
          </div>
        </section>

        {/* ── Body ── */}
        <div className="px-4 990:px-12 xl:px-4 py-12">
          <div className="max-w-130 760:max-w-xl 990:max-w-200 1200:max-w-screen-1160 1590:max-w-7xl mx-auto">
            <div className="grid grid-cols-1 990:grid-cols-12 gap-px bg-white/10">
              <aside aria-label="Camp schedule" className="990:col-span-3 bg-black 990:sticky 990:top-6 self-start">
                <div className="border-b border-white/10 px-4 py-2 flex items-center gap-2">
                  <div className="w-3 h-px bg-blaze shrink-0" aria-hidden="true" />
                  <p className="font-changa text-[10px] uppercase tracking-[0.25em] text-blaze-text">Camp Schedule</p>
                </div>
                <div className="p-4 flex flex-col gap-3">
                  {schedule.map((day, d) => (
                    <div key={d}>
                      <p className="font-changa text-white text-[13px] leading-none mb-0.5">{day.date}</p>
                      <p className="font-mono text-[9px] text-blaze-text uppercase tracking-[0.15em] mb-1.5">
                        {day.time}
                      </p>
                      <ul className="flex flex-col gap-1" aria-label={`Schedule for ${day.date}`}>
                        {day.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="mt-1.5 w-1 h-1 rounded-full bg-blaze shrink-0" aria-hidden="true" />
                            <span className="font-lato text-[11px] text-white/70 leading-snug">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-white/10 flex items-start gap-1.5">
                    <Check className="w-3 h-3 text-blaze-text mt-0.5 shrink-0" aria-hidden="true" />
                    <p className="font-lato text-[11px] text-white/60 leading-snug">
                      At least two years of playing experience required
                    </p>
                  </div>
                </div>
              </aside>

              {/* ── Form ── */}
              <div className="990:col-span-9 bg-black flex flex-col">
                {/* Step indicators */}
                {step > 0 && (
                  <div className="border-b border-white/10 px-5 990:px-8 py-4">
                    <div
                      className="flex items-center max-w-sm mx-auto 990:mx-0"
                      role="list"
                      aria-label="Application steps"
                    >
                      {formSteps.map((s, i) => {
                        const Icon = s.icon
                        const done = step > s.id
                        const active = step === s.id
                        return (
                          <div
                            key={s.id}
                            className={`flex items-center ${i < formSteps.length - 1 ? 'flex-1' : ''}`}
                            role="listitem"
                          >
                            <div className="flex flex-col items-center gap-1">
                              <button
                                type="button"
                                onClick={() => step > s.id && go(s.id)}
                                disabled={step <= s.id}
                                aria-label={`${s.label} — ${done ? 'completed' : active ? 'current step' : 'upcoming'}`}
                                aria-current={active ? 'step' : undefined}
                                className={`w-8 h-8 flex items-center justify-center border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-default ${
                                  done
                                    ? 'bg-blaze border-blaze'
                                    : active
                                      ? 'bg-transparent border-blaze'
                                      : 'bg-transparent border-white/20'
                                }`}
                              >
                                {done ? (
                                  <Check className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                                ) : (
                                  <Icon
                                    className={`w-3.5 h-3.5 ${active ? 'text-blaze-text' : 'text-white/30'}`}
                                    aria-hidden="true"
                                  />
                                )}
                              </button>
                              <span
                                className={`text-[10px] font-mono uppercase tracking-wider ${
                                  active ? 'text-white' : done ? 'text-blaze-text' : 'text-white/30'
                                }`}
                              >
                                {s.label}
                              </span>
                            </div>
                            {i < formSteps.length - 1 && (
                              <div
                                className={`flex-1 h-px mx-2 mb-4 transition-all duration-500 ${
                                  step > s.id ? 'bg-blaze' : 'bg-white/10'
                                }`}
                                aria-hidden="true"
                              />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Form content */}
                <div className="p-5 990:p-8" style={{ minHeight: 360 }}>
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={step}
                      custom={direction}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.22, ease: 'easeInOut' }}
                      className="flex flex-col gap-5"
                    >
                      {/* Step 1 — Student */}
                      {step === 1 && (
                        <>
                          <h2 className="font-changa text-2xl text-white">Student Information</h2>
                          <div className="grid grid-cols-1 430:grid-cols-2 gap-4">
                            <Field label="First Name" error={e('firstName')}>
                              <input
                                className={inputClass(e('firstName'))}
                                placeholder="Jane"
                                value={form.firstName}
                                onChange={(e) => set('firstName', e.target.value)}
                              />
                            </Field>
                            <Field label="Last Name" error={e('lastName')}>
                              <input
                                className={inputClass(e('lastName'))}
                                placeholder="Doe"
                                value={form.lastName}
                                onChange={(e) => set('lastName', e.target.value)}
                              />
                            </Field>
                          </div>
                          <div className="grid grid-cols-1 430:grid-cols-2 gap-4">
                            <Field label="Grade" error={e('grade')}>
                              <input
                                className={inputClass(e('grade'))}
                                placeholder="9th"
                                value={form.grade}
                                onChange={(e) => set('grade', e.target.value)}
                              />
                            </Field>
                            <Field label="School" error={e('school')}>
                              <input
                                className={inputClass(e('school'))}
                                placeholder="Sarasota High"
                                value={form.school}
                                onChange={(e) => set('school', e.target.value)}
                              />
                            </Field>
                          </div>
                          <Field label="Email Address" error={e('studentEmailAddress')}>
                            <input
                              className={inputClass(e('studentEmailAddress'))}
                              type="email"
                              placeholder="jane@email.com"
                              value={form.studentEmailAddress}
                              onChange={(e) => set('studentEmailAddress', e.target.value)}
                            />
                          </Field>
                          <Field label="Phone Number" error={e('studentPhoneNumber')}>
                            <input
                              className={inputClass(e('studentPhoneNumber'))}
                              type="tel"
                              placeholder="(941) 555-0100"
                              value={form.studentPhoneNumber}
                              onChange={(e) => set('studentPhoneNumber', e.target.value)}
                            />
                          </Field>
                        </>
                      )}

                      {/* Step 2 — Address */}
                      {step === 2 && (
                        <>
                          <h2 className="font-changa text-2xl text-white">Home Address</h2>
                          <Field label="Address Line 1" error={e('addressLine1')}>
                            <input
                              className={inputClass(e('addressLine1'))}
                              placeholder="123 Main St"
                              value={form.addressLine1}
                              onChange={(e) => set('addressLine1', e.target.value)}
                            />
                          </Field>
                          <Field label="Address Line 2">
                            <input
                              className={inputClass()}
                              placeholder="Apt, Suite, etc. (optional)"
                              value={form.addressLine2}
                              onChange={(e) => set('addressLine2', e.target.value)}
                            />
                          </Field>
                          <div className="grid grid-cols-3 gap-4">
                            <Field label="City" error={e('city')}>
                              <input
                                className={inputClass(e('city'))}
                                placeholder="Sarasota"
                                value={form.city}
                                onChange={(e) => set('city', e.target.value)}
                              />
                            </Field>
                            <Field label="State" error={e('state')}>
                              <input
                                className={inputClass(e('state'))}
                                placeholder="FL"
                                value={form.state}
                                onChange={(e) => set('state', e.target.value)}
                              />
                            </Field>
                            <Field label="ZIP Code" error={e('zipPostalCode')}>
                              <input
                                className={inputClass(e('zipPostalCode'))}
                                placeholder="34230"
                                value={form.zipPostalCode}
                                onChange={(e) => set('zipPostalCode', e.target.value)}
                              />
                            </Field>
                          </div>
                        </>
                      )}

                      {/* Step 3 — Parent */}
                      {step === 3 && (
                        <>
                          <h2 className="font-changa text-2xl text-white">Parent / Guardian</h2>
                          <div className="grid grid-cols-1 430:grid-cols-2 gap-4">
                            <Field label="First Name" error={e('parentFirstName')}>
                              <input
                                className={inputClass(e('parentFirstName'))}
                                placeholder="John"
                                value={form.parentFirstName}
                                onChange={(e) => set('parentFirstName', e.target.value)}
                              />
                            </Field>
                            <Field label="Last Name" error={e('parentLastName')}>
                              <input
                                className={inputClass(e('parentLastName'))}
                                placeholder="Doe"
                                value={form.parentLastName}
                                onChange={(e) => set('parentLastName', e.target.value)}
                              />
                            </Field>
                          </div>
                          <Field label="Relationship to Student">
                            <input
                              className={inputClass()}
                              placeholder="Parent, Guardian, etc."
                              value={form.relationshipToStudent}
                              onChange={(e) => set('relationshipToStudent', e.target.value)}
                            />
                          </Field>
                          <Field label="Email Address" error={e('parentEmailAddress')}>
                            <input
                              className={inputClass(e('parentEmailAddress'))}
                              type="email"
                              placeholder="john@email.com"
                              value={form.parentEmailAddress}
                              onChange={(e) => set('parentEmailAddress', e.target.value)}
                            />
                          </Field>
                          <Field label="Phone Number" error={e('parentPhoneNumber')}>
                            <input
                              className={inputClass(e('parentPhoneNumber'))}
                              type="tel"
                              placeholder="(941) 555-0101"
                              value={form.parentPhoneNumber}
                              onChange={(e) => set('parentPhoneNumber', e.target.value)}
                            />
                          </Field>
                        </>
                      )}

                      {/* Step 4 — Music */}
                      {step === 4 && (
                        <>
                          <h2 className="font-changa text-2xl text-white">Music Details</h2>
                          <Field label="Primary Instrument" error={e('instrument')}>
                            <input
                              className={inputClass(e('instrument'))}
                              placeholder="Violin, Trumpet, Flute..."
                              value={form.instrument}
                              onChange={(e) => set('instrument', e.target.value)}
                            />
                          </Field>
                          <Field label="Music Teacher (optional)">
                            <input
                              className={inputClass()}
                              placeholder="Teacher's name"
                              value={form.musicTeacher}
                              onChange={(e) => set('musicTeacher', e.target.value)}
                            />
                          </Field>
                          <div className="grid grid-cols-3 gap-4">
                            <Field label="Strings">
                              <select
                                className={inputClass()}
                                value={form.strings}
                                onChange={(e) => set('strings', e.target.value)}
                              >
                                <option value="" disabled>
                                  Select level
                                </option>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                              </select>
                            </Field>
                            <Field label="Brass & Perc.">
                              <select
                                className={inputClass()}
                                value={form.brassAndPercussion}
                                onChange={(e) => set('brassAndPercussion', e.target.value)}
                              >
                                <option value="" disabled>
                                  Select level
                                </option>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                              </select>
                            </Field>
                            <Field label="Woodwinds">
                              <select
                                className={inputClass()}
                                value={form.woodwinds}
                                onChange={(e) => set('woodwinds', e.target.value)}
                              >
                                <option value="" disabled>
                                  Select level
                                </option>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                              </select>
                            </Field>
                          </div>
                          <Field label="How did you hear about us?">
                            <input
                              className={inputClass()}
                              placeholder="Friend, social media, school..."
                              value={form.referralSource}
                              onChange={(e) => set('referralSource', e.target.value)}
                            />
                          </Field>
                          <Field label="" error={e('consent')}>
                            <label className="flex items-start gap-3 cursor-pointer group">
                              <div
                                role="checkbox"
                                aria-checked={form.consent}
                                tabIndex={0}
                                onClick={() => set('consent', !form.consent)}
                                onKeyDown={(e) => e.key === ' ' && set('consent', !form.consent)}
                                className={`mt-0.5 w-5 h-5 shrink-0 border-2 flex items-center justify-center transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze ${
                                  form.consent
                                    ? 'bg-blaze border-blaze'
                                    : e('consent')
                                      ? 'border-blaze'
                                      : 'border-white/30 group-hover:border-white/50'
                                }`}
                              >
                                {form.consent && <Check className="w-3 h-3 text-white" aria-hidden="true" />}
                              </div>
                              <span className="font-lato text-sm text-white/80 leading-relaxed">
                                I consent to the terms and conditions of the Pops Orchestra Youth Music Camp and confirm
                                all information provided is accurate.
                              </span>
                            </label>
                          </Field>
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Navigation */}
                <div className="border-t border-white/10 px-5 990:px-8 py-4 flex items-center justify-between">
                  {step !== 1 ? (
                    <button
                      type="button"
                      onClick={() => go(step - 1)}
                      disabled={step === 0}
                      className="flex items-center gap-2 px-4 py-2 text-[11px] font-mono tracking-[0.15em] uppercase text-white/60 hover:text-white disabled:opacity-0 disabled:pointer-events-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
                      Back
                    </button>
                  ) : (
                    <div />
                  )}

                  {step < 4 ? (
                    <button
                      type="button"
                      onClick={() => go(step + 1)}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-blaze hover:bg-blazehover text-white font-changa uppercase tracking-widest text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    >
                      {step === 0 ? 'Start Application' : 'Continue'}
                      <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-blaze hover:bg-blazehover text-white font-changa uppercase tracking-widest text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    >
                      {isLoading ? (
                        <>
                          <div
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                            aria-hidden="true"
                          />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Application</span>
                          <Check className="w-4 h-4" aria-hidden="true" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
