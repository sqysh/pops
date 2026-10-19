'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AlertCircle, GripVertical, Info, Loader2, Pencil, Plus, Search, X } from 'lucide-react'
import { useSession } from 'next-auth/react'
import type { TeamMember } from '@prisma/client'
import { updateTeamMembersOrder } from '@/app/lib/actions/team/updateTeamMemberOrder'
import { Role, ROLE_LABELS, ROLES, TeamClientProps } from '@/app/types/entities/team-member'
import { TeamMemberDrawer } from '@/app/(authenticated)/v2/team/_components/TeamMemberDrawer'
import { COL } from '@/app/lib/constants/team-member.constants'

/** Robyn's record. Only a super user can open it. */
const PROTECTED_MEMBER_ID = 'cm9kbaggn000dpe0q4oitqt2s'

const byOrder = (a: TeamMember, b: TeamMember) => a.displayOrder - b.displayOrder

export default function TeamClient({ teamMembers }: TeamClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const session = useSession()

  const [lists, setLists] = useState<Record<Role, TeamMember[]>>({
    BOARD_MEMBER: teamMembers.filter((m) => m.role === 'BOARD_MEMBER').sort(byOrder),
    STAFF: teamMembers.filter((m) => m.role === 'STAFF').sort(byOrder),
    MUSICIAN: teamMembers.filter((m) => m.role === 'MUSICIAN').sort(byOrder)
  })

  const [isLoading, setIsLoading] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [draggedRole, setDraggedRole] = useState<Role | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  const [dragPosition, setDragPosition] = useState<'top' | 'bottom' | null>(null)
  const [dragStartIndex, setDragStartIndex] = useState<number | null>(null)

  const [editingMember, setEditingMember] = useState<TeamMember | null | 'new'>(() => {
    const id = searchParams.get('id')
    if (!id) return null
    return teamMembers.find((m) => m.id === id) ?? null
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

    if (fromIdx === -1 || toIdx === -1) {
      resetDrag()
      return
    }

    const [moved] = list.splice(fromIdx, 1)
    list.splice(toIdx, 0, moved)

    setLists((prev) => ({ ...prev, [targetRole]: list.map((m, i) => ({ ...m, displayOrder: i + 1 })) }))
    setDirty(true)
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
    setError(null)
    setIsLoading(true)

    const res = await updateTeamMembersOrder([...lists.BOARD_MEMBER, ...lists.STAFF, ...lists.MUSICIAN])

    setIsLoading(false)

    if (!res.success) {
      setError(res.error ?? 'The new order could not be saved. Please try again.')
      return
    }

    setDirty(false)
    router.refresh()
  }

  const totalCount = Object.values(lists).flat().length

  return (
    <>
      {editingMember !== null && (
        <TeamMemberDrawer
          key={editingMember === 'new' ? 'new' : editingMember.id}
          open
          onClose={() => setEditingMember(null)}
          member={editingMember === 'new' ? null : editingMember}
        />
      )}

      <div className="flex flex-col h-full min-h-125 bg-neutral-200 text-sm">
        <div className="shrink-0 bg-white border-b border-neutral-300">
          <div className="flex items-center justify-between gap-4 px-6 py-4 flex-wrap">
            <div>
              <h1 className="text-lg font-semibold text-neutral-900">Team</h1>
              <p className="text-neutral-600 mt-0.5">
                {totalCount} total · {ROLES.map((role) => `${lists[role].length} ${ROLE_LABELS[role].toLowerCase()}`).join(' · ')}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditingMember('new')}
                className="inline-flex items-center gap-2 h-9 px-4 border border-neutral-300 bg-white font-medium text-neutral-800 hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
              >
                <Plus className="w-4 h-4 shrink-0" aria-hidden="true" />
                New member
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isLoading || !dirty}
                className="inline-flex items-center gap-2 h-9 px-4 bg-blaze hover:bg-blazehover text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
              >
                {isLoading && <Loader2 className="w-4 h-4 shrink-0 animate-spin" aria-hidden="true" />}
                {isLoading ? 'Saving...' : 'Save order'}
              </button>
            </div>
          </div>

          {dirty ? (
            <p
              role="status"
              className="flex items-start gap-2 px-6 py-2.5 border-t border-amber-200 bg-amber-50 text-amber-900 leading-relaxed"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
              <span>You have moved people around. Choose Save order, or the new order will be lost.</span>
            </p>
          ) : (
            <p className="flex items-start gap-2 px-6 py-2.5 border-t border-neutral-200 bg-neutral-50 text-neutral-600 leading-relaxed">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-neutral-400" aria-hidden="true" />
              <span>
                Drag people to reorder them within a group, then choose Save order. The pencil opens someone&apos;s details.
                Reordering is turned off while a search box has something in it.
              </span>
            </p>
          )}

          {error && (
            <p
              role="alert"
              className="flex items-start gap-2 px-6 py-2.5 border-t border-red-200 bg-red-50 text-red-800 leading-relaxed"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" aria-hidden="true" />
              <span>{error}</span>
            </p>
          )}
        </div>

        <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden gap-px bg-neutral-300 border-y border-neutral-300">
          {ROLES.map((role) => {
            const filtered = getFiltered(role)
            const searching = searches[role].trim().length > 0

            return (
              <div key={role} className="flex-1 min-w-0 flex flex-col overflow-hidden bg-white">
                <div className="shrink-0 flex items-center justify-between gap-3 px-4 py-3 border-b border-neutral-200">
                  <h2 className="font-semibold text-neutral-900">{ROLE_LABELS[role]}</h2>
                  <span className="text-neutral-500 tabular-nums">{lists[role].length}</span>
                </div>

                <div className="shrink-0 flex items-center gap-2 px-4 py-2 border-b border-neutral-200">
                  <Search className="w-4 h-4 shrink-0 text-neutral-400" aria-hidden="true" />
                  <input
                    type="text"
                    value={searches[role]}
                    onChange={(e) => setSearch(role, e.target.value)}
                    placeholder={`Search ${ROLE_LABELS[role].toLowerCase()}`}
                    aria-label={`Search ${ROLE_LABELS[role]}`}
                    className="flex-1 min-w-0 bg-transparent text-neutral-900 placeholder:text-neutral-400 outline-none"
                  />
                  {searching && (
                    <button
                      type="button"
                      onClick={() => setSearch(role, '')}
                      aria-label={`Clear ${ROLE_LABELS[role]} search`}
                      className="shrink-0 text-neutral-400 hover:text-neutral-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
                    >
                      <X className="w-4 h-4" aria-hidden="true" />
                    </button>
                  )}
                </div>

                <div className={`shrink-0 grid ${COL} items-center gap-2 px-4 py-2 border-b border-neutral-200 bg-neutral-50`}>
                  <span aria-hidden="true" />
                  <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">Name</span>
                  <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">Position</span>
                  <span className="text-xs font-medium uppercase tracking-wide text-neutral-500 text-right">Status</span>
                  <span />
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto">
                  {filtered.length === 0 ? (
                    <p className="flex items-center justify-center h-32 px-4 text-center text-neutral-500">
                      {searching ? 'Nobody matches that search.' : 'No one in this group yet.'}
                    </p>
                  ) : (
                    filtered.map((member, i) => {
                      const canEdit = member.id !== PROTECTED_MEMBER_ID || session.data?.user?.role === 'SUPER_USER'

                      return (
                        <div
                          key={member.id}
                          draggable={!searching}
                          onDragStart={(e) => handleDragStart(e, member.id, role, i)}
                          onDragOver={(e) => handleDragOver(e, member.id, i)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, member.id, role)}
                          onDragEnd={resetDrag}
                          className={`relative grid ${COL} items-center gap-2 px-4 py-3 border-b border-neutral-200 last:border-0 transition-colors group ${
                            draggedId === member.id
                              ? 'opacity-40'
                              : searching
                                ? 'hover:bg-neutral-50'
                                : 'hover:bg-neutral-50 cursor-grab active:cursor-grabbing'
                          }`}
                        >
                          {dragOverId === member.id && draggedRole === role && dragPosition === 'top' && (
                            <div className="absolute top-0 inset-x-0 flex items-center pointer-events-none z-10">
                              <div className="w-1.5 h-1.5 bg-blaze shrink-0" />
                              <div className="flex-1 h-0.5 bg-blaze" />
                            </div>
                          )}
                          {dragOverId === member.id && draggedRole === role && dragPosition === 'bottom' && (
                            <div className="absolute bottom-0 inset-x-0 flex items-center pointer-events-none z-10">
                              <div className="w-1.5 h-1.5 bg-blaze shrink-0" />
                              <div className="flex-1 h-0.5 bg-blaze" />
                            </div>
                          )}

                          <GripVertical
                            className={`w-4 h-4 shrink-0 transition-colors ${
                              searching ? 'text-neutral-200' : 'text-neutral-300 group-hover:text-neutral-600'
                            }`}
                            aria-hidden="true"
                          />

                          <div className="min-w-0">
                            <span className="block truncate text-neutral-900">
                              {member.firstName} {member.lastName}
                            </span>
                            <span className="block text-neutral-500 tabular-nums">#{i + 1}</span>
                          </div>

                          <span className="truncate text-neutral-600">{member.position}</span>

                          <div className="flex justify-end">
                            <span
                              className={`inline-flex items-center gap-1.5 text-xs font-medium rounded-full ring-1 px-2 py-0.5 ${
                                member.isPublished
                                  ? 'text-emerald-700 ring-emerald-200 bg-emerald-50'
                                  : 'text-neutral-600 ring-neutral-200 bg-neutral-50'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                  member.isPublished ? 'bg-emerald-600' : 'bg-neutral-400'
                                }`}
                                aria-hidden="true"
                              />
                              {member.isPublished ? 'Live' : 'Hidden'}
                            </span>
                          </div>

                          <div className="flex items-center justify-end">
                            {canEdit && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setEditingMember(member)
                                }}
                                aria-label={`Edit ${member.firstName} ${member.lastName}`}
                                className="flex items-center justify-center w-9 h-9 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
                              >
                                <Pencil className="w-4 h-4" aria-hidden="true" />
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
