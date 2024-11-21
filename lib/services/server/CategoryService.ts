import { CategoryRepository } from '@/lib/repositories/CategoryRepository'
import type { Category } from '@/types/xtream'

export class CategoryService {
  static async getCategories(serverId: number): Promise<Category[]> {
    return await CategoryRepository.getAll(serverId)
  }

  static async saveCategories(categories: Category[], serverId: number): Promise<void> {
    await CategoryRepository.saveBatch(categories, serverId)
  }
}