'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export function DashMarquees() {
  return (
    <div className="shrink-0 flex flex-col">
      {/* Admin only test pages */}
      <div className="border-b border-blue-500/20 bg-blue-500/5 overflow-hidden py-1">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
          className="flex whitespace-nowrap"
        >
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span key={i} className="text-[9px] font-mono text-blue-400/70 pr-16">
              <span className="text-blue-400">● ADMIN ONLY —</span> Concert preview at{' '}
              <Link
                href="/concerts-test"
                className="text-blue-400 underline underline-offset-2 hover:text-blue-300 transition-colors"
              >
                /concerts-test
              </Link>
              <span className="text-blue-500/50 mx-4">·</span>
              Subscriptions & flex packages at{' '}
              <Link
                href="/subscriptions-flex-test"
                className="text-blue-400 underline underline-offset-2 hover:text-blue-300 transition-colors"
              >
                /subscriptions-flex-test
              </Link>
              <span className="text-blue-500/50 mx-4">·</span>
              Restricted to Admin and Conductor roles
              <span className="text-blue-500/50 mx-4">·</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* Upcoming deadlines */}
      <div className="border-b border-purple-500/20 bg-purple-500/5 overflow-hidden py-1">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          className="flex whitespace-nowrap"
        >
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="text-[9px] font-mono text-purple-400/70 pr-16">
              <span className="text-purple-400">⚑ JUNE 22 —</span> Season subscription button goes live ·{' '}
              <a
                href="https://thepopsorchestra.app.getcuebox.com/o/21NL0B8D/season-subscriptions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 underline underline-offset-2 hover:text-purple-300 transition-colors"
              >
                URL ready
              </a>
              <span className="text-purple-500/50 mx-4">·</span>
              <span className="text-purple-400">⚑ AUGUST 3 —</span> Individual tickets, 3-show flex & 4-show flex go on
              sale · Public <span className="text-purple-400">/concerts</span> page launches
              <span className="text-purple-500/50 mx-4">·</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* Donations page marquee */}
      <div className="border-b border-lime-500/20 bg-lime-500/5 overflow-hidden py-1">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="flex whitespace-nowrap"
        >
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span key={i} className="text-[9px] font-mono text-lime-400/70 pr-16">
              <span className="text-lime-400">● DONATIONS PAGE LIVE —</span> 5 funds linking directly to CueBox
              campaigns
              <span className="text-lime-500/50 mx-4">·</span>
              Florida statute language at the bottom
              <span className="text-lime-500/50 mx-4">·</span>
              View at{' '}
              <Link
                href="/donate"
                className="text-lime-400 underline underline-offset-2 hover:text-lime-300 transition-colors"
              >
                /donate
              </Link>
              <span className="text-lime-500/50 mx-4">·</span>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
