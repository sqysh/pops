import { motion } from 'framer-motion'
import { ColSection } from './ColSection'
import { ArrowRight, Download, Expand, Mail, Tag, Tent, UserCircle } from 'lucide-react'
import { Empty } from './Empty'
import exportCampApplications from '@/app/lib/utils/exportCampApplications'
import { Row } from './Row'
import Picture from '../common/Picture'

export function RightColumn({
  questions,
  pending,
  users,
  campApplicationsCount,
  sponsors,
  setSponsorModalOpen,
  campApplications,
  setSelectedSponsor
}) {
  const handleExport = exportCampApplications(campApplications)
  return (
    <motion.aside
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-52 xl:w-60 shrink-0 overflow-y-auto hidden md:block"
    >
      <ColSection
        label="Inquiries"
        icon={<Mail className="w-3 h-3" />}
        count={questions.length}
        badge={pending.length > 0 ? pending.length : undefined}
        minHeight="min-h-32"
        maxHeight="max-h-52"
      >
        {questions.length === 0 ? (
          <Empty label="inquiries" />
        ) : (
          questions.slice(0, 8).map((q) => (
            <button
              key={q.id}
              className="w-full flex items-center justify-between gap-2 px-3 py-2.5 border-b border-border-dark/30 last:border-0 hover:bg-button-dark transition-colors text-left"
            >
              <div className="min-w-0">
                <p className="text-text-dark text-[12px] font-medium truncate">{q.name}</p>
                <div className="flex items-center gap-2">
                  <p className="text-muted-dark text-[10px] truncate">{q.email}</p>
                  <span className="text-muted-dark/70 text-[9px] font-mono shrink-0">
                    {new Date(q.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
              {q.hasResponded ? (
                <span className="text-[9px] font-mono uppercase text-emerald-400 shrink-0">Done</span>
              ) : (
                <span className="text-[9px] font-mono uppercase text-yellow-400 shrink-0">New</span>
              )}
            </button>
          ))
        )}
      </ColSection>

      <ColSection
        label="Users"
        icon={<UserCircle className="w-3 h-3" />}
        count={users.length}
        secondaryHref="/v2/users"
        secondaryLabel="View"
      >
        {users.length === 0 ? (
          <Empty label="users" />
        ) : (
          users.map((u) => (
            <button
              key={u.id}
              className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 border-b border-border-dark/30 last:border-0 hover:bg-button-dark transition-colors text-left`}
            >
              <div className="min-w-0">
                <p className="text-text-dark text-[12px] font-medium truncate">{u.firstName}</p>
                <p className="text-muted-dark text-[10px] truncate">{u.email}</p>
              </div>
              <span className="text-[9px] font-mono uppercase text-muted-dark/70 shrink-0">{u.role}</span>
            </button>
          ))
        )}
      </ColSection>

      <ColSection
        label="Camp Apps"
        icon={<Tent className="w-3 h-3" />}
        count={campApplicationsCount}
        action={handleExport}
        actionLabel="Export"
        actionIcon={<Download className="w-2.5 h-2.5" />}
        maxHeight="max-h-20"
        minHeight="min-h-10"
      >
        {campApplicationsCount === 0 ? (
          <Empty label="applications" />
        ) : (
          <Row href="/v2/camp-applications">
            <p className="text-text-dark text-[12px]">View all applications</p>
            <ArrowRight className="w-3 h-3 text-muted-dark" />
          </Row>
        )}
      </ColSection>

      <ColSection
        label="Sponsors"
        icon={<Tag className="w-3 h-3" />}
        count={sponsors.length}
        actionLabel="New"
        actionIcon={<Expand className="w-2.5 h-2.5" />}
        action={() => setSponsorModalOpen(true)}
        minHeight="min-h-16"
        maxHeight="max-h-48"
      >
        {sponsors.length === 0 ? (
          <Empty label="sponsors" />
        ) : (
          sponsors.map((s) => (
            <div
              key={s.id}
              onClick={() => {
                setSelectedSponsor(s)
                setSponsorModalOpen(true)
              }}
              className="flex items-center justify-between gap-2 px-3 py-2.5 border-b border-border-dark/30 last:border-0 cursor-pointer"
            >
              <div className="flex items-center gap-2 min-w-0">
                {s.filePath && (
                  <Picture
                    priority
                    src={s.filePath}
                    alt=""
                    aria-hidden="true"
                    className="w-5 h-5 object-contain shrink-0"
                  />
                )}
                <p className="text-text-dark text-[12px] font-medium truncate">{s.name}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {s.level && (
                  <span className="text-[9px] font-mono uppercase text-muted-dark/70 hidden sm:block truncate max-w-16">
                    {s.level}
                  </span>
                )}
                <span
                  className={`text-[9px] font-mono uppercase ${s.isActive ? 'text-emerald-400' : 'text-muted-dark/60'}`}
                >
                  {s.isActive ? 'Active' : 'Off'}
                </span>
              </div>
            </div>
          ))
        )}
      </ColSection>
    </motion.aside>
  )
}
