'use client'

import Link from 'next/link'
import { ArrowRightIcon, Mail, MapPin, Phone } from 'lucide-react'
import { motion } from 'framer-motion'

export const ContactUsBlock = ({ data }) => {
  const field = (id: string) => data?.find((item) => item.id === id)?.value ?? ''

  return (
    <div className="relative overflow-hidden">
      {/* Parallax backgrounds */}
      <div
        className="absolute inset-0 block"
        aria-hidden="true"
        style={{
          backgroundImage: `url('/images/home-question.webp')`,
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className="absolute inset-0 bg-black/70" aria-hidden="true" />
      <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black" aria-hidden="true" />

      <section aria-labelledby="contact-heading" className="relative z-10 px-4 990:px-12 xl:px-4 py-28 990:py-40">
        <div className="max-w-130 760:max-w-xl 990:max-w-200 1200:max-w-screen-1160 1590:max-w-7xl mx-auto w-full">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center mb-16 430:mb-20"
          >
            <p className="font-changa text-sm uppercase tracking-[0.3em] text-blaze-text mb-4">Get In Touch</p>
            <div className="flex items-center gap-3 430:gap-4 justify-center mb-4">
              <div className="w-8 430:w-16 h-px bg-blaze shrink-0" aria-hidden="true" />
              <h2
                id="contact-heading"
                className="font-changa text-3xl 430:text-4xl 990:text-5xl text-white leading-none"
              >
                {field('question_heading')}
              </h2>
              <div className="w-8 430:w-16 h-px bg-blaze shrink-0" aria-hidden="true" />
            </div>
            <div className="w-16 h-px bg-blaze mx-auto mt-2 mb-6" aria-hidden="true" />
            <p className="font-lato text-white/80 text-sm 430:text-base max-w-xl leading-relaxed">
              {field('question_subheading')}
            </p>
          </motion.div>

          {/* Contact methods */}
          <ul
            role="list"
            aria-label="Contact methods"
            className="grid grid-cols-1 990:grid-cols-3 gap-px bg-white/10 mb-16 430:mb-20"
          >
            {[
              {
                title: field('question_email_title'),
                description: field('question_email_description'),
                detail: field('question_email_detail'),
                href: field('question_email_href'),
                icon: Mail
              },
              {
                title: field('question_phone_title'),
                description: field('question_phone_description'),
                detail: field('question_phone_detail'),
                href: field('question_phone_href'),
                icon: Phone
              },
              {
                title: field('question_address_title'),
                description: field('question_address_description'),
                detail: field('question_address_detail'),
                href: field('question_address_href'),
                icon: MapPin
              }
            ].map((method, index) => {
              const Icon = method.icon
              return (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-black/60 backdrop-blur-sm p-6 430:p-8 flex flex-col gap-5 group"
                >
                  {/* Icon + title row */}
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 430:w-12 430:h-12 border border-blaze/30 bg-blaze/10 flex items-center justify-center shrink-0"
                      aria-hidden="true"
                    >
                      <Icon className="w-4 h-4 430:w-5 430:h-5 text-blaze-text" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-changa text-white text-base 430:text-lg leading-tight">{method.title}</h3>
                      <p className="font-lato text-white/80 text-sm 430:text-sm mt-0.5">{method.description}</p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px bg-white/10" aria-hidden="true" />

                  {/* Detail link */}

                  <a
                    href={method.href}
                    aria-label={`${method.title}: ${method.detail}`}
                    className="font-lato text-white/90 hover:text-blaze-text text-sm 430:text-base whitespace-pre-line leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-offset-2 focus-visible:ring-offset-black border-l-2 border-blaze/30 group-hover:border-blaze pl-4 transition-all duration-300"
                  >
                    {method.detail}
                  </a>
                </motion.li>
              )
            })}
          </ul>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center"
          >
            <Link
              href="/contact"
              aria-label={`${field('question_button_text')} — visit our contact page`}
              className="group inline-flex items-center gap-3 bg-blaze hover:bg-blazehover text-white px-8 430:px-10 py-4 font-changa uppercase tracking-widest text-sm transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <span>{field('question_buttonText')}</span>
              <ArrowRightIcon
                className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
