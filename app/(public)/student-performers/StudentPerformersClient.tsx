'use client'

import CompactPageHero from '@/app/(public)/_components/CompactPageHero'
import Picture from '@/components/common/Picture'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { pageCopy } from '@/app/lib/page-content/copy'
import { pageContent } from '@/app/lib/constants/page-content/student-performers'

export const StudentPerformersClient = ({ data }) => {
  const { t } = pageCopy(data?.content, pageContent)

  return (
    <main id="main-content">
      <CompactPageHero
        homeLabel={t('student_performers_hero_home_crumb')}
        breadcrumbLabel={t('student_performers_sr_breadcrumb')}
        breadcrumb={t('student_performers_breadcrumb')}
        eyebrow={t('student_performers_eyebrow')}
        heading={t('student_performers_heading')}
        description={t('student_performers_subheading')}
      />

      <div className="relative min-h-dvh px-4 990:px-12 xl:px-4">
        {/* Main Content */}
        <section aria-labelledby="student-performers-heading" className="relative z-10 py-20 990:py-32">
          <div className="max-w-[320px] 430:max-w-130 760:max-w-xl 990:max-w-200 1200:max-w-screen-1160 mx-auto">
            <div className="grid grid-cols-1 1200:grid-cols-2 gap-0 items-stretch">
              {/* Image Side */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="relative order-2 1200:order-1 overflow-hidden min-h-80 430:min-h-96 1200:min-h-0"
              >
                <Picture
                  src="/images/edu-1.jpg"
                  alt={t('student_performers_image_alt')}
                  className="absolute inset-0 w-full h-full object-cover"
                  priority={false}
                />
                <div
                  className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-black hidden 1200:block"
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent block 1200:hidden"
                  aria-hidden="true"
                />

                {/* Stat badges */}
                <div className="absolute bottom-6 left-6 z-10 flex flex-col gap-3">
                  {[
                    {
                      value: t('student_performers_stat_1_value'),
                      label: t('student_performers_stat_1_label')
                    },
                    {
                      value: t('student_performers_stat_2_value'),
                      label: t('student_performers_stat_2_label')
                    }
                  ].map((stat, s) => (
                    <div
                      key={s}
                      className="flex items-center gap-3 bg-black/70 backdrop-blur-sm px-4 py-3 border-l-2 border-blaze"
                    >
                      <span className="font-changa text-2xl text-blaze-text leading-none">{stat.value}</span>
                      <span className="font-lato text-white/70 text-sm uppercase tracking-widest">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Text Side */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="order-1 1200:order-2 bg-black/60 backdrop-blur-sm py-12 990:py-16 flex flex-col justify-center border-t border-white/10 1200:border-t-0 1200:border-l 1200:pl-12"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-6 h-px bg-blaze" aria-hidden="true" />
                  <span className="font-changa text-sm uppercase tracking-[0.25em] text-blaze-text">
                    {t('student_performers_section_eyebrow')}
                  </span>
                </div>

                <h2
                  id="student-performers-heading"
                  className="font-changa text-3xl 430:text-4xl 990:text-5xl text-white leading-tight mb-6"
                >
                  {t('student_performers_section_heading')}
                </h2>

                <p className="font-lato text-white/60 text-sm 430:text-base leading-relaxed mb-10 border-l-2 border-blaze pl-5">
                  {t('student_performers_paragraph')}
                </p>

                {/* Metadata rows */}
                <ul
                  role="list"
                  aria-label={t('student_performers_details_list_label')}
                  className="flex flex-col divide-y divide-white/10 mb-10"
                >
                  {[
                    {
                      label: t('student_performers_meta_1_label'),
                      value: t('student_performers_meta_1_value')
                    },
                    {
                      label: t('student_performers_meta_2_label'),
                      value: t('student_performers_meta_2_value')
                    },
                    {
                      label: t('student_performers_meta_3_label'),
                      value: t('student_performers_meta_3_value')
                    },
                    {
                      label: t('student_performers_meta_4_label'),
                      value: t('student_performers_meta_4_value')
                    }
                  ].map((row, r) => (
                    <li key={r} className="flex items-start gap-3 py-3">
                      <span className="font-changa text-sm uppercase tracking-widest text-blaze-text w-24 shrink-0 pt-0.5">
                        {row.label}
                      </span>
                      <span className="font-lato text-white/70 text-sm leading-relaxed">{row.value}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/donate"
                  rel="noopener noreferrer"
                  aria-label={t('student_performers_donation_link_label', { button: t('student_performers_donation_button') })}
                  className="group inline-flex items-center gap-3 bg-blaze hover:bg-blazehover text-white px-8 py-4 font-changa text-sm uppercase tracking-widest transition-colors duration-300 w-full 430:w-fit justify-center 430:justify-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  <span className="whitespace-nowrap">{t('student_performers_donation_button')}</span>
                  <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
