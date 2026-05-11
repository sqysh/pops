'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Calendar, ArrowRight } from 'lucide-react'
import type { News } from '@prisma/client'
import Picture from '../../components/common/Picture'
import { itemVariants } from '@/app/lib/constants/motion'
import Link from 'next/link'

export default function PublicNewsClient({ news }: { news: News[] }) {
  const router = useRouter()

  if (!news.length) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-[11px] font-mono tracking-[0.2em] uppercase text-white/60">No news articles yet</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-20">
        {/* Back Button */}
        <Link
          href="/"
          className="mb-8 text-[11px] font-mono tracking-[0.2em] uppercase text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blaze"
        >
          ← Back to Home
        </Link>

        {/* Page Header */}
        <header className="w-full text-center flex flex-col items-center pb-20 border-b border-white/10">
          <p className="font-changa text-xs uppercase tracking-[0.3em] text-blaze-text mb-4">The Pops Orchestra</p>
          <div className="flex items-center gap-3 430:gap-4 justify-center mb-4">
            <div className="w-8 430:w-16 h-px bg-blaze shrink-0" aria-hidden="true" />
            <h1 className="text-4xl 430:text-5xl sm:text-6xl font-changa text-white leading-none">News & Updates</h1>
            <div className="w-8 430:w-16 h-px bg-blaze shrink-0" aria-hidden="true" />
          </div>
        </header>

        {/* Grid */}
        <div className="grid grid-cols-1 760:grid-cols-2 990:grid-cols-3 gap-8 pt-12">
          {news.map((article, index) => (
            <motion.article
              key={article.id}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={itemVariants}
              onClick={() => router.push(`/news/${article.id}`)}
              className="group cursor-pointer"
            >
              {/* Image */}
              {article.imageUrl && (
                <div className="relative aspect-video overflow-hidden mb-4 bg-white/5">
                  <Picture
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    width={600}
                    height={400}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </div>
              )}

              {/* Content */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-3 h-3 text-blaze-text" aria-hidden="true" />
                  <time className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/60">
                    {new Date(article.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </time>
                </div>

                <h2 className="font-changa text-xl 430:text-2xl text-white group-hover:text-blaze-text transition-colors mb-2 leading-tight">
                  {article.title}
                </h2>

                {article.excerpt && (
                  <p className="text-white/60 text-sm leading-relaxed mb-4 line-clamp-3">{article.excerpt}</p>
                )}

                <div className="flex items-center gap-2 text-blaze-text text-[11px] font-mono tracking-[0.15em] uppercase group-hover:gap-3 transition-all">
                  Read More
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  )
}
