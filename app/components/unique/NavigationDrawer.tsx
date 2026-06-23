'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Heart, X } from 'lucide-react'
import { RootState, store, useAppSelector } from '@/app/redux/store'
import { getNavigationLinks } from '@/app/utils/navigation.utils'
import { closeNavigationDrawer } from '@/app/redux/features/appSlice'
import Picture from '../common/Picture'

const NavigationDrawer = ({ campApplicationsSetting, concertsPageLive, subscriptionsLive }) => {
  const path = usePathname()
  const { navigationDrawer } = useAppSelector((state: RootState) => state.app)
  const overlayRef = useRef(null)
  const navLinks = getNavigationLinks(path, concertsPageLive, campApplicationsSetting, subscriptionsLive)
  const closeDrawer = () => store.dispatch(closeNavigationDrawer())

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        aria-hidden="true"
        className={`${
          navigationDrawer ? 'opacity-100' : 'opacity-0 pointer-events-none'
        } fixed inset-0 z-99 bg-black/70 backdrop-blur-sm transition-opacity duration-500`}
      />

      {/* Panel */}
      <div
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`${
          navigationDrawer ? 'translate-x-0' : 'translate-x-full'
        } duration-500 ease-in-out no-scrollbar fixed top-0 right-0 z-100 h-full w-full sm:w-md bg-black border-l border-white/10 overflow-y-auto transition-transform flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-6 pb-5 border-b border-white/10">
          <Link
            href="/"
            onClick={closeDrawer}
            aria-label="The Pops Orchestra — return to homepage"
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze rounded-sm"
          >
            <Picture
              src="/images/logo-2.png"
              alt="The Pops Orchestra of Sarasota and Bradenton"
              width={120}
              height={44}
              priority
              className="w-28 h-auto"
              sizes="120px"
            />
          </Link>
          <button
            onClick={closeDrawer}
            aria-label="Close navigation menu"
            className="w-9 h-9 flex items-center justify-center border border-white/10 hover:border-white/30 text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <nav aria-label="Main navigation" className="flex-1 px-4 py-6 flex flex-col gap-y-6">
          {/* Top level links */}
          <ul role="list" className="flex flex-col gap-y-px">
            {navLinks
              .filter((link) => !link.links?.length)
              .map((link, i) => (
                <li key={i}>
                  <Link
                    onClick={closeDrawer}
                    href={link.linkKey}
                    className={`flex items-center gap-3 py-3 px-3 font-changa tracking-widest uppercase text-base transition-colors duration-200 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-inset ${
                      link.active ? 'text-blaze-text' : 'text-white'
                    }`}
                  >
                    {link.active && <span className="w-1 h-1 rounded-full bg-blaze shrink-0" aria-hidden="true" />}
                    {link.textKey}
                  </Link>
                </li>
              ))}
          </ul>

          <div className="w-full h-px bg-white/10" aria-hidden="true" />

          {/* Links with children */}
          <div className="flex flex-col gap-y-6">
            {navLinks
              .filter((link) => link.links?.length)
              .map((link, i) => (
                <div key={i}>
                  <div className="flex items-center gap-2 mb-3 px-3">
                    <div className="w-3 h-px bg-blaze shrink-0" aria-hidden="true" />
                    <p
                      className={`text-sm font-mono tracking-[0.2em] uppercase ${
                        link.active ? 'text-blaze-text' : 'text-white/50'
                      }`}
                    >
                      {link.textKey}
                    </p>
                  </div>
                  <ul role="list" className="flex flex-col gap-y-px">
                    {link.links?.map((obj, j) => (
                      <li key={j}>
                        <Link
                          onClick={closeDrawer}
                          href={obj.linkKey}
                          className={`flex items-center gap-3 py-3 px-3 font-changa tracking-widest uppercase text-base transition-colors duration-200 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-inset ${
                            obj.active ? 'text-blaze-text' : 'text-white/80'
                          }`}
                        >
                          {obj.active && <span className="w-1 h-1 rounded-full bg-blaze shrink-0" aria-hidden="true" />}
                          {obj.textKey}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="sticky bottom-0 px-4 py-5 border-t border-white/10 bg-black flex flex-col gap-3">
          <Link
            href="/donate"
            rel="noopener noreferrer"
            onClick={closeDrawer}
            aria-label="Make a donation (opens in new tab)"
            className="group flex items-center justify-center gap-2 border border-white/20 hover:border-white/50 text-white/70 hover:text-white font-changa uppercase tracking-widest text-sm py-3.5 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <span>Make a Donation</span>
            <Heart className="w-3.5 h-3.5 shrink-0 group-hover:scale-110 transition-transform" aria-hidden="true" />
          </Link>
          <p className="text-white/80 text-sm font-mono uppercase tracking-[0.2em] text-center pt-1">
            The Pops Orchestra of Bradenton & Sarasota
          </p>
        </div>
      </div>
    </>
  )
}

export default NavigationDrawer
