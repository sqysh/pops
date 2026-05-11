import { motion } from 'framer-motion'
import Picture from '../common/Picture'
import { Newspaper } from 'lucide-react'

export function NewsListItem({ article, i, handleSelect, selected, isNew }) {
  return (
    <motion.button
      key={article.id}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.03 }}
      onClick={() => handleSelect(article)}
      className={`w-full flex gap-3 px-4 py-3.5 border-b border-border-dark/50 last:border-0 text-left transition-colors focus-visible:outline-none group ${
        selected?.id === article.id && !isNew
          ? 'bg-primary-dark/10 border-l-2 border-l-primary-dark'
          : 'hover:bg-surface-dark'
      }`}
    >
      {/* Thumbnail */}
      <div className="shrink-0 w-14 h-14 overflow-hidden bg-surface-dark border border-border-dark">
        {article.imageUrl ? (
          <Picture priority src={article.imageUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Newspaper className="w-4 h-4 text-muted-dark/60" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className="text-text-dark text-xs font-medium truncate group-hover:text-primary-dark transition-colors">
            {article.title}
          </p>
          <span
            className={`text-[9px] font-mono uppercase shrink-0 ${
              article.isPublished ? 'text-emerald-400' : 'text-muted-dark/70'
            }`}
          >
            {article.isPublished ? 'Live' : 'Draft'}
          </span>
        </div>
        {article.excerpt && (
          <p className="text-muted-dark/80 text-[11px] leading-relaxed line-clamp-2">{article.excerpt}</p>
        )}
        <p className="text-muted-dark/70 text-[10px] font-mono mt-1">
          {new Date(article.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </p>
      </div>
    </motion.button>
  )
}
