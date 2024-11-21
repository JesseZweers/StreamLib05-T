import { cookies } from 'next/headers'

export async function getServerSession() {
  const cookieStore = cookies()
  const authCookie = cookieStore.get('auth')
  
  if (!authCookie?.value) {
    return null
  }

  try {
    return JSON.parse(authCookie.value)
  } catch {
    return null
  }
}

export async function getCurrentUser() {
  const session = await getServerSession()
  if (!session) return null

  return {
    serverId: session.serverId,
    url: session.url,
    username: session.username
  }
}