'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Calendar, ExternalLink } from 'lucide-react'
import type { News } from '@prisma/client'
import Picture from '../../../components/common/Picture'

interface Props {
  article: News
}

export default function NewsDetailsClient({ article }: Props) {
  const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  const paragraphs = article.body ? article.body.split('\n').filter(Boolean) : []

  return (
    <div className="bg-black min-h-screen text-white">
      {/* ── Hero ── */}
      <div className="relative">
        {article.imageUrl ? (
          <>
            <div className="w-full h-[50vh] sm:h-[60vh] overflow-hidden">
              <Picture priority src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />
          </>
        ) : (
          <div className="w-full h-32 bg-neutral-950" />
        )}
      </div>

      {/* ── Content ── */}
      <div className="max-w-3xl mx-auto px-6 sm:px-10 pb-24 sm:pb-32">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="-mt-6 relative z-10 mb-12"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-heebo text-xs tracking-[0.2em] uppercase text-white/60 hover:text-blaze-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            Back to News
          </Link>
        </motion.div>

        {/* Article */}
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          aria-labelledby="article-heading"
        >
          {/* Meta */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-px bg-blaze" aria-hidden="true" />
            <div className="flex items-center gap-2 text-white/50 font-heebo text-xs">
              <Calendar className="w-3 h-3 text-blaze-text" aria-hidden="true" />
              <time dateTime={article.createdAt.toISOString()}>{formattedDate}</time>
            </div>
          </div>

          {/* Title */}
          <h1
            id="article-heading"
            className="font-c-infant font-bold text-4xl sm:text-5xl lg:text-6xl uppercase tracking-wide text-white leading-tight mb-6"
          >
            {article.title}
          </h1>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="font-heebo text-white/60 text-lg sm:text-xl leading-relaxed mb-10 border-l-2 border-blaze pl-5">
              {article.excerpt}
            </p>
          )}

          {/* Divider */}
          <div className="w-12 h-px bg-blaze mb-10" aria-hidden="true" />

          {/* External Link */}
          {article.externalLink && (
            <a
              href={article.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 border border-white/20 hover:border-blaze text-white/50 hover:text-blaze-text font-heebo text-xs uppercase tracking-[0.2em] px-4 py-2.5 transition-colors mb-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
            >
              <ExternalLink
                className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-0.5 transition-transform"
                aria-hidden="true"
              />
              Read Original Article
            </a>
          )}

          {/* Body */}
          {paragraphs.length > 0 ? (
            <div className="space-y-6">
              {paragraphs.map((p, i) => (
                <p key={i} className="font-heebo font-light text-white/70 text-base sm:text-lg leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          ) : (
            <p className="font-heebo text-white/50 text-sm italic">No content available.</p>
          )}
        </motion.article>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 pt-10 border-t border-white/10 flex items-center justify-between gap-4"
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-3 font-heebo text-xs uppercase tracking-[0.25em] text-blaze-text hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
            All News
          </Link>
          <p className="font-heebo text-[11px] uppercase tracking-widest text-white/40">The Pops Orchestra</p>
        </motion.div>
      </div>
    </div>
  )
}
