import { ArrowLeft, LogOut, Newspaper, Plus } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'

export function NewsTopBar({ articles, handleNew }) {
  return (
    <div className="shrink-0 h-11 bg-surface-dark border-b border-border-dark flex items-center justify-between px-4 z-20">
      <div className="flex items-center gap-3">
        <Link
          href="/v2/dashboard"
          className="text-muted-dark hover:text-text-dark transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </Link>
        <div className="w-px h-4 bg-border-dark" aria-hidden="true" />
        <Newspaper className="w-3.5 h-3.5 text-primary-dark" aria-hidden="true" />
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-dark">News</span>
        <span className="text-[10px] font-mono text-muted-dark/70">({articles.length})</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleNew}
          className="flex items-center gap-2 px-4 py-1.5 bg-primary-dark hover:bg-secondary-light text-white text-[10px] font-mono tracking-[0.15em] uppercase transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark"
        >
          <Plus className="w-3 h-3" aria-hidden="true" />
          New Article
        </button>
        <div className="w-px h-4 bg-border-dark" aria-hidden="true" />
        <button
          type="button"
          onClick={() => signOut({ redirectTo: '/login' })}
          className="text-muted-dark hover:text-red-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark"
          aria-label="Sign out"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
