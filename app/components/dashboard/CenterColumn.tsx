import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink, KeyRound, Music2, Plug } from 'lucide-react'

const CUEBOX_ORG_ID = '21NL0B8D'
export function CenterColumn({ concerts }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex-1 flex flex-col overflow-hidden border-r border-border-dark"
    >
      {/* Concerts header — sticky within column */}
      <div className="shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-border-dark bg-bg-dark">
        <div className="flex items-center gap-2">
          <Music2 className="w-3.5 h-3.5 text-primary-dark" />
          <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-dark">Concerts</span>
          <span className="text-[9px] font-mono text-muted-dark/40">({concerts.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://app.getcuebox.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] font-mono tracking-[0.15em] uppercase text-muted-dark hover:text-text-dark transition-colors"
          >
            CueBox ↗
          </a>
        </div>
      </div>

      {/* Concerts list — scrollable */}
      <div className="flex-1 overflow-y-auto">
        {concerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 px-6 text-center">
            <Music2 className="w-10 h-10 text-border-dark" />
            <p className="text-muted-dark text-sm">No upcoming concerts</p>
          </div>
        ) : (
          concerts.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.13 + i * 0.04 }}
              className="flex items-center border-b border-border-dark/40 last:border-0 group"
            >
              <div className="flex items-center justify-between gap-4 px-4 py-3.5 flex-1 min-w-0">
                {/* Name + meta */}
                <div className="min-w-0 flex-1">
                  <p className="text-text-dark text-sm font-medium truncate">{c.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {/* CueBox status */}
                    <span className="font-mono text-[9px] tracking-widest uppercase text-muted-dark/50">
                      {c.status.replace('_', ' ')}
                    </span>
                    {/* Visibility dot */}
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${c.isVisibleOnline ? 'bg-emerald-400' : 'bg-border-dark'}`}
                      title={c.isVisibleOnline ? 'Visible online' : 'Hidden online'}
                    />
                    <span className="font-mono text-[9px] text-muted-dark/40">
                      {c.isVisibleOnline ? 'visible' : 'hidden'}
                    </span>
                  </div>
                </div>

                {/* External CueBox link */}
                <a
                  href={`https://app.getcuebox.com/a/${CUEBOX_ORG_ID}/shows/${c.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 p-2 text-border-dark hover:text-primary-dark hover:bg-surface-dark transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark"
                  aria-label={`Edit ${c.name} in CueBox`}
                  title="Edit in CueBox"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* ── CueBox API Endpoints ── */}
      <div className="shrink-0 border-t border-border-dark">
        {/* Section header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-dark bg-bg-dark">
          <div className="flex items-center gap-2">
            <Plug className="w-3.5 h-3.5 text-primary-dark" />
            <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-dark">CueBox API</span>
            <span className="text-[9px] font-mono text-muted-dark/40">api.getcuebox.com/external/v1</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[9px] font-mono text-muted-dark/40">
              <KeyRound className="w-2.5 h-2.5" />
              BearerAuth
            </span>

            <a
              href="https://docs.getcuebox.com/docs/external/cuebox-external-api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[9px] font-mono tracking-[0.15em] uppercase text-muted-dark hover:text-text-dark transition-colors"
            >
              Docs ↗
            </a>
          </div>
        </div>

        {/* Endpoint rows */}
        <div className="max-h-44 overflow-y-auto divide-y divide-border-dark/40">
          {[
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
          ].map(({ method, path, label, note, href }) => (
            <a
              key={`${method}-${path}`}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-dark transition-colors group"
            >
              {/* Method badge */}
              <span className="text-[8px] font-mono tracking-[0.12em] uppercase w-8 shrink-0 text-emerald-400 mt-0.5">
                {method}
              </span>

              {/* Path + note stacked */}
              <div className="flex-1 min-w-0">
                <code className="text-[10px] font-mono text-muted-dark/60 group-hover:text-text-dark transition-colors block truncate">
                  {path}
                </code>
                {note && <span className="text-[9px] font-mono text-muted-dark/30 mt-0.5 block truncate">{note}</span>}
              </div>

              {/* Label */}
              <span className="text-[9px] font-mono text-muted-dark/40 shrink-0 hidden sm:block truncate max-w-40 mt-0.5">
                {label}
              </span>

              <ArrowRight className="w-3 h-3 text-border-dark group-hover:text-primary-dark group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
            </a>
          ))}
        </div>
      </div>
    </motion.main>
  )
}
