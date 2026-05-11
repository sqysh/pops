'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { LogOut, Settings } from 'lucide-react'

interface Props {
  date: string
  time: string
}

export function DashTopBar({ date, time }: Props) {
  const session = useSession()
  const email = session.data?.user?.email ?? ''
  const role = session.data?.user?.role ?? ''

  return (
    <div className="shrink-0 h-9 bg-navbar-dark border-b border-border-dark flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-text-dark">THE POPS ORCHESTRA</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-[10px] font-mono text-muted-dark/80 uppercase tracking-widest">
          {date} · {time}
        </span>
        <div className="w-px h-3 bg-border-dark" aria-hidden="true" />
        <span className="text-[10px] font-mono text-muted-dark/80">{email}</span>
        <span
          className={`text-[9px] font-mono uppercase tracking-[0.15em] px-1.5 py-0.5 border ${
            role === 'SUPER_USER'
              ? 'text-primary-dark border-primary-dark/30 bg-primary-dark/5'
              : role === 'CONDUCTOR'
                ? 'text-purple-400 border-purple-400/30 bg-purple-400/5'
                : 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5'
          }`}
        >
          {role === 'SUPER_USER' ? 'SUPER' : role}
        </span>
        <div className="w-px h-3 bg-border-dark" aria-hidden="true" />
        <Link
          href="/v2/settings"
          aria-label="Settings"
          className="text-muted-dark/70 hover:text-text-dark transition-colors"
        >
          <Settings className="w-3 h-3" />
        </Link>
        <Link
          href="/auth/logout"
          aria-label="Log out"
          className="text-muted-dark/70 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-3 h-3" />
        </Link>
      </div>
    </div>
  )
}
