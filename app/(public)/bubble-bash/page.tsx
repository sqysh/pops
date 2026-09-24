'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Picture from '@/components/common/Picture'

const PopsLogo = () => (
  <div className="absolute top-4 left-4">
    <Link href="/" className="cursor-pointer relative z-10">
      <div className="bg-golden50Logo bg-no-repeat bg-contain bg-center w-12 h-12 sm:w-20 sm:h-20" />
    </Link>
  </div>
)

const BubbleBash = () => {
  return (
    <main id="bubble-bash" className="min-h-screen bg-[#040608] text-white">
      <PopsLogo />
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

        <Picture
          src="/images/bubbles-logo.png"
          alt="The Pops Orchestra Golden Bubbles Bash"
          priority
          className="relative object-contain object-center h-full w-full max-w-2xl 2xl:max-w-4xl z-10"
        />

        {/* sr-only heading for screen readers */}
        <h1 id="hero-heading" className="sr-only">
          The Pops Orchestra Golden Bubbles Bash
        </h1>

        {/* Scroll Indicator */}
        <motion.button
          type="button"
          aria-label="Scroll down to content"
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
            Scroll Down
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
              <h2
                id="gala-details-heading"
                className="text-5xl md:text-6xl font-bold mb-3 font-changa"
                style={{
                  background:
                    'linear-gradient(135deg, #d4af37 0%, #f4d03f 25%, #d4af37 50%, #c9a961 75%, #d4af37 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 2px 8px rgba(212, 175, 55, 0.4))'
                }}
              >
                Golden Bubbles Bash
              </h2>
              <p className="text-2xl text-gray-300 tracking-wide">Celebrating 50 Years</p>
            </motion.div>

            {/* Event Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12 space-y-4 text-gray-300 leading-relaxed text-base md:text-lg"
            >
              <p>
                Join us for an evening of elegance and celebration as we honor five decades of music, memories, and
                community. Guests will be greeted by the Pops Orchestra String Quartet and enjoy a lively performance by
                the Pops Jazz Combo, accompanied by hors d&apos;oeuvres, birthday cake, and a champagne toast.
              </p>
              <p>
                Throughout the evening, we will highlight memorable moments from the Pops&apos; history and hear
                reflections from Conductor Robyn Bell on the orchestra&apos;s bright future. Whether you have been part
                of the Pops family for years or are joining us for the first time, this milestone gala promises an
                unforgettable celebration of music, camaraderie, and inspiration.
              </p>
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
                  <time dateTime="2026-04-11">Saturday, April 11, 2026</time>
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
                  <time dateTime="2026-04-11T16:30/2026-04-11T19:30">4:30 – 7:30 p.m.</time>
                </p>
                <p
                  className="text-xl font-bold text-white mb-1"
                  style={{ textShadow: '0 2px 10px rgba(255, 255, 255, 0.1)' }}
                >
                  The Venue
                </p>
                <p className="text-gray-400">
                  <a
                    href="https://maps.google.com/?q=3650+17th+Street+Sarasota+FL+34235"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="3650 17th Street, Sarasota, FL 34235 — open in Google Maps (opens in new tab)"
                    className="hover:text-yellow-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm underline underline-offset-2"
                  >
                    3650 17th Street, Sarasota, FL 34235
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2
                id="tickets-heading"
                className="text-4xl md:text-5xl font-bold mb-6 font-changa"
                style={{
                  background:
                    'linear-gradient(135deg, #d4af37 0%, #f4d03f 25%, #d4af37 50%, #c9a961 75%, #d4af37 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 2px 8px rgba(212, 175, 55, 0.4))'
                }}
              >
                This Year&apos;s Bubble Bash Is Sold Out!
              </h2>
              <div
                aria-hidden="true"
                className="w-24 h-1 mx-auto rounded-full mb-8"
                style={{
                  background: 'linear-gradient(to right, #d4af37, #f4d03f, #d4af37)',
                  boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)'
                }}
              />
              <div className="max-w-2xl mx-auto space-y-4 text-gray-300 leading-relaxed text-base md:text-lg">
                <p>
                  Registration is closed. We look forward to seeing our guests at the event on April 11, 2026 at 4:30
                  p.m.
                </p>
                <p>
                  If you are still interested in purchasing chance drawing tickets for entry to win an exclusive{' '}
                  <strong className="text-white">&ldquo;Dinner for Six&rdquo;</strong> prepared by Chef/Conductor Robyn
                  Bell in your home or community, featuring a private performance by the Pops String Quartet, you may do
                  so here:
                </p>
                <p>
                  <a
                    href="https://ci.ovationtix.com/35505/store/donations/58324"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Purchase chance drawing tickets — opens in new tab"
                    className="inline-block mt-2 mb-2 px-8 py-4 rounded-2xl font-semibold tracking-wide text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(212, 175, 55, 0.9), rgba(244, 208, 63, 0.95), rgba(201, 169, 97, 0.9))',
                      boxShadow:
                        '0 4px 20px rgba(212, 175, 55, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    Purchase Chance Drawing Tickets
                  </a>
                </p>
                <p className="text-white/70">
                  Tickets are <strong className="text-white">$25 each</strong> or{' '}
                  <strong className="text-white">5 for $100</strong>. The chance drawing will take place at the Golden
                  Bubbles Bash, Saturday, April 11, 2026. You do not have to be present to win.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* FOOTER */}
        <footer className="mt-20 text-center text-gray-500 text-sm border-t border-inkblack pt-6">
          © {new Date().getFullYear()} The Pops Orchestra of Bradenton and Sarasota. All rights reserved.
        </footer>
      </div>
    </main>
  )
}

export default BubbleBash
