export const roleColor = (role: string) => {
  switch (role) {
    case 'CONDUCTOR':
      return 'text-violet-400 border-violet-400/30 bg-violet-400/5'
    case 'ADMIN':
      return 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5'
    default:
      return 'text-muted-dark border-border-dark'
  }
}

export const formatRole = (role: string) => {
  switch (role) {
    case 'CONDUCTOR':
      return 'Conductor'
    case 'ADMIN':
      return 'Admin'
    default:
      return role
  }
}
