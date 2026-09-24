import prisma from '@/prisma/client'
import { SettingsClient } from './SettingsClient'

export default async function SettingsPage() {
  const siteSettings = await prisma.siteSetting.findMany().catch(() => null)

  return <SettingsClient siteSettings={siteSettings} />
}
