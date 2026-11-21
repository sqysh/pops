'use client'

import Link from 'next/link'
import { Info, Search, X } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import { SortIcon } from '@/app/lib/utils/common.utils'

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

export function TableSearch({
  value,
  onChange,
  placeholder = 'Search...'
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div className="flex items-center gap-2 h-9 px-3 border border-neutral-300 bg-white flex-1 min-w-48 max-w-80 focus-within:ring-2 focus-within:ring-blaze focus-within:border-blaze">
      <Search className="w-4 h-4 text-neutral-400 shrink-0" aria-hidden="true" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent text-neutral-900 placeholder:text-neutral-400 outline-none w-full"
        aria-label={placeholder}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="shrink-0 p-1 -mr-1 rounded text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

/** Segmented control: one connected group, not four floating buttons. */
export function TableFilterPills({
  options,
  active,
  onChange
}: {
  options: { label: string; value: string }[]
  active: string
  onChange: (value: string) => void
}) {
  return (
    <div
      className="flex items-center h-9 border border-neutral-300 bg-white divide-x divide-neutral-300"
      role="group"
      aria-label="Filter"
    >
      {options.map(({ label, value }) => {
        const isActive = active === value

        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            aria-pressed={isActive}
            className={`h-full px-3.5 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-inset ${
              isActive ? 'bg-neutral-900 text-white' : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

export function TableEmptyState({
  noun = 'results',
  isFiltered,
  onClear
}: {
  noun?: string
  isFiltered: boolean
  onClear: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center h-48 gap-3 px-4 text-center">
      <p className="text-neutral-600">No {noun} found</p>
      {isFiltered && (
        <button
          type="button"
          onClick={onClear}
          className="font-medium text-blaze-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze rounded-sm"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}

interface TableShellProps {
  label: string
  /** Kept for the pages that still pass it; the nav rail is the real way back. */
  backHref?: string
  count: number
  pills?: TablePill[]
  action?: TableAction
  /** A standing explanation of how the page works. Static, not a marquee. */
  note?: React.ReactNode
  toolbar?: React.ReactNode

  columns: TableColumn[]
  colClass: string
  sortKey: string
  sortDir: SortDir
  toggleSort: (key: string) => void

  children: React.ReactNode
  empty: React.ReactNode

  filteredCount: number
  totalCount: number
  footerExtra?: React.ReactNode
  bottomPanel?: React.ReactNode
}

export function TableShell({
  label,
  count,
  pills = [],
  action,
  note,
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
  footerExtra,
  bottomPanel
}: TableShellProps) {
  return (
    // h-full fills the layout's scrolling pane where one constrains it; the
    // min-height keeps the shell usable where nothing does, such as mobile
    <div className="flex flex-col h-full min-h-125 bg-white border border-neutral-300 text-sm overflow-hidden">
      {/* Header */}
      <div className="shrink-0 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 px-4 py-3 border-b border-neutral-300">
        <div className="flex items-baseline gap-4 flex-wrap min-w-0">
          <h1 className="text-base font-semibold text-neutral-900">{label}</h1>

          {/* Counts read as a sentence rather than a row of boxes */}
          <dl className="flex items-baseline gap-4 flex-wrap text-neutral-600">
            <div className="flex items-baseline gap-1.5">
              <dd className="font-semibold text-neutral-900 tabular-nums">{count}</dd>
              <dt>total</dt>
            </div>
            {pills.map(({ label: pillLabel, value, accent, href }) => {
              const body = (
                <>
                  <dd className={`font-semibold tabular-nums ${accent ? 'text-blaze-text' : 'text-neutral-900'}`}>{value}</dd>
                  <dt>{pillLabel.toLowerCase()}</dt>
                </>
              )

              return href ? (
                <Link
                  key={pillLabel}
                  href={href}
                  className="flex items-baseline gap-1.5 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze rounded-sm"
                >
                  {body}
                </Link>
              ) : (
                <div key={pillLabel} className="flex items-baseline gap-1.5">
                  {body}
                </div>
              )
            })}
          </dl>
        </div>

        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className="h-9 px-4 bg-blaze hover:bg-blazehover text-white font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-offset-2"
          >
            {action.label}
          </button>
        )}
      </div>

      {note && (
        <p className="shrink-0 flex items-start gap-2 px-4 py-2.5 border-b border-neutral-300 bg-sky-50 text-sky-900">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-sky-600" aria-hidden="true" />
          <span className="leading-relaxed">{note}</span>
        </p>
      )}

      {/* Toolbar */}
      {toolbar && (
        <div className="shrink-0 flex flex-wrap items-center gap-2 px-4 py-3 border-b border-neutral-300 bg-neutral-50">
          {toolbar}
        </div>
      )}

      {/* Column headers + scrollable rows */}
      <div className="flex-1 min-h-0 overflow-auto">
        <div className="w-full min-w-max 990:min-w-0">
          <div
            className={`sticky top-0 z-10 grid ${colClass} items-center gap-3 px-4 py-2 border-b border-neutral-300 bg-neutral-100`}
          >
            {columns.map(({ key, label: colLabel, alignRight }, i) => (
              <button
                key={i}
                type="button"
                onClick={() => key && toggleSort(key)}
                disabled={!key}
                className={`flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-neutral-600 ${
                  key
                    ? 'hover:text-neutral-900 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze'
                    : 'cursor-default'
                } ${alignRight ? 'justify-end' : ''}`}
              >
                {colLabel}
                {key && <SortIcon active={sortKey === key} dir={sortDir} />}
              </button>
            ))}
          </div>

          {filteredCount === 0 ? empty : <AnimatePresence initial={false}>{children}</AnimatePresence>}
        </div>
      </div>

      {bottomPanel && <div className="shrink-0 border-t border-neutral-300">{bottomPanel}</div>}

      {/* Footer */}
      <div className="shrink-0 flex items-center justify-between gap-4 px-4 py-2.5 border-t border-neutral-300 bg-neutral-50">
        <span className="text-neutral-600 tabular-nums">
          Showing {filteredCount} of {totalCount}
        </span>
        {footerExtra}
      </div>
    </div>
  )
}
