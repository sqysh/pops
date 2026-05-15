'use client'

import Link from 'next/link'
import { ArrowRightIcon } from 'lucide-react'

export const KeepUpToDateBlock = ({ pageData }) => {
  if (!pageData || !Array.isArray(pageData)) return null

  const contactData = pageData?.filter((page) => page?.id?.includes('contact'))
  const contactsData = contactData.reduce((acc, field) => {
    const key = field.id.replace('contact_', '')
    acc[key] = field.value
    return acc
  }, {})

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="relative px-4 990:px-12 xl:px-4 py-28 990:py-40 bg-black overflow-hidden"
    >
      {/* Parallax backgrounds */}
      <div
        className="absolute inset-0 block"
        aria-hidden="true"
        style={{
          backgroundImage: `url('/images/m-2.webp')`,
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
      <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black" aria-hidden="true" />
      <div className="relative z-10 max-w-[320px] 430:max-w-130 760:max-w-xl 990:max-w-200 1200:max-w-screen-1160 1590:max-w-300 mx-auto">
        <div className="grid grid-cols-1 990:grid-cols-12 gap-px bg-white/10">
          {/* Left — heading */}
          <div className="990:col-span-7 bg-black p-8 430:p-10 990:p-14 flex flex-col justify-center">
            <p className="font-changa text-sm uppercase tracking-[0.3em] text-blaze-text mb-4">Stay Connected</p>
            <h2
              id="newsletter-heading"
              className="font-changa text-3xl 430:text-4xl 990:text-5xl text-white leading-none mb-4"
            >
              {contactsData?.heading}
            </h2>
            <div className="w-12 h-px bg-blaze mb-6" aria-hidden="true" />
            <p className="font-lato text-white/80 text-sm 430:text-base leading-relaxed border-l-2 border-blaze pl-5 max-w-lg">
              {contactsData?.subheading}
            </p>
          </div>

          {/* Right — CTA */}
          <div className="990:col-span-5 bg-black p-8 430:p-10 990:p-14 flex flex-col items-start 990:items-center justify-center gap-6 border-t border-white/10 990:border-t-0 990:border-l">
            <div className="w-full h-px bg-white/10 990:hidden" aria-hidden="true" />
            <Link
              href={contactsData?.buttonHref || '#'}
              aria-label={`${contactsData?.buttonText} — sign up for our newsletter`}
              className="group inline-flex items-center gap-3 bg-blaze hover:bg-blazehover text-white px-8 py-4 font-changa uppercase tracking-widest text-sm transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black  w-full 990:w-auto justify-center 990:justify-start"
            >
              <span>{contactsData?.buttonText}</span>
              <ArrowRightIcon
                className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </Link>
            <p className="font-lato text-white/70 text-sm uppercase tracking-widest">No spam, ever.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
