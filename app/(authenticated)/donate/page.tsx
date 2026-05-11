'use client'

import { FloatingParticles } from '@/app/components/FloatingParticles'
import { FundCard } from '@/app/components/FundCard'
import { ArrowLeft, Phone } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

const FUNDS = [
  {
    id: 'general',
    label: 'General Fund',
    title: 'Pops Orchestra General Donation',
    description:
      'Your generous donations ensure support for musicians, planning of our future seasons, recurring monthly expenses, and annual subscriptions to music publishing and rights organizations.',
    href: 'https://thepopsorchestra.app.getcuebox.com/o/21NL0B8D/donate/6ZG83S9R',
    cta: 'Donate Now',
    accent: 'border-primary-dark/40 hover:border-primary-dark',
    labelColor: 'text-primary-dark'
  },
  {
    id: 'chair',
    label: 'Chair Sponsorship',
    title: 'Musician Chair Sponsorship',
    description:
      'Celebrate your favorite musician, recognize a loved one, or honor a past music teacher. Make your donation individually or collaborate with others to pool funds for a higher sponsorship level.',
    href: 'https://thepopsorchestra.app.getcuebox.com/o/21NL0B8D/donate/C4XKQ47C',
    cta: 'Sponsor a Chair',
    accent: 'border-violet-500/40 hover:border-violet-500',
    labelColor: 'text-violet-400'
  },
  {
    id: 'education',
    label: 'Education Fund',
    title: 'Pops Orchestra Education Fund',
    description:
      'Help The Pops Orchestra continue supporting music education through free summer camps, student music scholarships, and the establishment of Youth Orchestra Bradenton.',
    href: 'https://thepopsorchestra.app.getcuebox.com/o/21NL0B8D/donate/QPC6YLYC',
    cta: 'Support Education',
    accent: 'border-sky-500/40 hover:border-sky-500',
    labelColor: 'text-sky-400',
    note: 'Contact us at Info@ThePopsOrchestra.org or 941-926-7677 with any questions.'
  },
  {
    id: 'sponsorships',
    label: 'Concert Sponsorships',
    title: 'Concert & Guest Artist Sponsorships',
    description:
      'Support the Pops Orchestra with recognition on all printed and digital marketing material, in the concert program books, and from the stage.',
    href: 'https://thepopsorchestra.app.getcuebox.com/o/21NL0B8D/donate/G2WKC0X8',
    cta: 'View Sponsorships',
    accent: 'border-amber-500/40 hover:border-amber-500',
    labelColor: 'text-amber-400',
    tiers: [
      { label: 'Season Sponsor', amount: '$25,000' },
      { label: 'Concert Sponsor', amount: '$10,000', note: 'you pick the concert' },
      { label: 'Guest Artist Sponsor', amount: '$5,000', note: 'you pick the artist' },
      { label: 'Principal Sponsor', amount: '$2,500' },
      { label: 'Associate Sponsor', amount: '$1,000 – $1,500' }
    ]
  },
  {
    id: 'advertising',
    label: 'Program Advertising',
    title: 'Pops Concert Program Advertising',
    description:
      'Advertise in our concert program book, reaching over 15,000 potential customers this season. Multiple size options available.',
    href: 'https://thepopsorchestra.app.getcuebox.com/o/21NL0B8D/donate/VCC335D5',
    cta: 'Advertise With Us',
    accent: 'border-emerald-500/40 hover:border-emerald-500',
    labelColor: 'text-emerald-400',
    adOptions: [
      { size: 'Full Page', note: '4 complimentary season tickets', price: 'from $1,000' },
      { size: 'Half Page', note: '4 complimentary single tickets', price: '$500' },
      { size: 'Quarter Page', note: null, price: '$300' }
    ]
  }
]

export default function DonatePage() {
  const session = useSession()

  if (session.data.user.role !== 'ADMIN' && session.data.user.role !== 'SUPER_USER') return

  return (
    <main className="min-h-screen bg-bg-dark text-text-dark">
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-border-dark">
        <div className="max-w-5xl mx-auto px-4 760:px-6 h-12 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group focus-visible:outline-none">
            <span className="text-primary-dark text-[10px] group-hover:text-white transition-colors" aria-hidden="true">
              ▸
            </span>
            <span className="text-[9px] font-mono uppercase tracking-widest text-muted-dark group-hover:text-text-dark transition-colors">
              The Pops Orchestra
            </span>
          </Link>

          {/* Right */}
          <div className="flex items-center gap-3 760:gap-4">
            <Link
              href="/v2/dashboard"
              className="flex items-center gap-1.5 text-[8px] font-mono uppercase tracking-widest text-muted-dark/60 hover:text-text-dark transition-colors focus-visible:outline-none"
            >
              <ArrowLeft className="w-3 h-3" />
              <span className="hidden 480:inline">Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </header>
      {/* Hero */}
      <section className="relative border-b border-border-dark">
        {/* Background image with fade */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/nikki-fire.webp')",
            backgroundSize: 'cover',
            backgroundPosition: 'center center'
          }}
          aria-hidden="true"
        />
        <FloatingParticles count={80} />
        <div className="absolute inset-0 bg-linear-to-r from-black via-black/40 to-transparent" />

        {/* Content */}
        <div className="relative max-w-5xl mx-auto px-6 py-20 760:py-28 flex flex-col gap-5">
          <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-primary-dark">The Pops Orchestra</span>
          <h1 className="font-changa font-black text-5xl 760:text-7xl text-text-dark leading-[0.9] max-w-xl">
            Support
            <br />
            The Pops
          </h1>
          <p className="font-lato text-text-dark/60 text-base 760:text-lg leading-relaxed max-w-lg">
            Your generosity keeps the music alive in Sarasota and Bradenton. Every gift — no matter the size — makes a
            direct impact on our musicians, our community, and the future of live orchestral music.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="tel:9419267677"
              className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-muted-dark hover:text-text-dark transition-colors"
            >
              <Phone className="w-3 h-3" />
              941-926-POPS (7677)
            </a>
          </div>
        </div>
      </section>

      {/* Fund cards */}
      <section className="max-w-5xl mx-auto px-4 760:px-6 py-12 760:py-16">
        <div className="grid grid-cols-1 760:grid-cols-2 1200:grid-cols-3 gap-4 760:gap-5">
          {FUNDS.map((fund) => (
            <FundCard key={fund.id} fund={fund} />
          ))}
        </div>
      </section>

      {/* Questions */}
      <section className="border-t border-border-dark bg-surface-dark/30 px-6 py-10 760:py-12">
        <div className="max-w-5xl mx-auto px-6 flex flex-col 760:flex-row 760:items-center 760:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-primary-dark">Questions?</span>
            <p className="font-lato text-text-dark/60 text-sm">
              We&apos;re happy to help you find the right giving opportunity.
            </p>
          </div>
          <div className="flex flex-col 480:flex-row gap-3">
            <a
              href="tel:9419267677"
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-border-dark text-[9px] font-mono uppercase tracking-widest text-muted-dark hover:text-text-dark hover:border-muted-dark/40 transition-colors"
            >
              <Phone className="w-3 h-3" />
              941-926-7677
            </a>
          </div>
        </div>
      </section>

      {/* Florida statute */}
      <section className="border-t border-border-dark/40 px-6 py-6">
        <p className="text-[7px] font-mono text-muted-dark/50 leading-relaxed max-w-4xl mx-auto uppercase tracking-wider">
          The Sarasota Pops Orchestra, Inc (&quot;The Pops&quot;) is a registered 501(c)(3) with EIN # 59-1694954 and is
          registered with the FL Division of Consumer Services # CH9116. A copy of the official registration and
          financial information may be obtained from the Division of Consumer Services by calling toll-free
          (800-435-7352) within the state. Registration does not imply endorsement, approval, or recommendation by the
          state.
        </p>
      </section>
    </main>
  )
}
