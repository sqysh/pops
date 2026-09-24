'use client'

import { createContext, useContext, useId } from 'react'
import { AlertCircle, Check } from 'lucide-react'

/**
 * One definition of a form control's look, shared by input, textarea and select
 * so a form never has three slightly different boxes in it.
 */
const FIELD =
  'w-full bg-white border px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus:outline-none focus:ring-2 disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed'

const FIELD_NORMAL = 'border-neutral-300 focus:border-blaze focus:ring-blaze'
const FIELD_ERROR = 'border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-red-500'

export const LABEL = 'text-xs font-medium uppercase tracking-wide text-neutral-500'

/**
 * Lets a control find the ids and error its FormField created, so labelling and
 * description stay correct without every call site repeating the plumbing.
 */
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
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className={LABEL}>
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
          <p id={hintId} className="text-neutral-600 leading-relaxed">
            {hint}
          </p>
        )}

        {children}

        {error && (
          <p id={errorId} role="alert" className="flex items-start gap-1.5 text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{error}</span>
          </p>
        )}
      </div>
    </FieldContext.Provider>
  )
}

export function FormInput({ className, id, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  const field = useField(id)

  return (
    <input
      {...props}
      id={field.id}
      aria-invalid={field.hasError || undefined}
      aria-describedby={props['aria-describedby'] ?? field.describedBy}
      className={fieldClass(field.hasError, className)}
    />
  )
}

export function FormTextarea({ className, id, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const field = useField(id)

  return (
    <textarea
      {...props}
      id={field.id}
      aria-invalid={field.hasError || undefined}
      aria-describedby={props['aria-describedby'] ?? field.describedBy}
      className={`${fieldClass(field.hasError, className)} resize-y min-h-20`}
    />
  )
}

export function FormSelect({
  className,
  id,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  const field = useField(id)

  return (
    <select
      {...props}
      id={field.id}
      aria-invalid={field.hasError || undefined}
      aria-describedby={props['aria-describedby'] ?? field.describedBy}
      className={`${fieldClass(field.hasError, className)} h-9 py-0 cursor-pointer`}
    >
      {children}
    </select>
  )
}

/** A form-wide error, for something that is not tied to one field. */
export function FormError({ error }: { error: string | null }) {
  if (!error) return null

  return (
    <p role="alert" className="flex items-start gap-2 px-3 py-2.5 border border-red-200 bg-red-50 text-red-800">
      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" aria-hidden="true" />
      <span className="leading-relaxed">{error}</span>
    </p>
  )
}

export function FormToggle({
  label,
  description,
  value,
  onChange,
  disabled
}: {
  label: string
  description?: string
  value: boolean
  onChange: (val: boolean) => void
  disabled?: boolean
}) {
  const id = useId()

  return (
    <div className="flex items-start justify-between gap-4 py-3 border-t border-neutral-200">
      <label htmlFor={id} className="flex flex-col gap-0.5 min-w-0 cursor-pointer">
        <span className="font-medium text-neutral-900">{label}</span>
        {description && <span className="text-neutral-600 leading-relaxed">{description}</span>}
      </label>

      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={value}
        disabled={disabled}
        onClick={() => onChange(!value)}
        className={`relative shrink-0 w-12 h-7 rounded-full border-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-offset-2 ${
          value ? 'bg-emerald-600 border-emerald-600' : 'bg-neutral-200 border-neutral-300'
        }`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow flex items-center justify-center transition-transform motion-reduce:transition-none ${
            value ? 'translate-x-5' : 'translate-x-0.5'
          }`}
          aria-hidden="true"
        >
          {value && <Check className="w-3 h-3 text-emerald-600" strokeWidth={3} />}
        </span>
      </button>
    </div>
  )
}
