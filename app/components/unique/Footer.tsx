'use client'

import Link from 'next/link'
import { Phone, MapPin, ChevronUp, Mail, ArrowRight } from 'lucide-react'
import { FacebookIcon, InstagramIcon, YouTubeIcon } from '@/public/data/home.data'
import Picture from '../common/Picture'
import { FloatingParticles } from '../FloatingParticles'
import { ContentItem, FooterDataParsed } from '@/app/types/footer.types'

const Footer = ({ data }: { data: FooterDataParsed }) => {
  const d = (id: string) => {
    if (!Array.isArray(data?.content)) return ''
    return (data.content as ContentItem[]).find((item) => item.id === id)?.value ?? ''
  }

  const socialLinks = [
    { icon: FacebookIcon, url: d('footer_social_facebook'), platform: 'Facebook' },
    { icon: InstagramIcon, url: d('footer_social_instagram'), platform: 'Instagram' },
    { icon: YouTubeIcon, url: d('footer_social_youtube'), platform: 'YouTube' }
  ].filter((l) => l.url)

  const footerLinks = [1, 2, 3, 4]
    .map((n) => ({ text: d(`footer_link_${n}_text`), href: d(`footer_link_${n}_url`) }))
    .filter((l) => l.text)

  const footerLinksSeason = [1, 2, 3, 4]
    .map((n) => ({ text: d(`footer_season_link_${n}_text`), href: d(`footer_season_link_${n}_url`) }))
    .filter((l) => l.text)

  const footerLinksGetInvolved = [1, 2, 3, 4]
    .map((n) => ({ text: d(`footer_involved_link_${n}_text`), href: d(`footer_involved_link_${n}_url`) }))
    .filter((l) => l.text)

  return (
    <footer className="bg-black border-t border-white/10 overflow-hidden">
      {/* ── Tier 1 — Brand ─────────────────────────────────────────────── */}
      <div className="relative border-b border-white/10">
        <FloatingParticles count={80} />

        {/* Decorative diagonal lines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <svg width="100%" height="100%" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="100%" x2="20%" y2="0" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            <line x1="10%" y1="100%" x2="30%" y2="0" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
            <line x1="70%" y1="100%" x2="90%" y2="0" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
            <line x1="80%" y1="100%" x2="100%" y2="0" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            {/* Red accent lines */}
            <line x1="45%" y1="100%" x2="55%" y2="0" stroke="rgba(220,38,38,0.06)" strokeWidth="1" />
            <line x1="48%" y1="100%" x2="52%" y2="0" stroke="rgba(220,38,38,0.04)" strokeWidth="1" />
          </svg>
        </div>

        <div className="relative max-w-[320px] 430:max-w-130 760:max-w-xl 990:max-w-200 1200:max-w-screen-1160 1590:max-w-300 mx-auto px-4 990:px-0 py-14 760:py-20 flex flex-col items-center text-center gap-7">
          {/* Logo */}
          <Link
            href="/"
            aria-label="The Pops Orchestra — return to homepage"
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <Picture
              src="/images/logo-2.png"
              priority={false}
              className="h-full object-contain w-32 480:w-40 760:w-52"
            />
          </Link>

          {/* Tagline */}
          <p className="font-lato text-white/50 text-xs 480:text-sm 760:text-base leading-relaxed max-w-md">
            {d('footer_tagline_description')}
          </p>

          {/* Blaze divider */}
          <div className="flex items-center gap-4 w-full max-w-xs" aria-hidden="true">
            <div className="flex-1 h-px bg-white/10" />
            <div className="w-1.5 h-1.5 bg-blaze rotate-45 shrink-0" />
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Newsletter + Social */}
          <div className="flex flex-col items-center gap-4">
            <Link
              href="/connect-with-us"
              className="inline-flex items-center gap-2.5 px-5 py-3 w-full justify-center bg-blaze hover:bg-blazehover text-white font-changa text-[11px] uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              aria-label="Sign up for The Pops Orchestra newsletter"
            >
              <Mail className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              {d('footer_newsletter_link_text')}
            </Link>

            <div className="hidden 480:block w-px h-6 bg-white/10" aria-hidden="true" />

            <ul role="list" aria-label="Social media links" className="flex items-center gap-2">
              {socialLinks.map(({ icon: Icon, url, platform }) => (
                <li key={platform}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow us on ${platform} (opens in new tab)`}
                    className="w-9 h-9 border border-white/10 hover:border-blaze/50 hover:bg-blaze/5 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  >
                    <Icon className="w-4 h-4 text-white/50 hover:text-white transition-colors" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Tier 2 — Links ─────────────────────────────────────────────── */}
      <div className="relative border-b border-white/10">
        {/* Dot grid */}
        <div
          className="absolute z-100 inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '28px 28px'
          }}
          aria-hidden="true"
        />

        <div className="relative max-w-[320px] 430:max-w-130 760:max-w-xl 990:max-w-200 1200:max-w-screen-1160 1590:max-w-300 mx-auto px-4 990:px-0 py-12 760:py-16">
          <div className="grid grid-cols-1 760:grid-cols-2 990:grid-cols-4 gap-8 760:gap-10">
            {/* Contact */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-px bg-blaze shrink-0" aria-hidden="true" />
                <span className="font-changa text-[9px] uppercase tracking-[0.3em] text-blaze-text">
                  {d('footer_contact_title') || 'Contact'}
                </span>
              </div>
              <ul className="flex flex-col gap-3" aria-label="Contact information">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-3.5 h-3.5 text-blaze shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="font-lato text-sm text-white/60 leading-relaxed">
                    {d('footer_contact_line1') || '502 3rd Ave W, Bradenton, FL 34205'}
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-3.5 h-3.5 text-blaze shrink-0" aria-hidden="true" />
                  <a
                    href={`tel:${(d('footer_contact_line3') || '9419267677').replace(/\D/g, '')}`}
                    className="font-lato text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
                  >
                    {d('footer_contact_line3') || '941-926-POPS (7677)'}
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-3.5 h-3.5 text-blaze shrink-0" aria-hidden="true" />
                  <a
                    href="mailto:Info@ThePopsOrchestra.org"
                    className="font-lato text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
                  >
                    Info@ThePopsOrchestra.org
                  </a>
                </li>
              </ul>
            </div>
            {/* Quick links */}
            <nav aria-label="Footer quick links" className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-px bg-blaze shrink-0" aria-hidden="true" />
                <span className="font-changa text-[9px] uppercase tracking-[0.3em] text-blaze-text">
                  {d('footer_quick_links_title') || 'Quick Links'}
                </span>
              </div>
              <ul role="list" className="flex flex-col gap-2.5">
                {footerLinks.map(({ text, href }, i) => (
                  <li key={i} className="flex items-center gap-2 group">
                    <ArrowRight
                      className="w-2.5 h-2.5 text-blaze/40 group-hover:text-blaze transition-colors shrink-0"
                      aria-hidden="true"
                    />
                    <Link
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="font-lato text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            {/* Season */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-px bg-blaze shrink-0" aria-hidden="true" />
                <span className="font-changa text-[9px] uppercase tracking-[0.3em] text-blaze-text">
                  2026–27 Season
                </span>
              </div>
              <ul className="flex flex-col gap-2.5">
                {footerLinksSeason.map(({ text, href }) => (
                  <li key={text} className="flex items-center gap-2 group">
                    <ArrowRight
                      className="w-2.5 h-2.5 text-blaze/40 group-hover:text-blaze transition-colors shrink-0"
                      aria-hidden="true"
                    />
                    <Link
                      href={href}
                      className="font-lato text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* Get Involved */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-px bg-blaze shrink-0" aria-hidden="true" />
                <span className="font-changa text-[9px] uppercase tracking-[0.3em] text-blaze-text">Get Involved</span>
              </div>
              <ul className="flex flex-col gap-2.5">
                {footerLinksGetInvolved.map(({ text, href }) => (
                  <li key={text} className="flex items-center gap-2 group">
                    <ArrowRight
                      className="w-2.5 h-2.5 text-blaze/40 group-hover:text-blaze transition-colors shrink-0"
                      aria-hidden="true"
                    />
                    <Link
                      href={href}
                      className="font-lato text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tier 3 — Credits ───────────────────────────────────────────── */}
      <div className="px-4 990:px-0 py-4">
        <div className="max-w-[320px] 430:max-w-130 760:max-w-xl 990:max-w-200 1200:max-w-screen-1160 1590:max-w-300 mx-auto flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <p className="font-changa text-[10px] 480:text-[12px] uppercase tracking-widest text-white/25 text-center 480:text-left">
            <small>© {new Date().getFullYear()} The Pops Orchestra of Bradenton & Sarasota. All rights reserved.</small>
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="https://sqysh.io?lead_source=the_pops_orchestra"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Website designed and developed by Sqysh (opens in new tab)"
              className="flex items-center gap-1 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
            >
              <span className="font-lato text-xs text-white/25 group-hover:text-white/60 transition-colors">
                Built by
              </span>
              <span className="sqysh-gradient text-xs font-bold font-mono">Sqysh</span>
            </Link>
            <div className="w-px h-3 bg-white/10" aria-hidden="true" />
            <button
              type="button"
              aria-label="Scroll back to top of page"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-white/25 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze p-1"
            >
              <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
