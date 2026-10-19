'use client'

import { motion } from 'framer-motion'
import { Calendar, ExternalLink, MapPin } from 'lucide-react'
import Picture from '@/components/common/Picture'
import CompactPageHero from '@/app/(public)/_components/CompactPageHero'
import { CueBoxEvent, CueBoxEventInstance } from '@/app/types/cuebox.types'
import { ISubscription } from '@/app/types/entities/subscription.types'
import { formatDateLong, formatTime, isSunday } from '@/app/lib/utils/date.utils'

/** The series is every Sunday performance at Neel Performing Arts Center. */
const VENUE_MATCH = 'neel'

const VENUE_ADDRESS = '5840 26th St. W., Bradenton, FL 34207'
const VENUE_MAP_URL = 'https://www.google.com/maps/search/5840+26th+St.+W.,+Bradenton,+FL+34207'

const BOX_OFFICE_PHONE = '941-926-POPS (7677)'
const BOX_OFFICE_TEL = '+19419267677'
const BOX_OFFICE_EMAIL = 'tickets@thepopsorchestra.org'

/** She names them "Sundays@Neel-Two Show Series Subscription", and the heading
 *  above already says the series, so the prefix is noise on the card. */
const displayName = (name: string) => name.replace(/^Sundays@Neel\s*[-–—]\s*/i, '')

interface Props {
  concerts: CueBoxEvent[]
  instances: CueBoxEventInstance[]
  subscriptions: ISubscription[]
}

export const SundaysAtNeelClient = ({ concerts, instances, subscriptions }: Props) => {
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
        breadcrumb="Sundays@Neel"
        heading="Sundays@Neel"
        description={
          <>
            Though The Pops Orchestra won&apos;t be performing, these are acts we know you will love. All shows are on Sundays at
            3:00 p.m., at the Neel Performing Arts Center on the campus of State College of Florida:{' '}
            <a
              href={VENUE_MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sunburst underline underline-offset-2 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunburst rounded-sm"
            >
              {VENUE_ADDRESS}
            </a>
          </>
        }
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

          {subscriptions.length > 0 && (
            <div className="mt-20 760:mt-24 pt-14 760:pt-16 border-t border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-px bg-blaze shrink-0" aria-hidden="true" />
                <h2 id="subscriptions-heading" className="font-changa text-sm uppercase tracking-[0.3em] text-blaze-text">
                  Bundle and Save
                </h2>
              </div>

              <p className="font-lato text-base text-white/70 leading-relaxed max-w-xl mb-8 760:mb-10">
                Coming to more than one show? Every seat costs less when you book them together.
              </p>

              <ul
                role="list"
                aria-labelledby="subscriptions-heading"
                className="grid grid-cols-1 760:grid-cols-2 gap-5 760:gap-6"
              >
                {subscriptions.map((sub) => (
                  <li key={sub.id} className="flex flex-col gap-5 border border-white/10 bg-white/3 p-6 760:p-8">
                    <div className="flex flex-col gap-1.5">
                      <h3 className="font-changa font-black text-xl 760:text-2xl text-white leading-tight">
                        {displayName(sub.name)}
                      </h3>
                      {sub.tagline && <p className="font-lato text-sm text-blaze-text leading-relaxed">{sub.tagline}</p>}
                      {sub.description && <p className="font-lato text-sm text-white/60 leading-relaxed">{sub.description}</p>}
                    </div>

                    {sub.pricingTiers.length > 0 && (
                      <dl className="flex flex-col divide-y divide-white/10 border-y border-white/10">
                        {sub.pricingTiers.map((tier) => (
                          <div key={tier.label} className="flex items-baseline justify-between gap-4 py-2.5">
                            <dt className="font-lato text-sm text-white/60">{tier.label}</dt>
                            <dd className="font-changa font-black text-lg 760:text-xl text-white tabular-nums">{tier.price}</dd>
                          </div>
                        ))}
                      </dl>
                    )}

                    <a
                      href={sub.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${displayName(sub.name)}, opens our ticketing site in a new tab`}
                      className="inline-flex items-center gap-2.5 w-fit mt-auto px-6 py-3 bg-blaze hover:bg-blazehover text-white font-changa text-sm uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    >
                      Buy This Package
                      <ExternalLink className="w-4 h-4 shrink-0" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>

              <p className="font-lato text-base text-white/70 leading-relaxed mt-8 760:mt-10 max-w-xl">
                Prefer a little assistance? Call{' '}
                <a
                  href={`tel:${BOX_OFFICE_TEL}`}
                  className="text-sunburst underline underline-offset-2 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunburst rounded-sm"
                >
                  {BOX_OFFICE_PHONE}
                </a>{' '}
                or email{' '}
                <a
                  href={`mailto:${BOX_OFFICE_EMAIL}`}
                  className="text-sunburst underline underline-offset-2 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunburst rounded-sm"
                >
                  {BOX_OFFICE_EMAIL}
                </a>{' '}
                and we will walk you through it.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
