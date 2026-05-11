'use client'

import { motion } from 'framer-motion'
import Breadcrumb from '@/app/components/common/Breadcrumb'
import { Award, Calendar, Eye, Mail, Music, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'

export const SponsorshipOpportunitiesClient = ({ data }) => {
  const field = (id: string) => data?.content?.find((item) => item.id === id)?.value ?? ''

  const tierGroups = [
    {
      n: 1,
      categories: [
        { key: 'print', label: 'Print', fields: ['print_1', 'print_2', 'print_3'] },
        { key: 'online', label: 'Online Recognition', fields: ['online_1', 'online_2'] },
        { key: 'email', label: 'Email & Advertising', fields: ['email_1', 'email_2'] },
        { key: 'tickets', label: 'Tickets', fields: ['tickets_1', 'tickets_2'] },
        { key: 'additional', label: 'Additional Options', fields: ['additional_1'] }
      ]
    },
    {
      n: 2,
      categories: [
        { key: 'print', label: 'Print', fields: ['print_1', 'print_2'] },
        { key: 'online', label: 'Online Recognition', fields: ['online_1', 'online_2'] },
        { key: 'email', label: 'Email & Advertising', fields: ['email_1', 'email_2'] },
        { key: 'tickets', label: 'Tickets', fields: ['tickets_1', 'tickets_2'] },
        { key: 'additional', label: 'Additional Options', fields: ['additional_1'] }
      ]
    },
    {
      n: 3,
      categories: [
        { key: 'print', label: 'Print', fields: ['print_1', 'print_2'] },
        { key: 'online', label: 'Online Recognition', fields: ['online_1'] },
        { key: 'additional', label: 'Additional Options', fields: ['additional_1'] }
      ]
    },
    { n: 4, categories: [{ key: 'print', label: 'Print', fields: ['print_1'] }] },
    { n: 5, categories: [{ key: 'print', label: 'Print', fields: ['print_1'] }] },
    { n: 6, categories: [{ key: 'print', label: 'Print', fields: ['print_1'] }] }
  ]

  const statIcons = [Users, TrendingUp, Eye, Users, Music, Award]
  const benefitIcons = [Users, Award, TrendingUp, Eye, Calendar, Music]

  return (
    <main id="main-content">
      <Breadcrumb breadcrumb="Sponsorship Opportunities" />

      {/* ── Header ── */}
      <section className="relative px-4 990:px-12 xl:px-4 pt-28 pb-10 bg-black overflow-hidden border-b border-white/10">
        <div
          className="absolute inset-0 opacity-5 bg-no-repeat bg-center bg-cover"
          style={{ backgroundImage: `url('/images/bio-bg.webp')` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black via-transparent to-black" aria-hidden="true" />
        <div className="relative z-10 max-w-130 760:max-w-xl 990:max-w-200 1200:max-w-screen-1160 1590:max-w-7xl mx-auto flex flex-col items-center text-center">
          <p className="font-changa text-xs uppercase tracking-[0.3em] text-blaze-text mb-2">
            {field('sponsorship_eyebrow') || 'The Pops Orchestra'}
          </p>
          <h1 className="text-4xl sm:text-5xl font-changa text-white leading-none mb-3">
            {field('sponsorship_heading') || 'Sponsorship Opportunities'}
          </h1>
          <div className="w-12 h-px bg-blaze mx-auto mb-3" aria-hidden="true" />
          <p className="font-changa text-base text-blaze-text uppercase tracking-wider mb-1">
            {field('sponsorship_subheading')}
          </p>
          <p className="font-lato text-white/70 text-sm">{field('sponsorship_season')}</p>
        </div>
      </section>

      {/* ── Body ── */}
      <div className="bg-black px-4 990:px-12 xl:px-4 py-12">
        <div className="max-w-130 760:max-w-xl 990:max-w-200 1200:max-w-screen-1160 1590:max-w-7xl mx-auto flex flex-col gap-px bg-white/10">
          {/* ── Stats ── */}
          <section aria-labelledby="stats-heading" className="bg-black p-5 990:p-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-4 h-px bg-blaze shrink-0" aria-hidden="true" />
              <h2 id="stats-heading" className="font-changa text-[11px] uppercase tracking-[0.25em] text-blaze-text">
                Pops by the Numbers
              </h2>
            </div>
            <ul
              role="list"
              aria-label="Pops Orchestra statistics"
              className="grid grid-cols-2 760:grid-cols-3 gap-px bg-white/10"
            >
              {[1, 2, 3, 4, 5, 6].map((n, i) => {
                const Icon = statIcons[i]
                return (
                  <motion.li
                    key={n}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    viewport={{ once: true }}
                    className="bg-black p-5 430:p-6 flex flex-col gap-2"
                  >
                    <Icon className="w-4 h-4 text-blaze-text" aria-hidden="true" />
                    <p className="font-changa text-2xl 430:text-3xl text-white">
                      {field(`sponsorship_stat_${n}_number`)}
                    </p>
                    <p className="font-lato text-xs text-white/70 leading-relaxed">
                      {field(`sponsorship_stat_${n}_label`)}
                    </p>
                  </motion.li>
                )
              })}
            </ul>
          </section>

          {/* ── Tiers ── */}
          <section aria-labelledby="tiers-heading" className="bg-black p-5 990:p-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-4 h-px bg-blaze shrink-0" aria-hidden="true" />
              <h2 id="tiers-heading" className="font-changa text-[11px] uppercase tracking-[0.25em] text-blaze-text">
                Sponsorship Tiers
              </h2>
            </div>
            <ul
              role="list"
              aria-label="Sponsorship tiers"
              className="grid grid-cols-1 760:grid-cols-2 990:grid-cols-3 gap-px bg-white/10"
            >
              {tierGroups.map((tier, index) => {
                const n = tier.n
                const title = field(`sponsorship_tier_${n}_title`)
                const price = field(`sponsorship_tier_${n}_price`)
                const availability = field(`sponsorship_tier_${n}_availability`)
                return (
                  <motion.li
                    key={n}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.06 }}
                    viewport={{ once: true }}
                    className="bg-black flex flex-col"
                  >
                    {/* Tier header */}
                    <div className="border-b border-white/10 p-5 430:p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-px bg-blaze shrink-0" aria-hidden="true" />
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-blaze-text">Tier {n}</p>
                      </div>
                      <h3 className="font-changa text-xl text-white mb-1">{title}</h3>
                      <p className="font-changa text-2xl text-blaze-text">{price}</p>
                      {availability && <p className="font-lato text-[12px] text-white/50 mt-1">{availability}</p>}
                    </div>

                    {/* Tier features */}
                    <div className="p-5 430:p-6 flex flex-col gap-5 grow">
                      {tier.categories.map((cat) => {
                        const items = cat.fields.map((f) => field(`sponsorship_tier_${n}_${f}`)).filter(Boolean)
                        if (!items.length) return null
                        return (
                          <div key={cat.key}>
                            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">
                              {cat.label}
                            </p>
                            <ul role="list" className="flex flex-col gap-1.5">
                              {items.map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="w-1 h-1 rounded-full bg-blaze shrink-0 mt-1.5" aria-hidden="true" />
                                  <span className="font-lato text-sm text-white/80 leading-relaxed">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )
                      })}
                    </div>
                  </motion.li>
                )
              })}
            </ul>
          </section>

          {/* ── Benefits ── */}
          <section aria-labelledby="benefits-heading" className="bg-black p-5 990:p-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-4 h-px bg-blaze shrink-0" aria-hidden="true" />
              <h2 id="benefits-heading" className="font-changa text-[11px] uppercase tracking-[0.25em] text-blaze-text">
                Why Become a Pops Partner?
              </h2>
            </div>
            <ul
              role="list"
              aria-label="Partnership benefits"
              className="grid grid-cols-1 760:grid-cols-2 gap-px bg-white/10"
            >
              {[1, 2, 3, 4, 5, 6].map((n, i) => {
                const Icon = benefitIcons[i]
                return (
                  <motion.li
                    key={n}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    viewport={{ once: true }}
                    className="bg-black p-5 430:p-6 flex items-start gap-4"
                  >
                    <div
                      className="w-8 h-8 border border-blaze/30 bg-blaze/5 flex items-center justify-center shrink-0"
                      aria-hidden="true"
                    >
                      <Icon className="w-4 h-4 text-blaze-text" />
                    </div>
                    <div>
                      <h3 className="font-changa text-white text-base mb-1">
                        {field(`sponsorship_benefit_${n}_title`)}
                      </h3>
                      <p className="font-lato text-sm text-white/80 leading-relaxed">
                        {field(`sponsorship_benefit_${n}_description`)}
                      </p>
                    </div>
                  </motion.li>
                )
              })}
            </ul>
          </section>

          {/* ── Additional text ── */}
          {field('sponsorship_additional_text') && (
            <div className="bg-black p-5 990:p-10">
              <p className="font-lato text-white/80 text-sm leading-relaxed border-l-2 border-blaze pl-5">
                {field('sponsorship_additional_text')}
              </p>
            </div>
          )}

          {/* ── Contact ── */}
          <section aria-labelledby="contact-heading" className="bg-black p-5 990:p-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-4 h-px bg-blaze shrink-0" aria-hidden="true" />
              <h2 id="contact-heading" className="font-changa text-[11px] uppercase tracking-[0.25em] text-blaze-text">
                Ready to Partner?
              </h2>
            </div>

            <div className="grid grid-cols-1 760:grid-cols-2 gap-px bg-white/10">
              <div className="bg-black p-5 430:p-6">
                <p className="font-lato text-white/50 text-xs mb-4 uppercase tracking-widest font-mono">Contact</p>
                <p className="font-changa text-xl text-white mb-0.5">{field('sponsorship_contact_name')}</p>
                <p className="font-mono text-[11px] text-blaze-text uppercase tracking-[0.15em] mb-5">
                  {field('sponsorship_contact_title')}
                </p>
                <address className="not-italic flex flex-col gap-3">
                  <a
                    href={`mailto:${field('sponsorship_contact_email')}`}
                    aria-label={`Email ${field('sponsorship_contact_name')} at ${field('sponsorship_contact_email')}`}
                    className="font-lato text-sm text-white hover:text-blaze-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze rounded-sm w-fit"
                  >
                    {field('sponsorship_contact_email')}
                  </a>

                  <a
                    href={`tel:${field('sponsorship_contact_phone_1').replace(/\D/g, '')}`}
                    aria-label={`Call ${field('sponsorship_contact_phone_1')}`}
                    className="font-lato text-sm text-white hover:text-blaze-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze rounded-sm w-fit"
                  >
                    {field('sponsorship_contact_phone_1')}
                  </a>

                  <a
                    href="tel:9419267677"
                    aria-label={`Call ${field('sponsorship_contact_phone_2')}`}
                    className="font-lato text-sm text-white hover:text-blaze-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze rounded-sm w-fit"
                  >
                    {field('sponsorship_contact_phone_2')}
                  </a>

                  <p className="font-lato text-sm text-white/70">{field('sponsorship_contact_address')}</p>
                </address>
              </div>

              <div className="bg-black p-5 430:p-6 flex flex-col justify-center gap-4">
                <p className="font-lato text-white/80 text-sm leading-relaxed">
                  To discuss sponsorship options or learn more about how your business can partner with The Pops
                  Orchestra, reach out directly.
                </p>

                <Link
                  href={`/contact`}
                  aria-label={`Email ${field('sponsorship_contact_name')} to discuss sponsorship`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blaze hover:bg-blazehover text-white font-changa uppercase tracking-widest text-sm transition-colors w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  Get in Touch
                  <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
