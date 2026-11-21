'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { LayoutDashboard } from 'lucide-react'
import Picture from '@/components/common/Picture'
import { pageCopy } from '@/app/lib/page-content/copy'
import { publicUrlProblem } from '@/app/lib/page-content/url'
import { pageContent } from '@/app/lib/constants/page-content/bubbles-bash'

const GOLD_TEXT = {
  background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 25%, #d4af37 50%, #c9a961 75%, #d4af37 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  filter: 'drop-shadow(0 2px 8px rgba(212, 175, 55, 0.4))'
} as const

const STAFF_ROLES = ['ADMIN', 'CONDUCTOR', 'SUPER_USER']

const BubbleBash = ({ content }: { content: unknown }) => {
  const { data: session } = useSession()
  const isStaff = !!session?.user?.role && STAFF_ROLES.includes(session.user.role)

  const { t, list } = pageCopy(content, pageContent)

  const title = t('bash_title')
  const date = t('bash_date')
  const time = t('bash_time')
  const venueName = t('bash_venue_name')
  const address = t('bash_venue_address')
  const description = list('bash_description')
  // only a real public link gets a button; blank, malformed or admin-only links show none
  const ticketUrl = publicUrlProblem(t('bash_ticket_url')) ? '' : t('bash_ticket_url')

  const prices = [
    { key: 'single', label: t('bash_single_label'), price: t('bash_single_price'), note: '' },
    { key: 'table', label: t('bash_table_label'), price: t('bash_table_price'), note: t('bash_table_note') }
  ]

  return (
    <main id="bubbles-bash" className="min-h-screen bg-[#040608] text-white">
      <Link
        href="/"
        aria-label={t('bash_sr_home_link')}
        className="absolute top-4 left-4 z-30 inline-block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      >
        <Picture src="/images/logo-2.png" alt={t('bash_logo_alt')} className="w-32 sm:w-44 h-auto" priority />
      </Link>
      {isStaff && (
        <Link
          href="/admin/dashboard"
          className="absolute top-4 right-4 z-30 inline-flex items-center gap-2 rounded-md border border-[#d4af37]/60 bg-black/60 px-4 py-2 text-sm font-medium text-[#f4d03f] backdrop-blur-sm transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          <LayoutDashboard className="h-4 w-4 shrink-0" aria-hidden="true" />
          {t('bash_staff_dashboard')}
        </Link>
      )}
      {/* HERO SECTION */}
      <section
        aria-labelledby="hero-heading"
        className="relative h-screen w-full overflow-hidden flex items-center justify-center"
      >
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          className="fixed inset-0 object-cover object-center h-full w-full"
        >
          <source src="/videos/bubbles.mp4" type="video/mp4" />
        </video>

        {/* Black Overlay */}
        <div className="fixed inset-0 bg-black/60" aria-hidden="true" />

        <div className="relative z-10 px-6 text-center" aria-hidden="true">
          <p className="font-changa text-6xl sm:text-8xl 2xl:text-9xl font-bold mb-4" style={GOLD_TEXT}>
            {title}
          </p>
          <p className="text-xl sm:text-3xl tracking-[0.2em] uppercase text-[#d4af37]">{date}</p>
        </div>

        {/* sr-only heading for screen readers */}
        <h1 id="hero-heading" className="sr-only">
          {t('bash_sr_heading', { title })}
        </h1>

        {/* Scroll Indicator */}
        <motion.button
          type="button"
          aria-label={t('bash_sr_scroll_button')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 cursor-pointer z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-md"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-sm tracking-widest uppercase hidden sm:block"
            aria-hidden="true"
            style={{
              color: '#d4af37',
              textShadow: '0 0 10px rgba(212, 175, 55, 0.5)',
              fontWeight: 600
            }}
          >
            {t('bash_scroll_label')}
          </motion.p>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
            aria-hidden="true"
          >
            <div
              className="w-7 h-11 border-2 rounded-full flex justify-center pt-2"
              style={{ borderColor: '#d4af37', boxShadow: '0 0 15px rgba(212, 175, 55, 0.4)' }}
            >
              <motion.div
                animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1 h-3 rounded-full"
                style={{
                  background: 'linear-gradient(to bottom, #f4d03f, #d4af37)',
                  boxShadow: '0 0 8px rgba(212, 175, 55, 0.6)'
                }}
              />
            </div>
          </motion.div>
        </motion.button>
      </section>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <section aria-labelledby="gala-details-heading" className="relative py-24 overflow-hidden">
          {/* Animated bubbles + music notes — all decorative */}
          <div className="absolute inset-0" aria-hidden="true">
            <motion.div
              animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-10 left-[15%] w-24 h-24 rounded-full"
              style={{
                background:
                  'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(255, 252, 240, 0.4), rgba(255, 255, 255, 0.1))',
                boxShadow:
                  '0 0 30px rgba(255, 255, 255, 0.3), inset -8px -8px 16px rgba(255, 255, 255, 0.6), inset 8px 8px 16px rgba(255, 252, 240, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            />
            <motion.div
              animate={{ y: [0, 15, 0], x: [0, -15, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-32 right-[12%] w-32 h-32 rounded-full"
              style={{
                background:
                  'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.85), rgba(255, 252, 240, 0.5), rgba(255, 255, 255, 0.1))',
                boxShadow:
                  '0 0 40px rgba(255, 255, 255, 0.4), inset -10px -10px 20px rgba(255, 255, 255, 0.7), inset 10px 10px 20px rgba(255, 252, 240, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.4)'
              }}
            />
            <motion.div
              animate={{ y: [0, -25, 0], x: [0, 20, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-20 left-[10%] w-28 h-28 rounded-full"
              style={{
                background:
                  'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(255, 250, 230, 0.4), rgba(255, 255, 255, 0.1))',
                boxShadow:
                  '0 0 35px rgba(255, 255, 255, 0.35), inset -9px -9px 18px rgba(255, 255, 255, 0.65), inset 9px 9px 18px rgba(255, 250, 230, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.35)'
              }}
            />
            <motion.div
              animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-40 right-[20%] w-20 h-20 rounded-full"
              style={{
                background:
                  'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.75), rgba(255, 252, 240, 0.4), rgba(255, 255, 255, 0.1))',
                boxShadow:
                  '0 0 25px rgba(255, 255, 255, 0.3), inset -7px -7px 14px rgba(255, 255, 255, 0.6), inset 7px 7px 14px rgba(255, 252, 240, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            />
            <motion.div
              animate={{ y: [0, -15, 0], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-[25%] left-[25%] w-12 h-12 rounded-full"
              style={{
                background:
                  'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(255, 252, 240, 0.5), rgba(255, 255, 255, 0.15))',
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.4), inset -5px -5px 10px rgba(255, 255, 255, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.4)'
              }}
            />
            <motion.div
              animate={{ y: [0, 10, 0], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-[60%] right-[30%] w-10 h-10 rounded-full"
              style={{
                background:
                  'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.85), rgba(255, 252, 240, 0.45), rgba(255, 255, 255, 0.1))',
                boxShadow: '0 0 18px rgba(255, 255, 255, 0.35), inset -4px -4px 8px rgba(255, 255, 255, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.35)'
              }}
            />
            <motion.div
              animate={{ y: [0, -12, 0], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-[30%] left-[35%] w-14 h-14 rounded-full"
              style={{
                background:
                  'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(255, 250, 230, 0.5), rgba(255, 255, 255, 0.15))',
                boxShadow: '0 0 22px rgba(255, 255, 255, 0.4), inset -6px -6px 12px rgba(255, 255, 255, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.4)'
              }}
            />
            <div
              className="absolute top-[15%] right-[40%] w-6 h-6 rounded-full"
              style={{
                background:
                  'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.95), rgba(255, 252, 240, 0.6), rgba(255, 255, 255, 0.2))',
                boxShadow: '0 0 12px rgba(255, 255, 255, 0.5), inset -3px -3px 6px rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.5)'
              }}
            />
            <div
              className="absolute top-[45%] left-[20%] w-5 h-5 rounded-full"
              style={{
                background:
                  'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(255, 252, 240, 0.55), rgba(255, 255, 255, 0.15))',
                boxShadow: '0 0 10px rgba(255, 255, 255, 0.45), inset -2px -2px 5px rgba(255, 255, 255, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.45)'
              }}
            />
            <div
              className="absolute bottom-[25%] right-[15%] w-8 h-8 rounded-full"
              style={{
                background:
                  'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(255, 250, 230, 0.5), rgba(255, 255, 255, 0.15))',
                boxShadow: '0 0 15px rgba(255, 255, 255, 0.45), inset -4px -4px 8px rgba(255, 255, 255, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.45)'
              }}
            />
            <motion.div
              animate={{ rotate: [0, 10, 0], y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-[20%] right-[25%] text-4xl opacity-40"
              style={{ color: '#d4af37', filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.5))' }}
            >
              ♪
            </motion.div>
            <motion.div
              animate={{ rotate: [0, -15, 0], y: [0, 15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-[35%] left-[18%] text-3xl opacity-30"
              style={{ color: '#d4af37', filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.5))' }}
            >
              ♫
            </motion.div>
            <motion.div
              animate={{ rotate: [0, 12, 0], y: [0, -8, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-[15%] right-[35%] text-2xl opacity-35"
              style={{ color: '#d4af37', filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.5))' }}
            >
              ♪
            </motion.div>
          </div>

          <div className="relative max-w-4xl mx-auto px-6 text-center">
            {/* Top flourish */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
              aria-hidden="true"
            >
              <div
                className="w-32 h-0.5 mx-auto mb-4"
                style={{
                  background: 'linear-gradient(to right, transparent, #d4af37, transparent)',
                  boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)'
                }}
              />
              <svg
                className="w-12 h-12 mx-auto"
                fill="#d4af37"
                viewBox="0 0 24 24"
                style={{ filter: 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.6))' }}
              >
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </motion.div>

            {/* Main Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h2 id="gala-details-heading" className="text-5xl md:text-6xl font-bold mb-3 font-changa" style={GOLD_TEXT}>
                {title}
              </h2>
            </motion.div>

            {/* Event Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12 space-y-4 text-gray-300 leading-relaxed text-base md:text-lg"
            >
              {description.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </motion.div>

            <div
              aria-hidden="true"
              className="w-32 h-0.5 mx-auto mb-8"
              style={{
                background: 'linear-gradient(to right, transparent, #d4af37, transparent)',
                boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)'
              }}
            />

            {/* Date, Time, Location */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-12"
            >
              <address className="not-italic space-y-2">
                <p
                  className="text-3xl md:text-4xl font-bold text-white mb-2"
                  style={{ textShadow: '0 2px 10px rgba(255, 255, 255, 0.1)' }}
                >
                  {date}
                </p>
                <p
                  className="text-2xl md:text-3xl font-semibold mb-4"
                  style={{
                    background: 'linear-gradient(135deg, #d4af37, #f4d03f, #d4af37)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.4))'
                  }}
                >
                  {time}
                </p>
                <p className="text-xl font-bold text-white mb-1" style={{ textShadow: '0 2px 10px rgba(255, 255, 255, 0.1)' }}>
                  {venueName}
                </p>
                <p className="text-gray-400">
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t('bash_sr_map_link', { address })}
                    className="hover:text-yellow-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm underline underline-offset-2"
                  >
                    {address}
                  </a>
                </p>
              </address>
            </motion.div>

            {/* Bottom flourish */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mt-8"
              aria-hidden="true"
            >
              <svg
                className="w-12 h-12 mx-auto"
                fill="#d4af37"
                viewBox="0 0 24 24"
                style={{ filter: 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.6))' }}
              >
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              <div
                className="w-32 h-0.5 mx-auto mt-4"
                style={{
                  background: 'linear-gradient(to right, transparent, #d4af37, transparent)',
                  boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)'
                }}
              />
            </motion.div>
          </div>
        </section>

        <motion.section
          aria-labelledby="tickets-heading"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mt-32 relative"
        >
          {/* Background bubbles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <motion.div
              animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-10 left-[8%] w-20 h-20 rounded-full opacity-30"
              style={{
                background: 'radial-gradient(circle at 30% 30%, rgba(255, 215, 0, 0.4), rgba(135, 206, 250, 0.3))',
                boxShadow: '0 0 30px rgba(255, 215, 0, 0.3)'
              }}
            />
            <motion.div
              animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
              transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-20 right-[10%] w-24 h-24 rounded-full opacity-25"
              style={{
                background: 'radial-gradient(circle at 30% 30%, rgba(186, 85, 211, 0.4), rgba(255, 182, 193, 0.3))',
                boxShadow: '0 0 35px rgba(186, 85, 211, 0.3)'
              }}
            />
          </div>

          <div className="text-center mb-16 relative">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h2 id="tickets-heading" className="text-4xl md:text-5xl font-bold mb-6 font-changa" style={GOLD_TEXT}>
                {t('bash_tickets_heading')}
              </h2>
              <div
                aria-hidden="true"
                className="w-24 h-1 mx-auto rounded-full mb-10"
                style={{
                  background: 'linear-gradient(to right, #d4af37, #f4d03f, #d4af37)',
                  boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)'
                }}
              />

              <ul className="max-w-2xl mx-auto grid gap-6 sm:grid-cols-2 mb-8">
                {prices.map((tier) => (
                  <li
                    key={tier.key}
                    className="rounded-2xl border border-[#d4af37]/40 bg-white/5 px-6 py-8"
                    style={{ boxShadow: '0 0 25px rgba(212, 175, 55, 0.15)' }}
                  >
                    <p className="text-gray-300 italic text-lg mb-2">{tier.label}</p>
                    <p className="text-4xl font-bold text-white">{tier.price}</p>
                    {tier.note && <p className="mt-3 text-sm text-gray-400 leading-relaxed">{tier.note}</p>}
                  </li>
                ))}
              </ul>

              <p className="text-[#d4af37] font-semibold mb-8">{t('bash_valet')}</p>

              {ticketUrl && (
                <a
                  href={ticketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-4 rounded-2xl font-semibold tracking-wide text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(212, 175, 55, 0.9), rgba(244, 208, 63, 0.95), rgba(201, 169, 97, 0.9))',
                    boxShadow:
                      '0 4px 20px rgba(212, 175, 55, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 rgba(0, 0, 0, 0.2)'
                  }}
                >
                  {t('bash_ticket_button')}
                  <span className="sr-only"> {t('bash_sr_new_tab')}</span>
                </a>
              )}

              <p className="mt-12 font-changa text-2xl text-[#d4af37]">{t('bash_closing')}</p>
            </motion.div>
          </div>
        </motion.section>

        {/* FOOTER */}
        <footer className="mt-20 text-center text-gray-500 text-sm border-t border-inkblack pt-6">
          {t('bash_footer_copyright', { year: new Date().getFullYear() })}
        </footer>
      </div>
    </main>
  )
}

export default BubbleBash
