'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'
import type { Event } from '@prisma/client'

interface EventsBlockProps {
  events: Event[]
}

export function EventsBlock({ events }: EventsBlockProps) {
  const published = events.filter((e) => e.status === 'PUBLISHED')

  if (!published.length) return null

  return (
    <section className="bg-black py-24 sm:py-32 px-6 sm:px-10 lg:px-16" aria-labelledby="events-heading">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-blaze" aria-hidden="true" />
              <span className="font-heebo text-sm tracking-[0.35em] uppercase text-blaze-text">Calendar</span>
            </div>
            <h2
              id="events-heading"
              className="font-c-infant font-bold text-4xl sm:text-5xl uppercase tracking-wide text-white leading-none"
            >
              Upcoming Events
            </h2>
          </div>
          <Link
            href="/events"
            aria-label="View all upcoming events"
            className="group inline-flex items-center gap-3 font-heebo text-sm uppercase tracking-[0.25em] text-blaze-text hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze shrink-0"
          >
            All Events
            <div className="w-6 h-px bg-blaze group-hover:w-10 transition-all duration-300" aria-hidden="true" />
          </Link>
        </motion.div>

        {/* Events list */}
        <ul role="list" className="divide-y divide-white/10">
          {published.map((event, i) => (
            <motion.li
              key={event.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
            >
              <article
                aria-label={event.title}
                className="group grid grid-cols-1 sm:grid-cols-[120px_1fr_auto] gap-4 sm:gap-8 items-center py-8"
              >
                {/* Date block */}
                <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-0">
                  <div className="flex flex-col items-center justify-center w-16 h-16 border border-white/10 group-hover:border-blaze transition-colors shrink-0">
                    <span className="font-heebo text-[10px] tracking-[0.2em] uppercase text-blaze-text leading-none mb-1">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="font-c-infant font-bold text-white text-2xl leading-none">
                      {new Date(event.date).getDate()}
                    </span>
                  </div>
                  <div className="sm:hidden">
                    <p className="font-c-infant font-bold text-white text-xl leading-tight group-hover:text-blaze-text transition-colors">
                      {event.title}
                    </p>
                  </div>
                </div>

                {/* Info */}
                <div className="min-w-0">
                  <p className="font-c-infant font-bold text-white text-xl sm:text-2xl leading-tight mb-3 group-hover:text-blaze-text transition-colors hidden sm:block">
                    {event.title}
                  </p>
                  <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                    <div className="flex items-center gap-1.5 text-white/80 text-sm font-heebo">
                      <Calendar className="w-3 h-3 shrink-0 text-blaze-text" aria-hidden="true" />
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                      {' · '}
                      {new Date(event.date).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1.5 text-white/80 text-sm font-heebo">
                        <MapPin className="w-3 h-3 shrink-0 text-blaze-text" aria-hidden="true" />
                        {event.location}
                      </div>
                    )}
                  </div>
                  {event.description && (
                    <p className="font-heebo text-white/80 text-sm leading-relaxed mt-3 line-clamp-2 max-w-xl">
                      {event.description}
                    </p>
                  )}
                </div>

                {/* Arrow */}
                <ArrowRight
                  className="w-5 h-5 text-white/40 group-hover:text-blaze-text group-hover:translate-x-1 transition-all hidden sm:block shrink-0"
                  aria-hidden="true"
                />
              </article>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
