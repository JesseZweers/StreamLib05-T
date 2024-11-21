import { redirect } from 'next/navigation'
import { FirstTimeSetup } from '@/components/first-time-setup'
import { getCurrentUser } from '@/lib/auth/auth'

export default async function SetupPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/')
  }

  return <FirstTimeSetup />
}