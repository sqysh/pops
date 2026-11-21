import { FullApplication } from '@/app/types/entities/camp-application'
import prisma from '@/prisma/client'
import { CampApplicationsClient } from './CampApplicationsClient'
import { requireStaffPage } from '@/app/lib/auth/guards'

export default async function CampApplicationsPage() {
  await requireStaffPage()

  const [campApplications] = await Promise.all([
    prisma.campApplication
      .findMany({
        include: { Student: true, Parent: true, Address: true },
        orderBy: { createdAt: 'desc' }
      })
      .catch(() => [] as FullApplication[])
  ])

  return <CampApplicationsClient applications={campApplications as FullApplication[]} />
}
