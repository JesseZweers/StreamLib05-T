import { redirect } from 'next/navigation'
import { LiveChannels } from '@/components/live-channels'
import { getCurrentUser } from '@/lib/auth/auth'
import { ServerRepository } from '@/lib/repositories/ServerRepository'

export default async function LivePage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/')
  }

  // Check if server is set up
  const server = await ServerRepository.getByUrl(user.url)
  if (!server || server.categoryCount === 0 || server.channelCount === 0) {
    redirect('/setup')
  }

  return <LiveChannels initialServerId={user.serverId} />
}