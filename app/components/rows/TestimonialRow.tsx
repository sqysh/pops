import { COL } from '@/app/lib/constants/testimonial.constants'
import { Testimonial } from '@prisma/client'
import { motion } from 'framer-motion'

export function TestimonialRow({
  testimonial,
  index,
  onEdit
}: {
  testimonial: Testimonial
  index: number
  onEdit: (t: Testimonial) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.02, duration: 0.2 }}
      onClick={() => onEdit(testimonial)}
      className={`grid ${COL} items-center gap-3 px-3 py-2.5 border-b border-border-dark/40 last:border-0 group hover:bg-black transition-colors cursor-pointer`}
    >
      {/* Author */}
      <div className="min-w-0">
        <span className="text-[12px] font-mono text-text-dark truncate block">{testimonial.author}</span>
        <span className="text-[9px] font-mono text-muted-dark/70 truncate block">
          {new Date(testimonial.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </span>
      </div>

      {/* Quote */}
      <span className="text-[10px] font-mono text-muted-dark/80 truncate italic">&quot;{testimonial.quote}&quot;</span>

      {/* Title */}
      <span className="text-[10px] font-mono text-muted-dark/80 truncate">{testimonial.title || '—'}</span>

      {/* Status */}
      <div className="flex justify-end">
        <span
          className={`text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.5 border ${
            testimonial.isPublished
              ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5'
              : 'text-muted-dark/70 border-border-dark'
          }`}
        >
          {testimonial.isPublished ? 'Live' : 'Draft'}
        </span>
      </div>
    </motion.div>
  )
}
