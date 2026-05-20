'use client'

import { motion } from 'framer-motion'
import Picture from '@/app/components/common/Picture'

export const SponsorsBlock = ({ pageData, sponsors }) => {
  if (!pageData || !Array.isArray(pageData)) return null

  const parseAmount = (amount) => {
    if (!amount || amount === '') return 0
    return parseInt(amount.toString().replace(/[$,]/g, '')) || 0
  }

  const sortedSponsors = sponsors ? [...sponsors].sort((a, b) => parseAmount(b.amount) - parseAmount(a.amount)) : []

  const doubled = [...sortedSponsors, ...sortedSponsors]

  const sponsorData = pageData?.filter((p) => p?.id?.includes('sponsors'))
  const sponsorsData = sponsorData.reduce((acc, field) => {
    const key = field.id.replace('sponsors_', '')
    acc[key] = field.value
    return acc
  }, {})

  return (
    <section aria-labelledby="sponsors-heading" className="relative py-20 990:py-32 bg-black overflow-hidden">
      <div
        className="absolute inset-0 bg-no-repeat bg-center bg-cover opacity-5"
        style={{ backgroundImage: `url('/images/bio-bg.webp')`, backgroundAttachment: 'fixed' }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-linear-to-b from-black via-transparent to-black" aria-hidden="true" />

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center mb-14 px-4"
        >
          <p className="font-changa text-sm uppercase tracking-[0.3em] text-blaze-text mb-4">Our Partners</p>
          <div className="flex items-center gap-3 430:gap-4 justify-center mb-4">
            <div className="w-8 430:w-16 h-px bg-blaze shrink-0" aria-hidden="true" />
            <h2
              id="sponsors-heading"
              className="font-changa text-3xl 430:text-4xl 990:text-5xl text-white leading-none"
            >
              {sponsorsData?.heading}
            </h2>
            <div className="w-8 430:w-16 h-px bg-blaze shrink-0" aria-hidden="true" />
          </div>
          <div className="w-16 h-px bg-blaze mx-auto mt-2 mb-6" aria-hidden="true" />
          <p className="font-lato text-white/80 text-sm 430:text-base max-w-xl leading-relaxed">
            {sponsorsData?.subheading}
          </p>
        </motion.div>

        {/* Ticker */}
        <div className="relative">
          {/* Edge fades */}
          <div
            className="absolute left-0 top-0 bottom-0 w-16 430:w-24 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, black, transparent)' }}
            aria-hidden="true"
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-16 430:w-24 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to left, black, transparent)' }}
            aria-hidden="true"
          />

          <div className="overflow-hidden" aria-hidden="true">
            <motion.div
              className="flex gap-4 items-center"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
              style={{ width: 'max-content' }}
            >
              {doubled.map((sponsor, i) => (
                <a
                  href={sponsor.externalLink}
                  target="_blank"
                  key={`${sponsor.id}-${i}`}
                  className="shrink-0 w-28 h-16 bg-white/95 border border-white/10 flex items-center justify-center p-3"
                >
                  <Picture
                    src={sponsor.filePath}
                    alt=""
                    width={112}
                    height={64}
                    className="w-full h-full object-contain"
                    sizes="112px"
                  />
                </a>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Screen reader list */}
        <ul className="sr-only" aria-label="All sponsors">
          {sortedSponsors.map((sponsor) => (
            <li key={sponsor.id}>
              {sponsor.externalLink ? (
                <a href={sponsor.externalLink} target="_blank" rel="noopener noreferrer">
                  {sponsor.name}
                </a>
              ) : (
                <span>{sponsor.name}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default SponsorsBlock
