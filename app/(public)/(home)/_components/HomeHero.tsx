import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'
import { sectionVariants } from '@/app/lib/constants/motion'
import { useSession } from 'next-auth/react'
import Picture from '@/components/common/Picture'

export function HomeHero({ pageData }) {
  const shouldReduceMotion = useReducedMotion()
  const { data: session } = useSession()
  const isAdmin = session?.user?.role && ['ADMIN', 'CONDUCTOR', 'SUPER_USER'].includes(session.user.role)

  if (!pageData || !Array.isArray(pageData)) {
    return null
  }

  const heroData = pageData?.filter((page) => page?.id?.includes('hero'))

  const hero = heroData.reduce((acc, field) => {
    const key = field.id.replace('hero_', '')
    acc[key] = field.value
    return acc
  }, {})

  const heading = hero?.heading || ''

  return (
    <motion.section
      role="banner"
      aria-label="Hero: The Pops Orchestra of Sarasota and Bradenton"
      initial={sectionVariants(shouldReduceMotion).initial}
      animate={sectionVariants(shouldReduceMotion).animate}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.35, ease: 'easeIn' }}
      className={`relative w-full min-h-200 h-dvh max-h-1000 overflow-hidden ${
        isAdmin ? '-mt-16 sm:-mt-[79.5px]' : '-mt-23.5 sm:-mt-28'
      }`}
    >
      {/* Background video */}
      {shouldReduceMotion ? (
        // Reduced-motion: show the poster still instead of a moving video
        <div
          className="absolute inset-0 w-full h-full bg-center bg-cover"
          style={{ backgroundImage: "url('/videos/hero-poster.jpg')" }}
          aria-hidden="true"
        />
      ) : (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/videos/hero-poster.jpg"
          aria-hidden="true"
        >
          <source src="/videos/hero.webm" type="video/webm" />
          <source src="/videos/hero-web.mp4" type="video/mp4" />
        </video>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 z-40 flex flex-col justify-end pb-16 430:pb-20 990:pb-28 px-4 990:px-12 xl:px-4">
        {/* Gradient behind text */}
        <div className="absolute inset-0" aria-hidden="true">
          {/* Main bottom gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/10 to-transparent" />
          {/* Left side gradient that bends it up */}
          <div className="absolute inset-0 bg-linear-to-r from-black/40 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-130 760:max-w-xl 990:max-w-200 1200:max-w-screen-1160 1590:max-w-7xl mx-auto w-full">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.1 }}
            className="mb-2"
          >
            <Link
              href="/"
              aria-label="The Pops Orchestra of Sarasota and Bradenton — return to homepage"
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm inline-block"
            >
              <Picture
                src="/images/logo-2.png"
                alt="The Pops Orchestra of Sarasota and Bradenton"
                className="w-54 h-auto"
                priority
              />
            </Link>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.2 }}
            className="font-changa text-white leading-none drop-shadow-2xl mb-0"
            style={{ fontSize: 'clamp(2.75rem, 6vw, 5.5rem)' }}
          >
            {heading}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.7, delay: 0.35 }}
            className="font-changa leading-none mb-4"
            style={{ fontSize: 'clamp(1rem, 2.2vw, 1.75rem)' }}
          >
            <span className="sr-only">{heading}</span>
            <span aria-hidden="true" className="text-blaze-text uppercase tracking-[0.3em]">
              {hero.subheading}
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5, delay: 0.55 }}
            className="w-16 h-px bg-blaze mb-4 430:mb-6 origin-left"
            aria-hidden="true"
          />

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.75 }}
            className="flex flex-wrap items-center gap-3 430:gap-4"
          >
            <motion.div
              whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
              className="inline-block"
            >
              <Link
                href="/concerts"
                aria-label="See concerts"
                className="group inline-flex items-center gap-2 bg-blaze hover:bg-blazehover text-white font-changa uppercase tracking-widest transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black cursor-pointer"
                style={{
                  fontSize: 'clamp(0.65rem, 1.5vw, 0.875rem)',
                  padding: 'clamp(0.625rem, 1.5vw, 1rem) clamp(1.25rem, 3vw, 2rem)'
                }}
              >
                <span>{hero.btnText}</span>
                <ArrowRightIcon className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Link>
            </motion.div>

            <motion.div
              whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
              className="inline-block"
            >
              <Link
                href="/subscriptions"
                aria-label="See season subscription options"
                className="group inline-flex items-center gap-2 bg-blaze hover:bg-blazehover text-white font-changa uppercase tracking-widest transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black cursor-pointer"
                style={{
                  fontSize: 'clamp(0.65rem, 1.5vw, 0.875rem)',
                  padding: 'clamp(0.625rem, 1.5vw, 1rem) clamp(1.25rem, 3vw, 2rem)'
                }}
              >
                <span>See Season Subscription Options</span>
                <ArrowRightIcon className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={shouldReduceMotion ? { duration: 0 } : { delay: 1.2, duration: 0.6 }}
          className="absolute bottom-6 430:bottom-8 right-4 430:right-8 z-10 flex flex-col items-center gap-2"
          aria-hidden="true"
        >
          <span className="font-lato text-[16px] uppercase tracking-widest text-white/50">Scroll</span>
          <motion.div
            animate={shouldReduceMotion ? {} : { y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-8 bg-linear-to-b from-blaze to-transparent"
          />
        </motion.div>
      </div>
    </motion.section>
  )
}
