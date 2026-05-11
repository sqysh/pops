'use client'

import { useState } from 'react'
import Link from 'next/link'
import Picture from '@/app/components/common/Picture'
import { CueBoxEvent } from '@/app/types/cuebox.types'

type Props = { events: CueBoxEvent[] }

const FALLBACK_COLORS = [
  'from-red-950 to-black',
  'from-slate-900 to-black',
  'from-zinc-900 to-black',
  'from-stone-900 to-black',
  'from-neutral-900 to-black'
]

function formatDate(iso: string) {
  const d = new Date(iso)
  return {
    weekday: d.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase(),
    month: d.toLocaleDateString('en-US', { month: 'long' }).toUpperCase(),
    monthShort: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: d.getDate(),
    year: d.getFullYear(),
    time: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }
}

function dateRange(start: string, end: string) {
  const s = new Date(start)
  const e = new Date(end)
  if (s.getDate() === e.getDate() && s.getMonth() === e.getMonth()) return null
  const sm = s.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
  const em = e.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
  return sm === em ? `${sm} ${s.getDate()}–${e.getDate()}` : `${sm} ${s.getDate()} – ${em} ${e.getDate()}`
}

export default function ConcertsClient({ events }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const visible = events.filter((e) => e.isVisibleOnline)

  if (true) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center">
        <div className="relative z-10 flex flex-col items-center gap-6 max-w-lg">
          <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-blaze-text">The Pops Orchestra</p>
          <h1 className="font-changa text-6xl sm:text-7xl font-bold text-white leading-none">Coming Soon</h1>
          <div className="w-12 h-px bg-blaze" />
          <p className="font-lato text-white/60 text-sm leading-relaxed">
            Our concerts page is on its way. In the meantime, visit our homepage for the latest news and upcoming
            performances.
          </p>
          <Link
            href="/"
            className="font-mono text-[11px] tracking-widest uppercase px-6 py-3 border border-white/20 text-white/60 hover:border-blaze hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze-text focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Back to Home
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* ── Page Header ── */}
      <div className="relative pt-28 pb-16 px-6 overflow-hidden border-b border-white/10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/images/bio-bg.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.6
          }}
        />
        <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-blaze-text mb-3">2025–2026 Season</p>
            <h1 className="font-changa text-7xl md:text-9xl font-bold text-white leading-none tracking-tight">
              Concerts
            </h1>
          </div>
          <p className="font-lato text-white/50 text-sm max-w-xs leading-relaxed">
            {visible.length} upcoming {visible.length === 1 ? 'performance' : 'performances'} at venues across the
            Cultural Coast
          </p>
        </div>
      </div>

      {/* ── Event Cards ── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {visible.length === 0 ? (
          <div className="py-32 text-center">
            <p className="font-mono text-sm tracking-widest uppercase text-white/30">
              No upcoming concerts at this time
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-px bg-white/10">
            {visible.map((event, idx) => {
              const d = formatDate(event.firstInstanceDatetime)
              const range = dateRange(event.firstInstanceDatetime, event.lastInstanceDatetime)
              const hasImg = !!event.publicImageUrl
              const hasDesc = !!event.descriptionHtml
              const isOpen = expanded === event.id
              const isSoldOut = event.status === 'SOLD_OUT'
              const isCancelled = event.status === 'CANCELED'
              const fallback = FALLBACK_COLORS[idx % FALLBACK_COLORS.length]

              return (
                <article key={event.id} className="bg-black group">
                  {/* ── Card ── */}
                  <div className="relative min-h-70 md:min-h-80 flex overflow-hidden">
                    {/* Background image or gradient */}
                    {hasImg ? (
                      <>
                        <Picture
                          src={event.publicImageUrl}
                          alt=""
                          aria-hidden="true"
                          className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-transform duration-700 scale-105 group-hover:scale-100"
                        />
                        <div className="absolute inset-0 bg-linear-to-r from-black via-black/80 to-transparent" />
                      </>
                    ) : (
                      <div className={`absolute inset-0 bg-linear-to-br ${fallback} opacity-60`} />
                    )}

                    {/* Large index number — decorative */}
                    <span
                      aria-hidden="true"
                      className="absolute right-6 top-1/2 -translate-y-1/2 font-changa font-bold text-white/4 leading-none select-none pointer-events-none"
                      style={{ fontSize: 'clamp(120px, 20vw, 240px)' }}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </span>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col md:flex-row w-full">
                      {/* Date block */}
                      <div className="flex md:flex-col items-center md:justify-center gap-4 md:gap-0 px-8 py-8 md:py-0 md:w-35 md:min-w-35 border-b md:border-b-0 md:border-r border-white/10 shrink-0">
                        <div className="flex md:flex-col items-baseline md:items-center gap-1.5 md:gap-0">
                          <span className="font-mono text-[11px] tracking-widest text-white/40 md:mb-2">
                            {d.weekday.slice(0, 3)}
                          </span>
                          <span
                            className="font-changa font-bold text-white leading-none md:my-1"
                            style={{ fontSize: 'clamp(3rem, 6vw, 5rem)' }}
                          >
                            {d.day}
                          </span>
                          <div className="flex md:flex-col items-center gap-1">
                            <span className="font-mono text-[12px] tracking-widest text-blaze-text font-bold">
                              {d.monthShort}
                            </span>
                            <span className="font-mono text-[11px] tracking-widest text-white/40">{d.year}</span>
                          </div>
                        </div>
                      </div>

                      {/* Main info */}
                      <div className="flex flex-1 flex-col justify-center px-8 py-10 gap-3 min-w-0">
                        {/* Title */}
                        <h2
                          className="font-changa font-bold text-white leading-none"
                          style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
                        >
                          {event.name}
                        </h2>

                        {/* Meta row */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                          {range ? (
                            <span className="font-mono text-xs text-blaze-text tracking-widest uppercase">{range}</span>
                          ) : null}
                          <span className="font-mono text-xs text-white/50 tracking-wide">{d.time}</span>
                          {event.venues?.length > 0 && (
                            <span className="font-mono text-xs text-white/40">
                              {event.venues.map((v) => v.name).join('  ·  ')}
                            </span>
                          )}
                        </div>

                        {/* Tags */}
                        {event.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {event.tags.map((tag) => (
                              <span
                                key={tag}
                                className="font-mono text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 border border-white/20 text-white/40"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Description toggle */}
                        {hasDesc && (
                          <button
                            onClick={() => setExpanded(isOpen ? null : event.id)}
                            aria-expanded={isOpen}
                            className="mt-1 self-start font-mono text-[11px] tracking-widest uppercase text-white/30 hover:text-blaze-text transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blaze-text"
                          >
                            {isOpen ? '− Hide details' : '+ About this concert'}
                          </button>
                        )}
                      </div>

                      {/* CTA — bottom-right on mobile, right-center on desktop */}
                      <div className="flex md:items-center px-8 pb-8 md:py-0 md:pr-12 shrink-0">
                        {isCancelled ? (
                          <span className="font-mono text-xs tracking-widest uppercase text-white/25 line-through">
                            Cancelled
                          </span>
                        ) : isSoldOut ? (
                          <div className="flex flex-col items-start md:items-center gap-1">
                            <span className="font-mono text-xs tracking-widest uppercase text-white/25">Sold Out</span>
                            <Link
                              href={event.publicTicketsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-[11px] tracking-widest uppercase text-white/40 underline underline-offset-4 hover:text-white/60 transition-colors duration-200"
                            >
                              Join waitlist
                            </Link>
                          </div>
                        ) : (
                          <Link
                            href={event.publicTicketsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/btn relative flex flex-col items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze-text focus-visible:ring-offset-4 focus-visible:ring-offset-black"
                          >
                            <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-white/40 group-hover/btn:text-white/60 transition-colors duration-200">
                              Tickets
                            </span>
                            <span className="font-changa text-5xl font-bold text-blaze group-hover/btn:text-blaze-text transition-colors duration-200 leading-none">
                              →
                            </span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ── Expandable description ── */}
                  {hasDesc && isOpen && (
                    <div className="border-t border-white/10 bg-surface-dark">
                      <div className="max-w-3xl px-8 md:px-43 py-8">
                        <div
                          className="font-lato text-[15px] text-white/70 leading-relaxed prose prose-invert prose-sm max-w-none prose-p:my-0"
                          dangerouslySetInnerHTML={{ __html: event.descriptionHtml! }}
                        />
                      </div>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}
