'use client'

import Link from 'next/link'
import { CueBoxEvent, CueBoxEventInstance } from '@/app/types/cuebox.types'
import { SiteSetting } from '@prisma/client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { ConcertCard } from './_components/ConcertCard'
import CompactPageHero from '@/app/(public)/_components/CompactPageHero'

type Props = { events: CueBoxEvent[]; instances: any[]; concertsPageLive: SiteSetting['value'] }

export default function ConcertsClient({ events, instances, concertsPageLive }: Props) {
  const searchParams = useSearchParams()
  const concertName = searchParams.get('ref')
  const cardRefs = useRef<Record<string, HTMLElement | null>>({})

  const instancesByEvent = instances.reduce<Record<string, CueBoxEventInstance[]>>((acc, inst) => {
    if (!acc[inst.eventId]) acc[inst.eventId] = []
    acc[inst.eventId].push(inst)
    return acc
  }, {})

  useEffect(() => {
    if (!concertName) return

    const target = cardRefs.current[concertName]
    if (target) {
      const t = setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
      return () => clearTimeout(t)
    }
  }, [concertName])

  if (!concertsPageLive) {
    return (
      <main className="min-h-[calc(100svh-1080px)] bg-black text-white flex flex-col items-center justify-center px-6 text-center">
        <div className="relative z-10 flex flex-col items-center gap-6 max-w-lg">
          <p className="font-mono text-sm tracking-[0.3em] uppercase text-blaze-text">The Pops Orchestra</p>
          <h1 className="font-changa text-6xl sm:text-7xl font-bold text-white leading-none">Coming Soon</h1>
          <div className="w-12 h-px bg-blaze" />
          <p className="font-lato text-white/60 text-sm leading-relaxed">
            Our concerts page is on its way. In the meantime, visit our homepage for the latest news and upcoming performances.
          </p>
          <Link
            href="/"
            className="font-mono text-sm tracking-widest uppercase px-6 py-3 border border-white/20 text-white/60 hover:border-blaze hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze-text focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Back to Home
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-bg-dark text-text-dark">
      <CompactPageHero
        breadcrumb="Concerts"
        heading="2026–27 Season Concerts"
        description="Join us for an unforgettable season of live orchestral music in Sarasota and Bradenton."
      />

      {/* Concert list */}
      {events.length > 0 ? (
        <div className="max-w-5xl mx-auto px-4 760:px-6">
          {events.map((event, i) => (
            <ConcertCard
              key={event.id}
              event={event}
              index={i}
              instances={instancesByEvent[event.id] ?? []}
              ref={(node: HTMLElement | null) => {
                cardRefs.current[event.name] = node
              }}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-40 gap-4 text-center px-6">
          <p className="font-changa text-2xl text-white/20">No concerts found</p>
          <p className="font-lato text-base text-white/15">Concerts will appear here once entered in CueBox</p>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 760:px-12 990:px-16 py-5">
        <div className="max-w-5xl mx-auto px-4 760:px-6 flex flex-col 480:flex-row items-start 480:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-4 h-px bg-blaze shrink-0" aria-hidden="true" />
            <span className="font-changa text-[10px] uppercase tracking-[0.25em] text-white/30">
              The Pops Orchestra · 2026–27 Season
            </span>
          </div>
          <div className="flex items-center gap-5">
            <Link
              href="/"
              className="font-changa text-[10px] uppercase tracking-widest text-white/25 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              href="/donate"
              className="font-changa text-[10px] uppercase tracking-widest text-white/25 hover:text-white transition-colors"
            >
              Donate
            </Link>

            <a
              href="tel:9419267677"
              className="font-changa text-[10px] uppercase tracking-widest text-white/25 hover:text-white transition-colors"
            >
              941-926-7677
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
