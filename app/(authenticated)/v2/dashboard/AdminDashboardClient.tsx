'use client'

import { useSyncExternalStore } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  MapPin,
  MessageSquare,
  ShieldAlert
} from 'lucide-react'
import { CueBoxEvent, CueBoxEventInstance } from '@/app/types/cuebox.types'
import { formatDateLong, formatTime } from '@/app/lib/utils/date.utils'
import { LinkBody, LinkSpinner } from '@/components/common/LinkBody'
import { buildConcertViews, nextBookable, readClientNow, readServerNow, subscribeToNothing } from './_lib/concert-health'

interface Props {
  concerts: CueBoxEvent[]
  instances: CueBoxEventInstance[]
  pendingInquiriesCount: number
  potentialSpamCount: number
  newApplicationsCount: number
  campApplicationsCount: number
  mailchimpCount: number
  sponsorsActiveCount: number
  photosCount: number
  newsCount: number
  newsLiveCount: number
  eventsCount: number
  eventsLiveCount: number
  testimonialsCount: number
  testimonialsLiveCount: number
}

const Panel = ({
  title,
  href,
  linkLabel,
  children
}: {
  title: string
  href?: string
  linkLabel?: string
  children: React.ReactNode
}) => (
  <section className="border border-neutral-300 bg-white flex flex-col">
    <div className="flex items-center justify-between gap-3 px-3 h-9 border-b border-neutral-300">
      <h2 className="font-semibold text-neutral-900">{title}</h2>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-blaze-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
        >
          <LinkBody
            label={linkLabel ?? 'View all'}
            icon={<ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />}
            spinnerClass="w-3.5 h-3.5"
            iconAfter
          />
        </Link>
      )}
    </div>
    {children}
  </section>
)

export function AdminDashboardClient({
  concerts,
  instances,
  pendingInquiriesCount,
  potentialSpamCount,
  newApplicationsCount,
  campApplicationsCount,
  mailchimpCount,
  sponsorsActiveCount,
  photosCount,
  newsCount,
  newsLiveCount,
  eventsCount,
  eventsLiveCount,
  testimonialsCount,
  testimonialsLiveCount
}: Props) {
  const now = useSyncExternalStore(subscribeToNothing, readClientNow, readServerNow)

  const views = buildConcertViews(concerts, instances, now)
  const next = nextBookable(views)
  const upcomingCount = views.reduce((total, view) => total + view.upcoming.length, 0)
  const liveConcerts = views.filter((view) => view.concert.isVisibleOnline).length

  const concertProblems = views.flatMap((view) => view.problems.map((text) => ({ name: view.concert.name, text })))

  const todo = [
    {
      show: pendingInquiriesCount > 0,
      Icon: MessageSquare,
      href: '/v2/questions',
      text: `${pendingInquiriesCount} ${pendingInquiriesCount === 1 ? 'inquiry has' : 'inquiries have'} not been answered`
    },
    {
      show: potentialSpamCount > 0,
      Icon: ShieldAlert,
      href: '/v2/questions',
      text: `${potentialSpamCount} ${potentialSpamCount === 1 ? 'message is' : 'messages are'} flagged as possible spam`
    },
    {
      show: newApplicationsCount > 0,
      Icon: ClipboardList,
      href: '/v2/camp-applications',
      text: `${newApplicationsCount} new camp ${newApplicationsCount === 1 ? 'application' : 'applications'} to review`
    },
    ...concertProblems.map(({ name, text }) => ({
      show: true,
      Icon: AlertTriangle,
      href: '/v2/concerts',
      text: `${name} — ${text.charAt(0).toLowerCase()}${text.slice(1)}`
    }))
  ].filter((item) => item.show)

  const daysAway = next && now !== null ? Math.ceil((new Date(next.inst.startsAt).getTime() - now) / 86_400_000) : null

  return (
    <div className="flex flex-col gap-2">
      {/* What needs you */}
      <Panel
        title={todo.length > 0 ? `${todo.length} ${todo.length === 1 ? 'thing needs' : 'things need'} you` : 'Nothing needs you'}
      >
        {todo.length === 0 ? (
          <p className="flex items-center gap-2 px-3 py-3 text-emerald-800 bg-emerald-50">
            <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
            Inquiries are answered, applications are reviewed, and every concert on the website is bookable.
          </p>
        ) : (
          <ul role="list" className="flex flex-col">
            {todo.map(({ Icon, href, text }) => (
              <li key={text} className="border-b border-neutral-200 last:border-0">
                <Link
                  href={href}
                  className="flex items-center gap-2.5 px-3 h-9 hover:bg-neutral-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-inset"
                >
                  <LinkBody
                    label={<span className="text-neutral-900 truncate">{text}</span>}
                    icon={<Icon className="w-4 h-4 shrink-0 text-blaze-text" aria-hidden="true" />}
                    spinnerClass="w-4 h-4 shrink-0 text-blaze-text"
                  />
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 text-neutral-400 ml-auto" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <div className="grid grid-cols-1 990:grid-cols-2 gap-2">
        {/* Next performance */}
        <Panel title="Next performance" href="/v2/concerts" linkLabel="All concerts">
          {next ? (
            <div className="flex flex-col gap-2 px-3 py-3">
              <p className="text-base font-semibold text-neutral-900">{next.view.concert.name}</p>
              <div className="flex items-center gap-2 text-neutral-700">
                <Calendar className="w-4 h-4 shrink-0 text-neutral-400" aria-hidden="true" />
                {formatDateLong(next.inst.startsAt)} at {formatTime(next.inst.startsAt)}
                {daysAway !== null && (
                  <span className="text-neutral-500">
                    · {daysAway === 0 ? 'today' : daysAway === 1 ? 'tomorrow' : `in ${daysAway} days`}
                  </span>
                )}
              </div>
              {next.inst.venue?.name && (
                <div className="flex items-center gap-2 text-neutral-700">
                  <MapPin className="w-4 h-4 shrink-0 text-neutral-400" aria-hidden="true" />
                  {next.inst.venue.name}
                </div>
              )}
              {next.inst.publicTicketsUrl && (
                <a
                  href={next.inst.publicTicketsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 w-fit text-blaze-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
                >
                  See what patrons see
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              )}
            </div>
          ) : (
            <p className="px-3 py-3 text-neutral-600">No upcoming performance is on sale.</p>
          )}
        </Panel>

        {/* Season */}
        <Panel title="This season" href="/v2/concerts" linkLabel="All concerts">
          <dl className="grid grid-cols-2 divide-x divide-neutral-200">
            {[
              { label: 'Concerts live', value: `${liveConcerts} / ${views.length}` },
              { label: 'Performances ahead', value: upcomingCount }
            ].map(({ label, value }) => (
              <div key={label} className="px-3 py-3">
                <dd className="text-2xl font-bold tabular-nums text-neutral-900">{value}</dd>
                <dt className="text-neutral-600 mt-0.5">{label}</dt>
              </div>
            ))}
          </dl>
        </Panel>
      </div>

      {/* Mailchimp */}
      <Panel title="Mailing list">
        <div className="flex flex-wrap items-center justify-between gap-4 px-3 py-3">
          <div>
            <p className="text-2xl font-bold tabular-nums text-neutral-900">{mailchimpCount.toLocaleString()}</p>
            <p className="text-neutral-600 mt-0.5">people subscribed</p>
          </div>

          <a
            href="https://us2.admin.mailchimp.com/audience/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 h-9 px-4 border border-neutral-300 bg-white font-medium text-neutral-800 hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
          >
            Open in Mailchimp
            <ExternalLink className="w-4 h-4 shrink-0" aria-hidden="true" />
          </a>
        </div>

        <p className="px-3 pb-3 text-neutral-500 leading-relaxed">
          Campaigns, segments and subscriber details all live in Mailchimp. This is the current total.
        </p>
      </Panel>

      {/* Audience */}
      <Panel title="Audience">
        <dl className="grid grid-cols-2 760:grid-cols-4 divide-x divide-y 760:divide-y-0 divide-neutral-200">
          {[
            { label: 'Camp applications', value: campApplicationsCount, href: '/v2/camp-applications' },
            { label: 'Active sponsors', value: sponsorsActiveCount, href: '/v2/sponsors' },
            { label: 'News articles', value: newsLiveCount, href: '/v2/news' },
            { label: 'Photos', value: photosCount, href: '/v2/gallery' }
          ].map(({ label, value, href }) => (
            <Link
              key={label}
              href={href}
              className="px-3 py-3 hover:bg-neutral-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-inset"
            >
              <dd className="text-2xl font-bold tabular-nums text-neutral-900">{value.toLocaleString()}</dd>
              <dt className="flex items-center gap-1.5 text-neutral-600 mt-0.5">
                {label}
                <LinkSpinner />
              </dt>
            </Link>
          ))}
        </dl>
      </Panel>

      {/* Website content */}
      <Panel title="Website content">
        <ul role="list" className="flex flex-col">
          {[
            { label: 'News', live: newsLiveCount, total: newsCount, href: '/v2/news' },
            { label: 'Events', live: eventsLiveCount, total: eventsCount, href: '/v2/events' },
            { label: 'Testimonials', live: testimonialsLiveCount, total: testimonialsCount, href: '/v2/testimonials' }
          ].map(({ label, live, total, href }) => {
            const drafts = total - live

            return (
              <li key={label} className="border-b border-neutral-200 last:border-0">
                <Link
                  href={href}
                  className="flex items-center justify-between gap-3 px-3 h-9 hover:bg-neutral-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-inset"
                >
                  <span className="flex items-center gap-1.5 text-neutral-900">
                    {label}
                    <LinkSpinner />
                  </span>
                  <span className="text-neutral-600 tabular-nums">
                    <span className="font-semibold text-neutral-900">{live}</span> live
                    {drafts > 0 && <span className="text-neutral-500"> · {drafts} unpublished</span>}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </Panel>
    </div>
  )
}
