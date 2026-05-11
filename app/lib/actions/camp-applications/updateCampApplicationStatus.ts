'use server'

import { createLog } from '@/app/utils/logHelper'
import { buildLogMessage, getRequestContext } from '@/app/utils/parseUserAgent'
import prisma from '@/prisma/client'
import { CampStatus } from '@prisma/client'
import { revalidateTag } from 'next/cache'

export async function updateCampApplicationStatus(id: string, status: CampStatus) {
  const context = await getRequestContext()

  const application = await prisma.campApplication
    .update({
      where: { id },
      data: { campStatus: status },
      include: { Student: true }
    })
    .catch(() => null)

  if (!application) {
    await createLog(
      'error',
      await buildLogMessage(`failed to update camp application status "${id}"`, 'admin', context),
      { id, status, error: 'Prisma update failed', request: context }
    ).catch(() => null)

    return { success: false, error: 'Failed to update application status' }
  }

  await createLog(
    'info',
    await buildLogMessage(
      `camp application for "${application.Student?.firstName} ${application.Student?.lastName}" marked as ${status}`,
      'admin',
      context
    ),
    { id, status, studentName: `${application.Student?.firstName} ${application.Student?.lastName}`, request: context }
  ).catch(() => null)

  revalidateTag('camp-applications', '')

  return { success: true, data: application }
}
