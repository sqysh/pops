'use client'

import { motion } from 'framer-motion'
import { ChevronRight, MapPin } from 'lucide-react'
import Picture from '@/components/common/Picture'
import { COL } from '@/app/lib/constants/venue.constants'
import { IVenue } from '@/app/types/entities/venue'
import { formatDate } from '@/app/lib/utils/date.utils'

const Empty = () => <span className="text-neutral-400">—</span>

export function VenueRow({ venue, index, onEdit }: { venue: IVenue; index: number; onEdit: (v: IVenue) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, delay: Math.min(index * 0.01, 0.15) }}
      role="button"
      tabIndex={0}
      onClick={() => onEdit(venue)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onEdit(venue)
        }
      }}
      aria-label={`Edit ${venue.name}`}
      className={`grid ${COL} items-center gap-3 px-4 py-3 border-b border-neutral-200 last:border-0 cursor-pointer transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-inset group`}
    >
      {/* Image */}
      <div className="w-10 h-10 shrink-0 overflow-hidden border border-neutral-200 bg-neutral-100 flex items-center justify-center">
        {venue.imageUrl ? (
          <Picture src={venue.imageUrl} alt="" width={40} height={40} className="object-cover w-full h-auto" />
        ) : (
          <MapPin className="w-4 h-4 text-neutral-400" aria-label="No image" />
        )}
      </div>

      {/* Name */}
      <div className="min-w-0">
        <span className="block truncate text-neutral-900">{venue.name}</span>
        <span className="block truncate text-neutral-500 tabular-nums">{formatDate(venue.createdAt)}</span>
      </div>

      {/* City */}
      <span className="truncate text-neutral-900">{venue.city || <Empty />}</span>

      {/* Address */}
      <span className="truncate text-neutral-600">{venue.address || <Empty />}</span>

      {/* Capacity */}
      <span className="truncate text-neutral-900 tabular-nums">
        {venue.capacity ? venue.capacity.toLocaleString() : <Empty />}
      </span>

      <div className="flex justify-end">
        <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-600 transition-colors" aria-hidden="true" />
      </div>
    </motion.div>
  )
}
