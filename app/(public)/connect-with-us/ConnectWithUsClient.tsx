'use client'

import Breadcrumb from '@/app/components/common/Breadcrumb'
import { PageHero } from '@/app/components/common/PageHero'
import NewsletterForm from '@/app/components/forms/NewsletterForm'

export const ConnectWithUsClient = ({ data }) => {
  const field = (id: string) => data?.content?.find((item) => item.id === id)?.value ?? ''
  return (
    <>
      <Breadcrumb breadcrumb="Newsletter" />
      <div className="relative px-4 990:px-12 xl:px-4">
        {/* Page Header */}
        <PageHero
          eyebrow="The Pops Orchestra"
          heading={field('connect_with_us_heading')}
          subheading={field('connect_with_us_subheading')}
        />

        <NewsletterForm />
      </div>
    </>
  )
}
