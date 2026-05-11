'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, RefreshCw, AlertCircle, Eye, X } from 'lucide-react'
import type { Log } from '@prisma/client'
import { store } from '@/app/redux/store'
import { showToast } from '@/app/redux/features/toastSlice'
import { LogoutButton } from '../common/LogoutButton'

interface Props {
  infoLogs: Log[]
  errorLogs: Log[]
  warnLogs: Log[]
}

export default function LogsClient({ infoLogs, errorLogs, warnLogs }: Props) {
  const router = useRouter()
  const [expandedLog, setExpandedLog] = useState<string | null>(null)

  const handleRefresh = () => {
    router.refresh()
    store.dispatch(showToast({ type: 'success', message: 'Logs refreshed' }))
  }

  return (
    <div className="min-h-screen bg-bg-dark text-text-dark">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 h-11 bg-surface-dark border-b border-border-dark flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/v2/super"
            className="text-muted-dark hover:text-text-dark transition-colors"
            aria-label="Back to super dashboard"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
          <div className="w-px h-4 bg-border-dark" />
          <AlertCircle className="w-3.5 h-3.5 text-primary-dark" />
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-dark">System Logs</span>
        </div>

        <div className="flex items-center gap-3">
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
        <div className="grid grid-cols-3 gap-4">
          {/* Info Logs */}
          <LogColumn
            title="Info"
            count={infoLogs.length}
            logs={infoLogs}
            expandedLog={expandedLog}
            onExpand={setExpandedLog}
            colorClass="bg-primary-dark/10 text-primary-dark"
          />

          {/* Error Logs */}
          <LogColumn
            title="Error"
            count={errorLogs.length}
            logs={errorLogs}
            expandedLog={expandedLog}
            onExpand={setExpandedLog}
            colorClass="bg-red-500/10 text-red-400"
          />

          {/* Warn Logs */}
          <LogColumn
            title="Warn"
            count={warnLogs.length}
            logs={warnLogs}
            expandedLog={expandedLog}
            onExpand={setExpandedLog}
            colorClass="bg-yellow-500/10 text-yellow-400"
          />
        </div>
      </div>

      {/* Expanded Log Modal */}
      {expandedLog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-surface-dark border border-border-dark max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border-dark">
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-text-dark">Log Details</span>
              <button
                onClick={() => setExpandedLog(null)}
                className="text-muted-dark hover:text-text-dark transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {(() => {
                const log = [...infoLogs, ...errorLogs, ...warnLogs].find((l) => l.id === expandedLog)
                if (!log) return null
                return (
                  <div>
                    <div className="mb-4">
                      <p className="text-sm text-text-dark mb-2">{log.message}</p>
                      <p className="text-[10px] font-mono text-muted-dark">
                        {new Date(log.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {log.metadata && (
                      <pre className="text-[11px] font-mono text-muted-dark bg-bg-dark p-4 overflow-x-auto border border-border-dark/50">
                        {JSON.stringify(log.metadata, null, 2)}
                      </pre>
                    )}
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function LogColumn({
  title,
  count,
  logs,
  onExpand,
  colorClass
}: {
  title: string
  count: number
  logs: Log[]
  expandedLog: string | null
  onExpand: (id: string | null) => void
  colorClass: string
}) {
  return (
    <div className="bg-surface-dark border border-border-dark">
      <div className="p-3 border-b border-border-dark">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-text-dark">{title}</span>
          <span className="text-[9px] font-mono text-muted-dark">({count})</span>
        </div>
      </div>
      <div className="p-3 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
        {logs.map((log) => (
          <div
            key={log.id}
            className="p-3 bg-bg-dark border-l-2 border-border-dark hover:border-primary-dark transition-colors"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className={`text-[8px] font-mono tracking-[0.2em] uppercase px-1.5 py-0.5 ${colorClass}`}>
                {log.level}
              </span>
              <button
                onClick={() => onExpand(log.id)}
                className="text-muted-dark hover:text-text-dark transition-colors"
              >
                <Eye className="w-3 h-3" />
              </button>
            </div>
            <p className="text-[11px] text-text-dark line-clamp-3 mb-2">{log.message}</p>
            <span className="text-[9px] font-mono text-muted-dark">
              {new Date(log.createdAt).toLocaleTimeString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
              })}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
