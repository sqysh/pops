import GalleryClient from '@/app/(authenticated)/v2/gallery/GalleryClient'
import prisma from '@/prisma/client'

export default async function GalleryPage() {
  const photos = await prisma.photoGalleryImage
    .findMany({
      orderBy: { createdAt: 'desc' }
    })
    .catch(() => [])

  return <GalleryClient photos={photos} />
}
