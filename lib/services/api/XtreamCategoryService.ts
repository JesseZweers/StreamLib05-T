import { ProxyAPI } from '@/lib/api/proxy'
import { XtreamAuthService } from './XtreamAuthService'
import type { Category } from '@/types/xtream'

export class XtreamCategoryService {
  static async fetchCategories(url: string, username: string, password: string): Promise<Category[]> {
    try {
      const baseUrl = XtreamAuthService.normalizeUrl(url)
      const apiUrl = `${baseUrl}/player_api.php?username=${username}&password=${password}&action=get_live_categories`
      const categories = await ProxyAPI.fetch<Category[]>(apiUrl)
      return Array.isArray(categories) ? categories : []
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      throw error
    }
  }
}