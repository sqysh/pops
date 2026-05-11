'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GripVertical, Loader2, Pencil, Plus, Search, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import type { TeamMember } from '@prisma/client'
import { updateTeamMembersOrder } from '@/app/lib/actions/team/updateTeamMemberOrder'
import { Role, ROLE_LABELS, ROLES, TeamClientProps } from '@/app/types/entities/team-member'
import { TeamMemberDrawer } from '@/app/components/drawers/TeamMemberDrawer'
import { COL } from '@/app/lib/constants/team-member.constants'
import { useSession } from 'next-auth/react'

export default function TeamClient({ teamMembers }: TeamClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const session = useSession()

  const [lists, setLists] = useState<Record<Role, TeamMember[]>>({
    BOARD_MEMBER: teamMembers.filter((m) => m.role === 'BOARD_MEMBER').sort((a, b) => a.displayOrder - b.displayOrder),
    STAFF: teamMembers.filter((m) => m.role === 'STAFF').sort((a, b) => a.displayOrder - b.displayOrder),
    MUSICIAN: teamMembers.filter((m) => m.role === 'MUSICIAN').sort((a, b) => a.displayOrder - b.displayOrder)
  })
  const [isLoading, setIsLoading] = useState(false)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [draggedRole, setDraggedRole] = useState<Role | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  const [dragPosition, setDragPosition] = useState<'top' | 'bottom' | null>(null)
  const [dragStartIndex, setDragStartIndex] = useState<number | null>(null)
  const [editingMember, setEditingMember] = useState<TeamMember | null | 'new'>(() => {
    const id = searchParams.get('id')
    if (!id) return null
    return (teamMembers.find((m) => m.id === id) as TeamMember) ?? null
  })
  const [searches, setSearches] = useState<Record<Role, string>>({ BOARD_MEMBER: '', STAFF: '', MUSICIAN: '' })

  function setSearch(role: Role, value: string) {
    setSearches((prev) => ({ ...prev, [role]: value }))
  }

  function getFiltered(role: Role) {
    const q = searches[role].toLowerCase().trim()
    if (!q) return lists[role]
    return lists[role].filter(
      (m) => `${m.firstName} ${m.lastName}`.toLowerCase().includes(q) || m.position.toLowerCase().includes(q)
    )
  }

  function handleDragStart(e: React.DragEvent, id: string, role: Role, index: number) {
    setDraggedId(id)
    setDraggedRole(role)
    setDragStartIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleDragOver(e: React.DragEvent, id: string, index: number) {
    e.preventDefault()
    if (id === draggedId) return
    setDragPosition(dragStartIndex !== null && index > dragStartIndex ? 'bottom' : 'top')
    setDragOverId(id)
  }

  function handleDrop(e: React.DragEvent, targetId: string, targetRole: Role) {
    e.preventDefault()
    if (!draggedId || draggedId === targetId || draggedRole !== targetRole) {
      resetDrag()
      return
    }
    const list = [...lists[targetRole]]
    const fromIdx = list.findIndex((m) => m.id === draggedId)
    const toIdx = list.findIndex((m) => m.id === targetId)
    if (fromIdx === -1 || toIdx === -1) return
    const [moved] = list.splice(fromIdx, 1)
    list.splice(toIdx, 0, moved)
    setLists((prev) => ({ ...prev, [targetRole]: list.map((m, i) => ({ ...m, displayOrder: i + 1 })) }))
    resetDrag()
  }

  function resetDrag() {
    setDraggedId(null)
    setDraggedRole(null)
    setDragOverId(null)
    setDragPosition(null)
    setDragStartIndex(null)
  }

  function handleDragLeave(e: React.DragEvent) {
    if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) {
      setDragOverId(null)
      setDragPosition(null)
    }
  }

  async function handleSave() {
    setIsLoading(true)
    const res = await updateTeamMembersOrder([...lists.BOARD_MEMBER, ...lists.STAFF, ...lists.MUSICIAN])
    if (res.success) {
      router.refresh()
    }
    setIsLoading(false)
  }

  const totalCount = Object.values(lists).flat().length

  return (
    <>
      <AnimatePresence>
        {editingMember !== null && (
          <TeamMemberDrawer
            key={editingMember === 'new' ? 'new' : (editingMember as TeamMember).id}
            open={true}
            onClose={() => setEditingMember(null)}
            member={editingMember === 'new' ? null : (editingMember as TeamMember)}
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col h-screen bg-bg-dark overflow-hidden">
        {/* Header */}
        <div className="bg-black shrink-0 border-b border-border-dark">
          <div className="flex items-center justify-between px-3 760:px-4 py-2 760:py-2.5 gap-2">
            {/* Left */}
            <div className="flex items-center gap-2 760:gap-3 min-w-0 flex-1 overflow-hidden">
              <Link
                href="/v2/dashboard"
                className="text-[9px] font-mono uppercase tracking-widest text-muted-dark hover:text-primary-dark transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark shrink-0"
              >
                ←<span className="hidden 480:inline"> Dashboard</span>
              </Link>
              <div className="w-px h-3 bg-border-dark shrink-0" aria-hidden="true" />
              <span className="text-[9px] 760:text-[10px] font-mono text-muted-dark uppercase tracking-widest shrink-0">
                [ TEAM ]
              </span>
              <div className="w-px h-3 bg-border-dark shrink-0 hidden 480:block" aria-hidden="true" />
              <span className="text-[10px] font-mono text-muted-dark hidden 480:block shrink-0">
                {totalCount} members
              </span>

              {/* Pills — hidden on mobile, shown inline on 760+ */}
              <div className="w-px h-3 bg-border-dark shrink-0 hidden 760:block" aria-hidden="true" />
              <div className="hidden 760:flex items-center divide-x divide-border-dark border-x border-border-dark">
                {ROLES.map((role) => (
                  <div key={role} className="flex flex-col items-center justify-center px-3 py-1.5 shrink-0 gap-0.5">
                    <span className="font-mono text-xs font-bold tabular-nums text-text-dark">
                      {lists[role].length}
                    </span>
                    <span className="text-[8px] font-mono tracking-[0.12em] uppercase text-muted-dark/80 whitespace-nowrap">
                      {ROLE_LABELS[role]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — actions */}
            <div className="flex items-center gap-1.5 760:gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setEditingMember('new')}
                className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest px-2 760:px-3 py-1.5 border border-border-dark text-muted-dark hover:text-text-dark hover:border-muted-dark/30 transition-colors focus-visible:outline-none"
              >
                <Plus className="w-2.5 h-2.5" />
                <span className="hidden 480:inline">New Member</span>
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center gap-1.5 760:gap-2 text-[9px] font-mono uppercase tracking-widest px-2 760:px-3 py-1.5 border border-primary-dark/40 text-primary-dark bg-primary-dark/5 hover:bg-primary-dark/10 transition-colors disabled:opacity-50 focus-visible:outline-none"
              >
                {isLoading && <Loader2 className="w-2.5 h-2.5 animate-spin" />}
                <span className="hidden 480:inline">{isLoading ? 'Saving...' : 'Save Order'}</span>
                {!isLoading && <span className="480:hidden">Save</span>}
              </button>
            </div>
          </div>

          {/* Pills on mobile — scrollable strip */}
          <div className="760:hidden flex items-center divide-x divide-border-dark border-t border-border-dark overflow-x-auto">
            {ROLES.map((role) => (
              <div key={role} className="flex flex-col items-center justify-center px-4 py-1.5 shrink-0 gap-0.5">
                <span className="font-mono text-xs font-bold tabular-nums text-text-dark">{lists[role].length}</span>
                <span className="text-[8px] font-mono tracking-[0.12em] uppercase text-muted-dark/80 whitespace-nowrap">
                  {ROLE_LABELS[role]}
                </span>
              </div>
            ))}
          </div>

          {/* Warning marquee */}
          <div className="border-t border-border-dark/40 bg-white/2 overflow-hidden py-1">
            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="flex whitespace-nowrap"
            >
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <span key={i} className="text-[8px] font-mono text-muted-dark/90 pr-12">
                  <span className="text-muted-dark/70">●</span> Drag to reorder within each group
                  <span className="text-muted-dark/20 mx-3">·</span>
                  Click <span className="text-muted-dark/70">Save Order</span> when done or changes will not be saved
                  <span className="text-muted-dark/20 mx-3">·</span>
                  Click the <span className="text-muted-dark/70">pencil icon</span> to edit a member&apos;s details
                  <span className="text-muted-dark/20 mx-3">·</span>
                </span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Three columns */}
        <div className="flex-1 flex-col lg:flex-row min-h-0 flex overflow-hidden bg-surface-dark mx-2 my-2">
          {ROLES.map((role) => (
            <div
              key={role}
              className="flex-1 border-r border-border-dark last:border-0 flex flex-col overflow-hidden min-w-0"
            >
              {/* Column header */}
              <div className="shrink-0 flex items-center justify-between px-3 py-2 border-b border-border-dark bg-surface-dark">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-px bg-primary-dark shrink-0" aria-hidden="true" />
                  <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-primary-dark">
                    {ROLE_LABELS[role]}
                  </span>
                </div>
                <span className="text-[8px] font-mono text-muted-dark/70 tabular-nums">{lists[role].length}</span>
              </div>

              {/* Search */}
              <div className="shrink-0 flex items-center gap-2 border-b border-border-dark/40 px-3 py-1.5 bg-surface-dark">
                <Search className="w-2.5 h-2.5 text-muted-dark/60 shrink-0" aria-hidden="true" />
                <input
                  type="text"
                  value={searches[role]}
                  onChange={(e) => setSearch(role, e.target.value)}
                  placeholder={`Search ${ROLE_LABELS[role].toLowerCase()}...`}
                  className="flex-1 bg-transparent text-[10px] font-mono text-text-dark placeholder:text-muted-dark/85 outline-none"
                  aria-label={`Search ${ROLE_LABELS[role]}`}
                />
                {searches[role] && (
                  <button
                    type="button"
                    onClick={() => setSearch(role, '')}
                    className="text-muted-dark/60 hover:text-text-dark transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>

              {/* Sub-column headers */}
              <div
                className={`shrink-0 grid ${COL} items-center gap-2 px-3 py-1.5 border-b border-border-dark/40 bg-surface-dark`}
              >
                <span className="text-[8px] font-mono uppercase tracking-widest text-muted-dark/60">#</span>
                <span className="text-[8px] font-mono uppercase tracking-widest text-muted-dark/60">Name</span>
                <span className="text-[8px] font-mono uppercase tracking-widest text-muted-dark/60">Position</span>
                <span className="text-[8px] font-mono uppercase tracking-widest text-muted-dark/60 text-right">
                  Status
                </span>
                <span />
              </div>

              {/* Rows */}
              <div className="flex-1 min-h-0 overflow-y-auto">
                {getFiltered(role).length === 0 ? (
                  <div className="flex items-center justify-center h-32">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-muted-dark/60">
                      No members
                    </span>
                  </div>
                ) : (
                  getFiltered(role).map((member, i) => (
                    <div
                      key={member.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, member.id, role, i)}
                      onDragOver={(e) => handleDragOver(e, member.id, i)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, member.id, role)}
                      onDragEnd={resetDrag}
                      className={`relative grid ${COL} items-center gap-2 px-3 py-2 border-b border-border-dark/40 last:border-0 transition-colors group ${
                        draggedId === member.id ? 'opacity-30' : 'hover:bg-black cursor-grab active:cursor-grabbing'
                      }`}
                    >
                      {/* Drop indicators */}
                      {dragOverId === member.id && draggedRole === role && dragPosition === 'top' && (
                        <div className="absolute top-0 inset-x-0 flex items-center pointer-events-none z-10">
                          <div className="w-1.5 h-1.5 bg-primary-dark shrink-0" />
                          <div className="flex-1 h-px bg-primary-dark" />
                        </div>
                      )}
                      {dragOverId === member.id && draggedRole === role && dragPosition === 'bottom' && (
                        <div className="absolute bottom-0 inset-x-0 flex items-center pointer-events-none z-10">
                          <div className="w-1.5 h-1.5 bg-primary-dark shrink-0" />
                          <div className="flex-1 h-px bg-primary-dark" />
                        </div>
                      )}

                      {/* Order # + grip */}
                      <div className="flex items-center gap-1">
                        <GripVertical
                          className="w-2.5 h-2.5 text-muted-dark/20 group-hover:text-muted-dark/80 transition-colors shrink-0"
                          aria-hidden="true"
                        />
                      </div>

                      {/* Name */}
                      <div className="min-w-0">
                        <span className="text-[11px] font-mono text-text-dark truncate block">
                          {member.firstName} {member.lastName}
                        </span>
                        <span className="text-[8px] font-mono text-muted-dark/60 tabular-nums">#{i + 1}</span>
                      </div>

                      {/* Position */}
                      <span className="text-[10px] font-mono text-muted-dark/80 truncate">{member.position}</span>

                      {/* Published */}
                      <div className="flex justify-end">
                        <span
                          className={`text-[8px] font-mono uppercase tracking-widest px-1 py-0.5 border ${
                            member.isPublished
                              ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5'
                              : 'text-muted-dark/60 border-border-dark'
                          }`}
                        >
                          {member.isPublished ? 'Live' : 'Hidden'}
                        </span>
                      </div>

                      {/* Actions */}
                      {(member.id !== 'cm9kbaggn000dpe0q4oitqt2s' || session.data.user.role === 'SUPER_USER') && (
                        <div className="relative flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingMember(member as unknown as TeamMember)
                            }}
                            className="text-muted-dark/70 hover:text-text-dark transition-all focus-visible:opacity-100 focus-visible:outline-none"
                            aria-label={`Edit ${member.firstName}`}
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="shrink-0 flex items-center justify-between px-4 py-2 border-t border-border-dark bg-surface-dark">
          <Link
            href="/v2/dashboard"
            className="text-[9px] font-mono uppercase tracking-widest text-muted-dark hover:text-primary-dark transition-colors focus-visible:outline-none"
          >
            &larr; Dashboard
          </Link>
          <span className="text-[9px] font-mono uppercase tracking-widest text-muted-dark tabular-nums">
            {totalCount} members across {ROLES.length} groups
          </span>
        </div>
      </div>
    </>
  )
}
