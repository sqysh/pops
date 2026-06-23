import Script from 'next/script'
import { Changa, Cormorant_Infant, Heebo, Lato } from 'next/font/google'
import { siteMetadata } from './metadata'
import './globals.css'
import RootLayoutClient from './components/layouts/RootLayoutClient'
import { getLayoutData } from './lib/actions/getLayoutData'
import { SessionProvider } from 'next-auth/react'

export const metadata = siteMetadata

const changa = Changa({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
  preload: false,
  variable: '--font-changa'
})

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  preload: false,
  variable: '--font-lato'
})

const heebo = Heebo({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  preload: false,
  variable: '--font-heebo'
})
const c_infant = Cormorant_Infant({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  preload: false,
  variable: '--font-c-infant'
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const layoutData = await getLayoutData().catch(() => ({
    campApplicationsSetting: null,
    concertsPageLive: null,
    subscriptionsLive: null,
    footerData: null
  }))

  return (
    <html lang="en">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </head>
      <body className={`${changa.variable} ${lato.variable} ${heebo.variable} ${c_infant.variable} antialiased`}>
        <SessionProvider>
          <RootLayoutClient
            campApplicationsSetting={layoutData?.campApplicationsSetting?.value}
            concertsPageLive={layoutData?.concertsPageLive?.value}
            subscriptionsLive={layoutData?.subscriptionsLive?.value}
            footerData={layoutData?.footerData}
          >
            {children}
          </RootLayoutClient>
        </SessionProvider>
      </body>
    </html>
  )
}
