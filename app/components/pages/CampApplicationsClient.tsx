'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChevronRight, Tent, Loader2, Download, ToggleLeft, ToggleRight, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { SiteSetting } from '@prisma/client'
import { toggleSiteSetting } from '@/app/lib/actions/site-setting/toggleSiteSetting'
import { store } from '@/app/redux/store'
import { showToast } from '@/app/redux/features/toastSlice'
import { createCampApplicationsSetting } from '@/app/lib/actions/camp-applications/createCampApplicationsSettings'
import { ApplicationModal } from '../modals/ApplicationModal'
import { LogoutButton } from '../common/LogoutButton'
import { FullApplication } from '@/app/types/entities/camp-application'
import { deleteCampApplication } from '@/app/lib/actions/camp-applications/deleteCampApplication'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  campApplications: FullApplication[]
  setting: SiteSetting | null
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function CampApplicationsClient({ campApplications, setting }: Props) {
  const router = useRouter()
  const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set())
  const [selectedApplication, setSelectedApplication] = useState<FullApplication | null>(null)
  const [isToggling, setIsToggling] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const enabled = setting?.value ?? false

  // Group by year
  const applicationsByYear = useMemo(() => {
    const grouped = campApplications.reduce((acc: Record<string, FullApplication[]>, app) => {
      const year = String(new Date(app.createdAt).getFullYear())
      if (!acc[year]) acc[year] = []
      acc[year].push(app)
      return acc
    }, {})

    return Object.keys(grouped)
      .sort((a, b) => Number(b) - Number(a))
      .map((year) => ({ year, applications: grouped[year] }))
  }, [campApplications])

  const toggleYear = (year: string) =>
    setExpandedYears((prev) => {
      const next = new Set(prev)
      if (next.has(year)) {
        next.delete(year)
      } else {
        next.add(year)
      }
      return next
    })

  const handleToggle = async () => {
    setIsToggling(true)
    await toggleSiteSetting('campApplicationsEnabled', !enabled)
    router.refresh()
    setIsToggling(false)
    store.dispatch(showToast({ type: 'success', message: `Camp applications ${!enabled ? 'enabled' : 'disabled'}` }))
  }

  const handleExport = () => {
    const rows = campApplications.map((a) =>
      [
        a.Student?.firstName ?? '',
        a.Student?.lastName ?? '',
        a.Student?.grade ?? '',
        a.Student?.school ?? '',
        a.Student?.studentEmailAddress ?? '',
        a.Student?.studentPhoneNumber ?? '',
        a.Parent?.firstName ?? '',
        a.Parent?.lastName ?? '',
        a.Parent?.parentEmailAddress ?? '',
        a.Parent?.parentPhoneNumber ?? '',
        a.instrument,
        new Date(a.createdAt).toLocaleDateString()
      ]
        .map((v) => `"${v}"`)
        .join(',')
    )

    const csv = [
      [
        'Student First',
        'Student Last',
        'Grade',
        'School',
        'Student Email',
        'Student Phone',
        'Parent First',
        'Parent Last',
        'Parent Email',
        'Parent Phone',
        'Instrument',
        'Date'
      ].join(','),
      ...rows
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `camp-applications-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <div className="h-screen flex flex-col overflow-hidden bg-bg-dark text-text-dark">
        {/* ── Top Bar ── */}
        <div className="shrink-0 h-11 bg-surface-dark border-b border-border-dark flex items-center justify-between px-4 z-20">
          <div className="flex items-center gap-3">
            <Link
              href="/v2/dashboard"
              className="text-muted-dark hover:text-text-dark transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
            <div className="w-px h-4 bg-border-dark" aria-hidden="true" />
            <Tent className="w-3.5 h-3.5 text-primary-dark" aria-hidden="true" />
            <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-text-dark">Camp Applications</span>
            <span className="text-[9px] font-mono text-muted-dark/60">({campApplications.length})</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Create setting if it doesn't exist */}
            {!setting && (
              <button
                type="button"
                onClick={async () => {
                  const res = await createCampApplicationsSetting()
                  if (res.success) {
                    store.dispatch(showToast({ type: 'success', message: 'Setting created' }))
                    router.refresh()
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-border-dark text-muted-dark hover:border-primary-dark hover:text-text-dark text-[9px] font-mono tracking-[0.15em] uppercase transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark"
              >
                <Plus className="w-3 h-3" aria-hidden="true" />
                Init Setting
              </button>
            )}
            {/* Toggle enabled */}
            <button
              type="button"
              onClick={handleToggle}
              disabled={isToggling}
              className={`flex items-center gap-1.5 px-3 py-1.5 border text-[9px] font-mono tracking-[0.15em] uppercase transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark ${
                enabled
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                  : 'border-border-dark text-muted-dark hover:border-primary-dark hover:text-text-dark'
              }`}
            >
              {isToggling ? (
                <Loader2 className="w-3 h-3 animate-spin" aria-hidden="true" />
              ) : enabled ? (
                <ToggleRight className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <ToggleLeft className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              {enabled ? 'Accepting' : 'Closed'}
            </button>

            {/* Export */}
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center gap-1.5 text-muted-dark hover:text-text-dark text-[9px] font-mono tracking-[0.15em] uppercase transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              Export
            </button>

            <div className="w-px h-4 bg-border-dark" aria-hidden="true" />
            <LogoutButton />
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto">
          {campApplications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <Tent className="w-10 h-10 text-border-dark" aria-hidden="true" />
              <p className="text-muted-dark text-sm">No applications yet.</p>
            </div>
          ) : (
            applicationsByYear.map(({ year, applications }) => {
              const isExpanded = expandedYears.has(year)

              return (
                <div key={year} className="border-b border-border-dark last:border-0">
                  {/* Year header */}
                  <div
                    className="flex items-center justify-between px-4 py-3 bg-surface-dark cursor-pointer hover:bg-button-dark transition-colors"
                    onClick={() => toggleYear(year)}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.15 }}>
                        <ChevronRight className="w-3.5 h-3.5 text-muted-dark" />
                      </motion.div>
                      <span className="font-quicksand font-black text-text-dark">{year}</span>
                      <span className="text-[9px] font-mono text-muted-dark/60">({applications.length})</span>
                    </div>
                  </div>

                  {/* Applications */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        {/* Table header */}
                        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_auto_auto] gap-4 px-4 py-2 border-b border-border-dark bg-bg-dark">
                          {['Student', 'Parent', 'Instrument', 'Date', '', ''].map((h, i) => (
                            <span
                              key={i}
                              className="text-[8px] font-mono tracking-[0.2em] uppercase text-muted-dark/80"
                            >
                              {h}
                            </span>
                          ))}
                        </div>

                        {applications.map((app, i) => (
                          <motion.div
                            key={app.id}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="grid grid-cols-[1fr_1fr_1fr_1fr_auto_auto] gap-4 items-center px-4 py-3 border-b border-border-dark/40 last:border-0 hover:bg-surface-dark transition-colors"
                          >
                            {/* Student */}
                            <button
                              type="button"
                              onClick={() => setSelectedApplication(app)}
                              className="text-left focus-visible:outline-none group truncate"
                            >
                              <p className="text-text-dark text-xs font-medium truncate group-hover:text-primary-dark transition-colors">
                                {app.Student?.firstName} {app.Student?.lastName}
                              </p>
                              <p className="text-muted-dark/80 text-[9px] truncate">
                                {app.Student?.grade} · {app.Student?.school}
                              </p>
                            </button>

                            {/* Parent */}
                            <div className="min-w-0">
                              <p className="text-text-dark text-xs truncate">
                                {app.Parent?.firstName} {app.Parent?.lastName}
                              </p>
                              <p className="text-muted-dark text-[9px] truncate">{app.Parent?.parentEmailAddress}</p>
                            </div>

                            {/* Instrument */}
                            <p className="text-muted-dark/80 text-[9px] truncate">{app.instrument || '—'}</p>

                            {/* Date */}
                            <p className="text-text-dark text-[9px] font-mono truncate">
                              {new Date(app.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>

                            {/* View */}
                            <button
                              type="button"
                              onClick={() => setSelectedApplication(app)}
                              className="text-muted-dark/40 hover:text-primary-dark transition-colors focus-visible:outline-none"
                              aria-label="View application"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={async () => {
                                setDeletingId(app.id)
                                await deleteCampApplication(app.id)
                                setDeletingId(null)
                              }}
                              disabled={deletingId === app.id}
                              aria-label={`Delete application for ${app.Student?.firstName} ${app.Student?.lastName}`}
                              className="text-muted-dark/40 hover:text-red-400 transition-colors focus-visible:outline-none disabled:opacity-50"
                            >
                              {deletingId === app.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                              )}
                            </button>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })
          )}
        </div>

        {/* ── Footer ── */}
        <div className="shrink-0 border-t border-border-dark px-4 py-2.5 bg-surface-dark flex items-center justify-between">
          <div
            className={`flex items-center gap-1.5 text-[9px] font-mono ${enabled ? 'text-emerald-400' : 'text-muted-dark/60'}`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${enabled ? 'bg-emerald-400 animate-pulse' : 'bg-muted-dark/40'}`}
              aria-hidden="true"
            />
            {enabled ? 'Accepting applications' : 'Applications closed'}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ApplicationModal application={selectedApplication} onClose={() => setSelectedApplication(null)} />
    </>
  )
}
