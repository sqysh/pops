import { Fragment, type ReactNode } from 'react'
import { getPage } from '@/app/lib/actions/page/getPage'
import { pageCopy } from '@/app/lib/page-content/copy'
import { pageContent } from '@/app/lib/constants/page-content/privacy-policy'

/** Puts links where the wording has {name} markers, e.g. "contact us at {email}". */
const withLinks = (text: string, links: Record<string, ReactNode>) =>
  text.split(/(\{\w+\})/).map((part, i) => {
    const name = part.match(/^\{(\w+)\}$/)?.[1]
    return <Fragment key={i}>{name && name in links ? links[name] : part}</Fragment>
  })

const PrivacyPolicy = async () => {
  const page = await getPage('privacy-policy')
  const { t, list } = pageCopy(page?.content, pageContent)
  const today = new Date()

  return (
    <main id="main-content">
      <div className="relative">
        <div
          className="absolute inset-0 w-full h-full bg-no-repeat bg-center bg-cover opacity-10"
          style={{ backgroundImage: `url('/images/bio-bg.webp')`, backgroundAttachment: 'fixed' }}
          aria-hidden="true"
        />

        <div className="relative z-10 px-4 990:px-12 xl:px-4">
          <div className="max-w-[320px] 430:max-w-130 760:max-w-xl 990:max-w-200 1200:max-w-screen-1160 mx-auto">
            {/* Page Header */}
            <header className="w-full text-center flex flex-col items-center pt-32 pb-20 border-b border-white/10">
              <p className="font-changa text-sm uppercase tracking-[0.3em] text-blaze-text mb-4">{t('privacy_hero_eyebrow')}</p>
              <div className="flex items-center gap-3 430:gap-4 justify-center mb-4">
                <div className="w-8 430:w-16 h-px bg-blaze shrink-0" aria-hidden="true" />
                <h1 className="text-4xl 430:text-5xl sm:text-6xl font-changa text-white leading-none">
                  {t('privacy_hero_heading')}
                </h1>
                <div className="w-8 430:w-16 h-px bg-blaze shrink-0" aria-hidden="true" />
              </div>
              <div className="w-16 h-px bg-blaze mx-auto mt-2 mb-6" aria-hidden="true" />
              <p className="font-lato text-white/50 text-sm 430:text-base max-w-xl leading-relaxed">{t('privacy_hero_intro')}</p>
            </header>

            {/* Content */}
            <article aria-labelledby="privacy-policy-heading" className="py-20 pb-32 max-w-3xl flex flex-col gap-10">
              <h2 id="privacy-policy-heading" className="sr-only">
                {t('privacy_sr_details_heading')}
              </h2>

              <section aria-labelledby="who-we-are">
                <h2 id="who-we-are" className="font-changa text-xl 430:text-2xl text-white mb-4">
                  {t('privacy_who_heading')}
                </h2>
                <div className="w-8 h-px bg-blaze mb-5" aria-hidden="true" />
                <p className="font-lato text-white/60 text-sm 430:text-base leading-relaxed">
                  {withLinks(t('privacy_who_body'), {
                    website: (
                      <a
                        href="https://thepopsorchestra.org"
                        className="text-sunburst underline hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunburst rounded-sm"
                      >
                        {t('privacy_who_website_link')}
                      </a>
                    ),
                    builder: (
                      <a
                        href="https://sqysh.io?lead_source=the_pops_orchestra"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t('privacy_sr_builder_link')}
                        className="text-lime-400 underline hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 rounded-sm"
                      >
                        {t('privacy_who_builder_link')}
                      </a>
                    )
                  })}
                </p>
              </section>

              <section aria-labelledby="forms-heading">
                <h2 id="forms-heading" className="font-changa text-xl 430:text-2xl text-white mb-4">
                  {t('privacy_forms_heading')}
                </h2>
                <div className="w-8 h-px bg-blaze mb-5" aria-hidden="true" />
                <p className="font-lato text-white/60 text-sm 430:text-base leading-relaxed">{t('privacy_forms_body')}</p>
              </section>

              <section aria-labelledby="what-we-dont-do-heading">
                <h2 id="what-we-dont-do-heading" className="font-changa text-xl 430:text-2xl text-white mb-4">
                  {t('privacy_dont_heading')}
                </h2>
                <div className="w-8 h-px bg-blaze mb-5" aria-hidden="true" />
                <ul role="list" aria-label={t('privacy_sr_dont_list')} className="flex flex-col divide-y divide-white/10">
                  {list('privacy_dont_items').map((item, i) => (
                    <li key={i} className="flex items-start gap-3 py-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blaze mt-2 shrink-0" aria-hidden="true" />
                      <span className="font-lato text-white/60 text-sm 430:text-base leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section aria-labelledby="tickets-heading">
                <h2 id="tickets-heading" className="font-changa text-xl 430:text-2xl text-white mb-4">
                  {t('privacy_tickets_heading')}
                </h2>
                <div className="w-8 h-px bg-blaze mb-5" aria-hidden="true" />
                <p className="font-lato text-white/60 text-sm 430:text-base leading-relaxed">{t('privacy_tickets_body')}</p>
              </section>

              <section aria-labelledby="website-basics-heading">
                <h2 id="website-basics-heading" className="font-changa text-xl 430:text-2xl text-white mb-4">
                  {t('privacy_basics_heading')}
                </h2>
                <div className="w-8 h-px bg-blaze mb-5" aria-hidden="true" />
                <p className="font-lato text-white/60 text-sm 430:text-base leading-relaxed">{t('privacy_basics_body')}</p>
              </section>

              <section aria-labelledby="analytics-heading">
                <h2 id="analytics-heading" className="font-changa text-xl 430:text-2xl text-white mb-4">
                  {t('privacy_analytics_heading')}
                </h2>
                <div className="w-8 h-px bg-blaze mb-5" aria-hidden="true" />
                <div className="flex flex-col gap-4">
                  <p className="font-lato text-white/60 text-sm 430:text-base leading-relaxed">{t('privacy_analytics_intro')}</p>
                  <ul role="list" className="flex flex-col divide-y divide-white/10">
                    <li className="flex flex-col gap-1 py-3">
                      <span className="font-lato text-white text-sm 430:text-base">{t('privacy_analytics_ga_name')}</span>
                      <span className="font-lato text-white/60 text-sm leading-relaxed">
                        {withLinks(t('privacy_analytics_ga_text'), {
                          link: (
                            <a
                              href="https://policies.google.com/privacy"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sunburst underline hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunburst rounded-sm"
                            >
                              {t('privacy_analytics_ga_link')}
                            </a>
                          )
                        })}
                      </span>
                    </li>
                    <li className="flex flex-col gap-1 py-3">
                      <span className="font-lato text-white text-sm 430:text-base">{t('privacy_analytics_meta_name')}</span>
                      <span className="font-lato text-white/60 text-sm leading-relaxed">
                        {withLinks(t('privacy_analytics_meta_text'), {
                          link: (
                            <a
                              href="https://www.facebook.com/privacy/policy"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sunburst underline hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunburst rounded-sm"
                            >
                              {t('privacy_analytics_meta_link')}
                            </a>
                          )
                        })}
                      </span>
                    </li>
                  </ul>
                  <p className="font-lato text-white/60 text-sm 430:text-base leading-relaxed">{t('privacy_analytics_outro')}</p>
                </div>
              </section>

              <section aria-labelledby="photos-heading">
                <h2 id="photos-heading" className="font-changa text-xl 430:text-2xl text-white mb-4">
                  {t('privacy_photos_heading')}
                </h2>
                <div className="w-8 h-px bg-blaze mb-5" aria-hidden="true" />
                <p className="font-lato text-white/60 text-sm 430:text-base leading-relaxed">{t('privacy_photos_body')}</p>
              </section>

              <section aria-labelledby="security-heading">
                <h2 id="security-heading" className="font-changa text-xl 430:text-2xl text-white mb-4">
                  {t('privacy_security_heading')}
                </h2>
                <div className="w-8 h-px bg-blaze mb-5" aria-hidden="true" />
                <p className="font-lato text-white/60 text-sm 430:text-base leading-relaxed">{t('privacy_security_body')}</p>
              </section>

              <section aria-labelledby="questions-heading">
                <h2 id="questions-heading" className="font-changa text-xl 430:text-2xl text-white mb-4">
                  {t('privacy_questions_heading')}
                </h2>
                <div className="w-8 h-px bg-blaze mb-5" aria-hidden="true" />
                <p className="font-lato text-white/60 text-sm 430:text-base leading-relaxed">
                  {withLinks(t('privacy_questions_body'), {
                    email: (
                      <a
                        href="mailto:info@thepopsorchestra.org"
                        aria-label={t('privacy_sr_email_link')}
                        className="text-sunburst underline hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunburst rounded-sm"
                      >
                        {t('privacy_questions_email_link')}
                      </a>
                    ),
                    phone: (
                      <a
                        href="tel:941-926-7677"
                        aria-label={t('privacy_sr_phone_link')}
                        className="text-sunburst underline hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunburst rounded-sm"
                      >
                        {t('privacy_questions_phone_link')}
                      </a>
                    )
                  })}
                </p>
              </section>

              <section aria-labelledby="updates-heading">
                <h2 id="updates-heading" className="font-changa text-xl 430:text-2xl text-white mb-4">
                  {t('privacy_updates_heading')}
                </h2>
                <div className="w-8 h-px bg-blaze mb-5" aria-hidden="true" />
                <p className="font-lato text-white/60 text-sm 430:text-base leading-relaxed">{t('privacy_updates_body')}</p>
              </section>

              <p className="font-lato text-white/50 text-sm border-t border-white/10 pt-6">
                <time dateTime={today.toISOString().split('T')[0]}>
                  {t('privacy_last_updated', { date: today.toLocaleDateString() })}
                </time>
              </p>
            </article>
          </div>
        </div>
      </div>
    </main>
  )
}

export default PrivacyPolicy
