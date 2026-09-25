'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Menu } from 'lucide-react'
import { SiteSetting } from '@prisma/client'
import { getNavigationLinks, NavigationLinksProps } from '@/app/utils/navigation.utils'
import { openNavigationDrawer } from '@/app/redux/features/appSlice'
import { useHeaderAtTop } from '@/app/lib/hooks/useHeaderAtTop'
import { store } from '@/app/redux/store'
import LogoSVG from './LogoSVG'

const NAV_LINK =
  'relative group font-changa text-sm uppercase tracking-[0.2em] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm'

const FLANK = 'absolute left-0 right-0 top-1/2 h-px bg-white transition-transform duration-300 ease-in-out'

const slug = (text: string) => text.toLowerCase().replace(/\s+/g, '-')

interface HeaderNavLinkProps {
  link: NavigationLinksProps
  openTextKey: string
  setOpenTextKey: (textKey: string) => void
}

export function HeaderNavLink({ link, openTextKey, setOpenTextKey }: HeaderNavLinkProps) {
  const hasDropdown = !!link.links?.length
  const isOpen = hasDropdown && openTextKey === link.textKey
  const dropdownId = `dropdown-${slug(link.textKey)}`

  const close = () => setOpenTextKey('')
  const open = () => setOpenTextKey(link.textKey)

  return (
    <div
      onMouseEnter={open}
      onMouseLeave={close}
      onFocus={open}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) close()
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') close()
      }}
      className="relative flex items-center h-full pb-4 -mb-4"
    >
      <Link
        href={link.linkKey ?? ''}
        aria-current={link.active ? 'page' : undefined}
        aria-expanded={hasDropdown ? isOpen : undefined}
        aria-controls={hasDropdown && isOpen ? dropdownId : undefined}
        className={`${NAV_LINK} ${hasDropdown ? 'cursor-default' : 'cursor-pointer'} ${
          link.active ? 'text-white' : 'text-white/80 hover:text-white'
        }`}
      >
        <span
          aria-hidden="true"
          className={`${FLANK} -mt-3.5 origin-left ${link.active ? 'scale-x-60' : 'scale-x-0'} group-hover:scale-x-60`}
        />
        <span
          aria-hidden="true"
          className={`${FLANK} mt-3.5 origin-right ${link.active ? 'scale-x-60' : 'scale-x-0'} group-hover:scale-x-60`}
        />
        {link.textKey}
      </Link>

      {isOpen && (
        <div
          id={dropdownId}
          className="absolute top-full left-1/2 -translate-x-1/2 z-50 bg-black border border-white/10 border-t-2 border-t-blaze flex flex-col min-w-40 w-fit"
        >
          {link.links?.map((sublink) => (
            <Link
              key={sublink.linkKey}
              href={sublink.linkKey}
              onClick={close}
              target={sublink.isExternal ? '_blank' : undefined}
              rel={sublink.isExternal ? 'noopener noreferrer' : undefined}
              aria-label={sublink.isExternal ? `${sublink.textKey}, opens in a new tab` : undefined}
              aria-current={sublink.active ? 'page' : undefined}
              className={`${
                sublink.active ? 'text-blaze-text' : 'text-white/70 hover:text-white'
              } font-changa text-sm uppercase tracking-[0.2em] px-6 py-4 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-colors duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-inset`}
            >
              {sublink.textKey}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

interface HeaderProps {
  campApplicationsSetting?: SiteSetting['value']
  concertsPageLive?: SiteSetting['value']
  subscriptionsLive?: SiteSetting['value']
}

export function Header({ campApplicationsSetting, concertsPageLive, subscriptionsLive }: HeaderProps) {
  const path = usePathname()
  const navLinks = getNavigationLinks(path, concertsPageLive, campApplicationsSetting, subscriptionsLive)
  const [openTextKey, setOpenTextKey] = useState('')
  const { headerRef } = useHeaderAtTop()

  return (
    <nav ref={headerRef} aria-label="Main site navigation" className="relative z-50 px-3 430:px-4 990:px-8 1200:px-12">
      <div className="w-full flex items-center justify-between h-14 430:h-16 sm:h-20 gap-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="shrink-0"
        >
          <Link
            href="/"
            aria-label="The Pops Orchestra, home"
            className="inline-block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <LogoSVG className="w-10 430:w-12 sm:w-16" />
          </Link>
        </motion.div>

        <div className="hidden 1160:flex items-center gap-x-5 h-full">
          {navLinks.map((link, i) => (
            <motion.div
              key={link.textKey}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <HeaderNavLink link={link} openTextKey={openTextKey} setOpenTextKey={setOpenTextKey} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="flex items-center gap-1.5 430:gap-2 shrink-0"
        >
          <button
            type="button"
            onClick={() => store.dispatch(openNavigationDrawer())}
            aria-label="Open navigation menu"
            className="w-11 h-11 flex items-center justify-center text-white/70 hover:text-blaze-text 1160:hidden transition-colors duration-300 rounded-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
          </button>

          <Link
            href="/donate"
            aria-label="Donate to The Pops Orchestra"
            className="hidden 430:inline-flex items-center bg-blaze hover:bg-blaze/80 text-white font-changa uppercase tracking-widest transition-colors duration-300 cursor-pointer text-xs sm:text-sm px-4 sm:px-6 py-2.5 sm:py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Donate
          </Link>
        </motion.div>
      </div>
    </nav>
  )
}
