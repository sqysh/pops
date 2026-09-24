'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import type { Testimonial } from '@prisma/client'

interface TestimonialsBlockProps {
  testimonials: Testimonial[]
}

export function TestimonialsBlock({ testimonials }: TestimonialsBlockProps) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)

  const published = testimonials.filter((t) => t.isPublished)

  if (!published.length) return null

  const current = published[index]

  const prev = () => {
    setDirection(-1)
    setIndex((i) => (i - 1 + published.length) % published.length)
  }

  const next = () => {
    setDirection(1)
    setIndex((i) => (i + 1) % published.length)
  }

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d * 40 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d * -40 })
  }

  return (
    <section
      className="bg-black py-24 sm:py-32 px-6 sm:px-10 lg:px-16 overflow-hidden"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-8 h-px bg-blaze" aria-hidden="true" />
            <span className="font-heebo text-sm tracking-[0.35em] uppercase text-blaze-text">Testimonials</span>
            <div className="w-8 h-px bg-blaze" aria-hidden="true" />
          </div>
          <h2
            id="testimonials-heading"
            className="font-c-infant font-bold text-4xl sm:text-5xl uppercase tracking-wide text-white"
          >
            What They Say
          </h2>
        </motion.div>

        {/* Carousel */}
        <div className="relative" role="region" aria-label="Testimonials carousel" aria-roledescription="carousel">
          {/* Large quote mark */}
          <Quote
            className="absolute -top-4 -left-2 sm:-left-8 w-16 h-16 sm:w-20 sm:h-20 text-white/5 z-0 rotate-180"
            aria-hidden="true"
          />

          {/* Testimonial */}
          <div
            className="relative z-10 min-h-55 flex items-center justify-center px-4 sm:px-12"
            aria-live="polite"
            aria-atomic="true"
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="text-center"
              >
                <blockquote>
                  <p className="font-heebo font-light text-white/70 text-lg sm:text-xl lg:text-2xl leading-relaxed mb-8 italic">
                    &ldquo;{current.quote}&rdquo;
                  </p>
                  <footer>
                    <div className="w-10 h-px mx-auto mb-4 bg-blaze" aria-hidden="true" />
                    <cite className="not-italic">
                      <p className="font-c-infant font-bold text-white text-lg uppercase tracking-wide">
                        {current.author}
                      </p>
                      {current.title && <p className="font-heebo text-white/60 text-sm mt-1">{current.title}</p>}
                    </cite>
                  </footer>
                </blockquote>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          {published.length > 1 && (
            <div className="flex items-center justify-center gap-6 mt-12">
              <button
                type="button"
                onClick={prev}
                className="w-11 h-11 flex items-center justify-center border border-white/10 hover:border-blaze text-white/50 hover:text-blaze-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </button>

              {/* Dots */}
              <div className="flex items-center gap-2" role="tablist" aria-label="Testimonial indicators">
                {published.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Go to testimonial ${i + 1}`}
                    onClick={() => {
                      setDirection(i > index ? 1 : -1)
                      setIndex(i)
                    }}
                    className={`transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-offset-1 focus-visible:ring-offset-black ${
                      i === index ? 'w-6 h-1.5 bg-blaze' : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={next}
                className="w-11 h-11 flex items-center justify-center border border-white/10 hover:border-blaze text-white/50 hover:text-blaze-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          )}

          {/* Count */}
          <p
            className="text-center font-heebo text-sm tracking-[0.2em] uppercase text-white/40 mt-6"
            aria-hidden="true"
          >
            {index + 1} / {published.length}
          </p>
        </div>
      </div>
    </section>
  )
}
