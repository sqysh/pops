import { IVenue } from '@/app/types/entities/venue'
import { motion } from 'framer-motion'
import { COL } from '@/app/lib/constants/venue.constants'
import Picture from '@/app/components/common/Picture'
import { MapPin } from 'lucide-react'

export function VenueRow({ venue, index, onEdit }: { venue: IVenue; index: number; onEdit: (v: IVenue) => void }) {
  return (
    <motion.div
      onClick={() => onEdit(venue)}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, duration: 0.2 }}
      className={`grid ${COL} items-center gap-3 px-3 py-2 border-b border-border-dark/40 last:border-0 group hover:bg-black transition-colors cursor-pointer`}
    >
      {/* Image */}
      <div className="w-10 h-10 border border-border-dark bg-white/5 shrink-0 overflow-hidden flex items-center justify-center">
        {venue.imageUrl ? (
          <Picture
            src={venue.imageUrl}
            alt={venue.name}
            width={40}
            height={40}
            className="object-cover w-full h-full"
            priority
          />
        ) : (
          <MapPin className="w-3.5 h-3.5 text-muted-dark/60" />
        )}
      </div>

      {/* Name */}
      <div className="min-w-0">
        <span className="text-[12px] font-mono text-text-dark truncate block">{venue.name}</span>
        <span className="text-[9px] font-mono text-muted-dark/70 truncate block">
          {new Date(venue.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>

      {/* City */}
      <span className="text-[11px] font-mono text-text-dark/70 truncate">
        {venue.city || <span className="text-muted-dark/60">—</span>}
      </span>

      {/* Address */}
      <span className="text-[11px] font-mono text-muted-dark/80 truncate">
        {venue.address || <span className="text-muted-dark/60">—</span>}
      </span>

      {/* Capacity */}
      <span className="text-[11px] font-mono tabular-nums text-text-dark/70">
        {venue.capacity || <span className="text-muted-dark/60">—</span>}
      </span>

      {/* Arrow */}
      <div className="flex justify-end">
        <span className="text-[9px] font-mono text-muted-dark/20 group-hover:text-muted-dark/80 transition-colors">
          →
        </span>
      </div>
    </motion.div>
  )
}
