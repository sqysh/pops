import TestimonialsClient from '@/app/(authenticated)/admin/testimonials/TestimonialsClient'
import prisma from '@/prisma/client'
import { requireStaffPage } from '@/app/lib/auth/guards'

export default async function TestimonialsPage() {
  await requireStaffPage()

  const testimonials = await prisma.testimonial
    .findMany({
      orderBy: { createdAt: 'asc' }
    })
    .catch(() => [])

  return <TestimonialsClient key={testimonials.map((m) => m.updatedAt.getTime()).join()} testimonials={testimonials} />
}
