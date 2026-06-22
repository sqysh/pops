'use client'

import { motion } from 'framer-motion'
import { ExternalLink, MapPin, Calendar, Clock } from 'lucide-react'
import Picture from '../common/Picture'

export function FireworksBanner() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-black">
      {/* Stars background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          {/* Stars scattered */}
          {[
            [8, 15],
            [15, 60],
            [22, 35],
            [30, 80],
            [38, 20],
            [45, 55],
            [52, 10],
            [60, 75],
            [68, 30],
            [75, 65],
            [82, 18],
            [88, 48],
            [93, 82],
            [96, 35],
            [5, 88],
            [12, 42],
            [25, 70],
            [35, 5],
            [48, 90],
            [55, 45],
            [70, 8],
            [78, 85],
            [85, 28],
            [91, 68],
            [98, 12]
          ].map(([x, y], i) => (
            <circle
              key={i}
              cx={`${x}%`}
              cy={`${y}%`}
              r={i % 2 === 0 ? '1' : '0.5'}
              fill={i % 3 === 0 ? '#ef4444' : i % 3 === 1 ? '#3b82f6' : 'white'}
              opacity={0.3 + (i % 4) * 0.1}
            />
          ))}
        </svg>
      </div>

      {/* Red/blue gradient accents */}
      <div
        className="absolute top-0 left-0 w-48 h-full bg-linear-to-r from-red-600/8 to-transparent pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-0 right-0 w-48 h-full bg-linear-to-l from-blue-600/8 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-[320px] 430:max-w-130 760:max-w-xl 990:max-w-200 1200:max-w-screen-1160 mx-auto px-4 990:px-0 py-10 760:py-14">
        <div className="grid grid-cols-1 760:grid-cols-[1fr_auto] gap-8 760:gap-12 items-center">
          {/* Left — logo + info */}
          <div className="flex flex-col 480:flex-row items-center 480:items-start gap-6 760:gap-8">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="shrink-0"
            >
              <div className="relative w-48 h-48 430:w-56 430:h-56 760:w-64 760:h-64 bg-white p-4 shadow-2xl">
                <Picture
                  src="/images/pops-fireworks-logo.jpg"
                  alt="The Pops Fireworks Logo"
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col gap-3 text-center 480:text-left"
            >
              {/* Eyebrow */}
              <div className="flex items-center gap-3 justify-center 480:justify-start">
                <span className="font-changa text-[9px] uppercase tracking-[0.3em] text-red-400">Special Event</span>
              </div>

              {/* Title */}
              <h2 className="font-changa font-black text-2xl 430:text-3xl 760:text-4xl text-white leading-tight">
                Fireworks on the Lake:
                <br />
                <span className="text-red-500">America 250</span>
              </h2>

              {/* Details */}
              <div className="flex flex-col gap-2 mt-1">
                <div className="flex items-center gap-2 justify-center 480:justify-start">
                  <Calendar className="w-3.5 h-3.5 text-red-400 shrink-0" aria-hidden="true" />
                  <span className="font-lato text-sm text-white/80">Friday, July 3, 2026</span>
                </div>
                <div className="flex items-center gap-2 justify-center 480:justify-start">
                  <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" aria-hidden="true" />
                  <span className="font-lato text-sm text-white/80">8:00 PM</span>
                </div>
                <div className="flex items-center gap-2 justify-center 480:justify-start">
                  <MapPin className="w-3.5 h-3.5 text-white/40 shrink-0" aria-hidden="true" />
                  <span className="font-lato text-sm text-white/60">Nathan Benderson Park, Sarasota</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right — CTA */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center 760:justify-end"
          >
            <a
              href="https://fireworksonthelake.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="More information and tickets for Fireworks on the Lake — opens in new tab"
              className="group inline-flex items-center gap-3 px-7 py-4 bg-red-600 hover:bg-red-500 text-white font-changa text-sm uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              More Info & Tickets
              <ExternalLink
                className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform"
                aria-hidden="true"
              />
            </a>
          </motion.div>
        </div>
      </div>

      {/* Bottom patriotic stripe */}
      <div className="h-0.5 w-full flex" aria-hidden="true">
        <div className="flex-1 bg-red-600" />
        <div className="flex-1 bg-white/20" />
        <div className="flex-1 bg-blue-600" />
      </div>
    </section>
  )
}
