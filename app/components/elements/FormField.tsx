'use client'

interface FormFieldProps {
  label: string
  htmlFor?: string
  required?: boolean
  children: React.ReactNode
}

export function FormField({ label, htmlFor, required, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {htmlFor ? (
        <label htmlFor={htmlFor} className="text-[7px] font-mono uppercase tracking-widest text-muted-dark">
          {label} {required && <span className="text-primary-dark">*</span>}
        </label>
      ) : (
        <span className="text-[7px] font-mono uppercase tracking-widest text-muted-dark/50">
          {label} {required && <span className="text-primary-dark">*</span>}
        </span>
      )}
      {children}
    </div>
  )
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string
}

export function FormInput({ className, ...props }: FormInputProps) {
  return (
    <input
      {...props}
      className={`bg-surface-dark border border-border-dark px-3 py-2 text-[11px] font-mono text-text-dark placeholder:text-muted-dark/30 outline-none focus:border-muted-dark/40 transition-colors w-full ${className ?? ''}`}
    />
  )
}

export type FormTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

export function FormTextarea({ className, ...props }: FormTextareaProps) {
  return (
    <textarea
      {...props}
      className={`bg-surface-dark border border-border-dark px-3 py-2 text-[11px] font-mono text-text-dark placeholder:text-muted-dark/30 outline-none focus:border-muted-dark/40 transition-colors w-full resize-none ${className ?? ''}`}
    />
  )
}

interface FormErrorProps {
  error: string | null
}

export function FormError({ error }: FormErrorProps) {
  if (!error) return null
  return (
    <div className="border border-red-500/30 bg-red-500/5 px-3 py-2">
      <span className="text-[9px] font-mono text-red-400">{error}</span>
    </div>
  )
}

interface FormToggleProps {
  label: string
  description?: string
  value: boolean
  onChange: (val: boolean) => void
}

export function FormToggle({ label, description, value, onChange }: FormToggleProps) {
  return (
    <div className="flex items-center justify-between py-2 border-t border-border-dark">
      <div className="flex flex-col gap-0.5">
        <span className="text-[9px] font-mono uppercase tracking-widest text-text-dark">{label}</span>
        {description && <span className="text-[8px] font-mono text-muted-dark">{description}</span>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark transition-colors"
        aria-pressed={value}
        aria-label={`Toggle ${label}`}
      >
        {value ? (
          <span className="text-emerald-400 font-mono text-[9px] uppercase tracking-widest border border-emerald-400/30 bg-emerald-400/5 px-2 py-0.5">
            ON
          </span>
        ) : (
          <span className="text-muted-dark/30 font-mono text-[9px] uppercase tracking-widest border border-border-dark px-2 py-0.5">
            OFF
          </span>
        )}
      </button>
    </div>
  )
}
