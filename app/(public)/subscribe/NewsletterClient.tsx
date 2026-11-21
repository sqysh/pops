'use client'

import CompactPageHero from '@/app/(public)/_components/CompactPageHero'
import { pageCopy } from '@/app/lib/page-content/copy'
import { pageContent } from '@/app/lib/constants/page-content/subscribe'
import NewsletterForm from '@/app/(public)/subscribe/_components/NewsletterForm'

export function NewsletterClient({ data }: { data?: { content?: unknown } | null }) {
  const content = data?.content
  const { t } = pageCopy(content, pageContent)

  return (
    <main id="main-content">
      <CompactPageHero
        homeLabel={t('newsletter_hero_home_crumb')}
        breadcrumbLabel={t('newsletter_sr_breadcrumb')}
        breadcrumb={t('newsletter_hero_breadcrumb')}
        eyebrow={t('newsletter_hero_overline')}
        heading={t('connect_with_us_heading')}
        description={t('connect_with_us_subheading')}
      />
      <div className="relative px-4 990:px-12 xl:px-4">
        <NewsletterForm content={content} />
      </div>
    </main>
  )
}
