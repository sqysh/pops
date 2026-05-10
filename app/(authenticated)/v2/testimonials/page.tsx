import TestimonialsClient from '@/app/(authenticated)/v2/testimonials/TestimonialsClient'
import prisma from '@/prisma/client'

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial
    .findMany({
      orderBy: { createdAt: 'asc' }
    })
    .catch(() => [])

  return <TestimonialsClient key={testimonials.map((m) => m.updatedAt.getTime()).join()} testimonials={testimonials} />
}
