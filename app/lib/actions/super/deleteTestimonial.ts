'use server'

import { buildLogMessage, getRequestContext } from '@/app/utils/parseUserAgent'
import { getActor } from '../user/getActor'
import { denied, requireSuper } from '@/app/lib/auth/guards'
import prisma from '@/prisma/client'
import { createLog } from '@/app/utils/logHelper'
import { revalidateTag } from 'next/cache'

export async function deleteTestimonial(id: string) {
  const gate = await requireSuper()
  if (gate.ok === false) return denied(gate)

  if (!id) return { success: false, error: 'Testimonial ID is required' }

  const [actor, context] = await Promise.all([getActor(), getRequestContext()])

  const testimonial = await prisma.testimonial.delete({ where: { id } }).catch(() => null)
  if (!testimonial) return { success: false, error: 'Failed to delete testimonial' }

  await createLog('info', await buildLogMessage(`deleted testimonial by "${testimonial.author}"`, actor, context), {
    testimonialId: testimonial.id,
    author: testimonial.author,
    deletedBy: actor,
    request: context
  }).catch(() => null)

  revalidateTag('super-testimonials', '')
  return { success: true }
}
