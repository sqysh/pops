'use client'

import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRightIcon, CheckCircle, Loader2 } from 'lucide-react'
import { pageCopy } from '@/app/lib/page-content/copy'
import { pageContent } from '@/app/lib/constants/page-content/contact'
import { createQuestion } from '@/app/lib/actions/question/createQuestion'
import { CharCount, FormError, FormField, FormInput, FormTextarea, FormWordsProvider } from '@/app/(public)/_components/FormField'
import { EMPTY_QUESTION, QuestionFormInput, QuestionFormValues, questionSchema } from '@/app/lib/schemas/question.schema'

const MAX_MESSAGE = 500

export function ContactForm({ btnClassName, content }: { btnClassName?: string; content: unknown }) {
  const { t, msg } = pageCopy(content, pageContent)
  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<QuestionFormInput, unknown, QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: EMPTY_QUESTION
  })

  const [success, setSuccess] = useState(false)

  useEffect(() => {
    setValue('renderedAt', Date.now())
  }, [setValue])

  const message = useWatch({ control, name: 'message' }) ?? ''

  const onSubmit = async (values: QuestionFormValues) => {
    const result = await createQuestion(values)

    if (!result.success) {
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          setError(field as keyof QuestionFormInput, { message: messages[0] })
        }
      }
      setError('root', { message: result.error ?? 'contact_error_message' })
      return
    }

    reset(EMPTY_QUESTION)
    setSuccess(true)
  }

  if (success) {
    return (
      <div role="status" aria-live="polite" className="flex flex-col items-center text-center gap-4 w-full max-w-3xl py-12">
        <div className="w-12 h-12 border border-blaze/30 bg-blaze/10 flex items-center justify-center" aria-hidden="true">
          <CheckCircle className="w-6 h-6 text-blaze-text" />
        </div>

        <h3 className="font-changa text-2xl text-white">{t('contact_success_heading')}</h3>
        <p className="font-lato text-base text-white/80 max-w-md leading-relaxed">{t('contact_success_message')}</p>

        <button
          type="button"
          onClick={() => {
            setSuccess(false)
            setValue('renderedAt', Date.now())
          }}
          className="font-lato text-sm text-white/50 hover:text-white/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
        >
          {t('contact_success_reset')}
        </button>
      </div>
    )
  }

  return (
    <FormWordsProvider
      value={{
        required: t('contact_sr_required'),
        yes: t('contact_toggle_yes'),
        no: t('contact_toggle_no'),
        remaining: t('contact_sr_characters_remaining')
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        aria-label={t('contact_sr_form_label')}
        className="grid grid-cols-12 gap-y-8 990:gap-8 w-full max-w-3xl"
      >
        <div className="col-span-12 990:col-span-6">
          <FormField label={t('contact_name_label')} required error={msg(errors.name?.message)}>
            <FormInput {...register('name')} placeholder={t('contact_name_placeholder')} autoComplete="name" />
          </FormField>
        </div>

        <div className="col-span-12 990:col-span-6">
          <FormField label={t('contact_email_label')} required error={msg(errors.email?.message)}>
            <FormInput {...register('email')} type="email" placeholder={t('contact_email_placeholder')} autoComplete="email" />
          </FormField>
        </div>

        <div className="col-span-12">
          <FormField label={t('contact_question_label')} required error={msg(errors.message?.message)}>
            <FormTextarea
              {...register('message')}
              placeholder={t('contact_question_placeholder')}
              rows={4}
              maxLength={MAX_MESSAGE}
            />
          </FormField>

          <CharCount value={message} max={MAX_MESSAGE} />
        </div>

        <div className={`col-span-12 flex flex-col gap-4 mt-6 ${btnClassName ?? 'items-center'}`}>
          <button
            type="submit"
            disabled={isSubmitting}
            aria-disabled={isSubmitting}
            className="group inline-flex items-center gap-3 bg-blaze hover:bg-blazehover text-white px-8 py-4 font-changa text-sm uppercase tracking-widest transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
                <span aria-hidden="true">{t('contact_submitting_text')}</span>
                <span className="sr-only">{t('contact_sr_submitting')}</span>
              </>
            ) : (
              <>
                <span>{t('contact_submit_button')}</span>
                <ArrowRightIcon className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </>
            )}
          </button>

          <FormError error={msg(errors.root?.message) || null} />
        </div>
      </form>
    </FormWordsProvider>
  )
}
