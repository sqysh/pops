'use client'

import { useMemo } from 'react'
import { Provider } from 'react-redux'
import { usePathname } from 'next/navigation'
import useScrollToTop from '@/app/lib/hooks/useScrollToTop'
import { toggleHeaderFooter } from '@/app/utils/string.functions'
import { store } from '@/app/redux/store'
import Toast from '../common/Toast'
import CampApplicationSuccessModal from '../modals/CampApplicationSuccessModal'
import ContactSubmissionSuccessModal from '../modals/ContactSubmissionSuccessModal'
import Footer from '../unique/Footer'
import { Header } from '../unique/Header'
import NavigationDrawer from '../unique/NavigationDrawer'
import { AdminBar } from '../AdminBar'
import { SiteSetting } from '@prisma/client'
import { FooterDataParsed } from '@/app/types/common.types'

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
