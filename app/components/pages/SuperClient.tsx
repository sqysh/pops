'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, RefreshCw, AlertCircle, FileText, CheckCircle, AlertTriangle } from 'lucide-react'
import type { CustomRequest } from '@prisma/client'
import { store } from '@/app/redux/store'
import { showToast } from '@/app/redux/features/toastSlice'
import { formatDate } from '@/app/utils/date.functions'
import { LogoutButton } from '../common/LogoutButton'
import { Section } from '../common/Section'

interface Props {
  customRequests: Pick<
    CustomRequest,
    'id' | 'what' | 'why' | 'example' | 'page' | 'changeType' | 'urgency' | 'submittedBy' | 'submittedAt' | 'status'
  >[]
  dbHealth: any
}

export default function SuperClient({ dbHealth }: Props) {
  const router = useRouter()

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
