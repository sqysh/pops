'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface Props {
  pending: number
  responded: number
  potentialSpam: number
  href: string
}

export function InquiriesCard({ pending, responded, potentialSpam, href }: Props) {
  return (
    <Link href={href} className="block h-full group">
      <div className="bg-surface-dark border border-border-dark flex flex-col h-full hover:border-white/10 transition-colors overflow-hidden">
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-3 py-2 border-b border-border-dark">
          <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-dark">[ INQUIRIES ]</span>
          <div className="flex items-center gap-1.5">
            {potentialSpam > 0 && (
              <span className="text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.5 border text-orange-400 border-orange-400/30 bg-orange-400/5 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-orange-400 shrink-0" aria-hidden="true" />
                {potentialSpam} <span className="block 760:hidden 1160:block">flagged</span>
              </span>
            )}
            {pending > 0 && (
              <span className="text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.5 border text-amber-400 border-amber-400/30 bg-amber-400/5 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-amber-400 shrink-0" aria-hidden="true" />
                {pending} <span className="block 760:hidden 1160:block">pending</span>
              </span>
            )}
            {pending === 0 && potentialSpam === 0 && (
              <span className="text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.5 border text-emerald-400 border-emerald-400/30 bg-emerald-400/5 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-400 shrink-0" aria-hidden="true" />
                All Clear
              </span>
            )}
          </div>
        </div>

        {/* Marquee — only when pending */}
        {pending > 0 && (
          <div className="shrink-0 border-b border-amber-400/20 bg-amber-400/5 overflow-hidden py-0.5">
            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="flex whitespace-nowrap"
            >
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <span key={i} className="text-[8px] font-mono text-amber-400/60 pr-8">
                  <span className="text-amber-400">●</span> {pending} inquiry{pending !== 1 ? 'ies' : 'y'} awaiting
                  response
                  <span className="text-amber-400/30 mx-3">·</span>
                </span>
              ))}
            </motion.div>
          </div>
        )}

        {/* Marquee — only when flagged */}
        {potentialSpam > 0 && (
          <div className="shrink-0 border-b border-orange-400/20 bg-orange-400/5 overflow-hidden py-0.5">
            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="flex whitespace-nowrap"
            >
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <span key={i} className="text-[8px] font-mono text-orange-400/60 pr-8">
                  <span className="text-orange-400">●</span> {potentialSpam} message{potentialSpam !== 1 ? 's' : ''}{' '}
                  flagged as potential spam — review and act
                  <span className="text-orange-400/30 mx-3">·</span>
                </span>
              ))}
            </motion.div>
          </div>
        )}

        {/* Stats */}
        <div className="flex-1 min-h-20 760:min-h-auto flex items-center divide-x divide-border-dark overflow-hidden">
          {potentialSpam > 0 && (
            <div className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1 min-w-0">
              <span className="font-mono font-bold tabular-nums leading-none text-xl text-orange-400">
                {potentialSpam}
              </span>
              <span className="text-[8px] font-mono uppercase tracking-widest text-orange-400/50">Flagged</span>
            </div>
          )}

          <div className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1 min-w-0">
            <span
              className={`font-mono font-bold tabular-nums leading-none text-xl ${pending > 0 ? 'text-amber-400' : 'text-text-dark'}`}
            >
              {pending}
            </span>
            <span className="text-[8px] font-mono uppercase tracking-widest text-muted-dark/70">Pending</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1 min-w-0">
            <span className="font-mono font-bold tabular-nums leading-none text-xl text-text-dark">{responded}</span>
            <span className="text-[8px] font-mono uppercase tracking-widest text-muted-dark/70">Responded</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
