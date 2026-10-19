import { type ReactNode } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { FloatingParticles } from '@/components/layout/FloatingParticles'

interface Crumb {
  label: string
  href?: string
}

interface CompactPageHeroProps {
  /** Breadcrumb trail, embedded at the top of the hero. The last item is the
   *  current page and renders without a link. "Home" is prepended automatically. */
  breadcrumb: string | Crumb[]
  /** Small eyebrow line above the heading. Defaults to the org name. */
  eyebrow?: string
  /** Main heading (single line — this is the compact variant). */
  heading: ReactNode
  /** Optional supporting line under the heading. */
  description?: ReactNode
  /** Background image path. Defaults to the fire image. */
  backgroundImage?: string
}

export default function CompactPageHero({
  breadcrumb,
  eyebrow = 'The Pops Orchestra',
  heading,
  description,
  backgroundImage = '/images/nikki-fire.webp'
}: CompactPageHeroProps) {
  // Normalize: a bare string becomes a single current-page crumb.
  const crumbs: Crumb[] = typeof breadcrumb === 'string' ? [{ label: breadcrumb }] : breadcrumb
  const trail: Crumb[] = [{ label: 'Home', href: '/' }, ...crumbs]

  return (
    // the negative margin has to match the header's height at each breakpoint,
    // otherwise the hero slides past the top of the page on small screens
    <section className="relative overflow-hidden -mt-14 430:-mt-16 sm:-mt-20">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center'
        }}
        aria-hidden="true"
      />
      <FloatingParticles count={80} />
      <div className="absolute inset-0 bg-black/30" />
      {/* Fade to black at the bottom instead of a hard border */}
      <div className="absolute inset-x-0 bottom-0 h-24 760:h-32 bg-linear-to-b from-transparent to-black" aria-hidden="true" />

      {/* pt clears the transparent header the section slides under */}
      <div className="relative max-w-5xl mx-auto px-4 760:px-6 pt-30 430:pt-40 760:pt-56 pb-16 430:pb-20 760:pb-36 flex flex-col gap-3 760:gap-4">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center flex-wrap gap-x-1.5 gap-y-1 font-mono text-[11px] 430:text-xs uppercase tracking-widest 430:tracking-[0.15em]">
            {trail.map((crumb, i) => {
              const isLast = i === trail.length - 1

              return (
                <li key={`${crumb.label}-${i}`} className="flex items-center gap-1.5 min-w-0">
                  {crumb.href && !isLast ? (
                    <Link
                      href={crumb.href}
                      className="text-white/40 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze rounded-sm"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span
                      className={`truncate ${isLast ? 'text-blaze-text' : 'text-white/40'}`}
                      aria-current={isLast ? 'page' : undefined}
                    >
                      {crumb.label}
                    </span>
                  )}
                  {!isLast && <ChevronRight className="w-3 h-3 text-white/20 shrink-0" aria-hidden="true" />}
                </li>
              )
            })}
          </ol>
        </nav>

        <div className="flex items-center gap-2.5 760:gap-3">
          <div className="w-4 760:w-5 h-px bg-blaze shrink-0" aria-hidden="true" />
          <span className="font-changa text-[11px] 430:text-xs uppercase tracking-[0.2em] 760:tracking-[0.3em] text-white/70">
            {eyebrow}
          </span>
        </div>

        <h1 className="font-changa font-black text-[28px] 430:text-3xl 760:text-5xl text-white leading-tight 760:leading-[0.95] max-w-2xl text-balance wrap-break-word">
          {heading}
        </h1>

        {description && (
          <p className="font-lato text-white/80 text-sm 430:text-base leading-relaxed max-w-lg text-pretty">{description}</p>
        )}
      </div>
    </section>
  )
}
