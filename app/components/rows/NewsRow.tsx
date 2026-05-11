import { News } from '@prisma/client'
import { motion } from 'framer-motion'
import { COL } from '@/app/lib/constants/news.constants'
import Picture from '../common/Picture'
import { ExternalLink } from 'lucide-react'

export function NewsRow({ news, index, onEdit }: { news: News; index: number; onEdit: (n: News) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.02, duration: 0.2 }}
      onClick={() => onEdit(news)}
      className={`grid ${COL} items-center gap-3 px-3 py-3 border-b border-border-dark/40 last:border-0 hover:bg-black transition-colors cursor-pointer group`}
    >
      {/* Image */}
      <div className="w-10 h-10 border border-border-dark bg-white/5 shrink-0 overflow-hidden flex items-center justify-center">
        {news.imageUrl ? (
          <Picture src={news.imageUrl} alt={news.title} width={40} height={40} className="object-cover w-full h-full" />
        ) : (
          <span className="text-[8px] font-mono text-muted-dark/60 uppercase">IMG</span>
        )}
      </div>

      {/* Title */}
      <div className="min-w-0">
        <span className="text-[12px] font-mono text-text-dark truncate block">{news.title}</span>
      </div>

      {/* Excerpt */}
      <span className="text-[10px] font-mono text-muted-dark/80 truncate">{news.excerpt || '—'}</span>

      {/* Date */}
      <span className="text-[10px] font-mono text-muted-dark/70 tabular-nums">
        {new Date(news.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </span>

      {/* Status */}
      <div className="flex justify-end items-center gap-2">
        {news.externalLink && <ExternalLink className="w-2.5 h-2.5 text-muted-dark/60" />}
        <span
          className={`text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.5 border ${
            news.isPublished
              ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5'
              : 'text-muted-dark/70 border-border-dark'
          }`}
        >
          {news.isPublished ? 'Live' : 'Draft'}
        </span>
      </div>

      {/* Arrow */}
      <div className="flex justify-end">
        <span className="text-[9px] font-mono text-muted-dark/20 group-hover:text-muted-dark/80 transition-colors">
          →
        </span>
      </div>
    </motion.div>
  )
}
