import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { pageCopy } from '@/app/lib/page-content/copy'
import { pageContent } from '@/app/lib/constants/page-content/bubbles-bash'

export function BubblesBashPromo({ content }: { content?: unknown }) {
  const { t } = pageCopy(content, pageContent)
  const title = t('bash_title')

  return (
    <section
      aria-labelledby="bubbles-bash-promo-heading"
      className="relative bg-[#040608] border-y border-[#d4af37]/30 overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.12), transparent 70%)' }}
        aria-hidden="true"
      />
      <div className="relative max-w-[320px] 430:max-w-130 760:max-w-xl 990:max-w-200 1200:max-w-screen-1160 1590:max-w-300 mx-auto px-4 990:px-0 py-14 760:py-20 flex flex-col items-center text-center gap-5">
        <p className="font-changa text-xs uppercase tracking-[0.3em] text-[#d4af37]">{t('bash_promo_eyebrow')}</p>
        <h2
          id="bubbles-bash-promo-heading"
          className="font-changa text-3xl 430:text-4xl 990:text-5xl leading-none"
          style={{
            background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          {title}
        </h2>
        <p className="font-changa text-sm 430:text-base uppercase tracking-[0.2em] text-white">{t('bash_date')}</p>
        <p className="font-lato text-white/80 text-sm 430:text-base max-w-xl leading-relaxed">
          {t('bash_promo_description')}
        </p>
        <Link
          href="/bubbles-bash"
          aria-label={`${t('bash_promo_button')}: ${title}`}
          className="inline-flex items-center gap-2 px-6 py-3 border border-[#d4af37] bg-[#d4af37] hover:bg-[#f4d03f] text-black font-changa text-sm uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4d03f] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          {t('bash_promo_button')}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
