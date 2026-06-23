'use client'

import { motion } from 'framer-motion'

export function DashMarquees() {
  return (
    <div className="shrink-0 flex flex-col">
      {/* Upcoming deadlines */}
      <div className="border-b border-purple-500/20 bg-purple-500/5 overflow-hidden py-1">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          className="flex whitespace-nowrap"
        >
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="text-[9px] font-mono text-purple-400/70 pr-16">
              <span className="text-purple-400">⚑ AUGUST 3 —</span> Individual tickets, 3-show flex & 4-show flex go on
              sale · Public <span className="text-purple-400">/concerts</span> page launches
              <span className="text-purple-500/50 mx-4">·</span>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
