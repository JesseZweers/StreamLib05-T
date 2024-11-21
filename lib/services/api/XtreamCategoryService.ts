import type { Category } from '@/types/xtream'
import { API_USER_AGENT } from '@/lib/config/constants'

export class XtreamCategoryService {
  static async fetchFromApi(url: string): Promise<Category[]> {
    const response = await fetch(url, {
      headers: {
        'Accept': '*/*',
        'User-Agent': API_USER_AGENT
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories')
    }

    const data = await response.json()
    return Array.isArray(data) ? data : []
  }

  static async fetchCategories(url: string, username: string, password: string): Promise<Category[]> {
    const apiUrl = `${url}/player_api.php?username=${username}&password=${password}&action=get_live_categories`
    return this.fetchFromApi(apiUrl)
  }
}