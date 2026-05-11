export function FieldLabel({
  htmlFor,
  children,
  required
}: {
  htmlFor?: string
  children: React.ReactNode
  required?: boolean
}) {
  return (
    <label htmlFor={htmlFor} className="block text-[10px] font-mono tracking-[0.25em] uppercase text-muted-dark mb-1.5">
      {children}
      {required && <span className="text-primary-dark ml-1">*</span>}
    </label>
  )
}
