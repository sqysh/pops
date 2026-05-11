// app/components/common/PublicMarquee.tsx
'use client'

import { motion } from 'framer-motion'

interface Props {
  items: string[]
  duration?: number
}

export function PublicMarquee({ items, duration = 35 }: Props) {
  return (
    <div className="border-b border-white/10 bg-white/2 overflow-hidden py-1.5">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
        className="flex whitespace-nowrap"
      >
        {[0, 1].map((copy) => (
          <span key={copy} className="flex items-center">
            {items.map((item, i) => (
              <span key={i} className="font-changa text-[10px] uppercase tracking-[0.2em] text-white/30">
                <span className="text-blaze">▸</span> {item}
                <span className="text-white/10 mx-6">·</span>
              </span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
