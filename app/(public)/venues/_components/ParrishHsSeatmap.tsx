'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { pageCopy } from '@/app/lib/page-content/copy'
import { pageContent } from '@/app/lib/constants/page-content/venues'

type Tier = 'general' | 'premium' | 'ultra' | 'anon'

interface Seat {
  row: string
  number: number
  tier: Tier
  section: 'left' | 'center' | 'right'
}

interface TooltipState {
  seat: Seat
  x: number
  y: number
}

interface SeatConfig {
  number: number
  tier: Tier
}

// legend wording comes from the venues page content: venues_seatmap_tier_<tier>
const TIER_COLORS: Record<Tier, { bg: string; border: string }> = {
  general: { bg: 'bg-blue-500', border: 'border-blue-700' },
  premium: { bg: 'bg-green-600', border: 'border-green-800' },
  ultra: { bg: 'bg-amber-500', border: 'border-amber-700' },
  anon: { bg: 'bg-transparent', border: 'border-transparent' }
}

/** Tiers that are real, sellable seats. `anon` holds space and is not counted. */
const PRICED_TIERS = ['general', 'premium', 'ultra'] as const

/**
 * How far the middle of a row sits below its ends, in pixels. Every row is
 * bowed by the same amount so the house wraps toward the stage. Raise for a
 * deeper curve, set to 0 for flat rows.
 */
const ROW_CURVE = 22

/**
 * Parrish High School auditorium.
 *
 * Rows run A–T, skipping I and O. A cross-aisle separates J from K, and the
 * control booth is cut into the centre block across R, S and T.
 *
 * Numbering:
 *   left block   odd, counting outward from the centre aisle (… 5, 3, 1)
 *   centre block 100-series, descending left to right (123 … 101)
 *   right block  even, counting outward from the centre aisle (2, 4, 6 …)
 *
 * Colours are described as runs, in the order you read them off the printed
 * seatmap. `side` runs from the outside wall in toward the centre aisle and is
 * mirrored for the right-hand block; `center` runs left to right.
 *
 *   green(3), blue(2), green(2)   →  3 premium, 2 general, 2 premium
 *
 * `anon` is an invisible seat. It holds its slot in the layout, but is never
 * drawn, hovered or counted. The control booth rows use it for the seats the
 * booth displaces, which keeps every row the same width so they line up.
 *
 * Centre numbering runs down from 100 + width by default. A run can override
 * where its numbering picks up by passing a second argument, for rows whose
 * groups do not follow on from each other:
 *
 *   blue(6, 122)   →  6 general seats numbered 122 … 117
 */
type Run = [count: number, tier: Tier, from?: number]

const blue = (n: number, from?: number): Run => [n, 'general', from]
const green = (n: number, from?: number): Run => [n, 'premium', from]
const orange = (n: number, from?: number): Run => [n, 'ultra', from]
const anon = (n: number, from?: number): Run => [n, 'anon', from]

const expand = (runs: Run[]): Tier[] => runs.flatMap(([count, tier]) => Array<Tier>(count).fill(tier))

/** Centre seats, numbered left to right, honouring any per-run start number. */
const buildCenter = (runs: Run[]): SeatConfig[] => {
  const width = runs.reduce((total, [count]) => total + count, 0)
  let next = 100 + width
  const seats: SeatConfig[] = []

  for (const [count, tier, from] of runs) {
    if (from !== undefined) next = from
    for (let i = 0; i < count; i++) seats.push({ number: next--, tier })
  }

  return seats
}

interface RowConfig {
  label: string
  /** outside wall inward to the centre aisle; mirrored for the right block */
  side: Run[]
  /** left to right across the centre block; always 23 wide so rows line up */
  center: Run[]
  /** extra space above this row, for the cross-aisle */
  aisleBefore?: boolean
  /** row the control booth is cut into, so the overlay knows how far to span */
  underBooth?: boolean
}

/**
 * Rows A, B, C and J are transcribed from the seatmap. The rows between them
 * are interpolated, so treat their band edges as provisional.
 */
const ROW_CONFIG: RowConfig[] = [
  { label: 'A', side: [green(3), blue(2), green(2)], center: [green(7), blue(4), green(7)] },
  { label: 'B', side: [green(9)], center: [green(18)] },
  { label: 'C', side: [blue(3), green(3), orange(4)], center: [orange(2), green(15), orange(2)] },
  { label: 'D', side: [blue(4), green(3), orange(4)], center: [orange(20)] },
  { label: 'E', side: [blue(4), green(3), orange(4)], center: [orange(20)] },
  { label: 'F', side: [blue(5), green(3), orange(4)], center: [orange(21)] },
  { label: 'G', side: [blue(6), green(3), orange(4)], center: [orange(22)] },
  { label: 'H', side: [blue(7), green(3), orange(4)], center: [orange(22)] },
  { label: 'J', side: [blue(7), green(3), orange(4)], center: [orange(23)] },
  { label: 'K', side: [green(5), orange(10)], center: [orange(23)], aisleBefore: true },
  { label: 'L', side: [blue(5), green(6), orange(5)], center: [orange(23)] },
  { label: 'M', side: [blue(5), green(6), orange(5)], center: [orange(23)] },
  { label: 'N', side: [blue(5), green(11)], center: [green(23)] },
  { label: 'P', side: [blue(5), green(11)], center: [green(23)] },
  { label: 'Q', side: [blue(16)], center: [blue(23)] },
  // Booth rows: the anon run stands in for the seats the booth covers, so the
  // centre stays 23 wide and the numbering runs 123 … 101 like every row above.
  // R and S sit in the same slots so they line up, but R's numbering starts a
  // seat lower, so its groups declare where they pick up.
  { label: 'R', side: [blue(16)], center: [blue(6, 122), anon(11), blue(6, 106)], underBooth: true },
  { label: 'S', side: [blue(16)], center: [blue(6), anon(11), blue(6)], underBooth: true },
  { label: 'T', side: [blue(14)], center: [anon(23)], underBooth: true }
]

const ROWS = ROW_CONFIG.map(({ label, side, center, aisleBefore, underBooth }) => {
  // side runs read outside -> aisle, so seat 1 lands at the end of the list
  const sideTiers = expand(side)

  return {
    label,
    aisleBefore,
    underBooth,
    // seat 1 sits against the centre aisle and numbers climb outward in twos
    left: sideTiers.map((tier, i) => ({ number: (sideTiers.length - i) * 2 - 1, tier })) as SeatConfig[],
    center: buildCenter(center),
    right: [...sideTiers].reverse().map((tier, i) => ({ number: (i + 1) * 2, tier })) as SeatConfig[]
  }
})

type Row = (typeof ROWS)[number]

/** Approximate width, in seat slots, of an aisle. Counted so the curve is
 *  measured across the row's physical width rather than its seat count. */
const AISLE_SLOTS = 1.5

/** Drop for a seat sitting at `slot` across a row `slots` wide. */
const curveOffset = (slot: number, slots: number) => {
  if (slots < 2) return 0
  const u = (slot / (slots - 1)) * 2 - 1
  return Math.round(ROW_CURVE * (1 - u * u))
}

const SeatDot = ({
  seat,
  label,
  offsetY,
  onHover,
  onLeave,
  delay
}: {
  seat: Seat
  /** screen reader name, e.g. "Row A, seat 3, General pricing" */
  label: string
  offsetY: number
  onHover: (seat: Seat, e: React.MouseEvent | React.TouchEvent | React.FocusEvent) => void
  onLeave: () => void
  delay: number
}) => {
  // an anon seat is a spacer: no paint, no focus, no pointer target
  if (seat.tier === 'anon') {
    return <div className="w-2 h-2 760:w-2.5 760:h-2.5 shrink-0" aria-hidden="true" />
  }

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, scale: 0.5, y: offsetY }}
      animate={{ opacity: 1, scale: 1, y: offsetY }}
      whileHover={{ scale: 1.6 }}
      transition={{ delay, duration: 0.18 }}
      onMouseEnter={(e) => onHover(seat, e)}
      onMouseMove={(e) => onHover(seat, e)}
      onMouseLeave={onLeave}
      onFocus={(e) => onHover(seat, e)}
      onBlur={onLeave}
      onTouchStart={(e) => onHover(seat, e)}
      aria-label={label}
      className={`w-2 h-2 760:w-2.5 760:h-2.5 rounded-full border shrink-0 pointer-events-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-1 focus-visible:ring-offset-black ${TIER_COLORS[seat.tier].bg} ${TIER_COLORS[seat.tier].border}`}
    />
  )
}

const SeatBlock = ({
  row,
  seats,
  section,
  startSlot,
  slots,
  rowIdx,
  seatLabel,
  onHover,
  onLeave
}: {
  row: string
  seats: SeatConfig[]
  section: Seat['section']
  seatLabel: (seat: Seat) => string
  /** where this block's first seat sits across the row, for the curve */
  startSlot: number
  slots: number
  rowIdx: number
  onHover: (seat: Seat, e: React.MouseEvent | React.TouchEvent | React.FocusEvent) => void
  onLeave: () => void
}) => (
  <div className="flex items-start gap-0.5">
    {seats.map(({ number, tier }, i) => (
      <SeatDot
        key={`${row}-${section}-${i}`}
        seat={{ row, number, tier, section }}
        label={seatLabel({ row, number, tier, section })}
        offsetY={curveOffset(startSlot + i, slots)}
        onHover={onHover}
        onLeave={onLeave}
        delay={rowIdx * 0.04 + i * 0.006}
      />
    ))}
  </div>
)

const Aisle = () => <div className="w-3 760:w-5 shrink-0" aria-hidden="true" />

const RowLabel = ({ label, align }: { label: string; align: 'left' | 'right' }) => (
  <span
    className={`text-[9px] font-mono text-muted-dark/70 w-5 760:w-6 shrink-0 self-center ${
      align === 'right' ? 'text-right' : ''
    }`}
  >
    {label}
  </span>
)

const SeatRow = ({
  row,
  rowIdx,
  seatLabel,
  onHover,
  onLeave
}: {
  row: Row
  rowIdx: number
  seatLabel: (seat: Seat) => string
  onHover: (seat: Seat, e: React.MouseEvent | React.TouchEvent | React.FocusEvent) => void
  onLeave: () => void
}) => {
  const slots = row.left.length + AISLE_SLOTS + row.center.length + AISLE_SLOTS + row.right.length
  const centerStart = row.left.length + AISLE_SLOTS
  const rightStart = slots - row.right.length

  return (
    // pointer-events pass through the row box; only the dots are targets, so a
    // seat pushed down by the curve is never swallowed by the next row's box
    <div className={`flex items-start gap-0.5 760:gap-1 pointer-events-none ${row.aisleBefore ? 'mt-8 760:mt-12' : ''}`}>
      <RowLabel label={row.label} align="right" />

      <SeatBlock
        row={row.label}
        seats={row.left}
        section="left"
        startSlot={0}
        slots={slots}
        rowIdx={rowIdx}
        seatLabel={seatLabel}
        onHover={onHover}
        onLeave={onLeave}
      />

      <Aisle />

      <SeatBlock
        row={row.label}
        seats={row.center}
        section="center"
        startSlot={centerStart}
        slots={slots}
        rowIdx={rowIdx}
        seatLabel={seatLabel}
        onHover={onHover}
        onLeave={onLeave}
      />

      <Aisle />

      <SeatBlock
        row={row.label}
        seats={row.right}
        section="right"
        startSlot={rightStart}
        slots={slots}
        rowIdx={rowIdx}
        seatLabel={seatLabel}
        onHover={onHover}
        onLeave={onLeave}
      />

      <RowLabel label={row.label} align="left" />
    </div>
  )
}

export default function ParrishHsSeatmap({ content }: { content?: unknown }) {
  const { t } = pageCopy(content, pageContent)
  // anon seats are spacers and are never announced
  const seatLabel = (seat: Seat) =>
    seat.tier === 'anon'
      ? ''
      : t('venues_sr_seat', { row: seat.row, seat: seat.number, tier: t(`venues_seatmap_tier_${seat.tier}`) })
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  const handleHover = (seat: Seat, e: React.MouseEvent | React.TouchEvent | React.FocusEvent) => {
    let clientX: number
    let clientY: number

    if ('touches' in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else if ('clientX' in e) {
      clientX = e.clientX
      clientY = e.clientY
    } else {
      const rect = (e.target as HTMLElement).getBoundingClientRect()
      clientX = rect.left + rect.width / 2
      clientY = rect.top
    }

    const x = Math.min(clientX + 14, window.innerWidth - 160)
    const y = clientY - 56 < 0 ? clientY + 14 : clientY - 56

    setTooltip({ seat, x, y })
  }

  const allSeats = ROWS.flatMap((row) => [...row.left, ...row.center, ...row.right]).filter((seat) => seat.tier !== 'anon')
  const boothStart = ROWS.findIndex((row) => row.underBooth)
  const mainRows = boothStart === -1 ? ROWS : ROWS.slice(0, boothStart)
  const boothRows = boothStart === -1 ? [] : ROWS.slice(boothStart)

  return (
    <div className="flex bg-black flex-col items-center py-8 760:py-16 px-2 760:px-4">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6 760:mb-10">
        <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-primary-dark">
          {t('venues_seatmap_parrish_eyebrow')}
        </span>
        <h1 className="font-quicksand font-black text-xl 760:text-2xl text-text-dark mt-1">
          {t('venues_seatmap_parrish_heading')}
        </h1>
        <p className="text-muted-dark text-xs mt-2">{t('venues_seatmap_parrish_count', { count: allSeats.length })}</p>
      </motion.div>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            key={`${tooltip.seat.row}-${tooltip.seat.section}-${tooltip.seat.number}`}
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="fixed z-50 pointer-events-none bg-bg-dark border border-border-dark px-3 py-2 max-w-37.5"
            style={{ left: tooltip.x, top: tooltip.y }}
          >
            <p className="text-[12px] font-mono text-text-dark">
              {t('venues_seatmap_tooltip', { row: tooltip.seat.row, seat: tooltip.seat.number })}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className={`w-2 h-2 rounded-full shrink-0 ${TIER_COLORS[tooltip.seat.tier].bg}`} />
              <span className="text-[11px] font-mono text-muted-dark">{t(`venues_seatmap_tier_${tooltip.seat.tier}`)}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0.9 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.35 }}
        className="w-56 760:w-80 bg-surface-dark border border-border-dark py-4 760:py-6 text-center mb-8 760:mb-12"
      >
        <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-text-dark">Stage</span>
      </motion.div>

      {/* Chart */}
      <div className="w-full overflow-x-auto">
        <div
          className="flex flex-col items-center justify-between gap-1.5 760:gap-2 min-w-max mx-auto px-2"
          style={{ paddingBottom: ROW_CURVE + 16 }}
        >
          {mainRows.map((row, rowIdx) => (
            <SeatRow
              key={row.label}
              row={row}
              rowIdx={rowIdx}
              seatLabel={seatLabel}
              onHover={handleHover}
              onLeave={() => setTooltip(null)}
            />
          ))}

          {/* Back rows, with the control booth sitting over their anon seats */}
          <div className="relative flex flex-col items-center gap-1.5 760:gap-2 pointer-events-none">
            {boothRows.map((row, i) => (
              <SeatRow
                key={row.label}
                row={row}
                rowIdx={mainRows.length + i}
                seatLabel={seatLabel}
                onHover={handleHover}
                onLeave={() => setTooltip(null)}
              />
            ))}

            {/* Sits over the anon run, and rides the same curve as the seats */}
            <div
              className="absolute left-1/2 inset-y-0 w-24 760:w-30 flex items-center justify-center bg-surface-dark border border-border-dark pointer-events-none"
              style={{ transform: `translate(-50%, ${ROW_CURVE}px)` }}
              aria-hidden="true"
            >
              <span className="text-[9px] 760:text-[10px] font-mono tracking-[0.2em] uppercase text-muted-dark">
                Control booth
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 760:mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
        {PRICED_TIERS.map((tier) => {
          const count = allSeats.filter((seat) => seat.tier === tier).length

          return (
            <div key={tier} className="flex items-center gap-2">
              <div
                className={`w-2.5 h-2.5 rounded-full border shrink-0 ${TIER_COLORS[tier].bg} ${TIER_COLORS[tier].border}`}
                aria-hidden="true"
              />
              <span className="text-[11px] font-mono text-muted-dark">
                {t(`venues_seatmap_tier_${tier}`)} · {count}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
