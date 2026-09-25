'use client'

import { Provider } from 'react-redux'
import { usePathname } from 'next/navigation'
import useScrollToTop from '@/app/lib/hooks/useScrollToTop'
import { toggleHeaderFooter } from '@/app/utils/string.functions'
import { store } from '@/app/redux/store'
import Footer from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import NavigationDrawer from '@/components/layout/NavigationDrawer'
import { SiteSetting } from '@prisma/client'
import { FooterDataParsed } from '@/app/types/footer.types'
import { AdminBar } from '@/components/layout/AdminBar'

export default function RootLayoutClient({
  children,
  campApplicationsSetting,
  concertsPageLive,
  subscriptionsLive,
  footerData
}: {
  children: React.ReactNode
  campApplicationsSetting?: SiteSetting['value']
  concertsPageLive?: SiteSetting['value']
  subscriptionsLive?: SiteSetting['value']
  footerData: FooterDataParsed | null
}) {
  useScrollToTop()
  const pathname = usePathname()

  const showChrome = toggleHeaderFooter(pathname)

  const navSettings = { campApplicationsSetting, concertsPageLive, subscriptionsLive }

  return (
    <Provider store={store}>
      <div className="main-content">
        <NavigationDrawer {...navSettings} />
        <AdminBar />

        {showChrome && <Header {...navSettings} />}
        {children}
        {showChrome && <Footer data={footerData} />}
      </div>
    </Provider>
  )
}
