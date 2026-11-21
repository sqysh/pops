'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Car, Zap, Users } from 'lucide-react'
import RiverviewPACFirstFloorSVG from '@/app/(public)/venues/_components/RiverviewPACFirstFloorSVG'
import RiverviewBalconySVG from '@/app/(public)/venues/_components/RiverviewBalconySVG'
import SCFNeelPACSVG from '@/app/(public)/venues/_components/SCFNeelPACSVG'
import SCFNeel2ndHalf from '@/app/(public)/venues/_components/SCFNeel2ndHalf'
import OperaHouseMezzAndBalc from '@/app/(public)/venues/_components/OperaHouseMezzAndBalc'
import OperaHouseMainFloor from '@/app/(public)/venues/_components/OperaHouseMainFloor'
import { IVenue } from '@/app/types/entities/venue'
import Picture from '@/components/common/Picture'
import { seatInfoVariants } from '@/app/lib/constants/motion'
import CompactPageHero from '@/app/(public)/_components/CompactPageHero'
import ParrishHsSeatmap from './_components/ParrishHsSeatmap'
import { pageCopy } from '@/app/lib/page-content/copy'
import { pageContent } from '@/app/lib/constants/page-content/venues'

interface SVGSeatProps {
  seat?: string
  level?: string
  price?: string
}

const EMPTY_SEAT: SVGSeatProps = {}

// ── Seat info ─────────────────────────────────────────────────────────────────
function SeatInfo({ data, content }: { data: SVGSeatProps; content?: unknown }) {
  const { t } = pageCopy(content, pageContent)
  const fields = [
    { label: t('venues_seat_info_level'), value: data.level },
    { label: t('venues_seat_info_seat'), value: data.seat },
    { label: t('venues_seat_info_price'), value: data.price }
  ].filter((f) => f.value)

  if (!fields.length) {
    return (
      <p className="text-center text-[10px] font-changa tracking-[0.2em] uppercase text-white/40 py-4">
        {t('venues_seat_info_empty')}
      </p>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${data.seat}-${data.level}`}
        variants={seatInfoVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="flex items-center justify-center gap-4 760:gap-6 py-3 760:py-4 border border-white/10 bg-white/5 flex-wrap"
      >
        {fields.map(({ label, value }, f) => (
          <div key={f} className="flex flex-col items-center gap-0.5">
            <span className="font-changa text-[10px] uppercase tracking-[0.25em] text-blaze-text">{label}</span>
            <span className="font-lato text-sm text-white">{value}</span>
          </div>
        ))}
      </motion.div>
    </AnimatePresence>
  )
}

// ── Section heading ───────────────────────────────────────────────────────────
function SeatSectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 760:gap-4 mb-4 760:mb-6">
      <div className="flex-1 h-px bg-white/10" />
      <h4 id={id} className="font-changa text-sm uppercase tracking-[0.3em] text-blaze-text shrink-0">
        {children}
      </h4>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  )
}

// ── Venue seat map ────────────────────────────────────────────────────────────
function VenueSeatMap({ seatMapId, venueId, content }: { seatMapId: any; venueId: string; content?: unknown }) {
  const { t } = pageCopy(content, pageContent)
  const [neel, setNeel] = useState<SVGSeatProps>(EMPTY_SEAT)
  const [neel2, setNeel2] = useState<SVGSeatProps>(EMPTY_SEAT)
  const [riverview, setRiverview] = useState<SVGSeatProps>(EMPTY_SEAT)
  const [riverview2, setRiverview2] = useState<SVGSeatProps>(EMPTY_SEAT)

  // overflow-x-auto lets wide SVGs scroll horizontally on small screens
  const wrap = (children: React.ReactNode) => (
    <div className="w-full overflow-x-auto -mx-4 px-4 760:mx-0 760:px-0">{children}</div>
  )

  switch (seatMapId) {
    case 'riverview':
      return (
        <div className="flex flex-col gap-8 760:gap-10">
          <section aria-labelledby={`${venueId}-floor`}>
            <SeatSectionHeading id={`${venueId}-floor`}>{t('venues_riverview_floor')}</SeatSectionHeading>
            {wrap(<RiverviewPACFirstFloorSVG setRiverview={setRiverview} />)}
            <div className="mt-3">
              <SeatInfo data={riverview} content={content} />
            </div>
          </section>
          <section aria-labelledby={`${venueId}-balcony`}>
            <SeatSectionHeading id={`${venueId}-balcony`}>{t('venues_riverview_balcony')}</SeatSectionHeading>
            {wrap(<RiverviewBalconySVG setRiverviewBalcony={setRiverview2} />)}
            <div className="mt-3">
              <SeatInfo data={riverview2} content={content} />
            </div>
          </section>
        </div>
      )

    case 'scf-neel':
      return (
        <div className="flex flex-col gap-8 760:gap-10">
          <section aria-labelledby={`${venueId}-first`}>
            <SeatSectionHeading id={`${venueId}-first`}>{t('venues_neel_first')}</SeatSectionHeading>
            {wrap(<SCFNeelPACSVG setNeel={setNeel} />)}
            <div className="mt-3">
              <SeatInfo data={neel} content={content} />
            </div>
          </section>
          <section aria-labelledby={`${venueId}-second`}>
            <SeatSectionHeading id={`${venueId}-second`}>{t('venues_neel_second')}</SeatSectionHeading>
            {wrap(<SCFNeel2ndHalf setNeel2ndHalf={setNeel2} />)}
            <div className="mt-3">
              <SeatInfo data={neel2} content={content} />
            </div>
          </section>
        </div>
      )

    case 'sarasota-opera-house':
      return (
        <div className="flex flex-col gap-8 760:gap-10">
          <section aria-labelledby={`${venueId}-mezz`}>
            <SeatSectionHeading id={`${venueId}-mezz`}>{t('venues_opera_mezz')}</SeatSectionHeading>
            {wrap(<OperaHouseMezzAndBalc content={content} />)}
          </section>
          <section aria-labelledby={`${venueId}-main`}>
            <SeatSectionHeading id={`${venueId}-main`}>{t('venues_opera_main')}</SeatSectionHeading>
            {wrap(<OperaHouseMainFloor content={content} />)}
          </section>
        </div>
      )
    case 'parrish':
      return (
        <div className="flex flex-col gap-8 760:gap-10">
          <section aria-labelledby={venueId}>
            <SeatSectionHeading id={venueId}>{t('venues_parrish_main')}</SeatSectionHeading>
            {wrap(<ParrishHsSeatmap content={content} />)}
          </section>
        </div>
      )
  }
}

// ── Venue details ─────────────────────────────────────────────────────────────
function VenueDetails({ venue, content }: { venue: IVenue; content?: unknown }) {
  const { t } = pageCopy(content, pageContent)
  const fields = [
    {
      key: 'accessibility',
      icon: <Users className="w-3.5 h-3.5" />,
      label: t('venues_detail_accessibility'),
      value: venue.accessibility
    },
    {
      key: 'immersive',
      icon: <Zap className="w-3.5 h-3.5" />,
      label: t('venues_detail_immersive'),
      value: venue.immersiveEnvironment
    },
    { key: 'parking', icon: <Car className="w-3.5 h-3.5" />, label: t('venues_detail_parking'), value: venue.parking },
    { key: 'address', icon: <MapPin className="w-3.5 h-3.5" />, label: t('venues_detail_address'), value: venue.address }
  ].filter((f) => f.value)

  return (
    <div className="grid grid-cols-1 760:grid-cols-2 gap-px bg-white/10">
      {fields.map(({ key, icon, label, value }) => (
        <div key={key} className="bg-black p-4 760:p-5 flex gap-3 760:gap-4">
          <div className="w-7 h-7 760:w-8 760:h-8 rounded-full border border-white/10 flex items-center justify-center text-blaze-text shrink-0 mt-0.5">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-changa text-[10px] uppercase tracking-[0.25em] text-blaze-text mb-1">{label}</p>
            <p className="font-lato text-sm text-white/70 leading-relaxed">{value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export type SeatMapId = 'riverview' | 'scf-neel' | 'sarasota-opera-house' | 'parrish'

export const VENUE_SEATMAP: Record<string, SeatMapId> = {
  'Riverview Performing Arts Center': 'riverview',
  'Neel Performing Arts Center': 'scf-neel',
  'Sarasota Opera House': 'sarasota-opera-house',
  'Parrish Community Performing Arts Center': 'parrish'
}

// ── Venue card ────────────────────────────────────────────────────────────────
function VenueCard({ venue, index, content }: { venue: any; index: number; content?: unknown }) {
  const { t } = pageCopy(content, pageContent)
  const seatMapId = VENUE_SEATMAP[venue.name] as SeatMapId | undefined

  return (
    <li>
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        aria-labelledby={`venue-heading-${seatMapId}`}
        className="border border-white/10"
      >
        {/* Image hero */}
        <div className="relative overflow-hidden h-48 430:h-64 760:h-96 990:h-125">
          <Picture
            src={venue.imageUrl}
            alt={t('venues_image_alt', { name: venue.name })}
            fill
            sizes="(max-width: 760px) 100vw, (max-width: 990px) 50vw, 33vw"
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 430:p-6 990:p-10">
            {venue.capacity && (
              <div className="flex items-center gap-2 mb-2 760:mb-3">
                <div className="w-4 h-px bg-blaze" aria-hidden="true" />
                <span className="font-changa text-[10px] uppercase tracking-[0.3em] text-blaze-text">
                  {t('venues_capacity', { capacity: venue.capacity })}
                </span>
              </div>
            )}
            <h2
              id={`venue-heading-${seatMapId}`}
              className="font-changa text-2xl 430:text-3xl 760:text-4xl 990:text-5xl text-white leading-tight"
            >
              {venue.name}
            </h2>
          </div>
        </div>

        {/* Details */}
        <VenueDetails venue={venue} content={content} />

        {/* Seating chart */}
        <div className="p-4 430:p-6 760:p-8 990:p-12 border-t border-white/10">
          <div className="flex items-center gap-3 mb-6 760:mb-8">
            <div className="w-6 h-px bg-blaze" aria-hidden="true" />
            <h3 id={`seatmap-heading-${seatMapId}`} className="font-changa text-sm uppercase tracking-[0.3em] text-blaze-text">
              {t('venues_seating_heading')}
            </h3>
          </div>
          <VenueSeatMap seatMapId={seatMapId} venueId={venue.id} content={content} />
        </div>
      </motion.article>
    </li>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export function VenuesClient({ venues, content }: { venues: any[]; content?: unknown }) {
  const { t } = pageCopy(content, pageContent)

  return (
    <main id="main-content">
      <CompactPageHero
        homeLabel={t('venues_hero_home_crumb')}
        breadcrumbLabel={t('venues_sr_breadcrumb')}
        breadcrumb={t('venues_hero_breadcrumb')}
        eyebrow={t('venues_hero_eyebrow')}
        heading={t('venues_hero_heading')}
        description={t('venues_hero_description')}
      />
      <div className="min-h-dvh bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 760:px-6 990:px-8 py-12 760:py-20 990:py-32">
          <ul role="list" aria-label={t('venues_sr_list')} className="flex flex-col gap-10 760:gap-16 990:gap-24">
            {venues.map((venue, index) => (
              <VenueCard key={index} venue={venue} index={index} content={content} />
            ))}
          </ul>
        </div>
      </div>
    </main>
  )
}
