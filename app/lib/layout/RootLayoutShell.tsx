'use client'

import { usePathname } from 'next/navigation'
import useScrollToTop from '@/app/lib/hooks/useScrollToTop'
import { toggleHeaderFooter } from '@/app/utils/string.functions'
import Footer from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import NavigationDrawer from '@/components/layout/NavigationDrawer'
import { SiteSetting } from '@prisma/client'
import { FooterDataParsed } from '@/app/types/footer.types'
import { PageField } from '@/app/types/page.types'
import { AdminBar } from '@/components/layout/AdminBar'

export default function RootLayoutShell({
  children,
  campApplicationsSetting,
  concertsPageLive,
  subscriptionsLive,
  footerData,
  bubblesBashTitle,
  navContent
}: {
  children: React.ReactNode
  campApplicationsSetting?: SiteSetting['value']
  concertsPageLive?: SiteSetting['value']
  subscriptionsLive?: SiteSetting['value']
  footerData: FooterDataParsed | null
  bubblesBashTitle?: string | null
  navContent: PageField[]
}) {
  useScrollToTop()
  const pathname = usePathname()

  const showChrome = toggleHeaderFooter(pathname)

  const navSettings = { campApplicationsSetting, concertsPageLive, subscriptionsLive, bubblesBashTitle, navContent }

  return (
    <div className="main-content">
      <NavigationDrawer {...navSettings} />
      <AdminBar />

      {showChrome && <Header {...navSettings} />}
      {children}
      {showChrome && <Footer data={footerData} bubblesBashTitle={bubblesBashTitle} />}
    </div>
  )
}
