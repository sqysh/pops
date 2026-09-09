'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useClock } from '@/app/lib/hooks/useClock'
import { CueBoxEvent, CueBoxEventInstance } from '@/app/types/cuebox.types'
import { ConcertsBoard } from './_components/ConcertsBoard'
import { TopBar } from './_components/TopBar'

interface Props {
  concerts: CueBoxEvent[]
  instances: CueBoxEventInstance[]
  venuesCount: number
  teamCount: number
  photosCount: number
  pendingInquiriesCount: number
  usersCount: number
  campApplicationsCount: number
  pageContentCount: number
  newsCount: number
  newsLiveCount: number
  testimonialsCount: number
  testimonialsLiveCount: number
  eventsCount: number
  eventsLiveCount: number
  sponsorsActiveCount: number
  mailchimpCount: number
}

const getSections = (data: Props & { pendingCount: number }) => [
  { label: 'Inquiries', value: data.pendingInquiriesCount, accent: data.pendingInquiriesCount > 0, href: '/v2/questions' },
  { label: 'Camp Applications', value: data.campApplicationsCount, accent: false, href: '/v2/camp-applications' },
  { label: 'Subscriptions', value: null, accent: false, href: '/v2/subscriptions' },
  { label: 'Team', value: data.teamCount, accent: false, href: '/v2/team' },
  { label: 'Users', value: data.usersCount, accent: false, href: '/v2/users' },
  { label: 'Mailchimp', value: data.mailchimpCount, accent: false, href: '/v2/mailchimp-members' },
  { label: 'Sponsors', value: data.sponsorsActiveCount, accent: false, href: '/v2/sponsors' },
  { label: 'Venues', value: data.venuesCount, accent: false, href: '/v2/venues' },
  { label: 'Gallery', value: data.photosCount, accent: false, href: '/v2/gallery' },
  { label: 'Page Content', value: data.pageContentCount, accent: false, href: '/v2/page-content-editor' },
  { label: 'Events', value: data.eventsCount, accent: false, href: '/v2/events' },
  { label: 'Testimonials', value: data.testimonialsCount, accent: false, href: '/v2/testimonials' },
  { label: 'News', value: data.newsCount, accent: false, href: '/v2/news' },
  { label: 'Settings', value: null, accent: false, href: '/v2/settings' },
  { label: 'Changelog', value: null, accent: false, href: '/v2/changelog' }
]

export default function DashboardClient2(props: Props) {
  const {
    concerts,
    instances,
    pendingInquiriesCount,
    newsCount,
    newsLiveCount,
    eventsCount,
    eventsLiveCount,
    testimonialsCount,
    testimonialsLiveCount,
    photosCount
  } = props

  const { time, date } = useClock()
  const session = useSession()
  const firstName = session.data?.user?.name?.split(' ')[0] ?? 'there'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const pendingCount = pendingInquiriesCount
  const sections = getSections({ ...props, pendingCount })

  return (
    // below 1160 the page scrolls normally; at 1160 and up the shell is pinned
    // to the viewport and only the board scrolls
    <div className="min-h-dvh 1160:h-dvh 1160:overflow-hidden flex flex-col bg-neutral-50 text-neutral-900">
      <TopBar date={date} time={time} />

      <div className="flex-1 1160:min-h-0 flex flex-col 1160:flex-row gap-6 p-4 760:p-6">
        {/* Nav rail — fixed, scrolls internally only if it outgrows the viewport */}
        <aside className="1160:w-64 1160:shrink-0 1160:h-full 1160:overflow-y-auto flex flex-col gap-4">
          <div className="shrink-0 flex flex-col gap-2 px-5 py-4 border border-neutral-200 bg-white rounded-sm">
            <span className="text-sm font-medium text-neutral-600">{date}</span>
            <span className="text-xl font-semibold leading-snug">
              {greeting}, <span className="text-blaze-text">{firstName}</span>
            </span>
          </div>

          <nav aria-label="Dashboard sections" className="border border-neutral-200 bg-white rounded-sm">
            <ul role="list" className="flex flex-col divide-y divide-neutral-200">
              {sections.map(({ label, href, value, accent }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="flex items-center justify-between gap-3 px-5 py-3.5 min-h-14 hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-inset"
                  >
                    <span className="text-base font-medium text-neutral-800">{label}</span>
                    {value !== null && (
                      <span
                        className={`text-base font-semibold tabular-nums shrink-0 ${
                          accent ? 'text-blaze-text' : 'text-neutral-500'
                        }`}
                      >
                        {value}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Concerts — the only scrolling region on desktop */}
        <main className="flex-1 min-w-0 1160:h-full 1160:overflow-y-auto">
          <ConcertsBoard concerts={concerts} instances={instances} />
        </main>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-neutral-200 bg-white px-5 760:px-6 py-4 flex flex-col 990:flex-row 990:items-center 990:justify-between gap-3">
        <span className="text-sm font-medium text-neutral-600">The Pops Orchestra · Sqysh</span>
        <dl className="flex items-center gap-x-6 gap-y-2 flex-wrap">
          {[
            { label: 'News', value: `${newsLiveCount} live / ${newsCount}` },
            { label: 'Events', value: `${eventsLiveCount} live / ${eventsCount}` },
            { label: 'Testimonials', value: `${testimonialsLiveCount} live / ${testimonialsCount}` },
            { label: 'Photos', value: `${photosCount}` }
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center gap-2">
              <dt className="text-sm text-neutral-600">{label}</dt>
              <dd className="text-sm font-semibold text-neutral-900 tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
