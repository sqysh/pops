'use client'

import { useState } from 'react'
import { ArrowRightIcon, Loader2 } from 'lucide-react'
import { store, useFormSelector } from '@/app/redux/store'
import { createFormActions, resetForm } from '@/app/redux/features/formSlice'
import { setOpenContactSubmissionSuccessModal } from '@/app/redux/features/uiSlice'
import { createQuestion } from '@/app/lib/actions/question/createQuestion'
import validateContactForm from '@/app/lib/validations/validateContactForm'
import { CharCount, FormError, FormField, FormInput, FormTextarea } from '@/app/(public)/_components/FormField'

type SubmitHandler = NonNullable<React.ComponentProps<'form'>['onSubmit']>

const MAX_MESSAGE = 500

export function ContactForm({ btnClassName }: { btnClassName?: string }) {
  const { questionForm } = useFormSelector()
  const { handleInput, setErrors } = createFormActions('questionForm', store.dispatch)

  const inputs = questionForm?.inputs
  const errors = questionForm?.errors

  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleSubmit: SubmitHandler = async (e) => {
    e.preventDefault()
    setSubmitError(null)

    if (!validateContactForm(inputs, setErrors)) return

    setLoading(true)

    try {
      const res = await createQuestion({
        name: inputs.name,
        email: inputs.email,
        message: inputs.message
      })

      if (res.success) {
        store.dispatch(setOpenContactSubmissionSuccessModal())
        store.dispatch(resetForm('questionForm'))
      } else {
        setSubmitError(res.error ?? 'Your question could not be sent. Please try again in a moment.')
      }
    } catch {
      setSubmitError('Your question could not be sent. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Contact question form"
      className="grid grid-cols-12 gap-y-8 990:gap-8 w-full max-w-3xl"
    >
      <div className="col-span-12 990:col-span-6">
        <FormField label="Your name" required error={errors?.name}>
          <FormInput name="name" value={inputs?.name} onChange={handleInput} placeholder="Your name" />
        </FormField>
      </div>

      <div className="col-span-12 990:col-span-6">
        <FormField label="Your email" required error={errors?.email}>
          <FormInput
            name="email"
            type="email"
            value={inputs?.email}
            onChange={handleInput}
            placeholder="Your email"
            autoComplete="email"
          />
        </FormField>
      </div>

      <div className="col-span-12">
        <FormField label="Your question" required error={errors?.message}>
          <FormTextarea
            name="message"
            value={inputs?.message}
            onChange={handleInput}
            placeholder="Ask your question here..."
            rows={4}
            maxLength={MAX_MESSAGE}
          />
        </FormField>

        <CharCount value={inputs?.message ?? ''} max={MAX_MESSAGE} />
      </div>

      <div className={`col-span-12 flex flex-col gap-4 mt-6 ${btnClassName ?? 'items-center'}`}>
        <button
          type="submit"
          disabled={loading}
          aria-disabled={loading}
          className="group inline-flex items-center gap-3 bg-blaze hover:bg-blazehover text-white px-8 py-4 font-changa text-sm uppercase tracking-widest transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
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

        <FormError error={submitError} />
      </div>
    </form>
  )
}
