'use client'

import Breadcrumb from '@/app/components/common/Breadcrumb'
import { MediaVideoPlayer } from '@/app/components/media/MediaVideoPlayer'
import Picture from '@/app/components/common/Picture'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { PageHero } from '@/app/components/common/PageHero'

export const MediaClient = ({ photoGalleryImages }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const prev = () => setLightboxIndex((i) => (i! > 0 ? i! - 1 : photoGalleryImages.length - 1))
  const next = () => setLightboxIndex((i) => (i! < photoGalleryImages.length - 1 ? i! + 1 : 0))

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prev()
    if (e.key === 'ArrowRight') next()
    if (e.key === 'Escape') closeLightbox()
  }

  return (
    <main id="main-content">
      <Breadcrumb breadcrumb="Media" />

      <div className="relative">
        {/* ── Header ── */}
        <PageHero
          eyebrow="The Pops Orchestra"
          heading="Media"
          subheading=" Explore our photo gallery and watch performances from The Pops Orchestra."
        />

        {/* ── Photo gallery label ── */}
        <div className="w-full bg-black border-t border-b border-white/10 px-4 990:px-12 xl:px-4 py-4 flex items-center gap-3">
          <div className="w-6 h-px bg-blaze shrink-0" aria-hidden="true" />
          <h2 className="font-changa text-sm uppercase tracking-[0.3em] text-blaze-text">Photo Gallery</h2>
          <span className="text-sm font-mono text-muted-dark/70">({photoGalleryImages?.length ?? 0})</span>
        </div>

        {/* ── Photo grid ── */}
        <section aria-label="Photo gallery" className="w-full bg-black">
          <ul
            role="list"
            className="grid grid-cols-2 430:grid-cols-2 760:grid-cols-3 990:grid-cols-4 gap-px bg-white/5"
          >
            {photoGalleryImages?.map((photo, i) => (
              <li key={photo.id} className="bg-black group overflow-hidden">
                <button
                  type="button"
                  onClick={() => openLightbox(i)}
                  className="w-full flex items-center aspect-square justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-inset cursor-pointer"
                  aria-label={`View full image: ${photo.imageFilename || `Photo ${i + 1}`}`}
                >
                  <Picture
                    src={photo.imageUrl}
                    alt={photo.imageFilename || 'Pops Orchestra photo'}
                    width={600}
                    height={400}
                    priority={i < 4}
                    className="w-full h-full object-cover group-hover:scale-110 duration-500 transition-transform"
                    sizes="(max-width: 430px) 50vw, (max-width: 760px) 50vw, (max-width: 990px) 33vw, 25vw"
                  />
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Video player ── */}
        <div className="bg-black">
          <MediaVideoPlayer />
        </div>

        {/* ── Lightbox ── */}
        <AnimatePresence>
          {lightboxIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
              onClick={closeLightbox}
              onKeyDown={handleKeyDown}
              role="dialog"
              aria-modal="true"
              aria-label="Image lightbox"
              tabIndex={-1}
            >
              {/* Close */}
              <button
                type="button"
                onClick={closeLightbox}
                aria-label="Close lightbox"
                className="absolute top-4 right-4 z-10 text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm p-1"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Counter */}
              <p className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-white/40 text-sm font-mono tracking-[0.2em]">
                {lightboxIndex + 1} / {photoGalleryImages.length}
              </p>

              {/* Prev */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  prev()
                }}
                aria-label="Previous image"
                className="absolute left-2 430:left-4 z-10 text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm p-2"
              >
                <ChevronLeft className="w-6 h-6 430:w-8 430:h-8" />
              </button>

              {/* Image */}
              <motion.div
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="relative max-w-5xl max-h-[85vh] w-full mx-12 430:mx-16 flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <Picture
                  src={photoGalleryImages[lightboxIndex].imageUrl}
                  alt={photoGalleryImages[lightboxIndex].imageFilename || 'Pops Orchestra photo'}
                  width={1200}
                  height={800}
                  priority
                  className="max-w-full max-h-[85vh] w-auto h-auto object-contain"
                  sizes="90vw"
                />
                {photoGalleryImages[lightboxIndex].imageFilename && (
                  <p className="absolute -bottom-7 left-0 right-0 text-center text-sm font-mono text-white/30 truncate px-4">
                    {photoGalleryImages[lightboxIndex].imageFilename}
                  </p>
                )}
              </motion.div>

              {/* Next */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  next()
                }}
                aria-label="Next image"
                className="absolute right-2 430:right-4 z-10 text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm p-2"
              >
                <ChevronRight className="w-6 h-6 430:w-8 430:h-8" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
