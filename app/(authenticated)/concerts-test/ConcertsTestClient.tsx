'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Calendar, MapPin } from 'lucide-react'
import { CueBoxEvent, CueBoxEventInstance } from '@/app/types/cuebox.types'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Picture from '@/app/components/common/Picture'

type Props = { events: CueBoxEvent[]; instances: any[] }

function formatInstanceDate(isoString: string) {
  const date = new Date(isoString)
  return (
    date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }) +
    ' · ' +
    date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase().replace(' ', '\u00a0')
  )
}

function ConcertCard({
  event,
  instances,
  index
}: {
  event: CueBoxEvent
  instances: CueBoxEventInstance[]
  index: number
}) {
  const hasImage = !!event.publicImageUrl

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
      aria-label={event.name}
      className="grid grid-cols-1 990:grid-cols-2 border-b border-white/10 last:border-0"
    >
      {/* Image */}
      {hasImage && (
        <div className="relative overflow-hidden" style={{ minHeight: '360px' }}>
          <Picture
            src={event.publicImageUrl}
            alt={event.name}
            fill
            priority={index < 2}
            className="object-cover"
            sizes="(max-width: 990px) 100vw, 50vw"
          />
          <div
            className="absolute inset-0 bg-linear-to-r from-transparent to-black/60 hidden 990:block"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent 990:hidden" aria-hidden="true" />
        </div>
      )}

      {/* Content */}
      <div
        className={`flex flex-col justify-center px-8 430:px-12 py-10 990:py-16 bg-black ${!hasImage ? '990:col-span-2 max-w-3xl mx-auto w-full' : ''}`}
      >
        {/* Season eyebrow */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-6 h-px bg-blaze shrink-0" aria-hidden="true" />
          <p className="font-changa text-[11px] uppercase tracking-[0.3em] text-white/40">2026–27 Season</p>
        </div>

        {/* Concert name */}
        <h2 className="font-changa text-3xl 430:text-4xl 990:text-5xl text-white leading-tight mb-6">{event.name}</h2>

        {/* Description */}
        {event.descriptionPlaintext && (
          <p className="font-lato text-base 430:text-lg text-white/70 leading-relaxed mb-8 max-w-xl">
            {event.descriptionPlaintext}
          </p>
        )}

        {/* Dates + venues */}
        {instances.length > 0 && (
          <div className="flex flex-col gap-3 mb-8">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-blaze shrink-0" aria-hidden="true" />
              <p className="font-changa text-[11px] uppercase tracking-[0.25em] text-white/40">Performances</p>
            </div>
            {instances.map((inst) => (
              <div
                key={inst.id}
                className="flex flex-col 430:flex-row 430:items-center gap-1 430:gap-4 pl-6 border-l border-blaze/30"
              >
                <p className="font-lato text-base 430:text-lg text-white leading-snug">
                  {formatInstanceDate(inst.startsAt)}
                </p>
                {inst.venue?.name && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-blaze shrink-0" aria-hidden="true" />
                    <p className="font-lato text-base text-white/60">{inst.venue.name}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        {event.status === 'ON_SALE' ? (
          <a
            href={event.publicTicketsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Buy tickets for ${event.name} — opens in new tab`}
            className="inline-flex items-center gap-3 px-8 py-4 bg-blaze hover:bg-blazehover text-white font-changa text-base uppercase tracking-widest transition-colors w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Buy Tickets
            <ExternalLink className="w-4 h-4 shrink-0" aria-hidden="true" />
          </a>
        ) : (
          <p className="font-changa text-[11px] uppercase tracking-[0.25em] text-white/30">Tickets not yet on sale</p>
        )}
      </div>
    </motion.article>
  )
}

export default function ConcertsTestClient({ events, instances }: Props) {
  const { data: session, status } = useSession()

  if (status === 'loading') return null
  if (!session?.user?.role) return null

  const { role } = session.user
  if (role !== 'ADMIN' && role !== 'CONDUCTOR' && role !== 'SUPER_USER') return null

  const instancesByEvent = instances.reduce<Record<string, CueBoxEventInstance[]>>((acc, inst) => {
    if (!acc[inst.eventId]) acc[inst.eventId] = []
    acc[inst.eventId].push(inst)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-black text-text-dark">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-8 430:px-12 990:px-16 py-8 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-6 h-px bg-blaze shrink-0" aria-hidden="true" />
              <p className="font-changa text-[11px] uppercase tracking-[0.3em] text-white/40">The Pops Orchestra</p>
            </div>
            <h1 className="font-changa text-2xl 430:text-3xl text-white leading-none">2026–27 Season Concerts</h1>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <Link
              href="/v2/dashboard"
              className="font-changa text-[11px] uppercase tracking-widest text-white/40 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/"
              className="font-changa text-[11px] uppercase tracking-widest text-white/40 hover:text-white transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Concert list */}
      {events.length > 0 ? (
        <div className="max-w-7xl mx-auto">
          {events.map((event, i) => (
            <ConcertCard key={event.id} event={event} index={i} instances={instancesByEvent[event.id] ?? []} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-40 gap-4 text-center px-4">
          <p className="font-changa text-2xl text-white/30">No concerts found</p>
          <p className="font-lato text-base text-white/20">Concerts will appear here once entered in CueBox</p>
        </div>
      )}
    </div>
  )
}
