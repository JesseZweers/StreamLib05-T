"use client"

import { cookies } from 'next/headers'
import { CredentialsRepository } from '@/lib/repositories/CredentialsRepository'
import { ServerRepository } from '@/lib/repositories/ServerRepository'
import { XtreamAuthService } from '@/lib/services/api/XtreamAuthService'
import { AUTH_COOKIE_OPTIONS } from '@/lib/config/api'
import type { AuthResponse, XtreamCredentials } from '@/types/xtream'

export class AuthService {
  static async login(credentials: XtreamCredentials) {
    // Normalize URL
    const baseUrl = XtreamAuthService.normalizeUrl(credentials.url)
    
    // Verify credentials with Xtream API
    const authResponse = await XtreamAuthService.authenticate(
      baseUrl,
      credentials.username,
      credentials.password
    )

    if (!authResponse.user_info?.auth) {
      throw new Error('Invalid credentials')
    }

    // Store auth data
    const result = await this.storeAuthData(credentials, authResponse)

    // Set auth cookie
    cookies().set('auth', JSON.stringify({
      serverId: result.serverId,
      url: baseUrl,
      username: credentials.username
    }), AUTH_COOKIE_OPTIONS)

    return result
  }

  static async storeAuthData(credentials: XtreamCredentials, authData: AuthResponse) {
    if (!authData.user_info?.auth) {
      throw new Error('Invalid authentication data')
    }

    // Create or update server record
    const baseUrl = XtreamAuthService.normalizeUrl(credentials.url)
    const serverId = await ServerRepository.createOrUpdate(baseUrl)

    // Store credentials
    await CredentialsRepository.save(
      credentials.username,
      credentials.password,
      serverId
    )

    // Get server status
    const serverInfo = await ServerRepository.getByUrl(baseUrl)
    const isSetup = serverInfo ? serverInfo.categoryCount > 0 && serverInfo.channelCount > 0 : false

    return {
      serverId,
      isSetup
    }
  }

  static async logout() {
    const session = await this.getSession()
    if (session) {
      // Clear any server-side session data if needed
      await CredentialsRepository.clearSession(session.serverId, session.username)
    }
    cookies().delete('auth')
  }

  static async verify(credentials: XtreamCredentials) {
    const baseUrl = XtreamAuthService.normalizeUrl(credentials.url)
    
    // First check if server exists and has valid credentials
    const server = await ServerRepository.getByUrl(baseUrl)
    if (server) {
      const storedCredentials = await CredentialsRepository.findCredentials(
        credentials.username,
        credentials.password,
        server.id
      )

      if (storedCredentials) {
        return {
          isValid: true,
          serverId: server.id,
          isSetup: server.categoryCount > 0 && server.channelCount > 0
        }
      }
    }

    // If not found in database, verify with Xtream API
    try {
      const authResponse = await XtreamAuthService.authenticate(
        baseUrl,
        credentials.username,
        credentials.password
      )

      return {
        isValid: !!authResponse.user_info?.auth,
        needsSetup: true
      }
    } catch {
      return { isValid: false }
    }
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