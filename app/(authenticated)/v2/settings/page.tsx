import prisma from '@/prisma/client'
import { SettingsClient } from './SettingsClient'
import { CustomRequest } from '@prisma/client'

export default async function SettingsPage() {
  const [customRequests, siteSettings] = await Promise.all([
    prisma.customRequest
      .findMany({
        orderBy: { submittedAt: 'desc' }
      })
      .catch(() => [] as CustomRequest[]),
    prisma.siteSetting.findMany().catch(() => null)
  ])

  return <SettingsClient siteSettings={siteSettings} customRequests={customRequests} />
}
