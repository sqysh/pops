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

interface Props {
  children: React.ReactNode
  campApplicationsSetting?: any
  footerData?: any
}

export default function RootLayoutClient({ children, campApplicationsSetting, footerData }: Props) {
  useScrollToTop()
  const pathname = usePathname()

  const showFooter = useMemo(() => toggleHeaderFooter(pathname), [pathname])
  const showHeader = useMemo(() => toggleHeaderFooter(pathname), [pathname])

  return (
    <Provider store={store}>
      <div className="main-content">
        <NavigationDrawer campApplicationsSetting={campApplicationsSetting} />
        <Toast />
        <CampApplicationSuccessModal />
        <ContactSubmissionSuccessModal />
        <AdminBar />
        {showHeader && <Header campApplicationsSetting={campApplicationsSetting} />}
        {children}
        {showFooter && <Footer data={footerData} />}
      </div>
    </Provider>
  )
}
