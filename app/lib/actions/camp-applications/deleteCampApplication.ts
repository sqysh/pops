'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'
import { getActor } from '../user/getActor'
import { getRequestContext } from '@/app/utils/parseUserAgent'
import { createLog } from '@/app/utils/logHelper'

export async function deleteCampApplication(id: string) {
  if (!id) return { success: false, error: 'Application ID is required' }

  const [actor, context] = await Promise.all([getActor(), getRequestContext()])

  const application = await prisma.campApplication
    .delete({
      where: { id }
    })
    .catch(() => null)

  if (!application) return { success: false, error: 'Failed to delete application' }

  await createLog(
    'info',
    `Deleted camp application for "${application.Student?.firstName} ${application.Student?.lastName}"`,
    {
      applicationId: application.id,
      studentName: `${application.Student?.firstName} ${application.Student?.lastName}`,
      deletedBy: actor,
      request: context
    }
  ).catch(() => null)

  revalidateTag('camp-applications', '')

  return { success: true }
}
