'use server'

import prisma from '@/prisma/client'
import { createLog } from '../../../utils/logHelper'
import { getActor } from '../user/getActor'
import { TeamMemberRole } from '@prisma/client'
import { buildLogMessage, getRequestContext } from '@/app/utils/parseUserAgent'
import { revalidateTag } from 'next/cache'

interface CreateTeamMemberInput {
  firstName: string
  lastName: string
  position: string
  bio: string
  role: string
  imageUrl: string
  imageFilename: string
  displayOrder?: number
  videoUrl?: string
  videoFilename?: string
  isPublished: boolean
}

export async function createTeamMember(data: CreateTeamMemberInput) {
  if (!data.firstName) return { success: false, error: 'First name is required' }
  if (!data.lastName) return { success: false, error: 'Last name is required' }
  if (!data.position) return { success: false, error: 'Position is required' }
  if (!data.bio) return { success: false, error: 'Bio is required' }
  if (!data.role) return { success: false, error: 'Role is required' }
  if (!data.imageUrl || !data.imageFilename) return { success: false, error: 'Team member image is required' }

  const [actor, context] = await Promise.all([getActor(), getRequestContext()])

  const teamMember = await prisma.teamMember
    .create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        position: data.position,
        bio: data.bio,
        role: data.role as TeamMemberRole,
        imageUrl: data.imageUrl,
        imageFilename: data.imageFilename,
        displayOrder: data.displayOrder ?? 0,
        videoFilename: data.videoFilename,
        videoUrl: data.videoUrl,
        isPublished: data.isPublished
      }
    })
    .catch(() => null)

  if (!teamMember) return { success: false, error: 'Failed to create team member — please try again' }

  await createLog(
    'info',
    await buildLogMessage(
      `created team member "${teamMember.firstName} ${teamMember.lastName}" (${teamMember.role})`,
      actor,
      context
    ),
    {
      teamMemberId: teamMember.id,
      name: `${teamMember.firstName} ${teamMember.lastName}`,
      position: teamMember.position,
      role: teamMember.role,
      createdBy: actor,
      request: context
    }
  ).catch(() => null)

  revalidateTag('dashboard', 'default')

  return { success: true }
}
