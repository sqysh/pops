'use client'

import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { createCampApplication } from '@/app/lib/actions/camp-applications/createCampApplication'
import { formSteps, variants } from '@/app/lib/constants/camp-application.constants'
import CompactPageHero from '@/app/(public)/_components/CompactPageHero'
import { FormError, FormField, FormInput, FormSelect, FormToggle, FormWordsProvider } from '@/app/(public)/_components/FormField'
import {
  CampApplicationFormInput,
  CampApplicationFormValues,
  campApplicationSchema,
  EMPTY_CAMP_APPLICATION,
  SKILL_LEVELS,
  STEP_FIELDS
} from '@/app/lib/schemas/camp-application.schema'
import { pageCopy } from '@/app/lib/page-content/copy'
import { pageContent } from '@/app/lib/constants/page-content/camp-application'
import { COLS, DAYS, FieldName, LAST_STEP, STEP_ROWS } from './_constants/camp-application.constants'

export default function CampApplicationClient({
  data
}: {
  data?: {
    content?: unknown
  } | null
}) {
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    trigger,
    reset,
    setError,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<CampApplicationFormInput, unknown, CampApplicationFormValues>({
    resolver: zodResolver(campApplicationSchema),
    defaultValues: EMPTY_CAMP_APPLICATION,
    mode: 'onTouched'
  })

  useEffect(() => {
    setValue('renderedAt', Date.now())
  }, [setValue])

  const { t, msg } = pageCopy(data?.content, pageContent)

  const schedule = DAYS.map((day) => ({
    day,
    date: t(`camp_schedule_${day}_date`),
    time: t(`camp_schedule_${day}_time`),
    items: t(`camp_schedule_${day}_items`).split('\n').filter(Boolean)
  }))

  const stepLabel = (s: (typeof formSteps)[number]) => t(`camp_step_${s.id}_label`)

  const goBack = () => {
    setDirection(-1)
    setStep((current) => current - 1)
  }

  const goNext = async () => {
    const valid = await trigger(STEP_FIELDS[step as keyof typeof STEP_FIELDS])
    if (!valid) return

    setDirection(1)
    setStep((current) => current + 1)
  }

  const onSubmit = async (values: CampApplicationFormValues) => {
    const result = await createCampApplication(values)

    if (!result.success) {
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          setError(field as FieldName, { message: messages[0] })
        }
      }
      setError('root', { message: result.error ?? 'camp_error_generic' })
      return
    }

    reset(EMPTY_CAMP_APPLICATION)
    setSubmitted(true)
  }

  return (
    <main id="main-content">
      <CompactPageHero
        homeLabel={t('camp_hero_home_crumb')}
        breadcrumbLabel={t('camp_sr_breadcrumb')}
        eyebrow={t('camp_hero_overline')}
        breadcrumb={t('camp_hero_breadcrumb')}
        heading={t('camp_hero_heading')}
        description={t('camp_hero_description')}
      />

      <div className="px-4 990:px-12 xl:px-4 py-12">
        <div className="max-w-130 760:max-w-xl 990:max-w-200 1200:max-w-screen-1160 1590:max-w-7xl mx-auto">
          <div className="grid grid-cols-1 990:grid-cols-12 gap-px bg-white/10">
            <aside
              aria-label={t('camp_schedule_aside_label')}
              className="990:col-span-3 bg-black 990:sticky 990:top-6 self-start"
            >
              <div className="border-b border-white/10 px-4 py-2 flex items-center gap-2">
                <div className="w-3 h-px bg-blaze shrink-0" aria-hidden="true" />
                <p className="font-changa text-sm uppercase tracking-[0.25em] text-blaze-text">{t('camp_schedule_heading')}</p>
              </div>

              <div className="p-4 flex flex-col gap-3">
                {schedule.map((day) => (
                  <div key={day.day}>
                    <p className="font-changa text-white text-[13px] leading-none mb-0.5">{day.date}</p>
                    <p className="font-mono text-sm text-blaze-text uppercase tracking-[0.15em] mb-1.5">{day.time}</p>
                    <ul className="flex flex-col gap-1" aria-label={t('camp_schedule_day_label', { date: day.date })}>
                      {day.items.map((item) => (
                        <li key={item} className="flex items-start gap-1.5">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-blaze shrink-0" aria-hidden="true" />
                          <span className="font-lato text-[11px] text-white/70 leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                <div className="pt-2 border-t border-white/10 flex items-start gap-1.5">
                  <Check className="w-3 h-3 text-blaze-text mt-0.5 shrink-0" aria-hidden="true" />
                  <p className="font-lato text-[11px] text-white/60 leading-snug">{t('camp_schedule_requirement')}</p>
                </div>
              </div>
            </aside>

            <div className="990:col-span-9 bg-black flex flex-col">
              {submitted ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="flex flex-col items-center text-center gap-5 px-5 990:px-8 py-20"
                >
                  <div
                    className="w-12 h-12 border border-blaze/30 bg-blaze/10 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <Check className="w-6 h-6 text-blaze-text" />
                  </div>

                  <h2 className="font-changa text-2xl 760:text-3xl text-white">{t('camp_success_heading')}</h2>
                  <p className="font-lato text-base text-white/80 max-w-md leading-relaxed">{t('camp_success_body')}</p>

                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false)
                      setStep(1)
                      setValue('renderedAt', Date.now())
                    }}
                    className="font-lato text-sm text-white/50 hover:text-white/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
                  >
                    {t('camp_success_reset')}
                  </button>
                </div>
              ) : (
                <FormWordsProvider
                  value={{
                    required: t('camp_sr_required'),
                    yes: t('camp_toggle_yes'),
                    no: t('camp_toggle_no'),
                    remaining: t('camp_sr_characters_remaining')
                  }}
                >
                  <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col">
                    <div className="border-b border-white/10 px-5 990:px-8 py-4">
                      <div
                        className="flex items-center max-w-sm mx-auto 990:mx-0"
                        role="list"
                        aria-label={t('camp_steps_list_label')}
                      >
                        {formSteps.map((s, i) => {
                          const Icon = s.icon
                          const done = step > s.id
                          const active = step === s.id

                          return (
                            <div
                              key={s.id}
                              role="listitem"
                              className={`flex items-center ${i < formSteps.length - 1 ? 'flex-1' : ''}`}
                            >
                              <div className="flex flex-col items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (step <= s.id) return
                                    setDirection(-1)
                                    setStep(s.id)
                                  }}
                                  disabled={step <= s.id}
                                  aria-label={t(
                                    done
                                      ? 'camp_step_status_completed'
                                      : active
                                        ? 'camp_step_status_current'
                                        : 'camp_step_status_upcoming',
                                    { step: stepLabel(s) }
                                  )}
                                  aria-current={active ? 'step' : undefined}
                                  className={`w-8 h-8 flex items-center justify-center border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-default ${
                                    done ? 'bg-blaze border-blaze' : active ? 'border-blaze' : 'border-white/20'
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
                                  className={`text-sm font-mono uppercase tracking-wider ${
                                    active ? 'text-white' : done ? 'text-blaze-text' : 'text-white/30'
                                  }`}
                                >
                                  {stepLabel(s)}
                                </span>
                              </div>

                              {i < formSteps.length - 1 && (
                                <div
                                  aria-hidden="true"
                                  className={`flex-1 h-px mx-2 mb-4 transition-all duration-500 ${
                                    step > s.id ? 'bg-blaze' : 'bg-white/10'
                                  }`}
                                />
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="p-5 990:p-8 min-h-90">
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
                          <h2 className="font-changa text-2xl text-white">{t(`camp_step_${step}_heading`)}</h2>

                          {STEP_ROWS[step].map((row, i) => (
                            <div key={i} className={`grid gap-4 ${COLS[row.length]}`}>
                              {row.map((field) => (
                                <FormField
                                  key={field.name}
                                  label={t(`${field.copyId}_label`)}
                                  required={field.required}
                                  error={msg(errors[field.name]?.message)}
                                >
                                  {field.select ? (
                                    <FormSelect {...register(field.name)}>
                                      <option value="" disabled>
                                        {t('camp_level_placeholder')}
                                      </option>
                                      {SKILL_LEVELS.filter(Boolean).map((option) => (
                                        <option key={option} value={option}>
                                          {t(`camp_level_${option.toLowerCase()}`)}
                                        </option>
                                      ))}
                                    </FormSelect>
                                  ) : (
                                    <FormInput
                                      {...register(field.name)}
                                      type={field.type ?? 'text'}
                                      placeholder={field.placeholder ? t(`${field.copyId}_placeholder`) : undefined}
                                    />
                                  )}
                                </FormField>
                              ))}
                            </div>
                          ))}

                          {step === LAST_STEP && (
                            <Controller
                              name="consent"
                              control={control}
                              render={({ field, fieldState }) => (
                                <FormToggle
                                  label={t('camp_consent_label')}
                                  value={field.value}
                                  onChange={field.onChange}
                                  error={msg(fieldState.error?.message)}
                                />
                              )}
                            />
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    <div className="border-t border-white/10 px-5 990:px-8 py-4 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        {step > 1 ? (
                          <button
                            type="button"
                            onClick={goBack}
                            className="flex items-center gap-2 px-4 py-2 text-[11px] font-mono tracking-[0.15em] uppercase text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
                            {t('camp_button_back')}
                          </button>
                        ) : (
                          <div />
                        )}

                        {step < LAST_STEP ? (
                          <button
                            type="button"
                            onClick={goNext}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blaze hover:bg-blazehover text-white font-changa uppercase tracking-widest text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                          >
                            {t('camp_button_continue')}
                            <ChevronRight className="w-4 h-4" aria-hidden="true" />
                          </button>
                        ) : (
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            aria-disabled={isSubmitting}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blaze hover:bg-blazehover text-white font-changa uppercase tracking-widest text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                          >
                            {isSubmitting ? (
                              <>
                                <div
                                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                                  aria-hidden="true"
                                />
                                <span>{t('camp_button_submitting')}</span>
                              </>
                            ) : (
                              <>
                                <span>{t('camp_button_submit')}</span>
                                <Check className="w-4 h-4" aria-hidden="true" />
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      <FormError error={msg(errors.root?.message) || null} />
                    </div>
                  </form>
                </FormWordsProvider>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
