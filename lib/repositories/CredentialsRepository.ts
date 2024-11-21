import { BaseRepository } from './BaseRepository'
import { StoredCredentials } from '@/types'

export class CredentialsRepository extends BaseRepository {
  static async save(username: string, password: string, serverId: number): Promise<void> {
    await this.query(
      `INSERT INTO credentials (username, password, server_id) 
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE 
       password = VALUES(password)`,
      [username, password, serverId]
    )
  }

  static async findCredentials(username: string, password: string, serverId: number): Promise<StoredCredentials | null> {
    const [credentials] = await this.query<[StoredCredentials | null]>(
      'SELECT * FROM credentials WHERE username = ? AND password = ? AND server_id = ?',
      [username, password, serverId]
    )
    return credentials
  }

  static async clearSession(serverId: number, username: string): Promise<void> {
    // Implement if you need to clear any session-related data
    // For example, you might want to update a last_logout timestamp
    await this.query(
      'UPDATE credentials SET updated_at = CURRENT_TIMESTAMP WHERE server_id = ? AND username = ?',
      [serverId, username]
    )
  }
}