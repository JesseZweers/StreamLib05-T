import { BaseRepository } from './BaseRepository'
import { Category } from '@/types/xtream'

export class CategoryRepository extends BaseRepository {
  static async getAll(serverId: number): Promise<Category[]> {
    return await this.query<Category[]>(
      `SELECT 
        category_id,
        name as category_name,
        parent_id
      FROM categories 
      WHERE server_id = ?
      ORDER BY name ASC`,
      [serverId]
    )
  }

  static async saveBatch(categories: Category[], serverId: number): Promise<void> {
    const BATCH_SIZE = 250
    for (let i = 0; i < categories.length; i += BATCH_SIZE) {
      const batch = categories.slice(i, i + BATCH_SIZE)
      const placeholders = batch.map(() => '(?, ?, ?, ?)').join(',')
      const values = batch.flatMap(category => [
        category.category_id,
        category.category_name.replace(/['"]/g, ''),
        category.parent_id || null,
        serverId
      ])

      await this.query(
        `INSERT INTO categories (category_id, name, parent_id, server_id)
         VALUES ${placeholders}
         ON DUPLICATE KEY UPDATE 
         name = VALUES(name),
         parent_id = VALUES(parent_id)`,
        values
      )
    }
  }
}