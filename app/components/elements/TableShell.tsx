'use client'

import Link from 'next/link'
import { Search, X } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import { SortIcon } from '@/app/lib/utils/common.utils'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type SortDir = 'asc' | 'desc'

export interface TablePill {
  label: string
  value: string | number
  accent?: boolean
  href?: string
}

export interface TableColumn {
  key: string | null
  label: string
  alignRight?: boolean
}

export interface TableAction {
  label: string
  onClick: () => void
}

// ─── TableSearch ──────────────────────────────────────────────────────────────

interface TableSearchProps {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}

export function TableSearch({ value, onChange, placeholder = 'Search...' }: TableSearchProps) {
  return (
    <div className="flex items-center gap-2 border border-border-dark bg-bg-dark px-2 py-1.5 flex-1 min-w-40 max-w-64">
      <Search className="w-3 h-3 text-muted-dark/40 shrink-0" aria-hidden="true" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent text-[10px] font-mono text-text-dark placeholder:text-muted-dark/30 outline-none w-full"
        aria-label={placeholder}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="text-muted-dark/40 hover:text-text-dark transition-colors"
          aria-label="Clear search"
        >
          <X className="w-2.5 h-2.5" />
        </button>
      )}
    </div>
  )
}

// ─── TableFilterPills ─────────────────────────────────────────────────────────

interface TableFilterPillsProps {
  options: { label: string; value: string }[]
  active: string
  onChange: (value: string) => void
  accentColor?: 'red' | 'emerald'
}

export function TableFilterPills({ options, active, onChange, accentColor = 'red' }: TableFilterPillsProps) {
  const activeClass =
    accentColor === 'emerald'
      ? 'border-emerald-400/40 text-emerald-400 bg-emerald-400/5'
      : 'border-primary-dark/40 text-primary-dark bg-primary-dark/5'

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {options.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`text-[7px] font-mono uppercase tracking-widest px-2 py-1 border transition-colors ${
            active === value
              ? activeClass
              : 'border-border-dark text-muted-dark/50 hover:text-muted-dark hover:border-muted-dark/30'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

// ─── TableEmptyState ──────────────────────────────────────────────────────────

interface TableEmptyStateProps {
  noun?: string
  isFiltered: boolean
  onClear: () => void
}

export function TableEmptyState({ noun = 'results', isFiltered, onClear }: TableEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-40 gap-2">
      <span className="text-[9px] font-mono uppercase tracking-widest text-muted-dark/30">No {noun} found</span>
      {isFiltered && (
        <button
          onClick={onClear}
          className="text-[8px] font-mono uppercase tracking-widest text-primary-dark hover:text-blaze-text transition-colors"
        >
          Clear filters &rarr;
        </button>
      )}
    </div>
  )
}

// ─── TableShell ───────────────────────────────────────────────────────────────

interface TableShellProps {
  // Header
  label: string
  backHref: string
  count: number
  pills?: TablePill[]
  action?: TableAction
  marquee?: string
  marqueeNode?: ReactNode

  // Toolbar
  toolbar?: React.ReactNode

  // Table
  columns: TableColumn[]
  colClass: string
  sortKey: string
  sortDir: SortDir
  toggleSort: (key: string) => void

  // Rows
  children: React.ReactNode
  empty: React.ReactNode

  // Footer
  filteredCount: number
  totalCount: number
  footerExtra?: React.ReactNode
}

export function TableShell({
  label,
  backHref,
  count,
  pills = [],
  action,
  marquee,
  marqueeNode,
  toolbar,
  columns,
  colClass,
  sortKey,
  sortDir,
  toggleSort,
  children,
  empty,
  filteredCount,
  totalCount,
  footerExtra
}: TableShellProps) {
  return (
    <div className="flex flex-col h-screen bg-bg-surface overflow-hidden gap-2">
      <div className="bg-black shrink-0 border-b border-border-dark">
        {/* Header */}
        <div className="flex items-center justify-between px-3 760:px-4 py-2 760:py-2.5 gap-2">
          {/* Left */}
          <div className="flex items-center gap-2 760:gap-3 min-w-0 flex-1 overflow-hidden">
            <Link
              href={backHref}
              className="text-[8px] font-mono uppercase tracking-widest text-muted-dark/80 hover:text-primary-dark transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark shrink-0"
            >
              ←<span className="hidden 480:inline"> {backHref.split('/').pop()}</span>
            </Link>
            <div className="w-px h-3 bg-border-dark shrink-0" aria-hidden="true" />
            <span className="text-[8px] 760:text-[9px] font-mono text-muted-dark/70 uppercase tracking-widest shrink-0 truncate">
              [ {label} ]
            </span>
            <div className="w-px h-3 bg-border-dark shrink-0 hidden 480:block" aria-hidden="true" />
            <span className="text-[9px] font-mono text-muted-dark hidden 480:block shrink-0">{count} total</span>

            {/* Pills — inline on 760+ */}
            {pills.length > 0 && (
              <>
                <div className="w-px h-3 bg-border-dark shrink-0 hidden 760:block" aria-hidden="true" />
                <div className="hidden 760:flex items-center divide-x divide-border-dark border-x border-border-dark">
                  {pills.map(({ label: pillLabel, value, accent, href }) => {
                    const inner = (
                      <div
                        className={`flex flex-col items-center justify-center px-3 py-1.5 shrink-0 gap-0.5 ${href ? 'hover:bg-white/5 transition-colors cursor-pointer' : ''}`}
                      >
                        <span
                          className={`font-mono text-xs font-bold tabular-nums ${accent ? 'text-primary-dark' : 'text-text-dark'}`}
                        >
                          {value}
                        </span>
                        <span className="text-[7px] font-mono tracking-[0.12em] uppercase text-muted-dark/50 whitespace-nowrap">
                          {pillLabel}
                        </span>
                      </div>
                    )
                    return href ? (
                      <Link key={pillLabel} href={href} aria-label={`View ${pillLabel}`}>
                        {inner}
                      </Link>
                    ) : (
                      <div key={pillLabel}>{inner}</div>
                    )
                  })}
                </div>
              </>
            )}
          </div>

          {/* Right — action */}
          {action && (
            <button
              type="button"
              onClick={action.onClick}
              className="text-[8px] font-mono uppercase tracking-widest px-2 760:px-3 py-1.5 border border-primary-dark/40 text-primary-dark bg-primary-dark/5 hover:bg-primary-dark/10 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark shrink-0"
            >
              <span className="hidden 480:inline">{action.label}</span>
              <span className="480:hidden">+</span>
            </button>
          )}
        </div>

        {/* Pills on mobile — scrollable strip */}
        {pills.length > 0 && (
          <div className="760:hidden flex items-center divide-x divide-border-dark border-t border-border-dark overflow-x-auto">
            {pills.map(({ label: pillLabel, value, accent, href }) => {
              const inner = (
                <div
                  className={`flex flex-col items-center justify-center px-4 py-1.5 shrink-0 gap-0.5 ${href ? 'hover:bg-white/5 transition-colors cursor-pointer' : ''}`}
                >
                  <span
                    className={`font-mono text-xs font-bold tabular-nums ${accent ? 'text-primary-dark' : 'text-text-dark'}`}
                  >
                    {value}
                  </span>
                  <span className="text-[7px] font-mono tracking-[0.12em] uppercase text-muted-dark/50 whitespace-nowrap">
                    {pillLabel}
                  </span>
                </div>
              )
              return href ? (
                <Link key={pillLabel} href={href} aria-label={`View ${pillLabel}`}>
                  {inner}
                </Link>
              ) : (
                <div key={pillLabel}>{inner}</div>
              )
            })}
          </div>
        )}

        {/* Marquee strip */}
        {marquee && (
          <div className="border-t border-border-dark/40 bg-white/2 overflow-hidden py-1">
            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="flex whitespace-nowrap"
            >
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <span key={i} className="text-[8px] font-mono text-muted-dark/90 pr-16">
                  <span className="text-muted-dark/70">▸</span> {marquee}
                  <span className="text-muted-dark/20 mx-4">·</span>
                </span>
              ))}
            </motion.div>
          </div>
        )}
        {marqueeNode && (
          <div className="border-t border-border-dark/40 bg-white/2 overflow-hidden py-1">
            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="flex whitespace-nowrap"
            >
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <span key={i} className="pr-16">
                  {marqueeNode}
                </span>
              ))}
            </motion.div>
          </div>
        )}
      </div>

      {/* Toolbar */}
      {toolbar && (
        <div className="mx-1.3 shrink-0 flex flex-wrap items-center gap-2 px-4 py-2 border-b border-border-dark bg-surface-dark">
          {toolbar}
        </div>
      )}

      {/* Column headers + scrollable rows */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-surface-dark mx-2">
        <div className="flex-1 min-h-0 overflow-x-auto overflow-y-auto">
          <div className="w-full">
            {/* Column headers */}
            <div
              className={`sticky top-0 z-10 grid ${colClass} items-center gap-3 px-3 py-1.5 border-b border-border-dark bg-surface-dark`}
            >
              {columns.map(({ key, label: colLabel, alignRight }, i) => (
                <button
                  key={i}
                  onClick={() => key && toggleSort(key)}
                  disabled={!key}
                  className={`flex items-center gap-1 text-[7px] font-mono uppercase tracking-widest text-muted-dark ${
                    key ? 'hover:text-muted-dark transition-colors cursor-pointer' : 'cursor-default'
                  } ${alignRight ? 'justify-end' : ''}`}
                >
                  {colLabel}
                  {key && <SortIcon active={sortKey === key} dir={sortDir} />}
                </button>
              ))}
            </div>

            {/* Rows or empty state */}
            {filteredCount === 0 ? empty : <AnimatePresence initial={false}>{children}</AnimatePresence>}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 flex items-center justify-between px-4 py-2 border-t border-border-dark bg-surface-dark">
        <Link
          href={backHref}
          className="text-[8px] font-mono uppercase tracking-widest text-muted-dark/40 hover:text-primary-dark transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark"
        >
          &larr; {backHref.split('/').pop()}
        </Link>
        <div className="flex items-center gap-4">
          {footerExtra && (
            <>
              {footerExtra}
              <div className="w-px h-3 bg-border-dark" aria-hidden="true" />
            </>
          )}
          <span className="text-[8px] font-mono uppercase tracking-widest text-muted-dark/30">
            {filteredCount} of {totalCount}
          </span>
        </div>
      </div>
    </div>
  )
}
