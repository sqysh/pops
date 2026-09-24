import { CueBoxEvent, CueBoxEventInstance } from '@/app/types/cuebox.types'

export interface PerformanceView extends CueBoxEventInstance {
  /** A patron sees a performance only when the concert AND the performance
   *  are both visible. Either flag on its own tells you nothing useful. */
  onSite: boolean
  bookable: boolean
  past: boolean
}

export interface ConcertView {
  concert: CueBoxEvent
  showtimes: PerformanceView[]
  upcoming: PerformanceView[]
  problems: string[]
}

/**
 * Groups CueBox instances under their concert and works out what a patron can
 * actually see and book. `now` is nullable so the server can render without
 * reading a clock; until it is set, nothing counts as past.
 */
export const buildConcertViews = (
  concerts: CueBoxEvent[],
  instances: CueBoxEventInstance[],
  now: number | null
): ConcertView[] => {
  const byEvent = instances.reduce<Record<string, CueBoxEventInstance[]>>((acc, inst) => {
    if (!acc[inst.eventId]) acc[inst.eventId] = []
    acc[inst.eventId].push(inst)
    return acc
  }, {})

  Object.values(byEvent).forEach((list) => list.sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()))

  return concerts.map((concert) => {
    const showtimes: PerformanceView[] = (byEvent[concert.id] ?? []).map((inst) => {
      const onSite = concert.isVisibleOnline && inst.isVisibleOnline
      return {
        ...inst,
        onSite,
        bookable: onSite && (inst.status === 'ON_SALE' || inst.status === 'PRESALE'),
        past: now !== null && new Date(inst.startsAt).getTime() < now
      }
    })

    const upcoming = showtimes.filter((inst) => !inst.past)

    const problems: string[] = []
    if (showtimes.length === 0) {
      problems.push('No performances scheduled in CueBox')
    } else if (concert.isVisibleOnline && upcoming.length > 0 && !upcoming.some((inst) => inst.bookable)) {
      problems.push('Showing on the website, but no upcoming performance can be booked')
    }

    return { concert, showtimes, upcoming, problems }
  })
}

/** The soonest performance a patron could buy a ticket for right now. */
export const nextBookable = (views: ConcertView[]) =>
  views
    .flatMap((view) => view.upcoming.filter((inst) => inst.bookable).map((inst) => ({ inst, view })))
    .sort((a, b) => new Date(a.inst.startsAt).getTime() - new Date(b.inst.startsAt).getTime())[0]

/**
 * The clock is an external system, so read it through useSyncExternalStore
 * rather than during render or from an effect. The server snapshot is null,
 * which the client replaces at hydration. Cached so the snapshot is stable,
 * and it does not tick: a dashboard left open should not reclassify rows
 * while someone is reading it.
 */
export const subscribeToNothing = () => () => {}
let clientNow: number | null = null
export const readClientNow = () => (clientNow ??= Date.now())
export const readServerNow = () => null
