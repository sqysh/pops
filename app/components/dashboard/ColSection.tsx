import { Plus } from 'lucide-react'
import Link from 'next/link'

export function ColSection({
  label,
  icon,
  count,
  href,
  actionLabel,
  actionIcon,
  action,
  secondaryHref,
  secondaryLabel,
  children,
  badge,
  minHeight = 'min-h-24',
  maxHeight = 'max-h-40'
}: {
  label: string
  icon: React.ReactNode
  count?: number
  href?: string
  actionLabel?: string
  actionIcon?: React.ReactNode
  action?: () => void
  secondaryHref?: string
  secondaryLabel?: string
  children: React.ReactNode
  badge?: number
  minHeight?: string
  maxHeight?: string
}) {
  return (
    <div className="border-b border-border-dark last:border-0">
      <div className="flex items-center justify-between px-3 py-2.5 bg-bg-dark sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="text-primary-dark">{icon}</span>
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-dark truncate max-w-26">
            {label}
          </span>
          {count !== undefined && <span className="text-[10px] font-mono text-muted-dark/70">({count})</span>}
          {badge !== undefined && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-primary-dark/10 border border-primary-dark/30">
              <span className="w-1 h-1 bg-primary-dark animate-pulse" aria-hidden="true" />
              <span className="text-[9px] font-mono uppercase text-primary-dark">{badge} new</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {secondaryHref && secondaryLabel && (
            <Link
              href={secondaryHref}
              className="text-[10px] font-mono tracking-widest uppercase text-muted-dark hover:text-text-dark transition-colors"
            >
              {secondaryLabel}
            </Link>
          )}
          {action && actionLabel && (
            <button
              type="button"
              onClick={action}
              className="flex items-center gap-1 text-[10px] font-mono tracking-widest uppercase text-muted-dark hover:text-text-dark transition-colors focus-visible:outline-none"
            >
              {actionIcon}
              {actionLabel}
            </button>
          )}
          {href && actionLabel && !action && (
            <Link
              href={href}
              className="flex items-center gap-1 text-[10px] font-mono tracking-widest uppercase text-primary-dark hover:text-secondary-dark transition-colors"
            >
              <Plus className="w-2.5 h-2.5" />
              {actionLabel}
            </Link>
          )}
        </div>
      </div>
      <div className={`${minHeight} ${maxHeight} overflow-y-auto`}>{children}</div>
    </div>
  )
}
