import { getGreeting } from '@/app/utils/getGreeting'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { StatPill } from './StatPill'
import { useTypingText } from '@/app/lib/hooks/useTypingText'

interface GreetingAndStatsProps {
  concerts: any[]
  onSale: any[]
  venues: any[]
  pending: any[]
  teamMembers: any[]
  photosCount: number
  campApplicationsCount: number
  mailchimpCount: number
  eventsCount: number
  newsCount: number
  testimonialsCount: number
  sponsorsActiveCount: number
  date: string
}

const STATS = (p: GreetingAndStatsProps) => [
  { label: 'Concerts', value: p.concerts.length },
  { label: 'On Sale', value: p.onSale.length, accent: p.onSale.length > 0 },
  { label: 'Venues', value: p.venues.length },
  { label: 'Inquiries', value: p.pending.length, accent: p.pending.length > 0 },
  { label: 'Team', value: p.teamMembers.length },
  { label: 'Photos', value: p.photosCount },
  { label: 'Camp Apps', value: p.campApplicationsCount },
  { label: 'Mailchimp', value: p.mailchimpCount },
  { label: 'Events', value: p.eventsCount },
  { label: 'News', value: p.newsCount },
  { label: 'Testimonials', value: p.testimonialsCount },
  { label: 'Sponsors', value: p.sponsorsActiveCount }
]

// ── 4. Updated GreetingAndStats with typing + blinking cursor ─────────────────
export function GreetingAndStats(props: GreetingAndStatsProps) {
  const session = useSession()
  const firstName = session.data.user.name.split(' ')[0]
  const fullGreeting = `${getGreeting()}, ${firstName}.`
  const { displayed, done } = useTypingText(fullGreeting, 45, 400)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.05 }}
      className="shrink-0 border-b border-border-dark"
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <p className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-dark mb-0.5">{props.date}</p>
          <h1 className="font-quicksand font-black text-xl text-text-dark leading-none flex items-center gap-0.5">
            {displayed}
            {/* Blinking cursor — hides once typing is done */}
            <motion.span
              animate={{ opacity: done ? 0 : [1, 0, 1] }}
              transition={done ? { duration: 0 } : { repeat: Infinity, duration: 0.8 }}
              className="inline-block w-0.5 h-5 bg-primary-dark ml-0.5 translate-y-px"
              aria-hidden="true"
            />
          </h1>
        </div>
      </div>

      <div className="flex overflow-x-auto border-t border-border-dark">
        {STATS(props).map(({ label, value, accent }) => (
          <StatPill key={label} label={label} value={value} accent={accent} />
        ))}
      </div>
    </motion.div>
  )
}
