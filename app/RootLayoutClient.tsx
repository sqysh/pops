'use client'

import { useMemo } from 'react'
import { Provider } from 'react-redux'
import { usePathname } from 'next/navigation'
import useScrollToTop from '@/app/lib/hooks/useScrollToTop'
import { toggleHeaderFooter } from '@/app/utils/string.functions'
import { store } from '@/app/redux/store'
import Toast from '@/components/common/Toast'
import CampApplicationSuccessModal from '@/components/layout/CampApplicationSuccessModal'
import ContactSubmissionSuccessModal from '@/components/layout/ContactSubmissionSuccessModal'
import Footer from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import NavigationDrawer from '@/components/layout/NavigationDrawer'
import { SiteSetting } from '@prisma/client'
import { FooterDataParsed } from '@/app/types/footer.types'
import { AdminBar } from '@/components/layout/AdminBar'

interface Props {
  children: React.ReactNode
  campApplicationsSetting?: SiteSetting['value']
  concertsPageLive?: SiteSetting['value']
  subscriptionsLive?: SiteSetting['value']
  footerData: FooterDataParsed | null
}

export default function RootLayoutClient({
  children,
  campApplicationsSetting,
  concertsPageLive,
  subscriptionsLive,
  footerData
}: Props) {
  useScrollToTop()
  const pathname = usePathname()

  const showFooter = useMemo(() => toggleHeaderFooter(pathname), [pathname])
  const showHeader = useMemo(() => toggleHeaderFooter(pathname), [pathname])

  return (
    <Provider store={store}>
      <div className="main-content">
        <NavigationDrawer
          campApplicationsSetting={campApplicationsSetting}
          concertsPageLive={concertsPageLive}
          subscriptionsLive={subscriptionsLive}
        />
        <Toast />
        <CampApplicationSuccessModal />
        <ContactSubmissionSuccessModal />
        <AdminBar />
        {showHeader && (
          <Header
            campApplicationsSetting={campApplicationsSetting}
            concertsPageLive={concertsPageLive}
            subscriptionsLive={subscriptionsLive}
          />
        )}
        {children}
        {showFooter && <Footer data={footerData} />}
      </div>
    </Provider>
  )
}
