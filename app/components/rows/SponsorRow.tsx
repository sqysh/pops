import Picture from '@/app/components/common/Picture'
import { COL } from '@/app/lib/constants/sponsor.constants'
import { formatLevel, levelColor } from '@/app/lib/utils/sponsor.utils'
import { ISponsor } from '@/app/types/entities/sponsor'
import { formatAmount } from '@/app/utils/currency.utils'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

export function SponsorRow({
  sponsor,
  index,
  setEditingSponsor
}: {
  sponsor: ISponsor
  index: number
  setEditingSponsor: any
}) {
  return (
    <motion.div
      onClick={() => setEditingSponsor(sponsor)}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, duration: 0.2 }}
      className={`grid ${COL} items-center gap-3 px-3 py-2 border-b border-border-dark/40 last:border-0 group hover:bg-black transition-colors cursor-pointer`}
    >
      <span className="text-[9px] font-mono text-muted-dark/70 tabular-nums">{String(index + 1).padStart(2, '0')}</span>

      <div className="w-8 h-8 border border-border-dark flex items-center justify-center bg-white/5 shrink-0 overflow-hidden">
        {sponsor.filePath ? (
          <Picture
            src={sponsor.filePath}
            alt={sponsor.name}
            width={32}
            height={32}
            className="object-contain w-full h-full p-0.5"
            priority
          />
        ) : (
          <span className="text-[9px] font-mono text-muted-dark/80 uppercase tracking-widest leading-none text-center px-0.5">
            {sponsor.name.slice(0, 2)}
          </span>
        )}
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-mono text-text-dark truncate">{sponsor.name}</span>
          {sponsor.externalLink && (
            <a
              href={sponsor.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-dark/70 hover:text-primary-dark transition-colors shrink-0"
              aria-label={`Visit ${sponsor.name}`}
            >
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>
        <span className="text-[9px] font-mono text-muted-dark/70 truncate block">
          {new Date(sponsor.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </span>
      </div>

      <div>
        <span
          className={`text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 border ${levelColor(sponsor.level)}`}
        >
          {formatLevel(sponsor.level)}
        </span>
      </div>

      <span className="text-[11px] font-mono tabular-nums text-text-dark/70 text-left">
        {formatAmount(sponsor.amount)}
      </span>

      <div className="flex items-center gap-1.5">
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${sponsor.isActive ? 'bg-emerald-400' : 'bg-border-dark'}`}
          aria-hidden="true"
        />
        <span
          className={`text-[9px] font-mono uppercase tracking-widest ${sponsor.isActive ? 'text-emerald-400' : 'text-muted-dark/70'}`}
        >
          {sponsor.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
    </motion.div>
  )
}
