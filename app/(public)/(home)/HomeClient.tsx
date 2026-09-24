'use client'

import dynamic from 'next/dynamic'

const SeasonSection = dynamic(() => import('@/app/(public)/(home)/_components/SeasonDates').then((m) => m.SeasonDates), {
  ssr: false
})
const ContactUsBlock = dynamic(() => import('@/app/(public)/(home)/_components/ContactUsBlock').then((m) => m.ContactUsBlock))
const SponsorsBlock = dynamic(() => import('@/app/(public)/(home)/_components/SponsorsBlock').then((m) => m.SponsorsBlock))
const KeepUpToDateBlock = dynamic(() =>
  import('@/app/(public)/(home)/_components/KeepUpToDateBlock').then((m) => m.KeepUpToDateBlock)
)
const TestimonialsBlock = dynamic(() =>
  import('@/app/(public)/(home)/_components/TestimonialsBlock').then((m) => m.TestimonialsBlock)
)
const EventsBlock = dynamic(() => import('@/app/(public)/(home)/_components/EventsBlock').then((m) => m.EventsBlock))
const NewsBlock = dynamic(() => import('@/app/(public)/(home)/_components/NewsBlock').then((m) => m.NewsBlock))
const HomeHero = dynamic(() => import('@/app/(public)/(home)/_components/HomeHero').then((m) => m.HomeHero))

export function HomeClient({ pageData, sponsors, testimonials, events, news, concertsPageLive }) {
  return (
    <>
      <HomeHero pageData={pageData} />
      <SeasonSection concertsPageLive={concertsPageLive} />
      <ContactUsBlock data={pageData} />
      <SponsorsBlock pageData={pageData} sponsors={sponsors} />
      <KeepUpToDateBlock pageData={pageData} />
      <TestimonialsBlock testimonials={testimonials} />
      <EventsBlock events={events} />
      <NewsBlock news={news} />
    </>
  )
}
