'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Calendar, MapPin, ArrowLeft, Phone } from 'lucide-react'
import { CueBoxEvent, CueBoxEventInstance } from '@/app/types/cuebox.types'
import { useSession } from 'next-auth/react'
import Picture from '@/app/components/common/Picture'
import { FloatingParticles } from '@/app/components/FloatingParticles'
import Link from 'next/link'
import { PublicMarquee } from '@/app/components/elements/PublicMarquee'

type Props = { events: CueBoxEvent[]; instances: any[] }

const STATUS_LABEL: Record<string, string> = {
  ON_SALE: 'On Sale',
  PRESALE: 'Presale',
  NOT_ON_SALE: 'Coming Soon',
  SOLD_OUT: 'Sold Out',
  CANCELED: 'Canceled'
}

const STATUS_COLOR: Record<string, string> = {
  ON_SALE: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5',
  PRESALE: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/5',
  NOT_ON_SALE: 'text-white/40 border-white/10',
  SOLD_OUT: 'text-orange-400 border-orange-400/30 bg-orange-400/5',
  CANCELED: 'text-white/20 border-white/10'
}

function formatInstanceDate(startsAt: string) {
  const d = new Date(startsAt)
  return (
    d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }) +
    ' · ' +
    d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  )
}

// ─── Concert Card ─────────────────────────────────────────────────────────────

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
  const isOnSale = event.status === 'ON_SALE'

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: index * 0.04 }}
      aria-label={event.name}
      className="grid grid-cols-1 760:grid-cols-[320px_1fr] 990:grid-cols-[400px_1fr] border-b border-white/10 last:border-0"
    >
      {/* Square image */}
      {hasImage ? (
        <div className="relative aspect-square overflow-hidden">
          <Picture
            src={event.publicImageUrl}
            alt={event.name}
            fill
            priority={index < 2}
            className="object-cover object-center"
            sizes="(max-width: 760px) 100vw, (max-width: 1080px) 320px, 400px"
          />
          {/* Status badge over image */}
          <div className="absolute top-3 left-3">
            <span
              className={`text-[9px] font-mono uppercase tracking-widest px-2 py-1 border backdrop-blur-sm bg-black/40 ${STATUS_COLOR[event.status] ?? 'text-white/40 border-white/10'}`}
            >
              {STATUS_LABEL[event.status] ?? event.status}
            </span>
          </div>
        </div>
      ) : (
        <div className="hidden 760:block aspect-square bg-white/2 border-r border-white/10" />
      )}

      {/* Content */}
      <div className="flex flex-col justify-between px-6 760:px-10 py-8 760:py-10 bg-black">
        <div className="flex flex-col gap-5">
          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <div className="w-5 h-px bg-blaze shrink-0" aria-hidden="true" />
            <span className="font-changa text-[10px] uppercase tracking-[0.3em] text-white/30">2026–27 Season</span>
          </div>

          {/* Title */}
          <h2 className="font-changa font-black text-3xl 760:text-4xl 990:text-5xl text-white leading-[0.95]">
            {event.name}
          </h2>

          {/* Description */}
          {event.descriptionPlaintext && (
            <p className="font-lato text-base text-white/60 leading-relaxed max-w-lg">{event.descriptionPlaintext}</p>
          )}

          {/* Performances */}
          {instances.length > 0 && (
            <div className="flex flex-col gap-0 border-t border-white/10 pt-5">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-3.5 h-3.5 text-blaze shrink-0" aria-hidden="true" />
                <span className="font-changa text-[10px] uppercase tracking-[0.25em] text-white/30">Performances</span>
              </div>
              {instances.map((inst) => (
                <div
                  key={inst.id}
                  className="flex flex-col 480:flex-row 480:items-center gap-0.5 480:gap-4 py-2.5 border-b border-white/5 last:border-0"
                >
                  <span className="font-lato text-sm 760:text-base text-white leading-snug">
                    {formatInstanceDate(inst.startsAt)}
                  </span>
                  {inst.venue?.name && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <MapPin className="w-3 h-3 text-blaze shrink-0" aria-hidden="true" />
                      <span className="font-lato text-sm text-white/50">{inst.venue.name}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="pt-8">
          {isOnSale ? (
            <a
              href={event.publicTicketsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Buy tickets for ${event.name}`}
              className="inline-flex items-center gap-3 px-7 py-3.5 bg-blaze hover:bg-blazehover text-white font-changa text-sm uppercase tracking-widest transition-colors w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Buy Tickets
              <ExternalLink className="w-4 h-4 shrink-0" aria-hidden="true" />
            </a>
          ) : (
            <span
              className={`inline-flex text-[10px] font-changa uppercase tracking-[0.25em] px-3 py-1.5 border ${STATUS_COLOR[event.status] ?? 'text-white/20 border-white/5'}`}
            >
              {STATUS_LABEL[event.status] ?? 'Unavailable'}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

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
    <main className="min-h-screen bg-bg-dark text-text-dark">
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-border-dark">
        <div className="max-w-5xl mx-auto px-4 760:px-6 h-12 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group focus-visible:outline-none">
            <span className="text-primary-dark text-[11px] group-hover:text-white transition-colors" aria-hidden="true">
              ▸
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-dark group-hover:text-text-dark transition-colors">
              The Pops Orchestra
            </span>
          </Link>

          {/* Right */}
          <div className="flex items-center gap-3 760:gap-4">
            <Link
              href="/v2/dashboard"
              className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-muted-dark/80 hover:text-text-dark transition-colors focus-visible:outline-none"
            >
              <ArrowLeft className="w-3 h-3" />
              <span className="hidden 480:inline">Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </header>
      {/* Hero */}
      <section className="relative border-b border-white/10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/nikki-fire.webp')",
            backgroundSize: 'cover',
            backgroundPosition: 'center center'
          }}
          aria-hidden="true"
        />
        <FloatingParticles count={80} />
        <div className="absolute inset-0 bg-linear-to-r from-black via-black/50 to-transparent" />

        <div className="relative max-w-5xl mx-auto px-4 760:px-6 py-20 760:py-28 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="w-5 h-px bg-blaze shrink-0" aria-hidden="true" />
            <span className="font-changa text-[10px] uppercase tracking-[0.3em] text-white/30">The Pops Orchestra</span>
          </div>
          <h1 className="font-changa font-black text-5xl 760:text-7xl text-white leading-[0.9] max-w-xl">
            2026–27
            <br />
            Season
            <br />
            Concerts
          </h1>
          <p className="font-lato text-white/70 text-base 760:text-lg leading-relaxed max-w-lg">
            Join us for an unforgettable season of live orchestral music in Sarasota and Bradenton.
          </p>
          <div className="flex flex-wrap items-center gap-5 pt-2">
            <Link
              href="/donate"
              className="inline-flex items-center gap-2 font-changa text-[11px] uppercase tracking-widest px-6 py-2.5 border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors"
            >
              Donate
            </Link>
            <a
              href="tel:9419267677"
              className="flex items-center gap-1.5 font-changa text-[10px] uppercase tracking-widest text-white/30 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              941-926-POPS
            </a>
          </div>
        </div>
      </section>

      <PublicMarquee
        items={[
          '2026–27 Season Now On Sale',
          'Performing in Sarasota & Bradenton',
          'Save with a Season Subscription or Flex Package',
          'Call 941-926-POPS to Order by Phone',
          'World-Class Guest Artists · Live Orchestral Music'
        ]}
      />

      {/* Concert list */}
      {events.length > 0 ? (
        <div className="max-w-5xl mx-auto px-4 760:px-6">
          {events.map((event, i) => (
            <ConcertCard key={event.id} event={event} index={i} instances={instancesByEvent[event.id] ?? []} />
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
