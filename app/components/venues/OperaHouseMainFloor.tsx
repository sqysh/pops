'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Tier = 'general' | 'premium' | 'ultra' | 'wheelchair'

interface SeatConfig {
  number: number | string
  tier: Tier
}

interface RowConfig {
  label: string
  left: SeatConfig[]
  center: SeatConfig[]
  right: SeatConfig[]
}

interface TooltipState {
  row: string
  seat: SeatConfig
  x: number
  y: number
}

const TIER_COLORS: Record<Tier, { bg: string; border: string; label: string }> = {
  general: { bg: 'bg-blue-500', border: 'border-blue-700', label: 'General pricing' },
  premium: { bg: 'bg-green-600', border: 'border-green-800', label: 'Premium pricing' },
  ultra: { bg: 'bg-amber-500', border: 'border-amber-700', label: 'Ultra pricing' },
  wheelchair: { bg: 'bg-gray-400', border: 'border-gray-600', label: 'Accessible seating' }
}

function g(n: number | string): SeatConfig {
  return { number: n, tier: 'general' }
}
function p(n: number | string): SeatConfig {
  return { number: n, tier: 'premium' }
}
function u(n: number | string): SeatConfig {
  return { number: n, tier: 'ultra' }
}
function wc(): SeatConfig {
  return { number: '♿', tier: 'wheelchair' }
}

function centerBlock(from: number, to: number, tier: Tier = 'ultra'): SeatConfig[] {
  const seats: SeatConfig[] = []
  for (let i = from; i >= to; i--) seats.push({ number: i, tier })
  return seats
}

const LEFT_BOXES = [
  { label: '10', seats: [wc(), wc(), u('F'), u('E'), u('D'), u('C'), u('B'), u('A')] },
  { label: '11', seats: [u('D'), u('C'), u('B'), u('A')] },
  { label: '12', seats: [u('D'), u('C'), u('B'), u('A')] },
  { label: '13', seats: [u('D'), u('C'), u('B'), u('A')] }
]

const TOP_BOXES = [
  { label: '9', seats: [u('D'), u('C'), u('B'), u('A')] },
  { label: '8', seats: [u('D'), u('C'), u('B'), u('A')] },
  { label: '7', seats: [u('D'), u('C'), u('B'), u('A')] },
  { label: '6', seats: [u('D'), u('C'), u('B'), u('A')] },
  { label: '5', seats: [u('D'), u('C'), u('B'), u('A')] }
]

const RIGHT_BOXES = [
  { label: '4', seats: [u('E'), u('F'), wc(), wc(), u('A'), u('B'), u('C'), u('D')] },
  { label: '3', seats: [u('C'), u('D'), u('A'), u('B')] },
  { label: '2', seats: [u('C'), u('D'), u('A'), u('B')] },
  { label: '1', seats: [u('C'), u('D'), u('A'), u('B')] }
]

const ROWS: RowConfig[] = [
  {
    label: 'A',
    left: [g(10), wc(), wc(), wc(), g(2)],
    center: centerBlock(116, 101, 'general'),
    right: [g(1), wc(), wc(), wc(), g(9), g(11)]
  },
  {
    label: 'B',
    left: [],
    center: centerBlock(117, 101, 'general'),
    right: []
  },
  {
    label: 'C',
    left: [u(10), u(8), wc(), wc(), u(2)],
    center: centerBlock(118, 101),
    right: [u(1), wc(), wc(), u(7), u(9)]
  },
  {
    label: 'D',
    left: [p(14), p(12), p(10), u(8), u(6), u(4), u(2)],
    center: centerBlock(117, 101),
    right: [u(1), u(3), u(5), u(7), p(9), p(11), p(13)]
  },
  {
    label: 'E',
    left: [g(14), g(12), g(10), p(8), p(6), u(4), u(2)],
    center: centerBlock(118, 101),
    right: [u(1), u(3), p(5), p(7), g(9), g(11), g(13)]
  },
  {
    label: 'F',
    left: [g(14), g(12), g(10), p(8), p(6), u(4), u(2)],
    center: centerBlock(119, 101),
    right: [u(1), u(3), p(5), p(7), g(9), g(11), g(13)]
  },
  {
    label: 'G',
    left: [g(16), g(14), g(12), g(10), p(8), p(6), u(4), u(2)],
    center: centerBlock(119, 101),
    right: [u(1), u(3), p(5), p(7), g(9), g(11), g(13), g(15)]
  },
  {
    label: 'H',
    left: [g(16), g(14), g(12), g(10), p(8), p(6), u(4), u(2)],
    center: centerBlock(119, 101),
    right: [u(1), u(3), p(5), p(7), g(9), g(11), g(13), g(15)]
  },
  {
    label: 'J',
    left: [g(16), g(14), g(12), g(10), p(8), p(6), u(4), u(2)],
    center: centerBlock(120, 101),
    right: [u(1), u(3), p(5), p(7), g(9), g(11), g(13), g(15)]
  },
  {
    label: 'K',
    left: [g(16), g(14), g(12), g(10), p(8), p(6), u(4), u(2)],
    center: centerBlock(119, 101),
    right: [u(1), u(3), p(5), p(7), g(9), g(11), g(13), g(15)]
  },
  {
    label: 'L',
    left: [g(14), g(12), g(10), p(8), p(6), u(4), u(2)],
    center: centerBlock(120, 101),
    right: [u(1), u(3), p(5), p(7), g(9), g(11), g(13)]
  },
  {
    label: 'M',
    left: [g(14), g(12), g(10), p(8), p(6), u(4), u(2)],
    center: centerBlock(121, 101),
    right: [u(1), u(3), p(5), p(7), g(9), g(11), g(13)]
  },
  {
    label: 'N',
    left: [g(14), g(12), g(10), p(8), p(6), u(4), u(2)],
    center: centerBlock(120, 101),
    right: [u(1), u(3), p(5), p(7), g(9), g(11), g(13)]
  },
  {
    label: 'O',
    left: [g(14), g(12), g(10), p(8), p(6), p(4), p(2)],
    center: centerBlock(121, 101, 'premium'),
    right: [p(1), p(3), p(5), p(7), g(9), g(11), g(13)]
  },
  {
    label: 'P',
    left: [p(6), p(4), p(2)],
    center: centerBlock(122, 101, 'premium'),
    right: [p(1), p(3), p(5)]
  },
  {
    label: 'Q',
    left: [p(6), p(4), p(2)],
    center: centerBlock(122, 101, 'premium'),
    right: [p(1), p(3), p(5)]
  },
  {
    label: 'R',
    left: [p(4), p(2)],
    center: centerBlock(122, 101, 'premium'),
    right: [p(1), p(3)]
  },
  {
    label: 'S',
    left: [p(4), p(2)],
    center: centerBlock(121, 101, 'premium'),
    right: [p(1), p(3)]
  },
  {
    label: 'T',
    left: [p(4), p(2)],
    center: centerBlock(122, 101, 'premium'),
    right: [p(1), p(3)]
  },
  {
    label: 'U',
    left: [p(4), p(2)],
    center: centerBlock(123, 101, 'premium'),
    right: [p(1), p(3)]
  }
]

// ── Seat dot ──────────────────────────────────────────────────────────────────
function SeatDot({
  rowLabel,
  seat,
  onActivate,
  onDeactivate,
  delay
}: {
  rowLabel: string
  seat: SeatConfig
  onActivate: (row: string, seat: SeatConfig, e: React.MouseEvent | React.TouchEvent) => void
  onDeactivate: () => void
  delay: number
}) {
  const colors = TIER_COLORS[seat.tier]
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.2, type: 'spring', stiffness: 300, damping: 22 }}
      whileHover={{ scale: 1.6, zIndex: 10 }}
      onMouseEnter={(e) => onActivate(rowLabel, seat, e)}
      onMouseLeave={onDeactivate}
      onTouchStart={(e) => {
        e.preventDefault()
        onActivate(rowLabel, seat, e)
      }}
      onTouchEnd={onDeactivate}
      className={`w-4 h-4 rounded-full cursor-pointer border shrink-0 flex items-center justify-center text-white font-mono ${colors.bg} ${colors.border}`}
      style={{ fontSize: 5, touchAction: 'none' }}
    >
      {seat.tier === 'wheelchair' ? '♿' : seat.number}
    </motion.div>
  )
}

// ── Box grid ──────────────────────────────────────────────────────────────────
function BoxGrid({
  box,
  bi,
  onActivate,
  onDeactivate
}: {
  box: { label: string; seats: SeatConfig[] }
  bi: number
  onActivate: (row: string, seat: SeatConfig, e: React.MouseEvent | React.TouchEvent) => void
  onDeactivate: () => void
  labelRight?: boolean
}) {
  const top = box.seats.slice(0, Math.ceil(box.seats.length / 2))
  const bottom = box.seats.slice(Math.ceil(box.seats.length / 2))
  return (
    <div className="flex flex-col items-center gap-0.5 border border-border-dark/30 px-1 py-1">
      <span className="text-[6px] font-mono text-white leading-none">{box.label}</span>
      <div className="flex gap-0.5">
        {top.map((seat, i) => (
          <SeatDot
            key={`box-${box.label}-T-${i}`}
            rowLabel={`Box ${box.label}`}
            seat={seat}
            onActivate={onActivate}
            onDeactivate={onDeactivate}
            delay={bi * 0.04 + i * 0.01}
          />
        ))}
      </div>
      <div className="flex gap-0.5">
        {bottom.map((seat, i) => (
          <SeatDot
            key={`box-${box.label}-B-${i}`}
            rowLabel={`Box ${box.label}`}
            seat={seat}
            onActivate={onActivate}
            onDeactivate={onDeactivate}
            delay={bi * 0.04 + (top.length + i) * 0.01}
          />
        ))}
      </div>
    </div>
  )
}

// ── Seat row ──────────────────────────────────────────────────────────────────
function SeatRowUI({
  row,
  rowIdx,
  onActivate,
  onDeactivate
}: {
  row: RowConfig
  rowIdx: number
  onActivate: (row: string, seat: SeatConfig, e: React.MouseEvent | React.TouchEvent) => void
  onDeactivate: () => void
}) {
  const baseDelay = rowIdx * 0.025
  return (
    <div className="flex items-center gap-0.5 justify-center">
      <span className="text-[6px] font-mono text-white w-3 text-right shrink-0">{row.label}</span>
      <div className="flex gap-0.5">
        {row.left.map((seat, i) => (
          <SeatDot
            key={`${row.label}-L-${i}`}
            rowLabel={row.label}
            seat={seat}
            onActivate={onActivate}
            onDeactivate={onDeactivate}
            delay={baseDelay + i * 0.005}
          />
        ))}
      </div>
      <div className="w-1 shrink-0" />
      <div className="flex gap-0.5">
        {row.center.map((seat, i) => (
          <SeatDot
            key={`${row.label}-C-${i}`}
            rowLabel={row.label}
            seat={seat}
            onActivate={onActivate}
            onDeactivate={onDeactivate}
            delay={baseDelay + (row.left.length + i) * 0.005}
          />
        ))}
      </div>
      <div className="w-1 shrink-0" />
      <div className="flex gap-0.5">
        {row.right.map((seat, i) => (
          <SeatDot
            key={`${row.label}-R-${i}`}
            rowLabel={row.label}
            seat={seat}
            onActivate={onActivate}
            onDeactivate={onDeactivate}
            delay={baseDelay + (row.left.length + row.center.length + i) * 0.005}
          />
        ))}
      </div>
      <span className="text-[6px] font-mono text-white w-3 shrink-0">{row.label}</span>
    </div>
  )
}

export default function OperaHouseMainFloor() {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  const handleActivate = useCallback((row: string, seat: SeatConfig, e: React.MouseEvent | React.TouchEvent) => {
    const target = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setTooltip({
      row,
      seat,
      x: target.left,
      y: target.top
    })
  }, [])

  const handleDeactivate = useCallback(() => setTooltip(null), [])

  return (
    <div className="bg-black text-text-dark flex flex-col items-center py-6 760:py-8 px-2">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-4 760:mb-6">
        <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-primary-dark">Sarasota Opera House</span>
        <h1 className="font-quicksand font-black text-xl 760:text-2xl text-text-dark mt-1">Main Floor</h1>
      </motion.div>

      {/* Chart — scrolls horizontally on small screens */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-max mx-auto relative">
          {/* Tooltip — fixed to viewport since we're no longer inside a scaled div */}
          <AnimatePresence>
            {tooltip && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                className="fixed z-50 pointer-events-none bg-bg-dark border border-border-dark px-3 py-2"
                style={{ left: tooltip.x + 14, top: tooltip.y - 56 }}
              >
                <p className="text-[11px] font-mono text-text-dark">
                  Row {tooltip.row} · Seat {tooltip.seat.number}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${TIER_COLORS[tooltip.seat.tier].bg}`} />
                  <span className="text-[10px] font-mono text-muted-dark">{TIER_COLORS[tooltip.seat.tier].label}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 3-column layout */}
          <div className="flex gap-2 items-start justify-center">
            {/* Left boxes 11/12/13 */}
            <div className="flex flex-col gap-2 shrink-0 self-start mt-12">
              {LEFT_BOXES.filter((b) => ['11', '12', '13'].includes(b.label)).map((box, bi) => (
                <BoxGrid
                  key={box.label}
                  box={box}
                  bi={bi}
                  onActivate={handleActivate}
                  onDeactivate={handleDeactivate}
                />
              ))}
            </div>

            {/* Center */}
            <div className="flex flex-col items-center flex-1 min-w-0">
              <div className="flex items-end gap-12 mb-3 w-full justify-center">
                <BoxGrid
                  box={LEFT_BOXES.find((b) => b.label === '10')!}
                  bi={0}
                  onActivate={handleActivate}
                  onDeactivate={handleDeactivate}
                />
                {TOP_BOXES.map((box, bi) => (
                  <BoxGrid
                    key={box.label}
                    box={box}
                    bi={bi}
                    onActivate={handleActivate}
                    onDeactivate={handleDeactivate}
                  />
                ))}
                <BoxGrid
                  box={RIGHT_BOXES.find((b) => b.label === '4')!}
                  bi={0}
                  onActivate={handleActivate}
                  onDeactivate={handleDeactivate}
                  labelRight
                />
              </div>

              <div className="flex flex-col gap-1 w-full">
                {[...ROWS].reverse().map((row, rowIdx) => (
                  <SeatRowUI
                    key={row.label}
                    row={row}
                    rowIdx={rowIdx}
                    onActivate={handleActivate}
                    onDeactivate={handleDeactivate}
                  />
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, scaleX: 0.5 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-80 h-5 bg-surface-dark border border-border-dark flex items-center justify-center mt-10"
              >
                <span className="text-[8px] font-mono tracking-[0.3em] uppercase text-muted-dark/40">Stage</span>
              </motion.div>
            </div>

            {/* Right boxes 1/2/3 */}
            <div className="flex flex-col gap-2 shrink-0 self-start mt-8">
              {RIGHT_BOXES.filter((b) => ['1', '2', '3'].includes(b.label)).map((box, bi) => (
                <BoxGrid
                  key={box.label}
                  box={box}
                  bi={bi}
                  onActivate={handleActivate}
                  onDeactivate={handleDeactivate}
                  labelRight
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex flex-wrap gap-3 760:gap-4 mt-4 760:mt-6 justify-center px-4"
      >
        {(Object.entries(TIER_COLORS) as [Tier, (typeof TIER_COLORS)[Tier]][]).map(([tier, colors]) => (
          <div key={tier} className="flex items-center gap-1.5 760:gap-2">
            <div className={`w-2.5 h-2.5 760:w-3 760:h-3 rounded-full shrink-0 ${colors.bg}`} />
            <span className="text-[9px] 760:text-[10px] font-mono text-muted-dark">{colors.label}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
