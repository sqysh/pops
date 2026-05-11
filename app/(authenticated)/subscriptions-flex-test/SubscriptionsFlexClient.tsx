'use client'

import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'

const CUEBOX_ORG_ID = '21NL0B8D'

type SubscriptionItem = {
  id: string
  name: string
  type: 'SUBSCRIPTION' | 'FLEX'
  status: 'ON_SALE' | 'NOT_ON_SALE'
  isVisible: boolean
  publicUrl: string
  cueboxEditUrl: string
}

const ITEMS: SubscriptionItem[] = [
  {
    id: '1',
    name: 'Season 2026–27 Monday Night',
    type: 'SUBSCRIPTION',
    status: 'NOT_ON_SALE',
    isVisible: false,
    publicUrl: 'https://thepopsorchestra.app.getcuebox.com/o/21NL0B8D/season-subscriptions/L3L2V70R',
    cueboxEditUrl: `https://app.getcuebox.com/a/${CUEBOX_ORG_ID}/season-subscriptions/L3L2V70R`
  },
  {
    id: '2',
    name: 'Season 2026–27 Saturday Matinee (A)',
    type: 'SUBSCRIPTION',
    status: 'NOT_ON_SALE',
    isVisible: false,
    publicUrl: 'https://thepopsorchestra.app.getcuebox.com/o/21NL0B8D/season-subscriptions/KFWWP30J',
    cueboxEditUrl: `https://app.getcuebox.com/a/${CUEBOX_ORG_ID}/season-subscriptions/KFWWP30J`
  },
  {
    id: '3',
    name: 'Season 2026–27 Saturday Matinee (B)',
    type: 'SUBSCRIPTION',
    status: 'NOT_ON_SALE',
    isVisible: false,
    publicUrl: 'https://thepopsorchestra.app.getcuebox.com/o/21NL0B8D/season-subscriptions/3082ZPSN',
    cueboxEditUrl: `https://app.getcuebox.com/a/${CUEBOX_ORG_ID}/season-subscriptions/3082ZPSN`
  },
  {
    id: '4',
    name: 'Season 2026–27 Sunday Matinee',
    type: 'SUBSCRIPTION',
    status: 'ON_SALE',
    isVisible: false,
    publicUrl: 'https://thepopsorchestra.app.getcuebox.com/o/21NL0B8D/season-subscriptions/WSP2SB74',
    cueboxEditUrl: `https://app.getcuebox.com/a/${CUEBOX_ORG_ID}/season-subscriptions/WSP2SB74`
  },
  {
    id: '5',
    name: 'Three Show Flex',
    type: 'FLEX',
    status: 'NOT_ON_SALE',
    isVisible: false,
    publicUrl: 'https://thepopsorchestra.app.getcuebox.com/o/21NL0B8D/season-subscriptions/609J27T0',
    cueboxEditUrl: `https://app.getcuebox.com/a/${CUEBOX_ORG_ID}/season-subscriptions/609J27T0`
  },
  {
    id: '6',
    name: 'Four Show Flex',
    type: 'FLEX',
    status: 'NOT_ON_SALE',
    isVisible: false,
    publicUrl: 'https://thepopsorchestra.app.getcuebox.com/o/21NL0B8D/season-subscriptions/Q3TYSH38',
    cueboxEditUrl: `https://app.getcuebox.com/a/${CUEBOX_ORG_ID}/season-subscriptions/Q3TYSH38`
  }
]

function statusCls(status: SubscriptionItem['status']) {
  return status === 'ON_SALE'
    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
    : 'bg-white/5 text-white/30 border border-white/10'
}

export default function SubscriptionsFlexClient() {
  const subscriptions = ITEMS.filter((i) => i.type === 'SUBSCRIPTION')
  const flex = ITEMS.filter((i) => i.type === 'FLEX')

  return (
    <div className="min-h-screen bg-bg-dark text-text-dark">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between px-8 sm:px-12 py-6 border-b border-border-dark"
      >
        <div>
          <p className="font-mono text-[8px] tracking-[0.3em] uppercase text-primary-dark mb-0.5">Admin Only</p>
          <h1 className="font-quicksand font-black text-xl text-text-dark leading-none">
            Subscriptions & Flex Packages
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/concerts-test"
            className="font-mono text-[8px] tracking-[0.15em] uppercase text-muted-dark hover:text-text-dark transition-colors"
          >
            Concerts
          </Link>
          <div className="w-px h-4 bg-border-dark" />
          <Link
            href="/v2/dashboard"
            className="font-mono text-[8px] tracking-[0.15em] uppercase text-muted-dark hover:text-text-dark transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-8 py-12 flex flex-col gap-14">
        {/* Subscriptions */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-px h-5 bg-primary-dark" />
            <h2 className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary-dark">
              Season Subscriptions
            </h2>
          </div>
          <div className="flex flex-col">
            {subscriptions.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="flex items-center justify-between gap-6 py-5 border-b border-border-dark/50 last:border-0 group"
              >
                <div className="flex flex-col gap-1.5 min-w-0">
                  <p className="font-quicksand font-bold text-lg text-text-dark leading-none">{item.name}</p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono text-[8px] tracking-widest uppercase px-2 py-0.5 ${statusCls(item.status)}`}
                    >
                      {item.status.replace('_', ' ')}
                    </span>
                    <span
                      className={`font-mono text-[8px] tracking-widest uppercase px-2 py-0.5 ${item.isVisible ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-white/30 border border-white/10'}`}
                    >
                      {item.isVisible ? 'Visible' : 'Not Visible'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {item.publicUrl !== 'TODO' && (
                    <a
                      href={item.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-[8px] tracking-widest uppercase px-4 py-2 bg-primary-dark hover:bg-secondary-light text-white transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Public Link
                    </a>
                  )}

                  <a
                    href={item.cueboxEditUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-[8px] tracking-widest uppercase px-4 py-2 border border-border-dark hover:border-primary-dark text-muted-dark hover:text-text-dark transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Edit in CueBox
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Flex */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-px h-5 bg-primary-dark" />
            <h2 className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary-dark">Flex Packages</h2>
          </div>
          <div className="flex flex-col">
            {flex.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 + 0.24, duration: 0.4 }}
                className="flex items-center justify-between gap-6 py-5 border-b border-border-dark/50 last:border-0 group"
              >
                <div className="flex flex-col gap-1.5 min-w-0">
                  <p className="font-quicksand font-bold text-lg text-text-dark leading-none">{item.name}</p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono text-[8px] tracking-widest uppercase px-2 py-0.5 ${statusCls(item.status)}`}
                    >
                      {item.status.replace('_', ' ')}
                    </span>
                    <span
                      className={`font-mono text-[8px] tracking-widest uppercase px-2 py-0.5 ${item.isVisible ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-white/30 border border-white/10'}`}
                    >
                      {item.isVisible ? 'Visible' : 'Not Visible'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {item.publicUrl !== 'TODO' && (
                    <a
                      href={item.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-[8px] tracking-widest uppercase px-4 py-2 bg-primary-dark hover:bg-secondary-light text-white transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Public Link
                    </a>
                  )}

                  <a
                    href={item.cueboxEditUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-[8px] tracking-widest uppercase px-4 py-2 border border-border-dark hover:border-primary-dark text-muted-dark hover:text-text-dark transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Edit in CueBox
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
