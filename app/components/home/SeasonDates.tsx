'use client'

import { motion, useMotionValue, useTransform } from 'framer-motion'
import Picture from '@/app/components/common/Picture'
import { useEffect } from 'react'
import { FloatingParticles } from '../FloatingParticles'

const CONCERTS = [
  { name: 'Hocus Pocus Pops II', date: 'October 30', image: '/images/season-4.jpg' },
  { name: 'Born in the U.S.A.', date: 'November 14–16', image: '/images/season-2.jpg' },
  { name: 'Ring in the Holidays', date: 'December 13–14', image: '/images/season-6.jpg' },
  { name: 'Cheek to Cheek', date: 'February 13–15', image: '/images/season-3.jpg' },
  { name: "'80s Ladies", date: 'March 13–15', image: '/images/season-1.jpg' },
  { name: 'How Low Can You Go?', date: 'April 11–12', image: '/images/season-5.jpg' }
]

const ON_SALE_DATES = [
  { date: 'May 13', label: 'Season Renewals' },
  { date: 'June 22', label: 'New Season Subscriptions' },
  { date: 'August 3', label: 'Individual & Flex Packages' }
]

export function SeasonDates() {
  const scrollY = useMotionValue(0)
  const bgY = useTransform(scrollY, [0, 953], ['0%', '20%'])

  useEffect(() => {
    const handleScroll = () => scrollY.set(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrollY])

  return (
    <section className="bg-black text-white overflow-hidden">
      {/* ── Hero ── */}
      <div className="relative min-h-[70vh] flex flex-col items-center justify-center px-4 py-24 text-center overflow-hidden">
        {/* Top black fade */}
        <div
          className="absolute top-0 left-0 right-0 h-60 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)' }}
          aria-hidden="true"
        />

        {/* Parallax background */}
        <motion.div
          className="absolute inset-0 scale-125"
          style={{
            backgroundImage: 'url(/images/nikki-fire.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            y: bgY
          }}
          aria-hidden="true"
        />
        {/* 

        {/* Dark overlay — fades image into black at bottom */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,1) 100%)'
          }}
          aria-hidden="true"
        />

        <FloatingParticles count={80} />

        {/* Red glow */}
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: 'radial-gradient(ellipse at center, #da003240 0%, transparent 70%)' }}
          aria-hidden="true"
        />

        {/* Content sits on top */}
        <div className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-changa text-sm uppercase tracking-[0.4em] text-blaze-text mb-6"
          >
            2026–2027 Season
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8"
          >
            <Picture
              src="/images/like-no-other.png"
              alt="Like No Other"
              priority
              className="w-full h-full max-w-lg mx-auto"
              quality={75}
            />
          </motion.div>

          <div className="flex flex-col items-center gap-1 mb-8">
            {['Like No Other Orchestra.', 'Like No Other Experience.', 'Like No Other Audience.'].map((line, i) => (
              <motion.h2
                key={line}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                className="font-changa text-sm 430:text-base uppercase tracking-[0.15em]"
                style={{
                  background: 'linear-gradient(90deg, #b8860b 0%, #ffd700 30%, #fffacd 50%, #ffd700 70%, #b8860b 100%)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: `shine ${2 + i * 0.3}s linear infinite`
                }}
              >
                {line}
              </motion.h2>
            ))}
          </div>

          <style>{`@keyframes shine { 0% { background-position: 200% center; } 100% { background-position: -200% center; } }`}</style>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="font-lato text-sm text-white/80 max-w-lg mx-auto leading-relaxed"
          >
            Join us for Robyn Bell&apos;s 15th season as our conductor, and a lineup of entertaining shows. We&apos;re
            glad you&apos;re here, and we&apos;re glad you&apos;ll hear what The Pops has in store for you.
          </motion.p>
        </div>
      </div>

      {/* ── Concert grid ── */}
      <div className="relative ">
        <FloatingParticles count={80} />
        <div className="px-4 990:px-8 pb-20 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-6 h-px bg-blaze" aria-hidden="true" />
            <h3 className="font-changa text-sm uppercase tracking-[0.3em] text-blaze-text">
              This Season&apos;s Lineup
            </h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 760:grid-cols-3 gap-px bg-white/10"
          >
            {CONCERTS.map((concert, i) => (
              <div key={concert.name} className="relative overflow-hidden bg-black group aspect-3/4">
                <Picture
                  src={concert.image}
                  alt={concert.name}
                  fill
                  priority={i === 0}
                  quality={50}
                  className="object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                  sizes="(max-width: 760px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="font-changa text-blaze-text text-sm uppercase tracking-[0.2em] mb-1">{concert.date}</p>
                  <h4 className="font-changa text-white text-lg leading-tight">{concert.name}</h4>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Tickets on sale ── */}
      <div className="border-t border-white/10 px-4 990:px-8 py-16 990:py-24 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="font-changa text-[14px] uppercase tracking-[0.35em] text-blaze-text mb-3">Mark Your Calendar</p>
          <div className="flex items-center gap-4 justify-center mb-4">
            <div className="w-8 430:w-12 h-px bg-blaze shrink-0" aria-hidden="true" />
            <h3 className="text-3xl 430:text-4xl font-changa text-white leading-none">Tickets Go On Sale</h3>
            <div className="w-8 430:w-12 h-px bg-blaze shrink-0" aria-hidden="true" />
          </div>
        </motion.div>

        <div className="flex flex-col divide-y divide-white/10 max-w-2xl mx-auto">
          {ON_SALE_DATES.map(({ date, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-between gap-6 py-6 group"
            >
              <div className="flex items-center gap-6 min-w-0">
                <span className="font-changa text-blaze-text text-sm uppercase tracking-[0.2em] shrink-0 w-24">
                  {date}
                </span>
                <div className="w-px h-5 bg-white/10 shrink-0" aria-hidden="true" />
                <h4 className="font-changa text-2xl 430:text-3xl text-white leading-none">{label}</h4>
              </div>
              <div className="w-6 h-px bg-white/10 group-hover:w-12 group-hover:bg-blaze transition-all duration-300 shrink-0" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
