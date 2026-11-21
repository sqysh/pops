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
const BubblesBashPromo = dynamic(() =>
  import('@/app/(public)/(home)/_components/BubblesBashPromo').then((m) => m.BubblesBashPromo)
)
const HomeHero = dynamic(() => import('@/app/(public)/(home)/_components/HomeHero').then((m) => m.HomeHero))

export function HomeClient({ pageData, sponsors, testimonials, events, news, concertsPageLive, bubblesBashContent }) {
  return (
    <>
      <HomeHero content={pageData} />
      {bubblesBashContent && <BubblesBashPromo content={bubblesBashContent} />}
      <SeasonSection concertsPageLive={concertsPageLive} content={pageData} />
      <ContactUsBlock content={pageData} />
      <SponsorsBlock content={pageData} sponsors={sponsors} />
      <KeepUpToDateBlock content={pageData} />
      <TestimonialsBlock testimonials={testimonials} content={pageData} />
      <EventsBlock events={events} content={pageData} />
      <NewsBlock news={news} content={pageData} />
    </>
  )
}
