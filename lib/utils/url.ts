// Client-side URL utilities
export function getClientBaseUrl(): string {
  if (typeof window === 'undefined') {
    return 'http://localhost:3000'
  }
  return window.location.origin
}

// Server-side URL utilities
export async function getServerBaseUrl(): Promise<string> {
  // This should only be used in server components
  const { headers } = await import('next/headers')
  const headersList = headers()
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = headersList.get('x-forwarded-proto') || 'http'
  return `${protocol}://${host}`
}