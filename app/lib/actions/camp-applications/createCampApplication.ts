'use server'

import z from 'zod'
import { revalidateTag } from 'next/cache'
import prisma from '@/prisma/client'
import { createLog } from '../../../utils/logHelper'
import { campApplicationTemplate } from '../../email-templates/camp-application'
import { resend } from '../../resend'
import { buildLogMessage, getRequestContext } from '@/app/utils/parseUserAgent'
import { ActionResult } from '@/app/action.types'
import { CampApplicationFormInput, campApplicationSchema } from '../../schemas/camp-application.schema'

const MIN_FILL_MS = 2000

const orNull = (value?: string) => value?.trim() || null

export async function createCampApplication(data: CampApplicationFormInput): Promise<ActionResult<null>> {
  const parsed = campApplicationSchema.safeParse(data)

  if (!parsed.success) {
    return {
      success: false,
      error: 'Please check the highlighted fields and try again.',
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      data: null
    }
  }

  const application = parsed.data

  if (Date.now() - application.renderedAt < MIN_FILL_MS) {
    return { success: true, data: null }
  }

  const context = await getRequestContext()
  const studentName = `${application.firstName} ${application.lastName}`

  const existing = await prisma.student
    .findFirst({
      where: {
        firstName: { equals: application.firstName, mode: 'insensitive' },
        lastName: { equals: application.lastName, mode: 'insensitive' },
        studentPhoneNumber: { equals: application.studentPhoneNumber }
      },
      select: { id: true }
    })
    .catch(() => null)

  const created = await prisma.campApplication
    .create({
      data: {
        consent: application.consent,
        instrument: application.instrument,
        musicTeacher: orNull(application.musicTeacher),
        strings: orNull(application.strings),
        brassAndPercussion: orNull(application.brassAndPercussion),
        woodwinds: orNull(application.woodwinds),
        referralSource: orNull(application.referralSource),
        isDuplicate: !!existing,
        isNew: true,
        Student: {
          create: {
            firstName: application.firstName,
            lastName: application.lastName,
            grade: application.grade,
            school: application.school,
            studentEmailAddress: application.studentEmailAddress,
            studentPhoneNumber: application.studentPhoneNumber
          }
        },
        Address: {
          create: {
            addressLine1: application.addressLine1,
            addressLine2: orNull(application.addressLine2),
            city: application.city,
            state: application.state,
            zipPostalCode: application.zipPostalCode
          }
        },
        Parent: {
          create: {
            firstName: application.parentFirstName,
            lastName: application.parentLastName,
            relationshipToStudent: orNull(application.relationshipToStudent),
            parentEmailAddress: application.parentEmailAddress,
            parentPhoneNumber: application.parentPhoneNumber
          }
        }
      },
      select: { id: true }
    })
    .catch(() => null)

  if (!created) {
    await createLog('error', await buildLogMessage(`failed to save camp application from "${studentName}"`, 'public', context), {
      error: 'Prisma create failed',
      studentName,
      studentEmail: application.studentEmailAddress,
      request: context
    }).catch(() => null)

    return { success: false, error: 'We could not send your application. Please try again in a moment.', data: null }
  }

  await createLog('info', await buildLogMessage(`camp application submitted by "${studentName}"`, 'public', context), {
    applicationId: created.id,
    isDuplicate: !!existing,
    student: {
      name: studentName,
      email: application.studentEmailAddress,
      grade: application.grade,
      school: application.school,
      instrument: application.instrument
    },
    parent: {
      name: `${application.parentFirstName} ${application.parentLastName}`,
      email: application.parentEmailAddress
    },
    referralSource: orNull(application.referralSource),
    request: context
  }).catch(() => null)

  // the application is already saved, so a failed notification must not make
  // the family think it never went through and submit again
  await resend.emails
    .send({
      from: 'The Pops Orchestra <noreply@thepopsorchestra.org>',
      to: ['info@thepopsorchestra.org', 'robyn@thepopsorchestra.org'],
      subject: 'New Camp Application Received',
      html: campApplicationTemplate(application.firstName, application.lastName, application.studentEmailAddress)
    })
    .catch(async (error: unknown) => {
      const err = error instanceof Error ? error : new Error(String(error))

      await createLog('error', `Camp application notification email failed: ${err.message}`, {
        applicationId: created.id,
        studentName,
        errorMessage: err.message
      }).catch(() => null)

      return null
    })

  revalidateTag('dashboard', '')

  return { success: true, data: null }
}
