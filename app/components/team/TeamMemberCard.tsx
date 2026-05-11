'use client'

import { motion } from 'framer-motion'
import type { TeamMember } from '@prisma/client'
import Picture from '../common/Picture'

interface Props {
  teamMember: TeamMember
  index: number
  onClick: () => void
}

export default function TeamMemberCard({ teamMember, index, onClick }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="relative aspect-4/5 overflow-hidden bg-white/5 mb-4">
        {teamMember.videoUrl ? (
          <video
            src={teamMember.videoUrl}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : teamMember.imageUrl ? (
          <Picture
            priority
            src={teamMember.imageUrl}
            alt={`${teamMember.firstName} ${teamMember.lastName}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            width={400}
            height={500}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl font-changa text-white/40">
              {teamMember.firstName[0]}
              {teamMember.lastName[0]}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
      </div>

      <div className="text-center">
        <h3 className="font-changa text-xl 430:text-2xl text-white group-hover:text-blaze-text transition-colors mb-1">
          {teamMember.firstName} {teamMember.lastName}
        </h3>
        {teamMember.position && (
          <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/60">{teamMember.position}</p>
        )}
      </div>
    </motion.article>
  )
}
