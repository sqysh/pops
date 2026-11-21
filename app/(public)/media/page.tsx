import { getPhotoGalleryImages } from '@/app/lib/actions/photo-gallery-image/getPhotoGalleryImages'
import { getPage } from '@/app/lib/actions/page/getPage'
import { MediaClient } from './MediaClient'

export default async function MediaPage() {
  const [photoGalleryImages, page] = await Promise.all([getPhotoGalleryImages(), getPage('media')])
  return <MediaClient photoGalleryImages={photoGalleryImages} content={page?.content} />
}
