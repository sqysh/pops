'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Tier = 'general' | 'premium' | 'ultra'

interface Seat {
  row: string
  number: number
  tier: Tier
  section: 'left' | 'centerLeft' | 'center' | 'centerRight' | 'right'
}

interface TooltipState {
  seat: Seat
  x: number
  y: number
}

const TIER_COLORS: Record<Tier, { bg: string; border: string; label: string }> = {
  general: { bg: 'bg-blue-500', border: 'border-blue-700', label: 'General pricing' },
  premium: { bg: 'bg-green-600', border: 'border-green-800', label: 'Premium pricing' },
  ultra: { bg: 'bg-amber-500', border: 'border-amber-700', label: 'Ultra pricing' }
}

// Exact seat numbers from the screenshot
// OO row: Left block even 30→2, Center 114→101, Right odd 1→29
// NN row: Left block even 22→2, Center 113→101, Right odd 1→21
interface SeatConfig {
  number: number
  tier: Tier
}

const ROWS: {
  label: string
  left: SeatConfig[]
  centerLeft?: SeatConfig[]
  center: SeatConfig[]
  centerRight?: SeatConfig[]
  right: SeatConfig[]
}[] = [
  {
    label: 'OO',
    left: [30, 28, 26, 24, 22, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2].map((n) => ({ number: n, tier: 'general' as Tier })),
    center: [114, 113, 112, 111, 110, 109, 108, 107, 106, 105, 104, 103, 102, 101].map((n) => ({
      number: n,
      tier: 'general' as Tier
    })),
    right: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29].map((n) => ({ number: n, tier: 'general' as Tier }))
  },
  {
    label: 'NN',
    left: [22, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2].map((n) => ({ number: n, tier: 'general' as Tier })),
    center: [113, 112, 111, 110, 109, 108, 107, 106, 105, 104, 103, 102, 101].map((n) => ({
      number: n,
      tier: 'general' as Tier
    })),
    right: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21].map((n) => ({ number: n, tier: 'general' as Tier }))
  },
  {
    label: 'MM',
    left: [22, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2].map((n) => ({ number: n, tier: 'general' as Tier })),
    center: [113, 112, 111, 110, 109, 108, 107, 106, 105, 104, 103, 102, 101].map((n) => ({
      number: n,
      tier: 'general' as Tier
    })),
    right: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21].map((n) => ({ number: n, tier: 'general' as Tier }))
  },
  {
    label: 'LL',
    left: [22, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2].map((n) => ({ number: n, tier: 'general' as Tier })),
    center: [113, 112, 111, 110, 109, 108, 107, 106, 105, 104, 103, 102, 101].map((n) => ({
      number: n,
      tier: 'general' as Tier
    })),
    right: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21].map((n) => ({ number: n, tier: 'general' as Tier }))
  },
  {
    label: 'KK',
    left: [22, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2].map((n) => ({ number: n, tier: 'general' as Tier })),
    center: [113, 112, 111, 110, 109, 108, 107, 106, 105, 104, 103, 102, 101].map((n) => ({
      number: n,
      tier: 'general' as Tier
    })),
    right: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21].map((n) => ({ number: n, tier: 'general' as Tier }))
  },
  {
    label: 'JJ',
    left: [16, 14, 12, 10, 8, 6, 4, 2].map((n) => ({ number: n, tier: 'general' as Tier })),
    center: [113, 112, 111, 110, 109, 108, 107, 106, 105, 104, 103, 102, 101].map((n) => ({
      number: n,
      tier: 'general' as Tier
    })),
    right: [1, 3, 5, 7, 9, 11, 13, 15].map((n) => ({ number: n, tier: 'general' as Tier }))
  },
  {
    label: 'HH',
    left: [
      { number: 16, tier: 'general' },
      { number: 14, tier: 'general' },
      { number: 12, tier: 'general' },
      { number: 10, tier: 'general' },
      { number: 8, tier: 'premium' },
      { number: 6, tier: 'premium' },
      { number: 4, tier: 'premium' },
      { number: 2, tier: 'premium' }
    ],
    center: [113, 112, 111, 110, 109, 108, 107, 106, 105, 104, 103, 102, 101].map((n) => ({
      number: n,
      tier: 'premium' as Tier
    })),
    right: [
      { number: 1, tier: 'premium' },
      { number: 3, tier: 'premium' },
      { number: 5, tier: 'premium' },
      { number: 7, tier: 'premium' },
      { number: 9, tier: 'general' },
      { number: 11, tier: 'general' },
      { number: 13, tier: 'general' },
      { number: 15, tier: 'general' }
    ]
  },
  {
    label: 'GG',
    left: [16, 14, 12, 10, 8, 6, 4, 2].map((n) => ({ number: n, tier: 'premium' as Tier })),
    center: [113, 112, 111, 110, 109, 108, 107, 106, 105, 104, 103, 102, 101].map((n) => ({
      number: n,
      tier: 'premium' as Tier
    })),
    right: [1, 3, 5, 7, 9, 11, 13, 15].map((n) => ({ number: n, tier: 'premium' as Tier }))
  },
  {
    label: 'FF',
    left: [16, 14, 12, 10, 8, 6, 4, 2].map((n) => ({ number: n, tier: 'premium' as Tier })),
    center: [113, 112, 111, 110, 109, 108, 107, 106, 105, 104, 103, 102, 101].map((n) => ({
      number: n,
      tier: 'premium' as Tier
    })),
    right: [1, 3, 5, 7, 9, 11, 13, 15].map((n) => ({ number: n, tier: 'premium' as Tier }))
  },
  {
    label: 'EE',
    left: [16, 14, 12, 10, 8, 6, 4, 2].map((n) => ({ number: n, tier: 'premium' as Tier })),
    center: [113, 112, 111, 110, 109, 108, 107, 106, 105, 104, 103, 102, 101].map((n) => ({
      number: n,
      tier: 'premium' as Tier
    })),
    right: [1, 3, 5, 7, 9, 11, 13, 15].map((n) => ({ number: n, tier: 'premium' as Tier }))
  },
  {
    label: 'DD',
    left: [16, 14, 12, 10, 8, 6, 4, 2].map((n) => ({ number: n, tier: 'premium' as Tier })),
    center: [113, 112, 111, 110, 109, 108, 107, 106, 105, 104, 103, 102, 101].map((n) => ({
      number: n,
      tier: 'premium' as Tier
    })),
    right: [1, 3, 5, 7, 9, 11, 13, 15].map((n) => ({ number: n, tier: 'premium' as Tier }))
  },
  {
    label: 'CC',
    left: [
      { number: 24, tier: 'premium' },
      { number: 22, tier: 'premium' },
      { number: 20, tier: 'premium' },
      { number: 18, tier: 'premium' },
      { number: 16, tier: 'premium' },
      { number: 14, tier: 'premium' },
      { number: 12, tier: 'premium' },
      { number: 10, tier: 'premium' }
    ],
    centerLeft: [8, 6, 4, 2].map((n) => ({
      number: n,
      tier: 'ultra' as Tier
    })),
    center: [108, 107, 106, 105, 104, 103, 102, 101].map((n) => ({
      number: n,
      tier: 'ultra' as Tier
    })),
    centerRight: [1, 3, 5, 7].map((n) => ({
      number: n,
      tier: 'ultra' as Tier
    })),
    right: [
      { number: 9, tier: 'premium' },
      { number: 11, tier: 'premium' },
      { number: 13, tier: 'premium' },
      { number: 15, tier: 'premium' },
      { number: 17, tier: 'premium' },
      { number: 19, tier: 'premium' },
      { number: 21, tier: 'premium' },
      { number: 23, tier: 'premium' }
    ]
  },
  {
    label: 'BB',
    left: [
      { number: 24, tier: 'premium' },
      { number: 22, tier: 'premium' },
      { number: 20, tier: 'premium' },
      { number: 18, tier: 'premium' },
      { number: 16, tier: 'premium' },
      { number: 14, tier: 'premium' },
      { number: 12, tier: 'premium' },
      { number: 10, tier: 'premium' }
    ],
    centerLeft: [8, 6, 4, 2].map((n) => ({
      number: n,
      tier: 'ultra' as Tier
    })),
    center: [108, 107, 106, 105, 104, 103, 102, 101].map((n) => ({
      number: n,
      tier: 'ultra' as Tier
    })),
    centerRight: [1, 3, 5, 7].map((n) => ({
      number: n,
      tier: 'ultra' as Tier
    })),
    right: [
      { number: 9, tier: 'premium' },
      { number: 11, tier: 'premium' },
      { number: 13, tier: 'premium' },
      { number: 15, tier: 'premium' },
      { number: 17, tier: 'premium' },
      { number: 19, tier: 'premium' },
      { number: 21, tier: 'premium' },
      { number: 23, tier: 'premium' }
    ]
  },
  {
    label: 'AA',
    left: [
      { number: 24, tier: 'premium' },
      { number: 22, tier: 'premium' },
      { number: 20, tier: 'premium' },
      { number: 18, tier: 'premium' },
      { number: 16, tier: 'premium' },
      { number: 14, tier: 'premium' },
      { number: 12, tier: 'premium' },
      { number: 10, tier: 'premium' }
    ],
    centerLeft: [8, 6, 4, 2].map((n) => ({
      number: n,
      tier: 'ultra' as Tier
    })),
    center: [108, 107, 106, 105, 104, 103, 102, 101].map((n) => ({
      number: n,
      tier: 'ultra' as Tier
    })),
    centerRight: [1, 3, 5, 7].map((n) => ({
      number: n,
      tier: 'ultra' as Tier
    })),
    right: [
      { number: 9, tier: 'premium' },
      { number: 11, tier: 'premium' },
      { number: 13, tier: 'premium' },
      { number: 15, tier: 'premium' },
      { number: 17, tier: 'premium' },
      { number: 19, tier: 'premium' },
      { number: 21, tier: 'premium' },
      { number: 23, tier: 'premium' }
    ]
  }
]

function SeatDot({
  seat,
  onHover,
  onLeave,
  delay
}: {
  seat: Seat
  onHover: (seat: Seat, e: React.MouseEvent) => void
  onLeave: () => void
  delay: number
}) {
  const colors = TIER_COLORS[seat.tier]
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3, type: 'spring', stiffness: 300, damping: 20 }}
      whileHover={{ scale: 1.7, zIndex: 10 }}
      onMouseEnter={(e) => onHover(seat, e)}
      onMouseLeave={onLeave}
      className={`w-4.5 h-4.5 text-[9px] flex items-center justify-center rounded-full cursor-pointer border-2 shrink-0 ${colors.bg} ${colors.border}`}
    >
      {seat.number}
    </motion.div>
  )
}

export default function OperaHouseMezzAndBalc() {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  const handleHover = (seat: Seat, e: React.MouseEvent | React.TouchEvent) => {
    let clientX: number, clientY: number
    if ('touches' in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    // Clamp so it doesn't clip off right edge or top
    const x = Math.min(clientX + 14, window.innerWidth - 160)
    const y = clientY - 56 < 0 ? clientY + 14 : clientY - 56

    setTooltip({ seat, x, y })
  }

  return (
    <div className="flex bg-black flex-col items-center py-8 760:py-16 px-2 760:px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 760:mb-10"
      >
        <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-primary-dark">
          Sarasota Opera House
        </span>
        <h1 className="font-quicksand font-black text-xl 760:text-2xl text-text-dark mt-1">Seatmap</h1>
      </motion.div>

      {/* Chart — scale down on small screens */}
      <motion.div
        className="fixed z-50 pointer-events-none bg-bg-dark border border-border-dark px-3 py-2 max-w-37.5"
        style={{ left: tooltip?.x, top: tooltip?.y }}
      >
        <AnimatePresence>
          {tooltip && (
            <motion.div
              key={`${tooltip.seat.row}-${tooltip.seat.number}`}
              initial={{ opacity: 0, y: 4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="fixed z-50 pointer-events-none bg-bg-dark border border-border-dark px-3 py-2 max-w-37.5"
              style={{ left: tooltip.x, top: tooltip.y }}
            >
              <p className="text-[12px] font-mono text-text-dark">
                Row {tooltip.seat.row} · Seat {tooltip.seat.number}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className={`w-2 h-2 rounded-full shrink-0 ${TIER_COLORS[tooltip.seat.tier].bg}`} />
                <span className="text-[11px] font-mono text-muted-dark">{TIER_COLORS[tooltip.seat.tier].label}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="flex flex-col items-center justify-between gap-1.5 760:gap-2 min-w-max mx-auto">
        {ROWS.map((row, rowIdx) => (
          <div
            key={row.label}
            className={`flex items-center gap-0.5 760:gap-1 ${row.label === 'CC' ? 'mt-10 760:mt-14' : ''}`}
          >
            {/* Left label */}
            <span className="text-[9px] 760:text-[9px] font-mono text-muted-dark/70 w-5 760:w-6 text-right shrink-0">
              {row.label}
            </span>

            {/* Left block */}
            <div className="flex gap-0.5">
              {row.left.map(({ number, tier }, i) => (
                <SeatDot
                  key={`${row.label}-L-${number}`}
                  seat={{ row: row.label, number, tier, section: 'left' }}
                  onHover={handleHover}
                  onLeave={() => setTooltip(null)}
                  delay={rowIdx * 0.08 + i * 0.012}
                />
              ))}
            </div>

            {row.label !== 'OO' && <div className="w-1.5 760:w-2 shrink-0" />}

            {row.centerLeft && (
              <>
                <div className="flex gap-0.5">
                  {row.centerLeft.map(({ number, tier }, i) => (
                    <SeatDot
                      key={`${row.label}-CL-${number}`}
                      seat={{ row: row.label, number, tier, section: 'left' }}
                      onHover={handleHover}
                      onLeave={() => setTooltip(null)}
                      delay={rowIdx * 0.08 + i * 0.012}
                    />
                  ))}
                </div>
                {row.label !== 'OO' && <div className="w-1.5 760:w-2 shrink-0" />}
              </>
            )}

            {/* Center block */}
            <div className="flex gap-0.5">
              {row.center.map(({ number, tier }, i) => (
                <SeatDot
                  key={`${row.label}-C-${number}`}
                  seat={{ row: row.label, number, tier, section: 'left' }}
                  onHover={handleHover}
                  onLeave={() => setTooltip(null)}
                  delay={rowIdx * 0.08 + i * 0.012}
                />
              ))}
            </div>

            {row.label !== 'OO' && <div className="w-1.5 760:w-2 shrink-0" />}

            {row.centerRight && (
              <>
                <div className="flex gap-0.5">
                  {row.centerLeft.map(({ number, tier }, i) => (
                    <SeatDot
                      key={`${row.label}-CR-${number}`}
                      seat={{ row: row.label, number, tier, section: 'left' }}
                      onHover={handleHover}
                      onLeave={() => setTooltip(null)}
                      delay={rowIdx * 0.08 + i * 0.012}
                    />
                  ))}
                </div>
                {row.label !== 'OO' && <div className="w-1.5 760:w-2 shrink-0" />}
              </>
            )}

            {/* Right block */}
            <div className="flex gap-0.5">
              {row.right.map(({ number, tier }, i) => (
                <SeatDot
                  key={`${row.label}-R-${number}`}
                  seat={{ row: row.label, number, tier, section: 'left' }}
                  onHover={handleHover}
                  onLeave={() => setTooltip(null)}
                  delay={rowIdx * 0.08 + i * 0.012}
                />
              ))}
            </div>

            {/* Right label */}
            <span className="text-[9px] 760:text-[9px] font-mono text-muted-dark/70 w-5 760:w-6 shrink-0">
              {row.label}
            </span>
          </div>
        ))}
      </div>

      {/* Stage */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0.5 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-48 760:w-80 h-5 bg-surface-dark border border-border-dark flex items-center justify-center mt-6 760:mt-10"
      >
        <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-muted-dark/70">Stage</span>
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex flex-wrap gap-3 760:gap-6 mt-6 760:mt-10 justify-center"
      >
        {(Object.entries(TIER_COLORS) as [Tier, (typeof TIER_COLORS)[Tier]][]).map(([tier, colors]) => (
          <div key={tier} className="flex items-center gap-1.5 760:gap-2">
            <div className={`w-2.5 h-2.5 760:w-3 760:h-3 rounded-full ${colors.bg}`} />
            <span className="text-[10px] 760:text-[11px] font-mono text-muted-dark">{colors.label}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
