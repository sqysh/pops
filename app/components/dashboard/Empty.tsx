export function Empty({ label }: { label: string }) {
  return (
    <div className="px-3 py-4 text-center">
      <p className="text-muted-dark/80 text-[11px]">No {label}.</p>
    </div>
  )
}
