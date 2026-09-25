'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { store, useFormSelector } from '@/app/redux/store'
import { createFormActions, resetForm, setInputs } from '@/app/redux/features/formSlice'
import { subscribeToMailchimp } from '@/app/lib/actions/mailchimp/subscribe'
import validateNewsletterForm from '@/app/lib/validations/validateNewsletterForm'
import { FormError, FormField, FormInput, FormToggle } from '@/app/(public)/_components/FormField'
import { SubmitHandler } from '@/app/types/dom.types'

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

const SECTIONS = [
  { legend: 'Your details', fields: DETAILS },
  { legend: 'Address', fields: ADDRESS }
] as const

const LEGEND = 'font-changa text-xl 760:text-2xl'

export default function NewsletterForm() {
  const { newsletterForm } = useFormSelector()
  const { setErrors, handleInput } = createFormActions('newsletterForm', store.dispatch)

  const inputs = newsletterForm?.inputs
  const errors = newsletterForm?.errors

  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const setField = (data: Record<string, boolean>) => store.dispatch(setInputs({ formName: 'newsletterForm', data }))

  const toggleAll = () => {
    const next = !inputs?.isSelectAll
    setField(Object.fromEntries([['isSelectAll', next], ...INTERESTS.map((i) => [i.name, next])]))
  }

  const handleSubmit: SubmitHandler = async (e) => {
    e.preventDefault()
    setSubmitError(null)

    if (!validateNewsletterForm(inputs, setErrors)) return

    setLoading(true)

    try {
      const { isSelectAll: _isSelectAll, ...payload } = inputs
      await subscribeToMailchimp(payload)
      setSubmitted(true)
      store.dispatch(resetForm('newsletterForm'))
    } catch {
      setSubmitError('We could not add you to the list just then. Please try again in a moment.')
    } finally {
      setLoading(false)
    }
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
          onClick={() => setSubmitted(false)}
          className="font-lato text-sm text-white/50 hover:text-white/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
        >
          Subscribe another email
        </button>
      </motion.div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
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
                <FormField key={name} label={label} required={'required' in rest && rest.required} error={errors?.[name]}>
                  <FormInput {...rest} name={name} value={inputs?.[name]} onChange={handleInput} placeholder={label} />
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
              <FormToggle
                key={name}
                label={label}
                value={inputs?.[name] || false}
                onChange={(val) => setField({ [name]: val })}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={toggleAll}
            aria-pressed={inputs?.isSelectAll || false}
            className="w-fit mt-4 min-h-12 px-4 py-2.5 -ml-4 font-lato text-base font-semibold text-sunburst hover:text-sunbursthover hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunburst focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark"
          >
            {inputs?.isSelectAll ? 'Deselect all' : 'Select all'}
          </button>
        </fieldset>

        <fieldset className="border-0 p-0 m-0">
          <legend className={LEGEND}>About you</legend>

          <div className="mt-4">
            <FormToggle
              label="Are you a new patron of The Pops?"
              value={inputs?.isNewPatron || false}
              onChange={(val) => setField({ isNewPatron: val })}
            />

            <FormToggle
              label="I agree with the storage and handling of my data by this website."
              description="We use your details to send you concert news and updates. We never sell your information."
              value={inputs?.agreedToPrivacyStatement || false}
              onChange={(val) => setField({ agreedToPrivacyStatement: val })}
            />
          </div>

          {errors?.agreedToPrivacyStatement && (
            <p role="alert" className="font-changa text-sm uppercase tracking-widest text-blaze-text mt-3">
              {errors.agreedToPrivacyStatement}
            </p>
          )}
        </fieldset>

        <div className="flex flex-col gap-y-3">
          <button
            type="submit"
            disabled={loading}
            aria-disabled={loading}
            className="bg-blaze/90 hover:bg-blaze disabled:opacity-60 disabled:cursor-not-allowed transition-colors w-full 760:w-40 px-8 py-3.5 font-changa uppercase tracking-widest font-medium text-sm flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            {loading ? (
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

          <FormError error={submitError} />
        </div>
      </div>
    </form>
  )
}
