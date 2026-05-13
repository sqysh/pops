'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import type { CustomRequest, SiteSetting } from '@prisma/client'
import { toggleSiteSetting } from '@/app/lib/actions/site-setting/toggleSiteSetting'
import { CustomRequestDrawer } from '@/app/components/drawers/CustomRequestDrawer'
import { CustomRequestRow } from '@/app/components/rows/CustomRequestRow'

interface Props {
  siteSettings: SiteSetting[]
  customRequests: CustomRequest[]
}

const SETTING_DATES: Record<string, string> = {
  subscriptionsLive: 'June 22, 2026',
  concertsPageLive: 'August 3, 2026',
  ticketsLive: 'August 3, 2026'
}

export function SettingsClient({ siteSettings, customRequests: initialRequests }: Props) {
  const [requests, setRequests] = useState(initialRequests)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const [settings, setSettings] = useState(siteSettings)

  async function handleToggle(key: string, value: boolean) {
    setSettings((prev) => prev.map((s) => (s.key === key ? { ...s, value } : s)))
    const result = await toggleSiteSetting(key, value)
    if (!result.success) {
      // revert on failure
      setSettings((prev) => prev.map((s) => (s.key === key ? { ...s, value: !value } : s)))
    }
  }

  function handleCreated(r: CustomRequest) {
    setRequests((prev) => [r, ...prev])
  }

  const pendingCount = requests.filter((r) => r.status === 'PENDING').length

  return (
    <>
      <CustomRequestDrawer
        key={drawerOpen ? 'open' : 'closed'}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onCreated={handleCreated}
      />

      <div className="flex flex-col h-screen bg-bg-dark overflow-hidden">
        {/* Header */}
        <div className="bg-black shrink-0 border-b border-border-dark">
          <div className="flex items-center justify-between px-4 py-2.5">
            <div className="flex items-center gap-3">
              <Link
                href="/v2/dashboard"
                className="text-[9px] font-mono uppercase tracking-widest text-muted-dark/70 hover:text-primary-dark transition-colors"
              >
                &larr; Dashboard
              </Link>
              <div className="w-px h-3 bg-border-dark" aria-hidden="true" />
              <span className="text-[10px] font-mono text-muted-dark/70 uppercase tracking-widest">[ SETTINGS ]</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="px-6 py-6 flex flex-col gap-0">
            {/* Site Toggles */}
            <div className="grid grid-cols-[280px_1fr] gap-8 py-6 border-b border-border-dark">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-px bg-primary-dark shrink-0" />
                  <span className="text-[9px] font-mono uppercase tracking-widest text-primary-dark">Site Toggles</span>
                </div>
                <p className="text-[10px] font-mono text-muted-dark/80 leading-relaxed pl-5">
                  Control what&apos;s live on the public site. No need to contact Sqysh.
                </p>
              </div>
              <div className="border border-border-dark bg-surface-dark divide-y divide-border-dark/40">
                {settings.map((setting, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-mono text-text-dark uppercase tracking-widest">
                        {setting.name}
                      </span>
                      {setting.description && (
                        <span className="text-[9px] font-mono text-muted-dark/70">{setting.description}</span>
                      )}
                      {SETTING_DATES[setting.key] && (
                        <span className="text-[9px] font-mono text-muted-dark/80 tabular-nums">
                          Target: {SETTING_DATES[setting.key]}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggle(setting.key, !setting.value)}
                      className={`flex items-center gap-2 text-[9px] font-mono uppercase tracking-widest px-3 py-1.5 border transition-colors ${
                        setting.value
                          ? 'border-emerald-400/40 text-emerald-400 bg-emerald-400/5 hover:bg-emerald-400/10'
                          : 'border-border-dark text-muted-dark/80 hover:text-text-dark hover:border-muted-dark/30'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${setting.value ? 'bg-emerald-400' : 'bg-border-dark'}`}
                      />
                      {setting.value ? 'Live' : 'Hidden'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Requests */}
            <div className="grid grid-cols-[280px_1fr] gap-8 py-6">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-px bg-primary-dark shrink-0" />
                  <span className="text-[9px] font-mono uppercase tracking-widest text-primary-dark">
                    Custom Requests
                  </span>
                </div>
                <p className="text-[10px] font-mono text-muted-dark/80 leading-relaxed pl-5">
                  Submit a request to Sqysh for site changes, new features, or content updates. Reviewed in order of
                  urgency.
                </p>
                {pendingCount > 0 && (
                  <span className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 border text-amber-400 border-amber-400/30 bg-amber-400/5 w-fit ml-5">
                    {pendingCount} pending
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(true)}
                    className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest px-3 py-1.5 border border-primary-dark/40 text-primary-dark bg-primary-dark/5 hover:bg-primary-dark/10 transition-colors"
                  >
                    <Plus className="w-2.5 h-2.5" />
                    New Request
                  </button>
                </div>
                <div className="border border-border-dark bg-surface-dark">
                  {requests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-muted-dark/60">
                        No requests yet
                      </span>
                      <button
                        type="button"
                        onClick={() => setDrawerOpen(true)}
                        className="text-[9px] font-mono uppercase tracking-widest text-primary-dark hover:text-blaze-text transition-colors"
                      >
                        Submit your first request →
                      </button>
                    </div>
                  ) : (
                    requests.map((r) => <CustomRequestRow key={r.id} request={r} />)
                  )}
                </div>
                <p className="text-[9px] font-mono text-muted-dark/60 leading-relaxed">
                  Requests are sent to Sqysh via email and reviewed in order of urgency.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 flex items-center justify-between px-4 py-2 border-t border-border-dark bg-surface-dark">
          <Link
            href="/v2/dashboard"
            className="text-[9px] font-mono uppercase tracking-widest text-muted-dark/70 hover:text-primary-dark transition-colors"
          >
            &larr; Dashboard
          </Link>
          <span className="text-[9px] font-mono uppercase tracking-widest text-muted-dark/60">
            {requests.length} request{requests.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </>
  )
}
