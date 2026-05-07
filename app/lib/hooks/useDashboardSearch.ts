'use client'

import { useState, useCallback } from 'react'
import { CUEBOX_ORG_ID } from '../constants/cueBox.constants'

export interface SearchResult {
  type: string
  label: string
  sub?: string
  href?: string
  target?: string
}

const CATEGORY_ALIASES: Record<string, string[]> = {
  concerts: ['concert', 'concerts', 'show', 'shows'],
  venues: ['venue', 'venues', 'location', 'locations'],
  team: ['team', 'staff', 'member', 'members', 'musician', 'musicians', 'board'],
  questions: ['question', 'questions', 'inquiry', 'inquiries', 'contact', 'message', 'messages'],
  users: ['user', 'users', 'admin', 'admins', 'conductor', 'super'],
  requests: ['request', 'requests', 'custom', 'change'],
  sponsors: ['sponsor', 'sponsors', 'sponsorship'],
  news: ['news', 'article', 'articles', 'post', 'posts', 'blog']
}

function matchesCategory(term: string, category: string): boolean {
  return CATEGORY_ALIASES[category]?.some((alias) => alias.includes(term) || term.includes(alias)) ?? false
}

export function useDashboardSearch(data: {
  concerts: any[]
  venues: any[]
  teamMembers: any[]
  questions: any[]
  users: any[]
  customRequests: any[]
  sponsors: any[]
  news: any[]
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])

  const search = useCallback(
    (q: string) => {
      setQuery(q)
      if (!q.trim()) {
        setResults([])
        return
      }
      const term = q.toLowerCase().trim()
      const hits: SearchResult[] = []

      const isConcerts = matchesCategory(term, 'concerts')
      const isVenues = matchesCategory(term, 'venues')
      const isTeam = matchesCategory(term, 'team')
      const isQuestions = matchesCategory(term, 'questions')
      const isUsers = matchesCategory(term, 'users')
      const isRequests = matchesCategory(term, 'requests')
      const isSponsors = matchesCategory(term, 'sponsors')
      const isNews = matchesCategory(term, 'news')

      const isCategory =
        isConcerts || isVenues || isTeam || isQuestions || isUsers || isRequests || isSponsors || isNews

      // Concerts
      if (isConcerts || !isCategory) {
        data.concerts.forEach((c) => {
          if (
            isConcerts ||
            c.name?.toLowerCase().includes(term) ||
            c.firstInstanceDatetime?.toLowerCase().includes(term)
          ) {
            hits.push({
              type: 'Concert',
              label: c.name,
              sub: c.status,
              href: `https://app.getcuebox.com/a/${CUEBOX_ORG_ID}/shows/${c.id}`,
              target: '_blank'
            })
          }
        })
      }

      // Venues
      if (isVenues || !isCategory) {
        data.venues.forEach((v) => {
          if (isVenues || v.name?.toLowerCase().includes(term) || v.address?.toLowerCase().includes(term)) {
            hits.push({ type: 'Venue', label: v.name, sub: v.address, href: `/v2/venues/${v.id}/edit` })
          }
        })
      }

      // Team
      if (isTeam || !isCategory) {
        data.teamMembers.forEach((t) => {
          if (
            isTeam ||
            `${t.firstName} ${t.lastName}`.toLowerCase().includes(term) ||
            t.role?.toLowerCase().includes(term)
          ) {
            hits.push({
              type: 'Team',
              label: `${t.firstName} ${t.lastName}`,
              sub: t.role,
              href: `/v2/team/${t.id}/edit`
            })
          }
        })
      }

      // Questions
      if (isQuestions || !isCategory) {
        data.questions.forEach((q) => {
          if (
            isQuestions ||
            q.name?.toLowerCase().includes(term) ||
            q.email?.toLowerCase().includes(term) ||
            q.message?.toLowerCase().includes(term)
          ) {
            hits.push({ type: 'Question', label: q.name, sub: q.email })
          }
        })
      }

      // Users — also filter by role keyword
      if (isUsers || !isCategory) {
        data.users.forEach((u) => {
          const fullName = `${u.firstName} ${u.lastName}`.toLowerCase()
          const roleMatch = u.role?.toLowerCase().includes(term)
          const nameMatch = fullName.includes(term) || u.email?.toLowerCase().includes(term)
          if (isUsers || roleMatch || nameMatch) {
            hits.push({
              type: 'User',
              label: `${u.firstName} ${u.lastName}`.trim() || u.email,
              sub: u.role,
              href: `/v2/users`
            })
          }
        })
      }

      // Requests
      if (isRequests || !isCategory) {
        data.customRequests.forEach((r) => {
          if (
            isRequests ||
            r.what?.toLowerCase().includes(term) ||
            r.page?.toLowerCase().includes(term) ||
            r.submittedBy?.toLowerCase().includes(term)
          ) {
            hits.push({ type: 'Request', label: r.what, sub: r.page })
          }
        })
      }

      // Sponsors
      if (isSponsors || !isCategory) {
        data.sponsors.forEach((s) => {
          if (isSponsors || s.name?.toLowerCase().includes(term) || s.level?.toLowerCase().includes(term)) {
            hits.push({ type: 'Sponsor', label: s.name, sub: `${s.level} · $${s.amount?.toLocaleString()}` })
          }
        })
      }

      // News
      if (isNews || !isCategory) {
        data.news.forEach((n) => {
          if (isNews || n.title?.toLowerCase().includes(term) || n.excerpt?.toLowerCase().includes(term)) {
            hits.push({
              type: 'News',
              label: n.title,
              sub: n.isPublished ? 'Published' : 'Draft',
              href: `/v2/news?title=${n.title}`
            })
          }
        })
      }

      setResults(hits.slice(0, 20))
    },
    [data]
  )

  const clear = useCallback(() => {
    setQuery('')
    setResults([])
  }, [])

  return { query, results, search, clear }
}
