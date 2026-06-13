'use client'

import dynamic from 'next/dynamic'
import HomeHero from '../home/HomeHero'
import { useRef } from 'react'

const SeasonSection = dynamic(() => import('@/app/components/home/SeasonDates').then((m) => m.SeasonDates), {
  ssr: false
})
const ContactUsBlock = dynamic(() => import('@/app/components/home/ContactUsBlock').then((m) => m.ContactUsBlock))
const SponsorsBlock = dynamic(() => import('@/app/components/home/SponsorsBlock').then((m) => m.SponsorsBlock))
const KeepUpToDateBlock = dynamic(() =>
  import('@/app/components/home/KeepUpToDateBlock').then((m) => m.KeepUpToDateBlock)
)
const TestimonialsBlock = dynamic(() =>
  import('@/app/components/home/TestimonialsBlock').then((m) => m.TestimonialsBlock)
)
const EventsBlock = dynamic(() => import('@/app/components/home/EventsBlock').then((m) => m.EventsBlock))
const NewsBlock = dynamic(() => import('@/app/components/home/NewsBlock').then((m) => m.NewsBlock))
const FireworksBanner = dynamic(() => import('@/app/components/home/FireworksBanner').then((m) => m.FireworksBanner))

export function HomeClient({ pageData, sponsors, testimonials, events, news }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <HomeHero pageData={pageData} ref={scrollRef} />
      <FireworksBanner />
      <div ref={scrollRef}>
        <SeasonSection />
      </div>
      <ContactUsBlock data={pageData} />
      <SponsorsBlock pageData={pageData} sponsors={sponsors} />
      <KeepUpToDateBlock pageData={pageData} />
      <TestimonialsBlock testimonials={testimonials} />
      <EventsBlock events={events} />
      <NewsBlock news={news} />
    </>
  )
}
