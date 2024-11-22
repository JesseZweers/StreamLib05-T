import { cookies } from 'next/headers'
import { CredentialsRepository } from '@/lib/repositories/CredentialsRepository'
import { ServerRepository } from '@/lib/repositories/ServerRepository'
import { XtreamAuthService } from '@/lib/services/api/XtreamAuthService'
import { AUTH_COOKIE_OPTIONS } from '@/lib/config/api'
import type { AuthResponse, XtreamCredentials } from '@/types/xtream'

export class AuthService {
  static async login(credentials: XtreamCredentials) {
    const baseUrl = XtreamAuthService.normalizeUrl(credentials.url)
    
    // First check if server exists with valid data
    const existingServer = await ServerRepository.getByUrl(baseUrl)
    if (existingServer) {
      const storedCredentials = await CredentialsRepository.findCredentials(
        credentials.username,
        credentials.password,
        existingServer.id
      )

      if (storedCredentials) {
        // Verify data integrity
        const hasValidData = existingServer.categoryCount > 0 && existingServer.channelCount > 0
        
        if (hasValidData) {
          // Set auth cookie and return early - no need to re-verify with API
          cookies().set('auth', JSON.stringify({
            serverId: existingServer.id,
            url: baseUrl,
            username: credentials.username
          }), AUTH_COOKIE_OPTIONS)

          return {
            serverId: existingServer.id,
            isSetup: true,
            needsSetup: false
          }
        }
        // If data is incomplete, continue to API verification and setup
      }
    }

    // Verify with Xtream API for new or incomplete servers
    const authResponse = await XtreamAuthService.authenticate(
      baseUrl,
      credentials.username,
      credentials.password
    )

    if (!authResponse.user_info?.auth) {
      throw new Error('Invalid credentials')
    }

    // Store new auth data
    const serverId = await ServerRepository.createOrUpdate(baseUrl)
    await CredentialsRepository.save(
      credentials.username,
      credentials.password,
      serverId
    )

    // Set auth cookie
    cookies().set('auth', JSON.stringify({
      serverId,
      url: baseUrl,
      username: credentials.username
    }), AUTH_COOKIE_OPTIONS)

    // New or incomplete server always needs setup
    return {
      serverId,
      isSetup: false,
      needsSetup: true
    }
  }

  static async verify(credentials: XtreamCredentials) {
    try {
      const baseUrl = XtreamAuthService.normalizeUrl(credentials.url)
      
      // Check existing server first
      const server = await ServerRepository.getByUrl(baseUrl)
      if (server) {
        const storedCredentials = await CredentialsRepository.findCredentials(
          credentials.username,
          credentials.password,
          server.id
        )

        if (storedCredentials) {
          const hasValidData = server.categoryCount > 0 && server.channelCount > 0
          return {
            isValid: true,
            serverId: server.id,
            isSetup: hasValidData,
            needsSetup: !hasValidData
          }
        }
      }

      // Verify with API for new servers
      const authResponse = await XtreamAuthService.authenticate(
        baseUrl,
        credentials.username,
        credentials.password
      )

      return {
        isValid: !!authResponse.user_info?.auth,
        needsSetup: true
      }
    } catch (error) {
      console.error('Verification failed:', error)
      return { isValid: false }
    }
  }

  static async logout() {
    const session = await this.getSession()
    if (session) {
      await CredentialsRepository.clearSession(session.serverId, session.username)
    }
    cookies().delete('auth')
  }

  static async getSession() {
    const authCookie = cookies().get('auth')
    if (!authCookie?.value) return null

    try {
      return JSON.parse(authCookie.value)
    } catch {
      return null
    }
  }
}