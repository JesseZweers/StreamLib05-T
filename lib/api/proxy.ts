import { ALLOWED_HOSTS } from '@/lib/config/constants'

interface ProxyOptions {
  headers?: HeadersInit
}

export class ProxyAPI {
  private static validateUrl(url: string): URL {
    try {
      const parsedUrl = new URL(url)
      if (!ALLOWED_HOSTS.includes(parsedUrl.hostname)) {
        throw new Error(`Invalid host: ${parsedUrl.hostname}`)
      }
      return parsedUrl
    } catch (error) {
      throw new Error(`Invalid URL: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  static async fetch<T>(url: string, options: ProxyOptions = {}): Promise<T> {
    const validatedUrl = this.validateUrl(url)
    
    const response = await fetch(validatedUrl.toString(), {
      headers: {
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        ...options.headers
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const contentType = response.headers.get('Content-Type')
    if (contentType?.includes('application/json')) {
      return response.json()
    }

    throw new Error(`Unsupported content type: ${contentType}`)
  }

  static async stream(url: string, options: ProxyOptions = {}): Promise<Response> {
    const validatedUrl = this.validateUrl(url)
    
    return fetch(validatedUrl.toString(), {
      headers: {
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        ...options.headers
      }
    })
  }
}