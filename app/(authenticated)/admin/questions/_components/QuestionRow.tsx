'use client'

import { motion } from 'framer-motion'
import { COL } from '@/app/lib/constants/question.constants'
import { IQuestion } from '@/app/types/entities/question'
import { formatDate } from '@/app/lib/utils/date.utils'

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, delay: Math.min(index * 0.01, 0.15) }}
      role="button"
      tabIndex={0}
      onClick={() => onClick(question)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick(question)
        }
      }}
      aria-label={`Open inquiry from ${question.name}`}
      className={`grid ${COL} items-center gap-3 px-4 py-3 border-b border-neutral-200 cursor-pointer transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-inset`}
    >
      {/* Name */}
      <span className={`truncate ${question.hasResponded ? 'text-neutral-700' : 'font-semibold text-neutral-900'}`}>
        {question.name}
      </span>

      {/* Email */}
      <span className="truncate text-neutral-600">{question.email}</span>

      {/* Message preview */}
      <span className="truncate text-neutral-600">{question.message}</span>

      {/* Received */}
      <span className="truncate text-neutral-500 tabular-nums">{formatDate(question.createdAt)}</span>

      {/* Status */}
      <div className="flex justify-end">
        <span
          className={`inline-flex items-center gap-1.5 shrink-0 text-xs font-medium rounded-full ring-1 px-2 py-0.5 ${
            question.hasResponded
              ? 'text-emerald-700 bg-emerald-50 ring-emerald-200'
              : 'text-amber-800 bg-amber-50 ring-amber-200'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 ${question.hasResponded ? 'bg-emerald-500' : 'bg-amber-500'}`}
            aria-hidden="true"
          />
          {question.hasResponded ? 'Replied' : 'Needs reply'}
        </span>
      </div>
    </motion.div>
  )
}
