import GalleryClient from '@/app/(authenticated)/admin/gallery/GalleryClient'
import prisma from '@/prisma/client'
import { requireStaffPage } from '@/app/lib/auth/guards'

export default async function GalleryPage() {
  await requireStaffPage()

  const photos = await prisma.photoGalleryImage
    .findMany({
      orderBy: { createdAt: 'desc' }
    })
    .catch(() => [])

  return <GalleryClient photos={photos} />
}
