import RootLayoutClient from '../RootLayoutClient'
import { getLayoutData } from '../lib/actions/getLayoutData'
import { CookieConsent } from '../lib/layout/CookieConsent'
import { SiteAnalytics } from '../lib/layout/SiteAnalytics'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const layoutData = await getLayoutData().catch(() => ({
    campApplicationsSetting: null,
    concertsPageLive: null,
    subscriptionsLive: null,
    footerData: null
  }))

  return (
    <>
      <CookieConsent />
      <RootLayoutClient
        campApplicationsSetting={layoutData?.campApplicationsSetting?.value}
        concertsPageLive={layoutData?.concertsPageLive?.value}
        subscriptionsLive={layoutData?.subscriptionsLive?.value}
        footerData={layoutData?.footerData}
      >
        {children}
      </RootLayoutClient>
      <SiteAnalytics />
    </>
  )
}
