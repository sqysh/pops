import Link from 'next/link'
import { motion } from 'framer-motion'
import { BarChart2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { LogoutButton } from '@/app/components/common/LogoutButton'

const ROLES: Record<string, { label: string; short: string; className: string }> = {
  SUPER_USER: {
    label: 'Super user',
    short: 'Super',
    className: 'text-blaze-text border-blaze/40 bg-blaze/5'
  },
  CONDUCTOR: {
    label: 'Conductor',
    short: 'Conductor',
    className: 'text-purple-700 border-purple-300 bg-purple-50'
  },
  ADMIN: {
    label: 'Admin',
    short: 'Admin',
    className: 'text-emerald-700 border-emerald-300 bg-emerald-50'
  }
}

const Divider = () => <div className="w-px h-6 bg-neutral-200 hidden 760:block" aria-hidden="true" />

export function TopBar({ time, date }: { time: string; date: string }) {
  const session = useSession()
  const user = session.data?.user

  const role = user?.role ? ROLES[user.role] : undefined
  const roleClassName = role?.className ?? 'text-neutral-700 border-neutral-300 bg-neutral-100'

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="shrink-0 min-h-16 bg-white border-b border-neutral-200 flex items-center justify-between gap-4 px-4 760:px-6 py-3 z-30"
    >
      <Link
        href="/"
        className="flex items-center gap-2.5 group rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-offset-2"
      >
        <span className="text-blaze-text" aria-hidden="true">
          ▸
        </span>
        <span className="text-base font-semibold text-neutral-900 group-hover:text-blaze-text transition-colors hidden 760:block">
          The Pops Orchestra
        </span>
        <span className="text-base font-semibold text-neutral-900 group-hover:text-blaze-text transition-colors 760:hidden">
          Pops
        </span>
      </Link>

      <div className="flex items-center gap-3 760:gap-4">
        {/* Date + time */}
        <span className="text-sm text-neutral-600 hidden 990:block">{date}</span>
        <span className="text-sm font-semibold text-neutral-900 tabular-nums hidden 760:block">{time}</span>

        <Divider />

        {/* Signed in as */}
        <div className="hidden 760:flex items-center gap-2.5 min-w-0">
          <span className="text-sm text-neutral-700 truncate max-w-56">{user?.email}</span>
          {user?.role && (
            <span
              className={`text-xs font-semibold uppercase tracking-wide px-2 py-1 border rounded-sm shrink-0 ${roleClassName}`}
            >
              {role?.label ?? user.role}
            </span>
          )}
        </div>

        {/* Role badge only on mobile */}
        {user?.role && (
          <span
            className={`760:hidden text-xs font-semibold uppercase tracking-wide px-2 py-1 border rounded-sm shrink-0 ${roleClassName}`}
          >
            {role?.short ?? user.role}
          </span>
        )}

        {user?.role === 'SUPER_USER' && (
          <>
            <Divider />
            <Link
              href="/v2/super"
              className="text-sm font-semibold text-blaze-text hover:text-blaze px-2 py-1.5 rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
              title="Super dashboard"
            >
              Super →
            </Link>
          </>
        )}

        <Divider />

        <a
          href="https://analytics.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 p-2 rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze hidden 760:block"
          aria-label="Google Analytics (opens in new tab)"
          title="Google Analytics"
        >
          <BarChart2 className="w-5 h-5" />
        </a>

        <Divider />

        <LogoutButton />
      </div>
    </motion.header>
  )
}
