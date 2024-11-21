import { redirect } from 'next/navigation'
import { LiveChannels } from '@/components/live-channels'
import { getCurrentUser } from '@/lib/auth/auth'

export default async function LivePage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/')
  }

  return <LiveChannels initialServerId={user.serverId} />
}