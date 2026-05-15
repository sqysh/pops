'use client'

import { motion } from 'framer-motion'
import { Music, MapPin, Phone, ExternalLink, Users, Award } from 'lucide-react'
import Picture from '@/app/components/common/Picture'
import Breadcrumb from '../../components/common/Breadcrumb'

export const HiddenGemsClient = ({ data }) => {
  const field = (id: string) => data?.content?.find((item) => item.id === id)?.value ?? ''

  const organizations = [
    {
      num: 1,
      color: 'from-amber-500 to-orange-600',
      icon: Music,
      membershipLink: field('hidden_gems_org_1_membership_link'),
      festivalLink: field('hidden_gems_org_1_festival_link')
    },
    {
      num: 2,
      color: 'from-purple-500 to-pink-600',
      icon: Users,
      ensembleLink: field('hidden_gems_org_2_ensemble_link'),
      danceForJoyLink: field('hidden_gems_org_2_dance_for_joy_link')
    },
    {
      num: 3,
      color: 'from-blue-500 to-cyan-600',
      icon: Award
    },
    {
      num: 4,
      color: 'from-emerald-500 to-teal-600',
      icon: Music,
      seasonLink: field('hidden_gems_org_4_season_link')
    }
  ]

  return (
    <main id="main-content">
      <Breadcrumb breadcrumb="Hidden Gems" />

      <div className="relative">
        <div
          className="absolute inset-0 w-full h-full bg-no-repeat bg-center bg-cover opacity-10"
          style={{ backgroundImage: `url('/images/bio-bg.webp')`, backgroundAttachment: 'fixed' }}
          aria-hidden="true"
        />

        <div className="relative z-10 px-4 990:px-12 xl:px-4">
          <div className="max-w-[320px] 430:max-w-130 760:max-w-xl 990:max-w-200 1200:max-w-screen-1160 1590:max-w-screen-7xl mx-auto w-full flex flex-col items-center">
            {/* Page Header */}
            <motion.header
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full text-center flex flex-col items-center pt-32 pb-20 border-b border-white/10"
            >
              <p className="font-changa text-sm uppercase tracking-[0.3em] text-blaze-text mb-4">
                {field('hidden_gems_eyebrow')}
              </p>
              <div className="flex items-center gap-3 430:gap-4 justify-center mb-4">
                <div className="w-8 430:w-16 h-px bg-blaze shrink-0" aria-hidden="true" />
                <h1 className="text-4xl 430:text-5xl sm:text-6xl font-changa text-white leading-none">
                  {field('hidden_gems_heading')}
                </h1>
                <div className="w-8 430:w-16 h-px bg-blaze shrink-0" aria-hidden="true" />
              </div>
              <div className="w-16 h-px bg-blaze mx-auto mb-8 mt-2" aria-hidden="true" />
              <p className="max-w-2xl mx-auto font-lato text-white/70 text-sm 430:text-base leading-relaxed">
                {field('hidden_gems_subheading')}
              </p>
              <p className="text-sunburst font-changa uppercase tracking-widest text-sm mt-6">
                {field('hidden_gems_cta')}
              </p>
            </motion.header>

            {/* Organizations */}
            <section id="organizations" aria-labelledby="organizations-heading" className="w-full py-20">
              <h2 id="organizations-heading" className="sr-only">
                Arts Organizations
              </h2>

              <motion.p
                className="max-w-2xl mx-auto font-lato text-white/50 text-sm text-center mb-16 leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                {field('hidden_gems_section_subheading')}
              </motion.p>

              <ul role="list" className="flex flex-col divide-y divide-white/10">
                {organizations.map((org, index) => {
                  const n = org.num
                  const name = field(`hidden_gems_org_${n}_name`)
                  const description = field(`hidden_gems_org_${n}_description`)
                  const photo = field(`hidden_gems_org_${n}_photo`)
                  const address = field(`hidden_gems_org_${n}_address`)
                  const phone = field(`hidden_gems_org_${n}_phone`)
                  const website = field(`hidden_gems_org_${n}_website`)
                  const websiteUrl = field(`hidden_gems_org_${n}_website_url`)
                  const highlight1 = field(`hidden_gems_org_${n}_highlight_1`)
                  const highlight2 = field(`hidden_gems_org_${n}_highlight_2`)
                  const highlight3 = field(`hidden_gems_org_${n}_highlight_3`)
                  const highlights = [highlight1, highlight2, highlight3].filter(Boolean)

                  // Org-specific optional fields
                  const membershipText = n === 1 ? field('hidden_gems_org_1_membership_text') : ''
                  const festivalText = n === 1 ? field('hidden_gems_org_1_festival_text') : ''
                  const ensembleText = n === 2 ? field('hidden_gems_org_2_ensemble_text') : ''
                  const danceForJoyText = n === 2 ? field('hidden_gems_org_2_dance_for_joy_text') : ''
                  const seasonText = n === 2 ? field('hidden_gems_org_2_season_text') : ''
                  const communityText = n === 3 ? field('hidden_gems_org_3_community_text') : ''
                  const thisYearText = n === 3 ? field('hidden_gems_org_3_this_year_text') : ''
                  const directorText = n === 4 ? field('hidden_gems_org_4_director_text') : ''
                  const specialtyText = n === 4 ? field('hidden_gems_org_4_specialty_text') : ''
                  const outreachText = n === 4 ? field('hidden_gems_org_4_outreach_text') : ''

                  return (
                    <motion.li
                      key={n}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: index * 0.08 }}
                      className="group py-12 first:pt-0"
                    >
                      <article aria-label={`${name} arts organization`}>
                        <div className="grid grid-cols-1 990:grid-cols-12 gap-8 items-start">
                          {/* Image */}
                          <div className="990:col-span-4 overflow-hidden rounded-md">
                            <a
                              href={websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Visit ${name} website (opens in new tab)`}
                              className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-md"
                            >
                              <Picture
                                src={photo}
                                alt={`${name} promotional image`}
                                className="w-full aspect-video object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
                                priority={index < 2}
                              />
                            </a>
                          </div>

                          {/* Details */}
                          <div className="990:col-span-8 flex flex-col justify-start">
                            <div className="flex items-center gap-4 mb-4">
                              <div
                                className={`p-2.5 rounded-lg bg-linear-to-r ${org.color} shrink-0`}
                                aria-hidden="true"
                              >
                                <org.icon className="w-5 h-5 text-white" />
                              </div>
                              <h3 className="font-changa text-white text-2xl 990:text-3xl leading-tight group-hover:text-sunburst transition-colors duration-300">
                                {name}
                              </h3>
                            </div>

                            <div className="w-8 h-0.5 bg-blaze mb-5" aria-hidden="true" />

                            <p className="font-lato text-white/70 text-sm leading-relaxed mb-4">{description}</p>

                            {membershipText && (
                              <p className="font-lato text-white/70 text-sm mb-2">
                                {membershipText}{' '}
                                <a
                                  href={org.membershipLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label="Learn more about how to become a member (opens in new tab)"
                                  className="text-sunburst hover:text-blaze-text underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunburst rounded-sm"
                                >
                                  Learn more about how to become a member
                                </a>
                              </p>
                            )}

                            {festivalText && (
                              <p className="font-lato text-white/70 text-sm mb-2">
                                {festivalText}{' '}
                                <a
                                  href={org.festivalLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label="For more information, visit SarasotaJazzFestival.com (opens in new tab)"
                                  className="text-sunburst hover:text-blaze-text underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunburst rounded-sm"
                                >
                                  For more information, visit SarasotaJazzFestival.com
                                </a>
                              </p>
                            )}

                            {ensembleText && (
                              <p className="font-lato text-white/70 text-sm mb-2">
                                SCD&apos;s studio is home to the{' '}
                                <a
                                  href={org.ensembleLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label="Sarasota Contemporary Dance Ensemble (opens in new tab)"
                                  className="text-sunburst hover:text-blaze-text underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunburst rounded-sm"
                                >
                                  Sarasota Contemporary Dance Ensemble (SCDE)
                                </a>{' '}
                                for aspiring dancers.
                              </p>
                            )}

                            {danceForJoyText && (
                              <p className="font-lato text-white/70 text-sm mb-2">
                                <a
                                  href={org.danceForJoyLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label="SCD's Dance for Joy class (opens in new tab)"
                                  className="text-sunburst hover:text-blaze-text underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunburst rounded-sm"
                                >
                                  SCD&apos;s &quot;Dance for Joy&quot; class
                                </a>{' '}
                                {danceForJoyText}
                              </p>
                            )}

                            {seasonText && <p className="font-lato text-white/70 text-sm mb-2">{seasonText}</p>}
                            {communityText && <p className="font-lato text-white/70 text-sm mb-2">{communityText}</p>}
                            {thisYearText && <p className="font-lato text-white/70 text-sm mb-2">{thisYearText}</p>}
                            {directorText && <p className="font-lato text-white/70 text-sm mb-2">{directorText}</p>}
                            {specialtyText && <p className="font-lato text-white/70 text-sm mb-2">{specialtyText}</p>}
                            {outreachText && <p className="font-lato text-white/70 text-sm mb-2">{outreachText}</p>}

                            {org.seasonLink && (
                              <p className="font-lato text-white/70 text-sm mb-4">
                                <a
                                  href={org.seasonLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label="Learn more about their 16th season (opens in new tab)"
                                  className="text-sunburst hover:text-blaze-text underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunburst rounded-sm"
                                >
                                  Learn more about their 16th season
                                </a>
                              </p>
                            )}

                            {highlights.length > 0 && (
                              <ul role="list" aria-label={`${name} highlights`} className="flex flex-wrap gap-2 mb-6">
                                {highlights.map((highlight, i) => (
                                  <li
                                    key={i}
                                    className={`px-3 py-1 rounded-full text-sm font-changa uppercase tracking-wider bg-linear-to-r ${org.color} text-white`}
                                  >
                                    {highlight}
                                  </li>
                                ))}
                              </ul>
                            )}

                            <address className="not-italic space-y-2 font-lato text-sm text-white/60 border-t border-white/10 pt-4">
                              <div className="flex items-start gap-2">
                                <MapPin className="w-3 h-3 shrink-0 mt-0.5 text-blaze-text" aria-hidden="true" />
                                <span className="leading-tight">{address}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="w-3 h-3 shrink-0 text-blaze-text" aria-hidden="true" />

                                <a
                                  href={`tel:${phone?.replace(/\D/g, '')}`}
                                  aria-label={`Call ${name} at ${phone}`}
                                  className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze rounded-sm"
                                >
                                  {phone}
                                </a>
                              </div>
                              <div className="flex items-center gap-2">
                                <ExternalLink className="w-3 h-3 shrink-0 text-blaze-text" aria-hidden="true" />

                                <a
                                  href={websiteUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label={`Visit ${name} at ${website} (opens in new tab)`}
                                  className="text-sunburst hover:text-white transition-colors truncate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunburst rounded-sm"
                                >
                                  {website}
                                </a>
                              </div>
                            </address>
                          </div>
                        </div>
                      </article>
                    </motion.li>
                  )
                })}
              </ul>
            </section>

            <div data-tockify-component="calendar" data-tockify-calendar="hiddengems" />
          </div>
        </div>
      </div>
    </main>
  )
}
