import { redirect } from 'next/navigation'
import AdminLayoutClient from './AdminLayoutClient'
import { auth } from '@/app/lib/auth'
import { requireStaffPage } from '@/app/lib/auth/guards'

export default async function AdminLayoutPage({ children }: { children: React.ReactNode }) {
  // confirms the account still exists and still has a staff role, not just that a sign-in is on file
  await requireStaffPage()

  const session = await auth()
  if (!session?.user) redirect('/login')

  return <AdminLayoutClient user={session.user}>{children}</AdminLayoutClient>
}
