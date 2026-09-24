'use client'

import { useState } from 'react'
import type { SiteSetting } from '@prisma/client'
import { toggleSiteSetting } from '@/app/lib/actions/site-setting/toggleSiteSetting'
import { FormError, FormToggle } from '@/app/(authenticated)/v2/_components/FormField'

interface Props {
  siteSettings: SiteSetting[]
}

const SETTING_DATES: Record<string, string> = {
  subscriptionsLive: 'June 22, 2026',
  concertsPageLive: 'August 3, 2026',
  ticketsLive: 'August 3, 2026'
}

export function SettingsClient({ siteSettings }: Props) {
  const [settings, setSettings] = useState(siteSettings)
  const [pendingKey, setPendingKey] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const liveCount = settings.filter((s) => s.value).length

  async function handleToggle(setting: SiteSetting, value: boolean) {
    setError(null)
    setPendingKey(setting.key)
    setSettings((prev) => prev.map((s) => (s.key === setting.key ? { ...s, value } : s)))

    const result = await toggleSiteSetting(setting.key, value)

    setPendingKey(null)

    if (!result.success) {
      setSettings((prev) => prev.map((s) => (s.key === setting.key ? { ...s, value: !value } : s)))
      setError(
        result.error ?? `${setting.name} could not be changed, so it has been put back the way it was. Try again in a moment.`
      )
    }
  }

  return (
    <div className="flex flex-col h-full min-h-125 bg-neutral-200 text-sm">
      <div className="shrink-0 bg-white border-b border-neutral-300 px-6 py-4">
        <h1 className="text-lg font-semibold text-neutral-900">Settings</h1>
        <p className="text-neutral-600 mt-0.5">
          {liveCount} of {settings.length} live on the public site
        </p>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="px-6 py-6 max-w-3xl">
          <div className="bg-white border border-neutral-300">
            <div className="px-4 py-3 border-b border-neutral-200">
              <h2 className="font-semibold text-neutral-900">Site toggles</h2>
              <p className="text-neutral-600 mt-0.5 leading-relaxed">Control what&apos;s live on the public site.</p>
            </div>

            <div className="px-4 pb-4">
              {settings.map((setting) => (
                <FormToggle
                  key={setting.key}
                  label={setting.name}
                  description={
                    [setting.description, SETTING_DATES[setting.key] && `Target: ${SETTING_DATES[setting.key]}`]
                      .filter(Boolean)
                      .join(' · ') || undefined
                  }
                  value={setting.value}
                  disabled={pendingKey !== null}
                  onChange={(val) => handleToggle(setting, val)}
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="mt-4">
              <FormError error={error} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
