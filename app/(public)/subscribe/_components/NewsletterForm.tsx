'use client'

import { useEffect, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { subscribeToMailchimp } from '@/app/lib/actions/mailchimp/subscribe'
import { FormError, FormField, FormInput, FormToggle } from '@/app/(public)/_components/FormField'
import {
  EMPTY_NEWSLETTER,
  NewsletterFormInput,
  NewsletterFormValues,
  newsletterSchema
} from '@/app/lib/schemas/newsletter.schema'

const DETAILS = [
  { name: 'firstName', label: 'First name', required: true, autoComplete: 'given-name' },
  { name: 'lastName', label: 'Last name', required: true, autoComplete: 'family-name' },
  { name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email' },
  { name: 'phoneNumber', label: 'Phone number', type: 'tel', autoComplete: 'tel' }
] as const

const ADDRESS = [
  { name: 'addr1', label: 'Address', autoComplete: 'address-line1' },
  { name: 'city', label: 'City', autoComplete: 'address-level2' },
  { name: 'state', label: 'State', autoComplete: 'address-level1' },
  { name: 'zip', label: 'Zip code', autoComplete: 'postal-code', inputMode: 'numeric' }
] as const

const INTERESTS = [
  { name: 'isOption1', label: 'Season tickets' },
  { name: 'isOption2', label: 'Special events' },
  { name: 'isOption3', label: 'Youth education' },
  { name: 'isOption4', label: 'Other' }
] as const

const INTEREST_NAMES = INTERESTS.map((interest) => interest.name)

const SECTIONS = [
  { legend: 'Your details', fields: DETAILS },
  { legend: 'Address', fields: ADDRESS }
] as const

const LEGEND = 'font-changa text-xl 760:text-2xl'

export default function NewsletterForm() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<NewsletterFormInput, unknown, NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: EMPTY_NEWSLETTER
  })

  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    setValue('renderedAt', Date.now())
  }, [setValue])

  const interests = useWatch({ control, name: INTEREST_NAMES })
  const allSelected = interests.every(Boolean)

  const toggleAll = () => {
    INTEREST_NAMES.forEach((name) => setValue(name, !allSelected))
  }

  const onSubmit = async (values: NewsletterFormValues) => {
    const result = await subscribeToMailchimp(values)

    if (!result.success) {
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          setError(field as keyof NewsletterFormInput, { message: messages[0] })
        }
      }
      setError('root', {
        message: result.error ?? 'We could not add you to the list just then. Please try again in a moment.'
      })
      return
    }

    reset(EMPTY_NEWSLETTER)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        role="status"
        aria-live="polite"
        className="flex flex-col items-center justify-center text-center gap-5 py-16 760:py-20 px-5"
      >
        <div className="w-12 h-12 border border-blaze/30 bg-blaze/10 flex items-center justify-center" aria-hidden="true">
          <CheckCircle className="w-6 h-6 text-blaze-text" />
        </div>

        <h3 className="font-changa text-2xl 760:text-3xl text-white">You&apos;re subscribed</h3>
        <p className="font-lato text-base text-white/80 max-w-md leading-relaxed">
          You&apos;re on the list and will be first to hear about concerts, special events and offers.
        </p>

        <Link
          href="/concerts"
          className="bg-blaze hover:bg-blazehover w-fit px-8 py-3.5 font-changa text-sm uppercase font-semibold tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          Check out our concerts
        </Link>

        <button
          type="button"
          onClick={() => {
            setSubmitted(false)
            setValue('renderedAt', Date.now())
          }}
          className="font-lato text-sm text-white/50 hover:text-white/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
        >
          Subscribe another email
        </button>
      </motion.div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Connect with us subscription form"
      className="w-full px-5 760:px-8 990:px-12"
    >
      <div className="max-w-3xl w-full mx-auto py-14 760:py-16 990:py-20 flex flex-col gap-y-12 760:gap-y-14">
        {SECTIONS.map(({ legend, fields }) => (
          <fieldset key={legend} className="border-0 p-0 m-0">
            <legend className={LEGEND}>{legend}</legend>

            <div className="grid 760:grid-cols-2 gap-6 mt-6">
              {fields.map(({ name, label, ...rest }) => (
                <FormField key={name} label={label} required={'required' in rest && rest.required} error={errors[name]?.message}>
                  <FormInput {...rest} {...register(name)} placeholder={label} />
                </FormField>
              ))}
            </div>
          </fieldset>
        ))}

        <fieldset className="border-0 p-0 m-0">
          <legend className={LEGEND}>I&apos;m interested in</legend>
          <p className="font-lato text-base text-white/70 mt-1 leading-relaxed">Choose as many as you like.</p>

          <div className="mt-4">
            {INTERESTS.map(({ name, label }) => (
              <Controller
                key={name}
                name={name}
                control={control}
                render={({ field }) => <FormToggle label={label} value={field.value} onChange={field.onChange} />}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={toggleAll}
            aria-pressed={allSelected}
            className="w-fit mt-4 min-h-12 px-4 py-2.5 -ml-4 font-lato text-base font-semibold text-sunburst hover:text-sunbursthover hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunburst focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark"
          >
            {allSelected ? 'Deselect all' : 'Select all'}
          </button>
        </fieldset>

        <fieldset className="border-0 p-0 m-0">
          <legend className={LEGEND}>About you</legend>

          <div className="mt-4">
            <Controller
              name="isNewPatron"
              control={control}
              render={({ field }) => (
                <FormToggle label="Are you a new patron of The Pops?" value={field.value} onChange={field.onChange} />
              )}
            />

            <Controller
              name="agreedToPrivacyStatement"
              control={control}
              render={({ field, fieldState }) => (
                <FormToggle
                  label="I agree with the storage and handling of my data by this website."
                  description="We use your details to send you concert news and updates. We never sell your information."
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                />
              )}
            />
          </div>
        </fieldset>

        <div className="flex flex-col gap-y-3">
          <button
            type="submit"
            disabled={isSubmitting}
            aria-disabled={isSubmitting}
            className="bg-blaze/90 hover:bg-blaze disabled:opacity-60 disabled:cursor-not-allowed transition-colors w-full 760:w-40 px-8 py-3.5 font-changa uppercase tracking-widest font-medium text-sm flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            {isSubmitting ? (
              <>
                <div
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                  aria-hidden="true"
                />
                <span className="sr-only">Submitting, please wait</span>
              </>
            ) : (
              'Submit'
            )}
          </button>

          <FormError error={errors.root?.message ?? null} />
        </div>
      </div>
    </form>
  )
}
