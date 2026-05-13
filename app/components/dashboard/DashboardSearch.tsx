'use client'

import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { SearchResult } from '@/app/lib/hooks/useDashboardSearch'

const TYPE_COLORS: Record<string, string> = {
  Concert: 'text-primary-dark border-primary-dark/30 bg-primary-dark/10',
  Venue: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
  Team: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
  Question: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
  User: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
  Request: 'text-orange-400 border-orange-400/30 bg-orange-400/10',
  Sponsor: 'text-amber-400 border-amber-400/30 bg-amber-400/10'
}

export function DashboardSearch({
  query,
  results,
  onSearch,
  onClear,
  firstName
}: {
  query: string
  results: SearchResult[]
  onSearch: (q: string) => void
  onClear: () => void
  firstName: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="shrink-0 border-b border-border-dark bg-bg-dark relative z-20">
      <div className="flex items-center gap-3 px-4 py-2.5">
        <Search className="w-3.5 h-3.5 text-muted-dark/70 shrink-0" aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={`What can I help you find today, ${firstName}?`}
          className="flex-1 bg-transparent text-[12px] font-mono text-text-dark placeholder:text-muted-dark/60 focus:outline-none"
        />
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={onClear}
              className="text-muted-dark/70 hover:text-text-dark transition-colors focus-visible:outline-none"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </AnimatePresence>
        {query && (
          <span className="text-[9px] font-mono text-muted-dark/60 shrink-0">
            {results.length} result{results.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Results dropdown */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full bg-bg-dark border-b border-border-dark shadow-2xl max-h-80 overflow-y-auto z-30"
          >
            {results.map((result, i) => {
              const colorCls = TYPE_COLORS[result.type] ?? 'text-muted-dark border-border-dark bg-surface-dark'
              const inner = (
                <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-dark transition-colors group">
                  <span
                    className={`text-[9px] font-mono tracking-[0.15em] uppercase px-1.5 py-0.5 border shrink-0 ${colorCls}`}
                  >
                    {result.type}
                  </span>
                  <span className="text-[12px] font-mono text-text-dark flex-1 truncate">{result.label}</span>
                  {result.sub && (
                    <span className="text-[10px] font-mono text-muted-dark/70 shrink-0 hidden sm:block truncate max-w-40">
                      {result.sub}
                    </span>
                  )}
                  {result.href && (
                    <ArrowRight className="w-3 h-3 text-border-dark group-hover:text-primary-dark group-hover:translate-x-0.5 transition-all shrink-0" />
                  )}
                </div>
              )

              return result.href ? (
                <Link key={i} target={result.target ?? ''} href={result.href} onClick={onClear}>
                  {inner}
                </Link>
              ) : (
                <div key={i}>{inner}</div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
