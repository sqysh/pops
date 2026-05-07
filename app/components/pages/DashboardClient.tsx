'use client'

import { AnimatePresence } from 'framer-motion'
import type {
  Venue,
  TeamMember,
  Question,
  User as PrismaUser,
  CampApplication,
  Page,
  CustomRequest,
  Sponsor,
  News
} from '@prisma/client'
import { useClock } from '@/app/lib/hooks/useClock'
import { useState } from 'react'
import ContactSubmissionModal from '../modals/ContactSubmissionModal'
import TestimonialModal from '../modals/TestimonialModal'
import CustomRequestModal from '../modals/CustomRequestModal'
import CustomRequestDetailModal from '../modals/CustomRequestDetailsModal'
import SponsorModal from '../modals/SponsorModal'
import { TopBar } from '../dashboard/TopBar'
import { GreetingAndStats } from '../dashboard/GreetingAndStats'
import { LeftColumn } from '../dashboard/LeftColumn'
import { CenterColumn } from '../dashboard/CenterColumn'
import { RightColumn } from '../dashboard/RightColumn'
import { FooterStrip } from '../dashboard/FooterStrip'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useDashboardSearch } from '@/app/lib/hooks/useDashboardSearch'
import { DashboardSearch } from '../dashboard/DashboardSearch'
import { CueBoxEvent } from '@/app/types/cuebox.types'

interface Props {
  concerts: CueBoxEvent[]
  venues: Venue[]
  teamMembers: TeamMember[]
  photosCount: number
  questions: Question[]
  users: PrismaUser[]
  pageContentCount: number
  mailchimpCount: number
  campApplicationsCount: number
  campApplications: CampApplication[]
  pages: Page[]
  newsCount: number
  newsLiveCount: number
  news: News[]
  testimonialsCount: number
  testimonialsLiveCount: number
  customRequests: CustomRequest[]
  eventsCount: number
  eventsLiveCount: number
  sponsors: Sponsor[]
  sponsorsActiveCount: number
}

export default function DashboardClient({
  concerts,
  venues,
  teamMembers,
  photosCount,
  questions,
  users,
  pageContentCount,
  mailchimpCount,
  campApplicationsCount,
  campApplications,
  pages,
  newsCount,
  newsLiveCount,
  news,
  testimonialsCount,
  testimonialsLiveCount,
  customRequests,
  eventsCount,
  eventsLiveCount,
  sponsors,
  sponsorsActiveCount
}: Props) {
  const { time, date } = useClock()
  const pending = questions.filter((q) => !q.hasResponded)
  const onSale = concerts.filter((c) => c.status === 'ON_SALE')
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)

  const [testimonialModalOpen, setTestimonialModalOpen] = useState(false)
  const [customRequestModalOpen, setCustomRequestModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<CustomRequest | null>(null)
  const [sponsorModalOpen, setSponsorModalOpen] = useState(false)
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null)

  const session = useSession()
  const firstName = session.data?.user?.name?.split(' ')[0] ?? 'there'

  const { query, results, search, clear } = useDashboardSearch({
    concerts,
    venues,
    teamMembers,
    questions,
    users,
    customRequests,
    sponsors,
    news
  })

  return (
    <>
      <ContactSubmissionModal
        key={selectedQuestion?.id}
        question={selectedQuestion}
        onClose={() => setSelectedQuestion(null)}
      />

      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
        aria-hidden="true"
      />

      <div
        className="fixed inset-0 pointer-events-none z-50"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.015) 3px, rgba(255,255,255,0.015) 4px)'
        }}
        aria-hidden="true"
      />

      <AnimatePresence>
        {testimonialModalOpen && <TestimonialModal onClose={() => setTestimonialModalOpen(false)} testimonial={null} />}
      </AnimatePresence>

      <AnimatePresence>
        {customRequestModalOpen && <CustomRequestModal onClose={() => setCustomRequestModalOpen(false)} />}
      </AnimatePresence>

      <CustomRequestDetailModal request={selectedRequest} onClose={() => setSelectedRequest(null)} />

      <AnimatePresence>
        {sponsorModalOpen && <SponsorModal sponsor={selectedSponsor} onClose={() => setSponsorModalOpen(false)} />}
      </AnimatePresence>

      <div className="h-screen flex flex-col overflow-hidden bg-bg-dark text-text-dark">
        {/* ── Top Bar ── */}
        <TopBar date={date} time={time} />

        {/* CueBox Status Marquees */}

        {/* 1 — API connected */}
        <div className="shrink-0 border-b border-emerald-500/20 bg-emerald-500/5 overflow-hidden py-1.5">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="flex whitespace-nowrap"
          >
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="text-[9px] font-mono text-emerald-400/70 pr-16">
                <span className="text-emerald-400">● CONNECTED —</span> CueBox API integrated · Real concert data
                syncing live
                <span className="text-emerald-500/50 mx-4">·</span>
                Edit concerts directly in CueBox — changes reflect automatically
                <span className="text-emerald-500/50 mx-4">·</span>
              </span>
            ))}
          </motion.div>
        </div>

        {/* 2 — Public page not live yet */}
        <div className="shrink-0 border-b border-yellow-500/20 bg-yellow-500/5 overflow-hidden py-1.5">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
            className="flex whitespace-nowrap"
          >
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="text-[9px] font-mono text-yellow-400/70 pr-16">
                <span className="text-yellow-400">⚠ PENDING —</span> Public{' '}
                <span className="text-yellow-400">/concerts</span> page is not live yet
                <span className="text-yellow-500/50 mx-4">·</span>
                Awaiting further details from Robyn before publishing — Sqysh will activate once confirmed
                <span className="text-yellow-500/50 mx-4">·</span>
              </span>
            ))}
          </motion.div>
        </div>

        {/* 3 — Admin test page */}
        <div className="shrink-0 border-b border-blue-500/20 bg-blue-500/5 overflow-hidden py-1.5">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
            className="flex whitespace-nowrap"
          >
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="text-[9px] font-mono text-blue-400/70 pr-16">
                <span className="text-blue-400">● ADMIN ONLY —</span> Concert preview page live at{' '}
                <Link
                  href="/concerts-test"
                  className="text-blue-400 underline underline-offset-2 hover:text-blue-300 transition-colors"
                >
                  /concerts-test
                </Link>
                <span className="text-blue-500/50 mx-4">·</span>
                Restricted to Admin and Conductor User roles
                <span className="text-blue-500/50 mx-4">·</span>
              </span>
            ))}
          </motion.div>
        </div>

        {/* 4 — Mock concert data notice */}
        <div className="shrink-0 border-b border-purple-500/20 bg-purple-500/5 overflow-hidden py-1.5">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
            className="flex whitespace-nowrap"
          >
            {[0, 1].map((i) => (
              <span key={i} className="text-[9px] font-mono text-purple-400/70 pr-16">
                <span className="text-purple-400">● LIVE —</span> Donate button active · Links to CueBox donation page
                <span className="text-purple-500/50 mx-4">·</span>
                Concert data on the home page is hardcoded mock data — Sqysh will update once further details are
                confirmed
                <span className="text-purple-500/50 mx-4">·</span>
              </span>
            ))}
          </motion.div>
        </div>

        {/* ── Greeting + Stats ── */}
        <GreetingAndStats
          campApplicationsCount={campApplicationsCount}
          concerts={concerts}
          date={date}
          eventsCount={eventsCount}
          mailchimpCount={mailchimpCount}
          newsCount={newsCount}
          onSale={onSale}
          pending={pending}
          photosCount={photosCount}
          sponsorsActiveCount={sponsorsActiveCount}
          teamMembers={teamMembers}
          testimonialsCount={testimonialsCount}
          venues={venues}
        />

        <DashboardSearch query={query} results={results} onSearch={search} onClear={clear} firstName={firstName} />

        {/* ── Three Column Body (fills remaining height, each col scrolls) ── */}
        <div className="flex-1 flex overflow-hidden">
          {/* ── Left Column ── */}
          <LeftColumn
            customRequests={customRequests}
            pageContentCount={pageContentCount}
            pages={pages}
            setCustomRequestModalOpen={setCustomRequestModalOpen}
            setSelectedRequest={setSelectedRequest}
            teamMembers={teamMembers}
            venues={venues}
          />

          {/* ── Center Column — Concerts ── */}
          <CenterColumn concerts={concerts} />

          {/* ── Right Column ── */}
          <RightColumn
            campApplications={campApplications}
            campApplicationsCount={campApplicationsCount}
            pending={pending}
            questions={questions}
            setSelectedQuestion={setSelectedQuestion}
            setSelectedSponsor={setSelectedSponsor}
            setSponsorModalOpen={setSponsorModalOpen}
            sponsors={sponsors}
            users={users}
          />
        </div>

        {/* ── Footer Strip — always pinned ── */}
        <FooterStrip
          eventsCount={eventsCount}
          eventsLiveCount={eventsLiveCount}
          newsCount={newsCount}
          newsLiveCount={newsLiveCount}
          photosCount={photosCount}
          setTestimonialModalOpen={setTestimonialModalOpen}
          testimonialsCount={testimonialsCount}
          testimonialsLiveCount={testimonialsLiveCount}
        />
      </div>
    </>
  )
}
