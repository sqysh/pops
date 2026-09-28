'use client'

import { createContext, useContext, useId } from 'react'
import { AlertCircle } from 'lucide-react'

/**
 * One definition of a public form control, shared by input, textarea and select
 * so contact and newsletter never drift apart.
 */
const FIELD =
  'w-full bg-transparent border-b font-lato text-base text-white placeholder:text-white/40 py-3 min-h-12 transition-colors duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed'

const FIELD_NORMAL = 'border-white/20 hover:border-white/40 focus:border-blaze'
const FIELD_ERROR = 'border-blaze placeholder:text-blaze-text/40'

export const LABEL = 'font-changa text-sm uppercase tracking-[0.25em] text-white/60'

interface FieldContextValue {
  id: string
  describedBy?: string
  hasError: boolean
}

const FieldContext = createContext<FieldContextValue | null>(null)

const useField = (ownId?: string) => {
  const ctx = useContext(FieldContext)
  const fallbackId = useId()

  return {
    id: ownId ?? ctx?.id ?? fallbackId,
    describedBy: ctx?.describedBy,
    hasError: ctx?.hasError ?? false
  }
}

const fieldClass = (hasError: boolean, className?: string) =>
  `${FIELD} ${hasError ? FIELD_ERROR : FIELD_NORMAL} ${className ?? ''}`

export function FormField({
  label,
  htmlFor,
  required,
  hint,
  error,
  children
}: {
  label: string
  htmlFor?: string
  required?: boolean
  /** Shown under the label, before the control. For guidance, not errors. */
  hint?: React.ReactNode
  error?: string | null
  children: React.ReactNode
}) {
  const generatedId = useId()
  const id = htmlFor ?? generatedId
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <FieldContext.Provider value={{ id, describedBy, hasError: !!error }}>
      <div className="flex flex-col w-full">
        <label htmlFor={id} className={`${LABEL} mb-2`}>
          {label}
          {required && (
            <>
              <span className="text-blaze-text ml-1" aria-hidden="true">
                *
              </span>
              <span className="sr-only"> (required)</span>
            </>
          )}
        </label>

        {hint && (
          <p id={hintId} className="font-lato text-sm text-white/70 mb-2 leading-relaxed">
            {hint}
          </p>
        )}

        {children}

        {error && (
          <p
            id={errorId}
            role="alert"
            className="flex items-start gap-2 font-changa text-sm uppercase tracking-widest text-blaze-text mt-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{error}</span>
          </p>
        )}
      </div>
    </FieldContext.Provider>
  )
}

export function FormInput({ className, id, type = 'text', ...props }: React.ComponentProps<'input'>) {
  const field = useField(id)

  return (
    <input
      {...props}
      id={field.id}
      type={type}
      autoCapitalize={type === 'email' ? 'off' : props.autoCapitalize}
      spellCheck={type === 'email' ? false : props.spellCheck}
      aria-invalid={field.hasError || undefined}
      aria-describedby={props['aria-describedby'] ?? field.describedBy}
      className={fieldClass(field.hasError, className)}
    />
  )
}

export function FormTextarea({ className, id, rows = 4, ...props }: React.ComponentProps<'textarea'>) {
  const field = useField(id)

  return (
    <textarea
      {...props}
      id={field.id}
      rows={rows}
      aria-invalid={field.hasError || undefined}
      aria-describedby={props['aria-describedby'] ?? field.describedBy}
      className={`${fieldClass(field.hasError, className)} resize-none`}
    />
  )
}

export function FormSelect({ className, id, children, ...props }: React.ComponentProps<'select'>) {
  const field = useField(id)

  return (
    <select
      {...props}
      id={field.id}
      aria-invalid={field.hasError || undefined}
      aria-describedby={props['aria-describedby'] ?? field.describedBy}
      className={`${fieldClass(field.hasError, className)} cursor-pointer [&>option]:bg-black [&>option]:text-white`}
    >
      {children}
    </select>
  )
}

/** A form-wide error, for something that is not tied to one field. */
export function FormError({ error }: { error: string | null }) {
  if (!error) return null

  return (
    <p role="alert" className="flex items-start gap-2 font-lato text-base text-blaze-text">
      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
      <span className="leading-relaxed">{error}</span>
    </p>
  )
}

export function CharCount({ value, max }: { value: string; max: number }) {
  const used = value.length
  const tone = used >= max ? 'text-blaze-text' : used > max * 0.9 ? 'text-sunburst' : 'text-white/40'

  return (
    <div className="flex justify-end mt-2">
      <span aria-live="polite" className={`font-changa text-sm tracking-widest transition-colors ${tone}`}>
        <span className="sr-only">{max - used} characters remaining, </span>
        {used}/{max}
      </span>
    </div>
  )
}

export function FormToggle({
  label,
  description,
  value,
  onChange,
  disabled,
  error
}: {
  label: string
  description?: string
  value: boolean
  onChange: (val: boolean) => void
  disabled?: boolean
  error?: string | null
}) {
  const id = useId()
  const errorId = error ? `${id}-error` : undefined

  return (
    <div className="flex flex-col w-full">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={value}
        aria-invalid={!!error || undefined}
        aria-describedby={errorId}
        disabled={disabled}
        onClick={() => onChange(!value)}
        className={`group flex items-center gap-5 w-full min-h-14 text-left py-4 border-b cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:border-blaze ${
          error ? 'border-blaze' : 'border-white/20 hover:border-white/40'
        }`}
      >
        <span
          aria-hidden="true"
          className={`relative shrink-0 w-12 h-6 border transition-colors duration-200 ${
            value ? 'bg-blaze border-blaze' : 'bg-transparent border-white/30 group-hover:border-white/50'
          }`}
        >
          <span
            className={`absolute top-0.75 left-0.5 w-4 h-4 transition-transform duration-200 motion-reduce:transition-none ${
              value ? 'translate-x-6 bg-white' : 'translate-x-0 bg-white/60'
            }`}
          />
        </span>

        <span className="flex flex-col gap-1 min-w-0">
          <span className="font-lato text-base 760:text-lg text-white leading-snug">{label}</span>
          {description && <span className="font-lato text-sm text-white/60 leading-relaxed">{description}</span>}
        </span>

        <span
          aria-hidden="true"
          className={`ml-auto shrink-0 font-changa text-sm uppercase tracking-[0.25em] transition-colors duration-200 ${
            value ? 'text-white' : 'text-white/40'
          }`}
        >
          {value ? 'Yes' : 'No'}
        </span>
      </button>

      {error && (
        <p
          id={errorId}
          role="alert"
          className="flex items-start gap-2 font-changa text-sm uppercase tracking-widest text-blaze-text mt-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}
