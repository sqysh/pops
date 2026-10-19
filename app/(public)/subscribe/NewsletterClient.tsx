'use client'

import CompactPageHero from '@/app/(public)/_components/CompactPageHero'
import NewsletterForm from '@/app/(public)/subscribe/_components/NewsletterForm'

export function NewsletterClient({ data }) {
  const field = (id: string) => data?.content?.find((item) => item.id === id)?.value ?? ''
  return (
    <main id="main-content">
      <CompactPageHero
        breadcrumb="Newsletter"
        heading={field('connect_with_us_heading')}
        description={field('connect_with_us_subheading')}
      />
      <div className="relative px-4 990:px-12 xl:px-4">
        <NewsletterForm />
      </div>
    </main>
  )
}
