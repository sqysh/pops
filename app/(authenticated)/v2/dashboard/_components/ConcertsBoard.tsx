'use client'

import { useState } from 'react'
import { ExternalLink, Music2, AlertTriangle, Plug, ArrowRight, ChevronDown, KeyRound } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { CueBoxEvent, CueBoxEventInstance } from '@/app/types/cuebox.types'
import { CUEBOX_ORG_ID } from '@/app/lib/constants/cueBox.constants'

const STATUS_COLOR: Record<string, string> = {
  ON_SALE: 'text-emerald-700 bg-emerald-50 border-emerald-300',
  PRESALE: 'text-amber-800 bg-amber-50 border-amber-300',
  NOT_ON_SALE: 'text-blaze-text bg-blaze/5 border-blaze/40',
  SOLD_OUT: 'text-orange-800 bg-orange-50 border-orange-300',
  CANCELED: 'text-neutral-600 bg-neutral-100 border-neutral-300'
}

/** CueBox sends UTC. Pin to the orchestra's timezone so these times match
 *  what CueBox shows, wherever the admin happens to be. */
const TIMEZONE = 'America/New_York'

const formatDay = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: TIMEZONE
  })

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: TIMEZONE })

const ENDPOINTS = [
  {
    method: 'GET',
    path: '/events',
    label: 'List events',
    href: 'https://docs.getcuebox.com/docs/external/cuebox-external-service-list-events'
  },
  {
    method: 'GET',
    path: '/events/:id',
    label: 'Get an event by ID',
    href: 'https://docs.getcuebox.com/docs/external/cuebox-external-service-get-event'
  },
  {
    method: 'GET',
    path: '/events/:id/instances',
    label: 'List instances for an event',
    href: 'https://docs.getcuebox.com/docs/external/cuebox-external-service-list-event-instances-for-event'
  },
  {
    method: 'GET',
    path: '/event-instances',
    label: 'List event instances',
    href: 'https://docs.getcuebox.com/docs/external/cuebox-external-service-list-event-instances'
  },
  {
    method: 'GET',
    path: '/event-instances/:id',
    label: 'Get an event instance by ID',
    href: 'https://docs.getcuebox.com/docs/external/cuebox-external-service-get-event-instance'
  }
]

const StatusBadge = ({ status }: { status: string }) => (
  <span
    className={`inline-flex shrink-0 text-sm font-semibold uppercase tracking-wide px-2.5 py-1 border rounded-sm ${
      STATUS_COLOR[status] ?? 'text-neutral-600 bg-neutral-100 border-neutral-300'
    }`}
  >
    {status.replace(/_/g, ' ')}
  </span>
)

const WebsiteBadge = ({ visible }: { visible: boolean }) => (
  <span
    className={`inline-flex items-center gap-2 shrink-0 text-sm font-semibold px-2.5 py-1 border rounded-sm ${
      visible ? 'text-emerald-800 bg-emerald-50 border-emerald-300' : 'text-neutral-600 bg-neutral-100 border-neutral-300'
    }`}
  >
    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${visible ? 'bg-emerald-600' : 'bg-neutral-400'}`} aria-hidden="true" />
    {visible ? 'On website' : 'Hidden'}
  </span>
)

/** Column template, shared by the header and every showtime row so they align. */
const COLUMNS = 'grid grid-cols-1 990:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_170px_150px_56px] gap-2 990:gap-4 990:items-center'

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-baseline gap-2 min-w-0">
    <span className="990:hidden text-sm text-neutral-500 shrink-0 w-24">{label}</span>
    <div className="min-w-0">{children}</div>
  </div>
)

export function ConcertsBoard({ concerts, instances }: { concerts: CueBoxEvent[]; instances: CueBoxEventInstance[] }) {
  const [issuesOnly, setIssuesOnly] = useState(false)
  const [apiExpanded, setApiExpanded] = useState(false)

  const instancesByEvent = instances.reduce<Record<string, CueBoxEventInstance[]>>((acc, inst) => {
    if (!acc[inst.eventId]) acc[inst.eventId] = []
    acc[inst.eventId].push(inst)
    return acc
  }, {})

  Object.values(instancesByEvent).forEach((list) =>
    list.sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
  )

  const rows = concerts.map((concert) => {
    const showtimes = instancesByEvent[concert.id] ?? []
    const hidden = showtimes.filter((inst) => !inst.isVisibleOnline)
    const visible = showtimes.filter((inst) => inst.isVisibleOnline)

    const issues: string[] = []
    if (showtimes.length === 0) issues.push('No showtimes scheduled')
    if (concert.isVisibleOnline && showtimes.length > 0 && visible.length === 0)
      issues.push('Show is on the website but every showtime is hidden, so nothing is bookable')
    if (!concert.isVisibleOnline && visible.length > 0)
      issues.push(`Show is hidden but ${visible.length} showtime${visible.length === 1 ? ' is' : 's are'} still marked visible`)

    return { concert, showtimes, hidden, issues }
  })

  const shown = issuesOnly ? rows.filter((row) => row.issues.length > 0) : rows

  const totals = {
    showtimes: instances.length,
    hiddenShows: concerts.filter((c) => !c.isVisibleOnline).length,
    hiddenShowtimes: instances.filter((inst) => !inst.isVisibleOnline).length,
    issues: rows.filter((row) => row.issues.length > 0).length
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-sm flex flex-col">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 px-5 760:px-7 py-5 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Concerts</h1>
          <p className="text-base text-neutral-600 mt-1">
            Everything CueBox is sending us, and what each piece looks like on the website.
          </p>
        </div>
        <a
          href="https://app.getcuebox.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-base font-semibold text-white bg-blaze hover:bg-blazehover px-4 py-2.5 rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-offset-2"
        >
          Open CueBox
          <ExternalLink className="w-4 h-4" aria-hidden="true" />
        </a>
      </div>

      {/* Totals */}
      <dl className="grid grid-cols-2 990:grid-cols-4 border-b border-neutral-200 divide-x divide-y 990:divide-y-0 divide-neutral-200">
        {[
          { label: 'Shows', value: concerts.length, tone: 'text-neutral-900' },
          { label: 'Showtimes', value: totals.showtimes, tone: 'text-neutral-900' },
          {
            label: 'Hidden from website',
            value: `${totals.hiddenShows} / ${totals.hiddenShowtimes}`,
            tone: 'text-neutral-900',
            hint: 'shows / showtimes'
          },
          {
            label: 'Need attention',
            value: totals.issues,
            tone: totals.issues > 0 ? 'text-orange-700' : 'text-neutral-900'
          }
        ].map(({ label, value, tone, hint }) => (
          <div key={label} className="px-5 760:px-7 py-4">
            <dd className={`text-4xl font-bold leading-none tabular-nums ${tone}`}>{value}</dd>
            <dt className="text-base text-neutral-600 mt-2">{label}</dt>
            {hint && <p className="text-sm text-neutral-500 mt-0.5">{hint}</p>}
          </div>
        ))}
      </dl>

      {/* Filter */}
      {totals.issues > 0 && (
        <div className="px-5 760:px-7 py-3 border-b border-neutral-200 bg-orange-50">
          <label className="flex items-center gap-3 cursor-pointer w-fit">
            <input
              type="checkbox"
              checked={issuesOnly}
              onChange={(e) => setIssuesOnly(e.target.checked)}
              className="w-5 h-5 accent-blaze cursor-pointer"
            />
            <span className="text-base font-medium text-neutral-900">
              Only show the {totals.issues} {totals.issues === 1 ? 'concert' : 'concerts'} that need attention
            </span>
          </label>
        </div>
      )}

      {/* Column headings, desktop only */}
      <div
        className={`${COLUMNS} hidden 990:grid sticky top-0 z-20 px-5 760:px-7 py-3 border-b border-neutral-200 bg-neutral-100 text-sm font-semibold uppercase tracking-wide text-neutral-700`}
      >
        <span>Performance</span>
        <span>Venue</span>
        <span>Ticket status</span>
        <span>Website</span>
        <span className="sr-only">Links</span>
      </div>

      {/* Concerts */}
      {shown.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 px-5 py-16 text-center">
          <Music2 className="w-10 h-10 text-neutral-300" aria-hidden="true" />
          <p className="text-lg text-neutral-600 max-w-md">
            {concerts.length === 0 ? 'Waiting on CueBox credentials and 26–27 season data' : 'Nothing needs attention right now.'}
          </p>
        </div>
      ) : (
        shown.map(({ concert, showtimes, hidden, issues }) => (
          <section key={concert.id} aria-label={concert.name} className="border-b border-neutral-200 last:border-0">
            {/* Concert header */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 760:px-7 py-4 bg-neutral-50 border-b border-neutral-200 990:sticky 990:top-11 990:z-10">
              <div className="flex flex-wrap items-center gap-3 min-w-0">
                <h2 className="text-xl font-bold text-neutral-900 truncate">{concert.name}</h2>
                <StatusBadge status={concert.status} />
                <WebsiteBadge visible={concert.isVisibleOnline} />
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className="text-base text-neutral-600">
                  {showtimes.length} showtime{showtimes.length === 1 ? '' : 's'}
                  {hidden.length > 0 && `, ${hidden.length} hidden`}
                </span>
                <a
                  href={`https://app.getcuebox.com/a/${CUEBOX_ORG_ID}/shows/${concert.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-base font-semibold text-blaze-text hover:text-blaze px-2 py-1.5 rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
                >
                  Edit
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Issues */}
            {issues.length > 0 && (
              <ul role="list" className="px-5 760:px-7 py-3 bg-orange-50 border-b border-orange-200 flex flex-col gap-2">
                {issues.map((issue) => (
                  <li key={issue} className="flex items-start gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-orange-700 shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-base text-orange-900">{issue}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Showtimes, always visible */}
            {showtimes.length > 0 && (
              <ul role="list" className="divide-y divide-neutral-200">
                {showtimes.map((inst) => (
                  <li key={inst.id} className={`${COLUMNS} px-5 760:px-7 py-4 ${inst.isVisibleOnline ? '' : 'bg-neutral-50'}`}>
                    <Field label="When">
                      <span
                        className={`text-base font-semibold block ${
                          inst.status === 'CANCELED' ? 'text-neutral-500 line-through' : 'text-neutral-900'
                        }`}
                      >
                        {formatDay(inst.startsAt)}
                      </span>
                      <span className="text-base text-neutral-600">{formatTime(inst.startsAt)}</span>
                    </Field>

                    <Field label="Venue">
                      <span className="text-base text-neutral-700 block truncate">{inst.venue?.name ?? '—'}</span>
                    </Field>

                    <Field label="Status">
                      <StatusBadge status={inst.status} />
                    </Field>

                    <Field label="Website">
                      <WebsiteBadge visible={inst.isVisibleOnline} />
                    </Field>

                    <div className="990:justify-self-end">
                      {inst.publicTicketsUrl && (
                        <a
                          href={inst.publicTicketsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open ticket selection for ${concert.name} on ${formatDay(inst.startsAt)}`}
                          title="Open ticket selection"
                          className="inline-flex items-center gap-2 text-neutral-500 hover:text-blaze-text hover:bg-neutral-100 p-2.5 rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
                        >
                          <span className="990:hidden text-base font-semibold">View ticket page</span>
                          <ExternalLink className="w-5 h-5" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))
      )}

      {/* API reference */}
      <div className="border-t border-neutral-200">
        <button
          type="button"
          onClick={() => setApiExpanded((v) => !v)}
          aria-expanded={apiExpanded}
          className="w-full flex items-center justify-between gap-3 px-5 760:px-7 py-4 hover:bg-neutral-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-inset"
        >
          <span className="flex items-center gap-2.5 min-w-0">
            <Plug className="w-4 h-4 text-blaze-text shrink-0" aria-hidden="true" />
            <span className="text-base font-semibold text-neutral-900">CueBox API reference</span>
            <code className="text-sm font-mono text-neutral-600 hidden 990:block">api.getcuebox.com/external/v1</code>
          </span>
          <span className="flex items-center gap-3 shrink-0">
            <span className="hidden 760:flex items-center gap-1.5 text-sm text-neutral-600">
              <KeyRound className="w-4 h-4" aria-hidden="true" />
              BearerAuth
            </span>
            <motion.span animate={{ rotate: apiExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-5 h-5 text-neutral-500" aria-hidden="true" />
            </motion.span>
          </span>
        </button>

        <AnimatePresence initial={false}>
          {apiExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <ul role="list" className="border-t border-neutral-200 divide-y divide-neutral-200">
                {ENDPOINTS.map(({ method, path, label, href }) => (
                  <li key={path}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 px-5 760:px-7 py-3.5 hover:bg-neutral-50 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-inset"
                    >
                      <span className="text-sm font-semibold uppercase text-emerald-700 w-11 shrink-0">{method}</span>
                      <code className="text-base font-mono text-neutral-900 truncate">{path}</code>
                      <span className="text-base text-neutral-600 hidden 990:block truncate ml-auto">{label}</span>
                      <ArrowRight
                        className="w-4 h-4 text-neutral-400 group-hover:text-blaze-text shrink-0 ml-auto 990:ml-0"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
