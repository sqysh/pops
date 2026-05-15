'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { TeamMember } from '@prisma/client'
import Picture from '../common/Picture'

interface Props {
  member: TeamMember
  allMembers: TeamMember[]
  currentIndex: number
  role: string
}

export default function TeamMemberClient({ member, allMembers, currentIndex, role }: Props) {
  const router = useRouter()

  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < allMembers.length - 1

  const goToPrev = () => hasPrev && router.push(`/${role}/${allMembers[currentIndex - 1].id}`)
  const goToNext = () => hasNext && router.push(`/${role}/${allMembers[currentIndex + 1].id}`)

  const bioItems = member.bio?.split('|').filter(Boolean) ?? []
  const fullName = `${member.firstName} ${member.lastName}`

  const media = member.videoUrl ? (
    <video src={member.videoUrl} autoPlay muted loop playsInline className="object-cover w-full h-full" />
  ) : member.imageUrl ? (
    <Picture
      src={member.imageUrl}
      priority
      className="object-cover w-full h-full"
      alt={fullName}
      width={600}
      height={800}
    />
  ) : (
    <div className="w-full h-full bg-white/5 flex items-center justify-center">
      <span className="text-5xl font-changa text-white/40">
        {member.firstName[0]}
        {member.lastName[0]}
      </span>
    </div>
  )

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3 max-w-6xl mx-auto">
          <button
            onClick={goToPrev}
            disabled={!hasPrev}
            className={`p-1.5 transition-colors ${hasPrev ? 'text-white/60 hover:text-blaze-text' : 'text-white/10 cursor-not-allowed'}`}
            aria-label="Previous member"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="text-white/50 text-[11px] font-mono tracking-widest">
            {currentIndex + 1} / {allMembers.length}
          </div>

          <button
            onClick={goToNext}
            disabled={!hasNext}
            className={`p-1.5 transition-colors ${hasNext ? 'text-white/60 hover:text-blaze-text' : 'text-white/10 cursor-not-allowed'}`}
            aria-label="Next member"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="pt-14 pb-20 px-4 max-w-5xl mx-auto min-h-screen flex flex-col justify-center">
        <div className="flex flex-col md:flex-row md:items-start md:gap-10 gap-6">
          {/* Media — short on mobile, fixed column on desktop */}
          <div className="md:w-56 md:shrink-0">
            <div className="relative overflow-hidden aspect-3/4 w-40 mx-auto md:w-full">{media}</div>
          </div>

          {/* Text */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="space-y-1">
              <h1 className="font-changa text-3xl 430:text-4xl text-white leading-tight">{fullName}</h1>
              {member.position && (
                <p className="text-[11px] font-mono tracking-[0.2em] uppercase text-blaze-text">{member.position}</p>
              )}
            </div>

            {/* Bio */}
            {bioItems.length > 0 ? (
              <ul className="space-y-2.5 list-none">
                {bioItems.map((part, i) => (
                  <li key={i} className="flex gap-3 text-white/60 leading-relaxed font-lato text-sm 430:text-base">
                    <span className="mt-[0.4em] size-1.5 rounded-full bg-blaze shrink-0" />
                    <span>{part.trim()}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-white/50 text-sm font-mono">Biography coming soon</p>
            )}

            {/* Back button */}
            <div className="pt-6 border-t border-white/5 mt-auto">
              <button
                onClick={() => router.push(`/${role}`)}
                className="text-[11px] font-mono tracking-[0.2em] uppercase text-white/60 hover:text-white transition-colors"
              >
                ← Back to Team
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer nav dots */}
      <nav className="fixed bottom-6 inset-x-0 flex justify-center" aria-label="Team member pagination">
        <ul className="flex items-center gap-1.5 bg-black/80 backdrop-blur-sm px-3 py-2 border border-white/5">
          {allMembers.map((m, i) => (
            <li key={m.id}>
              <button
                onClick={() => router.push(`/${role}/${m.id}`)}
                aria-label={`Go to ${m.firstName} ${m.lastName}`}
                aria-current={i === currentIndex ? 'true' : undefined}
                className={`w-1.5 h-1.5 transition-all ${i === currentIndex ? 'bg-blaze' : 'bg-white/10 hover:bg-white/20'}`}
              />
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
