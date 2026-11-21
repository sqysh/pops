'use client'

import CompactPageHero from '@/app/(public)/_components/CompactPageHero'
import { FundCard } from '@/app/(public)/donate/_components/FundCard'
import { Phone } from 'lucide-react'
import { pageCopy } from '@/app/lib/page-content/copy'
import { pageContent } from '@/app/lib/constants/page-content/donate'

const buildFunds = ({ t, list }: ReturnType<typeof pageCopy>) => [
  {
    id: 'general',
    label: t('donate_general_label'),
    title: t('donate_general_title'),
    description: t('donate_general_description'),
    href: 'https://thepopsorchestra.app.getcuebox.com/o/21NL0B8D/donate/6ZG83S9R',
    cta: t('donate_general_cta'),
    accent: 'border-primary-dark/40 hover:border-primary-dark',
    labelColor: 'text-primary-dark',
    image: '/images/funds-1.png'
  },
  {
    id: 'chair',
    label: t('donate_chair_label'),
    title: t('donate_chair_title'),
    description: t('donate_chair_description'),
    href: 'https://thepopsorchestra.app.getcuebox.com/o/21NL0B8D/donate/C4XKQ47C',
    cta: t('donate_chair_cta'),
    accent: 'border-violet-500/40 hover:border-violet-500',
    labelColor: 'text-violet-400',
    image: '/images/funds-2.png'
  },
  {
    id: 'education',
    label: t('donate_education_label'),
    title: t('donate_education_title'),
    description: t('donate_education_description'),
    href: 'https://thepopsorchestra.app.getcuebox.com/o/21NL0B8D/donate/QPC6YLYC',
    cta: t('donate_education_cta'),
    accent: 'border-sky-500/40 hover:border-sky-500',
    labelColor: 'text-sky-400',
    note: t('donate_education_note'),
    image: '/images/funds-3.png'
  },
  {
    id: 'sponsorships',
    label: t('donate_sponsorships_label'),
    title: t('donate_sponsorships_title'),
    description: t('donate_sponsorships_description'),
    href: 'https://thepopsorchestra.app.getcuebox.com/o/21NL0B8D/donate/G2WKC0X8',
    cta: t('donate_sponsorships_cta'),
    accent: 'border-amber-500/40 hover:border-amber-500',
    labelColor: 'text-amber-400',
    tiers: [
      {
        label: t('donate_sponsorships_tier_1_label'),
        amount: t('donate_sponsorships_tier_1_amount')
      },
      {
        label: t('donate_sponsorships_tier_2_label'),
        amount: t('donate_sponsorships_tier_2_amount'),
        note: t('donate_sponsorships_tier_2_note')
      },
      {
        label: t('donate_sponsorships_tier_3_label'),
        amount: t('donate_sponsorships_tier_3_amount'),
        note: t('donate_sponsorships_tier_3_note')
      },
      {
        label: t('donate_sponsorships_tier_4_label'),
        amount: t('donate_sponsorships_tier_4_amount')
      },
      {
        label: t('donate_sponsorships_tier_5_label'),
        amount: t('donate_sponsorships_tier_5_amount')
      }
    ],
    image: '/images/funds-4.png'
  },
  {
    id: 'advertising',
    label: t('donate_advertising_label'),
    title: t('donate_advertising_title'),
    description: t('donate_advertising_description'),
    href: 'https://thepopsorchestra.app.getcuebox.com/o/21NL0B8D/donate/VCC335D5',
    cta: t('donate_advertising_cta'),
    accent: 'border-emerald-500/40 hover:border-emerald-500',
    labelColor: 'text-emerald-400',
    adOptions: [
      {
        size: t('donate_advertising_option_1_size'),
        note: t('donate_advertising_option_1_note'),
        price: t('donate_advertising_option_1_price')
      },
      {
        size: t('donate_advertising_option_2_size'),
        note: t('donate_advertising_option_2_note'),
        price: t('donate_advertising_option_2_price')
      },
      {
        size: t('donate_advertising_option_3_size'),
        note: t('donate_advertising_option_3_note'),
        price: t('donate_advertising_option_3_price')
      }
    ],
    image: '/images/funds-5.png'
  },
  {
    id: 'legacy',
    image: '/images/funds-6.png',
    label: t('donate_legacy_label'),
    title: t('donate_legacy_title'),
    description: t('donate_legacy_description'),
    href: 'mailto:Melissa@ThePopsOrchestra.org',
    cta: t('donate_legacy_cta'),
    top: 'bg-white/20',
    label_color: 'text-white/50',
    btn: 'bg-white/10 hover:bg-white/20 text-white border border-white/20',
    border: 'hover:border-white/20',
    extras: list('donate_legacy_extras'),
    note: t('donate_legacy_note')
  }
]

export default function DonateClient({ content }: { content: unknown }) {
  const copy = pageCopy(content, pageContent)
  const { t } = copy
  const FUNDS = buildFunds(copy)

  return (
    <main id="main-content">
      <CompactPageHero
        homeLabel={t('donate_hero_home_crumb')}
        breadcrumbLabel={t('donate_sr_breadcrumb')}
        eyebrow={t('donate_hero_overline')}
        breadcrumb={t('donate_hero_breadcrumb')}
        heading={t('donate_hero_title')}
        description={t('donate_hero_description')}
      />

      {/* Intro */}
      <section className="relative max-w-5xl mx-auto px-4 760:px-6 py-16 760:py-24 overflow-hidden">
        <div className="relative max-w-5xl mx-auto flex flex-col 760:flex-row gap-12 760:gap-20 items-start">
          {/* Left — main text */}
          <div className="flex-1 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-5 h-px bg-blaze shrink-0" aria-hidden="true" />
              <span className="font-changa text-sm uppercase tracking-[0.3em] text-white/30">{t('donate_ways_eyebrow')}</span>
            </div>
            <p className="font-lato text-white/70 text-base 760:text-lg leading-relaxed">{t('donate_ways_body')}</p>
          </div>

          {/* Divider */}
          <div className="hidden 760:block w-px self-stretch bg-white/10 shrink-0" aria-hidden="true" />

          {/* Right — legacy gift */}
          <div className="flex-1 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-5 h-px bg-blaze shrink-0" aria-hidden="true" />
              <span className="font-changa text-sm uppercase tracking-[0.3em] text-blaze-text">{t('donate_legacy_eyebrow')}</span>
            </div>
            <p className="font-lato text-white/70 text-base 760:text-lg leading-relaxed">{t('donate_legacy_intro')}</p>
            <div className="flex flex-col gap-2 pt-1">
              <a
                href="mailto:Melissa@ThePopsOrchestra.org"
                className="font-changa text-sm uppercase tracking-widest text-blaze-text hover:text-white transition-colors"
              >
                {t('donate_legacy_email')}
              </a>

              <a
                href="tel:9419267677"
                className="font-changa text-sm uppercase tracking-widest text-white hover:text-white transition-colors"
              >
                {t('donate_legacy_phone')}
              </a>
              <span className="font-lato text-sm text-white/70 italic pt-1">{t('donate_legacy_contact_name')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Fund cards */}
      <section className="max-w-5xl mx-auto px-4 760:px-6 py-12 760:py-16">
        <div className="grid grid-cols-1 760:grid-cols-2 1200:grid-cols-3 gap-4 760:gap-5">
          {FUNDS.map((fund) => (
            <FundCard key={fund.id} fund={fund} content={content} />
          ))}
        </div>
      </section>

      {/* Questions */}
      <section className="border-t border-border-dark bg-surface-dark/30 px-6 py-10 760:py-12">
        <div className="max-w-5xl mx-auto px-6 flex flex-col 760:flex-row 760:items-center 760:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-mono uppercase tracking-[0.2em] text-primary-dark">
              {t('donate_questions_heading')}
            </span>
            <p className="font-lato text-text-dark/90 text-sm">{t('donate_questions_body')}</p>
          </div>
          <div className="flex flex-col 480:flex-row gap-3">
            <a
              href="tel:9419267677"
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-border-dark text-sm font-mono uppercase tracking-widest text-muted-dark hover:text-text-dark hover:border-muted-dark/40 transition-colors"
            >
              <Phone className="w-3 h-3" />
              {t('donate_questions_phone')}
            </a>
          </div>
        </div>
      </section>

      {/* Florida statute */}
      <section className="border-t border-border-dark/40 px-6 py-6">
        <p className="text-sm font-mono text-muted-dark/80 leading-relaxed max-w-4xl mx-auto uppercase tracking-wider">
          {t('donate_legal_notice')}
        </p>
      </section>
    </main>
  )
}
