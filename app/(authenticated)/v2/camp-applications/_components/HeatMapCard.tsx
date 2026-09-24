'use client'

import exportCampApplications from '@/app/lib/utils/exportCampApplications'
import Link from 'next/link'

interface Props {
  campApplications: { createdAt: Date }[]
  campApplicationsEnabled: boolean
  newApplicationsCount: number
}

const YEAR_PALETTES: Record<number, string>[] = [
  { 0: '#222222', 1: '#2d1f5e', 2: '#4a2d8a', 3: '#6b3db5', 4: '#8b5cf6', 5: '#a78bfa' }, // violet
  { 0: '#222222', 1: '#0f3d2e', 2: '#166534', 3: '#15803d', 4: '#22c55e', 5: '#4ade80' }, // emerald
  { 0: '#222222', 1: '#1e3a5f', 2: '#1d4ed8', 3: '#2563eb', 4: '#60a5fa', 5: '#93c5fd' }, // blue
  { 0: '#222222', 1: '#4c1d1d', 2: '#991b1b', 3: '#dc2626', 4: '#f87171', 5: '#fca5a5' }, // red
  { 0: '#222222', 1: '#3d2600', 2: '#92400e', 3: '#d97706', 4: '#fbbf24', 5: '#fde68a' } // amber
]

const ACCENT_TEXT = ['#a78bfa', '#4ade80', '#93c5fd', '#f87171', '#fde68a']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const CELL = 9
const GAP = 2

function YearHeatmap({
  year,
  countsByDay,
  colorIdx
}: {
  year: number
  countsByDay: Record<string, number>
  colorIdx: number
}) {
  const palette = YEAR_PALETTES[colorIdx % 5]
  const accent = ACCENT_TEXT[colorIdx % 5]
  const allCounts = Object.values(countsByDay)
  const maxCount = Math.max(...allCounts, 1)
  const total = allCounts.reduce((s, c) => s + c, 0)

  if (total === 0) return null

  const dates = Object.keys(countsByDay).map((k) => new Date(k))
  const minMonth = Math.min(...dates.map((d) => d.getMonth()))
  const maxMonth = Math.max(...dates.map((d) => d.getMonth()))

  // weeks as columns, days as rows — left to right
  const startDate = new Date(year, minMonth, 1)
  startDate.setDate(startDate.getDate() - startDate.getDay())
  const endDate = new Date(year, maxMonth + 1, 0)

  const weeks: Date[][] = []
  const cursor = new Date(startDate)
  while (cursor <= endDate) {
    const week: Date[] = []
    for (let d = 0; d < 7; d++) {
      week.push(new Date(cursor))
      cursor.setDate(cursor.getDate() + 1)
    }
    weeks.push(week)
  }

  // Month label: first week index where that month appears
  const monthLabels: Record<number, string> = {}
  weeks.forEach((week, wi) => {
    const first = week.find((d) => d.getFullYear() === year && d.getMonth() >= minMonth && d.getMonth() <= maxMonth)
    if (first) {
      const m = first.getMonth()
      if (!Object.values(monthLabels).includes(MONTHS[m])) {
        monthLabels[wi] = MONTHS[m]
      }
    }
  })

  function getCellColor(date: Date) {
    if (date.getFullYear() !== year) return '#111111'
    if (date.getMonth() < minMonth || date.getMonth() > maxMonth) return '#111111'
    const key = date.toISOString().slice(0, 10)
    const count = countsByDay[key] ?? 0
    if (count === 0) return palette[0]
    const idx = Math.ceil((count / maxCount) * 5)
    return palette[Math.min(idx, 5)]
  }

  const peakDay = Object.entries(countsByDay).sort(([, a], [, b]) => b - a)[0]
  const peakDate = peakDay ? new Date(peakDay[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null

  return (
    <div className="flex flex-col gap-1 w-full">
      {/* Year label + count */}
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-[9px] font-mono uppercase tracking-widest font-bold" style={{ color: accent }}>
          {year}
        </span>
        <span className="text-[9px] font-mono text-muted-dark/70 tabular-nums">{total} apps</span>
      </div>

      {/* Grid: rows = days of week, cols = weeks */}
      <div className="flex gap-0">
        {/* Day labels column */}
        <div className="flex flex-col mr-1" style={{ gap: GAP }}>
          {DAYS.map((d, i) => (
            <div
              key={i}
              style={{ height: CELL, width: 10 }}
              className="text-[9px] font-mono text-muted-dark/60 flex items-center justify-end"
            >
              {i % 2 === 1 ? d : ''}
            </div>
          ))}
        </div>

        {/* Week columns */}
        <div className="flex flex-col gap-0 flex-1 min-w-0">
          {/* Month labels row */}
          <div className="flex mb-0.5" style={{ gap: GAP }}>
            {weeks.map((_, wi) => (
              <div
                key={wi}
                style={{ width: CELL, flexShrink: 0 }}
                className="text-[9px] font-mono text-muted-dark/95 uppercase overflow-visible whitespace-nowrap"
              >
                {monthLabels[wi] ?? ''}
              </div>
            ))}
          </div>

          {/* Day rows × week cols */}
          {DAYS.map((_, di) => (
            <div key={di} className="flex" style={{ gap: GAP, marginBottom: GAP }}>
              {weeks.map((week, wi) => {
                const date = week[di]
                const key = date.toISOString().slice(0, 10)
                const count = countsByDay[key] ?? 0
                const inRange =
                  date.getFullYear() === year && date.getMonth() >= minMonth && date.getMonth() <= maxMonth
                return (
                  <div
                    key={wi}
                    title={inRange ? `${key}${count > 0 ? `: ${count} app${count !== 1 ? 's' : ''}` : ''}` : ''}
                    style={{
                      width: CELL,
                      height: CELL,
                      backgroundColor: getCellColor(date),
                      flexShrink: 0
                    }}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1 mt-3">
        <span className="text-[9px] font-mono text-muted-dark/75 mr-0.5">Less</span>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ width: CELL, height: CELL, backgroundColor: palette[i], flexShrink: 0 }} />
        ))}
        <span className="text-[9px] font-mono text-muted-dark/75 ml-0.5">More</span>
      </div>

      {/* Explanation */}
      <p className="text-[9px] font-mono text-muted-dark/75 mt-1 leading-relaxed">
        Each cell = 1 day · Hover a cell to see the submission count
      </p>
      {peakDay && (
        <p className="text-[9px] font-mono text-muted-dark/75">
          Busiest day: <span style={{ color: accent }}>{peakDate}</span> · {peakDay[1]} submission
          {Number(peakDay[1]) !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}

export function CampHeatmapCard({ campApplications, campApplicationsEnabled, newApplicationsCount }: Props) {
  const allYears = Array.from(new Set(campApplications.map((a) => new Date(a.createdAt).getFullYear()))).sort(
    (a, b) => b - a
  )

  const countsByYear = allYears.reduce<Record<number, Record<string, number>>>((acc, yr) => {
    acc[yr] = campApplications.reduce<Record<string, number>>((inner, a) => {
      const d = new Date(a.createdAt)
      if (d.getFullYear() !== yr) return inner
      const key = d.toISOString().slice(0, 10)
      inner[key] = (inner[key] ?? 0) + 1
      return inner
    }, {})
    return acc
  }, {})

  const totalAllTime = campApplications.length
  const handleExport = exportCampApplications(campApplications)

  return (
    <Link href="/v2/camp-applications" className="col-span-1 row-span-2 block h-full group">
      <div className="bg-surface-dark border border-border-dark flex flex-col h-full hover:border-white/10 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-border-dark shrink-0">
          <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-dark">[ Camp Activity ]</span>
          <div className="flex items-center gap-2">
            {newApplicationsCount > 0 && (
              <span className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 border text-sky-400 border-sky-400/30 bg-sky-400/5 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-sky-400 shrink-0" />
                {newApplicationsCount} new
              </span>
            )}
            <span
              className={`text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 border flex items-center gap-1 ${
                campApplicationsEnabled
                  ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5'
                  : 'text-muted-dark/70 border-border-dark'
              }`}
            >
              <span
                className={`w-1 h-1 rounded-full shrink-0 ${campApplicationsEnabled ? 'bg-emerald-400' : 'bg-border-dark'}`}
                aria-hidden="true"
              />
              {campApplicationsEnabled ? 'Accepting' : 'Closed'}
            </span>
          </div>
        </div>

        {/* Count */}
        <div className="px-3 pt-3 pb-2 shrink-0">
          <div className="font-mono font-bold text-3xl leading-none" style={{ color: '#a78bfa' }}>
            {totalAllTime}
          </div>
          <div className="text-[9px] font-mono uppercase tracking-[0.15em] text-muted-dark/80 mt-1">
            total applications
          </div>
        </div>

        {/* Heatmaps stacked */}
        <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-3 flex flex-col gap-5">
          {allYears.map((yr, i) => (
            <YearHeatmap key={yr} year={yr} countsByDay={countsByYear[yr]} colorIdx={i} />
          ))}
        </div>

        {/* Footer */}
        <div className="px-3 py-2 border-t border-border-dark flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              handleExport()
            }}
            className="text-[9px] font-mono uppercase tracking-[0.15em] text-muted-dark hover:text-violet-400 transition-colors"
          >
            Export
          </button>
          <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-muted-dark group-hover:text-violet-400 transition-colors">
            VIEW ALL →
          </span>
        </div>
      </div>
    </Link>
  )
}
