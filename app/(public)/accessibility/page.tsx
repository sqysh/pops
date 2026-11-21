import { Fragment, type ReactNode } from 'react'
import { getPage } from '@/app/lib/actions/page/getPage'
import { pageCopy } from '@/app/lib/page-content/copy'
import { pageContent } from '@/app/lib/constants/page-content/accessibility'

/** Puts elements where the wording has {name} markers, e.g. "pressing the {key} key". */
const withParts = (text: string, parts: Record<string, ReactNode>) =>
  text.split(/(\{\w+\})/).map((part, i) => {
    const name = part.match(/^\{(\w+)\}$/)?.[1]
    return <Fragment key={i}>{name && name in parts ? parts[name] : part}</Fragment>
  })

const Accessibility = async () => {
  const page = await getPage('accessibility')
  const { t, list } = pageCopy(page?.content, pageContent)

  return (
    <>
      <main id="main-content" className="max-w-4xl mx-auto px-6 py-32 text-white">
        <article aria-labelledby="accessibility-heading">
          <h1 id="accessibility-heading" className="text-3xl font-changa mb-4">
            {t('accessibility_heading')}
          </h1>
          <p className="font-lato text-sm mb-10">
            <time dateTime="2024-04">{t('accessibility_updated')}</time>
          </p>

          <p className="font-lato mb-6">{t('accessibility_intro')}</p>

          <section aria-labelledby="accessibility-on-site">
            <h2 id="accessibility-on-site" className="text-xl font-changa mt-10 mb-3">
              {t('accessibility_site_heading')}
            </h2>
            <p className="font-lato mb-6">{t('accessibility_site_body')}</p>
          </section>

          <section aria-labelledby="enabling-menu">
            <h2 id="enabling-menu" className="text-xl font-changa mt-10 mb-3">
              {t('accessibility_menu_heading')}
            </h2>
            <p className="font-lato mb-6">
              {withParts(t('accessibility_menu_body'), {
                key: (
                  <kbd className="font-mono text-sm bg-white/10 px-1.5 py-0.5 rounded border border-white/20">
                    {t('accessibility_menu_key')}
                  </kbd>
                )
              })}
            </p>
          </section>

          <section aria-labelledby="disclaimer">
            <h2 id="disclaimer" className="text-xl font-changa mt-10 mb-3">
              {t('accessibility_disclaimer_heading')}
            </h2>
            <p className="font-lato mb-6">{t('accessibility_disclaimer_body')}</p>
            <ul
              role="list"
              aria-label={t('accessibility_sr_disclaimer_list')}
              className="list-disc list-inside font-lato space-y-2 mb-6"
            >
              {list('accessibility_disclaimer_items').map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="here-for-you">
            <h2 id="here-for-you" className="text-xl font-changa mt-10 mb-3">
              {t('accessibility_help_heading')}
            </h2>
            <p className="font-lato mb-6">{t('accessibility_help_body')}</p>
          </section>

          <section aria-labelledby="contact-us">
            <h2 id="contact-us" className="text-xl font-changa mt-10 mb-3">
              {t('accessibility_contact_heading')}
            </h2>
            <address className="not-italic">
              <p className="font-lato mb-1">
                <strong>{t('accessibility_contact_email_label')}</strong>{' '}
                <a
                  href="mailto:info@thepopsorchestra.org"
                  className="text-blaze-text underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
                >
                  {t('accessibility_contact_email')}
                </a>
              </p>
              <p className="font-lato">
                <strong>{t('accessibility_contact_phone_label')}</strong>{' '}
                <a
                  href="tel:+19419267677"
                  aria-label={t('accessibility_sr_phone_link')}
                  className="text-blaze-text underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
                >
                  {t('accessibility_contact_phone')}
                </a>
              </p>
            </address>
          </section>
        </article>
      </main>
    </>
  )
}

export default Accessibility
