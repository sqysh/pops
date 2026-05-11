'use client'

import Link from 'next/link'
import { ChevronUp, MapPin, Pencil, Phone } from 'lucide-react'
import { FacebookIcon, InstagramIcon, YouTubeIcon } from '@/public/data/home.data'
import { ContentItem, FooterData } from '@/app/types/common.types'
import LogoSVG from '../svg/logo/LogoSVG'

const Footer = ({ data }: { data: FooterData }) => {
  const d = (id: string) => {
    if (!Array.isArray(data?.content)) return ''
    return (data.content as ContentItem[]).find((item) => item.id === id)?.value ?? ''
  }
  const socialLinks = [
    { icon: FacebookIcon, linkKey: d('footer_social_facebook') },
    { icon: InstagramIcon, linkKey: d('footer_social_instagram') },
    { icon: YouTubeIcon, linkKey: d('footer_social_youtube') }
  ].filter((l) => l.linkKey)

  const footerLinks = [1, 2, 3, 4]
    .map((n) => ({
      textKey: d(`footer_link_${n}_text`),
      linkKey: d(`footer_link_${n}_url`)
    }))
    .filter((l) => l.textKey)

  const extractPlatform = (url: string): string => {
    if (url.includes('facebook.com')) return 'Facebook'
    if (url.includes('instagram.com')) return 'Instagram'
    if (url.includes('twitter.com') || url.includes('x.com')) return 'Twitter'
    if (url.includes('youtube.com')) return 'YouTube'
    if (url.includes('linkedin.com')) return 'LinkedIn'
    if (url.includes('tiktok.com')) return 'TikTok'
    return 'Unknown'
  }

  return (
    <footer className="border-t border-blaze/40 bg-black">
      <section aria-label="Footer main" className="px-4 990:px-12 xl:px-4 py-10 430:py-14">
        <div className="max-w-[320px] 430:max-w-130 760:max-w-xl 990:max-w-200 1200:max-w-screen-1160 mx-auto">
          <div className="grid grid-cols-1 990:grid-cols-12 gap-px bg-white/10">
            {/* Logo + social */}
            <div className="760:col-span-3 bg-black p-5 430:p-6 flex flex-col gap-5">
              <Link
                href="/"
                aria-label="The Pops Orchestra — return to homepage"
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm w-fit"
              >
                <LogoSVG className="w-24 430:w-28 h-16 430:h-20" />
              </Link>
              <ul role="list" aria-label="Social media links" className="flex flex-wrap gap-2">
                {socialLinks.map((link, i) => {
                  const IconComponent = link.icon
                  const platform = extractPlatform(link.linkKey)
                  return (
                    <li key={i}>
                      <a
                        href={link.linkKey}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Follow us on ${platform} (opens in new tab)`}
                        className="w-8 h-8 bg-white/5 border border-white/10 hover:border-blaze/50 hover:bg-blaze/5 flex items-center justify-center transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
                      >
                        <IconComponent className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Contact */}
            <div className="760:col-span-3 bg-black p-5 430:p-6 flex flex-col gap-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-4 h-px bg-blaze shrink-0" aria-hidden="true" />
                <p className="font-changa text-[11px] 430:text-xs uppercase tracking-[0.25em] text-blaze-text">
                  {d('footer_contact_title')}
                </p>
              </div>
              <ul className="flex flex-col gap-2" aria-label="Contact information">
                <li className="flex items-start gap-2">
                  <Pencil className="text-blaze-text w-3 h-3 shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="font-lato text-[12px] 430:text-xs text-white leading-relaxed">
                    {d('footer_contact_line1')}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="text-blaze-text w-3 h-3 shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="font-lato text-[12px] 430:text-xs text-white leading-relaxed">
                    {d('footer_contact_line2')}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="text-blaze-text w-3 h-3 shrink-0" aria-hidden="true" />

                  <a
                    href={`tel:${d('footer_contact_line3').replace(/\D/g, '')}`}
                    aria-label={`Call us at ${d('footer_contact_line3')}`}
                    className="font-lato text-[12px] 430:text-xs text-white hover:text-blaze-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze rounded-sm"
                  >
                    {d('footer_contact_line3')}
                  </a>
                </li>
              </ul>
            </div>

            {/* Quick links */}
            <nav aria-label="Footer quick links" className="760:col-span-3 bg-black p-5 430:p-6 flex flex-col gap-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-4 h-px bg-blaze shrink-0" aria-hidden="true" />
                <p className="font-changa text-[11px] 430:text-xs uppercase tracking-[0.25em] text-blaze-text">
                  {d('footer_quick_links_title')}
                </p>
              </div>
              <ul role="list" className="grid grid-cols-2 760:grid-cols-1 gap-x-4 gap-y-2">
                {footerLinks.map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.linkKey}
                      target={link.linkKey.startsWith('http') ? '_blank' : undefined}
                      rel={link.linkKey.startsWith('http') ? 'noopener noreferrer' : undefined}
                      aria-label={link.linkKey.startsWith('http') ? `${link.textKey} (opens in new tab)` : link.textKey}
                      className="font-lato text-[12px] 430:text-xs text-white hover:text-blaze-text transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze rounded-sm"
                    >
                      {link.textKey}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Tagline */}
            <div className="760:col-span-3 bg-black p-5 430:p-6 flex flex-col gap-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-4 h-px bg-blaze shrink-0" aria-hidden="true" />
                <p className="font-changa text-[11px] 430:text-xs uppercase tracking-[0.25em] text-blaze-text">
                  {d('footer_tagline_label')}
                </p>
              </div>
              <p className="font-lato text-[12px] 430:text-xs text-white leading-relaxed">
                {d('footer_tagline_description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Credits bar */}
      <section aria-label="Footer credits" className="border-t border-white/10 px-4 990:px-12 xl:px-4 py-3 430:py-4">
        <div className="max-w-[320px] 430:max-w-130 760:max-w-xl 990:max-w-200 1200:max-w-screen-1160 mx-auto flex flex-col 430:flex-row items-center justify-between gap-2">
          <p className="font-changa text-[11px] uppercase tracking-widest text-white/70">
            <small>© {new Date().getFullYear()} The Pops Orchestra. All rights reserved.</small>
          </p>
          <div className="flex items-center gap-3 430:gap-4">
            <Link
              href="https://sqysh.io?lead_source=the_pops_orchestra"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Website designed and developed by Sqysh (opens in new tab)"
              className="flex items-center gap-1 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze rounded-sm"
            >
              <span className="font-lato text-[11px] text-white/70 group-hover:text-white transition-colors">
                Built by
              </span>
              <span className="sqysh-gradient text-[11px] font-bold font-mono">Sqysh</span>
            </Link>
            <div className="w-px h-3 bg-white/10" aria-hidden="true" />
            <button
              type="button"
              aria-label="Scroll back to top of page"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-white/50 hover:text-blaze-text transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze rounded-sm p-1"
            >
              <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </footer>
  )
}

export default Footer
