import { FC, useState } from 'react'
import { store, useFormSelector } from '@/app/redux/store'
import { createFormActions, resetForm } from '@/app/redux/features/formSlice'
import validateContactForm from '@/app/lib/validations/validateContactForm'
import { showToast } from '@/app/redux/features/toastSlice'
import { createQuestion } from '@/app/lib/actions/question/createQuestion'
import { setOpenContactSubmissionSuccessModal } from '@/app/redux/features/uiSlice'
import { ArrowRightIcon, Loader2 } from 'lucide-react'

const Input = ({ name, value, handleInput, placeholder, error, required, type = 'text' }) => (
  <div className="flex flex-col w-full">
    <label htmlFor={name} className="font-changa text-[11px] uppercase tracking-[0.25em] text-white/60 mb-2">
      {placeholder}
      {required && (
        <span className="text-blaze-text ml-1" aria-hidden="true">
          *
        </span>
      )}
      {required && <span className="sr-only"> (required)</span>}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value || ''}
      onChange={handleInput}
      placeholder={placeholder}
      required={required}
      aria-required={required}
      aria-invalid={!!error}
      aria-describedby={error ? `${name}-error` : undefined}
      className={`bg-transparent border-b font-lato text-sm text-white placeholder:text-white/40 py-3 w-full focus:outline-none focus-visible:outline-none transition-colors duration-200 ${
        error
          ? 'border-blaze placeholder:text-blaze-text/40'
          : 'border-white/20 hover:border-white/40 focus:border-blaze'
      }`}
    />
    {error && (
      <p
        id={`${name}-error`}
        role="alert"
        className="font-changa text-[11px] uppercase tracking-widest text-blaze-text mt-2"
      >
        {error}
      </p>
    )}
  </div>
)

const Textarea: FC<{
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder: string
  error?: string
  required?: boolean
  rows?: number
  maxLength?: number
}> = ({ name, value, onChange, placeholder, error, required, rows = 4, maxLength }) => (
  <div className="flex flex-col w-full">
    <label htmlFor={name} className="font-changa text-[11px] uppercase tracking-[0.25em] text-white/60 mb-2">
      {placeholder}
      {required && (
        <>
          <span className="text-blaze-text ml-1" aria-hidden="true">
            *
          </span>
          <span className="sr-only"> (required)</span>
        </>
      )}
    </label>
    <textarea
      id={name}
      name={name}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      aria-required={required}
      aria-invalid={!!error}
      aria-describedby={error ? `${name}-error` : undefined}
      rows={rows}
      maxLength={maxLength}
      className={`bg-transparent border-b font-lato text-sm text-white placeholder:text-white/40 py-3 w-full focus:outline-none transition-colors duration-200 resize-none ${
        error
          ? 'border-blaze placeholder:text-blaze-text/40'
          : 'border-white/20 hover:border-white/40 focus:border-blaze'
      }`}
    />
    {error && (
      <p
        id={`${name}-error`}
        role="alert"
        aria-live="polite"
        className="font-changa text-[11px] uppercase tracking-widest text-blaze-text mt-2"
      >
        {error}
      </p>
    )}
  </div>
)

const ContactForm: FC<{ btnClassname?: string }> = ({ btnClassname }) => {
  const { questionForm } = useFormSelector()
  const { handleInput, setErrors } = createFormActions('questionForm', store.dispatch)
  const [loading, setLoading] = useState(false)
  const inputs = questionForm?.inputs
  const errors = questionForm?.errors

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!validateContactForm(inputs, setErrors)) return

    if (inputs.message.length > 500) {
      setErrors({ message: 'Message must be 500 characters or less' })
      return
    }

    setLoading(true)

    const res = await createQuestion({
      name: inputs.name,
      email: inputs.email,
      message: inputs.message
    })

    setLoading(false)

    if (res.success) {
      store.dispatch(setOpenContactSubmissionSuccessModal())
      store.dispatch(resetForm('questionForm'))
    } else {
      store.dispatch(showToast({ type: 'error', message: res.error ?? 'Failed to transmit question' }))
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-12 gap-y-8 990:gap-8 w-full max-w-3xl"
      noValidate
      aria-label="Contact question form"
    >
      <div className="col-span-12 990:col-span-6">
        <Input
          name="name"
          value={inputs?.name}
          handleInput={handleInput}
          placeholder="Your Name"
          required
          error={errors?.name}
        />
      </div>
      <div className="col-span-12 990:col-span-6">
        <Input
          name="email"
          type="email"
          value={inputs?.email}
          handleInput={handleInput}
          placeholder="Your Email"
          required
          error={errors?.email}
        />
      </div>
      <div className="col-span-12">
        <Textarea
          name="message"
          value={inputs?.message}
          onChange={handleInput}
          placeholder="Ask your question here..."
          required
          error={errors?.message}
          maxLength={500}
        />
        <div className="flex items-center justify-end mt-1.5">
          <span
            className={`font-changa text-[11px] tracking-widest transition-colors ${
              (inputs?.message?.length ?? 0) >= 500
                ? 'text-red-400'
                : (inputs?.message?.length ?? 0) > 450
                  ? 'text-yellow-400'
                  : 'text-white/40'
            }`}
          >
            {inputs?.message?.length ?? 0}/500
          </span>
        </div>
      </div>
      <div className={`col-span-12 flex items-center ${btnClassname ?? 'justify-center'} mt-6`}>
        <button
          type="submit"
          disabled={loading}
          aria-disabled={loading}
          aria-label={loading ? 'Submitting your question, please wait' : 'Submit your question'}
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
              <ArrowRightIcon
                className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default ContactForm
