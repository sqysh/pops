import Picture from '@/app/components/common/Picture'
import { CueBoxEvent, CueBoxEventInstance } from '@/app/types/cuebox.types'
import { motion } from 'framer-motion'
import { Calendar, ExternalLink, MapPin } from 'lucide-react'

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

/** CueBox sends UTC. The orchestra is in Florida, so pin display to its
 *  timezone rather than the visitor's, or a patron out of state sees the
 *  wrong start time and occasionally the wrong day. */
const TIMEZONE = 'America/New_York'

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: TIMEZONE
  })

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: TIMEZONE
  })

/** Status shown on the card as a whole, taken from the showtimes patrons can
 *  actually see. An event marked ON_SALE whose every showtime has sold out
 *  should not still say On Sale. */
const deriveStatus = (event: CueBoxEvent, instances: CueBoxEventInstance[]) => {
  if (!instances.length) return event.status

  const statuses = instances.map((inst) => inst.status)

  if (statuses.includes('ON_SALE')) return 'ON_SALE'
  if (statuses.includes('PRESALE')) return 'PRESALE'
  if (statuses.every((status) => status === 'CANCELED')) return 'CANCELED'
  if (statuses.every((status) => status === 'SOLD_OUT' || status === 'CANCELED')) return 'SOLD_OUT'

  return event.status
}

const StatusChip = ({ status, size = 'sm' }: { status: string; size?: 'sm' | 'xs' }) => (
  <span
    className={`inline-flex shrink-0 font-mono uppercase border ${
      size === 'xs' ? 'text-[9px] tracking-widest px-1.5 py-0.5' : 'text-[10px] tracking-[0.25em] px-2 py-1'
    } ${STATUS_COLOR[status] ?? 'text-white/40 border-white/10'}`}
  >
    {STATUS_LABEL[status] ?? status}
  </span>
)

export function ConcertCard({
  event,
  instances,
  index,
  ref
}: {
  event: CueBoxEvent
  instances: CueBoxEventInstance[]
  index: number
  ref?: (node: HTMLElement | null) => void
}) {
  // showtimes hidden in CueBox never reach the page, same rule as events
  const visibleInstances = instances
    .filter((inst) => inst.isVisibleOnline)
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())

  const hasImage = !!event.publicImageUrl
  const status = deriveStatus(event, visibleInstances)

  const venues = Array.from(new Set(visibleInstances.map((inst) => inst.venue?.name).filter((name): name is string => !!name)))

  const buyable = visibleInstances.filter((inst) => inst.status === 'ON_SALE' || inst.status === 'PRESALE')
  const singleBuyable = buyable.length === 1 ? buyable[0] : null

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: index * 0.04 }}
      aria-label={event.name}
      className="scroll-mt-6 grid grid-cols-1 760:grid-cols-[320px_1fr] 990:grid-cols-[400px_1fr] border-b border-white/10 last:border-0"
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
          <div className="absolute top-3 left-3">
            <span className="backdrop-blur-sm bg-black/40">
              <StatusChip status={status} />
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
          <h2 className="font-changa font-black text-3xl 760:text-4xl 990:text-5xl text-white leading-[0.95]">{event.name}</h2>

          {/* Venues, when the run moves between halls */}
          {venues.length > 1 && (
            <div className="flex items-center gap-2 flex-wrap">
              <MapPin className="w-3 h-3 text-blaze shrink-0" aria-hidden="true" />
              <span className="font-lato text-sm text-white/50">{venues.join(' · ')}</span>
            </div>
          )}

          {/* Description */}
          {event.descriptionPlaintext && (
            <p className="font-lato text-base text-white/60 leading-relaxed max-w-lg">{event.descriptionPlaintext}</p>
          )}

          {/* Performances */}
          {visibleInstances.length > 0 && (
            <div className="flex flex-col border-t border-white/10 pt-5">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-3.5 h-3.5 text-blaze shrink-0" aria-hidden="true" />
                <span className="font-changa text-[10px] uppercase tracking-[0.25em] text-white/30">
                  {visibleInstances.length === 1 ? 'Performance' : `${visibleInstances.length} Performances`}
                </span>
              </div>

              <ul role="list" className="flex flex-col">
                {visibleInstances.map((inst) => {
                  const isBuyable = inst.status === 'ON_SALE' || inst.status === 'PRESALE'
                  const isOff = inst.status === 'CANCELED'

                  return (
                    <li
                      key={inst.id}
                      className="flex flex-col 760:flex-row 760:items-center 760:justify-between gap-1.5 760:gap-4 py-3 border-b border-white/5 last:border-0"
                    >
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span
                            className={`font-lato text-sm 760:text-base leading-snug ${
                              isOff ? 'text-white/35 line-through' : 'text-white'
                            }`}
                          >
                            {formatDate(inst.startsAt)}
                            <span className="text-white/50"> · {formatTime(inst.startsAt)}</span>
                          </span>
                          {inst.status !== 'ON_SALE' && <StatusChip status={inst.status} size="xs" />}
                        </div>

                        {/* only worth repeating per showtime when the run moves around */}
                        {venues.length > 1 && inst.venue?.name && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-blaze shrink-0" aria-hidden="true" />
                            <span className="font-lato text-sm text-white/50">{inst.venue.name}</span>
                          </div>
                        )}
                      </div>

                      {/* per-showtime link, so patrons land on the right ticket selection */}
                      {isBuyable && !singleBuyable && inst.publicTicketsUrl && (
                        <a
                          href={inst.publicTicketsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Buy tickets for ${event.name} on ${formatDate(inst.startsAt)} at ${formatTime(inst.startsAt)}`}
                          className="inline-flex items-center gap-1.5 shrink-0 font-changa text-[11px] uppercase tracking-widest text-blaze-text hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                        >
                          Tickets
                          <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
                        </a>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {/* Single venue, stated once */}
          {venues.length === 1 && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-blaze shrink-0" aria-hidden="true" />
              <span className="font-lato text-sm text-white/50">{venues[0]}</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="pt-8">
          {singleBuyable ? (
            <a
              href={singleBuyable.publicTicketsUrl ?? event.publicTicketsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Buy tickets for ${event.name}`}
              className="inline-flex items-center gap-3 px-7 py-3.5 bg-blaze hover:bg-blazehover text-white font-changa text-sm uppercase tracking-widest transition-colors w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Buy Tickets
              <ExternalLink className="w-4 h-4 shrink-0" aria-hidden="true" />
            </a>
          ) : buyable.length > 1 ? (
            <p className="font-lato text-sm text-white/40">Choose a performance above to buy tickets.</p>
          ) : (
            <StatusChip status={status} />
          )}
        </div>
      </div>
    </motion.article>
  )
}
