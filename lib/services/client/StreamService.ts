"use client"

import { XtreamStreamService } from '@/lib/services/api/XtreamStreamService'
import { getStreamUrl } from '@/lib/utils/xtream'

export class StreamService {
  static getStreamUrl = getStreamUrl

  static async proxyStream(url: string): Promise<Response> {
    return XtreamStreamService.proxyStream(url)
  }

  static async proxyPlaylist(url: string): Promise<string> {
    return XtreamStreamService.proxyPlaylist(url)
  }
}