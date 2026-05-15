'use client'

import Breadcrumb from '@/app/components/common/Breadcrumb'
import Picture from '@/app/components/common/Picture'
import { Download } from 'lucide-react'

export const AdvertiseWithUsClient = ({ data }) => {
  const field = (id: string) => data?.find((item) => item.id === id)?.value ?? ''

  const benefits = [
    { heading: field('advertise_benefit_reach_heading'), description: field('advertise_benefit_reach_description') },
    {
      heading: field('advertise_benefit_recognition_heading'),
      description: field('advertise_benefit_recognition_description')
    },
    {
      heading: field('advertise_benefit_alignment_heading'),
      description: field('advertise_benefit_alignment_description')
    },
    {
      heading: field('advertise_benefit_visibility_heading'),
      description: field('advertise_benefit_visibility_description')
    },
    {
      heading: field('advertise_benefit_special_invitations_heading'),
      description: field('advertise_benefit_special_invitations_description')
    },
    {
      heading: field('advertise_benefit_who_benefits_heading'),
      description: field('advertise_benefit_who_benefits_description')
    }
  ]

  const stats = [1, 2, 3, 4, 5].map((num) => {
    const valueMap: Record<number, string> = {
      1: 'advertise_stat_concert_attendees_value',
      2: 'advertise_stat_mailchimp_value',
      3: 'advertise_stat_email_open_rate_value',
      4: 'advertise_stat_social_followers_value',
      5: 'advertise_stat_social_subscribers_value'
    }
    const labelMap: Record<number, string> = {
      1: 'advertise_stat_concert_attendees_label',
      2: 'advertise_stat_mailchimp_label',
      3: 'advertise_stat_email_open_rate_label',
      4: 'advertise_stat_social_followers_label',
      5: 'advertise_stat_social_subscribers_label'
    }
    return { value: field(valueMap[num]), label: field(labelMap[num]) }
  })

  const artworkSpecs = [
    field('advertise_artwork_spec_1'),
    field('advertise_artwork_spec_2'),
    field('advertise_artwork_spec_3')
  ]

  const fullPageRates = [
    { name: 'Outside Back Cover*', price: '$1,250', spec: '4-color | 5.75"w x 8.75"h' },
    { name: 'Inside Front Cover*', price: '$1,000', spec: '4-color | 5.75"w x 8.75"h' },
    { name: 'Inside Back Cover*', price: '$1,000', spec: '4-color | 5.75"w x 8.75"h' },
    { name: 'Regular*', price: '$800', spec: '4-color | 4.5"w x 7.5"h' },
    { name: 'Regular*', price: '$750', spec: 'B&W | 4.5"w x 7.5"h' }
  ]

  const halfPageRates = [
    { name: 'Horizontal**', price: '$350', spec: '4-color | 4.5"w x 3.625"h' },
    { name: 'Horizontal**', price: '$300', spec: 'B&W | 4.5"w x 3.625"h' }
  ]

  const quarterPageRates = [
    { name: 'Vertical', price: '$200', spec: '4-color | 2.25"w x 3.625"h' },
    { name: 'Vertical', price: '$150', spec: 'B&W | 2.25"w x 3.625"h' },
    { name: 'Horizontal**', price: '$200', spec: '4-color | 4.5"w x 1.75"h' },
    { name: 'Horizontal**', price: '$150', spec: 'B&W | 4.5"w x 1.75"h' }
  ]

  return (
    <main id="main-content">
      <Breadcrumb breadcrumb="Advertise With Us" />

      {/* ── Header ── */}
      <section className="relative px-4 990:px-12 xl:px-4 pt-28 pb-10 bg-black overflow-hidden border-b border-white/10">
        <div
          className="absolute inset-0 opacity-5 bg-no-repeat bg-center bg-cover"
          style={{ backgroundImage: `url('/images/bio-bg.webp')` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black via-transparent to-black" aria-hidden="true" />
        <div className="relative z-10 max-w-130 760:max-w-xl 990:max-w-200 1200:max-w-screen-1160 1590:max-w-7xl mx-auto flex flex-col items-center text-center">
          <p className="font-changa text-sm uppercase tracking-[0.3em] text-blaze-text mb-2">The Pops Orchestra</p>
          <h1 className="text-4xl sm:text-5xl font-changa text-white leading-none mb-3">Advertise With Us</h1>
          <div className="w-12 h-px bg-blaze mx-auto mb-3" aria-hidden="true" />
          <p className="font-lato text-white/80 text-sm max-w-xl leading-relaxed">{field('advertise_main_heading')}</p>
        </div>
      </section>

      {/* ── Body ── */}
      <div className="px-4 990:px-12 xl:px-4 py-12 bg-black">
        <div className="max-w-130 760:max-w-xl 990:max-w-200 1200:max-w-screen-1160 1590:max-w-7xl mx-auto flex flex-col gap-px bg-white/10">
          {/* ── Hero image ── */}
          <div className="bg-black">
            <Picture
              src="/images/awu.jpg"
              alt="The Pops Orchestra performing on stage"
              className="w-full aspect-video object-cover"
              priority
            />
          </div>

          {/* ── Benefits + Stats ── */}
          <div className="grid grid-cols-1 990:grid-cols-12 gap-px bg-white/10">
            {/* Benefits */}
            <section aria-labelledby="benefits-heading" className="990:col-span-8 bg-black p-5 990:p-10">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-4 h-px bg-blaze shrink-0" aria-hidden="true" />
                <h2 id="benefits-heading" className="font-changa text-sm uppercase tracking-[0.25em] text-blaze-text">
                  Why Advertise
                </h2>
              </div>
              <ul role="list" className="flex flex-col divide-y divide-white/10">
                {benefits.map((benefit, i) => (
                  <li key={i} className="py-4 first:pt-0 last:pb-0">
                    <h3 className="font-changa text-white text-base mb-1">{benefit.heading}</h3>
                    <p className="font-lato text-white/80 text-sm leading-relaxed">{benefit.description}</p>
                  </li>
                ))}
              </ul>
            </section>

            {/* Stats + Download */}
            <aside aria-label="Audience statistics" className="990:col-span-4 bg-black flex flex-col gap-px">
              {/* Stats */}
              <div className="bg-black p-5 990:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-4 h-px bg-blaze shrink-0" aria-hidden="true" />
                  <h2 className="font-changa text-sm uppercase tracking-[0.25em] text-blaze-text">
                    {field('advertise_stats_heading')}
                  </h2>
                </div>
                <dl className="flex flex-col divide-y divide-white/10">
                  {stats.map((stat, i) => (
                    <div key={i} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                      <dt className="font-lato text-white/70 text-sm">{stat.label}</dt>
                      <dd className="font-changa text-blaze-text text-lg shrink-0">{stat.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Download */}
              <div className="bg-black p-5 990:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-4 h-px bg-blaze shrink-0" aria-hidden="true" />
                  <h2 className="font-changa text-sm uppercase tracking-[0.25em] text-blaze-text">
                    {field('advertise_program_book_heading')}
                  </h2>
                </div>
                <p className="font-lato text-white/80 text-sm leading-relaxed mb-4">
                  {field('advertise_program_book_description')}
                </p>

                <a
                  href="/pdf/advertising.pdf"
                  download="Pops 2025-26 Advertising Form.pdf"
                  aria-label="Download the 2025-26 Season Rate Card PDF"
                  className="inline-flex items-center gap-2 px-4 py-2.5 border border-blaze/30 hover:border-blaze text-blaze-text hover:bg-blaze/10 font-changa text-sm uppercase tracking-[0.2em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
                >
                  <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  {field('advertise_program_book_download_label')}
                </a>
              </div>
            </aside>
          </div>

          {/* ── Rates ── */}
          <section aria-labelledby="rates-heading" className="bg-black p-5 990:p-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-4 h-px bg-blaze shrink-0" aria-hidden="true" />
              <h2 id="rates-heading" className="font-changa text-sm uppercase tracking-[0.25em] text-blaze-text">
                {field('advertise_rates_heading')}
              </h2>
            </div>

            <div className="grid grid-cols-1 760:grid-cols-3 gap-px bg-white/10">
              {/* Full page */}
              <div className="bg-black p-5">
                <h3 className="font-changa text-white text-sm uppercase tracking-[0.15em] mb-4 pb-3 border-b border-white/10">
                  {field('advertise_rates_full_page_heading')}
                </h3>
                <ul role="list" className="flex flex-col gap-3">
                  {fullPageRates.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start justify-between gap-4 py-2 border-b border-white/5 last:border-0"
                    >
                      <div className="min-w-0">
                        <p className="font-changa text-white text-sm">{item.name}</p>
                        <p className="font-mono text-sm text-white/40 mt-0.5">{item.spec}</p>
                      </div>
                      <span className="font-changa text-blaze-text text-sm shrink-0">{item.price}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Half page */}
              <div className="bg-black p-5">
                <h3 className="font-changa text-white text-sm uppercase tracking-[0.15em] mb-4 pb-3 border-b border-white/10">
                  {field('advertise_rates_half_page_heading')}
                </h3>
                <ul role="list" className="flex flex-col gap-3">
                  {halfPageRates.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start justify-between gap-4 py-2 border-b border-white/5 last:border-0"
                    >
                      <div className="min-w-0">
                        <p className="font-changa text-white text-sm">{item.name}</p>
                        <p className="font-mono text-sm text-white/40 mt-0.5">{item.spec}</p>
                      </div>
                      <span className="font-changa text-blaze-text text-sm shrink-0">{item.price}</span>
                    </li>
                  ))}
                </ul>

                {/* Quarter page in same column on desktop */}
                <h3 className="font-changa text-white text-sm uppercase tracking-[0.15em] mb-4 pb-3 border-b border-white/10 mt-8">
                  {field('advertise_rates_quarter_page_heading')}
                </h3>
                <ul role="list" className="flex flex-col gap-3">
                  {quarterPageRates.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start justify-between gap-4 py-2 border-b border-white/5 last:border-0"
                    >
                      <div className="min-w-0">
                        <p className="font-changa text-white text-sm">{item.name}</p>
                        <p className="font-mono text-sm text-white/40 mt-0.5">{item.spec}</p>
                      </div>
                      <span className="font-changa text-blaze-text text-sm shrink-0">{item.price}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Artwork specs + footnotes */}
              <div className="bg-black p-5">
                <h3 className="font-changa text-white text-sm uppercase tracking-[0.15em] mb-4 pb-3 border-b border-white/10">
                  {field('advertise_artwork_heading')}
                </h3>
                <ul role="list" className="flex flex-col gap-3 mb-6">
                  {artworkSpecs.map((spec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-blaze shrink-0 mt-2" aria-hidden="true" />
                      <span className="font-lato text-white/80 text-sm leading-relaxed">{spec}</span>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-white/10 pt-4 flex flex-col gap-2">
                  <p className="font-lato text-white/50 text-sm leading-relaxed">
                    {field('advertise_rates_footnote_1')}
                  </p>
                  <p className="font-lato text-white/50 text-sm leading-relaxed">
                    {field('advertise_rates_footnote_2')}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
