import { redirect } from 'next/navigation'
import AdminLayoutClient from './AdminLayoutClient'
import { auth } from '@/app/lib/auth'

export default async function AdminLayoutPage({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  return <AdminLayoutClient user={session.user}>{children}</AdminLayoutClient>
}
