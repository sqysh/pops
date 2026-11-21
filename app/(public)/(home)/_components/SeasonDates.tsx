'use client'

import { motion, useMotionValue, useTransform } from 'framer-motion'
import Picture from '@/components/common/Picture'
import { useEffect } from 'react'
import { FloatingParticles } from '@/components/layout/FloatingParticles'
import Link from 'next/link'
import { pageCopy } from '@/app/lib/page-content/copy'
import { pageContent } from '@/app/lib/constants/page-content/home'

// Wording for each concert and on-sale row lives in the page content
// (season_concert_<n>_name/_date, season_onsale_<n>_date/_label).
const CONCERT_IMAGES = [
  '/images/season-4.jpg',
  '/images/season-2.jpg',
  '/images/season-6.jpg',
  '/images/season-3.jpg',
  '/images/season-1.jpg',
  '/images/season-5.jpg'
]

const ON_SALE_LINKS: (string | undefined)[] = [undefined, '/subscriptions', undefined]

export function SeasonDates({ concertsPageLive, content }: { concertsPageLive?: boolean; content?: unknown }) {
  const { t, list } = pageCopy(content, pageContent)

  const concerts = CONCERT_IMAGES.map((image, i) => ({
    name: t(`season_concert_${i + 1}_name`),
    date: t(`season_concert_${i + 1}_date`),
    image
  }))

  const onSaleDates = ON_SALE_LINKS.map((linkKey, i) => ({
    date: t(`season_onsale_${i + 1}_date`),
    label: t(`season_onsale_${i + 1}_label`),
    linkKey
  }))

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
            {t('season_eyebrow')}
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
              alt={t('season_title_image_alt')}
              priority
              className="w-full h-full max-w-lg mx-auto"
              quality={75}
            />
          </motion.div>

          <div className="flex flex-col items-center gap-1 mb-8">
            {list('season_taglines').map((line, i) => (
              <motion.h2
                key={i}
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
            {t('season_intro')}
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
            <h3 className="font-changa text-sm uppercase tracking-[0.3em] text-blaze-text">{t('season_lineup_heading')}</h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 760:grid-cols-3 gap-px bg-white/10"
          >
            {concerts.map((concert, i) => {
              const card = (
                <>
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
                </>
              )

              return concertsPageLive ? (
                <Link
                  key={i}
                  href={`/concerts?ref=${concert.name}`}
                  aria-label={t('season_concert_link_label', { name: concert.name })}
                  className="relative overflow-hidden bg-black group aspect-3/4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
                >
                  {card}
                </Link>
              ) : (
                <div key={i} className="relative overflow-hidden bg-black group aspect-3/4">
                  {card}
                </div>
              )
            })}
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
          <p className="font-changa text-[14px] uppercase tracking-[0.35em] text-blaze-text mb-3">{t('season_onsale_eyebrow')}</p>
          <div className="flex items-center gap-4 justify-center mb-4">
            <div className="w-8 430:w-12 h-px bg-blaze shrink-0" aria-hidden="true" />
            <h3 className="text-3xl 430:text-4xl font-changa text-white leading-none">{t('season_onsale_heading')}</h3>
            <div className="w-8 430:w-12 h-px bg-blaze shrink-0" aria-hidden="true" />
          </div>
        </motion.div>
        <div className="flex flex-col divide-y divide-white/10 max-w-2xl mx-auto">
          {onSaleDates.map(({ date, label, linkKey }, i) => {
            const inner = (
              <>
                <div className="flex items-center gap-6 min-w-0">
                  <span className="font-changa text-blaze-text text-sm uppercase tracking-[0.2em] shrink-0 w-24">{date}</span>
                  <div className="w-px h-5 bg-white/10 shrink-0" aria-hidden="true" />
                  <h4 className="font-changa text-2xl 430:text-3xl text-white leading-none">{label}</h4>
                </div>
                <div className="w-6 h-px bg-white/10 group-hover:w-12 group-hover:bg-blaze transition-all duration-300 shrink-0" />
              </>
            )

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {linkKey ? (
                  <Link
                    href={linkKey}
                    className="flex items-center justify-between gap-6 py-6 group cursor-pointer hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
                  >
                    {inner}
                  </Link>
                ) : (
                  <div className="flex items-center justify-between gap-6 py-6 group">{inner}</div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
