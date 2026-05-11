import { motion } from 'framer-motion'
import { ColSection } from './ColSection'
import { Edit, Expand, MapPin, Search, Users, Wrench, X } from 'lucide-react'
import { Empty } from './Empty'
import { Row } from './Row'
import { useState } from 'react'

export function LeftColumn({
  teamMembers,
  pageContentCount,
  pages,
  venues,
  customRequests,
  setCustomRequestModalOpen,
  setSelectedRequest
}) {
  const [teamSearch, setTeamSearch] = useState('')
  const filteredTeamMembers = teamMembers.filter((m) =>
    `${m.firstName} ${m.lastName}`.toLowerCase().includes(teamSearch.toLowerCase())
  )
  return (
    <motion.aside
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-52 xl:w-60 shrink-0 border-r border-border-dark overflow-y-auto hidden md:block"
    >
      <ColSection
        label="Team"
        icon={<Users className="w-3 h-3" />}
        count={teamMembers.length}
        href="/v2/team/new"
        actionLabel="New"
        secondaryHref="/v2/team/reorder"
        secondaryLabel="Reorder"
        minHeight="min-h-48"
        maxHeight="max-h-72"
      >
        {/* Search */}
        <div className="px-3 py-2 border-b border-border-dark/50 sticky top-0 bg-bg-dark z-10">
          <div className="relative">
            <Search
              className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-dark/70 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              value={teamSearch}
              onChange={(e) => setTeamSearch(e.target.value)}
              placeholder="Search team..."
              className="w-full pl-7 pr-3 py-1.5 bg-surface-dark border border-border-dark text-text-dark text-[12px] placeholder:text-muted-dark/60 focus:outline-none focus:border-primary-dark transition-colors"
            />
            {teamSearch && (
              <button
                type="button"
                onClick={() => setTeamSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-dark/70 hover:text-text-dark transition-colors"
                aria-label="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
        {filteredTeamMembers.length === 0 ? (
          <Empty label="team members" />
        ) : (
          filteredTeamMembers.map((m) => (
            <Row key={m.id} href={`/v2/team/${m.id}/edit`}>
              <p className="text-text-dark text-[12px] font-medium truncate">
                {m.firstName} {m.lastName}
              </p>
              <span className="text-muted-dark text-[10px] shrink-0 truncate max-w-14">{m.position}</span>
            </Row>
          ))
        )}
      </ColSection>

      <ColSection
        label="Page Content"
        icon={<Edit className="w-3 h-3" />}
        count={pageContentCount}
        href="/v2/page-content-editor"
        actionLabel="Edit"
        minHeight="min-h-48"
        maxHeight="max-h-72"
      >
        {pageContentCount === 0 ? (
          <Empty label="page content edit" />
        ) : (
          pages.map((p) => (
            <Row key={p.id} href={`/v2/page-content-editor?slug=${p.slug}`}>
              <p className="text-text-dark text-[12px] font-medium truncate capitalize">{p.slug}</p>
            </Row>
          ))
        )}
      </ColSection>

      <ColSection
        label="Venues"
        icon={<MapPin className="w-3 h-3" />}
        count={venues.length}
        href="/v2/venues/new"
        actionLabel="New"
        minHeight="min-h-16"
        maxHeight="max-h-28"
      >
        {venues.length === 0 ? (
          <Empty label="venues" />
        ) : (
          venues.map((v) => (
            <Row key={v.id} href={`/v2/venues/${v.id}/edit`}>
              <p className="text-text-dark text-[12px] font-medium truncate">{v.name}</p>
              {v.capacity && <span className="text-muted-dark text-[10px] shrink-0">Cap. {v.capacity}</span>}
            </Row>
          ))
        )}
      </ColSection>

      <ColSection
        label="Custom Requests"
        icon={<Wrench className="w-3 h-3" />}
        count={customRequests.length}
        action={() => setCustomRequestModalOpen(true)}
        actionIcon={<Expand className="w-2.5 h-2.5" />}
        actionLabel="New"
        minHeight="min-h-16"
        maxHeight="max-h-20"
      >
        {customRequests.length === 0 ? (
          <div className="px-3 py-4 text-center">
            <p className="text-muted-dark/80 text-[11px]">No requests yet.</p>
          </div>
        ) : (
          customRequests.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRequest(r)}
              className="w-full flex items-center justify-between gap-2 px-3 py-2.5 border-b border-border-dark/30 last:border-0 hover:bg-button-dark transition-colors text-left"
            >
              <div className="min-w-0">
                <p className="text-text-dark text-[12px] font-medium truncate">
                  {r.page} — {r.changeType}
                </p>
                <p className="text-muted-dark text-[10px] truncate">{r.what}</p>
              </div>
              <span
                className={`text-[9px] font-mono uppercase shrink-0 ${
                  r.status === 'COMPLETE'
                    ? 'text-emerald-400'
                    : r.status === 'IN_PROGRESS'
                      ? 'text-yellow-400'
                      : r.status === 'DECLINED'
                        ? 'text-muted-dark/70'
                        : 'text-primary-dark'
                }`}
              >
                {r.status}
              </span>
            </button>
          ))
        )}
      </ColSection>
    </motion.aside>
  )
}
