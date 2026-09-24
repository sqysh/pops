'use client'

import {
  Calendar,
  ClipboardList,
  FileText,
  Handshake,
  History,
  Image,
  Layout,
  MapPin,
  MessageSquare,
  Newspaper,
  PanelLeftClose,
  PanelLeftOpen,
  Quote,
  Repeat,
  Settings,
  Theater,
  UserCog,
  Users
} from 'lucide-react'
import { useState } from 'react'
import { TopBar } from './_components/TopBar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LinkBody } from '@/components/common/LinkBody'
import { UserRole } from '@prisma/client'
import { formatDate } from '@/app/utils/date.functions'

/** Static now that the rail carries no counts. Icons let it collapse to a strip. */
const SECTIONS = [
  { label: 'Dashboard', href: '/v2/dashboard', Icon: Layout },
  { label: 'Concerts', href: '/v2/concerts', Icon: Theater },
  { label: 'Subscriptions', href: '/v2/subscriptions', Icon: Repeat },
  { label: 'Inquiries', href: '/v2/questions', Icon: MessageSquare },
  { label: 'Team', href: '/v2/team', Icon: Users },
  { label: 'Sponsors', href: '/v2/sponsors', Icon: Handshake },
  { label: 'News', href: '/v2/news', Icon: Newspaper },
  { label: 'Venues', href: '/v2/venues', Icon: MapPin },
  { label: 'Users', href: '/v2/users', Icon: UserCog },
  { label: 'Page Content', href: '/v2/page-content-editor', Icon: FileText },
  { label: 'Camp Applications', href: '/v2/camp-applications', Icon: ClipboardList },
  { label: 'Gallery', href: '/v2/gallery', Icon: Image },
  { label: 'Events', href: '/v2/events', Icon: Calendar },
  { label: 'Testimonials', href: '/v2/testimonials', Icon: Quote },
  { label: 'Settings', href: '/v2/settings', Icon: Settings },
  { label: 'Changelog', href: '/v2/changelog', Icon: History }
]

export default function AdminLayoutClient({ user, children }) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  const date = formatDate(new Date())
  const firstName = user?.name?.split(' ')[0] ?? 'there'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="min-h-dvh 1160:h-dvh 1160:overflow-hidden flex flex-col bg-neutral-200 text-neutral-900 text-sm">
      <TopBar userRole={user.role as UserRole} userEmail={user.email} />

      <div className="flex-1 1160:min-h-0 flex flex-col 1160:flex-row gap-2 p-2">
        {/* Nav rail */}
        <aside
          className={`1160:shrink-0 1160:h-full 1160:overflow-y-auto flex flex-col gap-2 transition-[width] duration-200 ${
            collapsed ? '1160:w-12' : '1160:w-52'
          }`}
        >
          {/* Greeting, expanded only. Kept mounted and faded so it does not
              reflow the rail as the width animates. */}
          <div
            className={`shrink-0 overflow-hidden border-neutral-300 bg-white transition-opacity ${
              collapsed
                ? '1160:h-0 1160:border-0 1160:opacity-0 flex flex-col gap-0.5 px-3 py-2 border duration-100'
                : 'flex flex-col gap-0.5 px-3 py-2 border opacity-100 duration-150 delay-150'
            }`}
            aria-hidden={collapsed}
          >
            <span className="text-neutral-600 whitespace-nowrap">{date}</span>
            <span className="font-semibold whitespace-nowrap">
              {greeting}, <span className="text-blaze-text">{firstName}</span>
            </span>
          </div>

          <nav aria-label="Dashboard sections" className="border border-neutral-300 bg-white">
            <ul role="list" className="flex flex-col">
              {SECTIONS.map(({ label, href, Icon }) => {
                const active = isActive(href)

                return (
                  <li key={label} className="border-b border-neutral-300 last:border-0">
                    <Link
                      href={href}
                      aria-current={active ? 'page' : undefined}
                      title={collapsed ? label : undefined}
                      // the left bar is always 2px, transparent when inactive, so the
                      // row never shifts when the active section changes
                      className={`flex items-center h-8 overflow-hidden border-l-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-inset ${
                        active ? 'border-blaze bg-blaze/5' : 'border-transparent hover:bg-neutral-100'
                      } ${collapsed ? 'px-3 1160:justify-center 1160:px-0' : 'px-3'}`}
                    >
                      <LinkBody
                        icon={
                          <Icon
                            className={`w-4 h-4 shrink-0 ${active ? 'text-blaze-text' : 'text-neutral-500'}`}
                            aria-hidden="true"
                          />
                        }
                        spinnerClass={`w-4 h-4 shrink-0 ${active ? 'text-blaze-text' : 'text-neutral-500'}`}
                        label={
                          <span
                            className={`whitespace-nowrap ${active ? 'font-semibold text-neutral-900' : 'text-neutral-800'} ${
                              collapsed
                                ? '1160:w-0 1160:ml-0 1160:opacity-0 ml-2.5 transition-opacity duration-100'
                                : 'ml-2.5 opacity-100 transition-opacity duration-150 delay-150'
                            }`}
                          >
                            {label}
                          </span>
                        }
                      />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Collapse toggle — desktop only, where collapsing means anything */}
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            aria-expanded={!collapsed}
            aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
            title={collapsed ? 'Expand navigation' : 'Collapse navigation'}
            className={`hidden 1160:flex items-center h-8 shrink-0 overflow-hidden border border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-inset ${
              collapsed ? 'justify-center px-0' : 'px-3'
            }`}
          >
            {collapsed ? (
              <PanelLeftOpen className="w-4 h-4 shrink-0" aria-hidden="true" />
            ) : (
              <>
                <PanelLeftClose className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="ml-2.5 whitespace-nowrap opacity-100 transition-opacity duration-150 delay-150">Collapse</span>
              </>
            )}
          </button>
        </aside>

        {/* Concerts — the only scrolling region on desktop */}
        <main className="flex-1 min-w-0 1160:h-full 1160:overflow-y-auto">{children} </main>
      </div>
    </div>
  )
}
