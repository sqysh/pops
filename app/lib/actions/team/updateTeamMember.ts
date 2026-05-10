'use server'

import prisma from '@/prisma/client'
import { createLog } from '../../../utils/logHelper'
import { getActor } from '../user/getActor'
import { TeamMemberRole } from '@prisma/client'
import { buildLogMessage, getRequestContext } from '@/app/utils/parseUserAgent'
import { revalidateTag } from 'next/cache'

interface UpdateTeamMemberInput {
  firstName?: string
  lastName?: string
  position?: string
  bio?: string
  role?: string
  imageUrl?: string
  imageFilename?: string
  displayOrder?: number
  videoUrl?: string
  videoFilename?: string
  isPublished: boolean
}

export async function updateTeamMember(teamMemberId: string, data: UpdateTeamMemberInput) {
  if (!teamMemberId) return { success: false, error: 'Team member ID is required' }

  const [actor, context] = await Promise.all([getActor(), getRequestContext()])

  const teamMember = await prisma.teamMember
    .update({
      where: { id: teamMemberId },
      data: {
        ...(data.firstName && { firstName: data.firstName }),
        ...(data.lastName && { lastName: data.lastName }),
        ...(data.position && { position: data.position }),
        ...(data.bio && { bio: data.bio }),
        ...(data.role && { role: data.role as TeamMemberRole }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
        ...(data.imageFilename !== undefined && { imageFilename: data.imageFilename }),
        ...(typeof data.displayOrder === 'number' && { displayOrder: data.displayOrder }),
        ...(data.videoUrl !== undefined && { videoUrl: data.videoUrl }),
        ...(data.videoFilename !== undefined && { videoFilename: data.videoFilename }),
        ...{ isPublished: data.isPublished }
      }
    })
    .catch(() => null)

  if (!teamMember) return { success: false, error: 'Failed to update team member — please try again' }

  await createLog(
    'info',
    await buildLogMessage(
      `updated team member "${teamMember.firstName} ${teamMember.lastName}" (${teamMember.role})`,
      actor,
      context
    ),
    {
      teamMemberId: teamMember.id,
      name: `${teamMember.firstName} ${teamMember.lastName}`,
      position: teamMember.position,
      role: teamMember.role,
      updatedBy: actor,
      request: context
    }
  ).catch(() => null)

  revalidateTag('dashboard', 'default')

  return { success: true, data: teamMember }
}
