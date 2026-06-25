import Link from 'next/link'
import { motion } from 'framer-motion'
import { BarChart2 } from 'lucide-react'
import { LogoutButton } from '../common/LogoutButton'
import { useSession } from 'next-auth/react'

export function TopBar({ time, date }) {
  const session = useSession()
  const user = session.data?.user

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="shrink-0 h-10 bg-black border-b border-border-dark flex items-center justify-between px-4 z-30"
    >
      <Link href="/" className="flex items-center gap-2 group">
        <span
          className="text-[10px] font-mono text-blaze-text group-hover:text-white transition-colors"
          aria-hidden="true"
        >
          ▸
        </span>
        <span className="text-[10px] font-mono tracking-widest uppercase text-muted-dark group-hover:text-text-dark transition-colors hidden sm:block">
          The Pops Orchestra
        </span>
        <span className="text-[10px] font-mono tracking-widest uppercase text-muted-dark group-hover:text-text-dark transition-colors sm:hidden">
          Pops
        </span>
      </Link>

      <div className="flex items-center gap-3">
        {/* Date + time — hide date on mobile */}
        <span className="text-[10px] font-mono text-muted-dark hidden sm:block">{date}</span>
        <span className="text-[10px] font-mono text-text-dark tabular-nums hidden sm:block">{time}</span>
        <div className="w-px h-4 bg-border-dark hidden sm:block" aria-hidden="true" />

        {/* Logged in as — hidden on mobile */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-[10px] font-mono text-muted-dark/70" aria-hidden="true">
            [
          </span>
          <span className="text-[10px] font-mono tracking-widest uppercase text-muted-dark">{user?.email}</span>
          <span
            className={`text-[9px] font-mono tracking-widest uppercase px-1.5 py-0.5 border ${
              user?.role === 'SUPER_USER'
                ? 'text-primary-dark border-primary-dark/30 bg-primary-dark/5'
                : user?.role === 'CONDUCTOR'
                  ? 'text-purple-400 border-purple-400/30 bg-purple-400/5'
                  : user?.role === 'ADMIN'
                    ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5'
                    : 'text-muted-dark border-border-dark'
            }`}
          >
            {user?.role}
          </span>
          <span className="text-[10px] font-mono text-muted-dark/70" aria-hidden="true">
            ]
          </span>
        </div>

        {/* Role badge only on mobile */}
        <span
          className={`sm:hidden text-[9px] font-mono tracking-widest uppercase px-1.5 py-0.5 border ${
            user?.role === 'SUPER_USER'
              ? 'text-primary-dark border-primary-dark/30 bg-primary-dark/5'
              : user?.role === 'CONDUCTOR'
                ? 'text-purple-400 border-purple-400/30 bg-purple-400/5'
                : 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5'
          }`}
        >
          {user?.role === 'SUPER_USER' ? 'Super' : user?.role === 'CONDUCTOR' ? 'Conductor' : 'Admin'}
        </span>

        {user?.role === 'SUPER_USER' && (
          <>
            <div className="w-px h-4 bg-border-dark" aria-hidden="true" />
            <Link
              href="/v2/super"
              className="text-[10px] font-mono tracking-widest uppercase text-primary-dark hover:text-blaze-text transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark"
              title="Super dashboard"
            >
              Super →
            </Link>
          </>
        )}

        <div className="w-px h-4 bg-border-dark" aria-hidden="true" />

        <a
          href="https://analytics.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-dark hover:text-text-dark transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark hidden sm:block"
          aria-label="Google Analytics"
          title="Google Analytics"
        >
          <BarChart2 className="w-3.5 h-3.5" />
        </a>
        <div className="w-px h-4 bg-border-dark hidden sm:block" aria-hidden="true" />

        <LogoutButton />
      </div>
    </motion.header>
  )
}
