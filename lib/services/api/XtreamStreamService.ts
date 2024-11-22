import { XtreamAuthService } from './XtreamAuthService'

export class XtreamStreamService {
  static getStreamUrl(url: string, username: string, password: string, streamId: number): string {
    const baseUrl = XtreamAuthService.normalizeUrl(url)
    return `${baseUrl}/live/${username}/${password}/${streamId}.m3u8`
  }
}