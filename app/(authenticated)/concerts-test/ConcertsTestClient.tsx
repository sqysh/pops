'use client'

import { motion } from 'framer-motion'
import { ExternalLink, MapPin, Calendar, Eye, EyeOff } from 'lucide-react'
import { CueBoxEvent } from '@/app/types/cuebox.types'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Picture from '@/app/components/common/Picture'

type Props = { events: CueBoxEvent[] }

function statusLabel(status: CueBoxEvent['status']) {
  switch (status) {
    case 'ON_SALE':
      return { label: 'On Sale', cls: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' }
    case 'SOLD_OUT':
      return { label: 'Sold Out', cls: 'bg-red-500/10 text-red-400 border border-red-500/20' }
    case 'CANCELED':
      return { label: 'Canceled', cls: 'bg-border-dark text-muted-dark border border-border-dark' }
    case 'NOT_ON_SALE':
      return { label: 'Off Sale', cls: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' }
    case 'PRESALE':
      return { label: 'Presale', cls: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' }
    default:
      return { label: status, cls: 'bg-border-dark text-muted-dark border border-border-dark' }
  }
}

function formatDateRange(first: string, last: string) {
  const f = new Date(first)
  const l = new Date(last)
  const same = f.toDateString() === l.toDateString()
  const opts: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' }
  return same
    ? f.toLocaleDateString('en-US', { ...opts, year: 'numeric' })
    : `${f.toLocaleDateString('en-US', opts)} – ${l.toLocaleDateString('en-US', { ...opts, year: 'numeric' })}`
}

// ── Featured (first) concert ──────────────────────────────────────────────────
function FeaturedConcert({ event }: { event: CueBoxEvent }) {
  const { label, cls } = statusLabel(event.status)
  const dateRange = formatDateRange(event.firstInstanceDatetime, event.lastInstanceDatetime)
  const hasImage = !!event.publicImageUrl

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full overflow-hidden group mb-px"
      style={{ height: '70vh', minHeight: '500px' }}
    >
      {/* Full-bleed image */}
      {hasImage && (
        <Picture
          src={event.publicImageUrl}
          alt={event.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-100 transition-transform duration-[2s] ease-out scale-105"
          priority
        />
      )}

      {/* Overlays */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, var(--color-bg-dark) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)'
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, transparent 60%)' }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 lg:p-16 max-w-3xl">
        {/* Status + visibility badges */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-[8px] font-mono tracking-[0.2em] uppercase px-2 py-1 ${cls}`}>{label}</span>
          {event.isVisibleOnline ? (
            <span className="flex items-center gap-1 text-[8px] font-mono tracking-[0.15em] uppercase px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Eye className="w-2.5 h-2.5" /> Visible
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[8px] font-mono tracking-[0.15em] uppercase px-2 py-1 bg-border-dark text-muted-dark/50 border border-border-dark">
              <EyeOff className="w-2.5 h-2.5" /> Hidden
            </span>
          )}
        </div>

        <h2 className="font-quicksand font-black text-4xl sm:text-5xl lg:text-6xl text-text-dark leading-none mb-4">
          {event.name}
        </h2>

        {event.descriptionPlaintext && (
          <p className="text-sm text-muted-dark leading-relaxed mb-6 max-w-xl line-clamp-3">
            {event.descriptionPlaintext}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 mb-6 text-[10px] font-mono text-muted-dark/60">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            {dateRange}
          </span>
          {event.venues[0] && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3" />
              {event.venues[0].name}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {event.status === 'ON_SALE' && (
            <a
              href={event.publicTicketsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-dark hover:bg-secondary-light text-white text-[9px] font-mono tracking-[0.2em] uppercase transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Get Tickets
            </a>
          )}
        </div>
      </div>

      {/* Season label — top right */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8">
        <span className="text-[8px] font-mono tracking-[0.25em] uppercase text-muted-dark/40">25–26 Season</span>
      </div>
    </motion.div>
  )
}

// ── Row card ─────────────────────────────────────────────────────────────────
function ConcertRow({ event, index }: { event: CueBoxEvent; index: number }) {
  const { label, cls } = statusLabel(event.status)
  const dateRange = formatDateRange(event.firstInstanceDatetime, event.lastInstanceDatetime)
  const isEven = index % 2 === 0
  const hasImage = !!event.publicImageUrl

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
      className={`flex flex-col sm:flex-row ${isEven ? '' : 'sm:flex-row-reverse'} border-b border-border-dark group`}
    >
      {/* Image */}
      <div className="relative sm:w-2/5 shrink-0 overflow-hidden bg-surface-dark" style={{ height: '18rem' }}>
        {hasImage ? (
          <Picture
            priority
            src={event.publicImageUrl}
            alt={event.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-mono text-[10px] tracking-widest uppercase text-muted-dark/20">No Image</span>
          </div>
        )}
        <div
          className="absolute inset-0"
          style={{
            background: isEven
              ? 'linear-gradient(to right, transparent, rgba(0,0,0,0.4))'
              : 'linear-gradient(to left, transparent, rgba(0,0,0,0.4))'
          }}
        />
      </div>

      {/* Content */}
      <div className={`flex flex-col justify-center flex-1 px-8 py-8 ${isEven ? 'sm:pl-10' : 'sm:pr-10'}`}>
        {/* Status + visibility */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-[7px] font-mono tracking-[0.2em] uppercase px-2 py-0.5 ${cls}`}>{label}</span>
          {event.isVisibleOnline ? (
            <span className="flex items-center gap-1 text-[7px] font-mono tracking-[0.15em] uppercase px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Eye className="w-2 h-2" /> Visible
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[7px] font-mono tracking-[0.15em] uppercase px-2 py-0.5 bg-border-dark text-muted-dark/50 border border-border-dark">
              <EyeOff className="w-2 h-2" /> Hidden
            </span>
          )}
        </div>

        <h2 className="font-quicksand font-black text-2xl sm:text-3xl text-text-dark leading-tight mb-3">
          {event.name}
        </h2>

        {event.descriptionPlaintext && (
          <p className="text-xs text-muted-dark/70 leading-relaxed mb-5 line-clamp-3 max-w-lg">
            {event.descriptionPlaintext}
          </p>
        )}

        <div className="flex flex-col gap-1.5 mb-6 text-[9px] font-mono text-muted-dark/50">
          <span className="flex items-center gap-2">
            <Calendar className="w-3 h-3 shrink-0" />
            {dateRange}
          </span>
          <div className="flex flex-col gap-0.5 pl-5">
            {event.venues.map((v) => (
              <span key={v.name} className="flex items-center gap-2 text-muted-dark/40">
                <MapPin className="w-2.5 h-2.5 shrink-0" />
                {v.name}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {event.status === 'ON_SALE' && (
            <a
              href={event.publicTicketsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 bg-primary-dark hover:bg-secondary-light text-white text-[9px] font-mono tracking-[0.2em] uppercase transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Get Tickets
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ConcertsTestClient({ events }: Props) {
  const { data: session, status } = useSession()

  if (status === 'loading') return null
  if (!session?.user?.role) return null

  const { role } = session.user
  if (role !== 'ADMIN' && role !== 'CONDUCTOR' && role !== 'SUPER_USER') return null

  const [featured, ...rest] = events

  return (
    <div className="min-h-screen bg-bg-dark text-text-dark">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between px-8 sm:px-12 lg:px-16 py-6 border-b border-border-dark"
      >
        <div className="flex items-center gap-4">
          <div className="w-px h-6 bg-primary-dark" />
          <div>
            <p className="text-[8px] font-mono tracking-[0.3em] uppercase text-primary-dark">The Pops Orchestra</p>
            <h1 className="font-quicksand font-black text-lg text-text-dark leading-none mt-0.5">25–26 Season</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[8px] font-mono tracking-[0.2em] uppercase text-muted-dark/40">
            {events.length} Concert{events.length !== 1 ? 's' : ''}
          </span>
          <div className="w-px h-4 bg-border-dark" />
          <Link
            href="/v2/dashboard"
            className="text-[8px] font-mono tracking-[0.15em] uppercase text-muted-dark hover:text-text-dark transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/"
            className="text-[8px] font-mono tracking-[0.15em] uppercase text-muted-dark hover:text-text-dark transition-colors"
          >
            Home
          </Link>
        </div>
      </motion.div>

      {/* Featured */}
      {featured && <FeaturedConcert event={featured} />}

      {/* Alternating rows */}
      {rest.length > 0 && (
        <div>
          {rest.map((event, i) => (
            <ConcertRow key={event.id} event={event} index={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {events.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 gap-3 text-center">
          <p className="font-mono text-sm tracking-widest uppercase text-muted-dark/30">No concerts found in CueBox</p>
        </div>
      )}
    </div>
  )
}
