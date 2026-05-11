import { AnimatePresence, motion } from 'framer-motion'
import { Ban, ChevronDown } from 'lucide-react'
import { useState } from 'react'

export function SpamPanel({ questions, spamCount, setSelectedQuestion }) {
  const [spamExpanded, setSpamExpanded] = useState(false)
  return (
    <div className="shrink-0 border-t border-border-dark">
      {/* Toggle bar */}
      <button
        type="button"
        onClick={() => setSpamExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-black/40 transition-colors group"
        aria-expanded={spamExpanded}
      >
        <div className="flex items-center gap-3">
          <Ban className="w-3.5 h-3.5 text-red-400 shrink-0" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-text-dark group-hover:text-white transition-colors">
            Spam
          </span>
          <span className="text-[10px] font-mono text-muted-dark">{spamCount} confirmed</span>
        </div>
        <motion.div animate={{ rotate: spamExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-muted-dark group-hover:text-text-dark transition-colors" />
        </motion.div>
      </button>

      {/* Spam list */}
      <AnimatePresence initial={false}>
        {spamExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-border-dark/60">
              <div className="flex items-center justify-between px-4 py-2 bg-bg-dark border-b border-border-dark/40">
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-dark">
                  {spamCount} messages
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-dark">Click to review</span>
              </div>
              <div className="max-h-56 overflow-y-auto divide-y divide-border-dark/40">
                {questions
                  .filter((q) => q.isSpam)
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((q) => (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setSelectedQuestion(q)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-dark transition-colors text-left group/spam"
                    >
                      {/* Spam row icon */}
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${q.isSpam ? 'bg-red-400' : 'bg-orange-400'}`}
                        aria-hidden="true"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-mono text-text-dark group-hover/spam:text-white transition-colors truncate block">
                          {q.name}
                        </span>
                        <span className="text-[10px] font-mono text-muted-dark truncate block mt-0.5">
                          {q.message.slice(0, 60)}
                          {q.message.length > 60 ? '...' : ''}
                        </span>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span
                          className={`text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 border ${
                            q.isSpam
                              ? 'text-red-400 border-red-400/40 bg-red-400/10'
                              : 'text-orange-400 border-orange-400/40 bg-orange-400/10'
                          }`}
                        >
                          {q.isSpam ? 'Spam' : 'Flagged'}
                        </span>
                        <span className="text-[9px] font-mono text-muted-dark tabular-nums">
                          {new Date(q.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
