'use client'

import Breadcrumb from '@/app/components/common/Breadcrumb'
import Picture from '@/app/components/common/Picture'
import { ArrowRight, Lock, Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { PageHero } from '@/app/components/common/PageHero'

export const StudentScholarshipsClient = ({ data }) => {
  const field = (id: string) => data?.content?.find((item) => item.id === id)?.value ?? ''

  return (
    <main id="main-content">
      <Breadcrumb breadcrumb="Student Scholarships" />

      <div className="relative px-4 990:px-12 xl:px-4">
        {/* Page Header */}
        <PageHero
          eyebrow={field('scholarships_eyebrow')}
          heading={field('scholarships_heading')}
          subheading={field('scholarships_subheading')}
        />

        {/* Main Content */}
        <section aria-labelledby="scholarships-heading" className="relative z-10 py-20 990:py-32">
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
                  src="/images/m-9.jpg"
                  alt="Student scholarship recipients performing with The Pops Orchestra"
                  className="absolute inset-0 w-full h-full object-cover"
                  priority={true}
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
                      value: field('scholarships_stat_1_value'),
                      label: field('scholarships_stat_1_label')
                    },
                    {
                      value: field('scholarships_stat_2_value'),
                      label: field('scholarships_stat_2_label')
                    }
                  ].map((stat) => (
                    <div
                      key={stat.label}
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
                  <span className="font-changa text-sm uppercase tracking-[0.25em] text-blaze-text">Our Program</span>
                </div>

                <h2
                  id="scholarships-heading"
                  className="font-changa text-3xl 430:text-4xl 990:text-5xl text-white leading-tight mb-6"
                >
                  {field('scholarships_heading')}
                </h2>

                <p className="font-lato text-white/60 text-sm 430:text-base leading-relaxed mb-10 border-l-2 border-blaze pl-5">
                  {field('scholarships_paragraph')}
                </p>

                {/* Metadata rows */}
                <ul
                  role="list"
                  aria-label="Scholarship program details"
                  className="flex flex-col divide-y divide-white/10 mb-10"
                >
                  {[
                    {
                      label: field('scholarships_card_1_title'),
                      value: field('scholarships_card_1_description')
                    },
                    {
                      label: field('scholarships_card_2_title'),
                      value: field('scholarships_card_2_description')
                    },
                    {
                      label: field('scholarships_card_3_title'),
                      value: field('scholarships_card_3_description')
                    }
                  ].map((row) => (
                    <li key={row.label} className="flex items-start gap-3 py-3">
                      <span className="font-changa text-sm uppercase tracking-widest text-blaze-text w-24 shrink-0 pt-0.5">
                        {row.label}
                      </span>
                      <span className="font-lato text-white/70 text-sm leading-relaxed">{row.value}</span>
                    </li>
                  ))}
                </ul>

                {/* Trust badges */}
                <div className="flex flex-wrap items-center gap-5 mb-10">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-400 shrink-0" aria-hidden="true" />
                    <span className="font-lato text-sm text-white/60 uppercase tracking-wider">
                      {field('scholarships_trust_badge_1')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-blue-400 shrink-0" aria-hidden="true" />
                    <span className="font-lato text-sm text-white/60 uppercase tracking-wider">
                      {field('scholarships_trust_badge_2')}
                    </span>
                  </div>
                </div>

                <Link
                  href="/donate"
                  rel="noopener noreferrer"
                  aria-label={`${field('scholarships_donation_button')} — opens in new tab`}
                  className="group inline-flex items-center gap-3 bg-blaze hover:bg-blazehover text-white px-8 py-4 font-changa text-sm uppercase tracking-widest transition-colors duration-300 w-full 430:w-fit justify-center 430:justify-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  <span className="whitespace-nowrap">{field('scholarships_donation_button')}</span>
                  <ArrowRight
                    className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform"
                    aria-hidden="true"
                  />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
