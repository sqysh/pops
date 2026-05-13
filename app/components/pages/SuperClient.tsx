'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  MapPin,
  Users,
  Calendar,
  FileText,
  MessageSquare,
  Star,
  DollarSign,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import type { CustomRequest, CustomRequestStatus, UserRole } from '@prisma/client'
import { updateCustomRequestStatus } from '@/app/lib/actions/custom-request/updateCustomerRequest'
import { store } from '@/app/redux/store'
import { showToast } from '@/app/redux/features/toastSlice'
import { formatDate } from '@/app/utils/date.functions'
import { deleteNews } from '@/app/lib/actions/super/deleteNews'
import { deleteVenue } from '@/app/lib/actions/super/deleteVenue'
import { deleteTeamMember } from '@/app/lib/actions/super/deleteTeamMember'
import { deleteEvent } from '@/app/lib/actions/super/deleteEvent'
import { deleteTestimonial } from '@/app/lib/actions/super/deleteTestimonial'
import { deleteSponsor } from '@/app/lib/actions/sponsor/deleteSponsor'
import { deleteQuestion } from '@/app/lib/actions/super/deleteQuestion'
import { deleteUser } from '@/app/lib/actions/super/deleteUser'
import {
  getSuperEvents,
  getSuperNews,
  getSuperQuestions,
  getSuperSponsors,
  getSuperTeamMembers,
  getSuperTestimonials,
  getSuperUsers,
  getSuperVenues
} from '@/app/lib/actions/super/inividualCachedQueries'
import { LogoutButton } from '../common/LogoutButton'
import { Section } from '../common/Section'
import { LazySection } from '../common/LazySection'
import { ROLE_STYLES } from '@/app/lib/constants/user.constants'

interface Props {
  customRequests: Pick<
    CustomRequest,
    'id' | 'what' | 'why' | 'example' | 'page' | 'changeType' | 'urgency' | 'submittedBy' | 'submittedAt' | 'status'
  >[]
  dbHealth: any
}

export default function SuperClient({ customRequests, dbHealth }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleStatusChange = async (id: string, status: string) => {
    setLoading(id)
    const res = await updateCustomRequestStatus(id, status as CustomRequestStatus)
    setLoading(null)

    if (res.success) {
      store.dispatch(showToast({ type: 'success', message: 'Status updated' }))
      router.refresh()
    } else {
      store.dispatch(showToast({ type: 'error', message: res.error ?? 'Failed to update' }))
    }
  }

  type DeleteAction = (id: string) => Promise<{ success: boolean; error?: string }>

  const handleDelete = async <T extends { id: string }>(
    model: string,
    id: string,
    action: DeleteAction,
    setter: React.Dispatch<React.SetStateAction<T[] | null>>,
    current: T[]
  ) => {
    setter((prev) => (prev ? prev.filter((i) => i.id !== id) : null))
    const res = await action(id)
    if (!res.success) {
      setter(current)
      store.dispatch(showToast({ type: 'error', message: res.error ?? `Failed to delete ${model}` }))
    } else {
      store.dispatch(showToast({ type: 'success', message: `${model} deleted` }))
    }
  }

  const handleRefresh = () => {
    router.refresh()
    store.dispatch(showToast({ type: 'success', message: 'Data refreshed' }))
  }

  return (
    <div className="min-h-screen bg-bg-dark text-text-dark">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 h-11 bg-surface-dark border-b border-border-dark flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/v2/dashboard"
            className="text-muted-dark hover:text-text-dark transition-colors"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
          <div className="w-px h-4 bg-border-dark" />
          <AlertCircle className="w-3.5 h-3.5 text-primary-dark" />
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-dark">Super Dashboard</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/v2/super/logs"
            className="flex items-center gap-2 px-3 py-1 text-[10px] font-mono tracking-[0.15em] uppercase text-muted-dark hover:text-text-dark transition-colors border border-border-dark hover:border-primary-dark"
          >
            <FileText className="w-3 h-3" />
            View Logs
          </Link>
          <div className="w-px h-4 bg-border-dark" />
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-3 py-1 text-[10px] font-mono tracking-[0.15em] uppercase text-muted-dark hover:text-text-dark transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Refresh
          </button>
          <div className="w-px h-4 bg-border-dark" />
          <LogoutButton />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-screen-2xl mx-auto p-6">
        <div className="grid grid-cols-12 gap-4">
          {/* Left Column */}
          <div className="col-span-4 space-y-4">
            <Section
              title="Custom Requests"
              icon={<MessageSquare className="w-3.5 h-3.5" />}
              count={customRequests.length}
            >
              <div className="space-y-2 max-h-600 overflow-y-auto">
                {customRequests.map((req) => (
                  <div key={req.id} className="p-3 bg-bg-dark border border-border-dark">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-text-dark font-medium mb-1">{req.what}</p>
                        <p className="text-[9px] text-muted-dark/80 mb-2 leading-relaxed">{req.why}</p>
                        {req.example && (
                          <p className="text-[9px] text-muted-dark/70 italic mb-2 leading-relaxed">
                            &quot;{req.example}&quot;
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="text-[9px] font-mono text-muted-dark/80">
                            <span className="text-muted-dark/60">page</span> {req.page}
                          </span>
                          <span className="text-[9px] font-mono text-muted-dark/80">
                            <span className="text-muted-dark/60">type</span> {req.changeType}
                          </span>
                          <span className="text-[9px] font-mono text-muted-dark/80">
                            <span className="text-muted-dark/60">urgency</span> {req.urgency}
                          </span>
                          {req.submittedBy && (
                            <span className="text-[9px] font-mono text-muted-dark/80">
                              <span className="text-muted-dark/60">by</span> {req.submittedBy}
                            </span>
                          )}
                          <span className="text-[9px] font-mono text-muted-dark/60">{formatDate(req.submittedAt)}</span>
                        </div>
                      </div>
                      <span
                        className={`text-[9px] font-mono tracking-[0.2em] uppercase px-1.5 py-0.5 shrink-0 ${
                          req.status === 'COMPLETE'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : req.status === 'DECLINED'
                              ? 'bg-red-500/10 text-red-400'
                              : req.status === 'IN_PROGRESS'
                                ? 'bg-yellow-500/10 text-yellow-400'
                                : 'bg-border-dark text-muted-dark'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {(['PENDING', 'IN_PROGRESS', 'COMPLETE', 'DECLINED'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(req.id, status)}
                          disabled={req.status === status || loading === req.id}
                          className={`flex-1 px-2 py-1 text-[9px] font-mono tracking-[0.15em] uppercase border transition-colors disabled:opacity-30 ${
                            req.status === status
                              ? 'border-primary-dark bg-primary-dark/10 text-text-dark'
                              : 'border-border-dark text-muted-dark hover:text-text-dark hover:border-muted-dark'
                          }`}
                        >
                          {status.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <LazySection
              fetcher={getSuperVenues}
              title="Venues"
              icon={<MapPin className="w-3.5 h-3.5" />}
              onDelete={(id, setter, current) => handleDelete('Venue', id, deleteVenue, setter, current)}
              renderItem={(v) => v.name}
              loading={loading}
            />

            <LazySection
              fetcher={getSuperTeamMembers}
              title="Team Members"
              icon={<Users className="w-3.5 h-3.5" />}
              onDelete={(id, setter, current) => handleDelete('Team Member', id, deleteTeamMember, setter, current)}
              renderItem={(t) => (
                <span className="flex items-center gap-2 min-w-0">
                  <span className="truncate">
                    {t.firstName} {t.lastName}
                  </span>
                  <span
                    className={`text-[9px] font-mono tracking-[0.15em] uppercase px-1.5 py-0.5 shrink-0 ${
                      t.role === 'BOARD_MEMBER'
                        ? 'bg-primary-dark/10 text-primary-dark'
                        : t.role === 'STAFF'
                          ? 'bg-yellow-500/10 text-yellow-400'
                          : 'bg-blue-500/10 text-blue-400'
                    }`}
                  >
                    {t.role.replace('_', ' ')}
                  </span>
                  <span className="text-[9px] font-mono text-muted-dark/60 shrink-0 hidden sm:block">
                    {formatDate(t.updatedAt)}
                  </span>
                </span>
              )}
              loading={loading}
            />
          </div>

          {/* Middle Column */}
          <div className="col-span-4 space-y-4">
            <LazySection
              fetcher={getSuperEvents}
              title="Events"
              icon={<Calendar className="w-3.5 h-3.5" />}
              onDelete={(id, setter, current) => handleDelete('Event', id, deleteEvent, setter, current)}
              renderItem={(e) => e.title}
              loading={loading}
            />

            <LazySection
              fetcher={getSuperNews}
              title="News"
              icon={<FileText className="w-3.5 h-3.5" />}
              onDelete={(id, setter, current) => handleDelete('News', id, deleteNews, setter, current)}
              renderItem={(n) => (
                <span className="flex items-center gap-2 min-w-0">
                  <span className="truncate">{n.title}</span>
                  <span
                    className={`text-[9px] font-mono tracking-[0.15em] uppercase px-1.5 py-0.5 shrink-0 ${
                      n.isPublished ? 'bg-emerald-500/10 text-emerald-400' : 'bg-border-dark text-muted-dark/70'
                    }`}
                  >
                    {n.isPublished ? 'Published' : 'Draft'}
                  </span>
                </span>
              )}
              loading={loading}
            />

            <LazySection
              fetcher={getSuperTestimonials}
              title="Testimonials"
              icon={<Star className="w-3.5 h-3.5" />}
              onDelete={(id, setter, current) => handleDelete('Testimonial', id, deleteTestimonial, setter, current)}
              renderItem={(t) => t.author}
              loading={loading}
            />

            <LazySection
              fetcher={getSuperSponsors}
              title="Sponsors"
              icon={<DollarSign className="w-3.5 h-3.5" />}
              onDelete={(id, setter, current) => handleDelete('Sponsor', id, deleteSponsor, setter, current)}
              renderItem={(s) => (
                <span className="flex items-center gap-2 min-w-0">
                  <span className="truncate">{s.name}</span>
                  <span className="text-[9px] font-mono text-muted-dark/70 shrink-0">{s.level}</span>
                  <span className="text-[9px] font-mono text-emerald-400 shrink-0">${s.amount.toLocaleString()}</span>
                  {!s.isActive && (
                    <span className="text-[9px] font-mono tracking-[0.15em] uppercase px-1.5 py-0.5 shrink-0 bg-border-dark text-muted-dark/70">
                      Inactive
                    </span>
                  )}
                </span>
              )}
              loading={loading}
            />
          </div>

          {/* Right Column */}
          <div className="col-span-4 space-y-4">
            <LazySection
              fetcher={getSuperQuestions}
              title="Questions"
              icon={<MessageSquare className="w-3.5 h-3.5" />}
              onDelete={(id, setter, current) => handleDelete('Question', id, deleteQuestion, setter, current)}
              renderItem={(q) => (
                <span className="flex items-center gap-2 min-w-0">
                  <span className="truncate">{q.name}</span>
                  <span className="text-[9px] font-mono text-muted-dark/70 truncate hidden sm:block">{q.email}</span>
                  <span
                    className={`text-[9px] font-mono tracking-[0.15em] uppercase px-1.5 py-0.5 shrink-0 ${
                      q.hasResponded ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'
                    }`}
                  >
                    {q.hasResponded ? 'Responded' : 'Pending'}
                  </span>
                </span>
              )}
              loading={loading}
            />

            <LazySection
              fetcher={getSuperUsers}
              title="Users"
              icon={<Users className="w-3.5 h-3.5" />}
              onDelete={(id, setter, current) => handleDelete('User', id, deleteUser, setter, current)}
              renderItem={(u) => (
                <span className="flex items-center gap-2">
                  <span>{u.email ?? 'No email'}</span>
                  <span
                    className={`text-[9px] font-mono tracking-[0.15em] uppercase px-1.5 py-0.5 ${ROLE_STYLES[u.role as UserRole] ?? 'bg-border-dark text-muted-dark'}`}
                  >
                    {u.role}
                  </span>
                </span>
              )}
              loading={loading}
            />
          </div>
        </div>
      </div>

      <div className="col-span-12 space-y-4">
        <Section
          title="Database Health"
          icon={<AlertCircle className="w-3.5 h-3.5" />}
          count={dbHealth?.activeConnections || 0}
        >
          {dbHealth && (
            <div className="col-span-12 mb-4">
              <div className="bg-surface-dark border-2 border-border-dark p-4 space-y-4">
                {/* Neon badge */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border-dark">
                  <div className="flex items-center gap-2">
                    <div
                      className="px-3 py-1.5 flex items-center gap-2"
                      style={{
                        background: 'linear-gradient(90deg, #00e59910, #00e59905)',
                        border: '1px solid #00e59930'
                      }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-[#00e599]" />
                      <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#00e599]">
                        Neon Postgres
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-muted-dark/80">
                      Serverless · Auto-pooled · US East 1
                    </span>
                  </div>

                  <a
                    href="https://console.neon.tech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[9px] font-mono tracking-[0.15em] uppercase text-muted-dark/60 hover:text-muted-dark transition-colors"
                  >
                    Console ↗
                  </a>
                </div>
                {/* Connections */}
                <div>
                  <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-dark mb-1">
                    Database Connections
                  </p>
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-4xl font-mono ${
                        dbHealth.activeConnections > 200
                          ? 'text-red-400'
                          : dbHealth.activeConnections > 100
                            ? 'text-yellow-400'
                            : 'text-emerald-400'
                      }`}
                    >
                      {dbHealth.activeConnections}{' '}
                      <span className="text-xl text-muted-dark">/ {dbHealth.maxConnections}</span>
                    </p>
                    <div className="text-right">
                      <p
                        className={`text-sm font-mono ${
                          dbHealth.activeConnections > 200
                            ? 'text-red-400'
                            : dbHealth.activeConnections > 100
                              ? 'text-yellow-400'
                              : 'text-emerald-400'
                        }`}
                      >
                        {dbHealth.activeConnections > 200
                          ? '⚠️ CRITICAL - SITE MAY CRASH'
                          : dbHealth.activeConnections > 100
                            ? '⚠️ ELEVATED - MONITOR CLOSELY'
                            : '✓ HEALTHY'}
                      </p>
                      <p className="text-[9px] font-mono text-muted-dark mt-1">
                        Last checked: {formatDate(new Date())}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 h-2 bg-bg-dark overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        dbHealth.activeConnections > 200
                          ? 'text-red-400'
                          : dbHealth.activeConnections > 100
                            ? 'text-yellow-400'
                            : 'text-emerald-400'
                      }`}
                      style={{ width: `${(dbHealth.activeConnections / dbHealth.maxConnections) * 100}%` }}
                    />
                  </div>
                  <p className="text-[9px] font-mono text-muted-dark/60 mt-2 leading-relaxed">
                    Active connections to the database. Green &lt;20, yellow 20–30, red &gt;30. High counts indicate
                    connection pool exhaustion — site may become unresponsive if limit is reached.
                  </p>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border-dark">
                  <div className="bg-bg-dark p-3">
                    <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-dark mb-1">DB Size</p>
                    <p className="text-lg font-mono text-text-dark">{dbHealth.dbSize}</p>
                    <p className="text-[9px] font-mono text-muted-dark/60 mt-1 leading-relaxed">
                      Total size of the database on disk. Neon free tier limit is 0.5 GB.
                    </p>
                  </div>

                  <div className="bg-bg-dark p-3">
                    <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-dark mb-1">
                      Cache Hit Rate
                    </p>
                    <p
                      className={`text-lg font-mono ${dbHealth.cacheHitHealthy ? 'text-emerald-400' : 'text-red-400'}`}
                    >
                      {dbHealth.cacheHitRate}%
                      <span className="text-[10px] ml-1">
                        {dbHealth.cacheHitHealthy ? (
                          <CheckCircle className="w-3 h-3 text-emerald-400 inline ml-1" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 text-yellow-400 inline ml-1" />
                        )}
                      </span>
                    </p>
                    <p className="text-[9px] font-mono text-muted-dark/60 mt-1 leading-relaxed">
                      % of queries served from memory vs disk. Healthy at 85%+ — low values mean frequent disk reads and
                      slower queries.
                    </p>
                  </div>

                  <div className="bg-bg-dark p-3">
                    <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-dark mb-1">
                      Oldest Transaction
                    </p>
                    <p
                      className={`text-lg font-mono flex items-center gap-1.5 ${
                        dbHealth.oldestTransactionWarning ? 'text-yellow-400' : 'text-text-dark'
                      }`}
                    >
                      {dbHealth.oldestTransaction ?? 'None'}
                      {dbHealth.oldestTransactionWarning && (
                        <AlertTriangle className="w-3 h-3 text-yellow-400 shrink-0" />
                      )}
                    </p>
                    <p className="text-[9px] font-mono text-muted-dark/60 mt-1 leading-relaxed">
                      Duration of the longest running active query. Warn if &gt;30s — may indicate a stuck or slow
                      transaction.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Section>
      </div>
    </div>
  )
}
