'use client'

import { useRef, useState } from 'react'
import Picture from '@/components/common/Picture'
import { Play } from 'lucide-react'
import { pageCopy } from '@/app/lib/page-content/copy'
import { pageContent } from '@/app/lib/constants/page-content/media'

const videos = [
  {
    title: 'Highlight Reel',
    url: 'https://www.youtube.com/embed/gMBsk45zwIo'
  },
  {
    title: 'Come On, Get Happy',
    url: 'https://www.youtube.com/embed/7tteFL2NGGY'
  },
  {
    title: 'Copacabana Valentines',
    url: 'https://www.youtube.com/embed/TlDpUi3od-Y'
  },
  {
    title: 'John Denver: Coming Home',
    url: 'https://www.youtube.com/embed/_5xGgSCmj3E'
  },
  {
    title: 'Sgt. Presley',
    url: 'https://www.youtube.com/embed/rFuGHK8bD4o'
  },
  {
    title: 'Simply Streisand',
    url: 'https://www.youtube.com/embed/wbwQ0kPztQM'
  },
  {
    title: 'The Choice is Yours',
    url: 'https://www.youtube.com/embed/f74W9Wjx78E'
  },
  {
    title: 'The Spirit of America',
    url: 'https://www.youtube.com/embed/i_p1ECqHyF0'
  },
  {
    title: 'Patriotic Shows',
    url: 'https://www.youtube.com/embed/o21h7On0yUE'
  }
]

// Helper function to get video ID from embed URL
const getVideoId = (url: string) => {
  const match = url.match(/\/embed\/([^?&]+)/)
  return match ? match[1] : null
}

// Create new array with thumbnails dynamically added
const defaultVideos = videos.map((video) => {
  const videoId = getVideoId(video.url)
  return {
    ...video,
    thumbnail: videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '/default-thumbnail.jpg'
  }
})

export const MediaVideoPlayer = ({ content }: { content: unknown }) => {
  const { t } = pageCopy(content, pageContent)
  const videosWithThumbnails = defaultVideos.map((video, i) => ({
    ...video,
    title: t(`media_video_${i + 1}_title`)
  }))
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const selectedVideo = videosWithThumbnails[selectedIndex]
  const liveRef = useRef<HTMLSpanElement>(null)

  const handleSelect = (index: number) => {
    setSelectedIndex(index)
    setPlaying(false)
  }

  const handlePlay = () => {
    setPlaying(true)
    setTimeout(() => iframeRef.current?.focus(), 100)
  }

  return (
    <section aria-labelledby="video-section-heading" className="w-full">
      <span id="video-section-heading" className="sr-only">
        {t('media_video_section_heading')}
      </span>
      <span ref={liveRef} className="sr-only" aria-live="polite" aria-atomic="true">
        {t('media_video_now_playing_announcement', { title: selectedVideo.title })}
      </span>

      <div className="flex flex-col 990:grid 990:grid-cols-12 gap-px bg-white/5">
        {/* ── Player ── */}
        <div className="990:col-span-8 bg-black">
          {/* Now playing label */}
          <div className="flex items-center gap-3 px-4 990:px-6 py-3 border-b border-white/10">
            <div className="w-4 h-px bg-blaze shrink-0" aria-hidden="true" />
            <p className="font-changa text-sm uppercase tracking-[0.25em] text-blaze-text truncate">
              {t('media_video_now_playing', { title: selectedVideo.title })}
            </p>
          </div>

          {/* Video / thumbnail */}
          <div className="relative aspect-video w-full bg-black">
            {playing ? (
              <iframe
                ref={iframeRef}
                src={`${selectedVideo.url}?autoplay=1`}
                title={selectedVideo.title}
                aria-label={t('media_video_now_playing_announcement', { title: selectedVideo.title })}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                tabIndex={0}
                className="w-full h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
              />
            ) : (
              <button
                type="button"
                onClick={handlePlay}
                aria-label={t('media_video_play_label', { title: selectedVideo.title })}
                className="absolute inset-0 w-full h-full group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-inset"
              >
                <Picture
                  src={selectedVideo.thumbnail}
                  alt={t('media_video_thumbnail_alt', { title: selectedVideo.title })}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 990px) 100vw, 66vw"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" aria-hidden="true" />
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                  <div className="w-16 h-16 430:w-20 430:h-20 rounded-full bg-blaze/90 group-hover:bg-blaze group-hover:scale-110 transition-all duration-300 flex items-center justify-center">
                    <Play className="w-6 h-6 430:w-8 430:h-8 text-white translate-x-0.5" />
                  </div>
                </div>
                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 430:p-6 bg-linear-to-t from-black to-transparent">
                  <p className="font-changa text-white text-lg 430:text-2xl leading-tight">{selectedVideo.title}</p>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* ── Playlist ── */}
        <nav aria-label={t('media_playlist_nav_label')} className="990:col-span-4 bg-black flex flex-col">
          <div className="flex items-center gap-3 px-4 990:px-6 py-3 border-b border-white/10 shrink-0">
            <div className="w-4 h-px bg-blaze shrink-0" aria-hidden="true" />
            <p className="font-changa text-sm uppercase tracking-[0.25em] text-blaze-text">
              {t('media_playlist_label')}
              <span className="ml-2 text-muted-dark/70">({videosWithThumbnails.length})</span>
            </p>
          </div>

          <ul
            role="list"
            aria-label={t('media_playlist_list_label')}
            className="flex flex-row 990:flex-col overflow-x-auto 990:overflow-x-visible 990:overflow-y-auto 990:max-h-[calc(56.25vw*0.66)] divide-x 990:divide-x-0 990:divide-y divide-white/10"
          >
            {videosWithThumbnails.map((video, i) => {
              const isActive = i === selectedIndex
              return (
                <li key={i} className="shrink-0 990:shrink bg-black">
                  <button
                    type="button"
                    onClick={() => handleSelect(i)}
                    aria-label={t('media_video_play_label', { title: video.title })}
                    aria-pressed={isActive}
                    className={`flex flex-col 990:flex-row items-start gap-3 w-40 990:w-full text-left p-3 430:p-4 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-inset border-l-0 990:border-l-2 ${
                      isActive
                        ? 'bg-blaze/10 990:border-blaze'
                        : 'hover:bg-white/5 990:border-transparent hover:990:border-blaze/40'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative w-full 990:w-20 aspect-video 990:h-14 990:aspect-auto shrink-0 overflow-hidden bg-black">
                      <Picture
                        src={video.thumbnail}
                        alt=""
                        fill
                        priority={i < 3}
                        className="object-cover"
                        sizes="(max-width: 990px) 160px, 80px"
                      />
                      {isActive && (
                        <div className="absolute inset-0 bg-blaze/20 flex items-center justify-center" aria-hidden="true">
                          <Play className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <p className={`font-lato text-sm leading-snug line-clamp-2 ${isActive ? 'text-white' : 'text-white/70'}`}>
                      {video.title}
                    </p>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </section>
  )
}
