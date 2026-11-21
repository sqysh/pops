'use client'

import { useState, useSyncExternalStore } from 'react'
import { ExternalLink, AlertTriangle, CheckCircle2, ChevronDown, Plug } from 'lucide-react'
import { CueBoxEvent, CueBoxEventInstance } from '@/app/types/cuebox.types'
import { CUEBOX_ORG_ID } from '@/app/lib/constants/cueBox.constants'

/**
 * Spreadsheet density, web app surface: 32px rows and tight vertical padding,
 * but horizontal rules only, no cell borders, and no grey chrome.
 */
const ROW = 'grid grid-cols-[minmax(0,180px)_88px_minmax(0,1fr)_128px_minmax(0,200px)_40px] items-center gap-4 px-4'
const CELL_PAD = 'py-1.5 min-h-8'

const STATUS_LABEL: Record<string, string> = {
  ON_SALE: 'On sale',
  PRESALE: 'Presale',
  NOT_ON_SALE: 'Not on sale',
  SOLD_OUT: 'Sold out',
  CANCELED: 'Canceled'
}

/** A dot carries the state; the text stays near-black unless something is off. */
const STATUS_DOT: Record<string, string> = {
  ON_SALE: 'bg-emerald-500',
  PRESALE: 'bg-amber-500',
  NOT_ON_SALE: 'bg-neutral-300',
  SOLD_OUT: 'bg-amber-500',
  CANCELED: 'bg-red-500'
}

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

/**
 * The clock is an external system, so read it through useSyncExternalStore
 * rather than during render or from an effect. The server snapshot is null,
 * meaning nothing is treated as past, which is what the server can honestly
 * say; the client fills in a real time at hydration. The value is cached so
 * the snapshot stays stable across renders, and it does not tick: a dashboard
 * left open should not silently reclassify rows while someone is reading it.
 */
const subscribeToNothing = () => () => {}
let clientNow: number | null = null
const readClientNow = () => (clientNow ??= Date.now())
const readServerNow = () => null

const Dot = ({ className }: { className: string }) => (
  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${className}`} aria-hidden="true" />
)

export function ConcertsBoard({ concerts, instances }: { concerts: CueBoxEvent[]; instances: CueBoxEventInstance[] }) {
  const [apiExpanded, setApiExpanded] = useState(false)
  const now = useSyncExternalStore(subscribeToNothing, readClientNow, readServerNow)

  const instancesByEvent = instances.reduce<Record<string, CueBoxEventInstance[]>>((acc, inst) => {
    if (!acc[inst.eventId]) acc[inst.eventId] = []
    acc[inst.eventId].push(inst)
    return acc
  }, {})

  Object.values(instancesByEvent).forEach((list) =>
    list.sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
  )

  const rows = concerts.map((concert) => {
    const showtimes = (instancesByEvent[concert.id] ?? []).map((inst) => {
      // A patron sees a performance only when the concert AND the performance
      // are both visible. Either flag on its own tells you nothing useful.
      const onSite = concert.isVisibleOnline && inst.isVisibleOnline
      const bookable = onSite && (inst.status === 'ON_SALE' || inst.status === 'PRESALE')
      const past = now !== null && new Date(inst.startsAt).getTime() < now
      return { ...inst, onSite, bookable, past }
    })

    const upcoming = showtimes.filter((inst) => !inst.past)
    const bookable = upcoming.filter((inst) => inst.bookable)

    const problems: string[] = []
    if (showtimes.length === 0) {
      problems.push('No performances scheduled in CueBox')
    } else if (concert.isVisibleOnline && upcoming.length > 0 && bookable.length === 0) {
      problems.push('Showing on the website, but no upcoming performance can be booked')
    }

    return { concert, showtimes, upcoming, problems }
  })

  const problems = rows.flatMap(({ concert, problems }) => problems.map((text) => ({ name: concert.name, id: concert.id, text })))

  const publicConcerts = rows.filter((row) => row.concert.isVisibleOnline).length
  const draftConcerts = rows.length - publicConcerts
  const upcomingCount = rows.reduce((total, row) => total + row.upcoming.length, 0)

  const nextUp = rows
    .flatMap((row) => row.showtimes.filter((inst) => inst.bookable && !inst.past).map((inst) => ({ inst, row })))
    .sort((a, b) => new Date(a.inst.startsAt).getTime() - new Date(b.inst.startsAt).getTime())[0]

  return (
    <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden text-sm">
      {/* The one line to read first */}
      <div
        className={`flex items-start gap-2.5 px-4 py-3 border-b ${
          problems.length > 0 ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'
        }`}
      >
        {problems.length > 0 ? (
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
        )}
        <div className="min-w-0">
          {problems.length === 0 ? (
            <p className="font-medium text-emerald-900">
              Everything looks right. {publicConcerts} concert{publicConcerts === 1 ? '' : 's'} on the website
              {draftConcerts > 0 && `, ${draftConcerts} still hidden while you build ${draftConcerts === 1 ? 'it' : 'them'}`}.
            </p>
          ) : (
            <>
              <p className="font-medium text-red-900">
                {problems.length} {problems.length === 1 ? 'concert needs' : 'concerts need'} a look
              </p>
              <ul role="list" className="mt-1 flex flex-col gap-0.5 text-red-800">
                {problems.map(({ name, id, text }) => (
                  <li key={`${id}-${text}`}>
                    <a
                      href={`https://app.getcuebox.com/a/${CUEBOX_ORG_ID}/shows/${id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium underline underline-offset-2 hover:text-red-900"
                    >
                      {name}
                    </a>
                    <span> — {text}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {/* Summary */}
      <dl className="flex flex-wrap items-center gap-x-8 gap-y-1 px-4 py-3 border-b border-neutral-200">
        <div className="flex items-baseline gap-2">
          <dt className="text-neutral-500">On the website</dt>
          <dd className="font-semibold text-neutral-900 tabular-nums">
            {publicConcerts} of {rows.length}
          </dd>
        </div>
        <div className="flex items-baseline gap-2">
          <dt className="text-neutral-500">Upcoming performances</dt>
          <dd className="font-semibold text-neutral-900 tabular-nums">{upcomingCount}</dd>
        </div>
        {nextUp && (
          <div className="flex items-baseline gap-2">
            <dt className="text-neutral-500">Next on sale</dt>
            <dd className="font-semibold text-neutral-900">
              {nextUp.row.concert.name}, {formatDay(nextUp.inst.startsAt)}
            </dd>
          </div>
        )}
      </dl>

      {/* Column headings */}
      <div
        className={`${ROW} py-2 sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-neutral-200 text-xs font-medium uppercase tracking-wide text-neutral-500`}
      >
        <span>Date</span>
        <span>Time</span>
        <span>Venue</span>
        <span>Tickets</span>
        <span>Patrons can see it</span>
        <span className="sr-only">Link</span>
      </div>

      {/* Concerts */}
      {rows.length === 0 ? (
        <p className="px-4 py-12 text-center text-neutral-500">Waiting on CueBox credentials and 26–27 season data</p>
      ) : (
        rows.map(({ concert, showtimes, upcoming, problems }) => (
          <section key={concert.id} aria-label={concert.name} className="border-b border-neutral-200 last:border-0">
            {/* Concert */}
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2.5 bg-neutral-50/70">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 min-w-0">
                <h3 className="text-base font-semibold text-neutral-900 truncate">{concert.name}</h3>
                {!concert.isVisibleOnline && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 ring-1 ring-amber-200 rounded-full px-2 py-0.5">
                    <Dot className="bg-amber-500" />
                    Hidden from website
                  </span>
                )}
                <span className="text-neutral-500">
                  {showtimes.length} performance{showtimes.length === 1 ? '' : 's'}
                  {upcoming.length !== showtimes.length && `, ${upcoming.length} upcoming`}
                </span>
              </div>

              <a
                href={`https://app.getcuebox.com/a/${CUEBOX_ORG_ID}/shows/${concert.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 font-medium text-blaze-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze rounded-sm"
              >
                Edit in CueBox
              </a>
            </div>

            {/* Problems */}
            {problems.map((problem) => (
              <p key={problem} className="flex items-center gap-2 px-4 py-2 bg-red-50 border-t border-red-100 text-red-800">
                <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
                {problem}
              </p>
            ))}

            {/* Performances */}
            {showtimes.map((inst) => (
              <div
                key={inst.id}
                className={`${ROW} ${CELL_PAD} border-t border-neutral-100 hover:bg-neutral-50 transition-colors ${
                  inst.past ? 'text-neutral-400' : 'text-neutral-900'
                }`}
              >
                <span className={inst.status === 'CANCELED' ? 'line-through' : ''}>
                  {formatDay(inst.startsAt)}
                  {inst.past && <span className="text-neutral-400"> · past</span>}
                </span>

                <span className="tabular-nums">{formatTime(inst.startsAt)}</span>

                <span className="truncate text-neutral-600">{inst.venue?.name ?? '—'}</span>

                <span className="flex items-center gap-2">
                  <Dot className={STATUS_DOT[inst.status] ?? 'bg-neutral-300'} />
                  <span className={inst.status === 'CANCELED' ? 'text-red-700' : ''}>
                    {STATUS_LABEL[inst.status] ?? inst.status}
                  </span>
                </span>

                <span className="flex items-center gap-2 min-w-0">
                  <Dot className={inst.onSite ? 'bg-emerald-500' : 'bg-amber-500'} />
                  <span className={`truncate ${inst.onSite ? '' : 'text-amber-700'}`}>
                    {inst.onSite ? 'Yes' : concert.isVisibleOnline ? 'No, this date is hidden' : 'No, concert is hidden'}
                  </span>
                </span>

                <span className="flex justify-end">
                  {inst.publicTicketsUrl && (
                    <a
                      href={inst.publicTicketsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ticket page for ${concert.name} on ${formatDay(inst.startsAt)}`}
                      title="Open ticket page"
                      className="inline-flex p-1.5 -m-1.5 rounded text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
                    >
                      <ExternalLink className="w-4 h-4" aria-hidden="true" />
                    </a>
                  )}
                </span>
              </div>
            ))}
          </section>
        ))
      )}

      {/* API reference */}
      <div className="border-t border-neutral-200">
        <button
          type="button"
          onClick={() => setApiExpanded((v) => !v)}
          aria-expanded={apiExpanded}
          className="w-full flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-neutral-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-inset"
        >
          <span className="flex items-center gap-2 text-neutral-600">
            <Plug className="w-4 h-4" aria-hidden="true" />
            <span className="font-medium">CueBox API reference</span>
          </span>
          <ChevronDown
            className={`w-4 h-4 text-neutral-400 transition-transform ${apiExpanded ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>

        {apiExpanded && (
          <ul role="list" className="border-t border-neutral-200">
            {ENDPOINTS.map(({ method, path, label, href }) => (
              <li key={path} className="border-b border-neutral-100 last:border-0">
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 px-4 py-2 min-h-8 hover:bg-neutral-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-inset"
                >
                  <span className="text-xs font-medium uppercase text-emerald-700 w-9 shrink-0">{method}</span>
                  <code className="font-mono text-neutral-900 w-56 shrink-0 truncate">{path}</code>
                  <span className="text-neutral-500 truncate">{label}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
