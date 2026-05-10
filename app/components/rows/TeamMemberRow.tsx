import { deleteTeamMember } from '@/app/lib/actions/super/deleteTeamMember'
import { TeamMember } from '@prisma/client'
import { AnimatePresence, motion } from 'framer-motion'
import { Eye, EyeOff, Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { DeleteConfirm } from '../elements/DeleteConfirmt'
import { COL } from '@/app/lib/constants/team-member.constants'
import Picture from '../common/Picture'

export function TeamMemberRow({
  member,
  index,
  onEdit
}: {
  member: TeamMember
  index: number
  onEdit: (m: TeamMember) => void
}) {
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setDeleting(true)
    const result = await deleteTeamMember(member.id)
    if (result.success) {
      router.refresh()
    } else {
      setDeleting(false)
      setConfirming(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: deleting ? 0 : 1, x: 0 }}
      transition={{ delay: index * 0.02, duration: 0.2 }}
      className={`grid ${COL} items-center gap-3 px-3 py-2 border-b border-border-dark/40 last:border-0 group hover:bg-surface-dark transition-colors ${deleting ? 'pointer-events-none' : ''}`}
    >
      {/* Avatar */}
      <div className="w-8 h-8 border border-border-dark overflow-hidden shrink-0 bg-white/5 flex items-center justify-center">
        {member.imageUrl ? (
          <Picture
            src={member.imageUrl}
            alt={`${member.firstName} ${member.lastName}`}
            width={32}
            height={32}
            className="object-cover w-full h-full"
            priority
          />
        ) : (
          <span className="text-[8px] font-mono text-muted-dark/40 uppercase">
            {member.firstName[0]}
            {member.lastName[0]}
          </span>
        )}
      </div>

      {/* Name */}
      <div className="min-w-0">
        <span className="text-[11px] font-mono text-text-dark truncate block">
          {member.firstName} {member.lastName}
        </span>
        <span className="text-[8px] font-mono text-muted-dark/40 tabular-nums truncate block">
          #{member.displayOrder}
        </span>
      </div>

      {/* Position */}
      <span className="text-[10px] font-mono text-text-dark/80 truncate">{member.position}</span>

      {/* Role */}
      <span className="text-[9px] font-mono text-muted-dark/60 truncate">{member.role || '—'}</span>

      {/* Published */}
      <div className="flex justify-end">
        {member.isPublished ? (
          <span className="text-[7px] font-mono uppercase tracking-widest px-1.5 py-0.5 border text-emerald-400 border-emerald-400/30 bg-emerald-400/5 flex items-center gap-1">
            <Eye className="w-2.5 h-2.5" />
            Live
          </span>
        ) : (
          <span className="text-[7px] font-mono uppercase tracking-widest px-1.5 py-0.5 border text-muted-dark/40 border-border-dark flex items-center gap-1">
            <EyeOff className="w-2.5 h-2.5" />
            Hidden
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="relative flex items-center justify-end gap-2">
        <button
          onClick={() => onEdit(member)}
          className="text-muted-dark/40 hover:text-text-dark transition-all focus-visible:opacity-100 focus-visible:outline-none"
          aria-label={`Edit ${member.firstName}`}
        >
          <Pencil className="w-3 h-3" />
        </button>
        <button
          onClick={() => setConfirming(true)}
          className="text-muted-dark/40 hover:text-red-400 transition-all focus-visible:opacity-100 focus-visible:outline-none"
          aria-label={`Delete ${member.firstName}`}
        >
          <Trash2 className="w-3 h-3" />
        </button>
        <AnimatePresence>
          {confirming && (
            <DeleteConfirm
              name={`${member.firstName} ${member.lastName}`}
              onConfirm={handleDelete}
              onCancel={() => setConfirming(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
