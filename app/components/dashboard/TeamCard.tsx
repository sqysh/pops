'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'
import Link from 'next/link'
import type { TeamMember } from '@prisma/client'

export function TeamCard({ teamMembers }: { teamMembers: TeamMember[] }) {
  const [search, setSearch] = useState('')

  const filtered = teamMembers.filter((m) =>
    `${m.firstName} ${m.lastName} ${m.position}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-surface-dark border border-border-dark flex flex-col h-full hover:border-white/10 transition-colors">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-3 py-2 border-b border-border-dark">
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-mono tracking-widest uppercase text-muted-dark">[ TEAM ]</span>
          <span className="text-[8px] font-mono text-muted-dark/40">·</span>
          <span className="text-2xl font-mono font-bold text-text-dark leading-none">{teamMembers.length}</span>
          <span className="text-[8px] font-mono uppercase tracking-widest text-muted-dark/40">members</span>
        </div>
        <Link
          href="/v2/team"
          className="text-[8px] font-mono uppercase tracking-widest text-muted-dark/40 hover:text-text-dark transition-colors focus-visible:outline-none"
        >
          VIEW →
        </Link>
      </div>

      {/* Search */}
      <div className="shrink-0 px-3 py-2 border-b border-border-dark">
        <div className="relative">
          <Search
            className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-dark/40 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search team..."
            aria-label="Search team members"
            className="w-full pl-7 pr-7 py-1.5 bg-black border border-border-dark text-text-dark text-[10px] font-mono placeholder:text-muted-dark/30 focus:outline-none focus:border-white/20 transition-colors"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-dark/40 hover:text-text-dark transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-[9px] font-mono text-muted-dark/30">No results</p>
          </div>
        ) : (
          filtered.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-2 px-3 py-2 border-b border-border-dark last:border-0 hover:bg-black/40 transition-colors group"
            >
              <Link href={`/v2/team?id=${m.id}`} className="flex items-center justify-between gap-3 flex-1 min-w-0">
                <p className="text-[10px] font-mono text-text-dark truncate group-hover:text-white transition-colors">
                  {m.firstName} {m.lastName}
                </p>
                <span className="text-[8px] font-mono text-muted-dark/50 shrink-0 truncate max-w-24 text-right">
                  {m.position}
                </span>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
