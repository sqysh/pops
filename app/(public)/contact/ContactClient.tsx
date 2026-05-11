'use client'

import Breadcrumb from '@/app/components/common/Breadcrumb'
import { Mail, MapPin, Phone } from 'lucide-react'
import { FacebookIcon, InstagramIcon, YouTubeIcon } from '@/public/data/home.data'
import ContactForm from '@/app/components/forms/ContactForm'

export const ContactClient = ({ data }) => {
  const field = (id: string) => data?.content?.find((item) => item.id === id)?.value ?? ''

  return (
    <main id="main-content">
      <Breadcrumb breadcrumb="Contact" />

      <div className="relative bg-black min-h-[calc(100vh-525px)]">
        <div className="relative z-10">
          {/* Page Header */}
          <header className="text-center flex flex-col items-center pt-24 pb-16 px-4 border-b border-white/10">
            <p className="font-changa text-[10px] uppercase tracking-[0.35em] text-blaze-text mb-3">
              The Pops Orchestra
            </p>
            <h1 className="text-4xl 430:text-5xl font-changa text-white leading-none">
              {field('contact_form_heading')}
            </h1>
          </header>

          {/* Content */}
          <div className="max-w-5xl mx-auto px-4 990:px-8 py-16 990:py-24">
            <div className="grid grid-cols-1 990:grid-cols-12 gap-12 990:gap-16">
              {/* Form */}
              <div className="990:col-span-7">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-6 h-px bg-blaze" aria-hidden="true" />
                  <span className="font-changa text-[11px] uppercase tracking-[0.3em] text-blaze-text">
                    Send a Message
                  </span>
                </div>
                <ContactForm btnClassname="justify-start" />
              </div>

              {/* Sidebar */}
              <aside aria-label="Contact information" className="990:col-span-5 flex flex-col gap-10">
                {/* Contact info */}
                <section aria-labelledby="contact-info-heading">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-6 h-px bg-blaze" aria-hidden="true" />
                    <h2
                      id="contact-info-heading"
                      className="font-changa text-[11px] uppercase tracking-[0.3em] text-blaze-text"
                    >
                      {field('contact_sidebar_heading')}
                    </h2>
                  </div>
                  <address className="not-italic flex flex-col gap-5">
                    {[
                      {
                        icon: <Mail className="w-3.5 h-3.5 text-blaze-text shrink-0" aria-hidden="true" />,
                        label: field('contact_sidebar_email_label'),
                        content: (
                          <a
                            href={`mailto:${field('contact_sidebar_email_value')}`}
                            className="font-lato text-sm text-white/60 hover:text-blaze-text transition-colors break-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze rounded-sm"
                          >
                            {field('contact_sidebar_email_value')}
                          </a>
                        )
                      },
                      {
                        icon: <MapPin className="w-3.5 h-3.5 text-blaze-text shrink-0" aria-hidden="true" />,
                        label: field('contact_sidebar_address_label'),
                        content: (
                          <a
                            href={`https://maps.google.com/?q=${encodeURIComponent(field('contact_sidebar_address_value'))}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-lato text-sm text-white/60 hover:text-blaze-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze rounded-sm"
                          >
                            {field('contact_sidebar_address_value')}
                          </a>
                        )
                      },
                      {
                        icon: <Phone className="w-3.5 h-3.5 text-blaze-text shrink-0" aria-hidden="true" />,
                        label: field('contact_sidebar_phone_label'),
                        content: (
                          <a
                            href="tel:+19419267677"
                            className="font-lato text-sm text-white/60 hover:text-blaze-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze rounded-sm"
                          >
                            {field('contact_sidebar_phone_value')}
                          </a>
                        )
                      }
                    ].map(({ icon, label, content }) => (
                      <div
                        key={label}
                        className="flex items-start gap-3 border-b border-white/6 pb-5 last:border-0 last:pb-0"
                      >
                        <div className="mt-0.5">{icon}</div>
                        <div>
                          <p className="font-changa text-[10px] uppercase tracking-[0.2em] text-white/25 mb-1">
                            {label}
                          </p>
                          {content}
                        </div>
                      </div>
                    ))}
                  </address>
                </section>

                {/* Social */}
                <section aria-labelledby="contact-social-heading">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-6 h-px bg-blaze" aria-hidden="true" />
                    <h2
                      id="contact-social-heading"
                      className="font-changa text-[11px] uppercase tracking-[0.3em] text-blaze-text"
                    >
                      {field('contact_follow_us_heading')}
                    </h2>
                  </div>
                  <ul role="list" className="flex items-center gap-2">
                    {[
                      { href: field('contact_social_facebook_url'), Icon: FacebookIcon, label: 'Facebook' },
                      { href: field('contact_social_instagram_url'), Icon: InstagramIcon, label: 'Instagram' },
                      { href: field('contact_social_youtube_url'), Icon: YouTubeIcon, label: 'YouTube' }
                    ].map(({ href, Icon, label }) => (
                      <li key={label}>
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Follow us on ${label} (opens in new tab)`}
                          className="w-10 h-10 border border-white/10 hover:border-blaze/40 hover:bg-blaze/5 flex items-center justify-center transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze rounded-sm"
                        >
                          <Icon
                            className="w-4 h-4 text-white/50 group-hover:text-blaze-text transition-colors"
                            aria-hidden="true"
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Hours */}
                <section aria-labelledby="contact-hours-heading">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-6 h-px bg-blaze" aria-hidden="true" />
                    <h2
                      id="contact-hours-heading"
                      className="font-changa text-[11px] uppercase tracking-[0.3em] text-blaze-text"
                    >
                      {field('contact_office_hours_heading')}
                    </h2>
                  </div>
                  <dl className="flex flex-col gap-0">
                    <div className="flex justify-between py-3 border-b border-white/6">
                      <dt className="font-lato text-xs text-white/60">{field('contact_office_hours_weekday_label')}</dt>
                      <dd className="font-lato text-xs text-white">{field('contact_office_hours_weekday_value')}</dd>
                    </div>
                    <div className="flex justify-between py-3">
                      <dt className="font-lato text-xs text-white/60">{field('contact_office_hours_weekend_label')}</dt>
                      <dd className="font-lato text-xs text-white/50">{field('contact_office_hours_weekend_value')}</dd>
                    </div>
                  </dl>
                </section>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
