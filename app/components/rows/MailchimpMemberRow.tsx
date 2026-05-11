import { COL, INTEREST_LABELS, STATUS_COLORS } from '@/app/lib/constants/mailchimp.constants'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

export function MailchimpMemberRow({ member, index }: { member: any; index: number }) {
  const activeInterests = INTEREST_LABELS.filter(({ key }) => member.interests?.[key])

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.01, duration: 0.2 }}
      className={`grid ${COL} items-center gap-3 px-3 py-2.5 border-b border-border-dark/40 last:border-0 hover:bg-surface-dark transition-colors group`}
    >
      {/* Name + email */}
      <div className="min-w-0">
        <span className="text-[12px] font-mono text-text-dark truncate block">{member.name || '—'}</span>
        <div className="flex items-center gap-3 mt-0.5">
          {member.stats?.avgOpenRate > 0 && (
            <span className="text-[8px] font-mono text-muted-dark/60">
              {Math.round(member.stats.avgOpenRate * 100)}% open rate
            </span>
          )}
          {activeInterests.length > 0 &&
            activeInterests.map(({ key, label }) => (
              <span
                key={key}
                className="text-[8px] font-mono uppercase tracking-widest px-1 py-0.5 border border-primary-dark/20 bg-primary-dark/5 text-primary-dark"
              >
                {label}
              </span>
            ))}
        </div>
      </div>

      {/* Phone + address */}
      <div className="min-w-0">
        <span className="text-[12px] font-mono text-text-dark truncate block">{member.email || '—'}</span>
        {member.address && typeof member.address === 'string' && member.address.trim() && (
          <span className="text-[9px] font-mono text-muted-dark/70 truncate block">{member.address}</span>
        )}
      </div>

      {/* Joined */}
      <span className="text-[10px] font-mono text-muted-dark/80 tabular-nums">
        {member.createdAt
          ? new Date(member.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })
          : '—'}
      </span>

      {/* Status */}
      <div className="flex justify-end">
        <span
          className={`text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.5 border ${STATUS_COLORS[member.status] ?? 'text-muted-dark border-border-dark'}`}
        >
          {member.status}
        </span>
      </div>

      {/* Mailchimp link */}
      <div className="flex justify-end">
        <a
          href={`https://us2.admin.mailchimp.com/audience/contact-profile?contact_id=${member.contactId}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          aria-label={`View ${member.name || member.email} in Mailchimp`}
          className="text-muted-dark/85 hover:text-primary-dark transition-colors focus-visible:outline-none"
        >
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </motion.div>
  )
}
