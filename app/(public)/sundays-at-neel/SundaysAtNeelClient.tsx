'use client'

import { motion } from 'framer-motion'
import { Calendar, ExternalLink, MapPin } from 'lucide-react'
import Picture from '@/components/common/Picture'
import CompactPageHero from '@/app/(public)/_components/CompactPageHero'
import { CueBoxEvent, CueBoxEventInstance } from '@/app/types/cuebox.types'
import { formatDateLong, formatTime, isSunday } from '@/app/lib/utils/date.utils'

/** The series is every Sunday performance at Neel Performing Arts Center. */
const VENUE_MATCH = 'neel'

export const SundaysAtNeelClient = ({ concerts, instances }: { concerts: CueBoxEvent[]; instances: CueBoxEventInstance[] }) => {
  // Only what a patron is allowed to see: the concert and the performance both
  // have to be visible in CueBox.
  const visible = instances.filter((inst) => {
    const concert = concerts.find((c) => c.id === inst.eventId)
    return concert?.isVisibleOnline && inst.isVisibleOnline
  })

  const selected = visible.filter((inst) => inst.venue?.name?.toLowerCase().includes(VENUE_MATCH) && isSunday(inst.startsAt))

  // One card per concert, showing its earliest qualifying performance
  const byEvent = new Map<string, CueBoxEventInstance>()
  for (const inst of [...selected].sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())) {
    if (!byEvent.has(inst.eventId)) byEvent.set(inst.eventId, inst)
  }

  const cards = [...byEvent.entries()]
    .map(([eventId, inst]) => ({ concert: concerts.find((c) => c.id === eventId), inst }))
    .filter((card): card is { concert: CueBoxEvent; inst: CueBoxEventInstance } => !!card.concert)

  return (
    <main id="main-content">
      <CompactPageHero
        breadcrumb="Sundays at Neel"
        heading="Sundays at Neel"
        description="Sunday afternoons at Neel Performing Arts Center. Come early, stay late, and let us handle the rest."
      />

      <div className="px-4 760:px-6 990:px-12">
        <section aria-labelledby="series-heading" className="relative z-10 max-w-5xl mx-auto py-16 760:py-20 990:py-28">
          <div className="flex items-center gap-3 mb-10 760:mb-12">
            <div className="w-6 h-px bg-blaze shrink-0" aria-hidden="true" />
            <h2 id="series-heading" className="font-changa text-sm uppercase tracking-[0.3em] text-blaze-text">
              This Season
            </h2>
          </div>

          {cards.length === 0 ? (
            <p className="font-lato text-base text-white/60 leading-relaxed max-w-lg">
              Dates for this series have not been announced yet. Check back soon, or join our mailing list to hear first.
            </p>
          ) : (
            <ul
              role="list"
              className="grid grid-cols-1 760:grid-cols-2 990:grid-cols-3 gap-8 990:gap-10 760:grid-rows-[auto_auto_auto_1fr]"
            >
              {cards.map(({ concert, inst }, i) => (
                <motion.li
                  key={concert.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
                  className="flex flex-col gap-4 760:grid 760:grid-rows-subgrid 760:row-span-4"
                >
                  {/* square box, contain: CueBox artwork is square and carries
                      the title and series lockup at the very top and bottom */}
                  <div className="relative aspect-square overflow-hidden bg-white/5">
                    {concert.publicImageUrl && (
                      <Picture
                        src={concert.publicImageUrl}
                        alt={concert.name}
                        fill
                        priority={i === 0}
                        className="object-contain object-center"
                        sizes="(max-width: 760px) 100vw, (max-width: 990px) 50vw, 33vw"
                      />
                    )}
                  </div>

                  <h3 className="font-changa font-black text-2xl 990:text-3xl text-white leading-tight self-start">
                    {concert.name}
                  </h3>

                  <div className="flex flex-col gap-2 self-start">
                    <div className="flex items-start gap-2.5">
                      <Calendar className="w-3.5 h-3.5 text-blaze shrink-0 mt-1" aria-hidden="true" />
                      <span className="font-lato text-sm text-white/80 leading-relaxed">
                        {formatDateLong(inst.startsAt)}
                        <span className="text-white/50"> · {formatTime(inst.startsAt)}</span>
                      </span>
                    </div>
                    {inst.venue?.name && (
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-3.5 h-3.5 text-blaze shrink-0 mt-1" aria-hidden="true" />
                        <span className="font-lato text-sm text-white/50">{inst.venue.name}</span>
                      </div>
                    )}
                  </div>

                  {/* always rendered so every card keeps the same four rows and
                      the grid can align them across the row */}
                  <div className="flex flex-col justify-between gap-6">
                    {concert.descriptionPlaintext && (
                      <p className="font-lato text-sm text-white/60 leading-relaxed line-clamp-4">
                        {concert.descriptionPlaintext}
                      </p>
                    )}

                    {inst.status === 'ON_SALE' && inst.publicTicketsUrl && (
                      <a
                        href={inst.publicTicketsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Buy tickets for ${concert.name} on ${formatDateLong(inst.startsAt)}`}
                        className="inline-flex items-center gap-2.5 w-fit mt-auto px-6 py-3 bg-blaze hover:bg-blazehover text-white font-changa text-sm uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                      >
                        Buy Tickets
                        <ExternalLink className="w-4 h-4 shrink-0" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}
