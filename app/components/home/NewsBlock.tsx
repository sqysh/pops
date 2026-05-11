'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { News } from '@prisma/client'
import Picture from '../common/Picture'

export function NewsBlock({ news }: { news: News[] }) {
  const published = news.filter((n) => n.isPublished).slice(0, 3)

  if (!published.length) return null

  const [featured, ...rest] = published

  return (
    <section className="bg-neutral-950 py-24 sm:py-32 px-4 990:px-12 xl:px-4" aria-labelledby="news-heading">
      <div className="max-w-[320px] 430:max-w-130 760:max-w-xl 990:max-w-200 1200:max-w-screen-1160 1590:max-w-300 mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-blaze" aria-hidden="true" />
              <span className="font-heebo text-[11px] tracking-[0.35em] uppercase text-blaze-text">Latest</span>
            </div>
            <h2
              id="news-heading"
              className="font-c-infant font-bold text-4xl sm:text-5xl uppercase tracking-wide text-white leading-none"
            >
              News
            </h2>
          </div>
          <Link
            href="/news"
            aria-label="View all news articles"
            className="group inline-flex items-center gap-3 font-heebo text-xs uppercase tracking-[0.25em] text-blaze-text hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze shrink-0"
          >
            All News
            <div className="w-6 h-px bg-blaze group-hover:w-10 transition-all duration-300" aria-hidden="true" />
          </Link>
        </motion.div>

        {/* Grid — featured large + two smaller */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/5">
          {/* Featured */}
          {featured && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:row-span-2 bg-neutral-950"
            >
              <Link
                href={`/news/${featured.id}`}
                className="group flex flex-col h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-inset"
                aria-label={featured.title}
              >
                {/* Image */}
                <div className="overflow-hidden aspect-video lg:aspect-auto lg:flex-1">
                  {featured.imageUrl ? (
                    <Picture
                      priority
                      src={featured.imageUrl}
                      alt={featured.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/5 flex items-center justify-center">
                      <span className="font-heebo text-white/40 text-xs uppercase tracking-widest">
                        The Pops Orchestra
                      </span>
                    </div>
                  )}
                </div>

                {/* Text */}
                <div className="p-8">
                  <p className="font-heebo text-[10px] tracking-[0.25em] uppercase text-white/70 mb-3">
                    {new Date(featured.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                  <h3 className="font-c-infant font-bold text-white text-2xl sm:text-3xl leading-tight mb-3 group-hover:text-blaze-text transition-colors">
                    {featured.title}
                  </h3>
                  {featured.excerpt && (
                    <p className="font-heebo text-white/60 text-sm leading-relaxed line-clamp-3 mb-5">
                      {featured.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-2 font-heebo text-[11px] uppercase tracking-[0.2em] text-blaze-text">
                    Read More
                    <ArrowUpRight
                      className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Secondary articles */}
          {rest.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i + 1) * 0.08 }}
              className="bg-neutral-950"
            >
              <Link
                href={`/news/${article.id}`}
                className="group flex gap-5 p-6 sm:p-8 h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-inset"
                aria-label={article.title}
              >
                {/* Thumbnail */}
                <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 overflow-hidden">
                  {article.imageUrl ? (
                    <Picture
                      priority={false}
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/5" aria-hidden="true" />
                  )}
                </div>

                {/* Text */}
                <div className="min-w-0 flex flex-col justify-center">
                  <p className="font-heebo text-[10px] tracking-[0.2em] uppercase text-white/70 mb-2">
                    {new Date(article.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                  <h3 className="font-c-infant font-bold text-white text-lg leading-tight mb-2 group-hover:text-blaze-text transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="font-heebo text-white/80 text-sm leading-relaxed line-clamp-3 mb-5">
                      {article.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
