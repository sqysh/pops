import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'

export function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ redirectTo: '/login' })}
      className="text-muted-dark hover:text-red-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark"
      aria-label="Sign out"
      title="Sign out"
    >
      <LogOut className="w-3.5 h-3.5" />
    </button>
  )
}
