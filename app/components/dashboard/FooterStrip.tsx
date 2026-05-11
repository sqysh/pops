import { motion } from 'framer-motion'
import { Image as Img, Plus, ArrowRight, Calendar, Quote, FileText } from 'lucide-react'
import Link from 'next/link'

export function FooterStrip({
  testimonialsCount,
  testimonialsLiveCount,
  newsCount,
  newsLiveCount,
  eventsCount,
  eventsLiveCount,
  photosCount,
  setTestimonialModalOpen
}) {
  const testimonialsDraftCount = testimonialsCount - testimonialsLiveCount
  const newsDraftCount = newsCount - newsLiveCount
  const eventsDraftCount = eventsCount - eventsLiveCount
  return (
    <motion.footer
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="shrink-0 border-t border-border-dark bg-surface-dark"
    >
      <div className="grid grid-cols-4">
        {[
          {
            href: '/v2/gallery',
            icon: <Img className="w-3 h-3" />,
            label: 'Gallery',
            value: photosCount,
            arrow: <ArrowRight className="w-3 h-3" />
          },
          {
            href: '/v2/events',
            icon: <Calendar className="w-3 h-3" />,
            label: 'Events',
            value: eventsCount,
            liveCount: eventsLiveCount,
            draftCount: eventsDraftCount,
            arrow: <ArrowRight className="w-3 h-3" />
          },
          {
            href: '/v2/news',
            icon: <FileText className="w-3 h-3" />,
            label: 'News',
            value: newsCount,
            liveCount: newsLiveCount,
            draftCount: newsDraftCount,
            arrow: <ArrowRight className="w-3 h-3" />
          }
        ].map((item, i, arr) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center justify-between gap-2 px-3 py-2.5 hover:bg-button-dark transition-colors group ${i < arr.length - 1 ? 'border-r border-border-dark' : ''}`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-primary-dark shrink-0">{item.icon}</span>
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-dark truncate">
                {item.label}
              </span>
              <span className="text-[10px] font-mono text-muted-dark/70">({item.value})</span>
              {item.label !== 'Gallery' && (
                <>
                  <span className="text-[9px] font-mono text-emerald-400 hidden lg:block">{item.liveCount} live</span>
                  <span className="text-[9px] font-mono text-muted-dark/70 hidden lg:block">
                    {item.draftCount} draft
                  </span>
                </>
              )}
            </div>
            <span className="text-border-dark group-hover:text-primary-dark transition-colors shrink-0">
              {item.arrow}
            </span>
          </Link>
        ))}
        {/* Testimonials */}
        <div className="flex items-center border-l border-border-dark">
          <Link
            href="/v2/testimonials"
            className="flex items-center justify-between gap-2 px-3 py-2.5 hover:bg-button-dark transition-colors group flex-1 min-w-0"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-primary-dark shrink-0">
                <Quote className="w-3 h-3" />
              </span>
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-dark truncate">
                Testimonials
              </span>
              <span className="text-[10px] font-mono text-muted-dark/70">({testimonialsCount})</span>
              <span className="text-[9px] font-mono text-emerald-400 hidden lg:block">
                {testimonialsLiveCount} live
              </span>
              <span className="text-[9px] font-mono text-muted-dark/70 hidden lg:block">
                {testimonialsDraftCount} draft
              </span>
            </div>
            <ArrowRight className="w-3 h-3 text-border-dark group-hover:text-primary-dark transition-colors shrink-0" />
          </Link>
          <button
            onClick={() => setTestimonialModalOpen(true)}
            className="shrink-0 px-3 py-2.5 border-l border-border-dark hover:bg-button-dark transition-colors text-muted-dark hover:text-primary-dark focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark"
            aria-label="Add testimonial"
            title="Add testimonial"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.footer>
  )
}
