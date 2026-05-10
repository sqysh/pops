export const levelColor = (level: string) => {
  switch (level.toUpperCase()) {
    case 'SEASON_SPONSOR':
      return 'text-yellow-300 border-yellow-300/30 bg-yellow-300/5'
    case 'CONCERT_SPONSOR':
      return 'text-amber-400 border-amber-400/30 bg-amber-400/5'
    case 'GUEST_ARTIST_SPONSOR':
      return 'text-violet-400 border-violet-400/30 bg-violet-400/5'
    case 'PRINCIPAL_SPONSOR':
      return 'text-sky-400 border-sky-400/30 bg-sky-400/5'
    case 'MEDIA_SPONSOR':
      return 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5'
    case 'PARTNER':
      return 'text-muted-dark border-border-dark bg-border-dark/20'
    default:
      return 'text-muted-dark border-border-dark bg-border-dark/20'
  }
}

export const formatLevel = (level: string) => {
  switch (level.toUpperCase()) {
    case 'SEASON_SPONSOR':
      return 'Season'
    case 'CONCERT_SPONSOR':
      return 'Concert'
    case 'GUEST_ARTIST_SPONSOR':
      return 'Guest Artist'
    case 'PRINCIPAL_SPONSOR':
      return 'Principal'
    case 'MEDIA_SPONSOR':
      return 'Media'
    case 'PARTNER':
      return 'Partner'
    default:
      return level
  }
}
