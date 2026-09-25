import { Changa, Cormorant_Infant, Heebo, Lato } from 'next/font/google'
import { siteMetadata } from './metadata'
import './globals.css'
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${changa.variable} ${lato.variable} ${heebo.variable} ${c_infant.variable} antialiased`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
