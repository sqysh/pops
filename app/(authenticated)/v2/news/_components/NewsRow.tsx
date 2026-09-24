'use client'

import { News } from '@prisma/client'
import { motion } from 'framer-motion'
import { ChevronRight, ExternalLink, ImageOff } from 'lucide-react'
import { COL } from '@/app/lib/constants/news.constants'
import { formatDate } from '@/app/lib/utils/date.utils'
import Picture from '@/components/common/Picture'

export function NewsRow({ news, index, onEdit }: { news: News; index: number; onEdit: (n: News) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, delay: Math.min(index * 0.01, 0.15) }}
      role="button"
      tabIndex={0}
      onClick={() => onEdit(news)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onEdit(news)
        }
      }}
      aria-label={`Edit ${news.title}`}
      className={`grid ${COL} items-center gap-3 px-4 py-3 border-b border-neutral-200 last:border-0 cursor-pointer transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-inset group`}
    >
      {/* Image */}
      <div className="w-10 h-10 shrink-0 overflow-hidden border border-neutral-200 bg-neutral-100 flex items-center justify-center">
        {news.imageUrl ? (
          <Picture src={news.imageUrl} alt="" width={40} height={40} className="object-cover w-full h-auto" />
        ) : (
          <ImageOff className="w-4 h-4 text-neutral-400" aria-label="No image" />
        )}
      </div>

      {/* Title */}
      <span className="truncate text-neutral-900">{news.title}</span>

      {/* Excerpt */}
      <span className="truncate text-neutral-600">{news.excerpt || '—'}</span>

      {/* Date */}
      <span className="truncate text-neutral-500 tabular-nums">{formatDate(news.createdAt)}</span>

      {/* Status */}
      <div className="flex justify-end items-center gap-2">
        {news.externalLink && <ExternalLink className="w-4 h-4 shrink-0 text-neutral-400" aria-label="Links to another site" />}
        <span
          className={`inline-flex items-center gap-1.5 shrink-0 text-xs font-medium rounded-full ring-1 px-2 py-0.5 ${
            news.isPublished
              ? 'text-emerald-700 bg-emerald-50 ring-emerald-200'
              : 'text-neutral-600 bg-neutral-100 ring-neutral-300'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 ${news.isPublished ? 'bg-emerald-500' : 'bg-neutral-400'}`}
            aria-hidden="true"
          />
          {news.isPublished ? 'Live' : 'Draft'}
        </span>
      </div>

      <div className="flex justify-end">
        <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-600 transition-colors" aria-hidden="true" />
      </div>
    </motion.div>
  )
}
