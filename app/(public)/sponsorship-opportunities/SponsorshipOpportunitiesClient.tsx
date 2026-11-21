'use client'

import { motion } from 'framer-motion'
import { Award, Calendar, Eye, Mail, Music, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'
import CompactPageHero from '@/app/(public)/_components/CompactPageHero'
import { pageCopy } from '@/app/lib/page-content/copy'
import { pageContent } from '@/app/lib/constants/page-content/sponsorship-opportunities'

export const SponsorshipOpportunitiesClient = ({ data }) => {
  const { t } = pageCopy(data?.content, pageContent)

  // Every tier now shares the same shape: description + 4 lines per category
  const TIER_NUMBERS = [1, 2, 3, 4, 5, 6]

  // Tier 6 (Musician Chair Sponsorship) is print-only and hides the tier label
  const CHAIR_TIER = 6

  const CATEGORIES = [
    { key: 'print', label: t('sponsorship_category_print_label') },
    { key: 'online', label: t('sponsorship_category_online_label') },
    { key: 'tickets', label: t('sponsorship_category_tickets_label') }
  ]

  const LINES = [1, 2, 3, 4]

  const statIcons = [Users, TrendingUp, Eye, Users, Music, Award]
  const benefitIcons = [Users, Award, TrendingUp, Eye, Calendar, Music]

  return (
    <main id="main-content">
      <CompactPageHero
        homeLabel={t('sponsorship_hero_home_crumb')}
        breadcrumbLabel={t('sponsorship_sr_breadcrumb')}
        breadcrumb={t('sponsorship_breadcrumb')}
        eyebrow={t('sponsorship_eyebrow')}
        heading={t('sponsorship_heading')}
        description={t('sponsorship_season')}
      />

      <div className="relative px-4 990:px-12 xl:px-4"></div>

      {/* Main Content */}
      <div className="max-w-[320px] 430:max-w-130 760:max-w-xl 990:max-w-200 1200:max-w-screen-1160 mx-auto">
        {/* ── Stats ── */}
        <section aria-labelledby="stats-heading" className="bg-black p-5 990:p-10">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-4 h-px bg-blaze shrink-0" aria-hidden="true" />
            <h2 id="stats-heading" className="font-changa text-sm uppercase tracking-[0.25em] text-blaze-text">
              {t('sponsorship_stats_heading')}
            </h2>
          </div>
          <ul
            role="list"
            aria-label={t('sponsorship_stats_list_label')}
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
                  <p className="font-changa text-2xl 430:text-3xl text-white">{t(`sponsorship_stat_${n}_number`)}</p>
                  <p className="font-lato text-sm text-white/70 leading-relaxed">{t(`sponsorship_stat_${n}_label`)}</p>
                </motion.li>
              )
            })}
          </ul>
        </section>

        {/* ── Tiers ── */}
        <section aria-labelledby="tiers-heading" className="bg-black p-5 990:p-10">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-4 h-px bg-blaze shrink-0" aria-hidden="true" />
            <h2 id="tiers-heading" className="font-changa text-sm uppercase tracking-[0.25em] text-blaze-text">
              {t('sponsorship_tiers_heading')}
            </h2>
          </div>
          <ul
            role="list"
            aria-label={t('sponsorship_tiers_list_label')}
            className="grid grid-cols-1 760:grid-cols-2 990:grid-cols-3 gap-px bg-white/10"
          >
            {TIER_NUMBERS.map((n, index) => {
              const title = t(`sponsorship_tier_${n}_title`)
              const price = t(`sponsorship_tier_${n}_price`)
              const description = t(`sponsorship_tier_${n}_description`)
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
                    {n !== CHAIR_TIER && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-px bg-blaze shrink-0" aria-hidden="true" />
                        <p className="font-mono text-sm uppercase tracking-[0.2em] text-blaze-text">
                          {t('sponsorship_tier_label', { number: n })}
                        </p>
                      </div>
                    )}
                    <h3 className="font-changa text-xl text-white mb-1">{title}</h3>
                    <p className="font-changa text-2xl text-blaze-text">{price}</p>
                    {description && <p className="font-lato text-sm text-white/70 leading-relaxed mt-3">{description}</p>}
                  </div>

                  {/* Tier features */}
                  <div className="p-5 430:p-6 flex flex-col gap-5 grow">
                    {(n === CHAIR_TIER ? CATEGORIES.filter((c) => c.key === 'print') : CATEGORIES).map((cat) => {
                      const items = LINES.map((i) => t(`sponsorship_tier_${n}_${cat.key}_${i}`))
                        .map((v) => v.trim())
                        .filter(Boolean)
                      if (!items.length) return null
                      return (
                        <div key={cat.key}>
                          <p className="font-mono text-sm uppercase tracking-[0.2em] text-white/40 mb-2">{cat.label}</p>
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
            <h2 id="benefits-heading" className="font-changa text-sm uppercase tracking-[0.25em] text-blaze-text">
              {t('sponsorship_benefits_heading')}
            </h2>
          </div>
          <ul
            role="list"
            aria-label={t('sponsorship_benefits_list_label')}
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
                    <h3 className="font-changa text-white text-base mb-1">{t(`sponsorship_benefit_${n}_title`)}</h3>
                    <p className="font-lato text-sm text-white/80 leading-relaxed">{t(`sponsorship_benefit_${n}_description`)}</p>
                  </div>
                </motion.li>
              )
            })}
          </ul>
        </section>

        {/* ── Additional text ── */}
        {t('sponsorship_additional_text') && (
          <div className="bg-black p-5 990:p-10">
            <p className="font-lato text-white/80 text-sm leading-relaxed border-l-2 border-blaze pl-5">
              {t('sponsorship_additional_text')}
            </p>
          </div>
        )}

        {/* ── Contact ── */}
        <section aria-labelledby="contact-heading" className="bg-black p-5 990:p-10">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-4 h-px bg-blaze shrink-0" aria-hidden="true" />
            <h2 id="contact-heading" className="font-changa text-sm uppercase tracking-[0.25em] text-blaze-text">
              {t('sponsorship_contact_heading')}
            </h2>
          </div>

          <div className="grid grid-cols-1 760:grid-cols-2 gap-px bg-white/10">
            <div className="bg-black p-5 430:p-6">
              <p className="font-lato text-white/50 text-sm mb-4 uppercase tracking-widest font-mono">
                {t('sponsorship_contact_label')}
              </p>
              <p className="font-changa text-xl text-white mb-0.5">{t('sponsorship_contact_name')}</p>
              <p className="font-mono text-sm text-blaze-text uppercase tracking-[0.15em] mb-5">
                {t('sponsorship_contact_title')}
              </p>
              <address className="not-italic flex flex-col gap-3">
                <a
                  href={`mailto:${t('sponsorship_contact_email')}`}
                  aria-label={t('sponsorship_contact_email_link_label', {
                    name: t('sponsorship_contact_name'),
                    email: t('sponsorship_contact_email')
                  })}
                  className="font-lato text-sm text-white hover:text-blaze-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze rounded-sm w-fit"
                >
                  {t('sponsorship_contact_email')}
                </a>

                <a
                  href={`tel:${t('sponsorship_contact_phone_1').replace(/\D/g, '')}`}
                  aria-label={t('sponsorship_contact_phone_link_label', { phone: t('sponsorship_contact_phone_1') })}
                  className="font-lato text-sm text-white hover:text-blaze-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze rounded-sm w-fit"
                >
                  {t('sponsorship_contact_phone_1')}
                </a>

                <a
                  href="tel:9419267677"
                  aria-label={t('sponsorship_contact_phone_link_label', { phone: t('sponsorship_contact_phone_2') })}
                  className="font-lato text-sm text-white hover:text-blaze-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze rounded-sm w-fit"
                >
                  {t('sponsorship_contact_phone_2')}
                </a>

                <p className="font-lato text-sm text-white/70">{t('sponsorship_contact_address')}</p>
              </address>
            </div>

            <div className="bg-black p-5 430:p-6 flex flex-col justify-center gap-4">
              <p className="font-lato text-white/80 text-sm leading-relaxed">{t('sponsorship_contact_intro')}</p>

              <Link
                href={`/contact`}
                aria-label={t('sponsorship_contact_button_label', { name: t('sponsorship_contact_name') })}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blaze hover:bg-blazehover text-white font-changa uppercase tracking-widest text-sm transition-colors w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                {t('sponsorship_contact_button')}
                <Mail className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
