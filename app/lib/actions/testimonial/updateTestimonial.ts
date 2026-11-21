'use server'

import { TestimonialInput } from '@/app/types/entities/testimonial'
import { getActor } from '../user/getActor'
import prisma from '@/prisma/client'
import { createLog } from '@/app/utils/logHelper'
import { buildLogMessage, getRequestContext } from '@/app/utils/parseUserAgent'
import { requireStaff, denied } from '@/app/lib/auth/guards'

export async function updateTestimonial(id: string, data: TestimonialInput) {
  const gate = await requireStaff()
  if (gate.ok === false) return denied(gate)

  if (!id) return { success: false, error: 'Testimonial ID is required' }
  if (!data.quote) return { success: false, error: 'Quote is required' }
  if (!data.author) return { success: false, error: 'Author is required' }

  const [actor, context] = await Promise.all([getActor(), getRequestContext()])

  const testimonial = await prisma.testimonial
    .update({
      where: { id },
      data: {
        quote: data.quote,
        author: data.author,
        title: data.title ?? '',
        isPublished: data.isPublished ?? false
      }
    })
    .catch(() => null)

  if (!testimonial) return { success: false, error: 'Failed to update testimonial' }

  await createLog('info', await buildLogMessage(`updated testimonial by "${testimonial.author}"`, actor, context), {
    testimonialId: testimonial.id,
    author: testimonial.author,
    title: testimonial.title,
    isPublished: testimonial.isPublished,
    updatedBy: actor,
    request: context
  }).catch(() => null)

  return { success: true, data: testimonial }
}
