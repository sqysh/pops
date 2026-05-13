import { FC, useState } from 'react'
import { getNavigationLinks, NavigationLinksProps } from '@/app/utils/navigation.utils'
import { openNavigationDrawer } from '@/app/redux/features/appSlice'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useHeaderAtTop } from '@/app/lib/hooks/useHeaderAtTop'
import { store } from '@/app/redux/store'
import LogoSVG from '../svg/logo/LogoSVG'

export interface HeaderNavLinkProps {
  link: NavigationLinksProps
  openDropdown?: { open: boolean; textKey: string }
  setOpenDropdown: (args: { open: boolean; textKey: string }) => void
  linkClassname?: string
  isFixed?: boolean
}

const NavLink: FC<{ link: any; linkClassname?: string }> = ({ link, linkClassname }) => (
  <Link
    href={link.linkKey ?? ''}
    aria-current={link.active ? 'page' : undefined}
    aria-haspopup={link.links ? 'true' : undefined}
    aria-expanded={link['aria-expanded']}
    aria-controls={link['aria-controls']}
    className={`${linkClassname ?? 'text-white'} ${
      link.links ? 'cursor-default' : 'cursor-pointer'
    } relative group font-changa text-sm uppercase tracking-[0.2em] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm`}
  >
    {/* Top flanking line */}
    <span
      aria-hidden="true"
      className={`${
        link.active ? 'scale-x-60' : 'scale-x-0'
      } absolute top-1/2 -mt-3.5 left-0 right-0 h-px bg-white origin-left transition-transform duration-300 ease-in-out group-hover:scale-x-60`}
    />
    {/* Bottom flanking line */}
    <span
      aria-hidden="true"
      className={`${
        link.active ? 'scale-x-60' : 'scale-x-0'
      } absolute top-1/2 mt-3.5 left-0 right-0 h-px bg-white origin-right transition-transform duration-300 ease-in-out group-hover:scale-x-60`}
    />
    <span className="text-white">{link.textKey}</span>
  </Link>
)

export const HeaderNavLink: FC<HeaderNavLinkProps> = ({ link, openDropdown, setOpenDropdown, linkClassname }) => {
  const textKeyMatches = openDropdown?.textKey === link.textKey
  const dropdownId = `dropdown-${link.textKey?.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <div
      onMouseEnter={() => setOpenDropdown({ open: true, textKey: link.textKey })}
      onMouseLeave={() => setOpenDropdown({ open: false, textKey: '' })}
      onFocus={() => setOpenDropdown({ open: true, textKey: link.textKey })}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setOpenDropdown({ open: false, textKey: '' })
        }
      }}
      className="relative flex items-center h-full pb-4 -mb-4"
    >
      <NavLink
        link={{
          ...link,
          'aria-expanded': link.links ? textKeyMatches : undefined,
          'aria-controls': link.links ? dropdownId : undefined
        }}
        linkClassname={linkClassname}
      />

      {link?.links && textKeyMatches && (
        <div
          id={dropdownId}
          role="menu"
          aria-label={`${link.textKey} submenu`}
          className="absolute top-[calc(100%-1rem)] left-1/2 -translate-x-1/2 z-50 bg-black border border-white/10 border-t-2 border-t-blaze flex flex-col min-w-40 w-fit"
        >
          {link.links.map((sublink, j) => (
            <Link
              key={j}
              role="menuitem"
              href={sublink.linkKey}
              onClick={() => setOpenDropdown({ open: false, textKey: '' })}
              target={sublink.isExternal ? '_blank' : undefined}
              rel={sublink.isExternal ? 'noopener noreferrer' : undefined}
              aria-label={sublink.isExternal ? `${sublink.textKey} — opens in new tab` : undefined}
              aria-current={sublink.active ? 'page' : undefined}
              className={`${
                sublink.active ? 'text-blaze-text' : 'text-white/70 hover:text-white'
              } font-changa text-xs uppercase tracking-[0.2em] px-6 py-4 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-colors duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-inset`}
            >
              {sublink.textKey}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export const Header = ({ campApplicationsSetting }) => {
  const path = usePathname()
  const thereAreConcerts = true
  const navLinks = getNavigationLinks(path, thereAreConcerts, campApplicationsSetting)
  const [openDropdown, setOpenDropdown] = useState({ open: false, textKey: '' })
  const { headerRef } = useHeaderAtTop()

  return (
    <nav
      ref={headerRef}
      role="navigation"
      aria-label="Main site navigation"
      className={`${path !== '/' ? 'bg-headerbg' : ''} transition-all relative z-50 px-3 430:px-4 990:px-8 1200:px-12`}
    >
      {/* ── Bottom row — main nav ── */}
      <div className="w-full flex items-center justify-between h-14 430:h-16 sm:h-20 gap-2">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="shrink-0"
        >
          <Link
            href="/"
            aria-label="The Pops Orchestra — home"
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm inline-block"
          >
            <LogoSVG className="w-10 430:w-12 sm:w-16" />
          </Link>
        </motion.div>

        {/* Desktop Nav */}
        <div className="hidden 1100:flex items-center gap-x-5 h-full">
          {navLinks.map((link, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <HeaderNavLink
                link={link}
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
                linkClassname="text-white/80 hover:text-white"
              />
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
            aria-label="Open mobile navigation menu"
            className="w-8 h-8 430:w-9 430:h-9 flex items-center justify-center text-white/70 hover:text-blaze-text 1100:hidden transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze rounded-sm cursor-pointer"
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
          </button>

          <Link
            href="/donate"
            rel="noopener noreferrer"
            className="group hidden 430:inline-flex items-center gap-1.5 bg-blaze hover:bg-blaze/80 text-white font-changa uppercase tracking-widest transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-offset-2 focus-visible:ring-offset-black cursor-pointer text-[0.65rem] sm:text-sm px-4 sm:px-6 py-2.5 sm:py-3"
            aria-label="Donate to The Pops Orchestra"
          >
            <span>Donate</span>
            <Heart
              className="w-3 h-3 sm:w-4 sm:h-4 shrink-0 group-hover:scale-110 transition-transform"
              aria-hidden="true"
            />
          </Link>
        </motion.div>
      </div>
    </nav>
  )
}
