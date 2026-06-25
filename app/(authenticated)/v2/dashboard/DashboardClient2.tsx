'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import type { TeamMember, Question, CampApplication } from '@prisma/client'
import { useClock } from '@/app/lib/hooks/useClock'
import { InquiriesCard } from '../../../components/dashboard/InquiriesCard'
import { CueBoxEvent } from '@/app/types/cuebox.types'
import { ConcertsCard } from '../../../components/dashboard/ConcertsCard'
import { TopBar } from '../../../components/dashboard/TopBar'
import { CampHeatmapCard } from '@/app/components/dashboard/HeatMapCard'

interface Props {
  concerts: CueBoxEvent[]
  venuesCount: number
  teamMembers: TeamMember[]
  photosCount: number
  questions: Question[]
  usersCount: number
  campApplicationsCount: number
  campApplications: CampApplication[]
  campApplicationsEnabled: boolean
  newApplicationsCount: number
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

const getStatPills = (data: Props & { pendingCount: number }) => [
  {
    label: 'Subscriptions',
    value: 0,
    accent: false,
    href: '/v2/subscriptions'
  },
  { label: 'Inquiries', value: data.pendingCount, accent: data.pendingCount > 0, href: '/v2/questions' },
  { label: 'Team', value: data.teamMembers.length, accent: false, href: '/v2/team' },
  { label: 'Camp Apps', value: data.campApplicationsCount, accent: false, href: '/v2/camp-applications' },
  { label: 'Users', value: data.usersCount, accent: false, href: '/v2/users' },
  { label: 'Mailchimp', value: data.mailchimpCount, accent: false, href: '/v2/mailchimp-members' },
  { label: 'Sponsors', value: data.sponsorsActiveCount, accent: false, href: '/v2/sponsors' },
  { label: 'Venues', value: data.venuesCount, accent: false, href: '/v2/venues' },
  { label: 'Gallery', value: data.photosCount, accent: false, href: '/v2/gallery' },
  { label: 'Page Content', value: data.pageContentCount, accent: false, href: '/v2/page-content-editor' },
  { label: 'Events', value: data.eventsCount, accent: false, href: '/v2/events' },
  { label: 'Testimonials', value: data.testimonialsCount, accent: false, href: '/v2/testimonials' },
  { label: 'News', value: data.newsCount, accent: false, href: '/v2/news' },
  { label: 'Settings', value: 0, accent: false, href: '/v2/settings' },
  { label: 'Changelog', value: 'v3.9.2', href: '/v2/changelog' }
]

export default function DashboardClient2(props: Props) {
  const {
    concerts,
    questions,
    campApplications,
    campApplicationsEnabled,
    newApplicationsCount,
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
  const pendingCount = questions.filter((q) => !q.hasResponded).length
  const statPills = getStatPills({ ...props, pendingCount })

  return (
    <>
      {/* Dot grid background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
        aria-hidden="true"
      />
      {/* Scanline overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-50"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px)'
        }}
        aria-hidden="true"
      />

      <div className="min-h-dvh 760:h-screen flex flex-col overflow-hidden bg-bg-dark text-text-dark relative z-10">
        {/* ── Top Bar ── */}
        <TopBar date={date} time={time} />

        {/* Main grid */}
        <div className="flex-1 min-h-0 p-2">
          <div
            className="760:h-full flex flex-col gap-2 760:grid 760:grid-cols-[140px_repeat(3,minmax(0,1fr))] 1336:grid-cols-[160px_repeat(4,minmax(0,1fr))] 760:gap-2"
            style={{ gridAutoRows: 'minmax(0, 1fr)' }}
          >
            {/* PILLS RAIL — thin first column: greeting + vertical stat pills */}
            <div className="760:col-span-1 760:row-span-10 flex flex-col min-h-0">
              {/* Greeting */}
              <div className="shrink-0 flex flex-col gap-1.5 px-3 py-2.5 border border-border-dark bg-bg-dark">
                <span className="text-[10px] font-mono text-muted-dark uppercase tracking-widest">{date}</span>
                <span className="text-sm font-mono text-text-dark leading-snug">
                  {greeting}, <span className="text-primary-dark">{firstName}.</span>
                </span>
              </div>

              {/* Stat pills — vertical labels only, scrolls if tall */}
              <div className="mt-2 flex-1 min-h-0 overflow-y-auto flex flex-col divide-y divide-border-dark border border-border-dark bg-bg-dark">
                {statPills.map(({ label, href, value }) => {
                  const inner = (
                    <div
                      className={`flex items-center px-3 py-2 ${href ? 'hover:bg-surface-dark transition-colors cursor-pointer' : ''}`}
                      title={`${value}`}
                    >
                      <span className="text-[10px] font-mono tracking-[0.12em] uppercase text-muted-dark whitespace-nowrap">
                        {label}
                      </span>
                    </div>
                  )
                  return href ? (
                    <Link key={label} href={href} aria-label={`View ${label}`} className="block">
                      {inner}
                    </Link>
                  ) : (
                    <div key={label}>{inner}</div>
                  )
                })}
              </div>
            </div>

            {/* CONCERTS */}
            <div className="760:col-span-2 760:row-span-10 min-h-100 760:min-h-0">
              <ConcertsCard concerts={concerts} />
            </div>

            {/* INQUIRIES */}
            <div className="order-3 760:col-span-1 760:row-span-2 760:min-h-0">
              <InquiriesCard
                pending={questions.filter((q) => !q.hasResponded && !q.isSpam && !q.isPotentialSpam).length}
                responded={questions.filter((q) => q.hasResponded).length}
                potentialSpam={questions.filter((q) => q.isPotentialSpam && !q.isSpam).length}
                href="/v2/questions"
              />
            </div>

            {/* CAMP HEATMAP */}
            <div className="order-4 760:col-span-1 760:row-span-8 min-h-75 760:min-h-0">
              <CampHeatmapCard
                campApplications={campApplications}
                campApplicationsEnabled={campApplicationsEnabled}
                newApplicationsCount={newApplicationsCount}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-border-dark bg-surface-dark px-4 py-1.5 flex flex-col 760:flex-row 760:items-center 760:justify-between gap-1 760:gap-0">
          <span className="text-[9.5px] font-mono text-muted-dark uppercase tracking-widest">
            The Pops Orchestra · Sqysh
          </span>
          <div className="flex items-center gap-3 flex-wrap">
            {[
              `News · ${newsLiveCount} live / ${newsCount}`,
              `Events · ${eventsLiveCount} live / ${eventsCount}`,
              `Testimonials · ${testimonialsLiveCount} live / ${testimonialsCount}`,
              `Photos · ${photosCount}`
            ].map((label) => (
              <span key={label} className="text-[10px] font-mono text-muted-dark">
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
