export function Section({
  title,
  icon,
  count,
  children
}: {
  title: string
  icon: React.ReactNode
  count: number | null
  children: React.ReactNode
}) {
  return (
    <div className="border-b border-border-dark">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border-dark">
        <span className="text-muted-dark">{icon}</span>
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-dark">{title}</span>
        {count !== null && <span className="text-[10px] font-mono text-muted-dark/70">({count})</span>}
      </div>
      {children}
    </div>
  )
}
