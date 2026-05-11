'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react'
import type { PhotoGalleryImage } from '@prisma/client'
import { useState } from 'react'
import HomeHero from '../home/HomeHero'

// ─── Types ────────────────────────────────────────────────────────────────────

interface HomeClientProps {
  galleryImages: PhotoGalleryImage[]
  pageData: any
  ref: any
}

interface StubEvent {
  id: string
  title: string
  date: string
  location: string
  description: string
}

interface StubNews {
  id: string
  title: string
  date: string
  excerpt: string
  href: string
}

const STUB_EVENTS: StubEvent[] = [
  {
    id: '1',
    title: 'Open Rehearsal Night',
    date: 'October 10, 2026',
    location: 'Riverview Performing Arts Center',
    description: 'Get a behind-the-scenes look at how The Pops prepares for the season.'
  },
  {
    id: '2',
    title: 'Annual Gala Dinner',
    date: 'November 1, 2026',
    location: 'Sarasota Opera House',
    description: 'An elegant evening of dinner, dancing, and music to support The Pops.'
  },
  {
    id: '3',
    title: 'Community Concert in the Park',
    date: 'December 6, 2026',
    location: 'Payne Park, Sarasota',
    description: 'A free outdoor concert for the whole community. Bring a blanket and enjoy the music.'
  },
  {
    id: '4',
    title: 'Conductor Masterclass',
    date: 'January 14, 2027',
    location: 'Neel Performing Arts Center',
    description: 'An intimate evening with conductor Robyn Bell exploring the art of orchestral direction.'
  }
]

const STUB_NEWS: StubNews[] = [
  {
    id: '1',
    title: 'The Pops Announces 51st Season: Like No Other',
    date: 'September 1, 2026',
    excerpt:
      'The Pops Orchestra of Bradenton and Sarasota is thrilled to announce its landmark 51st season, featuring six spectacular concerts and two add-on shows.',
    href: '/news/51st-season'
  },
  {
    id: '2',
    title: 'Conductor Robyn Bell Named Southeast Conductor of the Year',
    date: 'August 15, 2026',
    excerpt:
      'The Florida Orchestra Association has honored Pops conductor Robyn Bell with its prestigious annual award for excellence in performance.',
    href: '/news/robyn-bell-award'
  },
  {
    id: '3',
    title: 'Student Performer Applications Now Open',
    date: 'August 1, 2026',
    excerpt:
      'Young musicians in grades 6–12 are invited to apply to perform alongside The Pops Orchestra this season. Applications close September 15.',
    href: '/news/student-applications'
  }
]

// ─── Placeholder image ────────────────────────────────────────────────────────

function Placeholder({ className = '', label = '' }: { className?: string; label?: string }) {
  return (
    <div className={`bg-neutral-800 flex items-center justify-center ${className}`}>
      {label && <span className="text-neutral-600 text-xs font-mono uppercase tracking-widest">{label}</span>}
    </div>
  )
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

function Nav() {
  return (
    <nav
      className="absolute top-0 inset-x-0 z-50 flex items-center justify-between px-6 sm:px-12 lg:px-20 py-5 mix-blend-normal"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <Link
        href="/"
        className="font-quicksand font-black text-white text-xl tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark"
      >
        The Pops
      </Link>

      {/* Links */}
      <div className="hidden md:flex items-center gap-8">
        {[
          ['About', '/about'],
          ['Concerts', '/concerts'],
          ['Events', '#events'],
          ['News', '#news'],
          ['Contact', '/contact']
        ].map(([label, href]) => (
          <Link
            key={href}
            href={href}
            className="text-white/70 hover:text-white transition-colors text-sm font-mono tracking-[0.15em] uppercase focus-visible:outline-none"
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Phone */}

      <a
        href="tel:9419267677"
        className="hidden sm:flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-mono focus-visible:outline-none"
      >
        <Phone className="w-3.5 h-3.5" aria-hidden="true" />
        941-926-POPS
      </a>
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

// function Hero({ concerts }: { concerts: Concert[] | null }) {
//   const next = concerts
//     ?.filter((c) => c.status === 'LIVE')
//     ?.sort((a, b) => new Date(a.cardDate).getTime() - new Date(b.cardDate).getTime())[0]

//   return (
//     <section className="relative bg-sky-900 h-205 flex flex-col overflow-hidden" aria-label="Hero">

//       <div className="relative z-10 flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 pb-20 sm:pb-28">
//         <motion.div
//           initial={{ opacity: 0, y: 24 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3, duration: 0.8 }}
//           className="max-w-4xl"
//         >
//           {next && (
//             <p className="text-[11px] tracking-[0.35em] uppercase text-primary-dark mb-5">
//               Now Playing · {next.cardDate}
//             </p>
//           )}
//           <h1 className="font-c-infant font-black text-5xl sm:text-7xl text-white leading-none mb-6">
//             The premier pops orchestra on Florida&apos;s Cultural Coast!
//           </h1>
//           {next?.subtitle && (
//             <p className="text-white/50 text-lg sm:text-xl mb-10 max-w-xl leading-relaxed">{next.subtitle}</p>
//           )}
//           <div className="flex flex-wrap gap-4">
//             <Link
//               href={next ? `/concerts/${next.id}` : '/concerts'}
//               className="inline-flex items-center gap-3 px-8 py-4 bg-primary-dark hover:bg-secondary-light text-white font-mono text-sm tracking-[0.2em] uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 focus-visible:ring-offset-black"
//             >
//               <Ticket className="w-4 h-4" aria-hidden="true" />
//               Buy Tickets
//             </Link>
//             <Link
//               href="/concerts"
//               className="inline-flex items-center gap-3 px-8 py-4 border border-white/20 hover:border-white/60 text-white/70 hover:text-white font-mono text-sm tracking-[0.2em] uppercase transition-colors focus-visible:outline-none"
//             >
//               All Concerts
//               <ArrowRight className="w-4 h-4" aria-hidden="true" />
//             </Link>
//           </div>
//         </motion.div>
//       </div>

//       <motion.div
//         className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
//         animate={{ y: [0, 8, 0] }}
//         transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
//         aria-hidden="true"
//       >
//         <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/50">Scroll</span>
//         <ChevronDown className="w-4 h-4 text-white/50" />
//       </motion.div>
//     </section>
//   )
// }

// ─── About ────────────────────────────────────────────────────────────────────

function AboutSection() {
  return (
    <section className="bg-white dark:bg-bg-dark py-24 sm:py-36 px-6 sm:px-12 lg:px-20" aria-labelledby="about-heading">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Images — overlapping Saxxy style */}
          <div className="relative h-120 sm:h-140">
            <Placeholder className="absolute top-0 left-0 w-[65%] h-[72%] object-cover grayscale" label="Orchestra" />
            <Placeholder className="absolute bottom-0 right-0 w-[60%] h-[68%] object-cover" label="Performance" />
          </div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[11px] font-mono tracking-[0.35em] uppercase text-primary-dark mb-5">Since 1975</p>
            <h2
              id="about-heading"
              className="font-quicksand font-black text-4xl sm:text-5xl lg:text-6xl text-neutral-900 dark:text-white leading-none mb-8"
            >
              We Are
              <br />
              The Pops
            </h2>
            <div className="space-y-5 text-neutral-500 dark:text-neutral-400 text-base leading-relaxed mb-10">
              <p>
                The Pops Orchestra of Bradenton and Sarasota has delivered acclaimed performances to diverse audiences
                for over five decades, including residents, seasonal visitors, and tourists, contributing culturally and
                economically to the Sarasota area.
              </p>
              <p>
                The 65-piece orchestra features professional musicians, educators, and students, offering concerts
                across beloved genres like Broadway, Jazz, Motown, and holiday music. Guest artists regularly join, and
                each season is designed to entertain and showcase the orchestra&apos;s passion for popular music.
              </p>
            </div>
            <Link
              href="/about"
              className="inline-flex items-center gap-3 px-8 py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-mono text-sm tracking-[0.2em] uppercase hover:bg-primary-dark dark:hover:bg-primary-dark dark:hover:text-white transition-colors focus-visible:outline-none"
            >
              Read More
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─── Quote / Conductor ────────────────────────────────────────────────────────

function QuoteSection() {
  return (
    <section
      className="relative bg-neutral-950 py-24 sm:py-36 px-6 sm:px-12 lg:px-20 overflow-hidden"
      aria-label="Conductor quote"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Quote */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="text-8xl text-primary-dark/20 font-serif leading-none mb-4" aria-hidden="true">
              &quot;
            </div>
            <blockquote>
              <p className="text-white/80 text-xl sm:text-2xl lg:text-3xl leading-relaxed italic font-light mb-8">
                Music is the universal language of our community. Every season we strive to bring world-class
                entertainment to the Suncoast and leave audiences breathless.
              </p>
              <footer>
                <p className="text-neutral-500 text-sm font-mono tracking-[0.2em] uppercase">— Robyn Bell, Conductor</p>
              </footer>
            </blockquote>
          </motion.div>

          {/* Image with accent block — Saxxy style */}
          <div className="relative h-120">
            <div className="absolute bottom-0 right-0 w-16 h-48 bg-primary-dark" aria-hidden="true" />
            <Placeholder className="absolute top-0 left-0 w-[85%] h-[90%] object-cover" label="Conductor" />
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Events ───────────────────────────────────────────────────────────────────

function EventsSection() {
  return (
    <section
      id="events"
      className="bg-white dark:bg-bg-dark py-24 sm:py-36 px-6 sm:px-12 lg:px-20"
      aria-labelledby="events-heading"
    >
      <div className="max-w-7xl mx-auto">
        <p className="text-[11px] font-mono tracking-[0.35em] uppercase text-primary-dark mb-5">Calendar</p>
        <h2
          id="events-heading"
          className="font-quicksand font-black text-4xl sm:text-5xl lg:text-6xl text-neutral-900 dark:text-white leading-none mb-16"
        >
          Events
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800">
          {STUB_EVENTS.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="bg-white dark:bg-neutral-950 p-6 flex flex-col gap-4 group cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
            >
              <div>
                <p className="text-[11px] font-mono tracking-[0.2em] uppercase text-primary-dark mb-4">{event.date}</p>
                <h3 className="font-quicksand font-black text-xl text-neutral-900 dark:text-white leading-tight mb-3 group-hover:text-primary-dark transition-colors">
                  {event.title}
                </h3>
                <div className="flex items-start gap-2 text-neutral-400 text-xs mb-4">
                  <MapPin className="w-3 h-3 shrink-0 mt-0.5 text-primary-dark" aria-hidden="true" />
                  {event.location}
                </div>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">{event.description}</p>
              </div>
              <div className="flex items-center gap-2 text-neutral-900 dark:text-white font-mono text-[11px] tracking-[0.2em] uppercase mt-auto">
                Learn More
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── News ─────────────────────────────────────────────────────────────────────

function NewsSection() {
  return (
    <section id="news" className="bg-neutral-950 py-24 sm:py-36 px-6 sm:px-12 lg:px-20" aria-labelledby="news-heading">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-16 gap-8">
          <div>
            <p className="text-[11px] font-mono tracking-[0.35em] uppercase text-primary-dark mb-5">Latest</p>
            <h2
              id="news-heading"
              className="font-quicksand font-black text-4xl sm:text-5xl lg:text-6xl text-white leading-none"
            >
              News
            </h2>
          </div>
          <Link
            href="/news"
            className="shrink-0 inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.2em] uppercase text-neutral-400 hover:text-white transition-colors focus-visible:outline-none"
          >
            All News
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {STUB_NEWS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link href={item.href} className="group flex flex-col gap-5 focus-visible:outline-none">
                {/* Placeholder image */}
                <div className="relative overflow-hidden aspect-4/3">
                  <Placeholder className="w-full h-full" label="News" />
                  <div className="absolute inset-0 bg-primary-dark/0 group-hover:bg-primary-dark/10 transition-colors" />
                </div>

                <div>
                  <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-500 mb-3">{item.date}</p>
                  <h3 className="font-quicksand font-black text-xl text-white leading-tight mb-3 group-hover:text-primary-dark transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-neutral-500 text-sm leading-relaxed line-clamp-3">{item.excerpt}</p>
                </div>

                <div className="flex items-center gap-2 text-primary-dark text-[11px] font-mono tracking-[0.2em] uppercase">
                  Read More
                  <ArrowUpRight
                    className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Gallery ──────────────────────────────────────────────────────────────────

function GallerySection({ images }: { images: PhotoGalleryImage[] }) {
  const display = images.slice(0, 6)

  return (
    <section className="bg-white dark:bg-bg-dark py-24 sm:py-36 overflow-hidden" aria-labelledby="gallery-heading">
      <div className="px-6 sm:px-12 lg:px-20 mb-12">
        <p className="text-[11px] font-mono tracking-[0.35em] uppercase text-primary-dark mb-5">Photography</p>
        <h2
          id="gallery-heading"
          className="font-quicksand font-black text-4xl sm:text-5xl lg:text-6xl text-neutral-900 dark:text-white leading-none"
        >
          Gallery
        </h2>
      </div>

      {/* Horizontal scroll */}
      <div className="flex gap-4 overflow-x-auto pb-4 px-6 sm:px-12 lg:px-20 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {(display.length > 0 ? display : Array.from({ length: 6 })).map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="shrink-0 snap-start w-72 sm:w-96 aspect-3/4 overflow-hidden"
          >
            {img ? <></> : <Placeholder className="w-full h-full" label={`Photo ${i + 1}`} />}
          </motion.div>
        ))}
      </div>

      <div className="px-6 sm:px-12 lg:px-20 mt-10">
        <Link
          href="/gallery"
          className="inline-flex items-center gap-3 text-[11px] font-mono tracking-[0.2em] uppercase text-primary-dark hover:text-secondary-light transition-colors focus-visible:outline-none"
        >
          View Full Gallery
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: wire to subscribeToMailchimp
    setSent(true)
  }

  return (
    <section className="bg-primary-dark py-24 sm:py-36 px-6 sm:px-12 lg:px-20" aria-labelledby="newsletter-heading">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-[11px] font-mono tracking-[0.35em] uppercase text-white/50 mb-5">Stay Connected</p>
          <h2
            id="newsletter-heading"
            className="font-quicksand font-black text-4xl sm:text-5xl lg:text-6xl text-white leading-none mb-6"
          >
            Never Miss a Performance
          </h2>
          <p className="text-white/60 text-lg leading-relaxed">
            Get season updates, early ticket access, and behind-the-scenes stories delivered to your inbox.
          </p>
        </div>

        <div>
          {sent ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 text-white"
            >
              <div className="w-2 h-2 bg-white rounded-full shrink-0" aria-hidden="true" />
              <p className="font-mono text-sm tracking-[0.2em] uppercase">You&apos;re on the list — thank you!</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-6 py-4 bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-white transition-colors text-sm"
              />
              <button
                type="submit"
                className="px-10 py-4 bg-white text-primary-dark font-quicksand font-black text-base hover:bg-white/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-dark whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-neutral-950 px-6 sm:px-12 lg:px-20 pt-20 pb-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <p className="font-quicksand font-black text-3xl text-white mb-4">The Pops Orchestra</p>
            <p className="text-neutral-500 text-sm leading-relaxed mb-6 max-w-sm">
              The Pops Orchestra of Bradenton and Sarasota — delivering world-class performances to the Suncoast since
              1975.
            </p>
            <div className="space-y-2">
              <a
                href="tel:9419267677"
                className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm focus-visible:outline-none"
              >
                <Phone className="w-3.5 h-3.5 text-primary-dark shrink-0" aria-hidden="true" />
                941-926-POPS (7677)
              </a>
              <a
                href="mailto:Tickets@ThePopsOrchestra.org"
                className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm focus-visible:outline-none"
              >
                <Mail className="w-3.5 h-3.5 text-primary-dark shrink-0" aria-hidden="true" />
                Tickets@ThePopsOrchestra.org
              </a>
              <p className="flex items-start gap-2 text-neutral-400 text-sm">
                <MapPin className="w-3.5 h-3.5 text-primary-dark shrink-0 mt-0.5" aria-hidden="true" />
                502 3rd Ave W, Bradenton, FL 34205
              </p>
            </div>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer navigation — primary">
            <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-600 mb-5">Explore</p>
            <ul className="space-y-3">
              {['Concerts', 'About', 'Events', 'News', 'Gallery', 'Donate'].map((l) => (
                <li key={l}>
                  <Link
                    href={`/${l.toLowerCase()}`}
                    className="text-neutral-400 hover:text-white transition-colors text-sm focus-visible:outline-none"
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Info links */}
          <nav aria-label="Footer navigation — info">
            <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-600 mb-5">Info</p>
            <ul className="space-y-3">
              {['Contact', 'Student Performers', 'Sponsors', 'Venues', 'Subscribe', 'FAQ'].map((l) => (
                <li key={l}>
                  <Link
                    href={`/${l.toLowerCase().replace(' ', '-')}`}
                    className="text-neutral-400 hover:text-white transition-colors text-sm focus-visible:outline-none"
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-neutral-900">
          <p className="text-[11px] font-mono text-neutral-700">
            © {new Date().getFullYear()} The Pops Orchestra of Bradenton &amp; Sarasota. All rights reserved.
          </p>
          <p className="text-[11px] font-mono text-neutral-700">ThePopsOrchestra.org</p>
        </div>
      </div>
    </footer>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function HomeClientV2({ galleryImages, pageData, ref }: HomeClientProps) {
  return (
    <div className="bg-white">
      <Nav />
      <HomeHero pageData={pageData} ref={ref} />
      <AboutSection />
      <QuoteSection />
      <EventsSection />
      <NewsSection />
      <GallerySection images={galleryImages} />
      <NewsletterSection />
      <Footer />
    </div>
  )
}
