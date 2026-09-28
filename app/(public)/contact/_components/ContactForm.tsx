'use client'

import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRightIcon, CheckCircle, Loader2 } from 'lucide-react'
import { createQuestion } from '@/app/lib/actions/question/createQuestion'
import { CharCount, FormError, FormField, FormInput, FormTextarea } from '@/app/(public)/_components/FormField'
import { EMPTY_QUESTION, QuestionFormInput, QuestionFormValues, questionSchema } from '@/app/lib/schemas/question.schema'

const MAX_MESSAGE = 500

export function ContactForm({ btnClassName }: { btnClassName?: string }) {
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
      setError('root', { message: result.error ?? 'Something went wrong. Please try again.' })
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

        <h3 className="font-changa text-2xl text-white">Thanks, we got it</h3>
        <p className="font-lato text-base text-white/80 max-w-md leading-relaxed">
          Someone from The Pops will get back to you shortly.
        </p>

        <button
          type="button"
          onClick={() => {
            setSuccess(false)
            setValue('renderedAt', Date.now())
          }}
          className="font-lato text-sm text-white/50 hover:text-white/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
        >
          Ask another question
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Contact question form"
      className="grid grid-cols-12 gap-y-8 990:gap-8 w-full max-w-3xl"
    >
      <div className="col-span-12 990:col-span-6">
        <FormField label="Your name" required error={errors.name?.message}>
          <FormInput {...register('name')} placeholder="Your name" autoComplete="name" />
        </FormField>
      </div>

      <div className="col-span-12 990:col-span-6">
        <FormField label="Your email" required error={errors.email?.message}>
          <FormInput {...register('email')} type="email" placeholder="Your email" autoComplete="email" />
        </FormField>
      </div>

      <div className="col-span-12">
        <FormField label="Your question" required error={errors.message?.message}>
          <FormTextarea {...register('message')} placeholder="Ask your question here..." rows={4} maxLength={MAX_MESSAGE} />
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
              <span aria-hidden="true">Submitting...</span>
              <span className="sr-only">Submitting your question, please wait</span>
            </>
          ) : (
            <>
              <span>Submit</span>
              <ArrowRightIcon className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </>
          )}
        </button>

        <FormError error={errors.root?.message ?? null} />
      </div>
    </form>
  )
}
