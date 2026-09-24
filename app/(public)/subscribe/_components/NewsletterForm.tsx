import { store, useFormSelector, useMailchimpSelector } from '@/app/redux/store'
import { createFormActions, resetForm, setInputs } from '@/app/redux/features/formSlice'
import Link from 'next/link'
import validateNewsletterForm from '@/app/lib/validations/validateNewsletterForm'
import { ChangeEvent, FC, useState } from 'react'
import { subscribeToMailchimp } from '@/app/lib/actions/mailchimp/subscribe'
import { motion } from 'framer-motion'
import { AlertCircle, Check, CheckCircle } from 'lucide-react'

interface InputProps {
  name: string
  value: string
  handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  label?: string
  hint?: string
  autoComplete?: string
  error?: string
  required?: boolean
  type?: 'text' | 'email' | 'tel' | 'password' | 'number' | 'url'
}

interface SwitchProps {
  enabled: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  name: string
  label: string
  description?: string
  required?: boolean
  error?: string
}

const AUTOCOMPLETE_MAP: Record<string, string> = {
  firstName: 'given-name',
  lastName: 'family-name',
  email: 'email',
  phoneNumber: 'tel',
  addr1: 'address-line1',
  addr2: 'address-line2',
  city: 'address-level2',
  state: 'address-level1',
  zip: 'postal-code'
}

const INPUT_MODE_MAP: Record<string, 'email' | 'tel' | 'numeric'> = {
  email: 'email',
  tel: 'tel'
}

const Switch = ({ enabled, onChange, name, label, description }: SwitchProps) => (
  <button
    type="button"
    role="switch"
    id={name}
    aria-checked={enabled}
    onClick={(e) => {
      e.stopPropagation()
      onChange?.({ target: { checked: !enabled, name } } as any)
    }}
    className="group flex items-center gap-4 w-full min-h-14 text-left px-3 -mx-3 py-3 rounded-sm cursor-pointer transition-colors duration-200 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark"
  >
    <span
      className={`relative shrink-0 w-16 h-9 border-2 rounded-full transition-colors duration-200 motion-reduce:transition-none ${
        enabled ? 'bg-blaze border-blaze' : 'bg-white/10 border-white/40 group-hover:border-white/60'
      }`}
      aria-hidden="true"
    >
      <span
        className={`absolute top-1 left-1 w-6 h-6 rounded-full shadow-md flex items-center justify-center transition-transform duration-200 motion-reduce:transition-none ${
          enabled ? 'translate-x-7 bg-white' : 'translate-x-0 bg-white/80'
        }`}
      >
        {enabled && <Check className="w-4 h-4 text-blaze" strokeWidth={3} />}
      </span>
    </span>

    <span className="flex flex-col gap-0.5">
      <span className="font-lato text-base 760:text-lg font-semibold text-white leading-snug">{label}</span>
      {description && <span className="font-lato text-sm text-white/70 leading-relaxed">{description}</span>}
    </span>

    <span
      aria-hidden="true"
      className={`ml-auto shrink-0 font-lato text-sm font-semibold transition-colors duration-200 ${
        enabled ? 'text-white' : 'text-white/50'
      }`}
    >
      {enabled ? 'Yes' : 'No'}
    </span>
  </button>
)

const Input: FC<InputProps> = ({
  name,
  value,
  handleInput,
  placeholder,
  label,
  hint,
  error,
  required,
  autoComplete,
  type = 'text'
}) => {
  const fieldLabel = label ?? placeholder

  return (
    <div className="flex flex-col w-full">
      <label htmlFor={name} className="font-lato text-base 760:text-lg font-semibold text-white mb-2 leading-snug">
        {fieldLabel}
        {required && (
          <>
            <span className="text-blaze-text ml-1.5" aria-hidden="true">
              *
            </span>
            <span className="sr-only"> (required)</span>
          </>
        )}
      </label>

      {hint && (
        <p id={`${name}-hint`} className="font-lato text-sm 760:text-base text-white/70 mb-2 leading-relaxed">
          {hint}
        </p>
      )}

      <input
        id={name}
        name={name}
        type={type}
        value={value || ''}
        onChange={handleInput}
        required={required}
        autoComplete={autoComplete ?? AUTOCOMPLETE_MAP[name] ?? 'on'}
        inputMode={INPUT_MODE_MAP[type] ?? (name === 'zip' ? 'numeric' : undefined)}
        autoCapitalize={type === 'email' ? 'off' : undefined}
        spellCheck={type === 'email' ? false : undefined}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={[hint && `${name}-hint`, error && `${name}-error`].filter(Boolean).join(' ') || undefined}
        className={`bg-white/5 border-2 rounded-sm font-lato text-base 760:text-lg text-white w-full px-4 py-3.5 min-h-14 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark ${
          error ? 'border-blaze bg-blaze/5' : 'border-white/30 hover:border-white/50 focus:border-blaze'
        }`}
      />

      {error && (
        <p
          id={`${name}-error`}
          role="alert"
          className="flex items-start gap-2 font-lato text-base font-semibold text-blaze-text mt-2 leading-snug"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}

const NewsletterForm = () => {
  const { success } = useMailchimpSelector()
  const { newsletterForm } = useFormSelector()
  const { setErrors, handleInput, handleToggle } = createFormActions('newsletterForm', store.dispatch)
  const inputs = newsletterForm?.inputs
  const errors = newsletterForm?.errors
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const selectAllSwitches = () => {
    store.dispatch(
      setInputs({
        formName: 'newsletterForm',
        data: {
          isSelectAll: !inputs?.isSelectAll,
          isOption1: inputs?.isSelectAll ? false : true,
          isOption2: inputs?.isSelectAll ? false : true,
          isOption3: inputs?.isSelectAll ? false : true,
          isOption4: inputs?.isSelectAll ? false : true
        }
      })
    )
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setSubmitError(null)

    const isValid = validateNewsletterForm(newsletterForm?.inputs, setErrors)
    if (!isValid) return

    try {
      setLoading(true)
      await subscribeToMailchimp({
        firstName: inputs.firstName,
        lastName: inputs.lastName,
        email: inputs.email,
        phoneNumber: inputs.phoneNumber,
        addr1: inputs.addr1,
        city: inputs.city,
        state: inputs.state,
        zip: inputs.zip,
        isOption1: inputs.isOption1,
        isOption2: inputs.isOption2,
        isOption3: inputs.isOption3,
        isOption4: inputs.isOption4,
        isNewPatron: inputs.isNewPatron,
        agreedToPrivacyStatement: inputs.agreedToPrivacyStatement
      })

      setSubmitted(true)
      store.dispatch(resetForm('newsletterForm'))
    } catch {
      setSubmitError('Failed to subscribe. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  // Success state
  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center text-center py-16 gap-4"
        role="status"
        aria-live="polite"
      >
        <div
          className="w-12 h-12 border border-blaze/30 bg-blaze/10 flex items-center justify-center mb-2"
          aria-hidden="true"
        >
          <CheckCircle className="w-6 h-6 text-blaze-text" />
        </div>
        <h3 className="font-changa text-2xl text-white">You&apos;re subscribed!</h3>
        <p className="font-lato text-white/80 text-sm max-w-sm leading-relaxed">
          Thank you for subscribing to The Pops Orchestra newsletter. We&apos;ll be in touch soon.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-2 text-sm font-mono uppercase tracking-[0.15em] text-white/40 hover:text-white/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
        >
          Subscribe another email
        </button>
      </motion.div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full px-5 760:px-8 990:px-12"
      noValidate
      aria-label="Connect with us subscription form"
    >
      <div className="max-w-3xl w-full mx-auto py-14 760:py-16 990:py-20">
        {success ? (
          <section
            aria-live="polite"
            aria-atomic="true"
            className="flex flex-col justify-center items-center gap-y-8 760:gap-y-10 py-10 760:py-16"
          >
            <h2 className="text-center max-w-xl font-changa text-xl 760:text-2xl font-medium leading-relaxed">
              Thanks for subscribing! You&apos;re officially on the list and will be the first to hear about our latest
              updates, concerts, and exclusive offers.
            </h2>
            <Link
              href="/concerts"
              className="bg-blaze w-fit px-8 py-3.5 text-12 uppercase font-changa font-semibold tracking-wider duration-300 hover:bg-blazehover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Check out our concerts
            </Link>
          </section>
        ) : (
          <div className="flex flex-col gap-y-12 760:gap-y-14 w-full relative">
            <fieldset className="flex flex-col gap-y-6 border-0 p-0 m-0">
              <legend className="font-changa text-xl 760:text-2xl">User Details</legend>
              <div className="flex flex-col 760:flex-row gap-y-6 760:gap-y-0 760:gap-x-6">
                <Input
                  name="firstName"
                  value={inputs?.firstName}
                  handleInput={handleInput}
                  placeholder="First Name"
                  required
                  error={errors?.firstName}
                  aria-required="true"
                  aria-describedby={errors?.firstName ? 'firstName-error' : undefined}
                />
                <Input
                  name="lastName"
                  value={inputs?.lastName}
                  handleInput={handleInput}
                  placeholder="Last Name"
                  required
                  error={errors?.lastName}
                  aria-required="true"
                  aria-describedby={errors?.lastName ? 'lastName-error' : undefined}
                />
              </div>
              <div className="flex flex-col 760:flex-row gap-y-6 760:gap-y-0 760:gap-x-6">
                <Input
                  name="email"
                  value={inputs?.email}
                  handleInput={handleInput}
                  placeholder="Email"
                  type="email"
                  required
                  error={errors?.email}
                  aria-required="true"
                  aria-describedby={errors?.email ? 'email-error' : undefined}
                />
                <Input
                  name="phoneNumber"
                  value={inputs?.phoneNumber}
                  handleInput={handleInput}
                  placeholder="Phone number"
                  type="tel"
                />
              </div>
            </fieldset>

            <fieldset className="flex flex-col gap-y-6 border-0 p-0 m-0">
              <legend className="font-changa text-xl 760:text-2xl">Address</legend>
              <div className="flex flex-col 760:flex-row gap-y-6 760:gap-y-0 760:gap-x-6">
                <Input name="addr1" value={inputs?.addr1} handleInput={handleInput} placeholder="Address line 1" />
                <Input name="city" value={inputs?.city} handleInput={handleInput} placeholder="City" />
              </div>
              <div className="flex flex-col 760:flex-row gap-y-6 760:gap-y-0 760:gap-x-6">
                <Input name="state" value={inputs?.state} handleInput={handleInput} placeholder="State" />
                <Input name="zip" value={inputs?.zip} handleInput={handleInput} placeholder="Zip code" />
              </div>
            </fieldset>

            <fieldset className="flex flex-col border-0 p-0 m-0">
              <legend className="font-changa text-xl 760:text-2xl mb-1">I&apos;m interested in:</legend>
              <p className="font-lato text-sm 760:text-base text-white/70 mb-3 leading-relaxed">
                Choose as many as you like.
              </p>

              <div className="flex flex-col gap-y-1">
                <Switch
                  enabled={inputs?.isOption1 || false}
                  onChange={handleToggle}
                  name="isOption1"
                  label="Season Tickets"
                />
                <Switch
                  enabled={inputs?.isOption2 || false}
                  onChange={handleToggle}
                  name="isOption2"
                  label="Special Events"
                />
                <Switch
                  enabled={inputs?.isOption3 || false}
                  onChange={handleToggle}
                  name="isOption3"
                  label="Youth Education"
                />
                <Switch enabled={inputs?.isOption4 || false} onChange={handleToggle} name="isOption4" label="Other" />
              </div>

              <button
                type="button"
                onClick={() => selectAllSwitches()}
                aria-pressed={inputs?.isSelectAll || false}
                className="w-fit mt-4 min-h-12 px-4 py-2.5 -ml-4 rounded-sm font-lato text-base font-semibold text-sunburst hover:text-sunbursthover hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunburst focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark"
              >
                {inputs?.isSelectAll ? 'Deselect all' : 'Select all'}
              </button>
            </fieldset>

            <fieldset className="flex flex-col border-0 p-0 m-0">
              <legend className="font-changa text-xl 760:text-2xl mb-3">New Patron</legend>
              <Switch
                enabled={inputs?.isNewPatron || false}
                onChange={handleToggle}
                name="isNewPatron"
                label="Are you a new patron of The Pops?"
              />
            </fieldset>

            <fieldset className="flex flex-col border-0 p-0 m-0">
              <legend className="font-changa text-xl 760:text-2xl mb-3">Privacy</legend>
              <Switch
                enabled={inputs?.agreedToPrivacyStatement || false}
                onChange={handleToggle}
                name="agreedToPrivacyStatement"
                label="I agree with the storage and handling of my data by this website."
                description="We use your details to send you concert news and updates. We never sell your information."
                required
                error={errors?.agreedToPrivacyStatement}
              />
            </fieldset>

            <div className="flex flex-col gap-y-3 mt-2">
              <button
                type="submit"
                disabled={loading}
                aria-disabled={loading}
                aria-label={loading ? 'Submitting form, please wait' : 'Submit form'}
                className="bg-blaze/90 hover:bg-blaze disabled:opacity-60 disabled:cursor-not-allowed duration-300 w-full 760:w-40 px-8 py-3.5 font-changa uppercase tracking-wider font-medium text-sm flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black cursor-pointer"
              >
                {loading ? (
                  <>
                    <div
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                      aria-hidden="true"
                    />
                    <span className="sr-only">Submitting, please wait...</span>
                  </>
                ) : (
                  'Submit'
                )}
              </button>

              {submitError && (
                <p className="text-sm font-mono text-blaze-text" role="alert">
                  {submitError}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </form>
  )
}

export default NewsletterForm
