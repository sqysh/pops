import prisma from '@/prisma/client'
import { SettingsClient } from './SettingsClient'
import { requireStaffPage } from '@/app/lib/auth/guards'

export default async function SettingsPage() {
  await requireStaffPage()

  const siteSettings = await prisma.siteSetting.findMany().catch(() => null)

  return <SettingsClient siteSettings={siteSettings} />
}
