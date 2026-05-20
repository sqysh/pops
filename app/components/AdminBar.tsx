'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { LayoutDashboard } from 'lucide-react'
import { usePathname } from 'next/navigation'

export function AdminBar() {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  if (pathname.startsWith('/v2')) return null

  if (status === 'loading') return null
  if (!session?.user?.role) return null

  const role = session.user.role
  if (role !== 'ADMIN' && role !== 'CONDUCTOR' && role !== 'SUPER_USER') return null

  return (
    <div className="w-full flex items-center justify-between px-4 py-1.5 bg-black border-b border-primary-dark/40">
      <div className="flex items-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-primary-dark shrink-0 animate-pulse" aria-hidden="true" />
        <span className="text-[9px] font-mono uppercase tracking-widest text-muted-dark/60">
          {session.user.name ?? session.user.email}
        </span>
        <span className="text-[7px] font-mono uppercase tracking-widest px-1.5 py-0.5 border text-primary-dark border-primary-dark/30 bg-primary-dark/5 hidden 430:block">
          {role.replace('_', ' ')}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/v2/dashboard"
          className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-muted-dark/70 hover:text-text-dark transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark"
        >
          <LayoutDashboard className="w-3 h-3 shrink-0" aria-hidden="true" />
          <span className="hidden 430:inline">Dashboard</span>
        </Link>
      </div>
    </div>
  )
}
