import Script from 'next/script'
import { Changa, Cormorant_Infant, Heebo, Lato } from 'next/font/google'
import { siteMetadata } from './metadata'
import './globals.css'
import RootLayoutClient from './components/layouts/RootLayoutClient'
import { getLayoutData } from './lib/actions/getLayoutData'
import { SessionProvider } from 'next-auth/react'
import { auth } from './lib/auth'

export const dynamic = 'force-dynamic'
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
  const [layoutData, session] = await Promise.all([
    getLayoutData().catch(() => ({ campApplicationsSetting: null, footerData: null })),
    auth()
  ])

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
        <SessionProvider session={session}>
          <RootLayoutClient
            campApplicationsSetting={layoutData?.campApplicationsSetting?.value}
            footerData={layoutData?.footerData}
          >
            {children}
          </RootLayoutClient>
        </SessionProvider>
      </body>
    </html>
  )
}
