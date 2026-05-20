import { FloatingParticles } from '../FloatingParticles'

interface PageHeroProps {
  eyebrow: string
  heading: string
  subheading?: string
}

export function PageHero({ eyebrow, heading, subheading }: PageHeroProps) {
  return (
    <header className="relative z-10 pt-32 pb-20 text-center border-b border-white/10">
      <FloatingParticles count={80} />

      <div className="max-w-[320px] 430:max-w-130 760:max-w-xl 990:max-w-200 1200:max-w-screen-1160 mx-auto flex flex-col items-center">
        <p className="font-changa text-sm uppercase tracking-[0.3em] text-blaze-text mb-4">{eyebrow}</p>
        <div className="flex items-center gap-3 430:gap-4 justify-center mb-4">
          <div className="w-8 430:w-16 h-px bg-blaze shrink-0" aria-hidden="true" />
          <h1 className="text-4xl 430:text-5xl sm:text-6xl font-changa text-white leading-none">{heading}</h1>
          <div className="w-8 430:w-16 h-px bg-blaze shrink-0" aria-hidden="true" />
        </div>
        {subheading && (
          <p className="font-lato text-white/50 text-sm 430:text-base max-w-xl leading-relaxed mt-4">{subheading}</p>
        )}
      </div>
    </header>
  )
}
