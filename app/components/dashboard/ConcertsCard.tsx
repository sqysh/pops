'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Music2, Plug, KeyRound, ArrowRight, ChevronDown } from 'lucide-react'
import { CueBoxEvent } from '@/app/types/cuebox.types'
import { CUEBOX_ORG_ID } from '@/app/lib/constants/cueBox.constants'

const statusColor: Record<string, string> = {
  ON_SALE: '#4ade80',
  PRESALE: '#facc15',
  NOT_ON_SALE: '#da0032',
  SOLD_OUT: '#f97316',
  CANCELED: '#888888'
}

const ENDPOINTS = [
  {
    method: 'GET',
    path: '/events',
    label: 'List events',
    note: 'Filter by instanceDatetimeStartFrom / instanceDatetimeStartTo (max 2yr range)',
    href: 'https://docs.getcuebox.com/docs/external/cuebox-external-service-list-events'
  },
  {
    method: 'GET',
    path: '/events/:id',
    label: 'Get an event by ID',
    note: 'Requires id path param — ID of the event to retrieve',
    href: 'https://docs.getcuebox.com/docs/external/cuebox-external-service-get-event'
  },
  {
    method: 'GET',
    path: '/events/:id/instances',
    label: 'List event instances by event ID',
    note: 'Requires eventId path param — filters instances to that event',
    href: 'https://docs.getcuebox.com/docs/external/cuebox-external-service-list-event-instances-for-event'
  },
  {
    method: 'GET',
    path: '/event-instances',
    label: 'List event instances',
    note: 'Filter by startsAtFrom / startsAtTo (max 2yr range, default 1yr window)',
    href: 'https://docs.getcuebox.com/docs/external/cuebox-external-service-list-event-instances'
  },
  {
    method: 'GET',
    path: '/event-instances/:id',
    label: 'Get an event instance by ID',
    note: 'Requires id path param — unique identifier for the event instance',
    href: 'https://docs.getcuebox.com/docs/external/cuebox-external-service-get-event-instance'
  }
]

export function ConcertsCard({ concerts }: { concerts: CueBoxEvent[] }) {
  const [apiExpanded, setApiExpanded] = useState(false)
  const onSale = concerts.filter((c) => c.status === 'ON_SALE')

  return (
    <div className="bg-surface-dark border border-border-dark flex flex-col h-full transition-colors">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-3 py-2 border-b border-border-dark">
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-mono tracking-[0.2em] uppercase text-muted-dark">[ CONCERTS ]</span>
          <span className="text-[8px] font-mono text-muted-dark/40">· {concerts.length}</span>
        </div>
        <div className="flex items-center gap-3">
          {onSale.length > 0 && (
            <span className="text-[7px] font-mono uppercase tracking-widest px-1.5 py-0.5 border text-emerald-400 border-emerald-400/30 bg-emerald-400/5">
              ● {onSale.length} on sale
            </span>
          )}
          <a
            href="https://app.getcuebox.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[8px] font-mono uppercase tracking-[0.15em] text-muted-dark/60 hover:text-primary-dark transition-colors"
          >
            CueBox ↗
          </a>
        </div>
      </div>

      {/* Count */}
      <div className="shrink-0 px-3 pt-3 pb-2 border-b border-border-dark">
        <div className="text-5xl font-mono font-bold leading-none text-text-dark">{concerts.length}</div>
        <div className="text-[8px] font-mono uppercase tracking-[0.15em] text-muted-dark/50 mt-1">via cuebox api</div>
      </div>

      {/* Concert list */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {concerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 px-4 text-center">
            <Music2 className="w-6 h-6 text-border-dark" aria-hidden="true" />
            <p className="text-[9px] font-mono text-muted-dark/40 leading-relaxed max-w-48">
              Waiting on CueBox credentials and 26–27 season data
            </p>
          </div>
        ) : (
          concerts.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.04 }}
              className="flex items-center justify-between gap-3 px-3 py-2.5 border-b border-border-dark last:border-0 group hover:bg-black/40 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-mono text-text-dark truncate">{c.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className="text-[8px] font-mono uppercase tracking-widest"
                    style={{ color: statusColor[c.status] ?? '#888888' }}
                  >
                    {c.status.replace(/_/g, ' ')}
                  </span>
                  <span className="text-muted-dark/20 text-[8px]">·</span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${c.isVisibleOnline ? 'bg-emerald-400' : 'bg-border-dark'}`}
                    aria-hidden="true"
                  />
                  <span className="text-[8px] font-mono text-muted-dark/40">
                    {c.isVisibleOnline ? 'visible' : 'hidden'}
                  </span>
                </div>
              </div>
              <a
                href={`https://app.getcuebox.com/a/${CUEBOX_ORG_ID}/shows/${c.id}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Edit ${c.name} in CueBox`}
                className="shrink-0 text-muted-dark/20 hover:text-primary-dark transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark opacity-0 group-hover:opacity-100"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </motion.div>
          ))
        )}
      </div>

      {/* CueBox API — expandable */}
      <div className="shrink-0 border-t border-border-dark">
        {/* Toggle bar */}
        <button
          type="button"
          onClick={() => setApiExpanded((v) => !v)}
          className="w-full flex items-center justify-between px-3 py-2 hover:bg-black/40 transition-colors group"
          aria-expanded={apiExpanded}
        >
          <div className="flex items-center gap-2">
            <Plug className="w-2.5 h-2.5 text-primary-dark shrink-0" />
            <span className="text-[7px] font-mono uppercase tracking-[0.15em] text-muted-dark/50 group-hover:text-muted-dark transition-colors">
              CueBox API
            </span>
            <span className="text-[7px] font-mono text-muted-dark/25 hidden sm:block">
              api.getcuebox.com/external/v1
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[7px] font-mono text-muted-dark/25">
              <KeyRound className="w-2 h-2" />
              BearerAuth
            </span>
            <motion.div animate={{ rotate: apiExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-3 h-3 text-muted-dark/25 group-hover:text-muted-dark/50 transition-colors" />
            </motion.div>
          </div>
        </button>

        {/* Endpoint list */}
        <AnimatePresence initial={false}>
          {apiExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="border-t border-border-dark/60">
                {/* Sub-header */}
                <div className="flex items-center justify-between px-3 py-1.5 bg-bg-dark border-b border-border-dark/40">
                  <span className="text-[7px] font-mono uppercase tracking-widest text-muted-dark/30">
                    {ENDPOINTS.length} endpoints
                  </span>
                  <a
                    href="https://docs.getcuebox.com/docs/external/cuebox-external-api"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[7px] font-mono uppercase tracking-widest text-muted-dark/40 hover:text-text-dark transition-colors"
                  >
                    Docs ↗
                  </a>
                </div>

                {/* Endpoints */}
                <div className="max-h-44 overflow-y-auto divide-y divide-border-dark/40">
                  {ENDPOINTS.map(({ method, path, label, note, href }) => (
                    <a
                      key={`${method}-${path}`}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2 hover:bg-surface-dark transition-colors group/ep"
                    >
                      <span className="text-[7px] font-mono tracking-[0.12em] uppercase w-7 shrink-0 text-emerald-400">
                        {method}
                      </span>
                      <div className="flex-1 min-w-0">
                        <code className="text-[9px] font-mono text-muted-dark/60 group-hover/ep:text-text-dark transition-colors block truncate">
                          {path}
                        </code>
                        {note && (
                          <span className="text-[7px] font-mono text-muted-dark/30 mt-0.5 block truncate">{note}</span>
                        )}
                      </div>
                      <span className="text-[7px] font-mono text-muted-dark/30 shrink-0 hidden lg:block truncate max-w-32">
                        {label}
                      </span>
                      <ArrowRight className="w-2.5 h-2.5 text-border-dark group-hover/ep:text-primary-dark group-hover/ep:translate-x-0.5 transition-all shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
