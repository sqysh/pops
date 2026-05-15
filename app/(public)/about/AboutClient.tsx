'use client'

import Breadcrumb from '@/app/components/common/Breadcrumb'
import Picture from '@/app/components/common/Picture'
import { motion } from 'framer-motion'

export const AboutClient = ({ data }) => {
  const field = (id: string) => data?.find((item) => item.id === id)?.value ?? ''

  const bodyParagraphs = [
    field('about_paragraph_1'),
    field('about_paragraph_2'),
    field('about_paragraph_3'),
    field('about_paragraph_4')
  ].filter(Boolean)

  const additionalDetails = data?.filter((item) => item.section === 'additional_details') ?? []

  return (
    <main id="main-content">
      <Breadcrumb breadcrumb="About The Pops" />

      <div className="relative bg-black">
        <div
          className="absolute inset-0 w-full h-full bg-no-repeat bg-center bg-cover opacity-10"
          style={{ backgroundImage: `url('/images/bio-bg.webp')`, backgroundAttachment: 'fixed' }}
          aria-hidden="true"
        />

        <div className="relative z-10 px-4 990:px-12 xl:px-4">
          <div className="max-w-[320px] 430:max-w-130 760:max-w-xl 990:max-w-200 1200:max-w-screen-1160 1590:max-w-screen-7xl mx-auto">
            {/* Page Header */}
            <header className="w-full text-center flex flex-col items-center pt-32 pb-20 border-b border-white/10">
              <p className="font-changa text-sm uppercase tracking-[0.3em] text-blaze-text mb-4">The Pops Orchestra</p>
              <div className="flex items-center gap-3 430:gap-4 justify-center mb-4">
                <div className="w-8 430:w-16 h-px bg-blaze shrink-0" aria-hidden="true" />
                <h1 className="text-4xl 430:text-5xl sm:text-6xl font-changa text-white leading-none">
                  About The Pops
                </h1>
                <div className="w-8 430:w-16 h-px bg-blaze shrink-0" aria-hidden="true" />
              </div>
              <div className="w-16 h-px bg-blaze mx-auto mt-2 mb-6" aria-hidden="true" />
              <p className="font-lato text-white/50 text-sm 430:text-base max-w-xl leading-relaxed">
                {field('about_aside_subheading')}
              </p>
            </header>

            {/* Main content */}
            <section
              aria-labelledby="about-heading"
              className="grid grid-cols-1 1200:grid-cols-12 gap-px bg-white/10 my-20 990:my-32"
            >
              {/* Sidebar */}
              <aside
                aria-label="About summary"
                className="order-2 1200:order-1 1200:col-span-4 bg-black p-7 430:p-10 flex flex-col gap-8"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-6 h-px bg-blaze" aria-hidden="true" />
                    <span className="font-changa text-sm uppercase tracking-[0.25em] text-blaze-text">About</span>
                  </div>
                  <h2 id="about-heading" className="font-changa text-2xl 430:text-3xl text-white leading-tight mb-4">
                    {field('about_aside_heading')}
                  </h2>
                  <div className="w-8 h-px bg-blaze mb-6" aria-hidden="true" />
                  <p className="font-lato text-white text-sm 430:text-base leading-relaxed border-l-2 border-blaze pl-5">
                    {field('about_aside_paragraph')}
                  </p>
                </div>

                {/* Conductor portrait */}
                <div className="border border-white/10">
                  <Picture
                    src="/images/about-1.jpg"
                    alt="About The Pops Orchestra"
                    className="w-full h-auto object-contain"
                    priority={false}
                  />
                  <div className="h-0.5 bg-blaze" aria-hidden="true" />
                </div>

                {/* Additional details */}
                {additionalDetails.length > 0 && (
                  <ul role="list" aria-label="Additional details" className="flex flex-col divide-y divide-white/10">
                    {additionalDetails.map((detail) => (
                      <li
                        key={detail.id}
                        className="py-3 font-changa text-sm font-medium tracking-widest text-sunburst uppercase"
                      >
                        {detail.value}
                      </li>
                    ))}
                  </ul>
                )}
              </aside>

              {/* Body */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="order-1 1200:order-2 1200:col-span-8 bg-black p-7 430:p-10 990:p-14"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-6 h-px bg-blaze" aria-hidden="true" />
                  <span className="font-changa text-sm uppercase tracking-[0.25em] text-blaze-text">Our Story</span>
                </div>

                <div className="flex flex-col gap-6">
                  {bodyParagraphs.map((paragraph, index) => (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`font-lato text-white text-sm 430:text-base leading-relaxed ${
                        index === 0 ? 'border-l-2 border-blaze pl-5 text-white/80' : ''
                      }`}
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </div>
              </motion.div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
