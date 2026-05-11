import { IQuestion } from '@/app/types/entities/question'
import { motion } from 'framer-motion'
import { COL } from '@/app/lib/constants/question.constants'

export function QuestionRow({
  question,
  index,
  onClick
}: {
  question: IQuestion
  index: number
  onClick: (q: IQuestion) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, duration: 0.2 }}
      onClick={() => onClick(question)}
      className={`grid ${COL} items-center gap-3 px-3 py-2.5 border-b border-border-dark/40 last:border-0 group hover:bg-black/40 transition-colors cursor-pointer ${question.isPotentialSpam ? 'border-l-2 border-l-orange-500/60 bg-orange-500/5' : !question.hasResponded ? 'bg-amber-400/2' : ''}`}
    >
      {/* Name */}
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-text-dark truncate">{question.name}</span>
          {question.isSpam && (
            <span className="text-[6px] font-mono uppercase tracking-widest px-1 py-0.5 border text-red-400 border-red-400/30 bg-red-400/5 shrink-0">
              Spam
            </span>
          )}
          {!question.isSpam && question.isPotentialSpam && (
            <span className="text-[6px] font-mono uppercase tracking-widest px-1 py-0.5 border text-orange-400 border-orange-400/30 bg-orange-400/5 shrink-0">
              Flagged
            </span>
          )}
        </div>
        <span className="text-[8px] font-mono text-muted-dark/60 truncate block">{question.email}</span>
      </div>

      <span
        className={`text-[11px] font-mono truncate ${question.hasResponded ? 'text-text-dark/90' : 'text-text-dark'}`}
      >
        {question.email}
      </span>

      {/* Message preview */}
      <span
        className={`text-[10px] font-mono truncate col-span-1 ${question.hasResponded ? 'text-text-dark/40' : 'text-text-dark/70'}`}
      >
        {question.message.slice(0, 100)}
        {question.message.length > 100 ? '...' : ''}
      </span>

      {/* Status */}
      <div className="flex">
        <span
          className={`text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.5 border flex items-center gap-1 ${
            question.hasResponded
              ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5'
              : 'text-amber-400 border-amber-400/30 bg-amber-400/5'
          }`}
        >
          <span
            className="w-1 h-1 rounded-full shrink-0"
            style={{ background: question.hasResponded ? '#4ade80' : '#facc15' }}
            aria-hidden="true"
          />
          {question.hasResponded ? 'Done' : 'Pending'}
        </span>
      </div>
    </motion.div>
  )
}
