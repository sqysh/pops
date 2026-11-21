import { getPageContentBySlug } from '@/app/lib/actions/getLayoutData'
import { CookieConsentBanner } from './CookieConsentBanner'

/** Server wrapper: banner copy lives in the editable `footer` page content. */
export async function CookieConsent() {
  const content = await getPageContentBySlug('footer')
  return <CookieConsentBanner content={content} />
}
