import { BaseRepository } from './BaseRepository'
import { ServerInfo } from '@/types'

export class ServerRepository extends BaseRepository {
  static async getByUrl(url: string): Promise<ServerInfo | null> {
    const [result] = await this.query<[ServerInfo | null]>(
      `SELECT 
        s.id,
        s.url,
        (SELECT COUNT(*) FROM categories WHERE server_id = s.id) as categoryCount,
        (SELECT COUNT(*) FROM channels WHERE server_id = s.id) as channelCount,
        s.last_sync as lastSync
      FROM servers s
      WHERE s.url = ?`,
      [url]
    )
    return result
  }

  static async createOrUpdate(url: string): Promise<number> {
    await this.query(
      `INSERT INTO servers (url) 
       VALUES (?) 
       ON DUPLICATE KEY UPDATE 
       last_sync = CURRENT_TIMESTAMP`,
      [url]
    )

    const [server] = await this.query<[{ id: number }]>(
      'SELECT id FROM servers WHERE url = ?',
      [url]
    )

    if (!server) {
      throw new Error('Failed to create/update server')
    }

    return server.id
  }

  static async updateSyncTimestamp(serverId: number): Promise<void> {
    await this.query(
      'UPDATE servers SET last_sync = CURRENT_TIMESTAMP WHERE id = ?',
      [serverId]
    )
  }
}