'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type ChangeType = 'new' | 'improved' | 'fixed' | 'removed'

interface Change {
  type: ChangeType
  text: string
}

interface ChangelogEntry {
  version: string
  date: string
  summary: string
  changes: Change[]
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const CHANGELOG: ChangelogEntry[] = [
  {
    version: '3.7.0',
    date: 'May 11, 2026',
    summary: 'Camp applications, spam detection, settings page, and donations page.',
    changes: [
      // Questions / Inquiries
      {
        type: 'new',
        text: 'Automatic spam detection on incoming questions — messages are scanned on submission and flagged orange if suspicious'
      },
      {
        type: 'new',
        text: 'Two-tier spam system: isPotentialSpam (auto-flagged) and isSpam (admin-confirmed) — flagged messages stay in the main list, confirmed spam moves to the spam panel below'
      },
      {
        type: 'new',
        text: 'Spam panel — collapsible expandable section at the bottom of the questions table showing all confirmed spam, matching the CueBox API panel pattern'
      },
      {
        type: 'new',
        text: 'Mark as Spam button in the question drawer — moves message out of the main list into the spam panel'
      },
      {
        type: 'new',
        text: 'Mark as Responded button — mark a question as done without sending a reply through the system, useful for phone or outside-email replies'
      },
      {
        type: 'new',
        text: 'Note shown in drawer when admin responded outside the system (hasResponded true but no replyMessage stored)'
      },
      { type: 'new', text: 'Questions table now shows Flagged and Spam filter pills alongside Pending and Responded' },
      {
        type: 'new',
        text: 'InquiriesCard on dashboard now shows a Flagged count badge and orange stat column when potential spam is detected'
      },
      {
        type: 'new',
        text: 'Color-coded marquee strip on questions page explaining Pending, Responded, Flagged, and Spam statuses'
      },
      { type: 'improved', text: 'Question drawer label dynamically shows PENDING, RESPONDED, FLAGGED, or SPAM' },
      {
        type: 'improved',
        text: 'Flagged rows have orange left border and tint; spam rows have red left border and tint'
      },
      { type: 'improved', text: 'Reply form hidden on confirmed spam messages — no point replying to spam' },
      {
        type: 'removed',
        text: 'Delete button removed from question drawer — questions are now triaged via spam controls or responded to, not deleted'
      },

      // Camp Applications
      {
        type: 'new',
        text: 'isNew flag on camp applications — new submissions show a sky blue badge and highlighted row, clears automatically when admin opens the application'
      },
      {
        type: 'new',
        text: 'Acknowledge on click — isNew clears immediately via local state when row is clicked, no refresh needed'
      },
      {
        type: 'new',
        text: 'Duplicate detection — applications matching the same first name, last name, and phone number are automatically flagged with an orange Duplicate badge'
      },
      { type: 'new', text: 'Camp decision buttons in the application drawer — Admit, Deny, or reset to Pending' },
      { type: 'new', text: 'campStatus (ADMITTED / DENIED / PENDING) shown as a badge in each application row' },
      { type: 'new', text: 'Settings link added to the camp applications header (top right)' },
      {
        type: 'improved',
        text: 'Camp application detail drawer now shows all model fields: strings, brassAndPercussion, woodwinds, musicTeacher, referralSource, and consent badge'
      },
      { type: 'improved', text: 'All text in the camp application drawer brightened for readability' },
      {
        type: 'improved',
        text: 'Year pills in the camp applications header now always show the full unfiltered counts even when searching'
      },
      { type: 'fixed', text: 'Phone number search now works correctly — optional chaining added to Student relation' },
      {
        type: 'fixed',
        text: 'Search now runs directly on applications array instead of through useTableFilter, fixing the grouped layout search issue'
      },

      // Concerts & Public Pages
      {
        type: 'new',
        text: 'Concerts page redesigned — square images, fixed-width image column, status badge overlaid on image, editorial typography'
      },
      {
        type: 'new',
        text: 'Hero section added to concerts page with nikki-fire.webp background, FloatingParticles animation, and gradient fade'
      },
      {
        type: 'new',
        text: 'Animated particle overlay on the donate page hero — warm amber/orange bokeh particles drifting upward matching the concert photography'
      },
      {
        type: 'new',
        text: 'Public marquee component (PublicMarquee) — reusable scrolling strip for public-facing pages'
      },
      { type: 'new', text: 'Public marquees added to /donate, /concerts, and /subscriptions pages' },
      { type: 'new', text: 'Thin footer added to concerts and subscriptions pages' },
      {
        type: 'new',
        text: 'Subscriptions page rebuilt as a public-facing page with hero, contact block, and footer matching the concerts page aesthetic'
      },
      {
        type: 'improved',
        text: 'Donate page cards redesigned — colored top accent bars, larger font-changa headlines, solid CTA buttons per fund, hover lift, scroll reveal animations, sixth card for Other Ways to Give'
      },
      { type: 'improved', text: 'Donate button in public nav updated to solid bg-blaze with white text' },
      { type: 'improved', text: 'Hero background image now uses CSS background-image for better focal point control' }
    ]
  }
]

// ─── Constants ────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<ChangeType, { label: string; color: string }> = {
  new: { label: 'New', color: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5' },
  improved: { label: 'Improved', color: 'text-sky-400 border-sky-400/30 bg-sky-400/5' },
  fixed: { label: 'Fixed', color: 'text-amber-400 border-amber-400/30 bg-amber-400/5' },
  removed: { label: 'Removed', color: 'text-red-400 border-red-400/30 bg-red-400/5' }
}

// ─── Entry ────────────────────────────────────────────────────────────────────

function ChangelogEntryRow({ entry, index }: { entry: ChangelogEntry; index: number }) {
  const [open, setOpen] = useState(index === 0)

  const counts = entry.changes.reduce<Record<ChangeType, number>>(
    (acc, c) => {
      acc[c.type] = (acc[c.type] ?? 0) + 1
      return acc
    },
    { new: 0, improved: 0, fixed: 0, removed: 0 }
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="border border-border-dark bg-surface-dark"
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-black/30 transition-colors text-left group"
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Version */}
          <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 border border-primary-dark/40 text-primary-dark bg-primary-dark/5 shrink-0">
            v{entry.version}
          </span>

          {/* Summary */}
          <span className="text-[11px] font-mono text-text-dark truncate">{entry.summary}</span>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-4">
          {/* Date */}
          <span className="text-[10px] font-mono text-muted-dark tabular-nums hidden 480:block">{entry.date}</span>

          {/* Count pills */}
          <div className="hidden 760:flex items-center gap-1.5">
            {(Object.entries(counts) as [ChangeType, number][])
              .filter(([, count]) => count > 0)
              .map(([type, count]) => (
                <span
                  key={type}
                  className={`text-[7px] font-mono uppercase tracking-widest px-1.5 py-0.5 border ${TYPE_CONFIG[type].color}`}
                >
                  {count} {TYPE_CONFIG[type].label}
                </span>
              ))}
          </div>

          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-3.5 h-3.5 text-muted-dark group-hover:text-muted-dark transition-colors" />
          </motion.div>
        </div>
      </button>

      {/* Changes */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-border-dark divide-y divide-border-dark/40">
              {/* Date on mobile */}
              <div className="px-4 py-2 480:hidden">
                <span className="text-[10px] font-mono text-muted-dark">{entry.date}</span>
              </div>
              {entry.changes.map((change, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-2.5">
                  <span
                    className={`text-[7px] font-mono uppercase tracking-widest px-1.5 py-0.5 border shrink-0 mt-0.5 ${TYPE_CONFIG[change.type].color}`}
                  >
                    {TYPE_CONFIG[change.type].label}
                  </span>
                  <span className="text-[11px] font-mono text-muted-dark leading-relaxed">{change.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── ChangelogClient ──────────────────────────────────────────────────────────

export function ChangelogClient() {
  return (
    <div className="flex flex-col h-screen bg-bg-dark overflow-hidden">
      {/* Header */}
      <div className="bg-black shrink-0 border-b border-border-dark">
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-3">
            <Link
              href="/v2/dashboard"
              className="text-[10px] font-mono uppercase tracking-widest text-muted-dark hover:text-primary-dark transition-colors"
            >
              ← Dashboard
            </Link>
            <div className="w-px h-3 bg-border-dark" aria-hidden="true" />
            <span className="text-[10px] font-mono text-muted-dark uppercase tracking-widest">[ CHANGELOG ]</span>
            <div className="w-px h-3 bg-border-dark" aria-hidden="true" />
            <span className="text-[10px] font-mono text-muted-dark">{CHANGELOG.length} releases</span>
          </div>
        </div>

        {/* Marquee */}
        <div className="border-t border-border-dark/40 bg-white/2 overflow-hidden py-1">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="flex whitespace-nowrap"
          >
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <span key={i} className="text-[10px] font-mono text-muted-dark pr-12">
                <span className="text-primary-dark">▸</span> Latest version is always at the top
                <span className="text-muted-dark/30 mx-3">·</span>
                Click any release to expand the full list of changes
                <span className="text-muted-dark/30 mx-3">·</span>
                Contact Sqysh with any questions
                <span className="text-muted-dark/30 mx-3">·</span>
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Legend */}
      <div className="shrink-0 flex items-center gap-3 px-4 py-2 border-b border-border-dark bg-surface-dark">
        <span className="text-[7px] font-mono uppercase tracking-widest text-muted-dark shrink-0">Key</span>
        {(Object.entries(TYPE_CONFIG) as [ChangeType, (typeof TYPE_CONFIG)[ChangeType]][]).map(
          ([type, { label, color }]) => (
            <span key={type} className={`text-[7px] font-mono uppercase tracking-widest px-1.5 py-0.5 border ${color}`}>
              {label}
            </span>
          )
        )}
      </div>

      {/* Entries */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-3">
          {CHANGELOG.map((entry, i) => (
            <ChangelogEntryRow key={entry.version} entry={entry} index={i} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 flex items-center justify-between px-4 py-2 border-t border-border-dark bg-surface-dark">
        <Link
          href="/v2/dashboard"
          className="text-[10px] font-mono uppercase tracking-widest text-muted-dark hover:text-primary-dark transition-colors"
        >
          ← Dashboard
        </Link>
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-dark">
          Built by Sqysh · sqysh.io
        </span>
      </div>
    </div>
  )
}
