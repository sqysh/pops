'use client'

import { Mail, MapPin, Phone } from 'lucide-react'
import { FacebookIcon, InstagramIcon, YouTubeIcon } from '@/public/data/home.data'
import { ContactForm } from '@/app/(public)/contact/_components/ContactForm'
import CompactPageHero from '@/app/(public)/_components/CompactPageHero'

export const ContactClient = ({ data }) => {
  const field = (id: string) => data?.content?.find((item) => item.id === id)?.value ?? ''

  return (
    <main id="main-content">
      <CompactPageHero
        breadcrumb="Contact"
        heading={field('contact_form_heading')}
        description="Reach out to The Pops Orchestra. Whether it's tickets, sponsorship, or joining us on stage, we'd love to hear from you."
      />

      <div className="relative max-w-5xl mx-auto px-5 760:px-8 990:px-12">
        {/* Content */}
        <section aria-label="Contact" className="relative z-10 py-16 760:py-20 990:py-28">
          <div className="grid grid-cols-1 990:grid-cols-12 gap-y-16 760:gap-y-20 990:gap-y-0 990:gap-x-16">
            {/* Form */}
            <div className="990:col-span-7">
              <div className="flex items-center gap-3 mb-6 990:mb-8">
                <div className="w-6 h-px bg-blaze" aria-hidden="true" />
                <span className="font-changa text-sm uppercase tracking-[0.3em] text-blaze-text">Send a Message</span>
              </div>
              <ContactForm btnClassName="justify-start" />
            </div>

            {/* Sidebar */}
            <aside
              aria-label="Contact information"
              className="990:col-span-5 grid grid-cols-1 760:grid-cols-2 990:grid-cols-1 gap-12 760:gap-x-14"
            >
              {/* Contact info */}
              <section aria-labelledby="contact-info-heading">
                <div className="flex items-center gap-3 mb-5 990:mb-6">
                  <div className="w-6 h-px bg-blaze" aria-hidden="true" />
                  <h2 id="contact-info-heading" className="font-changa text-sm uppercase tracking-[0.3em] text-blaze-text">
                    {field('contact_sidebar_heading')}
                  </h2>
                </div>
                <address className="not-italic flex flex-col">
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
                          href={`tel:${field('contact_sidebar_phone_value').replace(/[^\d+]/g, '')}`}
                          className="font-lato text-sm text-white/60 hover:text-blaze-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze rounded-sm"
                        >
                          {field('contact_sidebar_phone_value')}
                        </a>
                      )
                    }
                  ].map(({ icon, label, content }) => (
                    <div
                      key={label}
                      className="flex items-start gap-3 py-5 first:pt-0 last:pb-0 border-b border-white/6 last:border-0"
                    >
                      <div className="mt-0.5">{icon}</div>
                      <div>
                        <p className="font-changa text-[10px] uppercase tracking-[0.2em] text-white/25 mb-1.5">{label}</p>
                        {content}
                      </div>
                    </div>
                  ))}
                </address>
              </section>

              {/* Social */}
              <section aria-labelledby="contact-social-heading">
                <div className="flex items-center gap-3 mb-5 990:mb-6">
                  <div className="w-6 h-px bg-blaze" aria-hidden="true" />
                  <h2 id="contact-social-heading" className="font-changa text-sm uppercase tracking-[0.3em] text-blaze-text">
                    {field('contact_follow_us_heading')}
                  </h2>
                </div>
                <ul role="list" className="flex items-center gap-2.5">
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
                        className="w-11 h-11 990:w-10 990:h-10 border border-white/10 hover:border-blaze/40 hover:bg-blaze/5 flex items-center justify-center transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze rounded-sm"
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
              <section aria-labelledby="contact-hours-heading" className="760:col-span-2 990:col-span-1">
                <div className="flex items-center gap-3 mb-5 990:mb-6">
                  <div className="w-6 h-px bg-blaze" aria-hidden="true" />
                  <h2 id="contact-hours-heading" className="font-changa text-sm uppercase tracking-[0.3em] text-blaze-text">
                    {field('contact_office_hours_heading')}
                  </h2>
                </div>
                <dl className="flex flex-col">
                  <div className="flex justify-between gap-4 py-3.5 border-b border-white/6">
                    <dt className="font-lato text-sm text-white/60">{field('contact_office_hours_weekday_label')}</dt>
                    <dd className="font-lato text-sm text-white">{field('contact_office_hours_weekday_value')}</dd>
                  </div>
                  <div className="flex justify-between gap-4 py-3.5 pb-0">
                    <dt className="font-lato text-sm text-white/60">{field('contact_office_hours_weekend_label')}</dt>
                    <dd className="font-lato text-sm text-white/50">{field('contact_office_hours_weekend_value')}</dd>
                  </div>
                </dl>
              </section>
            </aside>
          </div>
        </section>
      </div>
    </main>
  )
}
