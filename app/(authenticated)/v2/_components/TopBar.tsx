import Link from 'next/link'
import { BarChart2 } from 'lucide-react'
import { LogoutButton } from '@/components/common/LogoutButton'
import { UserRole } from '@prisma/client'

const ROLES: Record<string, { label: string; short: string; dot: string; pill: string }> = {
  SUPER_USER: {
    label: 'Super user',
    short: 'Super',
    dot: 'bg-blaze',
    pill: 'text-blaze-text bg-blaze/5 ring-blaze/20'
  },
  CONDUCTOR: {
    label: 'Conductor',
    short: 'Conductor',
    dot: 'bg-purple-500',
    pill: 'text-purple-700 bg-purple-50 ring-purple-200'
  },
  ADMIN: {
    label: 'Admin',
    short: 'Admin',
    dot: 'bg-emerald-500',
    pill: 'text-emerald-700 bg-emerald-50 ring-emerald-200'
  }
}

const FALLBACK_ROLE = { dot: 'bg-neutral-400', pill: 'text-neutral-600 bg-neutral-50 ring-neutral-200' }

const Divider = () => <div className="w-px h-4 bg-neutral-200 hidden 760:block" aria-hidden="true" />

const RolePill = ({ dot, pill, label, className = '' }: { dot: string; pill: string; label: string; className?: string }) => (
  <span
    className={`inline-flex items-center gap-1.5 shrink-0 text-xs font-medium rounded-full ring-1 px-2 py-0.5 ${pill} ${className}`}
  >
    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} aria-hidden="true" />
    {label}
  </span>
)

export function TopBar({ userRole, userEmail }: { userRole: UserRole; userEmail: string }) {
  const role = userRole ? ROLES[userRole] : undefined
  const dot = role?.dot ?? FALLBACK_ROLE.dot
  const pill = role?.pill ?? FALLBACK_ROLE.pill

  return (
    <header className="shrink-0 h-12 bg-white border-b border-neutral-200 flex items-center justify-between gap-4 px-4 z-30 text-sm">
      <Link
        href="/"
        className="flex items-center gap-2 group rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-offset-2"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-blaze shrink-0" aria-hidden="true" />
        <span className="font-semibold text-neutral-900 group-hover:text-blaze-text transition-colors hidden 760:block">
          The Pops Orchestra
        </span>
        <span className="font-semibold text-neutral-900 group-hover:text-blaze-text transition-colors 760:hidden">Pops</span>
      </Link>

      <div className="flex items-center gap-3">
        {/* Signed in as */}
        <div className="hidden 760:flex items-center gap-2 min-w-0">
          <span className="text-neutral-600 truncate max-w-56">{userEmail}</span>
          {userRole && <RolePill dot={dot} pill={pill} label={role?.label ?? userRole} />}
        </div>

        {/* Role only on mobile */}
        {userRole && <RolePill dot={dot} pill={pill} label={role?.short ?? userRole} className="760:hidden" />}

        {userRole === 'SUPER_USER' && (
          <>
            <Divider />
            <Link
              href="/v2/super"
              className="font-medium text-blaze-text hover:underline underline-offset-2 px-1 py-1 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
              title="Super dashboard"
            >
              Super
            </Link>
          </>
        )}

        <Divider />

        <a
          href="https://analytics.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden 760:inline-flex p-1.5 -m-0.5 rounded text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
          aria-label="Google Analytics (opens in new tab)"
          title="Google Analytics"
        >
          <BarChart2 className="w-4 h-4" aria-hidden="true" />
        </a>

        <LogoutButton />
      </div>
    </header>
  )
}
